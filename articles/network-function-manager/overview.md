---
title: About Azure Network Function Manager
description: Learn about Azure Network Function Manager, a fully managed cloud-native orchestration service that lets you deploy and provision network functions on Azure Stack Edge Pro with GPU for a consistent hybrid experience using the Azure portal.
author: cherylmc

ms.service: network-function-manager
ms.topic: overview
ms.date: 06/16/2021
ms.author: cherylmc
ms.custom: references_regions

---
# What is Azure Network Function Manager? (Preview)


Azure Network Function Manager offers an [Azure Marketplace](https://azure.microsoft.com/marketplace/) experience for deploying network functions such as mobile packet core, SD-WAN edge, and VPN services to your [Azure Stack Edge device](https://azure.microsoft.com/products/azure-stack/edge/) running in your on-premises environment. You can now rapidly deploy a private mobile network service or SD-WAN solution on your edge device directly from the Azure management portal. Network Function Manager brings network functions from a growing ecosystem of [partners](#partners). This preview is supported on [Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-overview.md). 

## <a name="preview"></a>Preview features

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

## <a name="prereq"></a>Prerequisites

### <a name="edge-pro"></a>Azure Stack Edge Pro with GPU installed and activated

Azure Network Function Manager service is enabled on Azure Stack Edge Pro device. Before you deploy network functions, confirm that the Azure Stack Edge Pro is installed and activated. Azure Stack Edge resource must be deployed in a region which is supported by Network Function Manager resources. For more information, see [Region Availability](#regions). Be sure to follow all the steps in the Azure Stack Edge Pro [Quickstarts](../databox-online/azure-stack-edge-gpu-quickstart.md) and [Tutorials](../databox-online/azure-stack-edge-gpu-deploy-checklist.md).

You should also verify that the device **Status**, located in the properties section for the Azure Stack Edge resource in the Azure management portal, is **Online**.

:::image type="content" source="./media/overview/properties.png" alt-text="Screenshot of properties." lightbox="./media/overview/properties.png":::

### <a name="partner-prereq"></a>Partner prerequisites 

Customers can choose from one or more Network Function Manager [partners](#partners) to deploy their network function on an Azure Stack Edge device. Each partner has networking requirements for deployment of their network function to an Azure Stack Edge device. Refer to the product documentation from the network function partners to complete the following configuration tasks:

* [Configure network on different ports](../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).
* [Enable compute network on your Azure Stack Edge device](../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md#enable-compute-network). 


### <a name="account"></a>Azure account

The Azure Network Function Manager service consists of Network Function Manager **Device** and Network Function Manager **Network Function** resources. The Device and Network Function resources are within Azure Subscriptions. The Azure subscription ID used to activate the Azure Stack Edge Pro device and Network Function Manager resources should be the same. 

Onboard your Azure subscription ID for the Network Function Manager preview by completing the [Azure Function Manager Preview Form](https://go.microsoft.com/fwlink/?linkid=2163583). For preview, Azure Network Function Manager partners must enable the same Azure subscription ID to deploy their network function from the Azure Marketplace. Ensure that your Azure subscription ID is onboarded for preview in both places. 

## <a name="permissions"></a>Resource provider registration and permissions

Azure Network Function Manager resources are within Microsoft.HybridNetwork resource provider. After the Azure subscription ID is onboarded for preview with the Network Function Manager service, register the subscription ID with Microsoft.HybridNetwork resource provider. For more information on how to register, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

The accounts you use to create the Network Function Manager device resource must be assigned to a custom role that is assigned the necessary actions from the following table. For more information, see [Custom roles](../role-based-access-control/custom-roles.md).

| Name | Action|
|---|---|
| Microsoft.DataBoxEdge/dataBoxEdgeDevices/read|Required to read the Azure Stack Edge resource on which network functions will be deployed. |
|Microsoft.DataBoxEdge/dataBoxEdgeDevices/getExtendedInformation/action |Required to read the properties section of Azure Stack edge resource. |
|Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/write |Required to create the Network Function Manager device resource on Azure Stack Edge resource.|
| Microsoft.HybridNetwork/devices/* | Required to create, update, delete the Network Function Manager device resource. |

The accounts you use to create the Azure managed applications resource must be assigned to a [custom role](../role-based-access-control/custom-roles.md) that is assigned the necessary actions from the following table: 

|Name |Action |
|---|---|
|[Managed Application Contributor Role](../role-based-access-control/built-in-roles.md#managed-application-contributor-role)|Required to create Managed app resources.|

## <a name="managed-identity"></a>Managed Identity 

Network function partners that offer their Azure managed applications with Network Function Manager provide an experience that allows you to a deploy a managed application that is attached to an existing Network Function Manager device resource. When you deploy the partner managed application in the Azure portal, you are required to provide an Azure user-assigned managed Identity resource that has access to the Network Function Manager device resource. The user-assigned managed identity allows the managed application resource provider and the publisher of the network function appropriate permissions to Network Function Manager device resource that is deployed outside the managed resource group. For more information, see [Manage a user-assigned managed identity in the Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).

To create a user-assigned managed identity for deploying network functions:

1. Create user-assigned managed identity and assign it to a custom role with permissions for Microsoft.HybridNetwork/devices/join/action. For more information, see [Manage a user-assigned managed identity in the Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).

1. Provide this managed identity when creating a partner’s managed application in the Azure portal. For more information, see [Assign a managed identity access to a resource using the Azure portal](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md).


## <a name="port-firewall"></a>Port requirements and firewall rules

Network Function Manager (NFM) services running on the Azure Stack Edge require outbound connectivity to the NFM cloud service for management traffic to deploy network functions. NFM is fully integrated with the Azure Stack Edge service. Review the networking port requirements and firewall rules for the [Azure Stack Edge](../databox-online/azure-stack-edge-gpu-system-requirements.md#networking-port-requirements) device.  

Network Function partners will have different requirements for firewall and port configuration rules to manage traffic to the partner management portal. Check with your network function partner for specific requirements.  

## <a name="regions"></a>Region availability

The Azure Stack Edge resource, Azure Network Function Manager device, and Azure managed applications for network functions should be in the same Azure region. The Azure Stack Edge Pro GPU physical device does not have to be in the same region. 

* **Resource availability -** For preview, the Network Function Manager resources are available in the following regions:

   [!INCLUDE [Preview- available regions](../../includes/network-function-manager-regions-include.md)]

* **Device availability -** For a list of all the countries/regions where the Azure Stack Edge Pro GPU device is available, go to the [Azure Stack Edge Pro GPU pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/#azureStackEdgePro) page. On the **Azure Stack Edge Pro** tab, see the **Availability** section.

With the current release, Network Function Manager is a regional service. For region-wide outages, the management operations for Network Function Manager resources will be impacted, but the network functions running on the Azure Stack Edge device will not be impacted by the region-wide outage. 

## <a name="partners"></a>Partner solutions

See the Network Function Manager [partners page](partners.md) for a growing ecosystem of partners offering their Marketplace managed applications for private mobile network, SD-WAN, and VPN solutions.

## <a name="faq"></a>FAQ

For the FAQ, see the [Network Function Manager FAQ](faq.md).

## Next steps

[Create a device resource](create-device.md).
