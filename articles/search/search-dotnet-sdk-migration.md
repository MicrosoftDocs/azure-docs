---
title: Upgrade to the Azure Search .NET SDK version 3 - Azure Search
description: Migrate code to the Azure Search .NET SDK version 3 from older versions. Learn what's new and which code changes are required.
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
# Upgrading to the Azure Search .NET SDK version 3

<!--- DETAILS in the word doc
cosmosdb
NER v1 skill 
Indexer execution result errors no longer have status
the data source API will no longer return in the response of any REST operation, the connection string specified by the user.
--->

If you're using version 2.0-preview or older of the [Azure Search .NET SDK](https://aka.ms/search-sdk), this article will help you upgrade your application to use version 3.

For a more general walkthrough of the SDK including examples, see [How to use Azure Search from a .NET Application](search-howto-dotnet-sdk.md).

Version 3 of the Azure Search .NET SDK contains some changes from earlier versions. These are mostly minor, so changing your code should require only minimal effort. See [Steps to upgrade](#UpgradeSteps) for instructions on how to change your code to use the new SDK version.

> [!NOTE]
> If you're using version 1.0.2-preview or older, you should upgrade to version 1.1 first, and then upgrade to version 3. See [Upgrading to the Azure Search .NET SDK version 1.1](search-dotnet-sdk-migration-version-1.md) for instructions.
>
> Your Azure Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version. When using the REST API, you must specify the API version in every request via the api-version parameter. When using the .NET SDK, the version of the SDK you're using determines the corresponding version of the REST API. If you are using an older SDK, you can continue to run that code with no changes even if the service is upgraded to support a newer API version.

<a name="WhatsNew"></a>

## What's new in version 3
Version 3 of the Azure Search .NET SDK targets the latest generally available version of the Azure Search REST API, specifically 2016-09-01. This makes it possible to use many new features of Azure Search from a .NET application, including the following:

* [Custom analyzers](https://aka.ms/customanalyzers)
* [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md) and [Azure Table Storage](search-howto-indexing-azure-tables.md) indexer support
* Indexer customization via [field mappings](search-indexer-field-mappings.md)
* ETags support to enable safe concurrent updating of index definitions, indexers, and data sources
* Support for building index field definitions declaratively by decorating your model class and using the new `FieldBuilder` class.
* Support for .NET Core and .NET Portable Profile 111

<a name="UpgradeSteps"></a>

## Steps to upgrade
First, update your NuGet reference for `Microsoft.Azure.Search` using either the NuGet Package Manager Console or by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

Once NuGet has downloaded the new packages and their dependencies, rebuild your project. Depending on how your code is structured, it may rebuild successfully. If so, you're ready to go!

If your build fails, you should see a build error like the following:

    Program.cs(31,45,31,86): error CS0266: Cannot implicitly convert type 'Microsoft.Azure.Search.ISearchIndexClient' to 'Microsoft.Azure.Search.SearchIndexClient'. An explicit conversion exists (are you missing a cast?)

The next step is to fix this build error. See [Breaking changes in version 3](#ListOfChanges) for details on what causes the error and how to fix it.

You may see additional build warnings related to obsolete methods or properties. The warnings will include instructions on what to use instead of the deprecated feature. For example, if your application uses the `IndexingParameters.Base64EncodeKeys` property, you should get a warning that says `"This property is obsolete. Please create a field mapping using 'FieldMapping.Base64Encode' instead."`

Once you've fixed any build errors, you can make changes to your application to take advantage of new functionality if you wish. New features in the SDK are detailed in [What's new in version 3](#WhatsNew).

<a name="ListOfChanges"></a>

## Breaking changes in version 3
There a small number of breaking changes in version 3 that may require code changes in addition to rebuilding your application.

### Indexes.GetClient return type
The `Indexes.GetClient` method has a new return type. Previously, it returned `SearchIndexClient`, but this was changed to `ISearchIndexClient` in version 2.0-preview, and that change carries over to version 3. This is to support customers that wish to mock the `GetClient` method for unit tests by returning a mock implementation of `ISearchIndexClient`.

#### Example
If your code looks like this:

```csharp
SearchIndexClient indexClient = serviceClient.Indexes.GetClient("hotels");
```

You can change it to this to fix any build errors:

```csharp
ISearchIndexClient indexClient = serviceClient.Indexes.GetClient("hotels");
```

### AnalyzerName, DataType, and others are no longer implicitly convertible to strings
There are many types in the Azure Search .NET SDK that derive from `ExtensibleEnum`. Previously these types were all implicitly convertible to type `string`. However, a bug was discovered in the `Object.Equals` implementation for these classes, and fixing the bug required disabling this implicit conversion. Explicit conversion to `string` is still allowed.

#### Example
If your code looks like this:

```csharp
var customTokenizerName = TokenizerName.Create("my_tokenizer"); 
var customTokenFilterName = TokenFilterName.Create("my_tokenfilter"); 
var customCharFilterName = CharFilterName.Create("my_charfilter"); 
 
var index = new Index();
index.Analyzers = new Analyzer[] 
{ 
    new CustomAnalyzer( 
        "my_analyzer",  
        customTokenizerName,  
        new[] { customTokenFilterName },  
        new[] { customCharFilterName }), 
}; 
```

You can change it to this to fix any build errors:

```csharp
const string CustomTokenizerName = "my_tokenizer"; 
const string CustomTokenFilterName = "my_tokenfilter"; 
const string CustomCharFilterName = "my_charfilter"; 
 
var index = new Index();
index.Analyzers = new Analyzer[] 
{ 
    new CustomAnalyzer( 
        "my_analyzer",  
        CustomTokenizerName,  
        new TokenFilterName[] { CustomTokenFilterName },  
        new CharFilterName[] { CustomCharFilterName })
}; 
```

### Removed obsolete members

You may see build errors related to methods or properties that were marked as obsolete in version 2.0-preview and subsequently removed in version 3. If you encounter such errors, here is how to resolve them:

- If you were using this constructor: `ScoringParameter(string name, string value)`, use this one instead: `ScoringParameter(string name, IEnumerable<string> values)`
- If you were using the `ScoringParameter.Value` property, use the `ScoringParameter.Values` property or the `ToString` method instead.
- If you were using the `SearchRequestOptions.RequestId` property, use the `ClientRequestId` property instead.

### Removed preview features

If you are upgrading from version 2.0-preview to version 3, be aware that JSON and CSV parsing support for Blob Indexers has been removed since these features are still in preview. Specifically, the following methods of the `IndexingParametersExtensions` class have been removed:

- `ParseJson`
- `ParseJsonArrays`
- `ParseDelimitedTextFiles`

If your application has a hard dependency on these features, you will not be able to upgrade to version 3 of the Azure Search .NET SDK. You can continue to use version 2.0-preview. However, please keep in mind that **we do not recommend using preview SDKs in production applications**. Preview features are for evaluation only and may change.

## Conclusion
If you need more details on using the Azure Search .NET SDK, see the [.NET How-to](search-howto-dotnet-sdk.md).

We welcome your feedback on the SDK. If you encounter problems, feel free to ask us for help on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-search). If you find a bug, you can file an issue in the [Azure .NET SDK GitHub repository](https://github.com/Azure/azure-sdk-for-net/issues). Make sure to prefix your issue title with "[Azure Search]".

Thank you for using Azure Search!
