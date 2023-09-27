---
title: Enable single sign-on for an enterprise application
description: Enable single sign-on for an enterprise application in Microsoft Entra ID.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 09/29/2022
ms.author: jomondi
ms.reviewer: ergleenl
ms.custom: contperf-fy22q2, mode-other, enterprise-apps

#Customer intent: As an administrator of a Microsoft Entra tenant, I want to enable single sign-on for an enterprise application.
---

# Enable single sign-on for an enterprise application

In this article, you use the Microsoft Entra admin center to enable single sign-on (SSO) for an enterprise application that you added to your Microsoft Entra tenant. After you configure SSO, your users can sign in by using their Microsoft Entra credentials. 

Microsoft Entra ID has a gallery that contains thousands of pre-integrated applications that use SSO. This article uses an enterprise application named **Azure AD SAML Toolkit 1** as an example, but the concepts apply for most pre-configured enterprise applications in the gallery.

It is recommended that you use a non-production environment to test the steps in this article.

## Prerequisites

To configure SSO, you need:

- A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- Completion of the steps in [Quickstart: Create and assign a user account](add-application-portal-assign-users.md).

## Enable single sign-on

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To enable SSO for an application:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**. 
1. Enter the name of the existing application in the search box, and then select the application from the search results. For example, **Azure AD SAML Toolkit 1**.
1. In the **Manage** section of the left menu, select **Single sign-on** to open the **Single sign-on** pane for editing.
1. Select **SAML** to open the SSO configuration page. After the application is configured, users can sign in to it by using their credentials from the Microsoft Entra tenant.
1. The process of configuring an application to use Microsoft Entra ID for SAML-based SSO varies depending on the application. For any of the enterprise applications in the gallery, use the **configuration guide** link to find information about the steps needed to configure the application. The steps for the **Azure AD SAML Toolkit 1** are listed in this article.

    :::image type="content" source="media/add-application-portal-setup-sso/saml-configuration.png" alt-text="Configure single sign-on for an enterprise application.":::

1. In the **Set up Azure AD SAML Toolkit 1** section, record the values of the **Login URL**, **Microsoft Entra Identifier**, and **Logout URL** properties to be used later.

## Configure single sign-on in the tenant

You add sign-in and reply URL values, and you download a certificate to begin the configuration of SSO in Microsoft Entra ID.

To configure SSO in Microsoft Entra ID:

1. In the Microsoft Entra admin center, select **Edit** in the **Basic SAML Configuration** section on the **Set up single sign-on** pane. 
1. For **Reply URL (Assertion Consumer Service URL)**, enter `https://samltoolkit.azurewebsites.net/SAML/Consume`.
1. For **Sign on URL**, enter `https://samltoolkit.azurewebsites.net/`.
1. Select **Save**.
1. In the **SAML Certificates** section, select **Download** for **Certificate (Raw)** to download the SAML signing certificate and save it to be used later.

## Configure single sign-on in the application

Using single sign-on in the application requires you to register the user account with the application and to add the SAML configuration values that you previously recorded.

### Register the user account

To register a user account with the application:

1. Open a new browser window and browse to the sign-in URL for the application. For the **Azure AD SAML Toolkit** application, the address is `https://samltoolkit.azurewebsites.net`.
1. Select **Register** in the upper right corner of the page.

    :::image type="content" source="media/add-application-portal-setup-sso/toolkit-register.png" alt-text="Register a user account in the Azure AD SAML Toolkit application.":::

1. For **Email**, enter the email address of the user that will access the application. Ensure that the user account is already assigned to the application.
1. Enter a **Password** and confirm it.
1. Select **Register**.

### Configure SAML settings

To configure SAML settings for the application:

1. Signed in with the credentials of the user account that you already assigned to the application, select **SAML Configuration** at the upper-left corner of the page.
1. Select **Create** in the middle of the page.
1. For **Login URL**, **Microsoft Entra Identifier**, and **Logout URL**, enter the values that you recorded earlier.
1. Select **Choose file** to upload the certificate that you previously downloaded.
1. Select **Create**.
1. Copy the values of the **SP Initiated Login URL** and the **Assertion Consumer Service (ACS) URL** to be used later.

## Update single sign-on values

Use the values that you recorded for **SP Initiated Login URL** and **Assertion Consumer Service (ACS) URL** to update the single sign-on values in your tenant.

To update the single sign-on values:

1. In the Microsoft Entra admin center, select **Edit** in the **Basic SAML Configuration** section on the **Set up single sign-on** pane. 
1. For **Reply URL (Assertion Consumer Service URL)**, enter the **Assertion Consumer Service (ACS) URL** value that you previously recorded.
1. For **Sign on URL**, enter the **SP Initiated Login URL** value that you previously recorded.
1. Select **Save**.

## Test single sign-on

You can test the single sign-on configuration from the **Set up single sign-on** pane.

To test SSO:

1. In the **Test single sign-on with Azure AD SAML Toolkit 1** section, on the **Set up single sign-on with SAML** pane, select **Test**.
1. Sign in to the application using the Microsoft Entra credentials of the user account that you assigned to the application.


## Next steps

- [Manage self service access](manage-self-service-access.md)
- [Configure user consent](configure-user-consent.md)
- [Grant tenant-wide admin consent](grant-admin-consent.md)
