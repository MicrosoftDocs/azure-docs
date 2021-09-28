---
title: Azure Fluid Relay Token Contract
description: Better understand the the JWT token used in Azure Fluid Relay
services: azure-fluid
author: sharmakhushboo
ms.author: sharmak
ms.date: 02/09/2021
ms.topic: reference
ms.service: azure-fluid
---

# Azure Fluid Relay Token Contract

Requests sent to Azure Fluid Relay should contain a JWT token in the authorization header. This token should be signed by the tenant key (obtained during provisioning). This JWT token should have the required claims mentioned below.

## Claims

JWTs (JSON Web Tokens) are split into three pieces: 
* Header - Provides information about how to validate the token, including information about the type of token and how it was signed. 
* Payload - Contains all the important data about the user or app that is attempting to call your service. 
* Signature - Is the raw material used to validate the token. 
Each piece is separated by a period (.) and separately Base64 encoded. 

<br/>

## Header Claims

| Claim        | Format           | Description  |
| ------------- |-------------| -----|
| alg      | string | Indicates the algorithm that was used to sign the token, for example, " HS256" |
| typ      | string      |   It indicates that the token is JWT. This value should always be “JWT.” |

<br/>

## Payload Claims

| Claim        | Format           | Description  |
| ------------- |-------------| -----|
| documentId      | string | Identifies the document for which the token is being generated. |
| scope      | string[]      |   Identifies the permissions required by the client on the document or summary. For every scope, you can define the permissions you want to give to the client.  |
| tenantId      | string      |   Identifies the tenant. This will be shared with you during the onboarding process. |
| user (optional)     | { displayName: <display_name>, id: <user_id>,name: <user_name>, }       |   Identifies users of your application. This is sent back to your application by Alfred (the ordering service).  This can be used by your application to identify your users from the response it gets from Alfred. Azure Fluid Relay does not validate this information. |
| iat      | number, a UNIX timestamp       |   "Issued At" indicates when the authentication for this token occurred. |
| exp      | number, a UNIX timestamp       |   The "exp" (expiration time) claim identifies the expiration time on or after which the JWT must not be accepted for processing. The token lifetime cannot be more than 1 hour. |
| ver      | string      |   Indicates the version of the access token. Please use: 1.0  |

<br/>

## A Sample Azure Fluid Relay Token

```typescript
{ 
  "alg": "HS256",  
  "typ": "JWT" 
}.{ 
  "documentId": "azureFluidDocumentId", 
  "scopes": [ "doc:read", "doc:write", "summary:write" ],   
  "iat": 1599098963,  
  "exp": 1599098963,  
  "tenantId": "AzureFluidTenantId",  
  "ver": "1.0" 
}.[Signature] 
```

<br/>

## How can you generate an Azure Fluid Relay token? 

You can use the jsonwebtoken npm package and sign your token using this method.

```typescript

export function getSignedToken(
    tenantId: string,
    documentId: string,
    tokenLifetime: number = 60 * 60,
    ver: string = "1.0") {
        jwt.sign(
            {
                documentId, 
                user: {
                    displayName: "displayName", 
                    id: "userId", 
                    name: "userName" 
                }, 
                scopes: ["doc:read", "doc:write", "summary:write"], 
                iat: Math.round((new Date()).getTime() / 1000), 
                exp: Math.round((new Date()).getTime() / 1000) + tokenLifetime, //set the expiry date based on your needs. 
                tenantId, 
                ver, 
            },
            "<tenant_key>");
    }
```
