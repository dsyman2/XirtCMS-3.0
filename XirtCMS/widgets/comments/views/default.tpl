
<!-- xComments [Start] //-->
<script src="assets/scripts/widgets/comments.js"></script>
<section class="x-widget-comments <?php echo $config->css_name; ?>">

	<h2>Responses (<?php print(count($comments)); ?>)</h2>

	<?php if (!count($comments)): ?>
	<div class="alert alert-info">
		<span class="">There are no responses to display. Be the first to react!</span>
	</div>
	<?php endif; ?>

	<div class="alert alert-danger alert-dismissable" id="errorBox" style="display: none;">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<span></span>
	</div>

	<?php foreach ($comments as $comment): ?>
	<div class="comment-box comment-level-<?php echo $comment->level; ?>">

		<div class="comment-details">

			<span class="creation-image">

				<?php if (isset($comment->avatar)): ?>
				<img src="<?php echo $comment->avatar; ?>" alt="<?php echo $comment->username; ?>">
				<?php endif; ?>

			</span>

			<span class="creation-author">

				<?php if ($comment->author_id > 0): ?>
				<a href="<?php echo $comment->author_id; ?>">
					<?php echo $comment->username; ?>
				</a>
				<?php else: ?>
					<?php echo $comment->username; ?>
				<?php endif; ?>

			</span>

			<br />

			<span class="creation-date"><?php echo $comment->dt_created; ?></span>

		</div>

		<p><?php echo $comment->content; ?></p>

		<?php if (!$config->authorization_required || $authenticated): ?>
			<br/>
			<a href="#" data-id="<?php echo $comment->id; ?>"  data-name="<?php echo $comment->username; ?>" class="react">Reply</a>
		<?php endif; ?>

	</div>
	<?php endforeach; ?>

	<button type="button" class="btn btn-primary btn-xs" id="commentButton">Respond in main thread</button>

	<?php if (!$config->authorization_required || $authenticated): ?>

		<form method="post" id="commentBox">

			<label for="comment_content">Leave response:</label>

			<?php if (!$authenticated): ?>

				<div class="form-group">

					<label for="comment_name" class="col-sm-4 control-label">Name</label>
					<div class="col-sm-7">
						<input type="text" id="comment_name" name="comment_name" value="" />
					</div>

				</div>

				<div class="form-group">

					<label for="comment_email" class="col-sm-4 control-label">E-mail Address (not shown)</label>
					<div class="col-sm-7">
						<input type="text" id="comment_email" name="comment_email" value="" />
					</div>

				</div>

				<?php if ($config->insert_honeypot): ?>

					<div class="form-group" id="commentWebsite">

						<label for="comment_website" class="col-sm-4 control-label">Fake website field (do not fill)</label>
						<div class="col-sm-7">
							<input type="text" id="comment_website" name="comment_website" value="" />
						</div>

					</div>

				<?php endif; ?>

			<?php endif; ?>

			<textarea id="comment_content" name="comment_content"></textarea>

			<input type="hidden" name="article_id" value="<?php echo $article_id; ?>" />
			<input type="hidden" name="parent_id" value="0" />

			<button type="submit" class="btn btn-primary btn-xs">Submit response</button>
			<button type="button" class="btn btn-default btn-xs" id="cancelButton">Cancel</button>

		</form>

	<?php endif; ?>

</section>
<!-- xComments [End] //-->