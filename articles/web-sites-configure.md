<properties 
	pageTitle="How to configure websites - Azure service management" 
	description="Learn how to configure websites in Azure, including how to configure a website to use a SQL Database or MySQL database." 
	services="web-sites" 
	documentationCenter="" 
	authors="MikeWasson" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/18/2014" 
	ms.author="mwasson"/>


# How to Configure Websites #
In the Azure Management Portal, you can change the configuration options for websites and link to other Azure resources, such as a database.

## Table of Contents ##
- [How to: Change configuration options for a web site](#howtochangeconfig)
- [How to: Configure a web site to use a SQL database](#howtoconfigSQL)
- [How to: Configure a web site to use a MySQL database](#howtoconfigMySQL)
- [How to: Configure a custom domain name](#howtodomain)
- [How to: Configure a web site to use SSL](#howtoconfigSSL)
- [Next steps](#next)


##<a name="howtochangeconfig"></a>How to: Change configuration options for a website

<!-- HOW TO: CHANGE CONFIGURATION OPTIONS FOR A WEBSITE -->

To set configuration options for a website:

1. In the [Management Portal](https://manage.windowsazure.com/), open the website's management pages.
1. Click the <strong>Configure</strong> tab.

The **Configure** tab has the following sections:

### General

**Framework versions**. Set these options if your app uses any these frameworks: 

- **.NET Framework**: Set the .NET framework version. 
- **PHP**: Set the PHP version, or **OFF **to disable PHP. 
- **Java**: Select the displayed version to enable Java, or <strong>OFF</strong> to disable Java. 
- If you enable Java, use the <strong>Web Container</strong> option to choose between Tomcat and Jetty versions.
- **Python**: Select the Python version, or **OFF** to disable Python.

For technical reasons, enabling Java for your website disables the .NET, PHP, and Python options.

<strong>Managed Pipeline Mode</strong>. Sets the IIS [pipeline mode](http://www.iis.net/learn/get-started/introduction-to-iis/introduction-to-iis-architecture#Application). Leave this set to Integrated (the default) unless you have a legacy website that requires an older version of IIS.

<strong>Platform</strong>. Selects whether your application runs in a 32-bit or 64-bit environment. The 64-bit environment requires Basic or Standard mode. Free and Shared modes always run in a 32-bit environment.

<strong>Web Sockets</strong>. Set **ON** to enable the WebSocket protocol; for example, if your website uses [ASP.NET SignalR](http://www.asp.net/signalr) or [socket.io](http://azure.microsoft.com/en-us/documentation/articles/web-sites-nodejs-chat-app-socketio/).

<strong>Always On</strong>. By default, websites are unloaded if they are idle for some period of time. This lets the system conserve resources. In Basic or Standard mode, you can enable <strong>Always On</strong> to keep the site loaded all the time. If your site runs continuous web jobs, you should enable **Always On**, or the web jobs may not run reliably

<strong>Edit in Visual Studio Online</strong>. Enables live code editing with Visual Studio Online. If enabled, the Dashboard tab will show a link called <strong>Edit in Visual Studio Online</strong>, under the <strong>Quick Glance</strong> section. Click this link to edit your website directly online. If you need to authenticate, you can use your basic deployment credentials.

Note: If you enable deployment from source control, it is possible for a deployment to overwrite changes you make in the Visual Studio Online editor. 


### Certificates

In Basic or Standard mode, you can upload SSL certificates for a custom domain. For more information, see [Enable HTTPS for an Azure website](http://www.windowsazure.com/en-us/documentation/articles/web-sites-configure-ssl-certificate/). 

Your uploaded certificates are listed here. After you upload a certificate, you can assign it to any website in your subscription and region. Wildcard certificates can be used for any site within the domain for which it is valid. A certificate can be deleted only if there are no active bindings for that certificate.

### Domain names

View or add additional domain names for the website. For more information, see [Configuring a custom domain name for an Azure website](http://www.windowsazure.com/en-us/documentation/articles/web-sites-custom-domain-name/).

### SSL Bindings

If you uploaded SSL certificates, you can bind them to custom domain names. For more information, see [Enable HTTPS for an Azure website](http://www.windowsazure.com/en-us/documentation/articles/web-sites-configure-ssl-certificate/)

### Deployments

This section appears only if you have enabled deployment from source control. Use these settings to configure deployments.

- <strong>Git URL</strong>. If you have created a Git repository for your Azure website, this is the URL where you push your content.
- <strong>Deployment Trigger URL</strong>. This URL can be set on a GitHub, CodePlex, Bitbucket, or other repository to trigger the deployment when a commit is pushed to the repository.
- <strong>Branch to Deploy</strong>. Specifies the branch that will be deployed when you push content.

To set up deployment from source control, view the **Dashboard** tab, and click **Set up deployment from source control**. 

### Application diagnostics

Options for writing diagnostic logs from a web application that supports logging: 

- <strong>File System</strong>. Writes logs to the website's file system. File system logging lasts for a period of 12 hours. You can access the logs from the FTP share for the website. (See [FTP Credentials](http://azure.microsoft.com/en-us/documentation/articles/web-sites-manage#ftp-credentials)).
- <strong>Table Storage</strong>. Writes logs to Azure table storage. There is no time limit, and logging stays enabled until you disable it. 
- <strong>Blob Storage</strong>. Writes logs to Azure blob storage. There is no time limit, and logging stays enabled until you disable it.

<strong>Logging Level</strong>. When logging is enabled, this option specifies the amount of information that will be recorded (Error, Warning, Information, or Verbose).

**Manage table storage**. When table storage is enabled, click this button to set the storage account and table name.

**Manage blob storage.** When blob storage is enabled, click this button to set the storage account and blob storage name.

### Site diagnostics

Options for gathering diagnostic information for your website.

<strong>Web Server Logging</strong>. Enables web server logging. Logs are saved in the W3C extended log file format. You can save the logs to Azure Storage or to the website's file System.
 
- If you choose <strong>File System</strong>, logs are saved to the FTP site listed under "FTP Diagnostic Logs" on the Dashboard page. (See [FTP Credentials](http://azure.microsoft.com/en-us/documentation/articles/web-sites-manage#ftp-credentials).) 
- If you choose **File System**, use the <strong>Quota</strong> box to set the maximum amount of disk space for the log files. The minimum is 25MB and the maximum is 100MB. The default is 35MB. When the quota is reached, the oldest files are successively overwritten by the newest ones. If you need to retain more history 100MB, use Azure Storage, which has a much greater storage capacity.
- Optionally, click <strong>Set Retention</strong> to automatically delete files after a period of time. By default, logs are never deleted.   

<strong>Detailed Error Messages</strong>. If enabled, detailed error messages are saved as .htm files. To view the files, go to the FTP site listed under "FTP Diagnostic Logs" on the Dashboard page. The files are saved under /LogFiles/DetailedErrors in the FTP site. (See [FTP Credentials](http://azure.microsoft.com/en-us/documentation/articles/web-sites-manage#ftp-credentials).)

<strong>Failed Request Tracing</strong>. If enabled, failed requests are logged to XML files. To view the files, go to the FTP site listed under "FTP Diagnostic Logs" on the Dashboard page. (See [FTP Credentials](http://azure.microsoft.com/en-us/documentation/articles/web-sites-manage#ftp-credentials).) The files are saved under /LogFiles/W3SVC*xxx*, where xxx is a unique identifier. This folder contains an XSL file and one or more XML files. Make sure to download the XSL file, because it provides functionality for formatting and filtering the contents of the XML files.

<strong>Remote Debugging</strong> Enables remote debugging. When enabled, you can use the remote debugger in Visual Studio to connect directly to your Azure website. Remote debugging will remain enabled for 48 hours.

**Note**: Remote debugging will not work with a site name or user name that is longer than 20 characters. 

### Monitoring

In Basic or Standard mode, you can  test the availability of HTTP or HTTPS endpoints, from up to three geo-distributed locations. A monitoring test fails if the HTTP response code is an error (4xx or 5xx) or the response takes more than 30 seconds. An endpoint is considered available if the monitoring tests succeed from all the specified locations. 

For more information, see [How to: Monitor web endpoint status](http://go.microsoft.com/fwLink/?LinkID=279906&clcid=0x409).


### Developer analytics

Choose <strong>Add-on</strong> to select an analytics add-on from a list, or to go to the Azure store to choose one. Choose <strong>Custom</strong> to select an analytics provider such as New Relic from a list. If you use a custom provider, you must enter the license key in the<strong> Provider Key</strong> box. 

For more information on using New Relic with Azure Websites, see <a href="http://www.windowsazure.com/en-us/documentation/articles/store-new-relic-web-sites-dotnet-application-performance-management/">New Relic Application Performance Management on Azure Websites</a>.

### App settings

Name/value pairs that will be loaded by your web application on start up. 

- For .NET sites, these settings are injected into your .NET configuration AppSettings at runtime, overriding existing settings. 

- PHP, Python, Java and Node applications can access these settings as environment variables at runtime. For each app setting, two environment variables are created; one with the name specified by the app setting entry, and another with a prefix of APPSETTING_. Both contain the same value.

### Connection strings

Connection strings for linked resources. 

For .NET sites, these connection strings are be injected into your .NET configuration connectionStrings settings at runtime, overriding existing entries where the key equals the linked database name. 

For PHP, Python, Java and Node applications, these settings will be available as environment variables at runtime, prefixed with the connection type. The environment variable prefixes are as follows: 

- SQL Server: SQLCONNSTR_
- MySQL: MYSQLCONNSTR_
- SQL Database: SQLAZURECONNSTR_
- Custom: CUSTOMCONNSTR_

For example, if a MySql connection string were named connectionstring1, it would be accessed through the environment variable <code>MYSQLCONNSTR_connectionString1</code>.

<strong>Note</strong>: Connection strings are also created when you link a database resource to a website. Connection strings created this way are read only when viewed on the 
configuration management page.

### Default documents

A website's default document is the web page that is displayed does not specify a particular page on the website. If your website contains more than one of the files in the list, make sure to put your default document at the top of the list.

Web applications might use modules that route based on the URL, rather than serving static content, in which case there is no default document as such.   

### Handler mappings

Use this area to add custom script processors to handle requests for specific file extensions. 

- **Extension**. The file extension to be handled, such as *.php or handler.fcgi. 
- **Script Processor Path**. The absolute path of the script processor. Requests to files that match the file extension will be processed by the script processor. Use the path <code>D:\home\site\wwwroot</code> to refer to your site's root directory.
- **Additional Arguments**. Optional command-line arguments for the script processor 


### Virtual applications and directories 

To configure virtual applications and directories associated with your website, specify each virtual directory and its corresponding physical path relative to the site root. Optionally, you can select the <strong>Application</strong> checkbox to mark a virtual directory as an application in site configuration.

	

<!-- HOW TO: CONFIGURE A WEBSITE TO USE A SQL DATABASE -->
##<a name="howtoconfigSQL"></a>How to: Configure a website to use a SQL database

Follow these steps to link a website to a SQL Database:

1. In the [Management Portal](http://manage.windowsazure.com), select **Websites** to display the list of websites created by the currently logged on account.

2. Select a website from the list of websites to open the website's **Management** pages.

3. Click the **Linked Resources** tab and a message will be displayed on the **Linked Resources** page indicating **You have no linked resources**.

4. Click **Link a Resource** to open the **Link a Resource** wizard.

5. Click **Create a new resource** to display a list of resources types that can be linked to your website.

6. Click **SQL Database** to display the **Link Database** wizard.

7. Complete required fields on pages 3 and 4 of the **Link Database** wizard and then click the **Finish** checkmark on page 4.

Azure will create a SQL database with the specified parameters and link the database to the website.

<!-- HOW TO: CONFIGURE A WEBSITE TO USE A MYSQL DATABASE -->
##<a name="howtoconfigMySQL"></a>How to: Configure a website to use a MySQL database##
To configure a website to use a MySQL database, follow the same steps to use a SQL database, but in the **Link a Resource** wizard, choose **MySQL Database** instead of **SQL Database**. 

Alternatively, you can create the website with the **Custom Create** option. In the **Database** dropdown, choose either **Create a new MySQL database** or **Use an existing MySQL database**. 

##<a name="howtodomain"></a>How to: Configure a custom domain name

For information about configuring your website to use a custom domain name, see [Configuring a custom domain name for an Azure Web Site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-custom-domain-name/).

##<a name="howtoconfigSSL"></a>How to: Configure a website to use SSL##

For information about configuring SSL for a custom domain on Azure, see [Enable HTTPS for an Azure web site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-configure-ssl-certificate/). 

##<a name="next"></a>Next steps

* [How to Scale Web Sites](http://www.windowsazure.com/en-us/documentation/articles/web-sites-scale/)

* [How to Monitor Web Sites](http://www.windowsazure.com/en-us/documentation/articles/web-sites-monitor/)

