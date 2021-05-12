---
title: ".NET tutorial: Search integration overview"
titleSuffix: Azure Cognitive Search
description: Technical overview and setup for adding search to a website and deploying to Azure Static Web App with .NET. 
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 04/23/2021
ms.custom: devx-track-csharp
ms.devlang: dotnet
---

# 1 - Overview of adding search to a website with .NET

This tutorial builds a website to search through a catalog of books then deploys the website to an Azure Static Web App. 

The application is available: 
* [Sample](https://github.com/azure-samples/azure-search-dotnet-samples/tree/master/search-website)
* [Demo website - aka.ms/azs-good-books](https://aka.ms/azs-good-books)

## What does the sample do? 

This sample website provides access to a catalog of 10,000 books. A user can search the catalog by entering text in the search bar. While the user enters text, the website uses the Search Index's suggest feature to complete the text. Once the query finishes, the list of books is displayed with a portion of the details. A user can select a book to see all the details, stored in the Search Index, of the book. 

:::image type="content" source="./media/tutorial-javascript-overview/cognitive-search-enabled-book-website.png" alt-text="This sample website provides access to a catalog of 10,000 books. A user can search the catalog by entering text in the search bar. While the user enters text, the website uses the Search Index's suggest feature to complete the text. Once the search finishes, the list of books is displayed with a portion of the details. A user can select a book to see all the details, stored in the Search Index, of the book.":::

The search experience includes: 

* Search – provides search functionality for the application.
* Suggest – provides suggestions as the user is typing in the search bar.
* Document Lookup – looks up a document by ID to retrieve all of its contents for the details page.

## How is the sample organized?

The [sample](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/search-website) includes the following:

|App|Purpose|GitHub<br>Repository<br>Location|
|--|--|--|
|Client|React app (presentation layer) to display books, with search. It calls the Azure Function app. |[/search-website/src](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/search-website/src)|
|Server|Azure .NET Function app (business layer) - calls the Azure Cognitive Search API using .NET SDK |[/search-website/api](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/search-website/api)|
|Bulk insert|.NET file to create the index and add documents to it.|[/search-website/bulk-insert](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/search-website/bulk-insert)|

## Set up your development environment

Install the following for your local development environment. 

- [.NET 3](https://dotnet.microsoft.com/download/dotnet/5.0)  
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) and the following extensions
    - [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)
    - [Azure Cognitive Search 0.2.0+](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecognitivesearch)
    - [Azure Static Web App](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) 
- Optional:
    - This tutorial doesn't run the Azure Function API locally but if you intend to run it locally, you need to install [azure-functions-core-tools](/azure/azure-functions/functions-run-local?tabs=linux%2Ccsharp%2Cbash#install-the-azure-functions-core-tools).

## Fork and clone the search sample with git

Forking the sample repository is critical to be able to deploy the Static Web App. The web apps determine the build actions and deployment content based on your own GitHub fork location. Code execution in the Static Web App is remote, with Azure Static Web Apps reading from the code in your forked sample.

1. On GitHub, fork the [sample repository](https://github.com/Azure-Samples/azure-search-dotnet-samples). 

    Complete the fork process in your web browser with your GitHub account. This tutorial uses your fork as part of the deployment to an Azure Static Web App. 

1. At a bash terminal, download the sample application to your local computer. 

    Replace `YOUR-GITHUB-ALIAS` with your GitHub alias. 

    ```bash
    git clone https://github.com/YOUR-GITHUB-ALIAS/azure-search-dotnet-samples
    ```

1. In Visual Studio Code, open your local folder of the cloned repository. The remaining tasks are accomplished from Visual Studio Code, unless specified.

## Create a resource group for your Azure resources

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 
1. In the Side bar, **right-click on your Azure subscription** under the `Resource Groups` area and select **Create resource group**.

    :::image type="content" source="./media/tutorial-javascript-overview/visual-studio-code-create-resource-group.png" alt-text="In the Side bar, **right-click on your Azure subscription** under the `Resource Groups` area and select **Create resource group**.":::
1. Enter a resource group name, such as `cognitive-search-website-tutorial`. 
1. Select a location close to you.
1. When you create the Cognitive Search and Static Web App resources, later in the tutorial, use this resource group. 

    Creating a resource group gives you a logical unit to manage the resources, including deleting them when you are finished using them.

## Next steps

* [Create a Search Index and load with documents](tutorial-csharp-create-load-index.md)
* [Deploy your Static Web App](tutorial-csharp-deploy-static-web-app.md)
