---
title: Project Answer Search reference
titlesuffix: Azure Cognitive Services
description: Reference for Project Answer Search endpoint.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: project-answer-search
ms.topic: reference
ms.date: 04/13/2018
ms.author: rosh, v-gedod
---

# Project Answer Search v7 reference

Bing Answer SearchAPI takes a query parameter and returns a `searchResponse` with `answerType`: `facts` or `entities`. 

Applications that use the Answer Search API send requests to the endpoint with a URL to preview in a query parameter.  The request must include the `q=searchTerm` parameter and *Ocp-Apim-Subscription-Key* header.   

The JSON response can be parsed for facts and entities that contain details about the object of search.

## Endpoint
To request Answer Search results, send a request to the following endpoint. Use the headers and URL parameters to define further specifications.

Endpoint GET: 
````
https://api.labs.cognitive.microsoft.com/answerSearch/v7.0/search?q=<searchTerm>&subscription-key=0123456789ABCDEF&mkt=en-us

````

The request must use the HTTPS protocol and include following query parameter:
-  q=<URL> - The query that identifies the object of search

For examples that show how to make requests, see [C# quickstart](c-sharp-quickstart.md) or [Java quickstart](java-quickstart.md). 

The following sections provide technical details about the response objects, query parameters, and headers that affect the search results. 
  
For information about headers that requests should include, see [Headers](#headers).  
  
For information about query parameters that requests should include, see [Query parameters](#query-parameters).  
  
For information about the JSON objects that the response includes, see [Response objects](#response-objects).

The maximum query URL length is 2,048 characters. To ensure that your URL length does not exceed the limit, the maximum length of your query parameters should be less than 1,500 characters. If the URL exceeds 2,048 characters, the server returns 404 Not found.  

For information about permitted use and display of results, see [Use and display requirements](use-display-requirements.md). 

> [!NOTE]
> Some request headers that are meaningful for other search APIs don’t affect URL Preview
> - Pragma – the caller does not have control over whether URL Preview uses cache
> - Cache-Control – the caller does not have control over whether URL Preview uses cache
> - User-Agent

> Also, some parameters are not currently meaningful for URL Preview API, but may be used in the future for improved globalization. 
 
## Headers  
The following are the headers that a request and response may include.  
  
|Header|Description|  
|------------|-----------------|  
|Accept|Optional request header.<br /><br /> The default media type is application/json. To specify that the response use [JSON-LD](http://json-ld.org/), set the Accept header to application/ld+json.|  
|<a name="acceptlanguage" />Accept-Language|Optional request header.<br /><br /> A comma-delimited list of languages to use for user interface strings. The list is in decreasing order of preference. For more information, including expected format, see [RFC2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).<br /><br /> This header and the [setLang](#setlang) query parameter are mutually exclusive&mdash;do not specify both.<br /><br /> If you set this header, you must also specify the [cc](#cc) query parameter. To determine the market to return results for, Bing uses the first supported language it finds from the list and combines it with the `cc` parameter value. If the list does not include a supported language, Bing finds the closest language and market that supports the request or it uses an aggregated or default market for the results. To determine the market that Bing used, see the BingAPIs-Market header.<br /><br /> Use this header and the `cc` query parameter only if you specify multiple languages. Otherwise, use the [mkt](#mkt) and [setLang](#setlang) query parameters.<br /><br /> A user interface string is a string that's used as a label in a user interface. There are few user interface strings in the JSON response objects. Any links to Bing.com properties in the response objects apply the specified language.|  
|<a name="market" />BingAPIs-Market|Response header.<br /><br /> The market used by the request. The form is \<languageCode\>-\<countryCode\>. For example, en-US.|  
|<a name="traceid" />BingAPIs-TraceId|Response header.<br /><br /> The ID of the log entry that contains the details of the request. When an error occurs, capture this ID. If you are not able to determine and resolve the issue, include this ID along with the other information that you provide the Support team.|  
|<a name="subscriptionkey" />Ocp-Apim-Subscription-Key|Required request header.<br /><br /> The subscription key that you received when you signed up for this service in [Cognitive Services](https://www.microsoft.com/cognitive-services/).|  
|<a name="pragma" />Pragma|Optional request header<br /><br /> By default, Bing returns cached content, if available. To prevent Bing from returning cached content, set the Pragma header to no-cache (for example, Pragma: no-cache).
|<a name="useragent" />User-Agent|Optional request header.<br /><br /> The user agent originating the request. Bing uses the user agent to provide mobile users with an optimized experience. Although optional, you are encouraged to always specify this header.<br /><br /> The user-agent should be the same string that any commonly used browser sends. For information about user agents, see [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).<br /><br /> The following are examples of user-agent strings.<br /><ul><li>Windows Phone&mdash;Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)<br /><br /></li><li>Android&mdash;Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; SCH-I500 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML; like Gecko) Version/4.0 Mobile Safari/533.1<br /><br /></li><li>iPhone&mdash;Mozilla/5.0 (iPhone; CPU iPhone OS 6_1 like Mac OS X) AppleWebKit/536.26 (KHTML; like Gecko) Mobile/10B142 iPhone4;1 BingWeb/3.03.1428.20120423<br /><br /></li><li>PC&mdash;Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko<br /><br /></li><li>iPad&mdash;Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53</li></ul>|
|<a name="clientid" />X-MSEdge-ClientID|Optional request and response header.<br /><br /> Bing uses this header to provide users with consistent behavior across Bing API calls. Bing often flights new features and improvements, and it uses the client ID as a key for assigning traffic on different flights. If you do not use the same client ID for a user across multiple requests, then Bing may assign the user to multiple conflicting flights. Being assigned to multiple conflicting flights can lead to an inconsistent user experience. For example, if the second request has a different flight assignment than the first, the experience may be unexpected. Also, Bing can use the client ID to tailor web results to that client ID’s search history, providing a richer experience for the user.<br /><br /> Bing also uses this header to help improve result rankings by analyzing the activity generated by a client ID. The relevance improvements help with better quality of results delivered by Bing APIs and in turn enables higher click-through rates for the API consumer.<br /><br /> **IMPORTANT:** Although optional, you should consider this header required. Persisting the client ID across multiple requests for the same end user and device combination enables 1) the API consumer to receive a consistent user experience, and 2) higher click-through rates via better quality of results from the Bing APIs.<br /><br /> The following are the basic usage rules that apply to this header.<br /><ul><li>Each user that uses your application on the device must have a unique, Bing generated client ID.<br /><br/>If you do not include this header in the request, Bing generates an ID and returns it in the X-MSEdge-ClientID response header. The only time that you should NOT include this header in a request is the first time the user uses your app on that device.<br /><br/></li><li>Use the client ID for each Bing API request that your app makes for this user on the device.<br /><br/></li><li>**ATTENTION:** You must ensure that this Client ID is not linkable to any authenticatable user account information.</li><br/><li>Persist the client ID. To persist the ID in a browser app, use a persistent HTTP cookie to ensure the ID is used across all sessions. Do not use a session cookie. For other apps such as mobile apps, use the device's persistent storage to persist the ID.<br /><br/>The next time the user uses your app on that device, get the client ID that you persisted.</li></ul><br /> **NOTE:** Bing responses may or may not include this header. If the response includes this header, capture the client ID and use it for all subsequent Bing requests for the user on that device.<br /><br /> **NOTE:** If you include the X-MSEdge-ClientID, you must not include cookies in the request.|  
|<a name="clientip" />X-MSEdge-ClientIP|Optional request header.<br /><br /> The IPv4 or IPv6 address of the client device. The IP address is used to discover the user's location. Bing uses the location information to determine safe search behavior.<br /><br /> **NOTE:** Although optional, you are encouraged to always specify this header and the X-Search-Location header.<br /><br /> Do not obfuscate the address (for example, by changing the last octet to 0). Obfuscating the address results in the location not being anywhere near the device's actual location, which may result in Bing serving erroneous results.|  
|<a name="location" />X-Search-Location|Optional request header.<br /><br /> A semicolon-delimited list of key/value pairs that describe the client's geographical location. Bing uses the location information to determine safe search behavior and to return relevant local content. Specify the key/value pair as \<key\>:\<value\>. The following are the keys that you use to specify the user's location.<br /><br /><ul><li>lat&mdash;The latitude of the client's location, in degrees. The latitude must be greater than or equal to -90.0 and less than or equal to +90.0. Negative values indicate southern latitudes and positive values indicate northern latitudes.<br /><br /></li><li>long&mdash;The longitude of the client's location, in degrees. The longitude must be greater than or equal to -180.0 and less than or equal to +180.0. Negative values indicate western longitudes and positive values indicate eastern longitudes.<br /><br /></li><li>re&mdash; The radius, in meters, which specifies the horizontal accuracy of the coordinates. Pass the value returned by the device's location service. Typical values might be 22m for GPS/Wi-Fi, 380m for cell tower triangulation, and 18,000m for reverse IP lookup.<br /><br /></li><li>ts&mdash; The UTC UNIX timestamp of when the client was at the location. (The UNIX timestamp is the number of seconds since January 1, 1970.)<br /><br /></li><li>head&mdash;Optional. The client's relative heading or direction of travel. Specify the direction of travel as degrees from 0 through 360, counting clockwise relative to true north. Specify this key only if the `sp` key is nonzero.<br /><br /></li><li>sp&mdash; The horizontal velocity (speed), in meters per second, that the client device is traveling.<br /><br /></li><li>alt&mdash; The altitude of the client device, in meters.<br /><br /></li><li>are&mdash;Optional. The radius, in meters, that specifies the vertical accuracy of the coordinates. Radius defaults to 50 Kilometers. Specify this key only if you specify the `alt` key.<br /><br /></li></ul> **NOTE:** Although these keys are optional, the more information that you provide, the more accurate the location results are.<br /><br /> **NOTE:** You are encouraged to always specify the user's geographical location. Providing the location is especially important if the client's IP address does not accurately reflect the user's physical location (for example, if the client uses VPN). For optimal results, you should include this header and the X-MSEdge-ClientIP header, but at a minimum, you should include this header.|

> [!NOTE] 
> Remember that the Terms of Use require compliance with all applicable laws, including regarding use of these headers. For example, in certain jurisdictions, such as Europe, there are requirements to obtain user consent before placing certain tracking devices on user devices.
  

## Query parameters  
The request may include the following query parameters. See the Required column for required parameters. You must URL encode the query parameters.  
  
  
|Name|Value|Type|Required|  
|----------|-----------|----------|--------------|  
|<a name="mkt" />mkt|The market where the results come from. <br /><br />For a list of possible market values, see [Market Codes](#market-codes).<br /><br /> **NOTE:** The URL Preview API currently only supports en-us market and language.<br /><br />|String|Yes|  
|<a name="query" />q|The URL to preview|String|Yes|  
|<a name="responseformat" />responseFormat|The media type to use for the response. The following are the possible case-insensitive values.<br /><ul><li>JSON</li><li>JSONLD</li></ul><br /> The default is JSON. For information about the JSON objects that the response contains, see [Response Objects](#response-objects).<br /><br />  If you specify JsonLd, the response body includes JSON-LD objects that contain the search results. For information about the JSON-LD, see [JSON-LD](http://json-ld.org/).|String|No|  
|<a name="safesearch" />safeSearch|A filter used to filter adult content. The following are the possible case-insensitive filter values.<br /><ul><li>Off&mdash;Return webpages with adult text, images, or videos.<br /><br/></li><li>Moderate&mdash;Return webpages with adult text, but not adult images or videos.<br /><br/></li><li>Strict&mdash;Do not return webpages with adult text, images, or videos.</li></ul><br /> The default is Moderate.<br /><br /> **NOTE:** If the request comes from a market that Bing's adult policy requires that `safeSearch` is set to Strict, Bing ignores the `safeSearch` value and uses Strict.<br/><br/>**NOTE:** If you use the `site:` query operator, there is the chance that the response may contain adult content regardless of what the `safeSearch` query parameter is set to. Use `site:` only if you are aware of the content on the site and your scenario supports the possibility of adult content. |String|No|  
|<a name="setlang" />setLang|The language to use for user interface strings. Specify the language using the ISO 639-1 2-letter language code. For example, the language code for English is EN. The default is EN (English).<br /><br /> Although optional, you should always specify the language. Typically, you set `setLang` to the same language specified by `mkt` unless the user wants the user interface strings displayed in a different language.<br /><br /> This parameter and the [Accept-Language](#acceptlanguage) header are mutually exclusive&mdash;do not specify both.<br /><br /> A user interface string is a string that's used as a label in a user interface. There are few user interface strings in the JSON response objects. Also, any links to Bing.com properties in the response objects apply the specified language.|String|No| 


## Response Objects  
The response schema is either a [WebPage] or ErrorResponse, as in the Web Search API. If the request fails, the top-level object is the [ErrorResponse](#errorresponse) object.


|Object|Description|  
|------------|-----------------|  
|[WebPage]|Top level JSON object that contains attributes of preview.|  
|[Fact]|Top level JSON object that contains facts.| 
|[Entities|Top level JSON object that contains entity details.| 

  
### Error  
Defines the error that occurred.  
  
|Element|Description|Type|  
|-------------|-----------------|----------|  
|<a name="error-code" />code|The error code that identifies the category of error. For a list of possible codes, see [Error Codes](#error-codes).|String|  
|<a name="error-message" />message|A description of the error.|String|  
|<a name="error-moredetails" />moreDetails|A description that provides additional information about the error.|String|  
|<a name="error-parameter" />parameter|The query parameter in the request that caused the error.|String|  
|<a name="error-subcode" />subCode|The error code that identifies the error. For example, if `code` is InvalidRequest, `subCode` may be ParameterInvalid or ParameterInvalidValue. |String|  
|<a name="error-value" />value|The query parameter's value that was not valid.|String|  
  

### ErrorResponse  
The top-level object that the response includes when the request fails.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|Type hint.|String|  
|<a name="errors" />errors|A list of errors that describe the reasons why the request failed.|[Error](#error)|  

  
  
### License  
Defines the license under which the text or photo may be used.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|name|The name of the license.|String|  
|url|The URL to a website where the user can get more information about the license.<br /><br /> Use the name and URL to create a hyperlink.|String|  
  

### LicenseAttribution  
Defines a contractual rule for license attribution.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|A type hint, which is set to LicenseAttribution.|String|  
|license|The license under which the content may be used.|[License](#license)|  
|licenseNotice|The license to display next to the targeted field. For example, "Text under CC-BY-SA license".<br /><br /> Use the license's name and URL in the `license` field to create a hyperlink to the website that describes the details of the license. Then, replace the license name in the `licenseNotice` string (for example, CC-BY-SA) with the hyperlink you just created.|String|  
|mustBeCloseToContent|A Boolean value that determines whether the contents of the rule must be placed in close proximity to the field that the rule applies to. If **true**, the contents must be placed in close proximity. If **false**, or this field does not exist, the contents may be placed at the caller's discretion.|Boolean|  
|targetPropertyName|The name of the field that the rule applies to.|String|  
  

### Link  
Defines the components of a hyperlink.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|Type hint.|String|  
|text|The display text.|String|  
|url|A URL. Use the URL and display text to create a hyperlink.|String|  
  

### LinkAttribution  
Defines a contractual rule for link attribution.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|A type hint, which is set to LinkAttribution.|String|  
|mustBeCloseToContent|A Boolean value that determines whether the contents of the rule must be placed in close proximity to the field that the rule applies to. If **true**, the contents must be placed in close proximity. If **false**, or this field does not exist, the contents may be placed at the caller's discretion.|Boolean|  
|targetPropertyName|The name of the field that the rule applies to.<br /><br /> If a target is not specified, the attribution applies to the entity as a whole and should be displayed immediately following the entity presentation. If there are multiple text and link attribution rules that do not specify a target, you should concatenate them and display them using a "Data from: " label. For example, “Data from <provider name1\> &#124; <provider name2\>".|String|  
|text|The attribution text.|String|  
|url|The URL to the provider's website. Use `text` and URL to create of hyperlink.|String|  
  
  
### MediaAttribution  
Defines a contractual rule for media attribution.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|A type hint, which is set to MediaAttribution.|String|  
|mustBeCloseToContent|A Boolean value that determines whether the contents of the rule must be placed in close proximity to the field that the rule applies to. If **true**, the contents must be placed in close proximity. If **false**, or this field does not exist, the contents may be placed at the caller's discretion.|Boolean|  
|targetPropertyName|The name of the field that the rule applies to.|String|  
|url|The URL that you use to create of hyperlink of the media content. For example, if the target is an image, you would use the URL to make the image clickable.|String|  
  
  
  
### Organization  
Defines a publisher.  
  
Note that a publisher may provide their name or their website or both.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|name|The publisher's name.|String|  
|url|The URL to the publisher's website.<br /><br /> Note that the publisher may not provide a website.|String|  
  
  

### WebPage  
Defines information about a the Web page in preview.  
  
|Name|Value|Type|  
|----------|-----------|----------|
|name|The page title, not necessarily the HTML title|String|
|url|The URL that was actually crawled (request may have followed redirects)|String|  
|description|Brief description of the page and content|String|  
|isFamilyFriendly|Most accurate for items in the web index; realtime fetches do this detection based solely on the URL and not the page content|boolean|
|primaryImageOfPage/contentUrl|The URL to a representative image to include in the preview|String| 
  
  
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
|<a name="ranking-mainline" />mainline|The search results to display in the mainline.|  
|<a name="ranking-pole" />pole|The search results that should be afforded the most visible treatment (for example, displayed above the mainline and sidebar).|  
|<a name="ranking-sidebar" />sidebar|The search results to display in the sidebar.| 


### SearchResponse  
Defines the top-level object that the response includes when the request succeeds.  
  
Note that if the service suspects a denial of service attack, the request will succeed (HTTP status code is 200 OK); however, the body of the response will be empty.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|Type hint, which is set to SearchResponse.|String|  
|WebPage|A JSON object that defines the preview|string|  
  
  
### TextAttribution  
Defines a contractual rule for plain text attribution.  
  
|Name|Value|Type|  
|----------|-----------|----------|  
|_type|A type hint, which is set to TextAttribution.|String|  
|text|The attribution text.<br /><br /> Text attribution applies to the entity as a whole and should be displayed immediately following the entity presentation. If there are multiple text or link attribution rules that do not specify a target, you should concatenate them and display them using a "Data from: " label.|String| 


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
- [C# quickstart](c-sharp-quickstart.md)
- [Java quickstart](java-quickstart.md)
- [Node quickstart](node-quickstart.md)
- [Python quickstart](python-quickstart.md)

