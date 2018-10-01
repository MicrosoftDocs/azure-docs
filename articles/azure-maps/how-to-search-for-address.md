---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: How to search for an address using the Azure Maps Search service  | Microsoft Docs 
description: Learn how to search for an address using the Azure Maps Search service
author: dsk-2015
ms.author: dkshir
ms.date: 09/11/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Find an address using the Azure Maps search service

The Maps search service is a set of RESTful APIs designed for developers to search for addresses, places, points of interest, business listings, and other geographic information. The service assigns a latitude/longitude to a specific address, cross street, geographic feature, or point of interest (POI). Latitude and longitude values returned by the search can be used as parameters in other Maps services like route and traffic flow.

## Prerequisites

To make any calls to the Maps service APIs, you need a Maps account and key. For information on creating an account and retrieving a key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to build REST calls. You can use any API development environment that you prefer.

## Using fuzzy search

The default API for the search service is [fuzzy search](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) and is useful when you do not know what your user inputs are for a search query. The API combines POI search and geocoding into a canonical 'single-line search'. For example, the API can handle inputs of any address or POI token combination. It can also be weighted with a contextual position (lat./lon. pair), fully constrained by a coordinate and radius, or executed more generally without any geo biasing anchor point.

Most Search queries default to `maxFuzzyLevel=1` to gain performance and reduce unusual results. This default can be overridden as needed per request by passing in the query parameter `maxFuzzyLevel=2` or `3`.

### Search for an address using Fuzzy Search

1. Open the Postman app, click New | Create New, and select **GET request**. Enter a Request name of **Fuzzy search**, select a collection or folder to save it to, and click **Save**.

2. On the Builder tab, select the **GET** HTTP method and enter the request URL for your API endpoint.

    ![Fuzzy Search ](./media/how-to-search-for-address/fuzzy_search_url.png)

    | Parameter | Suggested value |
    |---------------|------------------------------------------------|
    | HTTP method | GET |
    | Request URL | [https://atlas.microsoft.com/search/fuzzy/json?](https://atlas.microsoft.com/search/fuzzy/json?) |
    | Authorization | No Auth |

    The **json** attribute in the URL path determines the response format. You are using json throughout this article for ease of use and readability. You can find the available response formats in the **Get Search Fuzzy** definition of the [Maps Functional API reference](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy).

3. Click **Params**, and enter the following Key / Value pairs to use as query or path parameters in the request URL:

    ![Fuzzy Search ](./media/how-to-search-for-address/fuzzy_search_params.png)

    | Key | Value |
    |------------------|-------------------------|
    | api-version | 1.0 |
    | subscription-key | \<your Azure Maps key\> |
    | query | pizza |

4. Click **Send** and review the response body.

    The ambiguous query string of "pizza" returned 10 [point of interest result](https://docs.microsoft.com/en-us/rest/api/maps/search/getsearchpoi#searchpoiresponse) (POI) results with categories falling in "pizza" and "restaurant". Each result returns a street address, latitude / longitude values, view port, and entry points for the location.
  
    The results are varied for this query, not tied to any particular reference location. You can use the **countrySet** parameter to specify only the countries for which your application needs coverage, as the default behavior is to search the entire world, potentially returning unnecessary results.

5. Add the following Key / Value pair to the **Params** section and click **Send**:

    | Key | Value |
    |------------------|-------------------------|
    | countrySet | US |
  
    The results are now bounded by the country code and the query returns pizza restaurants in the United States.
  
    To provide results for a location, you can query a point of interest and use the returned latitude and longitude values in your call to the Fuzzy Search service. In this case, you used the Search service to return the location of the Seattle Space Needle and used the lat. / lon. values to orient the search.
  
6. In Params, enter the following Key / Value pairs and click **Send**:

    ![Fuzzy Search ](./media/how-to-search-for-address/fuzzy_search_latlon.png)
  
    | Key | Value |
    |-----|------------|
    | lat | 47.620525 |
    | lon | -122.349274 |

## Search for address properties and coordinates

You can pass a complete or partial street address to the search address API and receive a response that includes detailed address properties such as municipality or subdivision, as well as positional values in latitude and longitude.

1. In Postman, click **New Request** | **GET request** and name it **Address Search**.
2. On the Builder tab, select the **GET** HTTP method, enter the request URL for your API endpoint, and select an authorization protocol, if any.

    ![Address Search ](./media/how-to-search-for-address/address_search_url.png)
  
    | Parameter | Suggested value |
    |---------------|------------------------------------------------|
    | HTTP method | GET |
    | Request URL | [https://atlas.microsoft.com/search/address/json?](https://atlas.microsoft.com/search/address/json?) |
    | Authorization | No Auth |

3. Click **Params**, and enter the following Key / Value pairs to use as query or path parameters in the request URL:
  
    ![Address Search ](./media/how-to-search-for-address/address_search_params.png)
  
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

## Search for a street address using Reverse Address Search

1. In Postman, click **New Request** | **GET request** and name it **Reverse Address Search**.

2. On the Builder tab, select the **GET** HTTP method and enter the request URL for your API endpoint.
  
    ![Reverse Address Search URL ](./media/how-to-search-for-address/reverse_address_search_url.png)
  
    | Parameter | Suggested value |
    |---------------|------------------------------------------------|
    | HTTP method | GET |
    | Request URL | [https://atlas.microsoft.com/search/address/reverse/json?](https://atlas.microsoft.com/search/address/reverse/json?) |
    | Authorization | No Auth |
  
3. Click **Params**, and enter the following Key / Value pairs to use as query or path parameters in the request URL:
  
    ![Reverse Address Search Parameters ](./media/how-to-search-for-address/reverse_address_search_params.png)
  
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

    If the [number](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#search_getsearchaddressreverse_uri_parameters) query parameter is sent with the request, the response may include the side of the street (Left/Right) and also an offset position for that number.
  
6. Add the following Key / Value pair to the **Params** section and click **Send**:

    | Key | Value |
    |-----|------------|
    | returnSpeedLimit | true |
  
    When the [returnSpeedLimit](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#search_getsearchaddressreverse_uri_parameters) query parameter is set, the response return of the posted speed limit.

7. Add the following Key / Value pair to the **Params** section and click **Send**:

    | Key | Value |
    |-----|------------|
    | returnRoadUse | true |

    When the [returnRoadUse](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#search_getsearchaddressreverse_uri_parameters) query parameter is set, the response returns the road use array for reverse geocodes at street level.

8. Add the following Key / Value pair to the **Params** section and click **Send**:

    | Key | Value |
    |-----|------------|
    | roadUse | true |

    You can restrict the reverse geocode query to a specific type of road use using the [roadUse](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse#search_getsearchaddressreverse_uri_parameters) query parameter.
  
## Search for the cross street using Reverse Address Cross Street Search

1. In Postman, click **New Request** | **GET request** and name it **Reverse Address Cross Street Search**.

2. On the Builder tab, select the **GET** HTTP method and enter the request URL for your API endpoint.
  
    ![Reverse Address Cross Street Search ](./media/how-to-search-for-address/reverse_address_search_url.png)
  
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

- Explore the [Azure Maps search service](https://docs.microsoft.com/rest/api/maps/search) API documentation.
