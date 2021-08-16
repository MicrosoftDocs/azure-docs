---
title: Create a zoned VM with the Azure portal 
description: Create a VM in an availability zone with the Azure portal
documentationcenter: virtual-machines
author: mimckitt
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 5/10/2021
ms.author: mimckitt
ms.reviewer: cynthn
ms.custom: 
---

# Create a virtual machine in an availability zone using the Azure portal

This article steps through using the Azure portal to create a virtual machine in an Azure availability zone. An [availability zone](../../availability-zones/az-overview.md) is a physically separate zone in an Azure region. Use availability zones to protect your apps and data from an unlikely failure or loss of an entire datacenter.

To use an availability zone, create your virtual machine in a [supported Azure region](../../availability-zones/az-region.md).

## Sign in to Azure 

1. Sign in to the Azure portal at https://portal.azure.com.

1. Click **Create a resource** > **Compute** > **Virtual machine**. 

3. Enter the virtual machine information. The user name and password is used to sign in to the virtual machine. The password must be at least 12 characters long and meet the [defined complexity requirements](faq.yml#what-are-the-password-requirements-when-creating-a-vm-). 

4. Choose a region such as East US 2 that supports availability zones. 

5. Under **Availability options**, select **Availability zone** dropdown. 

1. Under **Availability zone**, select a zone from the drop-down list.
        
4. Choose a size for the VM. Select a recommended size, or filter based on features. Confirm the size is available in the zone you want to use.

6. Finish filling in the information for your VM. When you are done, select **Review + create**.

7. Once the information is verified, select **Create**.

1. After the VM is created, you can see the availability zone listed in the **Essentials section** on the page for the VM.

## Confirm zone for managed disk and IP address

When the VM is deployed in an availability zone, a managed disk for the VM is created in the same availability zone. By default, a public IP address is also created in that zone.

You can confirm the zone settings for these resources in the portal.  

1. Select **Disks** from the left menu and then select the OS disk. The page for the disk includes details about the location and availability zone of the disk.

1. Back on the page for the VM, select the public IP address. In the left menu, select **Properties**. The properties page includes details about the location and availability zone of the public IP address.

    
## Next steps

In this article, you learned how to create a VM in an availability zone. Learn more about [availability](../availability.md) for Azure VMs.
