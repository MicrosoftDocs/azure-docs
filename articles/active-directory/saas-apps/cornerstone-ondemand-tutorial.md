---
title: 'Tutorial: Azure Active Directory Single sign-on (SSO) integration with Cornerstone OnDemand | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Cornerstone OnDemand.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: f57c5fef-49b0-4591-91ef-fc0de6d654ab
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 01/31/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory Single sign-on (SSO) integration with Cornerstone OnDemand

In this tutorial, you'll learn how to integrate Cornerstone OnDemand with Azure Active Directory (Azure AD). When you integrate Cornerstone OnDemand with Azure AD, you can:

* Control in Azure AD who has access to Cornerstone OnDemand.
* Enable your users to be automatically signed-in to Cornerstone OnDemand with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Cornerstone OnDemand single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Cornerstone OnDemand supports **SP** initiated SSO
* Cornerstone OnDemand supports [Automated user provisioning](cornerstone-ondemand-provisioning-tutorial.md)
* Once you configure Cornerstone OnDemand you can enforce Session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

## Adding Cornerstone OnDemand from the gallery

To configure the integration of Cornerstone OnDemand into Azure AD, you need to add Cornerstone OnDemand from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Cornerstone OnDemand** in the search box.
1. Select **Cornerstone OnDemand** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Cornerstone OnDemand

Configure and test Azure AD SSO with Cornerstone OnDemand using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Cornerstone OnDemand.

To configure and test Azure AD SSO with Cornerstone OnDemand, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
2. **[Configure Cornerstone OnDemand SSO](#configure-cornerstone-ondemand-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create Cornerstone OnDemand test user](#create-cornerstone-ondemand-test-user)** - to have a counterpart of B.Simon in Cornerstone OnDemand that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Cornerstone OnDemand** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<company>.csod.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<company>.csod.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Cornerstone OnDemand Client support team](mailto:moreinfo@csod.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Cornerstone OnDemand** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Cornerstone OnDemand.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Cornerstone OnDemand**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   	![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Cornerstone OnDemand SSO

To configure single sign-on on **Cornerstone OnDemand** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Cornerstone OnDemand support team](mailto:moreinfo@csod.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Cornerstone OnDemand test user

The objective of this section is to create a user called B.Simon in Cornerstone OnDemand. Cornerstone OnDemand supports automatic user provisioning, which is by default enabled. You can find more details [here](https://docs.microsoft.com/azure/active-directory/saas-apps/cornerstone-ondemand-provisioning-tutorial) on how to configure automatic user provisioning.

**If you need to create user manually, perform following steps:**

To configure user provisioning, send the information (e.g.: Name, Email) about the Azure AD user you want to provision to the [Cornerstone OnDemand support team](mailto:moreinfo@csod.com).

>[!NOTE]
>You can use any other Cornerstone OnDemand user account creation tools or APIs provided by Cornerstone OnDemand to provision Azure AD user accounts.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Cornerstone OnDemand tile in the Access Panel, you should be automatically signed in to the Cornerstone OnDemand for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Cornerstone OnDemand with Azure AD](https://aad.portal.azure.com)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)