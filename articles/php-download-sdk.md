---
title: Download the Azure SDK for PHP
description: Learn how to download and install the Azure SDK for PHP.
documentationcenter: php
services: app-service\web
author: allclark
manager: douge
editor: ''

ms.assetid: bac355ac-4c25-42f4-8273-c5112eafa8d4
ms.service: app-service-web
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: PHP
ms.topic: article
ms.date: 06/01/2016
ms.author: yaya

---
# Download the Azure SDK for PHP

## Overview

The Azure SDK for PHP includes components that allow you to develop, deploy, and manage PHP applications for Azure. Specifically, the Azure SDK for PHP includes the following:

* **The PHP client libraries for Azure**. These class libraries provide an interface for accessing Azure features, such as data management services and cloud services.
* **The Azure Command-Line Interface for Mac, Linux, and Windows (Azure CLI)**. This is a set of commands for deploying and managing Azure services, such as Azure Websites and Azure Virtual Machines. The Azure CLI work on any platform, including Mac, Linux, and Windows.
* **Azure PowerShell (Windows Only)**. This is a set of PowerShell cmdlets for deploying and managing Azure Services, such as Cloud Services and Virtual Machines.
* **The Azure Emulators (Windows Only)**. The compute and storage emulators are local emulators of cloud services and data management services that allow you to test an application locally. The Azure Emulators run on Windows only.

The sections below describe how to download and install the components described above.

The instructions in this topic assume that you have [PHP][install-php] installed.

> [!NOTE]
> You must have PHP 5.5 or higher to use the PHP client libraries for Azure.
>
>

## PHP client libraries for Azure

The PHP Client Libraries for Azure provide an interface for accessing Azure features, such as data management services and cloud services, from any operating system. These libraries can be installed via the Composer.

For information about how to use the PHP Client Libraries for Azure, see [How to Use the Blob Service][blob-service], [How to Use the Table Service][table-service] and [How to Use the Queue Service][queue-service].

### Install via Composer

1. [Install Git][install-git]. On Windows, you will also need to add the Git executable to your PATH environment variable.

2. Create a file named **composer.json** in the root of your project and add the following code to it:

        {
            "require": {
                "microsoft/windowsazure": "^0.4"
            }
        }

3. Download **[composer.phar][composer-phar]** in your project root.

4. Open a command prompt and execute this in your project root

        php composer.phar install

## Azure PowerShell and Azure Emulators

Azure PowerShell is a set of PowerShell cmdlets for deploying and managing Azure Services (such as Cloud Services and Virtual Machines). The Azure Emulators are emulators of cloud services and data management services that allow you to test an application locally. These components are supported Windows only.

The recommended way to install Azure PowerShell and the Azure Emulators is to use the [Microsoft Web Platform Installer][download-wpi]. Note that you can also choose to install other development components, such as PHP, SQL Server, the Microsoft Drivers for SQL Server for PHP, and WebMatrix.

For information about how to use Azure PowerShell, see [How to Use Azure PowerShell][powershell-tools].

## Azure CLI

The Azure CLI is a set of commands for deploying and managing Azure services, such as Azure Websites and Azure Virtual Machines. For information about installing Azure CLI, see [Install the Azure CLI](cli-install-nodejs.md).

## Next steps

For more information, see the [PHP Developer Center](https://azure.microsoft.com/develop/php/).

[install-php]: https://www.php.net/manual/en/install.php
[composer-github]: https://github.com/composer/composer
[composer-phar]: https://getcomposer.org/composer.phar
[nodejs-org]: https://nodejs.org/
[install-node-linux]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
[download-wpi]: https://go.microsoft.com/fwlink/?LinkId=253447
[mac-installer]: https://go.microsoft.com/fwlink/?LinkId=252249
[blob-service]: https://go.microsoft.com/fwlink/?LinkId=252714
[table-service]: https://go.microsoft.com/fwlink/?LinkId=252715
[queue-service]: https://go.microsoft.com/fwlink/?LinkId=252716
[azure cli]: https://go.microsoft.com/fwlink/?LinkId=252717
[powershell-tools]: https://go.microsoft.com/fwlink/?LinkId=252718
[php-sdk-github]: https://go.microsoft.com/fwlink/?LinkId=252719
[install-git]: https://git-scm.com/book/en/Getting-Started-Installing-Git
