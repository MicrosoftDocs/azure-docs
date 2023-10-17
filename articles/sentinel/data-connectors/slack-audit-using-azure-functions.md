---
title: "Slack Audit (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Slack Audit (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Slack Audit (using Azure Functions) connector for Microsoft Sentinel

The [Slack](https://slack.com) Audit data connector provides the capability to ingest [Slack Audit Records](https://api.slack.com/admins/audit-logs) events into Microsoft Sentinel through the REST API. Refer to [API documentation](https://api.slack.com/admins/audit-logs#the_audit_event) for more information. The connector provides ability to get events which helps to examine potential security risks, analyze your team's use of collaboration, diagnose configuration problems and more.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | SlackAudit |
| **Kusto function url** | https://aka.ms/sentinel-SlackAuditAPI-parser |
| **Log Analytics table(s)** | SlackAudit_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Slack Audit Events - All Activities.**
   ```kusto
SlackAudit
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Slack Audit (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **REST API Credentials/permissions**: **SlackAPIBearerToken** is required for REST API. [See the documentation to learn more about API](https://api.slack.com/web#authentication). Check all [requirements and follow  the instructions](https://api.slack.com/web#authentication) for obtaining credentials.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Slack REST API to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-SlackAuditAPI-parser) to create the Kusto functions alias, **SlackAudit**


**STEP 1 - Configuration steps for the Slack API**

 [Follow the instructions](https://api.slack.com/web#authentication) to obtain the credentials. 



**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Slack Audit data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-slackaudit?tab=Overview) in the Azure Marketplace.
