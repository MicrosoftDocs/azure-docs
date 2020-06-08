---
title: Microsoft Azure Stack Edge overview | Microsoft Docs
description: Describes Azure Stack Edge, a storage solution that uses a physical device for network-based transfer into Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 11/04/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Azure Stack Edge is and how it works so I can use it to process and transform data before sending to Azure.
---
# What is Azure Stack Edge?

[!INCLUDE [data-box-edge-gateway-rename-note](../../includes/data-box-edge-gateway-rename-note.md)]

Azure Stack Edge is an AI-enabled edge computing device with network data transfer capabilities. This article provides you an overview of the Azure Stack Edge solution, benefits, key capabilities, and the scenarios where you can deploy this device.

Azure Stack Edge is a Hardware-as-a-service solution. Microsoft ships you a cloud-managed device with a built-in Field Programmable Gate Array (FPGA) that enables accelerated AI-inferencing and has all the capabilities of a network storage gateway. 

## Use cases

Here are the various scenarios where Azure Stack Edge can be used for rapid Machine Learning (ML) inferencing at the edge and preprocessing data before sending it to Azure.

- **Inference with Azure Machine Learning** - With Azure Stack Edge, you can run ML models to get quick results that can be acted on before the data is sent to the cloud. The full data set can optionally be transferred to continue to retrain and improve your ML models. For more information on how to use the Azure ML hardware accelerated models on the Azure Stack Edge device, see 
[Deploy Azure ML hardware accelerated models on Azure Stack Edge](https://docs.microsoft.com/azure/machine-learning/how-to-deploy-fpga-web-service#deploy-to-a-local-edge-server).

- **Preprocess data** - Transform data before sending it to Azure to create a more actionable dataset. Preprocessing can be used to: 

    - Aggregate data.
    - Modify data, for example to remove personal data.
    - Subset data to optimize storage and bandwidth, or for further analysis.
    - Analyze and react to IoT Events. 

- **Transfer data over network to Azure** - Use Azure Stack Edge to easily and quickly transfer data to Azure to enable further compute and analytics or for archival purposes. 

## Key capabilities

Azure Stack Edge has the following capabilities:

|Capability |Description  |
|---------|---------|
|Accelerated AI inferencing| Enabled by the built-in FPGA.|
|Computing       |Allows analysis, processing, filtering of data.|
|High performance | High performance compute and data transfers.|
|Data access     | Direct data access from Azure Storage Blobs and Azure Files using cloud APIs for additional data processing in the cloud. Local cache on the device is used for fast access of most recently used files.|
|Cloud-managed     |Device and service are managed via the Azure portal.  |
|Offline upload     | Disconnected mode supports offline upload scenarios.|
|Supported protocols     | Support for standard SMB and NFS protocols for data ingestion. <br> For more information on supported versions, see [Azure Stack Edge system requirements](azure-stack-edge-system-requirements.md).|
|Data refresh     | Ability to refresh local files with the latest from cloud.|
|Encryption    | BitLocker support to locally encrypt data and secure data transfer to cloud over *https*.|
|Bandwidth throttling| Throttle to limit bandwidth usage during peak hours.|
|ExpressRoute | Added security through ExpressRoute. Use peering configuration where traffic from local devices to the cloud storage endpoints travels over the ExpressRoute. For more information, see [ExpressRoute overview](../expressroute/expressroute-introduction.md).

## Components

The Azure Stack Edge solution comprises of Azure Stack Edge resource, Azure Stack Edge physical device, and a local web UI.

* **Azure Stack Edge physical device** - A 1U rack-mounted server supplied by Microsoft that can be configured to send data to Azure.
    
* **Azure Stack Edge resource** – a resource in the Azure portal that lets you manage an Azure Stack Edge device from a web interface that you can access from different geographical locations. Use the Azure Stack Edge resource to create and manage resources, view, and manage devices and alerts, and manage shares.  

    <!--![The Azure Stack Edge service in Azure portal](media/data-box-overview/data-box-Edge-service1.png)-->

    For more information, go to [Create an order for your Azure Stack Edge device](azure-stack-edge-deploy-prep.md#create-a-new-resource).

* **Azure Stack Edge local web UI** - Use the local web UI to run diagnostics, shut down and restart the Azure Stack Edge device, view copy logs, and contact Microsoft Support to file a service request.

    <!--![The Azure Stack Edge local web UI](media/data-box-Edge-overview/data-box-Edge-local-web-ui.png)-->

    For information about using the web-based UI, go to [Use the web-based UI to administer your Azure Stack Edge](azure-stack-edge-manage-access-power-connectivity-mode.md).

## Region availability

Azure Stack Edge physical device, Azure resource, and target storage account to which you transfer data do not all have to be in the same region.

- **Resource availability** - For a list of all the regions where the Azure Stack Edge resource is available, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). Azure Stack Edge can also be deployed in the Azure Government Cloud. For more information, see [What is Azure Government?](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome).
    
- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions. The regions where the storage accounts store Azure Stack Edge data should be located close to where the device is located for optimum performance. A storage account located far from the device results in long latencies and slower performance.

## Next steps

- Review the [Azure Stack Edge system requirements](azure-stack-edge-system-requirements.md).
- Understand the [Azure Stack Edge limits](azure-stack-edge-limits.md).
- Deploy [Azure Stack Edge](azure-stack-edge-deploy-prep.md) in Azure portal.
