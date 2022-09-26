---
title: 'Tutorial: Azure AD SSO integration with Kantega SSO for Bitbucket'
description: Learn how to configure single sign-on between Azure Active Directory and Kantega SSO for Bitbucket.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/28/2021
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with Kantega SSO for Bitbucket

In this tutorial, you'll learn how to integrate Kantega SSO for Bitbucket with Azure Active Directory (Azure AD). When you integrate Kantega SSO for Bitbucket with Azure AD, you can:

* Control in Azure AD who has access to Kantega SSO for Bitbucket.
* Enable your users to be automatically signed-in to Kantega SSO for Bitbucket with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Kantega SSO for Bitbucket, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* Kantega SSO for Bitbucket single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Kantega SSO for Bitbucket supports **SP and IDP** initiated SSO.

## Add Kantega SSO for Bitbucket from the gallery

To configure the integration of Kantega SSO for Bitbucket into Azure AD, you need to add Kantega SSO for Bitbucket from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Kantega SSO for Bitbucket** in the search box.
1. Select **Kantega SSO for Bitbucket** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Kantega SSO for Bitbucket

Configure and test Azure AD SSO with Kantega SSO for Bitbucket using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Kantega SSO for Bitbucket.

To configure and test Azure AD SSO with Kantega SSO for Bitbucket, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Kantega SSO for Bitbucket SSO](#configure-kantega-sso-for-bitbucket-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Kantega SSO for Bitbucket test user](#create-kantega-sso-for-bitbucket-test-user)** - to have a counterpart of B.Simon in Kantega SSO for Bitbucket that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Kantega SSO for Bitbucket** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<uniqueid>/login`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<uniqueid>/login`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<uniqueid>/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. These values are received during the configuration of Bitbucket plugin which is explained later in the tutorial.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up Kantega SSO for Bitbucket** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Kantega SSO for Bitbucket.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Kantega SSO for Bitbucket**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Kantega SSO for Bitbucket SSO

1. In a different web browser window, sign in to your Bitbucket admin portal as an administrator.

1. Click cog and click the **Find new add-ons**.

	![Screenshot shows BitBucket Administration with Find new add-ons selected.](./media/kantegassoforbitbucket-tutorial/admin.png)

1. Search **Kantega SSO for Bitbucket SAML & Kerberos** and click **Install** button to install the new SAML plugin.

	![Screenshot shows Kantega SSO for Bitbucket SAML & Kerberos with the option to install.](./media/kantegassoforbitbucket-tutorial/menu.png)

1. The plugin installation starts.

	![Screenshot shows Installing progress.](./media/kantegassoforbitbucket-tutorial/installation.png)

1. Once the installation is complete. Click **Close**.

	![Screenshot shows the Close button.](./media/kantegassoforbitbucket-tutorial/license.png)

1. Click **Manage**.

	![Screenshot shows the Manage button.](./media/kantegassoforbitbucket-tutorial/integration.png)

1. Click **Configure** to configure the new plugin.

	![Screenshot shows User-installed add-ons with Configure selected.](./media/kantegassoforbitbucket-tutorial/profile.png)

1. In the **SAML** section. Select **Azure Active Directory (Azure AD)** from the **Add identity provider** dropdown.

	![Screenshot shows Kantega Single Sign-On with Azure A D selected as the identity provider.](./media/kantegassoforbitbucket-tutorial/azure.png)

1. Select subscription level as **Basic**.

	![Screenshot shows Prepare Azure A D with Basic selected.](./media/kantegassoforbitbucket-tutorial/subscription.png)

1. On the **App properties** section, perform following steps:

	![Screenshot shows the App properties section where you can provide the information in this step.](./media/kantegassoforbitbucket-tutorial/properties.png)

	a. Copy the **App ID URI** value and use it as **Identifier, Reply URL, and Sign-On URL** on the **Basic SAML Configuration** section in Azure portal.

	b. Click **Next**.

1. On the **Metadata import** section, perform following steps:

	![Screenshot shows the Metadata import section where you can browse to a metadata file.](./media/kantegassoforbitbucket-tutorial/metadata.png)

	a. Select **Metadata file on my computer**, and upload metadata file, which you have downloaded from Azure portal.

	b. Click **Next**.

1. On the **Name and SSO location** section, perform following steps:

	![Screenshot shows the Name and S S O location where Azure A D is the identity provider name.](./media/kantegassoforbitbucket-tutorial/location.png)

	a. Add Name of the Identity Provider in **Identity provider name** textbox (e.g Azure AD).

	b. Click **Next**.

1. Verify the Signing certificate and click **Next**.

	![Screenshot shows Signature verification.](./media/kantegassoforbitbucket-tutorial/certificate.png)

1. On the **Bitbucket user accounts** section, perform following steps:

	![Screenshot shows BitBucket user accounts where you have the option to create users.](./media/kantegassoforbitbucket-tutorial/accounts.png)

	a. Select **Create users in Bitbucket's internal Directory if needed** and enter the appropriate name of the group for users (can be multiple no. of groups separated by comma).

	b. Click **Next**.

1. Click **Finish**.

	![Screenshot shows the Summary page.](./media/kantegassoforbitbucket-tutorial/groups.png)

1. On the **Known domains for Azure AD** section, perform following steps:

	![Screenshot shows the Known domains for Azure A D where you can perform these steps.](./media/kantegassoforbitbucket-tutorial/domain.png)

	a. Select **Known domains** from the left panel of the page.

	b. Enter domain name in the **Known domains** textbox.

	c. Click **Save**.

### Create Kantega SSO for Bitbucket test user

To enable Azure AD users to sign in to Bitbucket, they must be provisioned into Bitbucket. In case of Kantega SSO for Bitbucket, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your Bitbucket company site as an administrator.

1. Click on settings icon.

    ![Screenshot shows the Settings icon.](./media/kantegassoforbitbucket-tutorial/user.png) 

1. Under **Administration** tab section, click **Users**.

	![Screenshot shows BitBucket Administration with Users selected. ](./media/kantegassoforbitbucket-tutorial/add-user.png)

1. Click **Create user**.

	![Screenshot shows BitBucket Administration with Create user selected.](./media/kantegassoforbitbucket-tutorial/create-user.png)	 

1. On the **Create User** dialog page, perform the following steps:

	![Screenshot shows the Create user dialog box where you can perform these steps.](./media/kantegassoforbitbucket-tutorial/details.png) 

	a. In the **Username** textbox, type the email of user like Brittasimon@contoso.com.

	b. In the **Full Name** textbox, type full name of the user like Britta Simon.

	c. In the **Email address** textbox, type the email address of user like Brittasimon@contoso.com.

	d. In the **Password** textbox, type the password of user.

	e. In the **Confirm Password** textbox, reenter the password of user.

	f. Click **Create user**.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Kantega SSO for Bitbucket Sign on URL where you can initiate the login flow.  

* Go to Kantega SSO for Bitbucket Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Kantega SSO for Bitbucket for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Kantega SSO for Bitbucket tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Kantega SSO for Bitbucket for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Kantega SSO for Bitbucket you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
