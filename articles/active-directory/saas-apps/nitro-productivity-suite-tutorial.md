---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Nitro Productivity Suite | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Nitro Productivity Suite.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 98c96c9f-18a6-4a20-919b-74fb113ee465
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 04/02/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Nitro Productivity Suite

In this tutorial, you'll learn how to integrate Nitro Productivity Suite with Azure Active Directory (Azure AD). When you integrate Nitro Productivity Suite with Azure AD, you can:

* Control in Azure AD who has access to Nitro Productivity Suite.
* Enable your users to be automatically signed in to Nitro Productivity Suite with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

To learn more about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Nitro Productivity Suite [Enterprise subscription](https://www.gonitro.com/pricing).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Nitro Productivity Suite supports **SP** and **IDP** initiated SSO.
* Nitro Productivity Suite supports **Just In Time** user provisioning.
* After you configure Nitro Productivity Suite, you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from conditional access. For more information, see [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Add Nitro Productivity Suite from the gallery

To configure the integration of Nitro Productivity Suite into Azure AD, you need to add Nitro Productivity Suite from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) by using either a work or school account, or a personal Microsoft account.
1. On the left pane, select **Azure Active Directory**.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **Nitro Productivity Suite** in the search box.
1. Select **Nitro Productivity Suite** from the results, and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for Nitro Productivity Suite

Configure and test Azure AD SSO with Nitro Productivity Suite, by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between an Azure AD user and the related user in Nitro Productivity Suite.

To configure and test Azure AD SSO with Nitro Productivity Suite, complete the following building blocks:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) to enable your users to use this feature.
    1. [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with B.Simon.
    1. [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Azure AD single sign-on.
1. [Configure Nitro Productivity Suite SSO](#configure-nitro-productivity-suite-sso) to configure the single sign-on settings on the application side.
    1. [Create a Nitro Productivity Suite test user](#create-a-nitro-productivity-suite-test-user) to have a counterpart of B.Simon in Nitro Productivity Suite, linked to the Azure AD representation of the user.
1. [Test SSO](#test-sso) to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Nitro Productivity Suite** application integration page, find the **Manage** section. Select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. In the **SAML Signing Certificate** section, find **Certificate (Base64)**. Select **Download** to download the certificate and save it on your computer.

	![Screenshot of SAML Signing Certificate section, with Download link highlighted](common/certificatebase64.png)
    
1. In the **Set up Nitro Productivity Suite** section, select the copy icon beside **Login URL**.
    
    ![Screenshot of Set up Nitro Productivity Suite section, with URLs and copy icons highlighted](common/copy-configuration-urls.png)
    
1. In the [Nitro Admin portal](https://admin.gonitro.com/), on the **Enterprise Settings** page, find the **Single Sign-On** section. Select **Setup SAML SSO**.

	a. Paste the **Login URL** from the preceding step into the **Sign In URL** field.
	
	b. Upload the **Certificate (Base64)** from the earlier step in the **X509 Signing Certificate** field.
	
	c. Select **Submit**.
	
	d. Select **Enable Single Sign-On**.


1. Return to the [Azure portal](https://portal.azure.com/). On the **Set up Single Sign-On with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up Single Sign-On with SAML page, with pencil icon highlighted](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, if you want to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, copy and paste the **SAML Entity ID** field from the [Nitro Admin portal](https://admin.gonitro.com/). It should have the following pattern:
    `urn:auth0:gonitro-prod:<ENVIRONMENT>`

    b. In the **Reply URL** text box, copy and paste the **ACS URL** field from the [Nitro Admin portal](https://admin.gonitro.com/). It should have the following pattern:
    `https://gonitro-prod.eu.auth0.com/login/callback?connection=<ENVIRONMENT>`

1. Select **Set additional URLs**, and perform the following step if you want to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://sso.gonitro.com/login`

1. Select **Save**.

1. The Nitro Productivity Suite application expects the SAML assertions to be in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot of default attributes](common/default-attributes.png)

1. In addition to the preceding attributes, the Nitro Productivity Suite application expects a few more attributes to be passed back in the SAML response. These attributes are pre-populated, but you can review them per your requirements.
	
	| Name  |  Source attribute|
	| ---------------| --------------- |
	| employeeNumber |  user.objectid |


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

In this section, you enable B.Simon to use Azure single sign-on by granting access to Nitro Productivity Suite.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **Nitro Productivity Suite**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.

   ![Screenshot of the Manage section, with Users and groups highlighted](common/users-groups-blade.png)

1. Select **Add user**. Then, in the **Add Assignment** dialog box, select **Users and groups**.

	![Screenshot of Users and groups page, with Add user highlighted](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** from the list of users. Then choose **Select** at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then choose **Select** at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure Nitro Productivity Suite SSO

To configure single sign-on on Nitro Productivity Suite side, send the downloaded **Certificate (Base64)** and appropriate copied URLs from the Azure portal to the [Nitro Productivity Suite support team](https://www.gonitro.com/support). The support team ensures that the SAML SSO connection is set properly on both sides.

### Create a Nitro Productivity Suite test user

Nitro Productivity Suite supports just-in-time user provisioning, which is enabled by default. There is no additional action for you to take. If a user doesn't already exist in Nitro Productivity Suite, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration by using Access Panel.

When you select the Nitro Productivity Suite tile in Access Panel, you're automatically signed in to the Nitro Productivity Suite for which you set up SSO. For more information, see [Sign in and start apps from the My Apps portal](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [Tutorials for integrating SaaS applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Nitro Productivity Suite with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [Protect Nitro Productivity Suite with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

