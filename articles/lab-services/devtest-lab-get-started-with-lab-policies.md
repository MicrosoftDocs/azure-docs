---
title: Manage basic lab policies in Azure DevTest Labs | Microsoft Docs
description: Learn how to set some of the basic policies (settings) for a lab in DevTest Labs 
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: 
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2018
ms.author: spelluru

---

# Manage basic policies for a lab in Azure DevTest Labs

Azure DevTest Labs enables you to control cost and minimize waste in your labs by managing policies (settings) for each lab. In this article, you get started with policies by learning how to set two of the most critical policies - limiting the number of virtual machines (VM) that can be created or claimed by a single user, and configuring auto-shutdown. To view how to set every lab policy, see [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md).  

## Accessing a lab's policies in Azure DevTest Labs
The following steps guide you through setting up policies for a lab in Azure DevTest Labs:

To view (and change) the policies for a lab, follow these steps:

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **All services**, and then select **DevTest Labs** from the list.

1. From the list of labs, select the desired lab.   

1. Select **Configuration and policies**.

    ![Policy settings pane](./media/devtest-lab-set-lab-policy/policies-menu.png)

1. The **Configuration and policies** pane contains a menu of settings that you can specify. This article covers only the settings for **Virtual machines per user**, **Auto-shutdown**, and **Auto-start**. To learn about the remaining settings, see [Manage all policies for a lab in Azure DevTest Labs](./devtest-lab-set-lab-policy.md). 
   
## Set virtual machines per user
The policy for **Virtual machines per user** allows you to specify the maximum number of VMs that can be created by an individual user. If a user attempts to create or claim a VM when the user limit has been met, an error message indicates that the VM cannot be created/claimed. 

1. On the lab's **Configuration and policies** menu, select **Virtual machines per user**.
   
    ![Virtual machines per user](./media/devtest-lab-set-lab-policy/max-vms-per-user.png)

1. Select **Yes** to limit the number of VMs per user. If you do not want to limit the number of VMs per user, select **No**. If you select **Yes**, enter a numeric value indicating the maximum number of VMs that can be created or claimed by a user. 

1. Select **Yes** to limit the number of VMs that can use SSD (solid-state disk). If you do not want to limit the number of VMs that can use SSD, select **No**. If you select **Yes**, enter a value indicating the maximum number of VMs that can be created using SSD. 

1. Select **Save**.

## Set auto-shutdown
The auto-shutdown policy helps to minimize lab waste by allowing you to specify the time that this lab's VMs shut down.

1. On the lab's **Configuration and policies** pane, select **Auto-shutdown**.
   
    ![Auto-shutdown](./media/devtest-lab-set-lab-policy/auto-shutdown.png)

1. Select **On** to enable this policy, and **Off** to disable it.

1. If you enable this policy, specify the time (and time zone) to shut down all VMs in the current lab.

1. Specify **Yes** or **No** for the option to send a notification 15 minutes prior to the specified auto-shutdown time. If you choose **Yes**, enter a webhook URL endpoint or email address specifying where you want the notification to be posted or sent. The user receives notification and is given the option to delay the shutdown.

   For more information about webhooks, see [Create a webhook or API Azure Function](../azure-functions/functions-create-a-web-hook-or-api-function.md). 

1. Select **Save**.

By default, once enabled, this policy applies to all VMs in the current lab. To remove this setting from a specific VM, open the VM's management pane and change its **Auto-shutdown** setting.

## Set auto-start
The auto-start policy allows you to specify when the VMs in the current lab should be started.  

1. On the lab's **Configuration and policies** pane, select **Auto-start**.
   
    ![Auto-start](./media/devtest-lab-set-lab-policy/auto-start.png)

2. Select **On** to enable this policy, and **Off** to disable it.

3. If you enable this policy, specify the scheduled start time, time zone, and the days of the week for which the time applies. 

4. Select **Save**.

Once enabled, this policy is not automatically applied to any VMs in the current lab. To apply this setting to an existing VM, open the VM's management pane and change its **Auto-start** setting.

## Next steps

- [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md) - Learn how to modify other lab policies.
