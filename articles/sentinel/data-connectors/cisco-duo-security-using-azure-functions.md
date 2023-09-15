---
title: "Cisco Duo Security (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Duo Security (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Duo Security (using Azure Functions) connector for Microsoft Sentinel

The Cisco Duo Security data connector provides the capability to ingest [authentication logs](https://duo.com/docs/adminapi#authentication-logs), [administrator logs](https://duo.com/docs/adminapi#administrator-logs), [telephony logs](https://duo.com/docs/adminapi#telephony-logs), [offline enrollment logs](https://duo.com/docs/adminapi#offline-enrollment-logs) and [Trust Monitor events](https://duo.com/docs/adminapi#trust-monitor) into Microsoft Sentinel using the Cisco Duo Admin API. Refer to [API documentation](https://duo.com/docs/adminapi) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure function app code** | https://aka.ms/sentinel-CiscoDuoSecurity-functionapp |
| **Log Analytics table(s)** | CiscoDuo_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All Cisco Duo logs**
   ```kusto
CiscoDuo_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Cisco Duo Security (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Cisco Duo API credentials**: Cisco Duo API credentials with permission *Grant read log* is required for Cisco Duo API. See the [documentation](https://duo.com/docs/adminapi#first-steps) to learn more about creating Cisco Duo API credentials.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Cisco Duo API to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**CiscoDuo**](https://aka.ms/sentinel-CiscoDuoSecurity-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Obtaining Cisco Duo Admin API credentials**

1. Follow [the instructions](https://duo.com/docs/adminapi#first-steps) to obtain **integration key**, **secret key**, and **API hostname**. Use **Grant read log** permission in the 4th step of [the instructions](https://duo.com/docs/adminapi#first-steps).


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as Azure Blob Storage connection string and container name, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-CiscoDuoSecurity-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Cisco Duo Integration Key**, **Cisco Duo Secret Key**, **Cisco Duo API Hostname**, **Cisco Duo Log Types**, **Microsoft Sentinel Workspace Id**, **Microsoft Sentinel Shared Key**
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-CiscoDuoSecurity-functionapp) file. Extract archive to your local development computer.
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
		CISCO_DUO_INTEGRATION_KEY
		CISCO_DUO_SECRET_KEY
		CISCO_DUO_API_HOSTNAME
		CISCO_DUO_LOG_TYPES
		WORKSPACE_ID
		SHARED_KEY
		logAnalyticsUri (Optional)
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://WORKSPACE_ID.ods.opinsights.azure.us`. 
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscoduosecurity?tab=Overview) in the Azure Marketplace.
