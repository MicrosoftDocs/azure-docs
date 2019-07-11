---
title: Microsoft Azure Data Box Edge overview | Microsoft Docs
description: Describes Azure Data Box Edge, a storage solution that uses a physical device for network based transfer into Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 07/09/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Data Box Edge is and how it works so I can use it to process and transform data before sending to Azure.
---
# What is Azure Data Box Edge? 

Azure Data Box Edge is a storage solution that allows you to process data and send it over network to Azure. This article provides you an overview of the Data Box Edge solution, benefits, key capabilities, and the scenarios where you can deploy this device. 

Data Box Edge uses a physical device supplied by Microsoft to accelerate the secure data transfer. The physical device resides in your premises and you write data to it using the NFS and SMB protocols. 

Data Box Edge has all the gateway capabilities of Data Box Gateway. Data Box is additionally equipped with AI-enabled edge computing capabilities that help analyze, process, or filter data as it moves to Azure block blob, page blob, or Azure Files.  

## Use cases

Azure Data Box Edge is an AI-enabled edge computing device with network data transfer capabilities. Here are the various scenarios where Data Box Edge can be used for data transfer.

- **Preprocess data** - Analyze data from on-premises or IoT devices to quickly get to result while staying close to where data is generated. Data Box Edge transfers the full data set to the cloud to perform more advanced processing or deeper analytics.  Preprocessing can be used to: 

    - Aggregate data.
    - Modify data, for example to remove Personally Identifiable Information (PII).
    - Subset and transfer the data needed for deeper analytics in the cloud.
    - Analyze and react to IoT Events. 

- **Inference Azure Machine Learning** - With Data Box Edge, you can run Machine Learning (ML) models to get quick results that can be acted on before the data is sent to the cloud. The full data set can be transferred to continue to retrain and improve your ML models. For more information on how to use the Azure ML hardware accelerated models on the Data Box Edge device, see 
[Deploy Azure ML hardware accelerated models on Data Box Edge](https://docs.microsoft.com/azure/machine-learning/service/how-to-deploy-fpga-web-service#deploy-to-a-local-edge-server).

- **Transfer data over network to Azure** - Use Data Box Edge to easily and quickly transfer data to Azure to enable further compute and analytics or for archival purposes. 

## Benefits

Data Box Edge has the following benefits:

- **Easy data transfer**- Makes moving data in and out of Azure storage as easy as working with a local network share.  
- **High performance** - Enables high-performance transfers to and from Azure. 
- **Fast access** - Caches most recent files for fast access of on-premises files.  
- **Limited bandwidth usage** - Data can be written to Azure even when the network is throttled to limit usage during peak business hours.  
- **Transform data** - Enables analysis, processing, or filtering of data as it moves to Azure.

## Key capabilities

Data Box Edge has the following capabilities:

|Capability |Description  |
|---------|---------|
|High performance     | Fully automated and highly optimized data transfer and bandwidth.|
|Supported protocols     | Support for standard SMB and NFS protocols for data ingestion. <br> For more information on supported versions, go to [Data Box Edge system requirements](data-box-edge-system-requirements.md).|
|Computing       |Allows analysis, processing, filtering of data.|
|Data access     | Direct data access from Azure Storage Blobs and Azure Files using cloud APIs for additional data processing in the cloud.|
|Fast access     | Local cache on the device for fast access of most recently used files.|
|Offline upload     | Disconnected mode supports offline upload scenarios.|
|Data refresh     | Ability to refresh local files with the latest from cloud.|
|Encryption    | BitLocker support to locally encrypt data and secure data transfer to cloud over *https*.       |
|Resiliency     | Built-in network resiliency.        |


## Components

The Data Box Edge solution comprises of Data Box Edge resource, Data Box Edge physical device, and a local web UI.

* **Data Box Edge physical device** - A 1U rack-mounted server supplied by Microsoft that can be configured to send data to Azure. 
    
* **Data Box Edge resource** – a resource in the Azure portal that lets you manage a Data Box Edge device from a web interface that you can access from different geographical locations. Use the Data Box Edge resource to create and manage resources, view, and manage devices and alerts, and manage shares.  

    <!--![The Data Box Edge service in Azure portal](media/data-box-overview/data-box-Edge-service1.png)-->

    For more information, go to [Create an order for your Data Box Edge device](data-box-edge-deploy-prep.md#create-a-new-resource).

* **Data Box local web UI** - Use the local web UI to run diagnostics, shut down and restart the Data Box Edge device, view copy logs, and contact Microsoft Support to file a service request.

    <!--![The Data Box Edge local web UI](media/data-box-Edge-overview/data-box-Edge-local-web-ui.png)-->

    For information about using the web-based UI, go to [Use the web-based UI to administer your Data Box](data-box-edge-manage-access-power-connectivity-mode.md).


## Region availability

Data Box Edge physical device, Azure resource, and target storage account to which you transfer data do not all have to be in the same region.

- **Resource availability** - For a list of all the regions where the Data Box Edge resource is available, go to [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). Data Box Edge can also be deployed in the Azure Government Cloud. For more information, see [What is Azure Government?](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome).
    
- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions. The regions where the storage accounts store Data Box Edge data should be located close to where the device is located for optimum performance. A storage account located far from the device results in long latencies and slower performance. 


## Next steps

- Review the [Data Box Edge system requirements](data-box-edge-system-requirements.md).
- Understand the [Data Box Edge limits](data-box-edge-limits.md).
- Deploy [Azure Data Box Edge](data-box-edge-deploy-prep.md) in Azure portal.




