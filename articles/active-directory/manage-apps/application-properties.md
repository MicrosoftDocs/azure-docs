---
title: 'Properties of an enterprise application'
titleSuffix: Azure AD
description: Learn about the properties of an enterprise application in Azure Active Directory.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 09/22/2021
ms.author: davidmu
ms.reviewer: ergreenlz
#Customer intent: As an administrator of an Azure AD tenant, I want to learn more about the properties of an enterprise application that I can configure.
---

# Properties of an enterprise application

This article describes the properties that you can configure for an enterprise application in your Azure Active Directory (Azure AD) tenant. To configure the properties, see [Configure enterprise application properties](add-application-portal-configure.md).

## Enabled for users to sign-in? 

If this option is set to **Yes**, then assigned users are able to sign in to the application from the My Apps portal, the User access URL, or by navigating to the application URL directly. If assignment is required, then only users who are assigned to the application are able to sign-in.

If this option is set to **No**, then no users are able to sign in to the application, even if they are assigned to it. Tokens aren't issued for the application.  

## Name 

This is the name of the application that users see on the My Apps portal. Administators see the name when managing access to the application. Other tenants see the name when integrating the application into their directory. 

It is recommended that you choose a name that users can understand when making the application visible in the various portals, such as My Apps and O365 Launcher. 

## Homepage URL 

If the application is custom-developed, the homepage URL is the URL that a user can use to sign in to the application. For example, it is the URL that is launched when the application is clicked in the My Apps portal. If this is a pre-integrated application from the Azure AD Gallery, this is the URL where you can go to learn more about the application or its vendor. 

The homepage URL can't be edited within enterprise applications. The homepage URL must be edited on the application object. 

## Logo 

This is the application logo that users see on the My Apps portal, in the Office 365 application launcher, and when administrators view the application in the application gallery.

Custom logos must be exactly 215x215 pixels in size and be in the PNG format. It is recommended that you use a solid color background with no transparency in your application logo so that it appears best to users. The central image dimensions should be 94x94 pixels and the logo file size cannot be over 100 KB.

## Application ID 

This is the unique identifier for the application in your directory. You can use this application ID if you ever need help from Microsoft Support, or if you want to perform operations against this specific instance of the application using the Microsoft Graph APIs or the Microsoft Graph PowerShell SDK.

## Object ID 

This is the unique identifier of the service principal object associated with the application. This ID can be useful when performing management operations against this application using PowerShell or other programmatic interfaces. This is a different identifier than the ID for the application object. 

The ID is used to update information for the local instance of the application, such as assigning users and groups to the application, updating the properties of the enterprise application, or configuring single-sign on. 

## Assignment required 

This option doesn't affect whether or not an application appears on the My Apps portal. To show the application there, assign an appropriate user or group to the application. This option has no effect on users' access to the application when it is configured for any of the other single sign-on modes. 

If this option is set to **Yes**, then users and other applications or services must first be assigned this application before being able to access it. 
 
If this option is set to **No**, then all users are able to sign in, and other applications and services are able to obtain an access token to the application. 
 
This option only applies to the following types of applications and services: applications using SAML, OpenID Connect, OAuth 2.0, or WS-Federation for user sign-in, Application Proxy applications with Azure AD pre-authentication enabled, and applications or services for which other applications or service are requesting access tokens. 

## Visible to users 

Makes the application visible in My Apps and the O365 Launcher 

If this option is set to **Yes**, then assigned users see the application on the My Apps portal and O365 app launcher. 

If this option is set to **No**, then no users see this application on their My Apps portal and O365 launcher. 

Make sure that a homepage URL is included or else the application can't be launched from the application.

Regardless of whether assignment is required or not, only assigned users are able to see this application in the My Apps portal. If you want certain users to see the application in the My Apps portal, but everyone to be able to access it, assign the users in the **Users and Groups** tab, and set assignment required to **No**. 

## Notes 

You can use this field to add any information that is relevant for the management of the application. The field is a free text field with a maximum size of 1024 characters. 

## Next steps

Learn where to go to configure the properties of an enterprise application.

- [Configure enterprise application properties](add-application-portal-configure.md)