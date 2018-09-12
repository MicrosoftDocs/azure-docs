---
title: How to fill out specific fields for a custom-developed application | Microsoft Docs
description: Guidance on how to fill out specific fields when you are registering a custom developed application with Azure AD
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/11/2018
ms.author: celested

---

# How to fill out specific fields for a custom-developed application

This article gives you a brief description of all the available fields in the application registration form in the [Azure portal](https://portal.azure.com).

## Register a new application

-   To register a new application, navigate to the [Azure portal](https://portal.azure.com).

-   From the left navigation pane, click **Azure Active Directory.**

-   Choose **App registrations** and click **Add**.

-   This open up the application registration form.

## Fields in the application registration form


| Field            | Description                                                                              |
|------------------|------------------------------------------------------------------------------------------|
| Name             | The name of the application. It should have a minimum of four characters.                |
| Application Type | **Web app/Web API**: An application that represents a web application, a web API or both 
| |**Native**: An application that can be installed on a user's device or computer           |
| Sign-on URL      | The URL where users can sign in to use your application                                  |

Once you have filled the above fields, the application is registered in the Azure portal, and you are redirected to the application page. The **Settings** button on the application pane opens up the Settings page, which has more fields for you to customize your application. The table below describes all the fields in the Settings page. note that you would only see a subset of these fields, depending on whether you created a web application or a native application.

| Field           | Description                                                                                                                                                                                                                                                                                                     |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Application ID  | When you register an application, Azure AD assigns your application an Application ID. The application ID can be used to uniquely identify your application in authentication requests to Azure AD, as well as to access resources like the Graph API.                                                          |
| App ID URI      | This should be a unique URI, usually of the form **https://&lt;tenant\_name&gt;/&lt;application\_name&gt;.** This is used during the authorization grant flow, as a unique identifier to specify the resource which the token should be issued for. It also becomes the 'aud' claim in the issued access token. |
| Upload new logo | You can use this to upload a logo for your application. The logo must be in .bmp, .jpg or .png format, and the file size should be less than 100KB. The dimensions for the image should be 215x215 pixels, with central image dimensions of 94x94 pixels.                                                       |
| Home page URL   | This is the sign-on URL specified during application registration.                                                                                                                                                                                                                                              |
| Logout URL      | This the single sign-out logout URL. Azure AD sends a logout request to this URL when the user clears their session with Azure AD using any other registered application.                                                                                                                                       |
| Multi-tenanted  | This switch specifies whether the application can be used by multiple tenants. Typically, this means that external organizations can use your application by registering it in their tenant and granting access to their organization's data.                                                                   |
| Reply URLs      | The reply URLs are the endpoints where Azure AD returns any tokens that your application requests.                                                                                                                                                                                                          |
| Redirect URIs   | For native applications, this is where the user is sent after successful authorization. Azure AD check that the redirect URI your application supplies in the OAuth 2.0 request matches one of the registered values in the portal.                                                            |
| Keys            | You can create Keys to programmatically access web APIs secured by Azure AD without any user interaction. From the \*\*Keys\*\* page, enter a key description and the expiration date and save to generate the key. Make sure to save it somewhere secure, as you won't be able to access it later.             |

## Next steps
[Managing Applications with Azure Active Directory](../manage-apps/what-is-application-management.md)
