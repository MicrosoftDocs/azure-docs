---
title: 'Tutorial: Microsoft Entra SSO integration with XM Fax and XM SendSecure'
description: Learn how to configure single sign-on between Microsoft Entra ID and XM Fax and XM SendSecure.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/10/2023
ms.author: jeedes

---

# Tutorial: Microsoft Entra SSO integration with XM Fax and XM SendSecure

In this tutorial, you'll learn how to integrate XM Fax and XM SendSecure with Microsoft Entra ID. When you integrate XM Fax and XM SendSecure with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to XM Fax and XM SendSecure.
* Enable your users to be automatically signed-in to XM Fax and XM SendSecure with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Microsoft Entra Cloud Application Administrator or Application Administrator role.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).
* XM Fax and XM SendSecure subscription.
* XM Fax and XM SendSecure administrator account.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* XM Fax and XM SendSecure supports **SP-initiated** SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add XM Fax and XM SendSecure from the gallery

To configure the integration of XM Fax and XM SendSecure into Microsoft Entra ID, you need to add XM Fax and XM SendSecure from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **XM Fax and XM SendSecure** in the search box.
1. Select **XM Fax and XM SendSecure** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-xm-fax-and-xm-sendsecure'></a>

## Configure and test Microsoft Entra SSO for XM Fax and XM SendSecure

Configure and test Microsoft Entra SSO with XM Fax and XM SendSecure using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user at XM Fax and XM SendSecure.

To configure and test Microsoft Entra SSO with XM Fax and XM SendSecure, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure XM Fax and XM SendSecure SSO](#configure-xm-fax-and-xm-sendsecure-sso)** - to configure the single sign-on settings on application side.
    1. **[Create XM Fax and XM SendSecure test user](#create-xm-fax-and-xm-sendsecure-test-user)** - to have a counterpart of B.Simon in XM Fax and XM SendSecure that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **XM Fax and XM SendSecure** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type one of the following URLs:

    | **Identifier** |
    |-------------|
    | `https://login.xmedius.com/` |
    | `https://login.xmedius.eu/` |
    | `https://login.xmedius.ca/` |

    b. In the **Reply URL** textbox, type one of the following URLs:

    | **Reply URL** |
    |----------|
    | `https://login.xmedius.com/auth/saml/callback` |
    | `https://login.xmedius.eu/auth/saml/callback` |
    | `https://login.xmedius.ca/auth/saml/callback` |

    c. In the **Sign-on URL** text box, type a URL using one of the following patterns:

    | **Sign-on URL** |
    |-------------|
    | `https://login.xmedius.com/{account}` |
    | `https://login.xmedius.eu/{account}` |
    | `https://login.xmedius.ca/{account}` |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up XM Fax and XM SendSecure** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows how to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")  

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user in the Azure portal called B.Simon:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable B.Simon to use single sign-on by granting access to XM Fax and XM SendSecure:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **XM Fax and XM SendSecure**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure XM Fax and XM SendSecure SSO

1. Log in to your XM Cloud account using a Web browser.

1. From the main menu of your Web Portal, select **enterprise_account -> Enterprise Settings**.

1. Go to **Single Sign-On** section and select **SAML 2.0**.

1. Provide the following required information:

    a. In the **Issuer (Identity Provider)** textbox, paste the **Microsoft Entra Identifier** value which you copied previously.
    
    b. In the **Sign In URL** textbox, paste the **Login URL** value which you copied previously.

    c. Open the downloaded **Certificate (Base64)** into Notepad and paste the content into the **X.509 Signing Certificate** textbox.

    d. click **Save**.

> [!NOTE]
> Keep the fail-safe URL (`https://login.[domain]/[account]/no-sso`) provided at the bottom of the SSO configuration section, it will allow you to log in using your XM Cloud account credentials if you lock yourself after SSO activation.

### Create XM Fax and XM SendSecure test user

Create a user called Britta Simon at XM Fax and XM SendSecure. Make sure the email is set to "B.Simon@contoso.com".

> [!NOTE]
> Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with the following options. 

* Click on **Test this application**, this will redirect to XM Fax and XM SendSecure Sign-on URL where you can initiate the login flow. 

* Go to XM Fax and XM SendSecure Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the XM Fax and XM SendSecure tile in the My Apps portal, this will redirect to XM Fax and XM SendSecure Sign-on URL. For more information about the My Apps portal, see [Introduction to the My Apps portal](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure XM Fax and XM SendSecure you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
