---
title: 'Tutorial: Azure AD SSO integration with ADP'
description: Learn how to configure single sign-on between Azure Active Directory and ADP.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/03/2022
ms.author: jeedes
---

# Tutorial: Azure AD SSO integration with ADP

In this tutorial, you'll learn how to integrate ADP with Azure Active Directory (Azure AD). When you integrate ADP with Azure AD, you can:

* Control in Azure AD who has access to ADP.
* Enable your users to be automatically signed-in to ADP with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* ADP single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* ADP supports **IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add ADP from the gallery

To configure the integration of ADP into Azure AD, you need to add ADP from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **ADP** in the search box.
1. Select **ADP** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for ADP

Configure and test Azure AD SSO with ADP using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in ADP.

To configure and test Azure AD SSO with ADP, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
2. **[Configure ADP SSO](#configure-adp-sso)** - to configure the single sign-on settings on application side.
    1. **[Create ADP test user](#create-adp-test-user)** - to have a counterpart of B.Simon in ADP that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **ADP** application integration page, click on **Properties tab** and perform the following steps: 

    ![Single sign-on properties](./media/adpfederatedsso-tutorial/properties.png)

    a. Set the **Enabled for users to sign-in** field value to **Yes**.

    b. Copy the **User access URL** and you have to paste it in **Configure Sign-on URL section**, which is explained later in the tutorial.

    c. Set the **User assignment required** field value to **Yes**.

    d. Set the **Visible to users** field value to **No**.

1. In the Azure portal, on the **ADP** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    In the **Identifier (Entity ID)** text box, type the URL:
    `https://fed.adp.com`

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![The Certificate download link](common/metadataxml.png)

1. On the **Set up ADP** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to ADP.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **ADP**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ADP SSO

1. To automate the configuration within ADP, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

1. After adding extension to the browser, click on **Set up ADP** will direct you to the ADP application. From there, provide the admin credentials to sign in to ADP. The browser extension will automatically configure the application for you and automate steps 3-7.

	![Setup configuration](common/setup-sso.png)

1. If you want to set up ADP manually, open a new web browser window and sign in to your ADP company site as an administrator and perform the following steps:

1. Click **Federation Setup** and go to **Identity Provider** then, select the **Microsoft Azure**.

	![Screenshot for identity provider.](./media/adpfederatedsso-tutorial/microsoft-azure.png)

1. In the **Services Selection**, select all applicable service(s) for connection, and then click **Next**.

    ![Screenshot for services selection.](./media/adpfederatedsso-tutorial/services.png)

1. In the **Configure** section, click on the **Next**.

1. In the **Upload Metadata**, click **Browse** to upload the metadata XML file which you have downloaded from the Azure portal and click **UPLOAD**.

    ![Screenshot for uploading metadata.](./media/adpfederatedsso-tutorial/metadata.png)

### Configure your ADP service(s) for federated access

>[!Important]
> Your employees who require federated access to your ADP services must be assigned to the ADP service app and subsequently, users must be reassigned to the specific ADP service.
Upon receipt of confirmation from your ADP representative, configure your ADP service(s) and assign/manage users to control user access to the specific ADP service.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **ADP** in the search box.
1. Select **ADP** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)
1. In the Azure portal, on your **ADP** application integration page, click on **Properties tab** and perform the following steps:  

    ![Single sign-on linked properties tab](./media/adpfederatedsso-tutorial/application.png)

    1. Set the **Enabled for users to sign-in** field value to **Yes**.

    1. Set the **User assignment required** field value to **Yes**.

    1. Set the **Visible to users** field value to **Yes**.

1. In the Azure portal, on the **ADP** application integration page, find the **Manage** section and select **Single sign-on**.

1. On the **Select a Single sign-on method** dialog, select **Mode** as **Linked**. to link your application to **ADP**.

    ![Single sign-on linked](./media/adpfederatedsso-tutorial/linked.png)

1. Navigate to the **Configure Sign-on URL** section, perform the following steps:

    ![Configure Single sign-on](./media/adpfederatedsso-tutorial/users.png)

    1. Paste the **User access URL**, which you have copied from above **properties tab** (from the main ADP app).

    1. Following are the 5 apps that support different **Relay State URLs**. You have to append the appropriate **Relay State URL** value for particular application manually to the **User access URL**.

        * **ADP Workforce Now**

            `<User access URL>&relaystate=https://fed.adp.com/saml/fedlanding.html?WFN`

        * **ADP Workforce Now Enhanced Time**

            `<User access URL>&relaystate=https://fed.adp.com/saml/fedlanding.html?EETDC2`

        * **ADP Vantage HCM**

            `<User access URL>&relaystate=https://fed.adp.com/saml/fedlanding.html?ADPVANTAGE`

        * **ADP Enterprise HR**

            `<User access URL>&relaystate=https://fed.adp.com/saml/fedlanding.html?PORTAL`

        * **MyADP**

            `<User access URL>&relaystate=https://fed.adp.com/saml/fedlanding.html?REDBOX`

1. **Save** your changes.

1. Upon receipt of confirmation from your ADP representative, begin test with one or two users.

    1. Assign few users to the ADP service App to test federated access.

    1. Test is successful when users access the ADP service app on the gallery and can access their ADP service.

1. On confirmation of a successful test, assign the federated ADP service to individual users or user groups, which is explained later in the tutorial and roll it out to your employees.

### Create ADP test user

The objective of this section is to create a user called B.Simon in ADP. Work with [ADP support team](https://www.adp.com/contact-us/overview.aspx) to add the users in the ADP account. 

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the ADP for which you set up the SSO.

* You can use Microsoft My Apps. When you click the ADP tile in the My Apps, you should be automatically signed in to the ADP for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure ADP you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
