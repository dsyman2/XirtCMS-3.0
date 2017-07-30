<h1>Articles</h1>

<table id="grid-basic" class="table table-condensed table-hover table-striped" data-toggle="bootgrid">
<thead>
	<tr>
		<th data-column-id="id" data-header-css-class="table-row-id" data-css-class="table-row-id" data-converter="identifier" data-order="asc">ID #</th>
		<th data-column-id="title" data-header-css-class="table-row-title" data-css-class="table-row-title">Title</th>
		<th data-column-id="dt_created" data-header-css-class="table-row-dt_created" data-css-class="table-row-dt_created">Created</th>
		<th data-column-id="author" data-header-css-class="table-row-author" data-css-class="table-row-author">Author</th>
		<th data-column-id="commands" data-header-css-class="table-row-commands" data-css-class="table-row-commands" data-formatter="commands" data-visible-in-selection="false" data-sortable="false">&nbsp;</th>
	</tr>
</thead>
</table>

<div id="createModal" class="modal fade bootstrap-dialog type-primary size-normal in" tabindex="-1" role="dialog" aria-hidden="true">

	<div class="modal-dialog" role="document">

		<form id="form-create" class="form-horizontal" action="backend/article/create" method="post" data-toggle="validator">

			<div class="modal-content">

				<div class="modal-header">

					<div class="bootstrap-dialog-header">

						<div class="bootstrap-dialog-title">Article Creation</div>

					</div>

				</div>
				<div class="modal-body">

					<div class="form-group">

						<label for="create_title" class="col-sm-4 control-label">Title</label>
						<div class="col-sm-7">
							<input type="text" class="form-control" id="create_title" name="article_title" placeholder="" required />
						</div>

					</div>

				</div>

				<div class="modal-footer">
					<button type='submit' class="btn btn-success" aria-hidden="true"><span class="fa fa-refresh fa-spin fa-1x fa-fw"></span>Create article</button>
					<button type='button'  class="btn btn-primary" id='createClose' aria-hidden="true">Close</button>
				</div>

			</div>

		</form>

	</div>

</div>


<div id="modifyModal" class="modal fade bootstrap-dialog type-primary size-normal in" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

	<div class="modal-dialog article" role="document">

		<form id="form-modify" class="form-horizontal" action="backend/article/modify" method="post" data-toggle="validator">

			<div class="modal-content">

				<div class="modal-header">

					<div class="bootstrap-dialog-header">

						<div class="bootstrap-dialog-title">Article Modification</div>

					</div>

				</div>
				<div class="modal-body">

					<div class="box-article-header">

							<input id="modify_title" name="article_title" class="form-control" />
					
					</div>

					<textarea id="articleArea" name="article_content" ></textarea>

				</div>

				<div class="modal-footer">

					<input type="hidden" class="form-control" name="article_id" />

					<button type='submit' class="btn btn-success" aria-hidden="true"><span class="fa fa-refresh fa-spin fa-1x fa-fw"></span>Save changes</button>
					<button type="button" class="btn btn-primary" id='articleClose' aria-hidden="true">Close</button>

				</div>

			</div>

		</form>

	</div>

</div>

<div id="categoriesModal" class="modal fade bootstrap-dialog type-primary size-normal in" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

	<div class="modal-dialog" role="document">

		<form id="form-categories" class="form-horizontal" action="backend/article/modify_categories" method="post" data-toggle="validator">

			<div class="modal-content">

				<div class="modal-header">

					<div class="bootstrap-dialog-header">

						<div class="bootstrap-dialog-title">Article Categories</div>

					</div>

				</div>
				<div class="modal-body">

					<div class="form-group">

						<label class="col-sm-4 control-label">ID #</label>
						<div class="col-sm-7">
							<input type="text" class="form-control" name="article_id" required disabled="disabled" />
						</div>

					</div>

					<div class="form-group">

						<label class="col-sm-4 control-label">Title</label>
						<div class="col-sm-7">
							<input type="text" class="form-control" name="article_title" disabled="disabled" />
						</div>

					</div>

					<div class="form-group">

							<label for="categorySelector" class="col-sm-4 control-label">Categories</label>
							<div class="col-sm-7">
								<select class="form-control" id="categorySelector" name="article_categories[]" multiple="multiple" size="10">

									<?php foreach ($categories as $category): ?>
									<option value="<?php echo $category->id; ?>"><?php echo $category->name; ?></option>
									<?php endforeach; ?>

								</select>
							</div>
							
					</div>

				</div>

				<div class="modal-footer">

					<button type='submit' class="btn btn-success" aria-hidden="true"><span class="fa fa-refresh fa-spin fa-1x fa-fw"></span>Save changes</button>
					<button type="button" class="btn btn-primary" id='categoriesClose' aria-hidden="true">Close</button>

				</div>

			</div>

		</form>

	</div>

</div>

<div id="configModal" class="modal fade bootstrap-dialog type-primary size-normal in" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

	<div class="modal-dialog" role="document">

		<form id="form-config" class="form-horizontal" action="backend/article/modify_config" method="post" data-toggle="validator">

			<div class="modal-content">

				<div class="modal-header">

					<div class="bootstrap-dialog-header">

						<div class="bootstrap-dialog-title">Article Configuration</div>

					</div>

				</div>
				<div class="modal-body">

					<div class="form-group">

						<label class="col-sm-4 control-label">ID #</label>
						<div class="col-sm-7">
							<input type="text" class="form-control" name="article_id" required disabled="disabled" />
						</div>

					</div>

					<div class="form-group">

						<label class="col-sm-4 control-label">Title</label>
						<div class="col-sm-7">
							<input type="text" class="form-control" name="article_title" disabled="disabled" />
						</div>

					</div>
					
					<div id="attrBox"></div>
					
				</div>

				<div class="modal-footer">

					<button type='submit' class="btn btn-success" aria-hidden="true"><span class="fa fa-refresh fa-spin fa-1x fa-fw"></span>Save changes</button>
					<button type="button" class="btn btn-primary" id='configClose' aria-hidden="true">Close</button>

				</div>

			</div>

		</form>

	</div>

</div>