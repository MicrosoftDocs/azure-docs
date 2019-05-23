---
title: Upgrade to the Azure Search .NET SDK version 9 - Azure Search
description: Migrate code to the Azure Search .NET SDK version 9 from older versions. Learn what is new and which code changes are required.
author: brjohnstmsft
manager: jlembicz
services: search
ms.service: search
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 05/10/2019
ms.author: brjohnst
ms.custom: seodec2018
---
# Upgrade to the Azure Search .NET SDK version 9

If you're using version 7.0-preview or older of the [Azure Search .NET SDK](https://aka.ms/search-sdk), this article will help you upgrade your application to use version 9.

> [!NOTE]
> If you wish to use version 8.0-preview to evaluate features that are not generally available yet, you can also follow the instructions in this article to upgrade to 8.0-preview from prior versions.

For a more general walkthrough of the SDK including examples, see [How to use Azure Search from a .NET Application](search-howto-dotnet-sdk.md).

Version 9 of the Azure Search .NET SDK contains many changes from earlier versions. Some of these are breaking changes, but they should only require relatively minor changes to your code. See [Steps to upgrade](#UpgradeSteps) for instructions on how to change your code to use the new SDK version.

> [!NOTE]
> If you're using version 4.0-preview or older, you should upgrade to version 5 first, and then upgrade to version 9. See [Upgrading to the Azure Search .NET SDK version 5](search-dotnet-sdk-migration-version-5.md) for instructions.
>
> Your Azure Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version. When using the REST API, you must specify the API version in every request via the api-version parameter. When using the .NET SDK, the version of the SDK you're using determines the corresponding version of the REST API. If you are using an older SDK, you can continue to run that code with no changes even if the service is upgraded to support a newer API version.

<a name="WhatsNew"></a>

## What's new in version 9
Version 9 of the Azure Search .NET SDK targets the latest generally available version of the Azure Search REST API, specifically 2019-05-06. This makes it possible to use new features of Azure Search from a .NET application, including the following:

* [Cognitive search](cognitive-search-concept-intro.md) is an AI feature in Azure Search, used to extract text from images, blobs, and other unstructured data sources - enriching the content to make it more searchable in an Azure Search index.
* Support for [complex types](search-howto-complex-data-types.md) allows you to model almost any nested JSON structure in an Azure Search index.
* [Autocomplete](search-autocomplete-tutorial.md) provides an alternative to the **Suggest** API for implementing search-as-you-type behavior. Autocomplete "finishes" the word or phrase that a user is currently typing.
* [JsonLines parsing mode](search-howto-index-json-blobs.md), part of Azure Blob indexing, creates one search document per JSON entity that is separated by a newline.

### New preview features in version 8.0-preview
Version 8.0-preview of the Azure Search .NET SDK targets API version 2017-11-11-Preview. This version includes all the same features of version 9, plus:

* [Customer-managed encryption keys](search-security-manage-encryption-keys.md) for service-side encryption-at-rest is a new preview feature. In addition to the built-in encryption-at-rest managed by Microsoft, you can apply an additional layer of encryption where you are the sole owner of the keys.

<a name="UpgradeSteps"></a>

## Steps to upgrade
First, update your NuGet reference for `Microsoft.Azure.Search` using either the NuGet Package Manager Console or by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

Once NuGet has downloaded the new packages and their dependencies, rebuild your project. Depending on how your code is structured, it may rebuild successfully. If so, you're ready to go!

If your build fails, you will need to fix each build error. See [Breaking changes in version 9](#ListOfChanges) for details on how to resolve each potential build error.

You may see additional build warnings related to obsolete methods or properties. The warnings will include instructions on what to use instead of the deprecated feature. For example, if your application uses the `DataSourceType.DocumentDb` property, you should get a warning that says "This member is deprecated. Use CosmosDb instead".

Once you've fixed any build errors or warnings, you can make changes to your application to take advantage of new functionality if you wish. New features in the SDK are detailed in [What's new in version 9](#WhatsNew).

<a name="ListOfChanges"></a>

## Breaking changes in version 9

There are several breaking changes in version 9 that may require code changes in addition to rebuilding your application.

> [!NOTE]
> The list of changes below is not exhaustive. Some changes will likely not result in build errors, but are technically breaking since they break binary compatibility with assemblies that depend on earlier versions of the Azure Search .NET SDK assemblies. Such changes are not listed below. Please rebuild your application when upgrading to version 9 to avoid any binary compatibility issues.

### Immutable properties

The public properties of several model classes are now immutable. If you need to create custom instances of these classes for testing, you can use the new parameterized constructors:

  - `AutocompleteItem`
  - `DocumentSearchResult`
  - `DocumentSuggestResult`
  - `FacetResult`
  - `SearchResult`
  - `SuggestResult`

### Changes to Field

The `Field` class has changed now that it can also represent complex fields.

The following `bool` properties are now nullable:

  - `IsFilterable`
  - `IsFacetable`
  - `IsSearchable`
  - `IsSortable`
  - `IsRetrievable`
  - `IsKey`

This is because these properties must now be `null` in the case of complex fields. If you have code that reads these properties, it has to be prepared to handle `null`. Note that all other properties of `Field` have always been and continue to be nullable, and some of those will also be `null` in the case of complex fields -- specifically the following:

  - `Analyzer`
  - `SearchAnalyzer`
  - `IndexAnalyzer`
  - `SynonymMaps`

The parameterless constructor of `Field` has been made `internal`. From now on, every `Field` requires an explicit name and data type at the time of construction.

### Simplified batch and results types

In version 7.0-preview and earlier, the various classes that encapsulate groups of documents were structured into parallel class hierarchies:

  -  `DocumentSearchResult` and `DocumentSearchResult<T>` inherited from `DocumentSearchResultBase`
  -  `DocumentSuggestResult` and `DocumentSuggestResult<T>` inherited from `DocumentSuggestResultBase`
  -  `IndexAction` and `IndexAction<T>` inherited from `IndexActionBase`
  -  `IndexBatch` and `IndexBatch<T>` inherited from `IndexBatchBase`
  -  `SearchResult` and `SearchResult<T>` inherited from `SearchResultBase`
  -  `SuggestResult` and `SuggestResult<T>` inherited from `SuggestResultBase`

The derived types without a generic type parameter were meant to be used in "dynamically-typed" scenarios and assumed usage of the `Document` type.

Starting with version 8.0-preview, the base classes and non-generic derived classes have all been removed. For dynamically-typed scenarios, you can use `IndexBatch<Document>`, `DocumentSearchResult<Document>`, and so on.
 
### Removed ExtensibleEnum

The `ExtensibleEnum` base class has been removed. All classes that derived from it are now structs, such as `AnalyzerName`, `DataType`, and `DataSourceType` for example. Their `Create` methods have also been removed. You can just remove calls to `Create` since these types are implicitly convertible from strings. If that results in compiler errors, you can explicitly invoke the conversion operator via casting to disambiguate types. For example, you can change code like this:

```csharp
var index = new Index()
{
    Fields = new[]
    {
        new Field("id", DataType.String) { IsKey = true },
        new Field("message", AnalyzerName.Create("my_email_analyzer")) { IsSearchable = true }
    },
    ...
}
```

to this:

```csharp
var index = new Index()
{
    Fields = new[]
    {
        new Field("id", DataType.String) { IsKey = true },
        new Field("message", (AnalyzerName)"my_email_analyzer") { IsSearchable = true }
    },
    ...
}
```

Properties that held optional values of these types are now explicitly typed as nullable so they continue to be optional.

### Removed FacetResults and HitHighlights

The `FacetResults` and `HitHighlights` classes have been removed. Facet results are now typed as `IDictionary<string, IList<FacetResult>>` and hit highlights as `IDictionary<string, IList<string>>`. A quick way to resolve build errors introduced by this change is to add `using` aliases at the top of each file that uses the removed types. For example:

```csharp
using FacetResults = System.Collections.Generic.IDictionary<string, System.Collections.Generic.IList<Models.FacetResult>>;
using HitHighlights = System.Collections.Generic.IDictionary<string, System.Collections.Generic.IList<string>>;
```

### Change to SynonymMap 

The `SynonymMap` constructor no longer has an `enum` parameter for `SynonymMapFormat`. This enum only had one value, and was therefore redundant. If you see build errors as a result of this, simply remove references to the `SynonymMapFormat` parameter.

### Miscellaneous model class changes

The `AutocompleteMode` property of `AutocompleteParameters` is no longer nullable. If you have code that assigns this property to `null`, you can simply remove it and the property will automatically be initialized to the default value.

The order of the parameters to the `IndexAction` constructor has changed now that this constructor is auto-generated. Instead of using the constructor, we recommend using the factory methods `IndexAction.Upload`, `IndexAction.Merge`, and so on.

### Removed preview features

If you are upgrading from version 8.0-preview to version 9, be aware that encryption with customer-managed keys has been removed since this feature is still in preview. Specifically, the `EncryptionKey` properties of `Index` and `SynonymMap` have been removed.

If your application has a hard dependency on this feature, you will not be able to upgrade to version 9 of the Azure Search .NET SDK. You can continue to use version 8.0-preview. However, please keep in mind that **we do not recommend using preview SDKs in production applications**. Preview features are for evaluation only and may change.

> [!NOTE]
> If you created encrypted indexes or synonym maps using version 8.0-preview of the SDK, you will still be able use them and modify their definitions using version 9 of the SDK without adversely affecting their encryption status. Version 9 of the SDK will not send the `encryptionKey` property to the REST API, and as a result the REST API will not change the encryption status of the resource. 

### Behavioral change in data retrieval

If you're using the "dynamically typed" `Search`, `Suggest`, or `Get` APIs that return instances of type `Document`, be aware that they now deserialize empty JSON arrays to `object[]` instead of `string[]`.

## Conclusion
If you need more details on using the Azure Search .NET SDK, see the [.NET How-to](search-howto-dotnet-sdk.md).

We welcome your feedback on the SDK. If you encounter problems, feel free to ask us for help on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-search). If you find a bug, you can file an issue in the [Azure .NET SDK GitHub repository](https://github.com/Azure/azure-sdk-for-net/issues). Make sure to prefix your issue title with "[Azure Search]".

Thank you for using Azure Search!
