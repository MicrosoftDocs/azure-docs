---
title: 'Tutorial: Azure Active Directory integration with LINE WORKS'
description: Learn how to configure single sign-on between Azure Active Directory and LINE WORKS.
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
# Tutorial: Azure Active Directory integration with LINE WORKS

In this tutorial, you learn how to integrate LINE WORKS with Azure Active Directory (Azure AD).
Integrating LINE WORKS with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to LINE WORKS.
* You can enable your users to be automatically signed-in to LINE WORKS (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with LINE WORKS, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* LINE WORKS single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* LINE WORKS supports **SP** initiated SSO

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding LINE WORKS from the gallery

To configure the integration of LINE WORKS into Azure AD, you need to add LINE WORKS from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **LINE WORKS** in the search box.
1. Select **LINE WORKS** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO

Configure and test Azure AD SSO with LINE WORKS using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in LINE WORKS.

To configure and test Azure AD SSO with LINE WORKS, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure LINE WORKS SSO](#configure-line-works-sso)** - to configure the Single Sign-On settings on application side.
    * **[Create LINE WORKS test user](#create-line-works-test-user)** - to have a counterpart of Britta Simon in LINE WORKS that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **LINE WORKS** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://auth.worksmobile.com/d/login/<domain>/`

    b. In the **Response URL** text box, type a URL using the following pattern:
    `https://auth.worksmobile.com/acs/ <domain>`

    > [!NOTE]
    > These values are not real. Update these values with actual Sign-On URL and Response URL. Contact [LINE WORKS support team](https://line.worksmobile.com/jp/en/contactus/) to get the values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up LINE WORKS** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to LINE WORKS.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **LINE WORKS**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure LINE WORKS SSO

To configure single sign-on on **LINE WORKS** side, please read the [LINE WORKS SSO documents](https://developers.worksmobile.com/jp/document/1001080101) and configure a LINE WORKS setting.

> [!NOTE]
> You need to convert the downloaded Certificate file from .cert to .pem


### Create LINE WORKS test user

In this section, you create a user called Britta Simon in LINE WORKS. Access [LINE WORKS admin page](https://admin.worksmobile.com) and add the users in the LINE WORKS platform.

### Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

1. Click on **Test this application** in Azure portal. This will redirect to LINE WORKS Sign-on URL where you can initiate the login flow. 

2. Go to LINE WORKS Sign-on URL directly and initiate the login flow from there.

3. You can use Microsoft Access Panel. When you click the LINE WORKS tile in the Access Panel, this will redirect to LINE WORKS Sign-on URL. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure LINE WORKS you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
