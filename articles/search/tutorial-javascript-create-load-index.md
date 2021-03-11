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

Create a new Search resource with the Azure CLI.  

1. Login to the Azure CLI with the following command: 

    ```bash
    az login
    ```

1. Run the Azure command, [az search service create](/cli/azure/search/service#az_search_service_create), to create a Search resource, filling in your own values:

    ```azurecli
    az search service create \
        --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
        --resource-group YOUR-RESOURCE-GROUP \
        --name YOUR-RESOURCE_NAME \
        --location westus \
        --sku Standard
    ```

1. Keep the value of `YOUR-RESOURCE_NAME`, you will use this later in the tutorial. 

## Get your resource key

Get your Search resource key with the Azure CLI.  

1. Login to the Azure CLI with the following command: 

    ```bash
    az login
    ```

1. Run the Azure command, [az search service create](/cli/azure/search/admin-key#az_search_admin_key_show), filling in your own values, to get an **admin key**:

    ```azurecli
    az search admin-key show \
        --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
        --resource-group YOUR-RESOURCE-GROUP \
        --name YOUR-RESOURCE_NAME \
        --location westus \
        --sku Standard
    ```

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

## Copy your Search index information before moving to next step

Copy these settings, you will need to use them so the Function app can connect to the Search Index

```json
"SearchServiceName": "YOUR-RESOURCE-NAME",
"SearchApiKey": "YOUR-RESOURCE-KEY",
```

## Next steps

[Deploy your static web app](tutorial-javascript-deploy-static-web-app.md)