---
title: 'Tutorial: Azure Active Directory integration with Overdrive | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Overdrive.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/06/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Overdrive

In this tutorial, you'll learn how to integrate Overdrive with Azure Active Directory (Azure AD). When you integrate Overdrive with Azure AD, you can:

* Control in Azure AD who has access to Overdrive.
* Enable your users to be automatically signed-in to Overdrive with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:
 
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An Overdrive single sign-on (SSO)-enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Overdrive supports **SP** initiated SSO.

* Overdrive supports **Just In Time** user provisioning.

## Add Overdrive from the gallery

To configure the integration of Overdrive into Azure AD, add Overdrive from the gallery to your list of managed SaaS apps by doing the following:
 
1. Sign in to the Azure portal with either a work or school account, or a personal Microsoft account.
1. In the left pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **Overdrive** in the search box.
1. In the results pane, select **Overdrive**, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Overdrive

Configure and test Azure AD SSO with Overdrive using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Overdrive.

To configure and test Azure AD SSO with Overdrive, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Overdrive SSO](#configure-overdrive-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Overdrive test user](#create-overdrive-test-user)** - to have a counterpart of B.Simon in Overdrive that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Overdrive** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `http://<subdomain>.libraryreserve.com`

	> [!NOTE]
	> The value is not real. Update the value with the actual Sign-On URL. Contact [Overdrive Client support team](https://help.overdrive.com/) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **App Federation Metadata URL** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

6. On the **Set up Overdrive** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Overdrive.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Overdrive**.

2. In the applications list, select **Overdrive**.

3. In the menu on the left, select **Users and groups**.

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

## Configure Overdrive SSO

To configure single sign-on on **Overdrive** side,  you need to send the **App Federation Metadata URL** to [Overdrive support team](https://help.overdrive.com/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Overdrive test user

In this section, a user called Britta Simon is created in Overdrive. Overdrive supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Overdrive, a new one is created after authentication.

>[!NOTE]
>You can use any other OverDrive user account creation tools or APIs provided by OverDrive to provision Azure AD user accounts.
>

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Overdrive Sign-on URL where you can initiate the login flow. 

* Go to Overdrive Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Overdrive tile in the My Apps, this will redirect to Overdrive Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Overdrive you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
