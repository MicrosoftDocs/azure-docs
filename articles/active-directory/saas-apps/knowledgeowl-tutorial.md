---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with KnowledgeOwl'
description: Learn how to configure single sign-on between Microsoft Entra ID and KnowledgeOwl.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with KnowledgeOwl

In this tutorial, you'll learn how to integrate KnowledgeOwl with Microsoft Entra ID. When you integrate KnowledgeOwl with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to KnowledgeOwl.
* Enable your users to be automatically signed-in to KnowledgeOwl with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* KnowledgeOwl single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* KnowledgeOwl supports **SP and IDP** initiated SSO.
* KnowledgeOwl supports **Just In Time** user provisioning.

## Add KnowledgeOwl from the gallery

To configure the integration of KnowledgeOwl into Microsoft Entra ID, you need to add KnowledgeOwl from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **KnowledgeOwl** in the search box.
1. Select **KnowledgeOwl** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-knowledgeowl'></a>

## Configure and test Microsoft Entra SSO for KnowledgeOwl

Configure and test Microsoft Entra SSO with KnowledgeOwl using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in KnowledgeOwl.

To configure and test Microsoft Entra SSO with KnowledgeOwl, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure KnowledgeOwl SSO](#configure-knowledgeowl-sso)** - to configure the single sign-on settings on application side.
    1. **[Create KnowledgeOwl test user](#create-knowledgeowl-test-user)** - to have a counterpart of B.Simon in KnowledgeOwl that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **KnowledgeOwl** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type the URL using one of the following patterns:
	
    ```http
    https://app.knowledgeowl.com/sp
    https://app.knowledgeowl.com/sp/id/<unique ID>
    ```

	b. In the **Reply URL** text box, type the URL using one of the following patterns:
	
    ```http
    https://subdomain.knowledgeowl.com/help/saml-login
    https://subdomain.knowledgeowl.com/docs/saml-login
    https://subdomain.knowledgeowl.com/home/saml-login
    https://privatedomain.com/help/saml-login
    https://privatedomain.com/docs/saml-login
    https://privatedomain.com/home/saml-login
    ```

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL using one of the following patterns:
	
    ```http
    https://subdomain.knowledgeowl.com/help/saml-login
    https://subdomain.knowledgeowl.com/docs/saml-login
    https://subdomain.knowledgeowl.com/home/saml-login
    https://privatedomain.com/help/saml-login
    https://privatedomain.com/docs/saml-login
    https://privatedomain.com/home/saml-login
    ```

	> [!NOTE]
	> These values are not real. You'll need to update these value from actual Identifier, Reply URL, and Sign-On URL which is explained later in the tutorial.

1. KnowledgeOwl application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, KnowledgeOwl application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name | Source Attribute | Namespace |
	| ------------ | -------------------- | -----|
	| ssoid | user.mail | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims`|

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Raw)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificateraw.png)

1. On the **Set up KnowledgeOwl** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable B.Simon to use single sign-on by granting access to KnowledgeOwl.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **KnowledgeOwl**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure KnowledgeOwl SSO

1. In a different web browser window, sign in to your KnowledgeOwl company site as an administrator.

1. Click on **Settings** and then select **SSO**.

	![Screenshot shows SSO selected from the Settings menu.](./media/knowledgeowl-tutorial/settings-sso-dropdown.png)

1. In the Scroll to **SAML Settings** tab, perform the following steps:

	![Screenshot shows SAML S S O Integration where you can make the changes described here.](./media/knowledgeowl-tutorial/sso-settings-required-fields.png)

	a. Select **Enable SAML SSO**.

	b. Copy the **SP Entity ID** value and paste it into the **Identifier (Entity ID)** in the **Basic SAML Configuration** section on the Azure portal.

	c. Copy the **SP Login URL** value and paste it into the **Sign-on URL and Reply URL** textboxes in the **Basic SAML Configuration** section on the Azure portal.

	d. In the **IdP entityID** textbox, paste the **Microsoft Entra Identifier** value, which you copied previously.

	e. In the **IdP Login URL** textbox, paste the **Login URL** value, which you copied previously.

	f. In the **IdP Logout URL** textbox, paste the **Logout URL** value, which you copied previously.

	g. Upload the downloaded certificate form the Azure portal by clicking the **Upload** link beneath **IdP Certificate**.

	h. Click **Save** at the bottom of the page.

	![Screenshot shows the Save button.](./media/knowledgeowl-tutorial/sso-settings-saml-save.png)

	i. Open the **SAML Attribute Map** tab to map attributes and perform the following steps:

	![Screenshot shows Map SAML Attributes where you can make the changes described here.](./media/knowledgeowl-tutorial/sso-settings-direct-attribute-fields.png)

	* Enter `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/ssoid` into the **SSO ID** textbox.
	* Enter `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` into the **Username/Email** textbox.
	* Enter `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname` into the **First Name** textbox.
	* Enter `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname` into the **Last Name** textbox.

	j. Click **Save** at the bottom of the page.

	![Screenshot shows the Save button1.](./media/knowledgeowl-tutorial/sso-settings-direct-attribute-save.png)

### Create KnowledgeOwl test user

In this section, a user called B.Simon is created in KnowledgeOwl. KnowledgeOwl supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in KnowledgeOwl, a new one is created after authentication.

> [!Note]
> If you need to create a user manually, contact [KnowledgeOwl support team](mailto:support@knowledgeowl.com).

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated

* Click on **Test this application**, this will redirect to KnowledgeOwl Sign on URL where you can initiate the login flow.  

* Go to the KnowledgeOwl sign-on URL directly and initiate the login flow from there.

#### IDP initiated

* Click on **Test this application**, in the Azure portal and you should be automatically signed in to the KnowledgeOwl application for which you set up the SSO. 

You can also use the Microsoft My Apps portal to test the application in any mode. When you click the KnowledgeOwl tile in the My Apps portal, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the KnowledgeOwl application for which you set up the SSO. For more information about the My Apps portal, see [Introduction to My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure KnowledgeOwl, you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
