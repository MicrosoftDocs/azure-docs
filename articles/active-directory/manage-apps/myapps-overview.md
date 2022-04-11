---
title: My Apps portal overview
description: Learn about to manage applications in the My Apps portal.
titleSuffix: Azure AD
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 09/02/2021
ms.author: davidmu
ms.reviewer: lenalepa
---

# My Apps portal overview

[My Apps](https://myapps.microsoft.com) is a web-based portal that is used for managing and launching applications in Azure Active Directory (Azure AD). To work with applications in My Apps, you need an organizational account in Azure AD and access granted by the Azure AD administrator. My Apps is separate from the Azure portal and does not require users to have an Azure subscription or Microsoft 365 subscription.
Users access the My Apps portal to:

- Discover applications to which they have access
- Request access to new applications that are configured for self-service
- Create personal collections of applications
- Manage access to applications

Any application in the Azure Active Directory enterprise applications list appears when both of the following conditions are met:

- The visibility property for the application is set to `true`
- The application is assigned to any user or group

Administrators can configure:

- Consent experiences including terms of service
- Self-service application discovery and access requests
- Collections of applications
- Company and application branding

## Understand application properties

Properties that are defined for an application can affect how the user interacts with it in the My Apps portal.

- **Enabled for users to sign in?** – If this property is set to **Yes**, then assigned users are able to sign into the application from the My Apps portal.
- **Name** - The name of the application that users see on the My Apps portal. Administrators see the name when they manage access to the application.
- **Homepage URL** -The URL that is launched when the application is selected in the My Apps portal.
- **Logo** - The application logo that users see on the My Apps portal.
- **Visible to users** - Makes the application visible in the My Apps portal. When this value is set to **Yes**, applications may still not appear in the My Apps portal if they don’t yet have users or groups assigned to it. Only assigned users are able to see the application in the My Apps portal.

For more information, see [Properties of an enterprise application](application-properties.md).

### Discover applications

When signed in to the My Apps portal, a combination of default applications and the applications that have been made visible are shown. For an application to be visible in the My Apps portal, the appropriate properties need to be set and a user or group with the appropriate members must be assigned.

You can search for applications by entering the name in the search box at the top of the page. The applications that are listed can be formatted in **List view** or a **Grid view**.

:::image type="content" source="../media/myapps-overview/myapp-app-list.png" alt-text="Screenshot that shows the search box for the My Apps portal.":::

> [!IMPORTANT]
> It can take several minutes for an application to appear in the My Apps portal after it has been added to the tenant. There may also be a delay in how soon users can access the application after it has been added.

Applications can be hidden. For more information, see [Hide an Enterprise application](hide-application-from-user-portal.md).

## Assign company branding

How the application is represented in the My Apps portal can be controlled by defining the logo and name that is displayed to users in the application's properties.

When configuring company branding, the banner logo can be defined. The banner logo appears at the top of the page, such as the Contoso demo logo shown below.

:::image type="content" source="../media/myapps-overview/banner-logo.png" alt-text="Screenshot that shows the banner logo in the My Apps portal.":::

For more information, see [Add branding to your organization's sign-in page](../fundamentals/customize-branding.md).

## Access applications

Multiple factors affect how and whether an application can be accessed by users. Permissions that are assigned to the application can affect what can be done with it. Applications can be configured to allow self-service access, and access can be only granted by an administrator of the tenant.

### My Apps Secure Sign-in Extension

To sign in to password-based SSO applications, or to applications that are accessed by Azure AD Application Proxy, users need to install and use the My Apps secure sign-in extension. Users are prompted to install the extension when they first launch the password-based SSO or Application Proxy application.

If you must integrate these applications, you should define a mechanism to deploy the extension at scale with supported browsers. Options include:

- User-driven download and configuration for Chrome, Firefox, Microsoft Edge, or IE
- Configuration Manager for Internet Explorer

The extension allows users to launch any app from its search bar, finding access to recently used applications, and having a link to the My Apps page.
For applications that use password-based SSO or accessed by using Microsoft Azure AD Application Proxy, you must use Microsoft Edge mobile. For other applications, any mobile browser can be used. Be sure to enable password-based SSO in your mobile settings, which can be off by default. For example, **Settings -> Privacy and Security -> Azure AD Password SSO**.

### Permissions

[Not sure how this is supposed to work in the My Apps portal]

[Edit or revoke application permissions](edit-revoke-permissions.md)

### Self-service access

Access can be granted on a tenant level, assigned to specific users, or from self-service access. Before your users can self-discover applications from the My Apps portal, you need to enable Self-service application access for the applications. This functionality is available for applications that were added from the Azure AD Gallery, Azure AD Application Proxy, or were added using user or admin consent.

You can enable users to discover and request access to applications by using the My Apps portal. To do so, you must first:

- Enable self-service group management
- Enable the application for single sign-on
- Create a group for application access

When users request access, they request access to the underlying group, and group owners can be delegated permission to manage the group membership and thus application access. Approval workflows are available for explicit approval to access applications. Users who are approvers will receive notifications within the My Apps portal when there are pending requests for access to the application.

For more information, see [Enable self-service application assignment](manage-self-service-access.md)

### Single sign-on

It's best if SSO is enabled for all apps in the My Apps portal so that users have a seamless experience without the need to enter their credentials. To learn more, see [Single sign-on options in Azure AD](what-is-single-sign-on.md#single-sign-on-options).

Applications can be added by using the Linked SSO option. You can configure an application tile that links to the URL of your existing web application. Linked SSO allows you to start directing users to the My Apps portal without migrating all the applications to Azure AD SSO. You can gradually move to Azure AD SSO-configured applications without disrupting the users’ experience.

### Sign in and start applications

Access the My Apps portal on your computer
Access the My Apps portal on mobile Edge
Add a new app to the My Apps portal

For more information, see [Sign-in and start applications from My Apps](start-sign-apps.md).

## Create collections

By default, all applications are listed together on a single page. But you can use collections to group together related applications and present them on a separate tab, making them easier to find. For example, you can use collections to create logical groupings of applications for specific job roles, tasks, projects, and so on. For information, see Create collections on the My Apps portal.

Every Azure AD application to which a user has access will appear on My Apps in the Apps collection. Use collections to group related applications and present them on a separate tab, making them easier to find. For example, you can use collections to create logical groupings of applications for specific job roles, tasks, projects, and so on.

End users can also customize their experience by:

- Creating their own app collections
- Hiding and reordering app collections

There’s an option to hide apps from the My Apps portal, while still allowing access from other locations, such as the Microsoft 365 portal. Learn more: Hide an application from user’s experience in Azure Active Directory. Only 950 apps to which a user has access can be accessed through My Apps. This includes apps hidden by either the user or the administrator.

For more information, see [Create collections on the My Apps portal](access-panel-collections.md).

## Next steps

Learn more about application management in [What is enterprise application management?](what-is-application-management.md)
