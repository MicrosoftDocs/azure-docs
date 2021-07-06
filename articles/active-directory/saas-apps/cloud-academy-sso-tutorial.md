---
title: 'Tutorial: Azure Active Directory SSO integration with Cloud Academy - SSO'
description: In this tutorial, you'll learn how to configure single sign-on between Azure Active Directory and Cloud Academy - SSO.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/15/2020
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on integration with Cloud Academy - SSO

In this tutorial, you'll learn how to integrate Cloud Academy - SSO with Azure Active Directory (Azure AD). When you integrate Cloud Academy - SSO with Azure AD, you can:

* Use Azure AD to control who can access Cloud Academy - SSO.
* Enable your users to be automatically signed in to Cloud Academy - SSO with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Cloud Academy - SSO subscription with single sign-on (SSO) enabled.

## Tutorial description

In this tutorial, you'll configure and test Azure AD SSO in a test environment.

* Cloud Academy - SSO supports **SP** initiated SSO
* Cloud Academy - SSO supports **Just In Time** user provisioning

## Add Cloud Academy - SSO from the gallery

To configure the integration of Cloud Academy - SSO into Azure AD, you need to add Cloud Academy - SSO from the gallery to your list of managed SaaS apps:

1. Sign in to the Azure portal with a work or school account or with a personal Microsoft account.
1. In the left pane, select **Azure Active Directory**.
1. Go to **Enterprise applications** and then select **All Applications**.
1. To add an application, select **New application**.
1. In the **Add from the gallery** section, enter **Cloud Academy - SSO** in the search box.
1. Select **Cloud Academy - SSO** in the results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Cloud Academy - SSO

You'll configure and test Azure AD SSO with Cloud Academy - SSO by using a test user named **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the corresponding user in Cloud Academy - SSO.

To configure and test Azure AD SSO with Cloud Academy - SSO, you'll complete these high-level steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use the feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on.
    1. **[Grant access to the test user](#grant-access-to-the-test-user)** to enable the user to use Azure AD single sign-on.
1. **[Configure single sign-on for Cloud Academy - SSO](#configure-single-sign-on-for-cloud-academy)** on the application side.
    1. **[Create a Cloud Academy - SSO test user](#create-a-cloud-academy-test-user)** as a counterpart to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** to verify that the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal:

1. In the Azure portal, on the **Cloud Academy - SSO** application integration page, in the **Manage** section, select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil button for **Basic SAML Configuration** to edit the settings:

   ![Screenshot that shows the pencil button for editing the basic SAML configuration.](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Sign-on URL** text box, type one of the following URLs:
    
    | Sign-on URL |
    |--------------|
    | `https://cloudacademy.com/login/enterprise/` |
    | `https://app.qa.com/login/enterprise/` |
    |
    
    b. In the **Reply URL** text box, type one of the following URLs:
    
    | Reply URL |
    |--------------|
    | `https://cloudacademy.com/labs/social/complete/saml/` |
    | `https://app.qa.com/labs/social/complete/saml/` |
    |
1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select the copy button to copy the **App Federation Metadata Url**. Save the URL.

	![Screenshot that shows the copy button for the app federation metadata URL.](common/copy-metadataurl.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting that user access to Cloud Academy - SSO.

1. In the Azure portal, select **Enterprise applications**, and then select **All applications**.
1. In the applications list, select **Cloud Academy - SSO**.
1. On the app's overview page, in the **Manage** section, select **Users and groups**:
1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box:
1. In the **Users and groups** dialog box, select **B.Simon** in the **Users** list, and then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure single sign-on for Cloud Academy

1. In a different browser window, sign in to your Cloud Academy - SSO company site as administrator.

1. Select your company's name and then select **Settings & Integrations** in the menu that appears:

    ![Screenshot that shows the Settings & Integrations option.](./media/cloud-academy-sso-tutorial/config-1.PNG)

1. On the **Settings & Integrations** page, on the **Integrations** tab, select the **SSO** card:

    ![Screenshot that shows the SSO card on the Integrations tab.](./media/cloud-academy-sso-tutorial/config-2.PNG)

1. Complete the following steps in this page:

    ![Screenshot that shows the Inegrations > SSO page.](./media/cloud-academy-sso-tutorial/config-3.PNG)

    a. In the **Entity ID URL** box, enter the entity ID value that you copied from the Azure portal.

    b. In the **SSO URL** box, paste the login URL value that you copied from the Azure portal.

    c. Open the downloaded Base64 certificate from the Azure portal in Notepad. Paste its contents into the **Certificate** box.

    d. In the **Name ID Format** box, keep the default value: `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified`.

1. Select **Save**.

    > [!NOTE]
	> For more information on how to configure the Cloud Academy - SSO, see [Setting Up Single Sign-On](https://support.cloudacademy.com/hc/articles/360043908452-Setting-Up-Single-Sign-On).

### Create a Cloud Academy test user

In this section, a user called Britta Simon is created in Cloud Academy - SSO. Cloud Academy - SSO supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Cloud Academy - SSO, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Cloud Academy - SSO Sign-on URL where you can initiate the login flow. 

* Go to Cloud Academy - SSO Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Cloud Academy - SSO tile in the My Apps, this will redirect to Cloud Academy - SSO Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Cloud Academy - SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).