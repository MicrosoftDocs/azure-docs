---
title: Microsoft Azure Stack Edge Rugged series overview | Microsoft Docs
description: Describes Azure Stack Edge Rugged series, a storage solution for military applications that uses a physical device for network-based transfer into Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 12/12/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Azure Stack Edge is and how it works so I can use it to process and transform data before sending to Azure.
---
# What is Azure Stack Edge Rugged series?

Azure Stack Edge Rugged series comprises of an AI-enabled edge computing device with network data transfer capabilities. This article provides you an overview of the Azure Stack Edge Rugged series solution, benefits, key capabilities, and the scenarios where you can deploy this device.

Azure Stack Edge Rugged series is a Hardware-as-a-service solution. Microsoft ships you a rugged, cloud-managed device with a built-in Field Programmable Gate Array (FPGA) or a Graphics Processing Unit (GPU) that enables accelerated AI-inferencing and has all the capabilities of a network storage gateway.

## Available models

Azure Stack Edge is offered as:

- **Azure Stack Edge commercial series** - The commercial series is tailored for most commercial scenarios, such as retail stores and datacenters.
- **Azure Stack Edge rugged series** - The rugged series is tailored for harsh environmental or field conditions, such as in defense, disaster relief, geological surveys, and energy. Rugged and portable form factors are available. The rugged series is available as the following SKUs:


|Model description  |Cluster |Configuration |
|---------|---------|---------|
|Azure Stack Edge Rugged with FPGA or GPU   | 1-node | Device in rugged case<br>Device + UPS in rugged case <br>Device + heater in rugged case<br>Device with UPS + heater in rugged case        |
|Azure Stack Edge Rugged with FPGA or GPU   |  4-node | 4 single-node device + heater in rugged case, 4 UPS in second rugged case |
|Azure Stack Edge Rugged with VPU |  Portable | With battery |


## Use cases

Here are the various scenarios where Azure Stack Edge can be used for rapid Machine Learning (ML) inferencing at the edge and preprocessing data before sending it to Azure.

- **Inference with Azure Machine Learning** - With Azure Stack Edge, you can run ML models to get quick results that can be acted on before the data is sent to the cloud. The full data set can optionally be transferred to continue to retrain and improve your ML models. For more information on how to use the Azure ML hardware accelerated models on the Azure Stack Edge device, see 
[Deploy Azure ML hardware accelerated models on Azure Stack Edge](https://docs.microsoft.com/azure/machine-learning/service/how-to-deploy-fpga-web-service#deploy-to-a-local-edge-server).

- **Preprocess data** - Transform data before sending it to Azure to create a more actionable dataset. Preprocessing can be used to:

    - Aggregate data.
    - Modify data, for example to remove personal data.
    - Subset data to optimize storage and bandwidth, or for further analysis.
    - Analyze and react to IoT Events.

- **Transfer data over network to Azure** - Use Azure Stack Edge to easily and quickly transfer data to Azure to enable further compute and analytics or for archival purposes.


## Key capabilities

Azure Stack Edge Rugged series has the following capabilities:

|Capability |Description  |
|---------|---------|
|Accelerated AI inferencing| Enabled by the built-in FPGA, GPU, or the VPU depending on the model.|
|Edge compute workloads      |Allows analysis, processing, filtering of data. Supports VMs and Kubernetes clusters.|
|High performance | High performance compute and data transfers.|
|Data access     | Direct data access from Azure Storage Blobs and Azure Files using cloud APIs for additional data processing in the cloud. Local cache on the device is used for fast access of most recently used files.|
|Cloud-managed     |Device and service are managed via the Azure portal.|
|Disconnected mode| Device and service are managed via Azure Stack.|
|Rugged hardware| Rugged hardware designed for harsh environmental conditions.|
|Portable| A battery operated, portable form factor is also available.|
|Offline upload     |Disconnected mode supports offline upload scenarios.|
|Scale out file server| Available as 1-node and 4-node cluster configurations|
|Supported protocols     |Support for standard SMB, NFS, and REST protocols for data ingestion. <br> For more information on supported versions, go to [Azure Stack Edge system requirements](azure-stack-edge-r-series-system-requirements.md).|
|Data refresh     | Ability to refresh local files with the latest from cloud.|
|Dual encryption    | Use of self-encrypting drives provides the first layer of encryption. VPN provides the second layer of encryption. BitLocker support to locally encrypt data and secure data transfer to cloud over *https* .|
|Bandwidth throttling| Throttle to limit bandwidth usage during peak hours.|


## Components

The Azure Stack Edge solution comprises of an Azure Stack Edge resource, Azure Stack Edge rugged, physical device, and a local web UI.

* **Azure Stack Edge physical device** - A 1U server with a rugged encasing supplied by Microsoft that can be configured to send data to Azure. Optionally, the server is available with a UPS (also 1U) and a heater.

    ![The Azure Stack Edge service in Azure portal](media/azure-stack-edge-r-series-overview/device-image-1.png)

* **Azure Stack Edge resource** – A resource in the Azure portal that lets you manage a rugged, Azure Stack Edge device from a web interface that you can access from different geographical locations. Use the Azure Stack Edge resource to create and manage resources, view, and manage devices and alerts, and manage shares.  

    <!--![The Azure Stack Edge service in Azure portal](media/azure-stack-edge-r-series-overview/service-image-1.png)-->

    For more information, go to [Create an order for your Azure Stack Edge device](azure-stack-edge-r-series-placeholder.md).

* **Azure Stack Edge local web UI** - Use the local web UI for initial device configuration, to run diagnostics, shut down and restart the Azure Stack Edge device, view copy logs, and contact Microsoft Support to file a service request.

    <!--![The Azure Stack Edge local web UI](media/azure-stack-edge-r-series-overview/local-web-ui-image-1.png)-->

    For information about using the web-based UI, go to [Use the web-based UI to administer your Azure Stack Edge](azure-stack-edge-r-series-placeholder.md).


## Region availability

Azure Stack Edge physical device, Azure resource, and target storage account to which you transfer data do not all have to be in the same region.

- **Resource availability** - For a list of all the regions where the Azure Stack Edge resource is available, go to [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). Azure Stack Edge can also be deployed in the Azure Government Cloud. For more information, see [What is Azure Government?](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome).
    
- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions. The regions where the storage accounts store Azure Stack Edge data should be located close to where the device is located for optimum performance. A storage account located far from the device results in long latencies and slower performance.


## Next steps

- Review the [Azure Stack Edge system requirements](azure-stack-edge-r-series-system-requirements.md).
- Understand the [Azure Stack Edge limits](azure-stack-edge-r-series-limits.md).
- Deploy [Azure Azure Stack Edge](azure-stack-edge-r-series-placeholder.md) in Azure portal.

