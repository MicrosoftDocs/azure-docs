---
title: Upgrade from Bing Image Search API v5 to v7
titleSuffix: Azure Cognitive Services
description: This upgrade guide describes changes between version 5 and version 7 of the Bing Image Search API. Use this guide to help you identify the parts of your application that you need to update to use version 7.
services: cognitive-services
author: swhite-msft
manager: nitinme
ms.assetid: 7F78B91F-F13B-40A4-B8A7-770FDB793F0F
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: article
ms.date: 02/12/2019
ms.author: scottwhi
---

# Bing Image Search API v7 upgrade guide

This upgrade guide identifies the changes between version 5 and version 7 of the Bing Image Search API. Use this guide to help you identify the parts of your application that you need to update to use version 7.

## Breaking changes

### Endpoints

- The endpoint's version number changed from v5 to v7. For example, https:\//api.cognitive.microsoft.com/bing/\*\*v7.0**/images/search.

### Error response objects and error codes

- All failed requests should now include an `ErrorResponse` object in the response body.

- Added the following fields to the `Error` object.  
  - `subCode`&mdash;Partitions the error code into discrete buckets, if possible
  - `moreDetails`&mdash;Additional information about the error described in the `message` field


- Replaced the v5 error codes with the following possible `code` and `subCode` values.

|Code|SubCode|Description
|-|-|-
|ServerError|UnexpectedError<br/>ResourceError<br/>NotImplemented|Bing returns ServerError whenever any of the sub-code conditions occur. The response includes these errors if the HTTP status code is 500.
|InvalidRequest|ParameterMissing<br/>ParameterInvalidValue<br/>HttpNotAllowed<br/>Blocked|Bing returns InvalidRequest whenever any part of the request is not valid. For example, a required parameter is missing or a parameter value is not valid.<br/><br/>If the error is ParameterMissing or ParameterInvalidValue, the HTTP status code is 400.<br/><br/>If the error is HttpNotAllowed, the HTTP status code 410.
|RateLimitExceeded||Bing returns RateLimitExceeded whenever you exceed your queries per second (QPS) or queries per month (QPM) quota.<br/><br/>Bing returns HTTP status code 429 if you exceeded QPS and 403 if you exceeded QPM.
|InvalidAuthorization|AuthorizationMissing<br/>AuthorizationRedundancy|Bing returns InvalidAuthorization when Bing cannot authenticate the caller. For example, the `Ocp-Apim-Subscription-Key` header is missing or the subscription key is not valid.<br/><br/>Redundancy occurs if you specify more than one authentication method.<br/><br/>If the error is InvalidAuthorization, the HTTP status code is 401.
|InsufficientAuthorization|AuthorizationDisabled<br/>AuthorizationExpired|Bing returns InsufficientAuthorization when the caller does not have permissions to access the resource. This can occur if the subscription key has been disabled or has expired. <br/><br/>If the error is InsufficientAuthorization, the HTTP status code is 403.

- The following maps the previous error codes to the new codes. If you've taken a dependency on v5 error codes, update your code accordingly.

|Version 5 code|Version 7 code.subCode
|-|-
|RequestParameterMissing|InvalidRequest.ParameterMissing
RequestParameterInvalidValue|InvalidRequest.ParameterInvalidValue
ResourceAccessDenied|InsufficientAuthorization
ExceededVolume|RateLimitExceeded
ExceededQpsLimit|RateLimitExceeded
Disabled|InsufficientAuthorization.AuthorizationDisabled
UnexpectedError|ServerError.UnexpectedError
DataSourceErrors|ServerError.ResourceError
AuthorizationMissing|InvalidAuthorization.AuthorizationMissing
HttpNotAllowed|InvalidRequest.HttpNotAllowed
UserAgentMissing|InvalidRequest.ParameterMissing
NotImplemented|ServerError.NotImplemented
InvalidAuthorization|InvalidAuthorization
InvalidAuthorizationMethod|InvalidAuthorization
MultipleAuthorizationMethod|InvalidAuthorization.AuthorizationRedundancy
ExpiredAuthorizationToken|InsufficientAuthorization.AuthorizationExpired
InsufficientScope|InsufficientAuthorization
Blocked|InvalidRequest.Blocked



### Query parameters

- Renamed the `modulesRequested` query parameter to [modules](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference).  

- Renamed the Annotations to Tags. See [modules](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference) query parameter to Tags.  

- Changed the list of supported markets of the ShoppingSources filter value to en-US only. See [imageType](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imagetype).  


### Image insights changes

- Renamed the `annotations` field of [ImagesInsights](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imageinsightsresponse) to `imageTags`.  

- Renamed the `AnnotationModule` object to [ImageTagsModule](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imagetagsmodule).  

- Renamed the `Annotation` object to [Tag](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#tag), and removed the `confidence` field.  

- Renamed the `insightsSourcesSummary` field of the [Image](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#image) object to `insightsMetadata`.  

- Renamed the `InsightsSourcesSummary` object to [InsightsMetadata](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#insightsmetadata).  

- Added the `https://api.cognitive.microsoft.com/bing/v7.0/images/details` endpoint. Use this endpoint to request image insights instead of the /images/search endpoint. See [Image Insights](./image-insights.md).

- The following query parameters are now valid only with the `/images/details` endpoint.  

    -   [insightsToken](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#insightstoken)  
    -   [modules](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference)  
    -   [imgUrl](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imgurl)  
    -   [cab](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#cab)  
    -   [cal](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#cal)  
    -   [car](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#car)  
    -   [cat](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#cat)  
    -   [ct](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#ct)  

- Renamed the `ImageInsightsResponse` object to [ImageInsights](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imageinsights).  

- Changed the data types of the following fields in the [ImageInsights](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imageinsights) object.  

    -   Changed the type of the `relatedCollections` field from `ImageGallery[]` to [RelatedCollectionsModule](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#relatedcollectionsmodule).  

    -   Changed the type of the `pagesIncluding` field from `Image[]` to [ImagesModule](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imagesmodule).  

    -   Changed the type of the `relatedSearches` field from `Query[]` to [RelatedSearchesModule](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#relatedsearchesmodule).  

    -   Changed the type of the `recipes` field from `Recipe[]` to [RecipesModule](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#recipesmodule).  

    -   Changed the type of the `visuallySimilarImages` field from `Image[]` to [ImagesModule](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imagesmodule).  

    -   Changed the type of the `visuallySimilarProducts` field from `ProductSummaryImage[]` to [ImagesModule](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imagesmodule).  

    -   Removed the `ProductSummaryImage` object and moved the product-related fields into the [Image](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#image) object. The `Image` object includes the product-related fields only when the image is included as part of visually similar products in an image insight response.  

    -   Changed the type of the `recognizedEntityGroups` field from `RecognizedEntityGroup[]` to [RecognizedEntitiesModule](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#recognizedentitiesmodule).  

-   Renamed the `categoryClassification` field of [ImageInsights](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imageinsightsresponse) to `annotations`, and changed its type to `AnnotationsModule`.  

### Images answer

-   Removed the displayShoppingSourcesBadges and displayRecipeSourcesBadges fields from [Images](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#images).  

-   Renamed the `nextOffsetAddCount` field of [Images](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#images) to `nextOffset`. The way you use the offset has also changed. Previously, you set the [offset](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#offset) query parameter to the `nextOffsetAddCount` value plus the previous offset value plus the number of images in the result. Now, you set `offset` to the `nextOffset` value.  


## Non-breaking changes

### Query parameters

- Added Transparent as a possible [imageType](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imagetype) filter value. The Transparent filter returns only images with a transparent background.

- Added the Any as a possible [license](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#license) filter value. The Any filter returns only images that are under license.

- Added the [maxFileSize](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#maxfilesize) and [minFileSize](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#minfilesize) query parameters. Use these filters to return images within a range of file sizes.  

- Added the [maxHeight](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#maxheight), [minHeight](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#minheight), [maxWidth](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#maxwidth), [minWidth](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#minwidth) query parameters. Use these filters to return images within a range of heights and widths.  

### Object changes

- Added the `description` and `lastUpdated` fields to the [Offer](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#offer) object.  

- Added the `name` field to the [ImageGallery](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imagegallery) object.  

- Added `similarTerms` to the [Images](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#images) object. This field contains a list of terms that are similar in meaning to the user's query string.  
