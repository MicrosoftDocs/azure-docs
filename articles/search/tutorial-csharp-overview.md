---
title: "Add search to web sites (.NET tutorial)"
titleSuffix: Azure AI Search
description: Technical overview and setup for adding search to a website and deploying to Azure Static Web App with .NET.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 08/16/2024
ms.custom:
  - devx-track-csharp
  - devx-track-dotnet
  - ignite-2023
ms.devlang: csharp
---

# Step 1 - Overview of adding search to a static web app with .NET

This tutorial builds a website to search through a catalog of books and then deploys the website to an Azure static web app. 

## What does the sample do?

This sample website provides access to a catalog of 10,000 books. You can search the catalog by entering text in the search bar. While you enter text, the website uses the search index's [\suggestion feature to autocomplete the text. Once the query finishes, the list of books is displayed with a portion of the details. You can select a book to see all the details, stored in the search index, of the book. 

:::image type="content" source="media/tutorial-csharp-overview/cognitive-search-enabled-book-website-2.png" alt-text="Screenshot of the sample app in a browser window.":::

The search experience includes:

- [Search](search-query-create.md) – provides search functionality for the application.
- [Suggest](search-add-autocomplete-suggestions.md) – provides suggestions as the user is typing in the search bar.
- [Facets and filters](search-faceted-navigation.md) - provides a faceted navigation structure that filters by author or language.
- [Paginated results](search-pagination-page-layout.md) - provides paging controls for scrolling through results.
- [Document Lookup](search-query-overview.md#document-look-up) – looks up a document by ID to retrieve all of its contents for the details page.

## How is the sample organized?

The [sample code](https://github.com/Azure-Samples/azure-search-static-web-app) includes the following components:

|App|Purpose|GitHub<br>Repository<br>Location|
|--|--|--|
|client|React app (presentation layer) to display books, with search. It calls the Azure Function app. |[/azure-search-static-web-app/client](https://github.com/Azure-Samples/azure-search-static-web-app/tree/main/client)|
|api|Azure .NET Function app (business layer) - calls the Azure AI Search API using .NET SDK |[/azure-search-static-web-app/api](https://github.com/Azure-Samples/azure-search-static-web-app/tree/main/api)|
|bulk insert|.NET project to create the index and add documents to it.|[/azure-search-static-web-app/bulk-insert](https://github.com/Azure-Samples/azure-search-static-web-app/tree/main/bulk-insert)|

## Set up your development environment

Create services and install the following software for your local development environment. 

- [Azure AI Search](search-create-service-portal.md), any region or tier
- [.NET 6](https://dotnet.microsoft.com/download/dotnet/6.0) or later
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/)
- [C# Dev Tools extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit)
- [Azure Static Web App extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) 

This tutorial doesn't run the Azure Function API locally but if you intend to run it locally, install [azure-functions-core-tools](../azure-functions/functions-run-local.md?tabs=linux%2ccsharp%2cbash#install-the-azure-functions-core-tools).

## Fork and clone the search sample with git

Forking the sample repository is critical to be able to deploy the Static Web App. The web apps determine the build actions and deployment content based on your own GitHub fork location. Code execution in the Static Web App is remote, with Azure Static Web Apps reading from the code in your forked sample.

1. On GitHub, fork the [azure-search-static-web-app repository](https://github.com/Azure-Samples/azure-search-static-web-app). 

    Complete the [fork process](https://docs.github.com/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) in your web browser with your GitHub account. This tutorial uses your fork as part of the deployment to an Azure Static Web App. 

1. At a Bash terminal, download your forked sample application to your local computer. 

    Replace `YOUR-GITHUB-ALIAS` with your GitHub alias. 

    ```bash
    git clone https://github.com/YOUR-GITHUB-ALIAS/azure-search-static-web-app.git
    ```

1. At the same Bash terminal, go into your forked repository for this website search example:

    ```bash
    cd azure-search-static-web-app
    ```

1. Use the Visual Studio Code command, `code .` to open your forked repository. The remaining tasks are accomplished from Visual Studio Code, unless specified.

    ```bash
    code .
    ```

## Next steps

- [Create an index and load it with documents](tutorial-csharp-create-load-index.md)
- [Deploy your Static Web App](tutorial-csharp-deploy-static-web-app.md)
