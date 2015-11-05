<properties 
	pageTitle="Streaming logs and console" 
	description="Streaming logs and console overview" 
	authors="btardif" 
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
	ms.date="08/10/2015" 
	ms.author="byvinyal"/>

#Streaming Logs and the Console

### Streaming Logs ###

The Microsoft Azure Portal provides an integrated streaming log viewer that lets you view tracing events from 
your Azure App Service web apps in real time.  

Setting this up requires a few simple steps:

- Write traces in your code
- Enable Application Diagnostics from within the Azure Portal
- Click on the streaming logs part on the web app's blade

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

![][BrowseSitesScreenshot]
Diagnostics are enabled on a per web app basis.  From within the [portal](https://portal.azure.com) click the
 **Browse (1)** button on the left menu bar and then click **Web Apps (2)** to get to the **list (3)** of 
 all your web apps.  

Click on the name of the web app that you want to configure to navigate to it.
  
![][DiagnosticsLogs]
Then click **Settings (1)** > **Diagnostic Logs (2)** and turn **On** 
**Application Logging (Filesystem)(3)** The **Level** option letts you change the severity 
level of traces to capture.  You should set this to **Verbose** if you're just trying to 
get familiar with the feature as this will ensure all of your trace statements get logged.

Click **SAVE** at the top of the blade and you're ready to view logs.

**NOTE:** The higher the **severity level** the more resources are consumed to log and the more traces 
you will get. Make sure this is set to the appropriate level when using this feature for 
a high traffic / production site. 

![][StreamingLogsScreenshot]
To view the streaming logs from within the portal click **Tools (1)** > **Log Stream(2)**. If your app 
is actively writing trace statements then you should see them in the resulting window in near real time.

## Console ##

The Azure Portal provides console access to your web app environment. You can explore your web 
app's file system and run powershell/cmd scripts.  You are bound by the same permissions set as 
your running web app code when executing console commands. You won't be able to access protected 
directories or run scripts that require elevated permissions.  

![][ConsoleScreenshot]
To get to the console, browse to a web app as described in the section above. 
Click on **Tools**>**Console** and the console will open.

To get familiar with the console try basic commands like these:



`````````````````````````
dir
`````````````````````````

`````````````````````````
cd
`````````````````````````



<!-- Images. -->
[DiagnosticsLogs]: ./media/web-sites-streaming-logs-and-console/diagnostic-logs.png
[BrowseSitesScreenshot]: ./media/web-sites-streaming-logs-and-console/browse-sites.png
[StreamingLogsScreenshot]: ./media/web-sites-streaming-logs-and-console/streaming-logs.png
[ConsoleScreenshot]: ./media/web-sites-streaming-logs-and-console/console.png
