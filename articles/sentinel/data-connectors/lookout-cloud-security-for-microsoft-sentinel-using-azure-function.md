---
title: "Lookout Cloud Security (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Lookout Cloud Security (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Lookout Cloud Security (using Azure Functions) connector for Microsoft Sentinel

This connector uses a Agari REST API connection to push data into Microsoft Sentinel Log Analytics.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure functions app code** | https://aka.ms/sentinel-Lookout-functionapp |
| **Log Analytics table(s)** | LookoutCloudSecurity_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Lookout](https://www.lookout.com/support) |

## Query samples

**All Lookout Cloud Security logs**

   ```kusto
LookoutCloudSecurity_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Lookout Cloud Security for Microsoft Sentinel (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](https://learn.microsoft.com/azure/azure-functions/).


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Agari REST API to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](https://learn.microsoft.com/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**Step-by-Step Instructions**

 As a prerequisite to this integration, first, you need to configure an API client on Lookout's Management Console.  From the Management Console, you can add one or more clients and configure the appropriate permissions and actions for each. 

 1. Name - The name given to this client. 

 2. Client ID - the unique ID that was provided for this client. 

 3. Permissions - The permissions enabled for this client. The permissions you check are those that the client will be allowed to access. The listed options are Activity, Violation, Anomaly, Insights, and Profile 

 4. Service URL - The URL used to access this client.It must start with https:// 

 5. Authorized IPs - The valid IP address or addresses that apply to this client. 

 6. Actions - The actions you can take for this client. Click the icon for the action you want to perform. Editing client information, displaying the client secret, or deleting the client. 

 **To add a new API client:** 

1. Go to Administration > Enterprise Integration > API Clients and click New. 

1. Enter a Name (required) and a Description (optional). 

1. Enter the Client ID that was provided to you. 

1. Select one or more Permissions from the dropdown list. 

1. Enter one or more Authorized IP addresses for this client. Separate each address with a comma.

1. Click Save. 

 When prompted, copy the string for the client's secret. You will need this information (along with the client ID) to authenticate to the API gateway. 


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as Azure Blob Storage connection string and container name, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the data connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-LookoutCS-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Lookout Client ID**, **Lookout Client Secret**, **Lookout Base url**, **Microsoft Sentinel Workspace Id**, **Microsoft Sentinel Shared Key**
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-Lookout-functionapp) file. Extract archive to your local development computer.
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
		LookoutClientId
		LookoutApiSecret
		Baseurl
		WorkspaceID
		WorkspaceKey
		logAnalyticsUri (Optional)
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://WORKSPACE_ID.ods.opinsights.azure.us`. 
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/lookoutinc.lookout_cloudsecurity_sentinel?tab=Overview) in the Azure Marketplace.
