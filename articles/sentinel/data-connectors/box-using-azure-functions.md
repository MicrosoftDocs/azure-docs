---
title: "Box (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Box (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Box (using Azure Functions) connector for Microsoft Sentinel

The Box data connector provides the capability to ingest [Box enterprise's events](https://developer.box.com/guides/events/#admin-events) into Microsoft Sentinel using the Box REST API. Refer to [Box  documentation](https://developer.box.com/guides/events/enterprise-events/for-enterprise/) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | BoxEvents_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All Box events**
   ```kusto
BoxEvents

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Box (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Box API Credentials**: Box config JSON file is required for Box REST API JWT authentication. [See the documentation to learn more about JWT authentication](https://developer.box.com/guides/authentication/jwt/).


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Box REST API to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This connector depends on a parser based on Kusto Function to work as expected [**BoxEvents**](https://aka.ms/sentinel-BoxDataConnector-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Configuration of the Box events collection**

See documentation to [setup JWT authentication](https://developer.box.com/guides/authentication/jwt/jwt-setup/) and [obtain JSON file with credentials](https://developer.box.com/guides/authentication/jwt/with-sdk/#prerequisites).


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Box data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Box JSON configuration file, readily available.







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-box?tab=Overview) in the Azure Marketplace.
