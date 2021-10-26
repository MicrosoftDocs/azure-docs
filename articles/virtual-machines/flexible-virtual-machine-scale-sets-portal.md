---
title: Create virtual machines in a Flexible scale set using Azure portal
description: Learn how to create a virtual machine scale set in Flexible orchestration mode in the Azure portal.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 10/25/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Create virtual machines in a Flexible scale set using Azure portal

**Applies to:** :heavy_check_mark: Flexible scale sets

This article steps through using Azure portal to create a virtual machine scale set in Flexible orchestration mode. For more information about Flexible scale sets, see [Flexible orchestration mode for virtual machine scale sets](flexible-virtual-machine-scale-sets.md). 


> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Log in to Azure
Log in to the Azure portal at https://portal.azure.com.


## Create a virtual machine scale set

You can deploy a scale set with a Windows Server image or Linux image such as RHEL, CentOS, Ubuntu, or SLES.

1. In the Azure portal search bar, search for and select **Virtual machine scale sets**.
1. Select **Create** on the **Virtual machine scale sets** page.

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and select *myVMSSResourceGroup* from resource group list.  
1. Under **Scale set details**, set *myScaleSet* for your scale set name and select a **Region** that is close to your area.
1. Under **Orchestration**, select the *Flexible* option for **Orchestration mode**. 
1. Under **Instance details**, select a marketplace image for **Image**. In this example, we have chosen *Ubuntu Server 18.04 LTS*.
1. Enter your desired username, and select which authentication type you prefer.
   - A **Password** must be at least 12 characters long and meet three out of the four following complexity requirements: one lower case character, one upper case character, one number, and one special character. For more information, see [username and password requirements](../virtual-machines/windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).
   - If you select a Linux OS disk image, you can instead choose **SSH public key**. Only provide your public key, such as *~/.ssh/id_rsa.pub*. You can use the Azure Cloud Shell from the portal to [create and use SSH keys](../virtual-machines/linux/mac-create-ssh-keys.md).

1. Select **Next** to move the the next page. 

1. Leave the defaults for the **Disks** page.

1. Select **Next** to move the the next page. 

1. On the **Networking** page, under **Load balancing**, select the **Use a load balancer** checkbox to put the scale set instances behind a load balancer. 
1. In **Load balancing options**, select **Azure load balancer**.
1. In **Select a load balancer**, select a load balancer or create a new one.
1. For **Select a backend pool**, select **Create new**, type *myBackendPool*, then select **Create**.

    > [!NOTE]
    > For related information on networking for Flexible scale sets, see [scalable network connectivity for Flexible scale sets](../virtual-machines/flexible-virtual-machine-scale-sets-migration-resources.md#create-scalable-network-connectivity).

1. Select **Next** to move the the next page.

1. On the **Scaling** page, set the **initial instance count** field to *5*. You can set this number up to 1000. 
1. For the **Scaling policy**, keep it *Manual*. 

1. When you are done, select **Review + create**. 
1. After it passes validation, select **Create** to deploy the scale set.


## Clean up resources
When no longer needed, delete the resource group, scale set, and all related resources. To do so, select the resource group for the scale set and then select **Delete**.


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a Flexible scale with Azure CLI.](flexible-virtual-machine-scale-sets-cli.md)