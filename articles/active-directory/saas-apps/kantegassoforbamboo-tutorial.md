---
title: 'Tutorial: Microsoft Entra SSO integration with Kantega SSO for Bamboo'
description: Learn how to configure single sign-on between Microsoft Entra ID and Kantega SSO for Bamboo.
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
# Tutorial: Microsoft Entra SSO integration with Kantega SSO for Bamboo

In this tutorial, you'll learn how to integrate Kantega SSO for Bamboo with Microsoft Entra ID. When you integrate Kantega SSO for Bamboo with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Kantega SSO for Bamboo.
* Enable your users to be automatically signed-in to Kantega SSO for Bamboo with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To configure Microsoft Entra integration with Kantega SSO for Bamboo, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get a [free account](https://azure.microsoft.com/free/).
* Kantega SSO for Bamboo single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* Kantega SSO for Bamboo supports **SP and IDP** initiated SSO.

## Add Kantega SSO for Bamboo from the gallery

To configure the integration of Kantega SSO for Bamboo into Microsoft Entra ID, you need to add Kantega SSO for Bamboo from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Kantega SSO for Bamboo** in the search box.
1. Select **Kantega SSO for Bamboo** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-kantega-sso-for-bamboo'></a>

## Configure and test Microsoft Entra SSO for Kantega SSO for Bamboo

Configure and test Microsoft Entra SSO with Kantega SSO for Bamboo using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Kantega SSO for Bamboo.

To configure and test Microsoft Entra SSO with Kantega SSO for Bamboo, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Kantega SSO for Bamboo SSO](#configure-kantega-sso-for-bamboo-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Kantega SSO for Bamboo test user](#create-kantega-sso-for-bamboo-test-user)** - to have a counterpart of B.Simon in Kantega SSO for Bamboo that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Kantega SSO for Bamboo** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<uniqueid>/login`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<uniqueid>/login`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<uniqueid>/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-On URL. These values are received during the configuration of Bamboo plugin which is explained later in the tutorial.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up Kantega SSO for Bamboo** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Kantega SSO for Bamboo.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Kantega SSO for Bamboo**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Kantega SSO for Bamboo SSO

1. In a different web browser window, sign in to your Bamboo  on-premises server as an administrator.

1. Hover on cog and click the **Add-ons**.

	![Screenshot shows Add-ons selected from the Settings menu.](./media/kantegassoforbamboo-tutorial/menu.png)

1. Under Add-ons tab section, click **Find new add-ons**. Search **Kantega SSO for Bamboo (SAML & Kerberos)** and click **Install** button to install the new SAML plugin.

	![Screenshot shows Bamboo Administration with Kantega S S O for Bamboo selected.](./media/kantegassoforbamboo-tutorial/profile.png)

1. The plugin installation will start.

	![Screenshot shows Installing progress for Kantega S S O for Bamboo.](./media/kantegassoforbamboo-tutorial/settings.png)

1. Once the installation is complete. Click **Close**.

	![Screenshot shows the Close button.](./media/kantegassoforbamboo-tutorial/installation.png)

1. Click **Manage**.

	![Screenshot shows the Manage button.](./media/kantegassoforbamboo-tutorial/integration.png)

1. Click **Configure** to configure the new plugin.

	![Screenshot shows User-installed add-ons with Configure selected.](./media/kantegassoforbamboo-tutorial/license.png)

1. In the **SAML** section. Select **Microsoft Entra ID** from the **Add identity provider** dropdown.

	![Screenshot shows Kantega Single Sign-On with Microsoft Entra ID selected as the identity provider.](./media/kantegassoforbamboo-tutorial/azure.png)

1. Select subscription level as **Basic**.

	![Screenshot shows Prepare Microsoft Entra ID with Basic selected.](./media/kantegassoforbamboo-tutorial/subscription.png)

1. On the **App properties** section, perform following steps:

	![Screenshot shows the App properties section where you can provide the information in this step.](./media/kantegassoforbamboo-tutorial/properties.png)

	a. Copy the **App ID URI** value and use it as **Identifier, Reply URL, and Sign-On URL** on the **Basic SAML Configuration** section in Azure portal.

	b. Click **Next**.

1. On the **Metadata import** section, perform following steps:

	![Screenshot shows the Metadata import section where you can browse to a metadata file.](./media/kantegassoforbamboo-tutorial/metadata.png)

	a. Select **Metadata file on my computer**, and upload metadata file, which you have downloaded previously.

	b. Click **Next**.

1. On the **Name and SSO location** section, perform following steps:

	![Screenshot shows the Name and S S O location where Microsoft Entra ID is the identity provider name.](./media/kantegassoforbamboo-tutorial/location.png)

	a. Add Name of the Identity Provider in **Identity provider name** textbox (e.g Microsoft Entra ID).

	b. Click **Next**.

1. Verify the Signing certificate and click **Next**.

	![Screenshot shows Signature verification.](./media/kantegassoforbamboo-tutorial/certificate.png)

1. On the **Bamboo user accounts** section, perform following steps:

	![Screenshot shows Bamboo user accounts where you have the option to create users.](./media/kantegassoforbamboo-tutorial/accounts.png)

	a. Select **Create users in Bamboo's internal Directory if needed** and enter the appropriate name of the group for users (can be multiple no. of groups separated by comma).

	b. Click **Next**.

1. Click **Finish**.

	![Screenshot shows the Summary page.](./media/kantegassoforbamboo-tutorial/users.png)

1. On the **Known domains for Microsoft Entra ID** section, perform following steps:

	![Screenshot shows the Known domains for Microsoft Entra ID where you can perform these steps.](./media/kantegassoforbamboo-tutorial/domain.png)

	a. Select **Known domains** from the left panel of the page.

	b. Enter domain name in the **Known domains** textbox.

	c. Click **Save**.

### Create Kantega SSO for Bamboo test user

To enable Microsoft Entra users to sign in to Bamboo, they must be provisioned into Bamboo. In case of Kantega SSO for Bamboo, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your Bamboo on-premises server as an administrator.

1. Hover on cog and click the **User management**.

    ![Screenshot shows User Management selected from the Settings menu.](./media/kantegassoforbamboo-tutorial/user-management.png)

1. Click **Users**. Under the **Add user** section, Perform following steps:

	![Screenshot shows the Add user pane where you can perform these steps.](./media/kantegassoforbamboo-tutorial/add-user.png)

	a. In the **Username** textbox, type the email of user like Brittasimon@contoso.com.

	b. In the **Password** textbox, type the password of user.

	c. In the **Confirm Password** textbox, reenter the password of user.

	d. In the **Full Name** textbox, type full name of the user like Britta Simon.

	e. In the **Email** textbox, type the email address of user like Brittasimon@contoso.com.

	f. Click **Save**.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Kantega SSO for Bamboo Sign on URL where you can initiate the login flow.  

* Go to Kantega SSO for Bamboo Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Kantega SSO for Bamboo for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Kantega SSO for Bamboo tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Kantega SSO for Bamboo for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Kantega SSO for Bamboo you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
