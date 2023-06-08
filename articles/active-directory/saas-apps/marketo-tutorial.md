---
title: 'Tutorial: Azure Active Directory SSO integration with Marketo'
description: Learn how to configure single sign-on between Azure Active Directory and Marketo.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/12/2023
ms.author: jeedes
---
# Tutorial: Azure Active Directory SSO integration with Marketo

In this tutorial, you learn how to integrate Marketo with Azure Active Directory (Azure AD).
Integrating Marketo with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Marketo.
* You can enable your users to be automatically signed-in to Marketo (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Marketo, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Marketo single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Marketo supports **IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Marketo from the gallery

To configure the integration of Marketo into Azure AD, you need to add Marketo from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Marketo** in the search box.
1. Select **Marketo** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Marketo

In this section, you configure and test Azure AD single sign-on with Marketo based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Marketo needs to be established.

To configure and test Azure AD single sign-on with Marketo, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD SSO with Britta Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD SSO.
2. **[Configure Marketo SSO](#configure-marketo-sso)** - to configure the SSO settings on application side.
    1. **[Create Marketo test user](#create-marketo-test-user)** - to have a counterpart of Britta Simon in Marketo that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Marketo** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type the URL:
    `https://saml.marketo.com/sp`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://login.marketo.com/saml/assertion/<munchkinid>`

    c. In the **Relay State** text box, type a URL using the following pattern:
    `https://<munchkinid>.marketo.com/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Reply URL and Relay State. Contact [Marketo Client support team](https://investors.marketo.com/contactus.cfm) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Your Marketo application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **Unique User Identifier** is **user.userprincipalname** but Marketo expects this to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration.

	![Screenshot shows the image of token attributes configuration.](common/default-attributes.png "Attributes")

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Marketo** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user 

In this section, you create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to Marketo.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Marketo**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Marketo SSO




1. In a different web browser window, sign in to your Marketo company site as an administrator

1. To get Munchkin ID of your application, perform the following actions:
   
    a. Log in to Marketo app using admin credentials.
   
    b. Click the **Admin** button on the top navigation pane.
   
    ![Configure Single Sign-On1](./media/marketo-tutorial/tutorial_marketo_06.png) 
   
    c. Navigate to the Integration menu and click the **Munchkin link**.
   
    ![Configure Single Sign-On2](./media/marketo-tutorial/tutorial_marketo_11.png)
   
    d. Copy the Munchkin ID shown on the screen and complete your Reply URL in the Azure AD configuration wizard.
   
    ![Configure Single Sign-On3](./media/marketo-tutorial/tutorial_marketo_12.png) 

2. To configure the SSO in the application, follow the below steps:
   
    a. Log in to Marketo app using admin credentials.
   
    b. Click the **Admin** button on the top navigation pane.
   
    ![Configure Single Sign-On4](./media/marketo-tutorial/tutorial_marketo_06.png) 
   
    c. Navigate to the Integration menu and click **Single Sign On**.
   
    ![Configure Single Sign-On5](./media/marketo-tutorial/tutorial_marketo_07.png) 
   
    d. To enable the SAML Settings, click **Edit** button.
   
    ![Configure Single Sign-On6](./media/marketo-tutorial/tutorial_marketo_08.png) 
   
    e. **Enabled** Single Sign-On settings.
   
    f. Paste the **Azure AD Identifier**, in the **Issuer ID** textbox.
   
    g. In the **Entity ID** textbox, enter the URL as `http://saml.marketo.com/sp`.
   
    h. Select the User ID Location as **Name Identifier element**.
   
    ![Configure Single Sign-On7](./media/marketo-tutorial/tutorial_marketo_09.png)
   
    > [!NOTE]
    > If your User Identifier is not UPN value then change the value in the Attribute tab.
   
    i. Upload the certificate, which you have downloaded from Azure AD configuration wizard. **Save** the settings.
   
    j. Edit the Redirect Pages settings.
   
    k. Paste the **Login URL** in the **Login URL** textbox.
   
    l. Paste the **Logout URL** in the **Logout URL** textbox.
   
    m. In the **Error URL**, copy your **Marketo instance URL** and click **Save** button to save settings.
   
    ![Configure Single Sign-On8](./media/marketo-tutorial/tutorial_marketo_10.png)

3. To enable the SSO for users, complete the following actions:
   
    a. Log in to Marketo app using admin credentials.
   
    b. Click the **Admin** button on the top navigation pane.
   
    ![Configure Single Sign-On9](./media/marketo-tutorial/tutorial_marketo_06.png) 
   
    c. Navigate to the **Security** menu and click **Login Settings**.
   
    ![Configure Single Sign-On10](./media/marketo-tutorial/tutorial_marketo_13.png)
   
    d. Check the **Require SSO** option and **Save** the settings.
   
    ![Configure Single Sign-On11](./media/marketo-tutorial/tutorial_marketo_14.png)


### Create Marketo test user

In this section, you create a user called Britta Simon in Marketo. follow these steps to create a user in Marketo platform.

1. Log in to Marketo app using admin credentials.

2. Click the **Admin** button on the top navigation pane.
   
    ![test user1](./media/marketo-tutorial/tutorial_marketo_06.png) 

3. Navigate to the **Security** menu and click **Users & Roles**.
   
    ![test user2](./media/marketo-tutorial/tutorial_marketo_19.png)  

4. Click the **Invite New User** link on the Users tab.
   
    ![test user3](./media/marketo-tutorial/tutorial_marketo_15.png) 

5. In the Invite New User wizard, fill the following information.
   
    a. Enter the user **Email** address in the textbox
   
    ![test user4](./media/marketo-tutorial/tutorial_marketo_16.png)
   
    b. Enter the **First Name** in the textbox.
   
    c. Enter the **Last Name**  in the textbox.
   
    d. Click **Next**.

6. In the **Permissions** tab, select the **userRoles** and click **Next**.
   
    ![test user5](./media/marketo-tutorial/tutorial_marketo_17.png)
7. Click the **Send** button to send the user invitation
   
    ![test user6](./media/marketo-tutorial/tutorial_marketo_18.png)

8. User receives the email notification and has to click the link and change the password to activate the account. 

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Marketo for which you set up the SSO

* You can use Microsoft My Apps. When you click the Marketo tile in the My Apps, you should be automatically signed in to the Marketo for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Marketo you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
