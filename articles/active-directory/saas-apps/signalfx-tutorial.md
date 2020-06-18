---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with SignalFx | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SignalFx.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 6d5ab4b0-29bc-4b20-8536-d64db7530f32
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 02/24/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with SignalFx

In this tutorial, you will learn how to integrate SignalFx with Azure Active Directory (Azure AD). When you integrate SignalFx with Azure AD, you can:

* Control from Azure AD who has access to SignalFx;
* Enable your users to be automatically signed-in to SignalFx with their Azure AD accounts; and
* Manage your accounts in one location (the Azure portal).

To learn more about SaaS application integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

Before you begin, you will need:

* An Azure AD subscription
    * If you do not have a subscription, you can obtain a [free account here](https://azure.microsoft.com/free/).
* SignalFx single sign-on (SSO) enabled subscription

## Scenario description

In this tutorial, you will configure and test Azure AD SSO in a test environment.

* SignalFx supports **IDP** initiated SSO
* SignalFx supports **Just In Time** user provisioning
* Once you configure SignalFx you can enforce session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Step 1: Add the SignalFx application in Azure

Use these instructions to add the SignalFx application to your list of managed SaaS apps.

1. Log into the [Azure portal](https://portal.azure.com).
1. On the left-side navigation window, select **Azure Active Directory**.
1. Select **Enterprise applications**, and then select **All applications**.
1. Select **New application**.
1. In the **Add from the gallery** section, in the search box, enter and select **SignalFx**.
     * You may need to wait a few minutes for the application to be added to your tenant.
1. Leave the Azure portal open, and then open a new web tab.    

## Step 2: Begin SignalFx SSO configuration

Use these instructions to begin the configuration process for the SignalFx SSO.

1. In the newly opened tab, access and log into the SignalFx UI. 
1. In the top menu, click **Integrations**. 
1. In the search field, enter and select **Azure Active Directory**.
1. Click **Create New Integration**.
1. In **Name**, enter an easily recognizable name that your users will understand.
1. Mark **Show on login page**.
    * This feature will display a customized button in the login page that your users can click on. 
    * The information you entered in **Name** will appear on the button. As a result, enter a **Name** that your users will recognize. 
    * This option will only function if you use a custom subdomain for the SignalFx application, such as **yourcompanyname.signalfx.com**. To obtain a custom subdomain, contact SignalFx support. 
1. Copy the **Integration ID**. You will need this information in a later step. 
1. Leave the SignalFx UI open. 

## Step 3: Configure Azure AD SSO

Use these instructions to enable Azure AD SSO in the Azure portal.

1. Return to the [Azure portal](https://portal.azure.com/), and on the **SignalFx** application integration page, locate the **Manage** section, and then select **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pen (edit) icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, complete the following fields: 

    a. In **Identifier**, enter the following URL `https://api.<realm>.signalfx.com/v1/saml/metadata` and replace `<realm>` with your SignalFx realm. 

    b. In **Reply URL**, enter the following URL `https://api.<realm>.signalfx.com/v1/saml/acs/<integration ID>` and replace `<realm>` with your SignalFx realm, as well as `<integration ID>` with the **Integration ID** you copied earlier from the SignalFx UI.

1. SignalFx application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. 
    
1. Review and verify that the following claims map to the source attributes that are populated in the Active Directory. 

    | Name |  Source Attribute|
    | ------------------- | -------------------- |
    | User.FirstName  | user.givenname |
    | User.email  | user.mail |
    | PersonImmutableID       | user.userprincipalname    |
    | User.LastName       | user.surname    |

    > [!NOTE]
    > This process requires that your Active Directory is configured with at least one verified custom domain, as well as has access to the email accounts in this domain. If you are unsure or need assistance with this configuration, please contact SignalFx support.  

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)**, and then select **Download**. Download the certificate, and save it on your computer. Then, copy the **App Federation Metadata Url** value; you will need this information in a later step in the SignalFx UI. 

    ![The Certificate download link](common/certificatebase64.png)

1. On the **Set up SignalFx** section, copy the **Azure AD Identifier** value. You will need this information in a later step in the SignalFx UI. 

## Step 4: Create an Azure AD test user

Use these instructions to create a test user in the Azure portal called **B.Simon**.

1. In the Azure portal, in the left-side navigation window, select **Azure Active Directory**, then select **Users**, and then select **All users**.
1. At the top of the page, select **New user**.
1. In the **User** properties:
   1. In **User name**, enter `username@companydomain.extension`, such as `b.simon@contoso.com`.
   1. In **Name**, enter `B.Simon`.
   1. Mark **Show password**, and then copy the displayed value in **Password**. You will need this information in later step in order to test this integration. 
   1. Click **Create**.

## Step 5: Assign the Azure AD test user

Use these instructions to enable the test user to use Azure single sign-on for SignalFx.

1. In the Azure portal, select **Enterprise applications**, and then select **All applications**.
1. In the applications list, select **SignalFx**.
1. In the app's overview page, find the **Manage** section, and then select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, and then in the **Add Assignment** dialog box, select **Users and groups**.

    ![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog box, from the **Users** list, select **B.Simon**, and then at the bottom of the page, click **Select**.
1. If you are expecting any role value in the SAML assertion, then in the **Select Role** dialog box, select the appropriate role for the user from the list, and then click **Select** at the bottom of the page.
1. In the **Add Assignment** dialog box, click the **Assign**.

## Step 6: Complete the SignalFx SSO configuration 

1. Open the previous tab, and return to the SignalFx UI to view the current Azure Active Directory integration page. 
1. Next to **Certificate (Base64)**, click **Upload File**, and then locate the **Base64 encoded certificate** file that you previously downloaded from Azure portal.
1. Next to **Azure AD Identifier**, paste the **Azure AD Identifier** value that you copied earlier from the Azure portal. 
1. Next to **Federation Metadata URL**, paste the **App Federation Metadata Url** value that you copied earlier from the Azure portal. 
1. Click **Save**.

## Step 7: Test SSO

Review the following information regarding how to test SSO, as well as expectations for logging into SignalFx for the first time. 

### Test logins

* To test the login, you should use a private / incognito window, or you can log out of the Azure portal. If not, cookies for the user who configured the application will interfere and prevent a successful login with the test user.

* When a new test user logs in for the first time, Azure will force a password change. When this occurs, the SSO login process will not be completed; the test user will be directed to the Azure portal. To troubleshoot, the test user should change their password, and navigate to the SignalFx login page or to the Access Panel and try again.
    * When you click the SignalFx tile in the Access Panel, you should be automatically logged into the SignalFx. 
        * For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

* SignalFx application can be accessed from the Access Panel or via a custom login page assigned to the organization. The test user should test the integration starting from either of these location.
    * The test user can use the credentials created earlier in this process for **b.simon@contoso.com**.

### First-time logins

* When a user logs into SignalFx from the SAML SSO for the first time, the user will receive a SignalFx email with a link. The user must click the link for authentication purposes. This email validation will only take place for first-time users. 

* SignalFx supports **Just In Time** user creation, which means that if a user does not exist in SignalFx, then the user's account will be created upon first login attempt.

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [Try SignalFx with Azure AD](https://aad.portal.azure.com/)