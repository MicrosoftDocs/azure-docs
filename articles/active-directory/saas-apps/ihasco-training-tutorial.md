---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with iHASCO Training | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and iHASCO Training.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/25/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with iHASCO Training

In this tutorial, you'll learn how to integrate iHASCO Training with Azure Active Directory (Azure AD). When you integrate iHASCO Training with Azure AD, you can:

* Control in Azure AD who has access to iHASCO Training.
* Enable your users to be automatically signed-in to iHASCO Training with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* iHASCO Training single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* iHASCO Training supports **SP** initiated SSO.
* iHASCO Training supports **Just In Time** user provisioning.


## Adding iHASCO Training from the gallery

To configure the integration of iHASCO Training into Azure AD, you need to add iHASCO Training from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **iHASCO Training** in the search box.
1. Select **iHASCO Training** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for iHASCO Training

Configure and test Azure AD SSO with iHASCO Training using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in iHASCO Training.

To configure and test Azure AD SSO with iHASCO Training, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure iHASCO Training SSO](#configure-ihasco-training-sso)** - to configure the single sign-on settings on application side.
    1. **[Create iHASCO Training test user](#create-ihasco-training-test-user)** - to have a counterpart of B.Simon in iHASCO Training that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **iHASCO Training** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Identifier** box, type a URL using the following pattern:
    `https://authentication.ihasco.co.uk/saml2/<ID>/metadata`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://authentication.ihasco.co.uk/saml2/<ID>/acs`
    
    c. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://app.ihasco.co.uk/<ID>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-On URL. Contact [iHASCO Training Client support team](mailto:support@ihasco.co.uk) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up iHASCO Training** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to iHASCO Training.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **iHASCO Training**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure iHASCO Training SSO

1. Log in to your iHASCO Training website as an administrator.

1. Click **Settings** in top right navigation, scroll to
the **ADVANCED** tile and click **Configure Single Sign On**.

    ![Screenshot for iHASCO Training sso button.](./media/ihasco-training-tutorial/settings.png)

1. In the **IDENTITY PROVIDERS** tab, click **Add provider** and select **SAML2**.

    ![Screenshot for iHASCO Training IDENTITY PROVIDERS.](./media/ihasco-training-tutorial/add-provider.png)

1. Perform the following steps in the **Single Sign On / New SAML2** page:

    ![Screenshot for iHASCO Training Single Sign On.](./media/ihasco-training-tutorial/single-sign-on.png)

    a. Under **GENERAL**, enter a **Description** to identify this configuration.

    b. Under **IDENTITY PROVIDER DETAILS**, in the **Single Sign-on URL** textbox, paste the **Login URL** value which you have copied from the Azure portal.

    c. In the **Single Logout URL** textbox, paste the **Logout URL** value which you have copied from the Azure portal.

    d. In the **Entity ID** textbox, paste the **Identifier** value which you have copied from the Azure portal.

    e. Open the downloaded **Certificate (Base64)** from the Azure portal into Notepad and paste the content into the **X509 (Public) Certificate** textbox.

    f. Under **USER ATTRIBUTE MAPPING**, in the **Email address** enter the value like `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`.

    g. In the **First name** enter the value like `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`.

    h. In the **Last name** enter the value like `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname`.

    i. Click **Save**.

    j. Click **Enable now** after the page reload.

1. Click **Security** in the left-hand navigation and select **Single Sign On provider** as **Registration** method, and your **Azure AD configuration** as **Selected provider**.

    ![Screenshot for iHASCO Training Security.](./media/ihasco-training-tutorial/security.png)

1. Click **Save changes**.

### Create iHASCO Training test user

In this section, a user called Britta Simon is created in iHASCO Training. iHASCO Training supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in iHASCO Training, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to iHASCO Training Sign-on URL where you can initiate the login flow. 

* Go to iHASCO Training Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the iHASCO Training tile in the My Apps, this will redirect to iHASCO Training Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure iHASCO Training you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).


