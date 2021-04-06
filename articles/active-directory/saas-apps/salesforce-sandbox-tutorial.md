---
title: 'Tutorial: Azure Active Directory integration with Salesforce Sandbox | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Salesforce Sandbox.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/28/2020
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Salesforce Sandbox

In this tutorial, you'll learn how to integrate Salesforce Sandbox with Azure Active Directory (Azure AD). When you integrate Salesforce Sandbox with Azure AD, you can:

* Control in Azure AD who has access to Salesforce Sandbox.
* Enable your users to be automatically signed-in to Salesforce Sandbox with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Salesforce Sandbox single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Salesforce Sandbox supports **SP and IDP** initiated SSO
* Salesforce Sandbox supports **Just In Time** user provisioning
* Salesforce Sandbox supports [**Automated** user provisioning](salesforce-sandbox-provisioning-tutorial.md)

## Adding Salesforce Sandbox from the gallery

To configure the integration of Salesforce Sandbox into Azure AD, you need to add Salesforce Sandbox from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Salesforce Sandbox** in the search box.
1. Select **Salesforce Sandbox** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Salesforce Sandbox

Configure and test Azure AD SSO with Salesforce Sandbox using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Salesforce Sandbox.

To configure and test Azure AD SSO with Salesforce Sandbox, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Salesforce Sandbox SSO](#configure-salesforce-sandbox-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Salesforce Sandbox test user](#create-salesforce-sandbox-test-user)** - to have a counterpart of B.Simon in Salesforce Sandbox that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Salesforce Sandbox** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file** and wish to configure in **IDP** initiated mode perform the following steps:

	a. Click **Upload metadata file**.

    ![Upload metadata file](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![choose metadata file](common/browse-upload-metadata.png)

	> [!NOTE]
    > You will get the service provider metadata file from the Salesforce Sandbox admin portal which is explained later in the tutorial.

	c. After the metadata file is successfully uploaded, the **Reply URL** value will get auto populated in **Reply URL** textbox.

	![image](common/both-replyurl.png)

	> [!Note]
	> If the **Reply URL** value do not get auto polulated, then fill in the value manually according to your requirement.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Salesforce Sandbox** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Salesforce Sandbox.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Salesforce Sandbox**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Salesforce Sandbox SSO

1. Open a new tab in your browser and sign in to your Salesforce Sandbox administrator account.

2. Click on the **Setup** under **settings icon** on the top right corner of the page.

    ![Screenshot that shows the "Settings" icon in the top-right selected, and "Setup" selected from the drop-down.](./media/salesforce-sandbox-tutorial/configure1.png)

3. Scroll down to the **SETTINGS** in the left navigation pane, click **Identity** to expand the related section. Then click **Single Sign-On Settings**.

    ![Screenshot that shows the "Settings" menu in the left pane, with "Single Sign-On Settings" selected from the "Identity" menu.](./media/salesforce-sandbox-tutorial/sf-admin-sso.png)

4. On the **Single Sign-On Settings** page, click the **Edit** button.

    ![Screenshot that shows the "Single Sign-On Settings" page with the "Edit" button selected.](./media/salesforce-sandbox-tutorial/configure3.png)

5. Select **SAML Enabled**, and then click **Save**.

	![Screenshot that shows the "Single Sign-On Settings" page with the "S A M L Enabled" checkbox selected and the "Save" button selected.](./media/salesforce-sandbox-tutorial/sf-enable-saml.png)

6. To configure your SAML single sign-on settings, click **New from Metadata File**.

	![Screenshot that shows the "Single Sign-On Settings" page with the "New from Metadata File" button selected.](./media/salesforce-sandbox-tutorial/sf-admin-sso-new.png)

7. Click **Choose File** to upload the metadata XML file which you have downloaded from the Azure portal and click **Create**.

    ![Screenshot that shows the "Single Sign-On Settings" page with the "Choose File" and "Create" buttons selected.](./media/salesforce-sandbox-tutorial/xmlchoose.png)

8. On the **SAML Single Sign-On Settings** page, fields populate automatically and click save.

    ![Screenshot that shows the "Single Sign-On Settings" page with fields populated and the "Save" button selected.](./media/salesforce-sandbox-tutorial/salesforcexml.png)

9. On the **Single Sign-On Settings** page, click the **Download Metadata** button to download the service provider metadata file. Use this file in the **Basic SAML Configuration** section in the Azure portal for configuring the necessary URLs as explained above.

    ![Screenshot that shows the "Single Sign-On Settings" page with the "Download Metadata" button selected.](./media/salesforce-sandbox-tutorial/configure4.png)

10. If you wish to configure the application in **SP** initiated mode, following are the prerequisites for that:

    a. You should have a verified domain.

    b. You need to configure and enable your domain on Salesforce Sandbox, steps for this are explained later in this tutorial.

    c. In the Azure portal, on the **Basic SAML Configuration** section, click **Set additional URLs** and perform the following step:
  
    ![Salesforce Sandbox Domain and URLs single sign-on information](common/both-signonurl.png)

    In the **Sign-on URL** textbox, type the value using the following pattern: `https://<instancename>--Sandbox.<entityid>.my.salesforce.com`

    > [!NOTE]
    > This value should be copied from the Salesforce Sandbox portal once you have enabled the domain.

11. On the **SAML Signing Certificate** section, click **Federation Metadata XML** and then save the xml file on your computer.

	![The Certificate download link](common/metadataxml.png)

12. Open a new tab in your browser and sign in to your Salesforce Sandbox administrator account.

13. Click on the **Setup** under **settings icon** on the top right corner of the page.

    ![Screenshot that shows the "Settings" icon in the top-right selected, and "Setup" selected from the drop-down menu.](./media/salesforce-sandbox-tutorial/configure1.png)

14. Scroll down to the **SETTINGS** in the left navigation pane, click **Identity** to expand the related section. Then click **Single Sign-On Settings**.

    ![Screenshot that shows the "Settings" menu in the left navigation pane, with "Single Sign-On Settings" selected from the "Identity" menu.](./media/salesforce-sandbox-tutorial/sf-admin-sso.png)

15. On the **Single Sign-On Settings** page, click the **Edit** button.

    ![Screenshot that shows the "Single Sign-On Settings" page with "Edit" button selected.](./media/salesforce-sandbox-tutorial/configure3.png)

16. Select **SAML Enabled**, and then click **Save**.

	![Screenshot that shows the "Single Sign-On Settings" page with the "S A M L Enabled" box checked and the "Save" button selected.](./media/salesforce-sandbox-tutorial/sf-enable-saml.png)

17. To configure your SAML single sign-on settings, click **New from Metadata File**.

	![Screenshot that shows the "Single Sign-On Settings" page and "New from Metadata File" button selected.](./media/salesforce-sandbox-tutorial/sf-admin-sso-new.png)

18. Click **Choose File** to upload the metadata XML file and click **Create**.

    ![Screenshot that shows the "Single Sign-On Settings" page with the "Choose File" button and "Create" button selected.](./media/salesforce-sandbox-tutorial/xmlchoose.png)

19. On the **SAML Single Sign-On Settings** page, fields populate automatically, type the name of the configuration (for example: *SPSSOWAAD_Test*), in the **Name** textbox and click save.

    ![Screenshot that shows the "Single Sign-On Settings" page with fields populated, an example name in the "Name" textbox, and the "Save" button selected.](./media/salesforce-sandbox-tutorial/sf-saml-config.png)

20. To enable your domain on Salesforce Sandbox, perform the following steps:

    > [!NOTE]
    > Before enabling the domain you need to create the same on Salesforce Sandbox. For more information, see [Defining Your Domain Name](https://help.salesforce.com/HTViewHelpDoc?id=domain_name_define.htm&language=en_US). Once the domain is created, please make sure that it's configured correctly.

21. On the left navigation pane in Salesforce Sandbox, click **Company Settings** to expand the related section, and then click **My Domain**.

    ![Screenshot that shows the "Company Settings" and "My Domain" selected from the left navigation pane.](./media/salesforce-sandbox-tutorial/sf-my-domain.png)

22. In the **Authentication Configuration** section, click **Edit**.

    ![Screenshot that shows the "Authentication Configuration" section, with the "Edit" button selected.](./media/salesforce-sandbox-tutorial/sf-edit-auth-config.png)

23. In the **Authentication Configuration** section, as **Authentication Service**, select the name of the SAML Single Sign-On Setting which you have set during SSO configuration in Salesforce Sandbox and click **Save**.

    ![Configure Single Sign-On](./media/salesforce-sandbox-tutorial/configure2.png)

### Create Salesforce Sandbox test user

In this section, a user called Britta Simon is created in Salesforce Sandbox. Salesforce Sandbox supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Salesforce Sandbox, a new one is created when you attempt to access Salesforce Sandbox. Salesforce Sandbox also supports automatic user provisioning, you can find more details [here](salesforce-sandbox-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Salesforce Sandbox Sign on URL where you can initiate the login flow.  

* Go to Salesforce Sandbox Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Salesforce Sandbox for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Salesforce Sandbox tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Salesforce Sandbox for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure the Salesforce Sandbox you can enforce session controls, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad)