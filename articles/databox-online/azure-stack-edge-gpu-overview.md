---
title: Microsoft Azure Stack Edge Pro with GPU overview | Microsoft Docs
description: Describes Azure Stack Edge Pro with GPU, a storage solution that uses a physical device for network-based transfer into Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 05/22/2023
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Azure Stack Edge Pro GPU is and how it works so I can use it to process and transform data before sending it to Azure.
---
# What is Azure Stack Edge Pro with GPU?

Azure Stack Edge Pro with GPU is an AI-enabled edge computing device with network data transfer capabilities. This article provides you an overview of the Azure Stack Edge Pro solution, benefits, key capabilities, and scenarios where you can deploy this device. The article also explains the pricing model for your device.

Azure Stack Edge Pro with GPU is a Hardware-as-a-Service solution. Microsoft ships you a cloud-managed device that acts as a network storage gateway. A built-in Graphical Processing Unit (GPU) enables accelerated AI-inferencing.

## Use cases

Here are the various scenarios where Azure Stack Edge Pro GPU can be used for rapid Machine Learning (ML) inferencing at the edge and preprocessing data before sending it to Azure.

- **Inference with Azure Machine Learning** - With Azure Stack Edge Pro GPU, you can run ML models to get quick results that can be acted on before the data is sent to the cloud. The full data set can optionally be transferred to continue to retrain and improve your ML models. For more information, see how to use 
[Deploy Azure Machine Learning hardware accelerated models on Azure Stack Edge Pro GPU](../machine-learning/how-to-deploy-fpga-web-service.md#deploy-to-a-local-edge-server).

- **Preprocess data** - Transform data before sending it to Azure via compute options such as containerized workloads and Virtual Machines to create a more actionable dataset. Preprocessing can be used to: 

    - Aggregate data.
    - Modify data, for example to remove personal data.
    - Subset data to optimize storage and bandwidth, or for further analysis.
    - Analyze and react to IoT Events. 

- **Transfer data over network to Azure** - Use Azure Stack Edge Pro GPU to easily and quickly transfer data to Azure to enable further compute and analytics or for archival purposes. 

## Key capabilities

Azure Stack Edge Pro GPU has the following capabilities:

|Capability |Description  |
|---------|---------|
|Accelerated AI inferencing| Enabled by the built-in GPU (one or two depending on the model). <br> For more information, see [GPU sharing on your Azure Stack Edge device](azure-stack-edge-gpu-sharing.md).|
|Edge computing      |Supports VM and containerized workloads to allow analysis, processing, and filtering of data. <ul><li>For information on VM workloads, see [VM overview on Azure Stack Edge](azure-stack-edge-gpu-virtual-machine-overview.md).</li> <li>For containerized workloads, see [Kubernetes overview on Azure Stack Edge](azure-stack-edge-gpu-kubernetes-overview.md)</li></ul> |
|Data access     | Direct data access from Azure Storage Blobs and Azure Files using cloud APIs for additional data processing in the cloud. Local cache on the device is used for fast access of most recently used files.|
|Cloud-managed     |Device and service are managed via the Azure portal.|
|Offline upload     | Disconnected mode supports offline upload scenarios.|
|Supported file transfer protocols      | Support for standard Server Message Block (SMB), Network File System (NFS), and Representational State Transfer (REST) protocols for data ingestion. <br> For more information on supported versions, see [Azure Stack Edge Pro GPU system requirements](azure-stack-edge-system-requirements.md).|
|Data refresh     | Ability to refresh local files with the latest from cloud. <br> For more information, see [Refresh a share on your Azure Stack Edge](azure-stack-edge-gpu-manage-shares.md#refresh-shares).|
|Encryption    | BitLocker support to locally encrypt data and secure data transfer to cloud over *https*.|
|Bandwidth throttling| Throttle to limit bandwidth usage during peak hours. <br> For more information, see [Manage bandwidth schedules on your Azure Stack Edge](azure-stack-edge-gpu-manage-bandwidth-schedules.md).|
|Easy ordering| Bulk ordering and tracking of the device via Azure Edge Hardware Center (Preview). <br> For more information, see [Order a device via Azure Edge Hardware Center](azure-stack-edge-gpu-deploy-prep.md#create-a-new-resource).|
|Scale out | Devices can be deployed as a single node or a two-node cluster. For more information, see [What is clustering on Azure Stack Edge?](azure-stack-edge-gpu-clustering-overview.md).|
|Specialized network functions|Use the Marketplace experience from Azure Network Function Manager to rapidly deploy network functions such as mobile packet core, SD-WAN edge, and VPN services to an Azure Stack Edge device running in your on-premises environment. For more information, see [What is Azure Network Function Manager? (Preview)](../network-function-manager/overview.md).|

<!--|ExpressRoute | Added security through ExpressRoute. Use peering configuration where traffic from local devices to the cloud storage endpoints travels over the ExpressRoute. For more information, see [ExpressRoute overview](../expressroute/expressroute-introduction.md).|-->

## Components

The Azure Stack Edge Pro GPU solution includes the Azure Stack Edge resource, Azure Stack Edge Pro GPU physical device, and a local web UI.

* **Azure Stack Edge Pro GPU physical device** - A 1U rack-mounted server supplied by Microsoft that can be configured to send data to Azure.

    [!INCLUDE [azure-stack-edge-gateway-edge-hardware-center-overview](../../includes/azure-stack-edge-gateway-edge-hardware-center-overview.md)]

    For more information, go to [Create an order for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-prep.md#create-a-new-resource).
    
    The devices can be deployed as a single node or a two-node cluster. For more information, see [What is clustering for Azure Stack Edge?](azure-stack-edge-gpu-clustering-overview.md) and how to [Deploy a two-node cluster](azure-stack-edge-gpu-deploy-prep.md). 

* **Azure Stack Edge resource** – A resource in the Azure portal that lets you manage an Azure Stack Edge Pro GPU device from a web interface that you can access from different geographical locations. Use the Azure Stack Edge resource to create and manage resources, view, and manage devices and alerts, and manage shares.  
   

* **Azure Stack Edge Pro GPU local web UI** - A browser-based local user interface on your Azure Stack Edge Pro GPU device primarily intended for the initial configuration of the device. Use the local web UI also to run diagnostics, shut down and restart the Azure Stack Edge Pro GPU device, view copy logs, and contact Microsoft Support to file a service request.

    [!INCLUDE [azure-stack-edge-gateway-local-web-ui-languages](../../includes/azure-stack-edge-gateway-local-web-ui-languages.md)]
    
    For information about using the web-based UI, go to [Use the web-based UI to administer your Azure Stack Edge Pro GPU](azure-stack-edge-manage-access-power-connectivity-mode.md).

## Region availability

Azure Stack Edge Pro GPU physical device, Azure resource, and target storage account to which you transfer data don’t all have to be in the same region.

- **Resource availability** - For this release, the resource is available in East US, West EU, and South East Asia regions.

- **Device availability** - For a list of all the countries/regions where the Azure Stack Edge Pro GPU device is available, go to **Availability** section in the **Azure Stack Edge Pro** tab for [Azure Stack Edge Pro GPU pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/#azureStackEdgePro).
    
- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions. For best performance, the regions where the storage accounts store Azure Stack Edge Pro GPU data should be close to the device location. A storage account located far from the device results in long latencies and slower performance.

Azure Stack Edge service is a non-regional service. For more information, see [Regions and Availability Zones in Azure](../availability-zones/az-overview.md). Azure Stack Edge service doesn’t have dependency on a specific Azure region, making it resilient to zone-wide outages and region-wide outages.

For a discussion of considerations for choosing a region for the Azure Stack Edge service, device, and data storage, see [Choosing a region for Azure Stack Edge](azure-stack-edge-gpu-regions.md).

[!INCLUDE [azure-stack-edge-use-case-parameters](../../includes/azure-stack-edge-use-case-parameters.md)]

## Billing model

The users are charged a monthly, recurring subscription fee for an Azure Stack Edge device. In addition, there’s a onetime fee for shipping. There’s no on-premises software license for the device although guest virtual machine (VMs) may require their own licenses under Bring Your Own License (BYOL).

Currency conversion and discounts are handled centrally by the Azure Commerce billing platform, and you get one unified, itemized bill at the end of each month.

Standard [storage rates and transaction fees](https://azure.microsoft.com/pricing/details/storage/blobs/) are charged separately as applicable. Monthly subscription fee billing starts after delivery whether the appliance is activated or not.

The billing happens against the order resource. If you activate the device against a different resource, the order and billing details move to the new resource.

For more information, see [FAQ: Billing for Azure Stack Edge Pro GPU](./azure-stack-edge-gpu-faq-billing-model.yml).

## Next steps

- Review the [Azure Stack Edge Pro GPU system requirements](azure-stack-edge-gpu-system-requirements.md).

- Understand the [Azure Stack Edge Pro GPU limits](azure-stack-edge-limits.md).

- Deploy [Azure Stack Edge Pro GPU](azure-stack-edge-gpu-deploy-prep.md) in Azure portal.
