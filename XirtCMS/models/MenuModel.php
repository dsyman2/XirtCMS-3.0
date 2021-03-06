<?php

/**
 * Base model for retrieving single XirtCMS menu
 *
 * @author      A.G. Gideonse
 * @version     3.0
 * @copyright   XirtCMS 2016 - 2017
 * @package     XirtCMS
 */
class MenuModel extends XCMS_Model {

    /**
     * Attribute array for this model (valid attributes)
     * @var array
     */
    protected $_attr = array(
        "id", "name", "ordering", "sitemap"
    );


    /**
     * Loads the requested menu
     *
     * @param   int         $id             The id of the menu to load
     * @return  mixed                       This instance on success, null otherwise
     */
    public function load($id) {

        // Retrieve data from DB
        $result = $this->_buildQuery($id)->get(XCMS_Tables::TABLE_MENUS);
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
     * @return   Object                     Always this instance
     */
    public function save() {

        $this->get("id") ? $this->_update() : $this->_create();
        return $this;

    }


    /**
     * Removes the instance from the DB
     *
     * @return  Object                      Always this instance
     */
    public function remove() {

        $this->db->delete(XCMS_Tables::TABLE_MENUS, array(
            "id" => $this->get("id")
        ));

        // Correct ordering
        $this->db->set("ordering", "ordering - 1", false);
        $this->db->where("ordering >", $this->get("ordering"));
        $this->db->update(XCMS_Tables::TABLE_MENUS);

        return $this;

    }


    /**
     * Saves the instance in the DB as a new item (create)
     */
    private function _create() {

        // Determine ordering...
        $this->db->select_max("ordering");
        $result = $this->db->get(XCMS_Tables::TABLE_MENUS)->row();
        $this->set("ordering", $result->ordering + 1);

        // Create item
        $this->db->insert(XCMS_Tables::TABLE_MENUS, $this->getArray());

    }


    /**
     * Saves the instance in the DB as a existing item (update)
     */
    private function _update() {
        $this->db->replace(XCMS_Tables::TABLE_MENUS, $this->getArray());
    }


    /**
     * Creates query (using CI QueryBuilder) for retrieving model content (menu)
     *
     * @param   int         $id             The id of the menu to load
     * @return  Object                      CI Database Instance for chaining purposes
     */
    protected function _buildQuery($id) {

        $this->db->where("id", intval($id));

        // Hook for customized filtering
        XCMS_Hooks::execute("menu.build_query", array(
            &$this, &$this->db, $id
        ));

        return $this->db;

    }

}
?>