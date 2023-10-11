---
title: "Crowdstrike Falcon Data Replicator (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Crowdstrike Falcon Data Replicator (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Crowdstrike Falcon Data Replicator (using Azure Functions) connector for Microsoft Sentinel

The [Crowdstrike](https://www.crowdstrike.com/) Falcon Data Replicator connector provides the capability to ingest raw event data from the [Falcon Platform](https://www.crowdstrike.com/blog/tech-center/intro-to-falcon-data-replicator/) events into Microsoft Sentinel. The connector provides ability to get events from Falcon Agents which helps to examine potential security risks, analyze your team's use of collaboration, diagnose configuration problems and more.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | AWS_KEY<br/>AWS_SECRET<br/>AWS_REGION_NAME<br/>QUEUE_URL<br/>WorkspaceID<br/>WorkspaceKey<br/>logAnalyticsUri (optional) |
| **Azure function app code** | https://aka.ms/sentinel-CrowdstrikeReplicator-functionapp |
| **Kusto function alias** | CrowdstrikeReplicator |
| **Kusto function url** | https://aka.ms/sentinel-crowdstrikereplicator-parser |
| **Log Analytics table(s)** | CrowdstrikeReplicatorLogs_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Data Replicator - All Activities**
   ```kusto
CrowdstrikeReplicator
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Crowdstrike Falcon Data Replicator (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **SQS and AWS S3 account credentials/permissions**: **AWS_SECRET**, **AWS_REGION_NAME**, **AWS_KEY**, **QUEUE_URL** is required.  [See the documentation to learn more about data pulling](https://www.crowdstrike.com/blog/tech-center/intro-to-falcon-data-replicator/). To start, contact CrowdStrike support. At your request they will create a CrowdStrike managed Amazon Web Services (AWS) S3 bucket for short term storage purposes as well as a SQS (simple queue service) account for monitoring changes to the S3 bucket.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the S3 bucket to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-crowdstrikereplicator-parser) to create the Kusto functions alias, **CrowdstrikeReplicator**.


**STEP 1 - Contact CrowdStrike support to obtain the credentials and Queue URL.**



**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Crowdstrike Falcon Data Replicator connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Crowdstrike Falcon Data Replicator connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-CrowdstrikeReplicator-azuredeploy)
2. Select the preferred **AWS_SECRET**, **AWS_REGION_NAME**, **AWS_KEY**, **QUEUE_URL**. 
> **NOTE:** Within the same resource group, you can't mix Windows and Linux apps in the same region. Select existing resource group without Windows apps in it or create new resource group.
3. Enter the **AWS_SECRET**, **AWS_REGION_NAME**, **AWS_KEY**, **QUEUE_URL** and deploy. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Crowdstrike Falcon Data Replicator connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/functions-create-first-function-python#prerequisites) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-CrowdstrikeReplicator-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. CrowdstrikeReplicatorXXXXX).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select ** New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		AWS_KEY
		AWS_SECRET
		AWS_REGION_NAME
		QUEUE_URL
		WorkspaceID
		WorkspaceKey
		logAnalyticsUri (optional)
> - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-crowdstrikefalconep?tab=Overview) in the Azure Marketplace.
