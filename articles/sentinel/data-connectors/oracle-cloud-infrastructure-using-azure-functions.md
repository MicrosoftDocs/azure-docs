---
title: "Oracle Cloud Infrastructure (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Oracle Cloud Infrastructure (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Oracle Cloud Infrastructure (using Azure Functions) connector for Microsoft Sentinel

The Oracle Cloud Infrastructure (OCI) data connector provides the capability to ingest OCI Logs from [OCI Stream](https://docs.oracle.com/iaas/Content/Streaming/Concepts/streamingoverview.htm) into Microsoft Sentinel using the [OCI Streaming REST API](https://docs.oracle.com/iaas/api/#/streaming/streaming/20180418).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | OCI_Logs_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All OCI Events**
   ```kusto
OCI_Logs_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Oracle Cloud Infrastructure (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **OCI API Credentials**:  **API Key Configuration File** and **Private Key** are required for OCI API connection. See the documentation to learn more about [creating keys for API access](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Azure Blob Storage API to pull logs into Microsoft Sentinel. This might result in additional costs for data ingestion and for storing data in Azure Blob Storage costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) and [Azure Blob Storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**OCILogs**](https://aka.ms/sentinel-OracleCloudInfrastructureLogsConnector-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Creating Stream**

1. Log in to OCI console and go to *navigation menu* -> *Analytics & AI* -> *Streaming*
2. Click *Create Stream*
3. Select Stream Pool or create a new one
4. Provide the *Stream Name*, *Retention*, *Number of Partitions*, *Total Write Rate*, *Total Read Rate* based on your data amount.
5. Go to *navigation menu* -> *Logging* -> *Service Connectors*
6. Click *Create Service Connector*
6. Provide *Connector Name*, *Description*, *Resource Compartment*
7. Select Source: Logging
8. Select Target: Streaming
9. (Optional) Configure *Log Group*, *Filters* or use custom search query to stream only logs that you need.
10. Configure Target - select the strem created before.
11. Click *Create*

Check the documentation to get more information about [Streaming](https://docs.oracle.com/en-us/iaas/Content/Streaming/home.htm) and [Service Connectors](https://docs.oracle.com/en-us/iaas/Content/service-connector-hub/home.htm).


**STEP 2 - Creating credentials for OCI REST API**

Follow the documentation to [create Private Key and API Key Configuration File.](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)

>**IMPORTANT:** Save Private Key and API Key Configuration File created during this step as they will be used during deployment step.


**STEP 3 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the OCI data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as OCI API credentials, readily available.







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ocilogs?tab=Overview) in the Azure Marketplace.
