---
title: Microsoft Entra identity configuration for Azure API for FHIR
description: Learn the principles of identity, authentication, and authorization for Azure FHIR servers.
services: healthcare-apis
author: expekesheth
ms.reviewer: matjazl
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 9/27/2023
ms.author: kesheth
---

# Microsoft Entra identity configuration for Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

When you're working with healthcare data, it's important to ensure that the data is secure, and can't be accessed by unauthorized users or applications. FHIR servers use [OAuth 2.0](https://oauth.net/2/) to ensure this data security. [Azure API for FHIR](https://azure.microsoft.com/services/azure-api-for-fhir/) is secured using [Microsoft Entra ID](../../active-directory/index.yml), which is an example of an OAuth 2.0 identity provider. This article provides an overview of FHIR server authorization and the steps needed to obtain a token to access a FHIR server. The following steps apply to any FHIR server and any identity provider. We walk through Azure API for FHIR as the FHIR server and Microsoft Entra ID as our identity provider in this article.

## Access control overview

In order for a client application to access Azure API for FHIR, it must present an access token. The access token is a signed, [Base64](https://en.wikipedia.org/wiki/Base64) encoded collection of properties (claims) that convey information about the client's identity, roles, and privileges granted to the client.

There are many ways to obtain a token. Azure API for FHIR doesn't care how the token is obtained as long as it's an appropriately signed token with the correct claims. 

For example, when you use [authorization code flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md), accessing a FHIR server goes through the following four steps:

![FHIR Authorization](media/azure-ad-hcapi/fhir-authorization.png)

1. The client sends a request to the `/authorize` endpoint of Microsoft Entra ID. Microsoft Entra ID will redirect the client to a sign-in page where the user authenticates using appropriate credentials (for example username and password, or two-factor authentication). For details, see [obtaining an authorization code](../../active-directory/develop/v2-oauth2-auth-code-flow.md#request-an-authorization-code). Upon successful authentication, an *authorization code* is returned to the client. Microsoft Entra ID will only allow this authorization code to be returned to a registered reply URL configured in the client application registration.
1. The client application exchanges the authorization code for an *access token* at the `/token` endpoint of Microsoft Entra ID. When you request a token, the client application may have to provide a client secret (the applications password). See details on [obtaining an access token](../../active-directory/develop/v2-oauth2-auth-code-flow.md#redeem-a-code-for-an-access-token).
1. The client makes a request to Azure API for FHIR, for example `GET /Patient`, to search all patients. When the client makes the request, it includes the access token in an HTTP request header, for example `Authorization: Bearer eyJ0e...`, where `eyJ0e...` represents the Base64 encoded access token.
1. Azure API for FHIR validates that the token contains appropriate claims (properties in the token). If everything checks out, it completes the request and returns a FHIR bundle with results to the client.

It's important to note that  Azure API for FHIR isn't involved in validating user credentials and it doesn't issue the token. The authentication and token creation is done by Microsoft Entra ID. Azure API for FHIR simply validates that the token is signed correctly (it's authentic) and that it has appropriate claims.

## Structure of an access token

Development of Fast Healthcare Interoperability Resources (FHIR&#174;) applications often involves debugging access issues. If a client is denied access to Azure API for FHIR, it's useful to understand the structure of the access token and how it can be decoded to inspect the contents (the claims) of the token. 

FHIR servers typically expect a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token) (JWT, sometimes pronounced "jot"). It consists of the following three parts.

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

**Part 3**: A signature, which is calculated by concatenating the Base64 encoded contents of the header and the payload, and calculating a cryptographic hash of them based on the algorithm (`alg`) specified in the header. A server is able to obtain public keys from the identity provider and validate that this token was issued by a specific identity provider and it hasn't been tampered with.

The full token consists of the Base64 url encoded versions of those three segments. The three segments are concatenated and separated with a `.`.

An example of a token is as follows.

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

As mentioned, there are several ways to obtain a token from Microsoft Entra ID, described in detail in the [Microsoft Entra developer documentation](../../active-directory/develop/index.yml).

Use either of the following authentication protocols.

* [Authorization code flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).
* [Client credentials flow](../../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

There are other variations for obtaining a token (for example due to flow). Refer to the [Microsoft Entra documentation](../../active-directory/index.yml) for details. When you use Azure API for FHIR, there are some shortcuts for obtaining an access token (such as for debugging purposes) [using the Azure CLI](get-healthcare-apis-access-token-cli.md).

## Next steps

In this document, you learned some of the basic concepts involved in securing access to the Azure API for FHIR using Microsoft Entra ID. For information about how to deploy the Azure API for FHIR service, see

>[!div class="nextstepaction"]
>[Deploy Azure API for FHIR](fhir-paas-portal-quickstart.md).

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
