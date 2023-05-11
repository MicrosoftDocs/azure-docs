---
title: "Sophos Endpoint Protection (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Sophos Endpoint Protection (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Sophos Endpoint Protection (using Azure Functions) connector for Microsoft Sentinel

The [Sophos Endpoint Protection](https://www.sophos.com/en-us/products/endpoint-antivirus.aspx) data connector provides the capability to ingest [Sophos events](https://docs.sophos.com/central/Customer/help/en-us/central/Customer/common/concepts/Events.html) into Microsoft Sentinel. Refer to [Sophos Central Admin documentation](https://docs.sophos.com/central/Customer/help/en-us/central/Customer/concepts/Logs.html) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | SOPHOS_TOKEN<br/>WorkspaceID<br/>WorkspaceKey<br/>logAnalyticsUri (optional) |
| **Azure functions app code** | https://aka.ms/sentinel-SophosEP-functionapp |
| **Log Analytics table(s)** | SophosEP_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All logs**
   ```kusto
SophosEP_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Sophos Endpoint Protection (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions).
- **REST API Credentials/permissions**: **API token** is required. [See the documentation to learn more about API token](https://docs.sophos.com/central/Customer/help/en-us/central/Customer/concepts/ep_ApiTokenManagement.html)


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Sophos Central APIs to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**SophosEPEvent**](https://aka.ms/sentinel-SophosEP-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Configuration steps for the Sophos Central API**

 Follow the instructions to obtain the credentials.

1. In Sophos Central Admin, go to **Global Settings > API Token Management**.
2. To create a new token, click **Add token** from the top-right corner of the screen.
3. Select a **token name** and click **Save**. The **API Token Summary** for this token is displayed.
4. Click **Copy** to copy your **API Access URL + Headers** from the **API Token Summary** section into your clipboard.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Sophos Endpoint Protection data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Sophos Endpoint Protection data connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-SophosEP-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
> **NOTE:** Within the same resource group, you can't mix Windows and Linux apps in the same region. Select existing resource group without Windows apps in it or create new resource group.
3. Enter the **Sophos API Access URL and Headers**, **AzureSentinelWorkspaceId**, **AzureSentinelSharedKey**. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Sophos Endpoint Protection data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/functions-create-first-function-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-SophosEP-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. SophosEPXXXXX).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select ** New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		SOPHOS_TOKEN
		WorkspaceID
		WorkspaceKey
		logAnalyticsUri (optional)
> - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sophosep?tab=Overview) in the Azure Marketplace.
