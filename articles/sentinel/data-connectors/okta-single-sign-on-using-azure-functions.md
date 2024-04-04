---
title: "Okta Single Sign-On (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Okta Single Sign-On (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Okta Single Sign-On (using Azure Functions) connector for Microsoft Sentinel

The [Okta Single Sign-On (SSO)](https://www.okta.com/products/single-sign-on/) connector provides the capability to ingest audit and event logs from the Okta API into Microsoft Sentinel. The connector provides visibility into these log types in Microsoft Sentinel to view dashboards, create custom alerts, and to improve monitoring and investigation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Okta_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Active Applications**
   ```kusto
Okta_CL 

   | mv-expand todynamic(target_s)  

   | where target_s.type == "AppInstance"  

   | summarize count() by tostring(target_s.alternateId)  

   | top 10 by count_
   ```

**Top 10 Client IP Addresses**
   ```kusto
Okta_CL 

   | summarize count() by client_ipAddress_s 

   | top 10 by count_
   ```



## Prerequisites

To integrate with Okta Single Sign-On (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Okta API Token**: An Okta API Token is required. See the documentation to learn more about the [Okta System Log API](https://developer.okta.com/docs/reference/api/system-log/).


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to Okta SSO to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


> [!NOTE]
   >  This connector has been updated, if you have previously deployed an earlier version, and want to update, please delete the existing Okta Azure Function before redeploying this version.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Configuration steps for the Okta SSO API**

 [Follow these instructions](https://developer.okta.com/docs/guides/create-an-api-token/create-the-token/) to create an API Token.


**Note** - For more information on the rate limit restrictions enforced by Okta, please refer to the **[documentation](https://developer.okta.com/docs/reference/rl-global-mgmt/)**.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Okta SSO connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Okta SSO API Authorization Token, readily available.







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-okta?tab=Overview) in the Azure Marketplace.
