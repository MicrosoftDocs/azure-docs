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

## Search the catalog

The `Search` API takes a search term and searches across the documents in the Search Index, returning a list of matches. 

```javascript
// send the search request
const searchResults = await client.search(q, searchOptions);
```

Routing for the Search API is contained in the [function.json](https://github.com/dereklegenzoff/azure-search-react-template/blob/master/api/Suggest/function.json) bindings.

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

// creates filters in odata syntax
const createFilterExpression = (filterList, facets) => {
    let i = 0;
    let filterExpressions = [];

    while (i < filterList.length) {
        let field = filterList[i].field;
        let value = filterList[i].value;

        if (facets[field] === 'array') {
            filterExpressions.push(`${field}/any(t: search.in(t, '${value}', ','))`);
        } else {
            filterExpressions.push(`${field} eq '${value}'`);
        }
        i += 1;
    }

    return filterExpressions.join(' and ');
}

// reads in facets and gets type
// array facets should include a * at the end 
// this is used to properly create filters
const readFacets = (facetString) => {
    let facets = facetString.split(",");
    let output = {};
    facets.forEach(function (f) {
        if (f.indexOf('*') > -1) {
            output[f.replace('*', '')] = 'array';
        } else {
            output[f] = 'string';
        }
    })

    return output;
}

module.exports = async function (context, req) {

    try {
        if (!indexName || !apiKey || !searchServiceName) throw Error("Search index configuration missing");

        // Reading inputs from HTTP Request
        let q = (req.query.q || (req.body && req.body.q));
        const top = (req.query.top || (req.body && req.body.top));
        const skip = (req.query.skip || (req.body && req.body.skip));
        const filters = (req.query.filters || (req.body && req.body.filters));
        const facets = readFacets(process.env["SearchFacets"]);


        // If search term is empty, search everything
        if (!q || q === "") {
            q = "*";
        }

        // Creating SearchOptions for query
        let searchOptions = {
            top: top,
            skip: skip,
            includeTotalCount: true,
            facets: Object.keys(facets),
            filter: createFilterExpression(filters, facets)
        };

        // Sending the search request
        const searchResults = await client.search(q, searchOptions);

        // Getting results for output
        const output = [];
        for await (const result of searchResults.results) {
            output.push(result);
        }

        // Logging search results
        context.log(searchResults.count);

        // Creating the HTTP Response
        context.res = {
            // status: 200, /* Defaults to 200 */
            headers: {
                "Content-type": "application/json"
            },
            body: {
                count: searchResults.count,
                results: output,
                facets: searchResults.facets
            }
        };
    } catch (error) {
        context.log.error(error);

        // Creating the HTTP Response
        context.res = {
            status: 400,
            body: {
                innerStatusCode: error.statusCode || error.code,
                error: error.details || error.message
            }
        };
    }
};
```

This function API is called in the React app at `\src\pages\Search\Search.js` as part of component initialization: 

```javascript
axios.post( '/api/search', body)
    .then(response => {
        console.log(JSON.stringify(response.data))
        setResults(response.data.results);
        setFacets(response.data.facets);
        setResultCount(response.data.count);
        setIsLoading(false);
    } )
    .catch(error => {
        console.log(error);
        setIsLoading(false);
    });
```

## Suggestions from the catalog

The `Suggest` API takes a search term while a user is typing and suggests search terms such as book titles and authors across the documents in the Search Index, returning a small list of matches. 

```javascript
// get suggestions
const suggestions = await client.suggest(q, suggester, {top: parseInt(top)});
```

The Search suggester, `sg`, was defined in the schema file used during [bulk upload](tutorial-javascript-create-load-index.md#add-a-schema-definition-file).

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

## Lookup a specific document from the Search Index

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
