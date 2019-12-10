---
title: Azure Functions Runtime Installation 
description: How to Install the Azure Functions Runtime preview 2
author: apwestgarth

ms.topic: conceptual
ms.date: 11/28/2017
ms.author: anwestg

---
# Install the Azure Functions Runtime preview 2

[!INCLUDE [intro](../../includes/functions-runtime-preview-note.md)]

If you would like to install the Azure Functions Runtime preview 2, follow these steps:

1. Ensure your machine passes the minimum requirements.
1. Download the [Azure Functions Runtime Preview Installer](https://aka.ms/azafrv2).
1. Uninstall the Azure Functions Runtime preview 1.
1. Install the Azure Functions Runtime preview 2.
1. Complete the configuration of the Azure Functions Runtime preview 2.
1. Create your first function in Azure Functions Runtime Preview

## Prerequisites

Before you install the Azure Functions Runtime preview, you must have the following resources available:

1. A machine running Microsoft Windows Server 2016 or Microsoft Windows 10 Creators Update (Professional or Enterprise Edition).
1. A SQL Server instance running within your network.  Minimum edition required is SQL Server Express.

## Uninstall Previous Version

If you have previously installed the Azure Functions Runtime preview, you must uninstall before installing the latest release.  Uninstall the Azure Functions Runtime preview by removing the program in Add/Remove Programs in Windows.

## Install the Azure Functions Runtime Preview

The Azure Functions Runtime Preview Installer guides you through the installation of the Azure Functions Runtime preview Management and Worker Roles.  It is possible to install the Management and Worker role on the same machine.  However, as you add more function apps, you must deploy more worker roles on additional machines to be able to scale your functions onto multiple workers.

## Install the Management and Worker Role on the same machine

1. Run the Azure Functions Runtime Preview Installer.

    ![Azure Functions Runtime preview installer][1]

1. Click **Next**.
1. Once you have read the terms of the **EULA**, **check the box** to accept the terms and click **Next** to advance.
1. Select the roles you want to install on this machine **Functions Management Role** and/or **Functions Worker Role** and click **Next**.

    ![Azure Functions Runtime preview installer - role selection][3]

    > [!NOTE]
    > You can install the **Functions Worker Role** on many other machines. To do so, follow these instructions, and only select **Functions Worker Role** in the installer.

1. Click **Next** to have the **Azure Functions Runtime Setup Wizard** begin the installation process on your machine.
1. Once complete, the setup wizard launches the **Azure Functions Runtime** configuration tool.

    ![Azure Functions Runtime preview installer complete][6]

    > [!NOTE]
    > If you are installing on **Windows 10** and the **Container** feature has not been previously enabled, the **Azure Functions Runtime Setup** prompts you to reboot your machine to complete the install.

## Configure the Azure Functions Runtime

To complete the Azure Functions Runtime installation, you must complete the configuration.

1. The **Azure Functions Runtime** configuration tool shows which roles are installed on your machine.

    ![Azure Functions Runtime preview configuration tool][7]

1. Click the **Database** tab, enter the connection details for your SQL Server instance, including specifying a [Database master key](https://docs.microsoft.com/sql/relational-databases/security/encryption/sql-server-and-database-encryption-keys-database-engine), and click **Apply**.  Connectivity to a SQL Server instance is required in order for the Azure Functions Runtime to create a database to support the Runtime.

    ![Azure Functions Runtime preview database configuration][8]

1. Click the **Credentials** tab.  Here, you must create two new credentials for use with a file share for hosting all your function apps.  Specify **User name** and **Password** combinations for the **file share owner** and for the **file share user**, then click **Apply**.

    ![Azure Functions Runtime preview credentials][9]

1. Click the **File Share** tab.  Here you must specify the details of the file share  location.  The file share can be created for you or you can use an existing File Share and click **Apply**.  If you select a new File Share location, you must specify a directory for use by the Azure Functions Runtime.

    ![Azure Functions Runtime preview file share][10]

1. Click the **IIS** tab.  This tab shows the details of the websites in IIS that the Azure Functions Runtime configuration tool creates.  You may specify a custom DNS name here for the Azure Functions Runtime preview portal.  Click **Apply** to complete.

    ![Azure Functions Runtime preview IIS][11]

1. Click the **Services** tab.  This tab shows the status of the services in your Azure Functions Runtime configuration tool.  If the  **Azure Functions Host Activation Service** is not running after initial configuration, click **Start Service**.

    ![Azure Functions Runtime preview configuration complete][12]

1. Browse to the **Azure Functions Runtime Portal** as `https://<machinename>.<domain>/`.

    ![Azure Functions Runtime preview portal][13]

## Create your first function in Azure Functions Runtime preview

To create your first function in Azure Functions Runtime preview

1. Browse to the **Azure Functions Runtime Portal** as `https://<machinename>.<domain>` for example `https://mycomputer.mydomain.com`.

1. You are prompted to **Log in**, if deployed in a domain use your domain account username and password, otherwise use your local account username and password to log in to the portal.

    ![Azure Functions Runtime preview portal login][14]

1. To create function apps, you must create a Subscription.  In the top left-hand corner of the portal, click the **+** option next to the subscriptions.

    ![Azure Functions Runtime preview portal subscriptions][15]

1. Choose **DefaultPlan**, enter a name for your Subscription, and click **Create**.

    ![Azure Functions Runtime preview portal subscription plan and name][16]

1. All of your function apps are listed in the left-hand pane of the portal.  To create a new Function App, select the heading **Function Apps** and click the **+** option.

1. Enter a name for your function app, select the correct Subscription, choose which version of the Azure Functions runtime you wish to program against and click **Create**

    ![Azure Functions Runtime preview portal new function app][17]

1. Your new function app is listed in the left-hand pane of the portal.  Select Functions and then click **New Function** at the top of the center pane in the portal.

    ![Azure Functions Runtime preview templates][18]

1. Select the Timer Trigger function, in the right-hand flyout name your function and change the Schedule to `*/5 * * * * *` (this cron expression causes your timer function to execute every five seconds), and click **Create**

    ![Azure Functions Runtime preview new timer function configuration][19]

1. Your function has now been created.  You can view the execution log of your Function app by expanding the **log** pane at the bottom of the portal.

    ![Azure Functions Runtime preview function executing][20]

<!--Image references-->
[1]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer1.png
[2]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer2-EULA.png
[3]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer3-ChooseRoles.png
[4]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer4-Install.png
[5]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer5-Progress.png
[6]: ./media/functions-runtime-install/AzureFunctionsRuntime_Installer6-InstallComplete.png
[7]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration1.png
[8]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration2_SQL.png
[9]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration3_Credentials.png
[10]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration4_Fileshare.png
[11]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration5_IIS.png
[12]: ./media/functions-runtime-install/AzureFunctionsRuntime_Configuration6_Services.png
[13]: ./media/functions-runtime-install/AzureFunctionsRuntime_Portal.png
[14]: ./media/functions-runtime-install/AzureFunctionsRuntime_Portal_Login.png
[15]: ./media/functions-runtime-install/AzureFunctionsRuntime_Portal_Subscriptions.png
[16]: ./media/functions-runtime-install/AzureFunctionsRuntime_Portal_Subscriptions1.png
[17]: ./media/functions-runtime-install/AzureFunctionsRuntime_Portal_NewFunctionApp.png
[18]: ./media/functions-runtime-install/AzureFunctionsRuntime_v1FunctionsTemplates.png
[19]: ./media/functions-runtime-install/AzureFunctionsRuntime_Portal_NewTimerFunction.png
[20]: ./media/functions-runtime-install/AzureFunctionsRuntime_Portal_RunningV2Function.png
