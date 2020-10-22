---
title: 'Tutorial: Azure Active Directory integration with Sansan | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Sansan.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/27/2020
ms.author: jeedes
---

# Tutorial: Integrate Sansan with Azure Active Directory

In this tutorial, you'll learn how to integrate Sansan with Azure Active Directory (Azure AD). When you integrate Sansan with Azure AD, you can:

* Control in Azure AD who has access to Sansan.
* Enable your users to be automatically signed-in to Sansan with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Sansan single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.
* Sansan supports **SP** initiated SSO.
* Once you configure Sansan you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Sansan from the gallery

To configure the integration of Sansan into Azure AD, you need to add Sansan from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Sansan** in the search box.
1. Select **Sansan** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO

Configure and test Azure AD SSO with Sansan using a test user called **Britta Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Sansan.

To configure and test Azure AD SSO with Sansan, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
   * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with Britta Simon.
   * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable Britta Simon to use Azure AD single sign-on.
1. **[Configure Sansan](#configure-sansan)** to configure the SSO settings on application side.
   * **[Create Sansan test user](#create-sansan-test-user)** to have a counterpart of Britta Simon in Sansan that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Sansan** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** page, enter the values for the following fields:

	1. In the **Sign-on URL** text box, type the URL: 
   `https://ap.sansan.com/`

   1. In the **Identifier (Entity ID)** text box, type the URL:  
   `https://ap.sansan.com/saml2/<company name>`

   1. In the **Reply URL** text box, type any one of the URLs using the following pattern:

    
	   | Environment | URL |
      |:--- |:--- |
      | PC |`https://ap.sansan.com/v/saml2/<company name>/acs` |
      | Smartphone App |`https://internal.api.sansan.com/<company name>/acs` |
      | Smartphone Web |`https://ap.sansan.com/s/saml2/<company name>/acs` |

	> [!NOTE]
	> These values are not real. Check the actual values on the **Sansan admin settings**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Sansan** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called Britta Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `Britta Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `BrittaSimon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable Britta Simon to use Azure single sign-on by granting access to Sansan.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Sansan**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **Britta Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Sansan

To perform the **Single Sign-On settings** on the **Sansan** side, please follow the below steps according to your requirement.

   * [Japanese](https://jp-help.sansan.com/hc/ja/articles/900001551383 ) version.

   * [English](https://jp-help.sansan.com/hc/en-us/articles/900001551383 ) version.


### Create Sansan test user

In this section, you create a user called Britta Simon in Sansan. For more information on how to create a user, please refer [these](https://jp-help.sansan.com/hc/en-us/articles/206508997-Adding-users) steps.

## Test SSO

When you select the Sansan tile in the Access Panel, you should be automatically signed in to the Sansan for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)