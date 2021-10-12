---
title: Specify the Request Service REST API issuance request
titleSuffix: Azure Active Directory Verifiable Credentials
description: Learn how to issue a Verifiable Credential that you've issued
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: active-directory
ms.topic: reference
ms.subservice: verifiable-credentials
ms.date: 10/08/2021
ms.author: barclayn

#Customer intent: As an administrator, I am trying to learn the process of revoking verifiable credentials that I have issued
---

# Request Service REST API issuance specification (Preview)

Azure Active Directory (Azure AD) verifiable credentials Request Service REST API allows you to issue and verify a veritable credential. This article specifies the Request Service REST API for issuance request.


## HTTP request

The Request Service REST API issuance request supports the following HTTP method:

| Method |Notes  |
|---------|---------|
|POST | With JSON payload as specify in this article. |

The Request Service REST API issuance request requires the following HTTP headers:

| Method |Value  |
|---------|---------|
|`Authorization`| Attach the access token as a Bearer token to the Authorization header in an HTTP request. For example, `Authorization: Bearer <token>`.|
|`Content-Type`| `Application/json`|

Construct an HTTP POST request to the Request Service REST API. Replace the `{tenantID}` with your [tenant ID](verifiable-credentials-configure-issuer.md#gather-credentials-and-environment-details-to-set-up-your-sample-application), or tenant name.

```http
https://beta.did.msidentity.com/v1.0/{tenantID}/verifiablecredentials/request
```

The following HTTP request demonstrates an HTTP request to the Request Service REST API:

```http
POST https://beta.did.msidentity.com/v1.0/contoso.onmicrosoft.com/verifiablecredentials/request
Content-Type: application/json
Authorization: Bearer  <token>

{
    "includeQRCode": true, 
        "callback": {  
            "url": "https://wwww.contoso.com/vc/callback",  
            "state": "Aaaabbbb11112222", 
            "headers": { 
                "api-key": "an-api-key-can-go-here" 
              }  
        }, 
    ... 
}
```  

The following permission is required to call the Request Service REST API. For more information, see [Grant permissions to get access tokens](verifiable-credentials-configure-tenant.md#31-grant-permissions-to-get-access-tokens).

| Permission type | Permission  |
|---------|---------|
| Application | bbb94529-53a3-4be5-a069-7eaf2712b826/.default|

## Issuance request payload

The issuance request payload contains information about your verifiable credentials issuance request. The following example demonstrates an issuance request using PIN code flow with user claims, such as first name and last name. The result of this request returns a QR code with a link to start the issuance process.

```json
{
    "includeQRCode": true,
    "callback": {
        "url": "https://www.contoso.com/api/issuer/issuanceCallback",
        "state": "de19cb6b-36c1-45fe-9409-909a51292a9c",
        "headers": {
            "api-key": "OPTIONAL API-KEY for VERIFIER CALLBACK API"
        }
    },
    "authority": "did:ion:EiCLL8lzCqlGLYTGbjwgR6SN6OkIjO6uUKyF5zM7fQZ8Jg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfOTAyZmM2NmUiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiTEdUOWk3aFYzN1dUcFhHcUg5c1VDek...",
    "registration": {
        "clientName": "Verifiable Credential Expert Sample"
    },
    "issuance": {
        "type": "VerifiedCredentialExpert",
        "manifest": "https://beta.did.msidentity.com/v1.0/12345678-0000-0000-0000-000000000000/verifiableCredential/contracts/VerifiedCredentialExpert",
        "pin": {
            "value": "3539",
            "length": 4
        },
        "claims": {
            "given_name": "Megan",
            "family_name": "Bowen"
        }
    }
}
```

The payload contains the following properties.  


|Parameter |Type  | Description |
|---------|---------|---------|
| `includeQRCode` |  boolean |   Determines whether a QR code is included in the response of this request. Present the QR code and ask the user to scan it. Scanning the QR code launches the authenticator app with this issuance request. Possible values `true` (default), or `false`. When set to `false`, use the return `url` property to render the deep link.  |
| `authority` | string|  The issuer's Decentralized Identifier. For more information, see [Gather credentials and environment details to set up your sample application](verifiable-credentials-configure-issuer.md#gather-credentials-and-environment-details-to-set-up-your-sample-application).|
| `registration` | [RequestRegistration](#requestregistration-type)|  Provides information about the issuer that can be displayed in the authenticator app. |
| `issuance` | [RequestIssuance](#requestissuance-type)| Provides information about issuance request.  |
|`callback`|  [Callback](#callback-type)| Allows the developer to asynchronously get information on the flow during the verifiable credential issuance process. For example, a call when the user has scanned the QR code.|

### RequestRegistration type

The RequestRegistration type provides information registration for the issuer. The RequestRegistration type contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `clientName` | string|  A display name of the issuer of the verifiable credential.  |
| `logoUrl` |  string |  [Optional] The URL for the issuer logo.  |
| `termsOfServiceUrl` |  string | [Optional] The URL for the terms of use of the verifiable credential that you are issuing.  |

> [!NOTE]
> At this time, the RequestRegistration information is not presented during the issuance in the Microsoft Authenticator app however, it can be used in the payload.

### RequestIssuance type

The RequestIssuance provides information that is required for verifiable credential issuance. There are currently three input types that you can send in the RequestIssuance. These types are used by the verifiable credential issuing service to insert claims into a verifiable credential and attest to that information with the issuer's DID. The following are the three types:

- ID Token
- Verifiable credentials via a verifiable presentation.
- Self-Attested Claims

You can find detailed information about the input types in the [Customizing your Verifiable Credential](credential-design.md) article. 

The RequestIssuance contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| type |  string |  The verifiable credential type. Should match the type as defined in the verifiable credential manifest. For example: `VerifiedCredentialExpert`. For more information, see [Create the verifiable credential expert card in Azure](verifiable-credentials-configure-issuer.md#gather-credentials-and-environment-details-to-set-up-your-sample-application). |
| manifest | string| URL of the verifiable credential manifest document. For more information, see [Gather credentials and environment details to set up your sample application](verifiable-credentials-configure-issuer.md#gather-credentials-and-environment-details-to-set-up-your-sample-application).|
| claims | string| [Optional] Include a collection of assertions made about the subject in the verifiable credential. For PIN code flow, it's important you provide the user's first name and last name. For more information, see [Verifiable Credential names](verifiable-credentials-configure-issuer.md#verifiable-credential-names). |
| pin | [PIN](#pin-type)| [Optional] A pin number to provide extra security during issuance. For PIN code flow this property is required. You generate a PIN code, and present it to the user in your app. The user will have to provide the PIN code you generated. |

### PIN type

The PIN type defines a PIN code that can be displayed as part of the issuance  PIN is optional and if used should always be sent out of band. When using an HASH PIN code, you must define the salt, alg, and iterations properties. The PIN contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `value` | string| Contains the PIN value in plain text. When using a Hashed PIN the value property contains the salted hash, base64 encoded.|
| `type` | string|  Type of pin code. Possible value: `numeric` (default). |
| `length` | integer|  The length of the PIN code.  Default length 6. Min length: 4 Max length: 16.|
| `salt` | string|  The salt of the Hashed PIN code. The salt is prepended during hash computation. Encoding: UTF-8. |
| `alg` | string|  The hashing algorithm for the Hashed PIN. Supported algorithm: `sha256`. |
| `iterations` | integer| The number of hashing iterations. Possible values: `1`.|


### Callback type

The Request Service REST API generates several events to the callback endpoint. Those events allow you to update the UI and continue the process once the results are returned to the application. The Callback type contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `url` | string| URI to the callback endpoint of your application. |
| `state` | string| Associates with the state passed in the original payload. |
| `headers` | string| [Optional] You can include a collection of HTTP headers required by the receiving end of the POST message. The headers should only include the api-key or any header required for authorization.|

## Successful response

If successful, this method returns an HTTP 201 Created response code and a collection of event objects in the response body. The following JSON demonstrates a successful response:

```json
{  
    "requestId": :"799f23ea-5241-45af-99ad-cf8e5018814e",  
    "url": "openid://vc?request_uri=https://beta.did.msidentity.com/v1.0/12345678-0000-0000-0000-000000000000/verifiablecredentials/request/178319f7-20be-4945-80fb-7d52d47ae82e",  
    "expiry": 1622227690,  
    "qrCode": "data:image/png;base64,iVBORw0KggoA<SNIP>"  
} 
```

The response contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `requestId`| string | Autogenerated correlation ID. The [callback](#callback-events) uses the same request. Allowing you to keep track of the issuance request and its callbacks. |
| `url`|  string| A URL that launches the authenticator app and starts the issuance process. You can present this URL to the user if they can't scan the QR code. |
| `expiry`| integer| Indicates when the response will be expired. |
| `qrCode`| string | A QR code that user can scan to start the issuance flow. |

When your app receives the response, the app needs to present the QR code to the user. The user scans the QR code, which opens the authenticator app starting the issuance process.

## Error response

Error responses also can be returned so that the app can handle them appropriately. The following JSON shows an unauthorized error message.


```json
{
    "requestId": "d60b068e7fbd975896e179b99347866a",
    "date": "Wed, 29 Sep 2021 21:49:00 GMT",
    "error": {
        "code": "unauthorized",
        "message": "Failed to authenticate the request."
    }
}
```

The response contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `requestId`| string | Autogenerated request ID.|
| `date`| date| The time of the error. |
| `error.code` | string| The return error code. |
| `error.message`| string| The error message. |

## Callback events

The callback endpoint is called when a user scans the QR code, uses the deep link their authenticator app, or finishes the issuance process. 


|Property |Type |Description |
|---------|---------|---------|
| `requestId`| string | Mapped to the original request when the payload was posted to the Verifiable Credentials Service.|
| `code` |string |The code returned when the request was retrieved by the authenticator app. Possible values: <ul><li>`request_retrieved` the user scanned the QR code or click on the link that starts the issuance flow.</li><li>`issuance_successful` the issuance of the verifiable credentials was successful.</li><li>`Issuance_error` there was an error during issuance. For details check the see the `error` property.</li></ul>    |
| `state` |string| The state returns the state value that you passed in the original payload.   |
| `error`| error | When the `code` is `Issuance_error`, this property contains information about the error.| 
| `error.code` | string| The return error code. |
| `error.message`| string| The error message. |

The following example demonstrates a callback payload when the issuance request is started by the authenticator app.

```json
{  
    "requestId":"aef2133ba45886ce2c38974339ba1057",  
    "code":"request_retrieved",  
    "state":"Wy0ThUz1gSasAjS1"
} 
```

The following example demonstrates a callback payload after the issuance process is completed successfully by the user.

```json
{  
    "requestId":"87e1cb24-9096-409f-81cb-9e645f23a4ba",
    "code":"issuance_successful",
    "state":"f3d94e35-ca5f-4b1b-a7d7-a88caa05e322",
} 
```

### Callback errors  

The callback endpoint may be called with error message.

The following table lists the error codes. These errors-specific details generically buckets most of the errors that could occur during issuance.

|Message  |Definition    |
|---------|---------|
| `fetch_contract_error*`| Unable to fetch the verifiable credential contract. This error usually happens when the API can't fetch the manifest you specify in the request payload [RequestIssuance object](#requestissuance-type)|
| `issuance_service_error*` | The Verifiable Credential Service was not able to validate requirements, or something went wrong on the Verifiable Credential Service side.|
| `unspecified_error`| Something went wrong that doesn’t fall into this bucket. Should not be common to get this error, but always worth investigating. |

The following example demonstrates a callback payload when an error occurred.

```json
{  
    "requestId":"87e1cb24-9096-409f-81cb-9e645f23a4ba",  
    "code": "issuance_error",  
    "state":"f3d94e35-ca5f-4b1b-a7d7-a88caa05e322",  
    "error": { 
      "code":"IssuanceFlowFailed", 
      "message":"issuance_service_error”, 
    } 
} 
``` 

## Next steps

Learn [how to call the Request Service REST API](get-started-request-api.md)
