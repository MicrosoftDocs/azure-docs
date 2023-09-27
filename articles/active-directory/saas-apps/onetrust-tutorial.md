---
title: 'Tutorial: Microsoft Entra integration with OneTrust Privacy Management Software'
description: Learn how to configure single sign-on between Microsoft Entra ID and OneTrust Privacy Management Software.
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
# Tutorial: Microsoft Entra integration with OneTrust Privacy Management Software

In this tutorial, you'll learn how to integrate OneTrust Privacy Management Software with Microsoft Entra ID. When you integrate OneTrust Privacy Management Software with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to OneTrust Privacy Management Software.
* Enable your users to be automatically signed in to OneTrust Privacy Management Software with their Microsoft Entra accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To configure Microsoft Entra integration with OneTrust Privacy Management Software, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).
* OneTrust Privacy Management Software single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* OneTrust Privacy Management Software supports **SP** and **IDP** initiated SSO.

* OneTrust Privacy Management Software supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add OneTrust Privacy Management Software from the gallery

To configure the integration of OneTrust Privacy Management Software into Microsoft Entra ID, you need to add OneTrust Privacy Management Software from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **OneTrust Privacy Management Software** in the search box.
1. Select **OneTrust Privacy Management Software** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-onetrust-privacy-management-software'></a>

## Configure and test Microsoft Entra SSO for OneTrust Privacy Management Software

Configure and test Microsoft Entra SSO with OneTrust Privacy Management Software using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in OneTrust Privacy Management Software.

To configure and test Microsoft Entra SSO with OneTrust Privacy Management Software, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure OneTrust Privacy Management Software SSO](#configure-onetrust-privacy-management-software-sso)** - to configure the single sign-on settings on application side.
    1. **[Create OneTrust Privacy Management Software test user](#create-onetrust-privacy-management-software-test-user)** - to have a counterpart of B.Simon inOneTrust Privacy Management Software that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

### Configure Microsoft Entra SSO

In this section, you enable Microsoft Entra SSO.
 
1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **OneTrust Privacy Management Software** application integration page, find the **Manage** section and select **Single Sign-On**.
1. On the **Select a Single Sign-On Method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

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
	> These values are not real. Update these values with the actual Reply URL and Sign-on URL. Contact [OneTrust Privacy Management Software Client support team](mailto:support@onetrust.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up OneTrust Privacy Management Software** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user 

In this section, you create a test user called B.Simon.
1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to OneTrust Privacy Management Software.

1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. In the applications list, select **OneTrust Privacy Management Software**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.
1. Select **Add user**. Then, in the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the list of users. Then choose **Select** at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select **Assign**.

### Configure OneTrust Privacy Management Software SSO

To configure single sign-on on **OneTrust Privacy Management Software** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [OneTrust Privacy Management Software support team](mailto:support@onetrust.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create OneTrust Privacy Management Software test user

In this section, a user called Britta Simon is created in OneTrust Privacy Management Software. OneTrust Privacy Management Software supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in OneTrust Privacy Management Software, a new one is created after authentication.

>[!Note]
>If you need to create a user manually, Contact [OneTrust Privacy Management Software support team](mailto:support@onetrust.com).

### Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to OneTrust Privacy Management Software Sign-on URL where you can initiate the login flow.  
 
* Go to OneTrust Privacy Management Software Sign on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the OneTrust Privacy Management Software  for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the OneTrust Privacy Management Software tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the OneTrust Privacy Management Software for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure  OneTrust Privacy Management Software you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
