---
title: 'Tutorial: Azure Active Directory integration with Kantega SSO for Jira | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Kantega SSO for Jira.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/27/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Kantega SSO for Jira

This tutorial will teach you how to integrate Kantega SSO for Jira with Azure Active Directory (Azure AD). When you integrate Kantega SSO for Jira with Azure AD, you can:

* Control in Azure AD who has access to Kantega SSO for Jira.
* Enable your users to automatically sign in to Kantega SSO for Jira with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Kantega SSO for Jira, you need the following items:

* An Azure AD subscription. You can get a [free account](https://azure.microsoft.com/free/) if you don't have an Azure AD environment.

* Kantega SSO for Jira single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Kantega SSO for Jira supports **SP and IDP** initiated SSO.

## Add Kantega SSO for Jira from the gallery

To configure the integration of Kantega SSO for Jira into Azure AD, you need to add Kantega SSO for Jira from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **Kantega SSO for Jira** in the search box.
1. Select **Kantega SSO for Jira** from the results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Kantega SSO for Jira

Configure and test Azure AD SSO with Kantega SSO for Jira using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Kantega SSO for Jira.

To configure and test Azure AD SSO with Kantega SSO for Jira, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Kantega SSO for Jira SSO](#configure-kantega-sso-for-jira-sso)** - to configure the single sign-on settings on the application side.
    1. **[Create Kantega SSO for Jira test user](#create-kantega-sso-for-jira-test-user)** - to have a counterpart of B.Simon in Kantega SSO for Jira linked to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Kantega SSO for Jira** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<UNIQUE_ID>/login`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<UNIQUE_ID>/login`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<UNIQUE_ID>/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. These values are received during the configuration of the Jira plugin, which is explained later in the tutorial.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up Kantega SSO for Jira** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the displayed value in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Kantega SSO for Jira.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Kantega SSO for Jira**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you expect a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see the "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Kantega SSO for Jira SSO

1. In a different web browser window, sign in to your Jira on-premises server as an administrator.

1. Hover on the cog and click the **Add-ons**.

	![Screenshot that shows the "Cog" icon selected and "Add-ons" selected from the dropdown.](./media/kantegassoforjira-tutorial/settings.png)

1. Under the Add-ons tab section, click **Find new add-ons**. Search **Kantega SSO for Jira (SAML & Kerberos)** and click the **Install** button to install the new SAML plugin.

	![Screenshot that shows the "Find new Add-ons" section with "Kantego SSO for Jira (SAML & Kerberos)" in the search box and the "Install" button selected.](./media/kantegassoforjira-tutorial/install-tab.png)

1. The plugin installation starts.

	![Screenshot that shows the plugin "Installing" dialog.](./media/kantegassoforjira-tutorial/installation.png)

1. Once the installation is complete. Click **Close**.

	![Screenshot that shows the "Installed and ready to go!" dialog with the "Close" action selected.](./media/kantegassoforjira-tutorial/close-tab.png)

1.	Click **Manage**.

	![Screenshot that shows the "Kantega SSO" app page with the "Manage" button selected.](./media/kantegassoforjira-tutorial/manage-tab.png)
    
1. New plugin is listed under **INTEGRATIONS**. Click **Configure** to configure the new plugin.

	![Screenshot that shows "INTEGRATIONS" in the left-side navigation menu highlighted and the "Configure" button selected in the "Manage add-ons" section.](./media/kantegassoforjira-tutorial/integration.png)

1. In the **SAML** section. Select **Azure Active Directory (Azure AD)** from the **Add identity provider** dropdown.

    ![Screenshot that shows the "Add identity provider" dropdown with "Azure Active Directory (Azure AD)" selected.](./media/kantegassoforjira-tutorial/identity-provider.png)

1. Select subscription level as **Basic**.

    ![Screenshot that shows the "Preparing Azure AD" section with "Basic" selected.](./media/kantegassoforjira-tutorial/basic-tab.png)

1. On the **App properties** section, perform the following steps: 

    ![Screenshot that shows the "App properties" section with the "App ID URL" textbox and copy button highlighted, and the "Next" button selected.](./media/kantegassoforjira-tutorial/properties.png)

    1. Copy the **App ID URI** value and use it as **Identifier, Reply URL, and Sign-On URL** on the **Basic SAML Configuration** section in the Azure portal.

    1. Click **Next**.

1. On the **Metadata import** section, perform the following steps: 

    ![Screenshot that shows the "Metadata import" section with "Metadata file on my computer" selected.](./media/kantegassoforjira-tutorial/metadata.png)

    1. Select **Metadata file on my computer**and upload the metadata file you downloaded from the Azure portal.

    1. Click **Next**.

1. On the **Name and SSO location** section, perform the following steps:

    ![Screenshot that shows the "Name and SSO location" with the "Identity provider name" textbox highlighted and the "Next" button selected.](./media/kantegassoforjira-tutorial/location.png)

    1. Add Name of the Identity Provider in **Identity provider name** textbox (e.g. Azure AD).

    1. Click **Next**.

1. Verify the Signing certificate and click **Next**.

    ![Screenshot that shows the "Signature verification" section with the "Next" button selected.](./media/kantegassoforjira-tutorial/certificate.png)

1. On the **Jira user accounts** section, perform the following steps:

    ![Screenshot that shows the "Jira user accounts" with the "Create users in Jira's Internal Directory if needed" option highlighted and the "Next" button selected.](./media/kantegassoforjira-tutorial/accounts.png)

    1. Select **Create users in Jira's internal Directory if needed** and enter the appropriate name of the group for users (can be multiple no. of groups separated by comma).

    1. Click **Next**.

1. Click **Finish**.

    ![Screenshot that shows the "Summary" section with the "Finish" button selected.](./media/kantegassoforjira-tutorial/finish-tab.png)

1. On the **Known domains for Azure AD** section, perform the following steps:

    ![Configure Single Sign-On](./media/kantegassoforjira-tutorial/save-tab.png)

    1. Select **Known domains** from the left panel of the page.

    2. Enter a domain name in the **Known domains** textbox.

    3. Click **Save**.

### Create Kantega SSO for Jira test user

To enable Azure AD users to sign in to Jira, they must be provisioned into Jira. In Kantega SSO for Jira, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your Jira on-premises server as an administrator.

1. Hover over the cog and click the **User management**.

    ![Screenshot that shows the "Cog" icon selected and "User management" selected from the dropdown.](./media/kantegassoforjira-tutorial/user.png) 

1. Under the **User management** tab section, click **Create user**.

    ![Screenshot that shows the "User management" section with the "Create user" button selected.](./media/kantegassoforjira-tutorial/create-user.png) 

1. On the **“Create new user”** dialog page, perform the following steps:

    ![Add Employee](./media/kantegassoforjira-tutorial/new-user.png) 

    1. In the **Email address** textbox, type the user's email address like Brittasimon@contoso.com.

    2. In the **Full Name** textbox, type the user's full name like Britta Simon.

    3. In the **Username** textbox, type the user's email like Brittasimon@contoso.com.

    4. In the **Password** textbox, type the user's password.

    5. Click **Create user**.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with the following options. 

#### SP initiated:

* Click on **Test this application** in the Azure portal. This will redirect to Kantega SSO for Jira Sign-on URL, where you can initiate the login flow.  

* Go to Kantega SSO for Jira Sign-on URL directly and initiate the login flow.

#### IDP initiated:

* Click on **Test this application** in the Azure portal, and you should be automatically signed in to the Kantega SSO for Jira, for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Kantega SSO for Jira tile in the My Apps, if configured in SP mode, you will be redirected to the application sign-on page for initiating the login flow. If configured in IDP mode, you should be automatically signed in to the Kantega SSO for Jira for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Kantega SSO for Jira, you can enforce session control, which protects the exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
