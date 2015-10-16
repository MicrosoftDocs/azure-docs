<properties
	pageTitle="Azure Batch development libraries and tools | Microsoft Azure"
	description="Get the libraries and tools you need to develop Azure Batch applications"
	services="batch"
	documentationCenter=""
	authors="dlepow"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.workload="big-compute"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="07/24/2015"
	ms.author="danlep"/>


# Azure Batch development libraries and tools
<p> Get these libraries and tools to develop Azure Batch applications.

## Batch

+ [Batch Client Library for .NET](http://www.nuget.org/packages/Azure.Batch/) (NuGet) – Develop client applications to run jobs with the Batch service
+ [Batch Management Library](http://www.nuget.org/packages/Microsoft.Azure.Management.Batch/) (NuGet) – Manage Batch accounts
+ [Batch Explorer](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer) (GitHub) - GUI application and sample to browse, access, and update major elements within a Batch account, including jobs and tasks, compute nodes and pools, and files on a compute node. See the [blog post](http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx).


## Batch Apps

+ [Batch Apps Cloud SDK](http://www.nuget.org/packages/Microsoft.Azure.Batch.Apps.Cloud/1.1.1-preview) (NuGet) – Enable applications to offload jobs to the Batch service
+ [Batch Apps Visual Studio Extension](https://visualstudiogallery.msdn.microsoft.com/8b294850-a0a5-43b0-acde-57a07f17826a) (Visual Studio Gallery) – Cloud-enable applications in Visual Studio using the Batch Apps Cloud SDK
+ [Batch Apps Client SDK](http://www.nuget.org/packages/Microsoft.Azure.Batch.Apps/2.3.0-preview) (NuGet) – Interact with applications enabled to offload jobs to the Batch service
+ [Batch Apps Python Client](https://github.com/Azure/azure-batch-apps-python) (GitHub) - Python client module to interact with applications set up in a Batch Apps service

>[AZURE.IMPORTANT]Azure will only release the Batch Apps API as a Preview. You should only develop with it for test or proof-of-concept projects. Key Batch Apps capabilities will be integrated into the Batch API in future service releases.

## Additional resources

+ [Code samples](https://github.com/Azure/azure-batch-samples) (GitHub)
+ [Azure Batch forum](https://social.msdn.microsoft.com/forums/azure/home?forum=azurebatch)

<!--Anchors-->
[Batch]: #batch
[Batch Apps]: #batch-apps
[Additional resources]:#additional-resources
