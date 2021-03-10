---
title: JavaScript tutorial adds search to a web app
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

# Tutorial: Add search to a website

This tutorial builds a website to search through a catalog of books. 

The application is available: 
* [Sample application](https://aka.ms/search-react-template)
* [Demo website - aka.ms/azs-good-books](aka.ms/azs-good-books)

## What does the sample website do? 

This sample website provides access to a catalog of 10,000 books. A user can search the catalog by entering text in the search bar. While the user enters text, the website uses the Search Index's suggest feature to complete the text. Once the search finishes, the list of books is displayed with a portion of the details. A user can select a book to see all the details, stored in the Search Index, of the book. 

:::image type="content" source="./media/tutorial-javascript-overview/cognitive-search-enabled-book-website.png" alt-text="This sample website provides access to a catalog of 10,000 books. A user can search the catalog by entering text in the search bar. While the user enters text, the website uses the Search Index's suggest feature to complete the text. Once the search finishes, the list of books is displayed with a portion of the details. A user can select a book to see all the details, stored in the Search Index, of the book.":::

The search experience includes: 

* Search – provides search functionality for the application.
* Suggest – provides suggestions as the user is typing in the search bar.
* Document Lookup – looks up a document by ID to retrieve all of its contents for the details page.

## How is the sample website organized?

The sample website includes the following:

* React client (presentation layer)
* Function app (business layer) - separating out Azure Search API calls and securing the Search key

The website is deployed as a Static web app, including both the React and Function apps together in a single repository, using GitHub Actions. 

## Create or use a sample Search Index

You can complete this tutorial by:

* Creating your own Search resource and Index. Those steps are provided in the [next section of the tutorial](tutorial-javascript-create-load-index.md).
* Or [use an existing Search resource and Index](#use-an-existing-resource). 

    To use an existing resource, copy the following setting values and skip forward to [create your Azure Function]():

    ```bash
    "SearchServiceName": "azs-playground",
    "SearchIndexName": "good-books",
    "SearchAPIKey": "03097125077C18172260E41153975439"
    ```

## Create or use a web app

You can complete the web app by: 

* Creating the Azure Function app with your Search queries, and creating the React client app.
* Or [use the sample application already created for you.](#use-the-sample-application)
    
### Use the sample application

1. Open the sample GitHub repository in a browser: [https://aka.ms/search-react-template](https://aka.ms/search-react-template).
1. Fork the repository by selecting the "Use this template" button. 

    :::image type="content" source="./media/tutorial-javascript-overview/20201008-use-template.png" alt-text="Fork the repository, https://aka.ms/search-react-template, by selecting the `Use this template` button.":::

    This will create your own copy of the code that you can deploy and edit as you please.

## Next steps

1. [Create a Search Index and load with data](tutorial-javascript-create-load-index.md)
2. [Create an Azure Function app to provide queries into Search Index](tutorial-javascript-create-function-app.md)

