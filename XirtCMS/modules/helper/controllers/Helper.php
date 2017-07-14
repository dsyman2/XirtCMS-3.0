<?php

/**
 * Controller for showing a single XirtCMS article
 *
 * @author      A.G. Gideonse
 * @version     3.0
 * @copyright   XirtCMS 2016 - 2017
 * @package     XirtCMS
 */
class Helper extends XCMS_Controller {

    /**
     * CONSTRUCTOR
     * Instantiates controller with required helpers, libraries and models
     */
    public function __construct() {
        
        parent::__construct();
        
        // Load helpers
        $this->load->helper("image");
        
    }

    /**
     * Placeholder for invalid requests
     */
    public function index() {
        return show_404();
    }


    /**
     * Attempts to create requested thumbnail
     *
     * @param   int         $sizeX          The width of the thumbnail in pixels
     * @param   int         $sizeY          The height of the thumbnail in pixels
     */
    public function thumbnail($sizeX = 0, $sizeY = 0) {

        // Check given source file
        if (!($src = $this->input->get("src")) || !file_exists($src)) {
            
            log_message("info", "[XCMS] Failed load image '{$src}' for thumbnail creation.");
            return show_404();
            
        }

        // Retrieve thumbnail
        $helper = new ImageHelper();
        if ($thumb = $helper->getThumbnail($src, array("width"  => $sizeX, "height" => $sizeY))) {

            // Output thumbnail
            XCMS_Config::set("USE_TEMPLATE", "FALSE");
            $this->output->set_content_type(mime_content_type($thumb));
            $this->output->set_output(file_get_contents($thumb));
            return;
        
        }
        
        return show_404();
            
    }

}
?>