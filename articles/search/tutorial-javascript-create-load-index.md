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

1. In the Side bar, right-click on your Search resource and select **Copy Admin Key**.

    :::image type="content" source="./media/tutorial-javascript-overview/visual-studio-code-copy-admin-key.png" alt-text="In the Side bar, right-click on your Search resource and select **Copy Admin Key**.":::

1. Keep this admin key, you will need to use it in the next section. The admin key is able to create/delete indexes. 

## Load the book catalog into an Index

This tutorial uploads directly into the Search Index from the `books.csv` file. 

1. In Visual Studio Code, open a new terminal and use the following bash command to create a new file named `bulk-insert-books.js` in the `scripts` directory.:

    ```javascript
    cd scripts && \
      npm init -y && \
      npm install @azure/search-documents csv-parser && \
      touch bulk_insert_books.js
    ```

    This command also initializes npm and installs dependencies used for this bulk upload script. 

1. In Visual Studio Code, create a new file called `books.csv` and copy the data from [goodbooks-10k](https://raw.githubusercontent.com/zygmuntz/goodbooks-10k/master/books.csv) into the file. 

## Add a schema definition file

In Visual Studio Code, create a new file, `books.schema.json` and copy the data from [books.schema.json](https://github.com/Azure-Samples/js-e2e/blob/main/search/bulk-insert-books-from-csv/books.schema.json) into the file. 

The schema file defines how the data is stored in the Search Index and determines what functionality is provided with the index.

When you examine the `bulk_insert_books.js` code file below, you can see in the insertData function's loop that each value is either passed directly or altered to better fit the datatype defined in the schema file. 

:::code language="json" source="~/js-e2e/search/bulk-insert-books-from-csv/bulk_insert_books.js" highlight="6,7" :::

## Create the bulk import script

The script uses the Azure SDK for Cognitive Search:

* NPM: [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* Reference Documentation: [Client Library](/javascript/api/overview/azure/search-documents-readme)

1. In Visual Studio Code, open the `bulk_insert_books.js` file and add the following code:

    :::code language="javascript" source="~/js-e2e/search/bulk-insert-books-from-csv/bulk_insert_books.js" highlight="6,7" :::

1. Replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-RESOURCE-NAME
    * YOUR-RESOURCE-KEY: your admin key

## Run the bulk import script

Run the Node.js JavaScript file to bulk upload from the `books.csv` file directly into the Azure Search index named `good-books` with the following terminal command:

```javascript
node bulk_insert_books.js
```

As the code runs, each row in books.csv is printed to the console as it is processed. 

When the upload is complete, the last statement printed to the console is "done".

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