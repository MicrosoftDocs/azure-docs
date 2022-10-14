---
title: 'Tutorial: Azure Active Directory integration with Origami | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Origami.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/08/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Origami

In this tutorial, you'll learn how to integrate Origami with Azure Active Directory (Azure AD). When you integrate Origami with Azure AD, you can:

* Control in Azure AD who has access to Origami.
* Enable your users to be automatically signed-in to Origami with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Origami single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Origami supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Origami from the gallery

To configure the integration of Origami into Azure AD, you need to add Origami from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Origami** in the search box.
1. Select **Origami** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Origami

Configure and test Azure AD SSO with Origami using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Origami.

To configure and test Azure AD SSO with Origami, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Origami SSO](#configure-origami-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Origami test user](#create-origami-test-user)** - to have a counterpart of B.Simon in Origami that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Origami** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://live.origamirisk.com/origami/account/login?account=<COMPANY_NAME>`

	> [!NOTE]
	> The value is not real. Update the value with the actual Sign-On URL. Contact [Origami Client support team](https://wordpress.org/support/theme/origami) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Origami** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Origami.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Origami**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Origami SSO

1. Log in to the Origami account with Admin rights.

2. In the menu on the top, click **Admin**.
   
    ![Screenshot that shows the Origami home page with "Admin" selected.](./media/origami-tutorial/admin.png)

3. On the Single Sign On Setup dialog page, perform the following steps:
   
    ![Screenshot that shows the "Single Sign On Setup" page with "Enable Single Sign-on" selected, and the text boxes highlighted.](./media/origami-tutorial/configuration.png)

    a. Select **Enable Single Sign On**.

    b. In the **Identity Provider's Sign-in Page URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

    c. In the **Identity Provider's Sign-out Page URL** textbox, paste the value of **Logout URL**, which you have copied from Azure portal.

    d. Click **Browse** to upload the certificate you have downloaded from the Azure portal.

    e. Click **Save Changes**.

### Create Origami test user

In this section, you create a user called Britta Simon in Origami. 

1. Log in to the Origami account with Admin rights.

2. In the menu on the top, click **Admin**.
   
    ![Screenshot that shows the Origami account home page with "Admin" selected.](./media/origami-tutorial/admin.png)

3. On the **Users and Security** dialog, click **Users**.
   
    ![Screenshot that shows the "Users and Security" dialog with "Users" selected.](./media/origami-tutorial/user.png)

4. Click **Add New User**.
   
    ![Screenshot that shows the "Add New User" button selected.](./media/origami-tutorial/add-user.png)

5. On the Add New User dialog, perform the following steps:
   
    ![Screenshot that shows the "Add New User" dialog with the "User Name", "First Name", and "Last Name" text boxes highlighted.](./media/origami-tutorial/new-user.png)

    a. In the **User Name** textbox, enter the email of user like **brittasimon\@contoso.com**.

    b. In the **Password** textbox, type a password.

    c. In the **Confirm Password** textbox, type the password again.

    d. In the **First Name** textbox, enter the first name of user like **Britta**.

    e. In the **Last Name** textbox, enter the last name of user like **Simon**.

    f. Click **Save**.
   
    ![Screenshot that shows the the "Save" button selected.](./media/origami-tutorial/save.png)

6. Assign **User Roles** and **Client Access** to the user. 
   
    ![Configure Single Sign-On](./media/origami-tutorial/user-roles.png)

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Origami Sign-on URL where you can initiate the login flow. 

* Go to Origami Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Origami tile in the My Apps, this will redirect to Origami Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Origami you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
