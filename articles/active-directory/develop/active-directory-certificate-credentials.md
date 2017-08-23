---
title: Certificate credentials in Azure AD | Microsoft Docs
description: This article discusses the registration and use of certificate credentials for application authentication
services: active-directory
documentationcenter: .net
author: navyasric
manager: mbaldwin
editor: ''

ms.assetid: 88f0c64a-25f7-4974-aca2-2acadc9acbd8
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/02/2017
ms.author: nacanuma
ms.custom: aaddev

---

# Certificate credentials for application authentication

Azure Active Directory allows an application to use its own credentials for authentication, for example, in the OAuth 2.0 Client Credentials Grant flow and the On-Behalf-Of flow.
One form of credential that can be used is a JSON Web Token(JWT) assertion signed with a certificate that the application owns.

## Format of the assertion
To compute the assertion, you probably want to use one of the many [JSON Web Token](https://jwt.io/) libraries in the language of your choice. The information carried by the token is:

#### Header

| Parameter |  Remark |
| --- | --- | --- |
| `alg` | Should be **RS256** |
| `typ` | Should be **JWT** |
| `x5t` | Should be the X.509 Certificate SHA-1 thumbprint |

#### Claims (Payload)

| Parameter |  Remark |
| --- | --- | --- |
| `aud` | Audience: Should be **https://login.microsoftonline.com/*tenant_Id*/oauth2/token** |
| `exp` | Expiration date: the date when the token expires. The time is represented as the number of seconds from January 1, 1970 (1970-01-01T0:0:0Z) UTC until the time the token validity expires.|
| `iss` | Issuer: should be the client_id (Application Id of the client service) |
| `jti` | GUID: the JWT ID |
| `nbf` | Not Before: the date before which the token cannot be used. The time is represented as the number of seconds from January 1, 1970 (1970-01-01T0:0:0Z) UTC until the time the token was issued. |
| `sub` | Subject: As for `iss`, should be the client_id (Application Id of the client service) |

#### Signature
The signature is computed applying the certificate as described in the [JSON Web Token RFC7519 specification](https://tools.ietf.org/html/rfc7519)

### Example of a decoded JWT assertion
```
{
  "alg": "RS256",
  "typ": "JWT",
  "x5t": "gx8tGysyjcRqKjFPnd7RFwvwZI0"
}
.
{
  "aud": "https: //login.microsoftonline.com/contoso.onmicrosoft.com/oauth2/token",
  "exp": 1484593341,
  "iss": "97e0a5b7-d745-40b6-94fe-5f77d35c6e05",
  "jti": "22b3bb26-e046-42df-9c96-65dbd72c1c81",
  "nbf": 1484592741,  
  "sub": "97e0a5b7-d745-40b6-94fe-5f77d35c6e05"
}
.
"Gh95kHCOEGq5E_ArMBbDXhwKR577scxYaoJ1P{a lot of characters here}KKJDEg"

```

### Example of an encoded JWT assertion
The following string is an example of encoded assertion. If you look carefully, you notice three sections separated by dots (.).
The first section encodes the header, the second the payload, and the last is the signature computed with the certificates from the content of the first two sections.
```
"eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJhdWQiOiJodHRwczpcL1wvbG9naW4ubWljcm9zb2Z0b25saW5lLmNvbVwvam1wcmlldXJob3RtYWlsLm9ubWljcm9zb2Z0LmNvbVwvb2F1dGgyXC90b2tlbiIsImV4cCI6MTQ4NDU5MzM0MSwiaXNzIjoiOTdlMGE1YjctZDc0NS00MGI2LTk0ZmUtNWY3N2QzNWM2ZTA1IiwianRpIjoiMjJiM2JiMjYtZTA0Ni00MmRmLTljOTYtNjVkYmQ3MmMxYzgxIiwibmJmIjoxNDg0NTkyNzQxLCJzdWIiOiI5N2UwYTViNy1kNzQ1LTQwYjYtOTRmZS01Zjc3ZDM1YzZlMDUifQ.
Gh95kHCOEGq5E_ArMBbDXhwKR577scxYaoJ1P{a lot of characters here}KKJDEg"
```

### Register your certificate with Azure AD
To associate the certificate credential with the client application in Azure AD, you need to edit the application manifest.
Having hold of a certificate, you need to compute:
- `$base64Thumbprint`, which is the base64 encoding of the certificate Hash
- `$base64Value`, which is the base64 encoding of the certificate raw data

you also need to provide a GUID to identify the key in the application manifest (`$keyId`)

In the Azure app registration for the client application, open the application manifest, and replace the *keyCredentials* property with your new certificate information using the following schema:
```
"keyCredentials": [
    {
        "customKeyIdentifier": "$base64Thumbprint",
        "keyId": "$keyid",
        "type": "AsymmetricX509Cert",
        "usage": "Verify",
        "value":  "$base64Value"
    }
]
```

Save the edits to the application manifest, and upload to Azure AD. The keyCredentials property is multi-valued, so you may upload multiple certificates for richer key management.
