---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with ScaleX Enterprise | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ScaleX Enterprise.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/16/2019
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with ScaleX Enterprise

In this tutorial, you'll learn how to integrate ScaleX Enterprise with Azure Active Directory (Azure AD). When you integrate ScaleX Enterprise with Azure AD, you can:

* Control in Azure AD who has access to ScaleX Enterprise.
* Enable your users to be automatically signed-in to ScaleX Enterprise with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* ScaleX Enterprise single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* ScaleX Enterprise supports **SP and IDP** initiated SSO

## Adding ScaleX Enterprise from the gallery

To configure the integration of ScaleX Enterprise into Azure AD, you need to add ScaleX Enterprise from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **ScaleX Enterprise** in the search box.
1. Select **ScaleX Enterprise** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for ScaleX Enterprise

Configure and test Azure AD SSO with ScaleX Enterprise using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in ScaleX Enterprise.

To configure and test Azure AD SSO with ScaleX Enterprise, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure ScaleX Enterprise SSO](#configure-scalex-enterprise-sso)** - to configure the single sign-on settings on application side.
    * **[Create ScaleX Enterprise test user](#create-scalex-enterprise-test-user)** - to have a counterpart of B.Simon in ScaleX Enterprise that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **ScaleX Enterprise** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://platform.rescale.com/saml2/<company id>/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://platform.rescale.com/saml2/<company id>/acs/`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://platform.rescale.com/saml2/<company id>/sso/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [ScaleX Enterprise Client support team](https://about.rescale.com/contactus.html) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Your ScaleX Enterprise application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **emailaddress** is mapped with **user.mail**. ScaleX Enterprise application expects **emailaddress** to be mapped with **user.userprincipalname**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/edit-attribute.png)

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up ScaleX Enterprise** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to ScaleX Enterprise.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **ScaleX Enterprise**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ScaleX Enterprise SSO

1. To automate the configuration within ScaleX Enterprise, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

1. After adding extension to the browser, click on **Set up ScaleX Enterprise** will direct you to the ScaleX Enterprise application. From there, provide the admin credentials to sign into ScaleX Enterprise. The browser extension will automatically configure the application for you and automate steps 3-6.

	![Setup configuration](common/setup-sso.png)

1. If you want to setup ScaleX Enterprise manually, open a new web browser window and sign into your ScaleX Enterprise company site as an administrator and perform the following steps:

1. Click the menu in the upper right and select **Contoso Administration**.

	> [!NOTE]
	> Contoso is just an example. This should be your actual Company Name.

	![Screenshot that shows an example company name selected from the menu in the upper-right.](./media/scalex-enterprise-tutorial/Test_Admin.png)

1. Select **Integrations** from the top menu and select **single sign-on**.

	![Screenshot that shows "Integrations" selected, and "Single Sign-On" selected from the drop-down menu.](./media/scalex-enterprise-tutorial/admin_sso.png) 

1. Complete the form as follows:

	![Configure single sign-on](./media/scalex-enterprise-tutorial/scalex_admin_save.png)

	a. Select **Create any user who can authenticate with SSO**

	b. **Service Provider saml**: Paste the value ***urn:oasis:names:tc:SAML:2.0:nameid-format:persistent***

	c. **Name of Identity Provider email field in ACS response**: Paste the value `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

	d. **Identity Provider EntityDescriptor Entity ID:** Paste the **Azure AD Identifier** value copied from the Azure portal.

	e. **Identity Provider SingleSignOnService URL:** Paste the **Login URL** from the Azure portal.

	f. **Identity Provider public X509 certificate:** Open the X509 certificate downloaded from the Azure in notepad and paste the contents in this box. Ensure there are no line breaks in the middle of the certificate contents.

	g. Check the following checkboxes: **Enabled, Encrypt NameID and Sign AuthnRequests.**

	h. Click **Update SSO Settings** to save the settings.

### Create ScaleX Enterprise test user

To enable Azure AD users to sign in to ScaleX Enterprise, they must be provisioned in to ScaleX Enterprise. In the case of ScaleX Enterprise, provisioning is an automatic task and no manual steps are required. Any user who can successfully authenticate with SSO credentials will be automatically provisioned on the ScaleX side.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the ScaleX Enterprise tile in the Access Panel, you should be automatically signed in to the ScaleX Enterprise for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory? ](../manage-apps/what-is-single-sign-on.md)

- [What is conditional access in Azure Active Directory?](../conditional-access/overview.md)

- [Try ScaleX Enterprise with Azure AD](https://aad.portal.azure.com/)
