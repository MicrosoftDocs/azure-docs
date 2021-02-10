---
title: 'Tutorial: Azure Active Directory integration with Palo Alto Networks - Aperture | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Palo Alto Networks - Aperture.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/10/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Palo Alto Networks - Aperture

In this tutorial, you learn how to integrate Palo Alto Networks - Aperture with Azure Active Directory (Azure AD).
Integrating Palo Alto Networks - Aperture with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Palo Alto Networks - Aperture.
* You can enable your users to be automatically signed-in to Palo Alto Networks - Aperture (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Palo Alto Networks - Aperture, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Palo Alto Networks - Aperture single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Palo Alto Networks - Aperture supports **SP** and **IDP** initiated SSO

## Adding Palo Alto Networks - Aperture from the gallery

To configure the integration of Palo Alto Networks - Aperture into Azure AD, you need to add Palo Alto Networks - Aperture from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Palo Alto Networks - Aperture** in the search box.
1. Select **Palo Alto Networks - Aperture** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO

In this section, you configure and test Azure AD single sign-on with Palo Alto Networks - Aperture based on a test user called **B.Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Palo Alto Networks - Aperture needs to be established.

To configure and test Azure AD single sign-on with Palo Alto Networks - Aperture, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	* **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
	* **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Palo Alto Networks - Aperture SSO](#configure-palo-alto-networks---aperture-sso)** - to configure the Single Sign-On settings on application side.
	* **[Create Palo Alto Networks - Aperture test user](#create-palo-alto-networks---aperture-test-user)** - to have a counterpart of Britta Simon in Palo Alto Networks - Aperture that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Palo Alto Networks - Aperture** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![Screenshot that shows the "Basic S A M L Configuration" with the "Identifier" and "Reply U R L" text boxes highlighted, and the "Save" action selected.](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<subdomain>.aperture.paloaltonetworks.com/d/users/saml/metadata`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<subdomain>.aperture.paloaltonetworks.com/d/users/saml/auth`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![Palo Alto Networks - Aperture Domain and URLs single sign-on information SP](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.aperture.paloaltonetworks.com/d/users/saml/sign_in`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Palo Alto Networks - Aperture Client support team](https://live.paloaltonetworks.com/t5/custom/page/page-id/Support) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. On the **Set up Palo Alto Networks - Aperture** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Palo Alto Networks - Aperture.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Palo Alto Networks - Aperture**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Palo Alto Networks - Aperture SSO

1. In a different web browser window, login to Palo Alto Networks - Aperture as an Administrator.

2. On the top menu bar, click **SETTINGS**.

	![The settings tab](./media/paloaltonetworks-aperture-tutorial/tutorial_paloaltonetwork_settings.png)

3. Navigate to **APPLICATION** section click **Authentication** form the left side of menu.

	![The Auth tab](./media/paloaltonetworks-aperture-tutorial/tutorial_paloaltonetwork_auth.png)
	
4. On the **Authentication** page perform the following steps:
	
	![The authentication tab](./media/paloaltonetworks-aperture-tutorial/tutorial_paloaltonetwork_singlesignon.png)

	a. Check the **Enable Single Sign-On(Supported SSP Providers are Okta, One login)** from **Single Sign-On** field.

	b. In the **Identity Provider ID** textbox, paste the value of **Azure AD Identifier**, which you have copied from Azure portal.

	c. Click **Choose File** to upload the downloaded Certificate from Azure AD in the **Identity Provider Certificate** field.

	d. In the **Identity Provider SSO URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

	e. Review the IdP information from **Aperture Info** section and download the certificate from **Aperture Key** field.

	f. Click **Save**.


### Create Palo Alto Networks - Aperture test user

In this section, you create a user called Britta Simon in Palo Alto Networks - Aperture. Work with [Palo Alto Networks - Aperture Client support team](https://live.paloaltonetworks.com/t5/custom/page/page-id/Support) to add the users in the Palo Alto Networks - Aperture platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Palo Alto Networks - Aperture Sign on URL where you can initiate the login flow.  

* Go to Palo Alto Networks - Aperture Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Palo Alto Networks - Aperture for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Palo Alto Networks - Aperture tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Palo Alto Networks - Aperture for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Palo Alto Networks - Aperture you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).