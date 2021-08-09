---
title: "Python tutorial: Add search to web apps" 
titleSuffix: Azure Cognitive Search
description: Create index and import CSV data into Search index with Python using the PYPI package SDK azure-search-documents.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 05/25/2021
ms.custom: devx-track-python
ms.devlang: python
---

# 2 - Create and load Search Index with Python

Continue to build your Search-enabled website by:
* Creating a Search resource with the VS Code extension
* Creating a new index and importing data with Python using the sample script and Azure SDK [azure-search-documents](https://pypi.org/project/azure-search-documents/).

## Create an Azure Cognitive Search resource 

Create a new Search resource with the [Azure Cognitive Search](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecognitivesearch) extension for Visual Studio Code.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, **right-click on your Azure subscription** under the `Azure: Cognitive Search` area and select **Create new search service**.

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-create-search-resource.png" alt-text="In the Side bar, right-click on your Azure subscription under the **Azure: Cognitive Search** area and select **Create new search service**.":::

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

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-copy-admin-key.png" alt-text="In the Side bar, right-click on your Search resource and select **Copy Admin Key**.":::

1. Keep this admin key, you will need to use it to create objects in [a later section](#prepare-the-bulk-import-script-for-search). 

## Prepare the bulk import script for Search

The script uses the Azure SDK for Cognitive Search:

* [PYPI package azure-search-documents](https://pypi.org/project/azure-search-documents/)
* [Reference Documentation](/python/api/azure-search-documents)

1. In Visual Studio Code, open the `bulk_upload.py` file in the subdirectory,  `search-website/bulk-upload`, replace the following variables with your own values to authenticate with the Azure Search SDK:

    * YOUR-SEARCH-RESOURCE-NAME
    * YOUR-SEARCH-ADMIN-KEY

    :::code language="python" source="~/azure-search-python-samples/search-website/bulk-upload/bulk-upload.py" highlight="12,13, 117" :::

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

Once the upload completes, the search index is ready to use. Review your new index.

1. In Visual Studio Code, open the Azure Cognitive Search extension and select your Search resource.  

    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-resource.png" alt-text="In Visual Studio Code, open the Azure Cognitive Search extension and open your Search resource.":::

1. Expand Indexes, then Documents, then `good-books`, then select a doc to see all the document-specific data.
 
    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-docs.png" lightbox="media/tutorial-javascript-create-load-index/visual-studio-code-search-extension-view-docs.png" alt-text="Expand Indexes, then `good-books`, then select a doc.":::

## Copy your Search resource name

Note your **Search resource name**. You will need this to connect the Azure Function app to your Search resource. 

> [!CAUTION]
> While you may be tempted to use your Search admin key in the Azure Function, that isn't following the principle of least privilege. The Azure Function will use the query key to conform to least privilege. 

## Next steps

[Deploy your Static Web App](tutorial-python-deploy-static-web-app.md)