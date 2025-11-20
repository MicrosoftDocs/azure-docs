---
title: Search for a location using Azure Maps Search services
description: Learn about the Azure Maps Search service. See how to use this set of APIs for geocoding, reverse geocoding, fuzzy searches, and reverse cross street searches.
author: sinnypan
ms.author: sipa
ms.date: 9/24/2025
ms.topic: how-to
ms.service: azure-maps
ms.subservice: search
zone_pivot_groups: azure-maps-search
---

# Search for a location using Azure Maps Search services

The [Search] service is a set of RESTful APIs designed to help developers search addresses, places, and business listings by name, category, and other geographic information. In addition to supporting traditional geocoding, services can also reverse geocode addresses and cross streets based on latitudes and longitudes. Latitude and longitude values returned by the search can be used as parameters in other Azure Maps services, such as [Route] and [Weather].

:::zone pivot="search-previous"

This article demonstrates how to:

* Request latitude and longitude coordinates for an address (geocode address location) by using [Search Address].
* Search for an address or Point of Interest (POI) using [Fuzzy Search].
* Use [Reverse Address Search] to translate coordinate location to street address.
* Use the [Search Address Reverse Cross Street] API to convert a coordinate location into a human-readable cross street. This is especially useful in tracking applications that receive GPS data from devices or assets and need to determine the nearest street-level location for those coordinates.

## Prerequisites

* An [Azure Maps account]
* A [subscription key]

>[!IMPORTANT]
>
> In the URL examples in this article, you need to replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key.

This article uses the [Bruno] application, but you can choose a different API development environment.

## Request latitude and longitude for an address (geocoding)

The example in this section uses [Get Search Address] to convert an address into latitude and longitude coordinates. This process is also called *geocoding*. In addition to returning the coordinates, the response also returns detailed address properties such as street, postal code, municipality, and country/region information.

> [!TIP]
> If you have a set of addresses to geocode, you can use [Post Search Address Batch] to send a batch of queries in a single request.

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/search/address/json?&subscription-key={Your-Azure-Maps-Subscription-key}&api-version=1.0&language=en-US&query=400 Broad St, Seattle, WA 98109
    ```

1. Select the **Create** button.

1. Select the run button.

    This request searches for a specific address: `400 Broad St, Seattle, WA 98109`. Next, search an address that has more than one possible location.

1. In the **Params** section, change the `query` key to `400 Broad, Seattle`, then select the run button.

    :::image type="content" source="./media/how-to-search-for-address/search-address.png" alt-text="Search for address":::

1. Next, try setting the `query` key to `400 Broa`, then select the run button.

   The response includes results from multiple countries/regions. To [geobias] results to the relevant area for your users, always add as many location details as possible to the request.

## Fuzzy Search

[Fuzzy Search] supports standard single line and free-form searches. We recommend that you use the Azure Maps Search Fuzzy API when you don't know your user input type for a search request. The query input can be a full or partial address. It can also be a Point of Interest (POI) token, like a name of POI, POI category or name of brand. Furthermore, to improve the relevance of your search results, constrain the query results using a coordinate location and radius, or by defining a bounding box.

> [!TIP]
> Most Search queries default to `maxFuzzyLevel=1` to improve performance and reduce unusual results. Adjust fuzziness levels by using the `maxFuzzyLevel` or `minFuzzyLevel` parameters. For more information on `maxFuzzyLevel` and a complete list of all optional parameters, see [Fuzzy Search URI Parameters].

### Search for an address using Fuzzy Search

The example in this section uses `Fuzzy Search` to search the entire world for *pizza*, then searches over the scope of a specific country/region. Finally, it demonstrates how to use a coordinate location and radius to scope a search over a specific area, and limit the number of returned results.

> [!IMPORTANT]
> To geobias results to the relevant area for your users, always add as many location details as possible. For more information, see [Best Practices for Search].

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&subscription-key={Your-Azure-Maps-Subscription-key}&language=en-US&query=pizza
    ```

    > [!NOTE]
    > The _json_ attribute in the URL path determines the response format. This article uses JSON for ease of use and readability. To find other supported response formats, see the `format` parameter definition in the [URI Parameter reference] documentation.

1. Select the run button, then review the response body.

    The ambiguous query string for "pizza" returned 10 [point of interest] (POI) results in both the "pizza" and "restaurant" categories. Each result includes details such as street address, latitude and longitude values, view port, and entry points for the location. The results are now varied for this query, and aren't tied to any reference location.
  
    In the next step, you'll use the `countrySet` parameter to specify only the countries/regions for which your application needs coverage. For a complete list of supported countries/regions, see [Azure Maps geocoding coverage].

1. The default behavior is to search the entire world, potentially returning unnecessary results. Next, search for pizza only in the United States. Add the `countrySet` key to the **Params** section, and set its value to `US`. Setting the `countrySet` key to `US` bounds the results to the United States.

    :::image type="content" source="./media/how-to-search-for-address/search-fuzzy-country.png" alt-text="Search for pizza in the United States":::

    The results are now bounded by the country code and the query returns pizza restaurants in the United States.

1. To get an even more targeted search, you can search over the scope of a lat/lon coordinate pair. The following example uses the lat/lon coordinates of the Seattle Space Needle. Since we only want to return results within a 400-meters radius, we add the `radius` parameter. Also, we add the `limit` parameter to limit the results to the five closest pizza places.

    In the **Params** section, add the following key/value pairs:

    | Key    | Value      |
    |--------|------------|
    | lat    | 47.620525  |
    | lon    | -122.349274|
    | radius | 400        |
    | limit  | 5          |

1. Select run. The response includes results for pizza restaurants near the Seattle Space Needle.

## Search for a street address using Reverse Address Search

[Get Search Address Reverse] translates coordinates into human readable street addresses. This API is often used for applications that consume GPS feeds and want to discover addresses at specific coordinate points.

> [!IMPORTANT]
> To [geobias] results to the relevant area for your users, always add as many location details as possible. For more information, see [Best Practices for Search].

> [!TIP]
> If you have a set of coordinate locations to reverse geocode, you can use [Post Search Address Reverse Batch] to send a batch of queries in a single request.

This example demonstrates making reverse searches using a few of the optional parameters that are available. For the full list of optional parameters, see [Reverse Search Parameters].

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key={Your-Azure-Maps-Subscription-key}&language=en-US&query=47.591180,-122.332700
    ```

1. Select the run button, and review the response body. You should see one query result. The response includes key address information about T-Mobile Park.
  
1. Next, add the following key/value pairs to the **Params** section:

    | Key | Value | Returns |
    |-----|-------|---------|
    | number | 1 |The response can include the side of the street (Left/Right) and also an offset position for the number.|
    | returnSpeedLimit | true | Returns the speed limit at the address.|
    | returnRoadUse | true | Returns road use types at the address. For all possible road use types, see [Road Use Types].|
    | returnMatchType | true| Returns the type of match. For all possible values, see [Reverse Address Search Results]. |

   :::image type="content" source="./media/how-to-search-for-address/search-reverse.png" alt-text="Search reverse.":::

1. Select the run button, and review the response body.

1. Next, add the `entityType` key, and set its value to `Municipality`. The `entityType` key overrides the `returnMatchType` key in the previous step. `returnSpeedLimit` and `returnRoadUse` also need removed since you're requesting information about the municipality. For all possible entity types, see [Entity Types].

    :::image type="content" source="./media/how-to-search-for-address/search-reverse-entity-type.png" alt-text="Search reverse entityType.":::

1. Select the run button. Compare the results to the results returned in step 5. Because the requested entity type is now `municipality`, the response doesn't include street address information. Also, the returned `geometryId` can be used to request boundary polygon through Azure Maps Get [Search Polygon API].

> [!TIP]
> For more information, see [Reverse Search Parameters].

## Search for cross street using Reverse Address Cross Street Search

This example demonstrates how to search for a cross street based on the coordinates of an address.

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:
  
    ```http
    https://atlas.microsoft.com/search/address/reverse/crossstreet/json?api-version=1.0&subscription-key={Your-Azure-Maps-Subscription-key}&language=en-US&query=47.591180,-122.332700
    ```

1. Select the run button, and review the response body. Notice that the response contains a `crossStreet` value of `South Atlantic Street`.

:::zone-end

:::zone pivot="search-latest"

This article demonstrates how to:

* Request latitude and longitude coordinates for an address (geocode address location) by using [Get Geocoding].
* Search for a partial address using [Get Geocode Autocomplete].
* Use [Get Reverse Geocoding] to translate coordinate location to street address.
* Translate coordinate location into a human understandable cross street using [Get Reverse Geocoding], most often needed in tracking applications that receive a GPS feed from a device or asset, and wish to know where the coordinate is located.

## Prerequisites

* An [Azure Maps account]
* A [subscription key]

>[!IMPORTANT]
>
> In the URL examples in this article, you need to replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key.

This article uses the [Bruno] application, but you can choose a different API development environment.

## Request coordinates for an address using Get Geocoding

The example in this section uses [Get Geocoding] to convert an address into latitude and longitude coordinates. This process is also called *geocoding*. In addition to returning the coordinates, the response also returns detailed address properties such as street, postal code, municipality, and country/region information.

> [!TIP]
> If you have a set of addresses to geocode, you can use [Get Geocoding Batch] to send a batch of queries in a single request.

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    GET https://atlas.microsoft.com/geocode?api-version=2025-01-01&subscription-key={Your-Azure-Maps-Subscription-key}&query=400 Broad St, Seattle, WA 98109
    ```

1. Select the **Create** button.

1. Select the run button.

    This request searches for a specific address: `400 Broad St, Seattle, WA 98109`. Next, search an address that has more than one possible location.

1. In the **Params** section, change the `query` key to `400 Broad, Seattle`, then select the run button.

1. Next, try setting the `query` key to `400 Broa`, then select the run button.

   The response includes results from multiple countries/regions. To [geobias] results to the relevant area for your users, always add as many location details as possible to the request.

## Use Get Geocode Autocomplete for partial address search

The [Get Geocode Autocomplete] API supports both single-line and free-form address inputs, making it ideal for scenarios where a complete address is unavailable. You can submit either a full or partial address as the query. To enhance the accuracy and relevance of the results, it's recommended to constrain the search by specifying coordinates or a bounding box.

### Search for a place

This example demonstrates how to use the Get Geocode Autocomplete API to search for a place in the entire North American continent for partial input like "university of w." It then shows how to narrow the search scope to a specific country or region using the `countryRegion` parameter. Finally, it demonstrates how to use the `coordinates` parameter to focus the search to a specific area.

> [!IMPORTANT]
> To geobias results to the relevant area for your users, always add as many location details as possible. For more information, see [Best Practices for Search].

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/geocode:autocomplete?api-version=2025-06-01-preview&query=university of w&bbox=-168,-52,5,84&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the run button, then review the response body.

   > [!NOTE]
    > The `bbox` parameter in the URL defines a bounding box that encompasses **Canada**, the **United States**, **Mexico**, **Greenland**, and parts of the **Caribbean**. It returns several universities located within this area, including:
    >
    > - **University of Washington** in King County, Washington State, USA  
    > - **University of Waterloo** in Waterloo, Ontario, Canada  
    > - **University of Wyoming** in Laramie, Wyoming, USA  
    > - **University of Windsor** in Windsor, Ontario, Canada  
    > - **University of West Florida** in Escambia County, Florida, USA

Next, narrow down the area included in your search to the United States, using the `countryRegion` parameter.

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/geocode:autocomplete?api-version=2025-06-01-preview&query=university of w&bbox=-168,-52,5,84&countryRegion=us&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the run button, then review the response body.

   > [!NOTE]
    > The `bbox` parameter in the URL defines the same bounding box as in the previous example, however the `countryRegion=us` parameter limits results to the United States. It returns several universities located within this area, including:
    >
    > - **University of Washington** in King County, Washington State, USA
    > - **University of Wyoming** in Laramie, Wyoming, USA
    > - **University of West Florida** in Escambia County, Florida, USA
    > - **University of Wisconsin-Superior** in Douglas County, Wisconsin, USA
    > - **University of Wisconsin-Stout** in Menomonie, Dunn County, Wisconsin, USA

Next, focus your search to include more results in a specific area within the defined `countryRegion`, using the `coordinates` parameter. This results in more items returned near the specified area that would otherwise not make the list.

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/geocode:autocomplete?api-version=2025-06-01-preview&query=university of w&bbox=-168,-52,5,84&countryRegion=us&coordinates=-122.136791,47.642232&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the run button, then review the response body.

   > [!NOTE]
    > The `bbox` and `countryRegion` parameters in this URL define the same boundaries as in the previous example, however the `coordinates=-122.136791,47.642232` parameter focuses the search results to the specified area. It returns a local university that would otherwise not be returned.
    >
    > - **University of Washington** in King County, Washington State, USA
    > - **University of Washington, Tacoma** in Tacoma, Pierce County, Washington State, USA
    > - **University of Wyoming** in Laramie, Wyoming, USA
    > - **University of West Florida** in Escambia County, Florida, USA
    > - **University of Wisconsin-Stout** in Menomonie, Dunn County, Wisconsin, USA

### Search for an address

The examples in this section demonstrate the difference between searching for a place and searching for an address using the `resultTypeGroups` parameter of the [Get Geocode Autocomplete] API, using examples that search for Disneyland in southern California using partial input like "dis" and the `coordinates` parameter to focus the search to a specific area.

> [!IMPORTANT]
> To geobias results to the relevant area for your users, always add as many location details as possible. For more information, see [Best Practices for Search].

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/geocode:autocomplete?api-version=2025-06-01-preview&query=dis&coordinates=-117.920219,33.809570&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the run button, then review the response body.

    Notice that the response contains *place* values that include:

    | Property name    | Property value                           |
    |------------------|------------------------------------------|
    | typeGroup        | Place                                    |
    | type             | AmusementPark                            |
    | name             | Disney California Adventure Park         |

    > [!TIP]
    > The `type` property is most relevant when using `resultTypeGroups=place`. To view available types, refer to the [Autocomplete ResultType Enum]. To define which types to search, use the `resultTypes` [URI parameter]. For implementation details, see the [Autocomplete API call to search for 'Muir Woods', filtered by park and populated place resultTypes, place resultTypeGroups] example.

1. When no values are provided for the `resultTypeGroups` parameter, queries can return both place and address values. If your only interested in searching for addresses, include `resultTypeGroups=address` in your request:

    ```http
    https://atlas.microsoft.com/geocode:autocomplete?api-version=2025-06-01-preview&query=dis&coordinates=-117.920219,33.809570&resultTypeGroups=address&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

    Notice that the response contains *address* values that include:

    | Property name    | Property value                               |
    |------------------|----------------------------------------------|
    | typeGroup        | Address                                      |
    | streetName       | Disneyland                                   |
    | formattedAddress | Disneyland, Anaheim, CA 92802, United States |

## Search for a street address using Get Reverse Geocoding

[Get Reverse Geocoding] translates coordinates into human readable street addresses. This API is often used for applications that consume GPS feeds and want to discover addresses at specific coordinate points.

> [!IMPORTANT]
> To [geobias] results to the relevant area for your users, always add as many location details as possible. For more information, see [Best Practices for Search].

> [!TIP]
> If you have a set of coordinate locations to reverse geocode, you can use [Get Reverse Geocoding Batch] to send a batch of queries in a single request.

This example demonstrates making reverse searches using a few of the optional parameters that are available. For the full list of optional parameters, see [Get Reverse Geocoding Parameters].

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/reverseGeocode?api-version=2025-01-01&subscription-key={Your-Azure-Maps-Subscription-key}&coordinates=-122.332700,47.591180
    ```

1. Select the run button, and review the response body. You should see one query result. The response includes key address information about T-Mobile Park.
  
1. Next, add the following parameter to the request: `resultTypes=Postcode1`

    ```http
    https://atlas.microsoft.com/reverseGeocode?api-version=2025-01-01&subscription-key={Your-Azure-Maps-Subscription-key}&coordinates=-122.332700,47.591180&resultTypes=Postcode1
    ```

1. Select the run button, and compare the results to the results returned previously. Because the requested result type is now `Postcode1`, the response doesn't include street address information, just the zip code.

## Search for cross street using Get Reverse Geocoding

This example demonstrates how to search for a cross street based on the coordinates of an address.

1. Open the [Bruno] application.

1. Select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:
  
    ```http
    https://atlas.microsoft.com/reverseGeocode?api-version=2025-01-01&coordinates=-122.12429011774091,47.61697905124655&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the run button, and review the response body.

   The response includes an `intersection` section that identifies the street portion of the returned address: *NE 8th St*. It also specifies the intersecting street: *164th Ave NE*, and provides the full cross street as: *NE 8th St and 164th Ave NE*.

   ```json
    "intersection": {
    "baseStreet": "NE 8th St",
    "displayName": "NE 8th St and 164th Ave NE",
    "intersectionType": "Near",
    "secondaryStreet1": "164th Ave NE"
    }
   ```

:::zone-end

## Next steps

> [!div class="nextstepaction"]
> [Azure Maps Search service]

> [!div class="nextstepaction"]
> [Best practices for Azure Maps Search service]

[Autocomplete API call to search for 'Muir Woods', filtered by park and populated place resultTypes, place resultTypeGroups]: /rest/api/maps/search/get-geocode-autocomplete?#autocomplete-api-call-to-search-for-'muir-woods',-filtered-by-park-and-populated-place-resulttypes,-place-resulttypegroups
[Autocomplete ResultType Enum]: /rest/api/maps/search/get-geocode-autocomplete?#autocompleteresulttypeenum
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps geocoding coverage]: geocoding-coverage.md
[Azure Maps Search service]: /rest/api/maps/search?view=rest-maps-1.0&preserve-view=true
[Best practices for Azure Maps Search service]: how-to-use-best-practices-for-search.md
[Best Practices for Search]: how-to-use-best-practices-for-search.md#geobiased-search-results
[bruno]: https://www.usebruno.com/
[Entity Types]: /rest/api/maps/search/getsearchaddressreverse?view=rest-maps-1.0&preserve-view=true#entitytype
[Fuzzy Search URI Parameters]: /rest/api/maps/search/getsearchfuzzy?view=rest-maps-1.0&preserve-view=true#uri-parameters
[Fuzzy Search]: /rest/api/maps/search/getsearchfuzzy?view=rest-maps-1.0&preserve-view=true
[geobias]: glossary.md#geobias
[Get Geocode Autocomplete]: /rest/api/maps/search/get-geocode-autocomplete
[Get Geocoding Batch]: /rest/api/maps/search/get-geocoding-batch
[Get Geocoding]: /rest/api/maps/search/get-geocoding
[Get Reverse Geocoding Batch]: /rest/api/maps/search/get-reverse-geocoding-batch
[Get Reverse Geocoding Parameters]: /rest/api/maps/search/get-reverse-geocoding#uri-parameters
[Get Reverse Geocoding]: /rest/api/maps/search/get-reverse-geocoding
[Get Search Address Reverse]: /rest/api/maps/search/getsearchaddressreverse?view=rest-maps-1.0&preserve-view=true
[Get Search Address]: /rest/api/maps/search/getsearchaddress?view=rest-maps-1.0&preserve-view=true
[point of interest]: /rest/api/maps/search/getsearchpoi?view=rest-maps-1.0&preserve-view=true#searchpoiresponse
[Post Search Address Batch]: /rest/api/maps/search/postsearchaddressbatch
[Post Search Address Reverse Batch]: /rest/api/maps/search/postsearchaddressreversebatch?view=rest-maps-1.0&preserve-view=true
[Reverse Address Search Results]: /rest/api/maps/search/getsearchaddressreverse?view=rest-maps-1.0&preserve-view=true#searchaddressreverseresult
[Reverse Address Search]: /rest/api/maps/search/getsearchaddressreverse?view=rest-maps-1.0&preserve-view=true
[Reverse Search Parameters]: /rest/api/maps/search/getsearchaddressreverse?view=rest-maps-1.0&preserve-view=true#uri-parameters
[Road Use Types]: /rest/api/maps/search/getsearchaddressreverse?view=rest-maps-1.0&preserve-view=true#uri-parameters
[Route]: /rest/api/maps/route
[Search Address Reverse Cross Street]: /rest/api/maps/search/getsearchaddressreversecrossstreet?view=rest-maps-1.0&preserve-view=true
[Search Address]: /rest/api/maps/search/getsearchaddress?view=rest-maps-1.0&preserve-view=true
[Search Polygon API]: /rest/api/maps/search/getsearchpolygon?view=rest-maps-1.0&preserve-view=true
[Search]: /rest/api/maps/search?view=rest-maps-1.0&preserve-view=true
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[URI Parameter reference]: /rest/api/maps/search/getsearchfuzzy?view=rest-maps-1.0&preserve-view=true#uri-parameters
[URI parameter]: /rest/api/maps/search/get-geocode-autocomplete?##uri-parameters
[Weather]: /rest/api/maps/weather
