---
title: 'Tutorial: Azure Active Directory integration with OneTrust Privacy Management Software'
description: Learn how to configure single sign-on between Azure Active Directory and OneTrust Privacy Management Software.
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
# Tutorial: Azure Active Directory integration with OneTrust Privacy Management Software

In this tutorial, you'll learn how to integrate OneTrust Privacy Management Software with Azure Active Directory (Azure AD). When you integrate OneTrust Privacy Management Software with Azure AD, you can:

* Control in Azure AD who has access to OneTrust Privacy Management Software.
* Enable your users to be automatically signed in to OneTrust Privacy Management Software with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To configure Azure AD integration with OneTrust Privacy Management Software, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).
* OneTrust Privacy Management Software single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* OneTrust Privacy Management Software supports **SP** and **IDP** initiated SSO.

* OneTrust Privacy Management Software supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add OneTrust Privacy Management Software from the gallery

To configure the integration of OneTrust Privacy Management Software into Azure AD, you need to add OneTrust Privacy Management Software from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **OneTrust Privacy Management Software** in the search box.
1. Select **OneTrust Privacy Management Software** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for OneTrust Privacy Management Software

Configure and test Azure AD SSO with OneTrust Privacy Management Software using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in OneTrust Privacy Management Software.

To configure and test Azure AD SSO with OneTrust Privacy Management Software, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure OneTrust Privacy Management Software SSO](#configure-onetrust-privacy-management-software-sso)** - to configure the single sign-on settings on application side.
    1. **[Create OneTrust Privacy Management Software test user](#create-onetrust-privacy-management-software-test-user)** - to have a counterpart of B.Simon inOneTrust Privacy Management Software that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

In this section, you enable Azure AD SSO in the Azure portal.
 
1. In the Azure portal, on the **OneTrust Privacy Management Software** application integration page, find the **Manage** section and select **Single Sign-On**.
1. On the **Select a Single Sign-On Method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type the URL:
    `https://www.onetrust.com/saml2`

    b. In the **Reply URL** text box, type a URL using one of the following patterns:

    | Reply URL |
    |------------|
    | `https://<subdomain>.onetrust.com/auth/consumerservice` |
    |  `https://app.onetrust.com/access/v1/saml/SSO` |
    |
    

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

     In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.onetrust.com/auth/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Reply URL and Sign-on URL. Contact [OneTrust Privacy Management Software Client support team](mailto:support@onetrust.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up OneTrust Privacy Management Software** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

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

In this section, you enable B.Simon to use Azure single sign-on by granting access to OneTrust Privacy Management Software.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **OneTrust Privacy Management Software**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.
1. Select **Add user**. Then, in the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the list of users. Then choose **Select** at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select **Assign**.

### Configure OneTrust Privacy Management Software SSO

To configure single sign-on on **OneTrust Privacy Management Software** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [OneTrust Privacy Management Software support team](mailto:support@onetrust.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create OneTrust Privacy Management Software test user

In this section, a user called Britta Simon is created in OneTrust Privacy Management Software. OneTrust Privacy Management Software supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in OneTrust Privacy Management Software, a new one is created after authentication.

>[!Note]
>If you need to create a user manually, Contact [OneTrust Privacy Management Software support team](mailto:support@onetrust.com).

### Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to OneTrust Privacy Management Software Sign-on URL where you can initiate the login flow.  
 
* Go to OneTrust Privacy Management Software Sign on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the OneTrust Privacy Management Software  for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the OneTrust Privacy Management Software tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the OneTrust Privacy Management Software for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure  OneTrust Privacy Management Software you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
