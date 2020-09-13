---
title: "Sending search queries to the Bing Visual Search API"
titleSuffix: Azure Cognitive Services
description: This article describes the parameters and attributes of requests sent to the Bing Visual Search API, as well as the response object.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: conceptual
ms.date: 01/08/2019
ms.author: aahi
---

# Sending search queries to the Bing Visual Search API

This article describes the parameters and attributes of requests sent to the Bing Visual Search API, as well as the response object. 

You can get insights about an image in three ways:

- Using an insights token that you get from an image in a previous call to one of the [Bing Image Search API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference) endpoints.
- Sending the URL of an image.
- Uploading an image (in binary format).

## Bing Visual Search requests

If you send Visual Search an image token or URL, the following snippet shows the JSON object that you must include in the body of the POST:

```json
{
    "imageInfo" : {
        "url" : "",
        "imageInsightsToken" : "",
        "cropArea" : {
            "top" : 0.1,
            "left" : 0.5,
            "right" : 0.9,
            "bottom" : 0.9
        }
    },
    "knowledgeRequest" : {
      "filters" : {
        "site" : ""
      }
    }
}
```

The `imageInfo` object must include either the `url` or `imageInsightsToken` field but not both. Set the `url` field to the URL of an Internet-accessible image. The maximum supported image size is 1 MB.

The `imageInsightsToken` must be set to an insights token. To get an insights token, call the Bing Image API. The response contains a list of `Image` objects. Each `Image` object contains an `imageInsightsToken` field, which contains the token.

The `cropArea` field is optional. The crop area specifies the top-left corner and bottom-right corner of a region of interest. Specify the values in the range 0.0 through 1.0. The values are a percentage of the overall width or height. For example, the above example marks the right half of the image as the region of interest. Include it if you want to limit the insights request to the region of interest.

The `filters` object contains a site filter (see the `site` field) that you can use to restrict the similar images and similar products results to a specific domain. For example, if the image is of a Surface Book, you can set `site` to `www.microsoft.com`.

If you want to get insights about a local copy of an image, upload the image as binary data.

For details about including these options in the body of the POST, see [Content form types](#content-form-types).

### Search endpoint

The Visual Search endpoint is: https:\/\/api.cognitive.microsoft.com/bing/v7.0/images/visualsearch.

Requests must be sent as HTTP POST requests only.

### Query parameters

The following are the query parameters your request should specify. At a minimum, you should include the `mkt` query parameter:

| Name | Value | Type | Required |
| --- | --- | --- | --- |
| <a name="cc"></a>cc  | A two-character country code that represents where the results come from.<br /><br /> If you set this parameter, you must also specify the [Accept-Language](#acceptlanguage) header. Bing uses the first supported language it finds from the list of languages, and combines the language with the country code that you specify to determine the market to return results from. If the languages list does not include a supported language, Bing finds the closest language and market that supports the request. Or it may use an aggregated or default market for the results instead of the specified one.<br /><br /> You should use this query parameter and the `Accept-Language` query parameter only if you specify multiple languages; otherwise, you should use the `mkt` and `setLang` query parameters.<br /><br /> This parameter and the [mkt](#mkt) query parameter are mutually exclusive&mdash;do not specify both. | String | No       |
| <a name="mkt"></a>mkt   | The market where the results come from. <br /><br /> **NOTE:** You should always specify the market, if known. Specifying the market helps Bing route the request and return an appropriate and optimal response.<br /><br /> This parameter and the [cc](#cc) query parameter are mutually exclusive&mdash;do not specify both. | String | Yes      |
| <a name="safesearch"></a>safeSearch | A filter for adult content. The following are the possible case-insensitive filter values.<br /><ul><li>Off&mdash;Return webpages with adult text or images.<br /><br/></li><li>Moderate&mdash;Return webpages with adult text, but not adult images.<br /><br/></li><li>Strict&mdash;Do not return webpages with adult text or images.</li></ul><br /> The default is Moderate.<br /><br /> **NOTE:** If the request comes from a market that Bing's adult policy requires that `safeSearch` be set to Strict, Bing ignores the `safeSearch` value and uses Strict.<br/><br/>**NOTE:** If you use the `site:` query operator, there is a chance that the response may contain adult content regardless of what the `safeSearch` query parameter is set to. Use `site:` only if you are aware of the content on the site and your scenario supports the possibility of adult content.  | String | No       |
| <a name="setlang"></a>setLang  | The language to use for user interface strings. Specify the language using the ISO 639-1 two-letter language code. For example, the language code for English is EN. The default is EN (English).<br /><br /> Although optional, you should always specify the language. Typically, you set `setLang` to the same language specified by `mkt` unless the user wants the user interface strings displayed in a different language.<br /><br /> This parameter and the [Accept-Language](#acceptlanguage) header are mutually exclusive&mdash;do not specify both.<br /><br /> A user interface string is a string that's used as a label in a user interface. There are few user interface strings in the JSON response objects. Also, any links to Bing.com properties in the response objects apply the specified language. | String | No   |

## Headers

The following are the headers that your request should specify. The `Content-Type` and `Ocp-Apim-Subscription-Key` headers are the only required headers, but you should also include `User-Agent`, `X-MSEdge-ClientID`, `X-MSEdge-ClientIP`, and `X-Search-Location`.

| Header | Description |
| --- | --- |
| <a name="acceptlanguage"></a>Accept-Language  | Optional request header.<br /><br /> A comma-delimited list of languages to use for user interface strings. The list is in decreasing order of preference. For more information, including expected format, see [RFC2616](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).<br /><br /> This header and the [setLang](#setlang) query parameter are mutually exclusive&mdash;do not specify both.<br /><br /> If you set this header, you must also specify the [cc](#cc) query parameter. To determine the market to return results for, Bing uses the first supported language it finds from the list and combines it with the `cc` parameter value. If the list does not include a supported language, Bing finds the closest language and market that supports the request or it uses an aggregated or default market for the results. To determine the market that Bing used, see the `BingAPIs-Market` header.<br /><br /> Use this header and the `cc` query parameter only if you specify multiple languages. Otherwise, use the [mkt](#mkt) and [setLang](#setlang) query parameters.<br /><br /> A user interface string is a string that's used as a label in a user interface. There are few user interface strings in the JSON response objects. Any links to Bing.com properties in the response objects apply the specified language.  |
| <a name="contenttype"></a>Content-Type  |     |
| <a name="market"></a>BingAPIs-Market    | Response header.<br /><br /> The market used by the request. The form is \<languageCode\>-\<countryCode\>. For example, en-US.  |
| <a name="traceid"></a>BingAPIs-TraceId  | Response header.<br /><br /> The ID of the log entry that contains the details of the request. When an error occurs, capture this ID. If you are not able to determine and resolve the issue, include this ID along with the other information that you provide the Support team. |
| <a name="subscriptionkey"></a>Ocp-Apim-Subscription-Key | Required request header.<br /><br /> The subscription key that you received when you signed up for this service in [Cognitive Services](https://www.microsoft.com/cognitive-services/). |
| <a name="pragma"></a>Pragma |   |
| <a name="useragent"></a>User-Agent  | Optional request header.<br /><br /> The user agent originating the request. Bing uses the user agent to provide mobile users with an optimized experience. Although optional, you are encouraged to always specify this header.<br /><br /> The user-agent should be the same string that any commonly used browser sends. For information about user-agents, see [RFC 2616](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).<br /><br /> The following are examples of user-agent strings.<br /><ul><li>Windows Phone&mdash;Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)<br /><br /></li><li>Android&mdash;Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; SCH-I500 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML; like Gecko) Version/4.0 Mobile Safari/533.1<br /><br /></li><li>iPhone&mdash;Mozilla/5.0 (iPhone; CPU iPhone OS 6_1 like Mac OS X) AppleWebKit/536.26 (KHTML; like Gecko) Mobile/10B142 iPhone4;1 BingWeb/3.03.1428.20120423<br /><br /></li><li>PC&mdash;Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko<br /><br /></li><li>iPad&mdash;Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53</li></ul>      |
| <a name="clientid"></a>X-MSEdge-ClientID  | Optional request and response header.<br /><br /> Bing uses this header to provide users with consistent behavior across Bing API calls. Bing often flights new features and improvements, and it uses the client ID as a key for assigning traffic on different flights. If you do not use the same client ID for a user across multiple requests, then Bing may assign the user to multiple conflicting flights. Being assigned to multiple conflicting flights can lead to an inconsistent user experience. For example, if the second request has a different flight assignment than the first, the experience may be unexpected. Also, Bing can use the client ID to tailor web results to that client ID’s search history, providing a richer experience for the user.<br /><br /> Bing also uses this header to help improve result rankings by analyzing the activity generated by a client ID. The relevance improvements help with better quality of results delivered by Bing APIs and in turn enables higher click-through rates for the API consumer.<br /><br /> **IMPORTANT:** Although optional, you should consider this header required. Persisting the client ID across multiple requests for the same end user and device combination enables 1) the API consumer to receive a consistent user experience, and 2) higher click-through rates via better quality of results from the Bing APIs.<br /><br /> The following are the basic usage rules that apply to this header.<br /><ul><li>Each user that uses your application on the device must have a unique, Bing generated client ID.<br /><br/>If you do not include this header in the request, Bing generates an ID and returns it in the X-MSEdge-ClientID response header. The only time that you should NOT include this header in a request is the first time the user uses your app on that device.<br /><br/></li><li>**ATTENTION:** You must ensure that this Client ID is not linkable to any authenticated user account information.</li><li>Use the client ID for each Bing API request that your app makes for this user on the device.<br /><br/></li><li>Persist the client ID. To persist the ID in a browser app, use a persistent HTTP cookie to ensure the ID is used across all sessions. Do not use a session cookie. For other apps such as mobile apps, use the device's persistent storage to persist the ID.<br /><br/>The next time the user uses your app on that device, get the client ID that you persisted.</li></ul><br /> **NOTE:** Bing responses may or may not include this header. If the response includes this header, capture the client ID and use it for all subsequent Bing requests for the user on that device.<br /><br /> **NOTE:** If you include the X-MSEdge-ClientID, you must not include cookies in the request. |
| <a name="clientip"></a>X-MSEdge-ClientIP   | Optional request header.<br /><br /> The IPv4 or IPv6 address of the client device. The IP address is used to discover the user's location. Bing uses the location information to determine safe search behavior.<br /><br /> **NOTE:** Although optional, you are encouraged to always specify this header and the X-Search-Location header.<br /><br /> Do not obfuscate the address (for example, by changing the last octet to 0). Obfuscating the address results in the location not being anywhere near the device's actual location, which may result in Bing serving erroneous results. |
| <a name="location"></a>X-Search-Location   | Optional request header.<br /><br /> A semicolon-delimited list of key/value pairs that describe the client's geographical location. Bing uses the location information to determine safe search behavior and to return relevant local content. Specify the key/value pair as \<key\>:\<value\>. The following are the keys that you use to specify the user's location.<br /><br /><ul><li>lat&mdash;Required. The latitude of the client's location, in degrees. The latitude must be greater than or equal to -90.0 and less than or equal to +90.0. Negative values indicate southern latitudes and positive values indicate northern latitudes.<br /><br /></li><li>long&mdash;Required. The longitude of the client's location, in degrees. The longitude must be greater than or equal to -180.0 and less than or equal to +180.0. Negative values indicate western longitudes and positive values indicate eastern longitudes.<br /><br /></li><li>re&mdash;Required. The radius, in meters, which specifies the horizontal accuracy of the coordinates. Pass the value returned by the device's location service. Typical values might be 22 m for GPS/Wi-Fi, 380 m for cell tower triangulation, and 18,000 m for reverse IP lookup.<br /><br /></li><li>ts&mdash;Optional. The UTC UNIX timestamp of when the client was at the location. (The UNIX timestamp is the number of seconds since January 1, 1970.)<br /><br /></li><li>head&mdash;Optional. The client's relative heading or direction of travel. Specify the direction of travel as degrees from 0 through 360, counting clockwise relative to true north. Specify this key only if the `sp` key is nonzero.<br /><br /></li><li>sp&mdash;Optional. The horizontal velocity (speed), in meters per second, that the client device is traveling.<br /><br /></li><li>alt&mdash;Optional. The altitude of the client device, in meters.<br /><br /></li><li>are&mdash;Optional. The radius, in meters, that specifies the vertical accuracy of the coordinates. Specify this key only if you specify the `alt` key.<br /><br /></li></ul> **NOTE:** Although many of the keys are optional, the more information that you provide, the more accurate the location results are.<br /><br /> **NOTE:** Although optional, you are encouraged to always specify the user's geographical location. Providing the location is especially important if the client's IP address does not accurately reflect the user's physical location (for example, if the client uses VPN). For optimal results, you should include this header and the `X-MSEdge-ClientIP` header, but at a minimum, you should include this header.       |

> [!NOTE]
> Remember that the [Bing Search API use and display requirements](../../bing-web-search/use-display-requirements.md) require compliance with all applicable laws, including regarding use of these headers. For example, in certain jurisdictions, such as Europe, there are requirements to obtain user consent before placing certain tracking devices on user devices.

<a name="content-form-types"></a>

### Content form types

Each request must include the `Content-Type` header. The header must be set to: `multipart/form-data; boundary=\<boundary string\>`, where \<boundary string\> is a unique, opaque string that identifies the boundary of the form data. For example, `boundary=boundary_1234-abcd`.

If you send Visual Search an image token or URL, the following snippet shows the form data you must include in the body of the POST. The form data must include the `Content-Disposition` header and you must set its `name` parameter to "knowledgeRequest". For details about the `imageInfo` object, see the request.

```
--boundary_1234-abcd
Content-Disposition: form-data; name="knowledgeRequest"

{
    "imageInfo" : {
        "url" : "https://contoso.com/2018/05/fashion/red.jpg"
    }
}

--boundary_1234-abcd--
```

You can optionally set the `enableEntityData` attribute in the header to `true` for detailed information on the main entity in the image you upload, including links to the web and attribution information. This field is `false` by default.

```
--boundary_1234-abcd
Content-Disposition: form-data; name="knowledgeRequest"

{
  "imageInfo" : {
      "url" : "https://contoso.com/2018/05/fashion/red.jpg"
  },
  "knowledgeRequest" : {
    "invokedSkillsRequestData" : {
        "enableEntityData" : "true"
    }
  }
}

--boundary_1234-abcd--
```

If you upload a local image, the following snippet shows the form data you must include in the body of the POST. The form data must include the `Content-Disposition` header. Its `name` parameter must be set to "image" and the `filename` parameter may be set to any string. The `Content-Type` header may be set to any commonly used image mime type. The contents of the form is the binary data of the image. The maximum image size you may upload is 1 MB. The largest of the width or height should be 1,500 pixels or less.

```
--boundary_1234-abcd
Content-Disposition: form-data; name="image"; filename="myimagefile.jpg"
Content-Type: image/jpeg

ÿØÿà JFIF ÖÆ68g-¤CWŸþ29ÌÄøÖ‘º«™æ±èuZiÀ)"óÓß°Î= ØJ9á+*G¦...

--boundary_1234-abcd--
```

The following snippet shows how to specify the region of interest of an uploaded image:

```
--boundary_1234-abcd
Content-Disposition: form-data; name="knowledgeRequest"

{
    "imageInfo" : {
        "cropArea" : {
            "top" : 0.2,
            "left" : 0.3,
            "bottom" : 0.7,
            "right" : 0.6
        }
    }
}

--boundary_1234-abcd
Content-Disposition: form-data; name="image"; filename="image"
Content-Type: image/jpeg


ÿØÿà JFIF ÖÆ68g-¤CWŸþ29ÌÄøÖ‘º«™æ±èuZiÀ)"óÓß°Î= ØJ9á+*G¦...

--boundary_1234-abcd--
```

### Example request

The following snippet shows a complete image insights request that passes an image token and region of interest. You get the insights token from a previous call to /images/search:

```  
POST https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch?mkt=en-us HTTP/1.1  
Content-Type: multipart/form-data; boundary=boundary_1234-abcd
Ocp-Apim-Subscription-Key: 123456789ABCDE  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com 

--boundary_1234-abcd
Content-Disposition: form-data; name="knowledgeRequest"

{
    "imageInfo" : {
        "imageInsightsToken" : "mid_D6426898706EC7..."
        "cropArea" : {
            "top" : 0.1,
            "left" : 0.2,
            "bottom" : 0.7,
            "right" : 0.5
        }
    }
}

--boundary_1234-abcd--
```

## Bing Visual Search responses


[!INCLUDE [cognitive-services-bing-url-note](../../../../includes/cognitive-services-bing-url-note.md)]

If there are insights available for the image, the response contains one or more `tags` that contain the insights. The `image` field contains the insights token for the input image:

```json
{
  "_type" : "ImageKnowledge",
  "tags" : [
    {...},
    {...},
    {...},
    {...},
    {...}
  ],
  "image" : {
    "imageInsightsToken" : "bcid_AF8C9CA409421B..."
  }
}
```

The `tags` field contains a display name and list of actions (insights). One of the tags contains a `displayName` field that is set to an empty string. This tag contains the default insights such as webpages that include the image, visually similar images, and shopping sources for items found in the image. Because the entire image is of interest, the default insights tag doesn't include bounding boxes for the regions of interest:

```json
{
  "_type" : "ImageKnowledge",
  "tags" : [
    {
      "displayName" : "",
      "actions" : [
        {...},
        {...},
        {...},
        {...}
      ]
    },
    {...},
    {...},
    {...},
    {...}
  ],
  "image" : {
    "imageInsightsToken" : "bcid_AF8C9CA409421B..."
  }
}
```

For a list of the default insights, see [Default insights tag](../default-insights-tag.md).

The remaining tags contain other insights that may be of interest to the user. For example, if the image contains text, one of the tags may include a TextResults insight, which contains the recognized text. Or, if Bing recognizes an entity (that is, a culturally well-known/popular person, place, or thing) in the image, one of the tags may identify the entity. Visual Search also returns a diverse set of terms (tags) derived from the input image. These tags enable users to explore concepts found in the image. For example, if the input image is of a famous athlete, one of the tags might be Sports, which contains links to images of sports.

Each tag includes a display name that you can use to categorize the insight, bounding box that identifies the region of interest that the insight applies to, the insights themselves, and a thumbnail of the image. For example, if the image is of a person wearing a sports jersey, one of the tags might include a bounding box that bounds the jersey and includes VisualSearch and ProductVisualSearch insights. And another tag might include an ImageResults insight that contains a URL for an /images/search API request to get images that are topically related or a Bing.com search URL that takes the user to the Bing.com image search results.

All tags other than the default insights tag include bounding boxes that identify regions of interest in the image. For example, if the image includes multiple recognized people, tags could include bounding boxes for each of the people, or if the image contains recognized clothing items, tags could include bounding boxes for each recognized clothing item. You can use the bounding boxes to create hot spots over the image that when clicked, provide details about the contents in that region of the image. You should not include hot spots in an image for bounding boxes that identify the entire image.

### Text recognition

If the image contains text that the service recognizes, one of the tags will contain a TextResults insight (action). The insight's `displayName` contains the recognized text:

```json
    {
        "image" : {
            "thumbnailUrl" : "https:\/\/tse3.mm.bing.net\/th?q=%23%23Text..."
        },
        "displayName" : "##TextRecognition",
        "boundingBox" : {
            "queryRectangle" : {
                "topLeft" : {"x" : 0, "y" : 0},
                "topRight" : {"x" : 1, "y" : 0},
                "bottomRight" : {"x" : 1, "y" : 1},
                "bottomLeft" : {"x" : 0, "y" : 1}
            },
            "displayRectangle" : {
                "topLeft" : {"x" : 0, "y" : 0},
                "topRight" : {"x" : 1, "y" : 0},
                "bottomRight" : {"x" : 1, "y" : 1},
                "bottomLeft" : {"x" : 0, "y" : 1}
            }
        },
        "actions" : [{
            "displayName" : "WALK BIKE ACROSS BRIDGE",
            "actionType" : "TextResults"
        }],
        "sources" : ["OCR"]
    }
```

Because the tag's `displayName` field contains ##TextRecognition, do not use it as a category title in the UX. That goes for any display name that starts with ##. Instead, use the action's display name.

Text recognition can also recognize the contact information on business cards, such as phone numbers and email addresses. The bounding box identifies the location of the contact information on the card.

```json
    {
      "image" : {
        "thumbnailUrl" : "https:\/\/tse3.mm.bing.net\/th?q=%23%23TextRecognition..."
      },
      "displayName" : "##TextRecognition",
      "boundingBox" : {
        "queryRectangle" : {
          "topLeft" : {"x" : 0.635, "y" : 0},
          "topRight" : {"x" : 0.77, "y" : 0},
          "bottomRight" : {"x" : 0.77, "y" : 0.4873333},
          "bottomLeft" : {"x" : 0.635, "y" : 0.4873333}
        },
        "displayRectangle" : {
          "topLeft" : {"x" : 0.635, "y" : 0},
          "topRight" : {"x" : 0.77, "y" : 0},
          "bottomRight" : {"x" : 0.77, "y" : 0.4873333},
          "bottomLeft" : {"x" : 0.635, "y" : 0.4873333}
        }
      },
      "actions" : [
        {
          "url" : "tel:888%20555%201212",
          "actionType" : "Uri"
        }
      ],
      "sources" : ["OCR"]
    },
    {
      "image" : {
        "thumbnailUrl" : "https:\/\/tse3.mm.bing.net\/th?q=%23%23TextRecognition..."
      },
      "displayName" : "##TextRecognition",
      "boundingBox" : {
        "queryRectangle" : {
          "topLeft" : {"x" : 0.63, "y" : 0},
          "topRight" : {"x" : 0.866, "y" : 0},
          "bottomRight" : {"x" : 0.866, "y" : 0.5553334},
          "bottomLeft" : {"x" : 0.63, "y" : 0.5553334}
        },
        "displayRectangle" : {
          "topLeft" : {"x" : 0.63, "y" : 0},
          "topRight" : {"x" : 0.866, "y" : 0},
          "bottomRight" : {"x" : 0.866, "y" : 0.5553334},
          "bottomLeft" : {"x" : 0.63, "y" : 0.5553334}
        }
      },
      "actions" : [
        {
          "url" : "mailto:someone@outlook.com",
          "actionType" : "Uri"
        }
      ],
      "sources" : ["OCR"]
    },
    {
      "image" : {
        "thumbnailUrl" : "https:\/\/tse3.mm.bing.net\/th?q=%23%23TextRecognition..."
      },
      "displayName" : "##TextRecognition",
      "boundingBox" : {
        "queryRectangle" : {
          "topLeft" : {"x" : 0, "y" : 0},
          "topRight" : {"x" : 1, "y" : 0},
          "bottomRight" : {"x" : 1, "y" : 1},
          "bottomLeft" : {"x" : 0, "y" : 1}
        },
        "displayRectangle" : {
          "topLeft" : {"x" : 0, "y" : 0},
          "topRight" : {"x" : 1, "y" : 0},
          "bottomRight" : {"x" : 1, "y" : 1},
          "bottomLeft" : {"x" : 0, "y" : 1}
        }
      },
      "actions" : [
        {
          "displayName" : "CHARLENE WHITNEY Graphic Designer 888 555 1212 someone@outlook.com www.contoso.com",
          "actionType" : "TextResults"
        }
      ],
      "sources" : ["OCR"]
    }
```

If the image contains a recognized entity such as a culturally well-known/popular person, place, or thing, one of the tags may include an Entity insight. The `mainEntity` and `data` fields are only available if the `enableEntityData` attribute in the `Content-Type` header is set to `true`.

```json
{
  "image" : {
    "thumbnailUrl" : "https:\/\/tse4.mm.bing.net\/th?q=Statue+of+Liberty..."
  },
  "displayName" : "Statue of Liberty",
  "boundingBox" : {
    "queryRectangle" : {
      "topLeft" : {"x" : 0.40625, "y" : 0.1757813},
      "topRight" : {"x" : 0.6171875, "y" : 0.1757813},
      "bottomRight" : {"x" : 0.6171875, "y" : 0.3867188},
      "bottomLeft" : {"x" : 0.40625, "y" : 0.3867188}
    },
    "displayRectangle" : {
      "topLeft" : {"x" : 0.40625, "y" : 0.1757813},
      "topRight" : {"x" : 0.6171875, "y" : 0.1757813},
      "bottomRight" : {"x" : 0.6171875, "y" : 0.3867188},
      "bottomLeft" : {"x" : 0.40625, "y" : 0.3867188}
    }
  },
  "actions" : [
    {
      "_type" : "ImageEntityAction",
      "webSearchUrl" : "https:\/\/www.bing.com\/search?q=Statue+of+Liberty",
      "displayName" : "Statue of Liberty",
      "actionType" : "Entity",
      "mainEntity" : {
        "name" = "Statue of liberty",
        "bingId" : "..."
      },
      "data" : {
        "id" : "https://api.cognitive.microsoft.com/api/v7/entities/...",
        "readLink": "https://www.bingapis.com/api/v7/search?q=...",
        "readLinkPingSuffix": "...",
        "contractualRules": [
          {
            "_type": "ContractualRules/LicenseAttribution",
            "targetPropertyName": "description",
            "mustBeCloseToContent": true,
            "license": {
                "name": "CC-BY-SA",
                "url": "http://creativecommons.org/licenses/by-sa/3.0/",
                "urlPingSuffix": "..."
            },
            "licenseNotice": "Text under CC-BY-SA license"
          },
          {
            "_type": "ContractualRules/LinkAttribution",
            "targetPropertyName": "description",
            "mustBeCloseToContent": true,
            "text": "Wikipedia",
            "url": "http://en.wikipedia.org/wiki/...",
            "urlPingSuffix": "..."
          }
        ],
        "webSearchUrl": "https://www.bing.com/entityexplore?q=...",
        "webSearchUrlPingSuffix": "...",
        "name": "Statue of Liberty",
        "image": {
          "thumbnailUrl": "https://tse1.mm.bing.net/th?id=...",
          "hostPageUrl": "http://upload.wikimedia.org/wikipedia/...",
          "hostPageUrlPingSuffix": "...",
          "width": 50,
          "height": 50,
          "sourceWidth": 474,
          "sourceHeight": 598
        },
        "description" : "...",
        "bingId": "..."
        }
      }
  ]
}
```

## See also

- [What is the Bing Visual Search API?](../overview.md)
- [Tutorial: Create a Visual Search single-page web app](../tutorial-bing-visual-search-single-page-app.md)
