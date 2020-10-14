---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 10/14/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Get token for ARM REST-->

Use the following request to get a token for ARM using a service principal name and secret.  Replace the `aadEndpoint`, `tenantId`, `armResource`,`servicePrincalId`,and `servicePrincipalSecret` values. 

```rest

POST https://{{aadEndpoint}}/{{tenantId}}/oauth2/token
Accept: application/json
Content-Type: application/x-www-form-urlencoded

resource={{armResource}}&client_id={{servicePrincipalId}}&client_secret={{servicePrincipalSecret}}&grant_type=client_credentials

```
