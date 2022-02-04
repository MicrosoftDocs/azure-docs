---
title: 'Tutorial: Azure Active Directory SSO integration with Cloud Academy'
description: In this tutorial, you'll learn how to configure single sign-on between Azure Active Directory and Cloud Academy.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/15/2021
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on integration with Cloud Academy

In this tutorial, you'll learn how to integrate Cloud Academy with Azure Active Directory (Azure AD). When you integrate Cloud Academy with Azure AD, you can:

* Use Azure AD to control who can access Cloud Academy.
* Enable your users to be automatically signed in to Cloud Academy with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Cloud Academy subscription with single sign-on (SSO) enabled.

## Tutorial description

In this tutorial, you'll configure and test Azure AD SSO in a test environment.

* Cloud Academy supports **SP** initiated SSO.
* Cloud Academy supports **Just In Time** user provisioning.
* Cloud Academy supports [Automated user provisioning](cloud-academy-sso-provisioning-tutorial.md).

## Add Cloud Academy from the gallery

To configure the integration of Cloud Academy into Azure AD, you need to add Cloud Academy from the gallery to your list of managed SaaS apps:

1. Sign in to the Azure portal with a work or school account or with a personal Microsoft account.
1. In the left pane, select **Azure Active Directory**.
1. Go to **Enterprise applications** and then select **All Applications**.
1. To add an application, select **New application**.
1. In the **Add from the gallery** section, enter **Cloud Academy** in the search box.
1. Select **Cloud Academy** in the results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Cloud Academy

You'll configure and test Azure AD SSO with Cloud Academy by using a test user named **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the corresponding user in Cloud Academy.

To configure and test Azure AD SSO with Cloud Academy, you'll complete these high-level steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use the feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on.
    1. **[Grant access to the test user](#grant-access-to-the-test-user)** to enable the user to use Azure AD single sign-on.
1. **[Configure single sign-on for Cloud Academy](#configure-single-sign-on-for-cloud-academy)** on the application side.
    1. **[Create a Cloud Academy test user](#create-a-cloud-academy-test-user)** as a counterpart to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** to verify that the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal:

1. In the Azure portal, on the **Cloud Academy** application integration page, in the **Manage** section, select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil button for **Basic SAML Configuration** to edit the settings:

   ![Screenshot that shows the pencil button for editing the basic SAML configuration.](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, update the **Sign-on URL** text box, type one of the following URLs and save it:
    
    | Sign-on URL |
    |--------------|
    | `https://cloudacademy.com/login/enterprise/` |
    | `https://app.qa.com/login/enterprise/` |
    
1. Select the pencil button for **SAML Signing Certificate** to edit the settings:

   ![Screenshot that shows how to edit the ceritificate.](common/edit-certificate.png)

1. Download the **PEM certificate**:

   ![Screenshot that shows how to download the PEM ceritificate.](common/certificate-base64-download.png)
    
1. On the **Set up Cloud Academy** section, copy the **Login URL**:

	![Screenshot that shows the copy button for the login URL.](common/copy_configuration_urls.png)

### Create an Azure AD test user

In this section, you'll create a test user called B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**. Select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, complete these steps:
   1. In the **Name** box, enter **B.Simon**.  
   1. In the **User name** box, enter \<username>@\<companydomain>.\<extension>. For example, `B.Simon@contoso.com`.
   1. Select **Show password**, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

### Grant access to the test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting that user access to Cloud Academy.

1. In the Azure portal, select **Enterprise applications**, and then select **All applications**.
1. In the applications list, select **Cloud Academy**.
1. On the app's overview page, in the **Manage** section, select **Users and groups**:
1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box:
1. In the **Users and groups** dialog box, select **B.Simon** in the **Users** list, and then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure single sign-on for Cloud Academy

1. In a different browser window, sign in to your Cloud Academy company site as administrator.

1. On the home page, click the **Azure Integration Team** icon and then select **Settings** in the left menu.

1. On the **INTEGRATIONS** tab, select the **SSO** card.

    ![Screenshot that shows the Settings & Integrations option.](./media/cloud-academy-sso-tutorial/integrations.png)

1. Click on **Start Configuring** to set up SSO.

    ![Screenshot that shows the Integrations > SSO page.](./media/cloud-academy-sso-tutorial/start-configuring.png)

1. Complete the following steps in General Settings page:

    ![Screenshot that shows the Integrations in general settings.](./media/cloud-academy-sso-tutorial/general-settings.png)

    a. In the **SSO URL(Location)** box, paste the login URL value that you copied from the Azure portal, from point 7 of [Configure Azure AD SSO](#configure-azure-ad-sso).

    c. Open the downloaded Base64 certificate from the Azure portal in Notepad. Paste its contents into the **Certificate** box.

    d. In the **Email Domains** box, enter all the domain values your company uses for user emails.

1. Perform the following steps in the below page:

    ![Screenshot that shows the Integrations in additional settings.](./media/cloud-academy-sso-tutorial/additional-settings.png)

    a. In the **SAML Attributes Mapping** section, fill the required fields with the source attribute values:
    
    
    `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`
    `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`
    `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname`
    `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

    b. In the **Security Settings** section, select the **Authentication Requests Signed?** check box to set this value to **True**.

    c. In the **Extra Settings(Optional)** section, fill the **Logout URL** box with the logout URL value that you copied from the Azure portal, from point 7 of [Configure Azure AD SSO](#configure-azure-ad-sso).

1. Click **Save and Test**.
2. After this operation, a pop-up will appear with the service provider information, from there you have to download the XML file
![Screenshot that show download configuration]
3. Now that you have the XML file of the service provider, go back on the application that you've created on Azure Portal, inside the **single sign-on** section, and upload the MetaData file
![Screenshot that show upload metadata section on Azure application]
4. Now that you've updated the service provider metadata, you can go back on the SSO panel of your Cloud Academy company site and proceed with the test and activation. Click on **continue** from the service provider popup.
![Screenshot that show service provider popup]
5. Click on **Test SSO connection** to start the test flow
![Screenshot that show Test SSO connection]
> [!NOTE]
>  If you are logged in Cloud Academy as your test user created previously, proceed with test flow, otherwise copy/paste Subdomain URL on Incognito browser tab and then log in as your test user.
6. If everything is ok, you can finally activate the SSO integration for the whole company.
![Screenshot that show SSO activation]


> [!NOTE]
> For more information on how to configure the Cloud Academy, see [Setting Up Single Sign-On](https://support.cloudacademy.com/hc/articles/360043908452-Setting-Up-Single-Sign-On).

### Create a Cloud Academy test user

In this section, a user called Britta Simon is created in Cloud Academy. Cloud Academy supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Cloud Academy, a new one is created after authentication.

Cloud Academy also supports automatic user provisioning, you can find more details [here](./cloud-academy-sso-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Cloud Academy Sign-on URL where you can initiate the login flow. 

* Go to Cloud Academy Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Cloud Academy tile in the My Apps, this will redirect to Cloud Academy Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure Cloud Academy you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
