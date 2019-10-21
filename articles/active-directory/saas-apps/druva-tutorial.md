---
title: 'Tutorial: Azure Active Directory integration with Druva | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Druva.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: ab92b600-1fea-4905-b1c7-ef8e4d8c495c
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/30/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Druva with Azure Active Directory

In this tutorial, you'll learn how to integrate Druva with Azure Active Directory (Azure AD). When you integrate Druva with Azure AD, you can:

* Control in Azure AD who has access to Druva.
* Enable your users to be automatically signed-in to Druva with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Druva single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. Druva supports **SP** and **IDP** initiated SSO

## Adding Druva from the gallery

To configure the integration of Druva into Azure AD, you need to add Druva from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Druva** in the search box.
1. Select **Druva** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with Druva using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Druva.

To configure and test Azure AD SSO with Druva, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
2. **[Configure Druva SSO](#configure-druva-sso)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
5. **[Create Druva test user](#create-druva-test-user)** - to have a counterpart of B.Simon in Druva that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Druva** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL:
    `https://login.druva.com/api/commonlogin/samlconsume`

1. Druva application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image](./media/druva-tutorial/edited-attribute.png)

1. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps:

	| Name | Source Attribute|
	| ------------------- | -------------------- |
	| emailAddress | user.email |
	| druva_auth_token | SSO Token generated from DCP Admin Console, without quotation marks.  For example: X-XXXXX-XXXX-S-A-M-P-L-E+TXOXKXEXNX=. Azure automatically adds quotation marks around the auth token. |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Druva** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Druva SSO

1. In a different web browser window, sign in to your Druva company site as an administrator.

1. Click on the Druva logo on top left corner and then click **Druva Cloud Settings**.

	![Settings](./media/druva-tutorial/ic795091.png "Settings")

1. On the **Single Sign-On** tab, click **Edit**.

	![Single Sign-On Settings](./media/druva-tutorial/ic795092.png "Single Sign-On Settings")

1. On the **Edit Single Sign-On Settings** page, perform the following steps:

	![Single Sign-On Settings](./media/druva-tutorial/ic795095.png "Single Sign-On Settings")

	1. In **ID Provider Login URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

	1. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **ID Provider Certificate** textbox

	   > [!NOTE]
	   > To Enable Single Sign-On for administrators, select **Administrators log into Druva Cloud through SSO provider** and **Allow failsafe access to Druva Cloud administrators(recommended)** checkboxes. Druva recommends to enable **Failsafe for Administrators** so that they have to access the DCP console in case of any failures in IdP. It also enables the administrators to use both SSO and DCP password to access the DCP console.

	1. Click **Save**. This enables the access to Druva Cloud Platform using SSO.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Druva.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Druva**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Druva test user

In this section, a user called B.Simon is created in Druva. Druva supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Druva, a new one is created after authentication.

### Test SSO

When you select the Druva tile in the Access Panel, you should be automatically signed in to the Druva for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)