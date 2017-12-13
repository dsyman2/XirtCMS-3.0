(function($) {

	$.XirtGrid = function(element, options) {

		// Identify containers
		this.element = $(element);

		this.pagination = $(document.createElement("nav"))
			.addClass("xgrid-pagination")
			.insertAfter(this.element);

		this.options = $.extend(true, {

			sortable: true,
			searchable: true,
			rowCount: [10, 20, 50, -1],
			defaultRowCount: +($(window).height() > 1100),
			url: "index.php",
			converters: {},
			formatters: {}

		}, options);

		this.identifier	= null;
		this.columns	= [];
		this.current	= 1;
		this.filter	= "";
		this.ordering	= {};
		this.rowCount	= ($.isArray(this.options.rowCount)) ? this.options.rowCount[this.options.defaultRowCount] : this.options.rowCount;

	};

	$.XirtGrid.prototype = {

		init: function() {

			this._initialize();
			this._renderToolbar();
			this._renderTable();
			this._wrapTable();

			return this;

		},

		_initialize: function() {

			var that = this;
			var primaryHeader = this._getHeaderContainer();

			$.each(primaryHeader.children(), function() {

				var $this = $(this);
				var data = $this.data();


				var column = {

					id		: data.columnId,
					identifier	: that.identifier == null && data.identifier || false,
					text		: $this.text(),
					bodyClasses	: data.cssClass || "",
					headerClasses	: data.headerCssClass || "",
					formatter	: that.options.formatters[data.columnId] ? true : false,
					order		: (that.options.sortable && (data.order === "asc" || data.order === "desc")) ? data.order : null,
					sortable	: !(data.sortable === false),
					visible		: that._checkColumnVisibility(data.visible),
					hidable		: !(data.visibleInSelection === false),

				};

				// Make sure there is an identifier
				if (column.identifier || !that.identifier) {
					that.identifier = column.id;
				}

				if (column.order != null) {
					that.setOrdering(column.id, column.order);
				}

				that.columns.push(column);
				$this.remove();

			});

		},

		_getHeaderContainer: function() {
			return this.element.find("thead > tr").first();
		},

		_getBodyContainer: function() {
			return this.element.find("tbody");
		},

		_getFooterContainer: function() {
			return this.element.find("tfoot");
		},

		_renderTable: function() {

			var that = this;

			var primaryHeader = this._getHeaderContainer().empty();
			$.each(this.columns, function(key, column) {
				that._renderTableHeaderCell(primaryHeader, column);
			});

			that._updateTableFooter(primaryHeader.find("th").length);
			this.reload();

		},

		_renderToolbar: function() {

			var that = this;

			var toolbar = $(document.createElement("div"))
				.insertBefore(this.element)
				.addClass("xgrid-toolbar");

			var group = $(document.createElement("div"))
				.addClass("input-group")
				.appendTo(toolbar);

			$(document.createElement("span"))
				.addClass("icon fa input-group-addon fa-search")
				.appendTo(group);

			var search = $(document.createElement("input"))
				.addClass("search-field form-control form-control-sm")
				.attr("placeholder", "Search...")
				.attr("type", "text")
				.appendTo(group);

			var config = $(document.createElement("button"))
				.addClass("btn btn-primary btn-sm config")
				.appendTo(toolbar);

			$(document.createElement("span"))
				.addClass("fa fa-gears")
				.appendTo(config);

			search.on("keyup", function() {

				that.setFilter($(this).val());
				that.reload();

			});

			var modal = (new $.XirtGridModal(that)).init();
			config.on("click", function() {
				modal.show();
			});

		},

		_renderTableHeaderCell: function(row, options) {

			// Skip obsolete items
			if (options.visible) {

				var cell = $(document.createElement("th"))
					.addClass(options.headerClasses)
					.toggle(options.visible)
					.appendTo(row);

			}

			// Skip obsolete items
			if (!options.visible || !options.text.length) {
				return;
			}

			var button =$(document.createElement("button"))
				.addClass("column-header-anchor")
				.data("id", options.id)
				.attr("tabindex", -1)
				.text(options.text)
				.appendTo(cell);

			var arrow = $(document.createElement("span"))
				.addClass("icon fa")
				.appendTo(button);

			if (options.sortable) {

				 button.addClass("sortable");
				 if (this.ordering[options.id]) {
					 arrow.addClass("fa-sort-" + this.ordering[options.id]);
				 }

				 var that = this;
				 button.on("click", function(e) {
					 that._onSort(e);
				 });

			 }

		},

		_renderTableBody: function(data) {

			var that = this;

			var container = this._getBodyContainer().empty();
			$.each(data, function(row, record) {
				that._renderTableBodyRow(container, row, record);
			});

		},

		_renderTableBodyRow: function(container, rowID, data) {

			// Create container
			var row = $(document.createElement("tr"))
				.data("id", data["id"])
				.appendTo(container);

			// Create cols
			var that = this;
			$.each(this.columns, function(key, column) {
				that._renderTableBodyCell(row, column, data[column.id]);
			});

		},

		_renderTableBodyCell: function(row, options, value) {

			// Skip obsolete items
			if (!options.visible) {
				return;
			}

			// Create item
			var cell = $(document.createElement("td"))
				.addClass(options.bodyClasses)
				.appendTo(row)
				.text(value);

			// Optional formaters
			var id = options["id"];
			if (options.formatter && $.type(this.options.formatters[id]) === "function") {
				cell.html(this.options.formatters[id](row.data(this.identifier), value));
			}

		},

		_updateTableFooter: function(tableColumnCount) {

			var footerColumnCount = this._getFooterContainer().find("tr > td").length;
			if (footerColumnCount && footerColumnCount < tableColumnCount) {
				this._getFooterContainer().find("tr > td:last").attr("colspan", tableColumnCount - footerColumnCount + 1);
			}

		},

		_renderPagination: function(page, rowCount, total) {

			var that = this;

			var list = $(document.createElement("div"))
				.addClass("btn-group")
				.appendTo(this.pagination.empty());

			// Create button "previous"
			var prev = this._createPaginationItem("&laquo;", false, page == 1);
			prev.on("click", function() {
				that._onPageSwitch(page - 1);
			});

			// Create button "current"
			var current = this._createPaginationItem("page " + page + " of " + Math.ceil(total / rowCount), true, false);
			current.on("click", function() {
				that._onPageSwitch(page);
			});

			// Create button "next"
			var next = (this._createPaginationItem("&raquo;", false, (page >= (total / rowCount))));
			next.on("click", function() {
				that._onPageSwitch(page + 1);
			});

			list.append(prev, current, next);

		},

		_createPaginationItem: function(text, active, disabled) {

			var button = $(document.createElement("button"))
				.addClass(active ? "btn-primary" : "btn-light")
				.addClass("btn btn-sm")
				.html(text);

			if (disabled) {

				button
					.attr("disabled", "disabled")
					.attr("tabindex", -1);

			}

			return button;

		},

		_wrapTable: function() {

			$(document.createElement("div"))
				.addClass("table-container")
				.insertBefore(this.element)
				.append(this.element);

		},

		_onSort: function(e) {

			var $this = $(e.target);
			var column = $this.data("id");

			if ($.type(this.ordering[column]) !== "undefined") {
				this.setOrdering(column, (this.ordering[column] == "asc") ? "desc" : "asc");
			} else {
				this.setOrdering(column, "asc");
			}

			this._renderTable();

		},

		_onPageSwitch: function(page) {

			this.setPage(page);
			this._renderTable();

		},

		reload: function() {

			var that = this;

			$.ajax(this.options.url, {

				method: "POST",
				data : {
					sort: this.ordering,
					current: this.current,
					rowCount: this.rowCount,
					searchPhrase: this.filter
				},
				success : function(data) {

					that._renderTableBody(data.rows);
					that._renderPagination(data.current, data.rowCount, data.total);
					if ($.type(that.options.onComplete) === "function") {
						that.options.onComplete();
					}

				}

			});

		},

		setRowCount: function (count) {
			this.rowCount = count;
		},

		setPage: function (page) {
			this.current = page;
		},

		setOrdering: function (column, order) {

			var subject = {};
			subject[column] = order;
			this.ordering = subject;

		},

		setFilter: function (filter) {
			this.filter = filter;
		},

		setVisibility(column, visible) {

			$.each(this.columns, function(key, candidate) {
				if (candidate.id == column) {
					candidate.visible = visible;
				}
			});

		},

		isVisible: function(column) {

			var result = false;
			$.each(this.columns, function(key, candidate) {
				if (candidate.id == column && candidate.visible) {
					return (result = true);
				}
			});

			return result;

		},

		_checkColumnVisibility: function(value) {

			if (typeof value == 'number') {
				return !($(window).width() < value);
			}

			return !(value === false);
		}

	};


	$.XirtGridModal = function(grid) {

		this.$grid = grid;
		this.$element = new $.XirtModalObject({

			type: "primary",
			title: "Filter settings",
			message: null,
			buttons: [{
				id	: "ok",
				type	: "warning",
				label	: "Ok"

			},
			{
				id	: "close",
				type	: "default",
				label	: "Cancel"

			}]

		});

	};

	$.XirtGridModal.prototype = {

		init : function() {

			var that = this;

			this.$modal = (new $.XirtModal(this.$element)).init();
			var $modalBody = this.getModalBody().empty();
			this._renderColumnSelector($modalBody, this.$grid.columns);
			this._renderCountSelector($modalBody, this.$grid);

			// Activate modal button "ok"
			this.$element.find(".modal-footer .btn-ok").off("click").on("click", function() {

				that.$grid.setRowCount($modalBody.find("select").val());
				$.each($modalBody.find("a"), function() {
					that.$grid.setVisibility($(this).data("id"), $(this).hasClass("list-group-item-primary"));
				});

				that.hide();
				that.$grid._renderTable();

			});

			// Activate modal button "close"
			this.$element.find(".modal-footer .btn-close").off("click").on("click", function() {
				that.reset();
				that.hide();
			});

			return this;

		},

		show: function() {

			this.$modal.show();
			return this;

		},

		hide: function() {

			this.$modal.hide();
			return this;

		},

		getModalBody: function() {
			return this.$modal.element.find(".modal-body").first();
		},

		_renderColumnSelector: function(container, columns) {

			var elementContainer = ModalHelper.getFormElementContainer("toggle", "Column visiblity");
			var groupContainer = $(document.createElement("div")).addClass("list-group");
			$.each(columns, function(key, column) {

				if (!column.hidable) {
					return;
				}

				var item = $(document.createElement("a"))
					.addClass("list-group-item list-group-item-action")
					.addClass(column.visible ? "list-group-item-primary" : "")
					.data("id", column.id)
					.text(column.text)
					.appendTo(groupContainer);

				item.append($(document.createElement("button"))
					.addClass("btn btn-sm btn-primary")
					.attr("type", "button")
					.text(column.visible ? "hide" : "show"));

			});

			elementContainer.find(".input-container").append(groupContainer);
			container.append(elementContainer);

			// Activate visibility buttons
			container.find("button").on("click", function() {

				$(this).parent().toggleClass("list-group-item-primary");
				$(this).text($(this).parent().hasClass("list-group-item-primary") ? "hide" : "show");

			});

		},

		_renderCountSelector: function(container, $grid) {

			var elementContainer = ModalHelper.getFormElementContainer("count", "Rows per page");
			var groupContainer = $(document.createElement("select")).addClass("form-control");
			$.each($grid.options.rowCount, function(key, count) {

				var item = $(document.createElement("option"))
					.text(count < 0 ? "All" : count)
					.appendTo(groupContainer)
					.val(count);

			});

			elementContainer.find(".input-container").append(groupContainer.val($grid.rowCount));
			container.append(elementContainer);

		},

		reset: function() {

			var $that = this;

			// Reverting row count
			this.getModalBody().find("select").val(this.$grid.rowCount);

			// Reverting visibility
			$.each(this.getModalBody().find("button"), function() {

				var $button = $(this);

				// Revert unconfirmed hiding of column
				if ($button.parent().hasClass("list-group-item-primary") && !$that.$grid.isVisible($button.parent().data("id"))) {
					$button.trigger("click");
				}

				// Revert unconfirmed showing of column
				if (!$button.parent().hasClass("list-group-item-primary") && $that.$grid.isVisible($button.parent().data("id"))) {
					$button.trigger("click");
				}

			});

		}

	};


	$.fn.xgrid = function (options) {

		this.each(function(index) {

			var $this = $(this);

			var instance = $this.data("xgrid");
			if (instance && $.type(options) == "string") {

				instance[options].apply(instance);
				return;

			}

			$this.data("xgrid", (instance = new $.XirtGrid($this, options)).init());

		});

	};

}(jQuery));