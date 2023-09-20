---
title: 'Tutorial: Microsoft Entra integration with Voyance'
description: Learn how to configure single sign-on between Microsoft Entra ID and Voyance.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---
# Tutorial: Microsoft Entra integration with Voyance

In this tutorial, you learn how to integrate Voyance with Microsoft Entra ID.
Integrating Voyance with Microsoft Entra ID provides you with the following benefits:

* You can control in Microsoft Entra ID who has access to Voyance.
* You can enable your users to be automatically signed-in to Voyance (Single Sign-On) with their Microsoft Entra accounts.
* You can manage your accounts in one central location.

If you want to know more details about SaaS app integration with Microsoft Entra ID, see [What is application access and single sign-on with Microsoft Entra ID](../manage-apps/what-is-single-sign-on.md).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Microsoft Entra integration with Voyance, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get a [free account](https://azure.microsoft.com/free/)
* Voyance single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* Voyance supports **SP** and **IDP** initiated SSO

* Voyance supports **Just In Time** user provisioning

## Adding Voyance from the gallery

To configure the integration of Voyance into Microsoft Entra ID, you need to add Voyance from the gallery to your list of managed SaaS apps.

**To add Voyance from the gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the search box, type **Voyance**, select **Voyance** from result panel then click **Add** button to add the application.

	 ![Voyance in the results list](common/search-new-app.png)

<a name='configure-and-test-azure-ad-single-sign-on'></a>

## Configure and test Microsoft Entra single sign-on

In this section, you configure and test Microsoft Entra single sign-on with Voyance based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between a Microsoft Entra user and the related user in Voyance needs to be established.

To configure and test Microsoft Entra single sign-on with Voyance, you need to complete the following building blocks:

1. **[Configure Microsoft Entra Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Voyance Single Sign-On](#configure-voyance-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
4. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
5. **[Create Voyance test user](#create-voyance-test-user)** - to have a counterpart of Britta Simon in Voyance that is linked to the Microsoft Entra representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

<a name='configure-azure-ad-single-sign-on'></a>

### Configure Microsoft Entra single sign-on

In this section, you enable Microsoft Entra single sign-on.

To configure Microsoft Entra single sign-on with Voyance, perform the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Voyance** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

1. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![Screenshot shows the Basic SAML Configuration, where you can enter Identifier, Reply U R L, and select Save.](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<companyname>.nyansa.com`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<companyname>.nyansa.com/saml/create/`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![Screenshot shows Set additional U R Ls where you can enter a Sign on U R L.](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<companyname>.nyansa.com/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Voyance Client support team](mailto:support@nyansa.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. On the **Set up Voyance** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Microsoft Entra Identifier

	c. Logout URL

### Configure Voyance Single Sign-On

1. In a different web browser window, sign-on to your Voyance tenant as an administrator.

2. Go to the top right corner of the navigation bar and click on **Profile**.
	
	![Configure Single Sign-On On App Side Acme University](./media/voyance-tutorial/tutorial_voyance_001.png) 

3. Click **Admin Settings**.

	![Configure Single Sign-On On App Side Admin Settings](./media/voyance-tutorial/tutorial_voyance_002.png)

4. Click **User Access** tab.

	![Configure Single Sign-On On App Side User Access](./media/voyance-tutorial/tutorial_voyance_003.png)

5. Click the **SSO is disabled** button to configure Microsoft Entra ID as an IdP using SAML 2.0.

	![Configure Single Sign-On On App Side SSO is disabled button](./media/voyance-tutorial/tutorial_voyance_004.png)

6. Go to **SAML v2** section and perform below steps:

	![Configure Single Sign-On On App Side SAML v2](./media/voyance-tutorial/tutorial-voyance-005.png)
	
	a. Select **Enabled**.
	
	b. Paste **Login URL** into the **IdP Login URL** textbox.

	c. Open your downloaded Base64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **IdP Cert** textbox.
	
	d. Click **Save**.

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user 

The objective of this section is to create a test user called Britta Simon.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Voyance.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Voyance**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Voyance**.

	![The Voyance link in the Applications list](common/all-applications.png)

1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Voyance test user

In this section, a user called Britta Simon is created in Voyance. Voyance supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Voyance, a new one is created after authentication.

>[!NOTE]
>If you need to create a user manually, you need to contact [Voyance support team](mailto:support@nyansa.com).

### Test single sign-on 

In this section, you test your Microsoft Entra single sign-on configuration using the Access Panel.

When you click the Voyance tile in the Access Panel, you should be automatically signed in to the Voyance for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Microsoft Entra ID](./tutorial-list.md)

- [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)
