---
title: About Azure Network Function Manager
description: Learn about Azure Network Function Manager, a fully managed cloud-native orchestration service that lets you deploy and provision network functions on Azure Stack Edge Pro with GPU for a consistent hybrid experience using the Azure portal.
author: polarapfel
ms.service: network-function-manager
ms.topic: overview
ms.date: 11/02/2021
ms.author: tobiaw
ms.custom: ignite-fall-2021
---
# What is Azure Network Function Manager?

Azure Network Function Manager offers an [Azure Marketplace](https://azure.microsoft.com/marketplace/) experience for deploying network functions such as mobile packet core, SD-WAN edge, and VPN services to your [Azure Stack Edge device](https://azure.microsoft.com/products/azure-stack/edge/) running in your on-premises environment. You can now rapidly deploy a private mobile network service or SD-WAN solution on your edge device directly from the Azure management portal. Network Function Manager brings network functions from a growing ecosystem of [partners](#partners). Network Function Manager is supported on [Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-overview.md).

## <a name="features"></a> Features

* **Consistent management experience –** Network Function Manager provides a consistent Azure management experience for network functions from different partners deployed at your enterprise edge. This lets you simplify governance and management. You can use your familiar Azure tools and SDK to automate the deployment of network functions through declarative templates. You can also apply Azure role-based access control [Azure RBAC](../role-based-access-control/overview.md) for a global deployment of network functions on your Azure Stack Edge devices.

* **Azure Marketplace experience for 5G network functions –** Accelerate the deployment of private mobile network solution on your Azure Stack Edge device by selecting from your choice of LTE and 5G mobile packet core network function directly from the Azure Marketplace.

* **Seamless cloud-to-edge experience for SD-WAN and VPN solutions –** Network Function Manager extends the Azure management experience for Marketplace network functions that you are familiar with in the public cloud to your edge device. This lets you take advantage of a consistent deployment experience for your choice of SD-WAN and VPN partner network functions deployed in the Azure public cloud or Azure Stack Edge device.

* **Azure Managed Applications experience for network functions on enterprise edge –** Network Function Manager enables a simplified deployment experience for specialized network functions, such as mobile packet core, on your Azure Stack Edge device. We have prevalidated the lifecycle management for approved network function images from partners. You can have confidence that your network function resources are deployed in a consistent state across your entire fleet. For more information, see [Azure Managed Applications](../azure-resource-manager/managed-applications/overview.md).

* **Network acceleration and choice of dynamic or static IP allocation for network functions –** Network Function Manager and [Azure Stack Edge Pro](../databox-online/azure-stack-edge-gpu-overview.md) support improved network performance for network function workloads. Specialized network functions, such as mobile packet core, can now be deployed on the Azure Stack Edge device with faster data path performance on the access point network and user plane network. You can also choose from static or dynamic IP allocation for different virtual interfaces for your network function deployment. Check with your network function partner on support for these networking capabilities.  

## <a name="managed"></a>Azure Managed Applications for network functions

The network functions that are available to be deployed using Network Function Manager are engineered to specifically run on your Azure Stack Edge device. The network function offer is published to Azure Marketplace as an [Azure Managed Application](../azure-resource-manager/managed-applications/overview.md). Customers can deploy the offer directly from [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/), or from the Network Function Manager device resource via the Azure portal. 

:::image type="content" source="./media/overview/managed-app-workflow.png" alt-text="Diagram of managed application workflow.":::

All network function offerings that are available to be deployed using Network Function Manager have a managed application that is available in Azure Marketplace. Managed applications allow partners to:

* Build a custom deployment experience for their network function with the Azure portal experience. 

* Provide a specialized Resource Manager template that allows them to create the network function directly in the Azure Stack Edge device.

* Bill software licensing costs directly, or through Azure Marketplace. 

* Expose custom properties and resource meters.

Network function partners may create different resources, depending on their appliance deployment, configuration licensing, and management needs. As is the case with all Azure Managed Applications, when a customer creates a network function in the Azure Stack Edge device, there will be two resource groups created in their subscription:

* **Customer resource group –** This resource group will contain an application placeholder for the managed application. Partners can use this to expose whatever customer properties they choose here. 

* **Managed resource group –** You can't configure or change resources in this resource group directly, as this is controlled by the publisher of the managed application. This resource group will contain the Network Function Manager **network functions** resource.

:::image type="content" source="./media/overview/managed-app-resource-groups.png" alt-text="Diagram of managed application resource groups.":::

## <a name="configuration"></a>Network function configuration process 

Network function partners that offer their Azure managed applications with Network Function Manager provide an experience that configures the network function automatically as part of the deployment process. After the managed application deployment is successful and the network function instance is provisioned into the Azure Stack Edge, any additional configuration that may be required for the network function must be done via the network function partners management portal. Check with your network function partner for the end-to-end management experience for the network functions deployed on Azure Stack Edge device.

## <a name="regions"></a>Region availability

The Azure Stack Edge resource, Azure Network Function Manager device, and Azure managed applications for network functions should be in the same Azure region. The Azure Stack Edge Pro GPU physical device does not have to be in the same region.

* **Resource availability -** Network Function Manager resources are available in the following regions:

   [!INCLUDE [Available regions](../../includes/network-function-manager-regions-include.md)]

* **Device availability -** For a list of all the countries/regions where the Azure Stack Edge Pro GPU device is available, go to the [Azure Stack Edge Pro GPU pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/#azureStackEdgePro) page. On the **Azure Stack Edge Pro** tab, see the **Availability** section.

With the current release, Network Function Manager is a regional service. For region-wide outages, the management operations for Network Function Manager resources will be impacted, but the network functions running on the Azure Stack Edge device will not be impacted by the region-wide outage.

## <a name="partners"></a>Partner solutions

See the Network Function Manager [partners page](partners.md) for a growing ecosystem of partners offering their Marketplace managed applications for private mobile network, SD-WAN, and VPN solutions.

## <a name="faq"></a>FAQ

For the FAQ, see the [Network Function Manager FAQ](faq.md).

## Next steps

[Create a device resource](create-device.md).
