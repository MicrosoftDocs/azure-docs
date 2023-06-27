---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with SoSafe'
description: Learn how to configure single sign-on between Azure Active Directory and SoSafe.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with SoSafe

In this tutorial, you'll learn how to integrate SoSafe with Azure Active Directory (Azure AD). When you integrate SoSafe with Azure AD, you can:

* Control in Azure AD who has access to SoSafe.
* Enable your users to be automatically signed-in to SoSafe with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SoSafe single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* SoSafe supports **SP and IDP** initiated SSO.
* SoSafe supports **Just In Time** user provisioning.
* SoSafe supports [Automated user provisioning](sosafe-provisioning-tutorial.md).

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding SoSafe from the gallery

To configure the integration of SoSafe into Azure AD, you need to add SoSafe from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type SoSafe in the search box.
1. Select SoSafe from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for SoSafe

Configure and test Azure AD SSO with SoSafe using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in SoSafe.

To configure and test Azure AD SSO with SoSafe, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure SoSafe SSO](#configure-sosafe-sso)** - to configure the single sign-on settings on application side.
    1. **[Create SoSafe test user](#create-sosafe-test-user)** - to have a counterpart of B.Simon in SoSafe that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the SoSafe application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://api.sosafe.de/v1/auth/saml/login/<TENANT_ID>`

	> [!NOTE]
	> The Sign-on URL value is not real. Update the value with actual Sign-on URL. Contact [SoSafe Client support team](mailto:support@sosafe.de) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the Set up SoSafe section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to SoSafe.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select SoSafe.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SoSafe SSO

1. In a different web browser window, sign into SoSafe website as an administrator.

1. Click on **Extended Data** and perform the following steps in the following page.

    ![Extended data saml page](./media/servicessosafe-tutorial/saml-settings.png)

    a. Paste the value of Tenant ID value in **Azure Tenant ID** textbox from Azure portal.

    b. Open the downloaded **Certificate(Base64)** from the Azure portal into Notepad and paste the content into the **Certificate** textbox.

    c. In the **Login URL** box, paste the **Login URL** value that you copied from the Azure portal.

    d. In the **Azure AD Identifier** box, paste the **Entity ID** value that you copied from the Azure portal.

    e. In the **Logout URL** box, paste the **Logout URL** value that you copied from the Azure portal.

    f. Click on **SAVE**

### Create SoSafe test user

In this section, a user called Britta Simon is created in SoSafe. SoSafe supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in SoSafe, a new one is created after authentication.

SoSafe also supports automatic user provisioning, you can find more details [here](./sosafe-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to SoSafe Sign on URL where you can initiate the login flow.  

* Go to SoSafe Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the SoSafe for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the SoSafe tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the SoSafe for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure SoSafe you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
