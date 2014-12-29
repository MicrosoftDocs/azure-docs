<properties title="How to create a PHP website in Azure Websites" pageTitle="How to create a PHP website in Azure Websites" metaKeywords="PHP Azure Web Sites" description="Learn how to create a PHP website in Azure Websites" documentationCenter="PHP" services="Web Sites" editor="mollybos" manager="wpickett" authors="tomfitz" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="PHP" ms.topic="article" ms.date="10/21/2014" ms.author="tomfitz" />

#How to create a PHP website in Azure Websites

This article will show you how to create a PHP website in [Azure Web Sites][waws] by using the [Azure Management Portal], the [Azure Command Line Tools for Mac and Linux][xplat-tools], or the [Azure PowerShell cmdlets][powershell-cmdlets].

In general, creating a PHP website is no different that creating *any* website in Azure Websites. By default, PHP is enabled for all websites. For information about configuring PHP (or providing your own customized PHP runtime), see [How to configure PHP in Azure Web Sites][configure-php].

Each option described below shows you how to create a website in a shared hosting environment at no cost, but with some limitations on CPU usage and bandwidth usage. For more information, see [Azure Web Sites Pricing][websites-pricing]. For information about how to upgrade and scale your website, see [How to scale Web Sites][scale-websites].

> [AZURE.NOTE]
> If you want to get started with Azure Websites before signing up for an account, go to <a href="https://trywebsites.azurewebsites.net/?language=php">https://trywebsites.azurewebsites.net</a>, where you can immediately create a short-lived ASP.NET starter site in Azure Websites for free. No credit card required, no commitments.

##Table of Contents
* [Create a web site using the Azure Management Portal](#portal)
* [Create a web site using the Azure Command Line Tools for Mac and Linux](#XplatTools)
* [Create a web site using the Azure PowerShell cmdlets](#PowerShell)

<h2><a name="portal"></a>Create a PHP website using the Azure Management Portal</h2>

When you create a website in the Azure Management Portal, you have three options: **Quick Create**, **Create with Database**, and **From Gallery**. The instructions below will cover the **Quick Create** option. For information about the other two options, see [Create a PHP-MySQL Azure web site and deploy using Git][website-mysql-git] and [Create a WordPress web site from the gallery in Azure][wordpress-gallery].

To create a PHP website using the Azure Management Portal, do the following:

1. Login to the [Azure Management Portal].
1. Click **New** at the bottom of the page, then click **Compute**, **Website**, and **Quick Create**. Provide a **URL** for your website and select the **Region** for your website. Finally, click **Create Website**.

	![Select Quick Create web site](./media/web-sites-php-create-web-sites/select-quickcreate-website.png)

<h2><a name="XplatTools"></a>Create a PHP website using the Azure Command Line Tools for Mac and Linux</h2>

To create a PHP website using the Azure Command Line Tools for Mac and Linux do the following:

1. Install the Azure Command Line Tools by following the instructions here: [How to install the Azure Command Line Tools for Mac and Linux](/en-us/develop/php/how-to-guides/command-line-tools/#Download).

1. Download and import your publish settings file by following the instructions here: [How to download and import publish settings](/en-us/develop/php/how-to-guides/command-line-tools/#Account).

1. Run the following command from a command prompt:

		azure site create MySiteName

The URL for the newly created website will be  `http://MySiteName.azurewebsites.net`.  
 
Note that you can execute the `azure site create` command with any of the following options:

* `--location [location name]`. This option allows you to specify the location of the data center in which your website is created (e.g. "West US"). If you omit this option, you will be promted to choose a location.
* `--hostname [custom host name]`. This option allows you to specify a custom hostname for your website.
* `--git`. This option allows you to use git to publish to your website by creating git repositories in both your local application directory and in your website's data center. Note that if your local folder is already a git repository, the command will add a new remote to the existing repository, pointing to the repository in your website's data center.

For information about additional options, see [How to create and manage an Azure Web Site](/en-us/develop/php/how-to-guides/command-line-tools/#WebSites).

<h2><a name="PowerShell"></a>Create a PHP website using the Azure PowerShell cmdlets</h2>

To create a PHP website using the Azure PowerShell cmdlets, do the following:

1. Install the Azure PowerShell cmdlets by following the instructions here: [Get started with Azure PowerShell](/en-us/develop/php/how-to-guides/powershell-cmdlets/#GetStarted).

1. Download and import your publish settings file by following the instructions here: [How to: Import publish settings](/en-us/develop/php/how-to-guides/powershell-cmdlets/#ImportPubSettings).

1. Open a PowerShell command prompt and execute the following command:

		New-AzureWebSite MySiteName

The URL for the newly created website will be  `http://MySiteName.azurewebsites.net`.  
 
Note that you can execute the `New-AzureWebSite` command with any of the following options:

* `-Location [location name]`. This option allows you to specify the location of the data center in which your website is created (e.g. "West US"). If you omit this option, you will be promted to choose a location.
* `-Hostname [custom host name]`. This option allows you to specify a custom hostname for your website.
* `-Git`. This option allows you to use git to publish to your website by creating git repositories in both your local application directory and in your website's data center. Note that if your local folder is already a git repository, the command will add a new remote to the existing repository, pointing to the repository in your website's data center.

For information about additional options, see [How to: Create and manage an Azure Web Site](/en-us/develop/php/how-to-guides/powershell-cmdlets/#WebSite).

<h2><a name="NextSteps"></a>Next steps</h2>

Now that you have created a PHP website in Azure Websites, you can manage, configure, monitor, deploy to, and scale your site. For more information, see the following links:

* [How to configure Web Sites](/en-us/manage/services/web-sites/how-to-configure-websites/)
* [How to configure PHP in Azure Web Sites][configure-php]
* [How to manage Web Sites](/en-us/manage/services/web-sites/how-to-manage-websites/)
* [How to monitor Web Sites](/en-us/manage/services/web-sites/how-to-monitor-websites/)
* [How to scale Web Sites](/en-us/manage/services/web-sites/how-to-scale-websites/)
* [Publishing with Git](/en-us/develop/php/common-tasks/publishing-with-git/)

For end-to-end tutorials, visit the [PHP Developer Center - Tutorials](/en-us/develop/php/tutorials/) page.

[waws]: /en-us/manage/services/web-sites/
[Azure Management Portal]: http://manage.windowsazure.com/
[xplat-tools]: /en-us/develop/php/how-to-guides/command-line-tools/
[powershell-cmdlets]: /en-us/develop/php/how-to-guides/powershell-cmdlets/
[configure-php]: /en-us/develop/php/common-tasks/configure-php-web-site/
[website-mysql-git]: /en-us/develop/php/tutorials/website-w-mysql-and-git/
[wordpress-gallery]: /en-us/develop/php/tutorials/website-from-gallery/
[websites-pricing]: http://www.windowsazure.com/en-us/pricing/details/#header-1
[scale-websites]: /en-us/manage/services/web-sites/how-to-scale-websites/
