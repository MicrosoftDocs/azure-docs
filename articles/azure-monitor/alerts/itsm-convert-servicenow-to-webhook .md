---
title: Convert ITSM actions that send events to ServiceNow to secure webhook actions
description: Learn how to ccnvert ITSM actions that send events to ServiceNow to secure webhook actions.
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

If you are syncing work items between ServiceNow and an Azure Log Analytics workspace (bi-directional), follow the steps below to pull data from ServiceNow into your Log Analytics workspace.

## Pull data from your ServiceNow instance into a Log Analytics workspace

1.	[Create a logic app](../../logic-apps/quickstart-create-first-logic-app-workflow.md) in the Azure portal.
1.	Create an HTTP GET request that uses the [ServiceNow **Table** API](https://developer.servicenow.com/dev.do#!/reference/api/sandiego/rest/c_TableAPI) to retrieve data from the ServiceNow instance. [See an example](https://docs.servicenow.com/bundle/sandiego-application-development/page/integrate/inbound-rest/concept/use-REST-API-Explorer.html#t_GetStartedRetrieveExisting) of how to use the Table call to retrieve incidents.
1.	To see a list of tables in your ServiceNow instance, in ServiceNow, go to **System definitions**, then **Tables**. Example table names include: `change_request`, `em_alert`, `incident`, `em_event`.

    :::image type="content" source="media/itsmc-convert-servicenow-to-webhook/alerts-itsmc-service-now-tables.png" alt-text="Screenshot of the Service Now tables.":::

1.	In Logic Apps, add a `Parse JSON` action on the results of the GET request you created in step 2.
1.	Add a schema for the retrieved payload. You can use the **Use sample payload to generate schema** feature. See a sample schema for a `change_request` table.

    :::image type="content" source="media/itsmc-convert-servicenow-to-webhook/alerts-itsmc-service-now-parse-json.png" alt-text="Screenshot of a sample schema.  ":::

1. Create a [Log Analytics workspace](../logs/quick-create-workspace.md#create-the-workspace).
1.	Create a `for each` loop to insert each row of the data returned from the API into the data in the Log Analytics workspace.
 -	In the **Select an output from previous steps** section, enter the data set returned by the JSON parse action you created in step 4.
 -	Construct each row from the set that enters the loop.
 -	In the last step of the loop, use `Send data` to send the data to the Log Analytics workspace with these values.
     - **Custom log name**: the name of the custom log you are using to save the data to the Log Analytics workspace. 
     - A connection to the LA workspace that you created in step 6.

    :::image type="content" source="media/itsmc-convert-servicenow-to-webhook/alerts-itsmc-service-now-for-loop.png" alt-text="Screenshot showing loop that imports data into a Log Analytics workspace.":::

The data is visible in the **Custom logs** section of your Log Analytics workspace.

## 

## Next steps

* [ITSM Connector overview](itsmc-overview.md)
* [Create ITSM work items from Azure alerts](./itsmc-definition.md#create-itsm-work-items-from-azure-alerts)
* [Troubleshooting problems in the ITSM Connector](./itsmc-resync-servicenow.md)
