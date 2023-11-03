---
title: "Feedly connector for Microsoft Sentinel"
description: "Learn how to install the connector Feedly to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Feedly connector for Microsoft Sentinel

This connector allows you to ingest IoCs from Feedly.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | feedly_indicators_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Feedly Inc](https://feedly.com/i/support/contactUs) |

## Query samples

**All IoCs collected**
   ```kusto
feedly_indicators_CL
 
   | sort by TimeGenerated desc
   ```

**Ip addresses**
   ```kusto
feedly_indicators_CL
 
   | where type_s == "ip"
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Feedly make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Custom prerequisites if necessary, otherwise delete this customs tag**: Description for any custom pre-requisites


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to Feedly to pull IoCs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.

(Optional Step) Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault.

Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.

Step 1 - Get your Feedly API token

Go to https://feedly.com/i/team/api and generate a new API token for the connector.

Step 2 - Deploy the connector

Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Feedly connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Feedly API Token, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Feedly connector.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-Feedly-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the SentinelWorkspaceId, SentinelWorkspaceKey, FeedlyApiKey, FeedlyStreamIds, DaysToBackfill. 
>Note: If using Azure Key Vault secrets for any of the values above, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Feedly connector manually with Azure Functions (Deployment via Visual Studio Code).



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/feedlyinc1693853810319.azure-sentinel-solution-feedly?tab=Overview) in the Azure Marketplace.
