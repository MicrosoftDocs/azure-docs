---
title: 'Tutorial: Microsoft Entra integration with PlanMyLeave'
description: Learn how to configure single sign-on between Microsoft Entra ID and PlanMyLeave.
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
# Tutorial: Microsoft Entra integration with PlanMyLeave

In this tutorial, you learn how to integrate PlanMyLeave with Microsoft Entra ID.
Integrating PlanMyLeave with Microsoft Entra ID provides you with the following benefits:

* You can control in Microsoft Entra ID who has access to PlanMyLeave.
* You can enable your users to be automatically signed-in to PlanMyLeave (Single Sign-On) with their Microsoft Entra accounts.
* You can manage your accounts in one central location.

If you want to know more details about SaaS app integration with Microsoft Entra ID, see [What is application access and single sign-on with Microsoft Entra ID](../manage-apps/what-is-single-sign-on.md).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Microsoft Entra integration with PlanMyLeave, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* PlanMyLeave single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* PlanMyLeave supports **SP** initiated SSO

* PlanMyLeave supports **Just In Time** user provisioning

## Adding PlanMyLeave from the gallery

To configure the integration of PlanMyLeave into Microsoft Entra ID, you need to add PlanMyLeave from the gallery to your list of managed SaaS apps.

**To add PlanMyLeave from the gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the search box, type **PlanMyLeave**, select **PlanMyLeave** from result panel then click **Add** button to add the application.

	 ![PlanMyLeave in the results list](common/search-new-app.png)

<a name='configure-and-test-azure-ad-single-sign-on'></a>

## Configure and test Microsoft Entra single sign-on

In this section, you configure and test Microsoft Entra single sign-on with PlanMyLeave based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between a Microsoft Entra user and the related user in PlanMyLeave needs to be established.

To configure and test Microsoft Entra single sign-on with PlanMyLeave, you need to complete the following building blocks:

1. **[Configure Microsoft Entra Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure PlanMyLeave Single Sign-On](#configure-planmyleave-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
4. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
5. **[Create PlanMyLeave test user](#create-planmyleave-test-user)** - to have a counterpart of Britta Simon in PlanMyLeave that is linked to the Microsoft Entra representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

<a name='configure-azure-ad-single-sign-on'></a>

### Configure Microsoft Entra single sign-on

In this section, you enable Microsoft Entra single sign-on.

To configure Microsoft Entra single sign-on with PlanMyLeave, perform the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **PlanMyLeave** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

1. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    ![PlanMyLeave Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<company-name>.planmyleave.com/Login.aspx`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<company-name>.planmyleave.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [PlanMyLeave Client support team](mailto:support@planmyleave.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up PlanMyLeave** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Microsoft Entra Identifier

	c. Logout URL

### Configure PlanMyLeave Single Sign-On

1. In a different web browser window, log into your PlanMyLeave tenant as an administrator.

2. Go to **System Setup**. Then on the **Security Management** section click **Company SAML settings** .

	![Screenshot that shows the "System setup" page with the "Security Management" section highlighted and the "Company S A M L Settings" action selected.](./media/planmyleave-tutorial/tutorial_planmyleave_002.png) 

3. On the **SAML Settings** section, click editor icon.

	![Screenshot that shows the "S A M L Settings" section with the "editor" icon selected in the top-right of the section.](./media/planmyleave-tutorial/tutorial_planmyleave_003.png)

4. On the **Update SAML Settings** section, perform the following steps:

	![Configure Single Sign-On On App Side](./media/planmyleave-tutorial/tutorial_planmyleave_004.png)

	a.  In the **Login URL** textbox, paste **Login URL**..

    b.  Open your downloaded metadata, copy  **X509Certificate** value and then paste it to the **Certificate** textbox.

	c. Set "**Is Enable**" to "**Yes**".

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to PlanMyLeave.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **PlanMyLeave**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **PlanMyLeave**.

	![The PlanMyLeave link in the Applications list](common/all-applications.png)

1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

### Create PlanMyLeave test user

In this section, a user called Britta Simon is created in PlanMyLeave. PlanMyLeave supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in PlanMyLeave, a new one is created after authentication.

> [!NOTE]
> If you need to create a user manually, you need to contact [PlanMyLeave support team](mailto:support@planmyleave.com).

### Test single sign-on 

In this section, you test your Microsoft Entra single sign-on configuration using the Access Panel.

When you click the PlanMyLeave tile in the Access Panel, you should be automatically signed in to the PlanMyLeave for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Microsoft Entra ID](./tutorial-list.md)

- [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)
