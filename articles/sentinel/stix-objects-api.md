---
title: Import threat intelligence with the upload API
titleSuffix: Microsoft Sentinel
description: This article is a reference for the upload upload API with example requests and responses.
author: austinmccollum
ms.topic: reference
ms.date: 05/30/2024
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
---

# Import threat intelligence to Microsoft Sentinel with the upload API (Preview)

Import threat intelligence to use in Microsoft Sentinel with the upload API. Whether you're using a threat intelligence platform or a custom application, use this document as a supplemental reference to the instructions in [Connect your TIP with the upload API](connect-threat-intelligence-upload-api.md). Installing the data connector isn't required to connect to the API. The threat intelligence you can import includes indicators of compromise and other STIX domain objects.

> [!IMPORTANT]
> This API is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Structured Threat Information Expression (STIX) is a language for expressing cyber threat and observable information. Enhanced support for the following domain objects is included with the upload API:

- indicator
- attack pattern
- threat actor
- identity
- relationship

For more information, see [Introduction to STIX](https://oasis-open.github.io/cti-documentation/stix/intro.html). 

> [!NOTE]
> The previous upload indicators API is now legacy. If you need to reference that API while transitioning to this new upload API, see [Legacy upload indicators API](upload-indicators-api.md).

## Call the API

A call to the upload API has five components:

1. The request URI
1. HTTP request message header
1. HTTP request message body
1. Optionally process the HTTP response message header
1. Optionally process the HTTP response message body

## Register your client application with Microsoft Entra ID

In order to authenticate to Microsoft Sentinel, the request to the upload API requires a valid Microsoft Entra access token. For more information on application registration, see [Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app) or see the basic steps as part of the [Connect threat intelligence with upload API](connect-threat-intelligence-upload-api.md#register-an-azure-ad-application) setup.

This API requires the calling Microsoft Entra application to be granted the Microsoft Sentinel contributor role at the workspace level.

## Create the request

This section covers the first three of the five components discussed earlier. You first need to acquire the access token from Microsoft Entra ID, which you use to assemble your request message header.

### Acquire an access token

Acquire a Microsoft Entra access token with [OAuth 2.0 authentication](../active-directory/fundamentals/auth-oauth2.md). [V1.0 and V2.0](/entra/identity-platform/access-tokens#token-formats) are valid tokens accepted by the API.

The version of the token (v1.0 or v2.0) received is determined by the `accessTokenAcceptedVersion` property in the [app manifest](/entra/identity-platform/reference-app-manifest#manifest-reference) of the API that your application is calling. If `accessTokenAcceptedVersion` is set to 1, then your application receives a v1.0 token.

Use Microsoft Authentication Library [(MSAL)](/entra/identity-platform/msal-overview) to acquire either a v1.0 or v2.0 access token. Use the access token to create the authorization header which contains the bearer token.

For example, a request to the upload API uses the following elements to retrieve an access token and create the authorization header, which is used in each request:
- POST `https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/token`

Headers for using Microsoft Entra App:
- grant_type: "client_credentials"
- client_id: {Client ID of Microsoft Entra App}
- client_secret or client_certificate: {secrets of the Microsoft Entra App}
- scope: `"https://management.azure.com/.default"`

If `accessTokenAcceptedVersion` in the app manifest is set to 1, your application receives a v1.0 access token even though it's calling the v2 token endpoint.

The resource/scope value is the audience of the token. This API only accepts the following audiences:
- `https://management.core.windows.net/`
- `https://management.core.windows.net`
- `https://management.azure.com/`
- `https://management.azure.com`


### Assemble the request message

#### Request URI 
API versioning: `api-version=2024-02-01-preview`<br>
Endpoint: `https://api.ti.sentinel.azure.com/workspaces/{workspaceId}/threat-intelligence-stix-objects:upload?api-version={apiVersion}`<br>
Method: `POST`<br>

#### Request header
`Authorization`: Contains the OAuth2 bearer token<br>
`Content-Type`: `application/json`

#### Request body
The JSON object for the body contains the following fields:

|Field name    |Data Type    |Description|
|---|---|---|
| `sourcesystem` (required) | string | Identify your source system name. The value `Microsoft Sentinel` is restricted.|
| `stixobjects` (required) | array | An array of STIX objects in [STIX 2.0 or 2.1 format](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_muftrcpnf89v) |

Create the array of STIX objects using the STIX format specification. Some of the STIX property specifications are expanded here for your convenience with links to the relevant STIX document sections. Also note some properties, while valid for STIX, don't have corresponding object schema properties in Microsoft Sentinel.

>[!WARNING]
>If you're using a Microsoft Sentinel Logic App to connect to the upload API, note there are three threat intelligence actions available. Only use the [**Threat Intelligence - Upload STIX Objects (Preview)**](/connectors/azuresentinel/#threat-intelligence---upload-stix-objects-(preview)). The other two will fail with this endpoint and JSON body fields.

#### Sample request message

Here's a sample PowerShell function that uses a self-signed certificate uploaded to an Entra app registration to generate the access token and authorization header:

```PowerShell
function Test-UploadApi {
<#
.SYNOPSIS
    requires Powershell module MSAL.PS version 4.37 or higher
    https://www.powershellgallery.com/packages/MSAL.PS/
.EXAMPLE
    Test-Api -API UploadApi -WorkspaceName "workspacename" -ResourceGroupName "rgname" -AppId "00001111-aaaa-2222-bbbb-3333cccc4444" -TenantName "contoso.onmicrosoft.com" -FilePath "C:\Users\user\Documents\stixobjects.json"
#>
[CmdletBinding()]
param (
    [Parameter(Mandatory = $true)]
    [string]$TenantName,
    [Parameter(Mandatory = $true)]
    [string]$CertThumbprint,
    [Parameter(Mandatory = $true)]
    [string]$AppId,
    [Parameter(Mandatory = $true)]
    [string]$WorkspaceId,
    [Parameter(Mandatory = $true)]
    [string]$FilePath
)
$Scope = "https://management.azure.com/.default"
# Connection details for getting initial token with self-signed certificate from local store
$connectionDetails = @{
    'TenantId'          = $TenantName
    'ClientId'          = $AppId
    'ClientCertificate' = Get-Item -Path "Cert:\CurrentUser\My\$CertThumbprint"
    scope               = $Scope
}
# Request the token
#  Using Powershell module MSAL.PS https://www.powershellgallery.com/packages/MSAL.PS/
#  Get-MsalToken is automatically using OAuth 2.0 token endpoint https://login.microsoftonline.com/$TenantName/oauth2/v2.0/token
#  and sets auth flow to grant_type = 'client_credentials'
$token = Get-MsalToken @connectionDetails

# Create header
#  Again relying on MSAL.PS which has method CreateAuthorizationHeader() getting us the bearer token
$Header = @{
    'Authorization' = $token.CreateAuthorizationHeader()
}
$Uri = "https://api.ti.sentinel.azure.com/workspaces/$workspaceId/threat-intelligence-stix-objects:upload?api-version=$apiVersion"
$stixobjects = get-content -path $FilePath
if(-not $stixobjects) { Write-Host "No file found at $FilePath"; break }
$results = Invoke-RestMethod -Uri $Uri -Headers $Header -Body $stixobjects -Method POST -ContentType "application/json"

$results | ConvertTo-Json -Depth 4
}
```

#### Common properties

All the objects you import with the upload API share these common properties.

|Property Name    |Type |    Description |
|----|----|----|
|`id` (required)| string | An ID used to identify the STIX object. See section [2.9](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_64yvzeku5a5c) for specifications on how to create an `id`. The format looks something like `indicator--<UUID>`|
|`spec_version` (optional) | string | STIX object version. This value is required in the STIX specification, but since this API only supports STIX 2.0 and 2.1, when this field isn't set, the API defaults to `2.1`|
|`type` (required)|    string | The value of this property *must* be a supported STIX object.|
|`created` (required) | timestamp | See section [3.2](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_xzbicbtscatx) for specifications of this common property.|
|`created_by_ref` (optional) | string | The created_by_ref property specifies the ID property of the entity that created this object.<br><br>If this attribute is omitted, the source of this information is undefined. For object creators who wish to remain anonymous, keep this value undefined.|
|`modified` (required) | timestamp | See section [3.2](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_xzbicbtscatx) for specifications of this common property.|
|`revoked` (optional) | boolean | Revoked objects are no longer considered valid by the object creator. Revoking an object is permanent; future versions of the object with this `id` *must not* be created.<br><br>The default value of this property is false.|
|`labels` (optional) | list of strings | The `labels` property specifies a set of terms used to describe this object. The terms are user-defined or trust-group defined. These labels display as **Tags** in Microsoft Sentinel.|
|`confidence` (optional) | integer | The `confidence` property identifies the confidence that the creator has in the correctness of their data. The confidence value *must* be a number in the range of 0-100.<br><br>[Appendix A](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_1v6elyto0uqg) contains a table of normative mappings to other confidence scales that *must* be used when presenting the confidence value in one of those scales.<br><br>If the confidence property isn't present, then the confidence of the content is unspecified.|
|`lang` (optional) | string | The `lang` property identifies the language of the text content in this object. When present, it *must* be a language code conformant to [RFC5646](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#kix.yoz409d7eis1). If the property isn't present, then the language of the content is `en` (English).<br><br>This property *should* be present if the object type contains translatable text properties (for example, name, description).<br><br>The language of individual fields in this object *might* override the `lang` property in granular markings (see section [7.2.3](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_robezi5egfdr)).|
|`object_marking_refs` (optional, including TLP) | list of strings | The `object_marking_refs` property specifies a list of ID properties of marking-definition objects that apply to this object. For example, use the Traffic Light Protocol (TLP) marking definition ID to designate the sensitivity of the indicator source. For details of what marking-definition IDs to use for TLP content, see section [7.2.1.4](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_yd3ar14ekwrs)<br><br>In some cases, though uncommon, marking definitions themselves might be marked with sharing or handling guidance. In this case, this property *must not* contain any references to the same Marking Definition object (that is, it can't contain any circular references).<br><br>See section [7.2.2](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_bnienmcktc0n) for further definition of data markings.|
|`external_references` (optional) | list of object | The `external_references` property specifies a list of external references which refers to non-STIX information. This property is used to provide one or more URLs, descriptions, or IDs to records in other systems.|
|`granular_markings` (optional) | list of [granular-marking](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_robezi5egfdr) | The `granular_markings` property helps define parts of the indicator differently. For example, the indicator language is English, `en` but the description is German, `de`.<br><br>In some cases, though uncommon, marking definitions themselves might be marked with sharing or handling guidance. In this case, this property *must not* contain any references to the same Marking Definition object (that is, it can't contain any circular references).<br><br>See section [7.2.3](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_robezi5egfdr) for further definition of data markings.|

For more information, see [STIX common properties](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_xzbicbtscatx).

#### Indicator

|Property Name    |Type |    Description |
|----|----|----|
|`name` (optional)|    string | A name used to identify the indicator.<br><br>Producers *should* provide this property to help products and analysts understand what this indicator actually does.|
|`description` (optional) | string | A description that provides more details and context about the indicator, potentially including its purpose and its key characteristics.<br><br>Producers *should* provide this property to help products and analysts understand what this indicator actually does. |
|`indicator_types` (optional) | list of strings | A set of categorizations for this indicator.<br><br>The values for this property *should* come from the [indicator-type-ov](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_cvhfwe3t9vuo) |
|`pattern` (required) | string | The detection pattern for this indicator *might* be expressed as a [STIX Patterning](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_e8slinrhxcc9) or another appropriate language such as SNORT, YARA, etc. |
|`pattern_type` (required) | string | The pattern language used in this indicator.<br><br>The value for this property *should* come from [pattern types](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_9lfdvxnyofxw).<br><br>The value of this property *must* match the type of pattern data included in the pattern property.|
|`pattern_version` (optional) | string | The version of the pattern language used for the data in the pattern property, which *must* match the type of pattern data included in the pattern property.<br><br>For patterns that don't have a formal specification, the build or code version that the pattern is known to work with *should* be used.<br><br>For the STIX pattern language, the specification version of the object determines the default value.<br><br>For other languages, the default value *should* be the latest version of the patterning language at the time of this object's creation.|
|`valid_from` (required) | timestamp | The time from which this indicator is considered a valid indicator of the behaviors it's related to or represents.|
|`valid_until` (optional) | timestamp | The time at which this indicator should no longer be considered a valid indicator of the behaviors it's related to or represents.<br><br>If the valid_until property is omitted, then there's no constraint on the latest time for which the indicator is valid.<br><br>This timestamp *must* be greater than the valid_from timestamp.|
|`kill_chain_phases` (optional) | list of string | The kill chain phases to which this indicator corresponds.<br><br>The value for this property *should* come from the [Kill Chain Phase](https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_i4tjv75ce50h).|

For more information, see [STIX indicator](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_muftrcpnf89v).

#### Attack pattern

Follow the STIX specifications for creating an attack pattern STIX object. Use [this example](#sample-attack-pattern) as an extra reference.

For more information, see [STIX attack pattern](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_axjijf603msy).

#### Identity

Follow the STIX specifications for creating an identity STIX object. Use [this example](#sample-relationship-with-threat-actor-and-identity) as an extra reference.

For more information, see [STIX identity](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_wh296fiwpklp).

#### Threat actor

Follow the STIX specifications for creating a threat actor STIX object. Use [this example](#sample-relationship-with-threat-actor-and-identity) as an extra reference.

For more information, see [STIX threat actor](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_k017w16zutw).

#### Relationship

Follow the STIX specifications for creating a relationship STIX object. Use [this example](#sample-relationship-with-threat-actor-and-identity) as an extra reference.

For more information, see [STIX relationship](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_e2e1szrqfoan).

### Process the response message

The response header contains an HTTP status code. Reference this table for more information about how to interpret the API call result.

|Status code  |Description  |
|---------|---------|
|**200**     |   Success. The API returns 200 when one or more STIX objects are successfully validated and published. |
|**400**     |   Bad format. Something in the request isn't correctly formatted.    |
|**401**     |   Unauthorized. |
|**404**     |   File not found. Usually this error occurs when the workspace ID isn't found.   |
|**429**     |   The max number of requests in a minute has been exceeded.   |
|**500**     |   Server error. Usually an error in the API or Microsoft Sentinel services.

The response body is an array of error messages in JSON format:

|Field name | Data Type | Description |
|----|----|----|
|errors    | Array of error objects | List of validation errors |

**Error object**

|Field name | Data Type | Description |
|----|----|----|
|recordIndex | int | Index of the STIX objects in the request |
|errorMessages | Array of strings | Error messages |


## Throttling limits for the API

All limits are applied per user:
- 100 objects per request. 
- 100 requests per minute.

If there are more requests than the limit, a `429` http status code in the response header is returned with the following response body:
```json
{
    "statusCode": 429,
    "message": "Rate limit is exceeded. Try again in <number of seconds> seconds."
}
```
Approximately 10,000 objects per minute is the maximum throughput before a throttling error is received. 

### Sample indicator request body

The following example shows how to represent two indicators in the STIX specification. `Test Indicator 2` highlights the Traffic Light Protocol (TLP) set to white with the mapped object marking, and clarifying its description and labels are in English.

```json
{
    "sourcesystem": "test", 
    "stixobjects":[
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
If all STIX objects are validated successfully, an HTTP 200 status is returned with an empty response body. 

If validation fails for one or more objects, the response body is returned with more information. For example, if you send an array with four indicators, and the first three are good but the fourth doesn't have an `id` (a required field), then an HTTP status code 200 response is generated along with the following body:

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
The objects are sent as an array, so the `recordIndex` begins at `0`.

### Other samples

#### Sample indicator

In this example, the indicator is marked with the green TLP by using `marking-definition--089a6ecb-cc15-43cc-9494-767639779123` in the `object_marking_refs` common property. More extension attributes of `toxicity` and `rank` are also included. Although these properties aren't in the Microsoft Sentinel schema for indicators, ingesting an object with these properties doesn't trigger an error. The properties simply aren't referenced or indexed in the workspace.

> [!NOTE]
> This indicator has the `revoked` property set to `$true` and its `valid_until` date is in the past. This indicator as-is doesn't work in analytics rules and isn't returned in queries unless an appropriate time range is specified.

```json
{
    "sourcesystem": "TestStixObjects",
    "stixobjects": [
    {
          "type": "indicator",
          "spec_version": "2.1",
          "id": "indicator--12345678-71a2-445c-ab86-927291df48f8",
          "created": "2010-02-26T18:29:07.778Z",
          "modified": "2011-02-26T18:29:07.778Z",
          "created_by_ref": "identity--f431f809-377b-45e0-aa1c-6a4751cae5ff",
          "revoked": true,
          "labels": [
            "heartbleed",
            "has-logo"
          ],
          "confidence": 55,
          "lang": "en",
          "external_references": [
            {
              "source_name": "veris",
              "description": "Threat report",
              "external_id": "0001AA7F-C601-424A-B2B8-BE6C9F5164E7",
              "url": "https://abc.com//example.json",
              "hashes": {
                "SHA-256": "6db12788c37247f2316052e142f42f4b259d6561751e5f401a1ae2a6df9c674b"
              }
            }
          ],
          "object_marking_refs": [
            "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da"
          ],
          "granular_markings": [
            {
              "marking_ref": "marking-definition--089a6ecb-cc15-43cc-9494-767639779123",
              "selectors": [
                "description",
                "labels"
              ],
              "lang": "en"
            }
          ],
          "extensions": {
            "extension-definition--d83fce45-ef58-4c6c-a3f4-1fbc32e98c6e": {
              "extension_type": "property-extension",
              "rank": 5,
              "toxicity": 8
            }
          },
          "name": "Indicator 2.1 Test",
          "description": "TS ID: 35766958; iType: bot_ip; State: active; Org: 52.3667; Source: Emerging Threats - Compromised",
          "indicator_types": [
            "threatstream-severity-low",
            "threatstream-confidence-80"
          ],
          "pattern": "[ipv4-addr:value = '94.102.52.185']",
          "pattern_type": "stix",
          "pattern_version": "2.1",
          "valid_from": "2015-02-26T18:29:07.778Z",
          "valid_until": "2016-02-26T18:29:07.778Z",
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

#### Sample attack pattern

This attack pattern and any other non-indicator STIX objects are only viewable in the management interface unless you opt in to the new STIX tables. For more information about the tables required to view objects like this in KQL, see [View your threat intelligence](understand-threat-intelligence.md#view-your-threat-intelligence).

```json
{
    "sourcesystem": "TestStixObjects",
    "stixobjects": [
        {
          "type": "attack-pattern",
          "spec_version": "2.1",
          "id": "attack-pattern--fb6aa549-c94a-4e45-b4fd-7e32602dad85",
          "created": "2015-05-15T09:12:16.432Z",
          "modified": "2015-05-20T09:12:16.432Z",
          "created_by_ref": "identity--f431f809-377b-45e0-aa1c-6a4751cae5ff",
          "revoked": false,
          "labels": [
            "heartbleed",
            "has-logo"
          ],
          "confidence": 55,
          "lang": "en",
          "object_marking_refs": [
            "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da"
          ],
          "granular_markings": [
            {
              "marking_ref": "marking-definition--089a6ecb-cc15-43cc-9494-767639779123",
              "selectors": [
                "description",
                "labels"
              ],
              "lang": "en"
            }
          ],
          "extensions": {
            "extension-definition--d83fce45-ef58-4c6c-a3f4-1fbc32e98c6e": {
              "extension_type": "property-extension",
              "rank": 5,
              "toxicity": 8
            }
          },
          "external_references": [
            {
              "source_name": "capec",
              "description": "spear phishing",
              "external_id": "CAPEC-163"
            }
          ],
          "name": "Attack Pattern 2.1",
          "description": "menuPass appears to favor spear phishing to deliver payloads to the intended targets. While the attackers behind menuPass have used other RATs in their campaign, it appears that they use PIVY as their primary persistence mechanism.",
          "kill_chain_phases": [
            {
              "kill_chain_name": "mandiant-attack-lifecycle-model",
              "phase_name": "initial-compromise"
            }
          ],
          "aliases": [
            "alias_1",
            "alias_2"
          ]
        }
    ]
}
```

#### Sample relationship with threat actor and identity

```json
{
    "sourcesystem": "TestStixObjects",
    "stixobjects": [
    {
          "type": "identity",
          "spec_version": "2.1",
          "id": "identity--733c5838-34d9-4fbf-949c-62aba761184c",
          "created": "2016-08-23T18:05:49.307Z",
          "modified": "2016-08-23T18:05:49.307Z",
          "name": "Identity 2.1",
          "description": "Disco Team is the name of an organized threat actor crime-syndicate.",
          "identity_class": "organization",
          "contact_information": "disco-team@stealthemail.com",
          "roles": [
            "administrators"
          ],
          "sectors": [
            "education"
          ],
          "created_by_ref": "identity--f431f809-377b-45e0-aa1c-6a4751cae5ff",
          "revoked": true,
          "labels": [
            "heartbleed",
            "has-logo"
          ],
          "confidence": 55,
          "lang": "en",
          "external_references": [
            {
              "source_name": "veris",
              "description": "Threat report",
              "external_id": "0001AA7F-C601-424A-B2B8-BE6C9F5164E7",
              "url": "https://abc.com//example.json",
              "hashes": {
                "SHA-256": "6db12788c37247f2316052e142f42f4b259d6561751e5f401a1ae2a6df9c674b"
              }
            }
          ],
          "object_marking_refs": [
            "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da"
          ],
          "granular_markings": [
            {
              "marking_ref": "marking-definition--089a6ecb-cc15-43cc-9494-767639779123",
              "selectors": [
                "description",
                "labels"
              ],
              "lang": "en"
            }
          ]
        },
        {
          "type": "threat-actor",
          "spec_version": "2.1",
          "id": "threat-actor--dfaa8d77-07e2-4e28-b2c8-92e9f7b04428",
          "created": "2014-11-19T23:39:03.893Z",
          "modified": "2014-11-19T23:39:03.893Z",
          "created_by_ref": "identity--f431f809-377b-45e0-aa1c-6a4751cae5ff",
          "revoked": true,
          "labels": [
            "heartbleed",
            "has-logo"
          ],
          "confidence": 55,
          "lang": "en",
          "external_references": [
            {
              "source_name": "veris",
              "description": "Threat report",
              "external_id": "0001AA7F-C601-424A-B2B8-BE6C9F5164E7",
              "url": "https://abc.com//example.json",
              "hashes": {
                "SHA-256": "6db12788c37247f2316052e142f42f4b259d6561751e5f401a1ae2a6df9c674b"
              }
            }
          ],
          "object_marking_refs": [
            "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da"
          ],
          "granular_markings": [
            {
              "marking_ref": "marking-definition--089a6ecb-cc15-43cc-9494-767639779123",
              "selectors": [
                "description",
                "labels"
              ],
              "lang": "en"
            }
          ],
          "name": "Threat Actor 2.1",
          "description": "This organized threat actor group operates to create profit from all types of crime.",
          "threat_actor_types": [
            "crime-syndicate"
          ],
          "aliases": [
            "Equipo del Discoteca"
          ],
          "first_seen": "2014-01-19T23:39:03.893Z",
          "last_seen": "2014-11-19T23:39:03.893Z",
          "roles": [
            "agent"
          ],
          "goals": [
            "Steal Credit Card Information"
          ],
          "sophistication": "expert",
          "resource_level": "organization",
          "primary_motivation": "personal-gain",
          "secondary_motivations": [
            "dominance"
          ],
          "personal_motivations": [
            "revenge"
          ]
        },
        {
          "type": "relationship",
          "spec_version": "2.1",
          "id": "relationship--a2e3efb5-351d-4d46-97a0-6897ee7c77a0",
          "created": "2020-02-29T18:01:28.577Z",
          "modified": "2020-02-29T18:01:28.577Z",
          "relationship_type": "attributed-to",
          "description": "Description Relationship 2.1",
          "source_ref": "threat-actor--dfaa8d77-07e2-4e28-b2c8-92e9f7b04428",
          "target_ref": "identity--733c5838-34d9-4fbf-949c-62aba761184c",
          "start_time": "2020-02-29T18:01:28.577Z",
          "stop_time": "2020-03-01T18:01:28.577Z",
          "created_by_ref": "identity--f431f809-377b-45e0-aa1c-6a4751cae5ff",
          "revoked": true,
          "labels": [
            "heartbleed",
            "has-logo"
          ],
          "confidence": 55,
          "lang": "en",
          "external_references": [
            {
              "source_name": "veris",
              "description": "Threat report",
              "external_id": "0001AA7F-C601-424A-B2B8-BE6C9F5164E7",
              "url": "https://abc.com//example.json",
              "hashes": {
                "SHA-256": "6db12788c37247f2316052e142f42f4b259d6561751e5f401a1ae2a6df9c674b"
              }
            }
          ],
          "object_marking_refs": [
            "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da"
          ],
          "granular_markings": [
            {
              "marking_ref": "marking-definition--089a6ecb-cc15-43cc-9494-767639779123",
              "selectors": [
                "description",
                "labels"
              ],
              "lang": "en"
            }
          ]
        }
    ]
}
```

## Next steps

To learn more about how to work with threat intelligence in Microsoft Sentinel, see the following articles:

- [Understand threat intelligence](understand-threat-intelligence.md)
- [Work with threat indicators](work-with-threat-indicators.md)
- [Use matching analytics to detect threats](use-matching-analytics-to-detect-threats.md)
- Utilize the intelligence feed from Microsoft and [enable the MDTI data connector](connect-mdti-data-connector.md)
