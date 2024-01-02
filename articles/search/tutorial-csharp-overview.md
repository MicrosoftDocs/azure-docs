---
title: "Add search to web sites (.NET tutorial)"
titleSuffix: Azure AI Search
description: Technical overview and setup for adding search to a website and deploying to Azure Static Web App with .NET.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom:
  - devx-track-csharp
  - devx-track-dotnet
  - ignite-2023
ms.devlang: csharp
---

# 1 - Overview of adding search to a website with .NET

This tutorial builds a website to search through a catalog of books and then deploys the website to an Azure Static Web App. 

## What does the sample do?

[!INCLUDE [tutorial-overview](includes/tutorial-add-search-website-what-sample-does.md)]

## How is the sample organized?

The [sample code](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/main/search-website-functions-v4) includes the following:

|App|Purpose|GitHub<br>Repository<br>Location|
|--|--|--|
|Client|React app (presentation layer) to display books, with search. It calls the Azure Function app. |[/search-website-functions-v4/client](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/main/search-website-functions-v4/client)|
|Server|Azure .NET Function app (business layer) - calls the Azure AI Search API using .NET SDK |[/search-website-functions-v4/api](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/main/search-website-functions-v4/api)|
|Bulk insert|.NET file to create the index and add documents to it.|[/search-website-functions-v4/bulk-insert](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/main/search-website-functions-v4/bulk-insert)|

## Set up your development environment

Install the following for your local development environment. 

- [.NET 6](https://dotnet.microsoft.com/download/dotnet/6.0)  
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) and the following extensions
    - [Azure Static Web App](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) 
    - Use the integrated terminal for command line operations.
- Optional:
    - This tutorial doesn't run the Azure Function API locally but if you intend to run it locally, you need to install [azure-functions-core-tools](../azure-functions/functions-run-local.md?tabs=linux%2ccsharp%2cbash#install-the-azure-functions-core-tools).

## Fork and clone the search sample with git

Forking the sample repository is critical to be able to deploy the Static Web App. The web apps determine the build actions and deployment content based on your own GitHub fork location. Code execution in the Static Web App is remote, with Azure Static Web Apps reading from the code in your forked sample.

1. On GitHub, fork the [sample repository](https://github.com/Azure-Samples/azure-search-dotnet-samples). 

    Complete the fork process in your web browser with your GitHub account. This tutorial uses your fork as part of the deployment to an Azure Static Web App. 

1. At a Bash terminal, download your forked sample application to your local computer. 

    Replace `YOUR-GITHUB-ALIAS` with your GitHub alias. 

    ```bash
    git clone https://github.com/YOUR-GITHUB-ALIAS/azure-search-dotnet-samples
    ```

1. At the same Bash terminal, go into your forked repository for this website search example:

    ```bash
    cd azure-search-dotnet-samples
    ```

1. Use the Visual Studio Code command, `code .` to open your forked repository. The remaining tasks are accomplished from Visual Studio Code, unless specified.

    ```bash
    code .
    ```

## Create a resource group for your Azure resources

[!INCLUDE [tutorial-create-resource-group](includes/tutorial-add-search-website-create-resource-group.md)]

## Next steps

* [Create a Search Index and load with documents](tutorial-csharp-create-load-index.md)
* [Deploy your Static Web App](tutorial-csharp-deploy-static-web-app.md)
