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

This tutorial builds a website to search through a catalog of books. The search experience includes: 

* Search – provides search functionality for the application.
* Suggest – provides suggestions as the user is typing in the search bar.
* Document Lookup – looks up a document by ID to retrieve all of its contents for the details page.

* [Sample application](https://aka.ms/search-react-template)

## What does the sample website do? 

This sample website provides access to a catalog of 10,000 books. A user can search the catalog by entering text in the search bar. While the user enters text, the website uses the Search Index's suggest feature to complete the text. Once the search finishes, the list of books is displayed with a portion of the details. A user can select a book to see all the details, stored in the Search Index, of the book. 

:::image type="content" source="./media/tutorial-javascript-overview/cognitive-search-enabled-book-website.png" alt-text="This sample website provides access to a catalog of 10,000 books. A user can search the catalog by entering text in the search bar. While the user enters text, the website uses the Search Index's suggest feature to complete the text. Once the search finishes, the list of books is displayed with a portion of the details. A user can select a book to see all the details, stored in the Search Index, of the book.":::

You can find the demo website at: [aka.ms/azs-good-books](https://aka.ms/search-react-template).

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
* Or [use an existing sample application already created for you.](https://aka.ms/search-react-template)


## Next steps

1. [Create a Search Index and load with data](tutorial-javascript-create-load-index.md)
2. [Create an Azure Function app to provide queries into Search Index](tutorial-javascript-create-function-app.md)

