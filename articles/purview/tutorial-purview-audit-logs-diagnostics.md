---
title: Enable and Capture Azure Purview Audit Logs and time series activity history via Azure Diagnostics Event Hubs
description:  This tutorial lists step-by-step configuration on how to enable and capture Azure Purview Audit Logs and time series activity history via Diagnostics Event Hubs.
author: abandyop
ms.author: arindamba
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 02/10/2022
---

# Azure Purview: Audit Logs, Diagnostics & Activity History

This guide lists step-by-step configuration on how to enable and capture Azure Purview Audit & Diagnostics Logs via Azure Event Hubs.

An Azure Purview administrator or Azure Purview data-source admin needs the ability to monitor audit and diagnostics logs captured from an [Azure Purview](https://azure.microsoft.com/services/purview/#get-started) service. Audit and diagnostics information consists of timestamped history of actions taken and changes made on the Azure Purview account by every user. Captured activity history includes actions in the [Azure Purview portal](https://ms.web.purview.azure.com) and outside the portal (such as calling [Azure Purview REST APIs](/rest/api/purview/) to perform write operations).

This guide will take you through the steps to enable audit logging on Azure Purview, amd how to configure and capture streaming audit events from Azure Purview via Azure Diagnostics Event Hubs service.

## Azure Purview Audit History - Categorization of Events

Some of the important categories of Azure Purview audit events that are currently available for capture and analysis are listed in the table.

More types and categories of activity audit events are being added to Azure Purview in the coming months.

| Category   | Activity            | Operation       |
|------------|---------------------|-----------------|
| Management | Scan Rule Set       | Create          |
| Management | Scan Rule Set       | Update          |
| Management | Scan Rule Set       | Delete          |
| Management | Classification Rule | Create          |
| Management | Classification Rule | Update          |
| Management | Classification Rule | Delete          |
| Management | Scan                | Create          |
| Management | Scan                | Update          |
| Management | Scan                | Delete          |
| Management | Scan                | Run             |
| Management | Scan                | Cancel          |
| Management | Scan                | Create           |
| Management | Scan                | Schedule         |
| Management | Data Source         | Register        |
| Management | Data Source         | Update          |
| Management | Data Source         | Delete          |

## Enable Azure Purview Audit & Diagnostics

### Configure Azure Event Hubs

Create an [Azure Event Hubs Namespace using Azure ARM Template (GitHub)](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-capture). While this automated Azure ARM Template will deploy and finish creating your Event Hubs with the required configuration; follow these guides for more detailed step by step explanations and manual setup: [Azure Event Hubs: Use Azure Resource Manager Template to enable Event Hubs capture](../event-hubs/event-hubs-resource-manager-namespace-event-hub-enable-capture.md) and [Azure Event Hubs: Enable capturing of events streaming manually using Azure portal](../event-hubs/event-hubs-capture-enable-through-portal.md)

### Connect Azure Purview Account to Diagnostics Event Hubs

Now that Event Hubs is deployed and created, connect Azure Purview diagnostics audit logging to this Event Hubs:

1. Go To your Azure Purview Account home page (where the overview information is displayed, not the Azure Purview Studio home page.) and follow instructions as detailed below.

1. Select "Monitoring" -> "Diagnostic Settings" in the left navigation menu.

    :::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-e.png" alt-text="Click Azure Purview Diagnostic Settings" lightbox="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-e.png":::

1. Select "Add Diagnostic Settings" or "Edit Setting". Adding more than one row of diagnostic setting in the context of Azure Purview isn't recommended. In other words, if you already have a diagnostic setting row added, don't select "Add Diagnostic"; select "Edit" instead.

    :::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-f.png" alt-text="Add or Edit Diagnostic Settings screen." lightbox="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-f.png":::

1. Ensure to select checkbox "audit" and "allLogs" to enable collection of Azure Purview audit logs. Optionally, select "allMetrics" if you wish to capture DataMap Capacity Units and Data Map size metrics of the Azure Purview account as well.

    :::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-g.png" alt-text="Configure Azure Purview Diagnostic settings - select diagnostics types" lightbox="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-g.png":::

1. Diagnostics Configuration on the Azure Purview account is complete.

Now that Azure Purview diagnostics audit logging configuration is complete, configure the data capture and data retention settings for the Event Hubs:

1. Go to [Azure portal](https://portal.azure.com) home page and search the name of the Event Hubs Namespace you created earlier.

1. Navigate to the Event Hubs Namespace. Select the Event Hubs and select "Capture Data".

1. Supply the name of the Event Hubs Namespace and the Event Hubs where you would like the audit and diagnostics to be captured and streamed. Modify the "Time Window" and "Size Window" values for retention period of streaming events. Select Save.

    :::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-h.png" alt-text="Capture Settings on Event Hubs Namespace and Event Hubs." lightbox="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-h.png":::

1. Optionally, go to "Properties" on the left navigation menu and change the "Message Retention" to any value between 1-7 days. Retention period value depends on the frequency of scheduled jobs/scripts you've created to continuously listen and capture the streaming events. If you schedule a capture once every week, take the slider to seven days.

    :::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-i.png" alt-text="Event Hubs properties - message retention period." lightbox="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-i.png":::

1. At this stage, the Event Hubs configuration will be complete. Azure Purview will start streaming all its audit history and diagnostics data to this Event Hubs. You can now proceed to read, extract and perform further analytics and operations on the captured diagnostics and audit events.

### Reading captured "audit" events

Analyzing and making sense of the captured Audit and Diagnostics log data from Azure Purview:

1. Navigate to "Process Data" on the Event Hubs page to see a preview of the captured Azure Purview audit logs and diagnostics.
  
    :::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-d.png" alt-text="Configure Event Hubs - Process Data." lightbox="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-d.png":::

    :::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-c.png" alt-text="Navigating Azure Event Hubs." lightbox="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-c.png":::

1. Switch between "Table" and "Raw" view of the JSON output.

    :::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-a.png" alt-text="Explore Azure Purview Audit Events on Event Hubs." lightbox="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-a.png":::

1. Select "Download Sample Data" to download and analyze the results carefully.

    :::image type="content" source="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-b.png" alt-text="Query and Process Azure Purview Audit data on Event Hubs." lightbox="./media/tutorial-purview-audit-logs-diagnostics/azure-purview-diagnostics-audit-eventhub-b.png":::

Now that you know how to gather this information, you can use automatic, scheduled scripts to extract, read, and perform further analytics on the Event Hubs audit and diagnostics data. You can even build your own utilities and custom code to extract business value from captured audit events.

These audit logs can also be transformed to Excel, any database, Dataverse, or Synapse Analytics database, for analytics and reporting using Power BI. 

While you're free to use any programming or scripting language of your choice to read the Event Hubs, here's one ready-made [Python-based script](https://github.com/Azure/Azure-Purview-API-PowerShell/blob/main/purview_atlas_eventhub_sample.py). Python tutorial on how to [capture Event Hubs data in Azure Storage and read it by using Python (azure-eventhub)](../event-hubs/event-hubs-capture-python.md).

## Next steps

Kickstart your Azure Purview journey in less than 5 minutes. Enable Diagnostic Audit Logging from the beginning of your journey!
> [!div class="nextstepaction"]
> [Azure Purview: automated New Account Setup](https://aka.ms/PurviewKickstart)
