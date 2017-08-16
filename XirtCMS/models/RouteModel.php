<?php

/**
 * MenuitemModel for XirtCMS (single route)
 *
 * @author      A.G. Gideonse
 * @version     3.0
 * @copyright   XirtCMS 2016 - 2017
 * @package     XirtCMS
 */
class RouteModel extends XCMS_Model {

    /**
     * @var array
     * Attribute array for this model (valid attributes)
     */
    protected $_attr = array(
        "id", "source_url", "target_url", "menu_items", "module_config", "master"
    );


    /**
     * CONSTRUCTOR
     * Instantiates controller with required helpers, libraries and helpers
     */
    public function __construct() {

        parent::__construct();

        // Load helpers
        $this->load->helper("route");

    }


    /**
     * Loads the requested route
     *
     * @param   int         $id             The id of the route to load
     * @return  mixed                       This instance on success, null otherwise
     */
    public function load($id) {

        // Retrieve data
        // TODO :: Use _buildQuery
        $this->db->select("id, source_url, target_url, module_config, master, count(menuitem_id) as menu_items");
        $this->db->join(Query::TABLE_MENUITEMS_ROUTES, "route_id = id", "left");
        $this->db->group_by("id, source_url, target_url, module_config, master");
        $result = $this->db->get_where(Query::TABLE_ROUTES, array("id" => intval($id)));
        if ($result->num_rows()) {

            // Populate model
            $this->set($result->row());
            return $this;

        }

        return null;

    }


    /**
     * Saves the instance in the DB
     *
     * @return  Object                      Always this instance
     */
    public function save() {

        // Upsert into database...
        $this->db->replace(Query::TABLE_ROUTES, array(
            "id"            => $this->get("id"),
            "source_url"    => $this->get("source_url"),
            "target_url"    => $this->get("target_url"),
            "module_config" => $this->get("module_config"),
            "master"        => $this->get("master") ? $this->get("master") : NULL
        ));

        // ... and update item ID (for creations)
        $this->set("id", $this->db->insert_id());
        return $this;

    }


    /**
     * Removes the instance from the DB
     */
    public function remove() {

        // Remove route
        RouteHelper::removeRelation($this->get("id"));
        $this->db->delete(Query::TABLE_ROUTES,  array(
            "id" => $this->get("id")
        ));

    }

}
?>