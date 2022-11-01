---
title: ".NET tutorial: Add search to web apps" 
titleSuffix: Azure Cognitive Search
description: Create index and import CSV data into Search index with .NET.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 11/01/2022
ms.custom: devx-track-csharp
ms.devlang: csharp
---

# 2 - Create and load Search Index with .NET

Continue to build your Search-enabled website by:
* Create a Search resource with the VS Code extension
* Create a new index
* Import data with .NET using the sample script and Azure SDK [Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/).

## Create an Azure Search resource 

Create a new Search resource with the [Azure Cognitive Search](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecognitivesearch) extension for Visual Studio Code.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, **right-click on your Azure subscription** under the `Azure: Cognitive Search` area and select **Create new search service**.

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-create-search-resource.png" alt-text="Screenshot of Visual Studio code showing the Azure explorer bar, right-click on your Azure subscription under the Azure: Cognitive Search area and select Create new search service.":::

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |Enter a globally unique name for the new Search Service.|**Remember this name**. This resource name becomes part of your resource endpoint.|
    |Select a resource group for new resources|Use the resource group you created for this tutorial.|
    |Select the SKU for your Search service.|Select **Free** for this tutorial. You can't change a SKU pricing tier after the service is created.|
    |Select a location for new resources.|Select a region close to you.|

1. After you complete the prompts, your new Search resource is created. 

## Get your Search resource admin key

Get your Search resource admin key with the Visual Studio Code extension. 

1. In Visual Studio Code, in the Side bar, right-click on your Search resource and select **Copy Admin Key**.

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-copy-admin-key.png" alt-text="Screenshot of Visual Studio code showing the Azure explorer bar, right-click on your Search resource and select Copy Admin Key.":::

1. Keep this admin key, you'll need to use it in [a later section](#prepare-the-bulk-import-script-for-search). 

## Prepare the bulk import script for Search

The script uses the Azure SDK for Cognitive Search:

* [NuGet package Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/)
* [Reference Documentation](/dotnet/api/overview/azure/search)

1. In Visual Studio Code, open the `Program.cs` file in the subdirectory,  `search-website-functions-v4/bulk-insert`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-RESOURCE-NAME
    * YOUR-SEARCH-ADMIN-KEY

    :::code language="csharp" source="~/azure-search-dotnet-samples/search-website-functions-v4/bulk-insert/Program.cs" highlight="16-19, 21-23, 32, 49" :::

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