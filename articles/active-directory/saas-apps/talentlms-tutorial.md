---
title: 'Tutorial: Azure Active Directory integration with TalentLMS | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and TalentLMS.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 01/25/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with TalentLMS

In this tutorial, you'll learn how to integrate TalentLMS with Azure Active Directory (Azure AD). When you integrate TalentLMS with Azure AD, you can:

* Control in Azure AD who has access to TalentLMS.
* Enable your users to be automatically signed-in to TalentLMS with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with TalentLMS, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* TalentLMS single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* TalentLMS supports **SP** initiated SSO

## Add TalentLMS from the gallery

To configure the integration of TalentLMS into Azure AD, you need to add TalentLMS from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **TalentLMS** in the search box.
1. Select **TalentLMS** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for TalentLMS

Configure and test Azure AD SSO with TalentLMS using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in TalentLMS.

To configure and test Azure AD SSO with TalentLMS, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure TalentLMS SSO](#configure-talentlms-sso)** - to configure the single sign-on settings on application side.
    1. **[Create TalentLMS test user](#create-talentlms-test-user)** - to have a counterpart of B.Simon in TalentLMS that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **TalentLMS** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![TalentLMS Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<tenant-name>.TalentLMSapp.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `http://<tenant-name>.talentlms.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [TalentLMS Client support team](https://www.talentlms.com/contact) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. In the **SAML Signing Certificate** section, click **Edit** button to open **SAML Signing Certificate** dialog.

	![Edit SAML Signing Certificate](common/edit-certificate.png)

6. In the **SAML Signing Certificate** section, copy the **THUMBPRINT** and save it on your computer.

    ![Copy Thumbprint value](common/copy-thumbprint.png)

7. On the **Set up TalentLMS** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to TalentLMS.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **TalentLMS**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Configure TalentLMS SSO

1. In a different web browser window, sign in to your TalentLMS company site as an administrator.

1. In the **Account & Settings** section, click the **Users** tab.

    ![Account & Settings](./media/talentlms-tutorial/IC777296.png "Account & Settings")

1. Click **Single Sign-On (SSO)**,

1. In the Single Sign-On section, perform the following steps:

    ![Single Sign-On](./media/talentlms-tutorial/saml.png "Single Sign-On")

    a. From the **SSO integration type** list, select **SAML 2.0**.

    b. In the **Identity provider (IDP)** textbox, paste the value of **Azure AD Identifier**, which you have copied from Azure portal.

    c. Paste the **Thumbprint** value from Azure portal into the **Certificate fingerprint** textbox.

    d.  In the **Remote sign-in URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

    e. In the **Remote sign-out URL** textbox, paste the value of **Logout URL**, which you have copied from Azure portal.

    f. Fill in the following:

    * In the **TargetedID** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`

    * In the **First name** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`

    * In the **Last name** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname`

    * In the **Email** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

1. Click **Save**.

### Create TalentLMS test user

To enable Azure AD users to sign in to TalentLMS, they must be provisioned into TalentLMS. In the case of TalentLMS, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your **TalentLMS** tenant.

1. Click **Users**, and then click **Add User**.

1. On the **Add user** dialog page, perform the following steps:

    ![Add User](./media/talentlms-tutorial/IC777299.png "Add User")  

    a. In the **First name** textbox, enter the first name of user like `Britta`.

    b. In the **Last name** textbox, enter the last name of user like `Simon`.
 
    c. In the **Email address** textbox, enter the email of user like `brittasimon@contoso.com`.

    d. Click **Add User**.

> [!NOTE]
> You can use any other TalentLMS user account creation tools or APIs provided by TalentLMS to provision Azure AD user accounts.

### Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to TalentLMS Sign-on URL where you can initiate the login flow. 

* Go to TalentLMS Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the TalentLMS tile in the My Apps, this will redirect to TalentLMS Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure TalentLMS you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).