---
title: "Box (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Box (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Box (using Azure Functions) connector for Microsoft Sentinel

The Box data connector provides the capability to ingest [Box enterprise's events](https://developer.box.com/guides/events/#admin-events) into Microsoft Sentinel using the Box REST API. Refer to [Box  documentation](https://developer.box.com/guides/events/enterprise-events/for-enterprise/) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | AzureSentinelWorkspaceId<br/>AzureSentinelSharedKey<br/>BOX_CONFIG_JSON<br/>logAnalyticsUri (optional) |
| **Azure functions app code** | https://aka.ms/sentinel-BoxDataConnector-functionapp |
| **Log Analytics table(s)** | BoxEvents_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All Box events**
   ```kusto
BoxEvents

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Box (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions).
- **Box API Credentials**: Box config JSON file is required for Box REST API JWT authentication. [See the documentation to learn more about JWT authentication](https://developer.box.com/guides/authentication/jwt/).


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Box REST API to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This connector depends on a parser based on Kusto Function to work as expected [**BoxEvents**](https://aka.ms/sentinel-BoxDataConnector-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Configuration of the Box events collection**

See documentation to [setup JWT authentication](https://developer.box.com/guides/authentication/jwt/jwt-setup/) and [obtain JSON file with credentials](https://developer.box.com/guides/authentication/jwt/with-sdk/#prerequisites).


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Box data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Box JSON configuration file, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Box data connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-BoxDataConnector-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **AzureSentinelWorkspaceId**, **AzureSentinelSharedKey**, **BoxConfigJSON**
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Box data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-BoxDataConnector-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. BoxXYZ).

	e. **Select a runtime:** Choose Python 3.6 (note that other versions of python are not supported for this function).

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		AzureSentinelWorkspaceId
		AzureSentinelSharedKey
		BOX_CONFIG_JSON
		logAnalyticsUri (optional)
> - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
3. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-box?tab=Overview) in the Azure Marketplace.
