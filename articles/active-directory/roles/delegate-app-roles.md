---
title: Delegate application management administrator permissions
description: Grant permissions for application access management in Microsoft Entra ID
services: active-directory
documentationcenter: ''
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 03/30/2023
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
#Customer intent: As a Microsoft Entra administrator, I want to reduce overusing the Global Administrator role by delegating app access management to lower-privilege roles.

---

# Delegate app registration permissions in Microsoft Entra ID

This article describes how to use permissions granted by custom roles in Microsoft Entra ID to address your application management needs. In Microsoft Entra ID, you can delegate Application creation and management permissions in the following ways:

- [Restricting who can create applications](#restrict-who-can-create-applications) and manage the applications they create. By default in Microsoft Entra ID, all users can register applications and manage all aspects of applications they create. This can be restricted to only allow selected people that permission.
- [Assigning one or more owners to an application](#assign-application-owners). This is a simple way to grant someone the ability to manage all aspects of Microsoft Entra configuration for a specific application.
- [Assigning a built-in administrative role](#assign-built-in-application-admin-roles) that grants access to manage configuration in Microsoft Entra ID for all applications. This is the recommended way to grant IT experts access to manage broad application configuration permissions without granting access to manage other parts of Microsoft Entra not related to application configuration.
- [Creating a custom role](#create-and-assign-a-custom-role-preview) defining very specific permissions and assigning it to someone either to the scope of a single application as a limited owner, or at the directory scope (all applications) as a limited administrator.

It's important to consider granting access using one of the above methods for two reasons. First, delegating the ability to perform administrative tasks reduces Global Administrator overhead. Second, using limited permissions improves your security posture and reduces the potential for unauthorized access. For guidelines about role security planning, see [Securing privileged access for hybrid and cloud deployments in Microsoft Entra ID](security-planning.md).

## Restrict who can create applications

By default in Microsoft Entra ID, all users can register applications and manage all aspects of applications they create. Everyone also has the ability to consent to apps accessing company data on their behalf. You can choose to selectively grant those permissions by setting the global switches to 'No' and adding the selected users to the Application Developer role.

### To disable the default ability to create application registrations or consent to applications

To disable the default ability to create application registrations or consent to applications, follow these steps to set one or both of these settings for your organization.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator).

1. Browse to **Identity** > **Users** > **User settings**.

1. Set the **Users can register applications** setting to **No**.

    This will disable the default ability for users to create application registrations.

1. Browse to **Identity** > **Enterprise applications** > **Consent and permissions**.

1. Select the **Do not allow user consent** option.

    This will disable the default ability for users to consent to applications accessing company data on their behalf.

### Grant individual permissions to create and consent to applications when the default ability is disabled

Assign the [Application Developer role](../roles/permissions-reference.md#application-developer) to grant the ability to create application registrations when the **Users can register applications** setting is set to No. This role also grants permission to consent on one's own behalf when the **Users can consent to apps accessing company data on their behalf** setting is set to No.

## Assign application owners

Assigning owners is a simple way to grant the ability to manage all aspects of Microsoft Entra configuration for a specific application registration or enterprise application. For more information, see [Assign enterprise application owners](../manage-apps/assign-app-owners.md).

## Assign built-in application admin roles

Microsoft Entra ID has a set of built-in admin roles for granting access to manage configuration in Microsoft Entra ID for all applications. These roles are the recommended way to grant IT experts access to manage broad application configuration permissions without granting access to manage other parts of Microsoft Entra not related to application configuration.

- Application Administrator: Users in this role can create and manage all aspects of enterprise applications, application registrations, and application proxy settings. This role also grants the ability to consent to delegated permissions, and application permissions excluding Microsoft Graph. Users assigned to this role are not added as owners when creating new application registrations or enterprise applications.
- Cloud Application Administrator: Users in this role have the same permissions as the Application Administrator role, excluding the ability to manage application proxy. Users assigned to this role are not added as owners when creating new application registrations or enterprise applications.

For more information and to view the description for these roles, see [Microsoft Entra built-in roles](permissions-reference.md).

Follow the instructions in the [Assign roles to users with Microsoft Entra ID](../fundamentals/how-subscriptions-associated-directory.md) how-to guide to assign the Application Administrator or Cloud Application Administrator roles.

> [!IMPORTANT]
> Application Administrators and Cloud Application Administrators can add credentials to an application and use those credentials to impersonate the application’s identity. The application may have permissions that are an elevation of privilege over the admin role's permissions. An admin in this role could potentially create or update users or other objects while impersonating the application, depending on the application's permissions.
> Neither role grants the ability to manage Conditional Access settings.

## Create and assign a custom role (preview)

Creating custom roles and assigning custom roles are separate steps:

- [Create a custom *role definition*](custom-create.md) and [add permissions to it from a preset list](custom-available-permissions.md). These are the same permissions used in the built-in roles.
- [Create a *role assignment*](custom-assign-powershell.md) to assign the custom role.

This separation allows you to create a single role definition and then assign it many times at different *scopes*. A custom role can be assigned at organization-wide scope, or it can be assigned at the scope if a single Microsoft Entra object. An example of an object scope is a single app registration. Using different scopes, the same role definition can be assigned to Sally over all app registrations in the organization and then to Naveen over only the Contoso Expense Reports app registration.

Tips when creating and using custom roles for delegating application management:
- Custom roles only grant access in the most current app registration blades of the Microsoft Entra admin center. They do not grant access in the legacy app registrations blades.
- Custom roles do not grant access to the Microsoft Entra admin center when the [Restrict access to Microsoft Entra administration portal](../fundamentals/users-default-permissions.md) user setting is set to **Yes**.
- App registrations the user has access to using role assignments only show up in the ‘All applications’ tab on the App registration page. They do not show up in the ‘Owned applications’ tab.

For more information on the basics of custom roles, see the [custom roles overview](custom-overview.md), as well as how to [create a custom role](custom-create.md) and how to [assign a role](custom-assign-powershell.md).

## Troubleshoot

### Symptom - Access denied when you try to register an application

When you try to register an application in Microsoft Entra ID, you get a message similar to the following:

```
Access denied
You do not have access
You don't have permission to register applications in the <directoryName> directory. To request access, contact your administrator.
```

:::image type="content" source="media/delegate-app-roles/app-registrations-access-denied.png" alt-text="Screenshot of access denied message when trying to create a new app registration." lightbox="media/delegate-app-roles/app-registrations-access-denied.png":::

**Cause**

You can't register the application in the directory because your directory administrator has [restricted who can create applications](#restrict-who-can-create-applications).

**Solution**

Contact your administrator to do one of the following:

- Grant you permissions to create and consent to applications by [assigning you the Application Developer role](#grant-individual-permissions-to-create-and-consent-to-applications-when-the-default-ability-is-disabled).
- Create the application registration for you and [assign you as the application owner](#assign-application-owners).

## Next steps

- [Application registration subtypes and permissions](custom-available-permissions.md)
- [Microsoft Entra built-in roles](permissions-reference.md)
