---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 02/02/2023
ms.author: danlep
---
| Property | Description | Required | Default |
|---|---|---|---|
| Provider name | Name of authorization provider resource in API Management |Yes | N/A | 
| Identity provider  | Select your identity (service) provider's name |Yes | N/A | 
| Grant type  | The OAuth 2.0 authorization grant type to use |Yes | Authorization code | 
| Client id | The id used to identify the app with the service provider | Yes | N/A |
| Client secret | The shared secret used to authenticate the app with the service provider | Yes | N/A |
| Scopes | One or more API permissions for your app<br/><br/>Separate multiple scopes by a character such as " " or "," that's supported by the service provider| No | N/A | 
| Authorization name | Name of an authorization using the authorization provider | Yes | N/A |