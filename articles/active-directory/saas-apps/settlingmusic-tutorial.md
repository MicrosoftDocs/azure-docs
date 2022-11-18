---
title: 'Tutorial: Azure AD SSO integration with Settling music'
description: Learn how to configure single sign-on between Azure Active Directory and Settling music.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/22/2021
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with Settling music

In this tutorial, you'll learn how to integrate Settling music with Azure Active Directory (Azure AD). When you integrate Settling music with Azure AD, you can:

* Control in Azure AD who has access to Settling music.
* Enable your users to be automatically signed-in to Settling music with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Settling music, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* Settling music single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Settling music supports **SP** initiated SSO.

## Add Settling music from the gallery

To configure the integration of Settling music into Azure AD, you need to add Settling music from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Settling music** in the search box.
1. Select **Settling music** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Settling music

Configure and test Azure AD SSO with Settling music using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Settling music.

To configure and test Azure AD SSO with Settling music, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Settling music SSO](#configure-settling-music-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Settling music test user](#create-settling-music-test-user)** - to have a counterpart of B.Simon in Settling music that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Settling music** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.rakurakuseisan.jp/<USERACCOUNT>/`

	b. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.rakurakuseisan.jp/<USERACCOUNT>/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Sign on URL. Contact [Settling music Client support team](https://rakurakuseisan.jp/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Settling music** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](./media/settlingmusic-tutorial/copy-configuration-urls.png)

	> [!NOTE]
	> Please use the below URL for the Logout URL.
	```Logout URL
    https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0
    ```

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Settling music.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Settling music**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Settling music SSO

1. In a different web browser window, sign in to Settling music as a Security Administrator.

1. On top of the page, click **management** tab.

	![Settling music step1](./media/settlingmusic-tutorial/menu.png)

1. Click on  **System setting** tab.

	![Settling music step2](./media/settlingmusic-tutorial/settings.png)

1. Switch to **Security** tab.

	![Settling music step3](./media/settlingmusic-tutorial/security.png)

1. On the **Single sign-on setting** section, perform the following steps:

	![Settling music step5](./media/settlingmusic-tutorial/certificate.png)

	a. Click **To enable**.

	b. In the **Login URL of the ID provider** textbox, paste the value of **Login URL** which you have copied from Azure portal.

	c. In the **ID provider logout URL** textbox, paste the value of **Logout URL** which is explained in [Configure Azure AD SSO](#configure-azure-ad-sso) section.

	d. Click **Choose File** to upload the **Certificate (Base64)** which you have downloaded form Azure portal.

	e. Click the **Save** button.

### Create Settling music test user

In this section, you create a user called Britta Simon in Settling music. Work with [Settling music Client support team](https://rakurakuseisan.jp/) to add the users in the Settling music platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Settling music Sign-on URL where you can initiate the login flow. 

* Go to Settling music Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Settling music tile in the My Apps, this will redirect to Settling music Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Settling music you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).