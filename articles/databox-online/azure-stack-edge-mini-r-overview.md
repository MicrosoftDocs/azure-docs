---
title: Azure Stack Edge Mini R overview | Microsoft Docs
description: Describes Azure Stack Edge Mini R, a storage solution for military applications that uses a portable physical device with a battery for transfer over wi-fi into Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 05/22/2023
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Azure Stack Edge Mini R is and how it works so I can use it to process and transform data before sending to Azure.
---

# What is the Azure Stack Edge Mini R?

Azure Stack Edge Mini R is an ultra portable, rugged, edge computing device designed for use in harsh environments. Azure Stack Edge Mini R is delivered as a hardware-as-a-service solution. Microsoft ships you a cloud-managed device that acts as network storage gateway and has a built-in Vision Processing Unit (VPU) that enables accelerated AI-inferencing.

This article provides you an overview of the Azure Stack Edge Mini R solution, key capabilities, and the scenarios where you can deploy this device.


## Key capabilities

Azure Stack Edge Mini R has the following capabilities:

|Capability |Description  |
|---------|---------|
|Rugged hardware| Rugged hardware designed for harsh environments.|
|Ultra portable| Ultra portable, battery-operated form factor.|
|Cloud-managed|Device and service are managed via the Azure portal.|
|Edge compute workloads|Allows analysis, processing, filtering of data.<br>Supports VMs and containerized workloads. <ul><li>For information on VM workloads, see [VM overview on Azure Stack Edge](azure-stack-edge-gpu-virtual-machine-overview.md).</li> <li>For containerized workloads, see [Kubernetes overview on Azure Stack Edge](azure-stack-edge-gpu-kubernetes-overview.md)</li></ul>  |
|Accelerated AI inferencing| Enabled by the Intel Movidius Myriad X VPU. |
|Wired and wireless | Allows wired and wireless data transfers.|
|Data access     | Direct data access from Azure Storage Blobs and Azure Files using cloud APIs for additional data processing in the cloud. Local cache on the device is used for fast access of most recently used files.|
|Disconnected mode|  Deploy, run, manage applications in offline mode. <br> Disconnected mode supports offline upload scenarios.|
|Supported file transfer protocols      |Supports standard SMB, NFS, and REST protocols for data ingestion. <br> For more information on supported versions, go to [Azure Stack Edge Mini R system requirements](azure-stack-edge-gpu-system-requirements.md).|
|Data refresh     | Ability to refresh local files with the latest from cloud. <br> For more information, see [Refresh a share on your Azure Stack Edge](azure-stack-edge-gpu-manage-shares.md#refresh-shares).|
|Double encryption    | Use of self-encrypting drive provides the first layer of encryption. VPN provides the second layer of encryption. BitLocker support to locally encrypt data and secure data transfer to cloud over *https* . <br> For more information, see [Configure VPN on your Azure Stack Edge Pro R device](azure-stack-edge-mini-r-configure-vpn-powershell.md).|
|Bandwidth throttling| Throttle to limit bandwidth usage during peak hours. <br> For more information, see [Manage bandwidth schedules on your Azure Stack Edge](azure-stack-edge-gpu-manage-bandwidth-schedules.md).|
|Easy ordering| Bulk ordering and tracking of the device via Azure Edge Hardware Center. <br> For more information, see [Order a device via Azure Edge Hardware Center](azure-stack-edge-gpu-deploy-prep.md#create-a-new-resource).|

## Use cases

Here are the various scenarios where Azure Stack Edge Mini R can be used for rapid Machine Learning (ML) inferencing at the edge and preprocessing data before sending it to Azure.

- **Inference with Azure Machine Learning** - With Azure Stack Edge Mini R, you can run ML models to get quick results that can be acted on before the data is sent to the cloud. The full data set can optionally be transferred to continue to retrain and improve your ML models. For more information on how to use the Azure Machine Learning hardware accelerated models on the Azure Stack Edge Mini R device, see 
[Deploy Azure Machine Learning hardware accelerated models on Azure Stack Edge Mini R](../machine-learning/how-to-deploy-fpga-web-service.md#deploy-to-a-local-edge-server).

- **Preprocess data** - Transform data via compute options such as containers or virtual machines before sending it to Azure to create a more actionable dataset. Preprocessing can be used to:

    - Aggregate data.
    - Modify data, for example to remove personal data.
    - Subset data to optimize storage and bandwidth, or for further analysis.
    - Analyze and react to IoT Events.

- **Transfer data over network to Azure** - Use Azure Stack Edge Mini R to easily and quickly transfer data to Azure to enable further compute and analytics or for archival purposes.

## Components

The Azure Stack Edge Mini R solution comprises an Azure Stack Edge resource, Azure Stack Edge Mini R rugged, ultra portable physical device, and a local web UI.

* **Azure Stack Edge Mini R physical device** - An ultra portable, rugged, compute and storage device supplied by Microsoft. The device has an onboard battery and weighs less than 7 lbs.

    ![Azure Stack Edge Mini R device](media/azure-stack-edge-mini-r-overview/perspective-view-1.png)

    [!INCLUDE [azure-stack-edge-gateway-edge-hardware-center-overview](../../includes/azure-stack-edge-gateway-edge-hardware-center-overview.md)]    

    For more information, go to [Create an order for your Azure Stack Edge Mini R device](azure-stack-edge-mini-r-deploy-prep.md#create-a-new-resource).

* **Azure Stack Edge resource** – A resource in the Azure portal that lets you manage a rugged, Azure Stack Edge Mini R device from a web interface that you can access from different geographical locations. Use the Azure Stack Edge resource to create and manage resources, view, and manage devices and alerts, and manage shares.  

* **Azure Stack Edge Mini R local web UI** - A browser-based local user interface on your Azure Stack Edge Mini R device primarily intended for the initial configuration of the device. Use the local web UI also to run diagnostics, shut down and restart the Azure Stack Edge Pro device, view copy logs, and contact Microsoft Support to file a service request.

    [!INCLUDE [azure-stack-edge-gateway-local-web-ui-languages](../../includes/azure-stack-edge-gateway-local-web-ui-languages.md)]

## Region availability

Azure Stack Edge Mini R physical device, Azure resource, and target storage account to which you transfer data do not all have to be in the same region.

- **Resource availability** - For a list of all the regions where the Azure Stack Edge resource is available, go to [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). 

- **Device availability** - For a list of all the countries/regions where the Azure Stack Edge Mini R device is available, go to Availability section in the Azure Stack Edge Mini R tab for [Azure Stack Edge Mini R pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/#azureStackEdgeMiniR).

- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions. The regions where the storage accounts store Azure Stack Edge Mini R data should be located close to where the device is located for optimum performance. A storage account located far from the device results in long latencies and slower performance.

Azure Stack Edge service is a non-regional service. For more information, see [Regions and Availability Zones in Azure](../availability-zones/az-overview.md). Azure Stack Edge service does not have dependency on a specific Azure region, making it resilient to zone-wide outages and region-wide outages.

For a discussion of considerations for choosing a region for the Azure Stack Edge service, device, and data storage, see [Choosing a region for Azure Stack Edge](azure-stack-edge-gpu-regions.md).

[!INCLUDE [azure-stack-edge-use-case-parameters](../../includes/azure-stack-edge-use-case-parameters.md)]

## Next steps

- Review the [Azure Stack Edge Mini R system requirements](azure-stack-edge-mini-r-system-requirements.md).
