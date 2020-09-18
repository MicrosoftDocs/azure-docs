---
title: Microsoft Azure Stack Edge Pro R overview | Microsoft Docs
description: Describes Azure Stack Edge Pro R devices, a storage solution for military applications that uses a physical device for network-based transfer into Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 09/09/2020
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Azure Stack Edge Pro R is and how it works so I can use it to process and transform data before sending to Azure.
---

# What is the Azure Stack Edge Pro R?

The Azure Stack Edge Pro R is a Hardware-as-a-service solution. Microsoft ships you a durable, rugged, server class, portable edge device for over the network data transfer to Azure. Equipped with a Graphical Processing Unit (GPU), these devices are optimized for AI, analytics, and serverless computing. The rugged devices are appropriate for use in the harshest environments.

This article provides you an overview of the Azure Stack Edge Pro R solution, key capabilities, and the scenarios where you can deploy this device.


## Key capabilities

Azure Stack Edge Pro R has the following capabilities:

|Capability |Description  |
|---------|---------|
|Rugged, portable hardware| Rugged 85 lb. server class hardware designed for harshest environments. Device portable in a 2-person carry case. |
|Cloud-managed     |Device and service are managed via the Azure portal.|
|Edge compute workloads   |Allows analysis, processing, filtering of data. Supports VMs and containerized workloads.|
|Accelerated AI inferencing| Enabled by an Nvidia T4 GPU.|
|High performance | High performance compute and data transfers.|
|Data access     | Direct data access from Azure Storage Blobs and Azure Files using cloud APIs for additional data processing in the cloud. Local cache on the device is used for fast access of most recently used files.|
|Disconnected mode| Device and service can be optionally managed via Azure Stack. <br> Deploy, run, manage applications in offline mode. <br> Disconnected mode supports offline upload scenarios.|
|Supported protocols     |Support for standard SMB, NFS, and REST protocols for data ingestion. <br> For more information on supported versions, go to [Azure Stack Edge Pro R system requirements](azure-stack-edge-gpu-system-requirements.md).|
|Data refresh     | Ability to refresh local files with the latest from cloud.|
|Double encryption    | Use of self-encrypting drives provides the first layer of encryption. VPN provides the second layer of encryption. BitLocker support to locally encrypt data and secure data transfer to cloud over *https* .|
|Bandwidth throttling| Throttle to limit bandwidth usage during peak hours.|

<!--|Scale out file server| Available as 1-node and 4-node cluster configurations|-->

## Use cases

Here are the various scenarios where Azure Stack Edge Pro R can be used for rapid Machine Learning (ML) inferencing at the edge and preprocessing data before sending it to Azure.

- **Inference with Azure Machine Learning** - With Azure Stack Edge Pro R, you can run ML models to get quick results that can be acted on before the data is sent to the cloud. The full data set can optionally be transferred to continue to retrain and improve your ML models. For more information on how to use the Azure ML hardware accelerated models on the Azure Stack Edge Pro R device, see 
[Deploy Azure ML hardware accelerated models on Azure Stack Edge Pro R](https://docs.microsoft.com/azure/machine-learning/service/how-to-deploy-fpga-web-service#deploy-to-a-local-edge-server).

- **Preprocess data** - Transform data before sending it to Azure to create a more actionable dataset. Preprocessing can be used to:

    - Aggregate data.
    - Modify data, for example to remove personal data.
    - Subset data to optimize storage and bandwidth, or for further analysis.
    - Analyze and react to IoT Events.

- **Transfer data over network to Azure** - Use Azure Stack Edge Pro R to easily and quickly transfer data to Azure to enable further compute and analytics or for archival purposes.

## Components

The Azure Stack Edge Pro R solution comprises of an Azure Stack Edge resource, Azure Stack Edge Pro R rugged, physical device, and a local web UI.

- **Azure Stack Edge Pro R physical device** - The Azure Stack Edge Pro R is a 1-node device that can be configured to send data to Azure. The device is a 1U server with a rugged encasing supplied by Microsoft. Optionally, the server is available with a UPS (also 1U).

    ![The Azure Stack Edge Pro R 1-node device](media/azure-stack-edge-j-series-overview/device-image-1.png)

- **Azure Stack Edge resource** – A resource in the Azure portal that lets you manage a rugged, Azure Stack Edge Pro R device from a web interface that you can access from different geographical locations. Use the Azure Stack Edge resource to create and manage resources, view, and manage devices and alerts, and manage shares.  

- **Azure Stack Edge Pro R local web UI** - Use the local web UI for initial device configuration, to run diagnostics, shut down and restart the Azure Stack Edge Pro R device, view copy logs, and contact Microsoft Support to file a service request.


## Region availability

Azure Stack Edge Pro R physical device, Azure resource, and target storage account to which you transfer data do not all have to be in the same region.

- **Resource availability** - For a list of all the regions where the Azure Stack Edge resource is available, go to [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). 

- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions. The regions where the storage accounts store Azure Stack Edge Pro R data should be located close to where the device is located for optimum performance. A storage account located far from the device results in long latencies and slower performance.

## Next steps

- Review the [Azure Stack Edge Pro R system requirements](azure-stack-edge-gpu-system-requirements.md).
- Understand the [Azure Stack Edge Pro R limits](azure-stack-edge-limits.md).

