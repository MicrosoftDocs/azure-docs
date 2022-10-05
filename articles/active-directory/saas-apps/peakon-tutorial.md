---
title: 'Tutorial: Azure AD SSO integration with Peakon'
description: Learn how to configure single sign-on between Azure Active Directory and Peakon.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/15/2022
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with Peakon

In this tutorial, you'll learn how to integrate Peakon with Azure Active Directory (Azure AD). When you integrate Peakon with Azure AD, you can:

* Control in Azure AD who has access to Peakon.
* Enable your users to be automatically signed-in to Peakon with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Peakon single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Peakon supports **SP** and **IDP** initiated SSO.
* Peakon supports [**automated** user provisioning and deprovisioning](peakon-provisioning-tutorial.md) (recommended).

## Add Peakon from the gallery

To configure the integration of Peakon into Azure AD, you need to add Peakon from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Peakon** in the search box.
1. Select **Peakon** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Peakon

Configure and test Azure AD SSO with Peakon using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Peakon.

To configure and test Azure AD SSO with Peakon, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Peakon SSO](#configure-peakon-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Peakon test user](#create-peakon-test-user)** - to have a counterpart of B.Simon in Peakon that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Peakon** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://app.peakon.com/saml/<companyid>/metadata`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://app.peakon.com/saml/<companyid>/assert`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://app.peakon.com/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL which is explained later in the tutorial. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Raw)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificateraw.png)

7. On the **Set up Peakon** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Peakon.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Peakon**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Peakon SSO

1. In a different web browser window, sign in to Peakon as an Administrator.

2. In the menu bar on the left side of the page, click **Configuration**, then navigate to **Integrations**.

	![Screenshot shows the Configuration](./media/peakon-tutorial/menu.png)

3. On **Integrations** page, click on **Single Sign-On**.

	![Screenshot shows the Single](./media/peakon-tutorial/profile.png)

4. Under **Single Sign-On** section, click on **Enable**.

	![Screenshot shows to enable Single Sign-On](./media/peakon-tutorial/enable.png)

5. On the **Single sign-on for employees using SAML** section, perform the following steps:

	![Screenshot shows SAML Single sign-on](./media/peakon-tutorial/settings.png)

	a. In the **SSO Login URL** textbox, paste the value of **Login URL**, which you have copied from the Azure portal.

	b. In the **SSO Logout URL** textbox, paste the value of **Logout URL**, which you have copied from the Azure portal.

	c. Click **Choose file** to upload the certificate that you have downloaded from the Azure portal, into the Certificate box.

	d. Click the **icon** to copy the **Entity ID** and paste in **Identifier** textbox in **Basic SAML Configuration** section on Azure portal.

	e. Click the **icon** to copy the **Reply URL (ACS)** and paste in **Reply URL** textbox in **Basic SAML Configuration** section on Azure portal.

	f. Click **Save**.

### Create Peakon test user

For enabling Azure AD users to sign in to Peakon, they must be provisioned into Peakon.  
In the case of Peakon, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your Peakon company site as an administrator.

2. In the menu bar on the left side of the page, click **Configuration**, then navigate to **Employees**.

    ![Screenshot shows the employee](./media/peakon-tutorial/employee.png)

3. On the top right side of the page, click **Add employee**.

    ![Screenshot shows to add employee](./media/peakon-tutorial/add-employee.png)

3. On the **New employee** dialog page, perform the following steps:

    ![Screenshot shows the new employee](./media/peakon-tutorial/create.png)

    1. In the **Name** textbox, type first name as **Britta** and last name as **simon**.

    1. In the **Email** textbox, type the email address like **Brittasimon\@contoso.com**.

    1. Click **Create employee**.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Peakon Sign on URL where you can initiate the login flow.  

* Go to Peakon Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Peakon for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Peakon tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Peakon for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure FreshDesk you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).