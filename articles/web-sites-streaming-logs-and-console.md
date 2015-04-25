<properties 
	pageTitle="Streaming logs and console" 
	description="Streaming logs and console overview" 
	authors="adamabdelhamed" 
	manager="wpickett" 
	editor="" 
	services="app-service\web" 
	documentationCenter=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="04/25/2015" 
	ms.author="adamab"/>

#Streaming Logs and the Console

### Streaming Logs ###

The Microsoft Azure Portal provides an integrated streaming log viewer that lets you view tracing events from your Azure App Service web apps in real time.  

Setting this up requires a few simple steps:

- Write traces in your code
- Enable Application Diagnostics from within the Azure Portal
- Click on the streaming logs tile on the web app's blade

### How to write traces in your code ###

Writing traces in your code is easy.  In C# it's as easy as writing the following code:

`````````````````````````
Trace.TraceInformation("My trace statement");
`````````````````````````

`````````````````````````
Trace.TraceWarning("My warning statement");
`````````````````````````

`````````````````````````
Trace.TraceError("My error statement");
`````````````````````````

The Trace class lives in the System.Diagnostics namespace.

In a node.js app you can write this code to achieve the same result:

`````````````````````````
console.log("My trace statement").
`````````````````````````

### How to enable and view the streaming logs ###

Diagnostics are enabled on a per web app basis.  From within the [portal](https://portal.azure.com) click the **Browse** button on the left menu bar and then click **Web Apps** to get to the list of all your web apps.  

Click on the name of the web app that you want to configure.  Then click on the **Settings** command, and then select **Diagnostics logs**. On the diagnostics blade turn the **Application Logging (Filesystem)**.  The **Level** option then appears, letting you change the severity level of traces to capture.  You should set this to **Verbose** if you're just trying to get familiar with the feature as this will ensure all of your trace statements get logged.

Click **Save** at the top of the blade and you're ready to view logs.

To view the streaming logs from within the portal click the **Streaming logs** tile on the web app's blade.  If your app is actively writing trace statements then you should see them in the resulting window in near real time.

![][StreamingLogsScreenshot]

## Console ##

The Azure Portal provides console access to your web app. You can explore your web app's file system and run powershell/cmd scripts.  You are bound by the same permissions set as your running web app code when executing console commands. You won't be able to access protected directories or run scripts that require elevated permissions.  

To get to the console, browse to a web app as described in the section above.  Click on the **Console** tile and the console will open.

![][ConsoleScreenshot]

To get familiar with the console try basic commands like these:



`````````````````````````
dir
`````````````````````````

`````````````````````````
cd
`````````````````````````



<!-- Images. -->
[BrowseSitesScreenshot]: ./media/web-sites-streaming-logs-and-console/browse-sites.png
[StreamingLogsScreenshot]: ./media/web-sites-streaming-logs-and-console/streaming-logs.png
[ConsoleScreenshot]: ./media/web-sites-streaming-logs-and-console/console.png
