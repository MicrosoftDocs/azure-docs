---
title: Specify the Request Service REST API verify request (preview)
titleSuffix: Azure Active Directory Verifiable Credentials
description: Learn how to start a presentation request in Verifiable Credentials
documentationCenter: ''
author: barclayn
manager: karenhoran
ms.service: active-directory
ms.topic: reference
ms.subservice: verifiable-credentials
ms.date: 05/26/2022
ms.author: barclayn

#Customer intent: As an administrator, I am trying to learn the process of revoking verifiable credentials that I have issued.
---

# Request Service REST API presentation specification (preview)

Azure Active Directory (Azure AD) Verifiable Credentials includes the Request Service REST API. This API allows you to issue and verify a credential. This article specifies the Request Service REST API for a presentation request. The presentation request asks the user to present a verifiable credential, and then verify the credential.

## HTTP request

The Request Service REST API presentation request supports the following HTTP method:

| Method |Notes  |
|---------|---------|
|POST | With JSON payload as specified in this article. |

The Request Service REST API presentation request requires the following HTTP headers:

| Method |Value  |
|---------|---------|
|`Authorization`| Attach the access token as a bearer token to the authorization header in an HTTP request. For example, `Authorization: Bearer <token>`.|
|`Content-Type`| `Application/json`|

Construct an HTTP POST request to the Request Service REST API. Replace the `{tenantID}` with your tenant ID or tenant name.

```http
https://beta.did.msidentity.com/v1.0/{tenantID}/verifiablecredentials/request
```

The following HTTP request demonstrates a presentation request to the Request Service REST API:

```http
POST https://beta.did.msidentity.com/v1.0/contoso.onmicrosoft.com/verifiablecredentials/request
Content-Type: application/json
Authorization: Bearer  <token>

{  
    "includeQRCode": true,  
    "callback": {  
    "url": "https://www.contoso.com/api/verifier/presentationCallbac",  
    "state": "11111111-2222-2222-2222-333333333333",  
      "headers": {  
        "api-key": "an-api-key-can-go-here"  
      }  
    },  
    ...
} 
```  

The following permission is required to call the Request Service REST API. For more information, see [Grant permissions to get access tokens](verifiable-credentials-configure-tenant.md#grant-permissions-to-get-access-tokens).

| Permission type | Permission  |
|---------|---------|
| Application | bbb94529-53a3-4be5-a069-7eaf2712b826/.default|

## Presentation request payload

The presentation request payload contains information about your verifiable credentials presentation request. The following example demonstrates a presentation request from a specific issuer. The result of this request returns a QR code with a link to start the presentation process.

```json
{
  "includeQRCode": true,
  "callback": {
    "url": "https://www.contoso.com/api/verifier/presentationCallback",
    "state": "92d076dd-450a-4247-aa5b-d2e75a1a5d58",
    "headers": {
      "api-key": "OPTIONAL API-KEY for VERIFIER CALLBACK API"
    }
  },
  "authority": "did:ion:EiCLL8lzCqlGLYTGbjwgR6SN6OkIjO6uUKyF5zM7fQZ8Jg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfOTAyZmM2NmUiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiTEdUOWk3aFYzN1dUcFhHcUg5c1VDekxTVlFWcVl3S2JNY1Fsc0RILUZJUSIsInkiOiJiRWo5MDY...",
  "registration": {
    "clientName": "Veritable Credential Expert Verifier"
  },
  "presentation": {
    "includeReceipt": true,
    "requestedCredentials": [
      {
        "type": "VerifiedCredentialExpert",
        "purpose": "So we can see that you a veritable credentials expert",
        "acceptedIssuers": [
          "did:ion:EiCLL8lzCqlGLYTGbjwgR6SN6OkIjO6uUKyF5zM7fQZ8Jg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfOTAyZmM2NmUiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiTEdUOWk3aFYzN1dUcFhHcUg5c1VDekxTVlFWcVl3S2JNY1Fsc0RILUZJUSIsInkiO..."
        ]
      }
    ]
  }
}
```

The payload contains the following properties.  

|Parameter |Type  | Description |
|---------|---------|---------|
| `includeQRCode` |  Boolean |   Determines whether a QR code is included in the response of this request. Present the QR code and ask the user to scan it. Scanning the QR code launches the authenticator app with this presentation request. Possible values are `true` (default) or `false`. When you set the value to `false`, use the return `url` property to render a deep link.  |
| `authority` | string|  Your decentralized identifier (DID) of your verifier Azure AD tenant. For more information, see [Gather tenant details to set up your sample application](verifiable-credentials-configure-verifier.md#gather-tenant-details-to-set-up-your-sample-application).|
| `registration` | [RequestRegistration](#requestregistration-type)|  Provides information about the verifier. |
| `presentation` | [RequestPresentation](#requestpresentation-type)| Provides information about the verifiable credentials presentation request.  |
|`callback`|  [Callback](#callback-type)| Mandatory. Allows the developer to update the UI during the verifiable credential presentation process. When the user completes the process, continue the process after the results are returned to the application.|

### RequestRegistration type

The `RequestRegistration` type provides information registration for the issuer. The `RequestRegistration` type contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `clientName` | string|  A display name of the issuer of the verifiable credential. This name will be presented to the user in the authenticator app. |

The following screenshot shows the `clientName` property and the display name of the `authority` (the verifier) in the presentation request.

![Screenshot that shows how to approve the presentation request.](media/presentation-request-api/approve-presentation-request.jpg)

### RequestPresentation type

The `RequestPresentation` type provides information required for verifiable credential presentation. `RequestPresentation` contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `includeReceipt` |  Boolean | Determines whether a receipt should be included in the response of this request. Possible values are `true` or `false` (default). The receipt contains the original payload sent from the authenticator to the Verifiable Credentials service. The receipt is useful for troubleshooting, and shouldn't be set by default. In the `OpenId Connect SIOP` request, the receipt contains the ID token from the original request. |
| `requestedCredentials` | collection| A collection of [RequestCredential](#requestcredential-type) objects.|

### RequestCredential type

The `RequestCredential` provides information about the requested credentials the user needs to provide. `RequestCredential` contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `type`| string| The verifiable credential type. The `type` must match the type as defined in the `issuer` verifiable credential manifest (for example, `VerifiedCredentialExpert`). To get the issuer manifest, see [Gather credentials and environment details to set up your sample application](verifiable-credentials-configure-issuer.md). Copy the **Issue credential URL**, open it in a web browser, and check the **id** property. |
| `purpose`| string | Provide information about the purpose of requesting this verifiable credential. |
| `acceptedIssuers`| string collection | A collection of issuers' DIDs that could issue the type of verifiable credential that subjects can present. To get your issuer DID, see [Gather credentials and environment details to set up your sample application](verifiable-credentials-configure-issuer.md), and copy the value of the **Decentralized identifier (DID)**. |

### Callback type

The Request Service REST API generates several events to the callback endpoint. Those events allow you to update the UI and continue the process after the results are returned to the application. The `Callback` type contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `url` | string| URI to the callback endpoint of your application. The URI must point to a reacheable endpoint on the internet otherwise the service will throw a callback URL unreadable error. Accepted inputs IPv4, IPv6 or DNS resolvable hostname. |
| `state` | string| Associates with the state passed in the original payload. |
| `headers` | string| Optional. You can include a collection of HTTP headers required by the receiving end of the POST message. The current supported header values are the `api-key` or the `Authorization` headers. Any other header will throw an invalid callback header error.|

## Successful response

If successful, this method returns a response code (*HTTP 201 Created*), and a collection of event objects in the response body. The following JSON demonstrates a successful response:

```json
{  
    "requestId": "e4ef27ca-eb8c-4b63-823b-3b95140eac11",
    "url": "openid://vc/?request_uri=https://beta.did.msidentity.com/v1.0/87654321-0000-0000-0000-000000000000/verifiablecredentials/request/e4ef27ca-eb8c-4b63-823b-3b95140eac11",
    "expiry": 1633017751,
    "qrCode": "data:image/png;base64,iVBORw0KGgoA<SNIP>"
} 
```

The response contains the following properties:

|Property |Type |Description |
|---------|---------|---------|
| `requestId`| string | An autogenerated correlation ID. The [callback](#callback-events) uses the same request, allowing you to keep track of the presentation request and its callbacks. |
| `url`|  string| A URL that launches the authenticator app and starts the presentation process. You can present this URL to the user if they can't scan the QR code. |
| `expiry`| integer| Indicates when the response will expire. |
| `qrCode`| string | A QR code that the user can scan to start the presentation flow. |

When your app receives the response, the app needs to present the QR code to the user. The user scans the QR code, which opens the authenticator app and starts the presentation process.

## Error response

Error responses also can be returned so that the app can handle them appropriately. The following JSON shows an unauthorized error message:


```json
{
    "requestId": "fb888ac646c96083de83b099b2678de0",
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
| `requestId`| string | An autogenerated request ID.|
| `date`| date | The time of the error. |
| `error.code` | string | The return error code. |
| `error.message`| string | The error message. |

## Callback events

The callback endpoint is called when a user scans the QR code, uses the deep link the authenticator app, or finishes the presentation process. 

|Property |Type |Description |
|---------|---------|---------|
| `requestId`| string | Mapped to the original request when the payload was posted to the Verifiable Credentials service.|
| `code` |string |The code returned when the request was retrieved by the authenticator app. Possible values: <ul><li>`request_retrieved`: The user scanned the QR code or selected the link that starts the presentation flow.</li><li>`presentation_verified`: The verifiable credential validation completed successfully.</li></ul>    |
| `state` |string| Returns the state value that you passed in the original payload.   |
| `subject`|string | The verifiable credential user DID.|
| `issuers`| array |Returns an array of verifiable credentials requested. For each verifiable credential, it provides: </li><li>The verifiable credential type.</li><li>The issuer's DID</li><li>The claims retrieved.</li><li>The verifiable credential issuer’s domain. </li><li>The verifiable credential issuer’s domain validation status. </li></ul> |
| `receipt`| string | Optional. The receipt contains the original payload sent from the wallet to the Verifiable Credentials service. The receipt should be used for troubleshooting/debugging only. The format in the receipt is not fix and can change based on the wallet and version used.|

The following example demonstrates a callback payload when the authenticator app starts the presentation request:

```json
{  
    "requestId":"aef2133ba45886ce2c38974339ba1057",  
    "code":"request_retrieved",  
    "state":"Wy0ThUz1gSasAjS1"
} 
```

The following example demonstrates a callback payload after the verifiable credential presentation has successfully completed:

```json
{
  "requestId": "87e1cb24-9096-409f-81cb-9e645f23a4ba",
  "code": "presentation_verified",
  "state": "f3d94e35-ca5f-4b1b-a7d7-a88caa05e322",
  "subject": "did:ion:EiAlrenrtD3Lsw0GlbzS1O2YFdy3Xtu8yo35W<SNIP>…",
  "issuers": [
    {
      "type": [
        "VerifiableCredential",
        "VerifiedCredentialExpert"
      ],
      "claims": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "domain": "https://contoso.com/",
      "verified": "DNS",
      "issuer": "did:ion:….."
    }
  ],
  "receipt": {
    "id_token": "eyJraWQiOiJkaWQ6aW<SNIP>"
  }
} 
```

## Next steps

Learn [how to call the Request Service REST API](get-started-request-api.md).
