<properties umbracoNaviHide="0" pageTitle="How to Configure PHP in Windows Azure Web Sites" metaKeywords="Windows Azure, Windows Azure Web Sites, configuration, PHP" metaDescription="Learn how to configure the default PHP installation or add a custom PHP installation in Windows Azure Web Sites." linkid="" urlDisplayName="How to Configure PHP in Windows Azure Web Sites" headerExpose="" footerExpose="" disqusComments="1" />

#How to configure PHP in Windows Azure Web Sites

This guide will show you how to configure the default PHP runtime, provide a custom PHP runtime, and enable extensions in Windows Azure Web Sites. To use Windows Azure Web Sites, sign up for the [free trial]. To get the most from this guide, you should first create a PHP site in Windows Azure Web Sites (see the [PHP Developer Center Tutorials]). For general information on configuring sites in Windows Azure Web Sites, see [How to Configure Websites].

##Table of Contents

* [What is Windows Azure Web Sites?](#WhatIs)
* [How to: Change the default PHP configuration](#ChangeDefaultPHP)
* [How to: Enable extensions in the default PHP runtime](#EnableExtDefaultPHP)
* [How to: Use a custom PHP runtime](#UseCustomPHP)
* [Next steps](#NextSteps)

<h2 id="WhatIs">What is Windows Azure Web Sites?</h2>
Windows Azure Web Sites allows you to build highly scalable websites on Windows Azure. You can quickly and easily deploy sites to a highly scalable cloud environment that allows you to start small and scale as traffic grows. Windows Azure Web Sites uses the languages and open source apps of your choice and supports deployment with Git, FTP, and TFS. You can easily integrate other services like MySQL, SQL Database, Caching, CDN, and Storage.

<h2 id="ChangeDefaultPHP">How to: Change the default PHP configuration</h2>
By default, PHP 5.3 is installed and immediately available for use when you create a Windows Azure Web Site. The best way to see the available release revision, its default configuration, and the enabled extensions is to deploy a script that calls [phpinfo()].

PHP 5.4 is also available, but not enabled by default. To enable it, follow these steps:

1. Browse to your website's dashboard in the Windows Azure Portal, click on **CONFIGURE**.

	![Configure tab on Web Sites dashboard][configure]

2. Click PHP 5.4.

	![Select PHP version][select-php-version]

3. Click **SAVE** at the bottom of the page.

	![Save configuration settings][save-button]

For either of the built-in PHP runtimes, you can change any of the configuration options that are not system-level-only directives by following the steps below. (For information about system-level-only directives, see [List of php.ini directives].)

1. Add a [.user.ini] file to your root directory.
2. Add configuration settings to the `.user.ini` file using the same syntax you would use in a `php.ini` file. For example, if you wanted to turn the `display_errors` setting on and set `upload_max_filesize` setting to 10 MB, your `.user.ini` file would contain this text:

		; Example Settings
		display_errors=On
		upload_max_filesize=10M

3. Deploy your application.
4. Restart your website. (Restarting is necessary because the frequency with which PHP reads `.user.ini` files is governed by the `user_ini.cache_ttl` setting, which is a system level setting and is 300 seconds (5 minutes) by default. Restarting the site forces PHP to read the new settings in the `.user.ini` file.)

As an alternative to using a `.user.ini` file, you can use the [ini_set()] function in scripts to set configuration options that are not system-level directives.

<h2 id="EnableExtDefaultPHP">How to: Enable extensions in the default PHP runtime</h2>
As noted in the previous section, the best way to see the default PHP version, its default configuration, and the enabled extensions is to deploy a script that calls [phpinfo()]. To enable additional extensions, follow the steps below.

1. Add a `bin` directory to your root directoy.
2. Put `.dll` extension files in the `bin` directory (for example, `php_mongo.dll`). Make sure that the extensions are compatible with default version of PHP (which is, as of this writing, PHP 5.3) and are VC9 and non-thread-safe (nts) compatible.
3. Deploy your application.
4. Navigate to your site’s dashboard in the Windows Azure Portal, and click on **CONFIGURE**.

	![Configure tab on Web Sites dashboard][configure]

5. In the **app settings** section, create a key **PHP_EXTENSIONS** and a value **bin\your-ext-file**. To enable multiple extensions, incude a comma-separated list of `.dll` files.

	![Enable extension in app settings][app-settings]

6. Click **SAVE** at the bottom of the page.

	![Save configuration settings][save-button]

<h2 id="UseCustomPHP">How to: Use a custom PHP runtime</h2>
Instead of the default PHP runtime, Windows Azure Web Sites can use a PHP runtime that you provide to execute PHP scripts. The runtime that you provide can be configured by a `php.ini` file that you also provide. To use a custom PHP runtime in Windows Azure Web Sites, follow the steps below.

1. Obtain a non-thread-safe, VC9 compatible version of PHP for Windows. Recent releases of PHP for Windows can be found here: [http://windows.php.net/download/]. Older releases can be found in the archive here: [http://windows.php.net/downloads/releases/archives/].
2. Modify the `php.ini` file for your runtime. Note that any configuration settings that are system-level-only directives will be ignored by Windows Azure Web Sites. (For information about system-level-only directives, see [List of php.ini directives]).
3. Optionally, add extensions to your PHP runtime and enable them in the `php.ini` file.
4. Add `bin` directory to your root directory, and put the directory that contains your PHP runtime in it (for example, `bin\php`).
5. Deploy your application.
6. Navigate to your site’s dashboard in the Windows Azure Portal, and click on **CONFIGURE**.

	![Configure tab on Web Sites dashboard][configure]

7. In the **handler mappings** section, add `*.php` to EXTENSION and add the path to the `php-cgi.exe` executable. If your put your PHP runtime in the `bin` directory in the root of you application, the path will be `D:\home\site\wwwroot\bin\php\php-cgi.exe`.

	![Specify handler in hander mappings][handler-mappings]

8. Click **SAVE** at the bottom of the page.

	![Save configuration settings][save-button]

<h2 id="NextSteps">Next steps</h2>
Now that you’ve learned how to configure PHP in Windows Azure Web Sites, follow the links below to learn how to do more.

- [Configure, monitor, and scale your web sites in Windows Azure]
- [Download the Windows Azure SDK for PHP]


[free trial]: https://www.windowsazure.com/en-us/pricing/free-trial/
[PHP Developer Center Tutorials]: https://www.windowsazure.com/en-us/develop/php/tutorials/
[How to Configure Websites]: https://www.windowsazure.com/en-us/manage/services/web-sites/how-to-configure-websites/
[phpinfo()]: http://php.net/manual/en/function.phpinfo.php
[select-php-version]: ../Media/select-php-version.png
[List of php.ini directives]: http://www.php.net/manual/en/ini.list.php
[.user.ini]: http://www.php.net/manual/en/configuration.file.per-user.php
[ini_set()]: http://www.php.net/manual/en/function.ini-set.php
[configure]: ../Media/configure.png
[app-settings]: ../Media/app-settings.png
[save-button]: ../Media/save-button.png
[http://windows.php.net/download/]: http://windows.php.net/download/
[http://windows.php.net/downloads/releases/archives/]: http://windows.php.net/downloads/releases/archives/
[handler-mappings]: ../Media/handler-mappings.png
[Configure, monitor, and scale your web sites in Windows Azure]: http://www.windowsazure.com/en-us/manage/services/web-sites/
[Download the Windows Azure SDK for PHP]: http://www.windowsazure.com/en-us/develop/php/common-tasks/download-php-sdk/
