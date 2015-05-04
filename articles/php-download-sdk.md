<properties 
	pageTitle="Download the Azure SDK for PHP" 
	description="Learn how to download and install the Azure SDK for PHP." 
	documentationCenter="php" 
	services="" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="03/20/2015" 
	ms.author="tomfitz"/>

#Download the Azure SDK for PHP

## Overview

The Azure SDK for PHP includes components that allow you to develop, deploy, and manage PHP applications for Azure. Specifically, the Azure SDK for PHP includes the following:

* **The PHP client libraries for Azure**. These class libraries provide an interface for accessing Azure features, such as data management services and cloud services.  
* **The Azure Command-Line Tools for Mac and Linux**. This is a set of command-line tools for deploying and managing Azure services, such as Azure Websites and Azure Virtual Machines. These tools work on any platform, including Mac, Linux, and Windows.
* **Azure PowerShell (Windows Only)**. This is a set of PowerShell cmdlets for deploying and managing Azure Services, such as Cloud Services and Virtual Machines.
* **The Azure Emulators (Windows Only)**. The compute and storage emulators are local emulators of cloud services and data management services that allow you to test an application locally. The Azure Emulators run on Windows only.

The sections below describe how to download and install the components described above. 

The instructions in this topic assume that you have [PHP][install-php] installed.

> [AZURE.NOTE] 
> You must have PHP 5.3 or higher to use the PHP client libraries for Azure. 

##PHP client libraries for Azure

The PHP Client Libraries for Azure provide an interface for accessing Azure features, such as data management services and cloud services, from any operating system. These libraries can be installed via the Composer or PEAR package managers or manually.

For information about how to use the PHP Client Libraries for Azure, see [How to Use the Blob Service][blob-service], [How to Use the Table Service][table-service] and [How to Use the Queue Service][queue-service].

###Install via Composer

1. [Install Git][install-git]. 


	> [AZURE.NOTE] 
	> On Windows, you will also need to add the Git executable to your PATH environment variable.

2. Create a file named **composer.json** in the root of your project and add the following code to it:

        {
            "repositories": [
                {
                    "type": "pear",
                    "url": "http://pear.php.net"
                }
            ],
            "require": {
                "pear-pear.php.net/mail_mime" : "*",
                "pear-pear.php.net/http_request2" : "*",
                "pear-pear.php.net/mail_mimedecode" : "*",
                "microsoft/windowsazure": "*"
            }
        }

3. Download **[composer.phar][composer-phar]** in your project root.

4. Open a command prompt and execute this in your project root

		php composer.phar install

###Install as a PEAR package

To install the PHP Client Libraries for Azure as a PEAR package, follow these steps:

1. [Install PEAR][install-pear].
2. Set-up the Azure PEAR channel:

		pear channel-discover pear.windowsazure.com
3. Install the PEAR package:

		pear install pear.windowsazure.com/WindowsAzure-0.4.0

After the installation completes, you can reference class libraries from your application.

###Install manually

To download and install the PHP Client Libraries for Azure manually, follow these steps:

1. Download a .zip archive that contains the libraries from [GitHub][php-sdk-github]. Alternatively, fork the repository and clone it to your local machine. (The latter option requires a GitHub account and having Git installed locally.)

	> [AZURE.NOTE] 
	> The PHP Client Libraries for Azure have a dependency on the [HTTP_Request2](http://pear.php.net/package/HTTP_Request2), [Mail_mime](http://pear.php.net/package/Mail_mime), and [Mail_mimeDecode](http://pear.php.net/package/Mail_mimeDecode) PEAR packages. The recommended way to resolve these dependencies is to install these packages using the [PEAR package manager](http://pear.php.net/manual/en/installation.php)

2. Copy the `WindowsAzure` directory of the downloaded archive to your application directory structure and reference classes from your application.

##Azure PowerShell and Azure Emulators

Azure PowerShell is a set of PowerShell cmdlets for deploying and managing Azure Services (such as Cloud Services and Virtual Machines). The Azure Emulators are emulators of cloud services and data management services that allow you to test an application locally. These components are supported Windows only.

The recommended way to install Azure PowerShell and the Azure Emulators is to use the [Microsoft Web Platform Installer][download-wpi]. Note that you can also choose to install other development components, such as PHP, SQL Server, the Microsoft Drivers for SQL Server for PHP, and WebMatrix.

For information about how to use Azure PowerShell, see [How to Use Azure PowerShell][powershell-tools].

##Azure Command-Line Tools for Mac and Linux

The Azure Command-Line Tools for Mac and Linux are a set of command-line tools for deploying and managing Azure services, such as Azure Websites and Azure Virtual Machines. The following list describes how to install the tools, depending on your operating system:

* **Mac**: Download the Azure SDK Installer here: [http://go.microsoft.com/fwlink/?LinkId=252249][mac-installer]. Open the downloaded .pkg file and complete the installation steps as your are prompted.

* **Linux**: Install the latest version of [Node.js][nodejs-org] (see [Install Node.js via Package Manager][install-node-linux]), then run the following command:

		npm install azure-cli -g

	> [AZURE.NOTE] 
	> You may need to run this command with elevated privileges:  `sudo npm install azure-cli -g`


For information about how to use the Azure Command-Line Tools for Mac and Linux, see [How to Use the Command-Line Tools for Mac and Linux][crossplat-tools].

[install-php]: http://www.php.net/manual/en/install.php
[composer-github]: https://github.com/composer/composer
[composer-phar]: http://getcomposer.org/composer.phar
[pear-net]: http://pear.php.net/
[http-request2-package]: http://pear.php.net/package/HTTP_Request2
[mail-mimedecode-package]: http://pear.php.net/package/Mail_mimeDecode
[mail-mime-package]: http://pear.php.net/package/Mail_mime
[install-pear]: http://pear.php.net/manual/en/installation.getting.php
[nodejs-org]: http://nodejs.org/
[install-node-linux]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
[download-wpi]: http://go.microsoft.com/fwlink/?LinkId=253447
[mac-installer]: http://go.microsoft.com/fwlink/?LinkId=252249
[blob-service]: http://go.microsoft.com/fwlink/?LinkId=252714
[table-service]: http://go.microsoft.com/fwlink/?LinkId=252715
[queue-service]: http://go.microsoft.com/fwlink/?LinkId=252716
[crossplat-tools]: http://go.microsoft.com/fwlink/?LinkId=252717
[powershell-tools]: http://go.microsoft.com/fwlink/?LinkId=252718
[php-sdk-github]: http://go.microsoft.com/fwlink/?LinkId=252719
[install-git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
