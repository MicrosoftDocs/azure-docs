---
title: 'Tutorial: Azure AD SSO integration with Adra by Trintech'
description: Learn how to configure single sign-on between Azure Active Directory and Adra by Trintech.
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

# Tutorial: Azure AD SSO integration with Adra by Trintech

In this tutorial, you'll learn how to integrate Adra by Trintech with Azure Active Directory (Azure AD). When you integrate Adra by Trintech with Azure AD, you can:

* Control in Azure AD who has access to Adra by Trintech.
* Enable your users to be automatically signed-in to Adra by Trintech with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Adra by Trintech single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Adra by Trintech supports **SP** and **IDP** initiated SSO.

## Add Adra by Trintech from the gallery

To configure the integration of Adra by Trintech into Azure AD, you need to add Adra by Trintech from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Adra by Trintech** in the search box.
1. Select **Adra by Trintech** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Adra by Trintech

Configure and test Azure AD SSO with Adra by Trintech using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Adra by Trintech.

To configure and test Azure AD SSO with Adra by Trintech, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
   1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
   1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Adra by Trintech SSO](#configure-adra-by-trintech-sso)** - to configure the single sign-on settings on application side.
   1. **[Create Adra by Trintech test user](#create-adra-by-trintech-test-user)** - to have a counterpart of B.Simon in Adra by Trintech that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Adra by Trintech** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file** and wish to configure in **IDP** initiated mode, perform the following steps:

	a. Click **Upload metadata file**.

   ![Screenshot shows to upload metadata file.](common/upload-metadata.png "File")

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![Screenshot shows to choose metadata file.](common/browse-upload-metadata.png "Folder")

	c. After the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in **Basic SAML Configuration** section.

   d. In the **Sign-on URL** text box, type the URL:
      `https://login.adra.com`

   e. In the **Relay state** text box, type the URL:
      `https://setup.adra.com` 

   f. In the **Logout URL** text box, type the URL:
      `https://login.adra.com/Saml/SLOServiceSP`

   > [!Note]
	> You will get the **Service Provider metadata file** from the **Configure Adra by Trintech SSO** section, which is explained later in the tutorial. If the **Identifier** and **Reply URL** values do not get auto populated, then fill in the values manually according to your requirement.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Adra by Trintech.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Adra by Trintech**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Adra by Trintech SSO

1. Log in to your Adra by Trintech company site as an administrator.

1. Go to **Engagement** > **Security** Tab > **Security Policy** > select **Use a federated identity provider** button.

1. Download the **Service Provider metadata file** by clicking **here** in the Adra page and upload this metadata file in the Azure portal.

   [ ![Screenshot that shows the Configuration Settings.](./media/adra-by-trintech-tutorial/settings.png "Configuration") ](./media/adra-by-trintech-tutorial/settings.png#lightbox)

1. Click on the **Add a new federated identity provider** button and perform the following steps:

   [ ![Screenshot that shows the Organization Algorithm.](./media/adra-by-trintech-tutorial/certificate.png "Organization") ](./media/adra-by-trintech-tutorial/certificate.png#lightbox)

   a. Enter a valid **Name** and **Description** values in the textbox.

   b. In the **Metadata URL** textbox, paste the **App Federation Metadata Url** which you've copied from the Azure portal and click on the **Test URL** button.

   c. Click **Save** to save the SAML configuration..

### Create Adra by Trintech test user

In this section, you create a user called Britta Simon at Adra by Trintech. Work with [Adra by Trintech support team](mailto:support@adra.com) to add the users in the Adra by Trintech platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Adra by Trintech Sign-on URL where you can initiate the login flow.  

* Go to Adra by Trintech Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Adra by Trintech for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Adra by Trintech tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Adra by Trintech for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Adra by Trintech you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).