<properties 
	pageTitle="Azure Batch development libraries and tools" 
	description="Get the libraries and tools you need to develop Azure Batch and Batch Apps applications" 
	services="batch" 
	documentationCenter="" 
	authors="dlepow" 
	manager="timlt"
	editor="yidingz"/>

<tags 
	ms.service="batch" 
	ms.workload="big-compute" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="danlep"/>


# Azure Batch development libraries and tools 
<p> Get these libraries and tools to develop Azure Batch and Batch Apps applications.

## Batch

+ [Batch Client Library for .NET](http://www.nuget.org/packages/Azure.Batch/) (NuGet) – Develop client applications to run jobs with the Batch service
+ [Batch Management Library](http://www.nuget.org/packages/Microsoft.Azure.Management.Batch/) (NuGet) – Manage Batch service accounts
+ [Batch Explorer](https://code.msdn.microsoft.com/windowsazure/Azure-Batch-Explorer-c1d37768) (MSDN) – GUI application  and sample to browse, access, and update major elements within a Batch account, including jobs and tasks, task virtual machines (TVMs) and pools, and files on a TVM.

> [AZURE.TIP] Batch Explorer is a great tool if you are new to Batch or want to monitor or troubleshoot Batch activity. Because it's a code sample, the source code shows you how the features are implemented using the Batch .NET API. See the [blog post](http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx).

<p>
## Batch Apps

+ [Batch Apps Cloud SDK](http://www.nuget.org/packages/Microsoft.Azure.Batch.Apps.Cloud/) (NuGet) – Enable applications to offload jobs to the Batch service
+ [Batch Apps Visual Studio Extension](https://visualstudiogallery.msdn.microsoft.com/8b294850-a0a5-43b0-acde-57a07f17826a) (Visual Studio Gallery) – Cloud-enable applications in Visual Studio using the Batch Apps Cloud SDK
+ [Batch Apps Client SDK](http://www.nuget.org/packages/Microsoft.Azure.Batch.Apps/) (NuGet) – Interact with applications enabled to offload jobs to the Batch service
+ [Batch Apps Python Client](https://github.com/Azure/azure-batch-apps-python) (GitHub) - Python client module to interact with applications set up in a Batch Apps service
+ [Batch Apps Blender Sample](https://github.com/Azure/azure-batch-apps-blender) (GitHub) - Addon to Blender open source rendering software that uses the Batch Apps SDK and Python client to set up a cloud-based rendering platform


## Additional resources

+ [Code samples](https://code.msdn.microsoft.com/site/search?f[0].Type=Topic&f[0].Value=Azure%20Batch&f[0].Text=Azure%20Batch) (MSDN)
+ [Azure Batch forum](https://social.msdn.microsoft.com/forums/azure/home?forum=azurebatch)
+ [Get started with the Azure Batch Library for .NET](batch-dotnet-get-started.md)  

<!--Anchors-->
[Batch]: #batch
[Batch Apps]: #batch-apps
[Additional resources]:#additional-resources