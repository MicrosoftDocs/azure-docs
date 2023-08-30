---
title: "Add search to web sites (JavaScript tutorial)"
titleSuffix: Azure Cognitive Search
description: Technical overview and setup for adding search to a website and deploying to an Azure Static Web Apps. 
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom: devx-track-js
ms.devlang: javascript
---

# 1 - Overview of adding search to a website

This tutorial builds a website to search through a catalog of books then deploys the website to an Azure Static Web Apps resource. 

The application is available: 
* [Sample](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/search-website-functions-v4)
* [Demo website - aka.ms/azs-good-books](https://aka.ms/azs-good-books)

## What does the sample do? 

[!INCLUDE [tutorial-overview](includes/tutorial-add-search-website-what-sample-does.md)]

## How is the sample organized?

The [sample](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/search-website-functions-v4) includes the following:

|App|Purpose|GitHub<br>Repository<br>Location|
|--|--|--|
|Client|React app (presentation layer) to display books, with search. It calls the Azure Function app. |[/search-website-functions-v4/client-v4](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/search-website-functions-v4/client-v4)|
|Server|Azure Function app (business layer) - calls the Azure Cognitive Search API using JavaScript SDK |[/search-website-functions-v4/api-v4](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/search-website-functions-v4/api-v4)|
|Bulk insert|JavaScript file to create the index and add documents to it.|[/search-website-functions-v4/bulk-insert-v4](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/search-website-functions-v4/bulk-insert-v4)|

## Set up your development environment

Install the following for your local development environment. 

- [Node.js LTS](https://nodejs.org/en/download)
    - Select latest runtime and version from this [list of supported language versions](../azure-functions/functions-versions.md?pivots=programming-language-javascript&tabs=azure-cli%2clinux%2cin-process%2cv4#languages).
    - If you have a different version of Node.js installed on your local computer, consider using [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) or a Docker container.  
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) and the following extensions
    - [Azure Static Web App](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) 
    - Use the integrated terminal for command line operations.

- Optional:
    - This tutorial doesn't run the Azure Function API locally. If you intend to run it locally, you need to install [azure-functions-core-tools](../azure-functions/functions-run-local.md?tabs=linux%2ccsharp%2cbash) globally with the following bash command: 
    
    ```bash
    npm install -g azure-functions-core-tools@4
    ```

## Fork and clone the search sample with git

Forking the sample repository is critical to be able to deploy the Static Web App. The static web app determines the build actions and deployment content based on your own GitHub fork location. Code execution in the Static Web App is remote, with the static web app reading from the code in your forked sample.

1. On GitHub, [fork the sample repository](https://github.com/Azure-Samples/azure-search-javascript-samples/fork). 

    Complete the fork process in your web browser with your GitHub account. This tutorial uses your fork as part of the deployment to an Azure Static Web App. 

[!INCLUDE [tutorial-fork-and-clone](includes/tutorial-add-search-website-fork-and-clone.md)]

## Create a resource group for your Azure resources

[!INCLUDE [tutorial-create-resource-group](includes/tutorial-add-search-website-create-resource-group.md)]

## Next steps

* [Create a Search Index and load with documents](tutorial-javascript-create-load-index.md)
* [Deploy your Static Web App](tutorial-javascript-deploy-static-web-app.md)
