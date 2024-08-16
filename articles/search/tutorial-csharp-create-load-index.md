---
title: "Load an index (.NET tutorial)"
titleSuffix: Azure AI Search
description: Create index and import CSV data into Search index with .NET.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 08/16/2024
ms.custom:
  - devx-track-csharp
  - devx-track-azurecli
  - devx-track-dotnet
  - devx-track-azurepowershell
  - ignite-2023
ms.devlang: csharp
---

# Step 2 - Create and load the search index

Continue to build your search-enabled website by following these steps:

- Create a new index
- Load data

Before you start, make sure you have room on your search service for a new index. The free tier limit is three indexes. The Basic tier limit is 15.

## Prepare the bulk import script for Search

The script uses [Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/) in the Azure SDK for .NET:

- [NuGet package Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/)
- [Reference Documentation](/dotnet/api/overview/azure/search)

1. In Visual Studio Code, open the `Program.cs` file in the subdirectory, `azure-search-static-web-app/bulk-insert`, replace the following variables with your own values to authenticate with the Azure Search SDK.

   - YOUR-SEARCH-SERVICE-NAME (not the full URL)
   - YOUR-SEARCH-ADMIN-API-KEY (see [Find API keys](search-security-api-keys.md#find-existing-keys))

    :::code language="csharp" source="~/azure-search-static-web-app/bulk-insert/Program.cs" :::

1. Open an integrated terminal in Visual Studio Code for the project directory's subdirectory, `azure-search-static-web-app/bulk-insert`, then run the following command to install the dependencies. 

    ```bash
    dotnet restore
    ```

## Run the bulk import script for Search

1. Continue using the integrated terminal in Visual Studio for the project directory's subdirectory (`azure-search-static-web-app/bulk-insert`) to run the following bash command to run the `Program.cs` script:

    ```bash
    dotnet run
    ```

1. As the code runs, the console displays progress. You should see the following output.

   ```bash
    Creating (or updating) search index
    Status: 201, Value: Azure.Search.Documents.Indexes.Models.SearchIndex
    Download data file
    Reading and parsing raw CSV data
    Uploading bulk book data
    Finished bulk inserting book data
    ```

## Review the new search index

Once the upload completes, the search index is ready to use. Review your new index in Azure portal.

1. In Azure portal, [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).  

1. On the left, select **Search Management > Indexes**, and then select the good-books index.

    :::image type="content" source="media/tutorial-csharp-create-load-index/azure-portal-indexes-page.png" lightbox="media/tutorial-csharp-create-load-index/azure-portal-indexes-page.png" alt-text="Expandable screenshot of Azure portal showing the index." border="true":::

1. By default, the index opens in the **Search Explorer** tab. Select **Search** to return documents from the index.

    :::image type="content" source="media/tutorial-csharp-create-load-index/azure-portal-search-explorer.png" lightbox="media/tutorial-csharp-create-load-index/azure-portal-search-explorer.png" alt-text="Expandable screenshot of Azure portal showing search results" border="true":::

## Rollback bulk import file changes

Use the following git command in the Visual Studio Code integrated terminal at the `bulk-insert` directory to roll back the changes to the `Program.cs` file. They aren't needed to continue the tutorial and you shouldn't save or push your API keys or search service name to your repo. 

```git
git checkout .
```

## Next steps

[Deploy your Static Web App](tutorial-csharp-deploy-static-web-app.md)
