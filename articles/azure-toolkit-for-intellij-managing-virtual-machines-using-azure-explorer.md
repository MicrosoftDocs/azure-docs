---
title: Manage virtual machines by using the Azure Explorer for IntelliJ | Microsoft Docs
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

# Manage virtual machines by using the Azure Explorer for IntelliJ

The Azure Explorer, which is part of the Azure Toolkit for IntelliJ, provides Java developers with an easy-to-use solution for managing virtual machines in their Azure account from inside the IntelliJ integrated development environment (IDE).

[!INCLUDE [azure-toolkit-for-intellij-prerequisites](../includes/azure-toolkit-for-intellij-prerequisites.md)]

[!INCLUDE [azure-toolkit-for-intellij-show-azure-explorer](../includes/azure-toolkit-for-intellij-show-azure-explorer.md)]

## Create a virtual machine in IntelliJ

To create a virtual machine by using the Azure Explorer, do the following: 

1. Sign in to your Azure account by using the steps in the [Sign-in instructions for the Azure Toolkit for IntelliJ] article.

2. In the **Azure Explorer** view, expand the **Azure** node, right-click **Virtual Machines**, and then click **Create VM**. 

   ![The Create VM command][CR01]  
    The **Create new Virtual Machine** wizard opens.

3. In the **Choose a Subscription** window, select your subscription, and then click **Next**. 

   ![The Choose a Subscription window][CR02]

4. In the **Select a Virtual Machine Image** window, enter the following information:

   * **Location**: Specifies where your virtual machine will be created (for example, *West US*). 

   * **Recommended image**: Specifies that you will choose an image from an abbreviated list of commonly used images.

   * **Custom image**: Specifies that you will choose a custom image by providing the following information:

      * **Publisher**: Specifies the publisher that created the image that you will use for your virtual machine (for example, *Microsoft*).

      * **Offer**: Specifies the virtual machine offering to use from the selected publisher (for example, *JDK*).

      * **Sku**: Specifies the stockkeeping unit (SKU) to use from the selected offering (for example, *JDK_8*).

      * **Version #**: Specifies which version of the selected SKU to use.

   ![The Select a Virtual Machine Image window][CR03]

5. Click **Next**. 

6. In the **Virtual Machine Basic Settings** window, enter the following information:

   * **Virtual machine name**: Specifies the name for your new virtual machine, which must start with a letter and contain only letters, numbers, and hyphens.

   * **Size**: Specifies the number of cores and memory to allocate for your virtual machine.

   * **User name**: Specifies the administrator account to create for managing your virtual machine.

   * **Password** and **Confirm**: Specifies the password for your administrator account.

   ![The Virtual Machine Basic Settings window][CR04]

7. Click **Next**. 

8. In the **Associated Resources** window, enter the following information:

   * **Resource group**: Specifies the resource group for your virtual machine. Select one of the following options:
      * **Create new**: Specifies that you want to create a new resource group.
      * **Use existing**: Specifies that you want to select from a list of resource groups that are associated with your Azure account.

       ![The Associated Resources window][CR07]

   * **Storage account**: Specifies the storage account to use for storing your virtual machine. You can choose an existing storage account or create a new account. If you choose **Create New**, the following dialog box appears:

      ![The Create Storage Account dialog box][CR05]

   * **Virtual Network** and **Subnet**: Specifies the virtual network and subnet that your virtual machine will connect to. You can use an existing network and subnet, or you can create a new network and subnet. If you select **Create new**, the following dialog box appears:

      ![The Create Virtual Network dialog box][CR06]

   * **Public IP address**: Specifies an external-facing IP address for your virtual machine. You can choose to create a new IP address or, if your virtual machine will not have a public IP address, you can select **(None)**. 

   * **Network security group**: Specifies an optional networking firewall for your virtual machine. You can select an existing firewall or, if your virtual machine will not use a network firewall, you can select **(None)**. 

   * **Availability set**: Specifies an optional availability set that your virtual machine can belong to. You can select an existing availability set, create a new availability set or, if your virtual machine will not belong to an availability set, select **(None)**.

9. Click **Finish**.  
    Your new virtual machine appears in the Azure Explorer tool window. 

   ![New virtual machine in the Azure Explorer view][CR08]

## Restart a virtual machine in IntelliJ

To restart a virtual machine by using the Azure Explorer in IntelliJ, do the following:

1. In the **Azure Explorer** view, right-click the virtual machine, and then select **Restart**.

   ![The virtual-machine Restart command][RE01]

2. In the confirmation window, click **Yes**. 

   ![The restart virtual machine confirmation window][RE02]

## Shut down a virtual machine in IntelliJ

To shut down a running virtual machine by using the Azure Explorer in IntelliJ, do the following:

1. In the **Azure Explorer** view, right-click the virtual machine, and then select **Shutdown**.

   ![The virtual-machine Shutdown command][SH01]

2. In the confirmation window, click **Yes**. 

   ![The shut down virtual machine confirmation window][SH02]

## Delete a virtual machine in IntelliJ

To delete a virtual machine by using the Azure Explorer in IntelliJ, do the following:

1. In the **Azure Explorer** view, right-click the virtual machine, and then select **Delete**.

   ![The virtual-machine Delete command][DE01]

2. In the confirmation window, click **Yes**. 

   ![The delete virtual machine confirmation window][DE02]

## Next steps
For more information about Azure virtual-machine sizes and pricing, see the following resources:

* Azure virtual-machine sizes
  * [Sizes for Windows virtual machines in Azure]
  * [Sizes for Linux virtual machines in Azure]
* Azure virtual-machine pricing
  * [Windows virtual-machine pricing]
  * [Linux virtual-machine pricing]

For more information about the Azure Toolkits for Java IDEs, see the following resources:

* [Azure Toolkit for Eclipse]
  * [What's new in the Azure Toolkit for Eclipse]
  * [Installing the Azure Toolkit for Eclipse]
  * [Sign-in instructions for the Azure Toolkit for Eclipse]
  * [Create a Hello World web app for Azure in Eclipse]
* [Azure Toolkit for IntelliJ]
  * [What's new in the Azure Toolkit for IntelliJ]
  * [Installing the Azure Toolkit for IntelliJ]
  * [Sign-in instructions for the Azure Toolkit for IntelliJ]
  * [Create a Hello World web app for Azure in IntelliJ]

For more information about using Azure with Java, see [Azure Java Developer Center] and [Java Tools for Visual Studio Team Services].

<!-- URL List -->

[Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse.md
[Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij.md
[Create a Hello World web app for Azure in Eclipse]: ./app-service-web/app-service-web-eclipse-create-hello-world-web-app.md
[Create a Hello World web app for Azure in IntelliJ]: ./app-service-web/app-service-web-intellij-create-hello-world-web-app.md
[Installing the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-installation.md
[Installing the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-installation.md
[Sign-in instructions for the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-sign-in-instructions.md
[Sign-in instructions for the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-sign-in-instructions.md
[What's new in the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-whats-new.md
[What's new in the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-whats-new.md

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/

[Sizes for Windows virtual machines in Azure]: /azure/virtual-machines/virtual-machines-windows-sizes
[Sizes for Linux virtual machines in Azure]: /azure/virtual-machines/virtual-machines-linux-sizes
[Windows virtual-machine pricing]: /pricing/details/virtual-machines/windows/
[Linux virtual-machine pricing]: /pricing/details/virtual-machines/linux/


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
