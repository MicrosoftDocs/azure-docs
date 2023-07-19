---
title: "Load an index (JavaScript tutorial)" 
titleSuffix: Azure Cognitive Search
description: Create index and import CSV data into Search index with JavaScript using the npm SDK @azure/search-documents.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom: devx-track-js, devx-track-azurecli
ms.devlang: javascript
---

# 2 - Create and load Search Index with JavaScript

Continue to build your search-enabled website by following these steps:
* Create a search resource
* Create a new index
* Import data with JavaScript using the [sample script](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/main/search-website-functions-v4/bulk-insert-v4/bulk_insert_books.js) and Azure SDK [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents).

## Create an Azure Cognitive Search resource

Create a new search resource from the command line using the Azure CLI. In this section, you'll also create a query key used for read-access to the index, and get the built-in admin key used for adding objects.

1. In Visual Studio Code, under **Terminal**, select **New Terminal**.

1. Connect to Azure:

   ```azurecli
   az login
   ```

1. Before creating a new search service, you can list existing search services for your subscription. If you have a free search service, you can use it for this tutorial:

   ```azurecli
   az resource list --resource-type Microsoft.Search/searchServices --output table
   ```

   If you have one, note the name and then skip ahead to [Prepare the bulk import script](#prepare-the-bulk-import-script-for-search)

1. Create a new search service. Use the following command as a template, substituting valid values for the resource group, service name, tier, region, partitions, and replicas. The following statement uses the resource group created in a previous step and specifies the free tier. If your Azure subscription already has a free search service, specify a billable tier such as "basic" instead.

   ```azurecli
   az search service create --name my-cog-search-demo-svc --resource-group cognitive-search-demo-rg --sku free --partition-count 1 --replica-count 1
   ```

1. Get a query key that grants read access to a search service. A search service is provisioned with two admin keys and one query key. Substitute valid names for the resource group and search service. Copy the query key to Notepad so that you can paste it into the client code in a later step:

   ```azurecli
   az search query-key list --resource-group cognitive-search-demo-rg --service-name my-cog-search-demo-svc
   ```

1. Get a search service admin API key. An admin API key provides write access to the search service. Copy either one of the admin keys to Notepad so that you can use it in the bulk import step that creates and loads an index:

   ```azurecli
   az search admin-key show --resource-group cognitive-search-demo-rg --service-name my-cog-search-demo-svc
   ```

## Prepare the bulk import script for Search

The ESM script uses the Azure SDK for Cognitive Search:

* [npm package @azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* [Reference Documentation](/javascript/api/overview/azure/search-documents-readme)

1. In Visual Studio Code, open the `bulk_insert_books.js` file in the subdirectory,  `search-website-functions-v4/bulk-insert-v4`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-RESOURCE-NAME
    * YOUR-SEARCH-ADMIN-KEY

    :::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/bulk-insert-v4/bulk_insert_books.js" :::

1. Open an integrated terminal in Visual Studio for the project directory's subdirectory, `search-website-functions-v4/bulk-insert-v4`, and run the following command to install the dependencies. 

    ```bash
    npm install 
    ```

## Run the bulk import script for Search

1. Continue using the integrated terminal in Visual Studio for the project directory's subdirectory, `search-website-functions-v4/bulk-insert-v4`, to run the following bash command to run the `bulk_insert_books.js` script:

    ```javascript
    npm start
    ```

1. As the code runs, the console displays progress. 
1. When the upload is complete, the last statement printed to the console is "done".

## Review the new Search Index

[!INCLUDE [tutorial-load-index-review-index](includes/tutorial-add-search-website-load-index-review.md)]

## Rollback bulk import file changes

[!INCLUDE [tutorial-load-index-rollback](includes/tutorial-add-search-website-load-index-rollback-changes.md)]

## Copy your Search resource name

[!INCLUDE [tutorial-load-index-copy](includes/tutorial-add-search-website-load-index-copy-resource-name.md)]


## Next steps

[Deploy your Static Web App](tutorial-javascript-deploy-static-web-app.md)
