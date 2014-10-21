<properties pageTitle="Azure WebJobs Recommended Resources" metaKeywords="Azure WebJobs, Azure WebJobs SDK, Azure storage, Azure queues, Azure tables, Azure Service Bus" description="Recommended resources for learning how to use Azure WebJobs and the Azure WebJobs SDK." metaCanonical="" services="web-sites,storage" documentationCenter=".NET" title="Azure WebJobs Recommended Resources" authors="tdykstra" solutions="" manager="wpickett" editor="jimbe" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/12/2014" ms.author="tdykstra" />

#Azure WebJobs Recommended Resources

This topic links to documentation resources about how to use Azure WebJobs and the Azure WebJobs SDK. 

## Table of Contents

* [What are WebJobs](#whatis)
* [Getting started with WebJobs](#getstarted)
* [Sample WebJobs applications](#samples)
* [Deploying WebJobs](#deploy)
* [Testing and debugging WebJobs](#debug)
* [WebJobs SDK releases](#sdkreleases)
* [Blogs to watch](#blogs) 
* [Additional WebJobs resources](#additional)
* [Additional WebJobs SDK resources](#additionalsdk)
* [Getting help with WebJobs](#gethelp)

##<a name="whatis"></a>What are WebJobs

Azure WebJobs provide an easy way to run scripts or programs as background processes on Azure Websites. You can upload and run an executable file such as as cmd, bat, exe (.NET), ps1, sh, php, py, js and jar. These programs run as WebJobs on a schedule (cron) or continuously.

The WebJobs SDK makes it easier to use Azure Storage. The WebJobs SDK has a binding and trigger system which works with Microsoft Azure Storage Blobs, Queues and Tables as well as Service Bus Queues.

Creating, deploying, and managing WebJobs is seamless with integrated tooling in Visual Studio. You can create WebJobs from templates, publish, and manage (run/stop/monitor/debug) them. 

The WebJobs dashboard in the Azure management portal provides powerful management capabilities that give you full control over the execution of WebJobs, including the ability to invoke individual functions within WebJobs. The dashboard also displays function runtimes and logging output.

##<a name="getstarted"></a>Getting started with WebJobs

* [Introducing Azure WebJobs](http://www.hanselman.com/blog/IntroducingWindowsAzureWebJobs.aspx)
* [What is the WebJobs SDK](../websites-dotnet-webjobs-sdk/)
* [Get Started with the Azure WebJobs SDK](../websites-dotnet-webjobs-sdk-get-started/)
* [How to work with Azure queue storage using the WebJobs SDK](../websites-dotnet-webjobs-sdk-storage-queues-how-to)
* [How to Deploy Azure WebJobs to Azure Websites](../websites-dotnet-deploy-webjobs/)
* [How to deploy WebJobs using the Azure Management Portal](../web-sites-create-web-jobs/)
* [Troubleshooting Azure Web Sites in Visual Studio](../web-sites-dotnet-troubleshoot-visual-studio/).
* Videos
	* [WebJobs and the WebJobs SDK](http://channel9.msdn.com/Shows/Cloud+Cover/Episode-153-WebJobs-with-Pranav-Rastogi?utm_source=dlvr.it&utm_medium=twitter)
	* [Azure WebJobs video series on Channel 9](http://channel9.msdn.com/Tags/azurefridaywebjobs)
	* [Introducing WebJobs Tooling for Visual Studio](http://channel9.msdn.com/Shows/Web+Camps+TV/Introducing-WebJobs-Tooling-for-Visual-Studio-with-Brady-Gaster) 

##<a name="samples"></a>Sample WebJob applications

* [Sample applications provided by the WebJobs team on GitHub](https://github.com/azure/azure-webjobs-sdk-samples)
* [Simple Azure Website with WebJobs Backend using the WebJobs SDK](http://code.msdn.microsoft.com/Simple-Azure-Website-with-b4391eeb)
* [SiteMonitR](http://code.msdn.microsoft.com/SiteMonitR-dd4fcf77). Demonstrates use of scheduled and event-driven WebJobs. See the blog post [Rebuilding the SiteMonitR using Azure WebJobs SDK](http://www.bradygaster.com/post/rebuilding-the-sitemonitr-using-windows-azure-webjobs).

##<a name="deploy"></a>Deploying WebJobs

* [How to Deploy Azure WebJobs to Azure Websites](../websites-dotnet-deploy-webjobs/)
* [How to deploy WebJobs using the Azure Management Portal](../web-sites-create-web-jobs/)
* [Enabling Command-line or Continuous Delivery of Azure WebJobs](http://azure.microsoft.com/blog/2014/08/18/enabling-command-line-or-continuous-delivery-of-azure-webjobs/)
* [Git deploying a .NET console app to Azure using WebJobs](http://blog.amitapple.com/post/73574681678/git-deploy-console-app/) 
* Videos
	* [Introducing WebJobs Tooling for Visual Studio](http://channel9.msdn.com/Shows/Web+Camps+TV/Introducing-WebJobs-Tooling-for-Visual-Studio-with-Brady-Gaster) 


##<a name="debug"></a>Testing and debugging WebJobs

* [Troubleshooting Azure Web Sites in Visual Studio](../web-sites-dotnet-troubleshoot-visual-studio/).
* [Who wrote that blob?](http://blogs.msdn.com/b/jmstall/archive/2014/02/19/who-wrote-that-blob.aspx) 
* [Hosting interactive code in the Cloud](http://blogs.msdn.com/b/jmstall/archive/2014/04/26/hosting-interactive-code-in-the-cloud.aspx)
* [Getting a dashboard for local development with the WebJobs SDK](http://blogs.msdn.com/b/jmstall/archive/2014/01/27/getting-a-dashboard-for-local-development-with-the-webjobs-sdk.aspx)
* [Adding Trace to Azure Websites and WebJobs](http://blogs.msdn.com/b/mcsuksoldev/archive/2014/09/04/adding-trace-to-azure-web-sites-and-web-jobs.aspx)
* [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](../storage-monitoring-diagnosing-troubleshooting/)
* Videos
	* [Introducing WebJobs Tooling for Visual Studio](http://channel9.msdn.com/Shows/Web+Camps+TV/Introducing-WebJobs-Tooling-for-Visual-Studio-with-Brady-Gaster) 

##<a name="sdkreleases"></a>WebJobs SDK releases

* [Announcing the 1.0.0-rc1 of Microsoft Azure WebJobs SDK](http://azure.microsoft.com/blog/2014/09/22/announcing-the-1-0-0-rc1-of-microsoft-azure-webjobs-sdk/)
* [Announcing the 0.6.0-beta preview of Microsoft Azure WebJobs SDK](http://blogs.msdn.com/b/webdev/archive/2014/09/12/announcing-the-0-6-0-beta-preview-of-microsoft-azure-webjobs-sdk.aspx)
* [Announcing the 0.5.0-beta preview of Microsoft Azure WebJobs SDK](http://azure.microsoft.com/blog/2014/09/06/announcing-the-0-5-0-beta-preview-of-microsoft-azure-webjobs-sdk/)
* [Announcing the 0.4.0-beta preview of Microsoft Azure WebJobs SDK](http://azure.microsoft.com/blog/2014/08/21/announcing-the-0-4-0-beta-preview-of-microsoft-azure-webjobs-sdk/)
* [Announcing the 0.3.0-beta preview of Microsoft Azure WebJobs SDK](http://blog.azure.com/2014/06/18/announcing-the-0-3-0-beta-preview-of-microsoft-azure-webjobs-sdk/)
* [Announcing 0.2.0-alpha2 preview of Microsoft Azure WebJobs SDK](http://blogs.msdn.com/b/webdev/archive/2014/03/27/announcing-0-2-0-alpha2-preview-of-windows-azure-webjobs-sdk.aspx)

##<a name="blogs"></a>Blogs to watch

* [Amit Apple's blog](http://blog.amitapple.com/). Focuses on WebJobs (not the SDK).
* [Mike Stall's blog](http://blogs.msdn.com/b/jmstall/archive/tags/simplebatch/). Focuses on the WebJobs SDK. 
* [Magnus Mårtensson's blog](http://magnusmartensson.com/)

##<a name="additional"></a>Additional WebJobs resources

* [Azure WebJobs GA blog post by Magnus Mårtensson](http://magnusmartensson.com/azure-webjobs-ga)
* [WebJobs settings documentation in GitHub](https://github.com/projectkudu/kudu/wiki/Web-jobs).
* [Running Powershell Web Jobs on Azure websites](http://blogs.msdn.com/b/nicktrog/archive/2014/01/22/running-powershell-web-jobs-on-azure-websites.aspx)
* [Getting notified when your Azure triggered WebJobs completes](http://blog.amitapple.com/post/2014/03/webjobs-notification/)
* [Azure Web Sites: Architecting Massive-Scale Ready-For-Business Web Apps](https://channel9.msdn.com/Events/Build/2014/3-626). Covers scaling of Azure Web Sites with WebJobs, including the WebJobs SDK.
* [Simple Web Site Backup retention policy with WebJobs](http://azure.microsoft.com/blog/2014/04/28/simple-web-site-backup-retention-policy-with-webjobs/)
* [Windows Azure WebSites and Cloud Services Slow on First Request](http://wp.sjkp.dk/windows-azure-websites-and-cloud-services-slow-on-first-request/). Shows how to use WebJobs to simulate the AlwaysOn feature that is only available for the Standard Websites tier.
* [WebJobs Graceful Shutdown](http://blog.amitapple.com/post/2014/05/webjobs-graceful-shutdown/#.U72Il_5OWUl). For WebJobs SDK graceful shutdown, see [Graceful shutdown](../websites-dotnet-webjobs-sdk-storage-queues-how-to/#graceful).)
* [Scaling Your Web Application with Azure Websites](http://msdn.microsoft.com/en-us/magazine/dn786914.aspx)
* Videos
	* [Azure WebJobs videos by Magnus Mårtensson](https://www.youtube.com/playlist?list=PLqp1ZOYYUSd81yEzMYLTw8cz91wx_LU9r)
	* [Azure WebJobs video series on Channel 9](http://channel9.msdn.com/Tags/azurefridaywebjobs)

##<a name="additionalsdk"></a>Additional WebJobs SDK resources

* [Triggers, Bindings, and Route parameters in AzureJobs](http://blogs.msdn.com/b/jmstall/archive/2014/01/28/trigger-bindings-and-route-parameters-in-azurejobs.aspx) 
* Azure Storage Bindings
	* [Blobs](http://blogs.msdn.com/b/jmstall/archive/2014/02/18/azure-storage-bindings-part-1-blobs.aspx)
	* [Queues](http://blogs.msdn.com/b/jmstall/archive/2014/02/18/azure-storage-bindings-part-2-queues.aspx)
	* [Tables](http://blogs.msdn.com/b/jmstall/archive/2014/03/06/azure-storage-bindings-part-3-tables.aspx)
* [How does [BlobTrigger] work?](http://blogs.msdn.com/b/jmstall/archive/2014/04/17/how-does-blobinput-work.aspx) 
* [Advanced bindings with the Azure Web Jobs SDK](http://victorhurdugaci.com/advanced-bindings-with-the-windows-azure-web-jobs-sdk/)
* [WebJob to upload FREB files to Azure Storage using the WebJobs SDK](http://thenextdoorgeek.com/post/WAWS-WebJob-to-upload-FREB-files-to-Azure-Storage-using-the-WebJobs-SDK)
* [Hosting Azure webjobs outside Azure, with the logging benefits from an Azure hosted webjob](http://bypassion.dk/?p=510)
* [Building a Data Import Tool with Azure WebJobs](http://www.freshconsulting.com/building-data-import-tool-azure-webjobs/)
* Videos
	* [Azure WebJobs video series on Channel 9](http://channel9.msdn.com/Tags/azurefridaywebjobs)

##<a name="gethelp"></a>Getting help with WebJobs

* [StackOverflow for WebJobs](http://stackoverflow.com/questions/tagged/azure-webjobs)
* [StackOverflow for the WebJobs SDK](http://stackoverflow.com/questions/tagged/azure-webjobssdk)
* [Azure and ASP.NET forum](http://forums.asp.net/1247.aspx)
* [Azure Websites forum](http://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=windowsazurewebsitespreview)
* [Azure Websites User Voice site](http://feedback.azure.com/forums/169385-websites)
* [Twitter](http://twitter.com/). Use the hashtag #AzureWebJobs.
