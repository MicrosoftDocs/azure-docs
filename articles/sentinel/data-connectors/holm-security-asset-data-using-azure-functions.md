---
title: "Holm Security Asset Data (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Holm Security Asset Data (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Holm Security Asset Data (using Azure Functions) connector for Microsoft Sentinel

The connector provides the capability to poll data from Holm Security Center into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | net_assets_CL<br/> web_assets_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Holm Security](https://support.holmsecurity.com/) |

## Query samples

**All low net assets**
   ```kusto
net_assets_CL
            
   | where severity_s  == 'low'
   ```

**All low web assets**
   ```kusto
web_assets_CL
            
   | where severity_s  == 'low'
   ```



## Prerequisites

To integrate with Holm Security Asset Data (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Holm Security API Token**: Holm Security API Token is required. [Holm Security API Token](https://support.holmsecurity.com/)


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to a Holm Security Assets to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Configuration steps for the Holm Security API**

 [Follow these instructions](https://support.holmsecurity.com/knowledge/how-do-i-set-up-an-api-token) to create an API authentication token.


**STEP 2 - Use the below deployment option to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Holm Security connector, have the Workspace ID  and Workspace Primary Key (can be copied from the following), as well as the Holm Security API authorization Token, readily available.



Azure Resource Manager (ARM) Template Deployment

**Option 1 - Azure Resource Manager (ARM) Template**

Use this method for automated deployment of the Holm Security connector.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-holmsecurityassets-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Workspace ID**, **Workspace Key**, **API Username**, **API Password**, 'and/or Other required fields'. 
>Note: If using Azure Key Vault secrets for any of the values above, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/holmsecurityswedenab1639511288603.holmsecurity_sc_sentinel?tab=Overview) in the Azure Marketplace.
