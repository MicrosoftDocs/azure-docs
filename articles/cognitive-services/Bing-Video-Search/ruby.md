---
title: Ruby Quickstart for Azure Cognitive Services, Bing Video Search API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Bing Video Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: jerrykindall

ms.service: cognitive-services
ms.technology: bing-search
ms.topic: article
ms.date: 9/21/2017
ms.author: v-jerkin

---
# Quickstart for Bing Video Search API with Ruby

This article shows you how use the Bing Video Search API, part of Microsoft Cognitive Services on Azure. While this article employs Ruby, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON. 

The example code was written to run under Ruby 2.4.

Refer to the [API reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference) for technical details about the APIs.

## Prerequisites

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Search APIs**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. You will need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

## Bing video search

The [Bing Video Search API](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-video-api-v7-reference) returns video results from the Bing search engine.

1. Create a new Ruby project in your favorite IDE or editor.
2. Add the code provided below.
3. Replace the `accessKey` value with an access key valid for your subscription.
4. Run the program.

```ruby
require 'net/https'
require 'uri'
require 'json'

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the accessKey string value with your valid access key.
accessKey = "enter key here"

# Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
# search APIs.  In the future, regional endpoints may be available.  If you
# encounter unexpected authorization errors, double-check this value against
# the endpoint for your Bing Search instance in your Azure dashboard.

uri  = "https://api.cognitive.microsoft.com"
path = "/bing/v7.0/videos/search"

term = "kittens"

uri = URI(uri + path + "?q=" + URI.escape(term))

puts "Searching videos for: " + term

request = Net::HTTP::Get.new(uri)
request['Ocp-Apim-Subscription-Key'] = accessKey

response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
    http.request(request)
end

puts "\nRelevant Headers:\n\n"
response.each_header do |key, value|
    # header names are coerced to lowercase
    if key.start_with?("bingapis-") or key.start_with?("x-msedge-") then
        puts key + ": " + value
    end
end

puts "\nJSON Response:\n\n"
puts JSON::pretty_generate(JSON(response.body))
```

**Response**

A successful response is returned in JSON, as shown in the following example:

```json
{
    "_type": "Videos",
    "instrumentation": {},
    "readLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=kittens",
    "webSearchUrl": "https://www.bing.com/videos/search?q=kittens",
    "totalEstimatedMatches": 1000,
    "value": [
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=655D98260D012432848F655D98260D012432848F",
            "name": "Top 10 cute kitten videos compilation",
            "description": "HELP HOMELESS ANIMALS AND WIN A PRIZE BY CHOOSING AN AWESOME ITEM FROM OUR STORE: https://fanjoy.co/collections/tiger-p... RAISED DONATIONS for animals in need and ...",
            "thumbnailUrl": "https://tse4.mm.bing.net/th?id=OVP.n1aE_Oikl4MtzBbDKSEKIQEsCo&pid=Api",
            "datePublished": "2014-11-12T22:47:36.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Tiger FurryEntertainment"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=8HVWitAW-Qg",
            "hostPageUrl": "https://www.youtube.com/watch?v=8HVWitAW-Qg",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=8HVWitAW-Qg",
            "width": 480,
            "height": 360,
            "duration": "PT3M52S",
            "motionThumbnailUrl": "https://tse4.mm.bing.net/th?id=OM.j4QyJAENJphdZQ_1501386166&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/8HVWitAW-Qg?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 7513633,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "655D98260D012432848F655D98260D012432848F",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=F300FB0FB0E78F5FBFEEF300FB0FB0E78F5FBFEE",
            "name": "Kittens see / do things for the first time - Funny and cute cat compilation",
            "description": "Puppies see / do things for the first time - Funny and cute dog compilation : https://www.youtube.com/watch?v=PGLz4Dgzc54 This is a compilation about little ...",
            "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OVP.TQoSrvwa_p51A7Nv9IMMfQEsCo&pid=Api",
            "datePublished": "2016-04-27T17:41:31.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Tiger Productions"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=mmjlMgDSYFo",
            "hostPageUrl": "https://www.youtube.com/watch?v=mmjlMgDSYFo",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=mmjlMgDSYFo",
            "width": 480,
            "height": 360,
            "duration": "PT5M53S",
            "motionThumbnailUrl": "https://tse4.mm.bing.net/th?id=OM.7r9fj%2bewD%2fsA8w_1500716551&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/mmjlMgDSYFo?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 2533052,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "F300FB0FB0E78F5FBFEEF300FB0FB0E78F5FBFEE",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=FE06A0D2D9B2C6102879FE06A0D2D9B2C6102879",
            "name": "Kittens And Puppies Playing With Babies Compilation 2014 [NEW]",
            "description": "Want to see something cute? Than watch a puppy playing with a baby or a kitten playing with a baby. Check out this compilation of funny kittens and puppies p...",
            "thumbnailUrl": "https://tse1.mm.bing.net/th?id=OVP.woZGMq8Ya9LT0mYhsagvkgEsCo&pid=Api",
            "datePublished": "2014-10-25T11:58:01.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "mihaifrancu"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=vTyg4EgtTMc",
            "hostPageUrl": "https://www.youtube.com/watch?v=vTyg4EgtTMc",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=vTyg4EgtTMc",
            "width": 480,
            "height": 360,
            "duration": "PT4M23S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.eSgQxrLZ0qAG%2fg_1503804397&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/vTyg4EgtTMc?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 15154147,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "FE06A0D2D9B2C6102879FE06A0D2D9B2C6102879",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=DE54435272018307711ADE54435272018307711A",
            "name": "Cute Kittens Compilation 2015 [NEW]",
            "description": "Cute kittens doing funny things will always going to cheer you up. Watch these funny kittens in this compilation of cute kitten videos.",
            "thumbnailUrl": "https://tse1.mm.bing.net/th?id=OVP.LQME1sRKiN9dw-Ee1RgcmgEsCo&pid=Api",
            "datePublished": "2015-01-16T17:43:57.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "MashupZone"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=OtRRUEs3o0c",
            "hostPageUrl": "https://www.youtube.com/watch?v=OtRRUEs3o0c",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=OtRRUEs3o0c",
            "width": 480,
            "height": 360,
            "duration": "PT4M3S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.GnEHgwFyUkNU3g_1502686069&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/OtRRUEs3o0c?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 7089770,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "DE54435272018307711ADE54435272018307711A",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=4B09AC5F8493B132242B4B09AC5F8493B132242B",
            "name": "Cute Kittens And Funny Kitten Videos Compilation 2016",
            "description": "Cute baby cats or cute kittens doing funny things. Check out these cute kitten videos compilation containing kittens meowing, playing and more. Thanks for wa...",
            "thumbnailUrl": "https://tse1.mm.bing.net/th?id=OVP.hm40owejHa6MGfnLc_DYDgEsCo&pid=Api",
            "datePublished": "2016-09-23T14:07:57.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "MashupZone"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=w6DW4i-mfbA",
            "hostPageUrl": "https://www.youtube.com/watch?v=w6DW4i-mfbA",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=w6DW4i-mfbA",
            "width": 480,
            "height": 360,
            "duration": "PT10M37S",
            "motionThumbnailUrl": "https://tse4.mm.bing.net/th?id=OM.KyQysZOEX6wJSw_1503454808&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/w6DW4i-mfbA?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 6391108,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "4B09AC5F8493B132242B4B09AC5F8493B132242B",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=710352009F716E640820710352009F716E640820",
            "name": "3 Weeks Old (Kitten Update)",
            "description": "Leave a Like for more Kittens! Kitten Playlist: http://www.youtube.com/playlist?list=PL766A145C810D8619&feature=view_all 3 weeks old, these kittens are getti...",
            "thumbnailUrl": "https://tse1.mm.bing.net/th?id=OVP.AAUCBDec-87hhLZTSgqwpwEsCo&pid=Api",
            "datePublished": "2012-08-23T16:21:47.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "kootra"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=E646GQh0TwY",
            "hostPageUrl": "https://www.youtube.com/watch?v=E646GQh0TwY",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=E646GQh0TwY",
            "width": 1280,
            "height": 720,
            "duration": "PT3M20S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.IAhkbnGfAFIDcQ_1502142994&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/E646GQh0TwY?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 463496,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "710352009F716E640820710352009F716E640820",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=F229C718D8F3AECA4703F229C718D8F3AECA4703",
            "name": "Basket of Meowing Kittens",
            "description": "Many more newborn kittens video will be uploaded. Click SUBSCRIBE and Check Notifications to receive emails when we upload new videos. Ginger Kitties Four is...",
            "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OVP.1cV2FxKKUzJj6apYhB23xwEsCo&pid=Api",
            "datePublished": "2012-08-15T17:48:55.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Ginger Kitties Four"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=OvXHbJzWMqI",
            "hostPageUrl": "https://www.youtube.com/watch?v=OvXHbJzWMqI",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=OvXHbJzWMqI",
            "width": 1280,
            "height": 720,
            "duration": "PT5M5S",
            "motionThumbnailUrl": "https://tse2.mm.bing.net/th?id=OM.A0fKrvPYGMcp8g_1503754372&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/OvXHbJzWMqI?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 14046002,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "F229C718D8F3AECA4703F229C718D8F3AECA4703",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=D1265068234891021630D1265068234891021630",
            "name": "13 Funny Kittens Video Compilation 2016",
            "description": "From kittens playing checkers, to kittens playing with toothbrushes, enjoy 13 funny kittens in this pet video compilation. The Pet Collective is home to the ...",
            "thumbnailUrl": "https://tse1.mm.bing.net/th?id=OVP.LRWGUAfTTZT4QiHO9_X4wgEsCo&pid=Api",
            "datePublished": "2016-07-15T22:22:56.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "The Pet Collective"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=juddO3i58Gs",
            "hostPageUrl": "https://www.youtube.com/watch?v=juddO3i58Gs",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=juddO3i58Gs",
            "width": 1280,
            "height": 720,
            "duration": "PT9M55S",
            "motionThumbnailUrl": "https://tse4.mm.bing.net/th?id=OM.MBYCkUgjaFAm0Q_1502288383&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/juddO3i58Gs?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 344914,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "D1265068234891021630D1265068234891021630",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=18A7975D4AAA34F2B1F018A7975D4AAA34F2B1F0",
            "name": "Kitten Afraid to Climb | Too Cute!",
            "description": "Subscribe to Animal Planet! | http://www.youtube.com/subscription_center?add_user=animalplanettv Cosmo is afraid to climb down with the rest of kittens off their ...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.niiszCha6luZDAExHGmcrwEsCo&pid=Api",
            "datePublished": "2012-10-29T17:06:34.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Animal Planet"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=MhsJvdUHtRY",
            "hostPageUrl": "https://www.youtube.com/watch?v=MhsJvdUHtRY",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=MhsJvdUHtRY",
            "width": 480,
            "height": 360,
            "duration": "PT2M23S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.8LHyNKpKXZenGA_1503024516&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/MhsJvdUHtRY?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 753298,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "18A7975D4AAA34F2B1F018A7975D4AAA34F2B1F0",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=DB33A210AF5F315EB7A1DB33A210AF5F315EB7A1",
            "name": "Mama Cat Talks to her Baby Kittens",
            "description": "Mama cat Miyu takes care for her adorable baby kittens and she talks to them every time. Cute Kitten Diary (Layo): https://www.youtube.com/watch?v=mXHEMQSMesE ...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.jdW6i4SfXu5rrHBiT8xIdwEsCo&pid=Api",
            "datePublished": "2016-01-30T13:49:56.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "KittenKanal"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=J17E2bPyOZk",
            "hostPageUrl": "https://www.youtube.com/watch?v=J17E2bPyOZk",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=J17E2bPyOZk",
            "width": 1280,
            "height": 720,
            "duration": "PT2M9S",
            "motionThumbnailUrl": "https://tse3.mm.bing.net/th?id=OM.obdeMV%2bvEKIz2w_1500118980&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/J17E2bPyOZk?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 1252583,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "DB33A210AF5F315EB7A1DB33A210AF5F315EB7A1",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=ED8DE1EBC19010FBE4BFED8DE1EBC19010FBE4BF",
            "name": "Kitten Update (4 Weeks Old)",
            "description": "Leave a Like for more Kittens! Kitten Playlist: http://www.youtube.com/playlist?list=PL766A145C810D8619&feature=view_all 4 weeks old, these kittens are start...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.UPsw2WUtf2oKt4FC_l48lAEsCo&pid=Api",
            "datePublished": "2012-08-28T19:26:19.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "kootra"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=coYSxwDUHlw",
            "hostPageUrl": "https://www.youtube.com/watch?v=coYSxwDUHlw",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=coYSxwDUHlw",
            "width": 1280,
            "height": 720,
            "duration": "PT3M18S",
            "motionThumbnailUrl": "https://tse3.mm.bing.net/th?id=OM.v%2bT7EJDB6%2bGN7Q_1502847580&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/coYSxwDUHlw?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 969047,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "ED8DE1EBC19010FBE4BFED8DE1EBC19010FBE4BF",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=1EE8032157CA2DC5F41A1EE8032157CA2DC5F41A",
            "name": "13 Cute Kittens Video Compilation 2016",
            "description": "From kittens sleeping, to kittens playing with toys, here you'll find all the cutest kittens in this cute kittens video compilation. The Pet Collective is home to the ...",
            "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OVP.Yms6piddtrin2zwA3ajhSwEsCo&pid=Api",
            "datePublished": "2016-07-22T00:35:05.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "The Pet Collective"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=yobCsU0niBY",
            "hostPageUrl": "https://www.youtube.com/watch?v=yobCsU0niBY",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=yobCsU0niBY",
            "width": 1280,
            "height": 720,
            "duration": "PT9M1S",
            "motionThumbnailUrl": "https://tse3.mm.bing.net/th?id=OM.GvTFLcpXIQPoHg_1500469891&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/yobCsU0niBY?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 124605,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "1EE8032157CA2DC5F41A1EE8032157CA2DC5F41A",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=C80040579795067A615DC80040579795067A615D",
            "name": "Persian Kitten Searches for Perfect Sleeping Spot",
            "description": "These Persian kittens are settling in for a nap and one kitten finds herself outside of the cuddly nest. Subscribe to Animal Planet: http://www.youtube.com ...",
            "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OVP.oIVRXUJUSf7gDu5I4SDA0AEsCo&pid=Api",
            "datePublished": "2015-12-11T16:07:05.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Animal Planet"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=QUXhoZFDwQg",
            "hostPageUrl": "https://www.youtube.com/watch?v=QUXhoZFDwQg",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=QUXhoZFDwQg",
            "width": 1280,
            "height": 720,
            "duration": "PT1M37S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.XWF6BpWXV0AAyA_1503477288&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/QUXhoZFDwQg?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 548712,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "C80040579795067A615DC80040579795067A615D",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=E8C2C3A6AACEA1D72795E8C2C3A6AACEA1D72795",
            "name": "Cute Ginger Kittens Playing with their Momma",
            "description": "Phoebe's first litter of 5 all-orange kittens are very playful in this video from April 2010. This litter of kittens includes 3 rare all-orange females. Watc...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.-bMJqxIlJMkYvdYD676eYgEsCo&pid=Api",
            "datePublished": "2013-07-12T06:04:42.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Ginger Kitties Four"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=9gE2r0ZXHvk",
            "hostPageUrl": "https://www.youtube.com/watch?v=9gE2r0ZXHvk",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=9gE2r0ZXHvk",
            "width": 480,
            "height": 360,
            "duration": "PT5M47S",
            "motionThumbnailUrl": "https://tse3.mm.bing.net/th?id=OM.lSfXoc6qpsPC6A_1505519907&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/9gE2r0ZXHvk?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 1055098,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "E8C2C3A6AACEA1D72795E8C2C3A6AACEA1D72795",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=A445C4522ADBB1A93904A445C4522ADBB1A93904",
            "name": "Dogs Meeting Kittens for the First Time Compilation (2015)",
            "description": "Dogs first encounter with new kittens. Dogs and kittens playing together is so cute! Puppies & Babies & Kitties OH MY! New videos all the time! Subscribe: https://www ...",
            "thumbnailUrl": "https://tse4.mm.bing.net/th?id=OVP.Ex-79FgNcsqy74ZDLximagEsCo&pid=Api",
            "datePublished": "2014-10-13T18:02:30.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "funnyplox"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=U5LwcvVAKDg",
            "hostPageUrl": "https://www.youtube.com/watch?v=U5LwcvVAKDg",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=U5LwcvVAKDg",
            "width": 480,
            "height": 360,
            "duration": "PT4M",
            "motionThumbnailUrl": "https://tse4.mm.bing.net/th?id=OM.BDmpsdsqUsRFpA_1502664968&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/U5LwcvVAKDg?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 3492695,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "A445C4522ADBB1A93904A445C4522ADBB1A93904",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=E50F059E704472D7B977E50F059E704472D7B977",
            "name": "Cats Playing With Kittens Compilation 2014 [NEW]",
            "description": "Cats Playing With Kittens | Cats Playing | Cute Kittens // Subscribe to our channel, share and thumb up this video! // If you have copyright problem thingy, ...",
            "thumbnailUrl": "https://tse1.mm.bing.net/th?id=OVP.Hfl4vvu7XPTfA0Wf9zsO3gEsCo&pid=Api",
            "datePublished": "2014-08-31T21:49:11.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "TheCutenessCode"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=sEJ6973j-3U",
            "hostPageUrl": "https://www.youtube.com/watch?v=sEJ6973j-3U",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=sEJ6973j-3U",
            "width": 480,
            "height": 360,
            "duration": "PT4M",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.d7nXckRwngUP5Q_1503884835&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/sEJ6973j-3U?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 1044282,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "E50F059E704472D7B977E50F059E704472D7B977",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=771AF9281F58051BD248771AF9281F58051BD248",
            "name": "Kittens Being Bottle Fed - Super Cute Compilation || AHF",
            "description": "Nothing is cuter than a cute little kittens being bottle-fed by their humans... \u2611 Viewed? \u2610 Liked? \u2610 Subscribed? Credits (in the order of apperance): http://www ...",
            "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OVP.o4rf93oijxxgE3UMunXw4gEsCo&pid=Api",
            "datePublished": "2014-02-25T02:15:42.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "AwesomeHouseFun \u00ae"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=XeXssToKN4s",
            "hostPageUrl": "https://www.youtube.com/watch?v=XeXssToKN4s",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=XeXssToKN4s",
            "width": 1280,
            "height": 720,
            "duration": "PT2M47S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.SNIbBVgfKPkadw_1499569593&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/XeXssToKN4s?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 9068896,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "771AF9281F58051BD248771AF9281F58051BD248",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=3FD28317B5F493FDBF453FD28317B5F493FDBF45",
            "name": "Too Cute!- Adorable Persian Kitten",
            "description": "For more, visit http://animal.discovery.com/tv/too-cute-kittens/#mkcpgn=ytapl1 | Reginald, a young Persian kitten, gets boxed out of the food bowl and decides to ...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.UaTcstIPwufFgBl5YKOR_AEsCo&pid=Api",
            "datePublished": "2011-05-20T13:49:49.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Animal Planet"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=oBSKocOB8ow",
            "hostPageUrl": "https://www.youtube.com/watch?v=oBSKocOB8ow",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=oBSKocOB8ow",
            "width": 480,
            "height": 360,
            "duration": "PT3M13S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.Rb%2f9k%2fS1F4PSPw_1499113579&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/oBSKocOB8ow?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 325535,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "3FD28317B5F493FDBF453FD28317B5F493FDBF45",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=7F097D0BA75FD088BCB77F097D0BA75FD088BCB7",
            "name": "Ragdoll Kittens | Too Cute!",
            "description": "Subscribe to Animal Planet! | http://www.youtube.com/subscription_center?add_user=animalplanettv After an exhausting session of practicing their hunting skil...",
            "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OVP.bC1b4EqrwUQ1yl31g7oyqgEsCo&pid=Api",
            "datePublished": "2012-12-05T16:39:41.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Animal Planet"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=cQsEjPYbap8",
            "hostPageUrl": "https://www.youtube.com/watch?v=cQsEjPYbap8",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=cQsEjPYbap8",
            "width": 1280,
            "height": 720,
            "duration": "PT2M44S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.t7yI0F%2bnC30Jfw_1505210413&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/cQsEjPYbap8?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 638582,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "7F097D0BA75FD088BCB77F097D0BA75FD088BCB7",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=6B7C1803AFC358E142786B7C1803AFC358E14278",
            "name": "Kittens update (1 week old)",
            "description": "Leave a Like for more Kittens! Kitten Playlist: http://www.youtube.com/playlist?list=PL766A145C810D8619&feature=view_all So ya, Sam has 1 eye open now, Hopefully the ...",
            "thumbnailUrl": "https://tse4.mm.bing.net/th?id=OVP.kkiprpRGDqtcZqE4XgITMAEsCo&pid=Api",
            "datePublished": "2012-08-08T20:59:37.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "kootra"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=tJ8iJuD9YPQ",
            "hostPageUrl": "https://www.youtube.com/watch?v=tJ8iJuD9YPQ",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=tJ8iJuD9YPQ",
            "width": 1280,
            "height": 720,
            "duration": "PT2M6S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.eELhWMOvAxh8aw_1501823694&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/tJ8iJuD9YPQ?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 406553,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "6B7C1803AFC358E142786B7C1803AFC358E14278",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=A76D93B7A1BC4F846D3EA76D93B7A1BC4F846D3E",
            "name": "Little kittens meowing and talking - Cute cat compilation",
            "description": "Watch this funny cat video and you will never leave your cat home alone again :p https://www.youtube.com/watch?v=R5PHvKvOUJk Warning: do not watch if you are allergic ...",
            "thumbnailUrl": "https://tse4.mm.bing.net/th?id=OVP.iPoM1Dn7MCJKl-NRAp0czQIIEk&pid=Api",
            "datePublished": "2014-08-29T14:46:34.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Tiger Productions"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=4IP_E7efGWE",
            "hostPageUrl": "https://www.youtube.com/watch?v=4IP_E7efGWE",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=4IP_E7efGWE",
            "width": 480,
            "height": 360,
            "duration": "PT3M31S",
            "motionThumbnailUrl": "https://tse3.mm.bing.net/th?id=OM.Pm2ET7yht5Ntpw_1498666489&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/4IP_E7efGWE?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 54588083,
            "thumbnail": {
                "width": 520,
                "height": 292
            },
            "videoId": "A76D93B7A1BC4F846D3EA76D93B7A1BC4F846D3E",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=14B8EC34B741A773202F14B8EC34B741A773202F",
            "name": "\"Kittens Sleeping in Hands Compilation\" || CFS",
            "description": "Kittens Sleeping in Hands Compilation Having a little kitten sleeping and purring on the palm of your hand just have to be one of the cutest thing ever! Rate, Share ...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.RsgKI_4yuXvGRzpFS7oOYgEsCo&pid=Api",
            "datePublished": "2014-11-16T01:09:56.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "CrazyFunnyStuffCFS"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=G1oGIZmNeXk",
            "hostPageUrl": "https://www.youtube.com/watch?v=G1oGIZmNeXk",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=G1oGIZmNeXk",
            "width": 480,
            "height": 360,
            "duration": "PT2M35S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.LyBzp0G3NOy4FA_1502102637&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/G1oGIZmNeXk?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 2492885,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "14B8EC34B741A773202F14B8EC34B741A773202F",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=E9116671A5B1CD55B4A3E9116671A5B1CD55B4A3",
            "name": "Rescuing Newborn Kittens",
            "description": "Yesterday Kitten Lady rescued 3 newborn kittens: Boomba, Bumble, and Bee. In this video you can see their rescue story, and learn how to care for abandoned n...",
            "thumbnailUrl": "https://tse1.mm.bing.net/th?id=OVP.0jxrmQiG-GXtSe2aVQ3arAEsCo&pid=Api",
            "datePublished": "2016-10-11T01:10:59.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Kitten Lady"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=hsUbkKAuVSU",
            "hostPageUrl": "https://www.youtube.com/watch?v=hsUbkKAuVSU",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=hsUbkKAuVSU",
            "width": 1280,
            "height": 720,
            "duration": "PT8M53S",
            "motionThumbnailUrl": "https://tse3.mm.bing.net/th?id=OM.o7RVzbGlcWYR6Q_1500357757&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/hsUbkKAuVSU?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 1456362,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "E9116671A5B1CD55B4A3E9116671A5B1CD55B4A3",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=1BBBF292415F50405EFC1BBBF292415F50405EFC",
            "name": "Kitten and Grown Dogs Meet for First Time | Too Cute!",
            "description": "Louise is a curious kitten that wants to become pals with two dogs: Wally and Buster. How can Louise win over the reluctant canines? | For more Too Cute!, visit http ...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.yFNo6qcGjJhCW3RI1YZbTQEsCo&pid=Api",
            "datePublished": "2014-10-07T20:26:08.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Animal Planet"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=ywsUFNftdO4",
            "hostPageUrl": "https://www.youtube.com/watch?v=ywsUFNftdO4",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=ywsUFNftdO4",
            "width": 480,
            "height": 360,
            "duration": "PT3M59S",
            "motionThumbnailUrl": "https://tse3.mm.bing.net/th?id=OM.%2fF5AUF9BkvK7Gw_1501062394&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/ywsUFNftdO4?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 1093469,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "1BBBF292415F50405EFC1BBBF292415F50405EFC",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=548A41263B42C1515A2B548A41263B42C1515A2B",
            "name": "Funny Kittens want to be assassins",
            "description": "Jedi kittens , Ninja Kittens , Assassin's Kittens - That's not real, of corse. But these cute Kittens do not agree with this. Funny Kittens studied martial a...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.wr2IxWLceTYnjOqN36XZPAEsCo&pid=Api",
            "datePublished": "2012-09-18T11:56:24.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Funnycatsandnicefish"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=-ydZPFLcHGA",
            "hostPageUrl": "https://www.youtube.com/watch?v=-ydZPFLcHGA",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=-ydZPFLcHGA",
            "width": 480,
            "height": 360,
            "duration": "PT2M6S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.K1pRwUI7JkGKVA_1502210073&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/-ydZPFLcHGA?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 2033164,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "548A41263B42C1515A2B548A41263B42C1515A2B",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=873C45097CCFBCA2E548873C45097CCFBCA2E548",
            "name": "Cute Kittens are Very Mischievous",
            "description": "MY CUTE SHOP: https://cutepetpub.com/ 10% Discount code: TRUEFAN10 for true fans only! A kitten's life is all about play, and play is all about prey. Soon af...",
            "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OVP.kzjX6PkShx8Bxc8A0RyOkAEsCo&pid=Api",
            "datePublished": "2016-09-05T21:50:18.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Miss Aww"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=BtHbMlScVwY",
            "hostPageUrl": "https://www.youtube.com/watch?v=BtHbMlScVwY",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=BtHbMlScVwY",
            "width": 480,
            "height": 360,
            "duration": "PT2M43S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.SOWivM98CUU8hw_1501931485&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/BtHbMlScVwY?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 1566052,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "873C45097CCFBCA2E548873C45097CCFBCA2E548",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=8739540B29A0E62F19B18739540B29A0E62F19B1",
            "name": "Mother cat with kittens and two feral puppy in the bushes",
            "description": "Mother cat with kittens and two feral puppy in the bushes. Today, as usual, I feed the cats and kittens in the street and met a young puppies who were born in the ...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.ZRcOXhXQgFFwVmfGZOuPZAEsCo&pid=Api",
            "datePublished": "2016-09-04T13:26:43.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Robin Seplut"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=0e5n06AUUhQ",
            "hostPageUrl": "https://www.youtube.com/watch?v=0e5n06AUUhQ",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=0e5n06AUUhQ",
            "width": 1280,
            "height": 720,
            "duration": "PT15M44S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.sRkv5qApC1Q5hw_1499542317&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/0e5n06AUUhQ?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 2330376,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "8739540B29A0E62F19B18739540B29A0E62F19B1",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=3A8387F87BF5ED99FEAA3A8387F87BF5ED99FEAA",
            "name": "Dogs Meeting Kittens for the First Time Compilation (2016)",
            "description": "Dogs meeting their feline counter parts for the very first time. Puppies & Babies & Kitties OH MY! New videos all the time! Subscribe: https://www.tinyurl.com ...",
            "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OVP.7Iu36hl8qXqQcUkHGJ6s6AEsCo&pid=Api",
            "datePublished": "2016-04-03T11:09:57.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "funnyplox"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=aW8YIGbmAVo",
            "hostPageUrl": "https://www.youtube.com/watch?v=aW8YIGbmAVo",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=aW8YIGbmAVo",
            "width": 480,
            "height": 360,
            "duration": "PT3M52S",
            "motionThumbnailUrl": "https://tse2.mm.bing.net/th?id=OM.qv6Z7fV7%2bIeDOg_1503440924&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/aW8YIGbmAVo?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 5565755,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "3A8387F87BF5ED99FEAA3A8387F87BF5ED99FEAA",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=9E83B2A1272C9C6951219E83B2A1272C9C695121",
            "name": "Funny Cats And Kittens Who Don't Want To Share Their Food Compilation [BEST OF]",
            "description": "Check out these greedy selfish funny cats and funny kittens that don't want to share their food. If you're up for funny cat videos and funny kitten videos ch...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.5FF7Ev239ajt4PGUayUoUgEsCo&pid=Api",
            "datePublished": "2016-11-16T14:14:16.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "MashupZone"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=_Cgx8wT7hjw",
            "hostPageUrl": "https://www.youtube.com/watch?v=_Cgx8wT7hjw",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=_Cgx8wT7hjw",
            "width": 480,
            "height": 360,
            "duration": "PT4M15S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.IVFpnCwnobKDng_1502214121&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/_Cgx8wT7hjw?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 4273983,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "9E83B2A1272C9C6951219E83B2A1272C9C695121",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=7D75AB5C510768D90EBE7D75AB5C510768D90EBE",
            "name": "Toygers on the Prowl | Too Cute!",
            "description": "For full episodes of Too Cute!, visit http://www.youtube.com/animalplanetfulleps Three week old Toyger kittens finally pluck up the courage to start explorin...",
            "thumbnailUrl": "https://tse4.mm.bing.net/th?id=OVP.eEkistC2MtY_ojLS_Rp7VAEsCo&pid=Api",
            "datePublished": "2012-12-21T17:22:17.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Animal Planet"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=0ByJHRt-RgQ",
            "hostPageUrl": "https://www.youtube.com/watch?v=0ByJHRt-RgQ",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=0ByJHRt-RgQ",
            "width": 1280,
            "height": 720,
            "duration": "PT3M2S",
            "motionThumbnailUrl": "https://tse4.mm.bing.net/th?id=OM.vg7ZaAdRXKt1fQ_1503016924&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/0ByJHRt-RgQ?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 1411130,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "7D75AB5C510768D90EBE7D75AB5C510768D90EBE",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=324DEA6972690F546574324DEA6972690F546574",
            "name": "29 Cute Kitten Videos Compilation 2016",
            "description": "From kittens playing with new toys, kittens too tired to stay awake, to cute kittens enjoying bath time, these are just a few of the cute kittens you'll find in this ...",
            "thumbnailUrl": "https://tse1.mm.bing.net/th?id=OVP.8lpv-vVsiVw-ot85cniwXQEsCo&pid=Api",
            "datePublished": "2016-12-08T00:09:07.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "The Pet Collective"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=caWn6reCLaE",
            "hostPageUrl": "https://www.youtube.com/watch?v=caWn6reCLaE",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=caWn6reCLaE",
            "width": 1280,
            "height": 720,
            "duration": "PT6M18S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.dGVUD2lyaepNMg_1501027640&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/caWn6reCLaE?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 1555579,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "324DEA6972690F546574324DEA6972690F546574",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=266E804ACD778B2C1683266E804ACD778B2C1683",
            "name": "Cute Kittens Compilation || NEW HD",
            "description": "Check out these kittens in this new kitten compilation. These cute kittens will melt your heart. Adorable kittens are always a good way to lift your mood. So...",
            "thumbnailUrl": "https://tse4.mm.bing.net/th?id=OVP.Lx3dn0cCBaSOf4JtHbcrhgEsCo&pid=Api",
            "datePublished": "2015-09-13T19:19:47.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "mihaifrancu"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=mfeqe_94lUs",
            "hostPageUrl": "https://www.youtube.com/watch?v=mfeqe_94lUs",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=mfeqe_94lUs",
            "width": 480,
            "height": 360,
            "duration": "PT3M3S",
            "motionThumbnailUrl": "https://tse4.mm.bing.net/th?id=OM.gxYsi3fNSoBuJg_1501935560&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/mfeqe_94lUs?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 912549,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "266E804ACD778B2C1683266E804ACD778B2C1683",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=B0065315FEE92C9A1CAFB0065315FEE92C9A1CAF",
            "name": "5 Ways to Comfort a Kitten",
            "description": "Fostering orphan kittens means you have fill in for their mama--and that includes providing them with comfort and warmth. Here's my top 5 tips for comforting...",
            "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OVP.pEE57gBblbd473UhwETxUAEsCo&pid=Api",
            "datePublished": "2016-12-21T23:56:23.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Kitten Lady"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=Ep3jK1bZrB8",
            "hostPageUrl": "https://www.youtube.com/watch?v=Ep3jK1bZrB8",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=Ep3jK1bZrB8",
            "width": 1280,
            "height": 720,
            "duration": "PT6M19S",
            "motionThumbnailUrl": "https://tse1.mm.bing.net/th?id=OM.rxyaLOn%2bFVMGsA_1504028768&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/Ep3jK1bZrB8?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 3214515,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "B0065315FEE92C9A1CAFB0065315FEE92C9A1CAF",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=DE9B985C7BA341211C4BDE9B985C7BA341211C4B",
            "name": "Rescued kitten loves Pomeranian dog",
            "description": "After being abandoned by his mother, Pancho the kitten was found alone and with his eyes closed. He was taken in by this caring family, who fed and nursed him to the ...",
            "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OVP.bpB0otr71JkivMzmkmCRZgEsCo&pid=Api",
            "datePublished": "2015-01-22T12:06:53.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Rumble Viral"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=JeTobfej91E",
            "hostPageUrl": "https://www.youtube.com/watch?v=JeTobfej91E",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=JeTobfej91E",
            "width": 1280,
            "height": 720,
            "duration": "PT1M37S",
            "motionThumbnailUrl": "https://tse3.mm.bing.net/th?id=OM.SxwhQaN7XJib3g_1502947254&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/JeTobfej91E?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 961381,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "DE9B985C7BA341211C4BDE9B985C7BA341211C4B",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        },
        {
            "webSearchUrl": "https://www.bing.com/videos/search?q=kittens&view=detail&mid=B6593DCCB6901B2A2356B6593DCCB6901B2A2356",
            "name": "Mom to the Rescue! | Too Cute!",
            "description": "A curious kitty gets into a meowing match with a dog! | For more Too Cute!, visit http://animal.discovery.com/tv/too-cute-kittens/#mkcpgn=ytapl1 For full epi...",
            "thumbnailUrl": "https://tse4.mm.bing.net/th?id=OVP.oDn1aCCku1xgpiZQklOqCgEsCo&pid=Api",
            "datePublished": "2013-03-06T13:54:09.0000000",
            "publisher": [
                {
                    "name": "YouTube"
                }
            ],
            "creator": {
                "name": "Animal Planet"
            },
            "isAccessibleForFree": true,
            "contentUrl": "https://www.youtube.com/watch?v=ZSJQbNCCHtI",
            "hostPageUrl": "https://www.youtube.com/watch?v=ZSJQbNCCHtI",
            "encodingFormat": "h264",
            "hostPageDisplayUrl": "https://www.youtube.com/watch?v=ZSJQbNCCHtI",
            "width": 1280,
            "height": 720,
            "duration": "PT1M59S",
            "motionThumbnailUrl": "https://tse2.mm.bing.net/th?id=OM.ViMqG5C2zD1Ztg_1504283388&pid=Api",
            "embedHtml": "<iframe width=\"1280\" height=\"720\" src=\"https://www.youtube.com/embed/ZSJQbNCCHtI?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>",
            "allowHttpsEmbed": true,
            "viewCount": 4306025,
            "thumbnail": {
                "width": 300,
                "height": 168
            },
            "videoId": "B6593DCCB6901B2A2356B6593DCCB6901B2A2356",
            "allowMobileEmbed": true,
            "isSuperfresh": false
        }
    ],
    "nextOffset": 36,
    "queryExpansions": [
        {
            "text": "Kittens Meowing",
            "displayText": "Meowing",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Meowing&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Meowing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Meowing&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Meowing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Kittens+Meowing&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Funny Kittens",
            "displayText": "Funny",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Funny+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Funny%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Funny+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Funny%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Funny+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Playing",
            "displayText": "Playing",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Playing&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Playing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Playing&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Playing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kittens+Playing&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Baby Kittens",
            "displayText": "Baby",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Baby+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Baby%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Baby+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Baby%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Baby+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Newborn Kittens",
            "displayText": "Newborn",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Newborn+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Newborn%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Newborn+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Newborn%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Newborn+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Being Born",
            "displayText": "Being Born",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Being+Born&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Being+Born%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Being+Born&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Being+Born%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kittens+Being+Born&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Crying",
            "displayText": "Crying",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Crying&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Crying%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Crying&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Crying%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Kittens+Crying&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Cute Kittens",
            "displayText": "Cute",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Cute+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Cute%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Cute+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Cute%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Cute+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten Vines",
            "displayText": "Vines",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+Vines&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Vines%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+Vines&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Vines%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kitten+Vines&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Inspired by Kittens",
            "displayText": "Inspired by",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Inspired+by+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Inspired+by%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Inspired+by+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Inspired+by%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Kittens+Inspired+by+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Talking Kitten",
            "displayText": "Talking",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Talking+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Talking%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Talking+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Talking%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Talking+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Puppies and Kittens",
            "displayText": "Puppies and",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Puppies+and+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Puppies+and%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Puppies+and+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Puppies+and%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Puppies+and+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Tiny Kittens",
            "displayText": "Tiny",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Tiny+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Tiny%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Tiny+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Tiny%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Tiny+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Fighting",
            "displayText": "Fighting",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Fighting&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Fighting%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Fighting&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Fighting%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kittens+Fighting&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten Birth",
            "displayText": "Birth",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+Birth&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Birth%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+Birth&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Birth%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kitten+Birth&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Black Kitten",
            "displayText": "Black",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Black+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Black%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Black+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Black%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Black+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Cat Kitten",
            "displayText": "Cat",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Cat+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Cat%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Cat+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Cat%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Cat+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Dancing Kittens",
            "displayText": "Dancing",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Dancing+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dancing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Dancing+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dancing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Dancing+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Sleeping Kittens",
            "displayText": "Sleeping",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Sleeping+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Sleeping%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Sleeping+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Sleeping%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Sleeping+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten Purring",
            "displayText": "Purring",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+Purring&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Purring%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+Purring&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Purring%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kitten+Purring&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Dear Kitten",
            "displayText": "Dear",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Dear+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dear%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Dear+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dear%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Dear+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Singing",
            "displayText": "Singing",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Singing&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Singing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Singing&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Singing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Kittens+Singing&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Rescue Kitten",
            "displayText": "Rescue",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Rescue+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Rescue%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Rescue+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Rescue%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Rescue+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Adorable Kittens",
            "displayText": "Adorable",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Adorable+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Adorable%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Adorable+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Adorable%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Adorable+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten Fails",
            "displayText": "Fails",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+Fails&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Fails%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+Fails&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Fails%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kitten+Fails&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten for Christmas",
            "displayText": "For Christmas",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+for+Christmas&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22For+Christmas%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+for+Christmas&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22For+Christmas%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Kitten+for+Christmas&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Persian Kittens",
            "displayText": "Persian",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Persian+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Persian%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Persian+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Persian%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Persian+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Munchkin Kitten",
            "displayText": "Munchkin",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Munchkin+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Munchkin%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Munchkin+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Munchkin%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Munchkin+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Ragdoll Kitten",
            "displayText": "Ragdoll",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Ragdoll+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Ragdoll%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Ragdoll+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Ragdoll%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Ragdoll+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Bengal Kitten",
            "displayText": "Bengal",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Bengal+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Bengal%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Bengal+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Bengal%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Bengal+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten Hissing",
            "displayText": "Hissing",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+Hissing&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Hissing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+Hissing&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Hissing%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Kitten+Hissing&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten Attack",
            "displayText": "Attack",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+Attack&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Attack%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+Attack&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Attack%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Kitten+Attack&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Scared Kitten",
            "displayText": "Scared",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Scared+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Scared%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Scared+Kitten&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Scared%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Scared+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten Scott",
            "displayText": "Scott",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+Scott&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Scott%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+Scott&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Scott%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Kitten+Scott&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "YouTube Kittens",
            "displayText": "YouTube",
            "webSearchUrl": "https://www.bing.com/videos/search?q=YouTube+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22YouTube%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=YouTube+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22YouTube%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=YouTube+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Dogs and Kittens",
            "displayText": "Dogs and",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Dogs+and+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dogs+and%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Dogs+and+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dogs+and%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Dogs+and+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Maine Coon Kittens",
            "displayText": "Maine Coon",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Maine+Coon+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Maine+Coon%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Maine+Coon+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Maine+Coon%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Maine+Coon+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Crazy Kittens",
            "displayText": "Crazy",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Crazy+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Crazy%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Crazy+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Crazy%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Crazy+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Star Wars Kittens",
            "displayText": "Star Wars",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Star+Wars+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Star+Wars%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Star+Wars+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Star+Wars%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Star+Wars+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Siamese Kittens",
            "displayText": "Siamese",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Siamese+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Siamese%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Siamese+Kittens&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Siamese%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Siamese+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        }
    ],
    "pivotSuggestions": [
        {
            "pivot": "kittens",
            "suggestions": [
                {
                    "text": "Cat",
                    "displayText": "Cat",
                    "webSearchUrl": "https://www.bing.com/videos/search?q=Cat&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Cat%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRQBPS",
                    "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Cat&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Cat%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
                    "thumbnail": {
                        "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Cat&pid=Api&mkt=en-US&adlt=moderate&t=1"
                    }
                },
                {
                    "text": "Feral Cat",
                    "displayText": "Feral Cat",
                    "webSearchUrl": "https://www.bing.com/videos/search?q=Feral+Cat&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Feral+Cat%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=VRQBPS",
                    "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Feral+Cat&tq=%7b%22pq%22%3a%22kittens%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22kittens%22%2c%22pv%22%3a%22kittens%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Feral+Cat%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
                    "thumbnail": {
                        "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Feral+Cat&pid=Api&mkt=en-US&adlt=moderate&t=1"
                    }
                }
            ]
        }
    ],
    "relatedSearches": [
        {
            "text": "Kittens Being Born",
            "displayText": "Kittens Being Born",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Being+Born&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Being+Born",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kittens+Being+Born&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Munchkin Kittens",
            "displayText": "Munchkin Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Munchkin+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Munchkin+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Munchkin+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Funny Kitten Videos",
            "displayText": "Funny Kitten Videos",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Funny+Kitten+Videos&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Funny+Kitten+Videos",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Funny+Kitten+Videos&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Baby Kittens",
            "displayText": "Baby Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Baby+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Baby+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Baby+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Hissing",
            "displayText": "Kittens Hissing",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Hissing&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Hissing",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Kittens+Hissing&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Purring",
            "displayText": "Kittens Purring",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Purring&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Purring",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Kittens+Purring&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Dancing Kittens",
            "displayText": "Dancing Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Dancing+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Dancing+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Dancing+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten Songs",
            "displayText": "Kitten Songs",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+Songs&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+Songs",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Kitten+Songs&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Adorable Kittens",
            "displayText": "Adorable Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Adorable+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Adorable+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Adorable+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Cute Kittens",
            "displayText": "Cute Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Cute+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Cute+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Cute+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "4 Week Old Kittens",
            "displayText": "4 Week Old Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=4+Week+Old+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=4+Week+Old+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=4+Week+Old+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kitten Vines",
            "displayText": "Kitten Vines",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kitten+Vines&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kitten+Vines",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kitten+Vines&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Inspired by Kittens",
            "displayText": "Kittens Inspired by Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Inspired+by+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Inspired+by+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Kittens+Inspired+by+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Talking Kitten",
            "displayText": "Talking Kitten",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Talking+Kitten&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Talking+Kitten",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Talking+Kitten&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Newborn Kittens",
            "displayText": "Newborn Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Newborn+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Newborn+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Newborn+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Tiny Kittens",
            "displayText": "Tiny Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Tiny+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Tiny+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Tiny+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Meowing",
            "displayText": "Kittens Meowing",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Meowing&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Meowing",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Kittens+Meowing&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Playing",
            "displayText": "Kittens Playing",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Playing&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Playing",
            "thumbnail": {
                "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Kittens+Playing&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Kittens Meowing Sounds",
            "displayText": "Kittens Meowing Sounds",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Kittens+Meowing+Sounds&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Kittens+Meowing+Sounds",
            "thumbnail": {
                "thumbnailUrl": "https://tse3.mm.bing.net/th?q=Kittens+Meowing+Sounds&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        },
        {
            "text": "Puppies and Kittens",
            "displayText": "Puppies and Kittens",
            "webSearchUrl": "https://www.bing.com/videos/search?q=Puppies+and+Kittens&FORM=VRPATC",
            "searchLink": "https://api.cognitive.microsoft.com/api/v7/videos/search?q=Puppies+and+Kittens",
            "thumbnail": {
                "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Puppies+and+Kittens&pid=Api&mkt=en-US&adlt=moderate&t=1"
            }
        }
    ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Paging videos](paging-videos.md)
> [Resizing and cropping thumbnail images](resize-and-crop-thumbnails.md)

## See also 

 [Searching the web for videos](search-the-web.md)
 [Try it](https://azure.microsoft.com/services/cognitive-services/bing-video-search-api/)