---
title: Search for a location using Azure Maps Search services
description: In this article, you will learn how to search for a location using the Microsoft Azure Maps Search Service for geocoding and reverse geocoding.
author: anastasia-ms
ms.author: v-stharr
ms.date: 07/14/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Search for a location using Azure Maps Search services

The Azure Maps [Search Service](https://docs.microsoft.com/rest/api/maps/search) is a set of RESTful APIs for searching addresses, places, and business listings by name, category, and other geographic information. In addition to supporting traditional geocoding, search services can also reverse geocode addresses and cross streets based on latitudes and longitudes. Latitude and longitude values returned by the search can be used as parameters in other Azure Maps services, such as [Route](https://docs.microsoft.com/rest/api/maps/route) and [Weather](https://docs.microsoft.com/rest/api/maps/weather) services.

In this article you will learn how to:

* Request latitude and longitude coordinates for an address (geocode address location) by using the [Search Address API]( https://docs.microsoft.com/rest/api/maps/search/getsearchaddress).
* Search for an address or Point of Interest (POI) using the [Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy).
* Search for an address, its properties and coordinates.
* Make a [Reverse Address Search](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) to translate coordinate location to street address.
* Search for a cross street using the [Search Address Reverse Cross Street API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreversecrossstreet).

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Request latitude and longitude for an address (geocoding)

In this example, we'll use the Azure Maps [Get Search Address API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) to convert an address into latitude and longitude coordinates. In addition to returning the coordinates, the response will also return detailed address properties such as street, postal code, and county/state/country region information.

>[!TIP]
>If you have a set of addresses to geocode, you can use the [Post Search Address Batch API](https://docs.microsoft.com/rest/api/maps/search/postsearchaddressbatch) to send a batch of queries in a single API call.

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button. You'll can use this collection for the rest of the examples in this document.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key. The request should look like the following URL:

    ```http
    https://atlas.microsoft.com/search/address/json?&subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=1.0&language=en-US&query=400 Broad St, Seattle, WA 98109
    ```

4. Click the blue **Send** button. The response body will contain data for a single location.

5. Now, we'll search an address that has two possible locations. In the **Params** section, change the `query` key to `400 Broad, Seattle`.  Also, add the `typeahead` key, and set it's value to `true`. The `typeahead` flag tells the Address Search API to treat the query as a partial input and to return an array of predictive values.

    :::image type="content" source="./media/how-to-search-for-address/search-address.png" alt-text="Search for address":::

6. Click the **Send** button. The response body will contain data for three locations.

## Using Fuzzy Search API

The Azure Maps [Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) supports standard single line and free-form searches. The API supports search strings that contain any combination of Point of Interest (POI) tokens and geocoding. Furthermore, the query search results can be weighted by coordinate pairs, constrained by a coordinate and radius, or executed more generally without any geo biasing anchor points.

>[!TIP]
>Most Search queries default to maxFuzzyLevel=1 to gain performance and reduce unusual results. You can adjust fuzziness levels by using the `maxFuzzyLevel` or `minFuzzyLevel` parameters. For more information on `maxFuzzyLevel` and a complete list of all optional parameters, see [Fuzzy Search URI Parameters](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy#uri-parameters)

### Search for an address using Fuzzy Search

In this example, we'll use Fuzzy Search to search the entire world for `pizza`.  Then, we'll show you how to search over the scope of a specific country. Finally, we'll show you how you can use a coordinate pair to scope a search over a specific area.

1. Open the Postman app, click **New** and select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key. The request should look like the following URL:

    ```http
   https://atlas.microsoft.com/search/fuzzy/json?&api-version=1.0&subscription-key={Azure-Maps-Primary-Subscription-key}&language=en-US&query=pizza
    ```

    >[!NOTE]
    >The _json_ attribute in the URL path determines the response format. This article uses json for ease of use and readability. To find other supported response formats, see the `format` parameter definition in the [URI Parameter reference documentation](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy#uri-parameters).

3. Click **Send** and review the response body.

    The ambiguous query string for "pizza" returned ten [point of interest result](https://docs.microsoft.com/rest/api/maps/search/getsearchpoi#searchpoiresponse) (POI) in both the "pizza" and "restaurant" categories. Each result returns a street address, latitude and longitude values, view port, and entry points for the location.
  
    In the next step, we'll use the **countrySet** parameter to specify only the countries/regions for which your application needs coverage. For a complete list of supported countries, see [Search Coverage](https://docs.microsoft.com/azure/azure-maps/geocoding-coverage).

4. Next, we'll search for `pizza` only the United States. Add the `countrySet` key to the **Params** section, and set it's value to `US`.
Setting the `countrySet` key to `US` will bound the results to the United States.

    :::image type="content" source="./media/how-to-search-for-address/search-fuzzy-country.png" alt-text="Search for pizza in the United States":::

5. To get an even more targeted search, you can search over the scope of a lat./lon. coordinate pair. Go ahead and remove the `countrySet` key.  In this example, we'll instead use the lat./lon. of the Seattle Space Needle. In the **Params** section, add a `lat` key, and set its value to `47.620525`. Next, add a `lon` key, and set its value to `-122.349274`.

    :::image type="content" source="./media/how-to-search-for-address/search-fuzzy-latlon.png" alt-text="Search for pizza at latitude and longitude pair":::

6. Click **Send**. The response should return  results for pizza restaurants near the Seattle Space Needle.

## Search for a street address using Reverse Address Search

The Azure Maps [Get Search Address Reverse API]( https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) translates coordinates into a human readable street addresses. This API is often used for applications that consume GPS feeds and want to discover addresses at specific coordinate points.

>[!TIP]
>If you have a set of coordinate locations to reverse geocode, you can use [Post Search Address Reverse Batch API](https://docs.microsoft.com/rest/api/maps/search/postsearchaddressreversebatch) to send a batch of queries in a single API call.

In this example, we'll be making reverse searches using a few of the optional parameters that are available. For the full list of optional parameters, see [Reverse Search Parameters](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#uri-parameters).

1. In the Postman app, click **New** and select **Request**. Enter a **Request name** for the request. Select the collection you created in the first section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key. The request should look like the following URL:

    ```http
    https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key={Azure-Maps-Primary-Subscription-key}&language=en-US&query=47.591180,-122.332700&number=1
    ```
  
3. Click **Send** and review the response body. You should see one query result. The response includes key address information about Safeco Field.
  
4. Now, we'll add the following key/value pairs to the **Params** section:

    | Key | Value | Returns
    |-----|------------|------|
    | number | 1 ||
    | returnSpeedLimit | true | Returns the speed limit at the address.|
    | returnRoadUse | true | Returns road use types at the address. For all possible road use types, see [Road Use Types](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#uri-parameters).|
    | returnMatchType | true| Returns the type of match. For all possible values, see [Reverse Address Search Results](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#searchaddressreverseresult)

   :::image type="content" source="./media/how-to-search-for-address/search-reverse.png" alt-text="Search reverse.":::

5. Click **Send** and review the response body.

6. Next, we'll add the `entityType` key, and set its value to `Municipality`. The `entityType` key will override the `returnMatchType` key in the previous step. The `entityType` key returns address information scoped to the specified geography entity type. Since we've set `entityType` to `Municipality`, we'll get address point information scoped as part of the city of Seattle.  For all possible entity types, see [Entity Types](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#entitytype).

    :::image type="content" source="./media/how-to-search-for-address/search-reverse-entitytype.png" alt-text="Search reverse entityType.":::

7. Click **Send**. Compare the results to those received in step 5.

>[!TIP]
>To get more information on these parameters, as well as to learn about others, see the [Reverse Search Parameters section](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#uri-parameters).

## Search for cross street using Reverse Address Cross Street Search

In this example, we'll search for a cross street based on the coordinates of an address.

1. In the Postman app, click **New**, and select **Request**. Enter a **Request name** for the request. Select the collection you created in the first section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key. The request should look like the following URL:
  
    ```http
   https://atlas.microsoft.com/search/address/reverse/crossstreet/json?&api-version=1.0&subscription-key={Azure-Maps-Primary-Subscription-key}&language=en-US&query=47.591180,-122.332700
    ```
  
3. Click **Send** and review the response body. You'll notice that the response contains a `crossStreet` value of `Occidental Avenue South`.

## Next steps

> [!div class="nextstepaction"]
> [Explore Azure Maps Search Service REST API](https://docs.microsoft.com/rest/api/maps/search)

> [!div class="nextstepaction"]
> [Learn Azure Maps Search Service best practices](how-to-use-best-practices-for-search.md)
