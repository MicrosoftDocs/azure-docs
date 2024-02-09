---
title: "Quickstart: Create a demo app in Azure portal"
titleSuffix: Azure AI Search
description: Run the Create demo app \wizard to generate HTML pages and script for an operational web app. The page includes a search bar, results area, sidebar, and typeahead support.
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 10/13/2022
ms.custom:
  - mode-ui
  - ignite-2023
---

# Quickstart: Create a demo app in the Azure portal

In this Azure AI Search quickstart, you'll use the Azure portal's **Create demo app** wizard to generate a downloadable, "localhost"-style web app that runs in a browser. Depending on its configuration, the generated app is operational on first use, with a live read-only connection to an index on your search service. A default app can include a search bar, results area, sidebar filters, and typeahead support.

A demo app can help you visualize how an index will function in a client app, but it isn't intended for production scenarios. Production apps should include security, error handling, and hosting logic that the demo app doesn't provide. 

## Prerequisites

Before you begin, have the following prerequisites in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

+ An Azure AI Search service. [Create a service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

+ [Microsoft Edge (latest version)](https://www.microsoft.com/edge) or Google Chrome.

+ A [search index](search-what-is-an-index.md) to use as the basis of your generated application. 

  This quickstart uses the built-in Real Estate sample data and index because it has thumbnail images (the wizard supports adding images to the results page). To create the index used in this exercise, run the **Import data** wizard, choosing the *realestate-us-sample* data source.

  :::image type="content" source="media/search-create-app-portal/import-data-realestate.png" alt-text="data source page for sample data" border="false":::

When the index is ready to use, move on to the next step.

## Start the wizard

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

1. [Find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) and on the Overview page, from the links on the middle of the page, select **Indexes**. 

1. Choose *realestate-us-sample-index* from the list of existing indexes.

1. On the index page, at the top, select **Create demo app (preview)** to start the wizard.

1. On the first wizard page, select **Enable Cross Origin Resource Sharing (CORS)** to add CORS support to your index definition. This step is optional, but your local web app won't connect to the remote index without it.

## Configure search results

The wizard provides a basic layout for rendered search results that includes space for a thumbnail image, a title, and description. Backing each of these elements is a field in your index that provides the data. 

1. In Thumbnail, choose the *thumbnail* field in the *realestate-us-sample* index. This sample happens to include image thumbnails in the form of URL-addressed images stored in a field called *thumbnail*. If your index doesn't have images, leave this field blank.

1. In Title, choose a field that conveys the uniqueness of each document. In this sample, the listing ID is a reasonable selection.

1. In Description, choose a field that provides details that might help someone decide whether to click through to that particular document.

   :::image type="content" source="media/search-create-app-portal/configure-results.png" alt-text="configure results for sample data" border="false":::

## Add a sidebar

The search service supports faceted navigation, which is often rendered as a sidebar. Facets are based on filterable and facetable fields, as expressed in the index schema.

In Azure AI Search, faceted navigation is a cumulative filtering experience. Within a category, selecting multiple filters expands the results (for example, selecting Seattle and Bellevue within City). Across categories, selecting multiple filters narrows results.

> [!TIP]
> You can view the full index schema in the portal. Look for the **Index definition (JSON)** link in each index's overview page. Fields that qualify for faceted navigation have "filterable: true" and "facetable: true" attributes.

1. In the wizard, select the **Sidebar** tab at the top of the page. You'll see a list of all fields that are attributed as filterable and facetable in the index.

1. Accept the current selection of faceted fields and continue to the next page.

## Add typeahead

Typeahead functionality is available in the form of autocomplete and query suggestions. The wizard supports query suggestions. Based on keystroke inputs provided by the user, the search service returns a list of "completed" query strings that can be selected as the input.

Suggestions are enabled on specific field definitions. The wizard gives you options for configuring how much information is included in a suggestion. 

The following screenshot shows options in the wizard, juxtaposed with a rendered page in the app. You can see how field selections are used, and how "Show Field Name" is used to include or exclude labeling within the suggestion.

:::image type="content" source="media/search-create-app-portal/suggestions.png" alt-text="Query suggestion configuration":::

## Add suggestions

Suggestions refer to automated query prompts that are attached to the search box. Azure AI Search supports two: *autocompletion* of a partially entered search term, and *suggestions* for a dropdown list of potential matching documents based.

The wizard supports suggestions, and the fields that can provide suggested results are derived from a [`Suggesters`](index-add-suggesters.md) construct in the index:

```JSON
  "suggesters": [
    {
      "name": "sg",
      "searchMode": "analyzingInfixMatching",
      "sourceFields": [
        "number",
        "street",
        "city",
        "region",
        "postCode",
        "tags"
      ]
```

1. In the wizard, select the **Suggestions** tab at the top of the page. You'll see a list of all fields that are designated in the index schema as suggestion providers.

1. Accept the current selection and continue to the next page.

## Create, download and execute

1. Select **Create demo app** at the bottom of the page to generate the HTML file.

1. When prompted, select **Download your app** to download the file.

1. Open the file and click the Search button. This action executes a query, which can be an empty query (`*`) that returns an arbitrary result set. The page should look similar to the following screenshot. Enter a term and use filters to narrow results. 

The underlying index is composed of fictitious, generated data that has been duplicated across documents, and descriptions sometimes don't match the image. You can expect a more cohesive experience when you create an app based on your own indexes.

:::image type="content" source="media/search-create-app-portal/run-app.png" alt-text="Run the app":::

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you're using a free service, remember that it's limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

The demo app is useful for prototyping because you can simulate an end-user experience without having to write JavaScript or front-end code, but as you get closer to proof-of-concept in your own project, review one of the end-to-end code samples that is closer facsimile of a real-word app:

> [!div class="nextstepaction"]
> [Add search to web apps](tutorial-csharp-overview.md)
