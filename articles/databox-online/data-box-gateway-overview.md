---
title: Microsoft Azure Data Box Gateway overview | Microsoft Docs
description: Describes Azure Data Box Gateway, a virtual appliance storage solution that enables you to transfer data into Azure
services: databox
author: alkohli

ms.service: databox
ms.topic: overview
ms.date: 09/24/2018
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Data Box Gateway is and how it works so I can use it to send data to Azure.
---
# What is Azure Data Box Gateway (Preview)? 

Azure Data Box Gateway is a storage solution that enables you to seamlessly send data to Azure. This article provides you an overview of the Azure Data Box Gateway solution, benefits, key capabilities, and the scenarios where you can deploy this device. 

Data Box Gateway is a virtual device based on a virtual machine provisioned in your virtualized environment or hypervisor. The virtual device resides in your premises and you write data to it using the NFS and SMB protocols. The device then transfers your data to Azure block blob, page blob, or Azure Files. 

> [!IMPORTANT]
> Data Box Gateway is in Preview. Please review the [terms of use for the preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution.

## Use cases

Data Box Gateway can be leveraged for transferring data to the cloud such as cloud archival, disaster recovery, or if there is a need to process your data at cloud scale. Here are the various scenarios where Data Box Gateway can be used for data transfer.

- **Cloud archival** - Copy hundreds of TBs of data to Azure storage using Data Box Gateway in a secure and efficient manner. The data can be ingested one time or an ongoing basis for archival scenarios.

- **Data aggregation** - Aggregate data from multiple sources into a single location in Azure Storage for data processing and analytics.  

- **Integration with on-premises workloads** - Integrate with on-premises workloads such as backup and restore that use cloud storage and need local access for commonly used files. 

## Benefits

Data Box Gateway has the following benefits:

- **Easy data transfer**- Makes it easy to move data in and out of Azure storage as easy as working with a local network share.  
- **High performance** - Takes the hassle out of network data transport with high-performance transfers to and from Azure. 
- **Fast access** - Caches most recent files for fast access of on-premises files.  
- **Limited bandwidth usage** - Data can be written to Azure even when the network is throttled to limit usage during peak business hours.  

## Key capabilities

Data Box Gateway has the following capabilities:

|Capability |Description  |
|---------|---------|
|Speed     | Fully automated and highly optimized data transfer and bandwidth.|
|Supported protocols     | Support for standard SMB and NFS protocols for data ingestion. <br> For more information on supported versions, go to [Data Box Gateway system requirements](data-box-gateway-system-requirements.md).|
|Data access     | Direct data access from Azure Storage Blobs and Azure Files using cloud APIs for additional data processing in the cloud.|
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
| Memory  | Minimum 8 GB|
| Availability|Single node|
| Disks| OS disk: 250 GB <br> Data disk: 2 TB minimum, thin provisioned, and must be backed by SSDs|
| Network interfaces|1 or more virtual network interface|
| Native file sharing protocols|SMB and NFS  |
| Security| Authentication to unlock access to device and data <br> Data-in-flight encrypted using AES-256 bit encryption|
| Management| Local web UI - Initial setup, diagnostics, and power management of device <br> Azure portal - day-to-day management of Data Box Gateway devices       |


## Components

The Data Box Gateway solution comprises of Data Box Gateway resource, Data Box Gateway virtual device, and a local web UI.

* **Data Box Gateway virtual device** - A device based on a virtual machine provisioned in your virtualized environment or hypervisor and allows you to send data to Azure. 
    
* **Data Box Gateway resource** – A resource in the Azure portal that lets you manage a Data Box Gateway device from a web interface that you can access from different geographical locations. Use the Data Box Gateway resource to create and manage resources, view, and manage devices and alerts, and manage shares.  

    <!--![The Data Box Gateway service in Azure portal](media/data-box-overview/data-box-Gateway-service1.png)-->

    <!--For more information, go to [Use the Data Box Gateway service to administer your Data Box Gateway device](data-box-gateway-portal-ui-admin.md).-->

* **Data Box local web UI** - Use the local web UI to run diagnostics, shut down and restart the Data Box Gateway device, view copy logs, and contact Microsoft Support to file a service request.

    <!--![The Data Box Gateway local web UI](media/data-box-gateway-overview/data-box-gateway-local-web-ui.png)-->

    <!-- For information about using the web-based UI, go to [Use the web-based UI to administer your Data Box](data-box-gateway-portal-ui-admin.md).-->


## Region availability

Data Box Edge physical device, Azure resource, and target storage account to which you transfer data do not all have to be in the same region.

- **Resource availability** - For this release, the Data Box Edge resource is available in the following regions:
    - **United States** - West US2 and East US
    - **European Union** - West Europe
    - **Asia Pacific** - SE Asia

- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions. 

    The regions where the storage accounts store Data Box data should be located close to where the device is located for optimum performance. A storage account located far from the device results in long latencies and slower performance. 


## Next steps

- Review the [Data Box Gateway system requirements](data-box-gateway-system-requirements.md).
- Understand the [Data Box Gateway limits](data-box-gateway-limits.md).
- Deploy [Azure Data Box Gateway](data-box-gateway-deploy-prep.md) in Azure portal.




