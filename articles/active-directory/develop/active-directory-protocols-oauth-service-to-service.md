---
title: Azure AD Service to Service Auth using OAuth2.0 | Microsoft Docs
description: This article describes how to use HTTP messages to implement service to service authentication using the OAuth2.0 client credentials grant flow.
services: active-directory
documentationcenter: .net
author: priyamohanram
manager: mbaldwin
editor: ''

ms.assetid: a7f939d9-532d-4b6d-b6d3-95520207965d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/08/2017
ms.author: priyamo
ms.custom: aaddev

---
# Service to service calls using client credentials (shared secret or certificate)
The OAuth 2.0 Client Credentials Grant Flow permits a web service (*confidential client*) to use its own credentials instead of impersonating a user, to authenticate when calling another web service. In this scenario, the client is typically a middle-tier web service, a daemon service, or web site. For a higher level of assurance, Azure AD also allows the calling service to use a certificate (instead of a shared secret) as a credential.

## Client credentials grant flow diagram
The following diagram explains how the client credentials grant flow works in Azure Active Directory (Azure AD).

![OAuth2.0 Client Credentials Grant Flow](media/active-directory-protocols-oauth-service-to-service/active-directory-protocols-oauth-client-credentials-grant-flow.jpg)

1. The client application authenticates to the Azure AD token issuance endpoint and requests an access token.
2. The Azure AD token issuance endpoint issues the access token.
3. The access token is used to authenticate to the secured resource.
4. Data from the secured resource is returned to the web application.

## Register the Services in Azure AD
Register both the calling service and the receiving service in Azure Active Directory (Azure AD). For detailed instructions, see [Integrating applications with Azure Active Directory](active-directory-integrating-applications.md).

## Request an Access Token
To request an access token, use an HTTP POST to the tenant-specific Azure AD endpoint.

```
https://login.microsoftonline.com/<tenant id>/oauth2/token
```

## Service-to-service access token request
There are two cases depending on whether the client application chooses to be secured by a shared secret, or a certificate.

### First case: Access token request with a shared secret
When using a shared secret, a service-to-service access token request contains the following parameters:

| Parameter |  | Description |
| --- | --- | --- |
| grant_type |required |Specifies the requested grant type. In a Client Credentials Grant flow, the value must be **client_credentials**. |
| client_id |required |Specifies the Azure AD client id of the calling web service. To find the calling application's client ID, in the [Azure portal](https://portal.azure.com), click **Active Directory**, switch directory, click the application. The client_id is the *Application ID* |
| client_secret |required |Enter a key registered for the calling web service or daemon application in Azure AD. To create a key, in the Azure portal, click **Active Directory**, switch directory, click the application, click **Settings**, click **Keys**, and add a Key.|
| resource |required |Enter the App ID URI of the receiving web service. To find the App ID URI, in the Azure portal, click **Active Directory**, switch directory, click the service application, and then click **Settings** and **Properties** |

#### Example
The following HTTP POST requests an access token for the https://service.contoso.com/ web service. The `client_id` identifies the web service that requests the access token.

```
POST /contoso.com/oauth2/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=625bc9f6-3bf6-4b6d-94ba-e97cf07a22de&client_secret=qkDwDJlDfig2IpeuUZYKH1Wb8q1V0ju6sILxQQqhJ+s=&resource=https%3A%2F%2Fservice.contoso.com%2F
```

### Second case: Access token request with a certificate
A service-to-service access token request with a certificate contains the following parameters:

| Parameter |  | Description |
| --- | --- | --- |
| grant_type |required |Specifies the requested response type. In a Client Credentials Grant flow, the value must be **client_credentials**. |
| client_id |required |Specifies the Azure AD client id of the calling web service. To find the calling application's client ID, in the [Azure portal](https://portal.azure.com), click **Active Directory**, switch directory, click the application. The client_id is the *Application ID* |
| client_assertion_type |required |The value must be `urn:ietf:params:oauth:client-assertion-type:jwt-bearer` |
| client_assertion |required | An assertion (a JSON Web Token) that you need to create and sign with the certificate you registered as credentials for your application. See the following details on how to register your certificate and the format of the assertion.|
| resource | required |Enter the App ID URI of the receiving web service. To find the App ID URI, in the Azure portal, click **Active Directory**, click the directory, click the application, and then click **Configure**. |

Notice that the parameters are almost the same as in the case of the request by shared secret except that
the client_secret parameter is replaced by two parameters: a client_assertion_type and client_assertion.

#### Format of the assertion
To compute the assertion, you probably want to use one of the many [JSON Web Token](https://jwt.io/) libraries in the language of your choice. The information carried by the token is:

##### Header

| Parameter |  Remark |
| --- | --- | --- |
| `alg` | Should be **RS256** |
| `typ` | Should be **JWT** |
| `x5t` | Should be the X.509 Certificate SHA-1 thumbprint |

##### Claims (Payload)

| Parameter |  Remark |
| --- | --- | --- |
| `aud` | Audience: Should be **https://login.microsoftonline/*tenant_Id*/oauth2/token** |
| `exp` | Expiration date |
| `iss` | Issuer: should be the client_id (Application Id of the client service) |
| `jti` | GUID: the JWT ID |
| `nbf` | Not Before: date before which the token cannot be used |
| `sub` | Subject: As for `iss`, should be the client_id (Application Id of the client service) |

##### Signature
The signature is computed applying the certificate as described in the [JSON Web Token RFC7519 specification](https://tools.ietf.org/html/rfc7519)

##### Example of a decoded JWT assertion
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

##### Example of encoded JWT assertion
The following string is an example of encoded assertion. If you look carefully, you notice three sections separated by dots (.).
The first section encodes the header, the second the payload, and the last is the signature computed with the certificates from the content of the first two sections.
```
"eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJhdWQiOiJodHRwczpcL1wvbG9naW4ubWljcm9zb2Z0b25saW5lLmNvbVwvam1wcmlldXJob3RtYWlsLm9ubWljcm9zb2Z0LmNvbVwvb2F1dGgyXC90b2tlbiIsImV4cCI6MTQ4NDU5MzM0MSwiaXNzIjoiOTdlMGE1YjctZDc0NS00MGI2LTk0ZmUtNWY3N2QzNWM2ZTA1IiwianRpIjoiMjJiM2JiMjYtZTA0Ni00MmRmLTljOTYtNjVkYmQ3MmMxYzgxIiwibmJmIjoxNDg0NTkyNzQxLCJzdWIiOiI5N2UwYTViNy1kNzQ1LTQwYjYtOTRmZS01Zjc3ZDM1YzZlMDUifQ.
Gh95kHCOEGq5E_ArMBbDXhwKR577scxYaoJ1P{a lot of characters here}KKJDEg"
```

#### Register your certificate with Azure AD
To associate the certificate credential with the client application in Azure AD, you need to edit the application manifest.
Having hold of a certificate, you need to compute:
- `$base64Thumbprint`, which is the base64 encoding of the certificate Hash
- `$base64Value`, which is the base64 encoding of the certificate raw data

you also need to provide a GUID to identify the key in the application manifest (`$keyId`)

In the Azure portal app registration for the client application, click **Manifest**, and **Download**.
Open the manifest if your favorite text editor, and replace the *keyCredentials* property with your new certificate information using the following schema:
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
Save the edits to the application manifest, and upload it back into Azure AD by clicking **Manifest** and then **Upload**. The keyCredentials property is multi-valued, so you may upload multiple certificates for richer key management.


#### Example of request
The following HTTP POST requests an access token for the https://service.contoso.com/ web service with a certificate. The `client_id` identifies the web service that requests the access token.

```
POST /<tenant_id>/oauth2/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

resource=https%3A%2F%contoso.onmicrosoft.com%2Ffc7664b4-cdd6-43e1-9365-c2e1c4e1b3bf&client_id=97e0a5b7-d745-40b6-94fe-5f77d35c6e05&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer&client_assertion=eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJ{a lot of characters here}M8U3bSUKKJDEg&grant_type=client_credentials
```

### Service-to-Service Access Token Response

A success response contains a JSON OAuth 2.0 response with the following parameters:

| Parameter | Description |
| --- | --- |
| access_token |The requested access token. The calling web service can use this token to authenticate to the receiving web service. |
| token_type |Indicates the token type value. The only type that Azure AD supports is **Bearer**. For more information about bearer tokens, see The [OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](http://www.rfc-editor.org/rfc/rfc6750.txt). |
| expires_in |How long the access token is valid (in seconds). |
| expires_on |The time when the access token expires. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until the expiration time. This value is used to determine the lifetime of cached tokens. |
| not_before |The time from which the access token becomes usable. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until time of validity for the token.|
| resource |The App ID URI of the receiving web service. |

#### Example of response
The following example shows a success response to a request for an access token to a web service.

```
{
"access_token":"eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL3NlcnZpY2UuY29udG9zby5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvN2ZlODE0NDctZGE1Ny00Mzg1LWJlY2ItNmRlNTdmMjE0NzdlLyIsImlhdCI6MTM4ODQ0ODI2NywibmJmIjoxMzg4NDQ4MjY3LCJleHAiOjEzODg0NTIxNjcsInZlciI6IjEuMCIsInRpZCI6IjdmZTgxNDQ3LWRhNTctNDM4NS1iZWNiLTZkZTU3ZjIxNDc3ZSIsIm9pZCI6ImE5OTE5MTYyLTkyMTctNDlkYS1hZTIyLWYxMTM3YzI1Y2RlYSIsInN1YiI6ImE5OTE5MTYyLTkyMTctNDlkYS1hZTIyLWYxMTM3YzI1Y2RlYSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzdmZTgxNDQ3LWRhNTctNDM4NS1iZWNiLTZkZTU3ZjIxNDc3ZS8iLCJhcHBpZCI6ImQxN2QxNWJjLWM1NzYtNDFlNS05MjdmLWRiNWYzMGRkNThmMSIsImFwcGlkYWNyIjoiMSJ9.aqtfJ7G37CpKV901Vm9sGiQhde0WMg6luYJR4wuNR2ffaQsVPPpKirM5rbc6o5CmW1OtmaAIdwDcL6i9ZT9ooIIicSRrjCYMYWHX08ip-tj-uWUihGztI02xKdWiycItpWiHxapQm0a8Ti1CWRjJghORC1B1-fah_yWx6Cjuf4QE8xJcu-ZHX0pVZNPX22PHYV5Km-vPTq2HtIqdboKyZy3Y4y3geOrRIFElZYoqjqSv5q9Jgtj5ERsNQIjefpyxW3EwPtFqMcDm4ebiAEpoEWRN4QYOMxnC9OUBeG9oLA0lTfmhgHLAtvJogJcYFzwngTsVo6HznsvPWy7UP3MINA",
"token_type":"Bearer",
"expires_in":"3599",
"expires_on":"1388452167",
"resource":"https://service.contoso.com/"
}
```

## See also
* [OAuth 2.0 in Azure AD](active-directory-protocols-oauth-code.md)
* [Sample in C# of the service to service call with a shared secret](https://github.com/Azure-Samples/active-directory-dotnet-daemon)
and [Sample in C# of the service to service call with a certificate](https://github.com/Azure-Samples/active-directory-dotnet-daemon-certificate-credential)
