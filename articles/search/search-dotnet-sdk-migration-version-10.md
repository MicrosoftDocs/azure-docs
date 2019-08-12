---
title: Upgrade to the Azure Search .NET SDK version 10 - Azure Search
description: Migrate code to the Azure Search .NET SDK version 10 from older versions. Learn what is new and which code changes are required.
author: arv100kri
manager: briansmi
services: search
ms.service: search
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 08/12/2019
ms.author: arjagann
ms.custom: seodec2018
---
# Upgrade to the Azure Search .NET SDK version 10

If you're using version 9.0 or older of the [Azure Search .NET SDK](https://aka.ms/search-sdk), this article will help you upgrade your application to use version 10.

For a more general walkthrough of the SDK including examples, see [How to use Azure Search from a .NET Application](search-howto-dotnet-sdk.md).

Version 10 of the Azure Search .NET SDK contains a few changes from version 9, mostly to fix bugs and get features on par with API version `2019-05-06`. Some of these are breaking changes, but they should only require relatively minor changes to your code. See [Steps to upgrade](#UpgradeSteps) for instructions on how to change your code to use the new SDK version.

> [!NOTE]
> If you're using version 8.0-preview or older, you should upgrade to version 9 first, and then upgrade to version 10. See [Upgrading to the Azure Search .NET SDK version 9](search-dotnet-sdk-migration-version-9.md) for instructions.
>
> Your Azure Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version. When using the REST API, you must specify the API version in every request via the api-version parameter. When using the .NET SDK, the version of the SDK you're using determines the corresponding version of the REST API. If you are using an older SDK, you can continue to run that code with no changes even if the service is upgraded to support a newer API version.

<a name="WhatsNew"></a>

## What's new in version 10
Version 10 of the Azure Search .NET SDK (like version 9) targets the latest generally available version of the Azure Search REST API, specifically 2019-05-06. It includes a few minor new feature additions and bug fixes that are recently introduces, namely:

* Introduction of two new skills - [Conditional Skill](cognitive-search-skill-conditional.md) and [Translate Skill](cognitive-search-skill-text-translation.md).
* Allowing [Shaper skill](cognitive-search-skill-shaper.md) to have inputs specified that allow for consolidation from nested contexts. For more information, see this [example json definition](https://docs.microsoft.com/azure/search/cognitive-search-skill-shaper#scenario-3-input-consolidation-from-nested-contexts).
* Addition of 2 new [field mapping functions](search-indexer-field-mappings.md):
    - [urlEncode](https://docs.microsoft.com/azure/search/search-indexer-field-mappings#urlencode-function)
    - [urlDecode](https://docs.microsoft.com/azure/search/search-indexer-field-mappings#urldecode-function)
* On certain occasions, errors and warnings that show up in [indexer execution status](https://docs.microsoft.com/rest/api/searchservice/get-indexer-status) can have additional details that help in debugging. `IndexerExecutionResult` has been updated to reflect this behavior.
* Individual skills defined within a [skillset](cognitive-search-defining-skillset.md) can optionally be identified by specifying a `name` property.

<a name="UpgradeSteps"></a>

## Steps to upgrade
First, update your NuGet reference for `Microsoft.Azure.Search` using either the NuGet Package Manager Console or by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

Once NuGet has downloaded the new packages and their dependencies, rebuild your project. 

If your build fails, you will need to fix each build error. See [Breaking changes in version 10](#ListOfChanges) for details on how to resolve each potential build error.

Once you've fixed any build errors or warnings, you can make changes to your application to take advantage of new functionality if you wish. New features in the SDK are detailed in [What's new in version 10](#WhatsNew).

<a name="ListOfChanges"></a>

## Breaking changes in version 10

There are several breaking changes in version 10 that may require code changes in addition to rebuilding your application.

> [!NOTE]
> The list of changes below is not exhaustive. Some changes will likely not result in build errors, but are technically breaking since they break binary compatibility with assemblies that depend on earlier versions of the Azure Search .NET SDK assemblies. Significant changes that fall under this category are also listed along with recommendations. Please rebuild your application when upgrading to version 10 to avoid any binary compatibility issues.

### Custom Web API Skill Definition

The definition of the [Custom Web API skill](cognitive-search-custom-skill-web-api.md) was incorrectly specified in version 9 and older. 

The model for `WebApiSkill` specified `HttpHeaders` as an object property that _contains_ a dictionary. Creating a skillset with a `WebApiSkill` constructed in this manner would result in an exception because the REST API would consider the request badly formed. This has been corrected, by making `HttpHeaders` **a top-level dictionary property** on `WebApiSkill` model itself - which is considered a valid request from the REST API.

For example, if you previously attempted to instantiate a `WebApiSkill` as follows:

```csharp

var webApiSkill = new WebApiSkill(
            inputs, 
            outputs,
            uri: "https://contoso.example.org",
            context: RootPathString)
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
            uri: "https://contoso.example.org",
            context: RootPathString)
{
    HttpHeaders = new Dictionary<string, string>()
    {
        ["header"] = "value"
    }
};

```

## Shaper skill allows nested context consolidation

Shaper skill can now allow input consolidation from nested contexts. To enable this to happen, we modified `InputFieldMappingEntry` so that it can be instantiated by specifying just a `Source` property, or both the `SourceContext` and `Inputs` properties.

You will most likely not need to make any code changes - however note that only either of those 2 combinations are allowed. This means:

- Creating an `InputFieldMappingEntry` where only `Source` is initialized is valid.
- Creating an `InputFieldMappingEntry` where exactly both `SourceContext` and `Inputs` are initialized is valid.
- All other combinations involving those three properties are invalid.

If you decide to start making use of this new capability, make sure all your clients are updated to use version 10 first, before rolling out that change. Otherwise, there is a possibility that an update by a client (using an older version of the SDK) to the shaper skill may result in validation errors.

> [!NOTE]
> Even though the underlying `InputFieldMappingEntry` model has been modified to allow consolidation from nested contexts, it's use is only valid withing the definition of a shaper skill, at the moment. Using this capability in other skills, while valid at compile time, will result in a validation error.

## Skills can be identified by a name

Each skill within a skillset now has a new property `Name`, which can be initialized in your code to help identify the skill, in case you'd like to pinpoint errors/warnings during the indexer execution. This is optional - when unspecified (which is the default, if no explicit code change was made), it is assigned a default name using the 1-based index of the skill in the skillset. For example, in the following skillset definition (most initializations skipped for brevity):

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

If you choose to identify skills by a custom name, make sure to update all instances of your clients to version 10 of the SDK. Otherwise, there is a possibility that a client using an older version of the SDK could possibly `null` out the `Name` property of a skill, thereby resulting it to be identified by the default scheme.

> [!NOTE]
>This does not cause any material change to the execution of the pipeline *at the moment*, but in future versions skillset execution *could potentially* utilize skill names to avoid repeating work (when possible).


## Additional details for errors and warnings as part of indexer execution status

`ItemError` and `ItemWarning` models that encapsulate details of errors and warnings (respectively) that occur during an indexer execution have been modified to include 3 new properties, with the objective to aid in debugging the indexer. These properties are:

- `Name`: The name of the source at which the error originated. For example, this could refer to a particular skill in the attached skillset.
- `Details`: Additional verbose details about the error or warning.
- `DocumentationLink`: A link to a troubleshooting guide for the specific error or warning.

> [!NOTE]
> We have started to structure our errors and warnings to include these useful details whenever possible. We are working to make sure that for all errors and warnings these details are present, but it is a work in progress and these additional details may not always be populated.

## Conclusion
If you need more details on using the Azure Search .NET SDK, see the [.NET How-to](search-howto-dotnet-sdk.md).

We welcome your feedback on the SDK. If you encounter problems, feel free to ask us for help on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-search). If you find a bug, you can file an issue in the [Azure .NET SDK GitHub repository](https://github.com/Azure/azure-sdk-for-net/issues). Make sure to prefix your issue title with "[Azure Search]".

Thank you for using Azure Search!
