---
title: "Armorblox (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Armorblox (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Armorblox (using Azure Functions) connector for Microsoft Sentinel

The [Armorblox](https://www.armorblox.com/) data connector provides the capability to ingest incidents from your Armorblox instance into Microsoft Sentinel through the REST API. The connector provides ability to get events which helps to examine potential security risks, and more.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | ArmorbloxAPIToken<br/>ArmorbloxInstanceName OR ArmorbloxInstanceURL<br/>WorkspaceID<br/>WorkspaceKey<br/>LogAnalyticsUri (optional) |
| **Azure function app code** | https://aka.ms/sentinel-armorblox-functionapp |
| **Log Analytics table(s)** | Armorblox_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [armorblox](https://www.armorblox.com/contact/) |

## Query samples

**Armorblox Incidents**
   ```kusto
Armorblox_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Armorblox (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Armorblox Instance Details**: **ArmorbloxInstanceName** OR **ArmorbloxInstanceURL** is required
- **Armorblox API Credentials**: **ArmorbloxAPIToken** is required


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Armorblox API to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Configuration steps for the Armorblox API**

 Follow the instructions to obtain the API token.

1. Log in to the Armorblox portal with your credentials.
2. In the portal, click **Settings**.
3. In the **Settings** view, click **API Keys**
4. Click **Create API Key**.
5. Enter the required information.
6. Click **Create**, and copy the API token displayed in the modal.
7. Save API token for using in the data connector.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Armorblox data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Armorblox data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-armorblox-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
> **NOTE:** Within the same resource group, you can't mix Windows and Linux apps in the same region. Select existing resource group without Windows apps in it or create new resource group.
3. Enter the **ArmorbloxAPIToken**, **ArmorbloxInstanceURL** OR **ArmorbloxInstanceName**, and deploy. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Armorblox data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/functions-create-first-function-python#prerequisites) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-armorblox-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. Armorblox).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select ** New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		ArmorbloxAPIToken
		ArmorbloxInstanceName OR ArmorbloxInstanceURL
		WorkspaceID
		WorkspaceKey
		LogAnalyticsUri (optional)
> - Use LogAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/armorblox1601081599926.armorblox_sentinel_1?tab=Overview) in the Azure Marketplace.
