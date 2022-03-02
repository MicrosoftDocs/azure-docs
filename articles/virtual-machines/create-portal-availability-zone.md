---
title: Create a zoned VMs with the Azure portal 
description: Create VMs in an availability zone with the Azure portal
author: mimckitt
ms.service: virtual-machines
ms.topic: how-to
ms.date: 03/01/2022
ms.author: mimckitt
ms.reviewer: cynthn
ms.custom: 
---

# Create virtual machines in an availability zone using the Azure portal

**Applies to:** :heavy_check_mark: Windows VMs 

This article steps through using the Azure portal to create virtual machines in Azure availability zones. An [availability zone](../availability-zones/az-overview.md) is a physically separate zone in an Azure region. Use availability zones to protect your apps and data from an unlikely failure or loss of an entire datacenter.

To use availability zones, create your virtual machines in a [supported Azure region](../availability-zones/az-region.md).
## Create VMs

1. Sign in to the Azure portal at https://portal.azure.com.

1. Click **Create a resource** > **Compute** > **Virtual machine**. 

1. In the **Virtual machines** page, select **Create** and then **Virtual machine**.  The **Create a virtual machine** page opens.

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose a resource group or create a new one.

1. Under **Instance details**, type a name for the **Virtual machine name**.
1. For **Availability options**, select **Availability zone**.
1. For **Availability zone**, the drop-down defaults to *Zone 1*. If you choose multiple zones, a new VM will be created in each zone. For example, if you select all three zones, then three VMs will be created. The VM names are the original name you entered, with **-1**, **-2**, and **-3** appended to the name, depending on the zones you choose.

   :::image type="content" source="media/zones/3-vm-names.png" alt-text="Screenshot showing that there are now 3 virtual machines that will be created.":::

1. Complete the rest of the page as usual. If you want to create a load balancer, go to the Networking tab > Load Balancing > Load balancing options.

1. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page.

1. On the **Create a virtual machine** page, you can see the details about the VM you are about to create. When you are ready, select **Create**.

1. If the **Generate new key pair** window opens, select **Download private key and create resource**. Your key file will be download as **myKey.pem**.

1. When the deployment is finished, select **Go to resource**.


## Confirm zone for managed disk and IP address

When the VM is deployed in an availability zone, a managed disk for the VM is created in the same availability zone. By default, a public IP address is also created in that zone.

You can confirm the zone settings for these resources in the portal.  

1. Select **Disks** from the left menu and then select the OS disk. The page for the disk includes details about the location and availability zone of the disk.

1. Back on the page for the VM, select the public IP address. In the left menu, select **Properties**. The properties page includes details about the location and availability zone of the public IP address.

    
## Next steps

In this article, you learned how to create a VM in an availability zone. Learn more about [availability](availability.md) for Azure VMs.
