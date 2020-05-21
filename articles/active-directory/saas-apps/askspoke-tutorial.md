---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with askSpoke | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and askSpoke.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 42bc1022-376b-47c2-8ca6-739f6c219b6b
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 05/21/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with askSpoke

In this tutorial, you'll learn how to integrate askSpoke with Azure Active Directory (Azure AD). When you integrate askSpoke with Azure AD, you can:

* Control in Azure AD who has access to askSpoke.
* Enable your users to be automatically signed-in to askSpoke with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* askSpoke single sign-on (SSO) enabled subscription.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* askSpoke supports **SP and IDP** initiated SSO
* askSpoke supports **Just In Time** user provisioning
* Once you configure askSpoke you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding askSpoke from the gallery

To configure the integration of askSpoke into Azure AD, you need to add askSpoke from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **askSpoke** in the search box.
1. Select **askSpoke** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for askSpoke

Configure and test Azure AD SSO with askSpoke using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in askSpoke.

To configure and test Azure AD SSO with askSpoke, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure askSpoke SSO](#configure-askspoke-sso)** - to configure the single sign-on settings on application side.
    1. **[Create askSpoke test user](#create-askspoke-test-user)** - to have a counterpart of B.Simon in askSpoke that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **askSpoke** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    In the **Reply URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.askspoke.com/saml/callback`

	> [!NOTE]
	> The Reply URL value is not real. Update this value with the actual Reply URL. Contact [askSpoke Client support team](mailto:support@askspoke.com) to get this value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL:
    `https://askspoke.com/login`

1. askSpoke application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, askSpoke application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------| --------- |
	| firstName | user.givenname |
    | lastName | user.surname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up askSpoke** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to askSpoke.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **askSpoke**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure askSpoke SSO

1. In a different web browser window, sign into askSpoke website as an administrator.

1. Click on **Settings** tab from the left navigation pane.

    ![askSpoke Configuration](./media/askspoke-tutorial/configure1.png)

1. Scroll down to **SSO** and click on **Connect**.

    ![askSpoke Configuration](./media/askspoke-tutorial/configure2.png)

1. On the **Enable SAML & SCIM** section, perform the following steps:

    ![askSpoke Configuration](./media/askspoke-tutorial/configure3.png)

    1. In the **Sign-on URL** textbox, paste **Login URL** value, which you have copied from the Azure portal.

    1. In the **Issuer** textbox, paste **Azure AD Identifier** value, which you have copied from the Azure portal.

    1. Open the downloaded **Certificate(Base64)** file from the Azure portal into Notepad and copy content of certificate file and paste it into the **Public certificate** textbox.

    1. Copy **ACS URL** value and paste it into **Reply URL** textbox in the **Basic SAML Configuration** section in the Azure portal.

    1. Click **Test SAML connection**.

### Create askSpoke test user

In this section, a user called B.Simon is created in askSpoke. askSpoke supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in askSpoke, a new one is created when you attempt to access askSpoke.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the askSpoke tile in the Access Panel, you should be automatically signed in to the askSpoke for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try askSpoke with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect askSpoke with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

