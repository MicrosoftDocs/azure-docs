---
title: Microsoft Azure Stack Edge Pro FPGA overview | Microsoft Docs
description: Describes Azure Stack Edge Pro FPGA, a storage solution that uses a physical device for network-based transfer into Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 07/01/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Azure Stack Edge Pro FPGA is and how it works so I can use it to process and transform data before sending to Azure.
---
# What is Azure Stack Edge Pro FPGA?

[!INCLUDE [Azure Stack Edge Pro FPGA end-of-life](../../includes/azure-stack-edge-fpga-eol.md)]

Azure Stack Edge Pro with FPGA is an AI-enabled edge computing device with network data transfer capabilities. This article provides you an overview of the Azure Stack Edge Pro with FPGA solution, benefits, key capabilities, and deployment scenarios.

Azure Stack Edge Pro with FPGA is a Hardware-as-a-service solution. Microsoft ships you a cloud-managed device with a built-in Field Programmable Gate Array (FPGA) that enables accelerated AI-inferencing and has all the capabilities of a network storage gateway.

Azure Data Box Edge is rebranded as Azure Stack Edge.

## Use cases

Here are the various scenarios where Azure Stack Edge Pro FPGA can be used for rapid Machine Learning (ML) inferencing at the edge and preprocessing data before sending it to Azure.

- **Inference with Azure Machine Learning** - With Azure Stack Edge Pro FPGA, you can run ML models to get quick results that can be acted on before the data is sent to the cloud. The full data set can optionally be transferred to continue to retrain and improve your ML models. For more information on how to use the Azure ML hardware accelerated models on the Azure Stack Edge Pro FPGA device, see 
[Deploy Azure ML hardware accelerated models on Azure Stack Edge Pro FPGA](../machine-learning/how-to-deploy-fpga-web-service.md#deploy-to-a-local-edge-server).

- **Preprocess data** - Transform data before sending it to Azure to create a more actionable dataset. Preprocessing can be used to: 

    - Aggregate data.
    - Modify data, for example to remove personal data.
    - Subset data to optimize storage and bandwidth, or for further analysis.
    - Analyze and react to IoT Events. 

- **Transfer data over network to Azure** - Use Azure Stack Edge Pro FPGA to easily and quickly transfer data to Azure to enable further compute and analytics or for archival purposes. 

## Key capabilities

Azure Stack Edge Pro FPGA has the following capabilities:

|Capability |Description  |
|---------|---------|
|Accelerated AI inferencing| Enabled by the built-in FPGA.|
|Computing       |Allows analysis, processing, filtering of data.|
|High performance | High-performance compute and data transfers.|
|Data access     | Direct data access from Azure Storage Blobs and Azure Files using cloud APIs for additional data processing in the cloud. Local cache on the device is used for fast access of most recently used files.|
|Cloud-managed     |Device and service are managed via the Azure portal.  |
|Offline upload     | Disconnected mode supports offline upload scenarios.|
|Supported protocols     | Support for standard SMB and NFS protocols for data ingestion. <br> For more information on supported versions, see [Azure Stack Edge Pro FPGA system requirements](azure-stack-edge-system-requirements.md).|
|Data refresh     | Ability to refresh local files with the latest from cloud.|
|Encryption    | BitLocker support to locally encrypt data and secure data transfer to cloud over *https*.|
|Bandwidth throttling| Throttle to limit bandwidth usage during peak hours.|
|ExpressRoute | Added security through ExpressRoute. Use peering configuration where traffic from local devices to the cloud storage endpoints travels over the ExpressRoute. For more information, see [ExpressRoute overview](../expressroute/expressroute-introduction.md).

## Components

The Azure Stack Edge Pro FPGA solution comprises of Azure Stack Edge resource, Azure Stack Edge Pro FPGA physical device, and a local web UI.

* **Azure Stack Edge Pro FPGA physical device**: A 1U rack-mounted server supplied by Microsoft that can be configured to send data to Azure.
    
* **Azure Stack Edge resource**: A resource in the Azure portal that lets you manage an Azure Stack Edge Pro FPGA device from a web interface that you can access from different geographic locations. Use the Azure Stack Edge resource to create and manage resources, manage shares, and view and manage devices and alerts.
  
   <!--[The Azure Stack Edge service in Azure portal](media/data-box-overview/data-box-Edge-service1.png)-->

   As Azure Stack Edge Pro FPGA approaches its end of life, no orders for new Azure Stack Edge Pro FPGA devices are being filled. If you're a new customer, we recommend that you explore using Azure Stack Edge Pro - GPU devices for your workloads. For more information, go to [What is Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-overview.md). For information about ordering an Azure Stack Edge Pro with GPU device, go to [Create a new resource for Azure Stack Edge Pro - GPU](azure-stack-edge-gpu-deploy-prep.md?tabs=azure-portal#create-a-new-resource).

   If you're an existing customer, you can still create a new Azure Stack Edge resource if you need to replace or reset your existing Azure Stack Edge Pro FPGA device. For instructions, go to [Create an order for your Azure Stack Edge Pro FPGA device](azure-stack-edge-deploy-prep.md#create-new-resource-for-existing-device).

* **Azure Stack Edge Pro FPGA local web UI** - Use the local web UI to run diagnostics, shut down and restart the Azure Stack Edge Pro FPGA device, view copy logs, and contact Microsoft Support to file a service request.

    <!--![The Azure Stack Edge Pro FPGA local web UI](media/data-box-Edge-overview/data-box-Edge-local-web-ui.png)-->

    For information about using the web-based UI, go to [Use the web-based UI to administer your Azure Stack Edge Pro FPGA](azure-stack-edge-manage-access-power-connectivity-mode.md).

## Region availability

Azure Stack Edge Pro FPGA physical device, Azure resource, and target storage account to which you transfer data do not all have to be in the same region.

- **Resource availability** - For a list of all the regions where the Azure Stack Edge resource is available, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). Azure Stack Edge Pro FPGA can also be deployed in the Azure Government Cloud. For more information, see [What is Azure Government?](../azure-government/documentation-government-welcome.md).
    
- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions. The regions where the storage accounts store Azure Stack Edge Pro FPGA data should be located close to where the device is located for optimum performance. A storage account located far from the device results in long latencies and slower performance.

Azure Stack Edge service is a non-regional service. For more information, see [Regions and Availability Zones in Azure](../availability-zones/az-overview.md). Azure Stack Edge service does not have dependency on a specific Azure region, making it resilient to zone-wide outages and region-wide outages.

## Next steps

- Review the [Azure Stack Edge Pro FPGA system requirements](azure-stack-edge-system-requirements.md).
- Understand the [Azure Stack Edge Pro FPGA limits](azure-stack-edge-limits.md).
- Deploy [Azure Stack Edge Pro FPGA](azure-stack-edge-deploy-prep.md) in Azure portal.