---
title: Upgrade from API v5 to v7 - Bing Web Search API
titleSuffix: Azure Cognitive Services
description: Determine which parts of your application require updates to use the Bing Web Search v7 APIs.
services: cognitive-services
author: swhite-msft
manager: nitinme
ms.assetid: E8827BEB-4379-47CE-B67B-6C81AD7DAEB1
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: conceptual
ms.date: 02/12/2019
ms.author: scottwhi
---

# Upgrade from Bing Web Search API v5 to v7

This upgrade guide identifies the changes between version 5 and version 7 of the Bing Web Search API. Use this guide to help you identify the parts of your application that you need to update to use version 7.

## Breaking changes

### Endpoints

- The endpoint's version number has changed from v5 to v7. For example, https:\/\/api.cognitive.microsoft.com/bing/**v7.0**/search.

### Error response objects and error codes

- All failed requests should now include an `ErrorResponse` object in the response body.

- Added the following fields to the `Error` object.  
  - `subCode`&mdash;Partitions the error code into discrete buckets, if possible
  - `moreDetails`&mdash;Additional information about the error described in the `message` field


- Replaced the v5 error codes with the following possible `code` and `subCode` values.

|Code|SubCode|Description
|-|-|-
|ServerError|UnexpectedError<br/>ResourceError<br/>NotImplemented|Bing returns ServerError whenever any of the subcode conditions occur. The response will include these errors if the HTTP status code is 500.
|InvalidRequest|ParameterMissing<br/>ParameterInvalidValue<br/>HttpNotAllowed<br/>Blocked|Bing returns InvalidRequest whenever any part of the request is not valid. For example, a required parameter is missing or a parameter value is not valid.<br/><br/>If the error is ParameterMissing or ParameterInvalidValue, the HTTP status code is 400.<br/><br/>If the error is HttpNotAllowed, the HTTP status code 410.
|RateLimitExceeded||Bing returns RateLimitExceeded whenever you exceed your queries per second (QPS) or queries per month (QPM) quota.<br/><br/>Bing returns HTTP status code 429 if you exceeded QPS and 403 if you exceeded QPM.
|InvalidAuthorization|AuthorizationMissing<br/>AuthorizationRedundancy|Bing returns InvalidAuthorization when Bing cannot authenticate the caller. For example, the `Ocp-Apim-Subscription-Key` header is missing or the subscription key is not valid.<br/><br/>Redundancy occurs if you specify more than one authentication method.<br/><br/>If the error is InvalidAuthorization, the HTTP status code is 401.
|InsufficientAuthorization|AuthorizationDisabled<br/>AuthorizationExpired|Bing returns InsufficientAuthorization when the caller does not have permissions to access the resource. This error can occur if the subscription key has been disabled or has expired. <br/><br/>If the error is InsufficientAuthorization, the HTTP status code is 403.

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


## Non-breaking changes  

### Headers

- Added the optional [Pragma](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#pragma) request header. By default, Bing returns cached content, if available. To prevent Bing from returning cached content, set the Pragma header to no-cache (for example, Pragma: no-cache).

### Query parameters

- Added the [answerCount](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#answercount) query parameter. Use this parameter to specify the number of answers that you want the response to include. The answers are chosen based on ranking. For example, if you set this parameter to three (3), the response includes the top three ranked answers.  

- Added the [promote](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#promote) query parameter. Use this parameter along with `answerCount` to explicitly include one or more answer types, regardless of their ranking. For example, to promote videos and images into the response, you'd set promote to *videos, images*. The list of answers that you want to promote does not count against the `answerCount` limit. For example, if `answerCount` is 2 and `promote` is set to *videos, images*, the response might include webpages, news, videos, and images.

### Object changes

- Added the `someResultsRemoved` field to the [WebAnswer](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#webanswer) object. The field contains a Boolean value that indicates whether the response excluded some results from the web answer.  
