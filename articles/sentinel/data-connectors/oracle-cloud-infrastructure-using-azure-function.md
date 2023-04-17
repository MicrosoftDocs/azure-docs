---
title: "Oracle Cloud Infrastructure (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Oracle Cloud Infrastructure (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Oracle Cloud Infrastructure (using Azure Functions) connector for Microsoft Sentinel

The Oracle Cloud Infrastructure (OCI) data connector provides the capability to ingest OCI Logs from [OCI Stream](https://docs.oracle.com/iaas/Content/Streaming/Concepts/streamingoverview.htm) into Microsoft Sentinel using the [OCI Streaming REST API](https://docs.oracle.com/iaas/api/#/streaming/streaming/20180418).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure functions app code** | https://aka.ms/sentinel-OracleCloudInfrastructureLogsConnector-functionapp |
| **Log Analytics table(s)** | OCI_Logs_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All OCI Events**
   ```kusto
OCI_Logs_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Oracle Cloud Infrastructure (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](https://learn.microsoft.com/azure/azure-functions/).
- **OCI API Credentials**:  **API Key Configuration File** and **Private Key** are required for OCI API connection. See the documentation to learn more about [creating keys for API access](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Azure Blob Storage API to pull logs into Microsoft Sentinel. This might result in additional costs for data ingestion and for storing data in Azure Blob Storage costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) and [Azure Blob Storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](https://learn.microsoft.com/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**OCILogs**](https://aka.ms/sentinel-OracleCloudInfrastructureLogsConnector-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Creating Stream**

1. Log in to OCI console and go to *navigation menu* -> *Analytics & AI* -> *Streaming*
2. Click *Create Stream*
3. Select Stream Pool or create a new one
4. Provide the *Stream Name*, *Retention*, *Number of Partitions*, *Total Write Rate*, *Total Read Rate* based on your data amount.
5. Go to *navigation menu* -> *Logging* -> *Service Connectors*
6. Click *Create Service Connector*
6. Provide *Connector Name*, *Description*, *Resource Compartment*
7. Select Source: Logging
8. Select Target: Streaming
9. (Optional) Configure *Log Group*, *Filters* or use custom search query to stream only logs that you need.
10. Configure Target - select the strem created before.
11. Click *Create*

Check the documentation to get more information about [Streaming](https://docs.oracle.com/en-us/iaas/Content/Streaming/home.htm) and [Service Connectors](https://docs.oracle.com/en-us/iaas/Content/service-connector-hub/home.htm).


**STEP 2 - Creating credentials for OCI REST API**

Follow the documentation to [create Private Key and API Key Configuration File.](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)

>**IMPORTANT:** Save Private Key and API Key Configuration File created during this step as they will be used during deployment step.


**STEP 3 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the OCI data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as OCI API credentials, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the OCI data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-OracleCloudInfrastructureLogsConnector-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Microsoft Sentinel Workspace Id**, **Microsoft Sentinel Shared Key**, **User**, **Key_content**, **Pass_phrase**, **Fingerprint**, **Tenancy**, **Region**, **Message Endpoint**, **Stream Ocid**
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the OCI data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-OracleCloudInfrastructureLogsConnector-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. OciAuditXX).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		AzureSentinelWorkspaceId
		AzureSentinelSharedKey
		user
		key_content
		pass_phrase (Optional)
		fingerprint
		tenancy
		region
		Message Endpoint
		StreamOcid
		logAnalyticsUri (Optional)
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://WORKSPACE_ID.ods.opinsights.azure.us`. 
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ocilogs?tab=Overview) in the Azure Marketplace.
