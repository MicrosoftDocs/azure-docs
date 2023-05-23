---
title: Manage branding resources with Microsoft Graph
description: Learn how to manage branding resources in an Azure AD for customers tenant by calling the Microsoft Graph API. You use an application identity to automate the process.
services: active-directory
author: garrodonnell
manager: celested
ms.author: godonnell
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/23/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn how to use the Microsoft Graph to manage operations in my Azure AD customer tenant.
---

# Manage Azure Active Directory for customers company branding with the Microsoft Graph API

Using the Microsoft Graph API allows you to manage resources in your Azure Active Directory (AD) for customers directory. The following Microsoft Graph API operations are supported for the management of resources related to branding. Each link in the following sections targets the corresponding page within the Microsoft Graph API reference for that operation.

> [!NOTE]
> You can also programmatically create an Azure AD for customers directory itself, along with the corresponding Azure resource linked to an Azure subscription. This functionality isn't exposed through the Microsoft Graph API, but through the Azure REST API. For more information, see [Directory Tenants - Create Or Update](/rest/api/azurestack/directory-tenants/create-or-update).
## Company branding

Customers can customize look and feel of sign-in pages which appear when users sign in to tenant-specific apps. Developers can also read the company's branding information and customize their app experience to tailor it specifically for the signed-in user using their company's branding.

You can't change your original configuration's default language. However, companies can add different branding based on locale. For language-specific branding, see the organizationalBrandingLocalization object.

- [Get company branding](/graph/api/organizationalbranding-get)
- [Update company branding](/graph/api/organizationalbranding-update)

## Company branding - localization

Resource that supports managing language-specific branding. While you can't change your original configuration's language, this resource allows you to create a new configuration for a different language.

- [List localizations](/graph/api/organizationalbranding-list-localizations)
- [Create localization](/graph/api/organizationalbranding-post-localizations)
- [Get localization](/graph/api/organizationalbrandinglocalization-get)
- [Update localization](/graph/api/organizationalbrandinglocalization-update)
- [Delete localization](/graph/api/organizationalbrandinglocalization-delete)


## How to programmatically manage Microsoft Graph

When you want to manage Microsoft Graph, you can either do it as the application using the application permissions, or you can use delegated permissions. For delegated permissions, either the user or an administrator consents to the permissions that the app requests. The app is delegated with the permission to act as a signed-in user when it makes calls to the target resource. Application permissions are used by apps that do not require a signed in user present and thus require application permissions. Because of this, only administrators can consent to application permissions.

> [!NOTE]
> Delegated permissions for users signing in through user flows or custom policies cannot be used against delegated permissions for Microsoft Graph API.

## Next steps

- To learn more about the Microsoft Graph API, see [Microsoft Graph overview](/graph/overview). 