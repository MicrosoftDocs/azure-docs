---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with IamIP Patent Platform | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and IamIP Patent Platform.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 8d5b4fc1-e8fd-4418-a369-189272fef80d
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 02/10/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with IamIP Patent Platform

In this tutorial, you'll learn how to integrate IamIP Patent Platform with Azure Active Directory (Azure AD). When you integrate IamIP Patent Platform with Azure AD, you can:

* Use Azure AD to control who can access IamIP Patent Platform.
* Enable your users to be automatically signed-in to IamIP Patent Platform with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

To learn more about SaaS app integration with Azure AD, see [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An IamIP Patent Platform subscription with single sign-on (SSO) enabled.

## Tutorial description

In this tutorial, you'll configure and test Azure AD SSO in a test environment.

IamIP Patent Platform supports SP-initiated and IDP-initiated SSO.

After you configure the IamIP Patent Platform, you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).


## Add IamIP Patent Platform from the gallery

To configure the integration of IamIP Patent Platform into Azure AD, you need to add IamIP Patent Platform from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) with a work or school account or with a personal Microsoft account.
1. In the left pane, select **Azure Active Directory**.
1. Go to **Enterprise applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **IamIP Patent Platform** in the search box.
1. Select **IamIP Patent Platform** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for IamIP Patent Platform

You'll configure and test Azure AD SSO with IamIP Patent Platform by using a test user named B.Simon. For SSO to work, you need to establish a link relationship between an Azure AD user and the corresponding user in IamIP Patent Platform.

To configure and test Azure AD SSO with IamIP Patent Platform, you'll take these high-level steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use the feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on.
    * **[Grant access to the test user](#grant-access-to-the-test-user)** to enable the user to use Azure AD single sign-on.

1. **[Configure IamIP Patent Platform SSO](#configure-iamip-patent-platform-sso)** on the application side.
    * **[Create an IamIP Patent Platform test user](#create-iamip-patent-platform-test-user)** as a counterpart to the Azure AD representation of the user.

1. **[Test SSO](#test-sso)** to verify that the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), on the **IamIP Patent Platform** application integration page, in the **Manage** section, select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil button for **Basic SAML Configuration** to edit the settings:

   ![Pencil button for Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, if you have a Service Provider metadata file and want to configure SSO in IDP-initiated mode, take these steps:

	a. Select **Upload metadata file**:

    ![Upload metadata file](common/upload-metadata.png)

	b. Select the folder button, select the metadata file, and then select **Upload**:

	![Folder and Upload buttons](common/browse-upload-metadata.png)

	c. After the metadata file uploads, the **Identifier** and **Reply URL** values automatically populate in the **Basic SAML Configuration** section:

	![Identifier and Reply URL values](common/idp-intiated.png)

	> [!Note]
	> If the **Identifier** and **Reply URL** values aren't automatically populated, supply the values manually according to your requirements.

1. Select **Set additional URLs** and complete the following step if you want to configure the application in SP-initiated mode:

	In the **Sign-on URL** box, enter
    **https:\//patents.iamip.com/login-user**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select the **Download** link for **Certificate (Raw)** to download the certificate and save it on your computer:

	![Certificate download link](common/certificateraw.png)

1. In the **Set up IamIP Patent Platform** section, copy the appropriate URL or URLs, based on your requirements:

	![Copy configuration URLs](common/idp-intiated.png))

### Create an Azure AD test user

In this section, you'll create a test user named B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**. Select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, complete these steps:
   1. In the **Name** box, enter **B.Simon**.  
   1. In the **User name** box, enter \<username>@\<companydomain>.\<extension>. For example, `B.Simon@contoso.com`.
   1. Select **Show password**, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

### Grant access to the test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting that user access to IamIP Patent Platform.

1. In the Azure portal, select **Enterprise applications**, and then select **All applications**.
1. In the applications list, select **IamIP Patent Platform**.
1. On the app's overview page, in the **Manage** section, select **Users and groups**:

   ![Select Users and groups](common/users-groups-blade.png)

1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box:

	![Select Add user](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** in the **Users** list, and then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure IamIP Patent Platform SSO

To configure single sign-on on the IamIP Patent Platform side, you need to send the downloaded raw certificate and the appropriate URLs that you copied from Azure portal to the [IamIP Patent Platform support team](mailto:info@iamip.com). They configure the SAML SSO connection to be correct on both sides.

### Create IamIP Patent Platform test user

Work with the [IamIP Patent Platform support team](mailto:info@iamip.com) to add a user named B.Simon in IamIP Patent Platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you'll test your Azure AD SSO configuration by using Access Panel.

When you select the IamIP Patent Platform tile in Access Panel, you should be automatically signed in to the IamIP Patent Platform instance for which you set up SSO. For more information about Access Panel, see [Introduction to Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [Tutorials on how to integrate SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try IamIP Patent Platform with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
