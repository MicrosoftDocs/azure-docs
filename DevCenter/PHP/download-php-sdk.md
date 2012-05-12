<properties umbracoNaviHide="0" pageTitle="Download the Windows Azure SDK for PHP" metaKeywords="Windows Azure, Windows Azure SDK for PHP, PHP, Azure PHP" metaDescription="Learn how to download and install the Windows Azure SDK for PHP." linkid="dev-php-download-php-sdk" urlDisplayName="Download the Windows Azure SDK for PHP" headerExpose="" footerExpose="" disqusComments="1" />

#Download the Windows Azure SDK for PHP

The Windows Azure SDK for PHP includes components that allow you to develop, deploy, and mangage PHP applications for Windows Azure. Specifically, the Windows Azure SDK for PHP includes the following:

* **The PHP Client Libraries for Windows Azure**. These class libraries provide an interface for accessing Windows Azure features, such as Cloud Storage and Cloud Services.  
* **The Cross-Platform Tools for Windows Azure**. These are a set of command-line tools for deploying and managing Windows Azure services, such as Windows Azure Websites and Windows Azure Virtual Machines. These tools work on any platform, including MacIntosh, Linux, and Windows.
* **The Windows Azure Emulators (Windows Only)**. The compute and storage emulators are local emulators of Cloud Services and Cloud Storage that allow you to test an application locally. The Windows Azure Emulators run on Windows only.

The sections below describe how to download and install the components described above. The following options are covered:

1. Installing the PHP Client Libraries for Windows Azure 
* As a [PEAR][pear-net] package
* Using [Composer][composer-github]
* Manually 
 
2. Installing the Cross-Platform Tools for Windows Azure
3. Installing the Windows Azure Emulators (Windows only)

The instructions in this topic assume that you have [PHP][install-php] installed.

##PHP Client Libraries for Windows Azure - Install as a PEAR Package
To install the PHP Client Libraries for Windows Azure as a PEAR package, follow these steps:

1. [Install PEAR][install-pear].
2. Run the following command from a command prompt:

		pear install **TODO: need name for package**

After the installation completes, you can reference class libraries from your application.

##PHP Client Libraries for Windows Azure - Install Using Composer

**TODO: Get help with this. I've never used composer.**

##PHP Client Libraries for Windows Azure - Manual Installation

To download and install the PHP Client Libraries for PHP manually, follow these steps:

1. Download a .zip archive that contains the libraries from Github: **TODO: Provide link**. Alternatively, fork the repository and clone it to your local machine. (The latter option requires a Github account and having Git installed locally.)

	**Note**: The PHP Client Libraries for Windows Azure have a dependency on the [HTTP\_Request2][http-request2-package], [Mail\_mime][mail-mime-package], and [Mail\_mimeDecode][mail-mimedecode-package] PEAR packages. The recommended way to resolve these dependencies is to install these packages using the [PEAR package manager][install-pear].

2. Copy the `src` directory of the downloaded archive to your application directory structure and reference classes from your application. Alternatively, put the `src` directory in your `include_path` and reference classes from your application.

##Install the Cross-Platform Tools for Windows Azure
The Cross-Platform Tools for Windows Azure are a set of command-line tools for deploying and managing Windows Azure services. These tools work on any platform, including MacIntosh, Linux, and Windows.

The supported tasks include the following:

* Import publishing settings.
* Create and manage Windows Azure Websites.
* Create and manage Windows Azure Virtual Machines.

The following list contains information for installing the Cross-Platform tools, depending on your operating system:

* **Mac**: Download the Windows Azure SDK Installer here: **TODO: Get FWLink to download site for MacInstaller**. Open the downloaded .pkg file and complete the installation steps as your are prompted.

* **Linux**: Install the latest version of [Node.js][nodejs-org] (see [Install Node.js via Package Manager][install-node-linux]), then run the following command:

		npm install azure -g

* **Windows**:  Download and launch the [Microsoft Web Platform Installer][download-wpi]. **TODO: Get info about WebPI installation...what to select? Will it install both PS cmdlets AND Cross-Plat tools?**

	**Note**: Installing the Windows Azure SDK for PHP via the Web Platform Installer will also install the Windows Azure Emulators.

##Windows Azure Emulators (Windows Only)

The Windows Azure Emulators are available through the [Microsoft Web Platform Installer][download-wpi]. **TODO: Get info about WebPI installation...what to select? Will it install both PS cmdlets AND Cross-Plat tools?**

**Note**: Installing the Windows Azure SDK for PHP via the Web Platform Installer will also install the PowerShell Cmdlets for Windows Aure and the Cross-Platform Tools for Windows Azure.

##Next Steps

For information about using the PHP Client Libraries for PHP and the Cross-Platform Tools for Windows Azure, see the following articles:

* **TODO: Link to "How to Use the Blob Storage Service from PHP**.
* **TODO: Link to "How to Use the Table Storage Service from PHP**.
* **TODO: Link to "How to Use the Queue Storage Service from PHP**.
* **TODO: Link to "How to Use the Cross-Platform Tools for Windows Azure**.

[install-php]: http://www.php.net/manual/en/install.php
[composer-github]: https://github.com/composer/composer
[pear-net]: http://pear.php.net/
[http-request2-package]: http://pear.php.net/package/HTTP_Request2
[mail-mimedecode-package]: http://pear.php.net/package/Mail_mimeDecode
[mail-mime-package]: http://pear.php.net/package/Mail_mime
[install-pear]: http://pear.php.net/manual/en/installation.php
[nodejs-org]: http://nodejs.org/
[install-node-linux]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
[download-wpi]: http://www.microsoft.com/web/downloads/platform.aspx