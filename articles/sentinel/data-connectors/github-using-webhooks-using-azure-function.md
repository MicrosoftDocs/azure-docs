---
title: "GitHub (using Webhooks) (using Azure Function) connector for Microsoft Sentinel"
description: "Learn how to install the connector GitHub (using Webhooks) (using Azure Function) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# GitHub (using Webhooks) (using Azure Function) connector for Microsoft Sentinel

The [GitHub](https://www.github.com) webhook data connector provides the capability to ingest GitHub subscribed events into Microsoft Sentinel using [GitHub webhook events](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads). The connector provides ability to get events into Sentinel which helps to examine potential security risks, analyze your team's use of collaboration, diagnose configuration problems and more. 

 **Note:** If you are intended to ingest GitHub Audit logs, Please refer to GitHub Enterprise Audit Log Connector from "**Data Connectors**" gallery.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure function app code** | https://aka.ms/sentinel-GitHubWebhookAPI-functionapp |
| **Log Analytics table(s)** | githubscanaudit_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**GitHub Events - All Activities.**
   ```kusto
githubscanaudit_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with GitHub (using Webhooks) (using Azure Function) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](../../azure-functions/index.yml).


## Vendor installation instructions


> [!NOTE]
   >  This connector has been built on http trigger based Azure Function. And it provides an endpoint to which GitHub will be connected through it's webhook capability and posts the subscribed events into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](../../app-service/app-service-key-vault-references.md) to use Azure Key Vault with an Azure Function App.


**Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the GitHub Webhook connector, have the Workspace ID  and Workspace Primary Key (can be copied from the following).




**Option 1 - Azure Resource Manager (ARM) Template**

Use this method for automated deployment of the GitHub data connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-GitHubwebhookAPI-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
> **NOTE:** Within the same resource group, you can't mix Windows and Linux apps in the same region and deploy. 
3. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.


**Option 2 - Manual Deployment of Azure Functions**

Use the following step-by-step instructions to deploy the GitHub webhook data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/functions-create-first-function-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-GitHubWebhookAPI-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. GitHubXXXXX).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select ** New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive):

   - WorkspaceID
   - WorkspaceKey
   - logAnalyticsUri (optional) - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
   - GithubWebhookSecret (optional) - To enable webhook authentication generate a secret value and store it in this setting.

1. Once all application settings have been entered, click **Save**.


**Post Deployment steps**




**STEP 1 - To get the Azure Function url**

 1. Go to Azure function Overview page and Click on "Functions" in the left blade.
 2. Click on the function called "GithubwebhookConnector".
 3. Go to "GetFunctionurl" and copy the function url.


**STEP 2 - Configure Webhook to GitHub Organization**

 1. Go to [GitHub](https://www.github.com) and open your account and click on "Your Organizations."
 2. Click on Settings.
 3. Click on "Webhooks" and enter the function app url which was copied from above STEP 1 under payload URL textbox. 
 4. Choose content type as "application/json". 
 1. (Optional) To enable webhook authentication, add to the "Secret" field value you saved to GithubWebhookSecret from Function App settings.
 1. Subscribe for events and click on "Add Webhook"


*Now we are done with the GitHub Webhook configuration. Once the GitHub events triggered and after the delay of 20 to 30 mins (As there will be a dealy for LogAnalytics to spin up the resources for the first time), you should be able to see all the transactional events from the GitHub into LogAnalytics workspace table called "githubscanaudit_CL".*

 For more details, Click [here](https://aka.ms/sentinel-gitHubwebhooksteps)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftcorporation1622712991604.sentinel4github?tab=Overview) in the Azure Marketplace.