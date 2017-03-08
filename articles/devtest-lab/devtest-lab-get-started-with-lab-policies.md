---
title: Manage basic lab policies in Azure DevTest Labs | Microsoft Docs
description: Learn how to set some of the basic policies (settings) for a lab in DevTest Labs 
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: 
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/07/2017
ms.author: tarcher

---

# Manage basic policies for a lab in Azure DevTest Labs

Azure DevTest Labs enables you control cost and minimize waste in your labs by managing policies (settings) for each lab. In this article, you get started with policies by learning how to set two of the most critical policies - limiting the number of VMs that can be created or claimed by a single user, and configuring auto-shutdown. To view how to set every lab policy, see the article, [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md).  

## Accessing a lab's policies in Azure DevTest Labs
The following steps guide you through setting up policies for a lab in Azure DevTest Labs:

To view (and change) the policies for a lab, follow these steps:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. Select **More services**, and then select **DevTest Labs** from the list.
3. From the list of labs, select the desired lab.   
4. Select **Policy settings**.
5. The **Policy settings** blade contains a menu of settings that you can specify: 
   
    ![Policy settings blade](./media/devtest-lab-set-lab-policy/policies.png)
   
    To learn more about setting a policy, select it from the following list:
   
   * [Virtual machines per user](#set-virtual-machines-per-user) - Specify the maximum number of VMs that can be created or claimed by a user. 
   * [Auto-shutdown](#set-auto-shutdown) - Specify the time when the current lab's VMs automatically shut down.

## Set virtual machines per user
The policy for **Virtual machines per user** allows you to specify the maximum number of VMs that can be created by an individual user. 
If a user attempts to create or claim a VM when the user limit has been met, an error message indicates that the VM cannot be created/claimed. 

1. On the lab's **Policy settings** blade, select **Virtual machines per user**.
   
    ![Virtual machines per user](./media/devtest-lab-set-lab-policy/max-vms-per-user.png)
2. Select **On** to enable this policy, and **Off** to disable it.
3. If you enable this policy, enter a numeric value indicating the maximum number of VMs that can be created or claimed by a user. 
   If you enter a number that is not valid, the UI displays the maximum number allowed for this field.
4. Select **Save**.

## Set auto-shutdown
The auto-shutdown policy helps to minimize lab waste by allowing you to specify the time that this lab's VMs shut down.

1. On the lab's **Policy settings** blade, select **Auto-shutdown**.
   
    ![Auto-shutdown](./media/devtest-lab-set-lab-policy/auto-shutdown.png)
2. Select **On** to enable this policy, and **Off** to disable it.
3. If you enable this policy, specify the local time to shut down all VMs in the current lab.
4. Select **Save**.
5. By default, once enabled, this policy applies to all VMs in the current lab. To remove this setting from a specific VM, open the VM's blade and change its **Auto-shutdown** setting 

## Next steps

- [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md) - Learn how to modify other lab policies 
