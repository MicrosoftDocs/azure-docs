---
title: 'Quickstart: Create a search index in Node.js using REST APIs'
titleSuffix: Azure Cognitive Search
description: In this Node.js quickstart, learn how to create an index, load data, and run queries on Azure Cognitive Search using JavaScript and the REST APIs.

author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.devlang: nodejs
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 06/23/2020
---
# Quickstart: Create an Azure Cognitive Search index in Node.js using REST APIs
> [!div class="op_single_selector"]
> * [JavaScript](search-get-started-nodejs.md)
> * [C#](search-get-started-dotnet.md)
> * [Portal](search-get-started-portal.md)
> * [PowerShell](search-create-index-rest-api.md)
> * [Python](search-get-started-python.md)
> * [Postman](search-get-started-postman.md)

Create a Node.js application that that creates, loads, and queries an Azure Cognitive Search index. This article demonstrates how to create the application step-by-step. Alternatively, you can [download the source code and data](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/quickstart/) and run the application from the command line.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

We used the following software and services to build and test this quickstart:

+ [Node.js](https://nodejs.org)

+ [NPM](https://www.npmjs.com) should be installed by Node.js

+ A sample index structure and matching documents are provided in this article, or from the [**quickstart** directory of the repo](https://github.com/Azure-Samples/azure-search-javascript-samples/)

+ [Create an Azure Cognitive Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart.

Recommended:

* [Visual Studio Code](https://code.visualstudio.com)

* [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions for VSCode.

<a name="get-service-info"></a>

## Get keys and URLs

Calls to the service require a URL endpoint and an access key on every request. A search service is created with both, so if you added Azure Cognitive Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the name of your search service. You can confirm your service name by reviewing the endpoint URL. If your endpoint URL were `https://mydemo.search.windows.net`, your service name would be `mydemo`.

2. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

    Get the query key as well. It's a best practice to issue query requests with read-only access.

![Get the service name and admin and query keys](media/search-get-started-nodejs/service-name-and-keys.png)

All requests require an api-key in the header of every request sent to your service. A valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## Set up your environment

Begin by opening a Powershell console or other environment in which you've installed Node.js.

1. Create a development directory, giving it the name `quickstart` :

    ```powershell
    mkdir quickstart
    cd quickstart
    ```

2. Initialize an empty project with NPM by running `npm init`. Accept the default values, except for the License, which you should set to "MIT". 

1. Add packages that will be depended on by the code and aid in development:

    ```powershell
    npm install nconf node-fetch
    npm install --save-dev eslint eslint-config-prettier eslint-config-airbnb-base eslint-plugin-import prettier
    ```

4. Confirm that you've configured the projects and its dependencies by checking that your  **package.json** file looks similar to the following:

    ```json
    {
      "name": "quickstart",
      "version": "1.0.0",
      "description": "Azure Cognitive Search Quickstart",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [
        "Azure",
        "Azure_Search"
      ],
      "author": "Your Name",
      "license": "MIT",
      "dependencies": {
        "nconf": "^0.10.0",
        "node-fetch": "^2.6.0"
      },
      "devDependencies": {
        "eslint": "^6.1.0",
        "eslint-config-airbnb-base": "^13.2.0",
        "eslint-config-prettier": "^6.0.0",
        "eslint-plugin-import": "^2.18.2",
        "prettier": "^1.18.2"
      }
    }
    ```

5. Create a file **azure_search_config.json** to hold your search service data:

    ```json
    {
        "serviceName" : "[SEARCH_SERVICE_NAME]",
        "adminKey" : "[ADMIN_KEY]",
        "queryKey" : "[QUERY_KEY]",
        "indexName" : "hotels-quickstart"
    }
    ```

Replace the `[SERVICE_NAME]` value with the name of your search service. Replace `[ADMIN_KEY]` and `[QUERY_KEY]` with the key values you recorded earlier. 

## 1 - Create index 

Create a file **hotels_quickstart_index.json**.  This file defines how Azure Cognitive Search works with the documents you'll be loading in the next step. Each field will be identified by a `name` and have a specified `type`. Each field also has a series of index attributes that specify whether Azure Cognitive Search can search, filter, sort, and facet upon the field. Most of the fields are simple data types, but some, like `AddressType` are complex types that allow you to create rich data structures in your index.  You can read more about [supported data types](https://docs.microsoft.com/rest/api/searchservice/supported-data-types) and [index attributes](https://docs.microsoft.com/azure/search/search-what-is-an-index#index-attributes). 

Add the following to **hotels_quickstart_index.json** or [download the file](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/quickstart/hotels_quickstart_index.json). 

```json
{
    "name": "hotels-quickstart",
    "fields": [
        {
            "name": "HotelId",
            "type": "Edm.String",
            "key": true,
            "filterable": true
        },
        {
            "name": "HotelName",
            "type": "Edm.String",
            "searchable": true,
            "filterable": false,
            "sortable": true,
            "facetable": false
        },
        {
            "name": "Description",
            "type": "Edm.String",
            "searchable": true,
            "filterable": false,
            "sortable": false,
            "facetable": false,
            "analyzer": "en.lucene"
        },
        {
            "name": "Description_fr",
            "type": "Edm.String",
            "searchable": true,
            "filterable": false,
            "sortable": false,
            "facetable": false,
            "analyzer": "fr.lucene"
        },
        {
            "name": "Category",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "sortable": true,
            "facetable": true
        },
        {
            "name": "Tags",
            "type": "Collection(Edm.String)",
            "searchable": true,
            "filterable": true,
            "sortable": false,
            "facetable": true
        },
        {
            "name": "ParkingIncluded",
            "type": "Edm.Boolean",
            "filterable": true,
            "sortable": true,
            "facetable": true
        },
        {
            "name": "LastRenovationDate",
            "type": "Edm.DateTimeOffset",
            "filterable": true,
            "sortable": true,
            "facetable": true
        },
        {
            "name": "Rating",
            "type": "Edm.Double",
            "filterable": true,
            "sortable": true,
            "facetable": true
        },
        {
            "name": "Address",
            "type": "Edm.ComplexType",
            "fields": [
                {
                    "name": "StreetAddress",
                    "type": "Edm.String",
                    "filterable": false,
                    "sortable": false,
                    "facetable": false,
                    "searchable": true
                },
                {
                    "name": "City",
                    "type": "Edm.String",
                    "searchable": true,
                    "filterable": true,
                    "sortable": true,
                    "facetable": true
                },
                {
                    "name": "StateProvince",
                    "type": "Edm.String",
                    "searchable": true,
                    "filterable": true,
                    "sortable": true,
                    "facetable": true
                },
                {
                    "name": "PostalCode",
                    "type": "Edm.String",
                    "searchable": true,
                    "filterable": true,
                    "sortable": true,
                    "facetable": true
                },
                {
                    "name": "Country",
                    "type": "Edm.String",
                    "searchable": true,
                    "filterable": true,
                    "sortable": true,
                    "facetable": true
                }
            ]
        }
    ],
    "suggesters": [
        {
            "name": "sg",
            "searchMode": "analyzingInfixMatching",
            "sourceFields": [
                "HotelName"
            ]
        }
    ]
}
```
    

It's good practice to separate the specifics of a particular scenario from code that will be broadly applicable. The `AzureSearchClient` class defined in the file **AzureSearchClient.js** will know how to construct request URLs, make a request using the Fetch API, and react to the status code of the response.

Begin working on **AzureSearchClient.js** by importing the **node-fetch** package and creating a simple class. Isolate the changeable parts of the `AzureSearchClient` class by passing to its constructor the various configuration values:

```javascript
const fetch = require('node-fetch');

class AzureSearchClient {
    constructor(searchServiceName, adminKey, queryKey, indexName) {
        this.searchServiceName = searchServiceName;
        this.adminKey = adminKey;
        // The query key is used for read-only requests and so can be distributed with less risk of abuse.
        this.queryKey = queryKey;
        this.indexName = indexName;
        this.apiVersion = '2020-06-30';
    }

    // All methods go inside class body here!
}

module.exports = AzureSearchClient;
```

The first responsibility of the class is to know how to construct URLs to which to send the various requests. Build these URLs with instance methods that use the configuration data passed to the class constructor. Notice that the URL they construct is specific to an API version and must have an argument specifying that version (in this application, `2020-06-30`). 

The first of these methods will return the URL for the index itself. Add the following method inside the class body:

```javascript
getIndexUrl() { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}?api-version=${this.apiVersion}`; }

```

The next responsibility of `AzureSearchClient` is making an asynchronous request with the Fetch API. The asynchronous static method `request` takes a URL, a string specifying the HTTP method ("GET", "PUT", "POST", "DELETE"), the key to be used in the request, and an optional JSON object. The `headers` variable maps the `queryKey` (whether the admin key or the read-only query key) to the "api-key" HTTP request header. The request options always contain the `method` to be used and the `headers`. If `bodyJson` isn't `null`, the body of the HTTP request is set to the string representation of `bodyJson`. The `request` method returns the Fetch API's Promise to execute the HTTP request.

```javascript
static async request(url, method, apiKey, bodyJson = null) {
    // Uncomment the following for request details:
    /*
    console.log(`\n${method} ${url}`);
    console.log(`\nKey ${apiKey}`);
    if (bodyJson !== null) {
        console.log(`\ncontent: ${JSON.stringify(bodyJson, null, 4)}`);
    }
    */

    const headers = {
        'content-type' : 'application/json',
        'api-key' : apiKey
    };
    const init = bodyJson === null ?
        { 
            method, 
            headers
        }
        : 
        {
            method, 
            headers,
            body : JSON.stringify(bodyJson)
        };
    return fetch(url, init);
}
```

For demo purposes, just throw an exception if the HTTP request is not a success. In a real application, you would probably do some logging and diagnosis of the HTTP status code in the `response` from the search service request. 
    
```javascript
static throwOnHttpError(response) {
    const statusCode = response.status;
    if (statusCode >= 300){
        console.log(`Request failed: ${JSON.stringify(response, null, 4)}`);
        throw new Error(`Failure in request. HTTP Status was ${statusCode}`);
    }
}
```

Finally, add the methods to detect, delete, and create the Azure Cognitive Search index. These methods all have the same structure:

* Get the endpoint to which the request will be made.
* Generate the request with the appropriate endpoint, HTTP verb, API key, and, if appropriate, a JSON body. `indexExistsAsync()` and `deleteIndexAsync()` do not have a JSON body, but `createIndexAsync(definition)` does.
* `await` the response to the request.  
* Act on the status code of the response.
* Return a Promise of some appropriate value (a Boolean, `this`, or the query results). 

```javascript
async indexExistsAsync() { 
    console.log("\n Checking if index exists...");
    const endpoint = this.getIndexUrl();
    const response = await AzureSearchClient.request(endpoint, "GET", this.adminKey);
    // Success has a few likely status codes: 200 or 204 (No Content), but accept all in 200 range...
    const exists = response.status >= 200 && response.status < 300;
    return exists;
}

async deleteIndexAsync() {
    console.log("\n Deleting existing index...");
    const endpoint = this.getIndexUrl();
    const response = await AzureSearchClient.request(endpoint, "DELETE", this.adminKey);
    AzureSearchClient.throwOnHttpError(response);
    return this;
}

async createIndexAsync(definition) {
    console.log("\n Creating index...");
    const endpoint = this.getIndexUrl();
    const response = await AzureSearchClient.request(endpoint, "PUT", this.adminKey, definition);
    AzureSearchClient.throwOnHttpError(response);
    return this;
}
```

Confirm that your methods are inside the class and that you're exporting the class. The outermost scope of **AzureSearchClient.js** should be:

```javascript
const fetch = require('node-fetch');

class AzureSearchClient {
    // ... code here ...
}

module.exports = AzureSearchClient;
```

An object-oriented class was a good choice for the potentially reusable **AzureSearchClient.js** module, but isn't necessary for the main program, which you should put in a file called **index.js**. 

Create **index.js** and begin by bringing in:

* The **nconf** package, which gives you flexibility for specifying the configuration with JSON, environment variables, or command-line arguments.
* The data from the **hotels_quickstart_index.json** file.
* The `AzureSearchClient` module.

```javascript
const nconf = require('nconf');

const indexDefinition = require('./hotels_quickstart_index.json');
const AzureSearchClient = require('./AzureSearchClient.js');
```

The [**nconf** package](https://github.com/indexzero/nconf) allows you to specify configuration data in a variety of formats, such as environment variables or the command line. This sample uses **nconf** in a basic manner to read the file **azure_search_config.json** and return that file's contents as a dictionary. Using **nconf**'s `get(key)` function, you can do a quick check that the configuration information has been properly customized. Finally, the function returns the configuration:

```javascript
function getAzureConfiguration() {
    const config = nconf.file({ file: 'azure_search_config.json' });
    if (config.get('serviceName') === '[SEARCH_SERVICE_NAME]' ) {
        throw new Error("You have not set the values in your azure_search_config.json file. Change them to match your search service's values.");
    }
    return config;
}
```

The `sleep` function creates a `Promise` that resolves after a specified amount of time. Using this function allows the app to pause while waiting for asynchronous index operations to complete and become available. Adding such a delay is typically only necessary in demos, tests, and sample applications.

```javascript
function sleep(ms) {
    return(
        new Promise(function(resolve, reject) {
            setTimeout(function() { resolve(); }, ms);
        })
    );
}
```

Finally, specify and call the main asynchronous `run` function. This function calls the other functions in order, awaiting as necessary to resolve `Promise`s.

* Retrieve the configuration with the `getAzureConfiguration()` you wrote previously
* Create a new `AzureSearchClient` instance, passing in values from your configuration
* Check if the index exists and, if it does, delete it
* Create an index using the `indexDefinition` loaded from **hotels_quickstart_index.json**

```javascript
const run = async () => {
    try {
        const cfg = getAzureConfiguration();
        const client = new AzureSearchClient(cfg.get("serviceName"), cfg.get("adminKey"), cfg.get("queryKey"), cfg.get("indexName"));
        
        const exists = await client.indexExistsAsync();
        await exists ? client.deleteIndexAsync() : Promise.resolve();
        // Deleting index can take a few seconds
        await sleep(2000);
        await client.createIndexAsync(indexDefinition);
    } catch (x) {
        console.log(x);
    }
}

run();
```

Don't forget that final call to `run()`! It's the entrance point to your program when you run `node index.js` in the next step.

Notice that `AzureSearchClient.indexExistsAsync()` and `AzureSearchClient.deleteIndexAsync()` do not take parameters. These functions call `AzureSearchClient.request()` with no `bodyJson` argument. Within `AzureSearchClient.request()`, since `bodyJson === null` is `true`, the `init` structure is set to be just the HTTP verb ("GET" for `indexExistsAsync()` and "DELETE" for `deleteIndexAsync()`) and the headers, which specify the request key.  

In contrast, the `AzureSearchClient.createIndexAsync(indexDefinition)` method _does_ take a parameter. The `run` function in `index.js`, passes the contents of the file **hotels_quickstart_index.json** to the `AzureSearchClient.createIndexAsync(indexDefinition)` method. The `createIndexAsync()` method passes this definition to `AzureSearchClient.request()`. In `AzureSearchClient.request()`, since `bodyJson === null` is now `false`, the `init` structure includes not only the HTTP verb ("PUT") and the headers, but sets the `body` to the index definition data.

### Prepare and run the sample

Use a terminal window for the following commands.

1. Navigate to the folder that contains the **package.json** file and the rest of your code.
1. Install the packages for the sample with `npm install`.  This command will download the packages upon which the code depends.
1. Run your program with `node index.js`.

You should see a series of messages describing the actions being taken by the program. If you want to see more detail of the requests, you can uncomment the [lines at the beginning of the `AzureSearchClient.request()` method]https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/quickstart/AzureSearchClient.js#L21-L27) in **AzureSearchClient.js**. 

Open the **Overview** of your search service in the Azure portal. Select the **Indexes** tab. You should see something like the following:

![Screenshot of Azure portal, search service Overview, Indexes tab](media/search-get-started-nodejs/create-index-no-data.png)

In the next step, you'll add data to index. 

## 2 - Load Documents 

In Azure Cognitive Search, documents are data structures that are both inputs to indexing and outputs from queries. You need to POST such data to the index. This uses a different endpoint than the operations done in the previous step. Open **AzureSearchClient.js** and add the following method after `getIndexUrl()`:

```javascript
 getPostDataUrl() { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}/docs/index?api-version=${this.apiVersion}`;  }
```

Like `AzureSearchClient.createIndexAsync(definition)`, you need a function that calls `AzureSearchClient.request()` and passes in the hotel data to be its body. In **AzureSearchClient.js** add `postDataAsync(hotelsData)` after `createIndexAsync(definition)`:

```javascript
async postDataAsync(hotelsData) {
    console.log("\n Adding hotel data...");
    const endpoint = this.getPostDataUrl();
    const response = await AzureSearchClient.request(endpoint,"POST", this.adminKey, hotelsData);
    AzureSearchClient.throwOnHttpError(response);
    return this;
}
```

 Document inputs might be rows in a database, blobs in Blob storage, or, as in this sample, JSON documents on disk. You can either download [hotels.json](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/quickstart/hotels.json) or create your own **hotels.json** file with the following content:

```json
{
    "value": [
        {
            "HotelId": "1",
            "HotelName": "Secret Point Motel",
            "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
            "Description_fr": "L'hôtel est idéalement situé sur la principale artère commerciale de la ville en plein cœur de New York. A quelques minutes se trouve la place du temps et le centre historique de la ville, ainsi que d'autres lieux d'intérêt qui font de New York l'une des villes les plus attractives et cosmopolites de l'Amérique.",
            "Category": "Boutique",
            "Tags": ["pool", "air conditioning", "concierge"],
            "ParkingIncluded": false,
            "LastRenovationDate": "1970-01-18T00:00:00Z",
            "Rating": 3.6,
            "Address": {
                "StreetAddress": "677 5th Ave",
                "City": "New York",
                "StateProvince": "NY",
                "PostalCode": "10022"
            }
        },
        {
            "HotelId": "2",
            "HotelName": "Twin Dome Motel",
            "Description": "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts.",
            "Description_fr": "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.",
            "Category": "Boutique",
            "Tags": ["pool", "free wifi", "concierge"],
            "ParkingIncluded": "false",
            "LastRenovationDate": "1979-02-18T00:00:00Z",
            "Rating": 3.6,
            "Address": {
                "StreetAddress": "140 University Town Center Dr",
                "City": "Sarasota",
                "StateProvince": "FL",
                "PostalCode": "34243"
            }
        },
        {
            "HotelId": "3",
            "HotelName": "Triple Landscape Hotel",
            "Description": "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel’s restaurant services.",
            "Description_fr": "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.",
            "Category": "Resort and Spa",
            "Tags": ["air conditioning", "bar", "continental breakfast"],
            "ParkingIncluded": "true",
            "LastRenovationDate": "2015-09-20T00:00:00Z",
            "Rating": 4.8,
            "Address": {
                "StreetAddress": "3393 Peachtree Rd",
                "City": "Atlanta",
                "StateProvince": "GA",
                "PostalCode": "30326"
            }
        },
        {
            "HotelId": "4",
            "HotelName": "Sublime Cliff Hotel",
            "Description": "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace.",
            "Description_fr": "Le sublime Cliff Hotel est situé au coeur du centre historique de sublime dans un quartier extrêmement animé et vivant, à courte distance de marche des sites et monuments de la ville et est entouré par l'extraordinaire beauté des églises, des bâtiments, des commerces et Monuments. Sublime Cliff fait partie d'un Palace 1800 restauré avec amour.",
            "Category": "Boutique",
            "Tags": ["concierge", "view", "24-hour front desk service"],
            "ParkingIncluded": true,
            "LastRenovationDate": "1960-02-06T00:00:00Z",
            "Rating": 4.6,
            "Address": {
                "StreetAddress": "7400 San Pedro Ave",
                "City": "San Antonio",
                "StateProvince": "TX",
                "PostalCode": "78216"
            }
        }
    ]
}

```

To load this data into your program, modify **index.js** by adding the line referring to `hotelData` near the top:

```javascript
const nconf = require('nconf');

const hotelData = require('./hotels.json');
const indexDefinition = require('./hotels_quickstart_index.json');
```

Now modify the `run()` function in **index.js**. It can take a few seconds for the index to become available, so add a 2-second pause before calling `AzureSearchClient.postDataAsync(hotelData)`:

```javascript
const run = async () => {
    try {
        const cfg = getAzureConfiguration();
        const client = new AzureSearchClient(cfg.get("serviceName"), cfg.get("adminKey"), cfg.get("queryKey"), cfg.get("indexName"));
        
        const exists = await client.indexExistsAsync();
        await exists ? client.deleteIndexAsync() : Promise.resolve();
        // Deleting index can take a few seconds
        await sleep(2000);
        await client.createIndexAsync(indexDefinition);
        // Index availability can take a few seconds
        await sleep(2000);
        await client.postDataAsync(hotelData);
    } catch (x) {
        console.log(x);
    }
}
```

Run the program again with `node index.js`. You should see a slightly different set of messages from those you saw in Step 1. This time, the index _does_ exist, and you should see message about deleting it before the app creates the new index and posts data to it. 

## 3 - Search an index

Return to the **Indexes** tab in the **Overview** of your search service on the Azure portal. Your index now contains four documents and consumes some amount of storage (it may take a few minutes for the UI to properly reflect the underlying state of the index). Click on the index name to be taken to the **Search Explorer**. This page allows you to experiment with data queries. Try searching on a query string of `*&$count=true` and you should get back all your documents and the number of results. Try with the query string `historic&highlight=Description&$filter=Rating gt 4` and you should get back a single document, with the word "historic" wrapped in `<em></em>` tags. Read more about [how to compose a query in Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-query-overview). 

Reproduce these queries in code by opening **index.js** and adding this code near the top:

```javascript
const queries = [
    "*&$count=true",
    "historic&highlight=Description&$filter=Rating gt 4&"
];
```

In the same **index.js** file, write the `doQueriesAsync()` function shown below. This function takes an `AzureSearchClient` object and applies the `AzureSearchClient.queryAsync` method to each of the values in the `queries` array. It uses the `Promise.all()` function to return a single `Promise` that only resolves when all of the queries have resolved. The call to `JSON.stringify(body, null, 4)` formats the query result to be more readable.

```javascript
async function doQueriesAsync(client) {
    return Promise.all(
        queries.map( async query => {
            const result = await client.queryAsync(query);
            const body = await result.json();
            const str = JSON.stringify( body, null, 4);
            console.log(`Query: ${query} \n ${str}`);
        })
    );
}
```

Modify the `run()` function to pause long enough for the indexer to work and then to call the `doQueriesAsync(client)` function:

```javascript
const run = async () => {
    try {
        const cfg = getAzureConfiguration();
        const client = new AzureSearchClient(cfg.get("serviceName"), cfg.get("adminKey"), cfg.get("queryKey"), cfg.get("indexName"));
        
        const exists = await client.indexExistsAsync();
        await exists ? client.deleteIndexAsync() : Promise.resolve();
        // Deleting index can take a few seconds
        await sleep(2000);
        await client.createIndexAsync(indexDefinition);
        // Index availability can take a few seconds
        await sleep(2000);
        await client.postDataAsync(hotelData);
        // Data availability can take a few seconds
        await sleep(5000);
        await doQueriesAsync(client);
    } catch (x) {
        console.log(x);
    }
}
```

To implement `AzureSearchClient.queryAsync(query)`, edit the file **AzureSearchClient.js**. Searching requires a different endpoint, and the search terms become URL arguments, so add the function `getSearchUrl(searchTerm)` alongside the `getIndexUrl()` and `getPostDataUrl()` methods you've already written.

```javascript
getSearchUrl(searchTerm) { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}/docs?api-version=${this.apiVersion}&search=${searchTerm}&searchMode=all`; }
 ```

The `queryAsync(searchTerm)` function also goes in **AzureSearchClient.js** and follows the same structure as `postDataAsync(data)` and the other querying functions: 

```javascript
async queryAsync(searchTerm) {
    console.log("\n Querying...")
    const endpoint = this.getSearchUrl(searchTerm);
    const response = await AzureSearchClient.request(endpoint, "GET", this.queryKey);
    AzureSearchClient.throwOnHttpError(response);
    return response;
}
```

Search is done with the "GET" verb and no body, since the search term is part of the URL. Notice that `queryAsync(searchTerm)` uses `this.queryKey`, unlike the other functions that used the admin key. Query keys, as the name implies, can only be used for querying the index and can't be used to modify the index in any way. Query keys are therefore safer to distribute to client applications.

Run the program with `node index.js`. Now, in addition to the previous steps, the queries will be sent and the results written to the console.

### About the sample

The sample uses a small amount of hotel data, sufficient to demonstrate the basics of creating and querying an Azure Cognitive Search index.

The **AzureSearchClient** class encapsulates the configuration, URLs, and basic HTTP requests for the search service. The **index.js** file loads the configuration data for the Azure Cognitive Search service, the hotel data that will be uploaded for indexing, and, in its `run` function, orders, and executes the various operations.

The overall behavior of the `run` function is to delete the Azure Cognitive Search index if it exists, create the index, add some data, and perform some queries.  

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you are using a free service, remember that you are limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

In this Node.js quickstart, you worked through a series of tasks to create an index, load it with documents, and run queries. We did certain steps, such as reading the configuration and defining the queries, in the simplest possible way. In a real application, you would want to put those concerns in separate modules that would provide flexibility and encapsulation. 
 
If you already have some background in Azure Cognitive Search, you can use this sample as a springboard for trying suggesters (type-ahead or autocomplete queries), filters, and faceted navigation. If you're new to Azure Cognitive Search, we recommend trying other tutorials to develop an understanding of what you can create. Visit our [documentation page](https://azure.microsoft.com/documentation/services/search/) to find more resources. 

> [!div class="nextstepaction"]
> [Call Azure Cognitive Search from a WebPage using Javascript](https://github.com/liamca/azure-search-javascript-samples)
