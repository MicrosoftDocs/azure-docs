---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Teamgo | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Teamgo.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/20/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Teamgo

In this tutorial, you'll learn how to integrate Teamgo with Azure Active Directory (Azure AD). When you integrate Teamgo with Azure AD, you can:

* Control in Azure AD who has access to Teamgo.
* Enable your users to be automatically signed-in to Teamgo with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Teamgo single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Teamgo supports **SP and IDP** initiated SSO.
* Teamgo supports **Just In Time** user provisioning.

## Adding Teamgo from the gallery

To configure the integration of Teamgo into Azure AD, you need to add Teamgo from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Teamgo** in the search box.
1. Select **Teamgo** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Teamgo

Configure and test Azure AD SSO with Teamgo using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Teamgo.

To configure and test Azure AD SSO with Teamgo, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Teamgo SSO](#configure-teamgo-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Teamgo test user](#create-teamgo-test-user)** - to have a counterpart of B.Simon in Teamgo that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Teamgo** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type one of the following URLs:

    | Identifier |
    |-----------|
    | `https://my.teamgo.co` |
    | `https://my.teamgo.co/integration/saml/serviceProviderEntityId` |
    |

    b. In the **Reply URL** text box, type a URL using one of the following patterns:

    | Reply URL |
    |-----------|
    | `https://my.teamgo.co` |
    | `https://my.teamgo.co/integration/saml?acs&domain=<DOMAIN NAME>` |
    |

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://my.teamgo.co/integration/saml `

	> [!NOTE]
	> The value is not real. Update the value with the actual Reply URL. Contact [Teamgo Client support team](mailto:support@teamgo.co) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Teamgo application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Teamgo application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name |  Source Attribute|
	| --------------- | --------- |
	| displayname | user.displayname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Teamgo** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Teamgo.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Teamgo**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Teamgo SSO

1. Log in to your Teamgo website as an administrator.

1. Click  **Kiosks** button and go to the **Settings** -> **Integrations** in the left navigation.

1. In the **Integrations**, go to the **Single sign-on** tab and click **Configure**.

    ![Teamgo Integrations](./media/teamgo-tutorial/integrations.png)

1. Perform the following steps in the below **SAML** page. 

    ![Teamgo configuration](./media/teamgo-tutorial/configuration.png)

    a. In the **SSO Domain** textbox, give the domain value.

    b. In the **Issuer URL** textbox, paste the **Identifier** value which you have copied from the Azure portal.

    c. In the **SAML 2.0 Endpoint URL (HTTP)** textbox, paste the **Login URL** value which you have copied from the Azure portal.

    d. Open the downloaded **Certificate (Base64)** from the Azure portal into Notepad and paste the content into the **Public Certificate/Fingerprint** textbox.

    e. Click **Save**.

### Create Teamgo test user

In this section, a user called B.Simon is created in Teamgo. Teamgo supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Teamgo, a new one is created when you attempt to access Teamgo.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Teamgo Sign on URL where you can initiate the login flow.  

* Go to Teamgo Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Teamgo for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Teamgo tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Teamgo for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Teamgo you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).


