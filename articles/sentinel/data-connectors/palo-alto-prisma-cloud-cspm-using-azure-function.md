---
title: "Palo Alto Prisma Cloud CSPM (using Azure Function) connector for Microsoft Sentinel"
description: "Learn how to install the connector Palo Alto Prisma Cloud CSPM (using Azure Function) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Palo Alto Prisma Cloud CSPM (using Azure Function) connector for Microsoft Sentinel

The Palo Alto Prisma Cloud CSPM data connector provides the capability to ingest [Prisma Cloud CSPM alerts](https://prisma.pan.dev/api/cloud/cspm/alerts#operation/get-alerts) and [audit logs](https://prisma.pan.dev/api/cloud/cspm/audit-logs#operation/rl-audit-logs) into Microsoft sentinel using the Prisma Cloud CSPM API. Refer to [Prisma Cloud CSPM API documentation](https://prisma.pan.dev/api/cloud/cspm) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure function app code** | https://aka.ms/sentinel-PaloAltoPrismaCloud-functionapp |
| **Log Analytics table(s)** | PaloAltoPrismaCloudAlert_CL<br/> PaloAltoPrismaCloudAudit_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All Prisma Cloud alerts**
   ```kusto
PaloAltoPrismaCloudAlert_CL

   | sort by TimeGenerated desc
   ```

**All Prisma Cloud audit logs**
   ```kusto
PaloAltoPrismaCloudAudit_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Palo Alto Prisma Cloud CSPM (using Azure Function) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions).
- **Palo Alto Prisma Cloud API Credentials**: **Prisma Cloud API Url**, **Prisma Cloud Access Key ID**, **Prisma Cloud Secret Key** are required for Prisma Cloud API connection. See the documentation to learn more about [creating Prisma Cloud Access Key](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin/manage-prisma-cloud-administrators/create-access-keys.html) and about [obtaining Prisma Cloud API Url](https://prisma.pan.dev/api/cloud/api-urls)


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Palo Alto Prisma Cloud REST API to pull logs into Microsoft sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**PaloAltoPrismaCloud**](https://aka.ms/sentinel-PaloAltoPrismaCloud-parser) which is deployed with the Microsoft sentinel Solution.


**STEP 1 - Configuration of the Prisma Cloud**

Follow the documentation to [create Prisma Cloud Access Key](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin/manage-prisma-cloud-administrators/create-access-keys.html) and [obtain Prisma Cloud API Url](https://api.docs.prismacloud.io/reference)

 NOTE: Please use SYSTEM ADMIN role for giving access to Prisma Cloud API because only SYSTEM ADMIN role is allowed to View Prisma Cloud Audit Logs. Refer to [Prisma Cloud Administrator Permissions (paloaltonetworks.com)](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin/manage-prisma-cloud-administrators/prisma-cloud-admin-permissions) for more details of administrator permissions.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Prisma Cloud data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as Prisma Cloud API credentials, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Prisma Cloud data connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-PaloAltoPrismaCloud-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Prisma Cloud API Url**, **Prisma Cloud Access Key ID**, **Prisma Cloud Secret Key**, **Microsoft sentinel Workspace Id**, **Microsoft sentinel Shared Key**
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Prisma Cloud data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-PaloAltoPrismaCloud-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. PrismaCloud).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		PrismaCloudAPIUrl
		PrismaCloudAccessKeyID
		PrismaCloudSecretKey
		AzureSentinelWorkspaceId
		AzureSentinelSharedKey
		logAnalyticsUri (Optional)
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://WORKSPACE_ID.ods.opinsights.azure.us`. 
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltoprisma?tab=Overview) in the Azure Marketplace.
