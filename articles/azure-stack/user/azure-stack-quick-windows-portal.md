---
title: Azure Stack Quick Start - Create a Windows virtual machine
description: Azure Stack Quick Start - Create a Windows VM using the portal
services: azure-stack
author: ErikjeMS
manager: byronr

ms.topic: hero-article
ms.date: 09/15/2017
ms.author: erikje
---

# Create a Windows virtual machine with the Azure Stack portal

You can create a Windows virtual machine by using the Azure Stack portal. The portal is a browser-based user interface where you can create, configure, and manage resources.

## Sign in to the Azure Stack portal

Sign in to the Azure Stack portal. The address of the Azure Stack portal depends on which Azure Stack product you are connecting to:

* For the Azure Stack Development Kit (ASDK) go to: https://portal.local.azurestack.external.
* For an Azure Stack integrated system, go to the URL that your Azure Stack operator provided.

## Create a virtual machine

1. Click **New** > **Compute** > **Windows Server 2016 Datacenter Eval** > **Create**. If you don't see **Windows Server 2016 Datacenter Eval** entry, contact your Azure Stack operator. Ask that they add it to the marketplace as explained in the [Add the Windows Server 2016 VM image to the Azure Stack marketplace](../azure-stack-add-default-image.md) article. 
    ![](media/azure-stack-quick-windows-portal/image01.png)
2. Under **Basics**, type a **Name**, **User name**, and **Password**. Choose a **Subscription**. Create a **Resource group**, or select an existing one, select a **Location**, and then click **OK**.

    ![](media/azure-stack-quick-windows-portal/image02.png)
3. Under **Choose a size**, click **A1 Standard** > **Select**.
    ![](media/azure-stack-quick-windows-portal/image03.png)
4. Under **Settings**, accept the defaults and click **OK**.
    ![](media/azure-stack-quick-windows-portal/image04.png)
5. Under **Summary**, click **OK** to create the virtual machine. 
    ![](media/azure-stack-quick-windows-portal/image05.png)
6. To see your new virtual machine, click **All resources**, then search for the virtual machine and click its name.
    ![](media/azure-stack-quick-windows-portal/image06.png)

## Clean up resources

When you no longer need the virtual machine, delete the resource group, virtual machine, and all related resources. To do so, select the resource group from the virtual machine page and click **Delete**.

## Next steps
In this quick start, you’ve deployed a simple Windows virtual machine. To learn more about Azure Stack virtual machines, continue to [Considerations for Virtual Machines in Azure Stack](azure-stack-vm-considerations.md).
