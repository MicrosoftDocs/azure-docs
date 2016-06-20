<properties 
	pageTitle="Azure WebJobs documentation resources" 
	description="Recommended resources for learning how to use Azure WebJobs and the Azure WebJobs SDK." 
	services="app-service" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2016" 
	ms.author="tdykstra"/>

# Azure WebJobs documentation resources

## Overview

This topic links to documentation resources about how to use Azure WebJobs and the Azure WebJobs SDK. Azure WebJobs provide an easy way to run scripts or programs as background processes in the context of an [App Service web app, API app, or mobile app](../app-service/app-service-value-prop-what-is.md). You can upload and run an executable file such as as cmd, bat, exe (.NET), ps1, sh, php, py, js and jar. These programs run as WebJobs on a schedule (cron) or continuously.

The purpose of the [WebJobs SDK](websites-webjobs-resources.md) is to simplify the code you write for common tasks that a WebJob can perform, such as image processing, queue processing, RSS aggregation, file maintenance, and sending emails. The WebJobs SDK has built-in features for working with Azure Storage and Service Bus, for scheduling tasks and handling errors, and for many other common scenarios. In addition, it's designed to be extensible, and there's an [open source repository for extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/Binding-Extensions-Overview). [Azure Functions](../azure-functions/functions-overview.md) (currently in preview) is based on a version of the WebJobs SDK that works with C# script, Node.js, and other languages. 

Creating, deploying, and managing WebJobs is seamless with integrated tooling in Visual Studio. You can create WebJobs from templates, publish, and manage (run/stop/monitor/debug) them. 

The WebJobs dashboard in the Azure portal provides powerful management capabilities that give you full control over the execution of WebJobs, including the ability to invoke individual functions within WebJobs. The dashboard also displays function runtimes and logging output. 

##<a name="getstarted"></a>Getting started with WebJobs and the WebJobs SDK

* [Introduction to Azure WebJobs](http://www.hanselman.com/blog/IntroducingWindowsAzureWebJobs.aspx)
* [Azure WebJobs are awesome and you should start using them right now!](http://www.troyhunt.com/2015/01/azure-webjobs-are-awesome-and-you.html) (Blog post by Troy Hunt.)
* [Azure WebJobs Features](/blog/2014/10/22/webjobs-goes-into-full-production/)
* [What is the WebJobs SDK](websites-dotnet-webjobs-sdk.md)
* [Background Jobs Guidance by Microsoft Patterns and Practices](/documentation/articles/best-practices-background-jobs/)
* [Announcing the 1.1.0 RTM of Microsoft Azure WebJobs SDK](/blog/azure-webjobs-sdk-1-1-0-rtm/)
* [Get Started with the Azure WebJobs SDK](websites-dotnet-webjobs-sdk-get-started.md)
* [How to use Azure queue storage with the WebJobs SDK](websites-dotnet-webjobs-sdk-storage-queues-how-to.md)
* [How to use Azure blob storage with the WebJobs SDK](websites-dotnet-webjobs-sdk-storage-blobs-how-to.md)
* [How to use Azure table storage with the WebJobs SDK](websites-dotnet-webjobs-sdk-storage-tables-how-to.md)
* [How to use Azure Service Bus with the WebJobs SDK](websites-dotnet-webjobs-sdk-service-bus.md)
* [How to use WebHooks with the WebJobs SDK, with examples for GitHub, IFTTT, and HTTP](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/WebHooks-Walkthrough)
* [Azure WebJobs SDK Quick Reference (PDF download)](http://go.microsoft.com/fwlink/?LinkID=524028&clcid=0x409)
* [WebJobs settings documentation in GitHub](https://github.com/projectkudu/kudu/wiki/Web-jobs).
* Videos
	* [WebJobs and the WebJobs SDK](http://channel9.msdn.com/Shows/Cloud+Cover/Episode-153-WebJobs-with-Pranav-Rastogi?utm_source=dlvr.it&utm_medium=twitter)
	* [Azure WebJobs video series on Channel 9](http://channel9.msdn.com/Tags/azurefridaywebjobs)
	* [Introducing WebJobs Tooling for Visual Studio](http://channel9.msdn.com/Shows/Web+Camps+TV/Introducing-WebJobs-Tooling-for-Visual-Studio-with-Brady-Gaster) 
	* [WebJobs Tooling and Remote Debugging](http://channel9.msdn.com/Shows/Web+Camps+TV/WebJobs-GA-Series-Episode-1-WebJobs-Tooling-with-Brady-Gaster)
	* [Azure WebJobs Update with Pranav Rastogi - Extensibility in Release 1.1](https://channel9.msdn.com/Shows/Cloud+Cover/Episode-183-Azure-WebJobs-Update-with-Pranav-Rastogi)

See also the following sections on [Deploying WebJobs](#deploy) and [Testing and debugging WebJobs](#debug).

##<a name="deploy"></a>Deploying WebJobs

* [How to Deploy Azure WebJobs using Visual Studio](websites-dotnet-deploy-webjobs.md)
* [How to deploy WebJobs using the Azure Portal](web-sites-create-web-jobs.md)
* [Enabling Command-line or Continuous Delivery of Azure WebJobs](https://azure.microsoft.com/blog/2014/08/18/enabling-command-line-or-continuous-delivery-of-azure-webjobs/)
* [Git deploying a .NET console app to Azure using WebJobs](http://blog.amitapple.com/post/73574681678/git-deploy-console-app/)
* [Deploying an F# WebJob to Azure](http://blogs.msdn.com/b/dave_crooks_dev_blog/archive/2015/02/18/deploying-f-web-job-to-azure.aspx)
* [Deploying custom services as Azure Webjobs](http://withouttheloop.com/articles/2015-06-23-deploying-custom-services-as-azure-webjobs/)
* Videos
	* [Introducing WebJobs Tooling for Visual Studio](http://channel9.msdn.com/Shows/Web+Camps+TV/Introducing-WebJobs-Tooling-for-Visual-Studio-with-Brady-Gaster) 
	* [WebJobs Tooling and Remote Debugging](http://channel9.msdn.com/Shows/Web+Camps+TV/WebJobs-GA-Series-Episode-1-WebJobs-Tooling-with-Brady-Gaster) 

##<a name="schedule"></a>Scheduling WebJobs

* [The Add Azure WebJob Dialog](websites-dotnet-deploy-webjobs.md#configure)
* [Create a Scheduled WebJob in the Azure Portal](web-sites-create-web-jobs.md#CreateScheduled)
* [Hooking up a scheduler job to a WebJob](http://blog.davidebbo.com/2015/05/scheduled-webjob.html)
* [Scheduling Azure WebJobs with cron expressions](http://blog.amitapple.com/post/2015/06/scheduling-azure-webjobs/)
* [Scheduling individual WebJob functions using the WebJobs SDK TimerTrigger](websites-dotnet-webjobs-sdk.md#schedule)

##<a name="debug"></a>Testing and debugging WebJobs

* [New Developer and Debugging Features for Azure WebJobs in Visual Studio](http://blogs.msdn.com/b/webdev/archive/2014/11/12/new-developer-and-debugging-features-for-azure-webjobs-in-visual-studio.aspx)
* [View the WebJobs Dashboard](websites-dotnet-webjobs-sdk-get-started.md#view-the-webjobs-sdk-dashboard)
* [How to write logs using the WebJobs SDK and view them in the Dashboard](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#logs)
* [Remote debugging WebJobs](web-sites-dotnet-troubleshoot-visual-studio.md#remotedebugwj)
* [Who wrote that blob?](http://blogs.msdn.com/b/jmstall/archive/2014/02/19/who-wrote-that-blob.aspx) 
* [Hosting interactive code in the Cloud](http://blogs.msdn.com/b/jmstall/archive/2014/04/26/hosting-interactive-code-in-the-cloud.aspx)
* [Adding Trace to Azure WebJobs](http://blogs.msdn.com/b/mcsuksoldev/archive/2014/09/04/adding-trace-to-azure-web-sites-and-web-jobs.aspx)
* [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](../storage/storage-monitoring-diagnosing-troubleshooting.md)
* Videos
	* [WebJobs Tooling and Remote Debugging](http://channel9.msdn.com/Shows/Web+Camps+TV/WebJobs-GA-Series-Episode-1-WebJobs-Tooling-with-Brady-Gaster) 

##<a name="scale"></a>Scaling WebJobs

* [Scaling Your Web Application with Azure Websites](http://msdn.microsoft.com/magazine/dn786914.aspx)
* [Azure App Service: Architecting Massive-Scale Ready-For-Business Web Apps](https://channel9.msdn.com/Events/Build/2014/3-626). Covers scaling of web apps with WebJobs, including the WebJobs SDK.
* Videos
	* [Scaling out WebJobs](http://channel9.msdn.com/Shows/Azure-Friday/Azure-WebJobs-105-Scaling-out-Web-Jobs)

##<a name="additional"></a>Additional WebJobs resources

* [Azure WebJobs GA blog post by Magnus Mårtensson](http://magnusmartensson.com/azure-webjobs-ga)
* [Running Powershell Web Jobs on Azure App Service](http://blogs.msdn.com/b/nicktrog/archive/2014/01/22/running-powershell-web-jobs-on-azure-websites.aspx)
* [Getting notified when your Azure triggered WebJobs completes](http://blog.amitapple.com/post/2014/03/webjobs-notification/)
* [Simple Web App Backup retention policy with WebJobs](https://azure.microsoft.com/blog/2014/04/28/simple-web-site-backup-retention-policy-with-webjobs/)
* [Azure Web Apps and Cloud Services Slow on First Request](http://wp.sjkp.dk/windows-azure-websites-and-cloud-services-slow-on-first-request/). Shows how to use WebJobs to simulate the AlwaysOn feature that is only available for the Standard pricing tier.
* [WebJobs Graceful Shutdown](http://blog.amitapple.com/post/2014/05/webjobs-graceful-shutdown/#.U72Il_5OWUl). For WebJobs SDK graceful shutdown, see [Graceful shutdown](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#graceful).)
* [Automating Backups with Azure WebJobs & AzCopy](http://markjbrown.com/azure-webjobs-azcopy/)
* Videos
	* [Azure WebJobs videos by Magnus Mårtensson](https://www.youtube.com/playlist?list=PLqp1ZOYYUSd81yEzMYLTw8cz91wx_LU9r)
	* [Azure WebJobs video series on Channel 9](http://channel9.msdn.com/Tags/azurefridaywebjobs)

##<a name="additionalsdk"></a>Additional WebJobs SDK resources

* [WebJobs SDK Release Notes](https://github.com/Azure/azure-webjobs-sdk/wiki/Release-Notes)
* [WebJobs SDK source code](https://github.com/Azure/azure-webjobs-sdk)
* [WebJobs SDK extensions source code](https://github.com/Azure/azure-webjobs-sdk-extensions), with [detailed guide to the extensibility model](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/Binding-Extensions-Overview).  
* [WebJobs SDK Script source code](https://github.com/Azure/azure-webjobs-sdk-script/) (used for [Azure Functions](../azure-functions/functions-overview.md))
* [WebJob to upload FREB files to Azure Storage using the WebJobs SDK](http://thenextdoorgeek.com/post/WAWS-WebJob-to-upload-FREB-files-to-Azure-Storage-using-the-WebJobs-SDK)
* [Hosting Azure webjobs outside Azure, with the logging benefits from an Azure hosted webjob](http://bypassion.dk/?p=510)
* [Building a Data Import Tool with Azure WebJobs](http://www.freshconsulting.com/building-data-import-tool-azure-webjobs/)
* [Azure Functions Overview](../azure-functions/functions-overview.md)
* Videos
	* [Azure WebJobs video series on Channel 9](http://channel9.msdn.com/Tags/azurefridaywebjobs)

##<a name="samples"></a>Sample WebJob applications

* [Sample applications provided by the WebJobs team on GitHub](https://github.com/azure/azure-webjobs-sdk-samples)
* [Simple Azure Web App with WebJobs Backend using the WebJobs SDK](http://code.msdn.microsoft.com/Simple-Azure-Website-with-b4391eeb)
* [SiteMonitR](http://code.msdn.microsoft.com/SiteMonitR-dd4fcf77). Demonstrates use of scheduled and event-driven WebJobs. See the blog post [Rebuilding the SiteMonitR using Azure WebJobs SDK](http://www.bradygaster.com/post/rebuilding-the-sitemonitr-using-windows-azure-webjobs).

##<a name="blogs"></a>Blogs

* [Azure blog](/blog)
* [Amit Apple's blog](http://blog.amitapple.com/). Focuses on WebJobs (not the SDK).
* [Magnus Mårtensson's blog](http://magnusmartensson.com/)

##<a name="gethelp"></a>Getting help with WebJobs

* [StackOverflow for WebJobs](http://stackoverflow.com/questions/tagged/azure-webjobs)
* [StackOverflow for the WebJobs SDK](http://stackoverflow.com/questions/tagged/azure-webjobssdk)
* [StackOverflow for Azure Functions](http://stackoverflow.com/questions/tagged/azure-functions)
* [Azure and ASP.NET forum](http://forums.asp.net/1247.aspx)
* [Azure App Service Web Apps forum](http://social.msdn.microsoft.com/Forums/azure/home?forum=windowsazurewebsitespreview)
* [Azure Web Apps User Voice site](https://feedback.azure.com/forums/169385-websites/)
* [Twitter](http://twitter.com/). Use the hashtag #AzureWebJobs.
* [Report a WebJobs bug or issue](https://github.com/projectkudu/kudu/wiki/Reporting-WebJobs-issues)

