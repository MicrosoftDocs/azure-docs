---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with CloudPassage | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and CloudPassage.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: bfe1f14e-74e4-4680-ac9e-f7355e1c94cc
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 10/22/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with CloudPassage

In this tutorial, you'll learn how to integrate CloudPassage with Azure Active Directory (Azure AD). When you integrate CloudPassage with Azure AD, you can:

* Control in Azure AD who has access to CloudPassage.
* Enable your users to be automatically signed in to CloudPassage with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* CloudPassage single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* CloudPassage supports **SP** initiated SSO

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding CloudPassage from the gallery

To configure the integration of CloudPassage into Azure AD, you need to add CloudPassage from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **CloudPassage** in the search box.
1. Select **CloudPassage** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for CloudPassage

Configure and test Azure AD SSO with CloudPassage using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in CloudPassage.

To configure and test Azure AD SSO with CloudPassage, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure CloudPassage SSO](#configure-cloudpassage-sso)** - to configure the single sign-on settings on application side.
    1. **[Create CloudPassage test user](#create-cloudpassage-test-user)** - to have a counterpart of B.Simon in CloudPassage that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **CloudPassage** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

     a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://portal.cloudpassage.com/saml/init/accountid`

	b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://portal.cloudpassage.com/saml/consume/accountid`. You can get your value for this attribute by clicking **SSO Setup documentation** in the **Single Sign-on Settings** section of your CloudPassage portal.

	![Configure Single Sign-On](./media/cloudpassage-tutorial/tutorial_cloudpassage_05.png)

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL and Reply URL. Contact [CloudPassage Client support team](https://www.cloudpassage.com/company/contact/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. CloudPassage application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/edit-attribute.png)

1. In addition to above, CloudPassage application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirement.

	| Name | Source Attribute|
	| ---------------| --------------- |
	| firstname |user.givenname |
	| lastname |user.surname |
	| email |user.mail |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up CloudPassage** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to CloudPassage.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **CloudPassage**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure CloudPassage SSO

1. In a different browser window, sign-on to your CloudPassage company site as administrator.

1. In the menu on the top, click **Settings**, and then click **Site Administration**. 
   
    ![Configure Single Sign-On][12]

1. Click the **Authentication Settings** tab. 
   
    ![Configure Single Sign-On][13]

1. In the **Single Sign-on Settings** section, perform the following steps: 
   
    ![Configure Single Sign-On][14]

	a. Select **Enable Single sign-on(SSO)(SSO Setup Documentation)** checkbox.
	
	b. Paste **Azure AD Identifier** into the **SAML issuer URL** textbox.
  
    c. Paste **Login URL** into the **SAML endpoint URL** textbox.
  
    d. Paste **Logout URL** into the **Logout landing page** textbox.
  
    e. Open your downloaded certificate in notepad, copy the content of downloaded certificate into your clipboard, and then paste it into the **x 509 certificate** textbox.
  
    f. Click **Save**.

### Create CloudPassage test user

The objective of this section is to create a user called B.Simon in CloudPassage.

**To create a user called B.Simon in CloudPassage, perform the following steps:**

1. Sign-on to your **CloudPassage** company site as an administrator. 

1. In the toolbar on the top, click **Settings**, and then click **Site Administration**. 
   
	![Creating a CloudPassage test user][22] 

1. Click the **Users** tab, and then click **Add New User**. 
   
	![Creating a CloudPassage test user][23]

1. In the **Add New User** section, perform the following steps: 
   
	![Creating a CloudPassage test user][24]
	
	a. In the **First Name** textbox, type Britta. 
  
    b. In the **Last Name** textbox, type Simon.
  
    c. In the **Username** textbox, the **Email** textbox and the **Retype Email** textbox, type Britta's user name in Azure AD.
  
    d. As **Access Type**, select **Enable Halo Portal Access**.
  
    e. Click **Add**.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the CloudPassage tile in the Access Panel, you should be automatically signed in to the CloudPassage for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try CloudPassage with Azure AD](https://aad.portal.azure.com/)

<!--Image references-->

[12]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_07.png
[13]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_08.png
[14]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_09.png
[15]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_10.png
[22]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_15.png
[23]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_16.png
[24]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_17.png

