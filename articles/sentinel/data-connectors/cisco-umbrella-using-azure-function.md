---
title: "Cisco Umbrella (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Umbrella (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Umbrella (using Azure Functions) connector for Microsoft Sentinel

The Cisco Umbrella data connector provides the capability to ingest [Cisco Umbrella](https://docs.umbrella.com/) events stored in Amazon S3 into Microsoft Sentinel using the Amazon S3 REST API. Refer to [Cisco Umbrella log management documentation](https://docs.umbrella.com/deployment-umbrella/docs/log-management) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | WorkspaceID<br/>WorkspaceKey<br/>S3Bucket<br/>AWSAccessKeyId<br/>AWSSecretAccessKey<br/>logAnalyticsUri (optional) |
| **Azure functions app code** | https://aka.ms/sentinel-CiscoUmbrellaConn-functionapp |
| **Kusto function alias** | Cisco_Umbrella |
| **Kusto function url** | https://aka.ms/sentinel-ciscoumbrella-function |
| **Log Analytics table(s)** | Cisco_Umbrella_dns_CL<br/> Cisco_Umbrella_proxy_CL<br/> Cisco_Umbrella_ip_CL<br/> Cisco_Umbrella_cloudfirewall_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All Cisco Umbrella Logs**
   ```kusto
Cisco_Umbrella

   | sort by TimeGenerated desc
   ```

**Cisco Umbrella DNS Logs**
   ```kusto
Cisco_Umbrella
 
   | where EventType == 'dnslogs'

   | sort by TimeGenerated desc
   ```

**Cisco Umbrella Proxy Logs**
   ```kusto
Cisco_Umbrella
 
   | where EventType == 'proxylogs'

   | sort by TimeGenerated desc
   ```

**Cisco Umbrella IP Logs**
   ```kusto
Cisco_Umbrella
 
   | where EventType == 'iplogs'

   | sort by TimeGenerated desc
   ```

**Cisco Umbrella Cloud Firewall Logs**
   ```kusto
Cisco_Umbrella
 
   | where EventType == 'cloudfirewalllogs'

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Cisco Umbrella (using Azure Function) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions).
- **Amazon S3 REST API Credentials/permissions**: **AWS Access Key Id**, **AWS Secret Access Key**, **AWS S3 Bucket Name** are required for Amazon S3 REST API.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Amazon S3 REST API to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


> [!NOTE]
   >  This connector has been updated to support [cisco umbrella version 5 and version 6.](https://docs.umbrella.com/deployment-umbrella/docs/log-formats-and-versioning)


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This connector uses a parser based on a Kusto Function to normalize fields. [Follow these steps](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Parsers/CiscoUmbrella/Cisco_Umbrella) to create the Kusto function alias **Cisco_Umbrella**.


**STEP 1 - Configuration of the Cisco Umbrella logs collection**

[See documentation](https://docs.umbrella.com/deployment-umbrella/docs/log-management#section-logging-to-amazon-s-3) and follow the instructions for set up logging and obtain credentials.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Cisco Umbrella data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Amazon S3 REST API Authorization credentials, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Cisco Umbrella data connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinelciscoumbrellaazuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Workspace ID**, **Workspace Key**, **S3Bucket**, **AWSAccessKeyId**, **AWSSecretAccessKey**
**Note:** For the S3Bucket use the value that Cisco referrs to as the _S3 Bucket Data Path_ and add a / (forward slash) to the end of the value
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Cisco Umbrella data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-CiscoUmbrellaConn-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. UmbrellaXYZ).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		WorkspaceID
		WorkspaceKey
		S3Bucket
		AWSAccessKeyId
		AWSSecretAccessKey
		logAnalyticsUri (optional)
> - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
3. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscoumbrella?tab=Overview) in the Azure Marketplace.
