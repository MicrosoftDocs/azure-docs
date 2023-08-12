---
title: Manage resources with Microsoft Graph
description: Learn how to manage user resources in an Azure AD for customers tenant by calling the Microsoft Graph API and using an application identity to automate the process.
services: active-directory
author: garrodonnell
manager: celested
ms.author: godonnell
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 07/12/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn how to use the Microsoft Graph to manage operations in my Azure AD customer tenant.
---

# Manage Azure Active Directory for customers resources with Microsoft Graph
Using the Microsoft Graph API allows you to manage resources in your Azure Active Directory (AD) for customers directory. The following Microsoft Graph API operations are supported for the management of resources related to user flows, custom extensions and custom branding. Each link in the following sections targets the corresponding page within the Microsoft Graph API reference for that operation.

> [!NOTE]
> You can also programmatically create an Azure AD for customers directory itself, along with the corresponding Azure resource linked to an Azure subscription. This functionality isn't exposed through the Microsoft Graph API, but through the Azure REST API. For more information, see [Directory Tenants - Create Or Update](/rest/api/azurestack/directory-tenants/create-or-update).

### Register a Microsoft Graph API application
In order to use the Microsoft Graph API, you need to register an application in your Azure AD for customers tenant. This application will be used to authenticate and authorize your application to call the Microsoft Graph API.

During registration, you'll specify a **Redirect URI** which redirects the user after authentication with Azure Active Directory. The app registration process also generates a unique identifier known as an **Application (client) ID**. 

The following steps show you how to register your app in the Microsoft Entra admin center:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).

1. If you have access to multiple tenants, make sure you use the directory that contains your Azure AD for customers tenant:

    1. Select the **Directories + subscriptions** icon :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the portal toolbar. 

    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD for customers directory in the **Directory name** list, and then select **Switch**.

1. On the sidebar menu, select **Azure Active Directory**.

1. Select **Applications**, then select **App Registrations**.

1. Select **+ New registration**.

1. In the **Register an application page** that appears, enter your application's registration information:

    1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example *ciam-client-app*.

    1. Under **Supported account types**, select **Accounts in this organizational directory only**.

1. Select **Register**.

1. The application's **Overview pane** is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.

### Grant API Access to your application

For your application to access data in Microsoft Graph API, grant the registered application the relevant application permissions. The effective permissions of your application are the full level of privileges implied by the permission. For example, to create, read, update, and delete every user in your Azure AD for customers tenant, add the User.ReadWrite.All permission.

1. Under **Manage**, select **API permissions**.

1. Under **Configured permissions**, select **Add a permission**.

1. Select the **Microsoft APIs** tab, then select **Microsoft Graph**.

1. Select **Application permissions**.

1. Expand the appropriate permission group and select the check box of the permission to grant to your management application. For example:

    * **User** > **User.ReadWrite.All**: For user migration or user management scenarios.

    * **Group** > **Group.ReadWrite.All**: For creating groups, read and update group memberships, and delete groups.

    * **AuditLog** > **AuditLog.Read.All**: For reading the directory's audit logs.

    * **Policy** > **Policy.ReadWrite.TrustFramework**: For continuous integration/continuous delivery (CI/CD) scenarios. For example, custom policy deployment with Azure Pipelines.

1. Select **Add permissions**. As directed, wait a few minutes before proceeding to the next step.

1. Select **Grant admin consent for (your tenant name)**.

1. If you are not currently signed-in with Global Administrator account, sign in with an account in your Azure AD for customers tenant that's been assigned at least the *Cloud application administrator* role and then select **Grant admin consent for (your tenant name)**.

1. Select **Refresh**, and then verify that "Granted for ..." appears under **Status**. It might take a few minutes for the permissions to propagate.

After you have registered your application, you need to add a client secret to your application. This client secret will be used to authenticate your application to call the Microsoft Graph API.

The application uses the client secret to prove its identity when it requests for tokens.

1. From the **App registrations** page, select the application that you created (such as *ciam-client-app*) to open its **Overview** page.

1. Under **Manage**, select **Certificates & secrets**.

1. Select **New client secret**.

1. In the **Description** box, enter a description for the client secret (for example, `ciam app client secret`).

1. Under **Expires**, select a duration for which the secret is valid (per your organizations security rules), and then select **Add**.

1. Record the secret's **Value**. You'll use this value for configuration in a later step.

> [!NOTE] 
> The secret value won't be displayed again, and is not retrievable by any means, after you navigate away from the certificates and secrets page, so make sure you record it. <br> For enhanced security, consider using **certificates** instead of client secrets.

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

> [!NOTE]
> Delegated permissions for users signing in through user flows cannot be used against delegated permissions for Microsoft Graph API.