<h1>Dashboard</h1>

<div class="row">

	<div class="col-md-2">

		<div class="card">

			<div class="card-img-top">
				<?php echo $cacheSize; ?>
			</div>

			<div class="card-body">

				<h4 class="card-title">Cache Usage</h4>
				<p class="card-text">Caching improves your applications' performance, but does take up space. Flushing the cache might free up space or fix caching.</p>
				<!-- <a href="#" class="btn btn-primary">Flush</a> //-->

			</div>

		</div>

	</div>

	<div class="col-md-2">

		<div class="card">

			<div class="card-img-top">
				<?php echo $logSize; ?>
			</div>

			<div class="card-body">

				<h4 class="card-title">Log Usage</h4>
				<p class="card-text">Logs provide insights on (malfunctioning) functionality of your application. You can browse the logs or remove them to free up space.</p>
				<button class="btn btn-primary btn-view-logs">View</button>
				<!-- <a href="#" class="btn btn-primary">Flush</a> //-->

			</div>

		</div>

	</div>

</div>

<div id="logPanel" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">

	<div class="modal-dialog" role="document">

		<div class="modal-content">

			<div class="modal-header">

				<h5 class="modal-title">View logs</h5>

			</div>

			<div class="modal-body">

				<div id="logBoard"></div>

			</div>

			<div class="modal-footer">

				<button type="button" class="btn btn-sm btn-primary btn-close">Close</button>

			</div>

		</div>

	</div>

</div>