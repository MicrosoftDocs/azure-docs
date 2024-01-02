---
title: "Google Cloud Platform IAM (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Google Cloud Platform IAM (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Google Cloud Platform IAM (using Azure Functions) connector for Microsoft Sentinel

The Google Cloud Platform Identity and Access Management (IAM) data connector provides the capability to ingest [GCP IAM logs](https://cloud.google.com/iam/docs/audit-logging) into Microsoft Sentinel using the GCP Logging API. Refer to [GCP Logging API documentation](https://cloud.google.com/logging/docs/api) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure function app code** | https://aka.ms/sentinel-GCPIAMDataConnector-functionapp |
| **Log Analytics table(s)** | GCP_IAM_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All GCP IAM logs**
   ```kusto
GCP_IAM_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Google Cloud Platform IAM (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **GCP service account**: GCP service account with permissions to read logs is required for GCP Logging API. Also json file with service account key is required. See the documentation to learn more about [required permissions](https://cloud.google.com/iam/docs/audit-logging#audit_log_permissions), [creating service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts) and [creating service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the GCP API to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**GCP_IAM**](https://aka.ms/sentinel-GCPIAMDataConnector-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Configuring GCP and obtaining credentials**

1. Make sure that Logging API is [enabled](https://cloud.google.com/apis/docs/getting-started#enabling_apis). 

2. (Optional) [Enable Data Access Audit logs](https://cloud.google.com/logging/docs/audit/configure-data-access#config-console-enable).

3. [Create service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts) with [required permissions](https://cloud.google.com/iam/docs/audit-logging#audit_log_permissions) and [get service account key json file](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

4. Prepare the list of GCP resources (organizations, folders, projects) to get logs from. [Learn more about GCP resources](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy).


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as Azure Blob Storage connection string and container name, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the data connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-GCPIAMDataConnector-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Google Cloud Platform Resource Names**, **Google Cloud Platform Credentials File Content**, **Microsoft Sentinel Workspace Id**, **Microsoft Sentinel Shared Key**
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-GCPIAMDataConnector-functionapp) file. Extract archive to your local development computer.
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
		RESOURCE_NAMES
		CREDENTIALS_FILE_CONTENT
		WORKSPACE_ID
		SHARED_KEY
		logAnalyticsUri (Optional)
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://WORKSPACE_ID.ods.opinsights.azure.us`. 
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-gcpiam?tab=Overview) in the Azure Marketplace.
