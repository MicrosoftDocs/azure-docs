---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Leapsome | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Leapsome.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: cb523e97-add8-4289-b106-927bf1a02188
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 12/17/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Leapsome

In this tutorial, you'll learn how to integrate Leapsome with Azure Active Directory (Azure AD). When you integrate Leapsome with Azure AD, you can:

* Control in Azure AD who has access to Leapsome.
* Enable your users to be automatically signed-in to Leapsome with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Leapsome single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Leapsome supports **SP and IDP** initiated SSO

## Adding Leapsome from the gallery

To configure the integration of Leapsome into Azure AD, you need to add Leapsome from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Leapsome** in the search box.
1. Select **Leapsome** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Leapsome

Configure and test Azure AD SSO with Leapsome using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Leapsome.

To configure and test Azure AD SSO with Leapsome, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Leapsome SSO](#configure-leapsome-sso)** - to configure the single sign-on settings on application side.
    * **[Create Leapsome test user](#create-leapsome-test-user)** - to have a counterpart of B.Simon in Leapsome that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Leapsome** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL: `https://www.leapsome.com`

	b. In the **Reply URL** text box, type a URL using the following pattern: `https://www.leapsome.com/api/users/auth/saml/<CLIENTID>/assert`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://www.leapsome.com/api/users/auth/saml/<CLIENTID>/login`

	> [!NOTE]
	> The preceding Reply URL and Sign-on URL value is not real value. You will update these with the actual values, which is explained later in the tutorial.

1. Leapsome application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Leapsome application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name | Source Attribute | Namespace |
	| ---------------| --------------- | --------- |  
	| firstname | user.givenname | http://schemas.xmlsoap.org/ws/2005/05/identity/claims |
	| lastname | user.surname | http://schemas.xmlsoap.org/ws/2005/05/identity/claims |
	| title | user.jobtitle | http://schemas.xmlsoap.org/ws/2005/05/identity/claims |
	| picture | URL to the employee's picture | http://schemas.xmlsoap.org/ws/2005/05/identity/claims |
	| | |

	> [!Note]
	> The value of picture attribute is not real. Update this value with actual picture URL. To get this value contact [Leapsome Client support team](mailto:support@leapsome.com).

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Leapsome** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Leapsome.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Leapsome**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Leapsome SSO

1. In a different web browser window, sign in to Leapsome as a Security Administrator.

1. On the top right, Click on Settings logo and then click **Admin Settings**.

	![Leapsome set](./media/leapsome-tutorial/tutorial_leapsome_admin.png)

1. On the left menu bar click **Single Sign On (SSO)**, and on the **SAML-based single sign-on (SSO)** page perform the following steps:

	![Leapsome saml](./media/leapsome-tutorial/tutorial_leapsome_samlsettings.png)

	a. Select **Enable SAML-based single sign-on**.

	b. Copy the **Login URL (point your users here to start login)** value and paste it into the **Sign-on URL** textbox in **Basic SAML Configuration** section on Azure portal.

	c. Copy the **Reply URL (receives response from your identity provider)** value and paste it into the **Reply URL** textbox in  **Basic SAML Configuration** section on Azure portal.

	d. In the **SSO Login URL (provided by identity provider)** textbox, paste the value of **Login URL**, which you copied from the Azure portal.

	e. Copy the Certificate that you have downloaded from Azure portal without `--BEGIN CERTIFICATE and END CERTIFICATE--` comments and paste it in the **Certificate (provided by identity provider)** textbox.

	f. Click **UPDATE SSO SETTINGS**.

### Create Leapsome test user

In this section, you create a user called Britta Simon in Leapsome. Work with [Leapsome Client support team](mailto:support@leapsome.com) to add the users or the domain that must be added to an allow list for the Leapsome platform. If the domain is added by the team, users will get automatically provisioned to the Leapsome platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Leapsome tile in the Access Panel, you should be automatically signed in to the Leapsome for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Leapsome with Azure AD](https://aad.portal.azure.com/)