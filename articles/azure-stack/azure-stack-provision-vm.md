---
title: Provision a VM in Azure Stack | Microsoft Docs
description: Learn how to provision a VM in Azure Stack.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: c86646e1-a12e-493f-b396-f17bfacd60c2
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 3/1/2017
ms.author: erikje

---
# Provision a virtual machine
As an administrator, you can create virtual machines to evaluate resources before offering them in plans.

> [!NOTE]
> Before you can provision virtual machines, you must [add the Windows Server 2016 Eval image to the Azure Stack marketplace](azure-stack-add-default-image.md).
> 
> 

## Provision a virtual machine
1. On the Azure Stack POC computer, log in to `https://portal.local.azurestack.external` as [an admin](azure-stack-connect-azure-stack.md), and then click **New** > **Virtual machines** > **Windows Server 2016 Datacenter Eval**.  

2. In the **Basics** blade, type a **Name**, **User name**, and **Password**. For **VM disk type**, choose **HDD**. Choose a **Subscription**. Create a **Resource group**, or select an existing one, and then click **OK**.  
3. In the **Choose a size** blade, click **A1 Basic**, and then click **Select**.  
4. In the **Settings** blade, click **Virtual network**. In the **Choose virtual network** blade, click **Create new**. In the **Create virtual network** blade, accept all the defaults, and click **OK**. In the **Settings** blade, click **OK**.

   ![](media/azure-stack-provision-vm/image04.png)
5. In the **Summary** blade, click **OK** to create the virtual machine.  
6. To see your new virtual machine, click **All resources**, then search for the virtual machine and click its name.

    ![](media/azure-stack-provision-vm/image06.png)

## Next steps
[Storage accounts](azure-stack-provision-storage-account.md)
