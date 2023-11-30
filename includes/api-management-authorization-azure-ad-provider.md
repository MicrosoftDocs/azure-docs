---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 02/02/2023
ms.author: danlep
---
| Property | Description | Required | Default |
|---|---|---|---|
| Provider name | Name of credential provider resource in API Management |Yes | N/A | 
| Identity provider  | Select **Azure Active Directory v1** |Yes | N/A | 
| Grant type  | The OAuth 2.0 authorization grant type to use<br/><br/>Depending on your scenario, select either **Authorization code** or **Client credentials**. |Yes | Authorization code | 
|**Authorization URL** | `https://graph.microsoft.com` | Yes | N/A |
| Client ID | The application (client) ID used to identify the Microsoft Entra app | Yes | N/A |
| Client secret | The client secret used for the Microsoft Entra app | Yes | N/A |
| Login URL | The Microsoft Entra login URL  | No | `https://login.windows.net` |
| Resource URL | The URL of the resource that requires authorization<br/><br/> Example: `https://graph.microsoft.com` | Yes | N/A |
| Tenant ID | The tenant ID of your Microsoft Entra app | No | common |  
| Scopes | One or more API permissions for your Microsoft Entra app, separated by the " " character <br/><br/>Example: `ChannelMessage.Read.All User.Read` | No | API permissions set in Microsoft Entra app | 
