---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Single Sign-on for Skytap | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Single Sign-on for Skytap.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: d6cb7ab2-da1a-4015-8e6f-c0c47bb6210f
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 02/13/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Single Sign-on for Skytap

In this tutorial, you'll learn how to integrate Single Sign-on for Skytap with Azure Active Directory (Azure AD). When you integrate Single Sign-on for Skytap with Azure AD, you can:

* Control in Azure AD who has access to Single Sign-on for Skytap.
* Enable your users to be automatically signed in to Single Sign-on for Skytap with their Azure AD accounts.
* Manage your accounts in one central location, the Azure portal.

To learn more about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Single Sign-on for Skytap single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Single Sign-on for Skytap supports SP and IDP initiated SSO.
* After you configure Single Sign-on for Skytap, you can enforce session control. This protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from conditional access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Add Single Sign-on for Skytap from the gallery

To configure the integration of Single Sign-on for Skytap into Azure AD, you need to add Single Sign-on for Skytap from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) by using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications** and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **Single Sign-on for Skytap** in the search box.
1. Select **Single Sign-on for Skytap** from the results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Single Sign-on for Skytap

Configure and test Azure AD SSO with Single Sign-on for Skytap by using a test user called **B.Simon**. For SSO to work, establish a linked relationship between an Azure AD user and the related user in Single Sign-on for Skytap.

Here are the general steps to configure and test Azure AD SSO with Single Sign-on for Skytap:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.

    a. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B.Simon.

    b. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Single Sign-on for Skytap SSO](#configure-single-sign-on-for-skytap-sso)** to configure the single sign-on settings on the application side.

    a. **[Create a Single Sign-on for Skytap test user](#create-single-sign-on-for-skytap-test-user)** to have a counterpart of B.Simon in Single Sign-on for Skytap. This counterpart is linked to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Single Sign-on for Skytap** application integration page, find the **Manage** section. Select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up single sign-on with SAML page, with pencil icon highlighted](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, if you want to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL that uses the following pattern:
    `http://pingone.com/<custom EntityID>`

    b. In the **Reply URL** text box, type a URL that uses the following pattern:
    `https://sso.connect.pingidentity.com/sso/sp/ACS.saml2`

1. Select **Set additional URLs**, and perform the following steps if you want to configure the application in **SP** initiated mode:

    a. In the **Sign-on URL** text box, type a URL that uses the following pattern:
    `https://sso.connect.pingidentity.com/sso/sp/initsso?saasid=<saasid>&idpid=<idpid>`

    
    b. In the **Relay State** text box, type a URL that uses the following pattern:
    `https://pingone.com/1.0/<custom ID>`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL, Sign-on URL and Relay State. Contact the [Single Sign-on for Skytap Client support team](mailto:support@skytap.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML**. Select **Download** to download the metadata file and save it on your computer.

	![Screenshot of the certificate download link](common/metadataxml.png)

1. On the **Set up Single Sign-on for Skytap** section, copy the appropriate URL or URLs, based on your requirement.

	![Screenshot of copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory** > **Users** > **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's shown in the **Password** field.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to Single Sign-on for Skytap.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **Single Sign-on for Skytap**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.

   ![Screenshot of the Manage section, with Users and groups highlighted](common/users-groups-blade.png)

1. Select **Add user**. In the **Add Assignment** dialog box, select **Users and groups**.

	![Screenshot of Users and groups page, with Add user highlighted](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** from the users list. Then choose the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then choose the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure Single Sign-on for Skytap SSO

To configure single sign-on on the Single Sign-on for Skytap side, you need to send the downloaded **Federation Metadata XML**, and appropriate copied URLs, from the Azure portal to the [Single Sign-on for Skytap Client support team](mailto:support@skytap.com). They configure this setting to have the SAML SSO connection set properly on both sides.


### Create Single Sign-on for Skytap test user

In this section, you create a user called B.Simon in Single Sign-on for Skytap. Work with the [Single Sign-on for Skytap Client support team](mailto:support@skytap.com) to add the users in the Single Sign-on for Skytap platform. You can't use single sign-on until you create and activate users.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration by using Access Panel.

When you select the Single Sign-on for Skytap tile in Access Panel, you should be automatically signed in to the Single Sign-on for Skytap for which you set up SSO. For more information, see [Introduction to Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [Tutorials for integrating SaaS applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Slack with Azure AD](https://aad.portal.azure.com/)

