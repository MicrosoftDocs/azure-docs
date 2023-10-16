---
title: Microsoft Entra Verified ID Network API
titleSuffix: Microsoft Entra Verified ID
description: Learn how to use the Microsoft Entra Verified ID Network API
documentationCenter: ''
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.topic: reference
ms.subservice: verifiable-credentials
ms.date: 07/29/2022
ms.author: barclayn

#Customer intent: As a verifiable credentials developer, I want to configure verifying credentials from another party 
---

# Microsoft Entra Verified ID network API

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

The Microsoft Entra Verified ID Network API enables you to search for published credentials in the [Microsoft Entra Verified ID Network](how-use-vcnetwork.md). 

>[!NOTE] 
>The API is intended for developers comfortable with RESTful APIs.

## Base URL

The Microsoft Entra ID Verified Network API is served over HTTPS. All URLs referenced in the documentation have the following base: `https://verifiedid.did.msidentity.com`. 

## Authentication

The API is protected through Microsoft Entra ID and uses OAuth2 bearer tokens. The app registration needs to have the API Permission for `Verifiable Credentials Service Admin` and then when acquiring the access token the app should use scope `6a8b4b39-c021-437c-b060-5a14a3fd65f3/full_access`. 

## Searching for issuers

This API is used to search for issuers available in the Microsoft Entra Verified ID Network. You can search for issuers by their **linked domain** name. The value supplied for the `filter` parameter will be used to find issuers that have onboarded to Microsoft Entra Verified ID and have a verified linked domain. Currently you can only filter by `linkeddomainurls` and with operator `like`. There will be a maximum of 15 issuers in the response.

#### HTTP request

`GET /v1.0/verifiableCredentialsNetwork/authorities?filter=linkeddomainurls%20like%20Woodgrove`

#### Request headers

| Header | Value |
| -------- | -------- |
| Authorization     | Bearer (token). Required |
| Content-Type | application/json |

#### Request parameters

| Parameter | value |
| -------- | -------- |
| filter | linkeddomainurls like Woodgrove |


#### Return message

```
HTTP/1.1 200 OK
Content-type: application/json

[
  {
    "id": "0459a193-1111-2222-3333-444455556666",
    "tenantId": "55eafede-1111-2222-3333-444455556666",
    "did": "did:web:bank.woodgrove.com...<SNIP>...",
    "name": "WoodgroveBank",
    "linkedDomainUrls": [
      "https://bank.woodgrove.com/"
    ]
  },
  {
    "id": "6e0e41cb-1111-2222-3333-444455556666",
    "tenantId": "7f448f57-1111-2222-3333-444455556666",
    "did": "did:web:woodgrove.com...<SNIP>...",
    "name": "Woodgrove",
    "linkedDomainUrls": [
      "https://woodgrove.com/"
    ]
  }
]
```

## Searching for published credential types by an issuer

This API is used search for published credential types for a specific issuer. You need to know the issuers `tenantId` and `issuerId`. The return message is a collection of published credential types and their respective claims. There will be a maximum of 100 credential types in the response.

#### HTTP request

`GET /v1.0/tenants/:tenantId/verifiableCredentialsNetwork/authorities/:issuerId/contracts/`

#### Request headers

| Header | Value |
| -------- | -------- |
| Authorization     | Bearer (token). Required |
| Content-Type | application/json |

#### Request parameters

| Parameter | value |
| -------- | -------- |
| tenantId | TenantId obtained from the search by linked domain name |
| issuerId | IssuerId obtained from the search by linked domain name |


#### Return message

```
HTTP/1.1 200 OK
Content-type: application/json

[
  {
    "name": "Verified employee 1",
    "types": [
      "VerifiedEmployee"
    ],
    "claims": [
      "displayName",
      "givenName",
      "jobTitle",
      "preferredLanguage",
      "surname",
      "mail",
      "revocationId",
      "photo"
    ]
  }
]
```

## Next steps

Learn more about [Microsoft Entra Verified ID Network](how-use-vcnetwork.md).
