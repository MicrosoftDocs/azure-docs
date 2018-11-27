---
title: Azure data transfer options for large datasets, moderate to high network bandwidth| Microsoft Docs
description: Learn how to choose an Azure solution for data transfer when you have moderate to high network bandwidth in your environment and you are planning to transfer large datasets.
services: storage
author: alkohli

ms.service: storage
ms.subservice: blob
ms.topic: article
ms.date: 11/28/2018
ms.author: alkohli
---

# Data transfer for large datasets with moderate to high network bandwidth
 
This article provides an overview of the data transfer solutions when you have moderate to high network bandwidth in your environment and you are planning to transfer large datasets. The article also describes the recommended data transfer options and the respective key capability matrix for this scenario.

To understand an overview of all the available data transfer options, go to [Choose an Azure data transfer solution](storage-choose-data-transfer-solution.md).

## Scenario description

Large datasets refer to data sizes in the order of TBs to PBs. Moderate to high network bandwidth refers to 100 Mbps to 10 Gbps.

## Recommended options

The options recommended in this scenario depend on whether you have moderate network bandwidth or high network bandwidth.

### Moderate network bandwidth (100 Mbps - 1 Gbps)

With moderate network bandwidth, you need to project the time for data transfer over the network.

- **Azure Data Box for offline transfers** – Choose from Data Box Disk, Data Box, Data Box Heavy, or Import/Export to do these offline bulk transfers when you have moderate bandwidth and large datasets.

### High network bandwidth (1 Gbps - 100 Gbps)

- **AzCopy** - Use this command-line tool to easily copy data to and from Azure Blobs, Files, and Table storage with optimal performance. AzCopy supports concurrency and parallelism, and the ability to resume copy operations when interrupted.
- **Azure Storage REST APIs** – When building an application, you can develop the application against Azure Storage REST APIs and use the Azure client libraries offered in multiple languages.
- **Azure Data Box family for online transfers** – Data Box Edge and Data Box Gateway are online network devices that can move data into and out of Azure. Data Box Edge uses artificial intelligence (AI)-enabled Edge compute to pre-process data before upload. Data Box Gateway is a virtual version of the device with the same data transfer capabilities.
- **Azure Data Factory** – Use Azure Data Factory to regularly transfer files between several Azure services, on-premises, or a combination of the two. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that ingest data from disparate data stores and automate data movement and data transformation.


## Comparison of key capabilities

The following tables summarize the differences in key capabilities for the recommended options.

### Moderate network bandwidth

|                                     |    Data Box Disk   (preview)    |    Data Box                                      |    Data Box Heavy (preview)              |    Import/Export                       |
|-------------------------------------|---------------------------------|--------------------------------------------------|------------------------------------------|----------------------------------------|
|    Data size                        |    Up to 35 TBs                 |    Up to 80 TBs                                  |    Up to 800 TB                          |    Variable                            |
|    Data type                        |    Azure Blobs                  |    Azure Blobs<br>Azure Files                    |    Azure Blobs<br>Azure Files            |    Azure Blobs<br>Azure Files          |
|    Form factor                      |    5 SSDs per order             |    1 X 50-lbs. desktop-sized device per order    |    1 X ~500-lbs. large device per order    |    Up to 10 HDDs/SSDs per order        |
|    Initial setup time               |    Low <br>(15 mins)            |    Low to moderate <br> (<30 mins)               |    Moderate<br>(1-2 hours)               |    Moderate to difficult<br>(variable) |
|    Send data to Azure               |    Yes                          |    Yes                                           |    Yes                                   |    Yes                                 |
|    Export data from Azure           |    No                           |    No                                            |    No                                    |    Yes                                 |
|    Encryption                       |    AES 128-bit                  |    AES 256-bit                                   |    AES 256-bit                           |    AES 128-bit                         |
|    Hardware                         |     Microsoft supplied          |    Microsoft supplied                            |    Microsoft supplied                    |    Customer supplied                   |
|    Network interface                |    USB 3.1/SATA                 |    RJ 45, SFP+                                   |    RJ45, QSFP+                           |    SATA II/SATA III                    |
|    Partner integration              |    Some                         |    High                                          |    High                                  |    Some                                |
|    Shipping                         |    Microsoft managed            |    Microsoft managed                             |    Microsoft managed                     |    Customer managed                    |
|    Pricing                          |    [Pricing]                    |   [Pricing]                                      |  [Pricing]                               |   [Pricing]                            |


### High network bandwidth

|                                     |    Tools AzCopy, PowerShell, CLI             |    Azure Storage REST APIs                   |    Data Box Gateway or Data Box Edge (preview)           |    Azure Data Factory                                            |
|-------------------------------------|------------------------------------|----------------------------------------------|----------------------------------|-----------------------------------------------------------------------|
|    Data type                  |    Azure Blobs, Azure Files, Azure Tables    |    Azure Blobs, Azure Files, Azure Tables    |    Azure Blobs, Azure Files                           |   Supports 70+ data connectors for data stores and formats    |
|    Form factor                |    Command-line tools                        |    Programmatic interface                    |    Microsoft supplies a virtual <br>or physical device     |    Service in Azure portal                                            |
|    Initial one-time setup     |    Easy               |    Moderate                       |    Easy (<30 minutes) to moderate (1-2 hours)            |    Extensive                                                          |
|    Data pre-processing              |    No                                        |    No                                        |    Yes (With Edge compute)                               |    Yes                                                                |
|    Transfer from other clouds       |    No                                        |    No                                        |    No                                                    |    Yes                                                                |
|    User type                        |    IT Pro or dev                                       |    Dev                                       |    IT Pro                                                |    IT Pro                                                             |
|    Pricing                          |    Free, data egress charges apply         |    Free, data egress charges apply         |    [Pricing](https://azure.microsoft.com/pricing/details/storage/databox/edge/)                                               |    [Pricing](https://azure.microsoft.com/pricing/details/data-factory/)                                                            |

## Next steps

- [Learn how to transfer data with Import/Export](/azure/storage/common/storage-import-export-data-to-blobs).
- Understand how to

    - [Transfer data with Data Box Disk](https://docs.microsoft.com/azure/databox/data-box-disk-quickstart-portal).
    - [Transfer data with Data Box](https://docs.microsoft.com/azure/databox/data-box-quickstart-portal).
- [Transfer data with AzCopy](/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2ftables%2ftoc.json).
- Understand how to:
    - [Transfer data with Data Box Gateway](https://docs.microsoft.com/azure/databox-online/data-box-gateway-deploy-add-shares.md).
    - [Transform data with Data Box Edge before sending to Azure](https://docs.microsoft.com/azure/databox-online/data-box-edge-deploy-configure-compute).
- [Learn how to transfer data with Azure Data Factory](https://docs.microsoft.com/azure/data-factory/quickstart-create-data-factory-portal).