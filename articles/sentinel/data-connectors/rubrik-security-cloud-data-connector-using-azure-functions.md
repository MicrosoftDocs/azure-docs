---
title: "Rubrik Security Cloud data connector (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Rubrik Security Cloud data connector (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Rubrik Security Cloud data connector (using Azure Functions) connector for Microsoft Sentinel

The Rubrik Security Cloud data connector enables security operations teams to integrate insights from Rubrik’s Data Observability services into Microsoft Sentinel. The insights include identification of anomalous filesystem behavior associated with ransomware and mass deletion, assess the blast radius of a ransomware attack, and sensitive data operators to prioritize and more rapidly investigate potential incidents.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure function app code** | https://aka.ms/sentinel-RubrikWebhookEvents-functionapp |
| **Log Analytics table(s)** | Rubrik_Anomaly_Data_CL<br/> Rubrik_Ransomware_Data_CL<br/> Rubrik_ThreatHunt_Data_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Rubrik](https://support.rubrik.com) |

## Query samples

**Rubrik Anomaly Events - Anomaly Events for all severity types.**
   ```kusto
Rubrik_Anomaly_Data_CL
 
   | sort by TimeGenerated desc
   ```

**Rubrik Ransomware Analysis Events - Ransomware Analysis Events for all severity types.**
   ```kusto
Rubrik_Ransomware_Data_CL
 
   | sort by TimeGenerated desc
   ```

**Rubrik ThreatHunt Events - Threat Hunt Events for all severity types.**
   ```kusto
Rubrik_ThreatHunt_Data_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Rubrik Security Cloud data connector (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Rubrik webhook which push its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Rubrik Microsoft Sentinel data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following) readily available..



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Rubrik connector.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-RubrikWebhookEvents-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the below information : 
		Function Name 
		Workspace ID 
		Workspace Key 
		Anomalies_table_name 
		RansomwareAnalysis_table_name 
		ThreatHunts_table_name 
 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Rubrik Microsoft Sentinel data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/functions-create-first-function-python#prerequisites) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-RubrikWebhookEvents-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. RubrikXXXXX).

	e. **Select a runtime:** Choose Python 3.8 or above.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following application settings individually, with their respective values (case-sensitive): 
		WorkspaceID
		WorkspaceKey
		Anomalies_table_name
		RansomwareAnalysis_table_name
		ThreatHunts_table_name
		logAnalyticsUri (optional)
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`. 
4. Once all application settings have been entered, click **Save**.


**Post Deployment steps**




**STEP 1 - To get the Azure Function url**

 1. Go to Azure function Overview page and Click on "Functions" in the left blade.
 2. Click on the Rubrik defined function for the event.
 3. Go to "GetFunctionurl" and copy the function url.


**STEP 2 - Follow the Rubrik User Guide instructions to [Add a Webhook](https://docs.rubrik.com/en-us/saas/saas/common/adding_webhook.html) to begin receiving event information related to Ransomware Anomalies.**

 1. Select the Generic as the webhook Provider(This will use CEF formatted event information)
 2. Enter the Function App URL as the webhook URL endpoint for the Rubrik Microsoft Sentinel Solution
 3. Select the Custom Authentication option 
 4. Enter x-functions-key as the HTTP header 
 5. Enter the Function access key as the HTTP value(Note: if you change this function access key in Microsoft Sentinel in the future you will need to update this webhook configuration)
 6. Select the following Event types: Anomaly, Ransomware Investigation Analysis, Threat Hunt 
 7. Select the following severity levels: Critical, Warning, Informational


*Now we are done with the rubrik Webhook configuration. Once the webhook events triggered , you should be able to see the Anomaly, Ransomware Analysis, ThreatHunt events from the Rubrik into respective LogAnalytics workspace table called "Rubrik_Anomaly_Data_CL", "Rubrik_Ransomware_Data_CL", "Rubrik_ThreatHunt_Data_CL".*





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/rubrik_inc.rubrik_sentinel?tab=Overview) in the Azure Marketplace.
