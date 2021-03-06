<?php

/**
 * Back end extension of BaseModel for retrieving multiple XirtCMS users
 *
 * @author      A.G. Gideonse
 * @version     3.0
 * @copyright   XirtCMS 2016 - 2017
 * @package     XirtCMS
 */
class ExtUsersModel extends UsersModel {

    /**
     * Attribute array for this model (valid attributes)
     * @var array
     */
    protected $_attr = array("searchPhrase", "current", "rowCount", "sortColumn", "sortOrder");


    /**
     * Add hooks to influence parent behaviour
     */
    public function init() {

        // Hook for retrieval query
        XCMS_Hooks::reset("users.build_query");
        XCMS_Hooks::add("users.build_query", function($model, $stmt, $filterOnly) {

            if ($filter = trim($model->get("searchPhrase"))) {

                $stmt->or_like(array(
                    XCMS_Tables::TABLE_USERS . ".id"        => $filter,
                    XCMS_Tables::TABLE_USERS . ".username"  => $filter,
                    XCMS_Tables::TABLE_USERS . ".email"     => $filter,
                    XCMS_Tables::TABLE_USERS . ".real_name" => $filter,
                    XCMS_Tables::TABLE_USERGROUPS . ".name" => $filter
                ));

            }

            if (!$filterOnly) {

                if (($rowCount = $model->get("rowCount")) > 0) {
                    $stmt->limit($rowCount, ($model->get("current") - 1) * $rowCount);
                }

                $stmt->order_by($model->get("sortColumn"), $model->get("sortOrder"));

            }

        });

        return $this;

    }

}
?>