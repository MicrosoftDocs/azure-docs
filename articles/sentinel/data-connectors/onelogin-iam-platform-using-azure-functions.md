---
title: "OneLogin IAM Platform(using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector OneLogin IAM Platform(using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# OneLogin IAM Platform(using Azure Functions) connector for Microsoft Sentinel

The [OneLogin](https://www.onelogin.com/) data connector provides the capability to ingest common OneLogin IAM Platform events into Microsoft Sentinel through Webhooks. The OneLogin Event Webhook API which is also known as the Event Broadcaster will send batches of events in near real-time to an endpoint that you specify. When a change occurs in the OneLogin, an HTTPS POST request with event information is sent to a callback data connector URL.  Refer to [Webhooks documentation](https://developers.onelogin.com/api-docs/1/events/webhooks) for more information. The connector provides ability to get events which helps to examine potential security risks, analyze your team's use of collaboration, diagnose configuration problems and more.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | OneLogin_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**OneLogin Events - All Activities.**
   ```kusto
OneLogin
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with OneLogin IAM Platform(using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Webhooks Credentials/permissions**: **OneLoginBearerToken**, **Callback URL** are required for working Webhooks. See the documentation to learn more about [configuring Webhooks](https://onelogin.service-now.com/kb_view_customer.do?sysparm_article=KB0010469).You need to generate **OneLoginBearerToken** according to your security requirements and use it in **Custom Headers** section in format: Authorization: Bearer **OneLoginBearerToken**. Logs Format: JSON Array.


## Vendor installation instructions


> [!NOTE]
   >  This data connector uses Azure Functions based on HTTP Trigger for waiting POST requests with logs to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**OneLogin**](https://aka.ms/sentinel-OneLogin-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Configuration steps for the OneLogin**

 Follow the [instructions](https://onelogin.service-now.com/kb_view_customer.do?sysparm_article=KB0010469) to configure Webhooks.

1. Generate the **OneLoginBearerToken** according to your password policy.
2. Set Custom Header in the format: Authorization: Bearer OneLoginBearerToken.
3. Use JSON Array Logs Format.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the OneLogin data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-oneloginiam?tab=Overview) in the Azure Marketplace.
