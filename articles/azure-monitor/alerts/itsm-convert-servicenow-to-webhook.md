---
title: Convert ITSM actions that send events to ServiceNow to secure webhook actions
description: Learn how to convert ITSM actions that send events to ServiceNow to secure webhook actions.
ms.topic: conceptual
ms.date: 09/20/2022
ms.reviewer: nolavime
ms.author: abbyweisberg
author: AbbyMSFT

---

# Convert ITSM actions that send events to ServiceNow to secure webhook actions

> [!NOTE]
> As of September 2022, we are starting the 3-year process of deprecating support of using ITSM actions to send events to ServiceNow.

To migrate your ITSM connector to the new secure webhook integration, follow the [secure webhook configuration instructions](itsmc-secure-webhook-connections-servicenow.md).

If you're syncing work items between ServiceNow and an Azure Log Analytics workspace (bi-directional), follow the steps below to pull data from ServiceNow into your Log Analytics workspace.

## Pull data from your ServiceNow instance into a Log Analytics workspace

1.	In the Azure portal, [create a Consumption logic app workflow](../../logic-apps/quickstart-create-example-consumption-workflow.md).
1.	Create an HTTP GET request that uses the [ServiceNow **Table** API](https://developer.servicenow.com/dev.do#!/reference/api/sandiego/rest/c_TableAPI) to retrieve data from the ServiceNow instance. [See an example](https://docs.servicenow.com/bundle/sandiego-application-development/page/integrate/inbound-rest/concept/use-REST-API-Explorer.html#t_GetStartedRetrieveExisting) of how to use the Table call to retrieve incidents.
1.	To see a list of tables in your ServiceNow instance, in ServiceNow, go to **System definitions**, then **Tables**. Example table names include: `change_request`, `em_alert`, `incident`, `em_event`.

    :::image type="content" source="media/itsmc-convert-servicenow-to-webhook/alerts-itsmc-service-now-tables.png" alt-text="Screenshot of the Service Now tables.":::

1.	In Logic Apps, add a `Parse JSON` action on the results of the GET request you created in step 2.
1.	Add a schema for the retrieved payload. You can use the **Use sample payload to generate schema** feature. See a sample schema for a `change_request` table.

    :::image type="content" source="media/itsmc-convert-servicenow-to-webhook/alerts-itsmc-service-now-parse-json.png" alt-text="Screenshot of a sample schema.  ":::

1. Create a [Log Analytics workspace](../logs/quick-create-workspace.md#create-a-workspace).
1.	Create a `for each` loop to insert each row of the data returned from the API into the data in the Log Analytics workspace.
 -	In the **Select an output from previous steps** section, enter the data set returned by the JSON parse action you created in step 4.
 -	Construct each row from the set that enters the loop.
 -	In the last step of the loop, use `Send data` to send the data to the Log Analytics workspace with these values.
     - **Custom log name**: the name of the custom log you're using to save the data to the Log Analytics workspace. 
     - A connection to the LA workspace that you created in step 6.

    :::image type="content" source="media/itsmc-convert-servicenow-to-webhook/alerts-itsmc-service-now-for-loop.png" alt-text="Screenshot showing loop that imports data into a Log Analytics workspace.":::

The data is visible in the **Legacy custom logs** section of your Log Analytics workspace.

## Sample JSON schema for a change_request table

```json
{
    "properties": {
        "content": {
            "properties": {
                "result": {
                    "items": {
                        "properties": {
                            "active": {
                                "type": "string"
                            },
                            "activity_due": {
                                "type": "string"
                            },
                            "additional_assignee_list": {
                                "type": "string"
                            },
                            "approval": {
                                "type": "string"
                            },
                            "approval_history": {
                                "type": "string"
                            },
                            "approval_set": {
                                "type": "string"
                            },
                            "assigned_to": {
                                "properties": {
                                    "link": {
                                        "type": "string"
                                    },
                                    "value": {
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "assignment_group": {
                                "type": "string"
                            },
                            "backout_plan": {
                                "type": "string"
                            },
                            "business_duration": {
                                "type": "string"
                            },
                            "business_service": {
                                "type": "string"
                            },
                            "cab_date": {
                                "type": "string"
                            },
                            "cab_delegate": {
                                "type": "string"
                            },
                            "cab_recommendation": {
                                "type": "string"
                            },
                            "cab_required": {
                                "type": "string"
                            },
                            "calendar_duration": {
                                "type": "string"
                            },
                            "category": {
                                "type": "string"
                            },
                            "change_plan": {
                                "type": "string"
                            },
                            "chg_model": {
                                "type": "string"
                            },
                            "close_code": {
                                "type": "string"
                            },
                            "close_notes": {
                                "type": "string"
                            },
                            "closed_at": {
                                "type": "string"
                            },
                            "closed_by": {
                                "properties": {
                                    "link": {
                                        "type": "string"
                                    },
                                    "value": {
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "cmdb_ci": {
                                "properties": {
                                    "link": {
                                        "type": "string"
                                    },
                                    "value": {
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "comments": {
                                "type": "string"
                            },
                            "comments_and_work_notes": {
                                "type": "string"
                            },
                            "company": {
                                "type": "string"
                            },
                            "conflict_last_run": {
                                "type": "string"
                            },
                            "conflict_status": {
                                "type": "string"
                            },
                            "contact_type": {
                                "type": "string"
                            },
                            "correlation_display": {
                                "type": "string"
                            },
                            "correlation_id": {
                                "type": "string"
                            },
                            "delivery_plan": {
                                "type": "string"
                            },
                            "delivery_task": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "due_date": {
                                "type": "string"
                            },
                            "end_date": {
                                "type": "string"
                            },
                            "escalation": {
                                "type": "string"
                            },
                            "expected_start": {
                                "type": "string"
                            },
                            "follow_up": {
                                "type": "string"
                            },
                            "group_list": {
                                "type": "string"
                            },
                            "impact": {
                                "type": "string"
                            },
                            "implementation_plan": {
                                "type": "string"
                            },
                            "justification": {
                                "type": "string"
                            },
                            "knowledge": {
                                "type": "string"
                            },
                            "location": {
                                "type": "string"
                            },
                            "made_sla": {
                                "type": "string"
                            },
                            "number": {
                                "type": "string"
                            },
                            "on_hold": {
                                "type": "string"
                            },
                            "on_hold_reason": {
                                "type": "string"
                            },
                            "on_hold_task": {
                                "type": "string"
                            },
                            "opened_at": {
                                "type": "string"
                            },
                            "opened_by": {
                                "properties": {
                                    "link": {
                                        "type": "string"
                                    },
                                    "value": {
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "order": {
                                "type": "string"
                            },
                            "outside_maintenance_schedule": {
                                "type": "string"
                            },
                            "parent": {
                                "type": "string"
                            },
                            "phase": {
                                "type": "string"
                            },
                            "phase_state": {
                                "type": "string"
                            },
                            "priority": {
                                "type": "string"
                            },
                            "production_system": {
                                "type": "string"
                            },
                            "reason": {
                                "type": "string"
                            },
                            "reassignment_count": {
                                "type": "string"
                            },
                            "requested_by": {
                                "properties": {
                                    "link": {
                                        "type": "string"
                                    },
                                    "value": {
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "requested_by_date": {
                                "type": "string"
                            },
                            "review_comments": {
                                "type": "string"
                            },
                            "review_date": {
                                "type": "string"
                            },
                            "review_status": {
                                "type": "string"
                            },
                            "risk": {
                                "type": "string"
                            },
                            "risk_impact_analysis": {
                                "type": "string"
                            },
                            "route_reason": {
                                "type": "string"
                            },
                            "scope": {
                                "type": "string"
                            },
                            "service_offering": {
                                "type": "string"
                            },
                            "short_description": {
                                "type": "string"
                            },
                            "sla_due": {
                                "type": "string"
                            },
                            "start_date": {
                                "type": "string"
                            },
                            "state": {
                                "type": "string"
                            },
                            "std_change_producer_version": {
                                "type": "string"
                            },
                            "sys_class_name": {
                                "type": "string"
                            },
                            "sys_created_by": {
                                "type": "string"
                            },
                            "sys_created_on": {
                                "type": "string"
                            },
                            "sys_domain": {
                                "properties": {
                                    "link": {
                                        "type": "string"
                                    },
                                    "value": {
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "sys_domain_path": {
                                "type": "string"
                            },
                            "sys_id": {
                                "type": "string"
                            },
                            "sys_mod_count": {
                                "type": "string"
                            },
                            "sys_tags": {
                                "type": "string"
                            },
                            "sys_updated_by": {
                                "type": "string"
                            },
                            "sys_updated_on": {
                                "type": "string"
                            },
                            "task_effective_number": {
                                "type": "string"
                            },
                            "test_plan": {
                                "type": "string"
                            },
                            "time_worked": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            },
                            "unauthorized": {
                                "type": "string"
                            },
                            "universal_request": {
                                "type": "string"
                            },
                            "upon_approval": {
                                "type": "string"
                            },
                            "upon_reject": {
                                "type": "string"
                            },
                            "urgency": {
                                "type": "string"
                            },
                            "user_input": {
                                "type": "string"
                            },
                            "watch_list": {
                                "type": "string"
                            },
                            "work_end": {
                                "type": "string"
                            },
                            "work_notes": {
                                "type": "string"
                            },
                            "work_notes_list": {
                                "type": "string"
                            },
                            "work_start": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "parent",
                            "reason",
                            "watch_list",
                            "upon_reject",
                            "sys_updated_on",
                            "type",
                            "approval_history",
                            "number",
                            "test_plan",
                            "cab_delegate",
                            "requested_by_date",
                            "state",
                            "sys_created_by",
                            "knowledge",
                            "order",
                            "phase",
                            "cmdb_ci",
                            "delivery_plan",
                            "impact",
                            "active",
                            "work_notes_list",
                            "priority",
                            "sys_domain_path",
                            "cab_recommendation",
                            "production_system",
                            "review_date",
                            "business_duration",
                            "group_list",
                            "requested_by",
                            "change_plan",
                            "approval_set",
                            "implementation_plan",
                            "universal_request",
                            "end_date",
                            "short_description",
                            "correlation_display",
                            "delivery_task",
                            "work_start",
                            "additional_assignee_list",
                            "outside_maintenance_schedule",
                            "std_change_producer_version",
                            "service_offering",
                            "sys_class_name",
                            "closed_by",
                            "follow_up",
                            "reassignment_count",
                            "review_status",
                            "assigned_to",
                            "start_date",
                            "sla_due",
                            "comments_and_work_notes",
                            "escalation",
                            "upon_approval",
                            "correlation_id",
                            "made_sla",
                            "backout_plan",
                            "conflict_status",
                            "task_effective_number",
                            "sys_updated_by",
                            "opened_by",
                            "user_input",
                            "sys_created_on",
                            "on_hold_task",
                            "sys_domain",
                            "route_reason",
                            "closed_at",
                            "review_comments",
                            "business_service",
                            "time_worked",
                            "chg_model",
                            "expected_start",
                            "opened_at",
                            "work_end",
                            "phase_state",
                            "cab_date",
                            "work_notes",
                            "close_code",
                            "assignment_group",
                            "description",
                            "on_hold_reason",
                            "calendar_duration",
                            "close_notes",
                            "sys_id",
                            "contact_type",
                            "cab_required",
                            "urgency",
                            "scope",
                            "company",
                            "justification",
                            "activity_due",
                            "comments",
                            "approval",
                            "due_date",
                            "sys_mod_count",
                            "on_hold",
                            "sys_tags",
                            "conflict_last_run",
                            "unauthorized",
                            "location",
                            "risk",
                            "category",
                            "risk_impact_analysis"
                        ],
                        "type": "object"
                    },
                    "type": "array"
                }
            },
            "type": "object"
        },
        "schema": {
            "properties": {
                "properties": {
                    "properties": {
                        "result": {
                            "properties": {
                                "items": {
                                    "properties": {
                                        "properties": {
                                            "properties": {
                                                "active": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "activity_due": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "additional_assignee_list": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "approval": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "approval_history": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "approval_set": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "assigned_to": {
                                                    "properties": {
                                                        "properties": {
                                                            "properties": {
                                                                "link": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                },
                                                                "value": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                }
                                                            },
                                                            "type": "object"
                                                        },
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "assignment_group": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "backout_plan": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "business_duration": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "business_service": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "cab_date": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "cab_delegate": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "cab_recommendation": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "cab_required": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "calendar_duration": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "category": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "change_plan": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "chg_model": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "close_code": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "close_notes": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "closed_at": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "closed_by": {
                                                    "properties": {
                                                        "properties": {
                                                            "properties": {
                                                                "link": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                },
                                                                "value": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                }
                                                            },
                                                            "type": "object"
                                                        },
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "cmdb_ci": {
                                                    "properties": {
                                                        "properties": {
                                                            "properties": {
                                                                "link": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                },
                                                                "value": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                }
                                                            },
                                                            "type": "object"
                                                        },
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "comments": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "comments_and_work_notes": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "company": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "conflict_last_run": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "conflict_status": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "contact_type": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "correlation_display": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "correlation_id": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "delivery_plan": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "delivery_task": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "description": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "due_date": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "end_date": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "escalation": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "expected_start": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "follow_up": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "group_list": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "impact": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "implementation_plan": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "justification": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "knowledge": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "location": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "made_sla": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "number": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "on_hold": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "on_hold_reason": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "on_hold_task": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "opened_at": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "opened_by": {
                                                    "properties": {
                                                        "properties": {
                                                            "properties": {
                                                                "link": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                },
                                                                "value": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                }
                                                            },
                                                            "type": "object"
                                                        },
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "order": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "outside_maintenance_schedule": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "parent": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "phase": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "phase_state": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "priority": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "production_system": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "reason": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "reassignment_count": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "requested_by": {
                                                    "properties": {
                                                        "properties": {
                                                            "properties": {
                                                                "link": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                },
                                                                "value": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                }
                                                            },
                                                            "type": "object"
                                                        },
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "requested_by_date": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "review_comments": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "review_date": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "review_status": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "risk": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "risk_impact_analysis": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "route_reason": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "scope": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "service_offering": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "short_description": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sla_due": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "start_date": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "state": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "std_change_producer_version": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_class_name": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_created_by": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_created_on": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_domain": {
                                                    "properties": {
                                                        "properties": {
                                                            "properties": {
                                                                "link": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                },
                                                                "value": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "type": "string"
                                                                        }
                                                                    },
                                                                    "type": "object"
                                                                }
                                                            },
                                                            "type": "object"
                                                        },
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_domain_path": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_id": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_mod_count": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_tags": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_updated_by": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "sys_updated_on": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "task_effective_number": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "test_plan": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "time_worked": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "type": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "unauthorized": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "universal_request": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "upon_approval": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "upon_reject": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "urgency": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "user_input": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "watch_list": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "work_end": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "work_notes": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "work_notes_list": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "work_start": {
                                                    "properties": {
                                                        "type": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                }
                                            },
                                            "type": "object"
                                        },
                                        "required": {
                                            "items": {
                                                "type": "string"
                                            },
                                            "type": "array"
                                        },
                                        "type": {
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                },
                                "type": {
                                    "type": "string"
                                }
                            },
                            "type": "object"
                        }
                    },
                    "type": "object"
                },
                "type": {
                    "type": "string"
                }
            },
            "type": "object"
        }
    },
    "type": "object"
}

```

## Next steps

* [ITSM Connector overview](itsmc-overview.md)
* [Create ITSM work items from Azure alerts](./itsmc-definition.md#create-itsm-work-items-from-azure-alerts)
* [Troubleshooting problems in the ITSM Connector](./itsmc-resync-servicenow.md)
