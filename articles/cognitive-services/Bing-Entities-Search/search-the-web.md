---
title: Search the web for entities and places | Microsoft Docs
description: Shows how to use the Bing Entities Search API to search the web for entities and places.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.assetid: 0B54E747-61BF-42AA-8788-E25D63F625FC
ms.service: cognitive-services
ms.technology: bing-entities-search
ms.topic: article
ms.date: 07/06/2016
ms.author: scottwhi
---

# Searching the web for entities and places

> [!NOTE]
> Preview release of the Entity Search API. All aspects of the API and documentation are subject to change. 


The Entity Search API lets you send a search query to Bing and get back search results that include entities and places. Place results include restaurants, hotel, or other local businesses. For places, the query can specify the name of the local business or it can ask for a list (for example, restaurants near me).

Entity results include persons, places, or things. Place in this context are tourist attractions, states, countries, etc. The API returns entities if Bing is confident that only one entity satisfies the request. For example, if the request specifies a movie, the response includes the entity if Bing is confident that only one movie satisfies the request. But if the request specifies the title of a movie franchise, the response will not include an entity because it's ambiguous as to which version you want. 


## Search query term

If you provide a search box where the user enters their search term, use the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to improve the experience. The API returns suggested query strings based on partial search terms as the user types.

After the user enters their query term, URL encode the term before setting the [q](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#query) query parameter. For example, if the user enters *sailing dinghies*, set `q` to *sailing+dinghies* or *sailing%20dinghies*.

If the query term contains a spelling mistake, the search response includes a [QueryContext](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#querycontext) object. The object shows the original spelling and the corrected spelling that Bing used for the search. 

```
  "queryContext":{  
    "originalQuery":"sialing dingy for sale",  
    "alteredQuery":"sailing dingh for sale",  
    "alterationOverrideQuery":"+sialing dingy for sale"  
  },  
```

You can use this information to let the user know that you modified their query string when you display the search results.

![Query context UX example](../bing-web-search/media/cognitive-services-bing-web-api/bing-query-context.PNG)



## Requesting entities

For an example request, see [Making your first request](./quick-start.md).

The response contains a [SearchResponse](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#searchresponse) object. If Bing finds an entity or place that's relevant, the object includes the `entities` field, `places` field, or both. If Bing does not find relevant entities, the response object will not include the fields.

The `entities` field is an [EntityAnswer](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#entityanswer) object that contains a list of [Entity](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#entity) objects (see the `value` field). Because Bing returns only dominant entities, the list will contain only one entity. A dominant entity is an entity that Bing believes is the only entity that satisfies the request (there is no ambiguity as to which entity satisfies the request). 

Entities include persons such as Adam Levine, places such as Mount Rainier or Pike Place Market, and things such as banana, goldendoodle, book, or movie title. The [entityPresentationInfo](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#entitypresentationinfo) field contains hints that identify the entity's type. For example, if it's a person, movie, animal, or attraction. For a list of possible types, see [Entity Types](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#entitytypes)

```
            "entityPresentationInfo" : {
                "entityScenario" : "DominantEntity",
                "entityTypeHints" : ["Attraction"],
                "entityTypeDisplayHint" : "Mountain"
            },
```

The entity includes a `name`, `description`, and `image` field. When you display these fields in your user experience, you must attribute them. The `contractualRules` field contains a list of attributions that you must apply. The contractual rule identifies the field that the attribution applies to. For information about applying attribution, see [Attribution](#data-attribution).

```
            "contractualRules" : [{
                "_type" : "ContractualRules\/LicenseAttribution",
                "targetPropertyName" : "description",
                "mustBeCloseToContent" : true,
                "license" : {
                    "name" : "CC-BY-SA",
                    "url" : "http:\/\/creativecommons.org\/licenses\/by-sa\/3.0\/"
                },
                "licenseNotice" : "Text under CC-BY-SA license"
            },
            {
                "_type" : "ContractualRules\/LinkAttribution",
                "targetPropertyName" : "description",
                "mustBeCloseToContent" : true,
                "text" : "en.wikipedia.org",
                "url" : "http:\/\/en.wikipedia.org\/wiki\/Mount_Rainier"
            },
            {
                "_type" : "ContractualRules\/MediaAttribution",
                "targetPropertyName" : "image",
                "mustBeCloseToContent" : true,
                "url" : "http:\/\/en.wikipedia.org\/wiki\/Mount_Rainier"
            }],
```

When you display the entity information (name, description, and image), you must also use the URL in the `webSearchUrl` field to link to the Bing search results page that contains the entity.


The `places` field is a [LocalEntityAnswer](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#localentityanswer) object that contains a list of [Place](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#place) objects (see the `value` field). The list contains one or more local entities that satisfy the request.

Places include restaurant, hotels, or local businesses. The [entityPresentationInfo](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#entitypresentationinfo) field contains hints that identify the local entity's type. The list contains a list of hints such as Place, LocalBusiness, Restaurant. Each successive hint in the array narrows the entity's type. For a list of possible types, see [Entity Types](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#entitytypes)

```
            "entityPresentationInfo" : {
                "entityScenario" : "ListItem",
                "entityTypeHints" : ["Place",
                "LocalBusiness",
                "Restaurant"]
            },
```


Local aware entity queries such as *restaurant near me* require the user's location to provide accurate results. Your requests should always use the X-Search-Location and X-MSEdge-ClientIP headers to specify the user's location. If Bing thinks the query would benefit from the user's location, it sets `askUserForLocation` field of [QueryContext](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#querycontext) to **true**. 

```
{
    "_type" : "SearchResponse",
    "queryContext" : {
        "originalQuery" : "cafe flora",
        "askUserForLocation" : true
    },
    . . .
}
```

A place result includes the place's name, address, telephone number and URL to the entity's website. When you display the entity information, you must also use the URL in the `webSearchUrl` field to link to the Bing search results page that contains the entity.

```
    "places" : {
        "value" : [{
            "_type" : "Restaurant",
            "webSearchUrl" : "https:\/\/www.bing.com\/search?q=Cafe%20Flora...",
            "name" : "Cafe Flora",
            "url" : "http:\/\/cafeflora.com\/",
            "entityPresentationInfo" : {
                "entityScenario" : "ListItem",
                "entityTypeHints" : ["Place",
                "LocalBusiness",
                "Restaurant"]
            },
            "address" : {
                "addressLocality" : "Seattle",
                "addressRegion" : "WA",
                "postalCode" : "98112",
                "addressCountry" : "US",
                "neighborhood" : "Madison Park"
            },
            "telephone" : "(206) 325-9100"
        }]
```

  
> [!NOTE]
> You, or a third party on your behalf, may not use, retain, store, cache, share, or distribute any data from the Entities API for the purpose of testing, developing, training, distributing or making available any non-Microsoft service or feature.  





## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]



## Data attribution  

While Bing gathers certain pieces of information from the web, other information is obtained via licensors who place restrictions on the use of their data. In your usage of this API, it is important to realize that while Bing organizes and makes certain inferences or connections with the data, Bing is, in most cases, NOT the owner of this data. As such, partners must ensure that they adhere to fair use, copyright or other restrictions that may exist on the source data.  
  
If an answer or result includes the `contractualRules`, `attributions`, or `provider` fields, you must attribute the data. If the answer does not include any of these fields, no attribution is required. If the answer includes the `contractualRules` field and the `attributions` and/or `provider` fields, you must use the contractual rules to attribute the data.  
  
The following example shows an entity that includes a MediaAttribution contractual rule and an Image that includes a `provider` field. The MediaAttribution rule identifies the image as the target of the rule, so you'd ignore the image's `provider` field and instead use the MediaAttribution rule to provide attribution.  
  
```  
        "value" : [{
            "contractualRules" : [
                . . .
                {
                    "_type" : "ContractualRules\/MediaAttribution",
                    "targetPropertyName" : "image",
                    "mustBeCloseToContent" : true,
                    "url" : "http:\/\/en.wikipedia.org\/wiki\/Space_Needle"
                }
            ],
            . . .
            "image" : {
                "name" : "Space Needle",
                "thumbnailUrl" : "https:\/\/www.bing.com\/th?id=A46378861201...",
                "provider" : [{
                    "_type" : "Organization",
                    "url" : "http:\/\/en.wikipedia.org\/wiki\/Space_Needle"
                }],
                "hostPageUrl" : "http:\/\/www.citydictionary.com\/Uploaded...",
                "width" : 110,
                "height" : 110
            },
            . . .
        }]
```  
  
If a contractual rule includes the `targetPropertyName` field, the rule applies only to the targeted field. Otherwise, the rule applies to the parent object that contains the `contractualRules` field.  
  
  
In the following example, the `LinkAttribution` and `TextAttribution` rules do NOT include the `targetPropertyName` field, so the rule applies to the entity object. For rules that apply to an entity as a whole, you must include a line immediately following the entity data that lists the providers. The line should be clearly labeled to indicate that the providers are the source of the data. For example, "Data from: Wikipedia &#124; STATS LLC © 2016". For `LinkAttribution` rules, you must create a hyperlink to the provider's website. In this case, make Wikipedia a hyperlink to the Wikipedia webpage that contains information about the entity.  
  
```  
"entities" : {  
    "value" : [{  
        . . .  
                "contractualRules" : [  
                    {  
                        "_type" : "ContractualRules\/LinkAttribution",  
                        "text" : "Wikipedia",  
                        "url" : "http:\/\/www.bing.com\/cr?IG=B8AD7..."  
                    },  
                    {  
                        "_type" : "ContractualRules\/TextAttribution",  
                        "text" : "STATS LLC © 2016"  
                    },  
  
```  
  
In the following example, the `LinkAttribution` rule DOES include the `targetPropertyName` field, so the rule applies to the `description` field. For rules that apply to specific fields, you must include a line immediately following the targeted data that contains a hyperlink to the provider's website. For example, to attribute the description, include a line immediately following the description text that contains a hyperlink to the data on the provider's website, in this case create a link to en.wikipedia.org.  
  
```  
"entities" : {  
    "value" : [{  
            . . .  
            "description" : "Peyton Williams Manning is a former American....",  
            . . .  
            "contractualRules" : [{  
                    "_type" : "ContractualRules\/LinkAttribution",  
                    "targetPropertyName" : "description",  
                    "mustBeCloseToContent" : true,  
                    "text" : "en.wikipedia.org",  
                    "url" : "http:\/\/www.bing.com\/cr?IG=B8AD73..."  
                 },  
            . . .  
  
```  

### License Attribution  

If the list of contractual rules includes a [LicenseAttribution](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#licenseattribution) rule, you must display the notice on the line immediately following the content that the license applies to. The `LicenseAttribution` rule uses the `targetPropertyName` field to identify the property that the license applies to.  
  
The following shows an example that includes a `LicenseAttribution` rule.  
  
![License attribution](./media/cognitive-services-bing-web-api/licenseattribution.png)  
  
The license notice that you display must include a hyperlink to the website that contains information about the license. Typically, you make the name of the license a hyperlink. For example, if the notice is **Text under CC-BY-SA license** and CC-BY-SA is the name of the license, you would make CC-BY-SA a hyperlink.  
  
### Link and Text Attribution  

The [LinkAttribution](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#linkattribution) and [TextAttribution](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#textattribution) rules are typically used to identify the provider of the data. If the `LinkAttribution` or `TextAttribution` rule does NOT include the `targetPropertyName` field, the rule applies to the parent object that encompasses the rules; otherwise, the rule applies to the targeted field.  
  
To attribute the providers, include a line immediately following the content that the attributions apply to (for example, the parent object or targeted field). The line should be clearly labeled to indicate that the providers are the source of the data. For example, "Data from: Wikipedia &#124; STATS LLC © 2016". For `LinkAttribution` rules, you must create a hyperlink to the provider's website.  
  
The following shows an example that includes `LinkAttribution` and `TextAttribution` rules.  
  
![Link text attribution](./media/cognitive-services-bing-web-api/linktextattribution.png)  

### Media Attribution  

If the entity includes an image and you display it, you must provide a click-through link to the provider's website. If the entity includes a [MediaAttribution](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#mediaattribution) rule, use the rule's URL to create the click-through link. Otherwise, use the URL included in the image's `provider` field to create the click-through link.  
  
The following shows an example that includes an image's `provider` field and contractual rules. Because the example includes the contractual rule, you will ignore the image's `provider` field and apply the `MediaAttribution` rule.  
  
![Media attribution](./media/cognitive-services-bing-web-api/mediaattribution.png)  


## United States-Based queries only  

Entity Search API is intended for use only within the United States. Partners must use reasonable and best effort to ensure that all users for whom they are originating calls to the API are physically located within the United States. If the user is not physically located within the United States, then do not call this API.  
  
### Search or search-like experience  

Just like with Bing Web Search API, the Entity Search API may only be used as a result of a direct user query or search, or as a result of an action within an app or experience that logically can be interpreted as a user’s search request. For illustration purposes, the following are some examples of acceptable Search or Search-like experiences.  
  
-   User enters a query directly into a search box in an app  
  
-   User selects specific text or image and requests “more information” or “additional information”  
  
-   User asks a search bot about a particular topic  
  
-   User dwells on a particular object or entity in a visual search type scenario  
  
 If you are not sure if your experience can be considered a search-like experience, it is recommended that you check with Microsoft.  



## Next steps

To get started quickly with your first request, see [Making Your First Request](./quick-start.md).

Familiarize yourself with the [Entities Search API Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference). The reference contains the headers and query parameters that you use to request search results. It also includes definitions of the response objects. 

To improve your search box user experience, see [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md). As the user enters their query term, you can call this API to get relevant query terms that were used by others.

Be sure to read [Bing Use and Display Requirements](./useanddisplayrequirements.md) so you don't break any of the rules about using the search results.

