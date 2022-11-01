---
title: 'Tutorial: Azure AD SSO integration with ScreenSteps'
description: Learn how to configure single sign-on between Azure Active Directory and ScreenSteps.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/15/2022
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with ScreenSteps

In this tutorial, you'll learn how to integrate ScreenSteps with Azure Active Directory (Azure AD). When you integrate ScreenSteps with Azure AD, you can:

* Control in Azure AD who has access to ScreenSteps.
* Enable your users to be automatically signed-in to ScreenSteps with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* ScreenSteps single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* ScreenSteps supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add ScreenSteps from the gallery

To configure the integration of ScreenSteps into Azure AD, you need to add ScreenSteps from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **ScreenSteps** in the search box.
1. Select **ScreenSteps** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for ScreenSteps

Configure and test Azure AD SSO with ScreenSteps using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in ScreenSteps.

To configure and test Azure AD SSO with ScreenSteps, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure ScreenSteps SSO](#configure-screensteps-sso)** - to configure the single sign-on settings on application side.
    1. **[Create ScreenSteps test user](#create-screensteps-test-user)** - to have a counterpart of B.Simon in ScreenSteps that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **ScreenSteps** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following step:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<tenantname>.ScreenSteps.com`

	> [!NOTE]
	> This value is not real. Update this value with the actual Sign-On URL, which is explained later in this tutorial.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up ScreenSteps** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to ScreenSteps.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **ScreenSteps**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ScreenSteps SSO

1. In a different web browser window, log into your ScreenSteps company site as an administrator.

1. Click **Account Settings**.

    ![Screenshot that shows Account management](./media/screensteps-tutorial/account.png "Account management")

1. Click **Single Sign-on**.

    ![Screenshot that shows "Single Sign-on" selected.](./media/screensteps-tutorial/groups.png "Remote authentication")

1. Click **Create Single Sign-on Endpoint**.

    ![Screenshot that shows Remote authentication](./media/screensteps-tutorial/title.png "Remote authentication")

1. In the **Create Single Sign-on Endpoint** section, perform the following steps:

    ![Screenshot that shows Create an authentication endpoint](./media/screensteps-tutorial/settings.png "Create an authentication endpoint")

	a. In the **Title** textbox, type a title.

	b. From the **Mode** list, select **SAML**.

	c. Click **Create**.

1. **Edit** the new endpoint.

    ![Screenshot that shows to edit endpoint](./media/screensteps-tutorial/certificate.png "Edit endpoint")

1. In the **Edit Single Sign-on Endpoint** section, perform the following steps:

    ![Screenshot that shows Remote authentication endpoint](./media/screensteps-tutorial/authentication.png "Remote authentication endpoint")

    a. Click **Upload new SAML Certificate file**, and then upload the certificate, which you have downloaded from Azure portal.

	b. Paste **Login URL** value, which you have copied from the Azure portal into the **Remote Login URL** textbox.

	c. Paste **Logout URL** value, which you have copied from the Azure portal into the **Log out URL** textbox.

	d. Select a **Group** to assign users to when they are provisioned.

	e. Click **Update**.

	f. Copy the **SAML Consumer URL** to the clipboard and paste in to the **Sign-on URL** textbox in **Basic SAML Configuration** section in the Azure portal.

	g. Return to the **Edit Single Sign-on Endpoint**.

	h. Click the **Make default for account** button to use this endpoint for all users who log into ScreenSteps. Alternatively you can click the **Add to Site** button to use this endpoint for specific sites in **ScreenSteps**.

### Create ScreenSteps test user

In this section, you create a user called Britta Simon in ScreenSteps. Work with [ScreenSteps Client support team](https://www.screensteps.com/contact) to add the users in the ScreenSteps platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to ScreenSteps Sign-on URL where you can initiate the login flow. 

* Go to ScreenSteps Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the ScreenSteps tile in the My Apps, this will redirect to ScreenSteps Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure ScreenSteps you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).