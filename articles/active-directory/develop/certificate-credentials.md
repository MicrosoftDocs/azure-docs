---
title: Microsoft identity platform certificate credentials
description: This article discusses the registration and use of certificate credentials for application authentication.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: reference
ms.date: 02/27/2023
ms.author: owenrichards
ms.reviewer: kenwith
ms.custom: aaddev, has-adal-ref, engagement-fy23
---

# Microsoft identity platform application authentication certificate credentials

The Microsoft identity platform allows an application to use its own credentials for authentication anywhere a client secret could be used, for example, in the OAuth 2.0  [client credentials grant](v2-oauth2-client-creds-grant-flow.md) flow and the [on-behalf-of](v2-oauth2-on-behalf-of-flow.md) (OBO) flow.

One form of credential that an application can use for authentication is a [JSON Web Token](./security-tokens.md#json-web-tokens-and-claims) (JWT) assertion signed with a certificate that the application owns. This is described in the [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication) specification for the `private_key_jwt` client authentication option.

If you're interested in using a JWT issued by another identity provider as a credential for your application, please see [workload identity federation](../workload-identities/workload-identity-federation.md) for how to set up a federation policy.

## Assertion format

To compute the assertion, you can use one of the many JWT libraries in the language of your choice - [MSAL supports this using `.WithCertificate()`](msal-net-client-assertions.md). The information is carried by the token in its **Header**, **Claims**, and **Signature**.

### Header

| Parameter |  Remark |
| --- | --- |
| `alg` | Should be **RS256** |
| `typ` | Should be **JWT** |
| `x5t` | Base64url-encoded SHA-1 thumbprint of the X.509 certificate's DER encoding. For example, given an X.509 certificate hash of `84E05C1D98BCE3A5421D225B140B36E86A3D5534` (Hex), the `x5t` claim would be `hOBcHZi846VCHSJbFAs26Go9VTQ` (Base64url). |

### Claims (payload)

Claim type | Value | Description
---------- | ---------- | ----------
`aud` | `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token` | The "aud" (audience) claim identifies the recipients that the JWT is intended for (here Microsoft Entra ID) See [RFC 7519, Section 4.1.3](https://tools.ietf.org/html/rfc7519#section-4.1.3).  In this case, that recipient is the login server (login.microsoftonline.com).
`exp` | 1601519414 | The "exp" (expiration time) claim identifies the expiration time on or after which the JWT **must not** be accepted for processing. See [RFC 7519, Section 4.1.4](https://tools.ietf.org/html/rfc7519#section-4.1.4).  This allows the assertion to be used until then, so keep it short - 5-10 minutes after `nbf` at most.  Microsoft Entra ID does not place restrictions on the `exp` time currently. 
`iss` | {ClientID} | The "iss" (issuer) claim identifies the principal that issued the JWT, in this case your client application. Use the GUID application ID.
`jti` | (a Guid) | The "jti" (JWT ID) claim provides a unique identifier for the JWT. The identifier value **must** be assigned in a manner that ensures that there is a negligible probability that the same value will be accidentally assigned to a different data object; if the application uses multiple issuers, collisions MUST be prevented among values produced by different issuers as well. The "jti" value is a case-sensitive string. [RFC 7519, Section 4.1.7](https://tools.ietf.org/html/rfc7519#section-4.1.7)
`nbf` | 1601519114 | The "nbf" (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing. [RFC 7519, Section 4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5). Using the current time is appropriate. 
`sub` | {ClientID} | The "sub" (subject) claim identifies the subject of the JWT, in this case also your application. Use the same value as `iss`. 
`iat` | 1601519114 | The "iat" (issued at) claim identifies the time at which the JWT was issued. This claim can be used to determine the age of the JWT. [RFC 7519, Section 4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5).

### Signature

The signature is computed by applying the certificate as described in the [JSON Web Token RFC7519 specification](https://tools.ietf.org/html/rfc7519).

## Example of a decoded JWT assertion

```JSON
{
  "alg": "RS256",
  "typ": "JWT",
  "x5t": "gx8tGysyjcRqKjFPnd7RFwvwZI0"
}
.
{
  "aud": "https: //login.microsoftonline.com/contoso.onmicrosoft.com/oauth2/v2.0/token",
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

The following string is an example of encoded assertion. If you look carefully, you notice three sections separated by dots (`.`):

* The first section encodes the *header*
* The second section encodes the *claims* (payload)
* The last section is the *signature* computed with the certificates from the content of the first two sections

```
"eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJhdWQiOiJodHRwczpcL1wvbG9naW4ubWljcm9zb2Z0b25saW5lLmNvbVwvam1wcmlldXJob3RtYWlsLm9ubWljcm9zb2Z0LmNvbVwvb2F1dGgyXC90b2tlbiIsImV4cCI6MTQ4NDU5MzM0MSwiaXNzIjoiOTdlMGE1YjctZDc0NS00MGI2LTk0ZmUtNWY3N2QzNWM2ZTA1IiwianRpIjoiMjJiM2JiMjYtZTA0Ni00MmRmLTljOTYtNjVkYmQ3MmMxYzgxIiwibmJmIjoxNDg0NTkyNzQxLCJzdWIiOiI5N2UwYTViNy1kNzQ1LTQwYjYtOTRmZS01Zjc3ZDM1YzZlMDUifQ.
Gh95kHCOEGq5E_ArMBbDXhwKR577scxYaoJ1P{a lot of characters here}KKJDEg"
```

## Register your certificate with Microsoft identity platform

You can associate the certificate credential with the client application in the Microsoft identity platform through the Microsoft Entra admin center using any of the following methods:

### Uploading the certificate file

In the **App registrations** tab for the client application:
1. Select **Certificates & secrets** > **Certificates**.
2. Click on **Upload certificate** and select the certificate file to upload.
3. Click **Add**.
  Once the certificate is uploaded, the thumbprint, start date, and expiration values are displayed.

### Updating the application manifest

After acquiring a certificate, compute these values:

- `$base64Thumbprint` - Base64-encoded value of the certificate hash
- `$base64Value` - Base64-encoded value of the certificate raw data

Provide a GUID to identify the key in the application manifest (`$keyId`).

In the Azure app registration for the client application:
1. Select **Manifest** to open the application manifest.
2. Replace the *keyCredentials* property with your new certificate information using the following schema.

   ```JSON
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
3. Save the edits to the application manifest and then upload the manifest to Microsoft identity platform.

   The `keyCredentials` property is multi-valued, so you may upload multiple certificates for richer key management.
   
## Using a client assertion

Client assertions can be used anywhere a client secret would be used. For example, in the [authorization code flow](v2-oauth2-auth-code-flow.md), you can pass in a `client_secret` to prove that the request is coming from your app. You can replace this with `client_assertion` and `client_assertion_type` parameters. 

| Parameter | Value | Description|
|-----------|-------|------------|
|`client_assertion_type`|`urn:ietf:params:oauth:client-assertion-type:jwt-bearer`| This is a fixed value, indicating that you are using a certificate credential. |
|`client_assertion`| `JWT` |This is the JWT created above. |

## Next steps

The [MSAL.NET library handles this scenario](msal-net-client-assertions.md) in a single line of code.

The [.NET Core daemon console application using Microsoft identity platform](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2) code sample on GitHub shows how an application uses its own credentials for authentication. It also shows how you can [create a self-signed certificate](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/tree/master/1-Call-MSGraph#optional-use-the-automation-script) using the `New-SelfSignedCertificate` PowerShell cmdlet. You can also use the [app creation scripts](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/blob/master/1-Call-MSGraph/AppCreationScripts/AppCreationScripts.md) in the sample repo to create certificates, compute the thumbprint, and so on.
