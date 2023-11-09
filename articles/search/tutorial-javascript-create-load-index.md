---
title: "Load an index (JavaScript tutorial)" 
titleSuffix: Azure AI Search
description: Create index and import CSV data into Search index with JavaScript using the npm SDK @azure/search-documents.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 09/13/2023
ms.custom: devx-track-js, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: javascript
---

# 2 - Create and load Search Index with JavaScript

Continue to build your search-enabled website by following these steps:

* Create a search resource
* Create a new index
* Import data with JavaScript using the [bulk_insert_books script](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/main/search-website-functions-v4/bulk-insert/bulk_insert_books.js) and Azure SDK [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents).

## Create an Azure AI Search resource

[!INCLUDE [tutorial-create-search-resource](includes/tutorial-add-search-website-create-search-resource.md)]

## Prepare the bulk import script for Search

The ESM script uses the Azure SDK for Azure AI Search:

* [npm package @azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* [Reference Documentation](/javascript/api/overview/azure/search-documents-readme)

1. In Visual Studio Code, open the `bulk_insert_books.js` file in the subdirectory,  `search-website-functions-v4/bulk-insert`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-RESOURCE-NAME
    * YOUR-SEARCH-ADMIN-KEY

    :::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/bulk-insert/bulk_insert_books.js" :::

1. Open an integrated terminal in Visual Studio for the project directory's subdirectory, `search-website-functions-v4/bulk-insert`, and run the following command to install the dependencies. 

    ```bash
    npm install 
    ```

## Run the bulk import script for Search

1. Continue using the integrated terminal in Visual Studio for the project directory's subdirectory, `search-website-functions-v4/bulk-insert`, to run the `bulk_insert_books.js` script:

    ```javascript
    npm start
    ```

1. As the code runs, the console displays progress. 
1. When the upload is complete, the last statement printed to the console is "done".

## Review the new search index

[!INCLUDE [tutorial-load-index-review-index](includes/tutorial-add-search-website-load-index-review.md)]

## Rollback bulk import file changes

[!INCLUDE [tutorial-load-index-rollback](includes/tutorial-add-search-website-load-index-rollback-changes.md)]

## Copy your Search resource name

[!INCLUDE [tutorial-load-index-copy](includes/tutorial-add-search-website-load-index-copy-resource-name.md)]

## Next steps

[Deploy your Static Web App](tutorial-javascript-deploy-static-web-app.md)
