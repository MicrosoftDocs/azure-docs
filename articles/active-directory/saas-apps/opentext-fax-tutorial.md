---
title: 'Tutorial: Azure AD SSO integration with OpenText XM Fax and XM SendSecure'
description: Learn how to configure single sign-on between Azure Active Directory and OpenText XM Fax and XM SendSecure.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/10/2022
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with OpenText XM Fax and XM SendSecure

In this tutorial, you'll learn how to integrate OpenText XM Fax and XM SendSecure with Azure Active Directory (Azure AD). When you integrate OpenText XM Fax and XM SendSecure with Azure AD, you can:

* Control in Azure AD who has access to OpenText XM Fax and XM SendSecure.
* Enable your users to be automatically signed-in to OpenText XM Fax and XM SendSecure with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* OpenText XM Fax and XM SendSecure single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* OpenText XM Fax and XM SendSecure supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add OpenText XM Fax and XM SendSecure from the gallery

To configure the integration of OpenText XM Fax and XM SendSecure into Azure AD, you need to add OpenText XM Fax and XM SendSecure from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **OpenText XM Fax and XM SendSecure** in the search box.
1. Select **OpenText XM Fax and XM SendSecure** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for OpenText XM Fax and XM SendSecure

Configure and test Azure AD SSO with OpenText XM Fax and XM SendSecure using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user at OpenText XM Fax and XM SendSecure.

To configure and test Azure AD SSO with OpenText XM Fax and XM SendSecure, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure OpenText XM Fax and XM SendSecure SSO](#configure-opentext-xm-fax-and-xm-sendsecure-sso)** - to configure the single sign-on settings on application side.
    1. **[Create OpenText XM Fax and XM SendSecure test user](#create-opentext-xm-fax-and-xm-sendsecure-test-user)** - to have a counterpart of B.Simon in OpenText XM Fax and XM SendSecure that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **OpenText XM Fax and XM SendSecure** application integration page, find the **Manage** section and select **single sign-on**.
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

    c. In the **Sign-on URL** text box, type one of the following URLs:

    | **Sign-on URL** |
    |-------------|
    | `https://login.xmedius.com/` |
    | `https://login.xmedius.eu/` |
    | `https://login.xmedius.ca/` |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up OpenText XM Fax and XM SendSecure** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows how to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")  

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to OpenText XM Fax and XM SendSecure.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **OpenText XM Fax and XM SendSecure**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure OpenText XM Fax and XM SendSecure SSO

To configure single sign-on on **OpenText XM Fax and XM SendSecure** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [OpenText XM Fax and XM SendSecure support team](mailto:support@opentext.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create OpenText XM Fax and XM SendSecure test user

In this section, you create a user called Britta Simon at OpenText XM Fax and XM SendSecure. Work with [OpenText XM Fax and XM SendSecure support team](mailto:support@opentext.com) to add the users in the OpenText XM Fax and XM SendSecure platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to OpenText XM Fax and XM SendSecure Sign-on URL where you can initiate the login flow. 

* Go to OpenText XM Fax and XM SendSecure Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the OpenText XM Fax and XM SendSecure tile in the My Apps, this will redirect to OpenText XM Fax and XM SendSecure Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure OpenText XM Fax and XM SendSecure you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).