---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with IWT Procurement Suite | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and IWT Procurement Suite.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 53e37c8d-85f4-4a9c-a46a-d4cdd91e38a1
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 04/23/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with IWT Procurement Suite

In this tutorial, you'll learn how to integrate IWT Procurement Suite with Azure Active Directory (Azure AD). When you integrate IWT Procurement Suite with Azure AD, you can:

* Control in Azure AD who has access to IWT Procurement Suite.
* Enable your users to be automatically signed-in to IWT Procurement Suite with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* IWT Procurement Suite single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* IWT Procurement Suite supports **IDP** initiated SSO
* Once you configure IWT Procurement Suite you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding IWT Procurement Suite from the gallery

To configure the integration of IWT Procurement Suite into Azure AD, you need to add IWT Procurement Suite from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **IWT Procurement Suite** in the search box.
1. Select **IWT Procurement Suite** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for IWT Procurement Suite

Configure and test Azure AD SSO with IWT Procurement Suite using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in IWT Procurement Suite.

To configure and test Azure AD SSO with IWT Procurement Suite, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure IWT Procurement Suite SSO](#configure-iwt-procurement-suite-sso)** - to configure the single sign-on settings on application side.
    1. **[Create IWT Procurement Suite test user](#create-iwt-procurement-suite-test-user)** - to have a counterpart of B.Simon in IWT Procurement Suite that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **IWT Procurement Suite** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://[customersubdomain].ionwave.net/sso/[customerid]`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://[customersubdomain].ionwave.net/sso/[customerid]`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [IWT Procurement Suite Client support team](mailto:support@ionwave.net) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. IWT Procurement Suite application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **Emailaddress** is mapped with **user.mail**. IWT Procurement Suite application expects **Emailaddress** to be mapped with **user.userprincipalname**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/default-attributes.png)



1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)
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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to IWT Procurement Suite.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **IWT Procurement Suite**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure IWT Procurement Suite SSO

To configure single sign-on on **IWT Procurement Suite** side, you need to send the **App Federation Metadata Url** to [IWT Procurement Suite support team](mailto:support@ionwave.net). They set this setting to have the SAML SSO connection set properly on both sides.

### Create IWT Procurement Suite test user

In this section, you create a user called Britta Simon in IWT Procurement Suite. Work with [IWT Procurement Suite support team](mailto:support@ionwave.net) to add the users in the IWT Procurement Suite platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the IWT Procurement Suite tile in the Access Panel, you should be automatically signed in to the IWT Procurement Suite for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try IWT Procurement Suite with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect IWT Procurement Suite with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

