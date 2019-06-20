---
title: Upgrade to the Azure Search .NET SDK version 5 - Azure Search
description: Migrate code to the Azure Search .NET SDK version 5 from older versions. Learn what is new and which code changes are required.
author: brjohnstmsft
manager: jlembicz
services: search
ms.service: search
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: brjohnst
ms.custom: seodec2018
---
# Upgrading to the Azure Search .NET SDK version 5

If you're using version 4.0-preview or older of the [Azure Search .NET SDK](https://aka.ms/search-sdk), this article will help you upgrade your application to use version 5.

For a more general walkthrough of the SDK including examples, see [How to use Azure Search from a .NET Application](search-howto-dotnet-sdk.md).

Version 5 of the Azure Search .NET SDK contains some changes from earlier versions. These are mostly minor, so changing your code should require only minimal effort. See [Steps to upgrade](#UpgradeSteps) for instructions on how to change your code to use the new SDK version.

> [!NOTE]
> If you're using version 2.0-preview or older, you should upgrade to version 3 first, and then upgrade to version 5. See [Upgrading to the Azure Search .NET SDK version 3](search-dotnet-sdk-migration.md) for instructions.
>
> Your Azure Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version. When using the REST API, you must specify the API version in every request via the api-version parameter. When using the .NET SDK, the version of the SDK you're using determines the corresponding version of the REST API. If you are using an older SDK, you can continue to run that code with no changes even if the service is upgraded to support a newer API version.

<a name="WhatsNew"></a>

## What's new in version 5
Version 5 of the Azure Search .NET SDK targets the latest generally available version of the Azure Search REST API, specifically 2017-11-11. This makes it possible to use new features of Azure Search from a .NET application, including the following:

* [Synonyms](search-synonyms.md).
* You can now programmatically access warnings in indexer execution history (see the `Warning` property of `IndexerExecutionResult` in the [.NET reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexerexecutionresult?view=azure-dotnet) for more details).
* Support for .NET Core 2.
* New package structure supports using only the parts of the SDK that you need (see [Breaking changes in version 5](#ListOfChanges) for details).

<a name="UpgradeSteps"></a>

## Steps to upgrade
First, update your NuGet reference for `Microsoft.Azure.Search` using either the NuGet Package Manager Console or by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

Once NuGet has downloaded the new packages and their dependencies, rebuild your project. Depending on how your code is structured, it may rebuild successfully. If so, you're ready to go!

If your build fails, you should see a build error like the following:

    The name 'SuggesterSearchMode' does not exist in the current context

The next step is to fix this build error. See [Breaking changes in version 5](#ListOfChanges) for details on what causes the error and how to fix it.

Please note that due to changes in the packaging of the Azure Search .NET SDK, you must rebuild your application in order to use version 5. These changes are detailed in [Breaking changes in version 5](#ListOfChanges).

You may see additional build warnings related to obsolete methods or properties. The warnings will include instructions on what to use instead of the deprecated feature. For example, if your application uses the `IndexingParametersExtensions.DoNotFailOnUnsupportedContentType` method, you should get a warning that says "This behavior is now enabled by default, so calling this method is no longer necessary."

Once you've fixed any build errors or warnings, you can make changes to your application to take advantage of new functionality if you wish. New features in the SDK are detailed in [What's new in version 5](#WhatsNew).

<a name="ListOfChanges"></a>

## Breaking changes in version 5

### New Package Structure

The most substantial breaking change in version 5 is that the `Microsoft.Azure.Search` assembly and its contents have been divided into four separate assemblies that are now distributed as four separate NuGet packages:

 - `Microsoft.Azure.Search`: This is a meta-package that includes all the other Azure Search packages as dependencies. If you're upgrading from an earlier version of the SDK, simply upgrading this package and re-building should be enough to start using the new version.
 - `Microsoft.Azure.Search.Data`: Use this package if you're developing a .NET application using Azure Search, and you only need to query or update documents in your indexes. If you also need to create or update indexes, synonym maps, or other service-level resources, use the `Microsoft.Azure.Search` package instead.
 - `Microsoft.Azure.Search.Service`: Use this package if you're developing automation in .NET to manage Azure Search indexes, synonym maps, indexers, data sources, or other service-level resources. If you only need to query or update documents in your indexes, use the `Microsoft.Azure.Search.Data` package instead. If you need all the functionality of Azure Search, use the `Microsoft.Azure.Search` package instead.
 - `Microsoft.Azure.Search.Common`: Common types needed by the Azure Search .NET libraries. You should not need to use this package directly in your application; It is only meant to be used as a dependency.
 
This change is technically breaking since many types were moved between assemblies. This is why rebuilding your application is necessary in order to upgrade to version 5 of the SDK.

There a small number of other breaking changes in version 5 that may require code changes in addition to rebuilding your application.

### Change to Suggesters 

The `Suggester` constructor no longer has an `enum` parameter for `SuggesterSearchMode`. This enum only had one value, and was therefore redundant. If you see build errors as a result of this, simply remove references to the `SuggesterSearchMode` parameter.

### Removed obsolete members

You may see build errors related to methods or properties that were marked as obsolete in earlier versions and subsequently removed in version 5. If you encounter such errors, here is how to resolve them:

- If you were using the `IndexingParametersExtensions.IndexStorageMetadataOnly` method, use `SetBlobExtractionMode(BlobExtractionMode.StorageMetadata)` instead.
- If you were using the `IndexingParametersExtensions.SkipContent` method, use `SetBlobExtractionMode(BlobExtractionMode.AllMetadata)` instead.

### Removed preview features

If you are upgrading from version 4.0-preview to version 5, be aware that JSON array and CSV parsing support for Blob Indexers has been removed since these features are still in preview. Specifically, the following methods of the `IndexingParametersExtensions` class have been removed:

- `ParseJsonArrays`
- `ParseDelimitedTextFiles`

If your application has a hard dependency on these features, you will not be able to upgrade to version 5 of the Azure Search .NET SDK. You can continue to use version 4.0-preview. However, please keep in mind that **we do not recommend using preview SDKs in production applications**. Preview features are for evaluation only and may change.

## Conclusion
If you need more details on using the Azure Search .NET SDK, see the [.NET How-to](search-howto-dotnet-sdk.md).

We welcome your feedback on the SDK. If you encounter problems, feel free to ask us for help on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-search). If you find a bug, you can file an issue in the [Azure .NET SDK GitHub repository](https://github.com/Azure/azure-sdk-for-net/issues). Make sure to prefix your issue title with "[Azure Search]".

Thank you for using Azure Search!
