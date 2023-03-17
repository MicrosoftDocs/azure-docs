---
title: 'Tutorial: Azure Active Directory integration with Soloinsight-CloudGate SSO'
description: Learn how to configure single sign-on between Azure Active Directory and Soloinsight-CloudGate SSO.
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

# Tutorial: Integrate Soloinsight-CloudGate SSO with Azure Active Directory

In this tutorial, you'll learn how to integrate Soloinsight-CloudGate SSO with Azure Active Directory (Azure AD). When you integrate Soloinsight-CloudGate SSO with Azure AD, you can:

* Control in Azure AD who has access to Soloinsight-CloudGate SSO.
* Enable your users to be automatically signed-in to Soloinsight-CloudGate SSO with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Soloinsight-CloudGate SSO single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Soloinsight-CloudGate SSO supports **SP** initiated SSO.
* Soloinsight-CloudGate SSO supports [Automated user provisioning](soloinsight-cloudgate-sso-provisioning-tutorial.md).

## Add Soloinsight-CloudGate SSO from the gallery

To configure the integration of Soloinsight-CloudGate SSO into Azure AD, you need to add Soloinsight-CloudGate SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Soloinsight-CloudGate SSO** in the search box.
1. Select **Soloinsight-CloudGate SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Soloinsight-CloudGate SSO

Configure and test Azure AD SSO with Soloinsight-CloudGate SSO using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Soloinsight-CloudGate SSO.

To configure and test Azure AD SSO with Soloinsight-CloudGate SSO, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Soloinsight-CloudGate SSO](#configure-soloinsight-cloudgate-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Soloinsight-CloudGate SSO test user](#create-soloinsight-cloudgate-sso-test-user)** - to have a counterpart of B.Simon in Soloinsight-CloudGate SSO that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Soloinsight-CloudGate SSO** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** page, perform the following steps:

    1. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.sigateway.com/login`

    1. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.sigateway.com/process/sso`

   > [!NOTE]
   > These values are not real. Update these values with the actual Sign on URL and Identifier which is explained later in the **Configure Soloinsight-CloudGate SSO Single Sign-On** section of the tutorial.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Soloinsight-CloudGate SSO** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Soloinsight-CloudGate SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Soloinsight-CloudGate SSO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Soloinsight-CloudGate SSO

1. To automate the configuration within Soloinsight-CloudGate SSO, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Setup Soloinsight-CloudGate SSO** will direct you to the Soloinsight-CloudGate SSO application. From there, provide the admin credentials to sign into Soloinsight-CloudGate SSO. The browser extension will automatically configure the application for you and automate steps 3-8.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup Soloinsight-CloudGate SSO manually, open a new web browser window and sign into your Soloinsight-CloudGate SSO company site as an administrator and perform the following steps:

4. To get the values that are to be pasted in the Azure portal while configuring Basic SAML, sign in to the CloudGate Web Portal using your credentials then access the SSO settings, which can be found on the following path **Home>Administration>System settings>General**.

	![CloudGate SSO Settings](./media/soloinsight-cloudgate-sso-tutorial/main-settings.png)

5. **SAML Consumer URL**

	* Copy the links available against the **Saml Consumer URL** and the **Redirect URL** fields and paste them in the Azure portal **Basic SAML Configuration** section for **Identifier (Entity ID)** and **Reply URL** fields respectively.

		![SAMLIdentifier](./media/soloinsight-cloudgate-sso-tutorial/identifier.png)

6. **SAML Signing Certificate**

	* Go to the source of the Certificate (Base64) file that was downloaded from Azure portal SAML Signing Certificate lists and right-click on it. Choose **Edit with Notepad++** option from the list. 

		![SAMLcertificate](./media/soloinsight-cloudgate-sso-tutorial/certificate-file.png)

	* Copy the content in the Certificate (Base64) Notepad++ file.

		![Certificate copy](./media/soloinsight-cloudgate-sso-tutorial/certificate-copy.png)

	* Paste the content in the CloudGate Web Portal SSO settings **Certificate** field and click on Save button.

		![Certificate portal](./media/soloinsight-cloudgate-sso-tutorial/certificate-portal.png)

7. **Default Group**

	* Select **Business Admin** from the drop-down list of the **Default Group** option in the CloudGate Web Portal

		![Default group](./media/soloinsight-cloudgate-sso-tutorial/default-group.png)

8. **AD Identifier and Login URL**

	* The copied **Login URL** from the Azure portal **Set up Soloinsight-CloudGate SSO** configurations are to be entered in the CloudGate Web Portal SSO settings section.

	* Paste the **Login URL** link from Azure portal in the CloudGate Web Portal **AD Login URL** field.

	* Paste the **Azure AD Identifier** link from Azure portal in the CloudGate Web Portal **AD Identifier** field

		![Ad login](./media/soloinsight-cloudgate-sso-tutorial/ad-login.png)

### Create Soloinsight-CloudGate SSO test user

To Create a test user, Select **Employees** from the main menu of your CloudGate Web Portal and fill out the Add New employee form. The Authority Level that is to be assigned to the test user is **Business Admin** Click on **Create** once all the required fields are filled.

![Employee test](./media/soloinsight-cloudgate-sso-tutorial/employee-test.png)

> [!NOTE]
> Soloinsight-CloudGate SSO also supports automatic user provisioning, you can find more details [here](./soloinsight-cloudgate-sso-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Soloinsight-CloudGate SSO Sign-on URL where you can initiate the login flow. 

* Go to Soloinsight-CloudGate SSO Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Soloinsight-CloudGate SSO tile in the My Apps, this will redirect to Soloinsight-CloudGate SSO Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Soloinsight-CloudGate SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
