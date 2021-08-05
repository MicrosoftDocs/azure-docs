---
title: Azure Active Directory identity configuration for Healthcare APIs FHIR service
description: Learn the principles of identity, authentication, and authorization for FHIR service
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 08/05/2019
ms.author: cavoeg
---

# Azure Active Directory identity configuration for FHIR service

When you're working with healthcare data, it's important to ensure that the data is secure, and it can't be accessed by unauthorized users or applications. FHIR servers use [OAuth 2.0](https://oauth.net/2/) to ensure this data security. FHIR service is secured using [Azure Active Directory](../../active-directory/index.yml), which is an example of an OAuth 2.0 identity provider. This article provides an overview of FHIR server authorization and the steps needed to obtain a token to access a FHIR server. While these steps will apply to any FHIR server and any identity provider, we'll walk through the Healthcare APIs FHIR service and Azure Active Directory (Azure AD) as our identity provider in this article.*

## Access control overview

In order for a client application to access FHIR service, it must present an access token. The access token is a signed, [Base64](https://en.wikipedia.org/wiki/Base64) encoded collection of properties (claims) that convey information about the client's identity and roles and privileges granted to the client.

There are many ways to obtain a token, but FHIR service doesn't care how the token is obtained as long as it's an appropriately signed token with the correct claims. 

Using [authorization code flow](../../active-directory/azuread-dev/v1-protocols-oauth-code.md) as an example, accessing a FHIR server goes through the four steps below:

![FHIR Authorization](media/azure-ad-hcapi/fhir-authorization.png)

1. The client sends a request to the `/authorize` endpoint of Azure AD. Azure AD will redirect the client to a sign-in page where the user will authenticate using appropriate credentials (for example username and password or two-factor authentication). See details on [obtaining an authorization code](../../active-directory/azuread-dev/v1-protocols-oauth-code.md#request-an-authorization-code). Upon successful authentication, an *authorization code* is returned to the client. Azure AD will only allow this authorization code to be returned to a registered reply URL configured in the client application registration (see below).
1. The client application exchanges the authorization code for an *access token* at the `/token` endpoint of Azure AD. When requesting a token, the client application may have to provide a client secret (the applications password). See details on [obtaining an access token](../../active-directory/azuread-dev/v1-protocols-oauth-code.md#use-the-authorization-code-to-request-an-access-token).
1. The client makes a request to the FHIR service, for example `GET /Patient` to search all patients. When making the request, it includes the access token in an HTTP request header, for example `Authorization: Bearer eyJ0e...`, where `eyJ0e...` represents the Base64 encoded access token.
1. The FHIR service validates that the token contains appropriate claims (properties in the token). If everything checks out, it will complete the request and return a FHIR bundle with results to the client.

It's important to note that the FHIR service isn't involved in validating user credentials and it doesn't issue the token. The authentication and token creation is done by Azure AD. The FHIR service simply validates that the token is signed correctly (it is authentic) and that it has appropriate claims.

## Structure of an access token

Development of FHIR applications often involves debugging access issues. If a client is denied access to the FHIR service, it's useful to understand the structure of the access token and how it can be decoded to inspect the contents (the claims) of the token. 

FHIR servers typically expect a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token) (JWT, sometimes pronounced "jot"). It consists of three parts:

**Part 1**: A header, which could look like:
    ```json
    {
      "alg": "HS256",
      "typ": "JWT"
    }
    ```

**Part 2**: The payload (the claims), for example:
    ```json
    {
     "oid": "123",
     "iss": "https://issuerurl",
     "iat": 1422779638,
     "roles": [
        "admin"
      ]
    }
    ```

**Part 3**: A signature, which is calculated by concatenating the Base64 encoded contents of the header and the payload and calculating a cryptographic hash of them based on the algorithm (`alg`) specified in the header. A server will be able to obtain public keys from the identity provider and validate that this token was issued by a specific identity provider and it hasn't been tampered with.

The full token consists of the Base64 encoded (actually Base64 url encoded) versions of those three segments. The three segments are concatenated and separated with a `.` (dot).

An example token is seen below:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvaWQiOiIxMjMiLCAiaXNzIjoiaHR0cHM6Ly9pc3N1ZXJ1cmwiLCJpYXQiOjE0MjI3Nzk2MzgsInJvbGVzIjpbImFkbWluIl19.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI
```

The token can be decoded and inspected with tools such as [https://jwt.ms](https://jwt.ms). The result of decoding the token is:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}.{
  "oid": "123",
  "iss": "https://issuerurl",
  "iat": 1422779638,
  "roles": [
    "admin"
  ]
}.[Signature]
```

## Obtaining an access token

As mentioned above, there are several ways to obtain a token from Azure AD. They are described in detail in the [Azure AD developer documentation](../../active-directory/develop/index.yml).

Azure AD has two different versions of the OAuth 2.0 endpoints, which are referred to as `v1.0` and `v2.0`. Both of these versions are OAuth 2.0 endpoints and the `v1.0` and `v2.0` designations refer to differences in how Azure AD implements that standard. 

When using a FHIR server, you can use either the `v1.0` or the `v2.0` endpoints. The choice may depend on the authentication libraries you are using in your client application.

The pertinent sections of the Azure AD documentation are:

* `v1.0` endpoint:
    * [Authorization code flow](../../active-directory/azuread-dev/v1-protocols-oauth-code.md).
    * [Client credentials flow](../../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md).
* `v2.0` endpoint:
    * [Authorization code flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).
    * [Client credentials flow](../../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

There are other variations (for example on behalf of flow) for obtaining a token. Check the Azure AD documentation for details. When using the FHIR service, there are also some shortcuts for obtaining an access token (for debugging purposes) [using the Azure CLI](get-healthcare-apis-access-token-cli.md).

## Next steps

In this document, you learned some of the basic concepts involved in securing access to the FHIR service using Azure AD. For information about how to deploy the FHIR service, see

>[!div class="nextstepaction"]
>[Deploy FHIR service](fhir-portal-quickstart.md)