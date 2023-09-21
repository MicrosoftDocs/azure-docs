---
title: My Apps portal overview
description: Learn about how to manage applications in the My Apps portal.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 11/24/2022
ms.author: jomondi
ms.reviewer: saibandaru
ms.custom: contperf-fy23q1, enterprise-apps
#Customer intent: As a Microsoft Entra administrator, I want to make applications available to users in the My Apps portal.

---

# My Apps portal overview

My Apps is a web-based portal that is used for managing and launching applications in Microsoft Entra ID. To work with applications in My Apps, use an organizational account in Microsoft Entra ID and obtain access granted by the Microsoft Entra administrator. My Apps is separate from the Microsoft Entra admin center and doesn't require users to have an Azure subscription or Microsoft 365 subscription.

Users access the My Apps portal to:

- Discover applications to which they have access
- Request new applications that the organization supports for self-service
- Create personal collections of applications
- Manage access to applications

The following conditions determine whether an application in the enterprise applications list in the Microsoft Entra admin center appears to a user or group in the My Apps portal:

- The application is set to be visible in its properties
- The application is assigned to the user or group

> [!NOTE]
> The **Users can only see Office 365 apps in the Office 365 portal** property in the Microsoft Entra admin center can affect whether users can only see Office 365 applications in the Office 365 portal. If this setting is set to **No**, then users will be able to see Office 365 applications in both the My Apps portal and the Office 365 portal. This setting can be found under **Manage** in **Enterprise applications > User settings**.

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

When signed in to the [My Apps](https://myapps.microsoft.com) portal, the applications that have been made visible are shown. For an application to be visible in the My Apps portal, set the appropriate properties in the [Microsoft Entra admin center](https://entra.microsoft.com). Also in the Microsoft Entra admin center, assign a user or group with the appropriate members.

In the My Apps portal, to search for an application, enter an application name in the search box at the top of the page to find an application. The applications that are listed can be formatted in **List view** or a **Grid view**.

:::image type="content" source="./media/myapps-overview/myapp-app-list.png" alt-text="Screenshot that shows the search box for the My Apps portal.":::

> [!IMPORTANT]
> It can take several minutes for an application to appear in the My Apps portal after it has been added to the tenant in the Microsoft Entra admin center. There may also be a delay in how soon users can access the application after it has been added.

Applications can be hidden. For more information, see [Hide an Enterprise application](hide-application-from-user-portal.md).

## Assign company branding

In the Microsoft Entra admin center, define the logo and name for the application to represent company branding in the My Apps portal. The banner logo appears at the top of the page, such as the Contoso demo logo shown below.

:::image type="content" source="./media/myapps-overview/banner-logo.png" alt-text="Screenshot that shows the banner logo in the My Apps portal.":::

For more information, see [Add branding to your organization's sign-in page](../fundamentals/how-to-customize-branding.md).

## Manage access to applications

Multiple factors affect how and whether an application can be accessed by users. Permissions that are assigned to the application can affect what can be done with it. Applications can be configured to allow self-service access, or access may be only granted by an administrator of the tenant.

### My Apps Secure Sign-in Extension

Install the My Apps secure sign-in extension to sign in to some applications. The extension is required for sign-in to password-based SSO applications, or to applications that are accessed by Microsoft Entra application proxy. Users are prompted to install the extension when they first launch the password-based single sign-on or an Application Proxy application.

To integrate these applications, define a mechanism to deploy the extension at scale with supported browsers. Options include:

- User-driven download and configuration for Chrome, Microsoft Edge, or IE
- Configuration Manager for Internet Explorer

The extension allows users to launch any application from its search bar, finding access to recently used applications, and having a link to the My Apps portal. For applications that use password-based SSO or accessed by using Microsoft Entra application proxy, use Microsoft Edge mobile. For other applications, any mobile browser can be used. Be sure to enable password-based SSO in the mobile settings, which can be off by default. For example, **Settings -> Privacy and Security -> Microsoft Entra Password SSO**.

To download and install the extension:

- **Microsoft Edge** - From the Microsoft Store, go to the [My Apps Secure Sign-in Extension](https://microsoftedge.microsoft.com/addons/detail/my-apps-secure-signin-ex/gaaceiggkkiffbfdpmfapegoiohkiipl) feature, and then select **Get to get the extension for Microsoft Edge legacy browser**.
- **Google Chrome** - From the Chrome Web Store, go to the [My Apps Secure Sign-in Extension](https://chrome.google.com/webstore/detail/my-apps-secure-sign-in-ex/ggjhpefgjjfobnfoldnjipclpcfbgbhl) feature, and then select **Add to Chrome**.

An icon is added to the right of the address bar, which enables sign in and customization of the extension.

> [!NOTE]
> Sign-in into the extension is currently not supported for Guest B2B Microsoft Accounts (MSA).

### Permissions

Permissions that have been granted to an application can be reviewed by selecting the upper right corner of the tile that represents the application and then selecting **Manage your application**.

The permissions that are shown have been consented to by an administrator or have been consented to by the user. Permissions consented to by the user can be revoked by the user.

### Self-service access

Access can be granted on a tenant level, assigned to specific users, or from self-service access. Before users can self-discover applications from the My Apps portal, enable self-service application access in the Microsoft Entra admin center. This feature is available for applications when added using these methods:

- The Microsoft Entra application gallery
- Microsoft Entra application proxy
- Using user or admin consent

Enable users to discover and request access to applications by using the My Apps portal. To do so, complete the following tasks in the Microsoft Entra admin center:

- Enable self-service group management
- Enable the application for single sign-on
- Create a group for application access

When users request access, they request access to the underlying group, and group owners can be delegated permission to manage the group membership and application access. Approval workflows are available for explicit approval to access applications. Users who are approvers receive notifications within the My Apps portal when there are pending requests for access to the application.

For more information, see [Enable self-service application assignment](manage-self-service-access.md)

### Single sign-on

Enable single sign-on (SSO) in the Microsoft Entra admin center for all applications that are made available in the My Apps portal whenever possible. If SSO is set up, users have a seamless experience without the need to enter their credentials. To learn more, see [Single sign-on options in Microsoft Entra ID](what-is-single-sign-on.md#single-sign-on-options).

Applications can be added by using the Linked SSO option. Configure an application tile that links to the URL of the existing web application. Linked SSO allows the direction of users to the My Apps portal without migrating all the applications to Microsoft Entra SSO. Gradually move to Microsoft Entra SSO-configured applications to prevent disrupting the users’ experience.

For more information, see [Add linked single sign-on to an application](configure-linked-sign-on.md).

## Create collections

By default, all applications are listed together on a single page. Collections can be used to group together related applications and present them on a separate tab, making them easier to find. For example, use collections to create logical groupings of applications for specific job roles, tasks, projects, and so on. Every application to which a user has access appears in the default Apps collection, but a user can remove applications from the collection.

Users can also customize their experience by:

- Creating their own application collections
- Hiding and reordering application collections

Applications can be hidden from the My Apps portal by a user or administrator. A hidden application can still be accessed from other locations, such as the Microsoft 365 portal. Only 950 applications to which a user has access can be accessed through the My Apps portal.

For more information, see [Create collections on the My Apps portal](access-panel-collections.md).

## Next steps

Learn more about application management in [What is enterprise application management?](what-is-application-management.md)
