---
title: Availability, Performance, and Application FAQ | Microsoft Docs
description: This article lists the frequently asked questions about availability, performance, and application issues in Web Apps.
services: app-service\web
documentationcenter: ''
author: simonxjx
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 5/16/2017
ms.author: v-six

---
# Frequently asked questions for availability, performance, and application issues in Azure Web Apps
This topic provides answers to some of the most common questions about Availability, Performance, and Application in [Azure Web Apps](https://azure.microsoft.com/services/app-service/web/).

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## How can I view my web app's event logs

1. 1.Log into KUDU website https://*yourwebsitename*.scm.azurewebsites.net
2. In the top menu select **Debug Console | CMD**
3. Click on **LogFiles** folder
4. Click on the pencil icon next to **eventlog.xml** to view event logs
5. Powershell cmdlet to download these logs is `Save-AzureWebSiteLog -Name webappname`

## My App is performing slow. How can I troubleshoot and resolve the issue

There can be various reasons that could contribute to slow performance.

We have a detailed list of guided 'Recommended Actions' to help you resolve these errors.

## How do I capture user mode memory dump of my web app

1. Log into KUDU console by browsing to http://*yourwebappName*.scm.azurewebsites.net
2. Click on Process Explorer menu
3. Right click on the w3wp.exe process or your webjob process
4. Select Download Memory Dump | Full Dump

## How do I view process level info for my web app

Here are two simple  ways to view process level information

**Azure Portal**
1. Open the **Process Explorer** for the web app
2. Now click on the w3wp.exe process to view its details

**Kudu Console**
1. Log into KUDU console i.e., browse to https://*YourSiteName*.scm.azurewebsites.net
2. Click on Process Explorer menu
3. Click on the properties button of the w3wp.exe process

## I am getting "Error 403 - This web app is stopped" when I browse my web app. How can I resolve it?

There are 3 conditions that can cause this error to be presented.

* The web app has reached a billing limit and your site has been disabled.
* The web app has been stopped in the portal.
* The web app has reached a resource quota limit that applies to either Free or Shared scale modes.

You can follow the steps in [this](https://blogs.msdn.microsoft.com/waws/2016/01/05/azure-web-apps-error-403-this-web-app-is-stopped/) article to check which one you are running into and resolve the issue.

## Where can I learn more about Quotas and Limits for various App Service plans?

Please review this detailed  [document](https://azure.microsoft.com/en-us/documentation/articles/azure-subscription-service-limits/#app-service-limits) on quotas and limits in the following article.

## How can I decrease the response time of the first request after idle time?

By default, web apps are unloaded if they are idle for some period of time. This lets the system conserve resources. But the downside is the response to the first request after the web app is unloaded will be higher to allow for loading the web app and start serving responses. In Basic or Standard mode, you can enable **Always On** to keep the app loaded all the time. This way, you will not experience the higher response times on first response after idle time.

Steps to enable Always On:
1. Navigate to your web app in the Azure portal
2. Click Application settings
3. Set 'Always On' setting to On

## How do I enable Failed Request Tracing?

Here are the steps to enable Failed Request tracing:

1. Log into Azure portal (https://portal.azure.com)
2. Navigate to your Azure Website
3. Click on All Settings | Diagnostics Logs
4. Select ON for Failed Request Tracing
5. Click on Save
6. Click on Tools in your Azure Website blade
7. Click on Visual Studio Online
8. If it is not ON, select ON
9. Next, click on Go
10. Click on Web.config
11. In the system.webServer, add this below configuration if are interested in capture a particular URL.
```
<system.webServer>
<tracing> <traceFailedRequests>
<remove path="*api*" />
<add path="*api*">
<traceAreas>
<add provider="ASP" verbosity="Verbose" />
<add provider="ASPNET" areas="Infrastructure,Module,Page,AppServices" verbosity="Verbose" />
<add provider="ISAPI Extension" verbosity="Verbose" />
<add provider="WWW Server" areas="Authentication,Security,Filter,StaticFile,CGI,Compression, Cache,RequestNotifications,Module,FastCGI" verbosity="Verbose" />
</traceAreas>
<failureDefinitions statusCodes="200-999" />
</add> </traceFailedRequests>
</tracing>
```
12. For troubleshooting slow performance issues, add this below configuration (capturing request taking more than 30 seconds)
```
<system.webServer>
<tracing> <traceFailedRequests>
<remove path="*" />
<add path="*">
<traceAreas> <add provider="ASP" verbosity="Verbose" />
<add provider="ASPNET" areas="Infrastructure,Module,Page,AppServices" verbosity="Verbose" />
<add provider="ISAPI Extension" verbosity="Verbose" />
<add provider="WWW Server" areas="Authentication,Security,Filter,StaticFile,CGI,Compression, Cache,RequestNotifications,Module,FastCGI" verbosity="Verbose" />
</traceAreas>
<failureDefinitions timeTaken="00:00:30" statusCodes="200-999" />
</add> </traceFailedRequests>
</tracing>
```
13. To download the Failed Request Traces, in Azure Portal (https://portal.azure.com)
14. Navigate to your website
15. Click on Tools
16. Click on the Kudu
17. Click on GO
18. Click on Debug Console | CMD from the top menu
19. Click on LogFiles Folder and look for folder name staring with "W3SVC…."
20. Click on pencil icon for each XML file

## I am seeing "Worker Process requested recycle due to 'Percent Memory' limit". How can I address this issue?

The maximum available amount of memory for a 32-bit process (even on a 64-bit OS) is 2 GB.
By default the worker process is set to 32-bit in Azure App Service (for compatibility with legacy web applications).

You can consider switching to 64-bit processes to be able to take advantage of the extra memory available in your Web Worker.

NOTE: This will trigger a Web App restart so please schedule accordingly.

Also note that 64-bit environment requires Basic or Standard mode.Free and Shared modes always run in a 32-bit environment.

More details can be found [here](https://azure.microsoft.com/en-us/documentation/articles/web-sites-configure/%22).

## What are some resource move limitations I should be aware of when moving Azure App Services?

There are a few limitations we need to be aware of for Azure App Service Resource Move operations as discussed in the documentation at this [link](https://docs.microsoft.com/en-gb/azure/azure-resource-manager/resource-group-move-resources#app-service-limitations).

## How do I automate Azure App Service WebApps using Powershell?

We have a detailed blog where we share how to use the ARM based PowerShell CmdLets to automate common tasks for managing or maintaining  Azure App Service Web Apps at this [link](https://blogs.msdn.microsoft.com/puneetgupta/2016/03/21/automating-webapps-hosted-in-azure-app-service-through-powershell-arm-way/). In this blog you can also find sample code for various web apps management tasks.

Also, Reference to descriptions and syntax for all Azure App service web apps cmdlets can be found at this [link](https://docs.microsoft.com/en-us/powershell/module/azurerm.websites/?view=azurermps-4.0.0).

## Why does my request timeout after 240 seconds?

Azure Load Balancer has an ‘idle timeout’ setting of 4 minutes by default, which is generally a very reasonable response time limit for a web request. If you have a requirement for background processing within your web application, then the recommended solution is to use Azure WebJobs. The Azure Web app can call the Azure Webjob and be notified once the background processing is done. There are many ways that Azure provides such as queues triggers etc. and you can choose the method that suits you the best.

Azure Webjobs are designed for background processing and you can do as much background processing as you want within them. For more information on Azure WebJobs, please click this [link](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-create-web-jobs).

## How can I enable HTTP compression for my content?

You can turn on compression for both static and dynamic content types with the following configuration in application-level web.config:

```
<system.webServer>
<urlCompression doStaticCompression="true" doDynamicCompression="true" />
< /system.webServer>
```
You can also specify the specific dynamic and static MIME types that you would like to be compressed. More detail can be found in our response to a forum post at this [link](https://social.msdn.microsoft.com/Forums/azure/en-US/890b6d25-f7dd-4272-8970-da7798bcf25d/httpcompression-settings-on-a-simple-azure-website?forum=windowsazurewebsitespreview).

## I am getting started with Azure App Service Web Apps and I want to know how to publish.

Here are some basic steps to publish your web app code.

1. If you have the Visual Studio Solution,  right click on the web application project and click on Publish.
2. Another option is to deploy using FTP client. Download the publish profile for the web app that you want to deploy your code to in the Azure portal. Then upload the files to \site\wwwroot location using these publish prodile FTP credentials.

For further detail, please refer to product documentation at this [link](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-deploy).

## How to determine the installed .NET version in Azure App Services

The quickest way to find this is through the Kudu console. for your Azure App Service.  You can access the kudu console  from the portal or by using the URL of your Azure App Service. Step-by-Step instructions can be found at this [link](https://blogs.msdn.microsoft.com/waws/2016/11/02/how-to-determine-the-installed-net-version-in-azure-app-services/).

## How do I remote debug my Azure App Service Web App using Visual Studio?

Please find a detailed step-by-step walkthrough showing how to debug your web app using Visual Studio at this [link](https://blogs.msdn.microsoft.com/benjaminperkins/2016/09/22/remote-debug-your-azure-app-service-web-app/).

## How do I troubleshoot a High CPU consumption scenario?

Sometimes you can run into high CPU condition as your app may truly require more computing resources.  For that scenario, you can consider scaling to a higher tier so the application gets all the resources needed. There are also times when High CPU is due to a bad loop or a coding practice that you would like to gain better insight about.  Getting to the bottom of it is a two part process. (1) Process Dump creation (2) Process Dump Analysis. Click [here](https://blogs.msdn.microsoft.com/asiatech/2016/01/20/how-to-capture-dump-when-intermittent-high-cpu-happens-on-azure-web-app/) for step by step instructions to perform these action.

## How do I troubleshoot a High memory consumption scenario?

Sometimes you experience high memory condition as your app may truly require more computing resources.  For that scenario, you can consider scaling to a higher tier so the application gets all the resources needed. There are also times when there is a bug in the code causing memory leak or just some coding practice that is driving memory consumption.   Getting to the bottom of it is a two part process. (1) Process Dump creation (2) Process Dump Analysis.

The Crash Diagnoser from Site Extension Gallery can perform both these steps in a few easy steps. Please find the step-by-step guidance at this [link](https://blogs.msdn.microsoft.com/asiatech/2016/02/02/how-to-capture-and-analyze-dump-for-intermittent-high-memory-on-azure-web-app/).

## ASP.NET Core applications may experience intermittent hangs when hosted in Azure App Service

If you are noticing intermittent hangs or an error message that says "The specified CGI Application encountered an error and the server terminated the process." in your ASP.NET Core 1.0 app hosted in Azure App Service, you may be running into a known issue as discussed in this [github link](https://github.com/aspnet/KestrelHttpServer/issues/1182).

This issue is fixed in 1.0.2 version of Kestrel that is included in .NET Core 1.0.3 update. Please make sure to update your app dependencies to use 1.0.2 version of Kestrel to resolve this issue. Alternatively, you can use one of the two available workarounds as described in the blog article at [this link](https://blogs.msdn.microsoft.com/waws/2016/12/11/asp-net-core-slow-perf-issues-on-azure-websites).

## I am unable to remote debug my web app in Visual Studio. How can I address this?

There may be many reasons that could prevent you from attaching a Visual Studio debugger to your Azure App Serfice Web App. This quick [blog article](https://blogs.msdn.microsoft.com/jpsanders/2016/02/09/manually-attach-a-debugger-to-azure-web-apps/) provides a workaround that may unblock you so you can debug your app.

## Why is Autoscale not working as expected? It appears to be scaling only partially.

Autoscale is triggered when metrics swing outside the preconfigured boundaries. Sometimes you may notice that the capacity is only partially filled compared to what you expected.  This is because, when desired number of instances are not available, Autoscale partially fills in with the available number of instances. It then runs the rebalance logic to get more capacity and allocates the remaining instances. Please note that this may take a few minutes.

If you still do not see expected number of instances after giving a few minutes,  it could be because the partial refill was good enough to bring the metrics within the boundaries OR Autoscale scaled down because it hit the lower metrics boundary.

If none of these conditions apply and the problem persists, please go ahead and open a support ticket.

## I cannot find my log files in the file structure of my Azure App Service Web App. Where can I find them?

If you are using Local Cache, the behavior of your App Service changes, which includes the folder structure of the LogFiles and Data folders. When local cache is used, subfolders are created in the storage LogFiles and Data folders which follow the naming pattern of "unique identifier" + time stamp. Each of the subfolders corresponds to a VM instance where the web app is running or has run.

You can check if you are using Local Cache by looking at the Application settings of the App Service. If Local cache is being used, you would see an App setting 'WEBSITE_LOCAL_CACHE_OPTION' set to 'Always'. More information about Local Cache can be found at this [link](https://docs.microsoft.com/en-us/azure/app-service/app-service-local-cache).

If this is not your scenario, please proceed to create a support ticket.

## I am getting an error stating 'An attempt was made to access a socket in a way forbidden by its access permissions'. How can I resolve it?

This error typically happens if the **outbound TCP connections** on the VM instance are exhausted. In Azure App service, each instance has limits enforced on the maximum number of outbound connections that can be made. For more details on these limits, refer to https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#cross-vm-numerical-limits.

This error can also occur if you try to access a **local address** from your application. For more details refer to https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#local-address-requests.

A blog post in this regard is http://www.freekpaans.nl/2015/08/starving-outgoing-connections-on-windows-azure-web-sites/.

## How can I migrate from a on-premise environment to Azure App Services?

The **Azure App Service** Migration tool can be utilized to migrate sites from Windows and Linux web servers to Azure App Service.

As part of the migration the tool will create Web Apps and databases on Azure if needs be, publish content and publish your database. For more details refer to https://www.movemetothecloud.net/
