---
title: 'Tutorial: Azure Active Directory integration with JIRA SAML SSO by Microsoft (V5.2) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and JIRA SAML SSO by Microsoft (V5.2).
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: d0c00408-f9b8-4a79-bccc-c346a7331845
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with JIRA SAML SSO by Microsoft (V5.2)

In this tutorial, you learn how to integrate JIRA SAML SSO by Microsoft (V5.2) with Azure Active Directory (Azure AD).

Integrating JIRA SAML SSO by Microsoft (V5.2) with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to JIRA SAML SSO by Microsoft (V5.2).
- You can enable your users to automatically get signed-on to JIRA SAML SSO by Microsoft (V5.2) (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Description

Use your Microsoft Azure Active Directory account with Atlassian JIRA server to enable single sign-on. This way all your organization users can use the Azure AD credentials to login into the JIRA application. This plugin uses SAML 2.0 for federation.

## Prerequisites

To configure Azure AD integration with JIRA SAML SSO by Microsoft (V5.2), you need the following items:

- An Azure AD subscription
- JIRA Core and Software 5.2 should installed and configured on Windows 64-bit version
- JIRA server is HTTPS enabled
- Note the supported versions for JIRA Plugin are mentioned in below section.
- JIRA server is reachable on internet particularly to Azure AD Login page for authentication and should able to receive the token from Azure AD
- Admin credentials are set up in JIRA
- WebSudo is disabled in JIRA
- Test user created in the JIRA server application

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment of JIRA. Test the integration first in development or staging environment of the application and then use the production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

**Supported Versions:**

*	JIRA Core and Software: 5.2
*   JIRA also supports 6.0 and 7.8. For more details, click [JIRA SAML SSO by Microsoft](jiramicrosoft-tutorial.md)

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment.
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding JIRA SAML SSO by Microsoft (V5.2) from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding JIRA SAML SSO by Microsoft (V5.2) from the gallery
To configure the integration of JIRA SAML SSO by Microsoft (V5.2) into Azure AD, you need to add JIRA SAML SSO by Microsoft (V5.2) from the gallery to your list of managed SaaS apps.

**To add JIRA SAML SSO by Microsoft (V5.2) from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **JIRA SAML SSO by Microsoft (V5.2)**, select **JIRA SAML SSO by Microsoft (V5.2)** from result panel then click **Add** button to add the application.

	![JIRA SAML SSO by Microsoft (V5.2) in the results list](./media/jira52microsoft-tutorial/tutorial_singlesign-onforjira5.2_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with JIRA SAML SSO by Microsoft (V5.2) based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in JIRA SAML SSO by Microsoft (V5.2) is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in JIRA SAML SSO by Microsoft (V5.2) needs to be established.

To configure and test Azure AD single sign-on with JIRA SAML SSO by Microsoft (V5.2), you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a JIRA SAML SSO by Microsoft (V5.2) test user](#create-a-jira-saml-sso-by-microsoft-v52-test-user)** - to have a counterpart of Britta Simon in JIRA SAML SSO by Microsoft (V5.2) that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your JIRA SAML SSO by Microsoft (V5.2) application.

**To configure Azure AD single sign-on with JIRA SAML SSO by Microsoft (V5.2), perform the following steps:**

1. In the Azure portal, on the **JIRA SAML SSO by Microsoft (V5.2)** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/jira52microsoft-tutorial/tutorial_singlesign-onforjira5.2_samlbase.png)

3. On the **JIRA SAML SSO by Microsoft Domain and URLs** section, perform the following steps:

	![JIRA SAML SSO by Microsoft Domain and URLs single sign-on information](./media/jira52microsoft-tutorial/tutorial_singlesign-onforjira5.2_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<domain:port>/plugins/servlet/saml/auth`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<domain:port>/`

	c. In the **Reply URL** textbox, type a URL using the following pattern: `https://<domain:port>/plugins/servlet/saml/auth`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. Port is optional in case it’s a named URL. These values are received during the configuration of Jira plugin, which is explained later in the tutorial.

4. On the **SAML Signing Certificate** section, click the copy button to copy **App Federation Metadata Url** and paste it into notepad.

    ![Configure Single Sign-On](./media/jira52microsoft-tutorial/tutorial_metadataurl.png)

5. Click **Save** button.

	![Configure Single Sign-On](./media/jira52microsoft-tutorial/tutorial_general_400.png)

6. In a different web browser window, log in to your JIRA instance as an administrator.

7. Hover on cog and click the **Add-ons**.

	![Configure Single Sign-On](./media/jira52microsoft-tutorial/addon1.png)

8. Under Add-ons tab section, click **Manage add-ons**.

	![Configure Single Sign-On](./media/jira52microsoft-tutorial/addon7.png)

9. Download the plugin from [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=56521). Manually upload the plugin provided by Microsoft using **Upload add-on** menu. The download of plugin is covered under [Microsoft Service Agreement](https://www.microsoft.com/servicesagreement/).

	![Configure Single Sign-On](./media/jira52microsoft-tutorial/addon12.png)

10. Once the plugin is installed, it appears in **User Installed** add-ons section. Click **Configure** to configure the new plugin.

	![Configure Single Sign-On](./media/jira52microsoft-tutorial/addon13.png)

11. Perform following steps on configuration page:

	![Configure Single Sign-On](./media/jira52microsoft-tutorial/addon52.png)

	> [!TIP]
	> Ensure that there is only one certificate mapped against the app so that there is no error in resolving the metadata. If there are multiple certificates, upon resolving the metadata, admin gets an error.

	a. In **Metadata URL** textbox, paste **App Federation Metadata Url** value which you have copied from the Azure portal and click the **Resolve** button. It reads the IdP metadata URL and populates all the fields information.

	b. Copy the **Identifier, Reply URL and Sign on URL** values and paste them in **Identifier, Reply URL and Sign on URL** textboxes respectively in **JIRA SAML SSO by Microsoft (V5.2) Domain and URLs** section on Azure portal.

	c. In **Login Button Name** type the name of button your organization wants the users to see on login screen.

	d. In **SAML User ID Locations** select either **User ID is in the NameIdentifier element of the Subject statement** or **User ID is in an Attribute element**.  This ID has to be the JIRA user id. If the user id is not matched, then system will not allow users to log in.

	> [!Note]
	> Default SAML User ID location is Name Identifier. You can change this to an attribute option and enter the appropriate attribute name.

	e. If you select **User ID is in an Attribute element** option, then in **Attribute name** textbox type the name of the attribute where User Id is expected. 

	f. If you are using the federated domain (like ADFS etc.) with Azure AD, then click on the **Enable Home Realm Discovery** option and configure the **Domain Name**.

	g. In **Domain Name** type the domain name here in case of the ADFS-based login.

	h. Check **Enable Single Sign out** if you wish to log out from Azure AD when a user logs out from JIRA. 

	i. Click **Save** button to save the settings.

	> [!NOTE]
	> For more information about installation and troubleshooting, visit [MS JIRA SSO Connector Admin Guide](../ms-confluence-jira-plugin-adminguide.md) and there is also [FAQ](../ms-confluence-jira-plugin-faq.md) for your assistance

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/jira52microsoft-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/jira52microsoft-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/jira52microsoft-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/jira52microsoft-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Create a JIRA SAML SSO by Microsoft (V5.2) test user

To enable Azure AD users to log in to JIRA on-premises server, they must be provisioned into JIRA on-premises server.

**To provision a user account, perform the following steps:**

1. Log in to your JIRA on-premises server as an administrator.

2. Hover on cog and click the **User management**.

    ![Add Employee](./media/jira52microsoft-tutorial/user1.png)

3. You are redirected to Administrator Access page to enter **Password** and click **Confirm** button.

	![Add Employee](./media/jira52microsoft-tutorial/user2.png)

4. Under **User management** tab section, click **create user**.

	![Add Employee](./media/jira52microsoft-tutorial/user3.png) 

5. On the **“Create new user”** dialog page, perform the following steps:

	![Add Employee](./media/jira52microsoft-tutorial/user4.png)

	a. In the **Email address** textbox, type the email address of user like Brittasimon@contoso.com.

	b. In the **Full Name** textbox, type full name of the user like Britta Simon.

	c. In the **Username** textbox, type the email of user like Brittasimon@contoso.com.

	d. In the **Password** textbox, type the password of user.

	e. Click **Create user**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to JIRA SAML SSO by Microsoft (V5.2).

![Assign the user role][200]

**To assign Britta Simon to JIRA SAML SSO by Microsoft (V5.2), perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201]

2. In the applications list, select **JIRA SAML SSO by Microsoft (V5.2)**.

	![The JIRA SAML SSO by Microsoft (V5.2) link in the Applications list](./media/jira52microsoft-tutorial/tutorial_singlesign-onforjira5.2_app.png)

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the JIRA SAML SSO by Microsoft (V5.2) tile in the Access Panel, you should get automatically signed-on to your JIRA SAML SSO by Microsoft (V5.2) application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/msaadssojira5.2-tutorial/tutorial_general_01.png
[2]: ./media/msaadssojira5.2-tutorial/tutorial_general_02.png
[3]: ./media/msaadssojira5.2-tutorial/tutorial_general_03.png
[4]: ./media/msaadssojira5.2-tutorial/tutorial_general_04.png

[100]: ./media/msaadssojira5.2-tutorial/tutorial_general_100.png

[200]: ./media/msaadssojira5.2-tutorial/tutorial_general_200.png
[201]: ./media/msaadssojira5.2-tutorial/tutorial_general_201.png
[202]: ./media/msaadssojira5.2-tutorial/tutorial_general_202.png
[203]: ./media/msaadssojira5.2-tutorial/tutorial_general_203.png