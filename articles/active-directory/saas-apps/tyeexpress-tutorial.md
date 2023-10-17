---
title: 'Tutorial: Microsoft Entra integration with T&E Express'
description: Learn how to configure single sign-on between Microsoft Entra ID and T&E Express.
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
# Tutorial: Microsoft Entra integration with T&E Express

In this tutorial, you learn how to integrate T&E Express with Microsoft Entra ID.
Integrating T&E Express with Microsoft Entra ID provides you with the following benefits:

* You can control in Microsoft Entra ID who has access to T&E Express.
* You can enable your users to be automatically signed-in to T&E Express (Single Sign-On) with their Microsoft Entra accounts.
* You can manage your accounts in one central location.

If you want to know more details about SaaS app integration with Microsoft Entra ID, see [What is application access and single sign-on with Microsoft Entra ID](../manage-apps/what-is-single-sign-on.md).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Microsoft Entra integration with T&E Express, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* T&E Express single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* T&E Express supports **IDP** initiated SSO

## Adding T&E Express from the gallery

To configure the integration of T&E Express into Microsoft Entra ID, you need to add T&E Express from the gallery to your list of managed SaaS apps.

**To add T&E Express from the gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the search box, type **T&E Express**, select **T&E Express** from result panel then click **Add** button to add the application.

	![T&E Express in the results list](common/search-new-app.png)

<a name='configure-and-test-azure-ad-single-sign-on'></a>

## Configure and test Microsoft Entra single sign-on

In this section, you configure and test Microsoft Entra single sign-on with T&E Express based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between a Microsoft Entra user and the related user in T&E Express needs to be established.

To configure and test Microsoft Entra single sign-on with T&E Express, you need to complete the following building blocks:

1. **[Configure Microsoft Entra Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure T&E Express Single Sign-On](#configure-te-express-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
4. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
5. **[Create T&E Express test user](#create-te-express-test-user)** - to have a counterpart of Britta Simon in T&E Express that is linked to the Microsoft Entra representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

<a name='configure-azure-ad-single-sign-on'></a>

### Configure Microsoft Entra single sign-on

In this section, you enable Microsoft Entra single sign-on.

To configure Microsoft Entra single sign-on with T&E Express, perform the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **T&E Express** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

1. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up Single Sign-On with SAML** page, perform the following steps:

    ![T&E Express Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type the value as URL using the following pattern:
    `https://<domain>.tyeexpress.com`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<domain>.tyeexpress.com/authorize/samlConsume.aspx`

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up T&E Express** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Microsoft Entra Identifier

	c. Logout URL

### Configure T&E Express Single Sign-On

1. To configure single sign-on on **T&E Express** side, login to the T&E express application without SAML single sign on using admin credentials.

1. Under the **Admin** Tab, Click on **SAML domain** to Open the SAML settings page.

	![Screenshot shows SAML Domain selected from the Admin menu.](./media/tyeexpress-tutorial/tye-SAML.png)

1. Select the **Activar(Activate)** option from **No** to **SI(Yes)**. In the **Identity Provider Metadata** textbox, paste the metadata XML which you have downloaded.

	![Screenshot shows the Dominio SAML page where you can enter the metadata.](./media/tyeexpress-tutorial/tyeAdmin.png)

1. Click on the **Guardar(Save)** button to save the settings.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to T&E Express.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **T&E Express**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **T&E Express**.

	![The T&E Express link in the Applications list](common/all-applications.png)

1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

### Create T&E Express test user

In order to enable Microsoft Entra users to log into T&E Express, they must be provisioned into T&E Express. In case of T&E Express, provisioning is a manual task.

**To provision a user accounts, perform the following steps:**

1. Log in to your T&E Express company site as an administrator.

1. Under Admin tag, click on Users to open the Users master page.

    ![Screenshot shows Users selected from the Admin menu.](./media/tyeexpress-tutorial/tye-adminusers.png)

1. On the home page, click on **+** to add the users.

	![Screenshot shows the plus icon to add users.](./media/tyeexpress-tutorial/tye-usershome.png)

1. Enter all the mandatory details as asked in the form and click the save button to save the details.

	![Screenshot shows the User information section where you can enter appropriate values.](./media/tyeexpress-tutorial/tye-usersadd.png)

	![Screenshot shows the Approvers and Assistant sections where you can enter appropriate values.](./media/tyeexpress-tutorial/tye-userssave.png)

### Test single sign-on

In this section, you test your Microsoft Entra single sign-on configuration using the Access Panel.

When you click the T&E Express tile in the Access Panel, you should be automatically signed in to the T&E Express for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Microsoft Entra ID](./tutorial-list.md)

- [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)
