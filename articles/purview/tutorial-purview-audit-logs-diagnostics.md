---
title: Enable and Capture Azure Purview Audit Logs and time series activity history via Azure Diagnostics Event Hubs
description:  This tutorial lists step-by-step configuration on how to Enable and Capture Azure Purview Audit Logs and time series activity history via Azure Diagnostics Event Hubs.
author: abandyop
ms.author: arindamba
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 02/10/2022
---

# Azure Purview: Capture & Analyze Audit & Diagnostics Logs

This guide lists step-by-step configuration on how to enable and capture Azure Purview Audit & Diagnostics Logs via Azure Event Hubs. 

## Customer Intent

As an Azure Purview administrator or Azure Purview data source admin, I want to view and monitor audit and diagnostics logs captured from [Azure Purview](https://ms.web.purview.azure.com) including timestamped activity history on actions taken by every user on [Azure Purview portal](https://ms.web.purview.azure.com). To enable audit logging on Purview, there is an easy and clean technique to capture streaming audit events via Azure Diagnostics Event Hubs. Let's go through the step-by-step guide on how to configure this Diagnostics Audit logging on Azure Purview.

## Enable Azure Purview Audit & Diagnostics 

### Configure Azure EventHubs

1. Create an [Azure EventHubs Namespace and Azure EventHubs using Azure ARM Template (GitHubs)](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-capture). While this automated Azure ARM Template should one-click deploy and finish creating your EventHubs with the required configuration desirable for Purview Audit logging; follow these guides for more detailed step by step explanantions and manual setup: [Azure EventHubs: Use Azure Resource Manager Template to enable eventhub capture](../event-hubs/event-hubs-resource-manager-namespace-event-hub-enable-capture.md) and [Azure EventHubs: Enable capturing of events streaming manually using Azure Portal](../event-hubs/event-hubs-capture-enable-through-portal.md)

### Connect Purview Account to Diagnostics EventHubs

2. Now that the EventHubs is deployed and created, connect Azure Purview diagnostics audit logging to this EventHubs.

- Go To your Purview Account home page (where the overview information is displayed, not the Purview Studio home page.) and follow instructions as detailed below.

- Click "Monitoring" -> "Diagnostic Settings" in the left navigation menu.

:::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/E.png" alt-text="Click Azure Purview Diagnostic Settings" lightbox="./media/tutorial-purview-audit-logs-diagnostics/E.png":::

- Click "Add Diagnostic Settings" or "Edit Setting". Adding more than one row of diagnostic setting in the context of Purview is not recommended. In other words, if you already have a dignostic setting row added, do not click "Add Diagnostic"; click "Edit" instead.

:::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/F.png" alt-text="Add or Edit Diagnostic Settings screen." lightbox="./media/tutorial-purview-audit-logs-diagnostics/F.png":::

- Ensure to select checkbox "audit" and "allLogs" to enable collection of Purview audit logs. Optionally, select "allMetrics" if you wish to capture DataMap Capacity Units and Data Map size metrics of the Purview account as well.

:::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/G.png" alt-text="Configure Azure Purview Diagnostic Settings screen." lightbox="./media/tutorial-purview-audit-logs-diagnostics/G.png":::

- Diagnostics Configuration on the Azure Purview account is complete at this stage. 

- Next, go to [Azure Portal](https://portal.azure.com) home page and search the name of the EventHubs Namespace you created in *Step-1*. Open and navigate to this EventHubs.

- Navigate to the EventHubs Namespace and then consequently the EventHubs and click "Capture Data". 

- Supply the name of the EventHubs Namespace and the EventHubs where you would like the audit and diagnostics to be captured and streamed. Modify the "Time Window" and "Size Window" values for retention period of streaming events. Click Save.

:::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/H.png" alt-text="Capture Settings on EventHubs Namespace and EventHubs." lightbox="./media/tutorial-purview-audit-logs-diagnostics/H.png":::

- Optionally, go to "Properties" on the left navigation menu and change the "Message Retention" to any value between 1-7 days. This depends on the frequency of scheduled jobs/scripts you have created to continuously listen and capture the EventHubs streaming events. If you schedule a capture once every week, take the slider to 7 days.

:::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/I.png" alt-text="EventHubs Properties message retention period." lightbox="./media/tutorial-purview-audit-logs-diagnostics/I.png":::

- This completes the configuration steps. Purview will start streaming all its audit diagnostics data to this eventhub and you can now proceed to read, extract and perform additional analytics and operations on the captured diagnostics and audit events.

### Reading Captured Events

3. Analyzing and making sense of the captured Audit and Diagnostics log data from Purview.

- Navigate to "Process Data" on the EventHubs page to see a preview of the captured Purview audit logs and diagnostics.

:::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/D.png" alt-text="Configure Azure Purview Diagnostic Settings screen." lightbox="./media/tutorial-purview-audit-logs-diagnostics/D.png":::

:::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/C.png" alt-text="Configure Azure Purview Diagnostic Settings screen." lightbox="./media/tutorial-purview-audit-logs-diagnostics/C.png":::

-- Switch between "Table" and "Raw" view of the JSON output.

:::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/A.png" alt-text="Explore Purview Audit Events on Event Hubs." lightbox="./media/tutorial-purview-audit-logs-diagnostics/A.png":::

- Click "Download Sample Data" to download and analyse the results carefully.

:::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/B.png" alt-text="Query and Process Purview Audit data on Event Hubs." lightbox="./media/tutorial-purview-audit-logs-diagnostics/B.png":::

- Lastly, you can use scripts to extract and perform additional analytics and operations, and build additional utilities and custom code to extract business value out of the captured audit and diagnostics. You can even use these audit logs and transform them to Excel, any database, Dataverse or Synapse, for analytics and reporting using PowerBI. While you can use any programming/scripting language to read the event hub, here is a readymade [Python-based script](https://github.com/Azure/Azure-Purview-API-PowerShell/blob/main/purview_atlas_eventhub_sample.py) and Python tutorial on how to [Capture Event Hubss data in Azure Storage and read it by using Python (azure-eventhub)](../event-hubs/event-hubs-capture-python.md) 

### Purview Audit History - Categorization of Events

- These categories of audit events are available for capture and analysis. More Purview audit events are being added going forward.

| Category   	| Activity            	| CRUD Operation  	|
|------------	|---------------------	|-----------------	|
| Management 	| Scan Rule Set       	| Create          	|
| Management 	| Scan Rule Set       	| Update          	|
| Management 	| Scan Rule Set       	| Delete          	|
| Management 	| Classification Rule 	| Create          	|
| Management 	| Classification Rule 	| Update          	|
| Management 	| Classification Rule 	| Delete          	|
| Management 	| Scan                	| Create          	|
| Management 	| Scan                	| Update          	|
| Management 	| Scan                	| Delete          	|
| Management 	| Scan                	| Run Scan        	|
| Management 	| Scan                	| Cancel Scan     	|
| Management 	| Scan                	| Create schedule 	|
| Management 	| Data Source         	| Register        	|
| Management 	| Data Source         	| Update          	|
| Management 	| Data Source         	| Delete          	|

## Next steps

Kickstart your Azure Purview journey in less than 5 minutes. Enable Diagnostic Audit Logging from the beginning of your journey!
> [!div class="nextstepaction"] 
> [Purview-API-PowerShell](https://aka.ms/PurviewKickstart) 
