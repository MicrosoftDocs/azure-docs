---
title: 'Tutorial: Azure Active Directory integration with BitaBIZ'
description: Learn how to configure single sign-on between Azure Active Directory and BitaBIZ.
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
# Tutorial: Azure Active Directory integration with BitaBIZ

In this tutorial, you'll learn how to integrate BitaBIZ with Azure Active Directory (Azure AD). When you integrate BitaBIZ with Azure AD, you can:

* Control in Azure AD who has access to BitaBIZ.
* Enable your users to be automatically signed-in to BitaBIZ with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with BitaBIZ, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* BitaBIZ single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* BitaBIZ supports **SP and IDP** initiated SSO.
* BitaBIZ supports [Automated user provisioning](bitabiz-provisioning-tutorial.md).


## Add BitaBIZ from the gallery

To configure the integration of BitaBIZ into Azure AD, you need to add BitaBIZ from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **BitaBIZ** in the search box.
1. Select **BitaBIZ** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for BitaBIZ

Configure and test Azure AD SSO with BitaBIZ using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in BitaBIZ.

To configure and test Azure AD SSO with BitaBIZ, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure BitaBIZ SSO](#configure-bitabiz-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create BitaBIZ test user](#create-bitabiz-test-user)** - to have a counterpart of Britta Simon in BitaBIZ that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **BitaBIZ** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP initiated** mode perform the following steps:

    In the **Identifier** text box, type a URL using the following pattern:
    `https://www.bitabiz.com/<INSTANCE_ID>`

    > [!NOTE]
    > The value in the above URL is for demonstration only. Update the value with the actual identifier, which is explained later in the tutorial.

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://www.bitabiz.com/dashboard`

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

    ![The Certificate download link](common/certificatebase64.png)

7. On the **Set up BitaBIZ** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to BitaBIZ.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **BitaBIZ**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure BitaBIZ SSO

1. In a different web browser window, sign-on to your BitaBIZ tenant as an administrator.

2. Click on **SETUP ADMIN**.

    ![Screenshot shows part of a browser window with Setup Admin selected.](./media/bitabiz-tutorial/setup-admin.png)

3. Click on **Microsoft integrations** under **Add value** section.

    ![Screenshot shows Add value with Microsoft integrations selected.](./media/bitabiz-tutorial/integrations.png)

4. Scroll down to the section **Microsoft Azure AD (Enable single sign on)** and perform following steps:

    ![Screenshot shows the Microsoft Azure A D section where you enter the information described in this step.](./media/bitabiz-tutorial/configuration.png)

    a. Copy the value from the **Entity ID (”Identifier” in Azure AD)** textbox and paste it into the **Identifier** textbox on the **Basic SAML Configuration** section in Azure portal. 

    b. In the **Azure AD Single Sign-On Service URL** textbox, paste **Login URL**, which you have copied from Azure portal.

    c. In the **Azure AD SAML Entity ID** textbox, paste **Azure Ad Identifier**, which you have copied from Azure portal.

    d. Open your downloaded **Certificate(Base64)** file in notepad, copy the content of it into your clipboard, and then paste it to the **Azure AD Signing Certificate (Base64 encoded)** textbox.

    e. Add your business e-mail domain name that is, mycompany.com in **Domain name** textbox to assign SSO to the users in your company with this email domain (NOT MANDATORY).

    f. Mark **SSO enabled** the BitaBIZ account.

    g. Click **Save Azure AD configuration** to save and activate the SSO configuration.


### Create BitaBIZ test user

To enable Azure AD users to log in to BitaBIZ, they must be provisioned into BitaBIZ.  
In the case of BitaBIZ, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your BitaBIZ company site as an administrator.

2. Click on **SETUP ADMIN**.

    ![Screenshot shows part of your browser window with Setup Admin selected.](./media/bitabiz-tutorial/setup-admin.png)

3. Click on **Add users** under **Organization** section.

    ![Screenshot shows the Organization section with Add users selected.](./media/bitabiz-tutorial/add-user.png)

4. Click **Add new employee**.

    ![Screenshot shows Add users with Add new employee selected.](./media/bitabiz-tutorial/new-employee.png)

5. On the **Add new employee** dialog page, perform the following steps:

    ![Screenshot shows the page where you enter the information described in this step.](./media/bitabiz-tutorial/save-employee.png)

    a. In the **First Name** textbox, type the first name of user like Britta.

    b. In the **Last Name** textbox, type the last name of user like Simon.

    c. In the **Email** textbox, type the email address of user like Brittasimon@contoso.com.

    d. Select a date in **Date of employment**.

    e. There are other non-mandatory user attributes which can be set up for the user. Please refer the [Employee Setup Doc](https://help.bitabiz.dk/manage-or-set-up-your-account/on-boarding-employees/new-employee) for more details.

    f. Click **Save employee**.

    > [!NOTE]
    > The Azure Active Directory account holder receives an email and follows a link to confirm their account before it becomes active.

> [!NOTE]
>BitaBIZ also supports automatic user provisioning, you can find more details [here](./bitabiz-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to BitaBIZ Sign on URL where you can initiate the login flow.  

* Go to BitaBIZ Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the BitaBIZ for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the BitaBIZ tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the BitaBIZ for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure BitaBIZ you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
