---
title: "Sophos Endpoint Protection (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Sophos Endpoint Protection (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Sophos Endpoint Protection (using Azure Functions) connector for Microsoft Sentinel

The [Sophos Endpoint Protection](https://www.sophos.com/en-us/products/endpoint-antivirus.aspx) data connector provides the capability to ingest [Sophos events](https://docs.sophos.com/central/Customer/help/en-us/central/Customer/common/concepts/Events.html) into Microsoft Sentinel. Refer to [Sophos Central Admin documentation](https://docs.sophos.com/central/Customer/help/en-us/central/Customer/concepts/Logs.html) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SophosEP_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All logs**
   ```kusto
SophosEP_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Sophos Endpoint Protection (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **REST API Credentials/permissions**: **API token** is required. [See the documentation to learn more about API token](https://docs.sophos.com/central/Customer/help/en-us/central/Customer/concepts/ep_ApiTokenManagement.html)


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Sophos Central APIs to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**SophosEPEvent**](https://aka.ms/sentinel-SophosEP-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Configuration steps for the Sophos Central API**

 Follow the instructions to obtain the credentials.

1. In Sophos Central Admin, go to **Global Settings > API Token Management**.
2. To create a new token, click **Add token** from the top-right corner of the screen.
3. Select a **token name** and click **Save**. The **API Token Summary** for this token is displayed.
4. Click **Copy** to copy your **API Access URL + Headers** from the **API Token Summary** section into your clipboard.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Sophos Endpoint Protection data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sophosep?tab=Overview) in the Azure Marketplace.
