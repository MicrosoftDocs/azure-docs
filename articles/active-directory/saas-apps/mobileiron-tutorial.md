---
title: 'Tutorial: Azure Active Directory integration with MobileIron'
description: Learn how to configure single sign-on between Azure Active Directory and MobileIron.
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
# Tutorial: Azure Active Directory integration with MobileIron

 In this tutorial, you'll learn how to integrate MobileIron with Azure Active Directory (Azure AD). When you integrate MobileIron with Azure AD, you can:

* Control in Azure AD who has access to MobileIron.
* Enable your users to be automatically signed in to MobileIron with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* MobileIron single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* MobileIron supports **SP and IDP** initiated SSO.

## Add MobileIron from the gallery

To configure the integration of MobileIron into Azure AD, you need to add MobileIron from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal by using either a work or school account, or a personal Microsoft account.
1. On the left pane, select **Azure Active Directory**.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **MobileIron** in the search box.
1. Select **MobileIron** from the results, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for MobileIron

Configure and test Azure AD SSO with MobileIron, by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between an Azure AD user and the related user in MobileIron.

To configure and test Azure AD SSO with MobileIron, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
     1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure MobileIron SSO](#configure-mobileiron-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create MobileIron test user](#create-mobileiron-test-user)** - to have a counterpart of Britta Simon in MobileIron that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

In this section, you enable Azure AD SSO in the Azure portal.
 
1. In the Azure portal, on the **MobileIron** application integration page, find the **Manage** section and select **Single Sign-On**.
1. On the **Select a Single Sign-On Method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://www.MobileIron.com/<key>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<host>.MobileIron.com/saml/SSO/alias/<key>`

    c. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

     In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<host>.MobileIron.com/user/login.html`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. You will get the values of key and host from the ​administrative​ ​portal of MobileIron which is explained later in the tutorial.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

### Create an Azure AD test user 

In this section, you create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory** > **Users** > **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write the password down.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to MobileIron.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **MobileIron**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.
1. Select **Add user**. Then, in the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the list of users. Then choose **Select** at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure MobileIron SSO

1. In a different web browser window, log in to your MobileIron company site as an administrator.

2. Go to **Admin** > **Identity** and select **AAD** option in the **Info on Cloud IDP Setup** field.

    ![Screenshot shows the Admin tab of MobileIron site with Identity selected.](./media/MobileIron-tutorial/tutorial_MobileIron_admin.png)

3. Copy the values of **Key** and **Host** and paste them to complete the URLs in the **Basic SAML Configuration** section in Azure portal.

    ![Screenshot shows the Setting Up SAML option with a key and host value.](./media/MobileIron-tutorial/key.png)

4. In the **Export​​ ​metadata​ file ​from​ ​A​AD​ and import to MobileIron Cloud Field** click **Choose File** to upload the downloaded metadata from Azure portal. Click **Done** once uploaded.

    ![Configure Single Sign-On admin metadata button](./media/MobileIron-tutorial/tutorial_MobileIron_adminmetadata.png)


### Create MobileIron test user

To enable Azure AD users to log in to MobileIron, they must be provisioned into MobileIron.  
In the case of MobileIron, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your MobileIron company site as an administrator.

1. Go to **Users** and Click on **Add** > **Single User**.

    ![Configure Single Sign-On user button](./media/MobileIron-tutorial/tutorial_MobileIron_user.png)

1. On the **“Single User”** dialog page, perform the following steps:

    ![Configure Single Sign-On user add button](./media/MobileIron-tutorial/tutorial_MobileIron_useradd.png)

	a. In **E-mail Address** text box, enter the email of user like brittasimon@contoso.com.

	b. In **First Name** text box, enter the first name of user like Britta.

	c. In **Last Name** text box, enter the last name of user like Simon.

    d. Click **Done**.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to MobileIron Sign on URL where you can initiate the login flow.  

* Go to MobileIron Sign-on URL directly and initiate the login flow from there.

### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the MobileIron for which you set up the SSO.

You can also use Microsoft My Apps to test the application in any mode. When you click the MobileIron tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the MobileIron for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure the MobileIron you can enforce session controls, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
