---
title: Azure data transfer options for small datasets with low to moderate network bandwidth| Microsoft Docs
description: Learn how to choose an Azure solution for data transfer when you have low to moderate network bandwidth in your environment and you are planning to transfer small datasets.
services: storage
author: alkohli

ms.service: storage
ms.subservice: blobs
ms.topic: article
ms.date: 12/05/2018
ms.author: alkohli
---

# Data transfer for small datasets with low to moderate network bandwidth
 
This article provides an overview of the data transfer solutions when you have low to moderate network bandwidth in your environment and you are planning to transfer small datasets. The article also describes the recommended data transfer options and the respective key capability matrix for this scenario.

To understand an overview of all the available data transfer options, go to [Choose an Azure data transfer solution](storage-choose-data-transfer-solution.md).

## Scenario description

Small datasets refer to data sizes in the order of GBs to a few TBs. Low to moderate network bandwidth implies 45 Mbps (T3 connection in datacenter) to 1 Gbps.

- If you are transferring only a handful of files and you don’t need to automate data transfer, consider the tools with a graphical interface.
- If you are comfortable with system administration, consider command line or programmatic/scripting tools.

## Recommended options

The options recommended in this scenario are:

- **Graphical interface tools** such as Azure Storage Explorer and Azure Storage in Azure portal. These provide an easy way to view your data and quickly transfer a few files.

    - **Azure Storage Explorer** - This cross-platform tool lets you manage the contents of your Azure storage accounts. It allows you to upload, download, and manage blobs, files, queues, tables, and Azure Cosmos DB entities. Use it with Blob storage to manage blobs and folders, as well as upload and download blobs between your local file system and Blob storage, or between storage accounts.
    - **Azure portal** - Azure Storage in Azure portal provides a web-based interface to explore files and upload new files one at a time. This is a good option if you do not want to install any tools or issue commands to quickly explore your files, or to simply upload a handful of new ones.

- **Scripting/programmatic tools** such as AzCopy/PowerShell/Azure CLI and Azure Storage REST APIs.

    - **AzCopy** - Use this command-line tool to easily copy data to and from Azure Blobs, Files, and Table storage with optimal performance. AzCopy supports concurrency and parallelism, and the ability to resume copy operations when interrupted.
    - **Azure PowerShell** - For users comfortable with system administration, use the Azure Storage module in Azure PowerShell to transfer data.
    - **Azure CLI** - Use this cross-platform tool to manage Azure services and upload data to Azure Storage.
    - **Azure Storage REST APIs/SDKs** – When building an application, you can develop the application against Azure Storage REST APIs/SDKs and use the Azure client libraries offered in multiple languages.


## Comparison of key capabilities

The following table summarizes the differences in key capabilities.

| Feature | Azure Storage Explorer | Azure portal | AzCopy<br>Azure PowerShell<br>Azure CLI | Azure Storage REST APIs or SDKs |
|---------|------------------------|--------------|-----------------------------------------|---------------------------------|
| Availability | Download and install <br>Standalone tool | Web-based exploration tools in Azure portal | Command line tool |Programmable interfaces in .NET, Java, Python, JavaScript, C++, Go, Ruby and PHP |
| Graphical   interface | Yes | Yes | No | No |
| Supported   platforms | Windows, Mac, Linux | Web-based |Windows, Mac, Linux |All platforms |
| Allowed Blob storage operations<br>for blobs and folders | Upload<br>Download<br>Manage | Upload<br>Download<br>Manage |Upload<br>Download<br>Manage | Yes, customizable |
| Allowed Data Lake Gen1 storage<br>operations for files and folders | Upload<br>Download<br>Manage | No |Upload<br>Download<br>Manage                   | No |
| Allowed File storage operations<br>for files and directories | Upload<br>Download<br>Manage | Upload<br>Download<br>Manage   |Upload<br>Download<br>Manage | Yes, customizable |
| Allowed Table storage operations<br>for tables |Manage | No |Table support in AzCopy v7 |Yes, customizable|
| Allowed Queue storage | Manage | No  |No | Yes, is customizable|


## Next steps

- Learn how to [transfer data with Azure Storage Explorer](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/move-data-to-azure-blob-using-azure-storage-explorer).
- [Transfer data with AzCopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10)

