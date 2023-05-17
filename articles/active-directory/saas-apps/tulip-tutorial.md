---
title: 'Tutorial: Azure AD SSO integration with Tulip'
description: Learn how to configure single sign-on between Azure Active Directory and Tulip.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with Tulip

In this tutorial, you'll learn how to integrate Tulip with Azure Active Directory (Azure AD). When you integrate Tulip with Azure AD, you can:

* Control in Azure AD who has access to Tulip.
* Enable your users to be automatically signed-in to Tulip with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Tulip single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Tulip supports **IDP** initiated SSO.

## Add Tulip from the gallery

To configure the integration of Tulip into Azure AD, you need to add Tulip from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Tulip** in the search box.
1. Select **Tulip** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Tulip

Configure and test Azure AD SSO with Tulip using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Tulip.

To configure and test Azure AD SSO with Tulip, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Tulip SSO](#configure-tulip-sso)** - to configure the single sign-on settings on application side.
    1. To configure SSO on a Tulip instance, with existing users, reach out to support@tulip.co.


## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Tulip** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file**, perform the following steps:

	a. Click **Upload metadata file**.

    ![image1](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![image2](common/browse-upload-metadata.png)

	c. Once the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Basic SAML Configuration section:

	![image3](common/idp-intiated.png)

	> [!Note]
	> If the **Identifier** and **Reply URL** values are not getting auto populated, then fill in the values manually according to your requirement.

1. Tulip application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. If the ```nameID``` needs to be an email, change the format to be ```Persistent```.

	![image](common/default-attributes.png)

1. In addition to the above, Tulip application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name |Source Attribute|
	| -------------- | --------- |
	| displayName | user.displayname |
	| emailAddress |user.mail |
	| badgeID |	user.employeeid |
	| groups |user.groups |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Tulip** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)


## Configure Tulip SSO

1. Log in to your Tulip website as an Account Owner.

1. Go to the **Settings** -> **SAML** and perform the following steps in the below page.

	![AzureMetadataXML.png](./media/tulip-tutorial/AzureMetadataXML.png)
	a. **Enable SAML Logins**. 

	b. Click on **metadata xml file** to download the **Service Provider metadata file** and use this file to upload in the **Basic SAML Configuration** section in Azure portal.

	c. Upload the Federation Metadata XML file from Azure to Tulip. This will populate the SSO Login, SSO Logout URL and the Certificates.

	d. Verify that the Name, Email and Badge attributes are not null, i.e. enter any unique strings in all three inputs and do a test authentication using the ```Authenticate``` button on the right.
	
	e. Upon successful authentication, copy/paste the entire claim URL into the appropriate mapping for the name, email and badgeID attributes.
	
	* Paste the **Name Attribute** value as **http://schemas.microsoft.com/identity/claims/displayname** or the appropriate claim URL.

	* Paste the **Email Attribute** value as **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name** or the appropriate claim URL.

	* Paste the **Badge Attribute** value as **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/badgeID** or the appropriate claim URL.

	* Paste the **Role Attribute** value as **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/groups** or the appropriate claim URL.

	f. Click **Save SAML Configuration**.


## Next steps

Once you configure Tulip you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

Please reach out to support@tulip.co for any further questions!
