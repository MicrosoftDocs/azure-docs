
---
title: Enable and Capture Azure Purview Audit Logs and time series activity history via Azure Diagnostics Event Hub
description:  This tutorial lists step-by-step configuration on how to Enable and Capture Azure Purview Audit Logs and time series activity history via Azure Diagnostics Event Hub.
author: abandyop
ms.author: arindamba
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 02/10/2022
---

# Azure Purview Audit & Diagnostics Logs

This guide lists step-by-step configuration on how to enable and capture Azure Purview Audit Logs via Azure Diagnostics Event Hub. 

## Customer Intent

As an Azure Purview administrator, or Azure Purview data source admin, I want to view and monitor timestamped activity history on actions taken by every user on [Azure Purview](https://ms.web.purview.azure.com). To enable audit logging on Purview, there is an easy and clean technique to capture streaming audit events via Azure Diagnostics Event Hub. Let's go through the step-by-step guide on how to configure this Diagnostics Audit logging on Azure Purview.

### Enable Diagnostics

1. Create [Azure EventHub Namespace and Azure EventHub using Azure ARM Template (GitHub)](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-capture). While this automated Azure ARM Template should one-click deploy and finish creating your EventHub with the required configuration desirable for Purview Audit logging; follow these guides for more detailed step by step explanantions and manual setup: [Azure Event-Hub: Use Azure Resource Manager Template to enable eventhub capture](../event-hubs/event-hubs-resource-manager-namespace-event-hub-enable-capture.md) and [Azure Event-Hub: Enable capturing of events streaming manually using Azure Portal](../event-hubs/event-hubs-capture-enable-through-portal.md)

2. Now that the Event-Hub is deployed and created, connect Azure Purview diagnostics audit logging to this Event-Hub.
- Go To your Purview Account home page (where the overview information is displayed, not the Purview Studio home page.) Instructions as shown in the screenshot below.
- Click "Monitoring" -> "Diagnostic Settings" in the left navigation menu.
- Click "Add Diagnostic Settings" or "Edit Setting". Adding more than one row of diagnostic setting in the context of Purview is not recommended. In other words, if you already have a dignostic setting row added, do not click "Add Diagnostic"; click "Edit" instead.
- Supply the name of the Event-Hub Namespace and the Event-Hub where you would like the audit and diagnostics to be captured and streamed. Click Save.
- Navigate to the Event-Hub Namespace and then consequently the Event-Hub and click "Capture Data". Modify and save the settings as below.
- This completes the configuration steps. Purview will start streaming all its audit diagnostics data to this eventhub and you can now proceed to read, extract and perform additional analytics and operations on the captured data.

3. Capturing and making sense of the captured Audit and Diagnostics log data from Purview.
- Navigate to "Process Data" on the Event-Hub page left pane navigation menu to see a preview of the captured Purview audit logs and diagnostics.
- Switch between "Table" and "Raw" view of the JSON output. Click "Download Sample Data" to download and analyse the results carefully.
- Lastly, you can use scripts to extract and perform additional analytics and operations, and build additional utilities and custom code to extract business value out of the captured audit and diagnostics. While you can use any programming/scripting language, here is a Python-based tutorial on how to [Capture Event Hubs data in Azure Storage and read it by using Python (azure-eventhub)](../event-hubs/event-hubs-capture-python.md) 

## Next steps

Kickstart your Azure Purview journey in less than 5 minutes. Enable Diagnostic Audit Logging from the beginning of your journey!
> [!div class="nextstepaction"] 
> [Purview-API-PowerShell](https://aka.ms/PurviewKickstart) 
