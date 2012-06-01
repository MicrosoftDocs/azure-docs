<properties umbracoNaviHide="0" pageTitle="Download the Windows Azure SDK for PHP" metaKeywords="Windows Azure, Windows Azure SDK for PHP, PHP, Azure PHP" metaDescription="Learn how to download and install the Windows Azure SDK for PHP." linkid="dev-php-download-php-sdk" urlDisplayName="Download the Windows Azure SDK for PHP" headerExpose="" footerExpose="" disqusComments="1" />

#Download the Windows Azure SDK for PHP

The Windows Azure SDK for PHP includes components that allow you to develop, deploy, and manage PHP applications for Windows Azure. Specifically, the Windows Azure SDK for PHP includes the following:

* **The PHP client libraries for Windows Azure**. These class libraries provide an interface for accessing Windows Azure features, such as Cloud Storage and Cloud Services.  
* **The Windows Azure Command-Line Tools for Mac and Linux**. This is a set of command-line tools for deploying and managing Windows Azure services, such as Windows Azure Websites and Windows Azure Virtual Machines. These tools work on any platform, including Mac, Linux, and Windows.
* **Windows Azure PowerShell (Windows Only)**. This is a set of PowerShell cmdlets for deploying and managing Windows Azure Services, such as Cloud Services and Virtual Machines.
* **The Windows Azure Emulators (Windows Only)**. The compute and storage emulators are local emulators of Cloud Services and Cloud Storage that allow you to test an application locally. The Windows Azure Emulators run on Windows only.

The sections below describe how to download and install the components described above. 

The instructions in this topic assume that you have [PHP][install-php] installed.

<div class="dev-callout"> 
<b>Note</b> 
<p>You must have PHP 5.3 or higher to use the PHP client libraries for Windows Azure.</p> 
</div>



##PHP client libraries for Windows Azure

The PHP Client Libraries for Windows Azure provide an interface for accessing Windows Azure features, such as Cloud Storage and Cloud Services, from any operating system. These libraries can be installed as a PEAR package or manually.

For information about how to use the PHP Client Libraries for Windows Azure, see [How to Use the Blob Service from PHP][blob-service], [How to Use the Table Service from PHP][table-service], and [How to Use the Queue Service from PHP][queue-service].

###Install as a PEAR package

To install the PHP Client Libraries for Windows Azure as a PEAR package, follow these steps:

1. [Install PEAR][install-pear].
2. Install the PEAR package:

		pear install pear.windowsazure.com/WindowsAzure

After the installation completes, you can reference class libraries from your application.

###Install manually

To download and install the PHP Client Libraries for Windows Azure manually, follow these steps:

1. Download a .zip archive that contains the libraries from [GitHub][php-sdk-github]. Alternatively, fork the repository and clone it to your local machine. (The latter option requires a GitHub account and having Git installed locally.)

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>The PHP Client Libraries for Windows Azure have a dependency on the <a href="http://pear.php.net/package/HTTP_Request2">HTTP_Request2</a>, <a href="http://pear.php.net/package/Mail_mime">Mail_mime</a>, and <a href="http://pear.php.net/package/Mail_mimeDecode">Mail_mimeDecode</a> PEAR packages. The recommended way to resolve these dependencies is to install these packages using the <a href="http://pear.php.net/manual/en/installation.php">PEAR package manager</a>.</p> 
	</div>


2. Copy the `WindowsAzure` directory of the downloaded archive to your application directory structure and reference classes from your application. Alternatively, put the `WindowsAzure` directory in your `include_path` and reference classes from your application.

##Windows Azure PowerShell and Windows Azure Emulators

Windows Azure PowerShell is a set of PowerShell cmdlets for deploying and managing Windows Azure Services (such as Cloud Services and Virtual Machines). The Windows Azure Emulators are emulators of Cloud Services and Cloud Storage that allow you to test an application locally. These components are supported Windows only.

The recommended way to install Windows Azure PowerShell and the Windows Azure Emulators is to use the [Microsoft Web Platform Installer][download-wpi]. After downloading the Web Platform Installer, select **TODO: What to select?** and follow the prompts to complete the installation.

Note that you can also choose to install other development components, such as PHP, SQL Server, the Microsoft Drivers for SQL Server for PHP, and WebMatrix.

For information about how to use Windows Azure PowerShell, see [How to Use Windows Azure PowerShell][powershell-tools].

##Windows Azure Command-Line Tools for Mac and Linux

The Windows Azure Command-Line Tools for Mac and Linux are a set of command-line tools for deploying and managing Windows Azure services, such as Windows Azure Websites and Windows Azure Virtual Machines. The following list describes how to install the tools, depending on your operating system:

* **Mac**: Download the Windows Azure SDK Installer here: [http://go.microsoft.com/fwlink/?LinkId=252249][mac-installer]. Open the downloaded .pkg file and complete the installation steps as your are prompted.

* **Linux**: Install the latest version of [Node.js][nodejs-org] (see [Install Node.js via Package Manager][install-node-linux]), then run the following command:

		npm install azure -g

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>You may need to run this command with elevated privileges:
	
		sudo npm install azure -g
	</p> 
	</div>

For information about how to use the Windows Azure Command-Line Tools for Mac and Linux, see [How to Use the Command-Line Tools for Mac and Linux][crossplat-tools].

[install-php]: http://www.php.net/manual/en/install.php
[composer-github]: https://github.com/composer/composer
[pear-net]: http://pear.php.net/
[http-request2-package]: http://pear.php.net/package/HTTP_Request2
[mail-mimedecode-package]: http://pear.php.net/package/Mail_mimeDecode
[mail-mime-package]: http://pear.php.net/package/Mail_mime
[install-pear]: http://pear.php.net/manual/en/installation.php
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