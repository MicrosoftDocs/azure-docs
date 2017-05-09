---
title: Get image insights | Microsoft Docs
description: Shows how to use the Bing Image Search API to get more information about an image.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.assetid: 0BCD936E-D4C0-472D-AE40-F4B2AB6912D5
ms.service: cognitive-services
ms.technology: bing-image-search
ms.topic: article
ms.date: 04/15/2017
ms.author: scottwhi
---

# Get Insights about an Image

Each image includes an insights token that you can use to get information about the image. For example, you can get a collection of related images, web pages that include the image, or a list of merchants where you can buy the product shown in the image.  
  
To get insights about an image, capture the image's [imageInsightsToken](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#image-imageinsightstoken) token in the response. 

```
    "value" : [{
          . . .
          "name":"sailing dinghy.jpg",
          "imageInsightsToken" : "mid_D6426898706EC7..."
          "insightsSourcesSummary" : {
              "shoppingSourcesCount" : 9,
              "recipeSourcesCount" : 0
          },
          . . .
    }],
```

Next, call the Image Search API again and set the [insightsToken](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#insightstoken) query parameter to the token in `imageInsightsToken`.  

To specify the insights that you want to get, set the `modulesRequested` query parameter. To get all insights, set `modulesRequested` to All. To get only the caption and collection insights, set `modulesRequested` to `Caption%2CCollection`. For a complete list of possible insights, see [modulesRequested](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#modulesrequested). Not all insights are available for all images. The response includes all insights that you requested, if available.

The following example requests all available insights for the preceding image.

```
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=sailing+dinghy&insightsToken=mid_D6426898706EC7...&modulesRequested=All&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com
``` 

> [!NOTE]
> Version 7 Preview changes to insights request.
>
> To get insights call the /images/details endpoint. 
>
> To specify the insights that you want to get, set the [modules](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#modulesrequested) query parameter.
>
> ```
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/details?q=sailing+dinghy&insightsToken=mid_D6426898706EC7...&modules=All&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com
> ``` 



## Getting Insights of a Known Image

If you have the URL to an image that you want to get insights of, use the [imgUrl](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#imgurl) query parameter instead of the [insightsToken](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#insightstoken) parameter to specify the image. Or, if you have the image file, you may send the binary of the image in the body of a POST request. If you use a POST request, the Content-Type header must be set to multipart/data-form. With either option, the size of the image may not exceed 1 MB.  
  
If you have a URL to the image, the following example shows how to request insights of an image.

```
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=sailing+dinghy&imgUrl=https%3A%2F%2Fwww.mydomain.com%2Fimages%2Fsunflower.png&modulesRequested=All&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com
``` 

> [!NOTE]
> Version 7 Preview request:
>
> ```
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/details?q=sailing+dinghy&imgUrl=https%3A%2F%2Fwww.mydomain.com%2Fimages%2Fsunflower.png&modules=All&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com
> ``` 

  
## Getting All Image Insights  

To request all insights of an image, set the [modulesRequested](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#modulesrequested) query parameter to All. To get related searches, the request must include the user's query string. This example shows using the [insightsToken](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#insightstoken) to specify the image.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=digital+camera&insightsToken=mid_D6426898706EC7193...&modulesRequested=All&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

The following is the response to the previous request. The top-level object is an [ImageInsightsResponse](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#imageinsightsresponse) object instead of an [Images](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#images) object.  
  
```  
{  
    "_type" : "ImageInsights",  
    "bestRepresentativeQuery" : {  
        "text" : "Contoso Digital Camera",  
        "displayText" : "Contoso Digital Camera",  
        "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?q=Contoso+Digital..."  
    },  
    "imageCaption" : {  
        "caption" : "Shelly Pickles on a go cart racing up the driveway October 12, 1965.",  
        "dataSourceUrl" : "http:\/\/picklesphotos.com\/1965_october_12_go_cart.html",  
        "relatedSearches" : [{  
            "text" : "Shelly Pickles",  
            "displayText" : "Shelly Pickles",  
            "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?q=Shelly+Pickles..."
        }]  
    },  
    "pagesIncluding" : [{  
        "imageId" : "A4B0F8ACC400EBF5B99EFE268C4F0",  
        "name" : "File:sailing dinghy.jpg",  
        "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?q=cameras&view=detailv2&...",  
        "thumbnailUrl" : "https:\/\/tse4.mm.bing.net\/th?id=OIP.Ma8674a23cc7559ecf...",  
        "contentUrl" : "http:\/\/upload.contoso.org\/commons\/e\/ea\/Contender_sailing_dinghy.jpg",  
        "hostPageUrl" : "http:\/\/en.contoso.org\/pics\/File:sailing_dinghy.jpg",  
        "hostPageUrlPingSuffix" : "DevEx,5136.1",  
        "contentSize" : "47684 B",  
        "encodingFormat" : "jpeg",  
        "hostPageDisplayUrl" : "en.contoso.org\/pic\/File:sailing_dinghy.jpg",  
        "width" : 700,  
        "height" : 463,  
        "thumbnail" : {  
            "width" : 300,  
            "height" : 198  
        },  
        "imageInsightsToken" : "mid_A4B0F8ACC400EBFE3CFE57F65A5B.."  
    },  
. . .  
    ],  
    "relatedCollections" : [{  
        "name" : "Favorite Places &amp; Spaces",  
        "url" : "http:\/\/www.pinterest.com\/ondelaena\/favorite-places-spaces\/",  
        "description" : "",  
        "thumbnailUrl" : "https:\/\/tse3.mm.bing.net\/th?q=cameras&pid=Api&mkt=en-US...",  
        "creator" : {  
            "_type" : "People\/Person",  
            "name" : "Joe Smith",  
            "url" : "http:\/\/www.pinterest.com\/ondelaena\/"  
        },  
        "source" : "Pinterest",  
        "imagesCount" : 311,  
        "followersCount" : 149  
    },  
. . .  
    ],  
    "shoppingSources" : {  
        "offers" : [{  
            "url" : "http:\/\/www.contoso.com\/Digital_Camera\/p3370028_14367641.aspx",  
            "seller" : {  
                "name" : "contoso.com"  
            },  
            "availability" : "InStock"  
        }]  
    },  
    "relatedSearches" : [{  
        "text" : "Camera Clip Art",  
        "displayText" : "Camera Clip Art",  
        "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?q=Camera+Clip+Art...",  
        "thumbnail" : {  
            "url" : "https:\/\/tse1.mm.bing.net\/th?q=Camera+Clip+Art&pid=Api..."  
        }  
    },  
 . . .  
   ],  
   "imageInsightsToken" : "mid_D6426898706EC7193"  
}  
```  


> [!NOTE]
> Version 7 Preview changes to insights request.
>
> To get insights call the /images/details endpoint.
>
> To specify the insights that you want to get, set the [modules](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#modulesrequested) query parameter.
>
> ```
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/details?q=sailing+dinghy&insightsToken=mid_68364D764J...&modules=All&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com
> ```
> 
> The following example shows the response to the previous query. Things to note:
>
> - Added a level of indirection to v5 fields whose data type was an array of objects. For example, `pagesIncluding` was an array of `Image` objects in v5. In v7, it is an `ImagesModule` object that contains a `value` field whose type is an array of `Image` objects.  
> - Renamed the `annotations` v5 field to `imageTags` in v7.
> 
>```
>{
>    "_type" : "ImageInsights",
>    "imageInsightsToken" : "bcid_3297E6A54E4787A5F51C49D9BA342B9A*ccid_Fe2Hx...",
>    "bestRepresentativeQuery" : {
>        "text" : "Sailing Dinghy",
>        "displayText" : "Sailing Dinghy",
>        "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?q=Sailing+Dinghy...",
>    },
>    "pagesIncluding" : {
>        "value" : [
>            {
>                "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?view=...",
>                "name" : "Powerboating Dublin, Dinghy Sailing Courses...",
>                "thumbnailUrl" : "https:\/\/tse1.mm.bing.net\/th?id=OIP....",
>                "datePublished" : "2017-01-20T00:41:00.0000000Z",
>                "contentUrl" : "http:\/\/www.extremesports.ie\/content...",
>                "hostPageUrl" : "http:\/\/www.extremesports.ie\/powerboating...",
>                "contentSize" : "59063 B",
>                "encodingFormat" : "jpeg",
>                "hostPageDisplayUrl" : "www.extremesports.ie\/powerboating...",
>                "width" : 800,
>                "height" : 600,
>                "thumbnail" : {
>                    "width" : 300,
>                    "height" : 225
>                },
>                "imageInsightsToken" : "ccid_pHjQIA0x*mid_17F61B1316A39C92214...",
>                "imageId" : "17F61B1316A39C922143FFDE9DFB5B0FB41171",
>                "accentColor" : "0997C2"
>            },
>            . . .
>        ]
>    },
>    "relatedSearches" : {
>        "value" : [
>            {
>                "text" : "Sailing Fun",
>                "displayText" : "Sailing Fun",
>                "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?q=Sailing...",
>                "thumbnail" : {
>                    "url" : "https:\/\/tse1.mm.bing.net\/th?q=Sailing+Fun..."
>                }
>            },
>            . . .
>        ]
>    },
>    "visuallySimilarImages" : {
>        "value" : [
>            {
>                "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?view=...",
>                "name" : "Coronado Daily Photo: Weekend On the Water",
>                "thumbnailUrl" : "https:\/\/tse2.mm.bing.net\/th?id=OIP...",
>                "datePublished" : "2010-09-05T12:00:00.0000000Z",
>                "contentUrl" : "http:\/\/1.bp.blogspot.com\/_dc_6...",
>                "hostPageUrl" : "http:\/\/coronadodailyphoto.blogspot.com\/2010...",
>                "contentSize" : "203806 B",
>                "encodingFormat" : "jpeg",
>                "hostPageDisplayUrl" : "coronadodailyphoto.blogspot.com\/2010...",
>                "width" : 1600,
>                "height" : 1249,
>                "thumbnail" : {
>                    "width" : 300,
>                    "height" : 234
>                },
>                "imageInsightsToken" : "ccid_Jg1Kwuc4*mid_5B7DA43976D3A422...",
>                "imageId" : "5B7DA43976D3A422BA679A3AB019BB52C08DBC",
>                "accentColor" : "0B2543"
>            },
>            . . .
>        ]
>    },
>    "imageTags" : {
>        "value" : [
>            {
>                "name" : "sail boat"
>            },
>            . . .
>        ]
>    }
>}
>```


## Recognizing Entities in an Image  

The entity recognition feature identifies entities in an image, such as people. To identify entities in an image, set the [modulesRequested](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#modulesrequested) query parameter to RecognizedEntities.  
  
> [!NOTE]
> You may not specify this module with any other module. If you specify this module with other modules, the response does not include recognized entities.  
  
> [!NOTE]
> Currently, the API recognizes only people. 
  
The following shows how to specify the image by using the [imgUrl](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#imgurl) parameter. Remember to URL encode the query parameters.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?modulesRequested=recognizedentities&imgurl=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.M0cbee6fadb43f35b2344e53da7a23ec1o0%26pid%3DApi&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  
  
The following shows the response to the previous request. Because the image contains two people, the response identifies a region for each person. In this case, the people were recognized in the CelebrityAnnotations and CelebRecognitionAnnotations groups. Bing lists the people in each group based on the likelihood that they match the person in the original image. The list is in descending order of confidence. The CelebRecognitionAnnotations group provides the highest level of confidence that the match is correct.  
  
```  
{  
    "_type" : "ImageInsights",  
    "recognizedEntityGroups" : [{  
        "recognizedEntityRegions" : [{  
            "region" : {  
                "left" : 0.5066667,  
                "top" : 0.1955556,  
                "right" : 0.75,  
                "bottom" : 0.52  
            },  
            "matchingEntities" : [{  
                "entity" : {  
                    "_type" : "Person",  
                    "name" : "Faith Hill",  
                    "image" : {  
                        "url" : "https:\/\/tse3.mm.bing.net\/th?id=A4442e593b725df5750eca2...",  
                        "contentUrl" : "http:\/\/ia.media-imdb.com\/images\/M\/MV5BMTYxNz...",  
                        "hostPageUrl" : "http:\/\/www.imdb.com\/name\/nm0005011\/"  
                    },  
                    "description" : "Faith Hill is an American country pop singer and occasional actress.",  
                    "webSearchUrl" : "https:\/\/www.bing.com\/search?q=Faith+Hill&filters=sid...",  
                    "jobTitle" : "Singer"  
                },  
                "matchConfidence" : 0.613318  
            },  
            . . .  
            ]  
        },  
        {  
            "region" : {  
                "left" : 0.25,  
                "top" : 0.2488889,  
                "right" : 0.4466667,  
                "bottom" : 0.5111111  
            },  
            "matchingEntities" : [{  
                "entity" : {  
                    "_type" : "Person",  
                    "name" : "Joss Whedon",  
                    "image" : {  
                        "url" : "https:\/\/tse2.mm.bing.net\/th?id=A00acbc4da171b3",  
                        "contentUrl" : "http:\/\/upload.wikimedia.org\/wikipedia\/commons...",  
                        "hostPageUrl" : "http:\/\/en.wikipedia.org\/wiki\/Joss_Whedon"  
                    },  
                    "description" : "Joseph Hill \"Joss\" Whedon is an American...",  
                    "webSearchUrl" : "https:\/\/www.bing.com\/search?q=Joss+...",  
                    "jobTitle" : "Screenwriter"  
                },  
                "matchConfidence" : 0.5134409  
            },  
            . . .  
            ]  
        }],  
        "name" : "CelebrityAnnotations"  
    },  
    {  
        "recognizedEntityRegions" : [{  
            "region" : {  
                "left" : 0.5066667,  
                "top" : 0.1955556,  
                "right" : 0.75,  
                "bottom" : 0.52  
            },  
            "matchingEntities" : [{  
                "entity" : {  
                    "_type" : "Person",  
                    "name" : "Faith Hill",  
                    "image" : {  
                        "url" : "https:\/\/tse3.mm.bing.net\/th?id=A4442e593b...",  
                        "contentUrl" : "http:\/\/ia.media-imdb.com\/images\/M\/M...",  
                        "hostPageUrl" : "http:\/\/www.imdb.com\/name\/nm0005011\/"  
                    },  
                    "description" : "Faith Hill is an American country pop singer and...",  
                    "webSearchUrl" : "https:\/\/www.bing.com\/search?q=Faith+Hill...",  
                    "jobTitle" : "Singer"  
                },  
                "matchConfidence" : 0.9684521  
            }]  
        },  
        {  
            "region" : {  
                "left" : 0.25,  
                "top" : 0.2488889,  
                "right" : 0.4466667,  
                "bottom" : 0.5111111  
            },  
            "matchingEntities" : [{  
                "entity" : {  
                    "_type" : "Person",  
                    "name" : "Tim McGraw",  
                    "image" : {  
                        "url" : "https:\/\/tse3.mm.bing.net\/th?id=A0e0a959450f9c44c...",  
                        "contentUrl" : "http:\/\/i216.photobucket.com\/albums\/cc245\/...",  
                        "hostPageUrl" : "http:\/\/en.wikipedia.org\/wiki\/Tim_McGraw"  
                    },  
                    "description" : "Samuel Timothy \"Tim\" McGraw is an American singer,...",  
                    "webSearchUrl" : "https:\/\/www.bing.com\/search?q=Tim+McGraw&...",  
                    "jobTitle" : "American Singer"  
                },  
                "matchConfidence" : 0.9961388  
            }]  
        }],  
        "name" : "CelebRecognitionAnnotations"  
    }],  
   "imageInsightsToken" : "mid_D6426898706EC7193CDO\/VMU*simid_608006295686742778"  
}  
```  

> [!NOTE]
> Version 7 Preview changes to recognized entities insights request.
>
> To get insights call the /images/details endpoint.
>
> To get recognized entities, set the [modules](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#modulesrequested) query parameter to RecognizedEntities.
>
> ```
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/details?q=faith+hill&insightsToken=mid_68364D764J...&modules=RecognizedEntities&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com
> ```
>
> The following shows the response to the previous query. Things to note:
>
> - Added a level of indirection to `recognizedEntityGroups`. The field's data type in v5 was an array of `RecognizedEntityGroup` objects. In v7, it is an `RecognizedEntitiesModule` object that contains a `value` field whose type is an array of `recognizedEntityGroup` objects.  
>
>```
>{
>    "_type" : "ImageInsights",
>    "imageInsightsToken" : "ccid_ldi5nX38*mid_29470780DE0E6F969...",
>    "recognizedEntityGroups" : {
>        "value" : [
>            {
>                "recognizedEntityRegions" : [...],
>                "name" : "CelebRecognitionAnnotations"
>            },
>            {
>                "recognizedEntityRegions" : [...],
>                "name" : "CelebrityAnnotations"
>            }
>        ]
>    }
>}
>```

  
The `region` field identifies the area of the image where Bing recognized the entity. For people, the region represents the person's face.  
  
The values of the rectangle are relative to the width and height of the original image and are in the range 0.0 through 1.0. For example, if the image is 300x200, and the region's top, left corner is at point (10, 20) and the bottom, right corner is at point (290, 150), then the normalized rectangle is:  
  
-   Left: 10 / 300 = 0.0333333333333333  
  
-   Top:  20 / 200 = 0.1  
  
-   Right: 290 / 300 = 0.9666666666666667  
  
-   Bottom: 150 / 200 = 0.75  
  
You can use the region that Bing returns in subsequent insights calls. For example, to get visually similar images of the recognized entity. For more information, see [Cropping Images to use with Visually Similar and Entity Recognition Modules](#croppingimages). The following shows the mapping between the region fields and the query parameters that you'd use to crop images.  
  
-   Left maps to [cal](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#cal)  
  
-   Top maps to [cat](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#cat)  
  
-   Right maps to [car](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#car)  
  
-   Bottom maps to [cab](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#cab)  


## Finding Visually Similar Images  

To find images that are visually similar to the original image, set the [modulesRequested](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#modulesrequested) query parameter to SimilarImages.  
  
The following request shows how to get visually similar images. The request uses the [insightsToken](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#insightstoken) query parameter to identify the original image. To improve relevance, you should include the user's query string.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?modulesRequested=similarimages&insightsToken=ccid_WOeyfoSp*mid_4B0A3&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
  
```  

  
The following shows the response to the previous request.  
  
```  
{  
    "_type" : "ImageInsights",  
    "visuallySimilarImages" : [{  
        "name" : "typical Hawaiian Sunset! :) | Scenes of Hawaii | Pinterest",  
        "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?view=detailv2...",  
        "thumbnailUrl" : "https:\/\/tse1.mm.bing.net\/th?id=OIP.Mda2a86...",  
        "datePublished" : "2014-01-15T23:05:00",  
        "contentUrl" : "http:\/\/media-cache-ec0.pinimg.com\/736x\/6e\/ea...",  
        "hostPageUrl" : "http:\/\/pinterest.com\/pin\/159174168053946317\/",  
        "hostPageUrlPingSuffix" : "DevEx,5173.1",  
        "contentSize" : "45136 B",  
        "encodingFormat" : "jpeg",  
        "hostPageDisplayUrl" : "pinterest.com\/pin\/159174168053946317",  
        "width" : 600,  
        "height" : 449,  
        "thumbnail" : {  
            "width" : 300,  
            "height" : 224  
        },  
        "imageInsightsToken" : "ccid_2iqGRWS8*mid_1FDE470778358D4F2...",  
        "imageId" : "1FDE470778358D4F227296BF0DD885578BA2C14",  
        "accentColor" : "BCB50F"  
    },  
    . . .  
    ],  
   "imageInsightsToken" : "ccid_WOeyfoSp*mid_4B0A35788..."  
}  
```  

> [!NOTE]
> Version 7 Preview changes to visually similar insights request.
>
> To get insights call the /images/details endpoint.
>
> To get visually similar images, set the [modules](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#modulesrequested) query parameter to SimilarImages.
>
> ```
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/details?insightsToken=mid_68364D764J...&modules=SimilarImages&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com
> ```
>
> The following shows the response to the previous query. Things to note:
>
> - Added a level of indirection to `visuallySimilarImages`. The field's data type in v5 was an array of `Image` objects. In v7, it is an `ImagesModule` object that contains a `value` field whose type is an array of `Image` objects.  
>
>```
>{
>    "_type" : "ImageInsights",
>    "imageInsightsToken" : "ccid_ldi5nX38*mid_29470780DE0E6F969...",
>    "visuallySimilarImages" : {
>        "value" : [
>            {
>                "name" : "typical Hawaiian Sunset! :) | Scenes of Hawaii | Pinterest",
>                "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?view=detailv2...",
>                "thumbnailUrl" : "https:\/\/tse1.mm.bing.net\/th?id=OIP.Mda2a86...",
>                 . . .
>            }
>        ]
>    }
>```
  
## Cropping Images to use with Visually Similar and Entity Recognition Modules  

To specify the region of the image that Bing uses to determine whether images are visually similar or to perform entity recognition, use the [cal](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#cal), [cat](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#cat), [cab](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#cab), and [car](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#car) query parameters. By default, Bing uses the entire image.  
  
The parameters specify the top, left corner and bottom, right corner of the region that Bing uses for comparison. Specify the values as fractions of the original image's width and height. The fractional values start with (0.0, 0.0) at the top, left corner and end with (1.0, 1.0) at the bottom right corner. For example, to specify that the top, left corner starts a quarter of the way down from the top and a quarter of the way in from the left side, set `cal` to 0.25 and `cat` 0.25.  
  
The following sequence of calls shows the effect of specifying the cropping region. The first call does not include cropping and Bing recognizes two people standing side by side in the middle of the image.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?modulesRequested=recognizedentities&imgurl=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.M0cbee6fadb43f35b2344e53da7a23ec1o0%26pid%3DApi&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> Version 7 Preview request:
>
> ```
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/details?modules=RecognizedEntities&imgurl=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.M0cbee6fadb43f35b2344e53da7a23ec1o0%26pid%3DApi&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com
> ```
>
> For differences in response format between v5 and v7, see [Recognizing Entities in an Image](#recognizing-entities-in-an-image).

  
The response shows two recognized entities.  
  
```  
{  
    "_type" : "ImageInsights",  
    "recognizedEntityGroups" : [  
    . . .  
    {  
        "recognizedEntityRegions" : [{  
            "region" : {  
                "left" : 0.5066667,  
                "top" : 0.1955556,  
                "right" : 0.75,  
                "bottom" : 0.52  
            },  
            "matchingEntities" : [{  
                "entity" : {  
                    "_type" : "Person",  
                    "name" : "Faith Hill",  
                    . . .  
                },  
                "matchConfidence" : 0.9961388  
            }]  
        },  
        {  
            "region" : {  
                "left" : 0.25,  
                "top" : 0.2488889,  
                "right" : 0.4466667,  
                "bottom" : 0.5111111  
            },  
            "matchingEntities" : [{  
                "entity" : {  
                    "_type" : "Person",  
                    "name" : "Tim McGraw",  
                    . . .  
                },  
                "matchConfidence" : 0.9961388  
            }]  
        }],  
        "name" : "CelebRecognitionAnnotations"  
    }]  
}  
  
```  
  
The second call crops the image vertically down the middle and Bing recognized a single person on the right side of the image.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?cal=0.5&cat=0.0&car=1.0&cab=1.0&modulesRequested=recognizedentities&imgurl=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.M0cbee6fadb43f35b2344e53da7a23ec1o0%26pid%3DApi&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> Version 7 Preview request:
>
> ```
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/details?cal=0.5&cat=0.0&car=1.0&cab=1.0&modules=RecognizedEntities&imgurl=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.M0cbee6fadb43f35b2344e53da7a23ec1o0%26pid%3DApi&mkt=en-us HTTP/1.1    
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com
> ```
>
> For differences in response format between v5 and v7, see [Recognizing Entities in an Image](#recognizing-entities-in-an-image).

  
The response shows one recognized entity.  
  
```  
{  
    "_type" : "ImageInsights",  
    "recognizedEntityGroups" : [  
    . . .  
    {  
        "recognizedEntityRegions" : [{  
            "region" : {  
                "left" : 0.5066667,  
                "top" : 0.1955556,  
                "right" : 0.75,  
                "bottom" : 0.52  
            },  
            "matchingEntities" : [{  
                "entity" : {  
                    "_type" : "Person",  
                    "name" : "Faith Hill",  
                    . . .  
                },  
                "matchConfidence" : 0.9961388  
            }]  
        }],  
        "name" : "CelebRecognitionAnnotations"  
    }]  
}  
  
```  
  
## Finding Visually Similar Products  

To find images that contain products that are visually similar to the products found in the original image, set the [modulesRequested](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#modulesrequested) query parameter to SimilarProducts.  
  
The following request shows how to get images of visually similar products. The request uses the [insightsToken](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#insightstoken) query parameter to identify the original image that was returned in a previous request. To improve relevance, you should include the user's query string.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=anne+klein+dresses&modulesRequested=similarproducts&insightsToken=ccid_WOeyfoSp*mid_4B0A357&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

  
The following shows the response to the previous request. The response contains an image of a similar product and indicates how many merchants offer the product online, whether there are product ratings, and the lowest price found (see the `aggregateOffer` field).  
  
```  
{  
    "_type" : "ImageInsights",  
    "visuallySimilarProducts" : [  
    . . .  
    {  
        "name" : "HALSTON HERITAGE Women's Sequin One-Shoulder Twist-Drape Dress",  
        "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?view=de...",  
        "thumbnailUrl" : "https:\/\/tse2.mm.bing.net\/th?id=OIP.M85bdee...",  
        "datePublished" : "2016-01-20T17:28:00",  
        "contentUrl" : "http:\/\/www.polyvore.com\/cgi\/img-thing?.out=...",  
        "hostPageUrl" : "http:\/\/polyvore.com\/elizabeth_james_anita_...",  
        "contentSize" : "7802 B",  
        "encodingFormat" : "jpeg",  
        "hostPageDisplayUrl" : "polyvore.com\/elizabeth_james_anita_belted_...",  
        "width" : 300,  
        "height" : 300,  
        "thumbnail" : {  
            "width" : 300,  
            "height" : 300  
        },  
        "imageInsightsToken" : "ccid_hb3uRvUk*mid_BF5C252A47F2C765...",  
        "imageId" : "BF5C252A47F2C765E4D7E0E3560446C8E...",  
        "accentColor" : "A35A28",  
        "aggregateOffer" : {  
            "name" : "HALSTON HERITAGE Women's Sequin One-Shoulder Twist-Drape Dress",  
            "priceCurrency" : "USD",  
            "aggregateRating" : {  
                "ratingValue" : 0,  
                "bestRating" : 5  
            },  
            "lowPrice" : 126.87,  
            "offerCount" : 2  
        }  
    },  
    . . .  
    ]  
}  
```  

> [!NOTE]
> Version 7 Preview changes to visually similar product insights request.
>
> To get insights call the /images/details endpoint.
>
> To get visually similar images, set the [modules](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#modulesrequested) query parameter to SimilarProducts.
>
> ```
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/details?q=anne+klein+dresses&modules=SimilarProducts&insightsToken=ccid_WOeyfoSp*mid_4B0A357&mkt=en-us HTTP/1.1    
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com
> ```
>
> The following shows the response to the previous query. Things to note:
>
> - Added a level of indirection to `visuallySimilarProducts`. The field's data type in v5 was an array of `ProductSummaryImage` objects. In v7, it is an `ImagesModule` object that contains a `value` field whose type is an array of `recognizedEntityGroup` objects.  
>
>```
>{
>    "_type" : "ImageInsights",
>    "imageInsightsToken" : "ccid_ldi5nX38*mid_29470780DE0E6F969...",
>    "visuallySimilarProducts" : {
>        "value" : [
>            {
>                "name" : "HALSTON HERITAGE Women's Sequin One-Shoulder Twist-Drape Dress",  
>                "webSearchUrl" : "https:\/\/www.bing.com\/images\/search?view=de...",  
>                "thumbnailUrl" : "https:\/\/tse2.mm.bing.net\/th?id=OIP.M85bdee...",  
>                . . .
>            },
>            . . .
>        ]
>    }
>}
>```
  
To get a list of the merchants that offer the product online (see the [offerCount](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#offer-offercount) field), call the API again and set `modulesRequested` to ShoppingSources. Then, set the `insightsToken` query parameter to the token found in the product summary image.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?modulesRequested=shoppingsources&insightsToken=ccid_hb3uRvUk*mid_BF5C252A47F2C765...&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  
  
The following is the response to the previous request.  
  
```  
{  
    "_type" : "ImageInsights",  
    "shoppingSources" : {  
        "offers" : [{  
            "url" : "http:\/\/www.amazon.com\/dp\/B00O...",  
            "seller" : {  
                "name" : "Amazon",  
                "image" : {  
                    "url" : "https:\/\/tse3.mm.bing.net\/th?id=A10d50fe..."  
                }  
            },  
            "price" : 126.87,  
            "priceCurrency" : "USD",  
            "availability" : "InStock"  
        },  
        {  
            "url" : "http:\/\/www.voquestyle.com\/product\/halston-heritage...\/",  
            "seller" : {  
                "name" : "voquestyle.com"  
            },  
            "price" : 495,  
            "priceCurrency" : "USD",  
            "availability" : "InStock"  
        }]  
    }  
}  
```


> [!NOTE]
> Version 7 Preview changes to shopping sources insights request.
>
> To get insights call the /images/details endpoint.
>
> To get shopping sources, set the [modules](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#modulesrequested) query parameter to ShoppingSources.
>
> ```
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/details?modules=ShoppingSources&insightsToken=ccid_hb3uRvUk*mid_BF5C252A47F2C765...&mkt=en-us HTTP/1.1    
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com
> ```
