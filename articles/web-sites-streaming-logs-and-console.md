<properties pageTitle="Streaming logs and console" description="Streaming logs and console overview" title="Streaming logs and console" authors="adamab" manager="wpickett" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="multiple" ms.topic="article" ms.date="11/17/2014" ms.author="adamab" />

#Streaming Logs and the Console

### Streaming Logs ###

The Microsoft Azure Preview Portal provides an integrated streaming log viewer that lets you view tracing events from your websites in real time.  

Setting this up requires a few simple steps:

- Write traces in your code
- Enable Application Diagnostics from within the Azure Preview Portal
- Click on the streaming logs part on the website blade

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

Diagnostics are enabled on a per website basis.  From within the [portal](https://portal.azure.com) click the **Browse** button on the left menu bar and then click **Websites** to get to the list of all your websites.  

![][BrowseSitesScreenshot]

Click on the name of the website that you want to configure.  Then click on the part called **DIAGNOSTIC LOGS** and turn the **Application Logging (Filesystem)** switch to the **ON** setting.  The **Level** option then appears, letting you change the severity level of traces to capture.  You should set this to **Verbose** if you're just trying to get familiar with the feature as this will ensure all of your trace statements get logged.

Click **SAVE** at the top of the blade and you're ready to view logs.

To view the streaming logs from within the portal click the **STREAMING LOGS** part on the webiste blade.  If your site is actively writing trace statements then you should see them in the resulting window in near real time.

![][StreamingLogsScreenshot]

## Console ##

The Azure Preview Portal provides console access to your website environment. You can explore your website's file system and run powershell/cmd scripts.  You are bound by the same permissions set as your running website code when executing console commands. You won't be able to access protected directories or run scripts that require elevated permissions.  

To get to the console, browse to a website as described in the section above.  Click on the **Console** part and the console will open.

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
