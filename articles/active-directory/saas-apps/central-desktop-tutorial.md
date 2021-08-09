---
title: 'Tutorial: Azure Active Directory integration with Central Desktop | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Central Desktop.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/04/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Central Desktop

In this tutorial, you'll learn how to integrate Central Desktop with Azure Active Directory (Azure AD). When you integrate Central Desktop with Azure AD, you can:

* Control in Azure AD who has access to Central Desktop.
* Enable your users to be automatically signed-in to Central Desktop with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Central Desktop single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Central Desktop supports **SP** initiated SSO.

## Add Central Desktop from the gallery

To configure the integration of Central Desktop into Azure AD, you need to add Central Desktop from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Central Desktop** in the search box.
1. Select **Central Desktop** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Central Desktop

Configure and test Azure AD SSO with Central Desktop using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Central Desktop.

To configure and test Azure AD SSO with Central Desktop, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Central Desktop SSO](#configure-central-desktop-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Central Desktop test user](#create-central-desktop-test-user)** - to have a counterpart of B.Simon in Central Desktop that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Central Desktop** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** box, type a URL using one of the following patterns:

    | **Identifier** |
    |-------|
    | `https://<companyname>.centraldesktop.com/saml2-metadata.php` |
    | `https://<companyname>.imeetcentral.com/saml2-metadata.php` |

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<companyname>.centraldesktop.com/saml2-assertion.php`

    c. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<companyname>.centraldesktop.com`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier,Reply URL and Sign on URL. Contact [Central Desktop Client support team](https://imeetcentral.com/contact-us) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Raw)** from the given options as per your requirement and save it on your computer.

    ![The Certificate download link](common/certificateraw.png)

6. On the **Set up Central Desktop** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Central Desktop.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Central Desktop**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Central Desktop SSO

1. Sign in to your **Central Desktop** tenant.

2. Go to **Settings**. Select **Advanced**, and then select **Single Sign On**.

    ![Setup - Advanced.](./media/central-desktop-tutorial/settings.png "Setup - Advanced")

3. On the **Single Sign On Settings** page, perform the following steps:

    ![Single sign-on settings.](./media/central-desktop-tutorial/configuration.png "Single Sign On Settings")

    a. Select **Enable SAML v2 Single Sign On**.

    b. In the **SSO URL** box, paste the **Azure Ad Identifier** value that you copied from the Azure portal.

    c. In the **SSO Login URL** box, paste the **Login URL** value that you copied from the Azure portal.

    d. In the **SSO Logout URL** box, paste the **Logout URL** value that you copied from the Azure portal.

4. In the **Message Signature Verification Method** section, perform the following steps:

    ![Message signature verification method](./media/central-desktop-tutorial/certificate.png "Message Signature Verification Method")

    a. Select **Certificate**.

    b. In the **SSO Certificate** list, select **RSH SHA256**.

    c. Open your downloaded certificate in Notepad. Then copy the content of certificate and paste it into the **SSO Certificate** field.

    d. Select **Display a link to your SAMLv2 login page**.

    e. Select **Update**.

### Create Central Desktop test user

For Azure AD users to be able to sign in, they must be provisioned in the Central Desktop application. This section describes how to create Azure AD user accounts in Central Desktop.

> [!NOTE]
> To provision Azure AD user accounts, you can use any other Central Desktop user account creation tools or APIs that are provided by Central Desktop.

**To provision user accounts to Central Desktop:**

1. Sign in to your Central Desktop tenant.

2. Select **People** and then select **Add Internal Members**.

    ![People.](./media/central-desktop-tutorial/members.png "People")

3. In the **Email Address of New Members** box, type an Azure AD account that you want to provision, and then select **Next**.

    ![Email addresses of new members.](./media/central-desktop-tutorial/add-members.png "Email addresses of new members")

4. Select **Add Internal member(s)**.

    ![Add internal member.](./media/central-desktop-tutorial/account.png "Add internal member")

   > [!NOTE]
   > The users that you add receive an email that includes a confirmation link for activating their accounts.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Central Desktop Sign-on URL where you can initiate the login flow. 

* Go to Central Desktop Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Central Desktop tile in the My Apps, this will redirect to Central Desktop Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Central Desktop you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).