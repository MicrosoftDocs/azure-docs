---
title: JavaScript tutorial creates searchable web app
titleSuffix: Azure Cognitive Search
description: Learn how to add Search to a web app.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 03/09/2021
ms.custom: devx-track-js
---

# Tutorial: Create searchable web app

Import data into a single Azure Cognitive Search index with JavaScript using the npm SDK [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents).

The sample application for this tutorial builds a website to search through a catalog of books. The search experience includes: 

* Search – provides search functionality for the application.
* Suggest – provides suggestions as the user is typing in the search bar.
* Document Lookup – looks up a document by ID to retrieve all of its contents for the details page.

You can load data into the Search resource from:

* Upload the CSV list directly into the Search Index - this tutorial uses this method.
* Or an Azure database you plan to update and maintain.

## Set up your development environment

Install the following for your local development environment. 

- [Node.js 12+ and npm](https://nodejs.org/en/download) 
- [Visual Studio Code](https://code.visualstudio.com/) and the following extensions
- [Azure CLI]()

## Get an Azure Search resource 

You can complete this tutorial by:

* Creating your own Search resource and Index. Those steps are provided in this article.
* Or [use an existing Search resource and Index](#use-an-existing-resource). 

### Use an existing resource

To use an existing resource: 

1. Copy the following setting values:

    "SearchServiceName": "azs-playground",
    "SearchIndexName": "good-books",
    "SearchAPIKey": "03097125077C18172260E41153975439"

1. Skip to the next section of the tutorial.

### Create your own resource

Create a new Search resource with the Azure CLI.  

1. Open an Azure CLI environment.

    1. Log in to the Azure CLI on your local development environment with the following command 

        ```azurecli
        az login
        ```

    1. Or use the [Azure Cloud Shell](https://ms.portal.azure.com/#cloudshell/).

1. Run the Azure command, [az search service create](/cli/azure/search/service#az_search_service_create), to create a Search resource, filling in your own values for:

    * YOUR-SUBSCRIPTION-ID-OR-NAME - an existing subscription
    * YOUR-RESOURCE-GROUP - an existing resource group
    * YOUR-RESOURCE-NAME - the name of your new search resource, used as part of the endpoint URL

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


1. Open an Azure CLI environment.

    1. Login to the Azure CLI on your local development environment with the following command 

        ```azurecli
        az login
        ```

    1. Or use the [Azure Cloud Shell](https://ms.portal.azure.com/#cloudshell/).

1. Run the Azure command, [az search service create](/cli/azure/search/admin-key#az_search_admin_key_show), to get an **admin key**:

    * YOUR-SUBSCRIPTION-ID-OR-NAME
    * YOUR-RESOURCE-GROUP
    * YOUR-RESOURCE-NAME

    ```azurecli
    az search admin-key show \
        --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
        --resource-group YOUR-RESOURCE-GROUP \
        --name YOUR-RESOURCE_NAME \
        --location westus \
        --sku Standard
    ```

## Bulk load the book catalog CSV into a new Search Index

This tutorial uploads directly into the Search Index from the books.csv file. 

1. In a bash terminal, create a subdirectory, initialize it, and open it in Visual Studio Code:

    ```javascript
    mkdir bulk_upload && \
      cd bulk_upload && \
      npm init -y && \
      npm install @azure/search-documents csv-parser && \
      touch bulk_insert_books.js && \
      code .
    ```

1. In Visual Studio Code, create a new file called `books.csv` and copy the data from [goodbooks-10k](https://raw.githubusercontent.com/zygmuntz/goodbooks-10k/master/books.csv) into the file. 

1. In Visual Studio Code, create a new file called `books.schema.json` and copy the data from [books.schema.json](https://github.com/Azure-Samples/js-e2e/blob/main/search/bulk-insert-books-from-csv/books.schema.json) into the file. 

    The schema file defines how the data is stored in the Search Index and determines what functionality is provided with the index.

    When you example the `bulk_insert_books.js` code file below, you can see in the insertData function's loop that each value is either passed directly or altered to better fit the datatype defined in the schema file. 

1. In Visual Studio Code, open the `bulk_insert_books.js` file and add the following code:

    :::code language="javascript" source="~/js-e2e/search/bulk-insert-books-from-csv/bulk_insert_books.js" highlight="6,7" :::

1. Replace the following variables with your own values:

    * YOUR-RESOURCE-NAME
    * YOUR-RESOURCE-KEY: your admin key

1. Run the Node.js JavaScript file to bulk upload from the `books.csv` file directly into the Azure Search index named `good-books` with the following terminal command:

    ```javascript
    node bulk_insert_books.js
    ```

    As the code runs, each row in books.csv is printed to the console as it is processed. 

    When the upload is complete, the last statement printed to the console is "done".

## Review the new Search Index

Once the upload completes, the Search Index is ready to use. Review your new Index.

1. In Visual Studio Code, open the Azure Cognitive Search extension and open your Search resource.  

    :::image type="content" source="/media/folder-with-same-name-as-article-file/visual-studio-code-search-extension-view-resource.png" alt-text="In Visual Studio Code, open the Azure Cognitive Search extension and open your Search resource.":::

1. Expand Indexes, then `good-books`, then select a doc. 
 
    :::image type="content" source="/media/folder-with-same-name-as-article-file/visual-studio-code-search-extension-view-docs.png" alt-text="Expand Indexes, then `good-books`, then select a doc.":::