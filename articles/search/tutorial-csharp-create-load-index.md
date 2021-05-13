---
title: ".NET tutorial: Add search to web apps" 
titleSuffix: Azure Cognitive Search
description: Create index and import CSV data into Search index with .NET.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 04/23/2021
ms.custom: devx-track-csharp
ms.devlang: dotnet
---

# 2 - Create and load Search Index with .NET

Continue to build your Search-enabled website by:
* Creating a Search resource with the VS Code extension
* Creating a new index and importing data with .NET using the sample script and Azure SDK [Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/).

## Create an Azure Search resource 

Create a new Search resource with the [Azure Cognitive Search](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecognitivesearch) extension for Visual Studio Code.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, **right-click on your Azure subscription** under the `Azure: Cognitive Search` area and select **Create new search service**.

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-create-search-resource.png" alt-text="In the Side bar, right-click on your Azure subscription under the **Azure: Cognitive Search** area and select **Create new search service**.":::

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

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-copy-admin-key.png" alt-text="In the Side bar, right-click on your Search resource and select **Copy Admin Key**.":::

1. Keep this admin key, you will need to use it in [a later section](#prepare-the-bulk-import-script-for-search). 

## Prepare the bulk import script for Search

The script uses the Azure SDK for Cognitive Search:

* [NuGet package Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/)
* [Reference Documentation](/dotnet/api/overview/azure/search)

1. In Visual Studio Code, open the `Program.cs` file in the subdirectory,  `search-website/bulk-insert`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-RESOURCE-NAME
    * YOUR-SEARCH-ADMIN-KEY

    :::code language="csharp" source="~/azure-search-dotnet-samples/search-website/bulk-insert/Program.cs" highlight="16-19" :::

1. Open an integrated terminal in Visual Studio Code for the project directory's subdirectory, `search-website/bulk-insert`, then run the following command to install the dependencies. 

    ```bash
    dotnet restore
    ```

## Run the bulk import script for Search

1. Continue using the integrated terminal in Visual Studio for the project directory's subdirectory, `search-website/bulk-insert`, to run the following bash command to run the `Program.cs` script:

    ```bash
    dotnet run
    ```

1. As the code runs, the console displays progress. 
1. When the upload is complete, the last statement printed to the console is "Finished bulk inserting book data".

## Review the new Search Index

Once the upload completes, the Search Index is ready to use. Review your new Index.

1. In Visual Studio Code, open the Azure Cognitive Search extension and select your Search resource.  

    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-resource.png" alt-text="In Visual Studio Code, open the Azure Cognitive Search extension and open your Search resource.":::

1. Expand Indexes, then Documents, then `good-books`, then select a doc to see all the document-specific data.
 
    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-docs.png" lightbox="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-docs.png" alt-text="Expand Indexes, then `good-books`, then select a doc.":::

## Copy your Search resource name

Note your **Search resource name**. You will need this to connect the Azure Function app to your Search resource. 

> [!CAUTION]
> While you may be tempted to use your Search admin key in the Azure Function, that isn't following the principle of least privilege. The Azure Function will use the query key to conform to least privilege. 

## Next steps

[Deploy your Static Web App](tutorial-csharp-deploy-static-web-app.md)