---
title: "JavaScript tutorial: Add search to web apps" 
titleSuffix: Azure Cognitive Search
description: Create index and import CSV data into Search index with JavaScript using the npm SDK @azure/search-documents.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 05/21/2021
ms.custom: devx-track-js
ms.devlang: javascript
---

# 2 - Create and load Search Index with JavaScript

Continue to build your Search-enabled website by:
* Creating a Search resource with the VS Code extension
* Creating a new index and importing data with JavaScript using the sample script and Azure SDK [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents).

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

* [npm package @azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* [Reference Documentation](/javascript/api/overview/azure/search-documents-readme)

1. In Visual Studio Code, open the `bulk_insert_books.js` file in the subdirectory,  `search-website/bulk-insert`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-RESOURCE-NAME
    * YOUR-SEARCH-ADMIN-KEY

    :::code language="javascript" source="~/azure-search-javascript-samples/search-website/bulk-insert/bulk_insert_books.js" highlight="16,17" :::

1. Open an integrated terminal in Visual Studio for the project directory's subdirectory, `search-website/bulk-insert`, and run the following command to install the dependencies. 

    ```bash
    npm install 
    ```

## Run the bulk import script for Search

1. Continue using the integrated terminal in Visual Studio for the project directory's subdirectory, `search-website/bulk-insert`, to run the following bash command to run the `bulk_insert_books.js` script:

    ```javascript
    npm start
    ```

1. As the code runs, the console displays progress. 
1. When the upload is complete, the last statement printed to the console is "done".

## Review the new Search Index

Once the upload completes, the Search Index is ready to use. Review your new Index.

1. In Visual Studio Code, open the Azure Cognitive Search extension and select your Search resource.  

    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-resource.png" alt-text="In Visual Studio Code, open the Azure Cognitive Search extension and open your Search resource.":::

1. Expand Indexes, then Documents, then `good-books`, then select a doc to see all the document-specific data.
 
    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-docs.png" lightbox="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-docs.png" alt-text="Expand Indexes, then `good-books`, then select a doc.":::

## Rollback bulk import file changes

Use the following git command in the VS Code integrated terminal at the `bulk-insert` directory, to rollback the changes. They are not needed to continue the tutorial and you shouldn't save or push these secrets to your repo. 

```git
git checkout .
```

## Copy your Search resource name

Note your **Search resource name**. You will need this to connect the Azure Function app to your Search resource. 

> [!CAUTION]
> While you may be tempted to use your Search admin key in the Azure Function, that isn't following the principle of least privilege. The Azure Function will use the query key to conform to least privilege. 

## Next steps

[Deploy your Static Web App](tutorial-javascript-deploy-static-web-app.md)
---
title: "JavaScript tutorial: Search integration highlights"
titleSuffix: Azure Cognitive Search
description: Understand the JavaScript SDK Search integration queries used in the Search-enabled website with this cheat sheet. 
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 03/09/2021
ms.custom: devx-track-js
ms.devlang: javascript
---

# 4 - JavaScript Search integration cheat sheet

In the previous lessons, you added search to a Static Web App. This lesson highlights the essential steps that establish integration. If you are looking for a cheat sheet on how to integrate search into your JavaScript app, this article explains what you need to know.

The application is available: 
* [Sample](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/search-website)
* [Demo website - aka.ms/azs-good-books](https://aka.ms/azs-good-books)

## Azure SDK @azure/search-documents 

The Function app uses the Azure SDK for Cognitive Search:

* NPM: [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* Reference Documentation: [Client Library](/javascript/api/overview/azure/search-documents-readme)

The Function app authenticates through the SDK to the cloud-based Cognitive Search API using your resource name, resource key, and index name. The secrets are stored in the Static Web App settings and pulled in to the Function as environment variables. 

## Configure secrets in a configuration file

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/api/config.js" highlight="3,4" :::

## Azure Function: Search the catalog

The `Search` [API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website/api/Search/index.js) takes a search term and searches across the documents in the Search Index, returning a list of matches. 

Routing for the Search API is contained in the [function.json](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website/api/Search/function.json) bindings.

The Azure Function pulls in the Search configuration information, and fulfills the query.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/api/Search/index.js" highlight="4-9, 75" :::

## Client: Search from the catalog

Call the Azure Function in the React client with the following code. 

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/src/pages/Search/Search.js" highlight="40-51" :::

## Azure Function: Suggestions from the catalog

The `Suggest` [API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website/api/Suggest/index.js) takes a search term while a user is typing and suggests search terms such as book titles and authors across the documents in the search index, returning a small list of matches. 

The search suggester, `sg`, is defined in the [schema file](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website/bulk-insert/good-books-index.json) used during bulk upload.

Routing for the Suggest API is contained in the [function.json](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website/api/Suggest/function.json) bindings.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/api/Suggest/index.js" highlight="4-9, 21" :::

## Client: Suggestions from the catalog

The Suggest function API is called in the React app at `\src\components\SearchBar\SearchBar.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/src/components/SearchBar/SearchBar.js" highlight="52-60" :::

## Azure Function: Get specific document 

The `Lookup` [API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website/api/Lookup/index.js) takes a ID and returns the document object from the Search Index. 

Routing for the Lookup API is contained in the [function.json](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website/api/Lookup/function.json) bindings.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/api/Lookup/index.js" highlight="4-9, 17" :::

## Client: Get specific document 

This function API is called in the React app at `\src\pages\Details\Detail.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/src/pages/Details/Details.js" highlight="19-29" :::

## Next steps

* [Index Azure SQL data](search-indexer-tutorial.md)
