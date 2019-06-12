---
title: Certificate credentials in Azure AD | Microsoft Docs
description: This article discusses the registration and use of certificate credentials for application authentication
services: active-directory
documentationcenter: .net
author: rwike77
manager: CelesteDG
editor: ''

ms.assetid: 88f0c64a-25f7-4974-aca2-2acadc9acbd8
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/21/2019
ms.author: ryanwi
ms.reviewer: nacanuma, jmprieur
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Certificate credentials for application authentication

Azure Active Directory (Azure AD) allows an application to use its own credentials for authentication, for example, in the OAuth 2.0 Client Credentials Grant flow ([v1.0](v1-oauth2-client-creds-grant-flow.md), [v2.0](v2-oauth2-client-creds-grant-flow.md)) and the On-Behalf-Of flow ([v1.0](v1-oauth2-on-behalf-of-flow.md), [v2.0](v2-oauth2-on-behalf-of-flow.md)).

One form of credential that an application can use for authentication is a JSON Web Token(JWT) assertion signed with a certificate that the application owns.

## Assertion format
To compute the assertion, you can use one of the many [JSON Web Token](https://jwt.ms/) libraries in the language of your choice. The information carried by the token are as follows:

### Header

| Parameter |  Remark |
| --- | --- |
| `alg` | Should be **RS256** |
| `typ` | Should be **JWT** |
| `x5t` | Should be the X.509 Certificate SHA-1 thumbprint |

### Claims (payload)

| Parameter |  Remarks |
| --- | --- |
| `aud` | Audience: Should be **https://login.microsoftonline.com/*tenant_Id*/oauth2/token** |
| `exp` | Expiration date: the date when the token expires. The time is represented as the number of seconds from January 1, 1970 (1970-01-01T0:0:0Z) UTC until the time the token validity expires.|
| `iss` | Issuer: should be the client_id (Application ID of the client service) |
| `jti` | GUID: the JWT ID |
| `nbf` | Not Before: the date before which the token cannot be used. The time is represented as the number of seconds from January 1, 1970 (1970-01-01T0:0:0Z) UTC until the time the token was issued. |
| `sub` | Subject: As for `iss`, should be the client_id (Application ID of the client service) |

### Signature

The signature is computed applying the certificate as described in the [JSON Web Token RFC7519 specification](https://tools.ietf.org/html/rfc7519)

## Example of a decoded JWT assertion

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

## Example of an encoded JWT assertion

The following string is an example of encoded assertion. If you look carefully, you notice three sections separated by dots (.):
* The first section encodes the header
* The second section encodes the payload
* The last section is the signature computed with the certificates from the content of the first two sections

```
"eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJhdWQiOiJodHRwczpcL1wvbG9naW4ubWljcm9zb2Z0b25saW5lLmNvbVwvam1wcmlldXJob3RtYWlsLm9ubWljcm9zb2Z0LmNvbVwvb2F1dGgyXC90b2tlbiIsImV4cCI6MTQ4NDU5MzM0MSwiaXNzIjoiOTdlMGE1YjctZDc0NS00MGI2LTk0ZmUtNWY3N2QzNWM2ZTA1IiwianRpIjoiMjJiM2JiMjYtZTA0Ni00MmRmLTljOTYtNjVkYmQ3MmMxYzgxIiwibmJmIjoxNDg0NTkyNzQxLCJzdWIiOiI5N2UwYTViNy1kNzQ1LTQwYjYtOTRmZS01Zjc3ZDM1YzZlMDUifQ.
Gh95kHCOEGq5E_ArMBbDXhwKR577scxYaoJ1P{a lot of characters here}KKJDEg"
```

## Register your certificate with Azure AD

You can associate the certificate credential with the client application in Azure AD through the Azure portal using any of the following methods:

### Uploading the certificate file

In the Azure app registration for the client application:
1. Select **Certificates & secrets**. 
2. Click on **Upload certificate** and select the certificate file to upload.
3. Click **Add**.
  Once the certificate is uploaded, the thumbprint, start date, and expiration values are displayed. 

### Updating the application manifest

Having hold of a certificate, you need to compute:

- `$base64Thumbprint`, which is the base64 encoding of the certificate hash
- `$base64Value`, which is the base64 encoding of the certificate raw data

You also need to provide a GUID to identify the key in the application manifest (`$keyId`).

In the Azure app registration for the client application:
1. Select **Manifest** to open the application manifest.
2. Replace the *keyCredentials* property with your new certificate information using the following schema.

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
3. Save the edits to the application manifest and then upload the manifest to Azure AD. 

   The `keyCredentials` property is multi-valued, so you may upload multiple certificates for richer key management.
   
## Code sample

The code sample on [Authenticating to Azure AD in daemon apps with certificates](https://github.com/Azure-Samples/active-directory-dotnet-daemon-certificate-credential) shows how an application uses its own credentials for authentication. It also shows how you can [create a self-signed certificate](https://github.com/Azure-Samples/active-directory-dotnet-daemon-certificate-credential#create-a-self-signed-certificate) using the `New-SelfSignedCertificate` Powershell command. You can also take advantage and use the [app creation scripts](https://github.com/Azure-Samples/active-directory-dotnet-daemon-certificate-credential/blob/master/AppCreationScripts/AppCreationScripts.md) to create the certificates, compute the thumbprint, and so on.
