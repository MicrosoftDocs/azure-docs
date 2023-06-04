---
title: Manage user flow resources with Microsoft Graph
description: Learn how to manage user flow resources in an Azure AD for customers tenant by calling the Microsoft Graph API and using an application identity to automate the process.
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

#Customer intent: As a dev, devops, I want to learn how to use the Microsoft Graph to manage user flow operations in my Azure AD customer tenant.
---

# Manage Azure Active Directory for customers user flow resources with Microsoft Graph

Using the Microsoft Graph API allows you to manage resources in your Azure Active Directory (AD) for customers directory. The following Microsoft Graph API operations are supported for the management of resources related to user flows. Each link in the following sections targets the corresponding page within the Microsoft Graph API reference for that operation.

[!INCLUDE [preview-alert](../customers/includes/preview-alert/preview-alert-ciam.md)]

> [!NOTE]
> You can also programmatically create an Azure AD for customers directory itself, along with the corresponding Azure resource linked to an Azure subscription. This functionality isn't exposed through the Microsoft Graph API, but through the Azure REST API. For more information, see [Directory Tenants - Create Or Update](/rest/api/azurestack/directory-tenants/create-or-update).

## User flows (Preview)

User flows are used to enable a self-service sign-up experience for users within an Azure AD customer tenant.  User flows define the experience the end user sees while signing up, including which identity providers they can use to authenticate, along with which attributes are collected as part of the sign-up process.  The sign-up experience for an application is defined by a user flow, and multiple applications can use the same user flow.

Configure pre-built policies for sign-up, sign-in, combined sign-up and sign-in, password reset, and profile update.

- [List user flows](/graph/api/identitycontainer-list-authenticationeventsflows)
- [Create a user flow](/graph/api/identitycontainer-post-authenticationeventsflows)
- [Get a user flow](/graph/api/authenticationeventsflow-get)
- [Delete a user flow](/graph/api/authenticationeventsflow-delete)

## Identity providers (Preview)

Get the identity providers that are defined for an external identities self-service sign-up user flow that's represented by an externalUsersSelfServiceSignupEventsFlow object type.

- [List identity providers](/graph/api/onauthenticationmethodloadstartexternalusersselfservicesignup-list-identityproviders)
- [Add identity provider](/graph/api/onauthenticationmethodloadstartexternalusersselfservicesignup-post-identityproviders)
- [Remove identity provider](/graph/api/onauthenticationmethodloadstartexternalusersselfservicesignup-delete-identityproviders)

## Attributes (Preview)

- [List attributes](/graph/api/onattributecollectionexternalusersselfservicesignup-list-attributes)
- [Add attributes](/graph/api/onattributecollectionexternalusersselfservicesignup-post-attributes)
- [Remove attributes](/graph/api/onattributecollectionexternalusersselfservicesignup-delete-attributes)


## How to programmatically manage Microsoft Graph

When you want to manage Microsoft Graph, you can either do it as the application using the application permissions, or you can use delegated permissions. For delegated permissions, either the user or an administrator consents to the permissions that the app requests. The app is delegated with the permission to act as a signed-in user when it makes calls to the target resource. Application permissions are used by apps that do not require a signed in user present and thus require application permissions. Because of this, only administrators can consent to application permissions.

> [!NOTE]
> Delegated permissions for users signing in through user flows or custom policies cannot be used against delegated permissions for Microsoft Graph API.

## Next steps

- To learn more about the Microsoft Graph API, see [Microsoft Graph overview](/graph/overview).  