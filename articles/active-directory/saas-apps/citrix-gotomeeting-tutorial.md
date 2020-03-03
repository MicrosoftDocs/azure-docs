---
title: 'Tutorial: Azure Active Directory integration with GoToMeeting | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and GoToMeeting.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: bcaf19f2-5809-4e1c-acbc-21a8d3498ccf
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 01/16/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory single sign-on (SSO) integration with GoToMeeting

In this tutorial, you'll learn how to integrate GoToMeeting with Azure Active Directory (Azure AD). When you integrate GoToMeeting with Azure AD, you can:

* Control in Azure AD who has access to GoToMeeting.
* Enable your users to be automatically signed-in to GoToMeeting with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* GoToMeeting single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* GoToMeeting supports **IDP** initiated SSO.
* Once you configure the GoToMeeting you can enforce session controls, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session controls extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

## Adding GoToMeeting from the gallery

To configure the integration of GoToMeeting into Azure AD, you need to add GoToMeeting from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **GoToMeeting** in the search box.
1. Select **GoToMeeting** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for GoToMeeting

Configure and test Azure AD SSO with GoToMeeting using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in GoToMeeting.

To configure and test Azure AD SSO with GoToMeeting, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure GoToMeeting SSO](#configure-gotomeeting-sso)** - to configure the single sign-on settings on application side.
    * **[Create GoToMeeting test user](#create-gotomeeting-test-user)** - to have a counterpart of B.Simon in GoToMeeting that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **GoToMeeting** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://authentication.logmeininc.com/saml/sp`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://authentication.logmeininc.com/saml/acs`

    c. Click **set additional URLs** and configure the below URLs

    d. **Sign on URL** (keep this blank)

    e. In the **RelayState** text box, type a URL using the following pattern:

   - For GoToMeeting App, use `https://global.gotomeeting.com`

   - For GoToTraining, use `https://global.gototraining.com`

   - For GoToWebinar, use `https://global.gotowebinar.com` 

   - For GoToAssist, use `https://app.gotoassist.com`

     > [!NOTE]
     > These values are not real. Update these values with the actual Identifier and Reply URL. Contact [GoToMeeting Client support team](https://go.microsoft.com/fwlink/?linkid=845985) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up GoToMeeting** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL


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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to GoToMeeting.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **GoToMeeting**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure GoToMeeting SSO

1. In a different browser window, log in to your [GoToMeeting Organization Center](https://organization.logmeininc.com/). You will be prompted to confirm that the IdP has been updated.

2. Enable the "My Identity Provider has been updated with the new domain" checkbox. Click **Done** when finished.

### Create GoToMeeting test user

In this section, a user called Britta Simon is created in GoToMeeting. GoToMeeting supports just-in-time provisioning, which is enabled by default.

There is no action item for you in this section. If a user doesn't already exist in GoToMeeting, a new one is created when you attempt to access GoToMeeting.

> [!NOTE]
> If you need to create a user manually, Contact [GoToMeeting support team](https://support.logmeininc.com/gotomeeting).

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the GoToMeeting tile in the Access Panel, you should be automatically signed in to the GoToMeeting for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try GoToMeeting with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect GoToMeeting with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
