---
title: "AbnormalSecurity (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector AbnormalSecurity (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# AbnormalSecurity (using Azure Functions) connector for Microsoft Sentinel

The Abnormal Security data connector provides the capability to ingest threat and case logs into Microsoft Sentinel using the [Abnormal Security Rest API.](https://app.swaggerhub.com/apis/abnormal-security/abx/)

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | SENTINEL_WORKSPACE_ID<br/>SENTINEL_SHARED_KEY<br/>ABNORMAL_SECURITY_REST_API_TOKEN<br/>logAnalyticsUri (optional)(add any other settings required by the Function App)Set the <code>uri</code> value to: <code>&lt;add uri value&gt;</code> |
| **Azure function app code** | https://aka.ms/sentinel-abnormalsecurity-functionapp |
| **Log Analytics table(s)** | ABNORMAL_THREAT_MESSAGES_CL<br/> ABNORMAL_CASES_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Abnormal Security](https://abnormalsecurity.com/contact) |

## Query samples

**All Abnormal Security Threat logs**
   ```kusto
ABNORMAL_THREAT_MESSAGES_CL

   | sort by TimeGenerated desc
   ```

**All Abnormal Security Case logs**
   ```kusto
ABNORMAL_CASES_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with AbnormalSecurity (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Abnormal Security API Token**: An Abnormal Security API Token is required. [See the documentation to learn more about Abnormal Security API](https://app.swaggerhub.com/apis/abnormal-security/abx/). **Note:** An Abnormal Security account is required


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to Abnormal Security's REST API to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


**STEP 1 - Configuration steps for the Abnormal Security API**

 [Follow these instructions](https://app.swaggerhub.com/apis/abnormal-security/abx) provided by Abnormal Security to configure the REST API integration. **Note:** An Abnormal Security account is required


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Abnormal Security data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Abnormal Security API Authorization Token, readily available.



Option 1 - Azure Resource Manager (ARM) Template

This method provides an automated deployment of the Abnormal Security connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-abnormalsecurity-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Microsoft Sentinel Workspace ID**, **Microsoft Sentinel Shared Key** and **Abnormal Security REST API Key**.
 - The default **Time Interval** is set to pull the last five (5) minutes of data. If the time interval needs to be modified, it is recommended to change the Function App Timer Trigger accordingly (in the function.json file, post deployment) to prevent overlapping data ingestion.
 4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Abnormal Security data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-abnormalsecurity-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. AbnormalSecurityXX).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		SENTINEL_WORKSPACE_ID
		SENTINEL_SHARED_KEY
		ABNORMAL_SECURITY_REST_API_TOKEN
		logAnalyticsUri (optional)
(add any other settings required by the Function App)
Set the `uri` value to: `<add uri value>` 
>Note: If using Azure Key Vault secrets for any of the values above, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Azure Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details.
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us.` 
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/abnormalsecuritycorporation1593011233180.fe1b4806-215b-4610-bf95-965a7a65579c?tab=Overview) in the Azure Marketplace.
