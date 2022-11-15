---
title: Network Function Manager FAQ
titleSuffix: Azure Network Function Manager
description: Learn FAQs about Network Function Manager.
author: polarapfel
ms.service: network-function-manager
ms.topic: article
ms.date: 11/02/2021
ms.author: tobiaw
ms.custom: references_regions, ignite-fall-2021
---
# Azure Network Function Manager FAQ

## FAQs

### I am a network function partner and want to onboard to Network Function Manager. How do I offer my network function with NFM?

Our goal is to provide customers a rich ecosystem of their choice of network functions available on Azure Stack Edge. Email us at **aznfmpartner@microsoft.com** to discuss onboarding requirements.

### Does Network Function Manager support other Azure edge devices in addition to Azure Stack Edge Pro with GPU?

The NFM is currently available on Azure Stack Edge Pro with GPU that is generally available. ASE Pro is hardware-as-a-service that is engineered to run specialized network functions, such as mobile packet core and SD-WAN edge. The device is equipped with six physical ports with network acceleration support on ports 5 and 6. Check the [Network interface specifications](../databox-online/azure-stack-edge-gpu-technical-specifications-compliance.md#network-interface-specifications) for Azure Stack Edge Pro with GPU device. Network function partners can take advantage of SR-IOV and DPDK capabilities to deliver superior network performance for their network functions.

### What additional capabilities are available on Azure Stack Edge Pro with GPU in addition to running network functions?

Azure Stack Edge (ASE) Pro with GPU and Azure Network Function Manager are a part of the [Azure private MEC](../private-multi-access-edge-compute-mec/index.yml) solution. You can now run a private mobile network and VM or container-based edge application on your ASE device. This lets you build innovative solutions that provide predictable SLAs to your critical business applications. Azure Stack Edge Pro is also equipped with one or two [GPUs](../databox-online/azure-stack-edge-gpu-technical-specifications-compliance.md#compute-acceleration-specifications) that let you take advantage of scenarios such as video inferencing and machine learning at the edge.

### What is the pricing for Network Function Manager?

Azure Network Function Manager is offered at no additional cost on your Azure Stack Edge Pro device. Network function partners may have a separate charge for offering their network functions with NFM service. Check with your network function partner for pricing details.

### If my Azure Stack Edge Pro device is in a disconnected mode or partially connected mode, will the network functions already deployed stop working?

Network Function Manager service requires network connectivity to the ASE device for management operations to create or delete network functions, monitor, and troubleshoot the network functions running on your device. If the network function is deployed on the ASE device and the device is disconnected or partially connected the underlying network function, virtual machines should continue to operate without any interruption. Network functions deployed on these virtual machines might have different requirements based on the configuration management, and additional network connectivity requirements from network function partners. Check with your partner for the network connectivity requirements and modes of operation.

### Which regions are supported for NFM? Will you add support for additional Azure regions?

Network Function Manager is available in the following regions:

[!INCLUDE [Available regions](../../includes/network-function-manager-regions-include.md)]

Azure Stack Edge Pro with GPU is available in several countries to deploy and run your choice of network functions. For a list of all the countries/regions where the Azure Stack Edge Pro GPU device is available, go to the [Azure Stack Edge Pro GPU pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/#azureStackEdgePro) page. On the **Azure Stack Edge Pro** tab, see the **Availability** section.

You can register the Azure Stack Edge device and Network Function Manager resources based on your regulatory and data sovereignty requirements. The Azure region associated with Network Function Manager resources is used to guide the management operations from the cloud service to the physical device.

### When I delete the managed application for my network function running on Azure Stack Edge, will the billing for network functions automatically stop?

Check with your network function partner on the billing cycle for network functions deployed using Network Function Manager. Each partner will have a different billing policy for their network function offerings.

### Does Network Function Manager support move of resources? 

Network Function Manager supports moving resources across resource groups and subscriptions in the same region. Moving network function resources cross-region is not supported due to dependencies on other regional resources. 

## Next steps

For more information, see the [Overview](overview.md).
