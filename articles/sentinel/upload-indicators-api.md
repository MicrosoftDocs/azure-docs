---
title: Import threat intelligence with the upload indicators API
titleSuffix: Microsoft Sentinel
description: This article is a reference for the upload indicators API with an example request and response.
author: austinmccollum
ms.topic: reference
ms.date: 05/23/2023
ms.author: austinmc
---

# Reference the upload indicators API (Preview) to import threat intelligence to Microsoft Sentinel

The Microsoft Sentinel upload indicators API allows for threat intelligence platforms or custom applications to import indicators of compromise in the STIX format into a Microsoft Sentinel workspace. Whether you use the API with the [Microsoft Sentinel upload indicators API data connector](connect-threat-intelligence-upload-api.md) or as part of a custom solution, this document serves as a reference.

> [!IMPORTANT]
> This API is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

An upload indicators API call has five components:

1. The request URI
1. HTTP request message header
1. HTTP request message body
1. Optionally process the HTTP response message header
1. Optionally process the HTTP response message body

## Register your client application with Azure AD

In order to authenticate to Microsoft Sentinel, the request to the upload indicators API requires a valid Azure AD access token. For more information on application registration, see [Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md) or see the basic steps as part of the [upload indicators API data connector](connect-threat-intelligence-upload-api.md#register-an-azure-ad-application) setup.

## Permissions

This API requires the calling Azure AD application to be granted the Microsoft Sentinel contributor role at the workspace level.

## Create the request

This section covers the first three of the five components discussed earlier. You first need to acquire the access token from Azure AD, which you use to assemble your request message header.

### Acquire an access token

Acquire an Azure AD access token with [OAuth 2.0 authentication](../active-directory/fundamentals/auth-oauth2.md). [V1.0 and V2.0](../active-directory/develop/access-tokens.md#token-formats) are valid tokens accepted by the API.

To get a v1.0 token, use [ADAL](../active-directory/azuread-dev/active-directory-authentication-libraries.md) or send requests to the REST API in the following format:
- POST `https://login.microsoftonline.com/{{tenantId}}/oauth2/token`
- Headers for using Azure AD App:
- grant_type: "client_credentials"
- client_id: {Client ID of Azure AD App}
- client_secret: {Client secret of Azure AD App}
- resource: `"https://management.azure.com/"`

To get a v2.0 token, use Microsoft Authentication Library [MSAL](../active-directory/develop/msal-overview.md) or send requests to the REST API in the following format:
- POST `https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/token`
- Headers for using Azure AD App:
- grant_type: "client_credentials"
- client_id: {Client ID of Azure AD App}
- client_secret: {secret of Azure AD App}
- scope: `"https://management.azure.com/.default"`

The resource/scope value is the audience of the token. This API only accepts the following audiences:
- `https://management.core.windows.net/`
- `https://management.core.windows.net`
- `https://management.azure.com/`
- `https://management.azure.com`


### Assemble the request message

#### Request URI 
API versioning: `api-version=2022-07-01`<br>
Endpoint: `https://sentinelus.azure-api.net/{workspaceId}/threatintelligence:upload-indicators?api-version=2022-07-01`<br>
Method: `POST`<br>

#### Request header
`Authorization`: Contains the OAuth2 bearer token<br>
`Content-Type`: `application/json`

#### Request body
The JSON object for the body contains the following fields:

|Field name	|Data Type	|Description|
|---|---|---|
|SourceSystem (required)| string | Identify your source system name. The value `Microsoft Sentinel` is restricted.|
|Value (required) | array | An array of indicators in [STIX 2.0 or 2.1 format](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_muftrcpnf89v) |

Create the array of indicators using the STIX 2.1 indicator format specification, which has been condensed here for your convenience with links to important sections. Also note some properties, while valid for STIX 2.1, don't have corresponding indicator properties in Microsoft Sentinel.

|Property Name	|Type |	Description |
|----|----|----|
|`id` (required)| string | An ID used to identify the indicator. See section [2.9](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_64yvzeku5a5c) for specifications on how to create an `id`. The format looks something like `indicator--<UUID>`|
|`spec_version` (optional) | string | STIX indicator version. This value is required in the STIX specification, but since this API only supports STIX 2.0 and 2.1, when this field isn't set, the API will default to `2.1`|
|`type` (required)|	string | The value of this property *must* be `indicator`.|
|`created` (required) | timestamp | See section [3.2](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_xzbicbtscatx) for specifications of this common property.|
|`modified` (required) | timestamp | See section [3.2](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_xzbicbtscatx) for specifications of this common property.|
|`name` (optional)|	string | A name used to identify the indicator.<br><br>Producers *should* provide this property to help products and analysts understand what this indicator actually does.|
|`description` (optional) | string | A description that provides more details and context about the indicator, potentially including its purpose and its key characteristics.<br><br>Producers *should* provide this property to help products and analysts understand what this indicator actually does. |
|`indicator_types` (optional) | list of strings | A set of categorizations for this indicator.<br><br>The values for this property *should* come from the [indicator-type-ov](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_cvhfwe3t9vuo) |
|`pattern` (required) | string | The detection pattern for this indicator *may* be expressed as a [STIX Patterning](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_e8slinrhxcc9) or another appropriate language such as SNORT, YARA, etc. |
|`pattern_type` (required) | string | The pattern language used in this indicator.<br><br>The value for this property *should* come from [pattern types](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_9lfdvxnyofxw).<br><br>The value of this property *must* match the type of pattern data included in the pattern property.|
|`pattern_version` (optional) | string | The version of the pattern language used for the data in the pattern property, which *must* match the type of pattern data included in the pattern property.<br><br>For patterns that don't have a formal specification, the build or code version that the pattern is known to work with *should* be used.<br><br>For the STIX pattern language, the specification version of the object determines the default value.<br><br>For other languages, the default value *should* be the latest version of the patterning language at the time of this object's creation.|
|`valid_from` (required) | timestamp | The time from which this indicator is considered a valid indicator of the behaviors it's related to or represents.|
|`valid_until` (optional) | timestamp | The time at which this indicator should no longer be considered a valid indicator of the behaviors it's related to or represents.<br><br>If the valid_until property is omitted, then there is no constraint on the latest time for which the indicator is valid.<br><br>This timestamp *must* be greater than the valid_from timestamp.|
|`kill_chain_phases` (optional) | list of string | The kill chain phase(s) to which this indicator corresponds.<br><br>The value for this property *should* come from the [Kill Chain Phase](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_i4tjv75ce50h).|
|`created_by_ref` (optional) | string | The created_by_ref property specifies the ID property of the entity that created this object.<br><br>If this attribute is omitted, the source of this information is undefined. For object creators who wish to remain anonymous, keep this value undefined.|
|`revoked` (optional) | boolean | Revoked objects are no longer considered valid by the object creator. Revoking an object is permanent; future versions of the object with this `id` *must not* be created.<br><br>The default value of this property is false.|
|`labels` (optional) | list of strings | The `labels` property specifies a set of terms used to describe this object. The terms are user-defined or trust-group defined. These labels will display as **Tags** in Microsoft Sentinel.|
|`confidence` (optional) | integer | The `confidence` property identifies the confidence that the creator has in the correctness of their data. The confidence value *must* be a number in the range of 0-100.<br><br>[Appendix A](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_1v6elyto0uqg) contains a table of normative mappings to other confidence scales that *must* be used when presenting the confidence value in one of those scales.<br><br>If the confidence property is not present, then the confidence of the content is unspecified.|
|`lang` (optional) | string | The `lang` property identifies the language of the text content in this object. When present, it *must* be a language code conformant to [RFC5646](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#kix.yoz409d7eis1). If the property isn't present, then the language of the content is `en` (English).<br><br>This property *should* be present if the object type contains translatable text properties (for example, name, description).<br><br>The language of individual fields in this object *may* override the `lang` property in granular markings (see section [7.2.3](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_robezi5egfdr)).|
|`object_marking_refs` (optional, including TLP) | list of strings | The `object_marking_refs` property specifies a list of ID properties of marking-definition objects that apply to this object. For example, use the Traffic Light Protocol (TLP) marking definition ID to designate the sensitivity of the indicator source. For details of what marking-definition IDs to use for TLP content, see section [7.2.1.4](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_yd3ar14ekwrs)<br><br>In some cases, though uncommon, marking definitions themselves may be marked with sharing or handling guidance. In this case, this property *must not* contain any references to the same Marking Definition object (that is, it can't contain any circular references).<br><br>See section [7.2.2](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_bnienmcktc0n) for further definition of data markings.|
|`external_references` (optional) | list of object | The `external_references` property specifies a list of external references which refers to non-STIX information. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems.|
|`granular_markings` (optional) | list of [granular-marking](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_robezi5egfdr) | The `granular_markings` property helps define parts of the indicator differently. For example, the indicator language is English, `en` but the description is German, `de`.<br><br>In some cases, though uncommon, marking definitions themselves may be marked with sharing or handling guidance. In this case, this property *must not* contain any references to the same Marking Definition object (i.e., it can't contain any circular references).<br><br>See section [7.2.3](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_robezi5egfdr) for further definition of data markings.|


### Process the response message

The response header contains an HTTP status code. Reference this table for more information about how to interpret the API call result.

|Status code  |Description  |
|---------|---------|
|**200**     |   Success. The API returns 200 when one or more indicators are successfully validated and published. |
|**400**     |   Bad format. Something in the request isn't correctly formatted.    |
|**401**     |   Unauthorized. |
|**404**     |   File not found. Usually this error occurs when the workspace ID isn't found.   |
|**429**     |   The number of requests in a minute has exceeded.   |
|**500**     |   Server error. Usually an error in the API or Microsoft Sentinel services.

The response body is an array of error messages in JSON format:

|Field name | Data Type | Description |
|----|----|----|
|errors	| Array of error objects | List of validation errors |

**Error object**

|Field name | Data Type | Description |
|----|----|----|
|recordIndex | int | Index of the indicators in the request |
|errorMessages | Array of strings | Error messages |


## Throttling limits for the API

All limits are applied per user:
- 100 indicators per request. 
- 100 requests per minute.

If there are more requests than the limit, a `429` http status code in the response header is returned with the following response body:
```json
{
    "statusCode": 429,
    "message": "Rate limit is exceeded. Try again in <number of seconds> seconds."
}
```
Approximately 10,000 indicators per minute is the maximum throughput before a throttling error is received. 

### Sample request body

```json
{
    "sourcesystem": "test", 
    "value":[
        {
            "type": "indicator",
            "spec_version": "2.1",
            "id": "indicator--10000003-71a2-445c-ab86-927291df48f8", 
            "name": "Test Indicator 1",
            "created": "2010-02-26T18:29:07.778Z", 
            "modified": "2011-02-26T18:29:07.778Z",
            "pattern": "[ipv4-addr:value = '172.29.6.7']", 
            "pattern_type": "stix",
            "valid_from": "2015-02-26T18:29:07.778Z"
        },
        {
            "type": "indicator",
            "spec_version": "2.1",
            "id": "indicator--67e62408-e3de-4783-9480-f595d4fdae52", 
            "created": "2023-01-01T18:29:07.778Z",
            "modified": "2025-02-26T18:29:07.778Z",
            "created_by_ref": "identity--19f33886-d196-468e-a14d-f37ff0658ba7", 
            "revoked": false,
            "labels": [
                "label 1",
                "label 2"
            ],
            "confidence": 55, 
            "lang": "en", 
            "external_references": [
                {
                    "source_name": "External Test Source", 
                    "description": "Test Report",
                    "external_id": "e8085f3f-f2b8-4156-a86d-0918c98c498f", 
                    "url": "https://fabrikam.com//testreport.json",
                    "hashes": {
                        "SHA-256": "6db12788c37247f2316052e142f42f4b259d6561751e5f401a1ae2a6df9c674b"
                    }
                }
            ],
            "object_marking_refs": [
                "marking-definition--613f2e26-407d-48c7-9eca-b8e91df99dc9"
            ],
            "granular_markings": [
                {
                    "marking_ref": "marking-definition--beb3ec79-03aa-4594-ad24-09982d399b80", 
                    "selectors": [ "description", "labels" ],
                    "lang": "en"
                }
            ],
            "name": "Test Indicator 2",
            "description": "This is a test indicator to demo valid fields", 
            "indicator_types": [
                "threatstream-severity-low", "threatstream-confidence-80"
            ],
            "pattern": "[ipv4-addr:value = '192.168.1.1']", 
            "pattern_type": "stix",
            "pattern_version": "2.1",
            "valid_from": "2023-01-01T18:29:07.778Z", 
            "valid_until": "2025-02-26T18:29:07.778Z",
            "kill_chain_phases": [
                {
                    "kill_chain_name": "lockheed-martin-cyber-kill-chain", 
                    "phase_name": "reconnaissance"
                }
            ]
        }
    ]
}
```

### Sample response body with validation error
If all indicators are validated successfully, an HTTP 200 status is returned with an empty response body. 

If validation fails for one or more indicators, the response body is returned with more information. For example, if you send an array with four indicators, and the first three are good but the fourth doesn't have an `id` (a required field), then an HTTP status code 200 response is generated along with the following body:

```json
{
    "errors": [
        {
            "recordIndex":3, 
            "errorMessages": [
                "Error for Property=id: Required property is missing. Actual value: NULL."
            ]
        }
    ]
}
```
The indicators are sent as an array, so the `recordIndex` begins at `0`.


## Next steps

To learn more about how to work with threat intelligence in Microsoft Sentinel, see the following articles:

- [Understand threat intelligence](understand-threat-intelligence.md)
- [Work with threat indicators](work-with-threat-indicators.md)
- [Use matching analytics to detect threats](use-matching-analytics-to-detect-threats.md)
- Utilize the intelligence feed from Microsoft and [enable MDTI data connector](connect-mdti-data-connector.md)
