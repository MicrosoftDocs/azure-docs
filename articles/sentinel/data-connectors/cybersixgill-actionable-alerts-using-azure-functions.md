---
title: "Cybersixgill Actionable Alerts (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Cybersixgill Actionable Alerts (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cybersixgill Actionable Alerts (using Azure Functions) connector for Microsoft Sentinel

Actionable alerts provide customized alerts based on configured assets

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure function app code** | https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Cybersixgill-Actionable-Alerts/Data%20Connectors/CybersixgillAlerts.zip?raw=true |
| **Log Analytics table(s)** | CyberSixgill_Alerts_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Cybersixgill](https://www.cybersixgill.com/) |

## Query samples

**All Alerts**
   ```kusto
CyberSixgill_Alerts_CL
   ```



## Prerequisites

To integrate with Cybersixgill Actionable Alerts (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **REST API Credentials/permissions**: **Client_ID** and **Client_Secret** are required for making API calls.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Cybersixgill API to pull Alerts into Microsoft Sentinel. This might result in additional costs for data ingestion and for storing data in Azure Blob Storage costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) and [Azure Blob Storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.




Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Cybersixgill Actionable Alerts data connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fgithub.com%2FAzure%2FAzure-Sentinel%2Fraw%2Fmaster%2FSolutions%2FCybersixgill-Actionable-Alerts%2FData%20Connectors%2Fazuredeploy_Connector_Cybersixgill_AzureFunction.json)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Workspace ID**, **Workspace Key**, **Client ID**, **Client Secret**, **TimeInterval** and deploy. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Cybersixgill Actionable Alerts data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> NOTE:You will need to [prepare VS code](/azure/azure-functions/functions-create-first-function-python#prerequisites) for Azure function development.

1. Download the [Azure Function App](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Cybersixgill-Actionable-Alerts/Data%20Connectors/CybersixgillAlerts.zip?raw=true) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. CybersixgillAlertsXXX).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		ClientID
		ClientSecret
		Polling
		WorkspaceID
		WorkspaceKey
		logAnalyticsUri (optional)
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`
3. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cybersixgill1657701397011.azure-sentinel-cybersixgill-actionable-alerts?tab=Overview) in the Azure Marketplace.
