---
title: "Add search to web sites (Python tutorial)"
titleSuffix: Azure Cognitive Search
description: Technical overview and setup for adding search to a website with Python and deploying to Azure Static Web App. 
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom: devx-track-python
ms.devlang: python
---

# 1 - Overview of adding search to a website with Python

This tutorial builds a website to search through a catalog of books then deploys the website to an Azure Static Web App. 

The application is available: 
* [Sample](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/search-website-functions-v4)
* [Demo website - aka.ms/azs-good-books](https://aka.ms/azs-good-books)

## What does the sample do? 

[!INCLUDE [tutorial-overview](includes/tutorial-add-search-website-what-sample-does.md)]

## How is the sample organized?

The [sample](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/search-website-functions-v4) includes the following:

|App|Purpose|GitHub<br>Repository<br>Location|
|--|--|--|
|Client|React app (presentation layer) to display books, with search. It calls the Azure Function app. |[/search-website-functions-v4/client](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/search-website-functions-v4/client)|
|Server|Azure Function app (business layer) - calls the Azure Cognitive Search API using Python SDK |[/search-website-functions-v4/api](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/search-website-functions-v4/api)|
|Bulk insert|Python file to create the index and add documents to it.|[/search-website-functions-v4/bulk-upload](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/search-website-functions-v4/bulk-upload)|

## Set up your development environment

Install the following for your local development environment. 

- [Python 3.9](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) and the following extensions
    - [Azure Static Web App](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) 
    - Use the integrated terminal for command line operations.
- Optional:
    - This tutorial doesn't run the Azure Function API locally but if you intend to run it locally, you need to install [azure-functions-core-tools](../azure-functions/functions-run-local.md?tabs=linux%2ccsharp%2cbash).

## Fork and clone the search sample with git

Forking the sample repository is critical to be able to deploy the static web app. The web apps determine the build actions and deployment content based on your own GitHub fork location. Code execution in the Static Web App is remote, with Azure static web apps reading from the code in your forked sample.

1. On GitHub, fork the [sample repository](https://github.com/Azure-Samples/azure-search-python-samples). 

    Complete the fork process in your web browser with your GitHub account. This tutorial uses your fork as part of the deployment to an Azure Static Web App. 

1. At a bash terminal, download the sample application to your local computer. 

    Replace `YOUR-GITHUB-ALIAS` with your GitHub alias. 

    ```bash
    git clone https://github.com/YOUR-GITHUB-ALIAS/azure-search-python-samples
    ```

1. In Visual Studio Code, open your local folder of the cloned repository. The remaining tasks are accomplished from Visual Studio Code, unless specified.

## Create a resource group for your Azure resources

[!INCLUDE [tutorial-create-resource-group](includes/tutorial-add-search-website-create-resource-group.md)]

## Next steps

* [Create a Search Index and load with documents](tutorial-python-create-load-index.md)
* [Deploy your Static Web App](tutorial-python-deploy-static-web-app.md)
