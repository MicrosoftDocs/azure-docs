---
title: "JavaScript tutorial: Add search to web apps" 
titleSuffix: Azure Cognitive Search
description: Create index and import CSV data into Search index with JavaScript using the npm SDK @azure/search-documents.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 12/04/2022
ms.custom: devx-track-js
ms.devlang: javascript
---

# 2 - Create and load Search Index with JavaScript

Continue to build your search-enabled website by following these steps:
* Create a search resource
* Create a new index
* Import data with JavaScript using the [sample script](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/main/search-website-functions-v4/bulk-insert/bulk_insert_books.js) and Azure SDK [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents).

## Create an Azure Cognitive Search resource

Create a new search resource using PowerShell and the **Az.Search** module. In this section, you'll also create a query key used for read-access to the index, and get the built-in admin key used for adding objects.

1. In Visual Studio Code, open a new terminal window.

1. Connect to Azure:

   ```powershell
   Connect-AzAccount -TenantID <your-tenant-ID>
   ```

   > [!NOTE]
   > You might need to provide a tenant ID, which you can find in the Azure portal in [Portal settings > Directories + subscriptions](../azure-portal/set-preferences.md).

1. Before creating a new search service, you can list existing search services for your subscription to see if there's one you want to use:

   ```powershell
   Get-AzResource -ResourceType Microsoft.Search/searchServices | ft
   ```

1. Load the **Az.Search** module: 

   ```powershell
   Install-Module -Name Az.Search
   ```

1. Create a new search service. Use the following cmdlet as a template, substituting valid values for the resource group, service name, tier, region, partitions, and replicas:

   ```powershell
   New-AzSearchService -ResourceGroupName "my resource group"  -Name "myDemoSearchSvc" -Sku "Free" -Location "West US" -PartitionCount 1 -ReplicaCount 1 -HostingMode Default
   ```

    |Prompt|Enter|
    |--|--|
    |Enter a globally unique name for the new search service.|**Remember this name**. This resource name becomes part of your resource endpoint.|
    |Select a resource group for new resources|Use the resource group you created for this tutorial.|
    |Select the SKU for your search service.|Use **Free** for this tutorial. You can't change a SKU pricing tier after the service is created.|
    |Select a location for new resources.|Select a region close to you.|

1. Create a query key that grants read access to a search service. Query keys have to be explicitly created. Copy the query key to Notepad so that you can paste it into the client code in a later step:

   ```powershell
   New-AzSearchQueryKey -ResourceGroupName "my resource group"  -ServiceName "myDemoSearchSvc" -Name "mySrchQueryKey"
   ```

1. Get the search service admin API key that was automatically created for your search service. An admin API key provides write access to the search service. Copy either one of the admin keys to Notepad so that you can use it in the bulk import step that creates and loads an index:

   ```powershell
   Get-AzSearchAdminKeyPair  -ResourceGroupName "my resource group" -ServiceName "myDemoSearchSvc" 
   ```

## Prepare the bulk import script for Search

The script uses the Azure SDK for Cognitive Search:

* [npm package @azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* [Reference Documentation](/javascript/api/overview/azure/search-documents-readme)

1. In Visual Studio Code, open the `bulk_insert_books.js` file in the subdirectory,  `search-website-functions-v4/bulk-insert`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-RESOURCE-NAME
    * YOUR-SEARCH-ADMIN-KEY

    :::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/bulk-insert/bulk_insert_books.js" highlight="14,16,17,27-38,83,92,119" :::

1. Open an integrated terminal in Visual Studio for the project directory's subdirectory, `search-website-functions-v4/bulk-insert`, and run the following command to install the dependencies. 

    ```bash
    npm install 
    ```

## Run the bulk import script for Search

1. Continue using the integrated terminal in Visual Studio for the project directory's subdirectory, `search-website-functions-v4/bulk-insert`, to run the following bash command to run the `bulk_insert_books.js` script:

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