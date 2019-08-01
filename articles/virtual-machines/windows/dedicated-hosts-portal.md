---
title: Deploy Azure dedicated hosts using the Azure portal | Microsoft Docs
description: Deploy VMs to dedicated hosts using the Azure portal.
services: virtual-machines-windows
author: cynthn
manager: gwallace
editor: tysonn
tags: azure-resource-manager
ms.service: virtual-machines-windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 07/26/2019
ms.author: cynthn

#Customer intent: As an IT administrator, I want to learn about more about using a dedicated host for my Azure virtual machines
---

# Preview: Deploy VMs to dedicated hosts using the portal

This article guides you through how to create an Azure [dedicated host](dedicated-hosts.md) to host your virtual machines (VMs). 

[!INCLUDE [virtual-machines-common-dedicated-hosts-portal](../../../includes/virtual-machines-common-dedicated-hosts-portal.md)]

## Create a VM

1. Choose **Create a resource** in the upper left-hand corner of the Azure portal.
1. In the **New** page, under **Popular**, select **Windows Server 2016 Datacenter**.
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then select *myDedicatedHostsRG* as the **Resource group**. 
1. Under **Instance details**, type *myVM* for the **Virtual machine name** and choose *East US* for your **Location**.
1. In **Availability options** select **Availability zone**, select *1* from the drop-down.
1. For the size, select **Change size**. In the list of available sizes, choose one from the Esv3 series, like **Standard E2s v3**. You may need to clear the filter in order to see all of the available sizes.
1. Under **Administrator account**,  provide a username, such as *azureuser* and a password. The password must be at least 12 characters long and meet the [defined complexity requirements](faq.md#what-are-the-password-requirements-when-creating-a-vm).
1. Under **Inbound port rules**, choose **Allow selected ports** and then select **RDP (3389)** from the drop-down.
1. At the top of the page, select the **Advanced** tab and in the **Host** section, select *myHostGroup* for **Host group** and *myHost* for the **Host**. 
	![Select host group and host](./media/dedicated-hosts-portal/advanced.png)
1. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page.
1. When you see the message that validation has passed, select **Create**.


## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview. 

- There is sample template, found [here](https://github.com/Azure/azure-quickstart-templates/blob/master/201-vm-dedicated-hosts/README.md), that uses both zones and fault domains for maximum resiliency in a region.

- You can also deploy a dedicated host using [Azure PowerShell](dedicated-hosts-powershell.md).