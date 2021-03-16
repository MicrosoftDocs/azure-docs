---
title: JavaScript tutorial creates and load index
titleSuffix: Azure Cognitive Search
description: Learn how to import data into a single Azure Cognitive Search index with JavaScript using the npm SDK @azure/search-documents.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 03/09/2021
ms.custom: devx-track-js
---

# 2. Create and load Search Index with JavaScript

Continue to build your Search-enabled website. Import data into a new Azure Cognitive Search index with JavaScript using the npm SDK [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents).

## Create an Azure Search resource 

Create a new Search resource with the [Azure Cognitive Search](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecognitivesearch) extension for Visual Studio Code.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, right-click on your Azure subscription under the **Azure: Cognitive Search** area and select **Create new search service**.

    :::image type="content" source="./media/tutorial-javascript-overview/visual-studio-code-create-resource.png" alt-text="In the Side bar, right-click on your Azure subscription under the **Azure: Cognitive Search** area and select **Create new search service**.":::

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |Enter a globally unique name for the new Search Service.|This resource name becomes part of your resource endpoint.|
    |Select a resource group for new resources|Create a new resource group. Deleting all resources created in this tutorial is easy if they are all in a single resource group.|
    |Select the SKU for your search service.|Select **Free** for this tutorial. You can't change a SKU pricing tier after the service is created.|
    |Select a location for new resources.|Select a region close to you.|

1. Once the prompts complete, the Search resource is created. 

## Get your Search resource admin key

Get your Search resource admin key with the Visual Studio Code extension. 

1. In Visual Studio Code, in the Side bar, right-click on your Search resource and select **Copy Admin Key**.

    :::image type="content" source="./media/tutorial-javascript-overview/visual-studio-code-copy-admin-key.png" alt-text="In the Side bar, right-click on your Search resource and select **Copy Admin Key**.":::

1. Keep this admin key, you will need to use it in the next section. 

## Download book catalog to your local computer

This tutorial uploads data directly into the Search Index from a comma-separated list of books.

1. Download the [books.csv](https://raw.githubusercontent.com/zygmuntz/goodbooks-10k/master/books.csv) and move the file to the local repository's subdirectory location, `search-web/bulk-insert` with the same file name `bulk_insert_books.js`. 

1. In Visual Studio Code, right-click this subdirectory and open an integrated terminal. 

## Prepare the bulk import script for Search

The script uses the Azure SDK for Cognitive Search:

* NPM: [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* Reference Documentation: [Client Library](/javascript/api/overview/azure/search-documents-readme)

1. In Visual Studio Code, open the `bulk_insert_books.js` file in the subdirectory,  `search-web/bulk-insert`, and review the following code:

    :::code language="javascript" source="~/js-e2e/search/bulk-insert-books-from-csv/bulk_insert_books.js" highlight="6,7" :::

1. Replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-RESOURCE-NAME
    * YOUR-SEARCH-ADMIN-KEY

1. Open an integrated terminal in Visual Studio for the project directory's subdirectory, `search-web/bulk-insert`, and run the following command to install the dependencies. 

    ```bash
    npm install 
    ```

## Run the bulk import script for Search

Run the Node.js JavaScript file to bulk upload from the `books.csv` file directly into the Azure Search index named `good-books` with the following terminal command:

```javascript
npm start
```

As the code runs, each row in books.csv is printed to the console as it is processed. When the upload is complete, the last statement printed to the console is "done".

## Review the new Search Index

Once the upload completes, the Search Index is ready to use. Review your new Index.

1. In Visual Studio Code, open the Azure Cognitive Search extension and open your Search resource.  

    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-resource.png" alt-text="In Visual Studio Code, open the Azure Cognitive Search extension and open your Search resource.":::

1. Expand Indexes, then `good-books`, then select a doc. 
 
    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-docs.png" alt-text="Expand Indexes, then `good-books`, then select a doc.":::

## Copy your Search resource name

Note your **Search resource name**. You will need this to connect the Azure Function app to your Search resource. You could also use your Search admin key in the Azure Function but that isn't following the principle of least privilege. The Azure Function will use the query key instead to conform to least privilege. 

## Next steps

[Deploy your static web app](tutorial-javascript-deploy-static-web-app.md)