---
title: Tutorial add search to a web app
titleSuffix: Azure Cognitive Search
description: Learn technical and conceptual overview of adding Search to a web site. 
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 03/09/2021
ms.custom: devx-track-js
---

# 1. Overview - Add search to a website

This tutorial builds a website to search through a catalog of books. 

The application is available: 
* [Sample application](https://aka.ms/search-react-template)
* [Demo website - aka.ms/azs-good-books](https://aka.ms/azs-good-books)

## What does the sample website do? 

This sample website provides access to a catalog of 10,000 books. A user can search the catalog by entering text in the search bar. While the user enters text, the website uses the Search Index's suggest feature to complete the text. Once the search finishes, the list of books is displayed with a portion of the details. A user can select a book to see all the details, stored in the Search Index, of the book. 

:::image type="content" source="./media/tutorial-javascript-overview/cognitive-search-enabled-book-website.png" alt-text="This sample website provides access to a catalog of 10,000 books. A user can search the catalog by entering text in the search bar. While the user enters text, the website uses the Search Index's suggest feature to complete the text. Once the search finishes, the list of books is displayed with a portion of the details. A user can select a book to see all the details, stored in the Search Index, of the book.":::

The search experience includes: 

* Search – provides search functionality for the application.
* Suggest – provides suggestions as the user is typing in the search bar.
* Document Lookup – looks up a document by ID to retrieve all of its contents for the details page.

## How is the sample website organized?

The sample website includes the following:

* React client (presentation layer) - calls the Function app
* Function app (business layer) - calls the Azure Search API using JavaScript SDK 

The directory containing both apps with have the following subdirectories:

* \api - Function App with its own package.json
* \public - React app public assets
* \src - React app source code
* \scripts - JavaScript script for bulk import

## Set up your development environment

Install the following for your local development environment. 

- [Node.js 12+ and npm](https://nodejs.org/en/download)
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) and the following extensions
    - [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)
    - [Azure Cognitive Search](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecognitivesearch)
    - [Azure Static web apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) 


## Download the sample app

1. Create your GitHub fork of the sample rep by opening this GitHub link: 
    
    * [https://github.com/dereklegenzoff/azure-search-react-template/generate](https://github.com/dereklegenzoff/azure-search-react-template/generate)

    Complete the fork process in your web browser with your GitHub account. 

1. At a bash terminal, download the sample application. Replace `YOUR-GITHUB-ALIAS` with your GitHub alias. 

    ```bash
    git clone https://github.com/YOUR-GITHUB-ALIAS/azure-search-react-template
    ```

1. In Visual Studio Code, open the `azure-search-react-template` project inside the repository.

1. Add a subdirectory named `scripts`. 

## Create or use an existing Search Index

You can either create your own Search Index or use the existing Sample's Index. 

* Create your own Search Index: If you want to create your own Search Index, [go to the next step](tutorial-javascript-create-load-index.md) in the tutorial, to complete the bulk insert into a new Search Index. 
* Use Sample's Search Index, [go to the deployment step](tutorial-javascript-deploy-static-web-app.md).

## Next steps

* [Create a Search Index and load with data](tutorial-javascript-create-load-index.md)
* [Deploy your static web app](tutorial-javascript-deploy-static-web-app.md)
