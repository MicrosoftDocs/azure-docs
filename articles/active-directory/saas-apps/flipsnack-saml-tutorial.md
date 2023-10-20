---
title: Microsoft Entra SSO integration with Flipsnack SAML
description: Learn how to configure single sign-on between Microsoft Entra ID and Flipsnack SAML.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 12/14/2022
ms.author: jeedes

---

# Microsoft Entra SSO integration with Flipsnack SAML

In this article, you'll learn how to integrate Flipsnack SAML with Microsoft Entra ID. Flipsnack is the complete solution perfect for creating interactive catalogs, magazines, brochures & many more. Convert a PDF file to a flipbook or make the entire design from scratch. When you integrate Flipsnack SAML with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Flipsnack SAML.
* Enable your users to be automatically signed-in to Flipsnack SAML with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for Flipsnack SAML in a test environment. Flipsnack SAML supports both **SP** and **IDP** initiated single sign-on and **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with Flipsnack SAML, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Flipsnack SAML single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Flipsnack SAML application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-flipsnack-saml-from-the-azure-ad-gallery'></a>

### Add Flipsnack SAML from the Microsoft Entra gallery

Add Flipsnack SAML from the Microsoft Entra application gallery to configure single sign-on with Flipsnack SAML. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Flipsnack SAML** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type the URL:
    `https://www.flipsnack.com`

    b. In the **Reply URL** textbox, type a URL using one of the following patterns:

    | **Reply URL** |
    |--------------|
    | `https://auth.flipsnack.com/login/callback` |
    | `https://www.flipsnack.com/accounts/sign-in-sso.html` |

1. If you want to configure SP initiated SSO, then perform the following step:

    In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://www.flipsnack.com/accounts/sign-in-sso.html?accountId=<CustomerHash>`

    > [!Note]
    > This value is not the real. Update this value with the actual Sign on URL. Contact [Flipsnack SAML Client support team](mailto:contact@flipsnack.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up Flipsnack SAML** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Flipsnack SAML SSO

1. Log in to your Flipsnack SAML company site as an administrator.

1. Go to Flipsnack **Settings** > **Single Sign On**.
    
    ![Screenshot shows the SSO Configuration.](./media/flipsnack-saml-tutorial/certificate.png "Configuration")

    1. Enable **SSO** and choose **SAML** protocol.

    1. In the **Login URL** textbox, paste the **Login URL** value, which you've copied.

    1. In the **Identifier** textbox, paste the **Microsoft Entra Identifier** value, which you've copied.
    
    1. In the **Logout URL** textbox, paste the **Logout URL** value, which you've copied.

    1. Open the downloaded **Certificate (Base64)** into Notepad and paste the content into the **Certificate** textbox.

    1. Click **Save changes**.

### Create Flipsnack SAML test user

In this section, a user called B.Simon is created in Flipsnack SAML. Flipsnack SAML supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Flipsnack SAML, a new one is created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Flipsnack SAML Sign-on URL where you can initiate the login flow.  

* Go to Flipsnack SAML Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Flipsnack SAML for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Flipsnack SAML tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Flipsnack SAML for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Flipsnack SAML you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
