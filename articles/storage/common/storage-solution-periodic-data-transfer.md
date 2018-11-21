---
title: Choose an Azure solution for data transfer| Microsoft Docs
description: Learn how to choose an Azure solution for data transfer when you are transferring data periodically.
services: storage
author: alkohli

ms.service: storage
ms.subservice: blob
ms.topic: article
ms.date: 11/21/2018
ms.author: alkohli
---

# Solutions for periodic data transfer
 
This article provides an overview of the data transfer solutions when you are transferring data periodically. Periodic data transfer over the network can be categorized as point-in-time and recurring or continuous data movement. The article also describes the recommended data transfer options and the respective key capability martix for this scenario.

To understand an overview of all the available data transfer options, go to [Choose an Azure data transfer solution](storage-choose-data-transfer-solution).

## Recommended options

The recommended options for periodic data transfer fall into two categories depending on whether the transfer is point-in-time or continuous

- **Scripted/programmatic tools** – For point-in-time data transfer that is recurring, the scripted and programmatic tool choices include AzCopy and Azure Storage REST APIs. These tools are targeted towards a dev user.

    - **AzCopy** - Use this command-line tool to easily copy data to and from Azure Blobs, Files, and Table storage with optimal performance. AzCopy supports concurrency and parallelism, and the ability to resume copy operations when interrupted.
    - **Azure Storage REST APIs** – When building an application, you can develop the application against Azure Storage REST APIs and use the Azure client libraries offered in multiple languages.

    Both the preceding tools can also leverage the Azure Storage Data Movement Library designed especially for the high-performance copying of data to and from Azure.

- **Continuous data ingestion tools** – For continuous, ongoing data ingestion, you can select one of Data Box online transfer device or Azure Data Factory. These tools are targeted for IT pro users.

    - **Azure Data Factory** – Use Azure Data Factory to set up a cloud pipeline that regularly transfers files between several Azure services, on-premises, or a combination of the two. Azure Data Factory lets you orchestrate data-driven workflows (called pipelines) that ingest data from disparate data stores and automate data movement and data transformation.
    - **Azure Data Box family for online transfers** - Data Box Edge and Data Box Gateway are online network devices that can move data into and out of Azure. Data Box Edge uses artificial intelligence (AI)-enabled Edge compute to pre-process data before upload. Data Box Gateway is a virtual version of the device with the same data transfer capabilities.


## Comparison of key capabilities

The following table summarizes the differences in key capabilities.

### Scripted/Programmatic network data transfer

| Capability                  | AzCopy                                 | Azure Storage REST APIs       |
|-----------------------------|----------------------------------------|-------------------------------|
| Form factor                 | Command line tool from Microsoft       | Customers develop against Storage <br> REST APIs using Azure client libraries |
| Initial one-time set up     | Minimal                                | Moderate, variable development effort    |
| Data Format                 | Azure Blobs, Azure Files, Azure Tables | Azure Blobs, Azure Files, Azure Tables   |
| Performance                 | Already optimized                      | Optimize as you develop                  |
| Pricing                     | Free, data movement charges apply      | Free, data movement charges apply        |

### Continuous data ingestion over network

| Feature                                       | Data Box Gateway (preview) | Data Box Edge (preview)  | Azure Data Factory        |
|----------------------------------|-----------------------------------------|--------------------------|---------------------------|
| Form factor                                   | Virtual device             | Physical device          | NA                                                            |
| Hardware                                      | Your hypervisor            | Supplied by Microsoft    | NA                                                            |
| Initial setup effort                          | Low (<30 mins.)            | Moderate (~couple hours) | Large (~days)                                                 |
| Data Format                                   | Azure Blobs, Azure Files   | Azure Blobs, Azure Files | Supports 70+ data connectors for data stores and formats |
| Data pre-processing                           | No                         | Yes, via Edge compute    | Yes                                                           |
| Local cache<br>(to store on-premises data) | Yes                        | Yes                      | No                                                            |
| Transfer from other clouds                    | No                         | No                       | Yes                                                           |
| Express Route recommended                     | No                         | No                       | Yes, when source data is on-premises                          |
| Pricing                                       | Pricing                    | Pricing                  | Pricing                                                       |
## Next steps

- [Transfer data with AzCopy](/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2ftables%2ftoc.json).
- [More information on data transfer with Storage REST APIs](https://docs.microsoft.com/azure/databox-online/data-box-gateway-deploy-add-shares).
- Understand how to:
    - [Transfer data with Data Box Gateway](azure/databox-online/data-box-gateway-deploy-add-shares).
    - [Transform data with Data Box Edge before sending to Azure](/azure/databox-online/data-box-edge-deploy-configure-compute).
- [Learn how to transfer data with Azure Data Factory]().
