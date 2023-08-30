---
title: 'Tutorial: Azure Active Directory integration with Menlo Security'
description: Learn how to configure single sign-on between Azure Active Directory and Menlo Security.
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
# Tutorial: Azure Active Directory integration with Menlo Security

In this tutorial, you'll learn how to integrate Menlo Security with Azure Active Directory (Azure AD). When you integrate Menlo Security with Azure AD, you can:

* Control in Azure AD who has access to Menlo Security.
* Enable your users to be automatically signed-in to Menlo Security with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Menlo Security single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Menlo Security supports **SP** initiated SSO.

## Add Menlo Security from the gallery

To configure the integration of Menlo Security into Azure AD, you need to add Menlo Security from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Menlo Security** in the search box.
1. Select **Menlo Security** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Menlo Security

Configure and test Azure AD SSO with Menlo Security using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Menlo Security.

To configure and test Azure AD SSO with Menlo Security, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Menlo Security SSO](#configure-menlo-security-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Menlo Security test user](#create-menlo-security-test-user)** - to have a counterpart of B.Simon in Menlo Security that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Menlo Security** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    1. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.menlosecurity.com/account/login`

    1. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.menlosecurity.com/safeview-auth-server/saml/metadata`

    > [!NOTE]
    > These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Menlo Security Client support team](https://www.menlosecurity.com/menlo-contact) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

    ![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Menlo Security** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Menlo Security.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Menlo Security**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Menlo Security SSO

1. To configure single sign-on on **Menlo Security** side, login to the **Menlo Security** website as an administrator.

2. Under **Settings** go to **Authentication** and perform following actions:

    ![Configure Single Sign-On](./media/menlosecurity-tutorial/authentication.png)

    1. Tick the checkbox **Enable user authentication using SAML**.

    1. Select **Allow External Access** to **Yes**.

    1. Under **SAML Provider**, select **Azure Active Directory**.

    1. **SAML 2.0 Endpoint** : Paste the **Login URL** which you have copied from Azure portal.

    1. **Service Identifier (Issuer)** : Paste the **Azure AD Identifier** which you have copied from Azure portal.

    1. **X.509 Certificate** : Open the **Certificate (Base64)** downloaded from the Azure portal in notepad and paste it in this box.

    1. Click **Save** to save the settings.

### Create Menlo Security test user

In this section, you create a user called Britta Simon in Menlo Security. Work with [Menlo Security Client support team](https://www.menlosecurity.com/menlo-contact) to add the users in the Menlo Security platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Menlo Security Sign-on URL where you can initiate the login flow. 

* Go to Menlo Security Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Menlo Security tile in the My Apps, this will redirect to Menlo Security Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Menlo Security you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
