---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with A Cloud Guru | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and A Cloud Guru.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/03/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with A Cloud Guru

In this tutorial, you'll learn how to integrate A Cloud Guru with Azure Active Directory (Azure AD). When you integrate A Cloud Guru with Azure AD, you can:

* Control in Azure AD who has access to A Cloud Guru.
* Enable your users to be automatically signed-in to A Cloud Guru with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Cloud Guru single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* A Cloud Guru supports **SP and IDP** initiated SSO.
* A Cloud Guru supports **Just In Time** user provisioning.

## Adding A Cloud Guru from the gallery

To configure the integration of A Cloud Guru into Azure AD, you need to add A Cloud Guru from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **A Cloud Guru** in the search box.
1. Select **A Cloud Guru** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


## Configure and test Azure AD SSO for A Cloud Guru

Configure and test Azure AD SSO with A Cloud Guru using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in A Cloud Guru.

To configure and test Azure AD SSO with A Cloud Guru, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure A Cloud Guru SSO](#configure-a-cloud-guru-sso)** - to configure the single sign-on settings on application side.
    1. **[Create A Cloud Guru test user](#create-a-cloud-guru-test-user)** - to have a counterpart of B.Simon in A Cloud Guru that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **A Cloud Guru** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a value using the following pattern:
    `urn:auth0:acloudguru:<CLIENT_CONNECTION_NAME>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://auth.acloud.guru/login/callback?connection=<CLIENT_CONNECTION_NAME>`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://learn.acloud.guru/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [A Cloud Guru Client support team](mailto:sso@acloud.guru) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Your A Cloud Guru application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **Unique User Identifier(Name ID)** is **user.userprincipalname** but A Cloud Guru expects this to be mapped with the user's given name. For that you can use **user.givenname** attribute from the list or use the appropriate attribute value based on your organization configuration.

	![image](common/default-attributes.png)

1. In addition to above, A Cloud Guru application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name |  Source Attribute|
	| ----------------- | --------- |
    | email  | user.emailaddress |
	| family_name | user.surname |
	| given_name | user.givenname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up A Cloud Guru** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to A Cloud Guru.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **A Cloud Guru**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure A Cloud Guru SSO

To configure single sign-on on **A Cloud Guru** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [A Cloud Guru support team](mailto:sso@acloud.guru). They set this setting to have the SAML SSO connection set properly on both sides.

### Create A Cloud Guru test user

In this section, a user called Britta Simon is created in A Cloud Guru. A Cloud Guru supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in A Cloud Guru, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to A Cloud Guru Sign on URL where you can initiate the login flow.  

* Go to A Cloud Guru Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the A Cloud Guru for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the A Cloud Guru tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the A Cloud Guru for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure A Cloud Guru you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
