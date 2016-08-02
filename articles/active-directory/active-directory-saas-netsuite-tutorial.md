<properties
    pageTitle="Tutorial: Azure Active Directory integration with NetSuite | Microsoft Azure"
    description="Learn how to use NetSuite with Azure Active Directory to enable single sign-on, automated  provisioning, and more!"
    services="active-directory"
    documentationCenter=""
    authors="asmalser-msft"
    manager="stevenpo"
    editor=""/>

<tags
    ms.service="active-directory"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity"
    ms.date="05/16/2016"
    ms.author="asmalser-msft"/>

#Tutorial: How to integrate NetSuite with Azure Active Directory

This tutorial will show you how to connect your NetSuite environment to your Azure Active Directory (Azure AD). You will learn how to configure single sign-on to NetSuite, how to enable automated user provisioning, and how to assign users to have access to NetSuite. 

##Prerequisites

1. To access Azure Active Directory through the [Azure classic portal](https://manage.windowsazure.com), you must first have a valid Azure subscription.

2. You must have admin access to a [NetSuite](http://www.netsuite.com/portal/home.shtml) subscription. You may use a free trial account for either service.

##Step 1: Add NetSuite to your Directory

1. In the [Azure classic portal](https://manage.windowsazure.com), on the left navigation pane, click **Active Directory**.

	![Select Active Directory from the left navigation pane.][0]

2. From the **Directory** list, select the directory that you would like to add NetSuite to.

3. Click on **Applications** in the top menu.

	![Click on Applications.][1]

4. Click **Add** at the bottom of the page.

	![Click Add to add a new application.][2]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Click Add an application from the gallery.][3]

6. In the **search box**, type **NetSuite**. Then select **NetSuite** from the results, and click **Complete** to add the application.

	![Add NetSuite.][4]

7. You should now see the Quick Start page for NetSuite:

	![NetSuite's Quick Start page in Azure AD][5]

##Step 2: Enable Single Sign-On

1. In Azure AD, on the Quick Start page for NetSuite, click the **Configure single sign-on** button.

	![The configure single sign-on button][6]

2. A dialog will open and you'll see a screen that asks "How would you like users to sign on to NetSuite?" Select **Azure AD Single Sign-On**, and then click **Next**.

	![Select Azure AD Single Sign-On][7]

	> [AZURE.NOTE] To learn more about about the different single sign-on options, [click here](../active-directory-appssoaccess-whatis/#how-does-single-sign-on-with-azure-active-directory-work)

3. On the **Configure App Settings** page, for the **Reply URL** field, type in your NetSuite tenant URL using one of the following formats:
	- `https://<tenant-name>.netsuite.com/saml2/acs`
	- `https://<tenant-name>.na1.netsuite.com/saml2/acs`
	- `https://<tenant-name>.na2.netsuite.com/saml2/acs`
	- `https://<tenant-name>.sandbox.netsuite.com/saml2/acs`
	- `https://<tenant-name>.na1.sandbox.netsuite.com/saml2/acs`
	- `https://<tenant-name>.na2.sandbox.netsuite.com/saml2/acs`

	![Type in your tenant URL][8]

4. On the **Configure single sign-on at NetSuite** page, click on **Download metadata**, and then save the certificate file locally on your computer.

	![Download the metadata.][9]

5. Open a new tab in your browser, and sign into your Netsuite company site as an administrator.

6. In the toolbar at the top of the page, click **Setup**, then click **Setup Manager**.

	![Go to Setup Manager][10]

7. From the **Setup Tasks** list, select **Integration**.

	![Go to Integration][11]

8. In the **Manage Authentication** section, click **SAML Single Sign-on**.

	![Go to SAML Single Sign-on][12]

9. On the **SAML Setup** page, perform the following steps:

	- In Azure Active Directory, copy the **Remote Login URL** value and paste it into the **Identity Provider Login Page** field in NetSuite.

		![The SAML Setup page.][13]

	- In NetSuite, select **Primary Authentication Method**.

	- For the field labeled **SAMLV2 Identity Provider Metadata**, select **Upload IDP Metadata File**. Then click **Browse** to upload the metadata file that you downloaded in step #4.

		![Upload the metadata][16]

	- Click **Submit**.

9. In Azure AD, select the single sign-on configuration confirmation checkbox to enable the certificate that you uploaded to NetSuite. Then click **Next**.

	![Check the confirmation checkbox][14]

10. On the final page of the dialog, type in an email address if you would like to receive email notifications for errors and warnings related to the maintenance of this single sign-on configuration. 

	![Type in your email address.][15]

11. Click **Complete** to close the dialog. Next, click on **Attributes** at the top of the page.

	![Click on Attributes.][17]

12. Click on **Add User Attribute**.

	![Click on Add User Attribute.][18]

13. For the **Attribute Name** field, type in `account`. For the **Attribute Value** field, type in your NetSuite account ID. Instructions on how to find your account ID are included below:

	![Add your NetSuite Account ID.][19]

	- In NetSuite, click on **Setup** from the top navigation menu.
	- Then click under the **Setup Tasks** section of the left navigation menu, select the **Integration** section, and click on **Web Services Preferences**.
	- Copy your NetSuite Account ID and paste it into the **Attribute Value** field in Azure AD.

		![Get your account ID][20]

14. In Azure AD, click **Complete** to finish adding the SAML attribute. Then click **Apply Changes** on the bottom menu.

	![Save your changes.][21]

15. Before users can perform single sign-on into NetSuite, they must first be assigned the appropriate permissions in NetSuite. Follow the instructions below to assign these permissions.

	- On the top navigation menu, click **Setup**, then click **Setup Manager**.

		![Go to Setup Manager][10]

	- On the left navigation menu, select **Users/Roles**, then click **Manage Roles**.

		![Go to Manage Roles][22]

	- Click **New Role**.

	- Type in a **Name** for you new role, and select the **Single Sign-On Only** checkbox.

		![Name the new role.][23]

	- Click **Save**.

	- In the menu on the top, click **Permissions**. Then click **Setup**.

		![Go to Permissions][24]

	- Select **Set Up SAM Single Sign-on**, and then click **Add**.

	- Click **Save**.

	- On the top navigation menu, click **Setup**, then click **Setup Manager**.

		![Go to Setup Manager][10]

	- On the left navigation menu, select **Users/Roles**, then click **Manage Users**.

		![Go to Manage Users][25]

	- Select a test user. Then click **Edit**.

		![Go to Manage Users][26]

	- On the Roles dialog, select the role that you have created and click **Add**.

		![Go to Manage Users][27]

	- Click **Save**.

19. To test your configuration, see the section below titled [Assign Users to NetSuite](#step-4-assign-users-to-netsuite).

##Step 3: Enable Automated User Provisioning

> [AZURE.NOTE] By default, your provisioned users will be added to the root subsidiary of your NetSuite environment.

1. In Azure Active Directory, on the Quick Start page for NetSuite, click on **Configure user provisioning**.

	![Configure user provisioning][28]

2. In the dialog that opens, type in your admin credentials for NetSuite, then click **Next**.

	![Type in your NetSuite admin credentials.][29]

3. On the confirmation page, type in your email address to receive notifications of provisioning failures.

	![Confirm.][30]

4. Click **Complete** to close the dialog.

##Step 4: Assign Users to NetSuite

1. To test your configuration, start creating a new test account in the directory.

2. On the NetSuite Quick Start page, click on the **Assign Users** button.

	![Click on Assign Users][31]

3. Select your test user, and click the **Assign** button at the bottom of the screen:

 - If you haven't enable automated user provisioning, then you'll see the following prompt to confirm:

		![Confirm the assignment.][32]

 - If you have enabled automated user provisioning, then you'll see a prompt to define what type of role the user should have in NetSuite. Newly provisioned users should appear in your NetSuite environment after a few minutes.

4. To test your single sign-on settings, open the Access Panel at [https://myapps.microsoft.com](https://myapps.microsoft.com/), sign into the test account, and click on **NetSuite**.

##Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)

[0]: ./media/active-directory-saas-netsuite-tutorial/azure-active-directory.png
[1]: ./media/active-directory-saas-netsuite-tutorial/applications-tab.png
[2]: ./media/active-directory-saas-netsuite-tutorial/add-app.png
[3]: ./media/active-directory-saas-netsuite-tutorial/add-app-gallery.png
[4]: ./media/active-directory-saas-netsuite-tutorial/add-netsuite.png
[5]: ./media/active-directory-saas-netsuite-tutorial/quick-start-netsuite.png
[6]: ./media/active-directory-saas-netsuite-tutorial/config-sso.png
[7]: ./media/active-directory-saas-netsuite-tutorial/sso-netsuite.png
[8]: ./media/active-directory-saas-netsuite-tutorial/sso-config-netsuite.png
[9]: ./media/active-directory-saas-netsuite-tutorial/config-sso-netsuite.png
[10]: ./media/active-directory-saas-netsuite-tutorial/ns-setup.png
[11]: ./media/active-directory-saas-netsuite-tutorial/ns-integration.png
[12]: ./media/active-directory-saas-netsuite-tutorial/ns-saml.png
[13]: ./media/active-directory-saas-netsuite-tutorial/ns-saml-setup.png
[14]: ./media/active-directory-saas-netsuite-tutorial/ns-sso-confirm.png
[15]: ./media/active-directory-saas-netsuite-tutorial/sso-email.png
[16]: ./media/active-directory-saas-netsuite-tutorial/ns-sso-setup.png
[17]: ./media/active-directory-saas-netsuite-tutorial/ns-attributes.png
[18]: ./media/active-directory-saas-netsuite-tutorial/ns-add-attribute.png
[19]: ./media/active-directory-saas-netsuite-tutorial/ns-add-account.png
[20]: ./media/active-directory-saas-netsuite-tutorial/ns-account-id.png
[21]: ./media/active-directory-saas-netsuite-tutorial/ns-save-saml.png
[22]: ./media/active-directory-saas-netsuite-tutorial/ns-manage-roles.png
[23]: ./media/active-directory-saas-netsuite-tutorial/ns-new-role.png
[24]: ./media/active-directory-saas-netsuite-tutorial/ns-sso.png
[25]: ./media/active-directory-saas-netsuite-tutorial/ns-manage-users.png
[26]: ./media/active-directory-saas-netsuite-tutorial/ns-edit-user.png
[27]: ./media/active-directory-saas-netsuite-tutorial/ns-add-role.png
[28]: ./media/active-directory-saas-netsuite-tutorial/netsuite-provisioning.png
[29]: ./media/active-directory-saas-netsuite-tutorial/ns-creds.png
[30]: ./media/active-directory-saas-netsuite-tutorial/ns-confirm.png
[31]: ./media/active-directory-saas-netsuite-tutorial/assign-users.png
[32]: ./media/active-directory-saas-netsuite-tutorial/assign-confirm.png
