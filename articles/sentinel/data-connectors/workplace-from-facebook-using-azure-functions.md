---
title: "Workplace from Facebook (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Workplace from Facebook (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Workplace from Facebook (using Azure Functions) connector for Microsoft Sentinel

The [Workplace](https://www.workplace.com/) data connector provides the capability to ingest common Workplace events into Microsoft Sentinel through Webhooks. Webhooks enable custom integration apps to subscribe to events in Workplace and receive updates in real time. When a change occurs in Workplace, an HTTPS POST request with event information is sent to a callback data connector URL.  Refer to [Webhooks documentation](https://developers.facebook.com/docs/workplace/reference/webhooks) for more information. The connector provides ability to get events which helps to examine potential security risks, analyze your team's use of collaboration, diagnose configuration problems and more.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Workplace_Facebook_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Workplace Events - All Activities.**
   ```kusto
Workplace_Facebook_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Workplace from Facebook (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Webhooks Credentials/permissions**: WorkplaceAppSecret, WorkplaceVerifyToken, Callback URL are required for working Webhooks. See the documentation to learn more about [configuring Webhooks](https://developers.facebook.com/docs/workplace/reference/webhooks), [configuring permissions](https://developers.facebook.com/docs/workplace/reference/permissions). 


## Vendor installation instructions


> [!NOTE]
   >  This data connector uses Azure Functions based on HTTP Trigger for waiting POST requests with logs to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Functions App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias WorkplaceFacebook and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Workplace%20from%20Facebook/Parsers/Workplace_Facebook.txt) on the second line of the query, enter the hostname(s) of your Workplace Facebook device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.


**STEP 1 - Configuration steps for the Workplace**

 Follow the instructions to configure Webhooks.

1. Log in to the Workplace with Admin user credentials.
2. In the Admin panel, click **Integrations**.
3. In the **All integrations** view, click **Create custom integration**
4. Enter the name and description and click **Create**.
5. In the **Integration details** panel show **App secret** and copy.
6. In the **Integration permissions** pannel set all read permissions. Refer to [permission page](https://developers.facebook.com/docs/workplace/reference/permissions) for details.
7. Now proceed to STEP 2 to follow the steps (listed in Option 1 or 2) to Deploy the Azure Function.
8. Enter the requested parameters and also enter a Token of choice. Copy this Token / Note it for the upcoming step.
9. After the deployment of Azure Functions completes successfully, open Function App page, select your app, go to **Functions**, click **Get Function URL** and copy this / Note it for the upcoming step.
10. Go back to Workplace from Facebook. In the **Configure webhooks** panel on each Tab set **Callback URL** as the same value that you copied in point 9 above and Verify token as the same
 value you copied in point 8 above which was obtained during STEP 2 of Azure Functions deployment.
11. Click Save.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Functions**

>**IMPORTANT:** Before deploying the Workplace data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-workplacefromfacebook?tab=Overview) in the Azure Marketplace.
