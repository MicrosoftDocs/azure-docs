---
title: 'Tutorial: Azure AD SSO integration with Hiretual-SSO'
description: Learn how to configure single sign-on between Azure Active Directory and Hiretual-SSO.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/29/2021
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with Hiretual-SSO

In this tutorial, you'll learn how to integrate Hiretual-SSO with Azure Active Directory (Azure AD). When you integrate Hiretual-SSO with Azure AD, you can:

* Control in Azure AD who has access to Hiretual-SSO.
* Enable your users to be automatically signed-in to Hiretual-SSO with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Hiretual-SSO single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Hiretual-SSO supports **SP and IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Hiretual-SSO from the gallery

To configure the integration of Hiretual-SSO into Azure AD, you need to add Hiretual-SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Hiretual-SSO** in the search box.
1. Select **Hiretual-SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Hiretual-SSO

Configure and test Azure AD SSO with Hiretual-SSO using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Hiretual-SSO.

To configure and test Azure AD SSO with Hiretual-SSO, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Hiretual-SSO](#configure-hiretual-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Hiretual-SSO test user](#create-hiretual-sso-test-user)** - to have a counterpart of B.Simon in Hiretual-SSO that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Hiretual-SSO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following step:

    a. In the **Reply URL** text box, type a URL using the following pattern:
    `https://api.hiretual.com/v1/users/saml/login/<teamId>`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://app.hiretual.com/`

	> [!NOTE]
	> This value is not real. Update this value with the actual Reply URL. Contact [Hiretual-SSO Client support team](mailto:support@hiretual.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Hiretual-SSO application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Hiretual-SSO application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name | Source Attribute |
	| ---------- | --------- |
	| firstName | user.givenname |
    | title | user.jobtitle |
    | lastName | user.surname |

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Hiretual-SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Hiretual-SSO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Hiretual-SSO

1. Log in to your Hiretual-SSO company site as an administrator.

1. Go to **Security & Compliance** > **Single Sign-On**.

1. In the **SAML2.0 Authentication** page, perform the following steps:

    ![Screenshot shows the SSO Configuration.](./media/hiretual-tutorial/configuration.png " SSO Configuration")

    1. In the **SAML2.O SSO URL** textbox, paste the **User access URL** which you have copied from the Azure portal.

    1. Copy **Entity ID** value from the metadata file and paste in the **Identity Provider Issuer** textbox.

    1. Copy **X509 Certificate** from the metadata file and paste the content in the **Certificate** textbox.

    1. Fill the required attributes manually according to your requirement and click **Save**.

    1. Enable **Single Sign-On Connection Status** button.

    1. Test your Single Sign-On integration first and then enable **Admin SP-Initiated Single Sign-On** button. 

    > [!NOTE]
    > If your Single Sign-On configuration has any errors or you have trouble to login to Hiretual-SSO Web App/Extension after you connected Admin SP-Initiated Single Sign-On, please contact [Hiretual-SSO support team](mailto:support@hiretual.com).
    
### Create Hiretual-SSO test user

In this section, you create a user called Britta Simon in Hiretual-SSO. Work with [Hiretual-SSO support team](mailto:support@hiretual.com) to add the users in the Hiretual-SSO platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Hiretual-SSO Sign on URL where you can initiate the login flow.  

* Go to Hiretual-SSO Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Hiretual-SSO for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Hiretual-SSO tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Hiretual-SSO for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Hiretual-SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
