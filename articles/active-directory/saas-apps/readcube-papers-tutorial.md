---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with ReadCube Papers | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ReadCube Papers.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/07/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with ReadCube Papers

In this tutorial, you'll learn how to integrate ReadCube Papers with Azure Active Directory (Azure AD). When you integrate ReadCube Papers with Azure AD, you can:

* Control in Azure AD who has access to ReadCube Papers.
* Enable your users to be automatically signed-in to ReadCube Papers with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* ReadCube Papers single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* ReadCube Papers supports **SP** initiated SSO.
* ReadCube Papers supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add ReadCube Papers from the gallery

To configure the integration of ReadCube Papers into Azure AD, you need to add ReadCube Papers from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **ReadCube Papers** in the search box.
1. Select **ReadCube Papers** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for ReadCube Papers

Configure and test Azure AD SSO with ReadCube Papers using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in ReadCube Papers.

To configure and test Azure AD SSO with ReadCube Papers, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure ReadCube Papers SSO](#configure-readcube-papers-sso)** - to configure the single sign-on settings on application side.
    1. **[Create ReadCube Papers test user](#create-readcube-papers-test-user)** - to have a counterpart of B.Simon in ReadCube Papers that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **ReadCube Papers** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following step:
	1. In the **Reply URL (ACS URL)** text box, type the URL: `https://connect.liblynx.com/saml/module.php/saml/sp/saml2-acs.php/dsrsi`
	2. In the **Sign on URL** text box, type the URL: `https://app.readcube.com`
	![image](https://user-images.githubusercontent.com/25511935/129353348-db8a58dc-0c62-46df-bc28-6787570c6408.png)

    	 
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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to ReadCube Papers.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **ReadCube Papers**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ReadCube Papers SSO

To configure single sign-on on the **ReadCube Papers** side, you need to send the **App Federation Metadata URL** to the [ReadCube Papers support team](mailto:sso-support@readcube.com). They change this setting so that the SAML SSO connection works properly on both sides.

### Create ReadCube Papers test user

In this section, a user called Britta Simon is created in ReadCube Papers. ReadCube Papers supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in ReadCube Papers, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

> [!NOTE]
> Before testing, please confirm with the [ReadCube Papers support team](mailto:sso-support@readcube.com) that SSO is set up on the ReadCube side.

* Click on **Test this application** in Azure portal. This will redirect to ReadCube Papers Sign-on URL where you can initiate the login flow. 

* Go to ReadCube Papers Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the ReadCube Papers tile in the My Apps, this will redirect to ReadCube Papers Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure ReadCube Papers you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
