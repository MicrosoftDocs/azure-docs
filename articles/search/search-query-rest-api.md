<properties
    pageTitle="Query your Azure Search Index using the REST API | Microsoft Azure | Hosted cloud search service"
    description="Build a search query in Azure search and use search parameters to filter and sort search results."
    services="search"
    documentationCenter=""
	authors="ashmaka"
/>

<tags
    ms.service="search"
    ms.devlang="na"
    ms.workload="search"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="na"
    ms.date="05/31/2016"
    ms.author="ashmaka"/>

# Query your Azure Search index using the REST API
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Portal](search-explorer.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)

This article will show you how to query an index using the [Azure Search REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx).

Before beginning this walkthrough, you should already have [created an Azure Search index](search-what-is-an-index.md) and [populated it with data](search-what-is-data-import.md).

## I. Identify your Azure Search service's query api-key
A key component of every search operation against the Azure Search REST API is the *api-key* that was generated for the service you provisioned. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

1. To find your service's api-keys you must log into the [Azure Portal](https://portal.azure.com/)
2. Go to your Azure Search service's blade
3. Click on the "Keys" icon

Your service will have *admin keys* and *query keys*.

 - Your primary and secondary *admin keys* grant full rights to all operations, including the ability to manage the service, create and delete indexes, indexers, and data sources. There are two keys so that you can continue to use the secondary key if you decide to regenerate the primary key, and vice-versa.
 - Your *query keys* grant read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.

For the purposes of querying an index, you can use one of your query keys. Your admin keys can also be used for queries, but you should use a query key in your application code as this better follows the [Principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege).

## II. Formulate your query
There are two ways to [search your index using the REST API](https://msdn.microsoft.com/library/azure/dn798927.aspx). One way is to issue an HTTP POST request where your query parameters will be defined in a JSON object in the request body. The other way is to issue an HTTP GET request where your query parameters will be defined within the request URL. Note that POST has more [relaxed limits](https://msdn.microsoft.com/library/azure/dn798927.aspx) on the size of query parameters than GET. For this reason, we recommend using POST unless you have special circumstances where using GET would be more convenient.

For both POST and GET, you need to provide your *service name*, *index name*, and the proper *API version* (the current API version is `2015-02-28` at the time of publishing this document) in the request URL. For GET, the *query string* at the end of the URL will be where you provide the query parameters. See below for the URL format:

    https://[service name].search.windows.net/indexes/[index name]/docs?[query string]&api-version=2015-02-28

The format for POST is the same, but with only api-version in the query string parameters.



#### Example Queries

Here are a few example queries on an index named "hotels". These queries are shown in both GET and POST format.

Search the entire index for the term 'budget' and return only the `hotelName` field:

```
GET https://[service name].search.windows.net/indexes/hotels/docs?search=budget&$select=hotelName&api-version=2015-02-28

POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2015-02-28
{
    "search": "budget",
    "select": "hotelName"
}
```

Apply a filter to the index to find hotels cheaper than $150 per night, and return the `hotelId` and `description`:

```
GET https://[service name].search.windows.net/indexes/hotels/docs?search=*&$filter=baseRate lt 150&$select=hotelId,description&api-version=2015-02-28

POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2015-02-28
{
    "search": "*",
    "filter": "baseRate lt 150",
    "select": "hotelId,description"
}
```

Search the entire index, order by a specific field (`lastRenovationDate`) in descending order, take the top two results, and show only `hotelName` and `lastRenovationDate`:

```
GET https://[service name].search.windows.net/indexes/hotels/docs?search=*&$top=2&$orderby=lastRenovationDate desc&$select=hotelName,lastRenovationDate&api-version=2015-02-28

POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2015-02-28
{
    "search": "*",
    "orderby": "lastRenovationDate desc",
    "select": "hotelName,lastRenovationDate",
    "top": 2
}
```

## III. Submit your HTTP request
Now that you have formulated your query as part of your HTTP request URL (for GET) or body (for POST), you can define your request headers and submit your query.

#### Request and Request Headers
You must define two request headers for GET, or three for POST:
1. The `api-key` header must be set to the query key you found in step I above. Note that you can also use an admin key as the `api-key` header, but it is recommended that you use a query key as it exclusively grants read-only access to indexes and documents.
2. The `Accept` header must be set to `application/json`.
3. For POST only, the `Content-Type` header should also be set to `application/json`.

See below for a HTTP GET request to search the "hotels" index using the Azure Search REST API, using a simple query that searches for the term "motel":

```
GET https://[service name].search.windows.net/indexes/hotels/docs?search=motel&api-version=2015-02-28
Accept: application/json
api-key: [query key]
```

Here is the same example query, this time using HTTP POST:

```
POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2015-02-28
Content-Type: application/json
Accept: application/json
api-key: [query key]

{
    "search": "motel"
}
```

A successful query request will result in a Status Code of `200 OK` and the search results are returned as JSON in the response body. Here is what the results for the above query look like, assuming the "hotels" index is populated with the sample data in [Data Import in Azure Search using the REST API](search-import-data-rest-api.md) (note that the JSON has been formatted for clarity).

```JSON
{
    "value": [
        {
            "@search.score": 0.59600675,
            "hotelId": "2",
            "baseRate": 79.99,
            "description": "Cheapest hotel in town",
            "description_fr": "Hôtel le moins cher en ville",
            "hotelName": "Roach Motel",
            "category": "Budget",
            "tags":["motel", "budget"],
            "parkingIncluded": true,
            "smokingAllowed": true,
            "lastRenovationDate": "1982-04-28T00:00:00Z",
            "rating": 1,
            "location": {
                "type": "Point",
                "coordinates": [-122.131577, 49.678581],
                "crs": {
                    "type":"name",
                    "properties": {
                        "name": "EPSG:4326"
                    }
                }
            }
        }
    ]
}
```

To learn more, please visit the "Response" section of [Search Documents](https://msdn.microsoft.com/library/azure/dn798927.aspx). For more information on other HTTP status codes that could be returned in case of failure, see [HTTP status codes (Azure Search)](https://msdn.microsoft.com/library/azure/dn798925.aspx).
