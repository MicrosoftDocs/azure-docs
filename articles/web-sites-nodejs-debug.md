<properties urlDisplayName="Debug Websites (Node)" pageTitle="How to Debug Azure Websites in Node.js" metaKeywords="debug website azure, debugging azure, troubleshooting azure web site, troubleshoot azure website node" description="Learn how to debug an Azure website in Node.js." metaCanonical="" services="web-sites" documentationCenter="nodejs" title="" authors="blackmist" solutions="" manager="wpickett" editor="mollybos"/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="nodejs" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr" />





#How to debug a Node.js application in Azure Websites

Azure provide built-in diagnostics to assist with debugging Node.js applications hosted in Azure Websites. In this article, you will learn how to enable logging of stdout and stderr, display error information in the browser, and how to download and view log files.

Diagnostics for Node.js applications hosted on Azure is provided by [IISNode]. While this article discusses the most common settings for gathering diagnostics information, it does not provide a complete reference for working with IISNode. For more information on working with IISNode, see the [IISNode Readme] on GitHub.

##<a id="enablelogging"></a>Enable logging

By default, Azure Websites only capture diagnostic information about deployments, such as when you deploy a website using Git. This information is useful if you are having problems during deployment, such as a failure when installing a module referenced in **package.json**, or if you are using a custom deployment script.

To enable the logging of stdout and stderr streams, you must create an **IISNode.yml** file at the root of your Node.js application and add the following:

	loggingEnabled: true

This enables the logging of stderr and stdout from your Node.js application.

The **IISNode.yml** file can also be used to control whether friendly errors or developer errors are returned to the browser when a failure occurs. To enable developer errors, add the following line to the **IISNode.yml** file:

	devErrorsEnabled: true

Once this option is enabled, IISNode will return the last 64K of information sent to stderr instead of a friendly error such as "an internal server error occurred".

> [AZURE.NOTE] While devErrorsEnabled is useful when diagnosing problems during development, enabling it in a production environment may result in development errors being sent to end users.

If the **IISNode.yml** file did not already exist within your application, you must restart your website after publishing the updated application. If you are simply changing settings in an existing **IISNode.yml** file that has previously been published, no restart is required.

> [AZURE.NOTE] If your website was created using the Azure Command-Line Tools or Azure PowerShell Cmdlets, a default **IISNode.yml** file is automatically created.

You can restart the website by selecting the site from the [Azure Management Portal], and then selecting the **RESTART** button:

![restart button][restart-button]

If the Azure Command-Line Tools are installed in your development environment, you can use the following command to restart the website:

	azure site restart [sitename]

> [AZURE.NOTE] While loggingEnabled and devErrorsEnabled are the most commonly used IISNode.yml configuration options for capturing diagnostic information, IISNode.yml can be used to configure a variety of options for your hosting environment. For a full list of the configuration options, see the [iisnode_schema.xml](https://github.com/tjanczuk/iisnode/blob/master/src/config/iisnode_schema.xml) file.

##<a id="viewlogs"></a>Accessing logs

Diagnostic logs can be accessed in three ways; Using the File Transfer Protocol (FTP), downloading a Zip archive, or as a live updated stream of the log (also known as a tail). Downloading the Zip archive of the log files or viewing the live stream require the Azure Command-Line Tools. These can be installed by using the following command:

	npm install azure-cli -g

Once installed, the tools can be accessed using the 'azure' command. The command-line tools must first be configured to use your Azure subscription. For information on how to accomplish this task, see the **How to download and import publish settings** section of the [How to Use The Azure Command-Line Tools] article.

###FTP

To access the diagnostic information through FTP, visit the [Azure portal], select your website, and then select the **DASHBOARD**. In the **quick links** section, the **FTP DIAGNOSTIC LOGS** and **FTPS DIAGNOSTIC LOGS** links provide access to the logs using the FTP protocol.

> [AZURE.NOTE] If you have not previously configured user name and password for FTP or deployment, you can do so from the **QuickStart** management page by selecting **Set up deployment credentials**.

The FTP URL returned in the dashboard is for the **LogFiles** directory, which will contain the following sub-directories:

* [Deployment Method] - If you use a deployment method such as Git, a directory of the same name will be created and will contain information related to deployments.

* nodejs - Stdout and stderr information captured from all instances of your application (when loggingEnabled is true.)

###Zip archive

To download a Zip archive of the diagnostic logs, use the following command from the Azure Command-Line Tools:

	azure site log download [sitename]

This will download a **diagnostics.zip** in the current directory. This archive contains the following directory structure:

* deployments - A log of information about deployments of your application

* LogFiles

	* [Deployment method] - If you use a deployment method such as Git, a directory of the same name will be created and will contain information related to deployments.

	* nodejs - Stdout and stderr information captured from all instances of your application (when loggingEnabled is true.)

###Live stream (tail)

To view a live stream of diagnostic log information, use the following command from the Azure Command-Line Tools:

	azure site log tail [sitename]

This will return a stream of log events that are updated as they occur on the server. This stream will return deployment information as well as stdout and stderr information (when loggingEnabled is true.)

##<a id="nextsteps"></a>Next Steps

In this article you learned how to enable and access diagnostics information for Azure. While this information is useful in understanding problems that occur with your application, it may point to a problem with a module you are using or that the version of Node.js used by Azure Websites is different than the one used in your deployment environment.

For information in working with modules on Azure, see [Using Node.js Modules with Azure Applications].

For information on specifying a Node.js version for your application, see [Specifying a Node.js version in an Azure application].

[IISNode]: https://github.com/tjanczuk/iisnode
[IISNode Readme]: https://github.com/tjanczuk/iisnode#readme
[How to Use The Azure Command-Line Tools]: /en-us/documentation/articles/xplat-cli/
[Using Node.js Modules with Azure Applications]: /en-us/documentation/articles/nodejs-use-node-modules-azure-apps/
[Specifying a Node.js version in an Azure application]: /en-us/documentation/articles/nodejs-specify-node-version-azure-apps/
[Azure Management Portal]: https://manage.windowsazure.com/

[restart-button]: ./media/web-sites-nodejs-debug/restartbutton.png
