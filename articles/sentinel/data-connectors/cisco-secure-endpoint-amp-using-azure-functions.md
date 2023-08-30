---
title: "Cisco Secure Endpoint (AMP) (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Secure Endpoint (AMP) (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Secure Endpoint (AMP) (using Azure Functions) connector for Microsoft Sentinel

The Cisco Secure Endpoint (formerly AMP for Endpoints) data connector provides the capability to ingest Cisco Secure Endpoint [audit logs](https://api-docs.amp.cisco.com/api_resources/AuditLog?api_host=api.amp.cisco.com&api_version=v1) and [events](https://api-docs.amp.cisco.com/api_actions/details?api_action=GET+%2Fv1%2Fevents&api_host=api.amp.cisco.com&api_resource=Event&api_version=v1) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure function app code** | https://aka.ms/sentinel-ciscosecureendpoint-functionapp |
| **Log Analytics table(s)** | CiscoSecureEndpoint_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All Cisco Secure Endpoint logs**
   ```kusto
CiscoSecureEndpoint_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Cisco Secure Endpoint (AMP) (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Cisco Secure Endpoint API credentials**: Cisco Secure Endpoint Client ID and API Key are required. [See the documentation to learn more about Cisco Secure Endpoint API](https://api-docs.amp.cisco.com/api_resources?api_host=api.amp.cisco.com&api_version=v1). [API domain](https://api-docs.amp.cisco.com) must be provided as well.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Cisco Secure Endpoint API to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**CiscoSecureEndpoint**](https://aka.ms/sentinel-ciscosecureendpoint-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Obtaining Cisco Secure Endpoint API credentials**

1. Follow the instructions in the [documentation](https://api-docs.amp.cisco.com/api_resources?api_host=api.amp.cisco.com&api_version=v1) to generate Client ID and API Key.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as Azure Blob Storage connection string and container name, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-ciscosecureendpoint-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Cisco Secure Endpoint Api Host**, **Cisco Secure Endpoint Client Id**, **Cisco Secure Endpoint Api Key**, **Microsoft Sentinel Workspace Id**, **Microsoft Sentinel Shared Key**
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-ciscosecureendpoint-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions.

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		CISCO_SE_API_API_HOST
		CISCO_SE_API_CLIENT_ID
		CISCO_SE_API_KEY
		WORKSPACE_ID
		SHARED_KEY
		logAnalyticsUri (Optional)
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://WORKSPACE_ID.ods.opinsights.azure.us`. 
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscosecureendpoint?tab=Overview) in the Azure Marketplace.
