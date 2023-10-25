---
title: "Load an index (.NET tutorial)" 
titleSuffix: Azure Cognitive Search
description: Create index and import CSV data into Search index with .NET.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom: devx-track-csharp, devx-track-azurecli, devx-track-dotnet, devx-track-azurepowershell
ms.devlang: csharp
---

# 2 - Create and load Search Index with .NET

Continue to build your search-enabled website by following these steps:
* Create a search resource
* Create a new index
* Import data with .NET using the sample script and Azure SDK [Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/).

## Create an Azure Cognitive Search resource

[!INCLUDE [tutorial-create-search-resource](includes/tutorial-add-search-website-create-search-resource.md)]

## Prepare the bulk import script for Search

The script uses the Azure SDK for Cognitive Search:

* [NuGet package Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/)
* [Reference Documentation](/dotnet/api/overview/azure/search)

1. In Visual Studio Code, open the `Program.cs` file in the subdirectory,  `search-website-functions-v4/bulk-insert`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-RESOURCE-NAME
    * YOUR-SEARCH-ADMIN-KEY

    :::code language="csharp" source="~/azure-search-dotnet-samples/search-website-functions-v4/bulk-insert/Program.cs" :::

1. Open an integrated terminal in Visual Studio Code for the project directory's subdirectory, `search-website-functions-v4/bulk-insert`, then run the following command to install the dependencies. 

    ```bash
    dotnet restore
    ```

## Run the bulk import script for Search

1. Continue using the integrated terminal in Visual Studio for the project directory's subdirectory, `search-website-functions-v4/bulk-insert`, to run the following bash command to run the `Program.cs` script:

    ```bash
    dotnet run
    ```

1. As the code runs, the console displays progress. 
1. When the upload is complete, the last statement printed to the console is "Finished bulk inserting book data".

## Review the new Search Index

[!INCLUDE [tutorial-load-index-review-index](includes/tutorial-add-search-website-load-index-review.md)]

## Rollback bulk import file changes

[!INCLUDE [tutorial-load-index-rollback](includes/tutorial-add-search-website-load-index-rollback-changes.md)]

## Copy your Search resource name
[!INCLUDE [tutorial-load-index-copy](includes/tutorial-add-search-website-load-index-copy-resource-name.md)]

## Next steps

[Deploy your Static Web App](tutorial-csharp-deploy-static-web-app.md)
