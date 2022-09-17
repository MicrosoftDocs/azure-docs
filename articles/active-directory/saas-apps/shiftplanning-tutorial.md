---
title: 'Tutorial: Azure AD SSO integration with Humanity'
description: Learn how to configure single sign-on between Azure Active Directory and Humanity.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/26/2021
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with Humanity

In this tutorial, you'll learn how to integrate Humanity with Azure Active Directory (Azure AD). When you integrate Humanity with Azure AD, you can:

* Control in Azure AD who has access to Humanity.
* Enable your users to be automatically signed-in to Humanity with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Humanity single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Humanity supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Humanity from the gallery

To configure the integration of Humanity into Azure AD, you need to add Humanity from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Humanity** in the search box.
1. Select **Humanity** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Humanity

Configure and test Azure AD SSO with Humanity using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Humanity.

To configure and test Azure AD SSO with Humanity, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Humanity SSO](#configure-humanity-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Humanity test user](#create-humanity-test-user)** - to have a counterpart of B.Simon in Humanity that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Humanity** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type the URL: 
    `https://company.humanity.com/app/`

	b. In the **Sign on URL** text box, type the URL:
    `https://company.humanity.com/includes/saml/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Sign on URL. Contact [Humanity Client support team](https://www.humanity.com/contact) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Humanity** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Humanity.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Humanity**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Humanity SSO

1. In a different web browser window, log in to your **Humanity** company site as an administrator.

2. In the menu on the top, click **Admin**.

    ![Admin](./media/shiftplanning-tutorial/menu.png "Admin")

3. Under **Integration**, click **Single Sign-On**.

    ![Screenshot shows Single Sign-On selected from the Integration menu.](./media/shiftplanning-tutorial/integration.png "Single Sign-On")

4. In the **Single Sign-On** section, perform the following steps:

    ![Screenshot shows the Single Sign-On section where you can enter the values described.](./media/shiftplanning-tutorial/settings.png "Single Sign-On")

    a. Select **SAML Enabled**.

    b. Select **Allow Password Login**.

    c. In the **SAML Issuer URL** textbox, paste the **Login URL** value, which you have copied from Azure portal.

    d. In the **Remote Logout URL** textbox, paste the **Logout URL** value, which you have copied from Azure portal.

    e. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **X.509 Certificate** textbox.

    f. Click **Save Settings**.

### Create Humanity test user

In order to enable Azure AD users to log in to Humanity, they must be provisioned into Humanity. In the case of Humanity, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your **Humanity** company site as an administrator.

2. Click **Admin**.

    ![Admin](./media/shiftplanning-tutorial/menu.png "Admin")

3. Click **Staff**.

    ![Staff](./media/shiftplanning-tutorial/profile.png "Staff")

4. Under **Actions**, click **Add Employees**.

    ![Add Employees](./media/shiftplanning-tutorial/actions.png "Add Employees")

5. In the **Add Employees** section, perform the following steps:

    ![Save Employees](./media/shiftplanning-tutorial/accounts.png "Save Employees")

    a. Type the **First Name**, **Last Name**, and **Email** of a valid Azure AD account you want to provision into the related textboxes.

    b. Click **Save Employees**.

> [!NOTE]
> You can use any other Humanity user account creation tools or APIs provided by Humanity to provision Azure AD user accounts.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Humanity Sign-on URL where you can initiate the login flow. 

* Go to Humanity Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Humanity tile in the My Apps, this will redirect to Humanity Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Humanity you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
