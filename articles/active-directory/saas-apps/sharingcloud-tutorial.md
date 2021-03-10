---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with SharingCloud | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Instant Suite.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/09/2021
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with SharingCloud

In this tutorial, you'll learn how to integrate SharingCloud with Azure Active Directory (Azure AD). When you integrate SharingCloud with Azure AD, you can:

* Control in Azure AD who has access to SharingCloud.
* Enable your users to be automatically signed-in to SharingCloud with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

If you want to learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get one-month free trial [here](https://azure.microsoft.com/pricing/free-trial/).
* SharingCloud single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* SharingCloud supports **SP and IDP** initiated SSO
* SharingCloud supports **Just In Time** user provisioning

## Adding SharingCloud from the gallery

To configure the integration of SharingCloud into Azure AD, you need to add SharingCloud from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.

	![The Azure Active Directory button](common/select-azuread.png)
	
1. Navigate to **Enterprise Applications** and then select **All Applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)
	
1. To add new application, select **New application**.

	![The New application button](common/add-new-app.png)
	
1. In the **Add from the gallery** section, type **SharingCloud** in the search box.

	![SharingCloud in the results list](common/search-new-app.png)
	
1. Select **SharingCloud** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for SharingCloud

Configure and test Azure AD SSO with SharingCloud using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in SharingCloud.

To configure and test Azure AD SSO with SharingCloud, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure SharingCloud SSO](#configure-sharingcloud-sso)** - to configure the single sign-on settings on application side.
    1. **[Create SharingCloud test user](#create-sharingcloud-test-user)** - to have a counterpart of B.Simon in SharingCloud that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **SharingCloud** application integration page, find the **Manage** section and select **single sign-on**.
	
	![Configure single sign-on link](common/select-sso.png)
	
1. On the **Select a single sign-on method** page, select **SAML**.

	![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up single sign-on with SAML** page, click the **Edit** icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

	Upload the metadata file with XML file provided by SharingCloud. Contact the [SharingCloud Client support team](mailto:support@sharingcloud.com) to get the file.

	![image](common/upload-metadata.png)
	
	Select the metadata file provided and click on **Upload**.

	![image](common/browse-upload-metadata.png)

1. SharingCloud application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/edit_attribute.png)

1. In addition to above, SharingCloud application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirement.

	| Name | Source Attribute|
	| ---------------| --------- |
	| urn:sharingcloud:sso:firstname | user.givenname |
	| urn:sharingcloud:sso:lastname | user.surname |
	| urn:sharingcloud:sso:email | user.mail |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click on **Copy** icon to copy the **Federation Metadata Url** from the given options as per your requirement.

	![The Metadata Url to copy](common/copy_metadataurl.png)

## Configure SharingCloud SSO

To configure single sign-on on **SharingCloud** side, you need to send the copied **Federation Metadata Url** from Azure portal to [SharingCloud support team](mailto:support@sharingcloud.com). They set this setting to have the SAML SSO connection set properly on both sides.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to SharingCloud.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **SharingCloud**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

   ![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create SharingCloud test user

In this section, a user called Britta Simon is created in SharingCloud. SharingCloud supports Just In Time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in SharingCloud, a new one is created after authentication.

## Test SSO 

* Go to your SharingCloud URL directly and initiate the login flow from there.

## Next steps

Once you configure SharingCloud you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).

