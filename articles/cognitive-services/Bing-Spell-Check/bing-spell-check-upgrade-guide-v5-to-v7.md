---
title: Upgrade Bing Spell Check API v5 to v7
titlesuffix: Azure Cognitive Services
description: Identifies the parts of your application that you need to update to use version 7.
services: cognitive-services
author: swhite-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: conceptual
ms.date: 02/20/2019
ms.author: scottwhi
---

# Spell Check API upgrade guide

This upgrade guide identifies the changes between version 5 and version 7 of the Bing Spell Check API. Use this guide to help you identify the parts of your application that you need to update to use version 7.

## Breaking changes

### Endpoints

- The endpoint's version number changed from v5 to v7. For example, `https://api.cognitive.microsoft.com/bing/v7.0/spellcheck`.

### Error response objects and error codes

- All failed requests should now include an `ErrorResponse` object in the response body.

- Added the following fields to the `Error` object.  
  - `subCode`&mdash;Partitions the error code into discrete buckets, if possible
  - `moreDetails`&mdash;Additional information about the error described in the `message` field
   

- Replaced the v5 error codes with the following possible `code` and `subCode` values.  
  
|Code|SubCode|Description
|-|-|-
|ServerError|UnexpectedError<br/>ResourceError<br/>NotImplemented|Bing returns ServerError whenever any of the subcode conditions occur. The response includes these errors if the HTTP status code is 500.
|InvalidRequest|ParameterMissing<br/>ParameterInvalidValue<br/>HttpNotAllowed<br/>Blocked|Bing returns InvalidRequest whenever any part of the request isn't valid. For example, a required parameter is missing or a parameter value isn't valid.<br/><br/>If the error is ParameterMissing or ParameterInvalidValue, the HTTP status code is 400.<br/><br/>If the error is HttpNotAllowed, the HTTP status code 410.
|RateLimitExceeded||Bing returns RateLimitExceeded whenever you exceed your queries per second (QPS) or queries per month (QPM) quota.<br/><br/>Bing returns HTTP status code 429 if you exceeded QPS and 403 if you exceeded QPM.
|InvalidAuthorization|AuthorizationMissing<br/>AuthorizationRedundancy|Bing returns InvalidAuthorization when Bing can't authenticate the caller. For example, the `Ocp-Apim-Subscription-Key` header is missing or the subscription key isn't valid.<br/><br/>Redundancy occurs if you specify more than one authentication method.<br/><br/>If the error is InvalidAuthorization, the HTTP status code is 401.
|InsufficientAuthorization|AuthorizationDisabled<br/>AuthorizationExpired|Bing returns InsufficientAuthorization when the caller doesn't have permissions to access the resource. This can occur if the subscription key has been disabled or has expired. <br/><br/>If the error is InsufficientAuthorization, the HTTP status code is 403.

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

## Next steps

> [!div class="nextstepaction"]
> [Use and display requirements](./UseAndDisplayRequirements.md)
