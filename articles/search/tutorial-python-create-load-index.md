---
title: "Load an index (Python tutorial)" 
titleSuffix: Azure Cognitive Search
description: Create index and import CSV data into Search index with Python using the PYPI package SDK azure-search-documents.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
---

# 2 - Create and load Search Index with Python

Continue to build your search-enabled website by following these steps:
* Create a search resource
* Create a new index
* Import data with Python using the [sample script](https://github.com/Azure-Samples/azure-search-python-samples/blob/main/search-website-functions-v4/bulk-upload/bulk-upload.py) and Azure SDK [azure-search-documents](https://pypi.org/project/azure-search-documents/).

## Create an Azure Cognitive Search resource

[!INCLUDE [tutorial-create-search-resource](includes/tutorial-add-search-website-create-search-resource.md)]

## Prepare the bulk import script for Search

The script uses the Azure SDK for Cognitive Search:

* [PYPI package azure-search-documents](https://pypi.org/project/azure-search-documents/)
* [Reference Documentation](/python/api/azure-search-documents)

1. In Visual Studio Code, open the `bulk_upload.py` file in the subdirectory,  `search-website-functions-v4/bulk-upload`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-SERVICE-NAME
    * YOUR-SEARCH-SERVICE-ADMIN-API-KEY

    :::code language="python" source="~/azure-search-python-samples/search-website-functions-v4/bulk-upload/bulk-upload.py" :::

1. Open an integrated terminal in Visual Studio for the project directory's subdirectory, `search-website-functions-v4/bulk-upload`, and run the following command to install the dependencies. 

    # [macOS/Linux](#tab/linux-install)
    
    ```bash
    python3 -m pip install -r requirements.txt 
    ```
    
    # [Windows](#tab/windows-install)

    ```bash
    py -m pip install -r requirements.txt 
    ```

## Run the bulk import script for Search

1. Continue using the integrated terminal in Visual Studio for the project directory's subdirectory, `search-website-functions-v4/bulk-upload`, to run the following bash command to run the `bulk_upload.py` script:

    # [macOS/Linux](#tab/linux-run)
    
    ```bash
    python3 bulk-upload.py
    ```
    
    # [Windows](#tab/windows-run)

    ```bash
    py bulk-upload.py
    ```


1. As the code runs, the console displays progress. 
1. When the upload is complete, the last statement printed to the console is "Done! Upload complete".

## Review the new Search Index

[!INCLUDE [tutorial-load-index-review-index](includes/tutorial-add-search-website-load-index-review.md)]

## Rollback bulk import file changes

[!INCLUDE [tutorial-load-index-rollback](includes/tutorial-add-search-website-load-index-rollback-changes.md)]

## Copy your Search resource name

[!INCLUDE [tutorial-load-index-copy](includes/tutorial-add-search-website-load-index-copy-resource-name.md)]

## Next steps

[Deploy your Static Web App](tutorial-python-deploy-static-web-app.md)
