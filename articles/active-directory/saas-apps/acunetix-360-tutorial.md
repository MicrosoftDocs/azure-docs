---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Acunetix 360 | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Acunetix 360.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/21/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Acunetix 360

In this tutorial, you'll learn how to integrate Acunetix 360 with Azure Active Directory (Azure AD). When you integrate Acunetix 360 with Azure AD, you can:

* Control in Azure AD who has access to Acunetix 360.
* Enable your users to be automatically signed-in to Acunetix 360 with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Acunetix 360 single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Acunetix 360 supports **SP and IDP** initiated SSO
* Acunetix 360 supports **Just In Time** user provisioning

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding Acunetix 360 from the gallery

To configure the integration of Acunetix 360 into Azure AD, you need to add Acunetix 360 from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Acunetix 360** in the search box.
1. Select **Acunetix 360** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Acunetix 360

Configure and test Azure AD SSO with Acunetix 360 using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Acunetix 360.

To configure and test Azure AD SSO with Acunetix 360, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Acunetix 360 SSO](#configure-acunetix-360-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Acunetix 360 test user](#create-acunetix-360-test-user)** - to have a counterpart of B.Simon in Acunetix 360 that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Acunetix 360** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    In the **Reply URL** text box, type a URL using the following pattern:
    `https://online.acunetix360.com/account/assertionconsumerservice/?spId=<SPID>`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://online.acunetix360.com/account/ssosignin`

	> [!NOTE]
	> The values is not real. Update the Reply URL value with the actual Reply URL. Contact [Acunetix 360 Client support team](mailto:support@acunetix.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Your Acunetix 360 application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **Unique User Identifier** is **user.userprincipalname** but Acunetix 360 expects this to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration.

	![image](common/default-attributes.png)

1. In addition to above, Acunetix 360 application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name |  Source Attribute|
	| ---------------| --------- |
	| FirstName | user.givenName |
	| LastName | user.surName |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Acunetix 360** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Acunetix 360.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Acunetix 360**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Acunetix 360 SSO

To configure single sign-on on **Acunetix 360** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Acunetix 360 support team](mailto:support@acunetix.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Acunetix 360 test user

In this section, a user called Britta Simon is created in Acunetix 360. Acunetix 360 supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Acunetix 360, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Acunetix 360 Sign on URL where you can initiate the login flow.  

* Go to Acunetix 360 Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Acunetix 360 for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Acunetix 360 tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Acunetix 360 for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Acunetix 360 you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
