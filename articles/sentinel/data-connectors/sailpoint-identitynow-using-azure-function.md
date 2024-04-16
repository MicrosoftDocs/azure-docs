---
title: "SailPoint IdentityNow (using Azure Function) connector for Microsoft Sentinel"
description: "Learn how to install the connector SailPoint IdentityNow (using Azure Function) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# SailPoint IdentityNow (using Azure Function) connector for Microsoft Sentinel

The [SailPoint](https://www.sailpoint.com/) IdentityNow data connector provides the capability to ingest [SailPoint IdentityNow] search events into Microsoft Sentinel through the REST API. The connector provides customers the ability to extract audit information from their IdentityNow tenant. It is intended to make it even easier to bring IdentityNow user activity and governance events into Microsoft Sentinel to improve insights from your security incident and event monitoring solution.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | TENANT_ID<br/>SHARED_KEY<br/>LIMIT<br/>GRANT_TYPE<br/>CUSTOMER_ID<br/>CLIENT_ID<br/>CLIENT_SECRET<br/>AZURE_STORAGE_ACCESS_KEY<br/>AZURE_STORAGE_ACCOUNT_NAME<br/>AzureWebJobsStorage<br/>logAnalyticsUri (optional) |
| **Azure function app code** | https://aka.ms/sentinel-sailpointidentitynow-functionapp |
| **Log Analytics table(s)** | SailPointIDN_Events_CL<br/> SailPointIDN_Triggers_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [SailPoint]() |

## Query samples

**SailPointIDN Search Events - All Events**
   ```kusto
SailPointIDN_Events_CL
 
   | sort by TimeGenerated desc
   ```

**SailPointIDN Triggers - All Triggers**
   ```kusto
SailPointIDN_Triggers_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with SailPoint IdentityNow (using Azure Function) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions).
- **SailPoint IdentityNow API Authentication Credentials**: TENANT_ID, CLIENT_ID and CLIENT_SECRET are required for authentication.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the SailPoint IdentityNow REST API to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Configuration steps for the SailPoint IdentityNow API**

 [Follow the instructions](https://community.sailpoint.com/t5/IdentityNow-Articles/Best-Practice-Using-Personal-Access-Tokens-in-IdentityNow/ta-p/150471) to obtain the credentials. 



**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the SailPoint IdentityNow data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the SailPoint IdentityNow data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-sailpointidentitynow-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
> **NOTE:** Within the same resource group, you can't mix Windows and Linux apps in the same region. Select existing resource group without Windows apps in it or create new resource group.
3. Enter other information and deploy. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the SailPoint IdentityNow data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/functions-create-first-function-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-sailpointidentitynow-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. searcheventXXXXX).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select ** New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		TENANT_ID
		SHARED_KEY
		LIMIT
		GRANT_TYPE
		CUSTOMER_ID
		CLIENT_ID
		CLIENT_SECRET
		AZURE_STORAGE_ACCESS_KEY
		AZURE_STORAGE_ACCOUNT_NAME
		AzureWebJobsStorage
		logAnalyticsUri (optional)
> - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
3. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/sailpoint1582673310610.sentinel_offering?tab=Overview) in the Azure Marketplace.
