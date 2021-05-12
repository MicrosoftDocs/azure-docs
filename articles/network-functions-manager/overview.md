---
title: About Network Functions Manager
titleSuffix: Azure Network Functions Manager
description: Learn about Network Functions Manager.
author: cherylmc

ms.service: vnf-manager
ms.topic: overview
ms.date: 05/12/2021
ms.author: cherylmc

---
# What is Azure Network Functions Manager? (Preview)

Azure Network Function Manager (NFM) is a fully managed cloud-native orchestration service that lets you deploy and provision network functions on **Azure Stack Edge Pro with GPU** for a consistent hybrid experience using the Azure portal.
  
When used with Azure Stack Edge, NFM provides deployment, provisioning, and secure cloud-based management of your on-premises network functions or apps directly from the Azure portal. A managed service means that an Azure MSP (managed service provider) handles updates, lifecycle management, and support for your network functions and applications running on the edge device. The platform supports virtual machines and containerized workloads, along with one or two GPUs for acceleration.

:::image type="content" source="./media/overview/reference.png" alt-text="Reference Diagram." lightbox="./media/overview/reference.png":::

## <a name="scenarios"></a>Scenarios

There are two main scenarios for Network Functions Manager:

* Private Mobile Network via Celona Edge, Affirmed, or Metaswitch.
* SD-WAN via Velocloud.

## <a name="features"></a>Key Features

* **Deploy and run Azure-managed applications for mobile and SD-WAN network functions:** Deploy specialized network functions like virtualized mobile packet core and SD-WAN from Azure portal, packaged as Azure-managed applications. This lets you run a private LTE/5G or SD-WAN network side by side with a GPU-based edge computing application on Azure Stack Edge.

* **Choice of static and dynamic IP configuration for multi-NIC network functions:** You can specify static or dynamic IP configuration for management, LAN, or WAN network interfaces while deploying network functions on Azure Stack Edge Pro.

* **Azure Monitor integration for network functions:** You can use network function virtual machine metrics on Azure portal to understand the performance of the network functions and, in some instances, to troubleshoot network function issues.

## <a name="pre"></a>Prerequisites

Before using the Azure Network Function Manager service, ensure the following requirements are met:

* Verify that your subscription has been onboarded by the Azure Network Function Manager PM team. Contact MEC-PM@microsoft.com to help onboard your subscription. 
* You have installed and activated a physical **Azure Stack Edge Pro GPU** appliance and the corresponding resource in your subscription in Azure portal. For more information, see [Deployment checklists for your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-deploy-checklist.md).
* You must have IP addresses assigned to the four ports in use.
* Your Azure subscription must be registered with the **Microsoft.HybridNetwork** resource provider. For more information, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).
* You have the **contributor role** (or higher) assigned at the resource group level. For more information, see [Assign Azure roles](../role-based-access-control/role-assignments-portal.md).
* The User Access Administrator or Owner of the subscription must create a custom role with permissions to *Microsoft.HybridNetwork* and assign this custom role to the subscription.
* You must use the [Preview Portal](https://aka.ms/AzureNetworkFunctionManager) to access Azure Network Function Manager portal pages.

## <a name="regions"></a>Available regions

[!INCLUDE [Network Functions Manager regions](../../includes/network-functions-manager-regions-include.md)]

## <a name="faq"></a>FAQ

For the FAQ, see the [Network Functions Manager FAQ](faq.md).

## Next steps

[Create a device](create-device).
