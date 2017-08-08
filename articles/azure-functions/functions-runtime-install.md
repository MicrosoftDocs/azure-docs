---
title: Azure Functions Runtime Installation | Microsoft Docs
description: How to Install the Azure Functions Runtime
services: functions
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid:
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 05/08/2017
ms.author: anwestg

---

# Install the Azure Functions Runtime Preview

If you would like to install the Azure Functions Runtime preview, you must follow these steps:

1. Ensure your machine passes the minimum requirements
1. Download the [Azure Functions Runtime Preview Installer](https://aka.ms/azafr). 
1. Install the Azure Functions Runtime preview
1. Complete the configuration of the Azure Functions Runtime preview

## Prerequisites

Before you install the Azure Functions Runtime preview, you must have the following:

1. A machine running Microsoft Windows Server 2016 or Microsoft Windows 10 Creators Update (Professional or Enterprise Edition).
1. A SQL Server instance running within your network.  Minimum edition requirement is SQL Server Express.

## Install the Azure Functions Runtime Preview

The Azure Functions Runtime preview installer guides you through the installation of the Azure Functions Runtime preview Management and Worker Roles.  It is possible to install the Management and Worker role on the same machine.  However, as you add more Functions, you must deploy more worker roles on additional machines to be able to scale your functions onto multiple workers.

## Install the Management and Worker Role on the same machine

1. Run the Azure Functions Runtime Preview Installer.

    ![Azure Functions Runtime Preview Installer][1]

1. **Click Next** advance past the first stage of the installer
1. Once you have read the terms of the **EULA**, **check the box** to accept the terms and **click Next** to advance.
1. Now select the roles you want to install on this machine **Functions Management Role** and/or **Functions Worker Role** and **Click Next**

    ![Azure Functions Runtime Preview Installer - Role Selection][3]

    > [!NOTE]
    > You can install the **Functions Worker Role** on many other machines to do so, follow these instructions, and only select **Functions Worker Role** in the installer.

1. **Click Next** to have the **Azure Functions Runtime Installer** install on your machine.
1. Once complete the installer will launch the **Azure Functions Runtime Configuration tool**.

    ![Azure Functions Runtime Preview Installer Complete][5]

    > [!NOTE]
    > If you are installing on **Windows 10** and the **Container** feature has not been previously enabled, the **Azure Functions Runtime** Installer prompts you to reboot your machine to complete the install.

## Configure the Azure Functions Runtime

To complete the Azure Functions Runtime installation you must complete the configuration.

1. The **Azure Functions Runtime Configuration Tool** shows which roles are installed on your machine.

    ![Azure Functions Runtime Preview Configuration Tool][6]

1. Click the **Database** tab, enter the **connection details for your SQL Server Instance** and **click Apply**.  This is required in order to the Azure Functions Runtime to create a database to support the Runtime.
    
    ![Azure Functions Runtime Preview Database Configuration][7]

1. Click the **Credentials** tab.  On this screen you must create two new credentials for use with a FileShare for hosting all your Azure Functions.  **Specify Username and Password** combinations for the **File Share Owner** and for the **File Share User** and click **Apply**.

    ![Azure Functions Runtime Preview Credentials][8]

1. Click the **File Share** tab.  In this screen you must specify the details of the **File Share location**.  This can be created for you or you can use an existing File Share and click **Apply**.  If you select a new File Share location, you must specify a directory for use by the Azure Functions Runtime.
    
    ![Azure Functions Runtime Preview File Share][9]

1. Click the **IIS** tab.  This tab shows the details of the websites in IIS that the Azure Functions Runtime Installation will create.  **Click Apply** to complete.

    ![Azure Functions Runtime Preview IIS][10]

1. Click the **Services** tab.  This tab shows the status of the services in your Azure Functions Runtime installation.  If after initial configuration the **Azure Functions Host Activation Service** is not running click **Start Service**

    ![Azure Functions Runtime Preview Configruation Complete][11]

1. Finally browse to the **Azure Functions Runtime Portal** as `https://<machinename>/`

    ![Azure Functions Runtime Preview Portal][12]


<!--Image references-->
[1]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer1.png
[2]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer2-EULA.png
[3]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer3-ChooseRoles.png
[4]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer4-Install.png
[5]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer5-InstallComplete.png
[6]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration1.png
[7]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration2_SQL.png
[8]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration3_Credentials.png
[9]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration4_Fileshare.png
[10]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration5_IIS.png
[11]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration6_Services.png
[12]: ./media/functions-runtime-install/AzureFunctionsRuntime_Portal.png