---
title: Azure Stack Quick Start - Create a Windows virtual machine
description: Azure Stack Quick Start - Create a Windows VM using the portal
services: azure-stack
author: brenduns
manager: femila

ms.service: azure-stack
ms.topic: quickstart
ms.date: 04/23/2018
ms.author: brenduns
ms.reviewer: 
ms.custom: mvc
---

# Quickstart: create a Windows server virtual machine with the Azure Stack portal

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can create a Windows Server 2016 virtual machine by using the Azure Stack portal. Follow the steps in this article to create and use a virtual machine.

## Sign in to the Azure Stack portal

Sign in to the Azure Stack portal. The address of the Azure Stack portal depends on which Azure Stack product you're connecting to:

* For the Azure Stack Development Kit (ASDK) go to: https://portal.local.azurestack.external.
* For an Azure Stack integrated system, go to the URL that your Azure Stack operator provided.

## Create a virtual machine

1. Click **New** > **Compute** > **Windows Server 2016 Datacenter Eval** > **Create**. If you don't see **Windows Server 2016 Datacenter Eval** entry, contact your Azure Stack operator. Ask that they add it to the marketplace as explained in the [Add the Windows Server 2016 VM image to the Azure Stack marketplace](../azure-stack-add-default-image.md) article.

    ![Steps to create a Windows virtual machine in portal](media/azure-stack-quick-windows-portal/image01.png)
2. Under **Basics**, type a **Name**, **User name**, and **Password**. Choose a **Subscription**. Create a **Resource group**, or select an existing one, select a **Location**, and then click **OK**.

    ![Configure basic settings](media/azure-stack-quick-windows-portal/image02.png)
3. Under **Choose a size**, click **D1 Standard** > **Select**.
    ![Choose size of virtual machine](media/azure-stack-quick-windows-portal/image03.png)
4. Under **Settings**, accept the defaults and click **OK**.
    ![Configure virtual machine settings](media/azure-stack-quick-windows-portal/image04.png)
5. Under **Summary**, click **OK** to create the virtual machine.
    ![View summary and create virtual machine](media/azure-stack-quick-windows-portal/image05.png)
6. To see your new virtual machine, click **All resources**, search for the virtual machine name, and then click its name in the search results.
    ![See virtual machine](media/azure-stack-quick-windows-portal/image06.png)

## Clean up resources

When you're finished using the virtual machine, delete the virtual machine and its resources. To do so, select the resource group on the virtual machine page and click **Delete**.

## Next steps

In this quick start, you deployed a basic Windows Server virtual machine. To learn more about Azure Stack virtual machines, continue to [Considerations for Virtual Machines in Azure Stack](azure-stack-vm-considerations.md).
