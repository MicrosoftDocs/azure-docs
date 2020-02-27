---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Catchpoint | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Catchpoint.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: ab3eead7-8eb2-4c12-bb3a-0e46ec899d37
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 02/27/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Catchpoint

In this tutorial, you'll learn how to integrate Catchpoint with Azure Active Directory (Azure AD). When you integrate Catchpoint with Azure AD, you can:

* Control in Azure AD who has access to Catchpoint.
* Enable your users to be automatically signed-in to Catchpoint with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Catchpoint single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Catchpoint supports **SP and IDP** initiated SSO
* Catchpoint supports **Just In Time** user provisioning
* Once you configure Catchpoint you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Catchpoint from the gallery

To configure the integration of Catchpoint into Azure AD, you need to add Catchpoint from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Catchpoint** in the search box.
1. Select **Catchpoint** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Catchpoint

Configure and test Azure AD SSO with Catchpoint using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Catchpoint.

To configure and test Azure AD SSO with Catchpoint, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Catchpoint SSO](#configure-catchpoint-sso)** - to configure the single sign-on settings on application side.
    * **[Create Catchpoint test user](#create-catchpoint-test-user)** - to have a counterpart of B.Simon in Catchpoint that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Catchpoint** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Setup single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file** and wish to configure in **IDP** intiated mode, perform the following steps:

	a. Click **Upload metadata file**.

    ![Upload metadata file](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![choose metadata file](common/browse-upload-metadata.png)

	c. After the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Basic SAML Configuration section.

	![image](common/idp-intiated.png)

	> [!Note]
	> If the **Identifier** and **Reply URL** values do not get auto polulated, then fill in the values manually according to your requirement.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![image](common/metadata-upload-additional-signon.png)

	In the **Sign-on URL** text box, type the URL:
    `https://portal.catchpoint.com/ui/Entry/SingleSignOn.aspx`

1. If you do not have **Service Provider metadata file**, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type the URL:
    `https://portal.catchpoint.com/SAML2`

    b. In the **Reply URL** text box, type the URL:
    `https://portal.catchpoint.com/ui/Entry/SingleSignOn.aspx`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://portal.catchpoint.com/ui/Entry/SingleSignOn.aspx`

1. On the **Setup single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Catchpoint** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Catchpoint.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Catchpoint**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Catchpoint SSO

1. In a different web browser window, sign into Catchpoint application as an adminstrator.

1. Click on the **Settings** icon and select **SSO Identity Provider**.

    ![Catchpoint configuration](./media/catchpoint-tutorial/configuration1.png)

1. On the **Single Sign On** page, perform the following steps:

    ![Catchpoint configuration](./media/catchpoint-tutorial/configuration2.png)

	1. In the **Namespace** textbox, enter namespace as `azure AD test`.

	1. In the **Identity Provider Issuer** textbox, enter the **Azure AD Identifier** value, which you have copied from the Azure portal.

	1. In the **Single Sign On Url** textbox, enter the **Login URL** value, which you have copied from the Azure portal.

	1. Open the downloaded **Certificate (Base64)** file into Notepad, copy the content of certificate file and paste it into **Certificate** textbox.

    1. You can also upload the **Federation Metadata XML** by clicking on the **Upload Metadata** option.

	1. Click **Save**.

### Create Catchpoint test user

In this section, a user called Britta Simon is created in Catchpoint. Catchpoint supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Catchpoint, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Catchpoint tile in the Access Panel, you should be automatically signed in to the Catchpoint for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Catchpoint with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)