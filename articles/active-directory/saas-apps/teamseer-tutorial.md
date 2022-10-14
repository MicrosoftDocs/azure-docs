---
title: 'Tutorial: Azure AD SSO integration with TeamSeer'
description: Learn how to configure single sign-on between Azure Active Directory and TeamSeer.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/30/2022
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with TeamSeer

In this tutorial, you'll learn how to integrate TeamSeer with Azure Active Directory (Azure AD). When you integrate TeamSeer with Azure AD, you can:

* Control in Azure AD who has access to TeamSeer.
* Enable your users to be automatically signed-in to TeamSeer with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with TeamSeer, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* TeamSeer single sign-on enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* TeamSeer supports **SP** initiated SSO.

## Add TeamSeer from the gallery

To configure the integration of TeamSeer into Azure AD, you need to add TeamSeer from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **TeamSeer** in the search box.
1. Select **TeamSeer** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for TeamSeer

Configure and test Azure AD SSO with TeamSeer using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in TeamSeer.

To configure and test Azure AD SSO with TeamSeer, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure TeamSeer SSO](#configure-teamseer-sso)** - to configure the single sign-on settings on application side.
    1. **[Create TeamSeer test user](#create-teamseer-test-user)** - to have a counterpart of B.Simon in TeamSeer that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **TeamSeer** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following step:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://www.teamseer.com/<companyid>`

	> [!NOTE]
	> The value is not real. Update the value with the actual Sign-On URL. Contact [TeamSeer Client support team](https://pages.theaccessgroup.com/solutions_business-suite_absence-management_contact.html) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

6. On the **Set up TeamSeer** section, copy the appropriate URL(s) as per your requirement.

	![Screenshot shows to copy configuration appropriate U R L.](common/copy-configuration-urls.png "Metadata")

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to TeamSeer.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **TeamSeer**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure TeamSeer SSO

1. In a different web browser window, sign in to your TeamSeer company site as an administrator.

1. Go to **HR Admin**.

    ![Screenshot shows the H R Admin selected from the TeamSeer window.](./media/teamseer-tutorial/admin.png "HR Admin")

1. Click **Setup**.

    ![Screenshot shows the Setup SSO Configuration.](./media/teamseer-tutorial/users.png "Setup")

1. Click **Set up SAML provider details**.

    ![Screenshot shows Set up SAML provider details selected.](./media/teamseer-tutorial/test.png "SAML Settings")

1. In the SAML provider details section, perform the following steps:

    ![Screenshot shows the SAML provider details where you can enter the values described.](./media/teamseer-tutorial/details.png "SAML Settings")

    a. In the **URL** textbox, paste the **Login URL** value, which you have copied from the Azure portal.

    b. Open your base-64 encoded certificate in notepad, copy the content of it in to your clipboard, and then paste it to the **IdP Public Certificate** textbox.

1. To complete the SAML provider configuration, perform the following steps:

    ![Screenshot shows the SAML provider configuration where you can enter the values described.](./media/teamseer-tutorial/folder.png "SAML Settings")

    a. In the **Test Email Addresses**, type the test user’s email address.
  
    b. In the **Issuer** textbox, type the Issuer URL of the service provider.
  
    c. Click **Save**.

### Create TeamSeer test user

To enable Azure AD users to sign in to TeamSeer, they must be provisioned in to ShiftPlanning. In the case of TeamSeer, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your **TeamSeer** company site as an administrator.

1. Go to **HR Admin \> Users** and then click **Run the New User wizard**.

    ![Screenshot shows the H R Admin tab where you can select a wizard to run.](./media/teamseer-tutorial/account.png "HR Admin")

1. In the **User Details** section, perform the following steps:

    ![Screenshot shows the User Details.](./media/teamseer-tutorial/tools.png "User Details")

    a. Type the **First Name**, **Surname**, **User name (Email address)** of a valid Azure AD account you want to provision in to the related textboxes.
  
    b. Click **Next**.

1. Follow the on-screen instructions for adding a new user, and click **Finish**.

> [!NOTE]
> You can use any other TeamSeer user account creation tools or APIs provided by TeamSeer to provision Azure AD user accounts.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to TeamSeer Sign-on URL where you can initiate the login flow. 

* Go to TeamSeer Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the TeamSeer tile in the My Apps, this will redirect to TeamSeer Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure TeamSeer you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).