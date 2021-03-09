---
title: JavaScript tutorial create and load index
titleSuffix: Azure Cognitive Search
description: Learn how to import data into a single Azure Cognitive Search index with JavaScript using the npm SDK @azure/search-documents.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 03/09/2021
ms.custom: devx-track-js
---

# Tutorial: Create and load Search Index with JavaScript

Import data into a single Azure Cognitive Search index with JavaScript using the npm SDK [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents).

The sample application for this tutorial builds a website to search through a catalog of books. The search experience includes: 

* Search – provides search functionality for the application.
* Suggest – provides suggestions as the user is typing in the search bar.
* Document Lookup – looks up a document by id to retrieve all of its contents for the details page.

You can load data into the Search resource from:

* Upload the CSV list directly into the Search Index - this tutorial uses this method.
* Or an Azure database you plan to update and maintain.

## Set up your development environment

Install the following for your local development environment. 

- [Node.js 12+ and npm](https://nodejs.org/en/download) 
- [Visual Studio Code](https://code.visualstudio.com/) and the following extensions
- [Azure CLI]()

## Get an Azure Search resource 

You can complete this tutorial by:

* Creating your own Search resource and Index. Those steps are provides in this article.
* Or [use an existing Search resource and Index](#use-an-existing-resource). 

### Use an existing resource

To use an existing resource: 

1. Copy the following setting values:

    "SearchServiceName": "azs-playground",
    "SearchIndexName": "good-books",
    "SearchAPIKey": "03097125077C18172260E41153975439"

1. Skip to the next section of the tutorial.

### Create your own resource

Create a new Search resource with the Azure CLI.  

1. Open an Azure CLI environment.
    1. Login to the Azure CLI on your local development environment with the following command 

        ```azurecli
        az login
        ```

    1. Or use the [Azure Cloud Shell](https://ms.portal.azure.com/#cloudshell/):

1. Run the Azure command, [az search service create](/cli/azure/search/service#az_search_service_create), to create a Search resource, filling in your own values for:

    * YOUR-SUBSCRIPTION-ID-OR-NAME
    * YOUR-RESOURCE-GROUP
    * YOUR-RESOURCE-NAME

    ```azurecli
    az search service create \
        --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
        --resource-group YOUR-RESOURCE-GROUP \
        --name YOUR-RESOURCE_NAME \
        --location westus \
        --sku Standard
    ```

1. Keep the value of `YOUR-RESOURCE_NAME`, you will use this later in the tutorial. 

## Download the book catalog to your local development environment



## Bulk load the book catalog CSV into the Search Index

This tutorial uploads directly into the Search Index from the books.csv file. 

1. In a bash terminal, create a subdirectory, initialize it, and open it in Visual Studio Code:

    ```javascript
    mkdir bulk_upload && \
      cd bulk_upload && \
      npm init -y && \
      npm install @azure/search-documents csv-parser && \
      touch bulk_upload.js && \
      code .
    ```

1. In Visual Studio Code, create a new file called `books.csv` and copy the data from [goodbooks-10k](https://raw.githubusercontent.com/zygmuntz/goodbooks-10k/master/books.csv) into the file. 

1. In Visual Studio Code, open the `bulk_upload.js` file and add the following code:

    ```javascript
    const fs = require('fs');
    const parse = require('csv-parser')
    const { finished } = require('stream/promises');
    const { SearchClient, SearchIndexClient, AzureKeyCredential } = require("@azure/search-documents");

    const SEARCH_ENDPOINT = "https://YOUR-REOURCE-NAME.search.windows.net";
    const SEARCH_KEY = "YOUR-RESOURCE-KEY";

    const SEARCH_INDEX_NAME = "good-books";
    const csvFile = './books.csv'    
    const schema = require("./books.schema.json");

    const client = new SearchClient(
        SEARCH_ENDPOINT,
        SEARCH_INDEX_NAME,
        new AzureKeyCredential( SEARCH_KEY)
    );
    const clientIndex = new SearchIndexClient(
        SEARCH_ENDPOINT,
        new AzureKeyCredential(SEARCH_KEY)
    );


    // insert each row into ...
    const insertData = async (readable) =>{
        
        let i = 0;
        
        for await (const row of readable) {
            console.log(`${i++} = ${JSON.stringify(row)}`);
            
            const indexItem = {
                "id": row.book_id,
                "goodreads_book_id": row.goodreads_book_id,
                "best_book_id": row.best_book_id,
                "work_id": row.work_id,
                "books_count": !row.books_count ? 0 : parseInt(row.books_count),
                "isbn": row.isbn,
                "isbn13": row.isbn13,
                "authors": row.authors.split(",").map(name => name.trim()),
                "original_publication_year": !row.original_publication_year ? 0: parseInt(row.original_publication_year),
                "original_title": row.original_title,
                "title": row.title,
                "language_code": row.language_code,
                "average_rating": !row.average_rating ? 0 : parseInt(row.average_rating),
                "ratings_count": !row.ratings_count ? 0 : parseInt(row.ratings_count),
                "work_ratings_count": !row.work_ratings_count ? 0 : parseInt(row.work_ratings_count),
                "work_text_reviews_count": !row.work_text_reviews_count ? 0 : parseInt(row.work_text_reviews_count),
                "ratings_1": !row.ratings_1 ? 0 : parseInt(row.ratings_1),
                "ratings_2": !row.ratings_2 ? 0 : parseInt(row.ratings_2),
                "ratings_3": !row.ratings_3 ? 0 : parseInt(row.ratings_3),
                "ratings_4": !row.ratings_4 ? 0 : parseInt(row.ratings_4),
                "ratings_5": !row.ratings_5 ? 0 : parseInt(row.ratings_5),
                "image_url": row.image_url,
                "small_image_url": row.small_image_url
            }
           

            const uploadResult = await client.uploadDocuments([indexItem]);
        }
        
    }
    const bulkInsert = async () => {
        
       
        // read file, parse CSV, each row is a chunk
        const readable = fs
        .createReadStream(csvFile)
        .pipe(parse());

        // Pipe rows to insert function
        await insertData(readable)
    }
    async function createIndex() {
      
        schema.name = SEARCH_INDEX_NAME;
        const result = await clientIndex.createIndex(schema);
      
        console.log(result);
    }
        
        
    const main = async ()=> {

        await createIndex();
        console.log("index created");
        
        
        await bulkInsert();

    }

        
    main()
        .then(() => console.log('done'))
        .catch((err) => {
            console.log(`done +  failed ${err}`)
        });
    ```


