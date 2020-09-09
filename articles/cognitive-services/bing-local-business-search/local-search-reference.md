---
title: Bing Local Business Search API v7 Reference
titleSuffix: Azure Cognitive Services
description: This article provides technical details about the response objects, and the query parameters and headers that affect the search results.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-local-business
ms.topic: conceptual
ms.date: 11/01/2018
ms.author: rosh
---

# Bing Local Business Search API v7 reference

The Local Business Search API sends a search query to Bing to get results that include restaurants, hotels, or other local businesses. For places, the query can specify the name of the local business or a category (for example, restaurants near me). Entity results include persons, places, or things. Place in this context is business entities, states, countries/regions, etc.  

This section provides technical details about the response objects, and the query parameters and headers that affect the search results. For examples that show how to make requests, see [Local Business Search C# quickstart](quickstarts/local-quickstart.md) or [Local Business Search Java quickstart](quickstarts/local-search-java-quickstart.md). 
  
For information about headers that requests should include, see [Headers](#headers).  
  
For information about query parameters that requests should include, see [Query parameters](#query-parameters).  
  
For information about the JSON objects that the response includes, see [Response objects](#response-objects).

For information about permitted use and display of results, see [Use and display requirements](use-display-requirements.md).


  
## Endpoint  
To request local business results, send a GET request to: 

``` 
https://api.cognitive.microsoft.com/bing/v7.0/localbusinesses/search

```
  
The request must use the HTTPS protocol.  
  
> [!NOTE]
> The maximum URL length is 2,048 characters. To ensure that your URL length does not exceed the limit, the maximum length of your query parameters should be less than 1,500 characters. If the URL exceeds 2,048 characters, the server returns 404 Not found.  
  
  
## Headers  
The following are the headers that a request and response may include.  
  
|Header|Description|  
|------------|-----------------|  
|Accept|Optional request header.<br /><br /> The default media type is application/json. To specify that the response use [JSON-LD](https://json-ld.org/), set the Accept header to application/ld+json.|  
|<a name="acceptlanguage"></a>Accept-Language|Optional request header.<br /><br /> A comma-delimited list of languages to use for user interface strings. The list is in decreasing order of preference. For more information, including expected format, see [RFC2616](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).<br /><br /> This header and the [setLang](#setlang) query parameter are mutually exclusive&mdash;do not specify both.<br /><br /> If you set this header, you must also specify the cc query parameter. To determine the market to return results for, Bing uses the first supported language it finds from the list and combines it with the `cc` parameter value. If the list does not include a supported language, Bing finds the closest language and market that supports the request or it uses an aggregated or default market for the results. To determine the market that Bing used, see the BingAPIs-Market header.<br /><br /> Use this header and the `cc` query parameter only if you specify multiple languages. Otherwise, use the [mkt](#mkt) and [setLang](#setlang) query parameters.<br /><br /> A user interface string is a string that's used as a label in a user interface. There are few user interface strings in the JSON response objects. Any links to Bing.com properties in the response objects apply the specified language.|  
|<a name="market"></a>BingAPIs-Market|Response header.<br /><br /> The market used by the request. The form is \<languageCode\>-\<countryCode\>. For example, en-US.|  
|<a name="traceid"></a>BingAPIs-TraceId|Response header.<br /><br /> The ID of the log entry that contains the details of the request. When an error occurs, capture this ID. If you are not able to determine and resolve the issue, include this ID along with the other information that you provide the Support team.|  
|<a name="subscriptionkey"></a>Ocp-Apim-Subscription-Key|Required request header.<br /><br /> The subscription key that you received when you signed up for this service in [Cognitive Services](https://www.microsoft.com/cognitive-services/).|  
|<a name="pragma"></a>Pragma|Optional request header<br /><br /> By default, Bing returns cached content, if available. To prevent Bing from returning cached content, set the Pragma header to no-cache (for example, Pragma: no-cache).
|<a name="useragent"></a>User-Agent|Optional request header.<br /><br /> The user agent originating the request. Bing uses the user agent to provide mobile users with an optimized experience. Although optional, you are encouraged to always specify this header.<br /><br /> The user-agent should be the same string that any commonly used browser sends. For information about user agents, see [RFC 2616](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).<br /><br /> The following are examples of user-agent strings.<br /><ul><li>Windows Phone&mdash;Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)<br /><br /></li><li>Android&mdash;Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; SCH-I500 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML; like Gecko) Version/4.0 Mobile Safari/533.1<br /><br /></li><li>iPhone&mdash;Mozilla/5.0 (iPhone; CPU iPhone OS 6_1 like Mac OS X) AppleWebKit/536.26 (KHTML; like Gecko) Mobile/10B142 iPhone4;1 BingWeb/3.03.1428.20120423<br /><br /></li><li>PC&mdash;Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko<br /><br /></li><li>iPad&mdash;Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53</li></ul>|
|<a name="clientid"></a>X-MSEdge-ClientID|Optional request and response header.<br /><br /> Bing uses this header to provide users with consistent behavior across Bing API calls. Bing often flights new features and improvements, and it uses the client ID as a key for assigning traffic on different flights. If you do not use the same client ID for a user across multiple requests, then Bing may assign the user to multiple conflicting flights. Being assigned to multiple conflicting flights can lead to an inconsistent user experience. For example, if the second request has a different flight assignment than the first, the experience may be unexpected. Also, Bing can use the client ID to tailor web results to that client ID’s search history, providing a richer experience for the user.<br /><br /> Bing also uses this header to help improve result rankings by analyzing the activity generated by a client ID. The relevance improvements help with better quality of results delivered by Bing APIs and in turn enables higher click-through rates for the API consumer.<br /><br /> **IMPORTANT:** Although optional, you should consider this header required. Persisting the client ID across multiple requests for the same end user and device combination enables 1) the API consumer to receive a consistent user experience, and 2) higher click-through rates via better quality of results from the Bing APIs.<br /><br /> The following are the basic usage rules that apply to this header.<br /><ul><li>Each user that uses your application on the device must have a unique, Bing generated client ID.<br /><br/>If you do not include this header in the request, Bing generates an ID and returns it in the X-MSEdge-ClientID response header. The only time that you should NOT include this header in a request is the first time the user uses your app on that device.<br /><br/></li><li>Use the client ID for each Bing API request that your app makes for this user on the device.<br /><br/></li><li>**ATTENTION:** You must ensure that this Client ID is not linkable to any authenticatable user account information.</li><br/><li>Persist the client ID. To persist the ID in a browser app, use a persistent HTTP cookie to ensure the ID is used across all sessions. Do not use a session cookie. For other apps such as mobile apps, use the device's persistent storage to persist the ID.<br /><br/>The next time the user uses your app on that device, get the client ID that you persisted.</li></ul><br /> **NOTE:** Bing responses may or may not include this header. If the response includes this header, capture the client ID and use it for all subsequent Bing requests for the user on that device.<br /><br /> **NOTE:** If you include the X-MSEdge-ClientID, you must not include cookies in the request.|  
|<a name="clientip"></a>X-MSEdge-ClientIP|Optional request header.<br /><br /> The IPv4 or IPv6 address of the client device. The IP address is used to discover the user's location. Bing uses the location information to determine safe search behavior.<br /><br /> **NOTE:** Although optional, you are encouraged to always specify this header and the X-Search-Location header.<br /><br /> Do not obfuscate the address (for example, by changing the last octet to 0). Obfuscating the address results in the location not being anywhere near the device's actual location, which may result in Bing serving erroneous results.|  
|<a name="location"></a>X-Search-Location|Optional request header.<br /><br /> A semicolon-delimited list of key/value pairs that describe the client's geographical location. Bing uses the location information to determine safe search behavior and to return relevant local content. Specify the key/value pair as \<key\>:\<value\>. The following are the keys that you use to specify the user's location.<br /><br /><ul><li>lat&mdash;The latitude of the client's location, in degrees. The latitude must be greater than or equal to -90.0 and less than or equal to +90.0. Negative values indicate southern latitudes and positive values indicate northern latitudes.<br /><br /></li><li>long&mdash;The longitude of the client's location, in degrees. The longitude must be greater than or equal to -180.0 and less than or equal to +180.0. Negative values indicate western longitudes and positive values indicate eastern longitudes.<br /><br /></li><li>re&mdash; The radius, in meters, which specifies the horizontal accuracy of the coordinates. Pass the value returned by the device's location service. Typical values might be 22m for GPS/Wi-Fi, 380m for cell tower triangulation, and 18,000m for reverse IP lookup.<br /><br /></li><li>ts&mdash; The UTC UNIX timestamp of when the client was at the location. (The UNIX timestamp is the number of seconds since January 1, 1970.)<br /><br /></li><li>head&mdash;Optional. The client's relative heading or direction of travel. Specify the direction of travel as degrees from 0 through 360, counting clockwise relative to true north. Specify this key only if the `sp` key is nonzero.<br /><br /></li><li>sp&mdash; The horizontal velocity (speed), in meters per second, that the client device is traveling.<br /><br /></li><li>alt&mdash; The altitude of the client device, in meters.<br /><br /></li><li>are&mdash;Optional. The radius, in meters, that specifies the vertical accuracy of the coordinates. Radius defaults to 50 Kilometers. Specify this key only if you specify the `alt` key.<br /><br /></li></ul> **NOTE:** Although these keys are optional, the more information that you provide, the more accurate the location results are.<br /><br /> **NOTE:** You are encouraged to always specify the user's geographical location. Providing the location is especially important if the client's IP address does not accurately reflect the user's physical location (for example, if the client uses VPN). For optimal results, you should include this header and the X-MSEdge-ClientIP header, but at a minimum, you should include this header.|

> [!NOTE] 
> Remember that the Terms of Use require compliance with all applicable laws, including regarding use of these headers. For example, in certain jurisdictions, such as Europe, there are requirements to obtain user consent before placing certain tracking devices on user devices.
  

## Query parameters  
The request may include the following query parameters. See the Required column for required parameters. You must URL encode the query parameters.  
  
  
|Name|Value|Type|Required|  
|----------|-----------|----------|--------------|
|<a name="count"></a>count|The number of results to return, starting with the index specified by the `offset` parameter.|String|No|   
|<a name="localCategories"></a>localCategories|List of options that define search by business category.  See [Local Business Categories search](local-categories.md)|String|No|  
|<a name="mkt"></a>mkt|The market where the results come from. <br /><br />For a list of possible market values, see Market Codes.<br /><br /> **NOTE:** The Local Business Search API currently only supports en-us market and language.<br /><br />|String|Yes|
|<a name="offset"></a>offset|The index to start results specified by the `count` parameter.|Integer|No|  
|<a name="query"></a>q|The user's search term.|String|No|  
|<a name="responseformat"></a>responseFormat|The media type to use for the response. The following are the possible case-insensitive values.<br /><ul><li>JSON</li><li>JSONLD</li></ul><br /> The default is JSON. For information about the JSON objects that the response contains, see [Response Objects](#response-objects).<br /><br />  If you specify JsonLd, the response body includes JSON-LD objects that contain the search results. For information about the JSON-LD, see [JSON-LD](https://json-ld.org/).|String|No|  
|<a name="safesearch"></a>safeSearch|A filter used to filter adult content. The following are the possible case-insensitive filter values.<br /><ul><li>Off&mdash;Return webpages with adult text, images, or videos.<br /><br/></li><li>Moderate&mdash;Return webpages with adult text, but not adult images or videos.<br /><br/></li><li>Strict&mdash;Do not return webpages with adult text, images, or videos.</li></ul><br /> The default is Moderate.<br /><br /> **NOTE:** If the request comes from a market that Bing's adult policy requires that `safeSearch` is set to Strict, Bing ignores the `safeSearch` value and uses Strict.<br/><br/>**NOTE:** If you use the `site:` query operator, there is the chance that the response may contain adult content regardless of what the `safeSearch` query parameter is set to. Use `site:` only if you are aware of the content on the site and your scenario supports the possibility of adult content. |String|No|  
|<a name="setlang"></a>setLang|The language to use for user interface strings. Specify the language using the ISO 639-1 2-letter language code. For example, the language code for English is EN. The default is EN (English).<br /><br /> Although optional, you should always specify the language. Typically, you set `setLang` to the same language specified by `mkt` unless the user wants the user interface strings displayed in a different language.<br /><br /> This parameter and the [Accept-Language](#acceptlanguage) header are mutually exclusive&mdash;do not specify both.<br /><br /> A user interface string is a string that's used as a label in a user interface. There are few user interface strings in the JSON response objects. Also, any links to Bing.com properties in the response objects apply the specified language.|String|No| 


## Response Objects  
The following are the JSON response objects that the response may include. If the request succeeds, the top-level object in the response is the [SearchResponse](#searchresponse) object. If the request fails, the top-level object is the [ErrorResponse](#errorresponse) object.


|Object|Description|  
|------------|-----------------|  
|[Place](#place)|Defines information about a local business such as a restaurant or hotel.|  

  
### Error  
Defines the error that occurred.  
  
|Element|Description|Type|  
|-------------|-----------------|----------|  
|<a name="error-code"></a>code|The error code that identifies the category of error. For a list of possible codes, see [Error Codes](#error-codes).|String|  
|<a name="error-message"></a>message|A description of the error.|String|  
|<a name="error-moredetails"></a>moreDetails|A description that provides additional information about the error.|String|  
|<a name="error-parameter"></a>parameter|The query parameter in the request that caused the error.|String|  
|<a name="error-subcode"></a>subCode|The error code that identifies the error. For example, if `code` is InvalidRequest, `subCode` may be ParameterInvalid or ParameterInvalidValue. |String|  
|<a name="error-value"></a>value|The query parameter's value that was not valid.|String|  
  

### ErrorResponse  
The top-level object that the response includes when the request fails.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|Type hint.|String|  
|<a name="errors"></a>errors|A list of errors that describe the reasons why the request failed.|[Error](#error)[]|  

  
  
### License  
Defines the license under which the text or photo may be used.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|name|The name of the license.|String|  
|url|The URL to a website where the user can get more information about the license.<br /><br /> Use the name and URL to create a hyperlink.|String|  


### Link  
Defines the components of a hyperlink.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|Type hint.|String|  
|text|The display text.|String|  
|url|A URL. Use the URL and display text to create a hyperlink.|String|  
  


  
### Organization  
Defines a publisher.  
  
Note that a publisher may provide their name or their website or both.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|name|The publisher's name.|String|  
|url|The URL to the publisher's website.<br /><br /> Note that the publisher may not provide a website.|String|  
  
  

### Place  
Defines information about a local business, such as a restaurant or hotel.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|Type hint, which may be set to one of the following:<br /><br /><ul><li>Hotel</li><li>LocalBusiness<br /></li><li>Restaurant</ul><li>|String|  
|address|The postal address of where the entity is located.|PostalAddress|  
|entityPresentationInfo|Additional information about the entity such as hints that you can use to determine the entity's type. For example, whether it's a restaurant or hotel. The `entityScenario` field is set to ListItem.|EntityPresentationInfo|  
|name|The entity's name.|String|  
|telephone|The entity's telephone number.|String|  
|url|The URL to the entity's website.<br /><br /> Use this URL along with the entity's name to create a hyperlink that when clicked takes the user to the entity's website.|String|  
|webSearchUrl|The URL to Bing's search result for this place.|String| 
  
  
### QueryContext  
Defines the query context that Bing used for the request.  
  
|Element|Description|Type|  
|-------------|-----------------|----------|  
|adultIntent|A Boolean value that indicates whether the specified query has adult intent. The value is **true** if the query has adult intent; otherwise, **false**.|Boolean|  
|alterationOverrideQuery|The query string to use to force Bing to use the original string. For example, if the query string is *saling downwind*, the override query string will be *+saling downwind*. Remember to encode the query string which results in *%2Bsaling+downwind*.<br /><br /> This field is included only if the original query string contains a spelling mistake.|String|  
|alteredQuery|The query string used by Bing to perform the query. Bing uses the altered query string if the original query string contained spelling mistakes. For example, if the query string is `saling downwind`, the altered query string will be `sailing downwind`.<br /><br /> This field is included only if the original query string contains a spelling mistake.|String|  
|askUserForLocation|A Boolean value that indicates whether Bing requires the user's location to provide accurate results. If you specified the user's location by using the [X-MSEdge-ClientIP](#clientip) and [X-Search-Location](#location) headers, you can ignore this field.<br /><br /> For location aware queries, such as "today's weather" or "restaurants near me" that need the user's location to provide accurate results, this field is set to **true**.<br /><br /> For location aware queries that include the location (for example, "Seattle weather"), this field is set to **false**. This field is also set to **false** for queries that are not location aware, such as "best sellers".|Boolean|  
|originalQuery|The query string as specified in the request.|String|  

### Identifiable

|Name|Value|Type|  
|-------------|-----------------|----------|
|id|A resource identifier|String|
 
### RankingGroup
Defines a search results group, such as mainline.

|Name|Value|Type|  
|-------------|-----------------|----------|
|items|A list of search results to display in the group.|RankingItem|

### RankingItem
Defines a search result item to display.

|Name|Value|Type|  
|-------------|-----------------|----------|
|resultIndex|A zero-based index of the item in the answer to display. If the item does not include this field, display all items in the answer. For example, display all news articles in the News answer.|Integer|
|answerType|The answer that contains the item to display. For example, News.<br /><br />Use the type to find the answer in the SearchResponse object. The type is the name of a SearchResponse field.<br /><br /> However, use the answer type only if this object includes the value field; otherwise, ignore it.|String|
|textualIndex|The index of the answer in textualAnswers to display.| Unsigned Integer|
|value|The ID that identifies either an answer to display or an item of an answer to display. If the ID identifies an answer, display all items of the answer.|Identifiable|

### RankingResponse  
Defines where on the search results page content should be placed and in what order.  
  
|Name|Value|  
|----------|-----------|  
|<a name="ranking-mainline"></a>mainline|The search results to display in the mainline.|  
|<a name="ranking-pole"></a>pole|The search results that should be afforded the most visible treatment (for example, displayed above the mainline and sidebar).|  
|<a name="ranking-sidebar"></a>sidebar|The search results to display in the sidebar.| 

### SearchResponse  
Defines the top-level object that the response includes when the request succeeds.  
  
Note that if the service suspects a denial of service attack, the request will succeed (HTTP status code is 200 OK); however, the body of the response will be empty.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|Type hint, which is set to SearchResponse.|String|  
|places|A list of entities that are relevant to the search query.|JSON object|  
|queryContext|An object that contains the query string that Bing used for the request.<br /><br /> This object contains the query string as entered by the user. It may also contain an altered query string that Bing used for the query if the query string contained a spelling mistake.|[QueryContext](#querycontext)|  


## Error codes

The following are the possible HTTP status codes that a request returns.  
  
|Status Code|Description|  
|-----------------|-----------------|  
|200|Success.|  
|400|One of the query parameters is missing or not valid.|  
|401|The subscription key is missing or is not valid.|  
|403|The user is authenticated (for example, they used a valid subscription key) but they don’t have permission to the requested resource.<br /><br /> Bing may also return this status if the caller exceeded their queries per month quota.|  
|410|The request used HTTP instead of the HTTPS protocol. HTTPS is the only supported protocol.|  
|429|The caller exceeded their queries per second quota.|  
|500|Unexpected server error.|

If the request fails, the response contains an [ErrorResponse](#errorresponse) object, which contains a list of [Error](#error) objects that describe what caused of error. If the error is related to a parameter, the `parameter` field identifies the parameter that is the issue. And if the error is related to a parameter value, the `value` field identifies the value that is not valid.

```json
{
  "_type": "ErrorResponse", 
  "errors": [
    {
      "code": "InvalidRequest", 
      "subCode": "ParameterMissing", 
      "message": "Required parameter is missing.", 
      "parameter": "q" 
    }
  ]
}

{
  "_type": "ErrorResponse", 
  "errors": [
    {
      "code": "InvalidAuthorization", 
      "subCode": "AuthorizationMissing", 
      "message": "Authorization is required.", 
      "moreDetails": "Subscription key is not recognized."
    }
  ]
}
```

The following are the possible error code and sub-error code values.

|Code|SubCode|Description
|-|-|-
|ServerError|UnexpectedError<br/>ResourceError<br/>NotImplemented|HTTP status code is 500.
|InvalidRequest|ParameterMissing<br/>ParameterInvalidValue<br/>HttpNotAllowed<br/>Blocked|Bing returns InvalidRequest whenever any part of the request is not valid. For example, a required parameter is missing or a parameter value is not valid.<br/><br/>If the error is ParameterMissing or ParameterInvalidValue, the HTTP status code is 400.<br/><br/>If you use the HTTP protocol instead of HTTPS, Bing returns HttpNotAllowed, and the HTTP status code is 410.
|RateLimitExceeded|No sub-codes|Bing returns RateLimitExceeded whenever you exceed your queries per second (QPS) or queries per month (QPM) quota.<br/><br/>If you exceed QPS, Bing returns HTTP status code 429, and if you exceed QPM, Bing returns 403.
|InvalidAuthorization|AuthorizationMissing<br/>AuthorizationRedundancy|Bing returns InvalidAuthorization when Bing cannot authenticate the caller. For example, the `Ocp-Apim-Subscription-Key` header is missing or the subscription key is not valid.<br/><br/>Redundancy occurs if you specify more than one authentication method.<br/><br/>If the error is InvalidAuthorization, the HTTP status code is 401.
|InsufficientAuthorization|AuthorizationDisabled<br/>AuthorizationExpired|Bing returns InsufficientAuthorization when the caller does not have permissions to access the resource. This can occur if the subscription key has been disabled or has expired. <br/><br/>If the error is InsufficientAuthorization, the HTTP status code is 403.

## Next steps
- [Local Business Search quickstart](quickstarts/local-quickstart.md)
- [Local Business Search Java quickstart](quickstarts/local-search-java-quickstart.md)
- [Local Business Search Node quickstart](quickstarts/local-search-node-quickstart.md)
- [Local Business Search Python quickstart](quickstarts/local-search-python-quickstart.md)
