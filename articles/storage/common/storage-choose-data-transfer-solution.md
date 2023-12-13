---
title: Choose an Azure solution for data transfer
description: Learn how to choose an Azure solution for data transfer based on data sizes and available network bandwidth in your environment.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: conceptual
ms.date: 09/25/2020
ms.author: shaas
---

<!--
10/26/23: 100 (869/0)
Prev score: 87 (850/8)
-->

# Choose an Azure solution for data transfer

This article provides an overview of some of the common Azure data transfer solutions. The article also links out to recommended options depending on the network bandwidth in your environment and the size of the data you intend to transfer.

## Types of data movement

Data transfer can be offline or over the network connection. Choose your solution depending on your:

- **Data size** - Size of the data intended for transfer,
- **Transfer frequency** - One-time or periodic data ingestion, and
- **Network** – Bandwidth available for data transfer in your environment.

The data movement can be of the following types:

- **Offline transfer using shippable devices** - Use physical shippable devices when you want to do offline one-time bulk data transfer. This use case involves copying data to either a disk or specialized device, and then shipping it to a secure Microsoft facility where the data is uploaded. You can purchase and ship your own disks, or you order a Microsoft-supplied disk or device. Microsoft-supplied solutions for offline transfer include Azure [Data Box](../../databox/data-box-overview.md), [Data Box Disk](../../databox/data-box-disk-overview.md), and [Data Box Heavy](../../databox/data-box-heavy-overview.md).

- **Network Transfer** - You transfer your data to Azure over your network connection. This transfer can be done in many ways.

  - **Hybrid migration service** - [Azure Storage Mover](../../storage-mover/service-overview.md) is a new, fully managed migration service that enables you to migrate your files and folders to Azure Storage while minimizing downtime for your workload. Azure Storage Mover is a hybrid cloud service consisting of a cloud service component and an on-premises migration agent virtual machine (VM). Storage Mover is used for migration scenarios such as *lift-and-shift*, and for cloud migrations that you repeat occasionally.
  - **On-premises devices** - We supply you a physical or virtual device that resides in your datacenter and optimizes data transfer over the network. These devices also provide a local cache of frequently used files. The physical device is the Azure Stack Edge and the virtual device is the Data Box Gateway. Both run permanently in your premises and connect to Azure over the network.
  - **Graphical interface** - If you occasionally transfer just a few files and don't need to automate the data transfer, you can choose a graphical interface tool such as Azure Storage Explorer or a web-based exploration tool in Azure portal.
  - **Scripted or programmatic transfer** - You can use optimized software tools that we provide or call our REST APIs/SDKs directly. The available scriptable tools are AzCopy, Azure PowerShell, and Azure CLI. For programmatic interface, use one of the SDKs for .NET, Java, Python, Node/JS, C++, Go, PHP or Ruby.
  - **Managed data pipeline** - You can set up a cloud pipeline to regularly transfer files between several Azure services, on-premises or a combination of two. Use Azure Data Factory to set up and manage data pipelines, and move and transform data for analysis.

The following visual illustrates the guidelines to choose the various Azure data transfer tools depending upon the network bandwidth available for transfer, data size intended for transfer, and frequency of the transfer.

![Azure data transfer tools](media/storage-choose-data-transfer-solution/azure-data-transfer-options-3.png)

**The upper limits of the offline transfer devices - Data Box Disk, Data Box, and Data Box Heavy can be extended by placing multiple orders of a device type.*

## Selecting a data transfer solution

Answer the following questions to help select a data transfer solution:

- Is your available network bandwidth limited or nonexistent, and you want to transfer large datasets?

    If yes, see: [Scenario 1: Transfer large datasets with no or low network bandwidth](storage-solution-large-dataset-low-network.md).
- Do you want to transfer large datasets over network and you have a moderate to high network bandwidth?

    If yes, see: [Scenario 2: Transfer large datasets with moderate to high network bandwidth](storage-solution-large-dataset-moderate-high-network.md).
- Do you want to occasionally transfer just a few files over the network?

    If yes, see [Scenario 3: Transfer small datasets with limited to moderate network bandwidth](storage-solution-small-dataset-low-moderate-network.md).
- Are you looking for point-in-time data transfer at regular intervals?

    If yes, use the scripted/programmatic options outlined in [Scenario 4: Periodic data transfers](storage-solution-periodic-data-transfer.md).
- Are you looking for on-going, continuous data transfer?

    If yes, use the options in [Scenario 4: Periodic data transfers](storage-solution-periodic-data-transfer.md).

## Data transfer feature in Azure portal

You can also provide information specific to your scenario and review a list of optimal data transfer solutions. To view the list, navigate to your Azure Storage account within the Azure portal and select the **Data transfer** feature. After providing the network bandwidth in your environment, the size of the data you want to transfer, and the frequency of data transfer, you're shown a list of solutions corresponding to the information that you have provided.

## Next steps

- [Get an introduction to Azure Storage Explorer](https://azure.microsoft.com/resources/videos/introduction-to-microsoft-azure-storage-explorer/).
- [Read an overview of AzCopy](./storage-use-azcopy-v10.md).
- [Quickstart: Upload, download, and list blobs with PowerShell](../blobs/storage-quickstart-blobs-powershell.md)
- [Quickstart: Create, download, and list blobs with Azure CLI](../blobs/storage-quickstart-blobs-cli.md)
- Learn about:
  - [Azure Storage Mover](../../storage-mover/service-overview.md), a hybrid migration service.
  - [Cloud migration using Azure Storage Mover](../../storage-mover/migration-basics.md).
- Learn about:

  - [Azure Data Box, Azure Data Box Disk, and Azure Data Box Heavy for offline transfers](../../databox/index.yml).
  - [Azure Data Box Gateway and Azure Stack Edge for online transfers](../../databox-online/index.yml).

- [Learn about Azure Data Factory](../../data-factory/copy-activity-overview.md).
- Use the REST APIs to transfer data

  - [In .NET](/dotnet/api/overview/azure/storage)
  - [In Java](/java/api/overview/azure/storage)
