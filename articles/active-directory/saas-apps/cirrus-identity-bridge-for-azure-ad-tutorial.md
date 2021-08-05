---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Cirrus Identity Bridge for Azure AD | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Cirrus Identity Bridge for Azure AD.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/03/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Cirrus Identity Bridge for Azure AD

In this tutorial, you'll learn how to integrate Cirrus Identity Bridge for Azure AD with Azure Active Directory (Azure AD). When you integrate Cirrus Identity Bridge for Azure AD with Azure AD, you can:

* Control in Azure AD who has access to Cirrus Identity Bridge for Azure AD.
* Enable your users to be automatically signed-in to Cirrus Identity Bridge for Azure AD with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Cirrus Identity Bridge for Azure AD single sign-on (SSO) enabled subscription. If you are not already a subscriber, please visit the [Cirrus Identity Azure AD Bridge Registration Page](https://info.cirrusidentity.com/cirrus-identity-azure-ad-app-gallery-registration).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Cirrus Identity Bridge for Azure AD supports **SP** and **IDP** initiated SSO.

## Add Cirrus Identity Bridge for Azure AD from the gallery

To configure the integration of Cirrus Identity Bridge for Azure AD into Azure AD, you need to add Cirrus Identity Bridge for Azure AD from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Cirrus Identity Bridge for Azure AD** in the search box.
1. Select **Cirrus Identity Bridge for Azure AD** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Cirrus Identity Bridge for Azure AD

Configure and test Azure AD SSO with Cirrus Identity Bridge for Azure AD using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Cirrus Identity Bridge for Azure AD.

To configure and test Azure AD SSO with Cirrus Identity Bridge for Azure AD, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Cirrus Identity Bridge for Azure AD SSO](#configure-cirrus-identity-bridge-for-azure-ad-sso)** - to configure the single sign-on settings on application side.
    1. **[Setup Cirrus Identity Bridge for Azure AD testing](#setup-cirrus-identity-bridge-for-azure-ad-testing)** - to have a counterpart of B.Simon in Cirrus Identity Bridge for Azure AD that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Cirrus Identity Bridge for Azure AD** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.cirrusidentity.com/bridge`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<NAME>.proxy.cirrusidentity.com/module.php/saml/sp/saml2-acs.php/<NAME>_proxy`

1. Click Set additional URLs and perform the following step if you wish to configure the application in SP initiated mode:
 
    In the **Sign on URL** text box, type a value using the following pattern:
    `<CUSTOMER_LOGIN_URL>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Sign on URL. If you have not yet subscribed to the Cirrus Bridge, please visit the [registration page](https://info.cirrusidentity.com/cirrus-identity-azure-ad-app-gallery-registration). If you are an existing Cirrus Bridge customer, contact [Cirrus Identity Bridge for Azure AD Client support team](https://www.cirrusidentity.com/resources/service-desk) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Cirrus Identity Bridge for Azure AD application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Cirrus Identity Bridge for Azure AD application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name |  Source Attribute|
	| ---------| --------- |
	| displayname | user.displayname |

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Cirrus Identity Bridge for Azure AD.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Cirrus Identity Bridge for Azure AD**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Cirrus Identity Bridge for Azure AD SSO

To configure single sign-on on **Cirrus Identity Bridge for Azure AD** side, you need to send the **App Federation Metadata Url** to [Cirrus Identity Bridge for Azure AD support team](https://www.cirrusidentity.com/resources/service-desk). They set this setting to have the SAML SSO connection set properly on both sides.

### Setup Cirrus Identity Bridge for Azure AD testing

In this section, you verify a user called Britta Simon can be used for testing. The [Cirrus Identity Bridge for Azure AD support team](https://www.cirrusidentity.com/resources/service-desk) will provide a testing URL to verify Britta Simon is ready to use with the Cirrus Identity Bridge for Azure AD platform. The test user Britta Simon will need to also be added to any applications using the Cirrus Identity Bridge for Azure AD as a method to authenticate (for example, applications in multilateral federation metadata). 

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Cirrus Identity Bridge for Azure AD Sign on URL where you can initiate the login flow.  

* Go to Cirrus Identity Bridge for Azure AD Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Cirrus Identity Bridge for Azure AD for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Cirrus Identity Bridge for Azure AD tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Cirrus Identity Bridge for Azure AD for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Cirrus Identity Bridge for Azure AD you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).