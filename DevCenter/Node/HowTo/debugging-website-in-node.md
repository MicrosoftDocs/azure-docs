<div chunk="../chunks/article-left-menu.md" />

# How to debug a Node.js application in Windows Azure Web Sites

Windows Azure provide built-in diagnostics to assist with debugging Node.js applications hosted in Windows Azure Web Sites. In this article, you will learn how to enable logging of stdout and stderr, display error information in the browser, and how to download and view log files.

Diagnostics for Node.js applications hosted on Windows Azure is provided by [IISNode]. While this article discusses the most common settings for gathering diagnostics information, it does not provide a complete reference for working with IISNode. For more information on working with IISNode, see the [IISNode Readme] on GitHub.

##Enabling diagnostic logging

By default, Windows Azure Web Sites only capture diagnostic information about deployments, such as when you deploy a web site using Git. This information is useful if you are having problems during deployment, such as a failure when installing a module referenced in **package.json**, or if you are using a custom deployment script.

To enable the logging of stdout and stderr streams, you must create an **IISNode.yml** file at the root of your Node.js application and add the following:

	loggingEnabled: true

This enables the logging of stderr and stdout from your Node.js application.

The **IISNode.yml** file can also be used to control whether friendly errors or developer errors are returned to the browser when a failure occurs. To enable developer errors, add the following line to the **IISNode.yml** file:

	devErrorsEnabled: true

Once this option is enabled, IISNode will return the last 64K of information sent to stderr instead of a friendly error such as "an internal server error occurred".

<div class="dev-callout">
<strong>Note</strong>
<p>While devErrorsEnabled is useful when diagnosing problems during development, enabling it in a production environment may result in development errors being sent to end users.</p>
</div>

<div class="dev-callout">
<strong>Note</strong>
<p>When you first add the <strong>IISNode.yml</strong> file and enabled logging or developer errors, you must redeploy your application and then restart your web site. You can restart the web site by selecting your web site from the <a href="https://manage.windowsazure.com/">Windows Azure Management Portal</a>, and then selecting the <strong>RESTART</strong> button:

![restart buttoin][restart-button]</p>
</div>


<div class="dev-callout">
<strong>Note</strong>
<p>While loggingEnabled and devErrorsEnabled are the most commonly used IISNode.yml configuration options for capturing diagnostic information, IISNode.yml can be used to configure a variety of options for your hosting environment. For a full list of the configuration options, see the <a href="https://github.com/tjanczuk/iisnode/blob/master/src/config/iisnode_schema.xml">iisnode_schema.xml</a> file.</p>
</div>

##Accessing diagnostic logs

Diagnostic logs can be accessed in three ways; Using the File Transfer Protocol (FTP), downloading a Zip archive, or as a live updated stream of the log (also known as a tail). Downloading the Zip archive of the log files or viewing the live stream require the Windows Azure Command-Line Tools. These can be installed by using the following command:

	npm install azure-cli -g

Once installed, the tools can be accessed using the 'azure' command. The command-line tools must first be configured to use your Windows Azure subscription. For information on how to accomplish this task, see the **How to download and import publish settings** section of the [How to Use The Windows Azure Command-Line Tools] article.

###FTP

To access the diagnostic information through FTP, visit the [Windows Azure portal], select your web site, and then select the **DASHBOARD**. In the **quick links** section, the **FTP DIAGNOSTIC LOGS** and **FTPS DIAGNOSTIC LOGS** links provide access to the logs using the FTP protocol.

<div class="dev-callout">
<strong>Note</strong>
<p>If you have not previously configured user name and password for FTP or deployment, you can do so from the <strong>QuickStart</strong> management page by selecting <strong>Set up deployment credentials</strong>.</p>
</div>

The FTP URL returned in the dashboard is for the **LogFiles** directory, which will contain the following sub-directories:

* [Deployment Method] - If you use a deployment method such as Git, a directory of the same name will be created and will contain information related to deployments.

* nodejs - Stdout and stderr information captured from all instances of your application (when loggingEnabled is true.)

###Zip archive

To download a Zip archive of the diagnostic logs, use the following command from the Windows Azure Command-Line Tools:

	azure site log download [sitename]

This will download a **diagnostics.zip** in the current directory. This archive contains the following directory structure:

* deployments - A log of information about deployments of your application

* LogFiles

	* [Deployment method] - If you use a deployment method such as Git, a directory of the same name will be created and will contain information related to deployments.

	* nodejs - Stdout and stderr information captured from all instances of your application (when loggingEnabled is true.)

###Live stream (tail)

To view a live stream of diagnostic log information, use the following command from the Windows Azure Command-Line Tools:

	azure site log tail [sitename]

This will return a stream of log events that are updated as they occur on the server. This stream will return deployment information as well as stdout and stderr information (when loggingEnabled is true.)

##Next Steps

In this article you learned how to enable and access diagnostics information for Windows Azure. While this information is useful in understanding problems that occur with your application, it may point to a problem with a module you are using or that the version of Node.js used by Windows Azure Web Sites is different than the one used in your deployment environment.

For information in working with modules on Windows Azure, see [Using Node.js Modules with Windows Azure Applications].

For information on specifying a Node.js version for your application, see [Specifying a Node.js version in a Windows Azure application].

[IISNode]: https://github.com/tjanczuk/iisnode
[IISNode Readme]: https://github.com/tjanczuk/iisnode#readme
[How to Use The Windows Azure Command-Line Tools]: https://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/
[Using Node.js Modules with Windows Azure Applications]: https://www.windowsazure.com/en-us/develop/nodejs/common-tasks/working-with-node-modules/
[Specifying a Node.js version in a Windows Azure application]: https://www.windowsazure.com/en-us/develop/nodejs/common-tasks/specifying-a-node-version/
[Windows Azure Management Portal]: https://manage.windowsazure.com/

[restart-button]: ../media/restartbutton.png