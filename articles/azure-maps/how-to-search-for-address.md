---
title: Search for a location using Azure Maps Search services
description: In this article, you will learn how to search for a location using the Microsoft Azure Maps Search Service for geocoding and reverse geocoding.
author: anastasia-ms
ms.author: v-stharr
ms.date: 07/13/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Search for a location using Azure Maps Search services

The Azure Maps [Search Service](https://docs.microsoft.com/rest/api/maps/search) is a set of RESTful APIs for searching addresses, places, and business listings by name, category, and other geographic information. In addition to supporting traditional geocoding, search services can also reverse geocode addresses and cross streets based on latitudes and longitudes. Latitude and longitude values returned by the search can be used as parameters in other Azure Maps services, such as [Route](https://docs.microsoft.com/rest/api/maps/route) and [Weather](https://docs.microsoft.com/rest/api/maps/weather) services.

In this article you will learn, how to:

* Request latitude and longitude coordinates for an address (geocode address location) by using the [Search Address API]( https://docs.microsoft.com/rest/api/maps/search/getsearchaddress)
* Search for an address or Point of Interest (POI) using the [Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy)
* Search for an address. as well as its properties and coordinates
* Make a [Reverse Address Search](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) to translate coordinate location to street address
* Search for a cross street using the [Search Address Reverse Cross Street API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreversecrossstreet)

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Request latitude and longitude for an address (geocoding)

In this example, we're using the Azure Maps [Get Search Address API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) to convert a both a complete and partial street address into latitude and longitude coordinates. The response will return detailed address properties such as street, postal code, and county/state/country region information. In addition, the response will contain positional values in latitude and longitude.

>[!TIP]
>If you have a set of addresses to geocode, you can use [Post Search Address Batch API](https://docs.microsoft.com/rest/api/maps/search/postsearchaddressbatch) to send a batch of queries in a single API call.

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button. You'll use this collection for the rest of the examples in this document.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `<Azure-Maps-Primary-Subscription-key>` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/search/address/json?&subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=1.0&query=400 Broad St, Seattle, WA 98109
    ```

4. Click the blue **Send** button. The response body will contain location data for 400 Broad Street in the South Lake Union area of Seattle.

5. Now, we'll search an address that has two possible locations. In the **Params** section, change the `query` key to the following value:

    ```plaintext
        400 Broad, Seattle
    ```

6. Add the following key/value pair to the **Params** section.  The `typeahead` flag tells the Address Search API to treat the query as a partial input and return an array of predictive values.

    | Key | Value |
    |-----|------------|
    | typeahead | true |


7. The **GET** request should now look like the following URL:

   ```http
    https://atlas.microsoft.com/search/address/json?&subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=1.0&query=400 Broad, Seattle&typeahead=true
    ```

8. Click the **Send** button. The response body will contain two results, one for a `400 Broad Street` in Belltown, and another for a `400 Broad Street` in South Lake Union.

## Using Fuzzy Search API

The Azure Maps [Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) supports standard single line and free-form searches. The API allows search strings that contain any combination of Point of Interest (POI) tokens and geocoding. Furthermore, the query search results can be weighted by coordinate pairs, constrained by a coordinate and radius, or executed more generally without any geo biasing anchor point.

You can adjust fuzziness levels by using the `maxFuzzyLevel` or `minFuzzyLevel` parameters. For a complete list of all optional parameters, see [Fuzzy URI Parameters](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy#uri-parameters)

>[!TIP]
>The default scope for search queries is the entire world. To avoid unnecessary and excessive results, use the `countrySet` parameter to scope to specific countries. For example, to search only over the United States and France, you would add `countrySet=US,FR` to the query string. For a complete list of supported countries, see [Search Coverage](https://docs.microsoft.com/azure/azure-maps/geocoding-coverage).

### Search for an address using Fuzzy Search

In this example, we'll use Fuzzy Search to search the entire world for `pizza`.  Then, we'll show you how to search over the scope of a specific country. Finally, we'll show you how you can use a lat./lon. pair to scope over a specific area.

1. Open the Postman app, click **New** and select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `<Azure-Maps-Primary-Subscription-key>` with your primary subscription key.

    ```http
   https://atlas.microsoft.com/search/fuzzy/json?&api-version=1.0&subscription-key={Azure-Maps-Primary-Subscription-key}&query=pizza
    ```

    The _json_ attribute in the URL path determines the response format. This article uses json for ease of use and readability. To find other supported response formats, see the `format` parameter definition in the [URI Parameter reference documentation](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy#uri-parameters).

3. Click **Send** and review the response body.

    The ambiguous query string for "pizza" returned 10 [point of interest result](https://docs.microsoft.com/rest/api/maps/search/getsearchpoi#searchpoiresponse) (POI) in both the "pizza" and "restaurant" categories. Each result returns a street address, latitude and longitude values, view port, and entry points for the location.
  
    The results are varied for this query, not tied to any particular reference location. Next, we'll use the **countrySet** parameter to specify only the countries/regions for which your application needs coverage.

4. In this example, we'll search for `pizza` only the United States. Add the following key/value pair to the **Params** section and click **Send**:

    | Key | Value |
    |------------------|-------------------------|
    | countrySet | US |
  
    The results are now bounded by the country code and the query returns pizza restaurants in the United States.

5. Now, we'll search for `pizza` with an orientation bias at the Seattle Space Needle. Before, we can do a search on pizza, we'll get the coordinates for the Seattle Space Needle. In the **Params** section, replace the `pizza` value with `Seattle Space Needle` for the `query` key. Click **Send**.

6. Review the response results. Copy the the coordinates pair from the response. Enter them as key/value pairs in the **Params** section. They should be the following values:

    | Key | Value |
    |-----|------------|
    | lat | 47.620525 |
    | lon | -122.349274 |

7. Now that you have the coordinates for the Seattle Space Needle, replace `Seattle Space Needle` query with `pizza`. Click **Send**. The response should return about 10 results for pizza restaurants in or near the lat./lon. of the Seattle Space Needle.

    >[!NOTE]
    > You could have easily appended `Seattle Space Needle` to the `pizza` query value to retrieve the same results. However, this example is intended to demonstrate how you can use coordinates to define a specific bias for your searches.

## Search for a street address using Reverse Address Search

The Azure Maps [Get Search Address Reverse API]( https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) translates coordinates into a human readable street addresses. This API is often used for applications that consume GPS feeds and want to discover addresses at specific coordinate points.

>[!TIP]
>If you have a set of coordinate locations to reverse geocode, you can use [Post Search Address Reverse Batch API](https://docs.microsoft.com/rest/api/maps/search/postsearchaddressreversebatch) to send a batch of queries in a single API call.

In this example, we'll be making reverse searches using a few of the optional parameters that are available. For the full list of optional parameters, see [Reverse Search Parameters](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#uri-parameters).

1. In the Postman app, click **New** and select **Request**. Enter a **Request name** for the request. Select the collection you created in the first section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `<Azure-Maps-Primary-Subscription-key>` with your primary subscription key.

    ```http
   https://atlas.microsoft.com/search/address/reverse/json?&api-version=1.0&subscription-key={Azure-Maps-Primary-Subscription-key}&query=47.591180,-122.332700
    ```
  
3. Click **Send** and review the response body. You should see one query result. The response includes key address information about Safeco Field.
  
4. Now, we'll add the following key/value pairs to the **Params** section:

    | Key | Value |
    |-----|------------|
    | number | true |
    | returnSpeedLimit | true |
    | returnRoadUse | true |
    | roadUse | Arterial |

    The `number` parameter does this.

    The `returnSpeedLimit` parameter tells the API return the speed limit at the address.

    The `returnRoadUse` parameter tells the API to return an array road use types at the address. To see all of the possible values see the `returnRoadUse` parameter in the [Reverse Search Parameters section](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#uri-parameters).

    The `roadUse` parameter tells the API to restrict reversegeocodes to a specific type of `roaduse`.

5. Click **Send**.

## Search for cross street using Reverse Address Cross Street Search

In this example, we will search for a cross street based on the coordinates of an address.

1. In the Postman app, click **New** and select **Request**. Enter a **Request name** for the request. Select the collection you created in the first section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `<Azure-Maps-Primary-Subscription-key>` with your primary subscription key.
  
    ```http
   https://atlas.microsoft.com/search/address/reverse/crossstreet/json?&api-version=1.0&subscription-key={Azure-Maps-Primary-Subscription-key}&query=47.591180,-122.332700
    ```
  
3. Click **Send** and review the response body. You will notice that the response contains a `crossStreet` value of `Occidental Avenue South`.

## Next steps

> [!div class="nextstepaction"]
> [Explore Azure Maps Search Service REST API](https://docs.microsoft.com/rest/api/maps/search)

> [!div class="nextstepaction"]
> [Learn Azure Maps Search Service best practices](how-to-use-best-practices-for-search.md/)
