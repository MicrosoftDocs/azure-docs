---
title: Create Azure web and worker roles for PHP
description: A guide to creating PHP web and worker roles in an Azure cloud service, and configuring the PHP runtime.
services: ''
documentationcenter: php
author: msangapu
manager: cfowler

ms.assetid: 9f7ccda0-bd96-4f7b-a7af-fb279a9e975b
ms.service: cloud-services
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: PHP
ms.topic: article
ms.date: 04/11/2018
ms.author: msangapu
---
# Create PHP web and worker roles

## Overview

This guide will show you how to create PHP web or worker roles in a Windows development environment, choose a specific version of PHP from the "built-in" versions available, change the PHP configuration, enable extensions, and finally, deploy to Azure. It also describes how to configure a web or worker role to use a PHP runtime (with custom configuration and extensions) that you provide.

Azure provides three compute models for running applications: Azure App Service, Azure Virtual Machines, and Azure Cloud Services. All three models support PHP. Cloud Services, which includes web and worker roles, provides *platform as a service (PaaS)*. Within a cloud service, a web role provides a dedicated Internet Information Services (IIS) web server to host front-end web applications. A worker role can run asynchronous, long-running or perpetual tasks independent of user interaction or input.

For more information about these options, see [Compute hosting options provided by Azure](cloud-services/cloud-services-choose-me.md).

## Download the Azure SDK for PHP

The [Azure SDK for PHP](php-download-sdk.md) consists of several components. This article will use two of them: Azure PowerShell and the Azure emulators. These two components can be installed via the Microsoft Web Platform Installer. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

## Create a Cloud Services project

The first step in creating a PHP web or worker role is to create an Azure Service project. an Azure Service project serves as a logical container for web and worker roles, and it contains the project's [service definition (.csdef)] and [service configuration (.cscfg)] files.

To create a new Azure Service project, run Azure PowerShell as an administrator, and execute the following command:

    PS C:\>New-AzureServiceProject myProject

This command will create a new directory (`myProject`) to which you can add web and worker roles.

## Add PHP web or worker roles

To add a PHP web role to a project, run the following command from within the project's root directory:

    PS C:\myProject> Add-AzurePHPWebRole roleName

For a worker role, use this command:

    PS C:\myProject> Add-AzurePHPWorkerRole roleName

> [!NOTE]
> The `roleName` parameter is optional. If it is omitted, the role name will be automatically generated. The first web role created will be `WebRole1`, the second will be `WebRole2`, and so on. The first worker role created will be `WorkerRole1`, the second will be `WorkerRole2`, and so on.
>
>

## Specify the built-in PHP version

When you add a PHP web or worker role to a project, the project's configuration files are modified so that PHP will be installed on each web or worker instance of your application when it is deployed. To see the version of PHP that will be installed by default, run the following command:

    PS C:\myProject> Get-AzureServiceProjectRoleRuntime

The output from the command above will look similar to what is shown below. In this example, the `IsDefault` flag is set to `true` for PHP 5.3.17, indicating that it will be the default PHP version installed.

```
Runtime Version     PackageUri                      IsDefault
------- -------     ----------                      ---------
Node 0.6.17         http://nodertncu.blob.core...   False
Node 0.6.20         http://nodertncu.blob.core...   True
Node 0.8.4          http://nodertncu.blob.core...   False
IISNode 0.1.21      http://nodertncu.blob.core...   True
Cache 1.8.0         http://nodertncu.blob.core...   True
PHP 5.3.17          http://nodertncu.blob.core...   True
PHP 5.4.0           http://nodertncu.blob.core...   False
```

You can set the PHP runtime version to any of the PHP versions that are listed. For example, to set the PHP version (for a role with the name `roleName`) to 5.4.0, use the following command:

    PS C:\myProject> Set-AzureServiceProjectRole roleName php 5.4.0

> [!NOTE]
> Available PHP versions may change in the future.
>
>

## Customize the built-in PHP runtime

You have complete control over the configuration of the PHP runtime that is installed when you follow the steps above, including modification of `php.ini` settings and enabling of extensions.

To customize the built-in PHP runtime, follow these steps:

1. Add a new folder, named `php`, to the `bin` directory of your web role. For a worker role, add it to the role's root directory.
2. In the `php` folder, create another folder called `ext`. Put any `.dll` extension files (e.g., `php_mongo.dll`) that you want to enable in this folder.
3. Add a `php.ini` file to the `php` folder. Enable any custom extensions and set any PHP directives in this file. For example, if you wanted to turn `display_errors` on and enable the `php_mongo.dll` extension, the contents of your `php.ini` file would be as follows:

        display_errors=On
        extension=php_mongo.dll

> [!NOTE]
> Any settings that you don't explicitly set in the `php.ini` file that you provide will automatically be set to their default values. However, keep in mind that you can add a complete `php.ini` file.
>
>

## Use your own PHP runtime

In some cases, instead of selecting a built-in PHP runtime and configuring it as described above, you may want to provide your own PHP runtime. For example, you can use the same PHP runtime in a web or worker role that you use in your development environment. This makes it easier to ensure that the application will not change behavior in your production environment.

### Configure a web role to use your own PHP runtime

To configure a web role to use a PHP runtime that you provide, follow these steps:

1. Create an Azure Service project and add a PHP web role as described previously in this topic.
2. Create a `php` folder in the `bin` folder that is in your web role's root directory, and then add your PHP runtime (all binaries, configuration files, subfolders, etc.) to the `php` folder.
3. (OPTIONAL) If your PHP runtime uses the [Microsoft Drivers for PHP for SQL Server][sqlsrv drivers], you will need to configure your web role to install [SQL Server Native Client 2012][sql native client] when it is provisioned. To do this, add the [sqlncli.msi x64 installer] to the `bin` folder in your web role's root directory. The startup script described in the next step will silently run the installer when the role is provisioned. If your PHP runtime does not use the Microsoft Drivers for PHP for SQL Server, you can remove the following line from the script shown in the next step:

        msiexec /i sqlncli.msi /qn IACCEPTSQLNCLILICENSETERMS=YES
4. Define a startup task that configures [Internet Information Services (IIS)][iis.net] to use your PHP runtime to handle requests for `.php` pages. To do this, open the `setup_web.cmd` file (in the `bin` file of your web role's root directory) in a text editor and replace its contents with the following script:

    ```cmd
    @ECHO ON
    cd "%~dp0"

    if "%EMULATED%"=="true" exit /b 0

    msiexec /i sqlncli.msi /qn IACCEPTSQLNCLILICENSETERMS=YES

    SET PHP_FULL_PATH=%~dp0php\php-cgi.exe
    SET NEW_PATH=%PATH%;%RoleRoot%\base\x86

    %WINDIR%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /+"[fullPath='%PHP_FULL_PATH%',maxInstances='12',idleTimeout='60000',activityTimeout='3600',requestTimeout='60000',instanceMaxRequests='10000',protocol='NamedPipe',flushNamedPipe='False']" /commit:apphost
    %WINDIR%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /+"[fullPath='%PHP_FULL_PATH%'].environmentVariables.[name='PATH',value='%NEW_PATH%']" /commit:apphost
    %WINDIR%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /+"[fullPath='%PHP_FULL_PATH%'].environmentVariables.[name='PHP_FCGI_MAX_REQUESTS',value='10000']" /commit:apphost
    %WINDIR%\system32\inetsrv\appcmd.exe set config -section:system.webServer/handlers /+"[name='PHP',path='*.php',verb='GET,HEAD,POST',modules='FastCgiModule',scriptProcessor='%PHP_FULL_PATH%',resourceType='Either',requireAccess='Script']" /commit:apphost
    %WINDIR%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /"[fullPath='%PHP_FULL_PATH%'].queueLength:50000"
    ```
5. Add your application files to your web role's root directory. This will be the web server's root directory.
6. Publish your application as described in the [Publish your application](#publish-your-application) section below.

> [!NOTE]
> The `download.ps1` script (in the `bin` folder of the web role's root directory) can be deleted after you follow the steps described above for using your own PHP runtime.
>
>

### Configure a worker role to use your own PHP runtime

To configure a worker role to use a PHP runtime that you provide, follow these steps:

1. Create an Azure Service project and add a PHP worker role as described previously in this topic.
2. Create a `php` folder in the worker role's root directory, and then add your PHP runtime (all binaries, configuration files, subfolders, etc.) to the `php` folder.
3. (OPTIONAL) If your PHP runtime uses [Microsoft Drivers for PHP for SQL Server][sqlsrv drivers], you will need to configure your worker role to install [SQL Server Native Client 2012][sql native client] when it is provisioned. To do this, add the [sqlncli.msi x64 installer] to the worker role's root directory. The startup script described in the next step will silently run the installer when the role is provisioned. If your PHP runtime does not use the Microsoft Drivers for PHP for SQL Server, you can remove the following line from the script shown in the next step:

        msiexec /i sqlncli.msi /qn IACCEPTSQLNCLILICENSETERMS=YES
4. Define a startup task that adds your `php.exe` executable to the worker role's PATH environment variable when the role is provisioned. To do this, open the `setup_worker.cmd` file (in the worker role's root directory) in a text editor and replace its contents with the following script:

    ```cmd
    @echo on

    cd "%~dp0"

    echo Granting permissions for Network Service to the web root directory...
    icacls ..\ /grant "Network Service":(OI)(CI)W
    if %ERRORLEVEL% neq 0 goto error
    echo OK

    if "%EMULATED%"=="true" exit /b 0

    msiexec /i sqlncli.msi /qn IACCEPTSQLNCLILICENSETERMS=YES

    setx Path "%PATH%;%~dp0php" /M

    if %ERRORLEVEL% neq 0 goto error

    echo SUCCESS
    exit /b 0

    :error

    echo FAILED
    exit /b -1
    ```
5. Add your application files to your worker role's root directory.
6. Publish your application as described in the [Publish your application](#publish-your-application) section below.

## Run your application in the compute and storage emulators

The Azure emulators provide a local environment in which you can test your Azure application before you deploy it to the cloud. There are some differences between the emulators and the Azure environment. To understand this better, see [Use the Azure storage emulator for development and testing](storage/common/storage-use-emulator.md).

Note that you must have PHP installed locally to use the compute emulator. The compute emulator will use your local PHP installation to run your application.

To run your project in the emulators, execute the following command from your project's root directory:

    PS C:\MyProject> Start-AzureEmulator

You will see output similar to this:

    Creating local package...
    Starting Emulator...
    Role is running at http://127.0.0.1:81
    Started

You can see your application running in the emulator by opening a web browser and browsing to the local address shown in the output (`http://127.0.0.1:81` in the example output above).

To stop the emulators, execute this command:

    PS C:\MyProject> Stop-AzureEmulator

## Publish your application

To publish your application, you need to first import your publish settings by using the [Import-AzurePublishSettingsFile](https://docs.microsoft.com/powershell/module/servicemanagement/azure/import-azurepublishsettingsfile) cmdlet. Then you can publish your application by using the [Publish-AzureServiceProject](https://docs.microsoft.com/powershell/module/servicemanagement/azure/publish-azureserviceproject) cmdlet. For information about signing in, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

## Next steps

For more information, see the [PHP Developer Center](https://azure.microsoft.com/develop/php/).

[install ps and emulators]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[service definition (.csdef)]: http://msdn.microsoft.com/library/windowsazure/ee758711.aspx
[service configuration (.cscfg)]: http://msdn.microsoft.com/library/windowsazure/ee758710.aspx
[iis.net]: http://www.iis.net/
[sql native client]: https://docs.microsoft.com/sql/sql-server/sql-server-technical-documentation
[sqlsrv drivers]: http://php.net/sqlsrv
[sqlncli.msi x64 installer]: http://go.microsoft.com/fwlink/?LinkID=239648
