---
title: Deploy Azure dedicated hosts using the Azure portal 
description: Deploy VMs and scale sets to dedicated hosts using the Azure portal.
author: cynthn
ms.service: virtual-machines
ms.topic: how-to
ms.workload: infrastructure
ms.date: 09/04/2020
ms.author: cynthn

#Customer intent: As an IT administrator, I want to learn about more about using a dedicated host for my Azure virtual machines
---

# Deploy VMs and scale sets to dedicated hosts using the portal 

This article guides you through how to create an Azure [dedicated host](dedicated-hosts.md) to host your virtual machines (VMs). 


> [!IMPORTANT]
> This article also covers Automatic placement of VMs and scale set instances. Automatic placement is currently in public preview.
> To participate in the preview, complete the preview onboarding survey at [https://aka.ms/vmss-adh-preview](https://aka.ms/vmss-adh-preview).
> To acces the preview feature in the Azure portal, you must use this URL: [https://aka.ms/vmssadh](https://aka.ms/vmssadh).
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Limitations

- The sizes and hardware types available for dedicated hosts vary by region. Refer to the host [pricing page](https://aka.ms/ADHPricing) to learn more.

## Create a host group

A **host group** is a resource that represents a collection of dedicated hosts. You create a host group in a region and an availability zone, and add hosts to it. When planning for high availability, there are additional options. You can use one or both of the following options with your dedicated hosts: 
- Span across multiple availability zones. In this case, you are required to have a host group in each of the zones you wish to use.
- Span across multiple fault domains which are mapped to physical racks. 
 
In either case, you are need to provide the fault domain count for your host group. If you do not want to span fault domains in your group, use a fault domain count of 1. 

You can also decide to use both availability zones and fault domains. 

In this example, we will create a host group using 1 availability zone and 2 fault domains. 


1. Open the Azure [portal](https://portal.azure.com). If you would like to try the preview for **Automatic placement**, use this URL: [https://aka.ms/vmssadh](https://aka.ms/vmssadh).
1. Select **Create a resource** in the upper left corner.
1. Search for **Host group** and then select **Host Groups** from the results.
1. In the **Host Groups** page, select **Create**.
1. Select the subscription you would like to use, and then select **Create new** to create a new resource group.
1. Type *myDedicatedHostsRG* as the **Name** and then select **OK**.
1. For **Host group name**, type *myHostGroup*.
1. For **Location**, select **East US**.
1. For **Availability Zone**, select **1**.
1. For **Fault domain count**, select **2**.
1. If you used the **Automatic placement** URL, select this option to automatically assign VMs and scale set instances to an available host in this group.
1. Select **Review + create** and then wait for validation.
1. Once you see the **Validation passed** message, select **Create** to create the host group.

It should only take a few moments to create the host group.


## Create a dedicated host

Now create a dedicated host in the host group. In addition to a name for the host, you are required to provide the SKU for the host. Host SKU captures the supported VM series as well as the hardware generation for your dedicated host.

For more information about the host SKUs and pricing, see [Azure Dedicated Host pricing](https://aka.ms/ADHPricing).

If you set a fault domain count for your host group, you will be asked to specify the fault domain for your host.  

1. Select **Create a resource** in the upper left corner.
1. Search for **Dedicated host** and then select **Dedicated hosts** from the results.
1. In the **Dedicated Hosts** page, select **Create**.
1. Select the subscription you would like to use.
1. Select *myDedicatedHostsRG* as the **Resource group**.
1. In **Instance details**, type *myHost* for the **Name** and select *East US* for the location.
1. In **Hardware profile**, select *Standard Es3 family - Type 1* for the **Size family**, select *myHostGroup* for the **Host group** and then select *1* for the **Fault domain**. Leave the defaults for the rest of the fields.
1. When you are done, select **Review + create** and wait for validation.
1. Once you see the **Validation passed** message, select **Create** to create the host.

## Create a VM

1. Choose **Create a resource** in the upper left corner of the Azure portal.
1. In the search box above the list of Azure Marketplace resources, search for and select the image you want use, then choose **Create**.
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then select *myDedicatedHostsRG* as the **Resource group**. 
1. Under **Instance details**, type *myVM* for the **Virtual machine name** and choose *East US* for your **Location**.
1. In **Availability options** select **Availability zone**, select *1* from the drop-down.
1. For the size, select **Change size**. In the list of available sizes, choose one from the Esv3 series, like **Standard E2s v3**. You may need to clear the filter in order to see all of the available sizes.
1. Complete the rest of the fields on the **Basics** tab as needed.
1. At the top of the page, select the **Advanced** tab and in the **Host** section, select *myHostGroup* for **Host group** and *myHost* for the **Host**. 
	![Select host group and host](./media/dedicated-hosts-portal/advanced.png)
1. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page.
1. When you see the message that validation has passed, select **Create**.

It will take a few minutes for your VM to be deployed.

## Create a scale set (preview)

> [!IMPORTANT]
> Virtual Machine Scale Sets on Dedicated Hosts is currently in public preview.
>
> To participate in the preview, complete the preview onboarding survey at [https://aka.ms/vmss-adh-preview](https://aka.ms/vmss-adh-preview).
>
> To acces the preview feature in the Azure portal, you must use this URL: [https://aka.ms/vmssadh](https://aka.ms/vmssadh).
>
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you deploy a scale set, you specify the host group.

1. Search for *Scale set* and select **Virtual machine scale sets** from the list.
1. Select **Add** to create a new scale set.
1. Complete the fields on the **Basics** tab as you usually would, but make sure you select a VM size that is from the series you chose for your dedicated host, like **Standard E2s v3**.
1. On the **Advanced** tab, for **Spreading algorithm** select **Max spreading**.
1. In **Host group**, select the host group from the drop-down. If you recently created the group, it might take a minute to get added to the list.

## Add an existing VM 

You can add an exiting VM to a dedicated host, but the VM must first be Stop\Deallocated. Before you move a VM to a dedicated host, make sure that the VM configuration is supported:

- The VM size must be in the same size family as the dedicated host. For example, if your dedicated host is DSv3, then the VM size could be Standard_D4s_v3, but it could not be a Standard_A4_v2. 
- The VM needs to be located in same region as the dedicated host.
- The VM can't be part of a proximity placement group. Remove the VM from the proximity placement group before moving it to a dedicated host. For more information, see [Move a VM out of a proximity placement group](./windows/proximity-placement-groups.md#move-an-existing-vm-out-of-a-proximity-placement-group)
- The VM can't be in an availability set.
- If the VM is in an availability zone, it must be the same availability zone as the host group. The availability zone settings for the VM and the host group must match.

Move the VM to a dedicated host using the [portal](https://portal.azure.com).

1. Open the page for the VM.
1. Select **Stop** to stop\deallocate the VM.
1. Select **Configuration** from the left menu.
1. Select a host group and a host from the drop-down menus.
1. When you are done, select **Save** at the top of the page.
1. After the VM has been added to the host, select **Overview** from the left menu.
1. At the top of the page, select **Start** to restart the VM.

## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- There is sample template, found [here](https://github.com/Azure/azure-quickstart-templates/blob/master/201-vm-dedicated-hosts/README.md), that uses both zones and fault domains for maximum resiliency in a region.

- You can also deploy a dedicated host using the [Azure CLI](./linux/dedicated-hosts-cli.md) or [PowerShell](./windows/dedicated-hosts-powershell.md).
