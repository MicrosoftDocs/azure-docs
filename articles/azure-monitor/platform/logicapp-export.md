---
title: Use Azure Monitor Logs with Azure Logic Apps and Power Automate
description: Learn how you can use Azure Logic Apps and Power Automate to quickly automate repeatable processes by using the Azure Monitor connector.
ms.service:  azure-monitor
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/13/2020

---

# Export data from Azure Monitor Logs with Logic App
This article presents a method to use Logic Apps to query data from a Log Analytics workspace and store it in Azure storage. Use this article when you need to export your Azure Monitor log data for auditing and compliance scenarios or to allow another service to retrieve this data. This method isn’t suitable for exporting large data sets since it’s based on Log Analytics query API at its heart and subjected to its limits.

Overview 
The basic method used in this solution is to create a Logic App that queries data from the Log Analytics workspace and writes to an Azure storage account. The workspace and storage account can be in different regions, but sending data to another region incurs [additional charges. ](https://azure.microsoft.com/pricing/details/bandwidth/).

## Prerequisites 
The following are the requirements for the Azure resources used in this scenario: 

- A Log Analytics workspace in Azure Monitor. The user who creates the logic app must have at least read permission to the workspace.  
- Azure storage account as destination for your log data. The user who creates the logic app must have write permission to the storage account. 
- Before creating your Logic App, make sure you have the following information: 
  - Subscription ID of your workspace 
  - Resource group of your workspace 
  - Log Analytics workspace name 
  - Storage account name 

## Create storage account 

You can use an existing Azure storage account or use the procedure at [Create a storage account](../../storage/common/storage-quickstart-create-account.md) to create a new one.  Use the procedure at [Create a container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) to add a container to the storage account. The storage account doesn’t have to be in the same subscription as your Log Analytics workspace. 

The name used for the container with the Create Blob action below is loganalytics-data, but you can use any name. 

## Next steps

- Learn more about [log queries in Azure Monitor](../log-query/log-query-overview.md).
- Learn more about [Logic Apps](../../logic-apps/index.yml)
- Learn more about [Power Automate](https://flow.microsoft.com).
