---
title: Upgrade to the Azure Search .NET Management SDK version 2
titleSuffix: Azure Cognitive Search
description: Upgrade to the Azure Search .NET Management SDK version 2 from previous versions. Learn what's new and what code changes are required.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.service: cognitive-search
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 11/04/2019
---

# Upgrading versions of the Azure Search .NET Management SDK

> [!Important]
> This content is still under construction. Version 3.0 of the Azure Search Management .NET SDK is available on NuGet. We are working on updating this migration guide to explain how to upgrade to the new version. 
>

If you're using version 1.0.2 or older of the [Azure Search .NET Management SDK](https://aka.ms/search-mgmt-sdk), this article will help you upgrade your application to use version 2.

Version 2 of the Azure Search .NET Management SDK contains some changes from earlier versions. These are mostly minor, so changing your code should require only minimal effort. See [Steps to upgrade](#UpgradeSteps) for instructions on how to change your code to use the new SDK version.

<a name="WhatsNew"></a>

## What's new in version 2
Version 2 of the Azure Search .NET Management SDK targets the same generally available version of the Azure Search Management REST API as previous SDK versions, specifically 2015-08-19. The changes to the SDK are strictly client-side changes to improve the usability of the SDK itself. These changes include the following:

* `Services.CreateOrUpdate` and its asynchronous versions now automatically poll the provisioning `SearchService` and do not return until service provisioning is complete. This saves you from having to write such polling code yourself.
* If you still want to poll service provisioning manually, you can use the new `Services.BeginCreateOrUpdate` method or one of its asynchronous versions.
* New methods `Services.Update` and its asynchronous versions have been added to the SDK. These methods use HTTP PATCH to support incremental updating of a service. For example, you can now scale a service by passing a `SearchService` instance to these methods that contains only the desired `partitionCount` and `replicaCount` properties. The old way of calling `Services.Get`, modifying the returned `SearchService`, and passing it to `Services.CreateOrUpdate` is still supported, but is no longer necessary. 

<a name="UpgradeSteps"></a>

## Steps to upgrade
First, update your NuGet reference for `Microsoft.Azure.Management.Search` using either the NuGet Package Manager Console or by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

Once NuGet has downloaded the new packages and their dependencies, rebuild your project. Depending on how your code is structured, it may rebuild successfully. If so, you're ready to go!

If your build fails, it could be because you've implemented some of the SDK interfaces (for example, for the purposes of unit testing), which have changed. To resolve this, you'll need to implement the new methods such as `BeginCreateOrUpdateWithHttpMessagesAsync`.

Once you've fixed any build errors, you can make changes to your application to take advantage of new functionality if you wish. New features in the SDK are detailed in [What's new in version 2](#WhatsNew).

## Next steps
We welcome your feedback on the SDK. If you encounter problems, please post your questions to [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-cognitive-search?tab=Newest). If you find a bug, you can file an issue in the [Azure .NET SDK GitHub repository](https://github.com/Azure/azure-sdk-for-net/issues). Make sure to label your issue title with "[search]".
