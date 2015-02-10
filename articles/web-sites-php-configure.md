<properties 
	pageTitle="How to Configure PHP in Azure Websites" 
	description="Learn how to configure the default PHP installation or add a custom PHP installation in Azure Websites." 
	services="" 
	documentationCenter="php" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="11/18/2014" 
	ms.author="tomfitz"/>

#How to configure PHP in Azure Websites

This guide will show you how to configure the built-in PHP runtime in Azure Websites, provide a custom PHP runtime, and enable extensions in Azure Websites. To use Azure Websites, sign up for the [free trial]. To get the most from this guide, you should first create a PHP site in Azure Websites (see the [PHP Developer Center Tutorials]). For general information on configuring sites in Azure Websites, see [How to Configure Web Sites].

##Table of Contents

* [What is Azure Web Sites?](#WhatIs)
* [How to: Change the default PHP configuration](#ChangeBuiltInPHP)
* [How to: Enable extensions in the built-in PHP runtime](#EnableExtDefaultPHP)
* [How to: Use a custom PHP runtime](#UseCustomPHP)
* [Next steps](#NextSteps)

<h2><a name="WhatIs"></a>What is Azure Websites?</h2>
Azure Websites allows you to build highly scalable websites on Azure. You can quickly and easily deploy sites to a highly scalable cloud environment that allows you to start small and scale as traffic grows. Azure Websites uses the languages and open source apps of your choice and supports deployment with Git, FTP, and TFS. You can easily integrate other services like MySQL, SQL Database, Caching, CDN, and Storage.

<h2><a name="ChangeBuiltInPHP"></a>How to: Change the built-in PHP configuration</h2>
By default, PHP 5.4 is installed and immediately available for use when you create an Azure Website. The best way to see the available release revision, its default configuration, and the enabled extensions is to deploy a script that calls the [phpinfo()] function.

PHP 5.5 is also available, but not enabled by default. To enable it, follow these steps:

1. Browse to your website's dashboard in the Azure Portal, click on **Configure**.

	![Configure tab on Web Sites dashboard][configure]

1. Click PHP 5.5.

	![Select PHP version][select-php-version]

1. Click **Save** at the bottom of the page.

	![Save configuration settings][save-button]

For either of the built-in PHP runtimes, you can change any of the configuration options that are not system-level-only directives by following the steps below. (For information about system-level-only directives, see [List of php.ini directives].)

1. Add a [.user.ini] file to your root directory.
1. Add configuration settings to the `.user.ini` file using the same syntax you would use in a `php.ini` file. For example, if you wanted to turn the `display_errors` setting on and set `upload_max_filesize` setting to 10M, your `.user.ini` file would contain this text:

		; Example Settings
		display_errors=On
		upload_max_filesize=10M

1. Deploy your application.
1. Restart your website. (Restarting is necessary because the frequency with which PHP reads `.user.ini` files is governed by the `user_ini.cache_ttl` setting, which is a system level setting and is 300 seconds (5 minutes) by default. Restarting the site forces PHP to read the new settings in the `.user.ini` file.)

As an alternative to using a `.user.ini` file, you can use the [ini_set()] function in scripts to set configuration options that are not system-level directives.

<h2><a name="EnableExtDefaultPHP"></a>How to: Enable extensions in the default PHP runtime</h2>
As noted in the previous section, the best way to see the default PHP version, its default configuration, and the enabled extensions is to deploy a script that calls [phpinfo()]. To enable additional extensions, follow the steps below.

1. Add a `bin` directory to your root directoy.
1. Put `.dll` extension files in the `bin` directory (for example, `php_mongo.dll`). Make sure that the extensions are compatible with default version of PHP (which is, as of this writing, PHP 5.4) and are VC9 and non-thread-safe (nts) compatible.
1. Deploy your application.
1. Navigate to your site's dashboard in the Azure Portal, and click on **Configure**.

	![Configure tab on Web Sites dashboard][configure]

1. In the **app settings** section, create a key **PHP_EXTENSIONS** and a value **bin\your-ext-file**. To enable multiple extensions, incude a comma-separated list of `.dll` files.

	![Enable extension in app settings][app-settings]

1. Click **Save** at the bottom of the page.

	![Save configuration settings][save-button]

<h2><a name="UseCustomPHP"></a>How to: Use a custom PHP runtime</h2>
Instead of the default PHP runtime, Azure Websites can use a PHP runtime that you provide to execute PHP scripts. The runtime that you provide can be configured by a `php.ini` file that you also provide. To use a custom PHP runtime in Azure Websites, follow the steps below.

1. Obtain a non-thread-safe, VC9 compatible version of PHP for Windows. Recent releases of PHP for Windows can be found here: [http://windows.php.net/download/]. Older releases can be found in the archive here: [http://windows.php.net/downloads/releases/archives/].
1. Modify the `php.ini` file for your runtime. Note that any configuration settings that are system-level-only directives will be ignored by Azure Websites. (For information about system-level-only directives, see [List of php.ini directives]).
1. Optionally, add extensions to your PHP runtime and enable them in the `php.ini` file.
1. Add `bin` directory to your root directory, and put the directory that contains your PHP runtime in it (for example, `bin\php`).
1. Deploy your application.
1. Navigate to your site's dashboard in the Azure Portal, and click on **Configure**.

	![Configure tab on Web Sites dashboard][configure]

1. In the **handler mappings** section, add `*.php` to EXTENSION and add the path to the `php-cgi.exe` executable. If your put your PHP runtime in the `bin` directory in the root of you application, the path will be `D:\home\site\wwwroot\bin\php\php-cgi.exe`.

	![Specify handler in hander mappings][handler-mappings]

1. Click **Save** at the bottom of the page.

	![Save configuration settings][save-button]

<h2><a name="NextSteps"></a>Next steps</h2>
Now that you've learned how to configure PHP in Azure Websites, follow the links below to learn how to do more.

- [Configure, monitor, and scale your web sites in Azure]
- [Download the Azure SDK for PHP]


[free trial]: https://www.windowsazure.com/en-us/pricing/free-trial/
[PHP Developer Center Tutorials]: https://www.windowsazure.com/en-us/develop/php/tutorials/
[How to Configure Web Sites]: https://www.windowsazure.com/en-us/manage/services/web-sites/how-to-configure-websites/
[phpinfo()]: http://php.net/manual/en/function.phpinfo.php
[select-php-version]: ./media/web-sites-php-configure/select-php-version.png
[List of php.ini directives]: http://www.php.net/manual/en/ini.list.php
[.user.ini]: http://www.php.net/manual/en/configuration.file.per-user.php
[ini_set()]: http://www.php.net/manual/en/function.ini-set.php
[configure]: ./media/web-sites-php-configure/configure.png
[app-settings]: ./media/web-sites-php-configure/app-settings.png
[save-button]: ./media/web-sites-php-configure/save-button.png
[http://windows.php.net/download/]: http://windows.php.net/download/
[http://windows.php.net/downloads/releases/archives/]: http://windows.php.net/downloads/releases/archives/
[handler-mappings]: ./media/web-sites-php-configure/handler-mappings.png
[Configure, monitor, and scale your web sites in Azure]: http://www.windowsazure.com/en-us/manage/services/web-sites/
[Download the Azure SDK for PHP]: http://www.windowsazure.com/en-us/develop/php/common-tasks/download-php-sdk/
