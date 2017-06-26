---
title: Managing Virtual Machines using the Azure Explorer for IntelliJ | Microsoft Docs
description: Learn how to manage your Azure virtual machines by using the Azure Explorer for IntelliJ.
services: ''
documentationcenter: java
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: 
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: Java
ms.topic: article
ms.date: 04/14/2017
ms.author: robmcm

---

# Managing Virtual Machines using the Azure Explorer for IntelliJ

The Azure Explorer, which is part of the Azure Toolkit for IntelliJ, provides Java developers with an easy-to-use solution for managing virtual machines in their Azure account from inside the IntelliJ IDE.

[!INCLUDE [azure-toolkit-for-intellij-prerequisites](../includes/azure-toolkit-for-intellij-prerequisites.md)]

[!INCLUDE [azure-toolkit-for-intellij-show-azure-explorer](../includes/azure-toolkit-for-intellij-show-azure-explorer.md)]

## Creating a Virtual Machine in IntelliJ

The following steps will walk you through the steps to create a virtual machine using the Azure Explorer.

1. Sign in to your Azure account using the steps in the [Sign In Instructions for the Azure Toolkit for IntelliJ] article.

1. In the **Azure Explorer** tool window, expand the **Azure** node, right-click **Virtual Machines** and then click **Create VM**.
   ![Create VM Menu][CR01]

1. When the **Create a new Virtual Machine** wizard appears, choose your subscription and then click **Next**.
   ![Create New Virtual Machine Wizard][CR02]

1. On the next screen of the wizard, specify the following options, and then click **Next**:
   ![Create New Virtual Machine Wizard][CR03]

   a. **Location**: Specifies the location where your virtual machine will be created; for example "westus".

   b. **Recommended Image**: Specifies that you will choose an image from an abbreviated list of commonly-used images.

   c. **Custom Image**: Specifies that you will choose a custom image, for which you will needed to specify the following options:

      * **Publisher**: Specifies the publisher which created the image which you will use to create your virtual machine; for example "Microsoft".

      * **Offer**: Specifies which the virtual machine which offering to use from the selected publisher; for example "JDK".

      * **Sku**: Specifies the *Stockkeeping Unit (SKU)* to use from the selected offering; for example "JDK_8".

      * **Version #**: Specifies which version to use from the selected SKU.

1. On the next screen of the wizard, specify the following options, and then click **Next**:
   ![Create New Virtual Machine Wizard][CR04]

   a. **Virtual Machine Name**: Specifies the name for your new virtual machine, which must start with a letter and contain only letters, numbers, and hyphens.

   b. **Size**: Specifies the number of cores and memory to allocate for your virtual machine.

   c. **User name**: Specifies the administrator account to create for managing your virtual machine.

   d. **Password** and **Confirm**: Specifies the password for your administrator account.

1. On the last screen of the wizard, specify the following options, and then click **Finish**:
   ![Create New Virtual Machine Wizard][CR07]

   a. **Resource Group**: Specifies the resource group for your virtual machine; you need to choose one of the following options:
      * **Create New**: Specifies that you want to create a new resource group.
      * **Use Existing**: Specifies that you will chose from a list resource groups associated with your Azure account.

   b. **Storage account**: Specifies the storage account to use for storing your virtual machine; you can choose an existing storage account or create a new account. If you choose **&lt;&lt;Create New&gt;&gt;**, the following dialog box will be displayed:

      ![Create New Storage Account Dialog Box][CR05]

   c. **Virtual Network** and **Subnet**: Specifies the virtual network and subnet to which your virtual machine will connect; you can choose an existing network and subnet to use for your virtual machine, or you can create a new network and subnet. If you choose **&lt;&lt;Create New&gt;&gt;**, the following dialog box will be displayed:

      ![Create New Virtual Network Dialog Box][CR06]

   d. **Public IP address**: Specifies an externally-facing IP address for your virtual machine; you can choose to create a new IP address, or choose **(None)** if your virtual machine will not have a public IP address.

   e. **Network security group**: Specifies an optional networking firewall which your virtual machine will use; you can choose an existing firewall, or choose **(None)** if your virtual machine will not use a network firewall.

   f. **Availability set**: Specifies an optional availability set to which your virtual machine may belong; you can choose an existing availability set, or to create a new availability set, or choose **(None)** if your virtual machine will not belong to an availability set.

1. When you have completed the above steps, your new virtual machine will be displayed in the Azure Explorer tool window.
   ![New Virtual Machine][CR08]

## Restarting a Virtual Machine in IntelliJ

To restart a virtual machine using the Azure Explorer in IntelliJ, use the following steps:

1. In the **Azure Explorer** tool window, right-click the virtual machine and chose **Restart**.
   ![Restarting a Virtual Machine][RE01]

1. Click **Yes** when prompted to restart the virtual machine.
   ![Restarting a Virtual Machine][RE02]

## Shutting down a Virtual Machine in IntelliJ

To shutdown a running virtual machine using the Azure Explorer in IntelliJ, use the following steps:

1. In the **Azure Explorer** tool window, right-click the virtual machine and chose **Shutdown**.
   ![Shutting Down a Virtual Machine][SH01]

1. Click **Yes** when prompted to shut down the virtual machine.
   ![Shutting Down a Virtual Machine][SH02]

## Deleting a Virtual Machine in IntelliJ

To delete a virtual machine using the Azure Explorer in IntelliJ, use the following steps:

1. In the **Azure Explorer** tool window, right-click the virtual machine and chose **Delete**.
   ![Deleting a Virtual Machine][DE01]

1. Click **Yes** when prompted to delete the virtual machine.
   ![Deleting a Virtual Machine][DE02]

## See Also
For more information about the Azure virtual machine sizes and pricing, see the following links:

* Azure Virtual Machine Sizes
   * [Sizes for Windows virtual machines in Azure]
   * [Sizes for Linux virtual machines in Azure]
* Azure Virtual Machine Pricing
   * [Windows Virtual Machines Pricing]
   * [Linux Virtual Machines Pricing]

For more information about the Azure Toolkits for Java IDEs, see the following links:

* [Azure Toolkit for Eclipse]
  * [What's New in the Azure Toolkit for Eclipse]
  * [Installing the Azure Toolkit for Eclipse]
  * [Sign In Instructions for the Azure Toolkit for Eclipse]
  * [Create a Hello World Web App for Azure in Eclipse]
* [Azure Toolkit for IntelliJ]
  * [What's New in the Azure Toolkit for IntelliJ]
  * [Installing the Azure Toolkit for IntelliJ]
  * [Sign In Instructions for the Azure Toolkit for IntelliJ]
  * [Create a Hello World Web App for Azure in IntelliJ]

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

<!-- URL List -->

[Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse.md
[Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij.md
[Create a Hello World Web App for Azure in Eclipse]: ./app-service-web/app-service-web-eclipse-create-hello-world-web-app.md
[Create a Hello World Web App for Azure in IntelliJ]: ./app-service-web/app-service-web-intellij-create-hello-world-web-app.md
[Installing the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-installation.md
[Installing the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-installation.md
[Sign In Instructions for the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-sign-in-instructions.md
[Sign In Instructions for the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-sign-in-instructions.md
[What's New in the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-whats-new.md
[What's New in the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-whats-new.md

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/

[Sizes for Windows virtual machines in Azure]: /azure/virtual-machines/virtual-machines-windows-sizes
[Sizes for Linux virtual machines in Azure]: /azure/virtual-machines/virtual-machines-linux-sizes
[Windows Virtual Machines Pricing]: /pricing/details/virtual-machines/windows/
[Linux Virtual Machines Pricing]: /pricing/details/virtual-machines/linux/

<!-- IMG List -->

[RE01]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/RE01.png
[RE02]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/RE02.png

[SH01]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/SH01.png
[SH02]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/SH02.png

[DE01]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/DE01.png
[DE02]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/DE02.png

[CR01]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/CR01.png
[CR02]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/CR02.png
[CR03]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/CR03.png
[CR04]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/CR04.png
[CR05]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/CR05.png
[CR06]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/CR06.png
[CR07]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/CR07.png
[CR08]: ./media/azure-toolkit-for-intellij-managing-virtual-machines-using-azure-explorer/CR08.png
