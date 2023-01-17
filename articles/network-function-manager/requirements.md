---
title: Prerequisites and requirements for Azure Network Function Manager
description: Learn about the requirements and prerequisites for Network Function Manager.
author: polarapfel
ms.service: network-function-manager
ms.topic: article
ms.date: 11/02/2021
ms.author: tobiaw
ms.custom: ignite-fall-2021
---

# Network Function Manager prerequisites and requirements

This article helps you understand the prerequisites and requirements that are necessary in order to configure and use Azure Network Function Manager.

## <a name="edge-pro"></a>Azure Stack Edge Pro with GPU installed and activated

Verify that you have the following prerequisites:

* The Azure Network Function Manager service is enabled on Azure Stack Edge Pro device.
* Before you deploy network functions, confirm that the Azure Stack Edge Pro is installed and activated.
* Azure Stack Edge resource must be deployed in a region that is supported by Network Function Manager resources. For more information, see [Region Availability](overview.md#regions).
* Be sure to follow all the steps in the Azure Stack Edge Pro [Quickstarts](../databox-online/azure-stack-edge-gpu-quickstart.md) and [Tutorials](../databox-online/azure-stack-edge-gpu-deploy-checklist.md).
* Verify that the device **Status**, located in the properties section for the Azure Stack Edge resource in the Azure management portal, is **Online**.

   :::image type="content" source="./media/overview/properties.png" alt-text="Screenshot of properties." lightbox="./media/overview/properties.png":::

## <a name="partner-prereq"></a>Partner prerequisites

Customers can choose from one or more Network Function Manager [partners](partners.md) to deploy their network function on an Azure Stack Edge device. For more information about Network Function Manager Partners, see the [partners](partners.md) article.

Each partner has networking requirements for deployment of their network function to an Azure Stack Edge device. Refer to the product documentation from the network function partners to complete the following configuration tasks:

* [Configure network on different ports](../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).
* [Enable compute network on your Azure Stack Edge device](../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md#configure-virtual-switches).

## <a name="account"></a>Azure account

Azure Network Function Manager partners must enable the same Azure subscription ID to deploy their network function from the Azure Marketplace. Ensure that your Azure subscription ID is onboarded with the partner.

The Azure Network Function Manager service consists of Network Function Manager **Device** and Network Function Manager **Network Function** resources. The Device and Network Function resources are within Azure Subscriptions. The Azure subscription ID used to activate the Azure Stack Edge Pro device and Network Function Manager resources should be the same.

## <a name="port-firewall"></a>Port requirements and firewall rules

Network Function Manager (NFM) services running on the Azure Stack Edge require outbound connectivity to the NFM cloud service for management traffic to deploy network functions. NFM is fully integrated with the Azure Stack Edge service. Review the networking port requirements and firewall rules for the [Azure Stack Edge](../databox-online/azure-stack-edge-gpu-system-requirements.md#networking-port-requirements) device.

Your firewall rules must allow outbound HTTPS connections to

* *.blob.storage.azure.net
* *.mecdevice.azure.com

Network Function partners will have different requirements for firewall and port configuration rules to manage traffic to the partner management portal. Check with your network function partner for specific requirements.

## Next steps

[Tutorial: Create a Network Function Manager Device resource](create-device.md).
