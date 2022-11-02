---
title: "Python tutorial: Add search to web apps" 
titleSuffix: Azure Cognitive Search
description: Create index and import CSV data into Search index with Python using the PYPI package SDK azure-search-documents.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 11/02/2022
ms.custom: devx-track-python
ms.devlang: python
---

# 2 - Create and load Search Index with Python

Continue to build your Search-enabled website by:
* Create a Search resource with the VS Code extension
* Create a new index
* Import data with Python using the [sample script](https://github.com/Azure-Samples/azure-search-python-samples/blob/main/search-website-functions-v4/bulk-upload/bulk-upload.py) and Azure SDK [azure-search-documents](https://pypi.org/project/azure-search-documents/).

## Create an Azure Cognitive Search resource 

Create a new Search resource with the [Azure Cognitive Search](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecognitivesearch) extension for Visual Studio Code.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, **right-click on your Azure subscription** under the `Azure: Cognitive Search` area and select **Create new search service**.

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-create-search-resource.png" alt-text="Screenshot of Visual Studio Code showing the Azure explorer, right-click on your Azure subscription under the Azure: Cognitive Search area and select Create new search service.":::

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |Enter a globally unique name for the new Search Service.|**Remember this name**. This resource name becomes part of your resource endpoint.|
    |Select a resource group for new resources|Use the resource group you created for this tutorial.|
    |Select the SKU for your Search service.|Select **Free** for this tutorial. You can't change a pricing tier after the service is created.|
    |Select a location for new resources.|Select a region close to you.|

1. After you complete the prompts, your new Search resource is created. 

## Get your Search resource admin key

Get your Search resource admin key with the Visual Studio Code extension. 

1. In Visual Studio Code, in the Side bar, right-click on your Search resource and select **Copy Admin Key**.

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-copy-admin-key.png" alt-text="Screenshot of Visual Studio Code showing the Azure explorer, right-click on your Search resource and select Copy Admin Key.":::

1. Keep this admin key, you'll need to use it to create objects in [a later section](#prepare-the-bulk-import-script-for-search). 

## Prepare the bulk import script for Search

The script uses the Azure SDK for Cognitive Search:

* [PYPI package azure-search-documents](https://pypi.org/project/azure-search-documents/)
* [Reference Documentation](/python/api/azure-search-documents)

1. In Visual Studio Code, open the `bulk_upload.py` file in the subdirectory,  `search-website/bulk-upload`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-SERVICE-NAME
    * YOUR-SEARCH-SERVICE-ADMIN-API-KEY

    :::code language="python" source="~/azure-search-python-samples/search-website/bulk-upload/bulk-upload.py" highlight="20-22,46-48,53-54,75-80,83,69,83,135,142" :::

1. Open an integrated terminal in Visual Studio for the project directory's subdirectory, `search-website/bulk-upload`, and run the following command to install the dependencies. 

    # [macOS/Linux](#tab/linux-install)
    
    ```bash
    python3 -m pip install -r requirements.txt 
    ```
    
    # [Windows](#tab/windows-install)

    ```bash
    py -m pip install -r requirements.txt 
    ```

## Run the bulk import script for Search

1. Continue using the integrated terminal in Visual Studio for the project directory's subdirectory, `search-website/bulk-upload`, to run the following bash command to run the `bulk_upload.py` script:

    # [macOS/Linux](#tab/linux-run)
    
    ```bash
    python3 bulk-upload.py
    ```
    
    # [Windows](#tab/windows-run)

    ```bash
    py bulk-upload.py
    ```


1. As the code runs, the console displays progress. 
1. When the upload is complete, the last statement printed to the console is "Done. Press any key to close the terminal.".

## Review the new Search Index

[!INCLUDE [tutorial-load-index-review-index](includes/tutorial-add-search-website-load-index-review.md)]

## Rollback bulk import file changes

[!INCLUDE [tutorial-load-index-rollback](includes/tutorial-add-search-website-load-index-rollback-changes.md)]

## Copy your Search resource name

[!INCLUDE [tutorial-load-index-copy](includes/tutorial-add-search-website-load-index-copy-resource-name.md)]

## Next steps

[Deploy your Static Web App](tutorial-python-deploy-static-web-app.md)