---
title: Search for a location using Azure Maps Search services | Microsoft Azure Maps
description: In this article, you will learn how to search for a location using the Microsoft Azure Maps Search Service for geocoding and reverse geocoding.
author: philmea
ms.author: philmea
ms.date: 01/15/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Search for a location using Azure Maps Search services

The Azure Maps [Search Service](https://docs.microsoft.com/rest/api/maps/search) is a set of RESTful APIs designed to help developers to search addresses, places, business listings by name or category, and other geographic information. In addition of supporting traditional geocoding, services can also reverse geocode addresses and cross streets based on latitudes and longitudes. Latitude and longitude values returned by the search can be used as parameters in other Azure Maps services like [Route](https://docs.microsoft.com/rest/api/maps/route) and [Weather](https://docs.microsoft.com/rest/api/maps/weather) services.

In this article you will learn, how to:

* Request latitude and longitude coordinates for an address (geocode address location) by using [Search Address API]( https://docs.microsoft.com/rest/api/maps/search/getsearchaddress)
* Search for an address or Point of Interest (POI) using [Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy)
* Search for an address along with properties and coordinates
* Make a [Reverse Address Search](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) to translate coordinate location to street address
* Search for a cross street using [Search Address Reverse Cross Street API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreversecrossstreet)

## Prerequisites

To complete the steps in this article, you need to first create an Azure Maps account and get you maps account subscription key. Follow instructions in [Create an account](quick-demo-map-app.md#create-an-account-with-azure-maps) to create an Azure Maps account subscription and follow the steps in [get primary key](quick-demo-map-app.md#get-the-primary-key-for-your-account) to get the primary key for your account. For more information on authentication in Azure Maps, see [manage authentication in Azure Maps](./how-to-manage-authentication.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to build REST calls. You can use any API development environment that you prefer.

## Request latitude and longitude for an address (geocoding)

In this example, we are using Azure Maps [Get Search Address API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) to convert street address into latitude and longitude coordinates. You can pass a complete or partial street address to the API and receive a response that includes detailed address properties such as street, postal code and country/region, as well as positional values in latitude and longitude.

If you have a set of addresses to geocode, you can use [Post Search Address Batch API](https://docs.microsoft.com/rest/api/maps/search/postsearchaddressbatch) to send a batch of queries in a single API call.

1. In Postman, click **New Request** | **GET request** and name it **Address Search**.

2. On the Builder tab, select the **GET** HTTP method, enter the request URL for your API endpoint, and select an authorization protocol, if any.

![Address Search](./media/how-to-search-for-address/address_search_url.png)

| Parameter | Suggested value |
|---------------|------------------------------------------------| 
| HTTP method | GET |
| Request URL | [https://atlas.microsoft.com/search/address/json?](https://atlas.microsoft.com/search/address/json?) | 
| Authorization | No Auth |

3. Click **Params**, and enter the following Key / Value pairs to use as query or path parameters in the request URL: 

![Address Search](./media/how-to-search-for-address/address_search_params.png) 

| Key | Value | 
|------------------|-------------------------| 
| api-version | 1.0 | 
| subscription-key | \<your Azure Maps key\> | 
| query | 400 Broad St, Seattle, WA 98109 | 

4. Click **Send** and review the response body. 

In this case, you specified a complete address query and receive a single result in the response body. 

5. In Params, edit the query string to the following value: 

    ```plaintext 
        400 Broad, Seattle 
    ``` 

6. Add the following Key / Value pair to the **Params** section and click **Send**: 

| Key | Value | 
|-----|------------| 
| typeahead | true | 

The **typeahead** flag tells the Address Search API to treat the query as a partial input and return an array of predictive values.

## Using Fuzzy Search API

Azure Maps[ Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) is recommended service to use when you do not know what your user inputs are for a search query. The API combines Point of Interest (POI) search and geocoding into a canonical 'single-line search'. For example, the API can handle inputs of any address or POI token combination. It can also be weighted with a contextual position (lat./lon. pair), fully constrained by a coordinate and radius, or executed more generally without any geo biasing anchor point.

Most Search queries default to `maxFuzzyLevel=1` to gain performance and reduce unusual results. This default can be overridden as needed per request by passing in the query parameter `maxFuzzyLevel=2` or `3`.

### Search for an address using Fuzzy Search

1. Open the Postman app, click New | Create New, and select **GET request**. Enter a Request name of **Fuzzy search**, select a collection or folder to save it to, and click **Save**.

2. On the Builder tab, select the **GET** HTTP method and enter the request URL for your API endpoint.

    ![Fuzzy Search](./media/how-to-search-for-address/fuzzy_search_url.png)

    | Parameter | Suggested value |
    |---------------|------------------------------------------------|
    | HTTP method | GET |
    | Request URL | [https://atlas.microsoft.com/search/fuzzy/json?](https://atlas.microsoft.com/search/fuzzy/json?) |
    | Authorization | No Auth |

    The **json** attribute in the URL path determines the response format. This article uses json for ease of use and readability. You can find the available response formats in the **Get Search Fuzzy** definition of the [Maps Functional API reference](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy).

3. Click **Params**, and enter the following Key / Value pairs to use as query or path parameters in the request URL:

    ![Fuzzy Search](./media/how-to-search-for-address/fuzzy_search_params.png)

    | Key | Value |
    |------------------|-------------------------|
    | api-version | 1.0 |
    | subscription-key | \<your Azure Maps key\> |
    | query | pizza |

4. Click **Send** and review the response body.

    The ambiguous query string for "pizza" returned 10 [point of interest result](https://docs.microsoft.com/rest/api/maps/search/getsearchpoi#searchpoiresponse) (POI) in both the "pizza" and "restaurant" categories. Each result returns a street address, latitude and longitude values, view port, and entry points for the location.
  
    The results are varied for this query, not tied to any particular reference location. You can use the **countrySet** parameter to specify only the countries/regions for which your application needs coverage. The default behavior is to search the entire world, potentially returning unnecessary results.

5. Add the following Key / Value pair to the **Params** section and click **Send**:

    | Key | Value |
    |------------------|-------------------------|
    | countrySet | US |
  
    The results are now bounded by the country code and the query returns pizza restaurants in the United States.
  
    To provide results for a location, you can query a point of interest and use the returned latitude and longitude values in your call to the Fuzzy Search service. In this case, you used the Search service to return the location of the Seattle Space Needle and used the lat. / lon. values to orient the search.
  
6. In Params, enter the following Key / Value pairs and click **Send**:

    ![Fuzzy Search](./media/how-to-search-for-address/fuzzy_search_latlon.png)
  
    | Key | Value |
    |-----|------------|
    | lat | 47.620525 |
    | lon | -122.349274 |


## Search for a street address using Reverse Address Search

Azure Maps [Get Search Address Reverse API]( https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) helps to translate a coordinate (example: 37.786505, -122.3862) into a human understandable street address. Most often this is needed in tracking applications where you receive a GPS feed from the device or asset and wish to know what address where the coordinate is located.
If you have a set of coordinate locations to reverse geocode, you can use [Post Search Address Reverse Batch API](https://docs.microsoft.com/rest/api/maps/search/postsearchaddressreversebatch) to send a batch of queries in a single API call.


1. In Postman, click **New Request** | **GET request** and name it **Reverse Address Search**.

2. On the Builder tab, select the **GET** HTTP method and enter the request URL for your API endpoint.
  
    ![Reverse Address Search URL](./media/how-to-search-for-address/reverse_address_search_url.png)
  
    | Parameter | Suggested value |
    |---------------|------------------------------------------------|
    | HTTP method | GET |
    | Request URL | [https://atlas.microsoft.com/search/address/reverse/json?](https://atlas.microsoft.com/search/address/reverse/json?) |
    | Authorization | No Auth |
  
3. Click **Params**, and enter the following Key / Value pairs to use as query or path parameters in the request URL:
  
    ![Reverse Address Search Parameters](./media/how-to-search-for-address/reverse_address_search_params.png)
  
    | Key | Value |
    |------------------|-------------------------|
    | api-version | 1.0 |
    | subscription-key | \<your Azure Maps key\> |
    | query | 47.591180,-122.332700 |
  
4. Click **Send** and review the response body.

    The response includes key address information about Safeco Field.
  
5. Add the following Key / Value pair to the **Params** section and click **Send**:

    | Key | Value |
    |-----|------------|
    | number | true |

    If the [number](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) query parameter is sent with the request, the response may include the side of the street (Left or Right) and also an offset position for that number.
  
6. Add the following Key / Value pair to the **Params** section and click **Send**:

    | Key | Value |
    |-----|------------|
    | returnSpeedLimit | true |
  
    When the [returnSpeedLimit](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) query parameter is set, the response returns the posted speed limit.

7. Add the following Key / Value pair to the **Params** section and click **Send**:

    | Key | Value |
    |-----|------------|
    | returnRoadUse | true |

    When the [returnRoadUse](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) query parameter is set, the response returns the road use array for reverse geocodes at street level.

8. Add the following Key / Value pair to the **Params** section and click **Send**:

    | Key | Value |
    |-----|------------|
    | roadUse | true |

    You can restrict the reverse geocode query to a specific type of road using the [roadUse](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) query parameter.
  
## Search for cross street using Reverse Address Cross Street Search

1. In Postman, click **New Request** | **GET request** and name it **Reverse Address Cross Street Search**.

2. On the Builder tab, select the **GET** HTTP method and enter the request URL for your API endpoint.
  
    ![Reverse Address Cross Street Search](./media/how-to-search-for-address/reverse_address_search_url.png)
  
    | Parameter | Suggested value |
    |---------------|------------------------------------------------|
    | HTTP method | GET |
    | Request URL | [https://atlas.microsoft.com/search/address/reverse/crossstreet/json?](https://atlas.microsoft.com/search/address/reverse/crossstreet/json?) |
    | Authorization | No Auth |
  
3. Click **Params**, and enter the following Key / Value pairs to use as query or path parameters in the request URL:
  
    | Key | Value |
    |------------------|-------------------------|
    | api-version | 1.0 |
    | subscription-key | \<your Azure Maps key\> |
    | query | 47.591180,-122.332700 |
  
4. Click **Send** and review the response body.

## Next steps

- Explore the [Azure Maps Search Service REST API documentation](https://docs.microsoft.com/rest/api/maps/search).
- Learn about [Azure Maps Search Service best practices](https://docs.microsoft.com/azure/azure-maps/how-to-use-best-practices-for-search) and how to optimize your queries.
