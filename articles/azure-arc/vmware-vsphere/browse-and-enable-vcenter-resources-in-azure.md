---
title: Enable your VMware vCenter resources in Azure
description: Learn how to browse your vCenter inventory and represent a subset of your VMware vCenter resources in Azure to enable self-service.
ms.topic: how-to
ms.date: 08/18/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere

# Customer intent: As a VI admin, I want to represent a subset of my vCenter resources in Azure to enable self-service.
---

# Enable your VMware vCenter resources in Azure

After you've connected your VMware vCenter to Azure, you can browse your vCenter inventory from the Azure portal.

:::image type="content" source="media/browse-vmware-inventory.png" alt-text="Screenshot of where to browse your VMware Inventory from the Azure portal." lightbox="media/browse-vmware-inventory.png":::

Visit the VMware vCenter blade in Azure Arc center to view all the connected vCenters. From there, you'll browse your virtual machines (VMs), resource pools, templates, and networks. From the inventory of your vCenter resources, you can select and enable one or more resources in Azure. When you enable a vCenter resource in Azure, it creates an Azure resource that represents your vCenter resource. You can use this Azure resource to assign permissions or conduct management operations.

## Enable resource pools, clusters, hosts, datastores, networks, and VM templates in Azure

In this section, you will enable resource pools, networks, and other non-VM resources in Azure.

>[!NOTE]
>Enabling Azure Arc on a VMware vSphere resource is a read-only operation on vCenter. That is, it doesn't make changes to your resource in vCenter.

1. From your browser, go to the vCenters blade on [Azure Arc Center](https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/overview) and navigate to your inventory resources blade.

2. Select the resource or resources you want to enable and then select **Enable in Azure**.

3. Select your Azure Subscription and Resource Group and then select **Enable**.

   This starts a deployment and creates a resource in Azure, creating representations for your VMware vSphere resources. It allows you to manage who can access those resources through Azure role-based access control (RBAC) granularly.

4. Repeat these steps for one or more network, resource pool, and VM template resources.

## Enable existing virtual machines in Azure

1. From your browser, go to the vCenters blade on [Azure Arc Center](https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/overview) and navigate to your vCenter.

   :::image type="content" source="media/enable-guest-management.png" alt-text="Screenshot of how to enable an existing virtual machine in the Azure portal." lightbox="media/enable-guest-management.png":::

1. Navigate to the VM inventory resource blade, select the VMs you want to enable, and then select **Enable in Azure**.

1. Select your Azure Subscription and Resource Group.

1. (Optional) Select **Install guest agent** and then provide the Administrator username and password of the guest operating system.

   The guest agent is the [Azure Arc connected machine agent](../servers/agent-overview.md). You can install this agent later by selecting the VM in the VM inventory view on your vCenter and selecting **Enable guest management**. For information on the prerequisites of enabling guest management, see [Manage VMware VMs through Arc-enabled VMware vSphere](perform-vm-ops-through-azure.md).

1. Select **Enable** to start the deployment of the VM represented in Azure.

For information on the capabilities enabled by a guest agent, see [Manage access to VMware resources through Azure RBAC](setup-and-manage-self-service-access.md).

## Next steps

- [Manage access to VMware resources through Azure RBAC](setup-and-manage-self-service-access.md).
