---
title: Microsoft Azure Data Box Gateway overview | Microsoft Docs
description: Describes Azure Data Box Gateway, a virtual appliance storage solution that enables you to transfer data into Azure
services: databox
author: alkohli

ms.service: databox
ms.subservice: gateway
ms.topic: overview
ms.date: 04/08/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Data Box Gateway is and how it works so I can use it to send data to Azure.
---
# What is Azure Data Box Gateway?

Azure Data Box Gateway is a storage solution that enables you to seamlessly send data to Azure. This article provides you an overview of the Azure Data Box Gateway solution, benefits, key capabilities, and the scenarios where you can deploy this device.

Data Box Gateway is a virtual device based on a virtual machine provisioned in your virtualized environment or hypervisor. The virtual device resides in your premises and you write data to it using the NFS and SMB protocols. The device then transfers your data to Azure block blob, page blob, or Azure Files.

## Use cases

Data Box Gateway can be leveraged for transferring data to the cloud such as cloud archival, disaster recovery, or if there is a need to process your data at cloud scale. Here are the various scenarios where Data Box Gateway can be used for data transfer.

- **Cloud archival** - Copy hundreds of TBs of data to Azure storage using Data Box Gateway in a secure and efficient manner. The data can be ingested one time or an ongoing basis for archival scenarios.

- **Continuous data ingestion** - Continuously ingest data into the device to copy to the cloud, regardless of the data size. As the data is written to the gateway device, the device uploads the data to Azure Storage.  

- **Initial bulk transfer followed by incremental transfer** - Use Data Box for the bulk transfer in an offline mode (initial seed) and Data Box Gateway for incremental transfers (ongoing feed) over the network.

For more information, go to [Azure Data Box Gateway use cases](data-box-gateway-use-cases.md).

## Benefits

Data Box Gateway has the following benefits:

- **Easy data transfer**- Makes it easy to move data in and out of Azure storage as easy as working with a local network share.  
- **High performance** - Takes the hassle out of network data transport with high-performance transfers to and from Azure.
- **Fast access and high data ingestion rates during business hours** - Data Box Gateway has a local cache that you define as the local capacity size when the virtual device is provisioned. The data disk size should be specified as per the [virtual device minimum requirements](data-box-gateway-system-requirements.md#specifications-for-the-virtual-device). The local cache provides the following benefits:
    - The local cache allows data ingestion at a high rate. When high amount of data is ingested during peak business hours, the cache can hold the data and upload it to the cloud.
    - The local cache allows fast read access until a certain threshold. Until the device is 50-60% full, all the reads from the device are accessed from the cache making them faster. Once the used space on the device goes above this threshold, then the device starts to remove local files.
 
- **Limited bandwidth usage** - Data can be written to Azure even when the network is throttled to limit usage during peak business hours.  

## Key capabilities

Data Box Gateway has the following capabilities:

|Capability |Description  |
|---------|---------|
|Speed     | Fully automated and highly optimized data transfer and bandwidth.|
|Supported protocols     | Support for standard SMB and NFS protocols for data ingestion. <br> For more information on supported versions, go to [Data Box Gateway system requirements](data-box-gateway-system-requirements.md).|
|Data access     | Once the data sent by device is in the cloud, it can be further modified by directly accessing the cloud APIs.|
|Fast access     | Local cache on the device for fast access of most recently used files.|
|Offline upload     | Disconnected mode supports offline upload scenarios.|
|Data refresh     | Ability to refresh local files with the latest from cloud.|
|Encryption    | BitLocker support to locally encrypt data and secure data transfer to cloud over *https*       |
|Resiliency     | Built-in network resiliency        |


## Specifications

The Data Box Gateway virtual device has the following specifications:

| Specifications                                          | Description              |
|---------------------------------------------------------|--------------------------|
| Virtual processors (cores)   | Minimum 4 |
| Memory  |Minimum 8 GB|
| Availability|Single node|
| Disks|OS disk: 250 GB <br> Data disk: 2 TB minimum, thin provisioned, and must be backed by SSDs|
| Network interfaces |1 or more virtual network interface|
| Native file sharing protocols|SMB and NFS  |
| Security|Authentication to unlock access to device and data <br> Data-in-flight encrypted using AES-256 bit encryption|
| Management|Local web UI - Initial setup, diagnostics, and power management of device <br> Azure portal - day-to-day management of Data Box Gateway devices       |

## Components

The Data Box Gateway solution comprises of Data Box Gateway resource, Data Box Gateway virtual device, and a local web UI.

- **Data Box Gateway virtual device** - A device based on a virtual machine provisioned in your virtualized environment or hypervisor and allows you to send data to Azure.
    
- **Data Box Gateway resource** – A resource in the Azure portal that lets you manage a Data Box Gateway device from a web interface that you can access from different geographical locations. Use the Data Box Gateway resource to view and manage device, shares, users and alerts. For more information, see how to [Manage using Azure portal](data-box-gateway-manage-shares.md).

- **Data Box local web UI** - Use the local web UI to run diagnostics, shut down and restart the device, generate a support package, or contact Microsoft Support to file a service request. For more information, see how to [Manage using local web UI](data-box-gateway-manage-access-power-connectivity-mode.md).

## Region availability

Data Box Gateway physical device, Azure resource, and target storage account to which you transfer data do not all have to be in the same region.

- **Resource availability** - For this release, the Data Box Gateway resource is available in the following regions that support public cloud:
    - **United States** - East US
    - **European Union** - West Europe
    - **Asia Pacific** - South East Asia

    Data Box Gateway can also be deployed in the Azure Government Cloud. For more information, see [What is Azure Government?](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome).

- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions.

    The regions where the storage accounts store Data Box data should be located close to where the device is located for optimum performance. A storage account located far from the device results in long latencies and slower performance.


## Next steps

- Review the [Data Box Gateway system requirements](data-box-gateway-system-requirements.md).
- Understand the [Data Box Gateway limits](data-box-gateway-limits.md).
- Deploy [Azure Data Box Gateway](data-box-gateway-deploy-prep.md) in Azure portal.

