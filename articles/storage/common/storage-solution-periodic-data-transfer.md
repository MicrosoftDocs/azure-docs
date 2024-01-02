---
title: Choose an Azure solution for periodic data transfer
description: Learn how to choose an Azure solution for data transfer when you are transferring data periodically.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: conceptual
ms.date: 07/21/2021
ms.author: shaas
---

# Solutions for periodic data transfer

This article provides an overview of the data transfer solutions when you are transferring data periodically. Periodic data transfer over the network can be categorized as recurring at regular intervals or continuous data movement. The article also describes the recommended data transfer options and the respective key capability matrix for this scenario.

To understand an overview of all the available data transfer options, go to [Choose an Azure data transfer solution](storage-choose-data-transfer-solution.md).

## Recommended options

The recommended options for periodic data transfer fall into two categories depending on whether the transfer is recurring or continuous.

- **Scripted/programmatic tools** – For data transfer that occurs at regular intervals, use the scripted and programmatic tools such as AzCopy and Azure Storage REST APIs. These tools are targeted towards IT professionals and developers.

  - **AzCopy** - Use this command-line tool to easily copy data to and from Azure Blobs, Files, and Table storage with optimal performance. AzCopy supports concurrency and parallelism, and the ability to resume copy operations when interrupted.
  - **Azure Storage REST APIs/SDKs** – When building an application, you can develop the application against Azure Storage REST APIs and use the Azure SDKs offered in multiple languages. The REST APIs can also leverage the Azure Storage Data Movement Library designed especially for the high-performance copying of data to and from Azure.

- **Continuous data ingestion tools** – For continuous, ongoing data ingestion, you can select one of the following options.

  - **Object replication** - Object replication asynchronously copies block blobs between containers in a source and destination storage account. Use object replication as a solution to keep containers in two different storage accounts in sync.
  - **Azure Data Factory** – Data Factory should be used to scale out a transfer operation, and if there is a need for orchestration and enterprise grade monitoring capabilities. Use Azure Data Factory to set up a cloud pipeline that regularly transfers files between several Azure services, on-premises, or a combination of the two. Azure Data Factory lets you orchestrate data-driven workflows that ingest data from disparate data stores and automate data movement and data transformation.
  - **Azure Data Box family for online transfers** - Data Box Edge and Data Box Gateway are online network devices that can move data into and out of Azure. Data Box Edge uses artificial intelligence (AI)-enabled Edge compute to pre-process data before upload. Data Box Gateway is a virtual version of the device with the same data transfer capabilities.

Data Box online transfer device or Azure Data Factory are set up by IT professionals and can transparently automate data transfer.

## Comparison of key capabilities

The following table summarizes the differences in key capabilities.

### Scripted/Programmatic network data transfer

| Capability                  | AzCopy                                 | Azure Storage REST APIs       |
|-----------------------------|----------------------------------------|-------------------------------|
| Form factor                 | Command-line tool from Microsoft       | Customers develop against Storage <br> REST APIs using Azure client libraries |
| Initial one-time setup     | Minimal                                | Moderate, variable development effort    |
| Data Format                 | Azure Blobs, Azure Files, Azure Tables | Azure Blobs, Azure Files, Azure Tables   |
| Performance                 | Already optimized                      | Optimize as you develop                  |
| Pricing                     | Free, data egress charges apply      | Free, data egress charges apply        |

### Continuous data ingestion over network

| Feature                                       | Data Box Gateway | Data Box Edge   | Azure Data Factory        |
|----------------------------------|-----------------------------------------|--------------------------|---------------------------|
| Form factor                                   | Virtual device             | Physical device          | Service in Azure portal, agent on-premises                                                            |
| Hardware                                      | Your hypervisor            | Supplied by Microsoft    | NA                                                            |
| Initial setup effort                          | Low (<30 mins.)            | Moderate (~couple hours) | Large (~days)                                                 |
| Data Format                                   | Azure Blobs, Azure Files   | Azure Blobs, Azure Files | [Supports 70+ data connectors for data stores and formats](../../data-factory/copy-activity-overview.md#supported-data-stores-and-formats)|
| Data pre-processing                           | No                         | Yes, via Edge compute    | Yes                                                           |
| Local cache<br>(to store on-premises data)    | Yes                        | Yes                      | No                                                            |
| Transfer from other clouds                    | No                         | No                       | Yes                                                           |
| Pricing                                       | [Pricing](https://azure.microsoft.com/pricing/details/storage/databox/gateway/)                    | [Pricing](https://azure.microsoft.com/pricing/details/storage/databox/edge/)                  | [Pricing](https://azure.microsoft.com/pricing/details/data-factory/)                                                       |

## Next steps

- [Transfer data with AzCopy](./storage-use-azcopy-v10.md?toc=/azure/storage/tables/toc.json).
- [More information on data transfer with Storage REST APIs](/dotnet/api/overview/azure/storage).
- Understand how to:
  - [Transfer data with Data Box Gateway](../../databox-gateway/data-box-gateway-deploy-add-shares.md).
  - [Transform data with Data Box Edge before sending to Azure](../../databox-online/azure-stack-edge-deploy-configure-compute.md).
- [Learn how to transfer data with Azure Data Factory](../../data-factory/tutorial-bulk-copy-portal.md).
