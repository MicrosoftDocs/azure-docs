<properties 
	pageTitle="Configure web apps in Azure App Service" 
	description="How to configure a web app in Azure App Services" 
	services="app-service\web" 
	documentationCenter="" 
	authors="rmcmurray" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2016" 
	ms.author="robmcm"/>

# Configure web apps in Azure App Service #

This topic explains how to configure a web app using the [Azure Portal].

[AZURE.INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)] 

## Application settings

1. In the [Azure Portal], open the blade for the web app.
2. Click **All Settings**.
3. Click **Application Settings**.

![Application Settings][configure01]

The **Application settings** blade has settings grouped under several categories.

### General settings

**Framework versions**. Set these options if your app uses any these frameworks: 

- **.NET Framework**: Set the .NET framework version. 
- **PHP**: Set the PHP version, or **OFF** to disable PHP. 
- **Java**: Select the Java version or **OFF** to disable Java. Use the **Web Container** option to choose between Tomcat and Jetty versions.
- **Python**: Select the Python version, or **OFF** to disable Python.

For technical reasons, enabling Java for your app disables the .NET, PHP, and Python options.

<a name="platform"></a>
**Platform**. Selects whether your web app runs in a 32-bit or 64-bit environment. The 64-bit environment requires Basic or Standard mode. Free and Shared modes always run in a 32-bit environment.

**Web Sockets**. Set **ON** to enable the WebSocket protocol; for example, if your web app uses [ASP.NET SignalR] or [socket.io].

<a name="alwayson"></a>
**Always On**. By default, web apps are unloaded if they are idle for some period of time. This lets the system conserve resources. In Basic or Standard mode, you can enable **Always On** to keep the app loaded all the time. If your app runs continuous web jobs, you should enable **Always On**, or the web jobs may not run reliably.

**Managed Pipeline Version**. Sets the IIS [pipeline mode]. Leave this set to Integrated (the default) unless you have a legacy app that requires an older version of IIS.

**Auto Swap**. If you enable Auto Swap for a deployment slot, App Service will automatically swap the web app into production when you push an update to that slot. For more information, see [Deploy to staging slots for web apps in Azure App Service] (web-sites-staged-publishing.md).

### Debugging

**Remote Debugging**. Enables remote debugging. When enabled, you can use the remote debugger in Visual Studio to connect directly to your web app. Remote debugging will remain enabled for 48 hours. 

### App settings

This section contains name/value pairs that you web app will load on start up. 

- For .NET apps, these settings are injected into your .NET configuration `AppSettings` at runtime, overriding existing settings. 

- PHP, Python, Java and Node applications can access these settings as environment variables at runtime. For each app setting, two environment variables are created; one with the name specified by the app setting entry, and another with a prefix of APPSETTING_. Both contain the same value.

### Connection strings

Connection strings for linked resources. 

For .NET apps, these connection strings are injected into your .NET configuration `connectionStrings` settings at runtime, overriding existing entries where the key equals the linked database name. 

For PHP, Python, Java and Node applications, these settings will be available as environment variables at runtime, prefixed with the connection type. The environment variable prefixes are as follows: 

- SQL Server: `SQLCONNSTR_`
- MySQL: `MYSQLCONNSTR_`
- SQL Database: `SQLAZURECONNSTR_`
- Custom: `CUSTOMCONNSTR_`

For example, if a MySql connection string were named `connectionstring1`, it would be accessed through the environment variable `MYSQLCONNSTR_connectionString1`.

### Default documents

The default document is the web page that is displayed at the root URL for a website.  The first matching file in the list is used. 

Web apps might use modules that route based on URL, rather than serving static content, in which case there is no default document as such.    

### Handler mappings

Use this area to add custom script processors to handle requests for specific file extensions. 

- **Extension**. The file extension to be handled, such as *.php or handler.fcgi. 
- **Script Processor Path**. The absolute path of the script processor. Requests to files that match the file extension will be processed by the script processor. Use the path `D:\home\site\wwwroot` to refer to your app's root directory.
- **Additional Arguments**. Optional command-line arguments for the script processor 


### Virtual applications and directories 
 
To configure virtual applications and directories, specify each virtual directory and its corresponding physical path relative to the website root. Optionally, you can select the **Application** checkbox to mark a virtual directory as an application.


## Enabling diagnostic logs

To enable diagnostic logs:

1. In the blade for your web app, click **All settings**.
2. Click **Diagnostic logs**. 

Options for writing diagnostic logs from a web application that supports logging: 

- **Application Logging**. Writes application logs to the file system. Logging lasts for a period of 12 hours. 

**Level**. When application logging is enabled, this option specifies the amount of information that will be recorded (Error, Warning, Information, or Verbose).

**Web server logging**. Logs are saved in the W3C extended log file format. 

**Detailed error messages**. Saves detailed error messages .htm files. The files are saved under /LogFiles/DetailedErrors. 

**Failed request tracing**. Logs failed requests to XML files. The files are saved under /LogFiles/W3SVC*xxx*, where xxx is a unique identifier. This folder contains an XSL file and one or more XML files. Make sure to download the XSL file, because it provides functionality for formatting and filtering the contents of the XML files.

To view the log files, you must create FTP credentials, as follows:

1. In the blade for your web app, click **All settings**.
2. Click **Deployment credentials**.
3. Enter a user name and password.
4. Click **Save**.

![Set deployment credentials][configure03]

The full FTP user name is “app\username” where *app* is the name of your web app. The username is listed in the web app blade, under **Essentials**.  

![FTP deployment credentials][configure02]

## Other configuration tasks

### SSL 

In Basic or Standard mode, you can upload SSL certificates for a custom domain. For more information, see [Enable HTTPS for a web app]. 

To view your uploaded certificates, click **All Settings** > **Custom domains and SSL**.

### Domain names

Add custom domain names for your web app. For more information, see [Configure a custom domain name for a web app in Azure App Service].

To view your domain names, click **All Settings** > **Custom domains and SSL**.

### Deployments

- Set up continuous deployment. See [Using Git to deploy Web Apps in Azure App Service]
- Deployment slots. See [Deploy to Staging Environments for Web Apps in Azure App Service].

To view your deployment slots, click **All Settings** > **Deployment slots**.

### Monitoring

In Basic or Standard mode, you can  test the availability of HTTP or HTTPS endpoints, from up to three geo-distributed locations. A monitoring test fails if the HTTP response code is an error (4xx or 5xx) or the response takes more than 30 seconds. An endpoint is considered available if the monitoring tests succeed from all the specified locations. 

For more information, see [How to: Monitor web endpoint status].

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service], where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Next steps

- [Configure a custom domain name in Azure App Service]
- [Enable HTTPS for an app in Azure App Service]
- [Scale a web app in Azure App Service]
- [Monitoring basics for Web Apps in Azure App Service]

<!-- URL List -->

[ASP.NET SignalR]: http://www.asp.net/signalr
[Azure Portal]: https://portal.azure.com/
[Configure a custom domain name in Azure App Service]: ./web-sites-custom-domain-name.md
[Deploy to Staging Environments for Web Apps in Azure App Service]: ./web-sites-staged-publishing.md
[Enable HTTPS for an app in Azure App Service]: ./web-sites-configure-ssl-certificate.md
[How to: Monitor web endpoint status]: http://go.microsoft.com/fwLink/?LinkID=279906
[Monitoring basics for Web Apps in Azure App Service]: ./web-sites-monitor.md
[pipeline mode]: http://www.iis.net/learn/get-started/introduction-to-iis/introduction-to-iis-architecture#Application
[Scale a web app in Azure App Service]: ./web-sites-scale.md
[socket.io]: ./web-sites-nodejs-chat-app-socketio.md
[Try App Service]: http://go.microsoft.com/fwlink/?LinkId=523751

<!-- IMG List -->

[configure01]: ./media/web-sites-configure/configure01.png
[configure02]: ./media/web-sites-configure/configure02.png
[configure03]: ./media/web-sites-configure/configure03.png
