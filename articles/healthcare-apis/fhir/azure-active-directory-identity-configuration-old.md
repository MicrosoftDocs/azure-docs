---
title: Microsoft Entra identity configuration for Azure Health Data Services for FHIR service
description: Learn the principles of identity, authentication, and authorization for FHIR service
services: healthcare-apis
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 06/03/2022
ms.author: kesheth
---

# Microsoft Entra identity configuration for FHIR service

When you're working with healthcare data, it's important to ensure that the data is secure, and can't be accessed by unauthorized users or applications. FHIR servers use [OAuth 2.0](https://oauth.net/2/) to ensure this data security. FHIR service in the Azure Health Data Services is secured using [Microsoft Entra ID](../../active-directory/index.yml), which is an example of an OAuth 2.0 identity provider. This article provides an overview of FHIR server authorization and the steps needed to obtain a token to access a FHIR server. While these steps apply to any FHIR server and any identity provider, we walk through the FHIR service and Microsoft Entra ID as our identity provider in this article.

## Access control overview

In order for a client application to access the FHIR service, it must present an access token. The access token is a signed, [Base64](https://en.wikipedia.org/wiki/Base64) encoded collection of properties (claims) that convey information about the client's identity, roles, and privileges granted.

The FHIR service doesn't care how the token is obtained, as long as it's an appropriately signed token with the correct claims. 

Using [authorization code flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md) as an example, accessing a FHIR server goes through the following four steps.

![FHIR Authorization](media/azure-active-directory-fhir-service/fhir-authorization.png)

1. The client sends a request to the `/authorize` endpoint of Microsoft Entra ID. Microsoft Entra ID will redirect the client to a sign-in page where the user authenticates using appropriate credentials (for example username and password, or two-factor authentication). Select the link for details on [obtaining an authorization code](../../active-directory/develop/v2-oauth2-auth-code-flow.md#request-an-authorization-code). Upon successful authentication, an *authorization code* is returned to the client. Microsoft Entra ID will only allow this authorization code to be returned to a registered reply URL configured in the client application registration (following).
1. The client application exchanges the authorization code for an *access token* at the `/token` endpoint of Microsoft Entra ID. When requesting a token, the client application may have to provide a client secret (the applications password). Select the link for details on [obtaining an access token](../../active-directory/develop/v2-oauth2-auth-code-flow.md#redeem-a-code-for-an-access-token).
1. The client makes a request to the FHIR service, for example `GET /Patient` to search all patients. When making the request, it includes the access token in an HTTP request header, for example `Authorization: Bearer eyJ0e...`, where `eyJ0e...` represents the Base64 encoded access token.
1. The FHIR service validates that the token contains appropriate claims (properties in the token). If everything checks out, it completes the request and returns a FHIR bundle with results to the client.

It's important to note that the FHIR service isn't involved in validating user credentials and it doesn't issue the token. The authentication and token creation is done by Microsoft Entra ID. The FHIR service simply validates that the token is signed correctly (is authentic) and that it has appropriate claims.

## Structure of an access token

Development of FHIR applications often involves debugging access issues. If a client is denied access to the FHIR service, it's useful to understand the structure of the access token and how it can be decoded to inspect the contents (claims) of the token. 

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

**Part 3**: A signature, which is calculated by concatenating the Base64 encoded contents of the header and the payload and calculating a cryptographic hash of them based on the algorithm (`alg`) specified in the header. A server is able to obtain public keys from the identity provider, validate that the token was issued by a specific identity provider, and hasn't been tampered with.

The full token consists of the Base64 encoded (actually Base64 url encoded) versions of those three segments. The three segments are concatenated and separated with a `.` (dot).

Here's an example token:

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

As previously mentioned, there are several ways to obtain a token from Microsoft Entra ID. They're described in detail in the [Microsoft Entra developer documentation](../../active-directory/develop/index.yml).

Use either of the following authentication protocols:

* [Authorization code flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).
* [Client credentials flow](../../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

There are other variations for obtaining a token (for example, on behalf of flow). Check the Microsoft Entra documentation for details. When using the FHIR service, there are also shortcuts to obtaining an access token for debugging purposes [using the Azure CLI](get-healthcare-apis-access-token-cli.md).

## Next steps

In this document, you learned some of the basic concepts involved in securing access to FHIR service using Microsoft Entra ID. For information about how to deploy FHIR service, see

>[!div class="nextstepaction"]
>[Deploy FHIR service](fhir-portal-quickstart.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
