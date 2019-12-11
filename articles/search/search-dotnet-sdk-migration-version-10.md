---
title: Upgrade to Azure Cognitive Search .NET SDK version 10
titleSuffix: Azure Cognitive Search
description: Migrate code to the Azure Cognitive Search .NET SDK version 10 from older versions. Learn what is new and which code changes are required.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 11/04/2019
---

# Upgrade to Azure Cognitive Search .NET SDK version 10

If you're using version 9.0 or older of the [Azure Search .NET SDK](https://aka.ms/search-sdk), this article will help you upgrade your application to use version 10.

Azure Search is renamed to Azure Cognitive Search in version 10, but namespaces and package names are unchanged. Previous versions of the SDK (9.0 and earlier) continue to use the former name. For more information about using the SDK, including examples, see [How to use Azure Cognitive Search from a .NET Application](search-howto-dotnet-sdk.md).

Version 10 adds several features and bug fixes, bringing it to the same functional level as the most recent release of the REST API version `2019-05-06`. In cases where a change breaks existing code, we'll walk you through the [steps required to resolve the issue](#UpgradeSteps).

> [!NOTE]
> If you're using version 8.0-preview or older, you should upgrade to version 9 first, and then upgrade to version 10. See [Upgrading to the Azure Search .NET SDK version 9](search-dotnet-sdk-migration-version-9.md) for instructions.
>
> Your search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version. When using the REST API, you must specify the API version in every request via the api-version parameter. When using the .NET SDK, the version of the SDK you're using determines the corresponding version of the REST API. If you are using an older SDK, you can continue to run that code with no changes even if the service is upgraded to support a newer API version.

<a name="WhatsNew"></a>

## What's new in version 10
Version 10 of the Azure Cognitive Search .NET SDK targets the latest generally available version of the REST API (`2019-05-06`) with these updates:

* Introduction of two new skills - [Conditional skill](cognitive-search-skill-conditional.md) and [Text Translation skill](cognitive-search-skill-text-translation.md).
* [Shaper skill](cognitive-search-skill-shaper.md) inputs have been restructured to accommodate consolidation from nested contexts. For more information, see this [example JSON definition](https://docs.microsoft.com/azure/search/cognitive-search-skill-shaper#scenario-3-input-consolidation-from-nested-contexts).
* Addition of two new [field mapping functions](search-indexer-field-mappings.md):
    - [urlEncode](https://docs.microsoft.com/azure/search/search-indexer-field-mappings#urlencode-function)
    - [urlDecode](https://docs.microsoft.com/azure/search/search-indexer-field-mappings#urldecode-function)
* On certain occasions, errors and warnings that show up in [indexer execution status](https://docs.microsoft.com/rest/api/searchservice/get-indexer-status) can have additional details that help in debugging. `IndexerExecutionResult` has been updated to reflect this behavior.
* Individual skills defined within a [skillset](cognitive-search-defining-skillset.md) can optionally be identified by specifying a `name` property.
* `ServiceLimits` shows limits for [complex types](https://docs.microsoft.com/azure/search/search-howto-complex-data-types) and `IndexerExecutionInfo` shows pertinent indexer limits/quotas.

<a name="UpgradeSteps"></a>

## Steps to upgrade

1. Update your NuGet reference for `Microsoft.Azure.Search` using either the NuGet Package Manager Console or by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

2. Once NuGet has downloaded the new packages and their dependencies, rebuild your project. 

3. If your build fails, you will need to fix each build error. See [Breaking changes in version 10](#ListOfChanges) for details on how to resolve each potential build error.

4. Once you've fixed any build errors or warnings, you can make changes to your application to take advantage of new functionality if you wish. New features in the SDK are detailed in [What's new in version 10](#WhatsNew).

<a name="ListOfChanges"></a>

## Breaking changes in version 10

There are several breaking changes in version 10 that may require code changes in addition to rebuilding your application.

> [!NOTE]
> The list of changes below is not exhaustive. Some changes will likely not result in build errors, but are technically breaking since they break binary compatibility with assemblies that depend on earlier versions of the Azure Cognitive Search .NET SDK assemblies. Significant changes that fall under this category are also listed along with recommendations. Please rebuild your application when upgrading to version 10 to avoid any binary compatibility issues.

### Custom Web API skill definition

The definition of the [Custom Web API skill](cognitive-search-custom-skill-web-api.md) was incorrectly specified in version 9 and older. 

The model for `WebApiSkill` specified `HttpHeaders` as an object property that _contains_ a dictionary. Creating a skillset with a `WebApiSkill` constructed in this manner would result in an exception because the REST API would consider the request badly formed. This issue has been corrected, by making `HttpHeaders` **a top-level dictionary property** on the `WebApiSkill` model itself - which is considered a valid request from the REST API.

For example, if you previously attempted to instantiate a `WebApiSkill` as follows:

```csharp

var webApiSkill = new WebApiSkill(
            inputs, 
            outputs,
            uri: "https://contoso.example.org")
{
    HttpHeaders = new WebApiHttpHeaders()
    {
        Headers = new Dictionary<string, string>()
        {
            ["header"] = "value"
        }
    }
};

```

change it to the following, to avoid the validation error from the REST API:

```csharp

var webApiSkill = new WebApiSkill(
            inputs, 
            outputs,
            uri: "https://contoso.example.org")
{
    HttpHeaders = new Dictionary<string, string>()
    {
        ["header"] = "value"
    }
};

```

## Shaper skill allows nested context consolidation

Shaper skill can now allow input consolidation from nested contexts. To enable this change, we modified `InputFieldMappingEntry` so that it can be instantiated by specifying just a `Source` property, or both the `SourceContext` and `Inputs` properties.

You will most likely not need to make any code changes; however note that only one of these two combinations is allowed. This means:

- Creating an `InputFieldMappingEntry` where only `Source` is initialized is valid.
- Creating an `InputFieldMappingEntry` where only `SourceContext` and `Inputs` are initialized is valid.
- All other combinations involving those three properties are invalid.

If you decide to start making use of this new capability, make sure all your clients are updated to use version 10 first, before rolling out that change. Otherwise, there is a possibility that an update by a client (using an older version of the SDK) to the Shaper skill may result in validation errors.

> [!NOTE]
> Even though the underlying `InputFieldMappingEntry` model has been modified to allow consolidation from nested contexts, it's use is only valid within the definition of a Shaper skill. Using this capability in other skills, while valid at compile time, will result in a validation error at runtime.

## Skills can be identified by a name

Each skill within a skillset now has a new property `Name`, which can be initialized in your code to help identify the skill. This is optional - when unspecified (which is the default, if no explicit code change was made), it is assigned a default name using the 1-based index of the skill in the skillset, prefixed with the '#' character. For example, in the following skillset definition (most initializations skipped for brevity):

```csharp
var skillset = new Skillset()
{
    Skills = new List<Skill>()
    {
        new SentimentSkill(),
        new WebApiSkill(),
        new ShaperSkill(),
        ...
    }
}
```

`SentimentSkill` is assigned a name `#1`, `WebApiSkill` is assigned `#2`, `ShaperSkill` is assigned `#3` and so on.

If you choose to identify skills by a custom name, make sure to update all instances of your clients to version 10 of the SDK first. Otherwise, there is a possibility that a client using an older version of the SDK could `null` out the `Name` property of a skill, causing the client to fall back on the default naming scheme.

## Details about errors and warnings

`ItemError` and `ItemWarning` models that encapsulate details of errors and warnings (respectively) that occur during an indexer execution have been modified to include three new properties with the objective to aid in debugging the indexer. These properties are:

- `Name`: The name of the source at which the error originated. For example, it could refer to a particular skill in the attached skillset.
- `Details`: Additional verbose details about the error or warning.
- `DocumentationLink`: A link to a troubleshooting guide for the specific error or warning.

> [!NOTE]
> We have started to structure our errors and warnings to include these useful details whenever possible. We are working to make sure that for all errors and warnings these details are present, but it is a work in progress and these additional details may not always be populated.

## Next steps

- Changes to the Shaper skill have the most potential impact on new or existing code. As a next step, be sure to revisit this example illustrating the input structure: [Shaper skill JSON definition example](cognitive-search-skill-shaper.md)
- Go through the [AI enrichment overview](cognitive-search-concept-intro.md).
- We welcome your feedback on the SDK. If you encounter problems, feel free to ask us for help on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-search). If you find a bug, you can file an issue in the [Azure .NET SDK GitHub repository](https://github.com/Azure/azure-sdk-for-net/issues). Make sure to prefix your issue title with "[Azure Cognitive Search]".

