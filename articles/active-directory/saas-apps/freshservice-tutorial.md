---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Freshservice | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Freshservice.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/31/2020
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Freshservice

In this tutorial, you'll learn how to integrate Freshservice with Azure Active Directory (Azure AD). When you integrate Freshservice with Azure AD, you can:

* Control in Azure AD who has access to Freshservice.
* Enable your users to be automatically signed-in to Freshservice with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Freshservice single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Freshservice supports **SP** initiated SSO
* Once you configure Freshservice you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Freshservice from the gallery

To configure the integration of Freshservice into Azure AD, you need to add Freshservice from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Freshservice** in the search box.
1. Select **Freshservice** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Freshservice

Configure and test Azure AD SSO with Freshservice using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Freshservice.

To configure and test Azure AD SSO with Freshservice, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Freshservice SSO](#configure-freshservice-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Freshservice test user](#create-freshservice-test-user)** - to have a counterpart of B.Simon in Freshservice that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Freshservice** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<company-name>.freshservice.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<company-name>.freshservice.com`

    c. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<company-name>.freshservice.com/login/saml`
	
	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL, Identifier and Reply URL. Contact [Freshservice Client support team](https://support.freshservice.com/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Freshservice** section on the **Azure portal**, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Freshservice.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Freshservice**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Freshservice SSO

1. To automate the configuration within Freshservice, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

1. After adding extension to the browser, click on **Set up Freshservice** will direct you to the Freshservice application. From there, provide the admin credentials to sign into Freshservice. The browser extension will automatically configure the application for you and automate steps 3-6.

	![Setup configuration](common/setup-sso.png)

1. If you want to setup Freshservice manually, log in to your Freshservice company site as an administrator.

1. In the menu on the left, click **Admin** and select **Helpdesk Security** in the **General Settings**.

    ![Admin](./media/freshservice-tutorial/configure-1.png "Admin")

1. In the **Security**, click on **Go to Freshworks 360 Security**.

    ![Security](./media/freshservice-tutorial/configure-2.png "Security")

1. In the **Security** section, perform the following steps:

	![Single Sign On](./media/freshservice-tutorial/configure-3.png "Single Sign On")
  
	a. For **Single Sign On**, select **On**.

	b. In the **Login Method**, select **SAML SSO**.

    c. In the **Entity ID provided by the IdP** textbox, paste **Entity ID** value, which you have copied from the Azure portal.

	d. In the **SAML SSO URL** textbox, paste **Login URL** value, which you have copied from the Azure portal.

	e. In the **Signing Options**, select **Only Signed Assertions** from the dropdown.

    f. In the **Logout URL** textbox, paste **Logout URL** value, which you have copied from the Azure portal.

    g. In the **Security Certificate** textbox, paste **Certificate (Base64)** value, which you have obtained earlier.
  
	h. Click **Save**.


## Create Freshservice test user

To enable Azure AD users to sign in to FreshService, they must be provisioned into FreshService. In the case of FreshService, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your **FreshService** company site as an administrator.

2. In the menu on the left, click **Admin**.

3. In the **User Management** section, click **Requesters**.

    ![Requesters](./media/freshservice-tutorial/create-user-1.png "Requesters")

4. Click **New Requester**.

    ![New Requesters](./media/freshservice-tutorial/create-user-2.png "New Requesters")

5. In the **New Requester** section, enter the required fields and click on **Save**.
    ![New Requester](./media/freshservice-tutorial/create-user-3.png "New Requester")  

    > [!NOTE]
    > The Azure Active Directory account holder gets an email including a link to confirm the account before it becomes active
    >  

    > [!NOTE]
    > You can use any other FreshService user account creation tools or APIs provided by FreshService to provision Azure AD user accounts.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Freshservice tile in the Access Panel, you should be automatically signed in to the Freshservice for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Freshservice with Azure AD](https://aad.portal.azure.com/)