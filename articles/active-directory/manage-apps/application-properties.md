---
title: 'Properties of an enterprise application'
description: Learn about the properties of an enterprise application in Microsoft Entra ID.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 08/29/2023
ms.author: jomondi
ms.reviewer: ergreenl
ms.custom: enterprise-apps

#Customer intent: As an administrator of a Microsoft Entra tenant, I want to learn more about the properties of an enterprise application that I can configure.
---

# Properties of an enterprise application

This article describes the properties that you can configure for an enterprise application in your Microsoft Entra tenant. To configure the properties, see [Configure enterprise application properties](add-application-portal-configure.md).

## Enabled for users to sign in?

If this option is set to **Yes**, then assigned users are able to sign in to the application from the My Apps portal, the User access URL, or by navigating to the application URL directly. If assignment is required, then only users who are assigned to the application are able to sign-in. If assignment is required, applications must be assigned to get a token.

If this option is set to **No**, then no users are able to sign in to the application, even if they're assigned to it. Tokens aren't issued for the application.  

## Name

This property is the name of the application that users see on the My Apps portal. Administrators see the name when they manage access to the application. Other tenants see the name when integrating the application into their directory.

It's recommended that you choose a name that users can understand. This is important because this name is visible in the various portals, such as My Apps and Microsoft 365 Launcher.

## Homepage URL

If the application is custom-developed, the homepage URL is the URL that a user can use to sign in to the application. For example, it's the URL that is launched when the application is selected in the My Apps portal. If this application is from the Microsoft Entra Gallery, this URL is where you can go to learn more about the application or its vendor.

The homepage URL can't be edited within enterprise applications. The homepage URL must be edited on the application object.

## Logo

This is the application logo that users see on the My Apps portal and the Office 365 application launcher. Administrators also see the logo in the Microsoft Entra gallery.

Custom logos must be exactly 215x215 pixels in size and be in the PNG format. You should use a solid color background with no transparency in your application logo. The logo file size can't be over 100 KB.

## Application ID

This property is the unique identifier for the application in your directory. You can use this application ID if you ever need help from Microsoft Support. You can also use the identifier to perform operations using the Microsoft Graph APIs or the Microsoft Graph PowerShell SDK.

## Object ID

This is the unique identifier of the service principal object associated with the application. This identifier can be useful when performing management operations against this application using PowerShell or other programmatic interfaces. This identifier is different than the identifier for the application object.

The identifier is used to update information for the local instance of the application, such as assigning users and groups to the application. The identifier can also be used to update the properties of the enterprise application or to configure single-sign on.

## Assignment required

This setting controls who or what in the directory can obtain an access token for the application. You can use this setting to further lock down access to the application and let only specified users and applications obtain access tokens.

This option determines whether or not an application appears on the My Apps portal. To show the application there, assign an appropriate user or group to the application. This option has no effect on users' access to the application when it's configured for any of the other single sign-on modes.

If this option is set to **Yes**, then users and other applications or services must first be assigned this application before being able to access it.

If this option is set to **No**, then all users are able to sign in, and other applications and services are able to obtain an access token to the application. This option also allows any external users that may have been invited into your organization to sign in.

This option only applies to the following types of applications and services:

- Applications using SAML
- OpenID Connect
- OAuth 2.0
- WS-Federation for user sign
- Application Proxy applications with Microsoft Entra preauthentication enabled
- Applications or services for which other applications or service are requesting access tokens

## Visible to users

Makes the application visible in My Apps and the Microsoft 365 Launcher

If this option is set to **Yes**, then assigned users see the application on the My Apps portal and Microsoft 365 app launcher.

If this option is set to **No**, then no users see this application on their My Apps portal and Microsoft 365 launcher.

Make sure that a homepage URL is included or else the application can't be launched from the My Apps portal.

Regardless of whether assignment is required or not, only assigned users are able to see this application in the My Apps portal. If you want certain users to see the application in the My Apps portal, but everyone to be able to access it, assign the users in the **Users and Groups** tab, and set assignment required to **No**.

## Notes

You can use this field to add any information that is relevant for the management of the application. The field is a free text field with a maximum size of 1024 characters.

## Next steps

Learn where to go to configure the properties of an enterprise application.

- [Configure enterprise application properties](add-application-portal-configure.md)
