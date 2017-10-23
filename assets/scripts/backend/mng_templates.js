$(function() {

	/****************
	 * PAGE MANAGER *
	 ****************/
	$.PageManager = function() {
	};

	$.PageManager.prototype = {

		init: function() {

			this._initGrid();
			this._initModals();
			this._initForms();
			this._initButtons();

			return this;

		},


		_initGrid: function() {

			this.grid = (new $.GridManager($("#grid-basic"))).init();

		},


		_initForms: function() {

			Form.validate("#form-create", {

				currentModal: createModal,
				nextModal: createModal,
				grid: this.grid,
				rules: {
					template_name: { required: true, maxlength: 128 },
					template_folder: { required: true, alpha_dash: true, maxlength: 32 }
				}


			});

			Form.validate("#form-modify", {

				currentModal: modifyModal,
				nextModal: modifyModal,
				grid: this.grid,
				rules: {
					template_name: { required: true, maxlength: 128 },
					template_folder: { required: true, alpha_dash: true, maxlength: 32 }
				}

			});

		},


		_initModals: function(initializedEditors) {

			createModal = new $.XirtModal($("#createModal")).init();
			modifyModal = new $.XirtModal($("#modifyModal")).init();

		},


		_initButtons: function() {

			// Activate creation button
			$(".btn-create").click(function(e) {
				createModal.show();
			});
			
			// Prevent submitting form on 'Enter'
			$("#position").keypress(function(e) {

				if (e.which == 13) {

					$("#btn-add-position").trigger("click");
					e.preventDefault();

				}

			});

			$("#btn-add-position").on("click", function() {

				var val = $("#position").val().replace(/[^a-zA-Z0-9_.]/g, "");
				PositionManager.addPosition(val);
				$("#positions").val("").focus();

			});

		}

	};


	/****************
	 * GRID MANAGER *
	 ****************/
	$.GridManager = function(element) {
		this.element = (element instanceof $) ? element : $(element);
	};

	$.GridManager.prototype = {

		init: function() {

			this.element.bootgrid({

				search: true,
				sorting: true,
				rowCount: [-1],
				ajax: true,
				url: "backend/templates/view",
				converters: {

					identifier: {
						to: function (value) { return Xirt.pad(value, 5, "0"); }
					}

				},
				formatters: {

					"ordering": function(column, row) {

						return XCMS.createButtons([

							{
								classNames : "command-order-down",
								data : { id : row.id },
								icon : "arrow-down",
							},

							{
								classNames : "command-order-up",
								data : { id : row.id },
								icon : "arrow-up",
							}

						]);

					},

					"published": function(column, row) {

						return XCMS.createButtons([

							{
								additionalAttributes : (row.published == 1) ? "disabled=\"disabled\"" : "",
								classNames : "command-published " + ((row.published == 1) ? "active" : "inactive"),
								data : { id : row.id },
								icon : "globe",
							}

						]);

					},

					"commands": function(column, row) {

						return XCMS.createButtons([

							{
								classNames : "command-edit",
								data : { id : row.id },
								icon : "pencil",
							},

							{
								additionalAttributes : (row.published == 1) ? "disabled=\"disabled\"" : "",
								classNames : "command-delete",
								data : { id : row.id },
								icon : "trash-o",
							}

						]);

					}

				}

			}).on("loaded.rs.jquery.bootgrid", $.proxy(this._onload, this));

			return this;

		},

		reload: function() {
			this.element.bootgrid("reload");
		},

		_onload: function() {

			this.element.find(".command-edit").on("click", this._modifyContentModal);
			this.element.find(".command-order-up").on("click", this._moveMenuUp);
			this.element.find(".command-order-down").on("click", this._moveMenuDown);
			this.element.find(".command-published").on("click", $.proxy(this._published, this));
			this.element.find(".command-delete").on("click", $.proxy(this._deleteItemModal, this));

		},

		_modifyContentModal: function() {

			modifyModal.load({

				url	: "backend/template/view/" + $(this).data("id"),
				onLoad	: function(json) {

					Xirt.populateForm($("#form-modify"), json, { prefix : "template_", converters: {
						id: function (value) { return Xirt.pad(value, 5, "0"); }
					}});

					PositionManager.empty();
					$.each(json.positions, function(i, val) {
						PositionManager.addPosition(val);
					});

				}

			});

		},

		_moveItemUp: function() {

			BootstrapDialog.show({

				message: "This functionality (move item down) is pending implementation.",
				buttons: [{

					label: "Close",
					action: function(dialog) {
						dialog.close();
					}

				}]

			});

			//var el = $(this);
			//$.get("backend/template/move_up/" + el.data("id"), function () {
			//	el.closest("tr").prev().before(el.closest("tr"));
			//});

		},

		_moveItemDown: function() {

			BootstrapDialog.show({

				message: "This functionality (move item up) is pending implementation.",
				buttons: [{

					label: "Close",
					action: function(dialog) {
						dialog.close();
					}

				}]

			});

			//var el = $(this);
			//$.get("backend/template/move_down/" + el.data("id"), function () {
			//	(el.closest("tr")).next().after(el.closest("tr"));
			//});

		},

		_togglePublished: function(e) {

			var that = $(this);
			$.get("backend/template/toggle_published/" + $(e.currentTarget).data("id"), function () {
				that.reload();
			});

		},

		_deleteItemModal: function(e) {

			var reference = $(e.currentTarget).data("id");
			if (jQuery.type(reference) != "undefined") {

				confirmRemoval(
					"backend/template/remove/" + reference,
					reference,
					this
				);

			}

		}

	};


	/***********
	 * TRIGGER *
	 **********/
	var createModal, modifyModal;
	(new $.PageManager()).init();

});


var PositionManager = {

	positions: [],

	addPosition: function(val) {

		if (val && $.inArray(val, PositionManager.positions) == -1) {

			var removeButton = $('<button type="button" class="btn btn-sm btn-danger">x</button>').click(PositionManager.removePosition);
			var item = $("<li class='list-group-item'>" + val + "</li>").data("pos", val);
			$("#positions_gui").append(item.append(removeButton));
			PositionManager.positions.push(val);

			$("#positions_list").val(PositionManager.positions);

		}

	},

	removePosition: function(e) {

		PositionManager.positions.splice($.inArray($(this).parent().data("pos"), PositionManager.positions), 1);
		$("#positions_list").val(PositionManager.positions);
		$(this).parent().remove();

	},

	empty: function() {

		PositionManager.positions = [];
		$("#positions_list").val("");
		$("#positions_gui").empty();

	}

};