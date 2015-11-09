<properties
	pageTitle="Create an Azure Search index using a REST API | Microsoft Azure | Hosted cloud search service"
	description="Create an index in code using the Azure Search and an HTTP REST API."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="rest-api"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="11/09/2015"
	ms.author="heidist"/>

# Create an Azure Search index using a REST API
> [AZURE.SELECTOR]
- [Indexes in Azure Search](search-what-is-an-index.md)
- [Create an Azure Search index in the portal](search-create-index-portal.md)
- [Create an Azure Search index using.NET](search-create-index-dotnet.md)
- [Create an Azure Search index using REST APIs](search-create-index-rest-api.md)

This article shows you how to create an index using the [Azure Search REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx). Some of the content below is from [Create Index (Azure Search REST API](https://msdn.microsoft.com/library/azure/dn798941.aspx). Refer to the parent article for more context.

Prerequisites to creating an index include having previously established a connection to your search service, typically done via an 'httpClient'. 

A 3-part approach to creating an index via the REST API includes setting up a connection, providing an index schema, and then executing a command that builds the index. Code snippets are from the [scoring profiles sample](search-get-started-scoring-profiles.md).

##Define index schema

The REST API accepts requests in JSON. One way to create the schema is to include a standalone schema file as a JSON document. The following example provides an illustration. 

In the sample from which this snippet is derived, the JSON below is saved in a file named schema.json.

	{
	    "name": "musicstoreindex",
	    "fields": [
	        { "name": "key", "type": "Edm.String", "key": true },
	        { "name": "albumTitle", "type": "Edm.String"},
	        { "name": "albumUrl", "type": "Edm.String", "filterable": false },
	        { "name": "genre", "type": "Edm.String" },
	        { "name": "genreDescription", "type": "Edm.String", "filterable": false },
	        { "name": "artistName", "type": "Edm.String"},
	        { "name": "orderableOnline", "type": "Edm.Boolean" },
	        { "name": "rating", "type": "Edm.Int32" },
	        { "name": "tags", "type": "Collection(Edm.String)" },
	        { "name": "price", "type": "Edm.Double", "filterable": false },
	        { "name": "margin", "type": "Edm.Int32", "retrievable": false },
	        { "name": "inventory", "type": "Edm.Int32" },
	        { "name": "lastUpdated", "type": "Edm.DateTimeOffset" }
	    ],
	    "scoringProfiles": [
	        {
	            "name": "boostGenre",
	            "text": {
	                "weights": {
	                    "albumTitle": 5,
	                    "genre": 50,
	                    "artistName": 5
	                }
	            }
	        },
	        {
	            "name": "newAndHighlyRated",
	            "functions": [
	                {
	                    "type": "freshness",
	                    "fieldName": "lastUpdated",
	                    "boost": 10,
	                    "interpolation": "quadratic",
	                    "freshness": {
	                        "boostingDuration": "P365D"
	                    }
	                },
	                {
	                    "type": "magnitude",
	                    "fieldName": "rating",
	                    "boost": 10,
	                    "interpolation": "linear",
	                    "magnitude": {
	                        "boostingRangeStart": 1,
	                        "boostingRangeEnd": 5,
	                        "constantBoostBeyondRange": false
	                    }
	                }
	            ]
	        },
	        {
	            "name": "boostMargin",
	            "functions": [
	
	                {
	                    "type": "magnitude",
	                    "fieldName": "margin",
	                    "boost": 50,
	                    "interpolation": "linear",
	                    "magnitude": {
	                        "boostingRangeStart": 50,
	                        "boostingRangeEnd": 100,
	                        "constantBoostBeyondRange": false
	                    }
	                }
	            ]
	        }
	    ]
	}

##Set up an HTTP request to connect and build index

REST APIs formulate the HTTP connection on every request. Each request always stipulates the service URL, which version of the API you are using, and an admin key that grant read-write operations in the service (referred to below as the primary key because that's how the key is named in the portal). 

The code snippet uses static values as inputs, including a name for the index, as specified in the app.config file (not shown). The sample was created this way to keep the code simple.

        private const string ApiVersion = "api-version=2015-02-28";
        private static string serviceUrl = ConfigurationManager.AppSettings["serviceUrl"];
        private static string indexName = ConfigurationManager.AppSettings["indexName"];
        private static string primaryKey = ConfigurationManager.AppSettings["primaryKey"];

In the following example, you see an HTTP PUT request to the service URL along with an `api-version` and the name of the index to create.

        static bool CreateIndex()
        {
            // Create an index using an index name
            Uri requestUri = new Uri(serviceUrl + indexName + "?" + ApiVersion);

            // Load the json containing the schema from an external file
            string json = File.ReadAllText("schema.json");

            using (HttpClient client = new HttpClient())
            {
                // Create the index
                client.DefaultRequestHeaders.Add("api-key", primaryKey);
                HttpResponseMessage response = client.PutAsync(requestUri,        // To create index use PUT
                    new StringContent(json, Encoding.UTF8, "application/json")).Result;

                if (response.StatusCode == HttpStatusCode.Created)   // For Posts we want to know response had no content
                {
                    Console.WriteLine("Index created. \r\n");
                    return true;
                }

                Console.WriteLine("Index creation failed: {0} {1} \r\n", (int)response.StatusCode, response.Content.ReadAsStringAsync().Result.ToString());
                return false;

            }
        }