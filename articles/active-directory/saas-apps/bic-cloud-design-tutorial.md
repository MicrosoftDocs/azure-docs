---
title: 'Tutorial: Azure AD SSO integration with BIC Process Design'
description: Learn how to configure single sign-on between Azure Active Directory and BIC Process Design.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---

# Tutorial: Azure AD SSO integration with BIC Process Design

In this tutorial, you'll learn how to integrate BIC Process Design with Azure Active Directory (Azure AD). When you integrate BIC Process Design with Azure AD, you can:

* Control in Azure AD who has access to BIC Process Design.
* Enable your users to be automatically signed-in to BIC Process Design with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* BIC Process Design single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* BIC Process Design supports **SP** initiated SSO.

## Add BIC Process Design from the gallery

To configure the integration of BIC Process Design into Azure AD, you need to add BIC Process Design from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **BIC Process Design** in the search box.
1. Select **BIC Process Design** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for BIC Process Design

Configure and test Azure AD SSO with BIC Process Design using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in BIC Process Design.

To configure and test Azure AD SSO with BIC Process Design, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure BIC Process Design SSO](#configure-bic-process-design-sso)** - to configure the single sign-on settings on application side.
    1. **[Create BIC Process Design test user](#create-bic-process-design-test-user)** - to have a counterpart of B.Simon in BIC Process Design that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **BIC Process Design** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file**, perform the following steps:

	a. Click **Upload metadata file**.

    ![Upload metadata file](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![choose metadata file](common/browse-upload-metadata.png)

	c. After the metadata file is successfully uploaded, the **Identifier** value gets auto populated in Basic SAML Configuration section.

	d. In the **Sign-on URL** text box, type a URL using one of the following patterns:

    | Sign-on URL |
	|-----|
    | `https://<CUSTOMER_SPECIFIC_NAME/TENANT>.biccloud.com` |
    | `https://<CUSTOMER_SPECIFIC_NAME/TENANT>.biccloud.de` |
    
	> [!Note]
	> If the **Identifier** value does not get auto populated, then please fill in the value manually according to your requirement. The Sign-on URL value is not real. Update this value with the actual Sign-on URL. Contact [BIC Process Design Client support team](mailto:bicsupport@gbtec.de) to get this value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. BIC Process Design application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, BIC Process Design application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name | Source Attribute|
	| ------------ | --------- |
	| Name | user.name |
	| E-Mail Address | user.mail |
	| Name ID | user.userprincipalname |
	| email | user.mail |
	| nametest | user.displayname |

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to BIC Process Design.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **BIC Process Design**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure BIC Process Design SSO

To configure single sign-on on **BIC Process Design** side, you need to send the **App Federation Metadata Url** to [BIC Process Design support team](mailto:bicsupport@gbtec.de). They set this setting to have the SAML SSO connection set properly on both sides.

### Create BIC Process Design test user

In this section, you create a user called B.Simon in BIC Process Design. Work with [BIC Process Design support team](mailto:bicsupport@gbtec.de) to add the users in the BIC Process Design platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to BIC Process Design Sign-on URL where you can initiate the login flow. 

* Go to BIC Process Design Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the BIC Process Design tile in the My Apps, this will redirect to BIC Process Design Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure BIC Process Design you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).