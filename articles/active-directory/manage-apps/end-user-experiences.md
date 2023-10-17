---
title: End-user experiences for applications
description: Learn about the customizable ways to deploy applications to end users in your organization with Microsoft Entra ID
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 12/08/2022
ms.author: jomondi
ms.reviewer: lenalepa
ms.custom: enterprise-apps
---

# End-user experiences for applications

Microsoft Entra ID provides several customizable ways to deploy applications to end users in your organization:

- Microsoft Entra My Apps
- Microsoft 365 application launcher
- Direct sign-on to federated apps
- Deep links to federated, password-based, or existing apps

Which method(s) you choose to deploy in your organization is your discretion.

<a name='azure-ad-my-apps'></a>

## Microsoft Entra My Apps

[My Apps](https://myapps.microsoft.com) is a web-based portal that allows an organization user in Microsoft Entra ID to view and launch applications to which they have been granted access by the Microsoft Entra administrator. If you're an end user with [Microsoft Entra ID P1 or P2](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing), you can also utilize self-service group management capabilities through My Apps.

By default, all applications are listed together on a single page. But you can use collections to group together related applications and present them on a separate tab, making them easier to find. For example, you can use collections to create logical groupings of applications for specific job roles, tasks, projects, and so on. For information, see [Create collections on the My Apps portal](access-panel-collections.md).

My Apps is separate from the Microsoft Entra admin center and doesn't require users to have an Azure subscription or Microsoft 365 subscription.

For more information on Microsoft Entra My Apps, see the [introduction to My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Microsoft 365 application launcher

Microsoft 365 application launcher is the recommended app launching solution for organizations using Microsoft 365.

For more information about the Office 365 application launcher, see [Have your app appear in the Office 365 app launcher](/previous-versions/office/office-365-api/).

## Direct sign-on to federated apps

Most federated applications that support SAML 2.0, WS-Federation, or OpenID connect also support the ability for users to start at the application. The users then get signed in through Microsoft Entra ID either by automatic redirection or by selecting a link to sign in. Direct sign-on is a service provider-initiated sign-on, and most federated applications in Microsoft Entra application gallery support it. See the documentation linked from the app’s single sign-on configuration wizard in the Microsoft Entra admin center for details.

## Direct sign-on links

Microsoft Entra ID also supports direct single sign-on links to individual applications that support password-based single sign-on, linked single sign-on, and any form of federated single sign-on.

Direct sign-on links are crafted URLs that send a user through the Microsoft Entra sign-in process for a specific application. The user doesn't need to launch the application from My Apps or Microsoft 365. These **User access URLs** can be found under the properties of available enterprise applications. In the Microsoft Entra admin center, select **Identity** > **Applications** > **Enterprise applications**. Select the application, and then select **Properties**.

![Example of the User access URL in Twitter properties](media/end-user-experiences/direct-sign-on-link.png)

Direct sign-on links can be copied and pasted anywhere you want to provide a sign-in link to the selected application. They can be placed in an email, or in any custom web-based portal that you've set up for user application access. The following URL is an example of a Microsoft Entra ID direct single sign-on URL for Twitter:

`https://myapps.microsoft.com/signin/Twitter/230848d52c8745d4b05a60d29a40fced`

Similar to organization-specific URLs for My Apps, you can further customize direct sign-on URL by adding one of the active or verified domains for your directory after the *myapps.microsoft.com* domain. Customizing direct sign-on URL ensures any organizational branding is loaded immediately on the sign-in page without the user needing to enter their user ID first:

`https://myapps.microsoft.com/contosobuild.com/signin/Twitter/230848d52c8745d4b05a60d29a40fced`

When an authorized user selects one of these application-specific links, they first see their organizational sign-in page (assuming they aren't already signed in). After sign-in, they're redirected to their app without stopping at My Apps first. If the user is missing prerequisites to access the application, such as the password-based single sign browser extension, then the link prompts the user to install the missing extension. The link URL also remains constant if the single sign-on configuration for the application changes.

These links use the same access control mechanisms as My Apps and Microsoft 365. Only those users or groups who have been assigned to the application in the Microsoft Entra admin center are able to successfully authenticate. However, any user who is unauthorized see's a message explaining that they haven't been granted access. The unauthorized user is given a link to load My Apps to view available applications that they do have access to.

[!INCLUDE [portal updates](../includes/portal-update.md)]

## Manage preview settings

As an admin, you can choose to try out new app launcher features while they are in preview. Enabling a preview feature means that the feature is turned on for your organization and is reflected in the My Apps portal and other app launchers for all your users.

To enable or disable previews for your app launchers:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. On the left menu, select **App launchers**, then select **Settings**.
1. Under **Preview settings**, toggle the checkboxes for the previews you want to enable or disable. To opt into a preview, toggle the associated checkbox to the checked state. To opt out of a preview, toggle the associated checkbox to the unchecked state.
1. Select **Save**. Wait a few minutes for the changes to take effect.
Navigate to the My Apps portal and verify that the preview you enabled or disabled is reflected.

## Next steps

- [Quickstart Series on Application Management](view-applications-portal.md)
- [What is single sign-on?](what-is-single-sign-on.md)
- [Integrating Microsoft Entra ID with applications getting started guide](plan-an-application-integration.md)
