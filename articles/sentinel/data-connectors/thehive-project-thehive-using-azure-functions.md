---
title: "TheHive Project - TheHive (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector TheHive Project - TheHive (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# TheHive Project - TheHive (using Azure Functions) connector for Microsoft Sentinel

The [TheHive](http://thehive-project.org/) data connector provides the capability to ingest common TheHive events into Microsoft Sentinel through Webhooks. TheHive can notify external system of modification events (case creation, alert update, task assignment) in real time. When a change occurs in the TheHive, an HTTPS POST request with event information is sent to a callback data connector URL.  Refer to [Webhooks documentation](https://docs.thehive-project.org/thehive/legacy/thehive3/admin/webhooks/) for more information. The connector provides ability to get events which helps to examine potential security risks, analyze your team's use of collaboration, diagnose configuration problems and more.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | TheHive_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**TheHive Events - All Activities.**
   ```kusto
TheHive_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with TheHive Project - TheHive (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Webhooks Credentials/permissions**: **TheHiveBearerToken**, **Callback URL** are required for working Webhooks. See the documentation to learn more about [configuring Webhooks](https://docs.thehive-project.org/thehive/installation-and-configuration/configuration/webhooks/).


## Vendor installation instructions


> [!NOTE]
   >  This data connector uses Azure Functions based on HTTP Trigger for waiting POST requests with logs to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**TheHive**](https://aka.ms/sentinel-TheHive-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Configuration steps for the TheHive**

 Follow the [instructions](https://docs.thehive-project.org/thehive/installation-and-configuration/configuration/webhooks/) to configure Webhooks.

1. Authentication method is *Beared Auth*.
2. Generate the **TheHiveBearerToken** according to your password policy.
3. Setup Webhook notifications in the *application.conf* file including **TheHiveBearerToken** parameter.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the TheHive data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-thehive?tab=Overview) in the Azure Marketplace.
