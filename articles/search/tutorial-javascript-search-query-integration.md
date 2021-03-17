---
title: JavaScript Search SDK search queries
titleSuffix: Azure Cognitive Search
description: Understand the JavaScript SDK Search queries used in the Search-enabled website
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 03/09/2021
ms.custom: devx-track-js
---

# 4. Search queries integration for the search-enabled website

The sample web site provides search across the books catalog. The Azure Cognitive Search queries are implemented in the Azure Function app. Those Function APIs are called in the React app. This allows the security of the Search keys to stay in the Functions instead of the client app, where they could be seen. 

## Azure SDK @azure/search-documents 

The Function app uses the Azure SDK for Cognitive Search:

* NPM: [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* Reference Documentation: [Client Library](/javascript/api/overview/azure/search-documents-readme)

The Function app authenticates through the SDK to the cloud-based Search API using the Search resource name, resource key, and index name. The secrets are stored in the Static Web App settings and pulled in to the Function as environment variables. 

## Configure secrets in a configuration file

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/api/config.js" highlight="3,4" :::

## Azure Function: Search the catalog

The `Search` API takes a search term and searches across the documents in the Search Index, returning a list of matches. 

Routing for the Search API is contained in the [function.json](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website/api/Search/function.json) bindings.


### Azure Function to query Search Index

The Azure Function pulls in the Search configuration information, and fulfills the query.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/api/Search/index.js" highlight="4-9, 75" :::

### JavaScript React code to call Azure Function

Call the Azure Function in the React client with the following code. 

:::code language="javascript" source="~/azure-search-javascript-samples/search-website/src/pages/Search/Search.js" highlight="40-51" :::

## Azure Function: Suggestions from the catalog

The `Suggest` API takes a search term while a user is typing and suggests search terms such as book titles and authors across the documents in the Search Index, returning a small list of matches. 

```javascript
// get suggestions
const suggestions = await client.suggest(q, suggester, {top: parseInt(top)});
```

The Search suggester, `sg`, was defined in the schema file used during bulk upload and defined in [good-books-index.json](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website/bulk-insert/good-books-index.json).

Routing for the Suggest API is contained in the [function.json](https://github.com/dereklegenzoff/azure-search-react-template/blob/master/api/Search/function.json) bindings.

```javascript
const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");

const indexName = process.env["SearchIndexName"];
const apiKey = process.env["SearchApiKey"];
const searchServiceName = process.env["SearchServiceName"];

// Create a SearchClient to send queries
const client = new SearchClient(
    `https://` + searchServiceName + `.search.windows.net/`,
    indexName,
    new AzureKeyCredential(apiKey)
);

module.exports = async function (context, req) {
    
    // Check Search auth variables
    if (!indexName || !apiKey || !searchServiceName) throw Error("Search index configuration missing");

    // Reading inputs from HTTP Request
    // Allows GET and POST methods
    const q = (req.query.q || (req.body && req.body.q));
    const top = (req.query.top || (req.body && req.body.top));
    const suggester = (req.query.suggester || (req.body && req.body.suggester));
    
    // Let's get the top 5 suggestions for that search term
    const suggestions = await client.suggest(q, suggester, {top: parseInt(top)});
    //const suggestions = await client.autocomplete(q, suggester, {top: parseInt(top)});

    context.log(suggestions);

    /* Defaults to 200 */
    context.res = {
        // status: 200, 
        headers: {
            "Content-type": "application/json"
        },
        body: { suggestions: suggestions.results}
    };
};
```

## Client: Suggestions from the catalog

This function API is called in the React app at `\src\components\SearchBar\SearchBar.js` as part of component initialization:

```javascript
axios.post( '/api/suggest', body)
    .then(response => {
        console.log(JSON.stringify(response.data))
    } )
    .catch(error => {
        console.log(error);
    });
```

## Azure Function: Get specific document 

The `Lookup` API takes a id and returns the document object from the Search Index. 

```javascript
// lookup exact document
const document = await client.getDocument(id);
```

Routing for the Lookup API is contained in the [function.json](https://github.com/dereklegenzoff/azure-search-react-template/blob/master/api/Lookup/function.json) bindings.

```javascript
const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");

const indexName = process.env["SearchIndexName"];
const apiKey = process.env["SearchApiKey"];
const searchServiceName = process.env["SearchServiceName"];

// Create a SearchClient to send queries
const client = new SearchClient(
    `https://` + searchServiceName + `.search.windows.net/`,
    indexName,
    new AzureKeyCredential(apiKey)
);

module.exports = async function (context, req) {
    
    // Check Search auth variables
    if (!indexName || !apiKey || !searchServiceName) throw Error("Search index configuration missing");

    // Reading inputs from HTTP Request
    // Allows GET and POST methods
    const id = (req.query.id || (req.body && req.body.id));
    
    // Returning the document with the matching id
    const document = await client.getDocument(id)

    context.log(document);

    /* Defaults to 200 */
    context.res = {
        // status: 200, 
        headers: {
            "Content-type": "application/json"
        },
        body: { document: document}
    };
    
};
```

## Client: Get specific document 

This function API is called in the React app at `\src\pages\Details\Detail.js` as part of component initialization:

```javascript
axios.get('/api/lookup?id=' + id)
    .then(response => {
    const doc = response.data.document;
    })
    .catch(error => {
    console.log(error);
    });
```

## Next steps

* [Index Azure SQL data](search-indexer-tutorial.md)
