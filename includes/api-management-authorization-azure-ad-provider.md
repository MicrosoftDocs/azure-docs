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
| Identity provider  | Select **Azure Active Directory** |Yes | N/A | 
| Grant type  | The authorization grant type to use. Depending on your scenario, select either **Authorization Code** or **Client Credentials**. |Yes | N/A | 
| Client ID | The application (client) ID used to identify the Azure AD app | Yes | N/A |
| Client secret | The client secret used for the Azure AD app | Yes | N/A |
| Login URL | The Azure AD login URL  | No | `https://login.windows.net` |
| Resource URL | The URL of the resource that requires authorization<br/><br/> Example: `https://graph.microsoft.com` | Yes | N/A |
| Tenant ID | The tenant ID of your Azure Active Directory app | No | common |  
| Scopes | Space-delimited list of API permissions for your Azure AD app <br/><br/>Example: `ChannelMessage.Read.All User.Read` | No | API permissions set in Azure AD app | 
| Authorization name | Name of an authorization using the authorization provider | Yes | N/A |