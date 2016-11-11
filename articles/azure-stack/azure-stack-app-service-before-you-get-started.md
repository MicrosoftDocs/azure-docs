---
title: App Service on Azure Stack Technical Preview 2 Before You Get Started | Microsoft Docs
description: Steps to complete before deploying App Service on Azure Stack
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
ms.date: 11/10/2016
ms.author: anwestg

---
# Before you get started with App Service on Azure Stack

You need a few items to install App Service on Azure Stack:

- A completed deployment of [Azure Stack Technical Preview 2](azure-stack-run-powershell-script.md)
- Enough space in your Azure Stack system for a small deployment of App Service on Azure Stack.  The required space is roughly 20 GB of disk space.
- [A server that's running SQL Server](#SQL-Server).

>[!NOTE] 
> The following steps ALL take place on the Client VM.

## Before you deploy App Service on Azure Stack

To deploy a resource provider, you must run the PowerShell Integrated Scripting Environment(ISE) as an administrator. For this reason, you need to allow cookies and JavaScript in the Internet Explorer profile that you use to sign in to Azure Active Directory.

## Turn off Internet Explorer enhanced security

1.	Sign in to the Azure Stack proof-of-concept (POC) computer as **AzureStack/administrator**, and then open **Server Manager**.
2.	Turn off **Internet Explorer Enhanced Security Configuration** for both admins and users.
3.	Sign in to the ClientVM.AzureStack.local virtual machine as an administrator, and then open **Server Manager**.
4.	Turn off **Internet Explorer Enhanced Security Configuration** for both admins and users.

## Enable cookies

1.	Select **Start**, > **All apps**, > **Windows accessories**. Right-click **Internet Explorer** > **More** > **Run as an administrator**.
2.	If you are prompted, select **Use recommended security**, and then select **OK**.
3.	In Internet Explorer, select **Tools** (the gear icon), > **Internet Options** > **Privacy** > **Advanced**.
4.	Select **Advanced**. Make sure that both of the **Accept** check boxes are selected, and then select **OK** and **OK** again.
5.	Close Internet Explorer, and restart PowerShell ISE as an administrator.

## Use PSGallery to Install AzureRM PowerShell

The following steps provide guidance on how to install the AzureRM modules to the MAS-CON01 VM.
> [!NOTE]
> If you intend on using Visual Studio as well, refer to the Using Visual Studio + Azure Stack TP2 on the MAS-CON01 VM section.

Perform the following steps from the MAS-CON01 VM, PowerShell console:

1.  Open a Remote Desktop session to MAS-CON01 (login as azurestack\azurestackadmin)
2.  Open a PowerShell Console as Administrator
3.  You will be installing the AzureRM modules from the PSGallery. To see more details on about the PSGallery, run Get-PSRepository:
![Get-PSRepository Result][1]
4.  Execute the following command:
    Install-Module -Name AzureRM -RequiredVersion 1.2.6 -Scope CurrentUser
    a.	-Scope CurrentUser is optional
    b.	If you want everyone to have access to the modules, use an elevated command prompt and leave off the Scope parameter
5.  This command will execute, run for a bit, and install the AzureRM modules from the PSGallery
6.  To confirm the installation of the AzureRM modules, execute the following commands:
    Get-Module -ListAvailable | where {$_.Name -match "AzureRM"}
    Get-Command -Module AzureRM.AzureStackAdmin
    a.	If you do not see the AzureRM modules listed, restart the MAS-CON01 VM
    b.	When the machine has restarted, check for the modules again
7.  The AzureRM modules have now been Installed and can now be used by the CurrentUser
8.  Exit the PS Console and open another before you start using the cmdlets
>[AZURE.NOTE]  These same instructions can be used to install the AzureRM modules on other machines as well.

## Using Visual Studio 2015 and Azure Stack TP2 on the MAS-CON01 VM

The following steps provide guidance on how to install Visual Studio Community 2015 with Microsoft Azure SDK 2.9.5 and Microsoft Azure PowerShell - Azure Stack Technical Preview 2 on the MAS-CON01 VM.

1.  Open a Remote Desktop session to MAS-CON01 (login as azurestack\azurestackadmin)
2.  Install and Open Web Platform Installer from https://www.microsoft.com/web/downloads/platform.aspx
3.  Find and Install Visual Studio Community 2015 with Microsoft Azure SDK - 2.9.5
4.  Once the install is complete, go to Add/Remove Programs and Uninstall the Microsoft Azure PowerShell (Sept) that gets installed as part of the SDK
5.  Go to Web Platform Installer
6.  Find and Install Microsoft Azure PowerShell - Azure Stack Technical Preview 2
7.  Visual Studio Community, Azure SDK, and Azure Stack TP2 PowerShell have now been installed
![WebPI - Products Installed][2]
8.  Open Visual Studio and validate you can connect to the Azure Stack environment / get templates / etc.


## SQL Server

By default, the App Service on Azure Stack installer is set to use the SQL Server that is installed along with the Azure Stack SQL Resource Provider. When you install the SQL Server Resource Provider (SQL RP), ensure you take note of the database administrator username and password. You need both when you install App Service on Azure Stack.
Note: You can deploy and use another server to run SQL Server. You can choose the SQL Server instance to use when you complete the options in the App Service on Azure Stack installer.

<!--Image references-->
[1]: ./media/azure-stack-app-service-before-you-get-started/PSGallery.png
[2]: ./media/azure-stack-app-service-before-you-get-started/WebPI_InstalledProducts.png
