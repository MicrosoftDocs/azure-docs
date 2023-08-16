---
title: "Atlassian Jira Audit (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Atlassian Jira Audit (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Atlassian Jira Audit (using Azure Functions) connector for Microsoft Sentinel

The [Atlassian Jira](https://www.atlassian.com/software/jira) Audit data connector provides the capability to ingest [Jira Audit Records](https://support.atlassian.com/jira-cloud-administration/docs/audit-activities-in-jira-applications/) events into Microsoft Sentinel through the REST API. Refer to [API documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-audit-records/) for more information. The connector provides ability to get events which helps to examine potential security risks, analyze your team's use of collaboration, diagnose configuration problems and more.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | JiraUsername<br/>JiraAccessToken<br/>JiraHomeSiteName<br/>WorkspaceID<br/>WorkspaceKey<br/>logAnalyticsUri (optional) |
| **Azure function app code** | https://aka.ms/sentinel-jiraauditapi-functionapp |
| **Kusto function alias** | JiraAudit |
| **Kusto function url** | https://aka.ms/sentinel-jiraauditapi-parser |
| **Log Analytics table(s)** | Jira_Audit_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Jira Audit Events - All Activities**
   ```kusto
JiraAudit
 
   | sort by TimeGenerated desc
   ```

## Prerequisites

To integrate with Atlassian Jira Audit (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **REST API Credentials/permissions**: **JiraAccessToken**, **JiraUsername** is required for REST API. [See the documentation to learn more about API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-audit-records/). Check all [requirements and follow  the instructions](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#authentication) for obtaining credentials.

## Vendor installation instructions

> [!NOTE]
> This connector uses Azure Functions to connect to the Jira REST API to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.

**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.

> [!NOTE]
> This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-jiraauditapi-parser) to create the Kusto functions alias, **JiraAudit**

**STEP 1 - Configuration steps for the Jira API**

 [Follow the instructions](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#authentication) to obtain the credentials. 

**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

> [!IMPORTANT]
> Before deploying the Workspace data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).

Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Jira Audit data connector using an ARM Tempate.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentineljiraauditazuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
   > [!NOTE]
   > Within the same resource group, you can't mix Windows and Linux apps in the same region. Select existing resource group without Windows apps in it or create new resource group.
3. Enter the **JiraAccessToken**, **JiraUsername**, **JiraHomeSiteName** (short site name part, as example HOMESITENAME from ``` https://HOMESITENAME.atlassian.net ```) and deploy. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Jira Audit data connector manually with Azure Functions (Deployment via Visual Studio Code).

**1. Deploy a Function App**

> [!NOTE]
> You will need to [prepare VS code](/azure/azure-functions/functions-create-first-function-python#prerequisites) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-jiraauditapi-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. JiraAuditXXXXX).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.

**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select ** New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		JiraUsername
		JiraAccessToken
		JiraHomeSiteName
		WorkspaceID
		WorkspaceKey
		logAnalyticsUri (optional)
   - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
3. Once all application settings have been entered, click **Save**.

## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-atlassianjiraaudit?tab=Overview) in the Azure Marketplace.
