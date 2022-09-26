---
title: 'Tutorial: Azure AD SSO integration with Air'
description: Learn how to configure single sign-on between Azure Active Directory and Air.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/14/2022
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with Air

In this tutorial, you'll learn how to integrate Air with Azure Active Directory (Azure AD). When you integrate Air with Azure AD, you can:

* Control in Azure AD who has access to Air.
* Enable your users to be automatically signed-in to Air with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Air single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Air supports **SP and IDP** initiated SSO.

## Adding Air from the gallery

To configure the integration of Air into Azure AD, you need to add Air from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Air** in the search box.
1. Select **Air** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


## Configure and test Azure AD SSO for Air

Configure and test Azure AD SSO with Air using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Air.

To configure and test Azure AD SSO with Air, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Air SSO](#configure-air-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Air test user](#create-air-test-user)** - to have a counterpart of B.Simon in Air that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Air** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type the value:
    `urn:amazon:cognito:sp:us-east-1_hFBg5izBk`

    b. In the **Reply URL** text box, type the URL:
    `https://auth.air.inc/saml2/idpresponse`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://api.air.inc/integrations/saml/login/<CustomerID>`

	> [!NOTE]
	> The value is not real. Update the value with the actual Sign-on URL. Contact [Air Client support team](mailto:dev@air.inc) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Air.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Air**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Air SSO

1. Log in to the Air website as an administrator.

1. Click on the **Workspace** at the top left corner.

1. Go to the **Settings** -> **SECURITY &IDENTITY** tab and perform the perform the following steps:

    ![Screenshot for Air configiration](./media/air-tutorial/integration.png)

    a. In the **Manage approved email domains** text box, add your organizations email domains to the approved domains list to allow users with these domains to authenticate using SAML SSO. 
    
    b. Copy **Single sign-on URL** value, paste this value into the **Sign on URL** text box in the **Basic SAML Configuration** section in the Azure portal.

    c. In the SAML metadata URL text box, paste the **App Federation Metadata Url** value which you have copied in the Azure portal.

    d. Click **Enable SAML SSO**.

### Create Air test user

Log in to the Air website as an administrator.

1. Click on the **Workspace** at the top left corner.

1. Go to the **Settings** -> **MEMBERS** tab and click **Add members**.

1. Give the Email address and click **Invite**.

    ![Screenshot for User creation](./media/air-tutorial/user-new.png)


## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

#### SP initiated:

* Click on Test this application in Azure portal. This will redirect to Air Sign on URL where you can initiate the login flow.

* Go to Air Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on Test this application in Azure portal and you should be automatically signed in to the Air for which you set up the SSO

You can also use Microsoft My Apps to test the application in any mode. When you click the Air tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Air for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Air you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).


