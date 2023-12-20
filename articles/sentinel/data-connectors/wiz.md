---
title: "Wiz connector for Microsoft Sentinel"
description: "Learn how to install the connector Wiz to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 09/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Wiz connector for Microsoft Sentinel

The Wiz connector allows you to easily send Wiz Issues, Vulnerability Findinsg, and Audit logs to Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | WizIssues_CL<br/> WizVulnerabilities_CL<br/> WizAuditLogs_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Wiz](https://support.wiz.io/) |

## Query samples

**Summary by Issues's severity**
   ```kusto
WizIssues_CL
            
   | summarize Count=count() by severity_s
   ```



## Prerequisites

To integrate with Wiz make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Wiz Service Account credentials**: Ensure you have your Wiz service account client ID and client secret, API endpoint URL, and auth URL. Instructions can be found on [Wiz documentation](https://docs.wiz.io/wiz-docs/docs/azure-sentinel-native-integration#collect-authentication-info-from-wiz).


## Vendor installation instructions


> [!NOTE]
   >  This connector: Uses Azure Functions to connect to Wiz API to pull Wiz Issues, Vulnerability Findings, and Audit Logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.
Creates an Azure Key Vault with all the required parameters stored as secrets.

STEP 1 - Get your Wiz credentials


Follow the instructions on [Wiz documentation](https://docs.wiz.io/wiz-docs/docs/azure-sentinel-native-integration#collect-authentication-info-from-wiz) to get the erquired credentials.

STEP 2 - Deploy the connector and the associated Azure Function


>**IMPORTANT:** Before deploying the Wiz Connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Wiz credentials from the previous step.



Option 1: Deploy using the Azure Resource Manager (ARM) Template

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-wiz-azuredeploy) 
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the following parameters: 
> - Choose **KeyVaultName** and **FunctionName** for the new resources 
 >- Enter the following Wiz credentials from step 1: **WizAuthUrl**, **WizEndpointUrl**, **WizClientId**, and **WizClientSecret** 
>- Enter the Workspace credentials **AzureLogsAnalyticsWorkspaceId** and **AzureLogAnalyticsWorkspaceSharedKey**
>- Choose the Wiz data types you want to send to Microsoft Sentinel, choose at least one from **Wiz Issues**, **Vulnerability Findings**, and **Audit Logs**.
 
>- (optional) follow [Wiz documentation](https://docs.wiz.io/wiz-docs/docs/azure-sentinel-native-integration#optional-create-a-filter-for-wiz-queries) to add **IssuesQueryFilter**, **VulnerbailitiesQueryFilter**, and **AuditLogsQueryFilter**.
 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.


Option 2: Manual Deployment of the Azure Function

>Follow [Wiz documentation](https://docs.wiz.io/wiz-docs/docs/azure-sentinel-native-integration#manual-deployment) to deploy the connector manually.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/wizinc1627338511749.wizinc1627338511749_wiz_mss-sentinel?tab=Overview) in the Azure Marketplace.
