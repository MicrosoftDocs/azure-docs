---
title: Streaming logs and console
description: Streaming logs and console overview
author: btardif
manager: erikre
editor: ''
services: app-service\web
documentationcenter: ''

ms.assetid: 3e50a287-781b-4c6a-8c53-eec261889d7a
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 10/12/2016
ms.author: byvinyal

---
# Streaming Logs and the Console
## Streaming Logs
The **Azure portal** provides an integrated streaming log viewer that 
lets you view tracing events from your **App Service** apps in real time.  

Setting up this feature requires a few simple steps:

* Write traces in your code
* Enable Application **Diagnostic Logs** for your app
* View the stream from the built-in **Streaming Logs** UI in the **Azure portal**.

### How to write traces in your code
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

### How to enable and view the streaming logs
![][BrowseSitesScreenshot]
Diagnostics are enabled on a per app basis. Start by browsing to the site you 
would like to enable this feature on.  

![][DiagnosticsLogs]
From settings menu, scroll down to the **Monitoring** section and click on 
**(1) Diagnostic Logs**. Then **(2) enable** **Application Logging (Filesystem)** 
or **Application Logging (blob)** The **Level** option lets you change the severity 
level of traces to capture. If you're just trying to get familiar with the feature, 
set the level to **Verbose** to ensure all of your trace statements are 
collected.

Click **SAVE** at the top of the blade and you're ready to view logs.

> [!NOTE]
> The higher the **severity level** the more resources are consumed to log and the more traces are produced. Make sure **severity level** is configured to the correct verbosity for a production or high traffic site. 
> 
> 

![][StreamingLogsScreenshot]
To view the **streaming logs** from within the Azure portal, click on 
**(1) Log Stream** also in the **Monitoring** section of the settings menu. 
If your app is actively writing trace statements, then you should see them in the 
**(2) streaming logs UI** in near real time.

## Console
The **Azure portal** provides console access to your app. You can explore 
your app's file system and run powershell/cmd scripts. You are bound by the 
same permissions set as your running app code when executing console commands. 
Access to protected directories or running scripts that require elevated 
permissions is blocked.  

![][ConsoleScreenshot]
From settings menu, scroll down to **Development Tools** section and click 
on **(1) Console** and the **(2) console** UI opens to the right.

To get familiar with the **console**, try basic commands like:

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
