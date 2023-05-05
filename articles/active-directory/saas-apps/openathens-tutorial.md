---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with OpenAthens'
description: Learn how to configure single sign-on between Azure Active Directory and OpenAthens.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with OpenAthens

In this tutorial, you'll learn how to integrate OpenAthens with Azure Active Directory (Azure AD). When you integrate OpenAthens with Azure AD, you can:

* Control in Azure AD who has access to OpenAthens.
* Enable your users to be automatically signed-in to OpenAthens with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* OpenAthens single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* OpenAthens supports **IDP** initiated SSO
* OpenAthens supports **Just In Time** user provisioning

## Add OpenAthens from the gallery

To configure the integration of OpenAthens into Azure AD, you need to add OpenAthens from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **OpenAthens** in the search box.
1. Select **OpenAthens** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for OpenAthens

Configure and test Azure AD SSO with OpenAthens using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in OpenAthens.

To configure and test Azure AD SSO with OpenAthens, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure OpenAthens SSO](#configure-openathens-sso)** - to configure the single sign-on settings on application side.
    * **[Create OpenAthens test user](#create-openathens-test-user)** - to have a counterpart of B.Simon in OpenAthens that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **OpenAthens** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, upload the **Service Provider metadata file**, the steps for which are mentioned later in this tutorial.

	a. Click **Upload metadata file**.

    ![openathens upload metadata](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![Openathens browse upload metadata](common/browse-upload-metadata.png)

	c. Once the metadata file is successfully uploaded, the **Identifier** value get auto populated in **Basic SAML Configuration** section textbox:

    ![OpenAthens Domain and URLs single sign-on information](common/idp-identifier.png)

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up OpenAthens** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to OpenAthens.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **OpenAthens**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure OpenAthens SSO

1. In a different web browser window, sign in to your OpenAthens company site as an administrator.

1. Select **Connections** from the list under the **Management** tab.

	![Screenshot that shows the "OpenAthens" company site page with "Connections" selected from the "Management" tab.](./media/openathens-tutorial/connections.png)

1. Select **SAML 1.1/2.0**, and then select the **Configure** button.

	![Screenshot that shows the "Select local authentication system type." dialog with "S A M L 1.1/2.0" and the "Configure" button selected.](./media/openathens-tutorial/saml.png)

1. To add the configuration, select the **Browse** button to upload the metadata .xml file that you downloaded from the Azure portal, and then select **Add**.

	![Screenshot that shows the "Add S A M L authentication system." dialog with the "Browse" action and "Add button selected.](./media/openathens-tutorial/configure.png)

1. Perform the following steps under the **Details** tab.

	![Configure single sign-on](./media/openathens-tutorial/add.png)

	a. In **Display name mapping**, select **Use attribute**.

	b. In the **Display name attribute** text box, enter the value `http://schemas.microsoft.com/identity/claims/displayname`.

	c. In **Unique user mapping**, select **Use attribute**.

	d. In the **Unique user attribute** text box, enter the value `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`.

	e. In **Status**, select all the three check boxes.

	f. In **Create local accounts**, select **automatically**.

	g. Select **Save changes**.

    h. From the **</> Relying Party** tab, copy the **Metadata URL** and open this in the browser to download the **SP metadata XML** file. Upload this SP metadata file on the **Basic SAML Configuration** section in Azure AD.

    ![Screenshot that shows the "Relying party" tab selected and the "Metadata U R L" highlighted.](./media/openathens-tutorial/metadata.png)

### Create OpenAthens test user

In this section, a user called Britta Simon is created in OpenAthens. OpenAthens supports **just-in-time user provisioning**, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in OpenAthens, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the OpenAthens for which you set up the SSO.

* You can use Microsoft My Apps. When you click the OpenAthens tile in the My Apps, you should be automatically signed in to the OpenAthens for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure OpenAthens you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
