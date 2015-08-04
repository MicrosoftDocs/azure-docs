<properties 
	pageTitle="Transition from preview api-version=2014* to api-version=2015*" 
	description="Learn about breaking changes and how to migrate code written against 2014-07-31-preview or 2014-10-20-preview to Azure Search, api-version=2015-02-28." 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="07/08/2015" 
	ms.author="heidist"/>

#Transition from preview api-version=2014* to api-version=2015*#

The following guidance is for customers who built custom applications on the preview versions of Azure Search and are now migrating to the generally available release, 2015-02-28.

As a preview customer, you might have used either one of these older preview versions:

- [2014-07-31-Preview](search-api-2014-07-31-preview.md)
- [2014-10-20-Preview](search-api-2014-10-20-preview.md)

Now that Azure Search is generally available, we encourage transitioning to newer releases: 2015-02-28 is the official API version of the generally available release of Azure Search. This version is documented on [MSDN](https://msdn.microsoft.com/library/azure/dn798933.aspx ).

We’re also rolling out the next preview version, [2015-02-28-Preview](search-api-2015-02-28-preview.md), introducing features that are still in development. You can provide feedback on the preview API through either the [Azure Search forums](https://social.msdn.microsoft.com/forums/azure/home?forum=azuresearch ) or our [feedback page](http://feedback.azure.com/forums/263029-azure-search ).

###Checklist for migration###

- Review breaking changes to determine whether your solution is affected.
- Bump the API version to `2015-02-28` for the locked version. This version is under SLA. If you run into issues, you can resolve them more quickly.
- Build, Deploy, Test. You should have 100% parity in terms of search behaviors, with the exception of breaking changes.
- Roll out to production.
- Evaluate new features for future feature adoption. Bump again to 2015-02-28-Preview if you want to test drive the Microsoft natural language processors or `morelikethis`.

##Breaking changes in api-version=2015*##

The initial release of the API included an auto-complete or type-ahead suggestions feature. Although useful, it was limited just prefix matching, searching on the first characters in the search term, with no support for matching elsewhere in the field. The implementation was a Boolean property called `suggestions` that you would set to `true` if you wanted to enable prefix matching on a particular field.

This original implementation is now deprecated in favor of a new `Suggesters` construct defined in the [index](https://msdn.microsoft.com/library/azure/dn798941.aspx) feature that provides infix and fuzzy matching. As the names imply, infix and fuzzy matching provide a far broader range of matching capability. Infix matching encompasses prefix, in that it still matches on the beginning characters, but extends matching to include the rest of the string. 

We chose to discontinue the previous implementation (the Boolean property), meaning it is wholly unavailable in either of the 2015 versions with no backward compatibility, to avoid its inadvertent adoption by customers building newer solutions. If you use either `2015-02-28` or `2015-02-28-Preview` you will need to use the new `Suggesters` construct to enable type-ahead queries.

##Port existing code##

The suggestion property is the only breaking change. If you didn’t use this property you can bump the `api-version` from either `2014-07-31-Preview` or `2014-10-20-Preview` with `2015-02-28`, and then rebuild and redeploy. The application will work as before. 

Custom applications that implemented suggestions should do the following:

1. Update all NuGet packages.
1. Bump the api-version to `2015-02-28`. If you are using the code sample below, the api-version is in the **AzureSearchHelper** class.
1. Delete the `Suggestions={true | false}` attribute from the JSON schema that defines your index.
1. Add a construct at the bottom of the index for `Suggesters` (as shown in the [after](#after) section).
1. Verify you can publish to your service (you might need to rename the index to avoid naming conflicts).
1. Rebuild the solution and deploy to a test environment.
1. Run all test cases to ensure the solution behaves as expected.
1. Roll out to production.

The code example from the [Adventure Works sample on codeplex](https://azuresearchadventureworksdemo.codeplex.com/) has the original `Suggestions` implementation. You might want to use this sample to practice code migration on sample code. 

In the following section, we’ll show a [before](#before) and [after](#after) implementation of suggestions. You can replace the **CreateCatalogIndex()** method with the version in the [after](#after) section, then build and deploy the solution to try the new functionality.

<a name="before"></a>
###Before###

As you can see, `Suggestions` are a Boolean property set on each field. Delete all of the `Suggestions` attributes.

        private static void CreateCatalogIndex()
        {
            var definition = new 
            {
                Name = "catalog",
                Fields = new[] 
                { 
                    new { Name = "productID",        Type = "Edm.String",         Key = true,  Searchable = false, Filterable = false, Sortable = false, Facetable = false, Retrievable = true,  Suggestions = false },
                    new { Name = "name",             Type = "Edm.String",         Key = false, Searchable = true,  Filterable = false, Sortable = true,  Facetable = false, Retrievable = true,  Suggestions = true  },
                    new { Name = "productNumber",    Type = "Edm.String",         Key = false, Searchable = true,  Filterable = false, Sortable = false, Facetable = false, Retrievable = true,  Suggestions = true  },
                    new { Name = "color",            Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = true,  Facetable = true,  Retrievable = true,  Suggestions = false },
                    new { Name = "standardCost",     Type = "Edm.Double",         Key = false, Searchable = false, Filterable = false, Sortable = false, Facetable = false, Retrievable = true,  Suggestions = false },
                    new { Name = "listPrice",        Type = "Edm.Double",         Key = false, Searchable = false, Filterable = true,  Sortable = true,  Facetable = true,  Retrievable = true,  Suggestions = false },
                    new { Name = "size",             Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = true,  Facetable = true,  Retrievable = true,  Suggestions = false },
                    new { Name = "weight",           Type = "Edm.Double",         Key = false, Searchable = false, Filterable = true,  Sortable = false, Facetable = true,  Retrievable = true,  Suggestions = false },
                    new { Name = "sellStartDate",    Type = "Edm.DateTimeOffset", Key = false, Searchable = false, Filterable = true,  Sortable = false, Facetable = false, Retrievable = false, Suggestions = false },
                    new { Name = "sellEndDate",      Type = "Edm.DateTimeOffset", Key = false, Searchable = false, Filterable = true,  Sortable = false, Facetable = false, Retrievable = false, Suggestions = false },
                    new { Name = "discontinuedDate", Type = "Edm.DateTimeOffset", Key = false, Searchable = false, Filterable = true,  Sortable = false, Facetable = false, Retrievable = true,  Suggestions = false },
                    new { Name = "categoryName",     Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = false, Facetable = true,  Retrievable = true,  Suggestions = true  },
                    new { Name = "modelName",        Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = false, Facetable = true,  Retrievable = true,  Suggestions = true  },
                    new { Name = "description",      Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = false, Facetable = false, Retrievable = true,  Suggestions = false }
                }
            };

<a name="after"></a>
###After###

A migrated schema definition omits the `Suggestions` property and adds a `Suggesters` construct at the bottom.

        private static void CreateCatalogIndex()
        {
            var definition = new 
            {
                Name = "catalog",
                Fields = new[] 
                { 
                    new { Name = "productID",        Type = "Edm.String",         Key = true,  Searchable = false, Filterable = false, Sortable = false, Facetable = false, Retrievable = true },
                    new { Name = "name",             Type = "Edm.String",         Key = false, Searchable = true,  Filterable = false, Sortable = true,  Facetable = false, Retrievable = true },
                    new { Name = "productNumber",    Type = "Edm.String",         Key = false, Searchable = true,  Filterable = false, Sortable = false, Facetable = false, Retrievable = true },
                    new { Name = "color",            Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = true,  Facetable = true,  Retrievable = true },
                    new { Name = "standardCost",     Type = "Edm.Double",         Key = false, Searchable = false, Filterable = false, Sortable = false, Facetable = false, Retrievable = true },
                    new { Name = "listPrice",        Type = "Edm.Double",         Key = false, Searchable = false, Filterable = true,  Sortable = true,  Facetable = true,  Retrievable = true },
                    new { Name = "size",             Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = true,  Facetable = true,  Retrievable = true },
                    new { Name = "weight",           Type = "Edm.Double",         Key = false, Searchable = false, Filterable = true,  Sortable = false, Facetable = true,  Retrievable = true },
                    new { Name = "sellStartDate",    Type = "Edm.DateTimeOffset", Key = false, Searchable = false, Filterable = true,  Sortable = false, Facetable = false, Retrievable = false },
                    new { Name = "sellEndDate",      Type = "Edm.DateTimeOffset", Key = false, Searchable = false, Filterable = true,  Sortable = false, Facetable = false, Retrievable = false },
                    new { Name = "discontinuedDate", Type = "Edm.DateTimeOffset", Key = false, Searchable = false, Filterable = true,  Sortable = false, Facetable = false, Retrievable = true },
                    new { Name = "categoryName",     Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = false, Facetable = true,  Retrievable = true },
                    new { Name = "modelName",        Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = false, Facetable = true,  Retrievable = true },
                    new { Name = "description",      Type = "Edm.String",         Key = false, Searchable = true,  Filterable = true,  Sortable = false, Facetable = false, Retrievable = true }
                },
                suggesters = new[]
                {
                new {
                    name = "sg",
                    searchMode = "analyzingInfixMatching",
                    sourceFields = new []{"name", "productNumber", "categoryName", "modelName", "description"}
                    }
                 }
            };

##Evaluate new features and approaches##

After you’ve ported your solution and verified it runs as expected, you can use these links to read about new features.

- [Azure Search is generally available (blog post)](http://go.microsoft.com/fwlink/p/?LinkId=528211 )
- [What’s new in the latest update to Azure Search](search-latest-updates.md)
- [What is Azure Search?](search-what-is-azure-search.md)

##Get help##

API version `2015-02-28` is under SLA. Use the support options and links on [this page](../support/options/) to file a support ticket.

 