---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with IQNavigator VMS | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and IQNavigator VMS.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: a8a09b25-dfa5-4c31-aea2-53bf1853b365
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 10/23/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with IQNavigator VMS

In this tutorial, you'll learn how to integrate IQNavigator VMS with Azure Active Directory (Azure AD). When you integrate IQNavigator VMS with Azure AD, you can:

* Control in Azure AD who has access to IQNavigator VMS.
* Enable your users to be automatically signed-in to IQNavigator VMS with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* IQNavigator VMS single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.


* IQNavigator VMS supports **IDP** initiated SSO

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.



## Adding IQNavigator VMS from the gallery

To configure the integration of IQNavigator VMS into Azure AD, you need to add IQNavigator VMS from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **IQNavigator VMS** in the search box.
1. Select **IQNavigator VMS** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for IQNavigator VMS

Configure and test Azure AD SSO with IQNavigator VMS using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in IQNavigator VMS.

To configure and test Azure AD SSO with IQNavigator VMS, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure IQNavigator VMS SSO](#configure-iqnavigator-vms-sso)** - to configure the single sign-on settings on application side.
    1. **[Create IQNavigator VMS test user](#create-iqnavigator-vms-test-user)** - to have a counterpart of B.Simon in IQNavigator VMS that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **IQNavigator VMS** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL:
    `iqn.com`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<subdomain>.iqnavigator.com/security/login?client_name=https://sts.window.net/<instance name>`

    c. Click **Set additional URLs**.

    d. In the **Relay State** text box, type a URL using the following pattern:
    `https://<subdomain>.iqnavigator.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Reply URL and Relay State. Contact [IQNavigator VMS Client support team](https://www.beeline.com/support-iqn/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. IQNavigator application expect the Unique User Identifier value in the Name Identifier claim. Customer can map the correct value for the Name Identifier claim. In this case we have mapped the user.UserPrincipalName for the demo purpose. But according to your organization settings you should map the correct value for it.

	![image](common/edit-attribute.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to IQNavigator VMS.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **IQNavigator VMS**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure IQNavigator VMS SSO

To configure single sign-on on **IQNavigator VMS** side, you need to send the **App Federation Metadata Url** to [IQNavigator VMS support team](https://www.beeline.com/support-iqn/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create IQNavigator VMS test user

In this section, you create a user called Britta Simon in IQNavigator VMS. Work with [IQNavigator VMS support team](https://www.beeline.com/support-iqn/) to add the users in the IQNavigator VMS platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the IQNavigator VMS tile in the Access Panel, you should be automatically signed in to the IQNavigator VMS for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try IQNavigator VMS with Azure AD](https://aad.portal.azure.com/)

