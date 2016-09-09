<properties
    pageTitle="Using App-V apps with Azure RemoteApp| Microsoft Azure"
    description="Learn how to use App-V apps in Azure RemoteApp."
    services="remoteapp"
	documentationCenter=""
    authors="ericorman"
    manager="mbaldwin" />

<tags
    ms.service="remoteapp"
    ms.workload="compute"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="08/15/2016" 
    ms.author="elizapo" />



# Using App-V apps in Azure RemoteApp

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

You can use App-V applications in a Azure RemoteApp hybrid collection, which requires domain join.

Before you get started, make sure to install the App-V 5.1 client with the latest updates. You will need to create a [custom image](remoteapp-create-custom-image.md) that includes the App-V client.  

It’s easy to use your existing App-V infrastructure with Azure RemoteApp. Since a hybrid collection is deployed into an Azure VNET that has access to your domain controller and the VMs are domain joined, you can leverage your existing App-v infrastructure and deployment methods to easyily host App-V application in Azure RemoteApp. Here are some considerations that you should be aware of based on the type of App-V deployment you currently have:

| Configuration options |                       | Positive                                                               | Negative                                                                                              |
|-----------------------|-----------------------|------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| Delivery method       | Streaming (on-demand) | App is always the latest and fresh                                     | First time latency                                                                                    |
|                       | Mounted               | Fastest; app is already present on the VM                              | Bloat - takes up image space (127 GB limit)                                                           |
| App location storage  | Shared content        | App runs in memory of Azure RemoteApp instance                         | Eats memory and good connection to streaming (file) server where the app resides                      |
|                       | Disk (Cached)         | Fast execution. App not dependent on availability of Content Source | Bloat - takes up image space (127 GB limit)                                                           |
| Targeting             | User                  | Requires full standalone App-V infrastructure                          |                                                                                                       |
|                       | Global (machine)      |  Pre-publish or target using Publishing server                         |  Need to update your Azure image if you want to update the app (huge). Takes up some space on image. |

 After you create your custom image and your hybrid collection, publish your application, assign users and enjoy your existing App-V applications hosted in Azure RemoteApp delivered to any device anywhere.
