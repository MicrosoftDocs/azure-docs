---
title: Managing Storage Accounts using the Azure Explorer for IntelliJ | Microsoft Docs
description: Learn how to manage your Azure storage accounts by using the Azure Explorer for IntelliJ.
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

# Managing Storage Accounts using the Azure Explorer for IntelliJ

The Azure Explorer, which is part of the Azure Toolkit for IntelliJ, provides Java developers with an easy-to-use solution for managing storage accounts in their Azure account from inside the IntelliJ IDE.

[!INCLUDE [azure-toolkit-for-intellij-prerequisites](../includes/azure-toolkit-for-intellij-prerequisites.md)]

[!INCLUDE [azure-toolkit-for-intellij-show-azure-explorer](../includes/azure-toolkit-for-intellij-show-azure-explorer.md)]

## Creating a Storage Account in IntelliJ

The following steps will walk you through the steps to create a storage account using the Azure Explorer.

1. Sign in to your Azure account using the steps in the [Sign In Instructions for the Azure Toolkit for Eclipse] article.

1. In the **Azure Explorer** tool window, expand the **Azure** node, right-click **Storage Accounts** and then click **Create Storage Account**.
   ![Create Storage Account Menu][CS01]

1. When the **Create Storage Account** dialog box appears, specify the following options:
   ![Create New Storage Account Dialog Box][CS02]

   a. **Name**: Specifies the name for the new storage account.

   b. **Account kind**: Specifies the type of storage account to create; for example "Blob storage". (For more information, see [About Azure Storage Accounts].)

   c. **Performance**: Specifies which the storage account which offering to use from the selected publisher; for example "Premium". (For more information, see [Azure Storage Scalability and Performance Targets].)

   d. **Replication**: Specifies the replication for the storage account; for example "Zone Redundant". (For more information, see [Azure Storage Replication].)

   e. **Subscription**: Specifies the Azure subscription you want to use for the new storage account.

   f. **Location**: Specifies the location where your storage account will be created; for example "West US".

   g. **Resource Group**: Specifies the resource group for your virtual machine; you need to choose one of the following options:
      * **Create New**: Specifies that you want to create a new resource group.
      * **Use Existing**: Specifies that you will chose from a list resource groups associated with your Azure account.

1. When you have specified all of the above options, click **OK**.

## Creating a Storage Container in IntelliJ

The following steps will walk you through the steps to create a storage container using the Azure Explorer.

1. In the Azure Explorer, right-click the storage account where you want to create a container, and then click **Create blob container**.
   ![Create Storage Container Menu][CC01]

1. When the **Create Blob Container** dialog box appears, specify the name for your container, and then click **OK**. (For more information about naming storage containers, see [Naming and Referencing Containers, Blobs, and Metadata].)
   ![Create Storage Container Dialog Box][CC02]

## Deleting a Storage Container in IntelliJ

To delete a storage container using the Azure Explorer, use the following steps:

1. In the Azure Explorer, right-click the storage container, and then click **Delete**.
   ![Delete Storage Container Menu][DC01]

1. Click **Yes** when prompted to delete the storage container.
   ![Delete Storage Container Dialog Box][DC02]

## Deleting a Storage Account in IntelliJ

To delete a storage account using the Azure Explorer, use the following steps:

1. In the **Azure Explorer** tool window, right-click the storage account and chose **Delete**.
   ![Delete Storage Account Menu][DS01]

1. Click **Yes** when prompted to delete the storage account.
   ![Delete Storage Account Dialog Box][DS02]

## See Also
For more information about the Azure storage accounts, sizes and pricing, see the following links:

* [Introduction to Microsoft Azure Storage]
* [About Azure Storage Accounts]
* Azure Storage Account Sizes
   * [Sizes for Windows storage accounts in Azure]
   * [Sizes for Linux storage accounts in Azure]
* Azure Storage Account Pricing
   * [Windows Storage Accounts Pricing]
   * [Linux Storage Accounts Pricing]

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

[Introduction to Microsoft Azure Storage]: /azure/storage/storage-introduction
[About Azure Storage Accounts]: /azure/storage/storage-create-storage-account
[Azure Storage Replication]: /azure/storage/storage-redundancy
[Azure Storage Scalability and Performance Targets]: /azure/storage/storage-scalability-targets
[Naming and Referencing Containers, Blobs, and Metadata]: http://go.microsoft.com/fwlink/?LinkId=255555

[Sizes for Windows storage accounts in Azure]: /azure/virtual-machines/virtual-machines-windows-sizes
[Sizes for Linux storage accounts in Azure]: /azure/virtual-machines/virtual-machines-linux-sizes
[Windows Storage Accounts Pricing]: /pricing/details/virtual-machines/windows/
[Linux Storage Accounts Pricing]: /pricing/details/virtual-machines/linux/

<!-- IMG List -->

[CS01]: ./media/azure-toolkit-for-intellij-managing-storage-accounts-using-azure-explorer/CS01.png
[CS02]: ./media/azure-toolkit-for-intellij-managing-storage-accounts-using-azure-explorer/CS02.png
[CC01]: ./media/azure-toolkit-for-intellij-managing-storage-accounts-using-azure-explorer/CC01.png
[CC02]: ./media/azure-toolkit-for-intellij-managing-storage-accounts-using-azure-explorer/CC02.png

[DS01]: ./media/azure-toolkit-for-intellij-managing-storage-accounts-using-azure-explorer/DS01.png
[DS02]: ./media/azure-toolkit-for-intellij-managing-storage-accounts-using-azure-explorer/DS02.png
[DC01]: ./media/azure-toolkit-for-intellij-managing-storage-accounts-using-azure-explorer/DC01.png
[DC02]: ./media/azure-toolkit-for-intellij-managing-storage-accounts-using-azure-explorer/DC02.png
