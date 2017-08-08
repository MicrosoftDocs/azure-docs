---
title: Before you deploy App Service on Azure Stack | Microsoft Docs
description: Steps to complete before you deploy App Service on Azure Stack
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 7/3/2017
ms.author: anwestg

---
# Before you get started with App Service on Azure Stack

You need a few items to install Azure App Service on Azure Stack:

- A completed deployment of the [Azure Stack development kit](azure-stack-run-powershell-script.md).
- Enough space in your Azure Stack system for a small deployment of App Service on Azure Stack.  The required space is roughly 20 GB of disk space.
- A Windows Server VM image for use when you create virtual machines for App Service on Azure Stack.
- [A server that's running SQL Server](#SQL-Server).

>[!NOTE] 
> The following steps *all* take place on the Azure Stack host machine.

To deploy a resource provider, you must run the PowerShell Integrated Scripting Environment (ISE) as an administrator. For this reason, you need to allow cookies and JavaScript in the Internet Explorer profile that you use to sign in to Azure Active Directory.

## Turn off Internet Explorer enhanced security

1.	Sign in to the Azure Stack development kit machine as **AzureStack/administrator**, and then open **Server Manager**.

2.	Turn off **Internet Explorer Enhanced Security Configuration** for both admins and users.

3.	Sign in to the Azure Stack development kit machine as an administrator, and then open **Server Manager**.

4.	Turn off **Internet Explorer Enhanced Security Configuration** for both admins and users.

## Enable cookies

1.	Select **Start** > **All apps** > **Windows accessories**. Right-click **Internet Explorer** > **More** > **Run as an administrator**.

2.	If you're prompted, select **Use recommended security**, and then select **OK**.

3.	In Internet Explorer, select **Tools** (the gear icon) > **Internet Options** > **Privacy** > **Advanced**.

4.	Select **Advanced**. Make sure that both **Accept** check boxes are selected. Select **OK** twice.

5.	Close Internet Explorer, and restart the PowerShell ISE as an administrator.

## Install PowerShell for Azure Stack

To install PowerShell for Azure Stack, follow the steps in [Install PowerShell](azure-stack-powershell-install.md).

## Use Visual Studio with Azure Stack

To use Visual Studio with Azure Stack, follow the steps in [Install Visual Studio](azure-stack-install-visual-studio.md).

## Add a Windows Server 2016 VM image to Azure Stack

Because App Service deploys a number of virtual machines, it requires a Windows Server 2016 VM image in Azure Stack. To install a VM image, follow the steps in [Add a default virtual machine image](azure-stack-add-default-image.md).

## <a name="SQL-Server"></a>SQL Server

App Service on Azure Stack requires access to a SQL Server instance to create and host two databases to run the App Service resource provider.  Should you choose to deploy a SQL Server VM on Azure Stack it must have the SQL connectivity level set to **Public**.  You can choose the SQL Server instance to use when you complete the options in the App Service on Azure Stack installer.

## Next steps

- [Install the App Service resource provider](azure-stack-app-service-deploy.md).

<!--Image references-->
[1]: ./media/azure-stack-app-service-before-you-get-started/PSGallery.png
[2]: ./media/azure-stack-app-service-before-you-get-started/WebPI_InstalledProducts.png
