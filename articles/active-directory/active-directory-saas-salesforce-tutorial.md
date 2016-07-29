<properties
    pageTitle="Tutorial: Azure Active Directory integration with Salesforce | Microsoft Azure"
    description="Learn how to use Salesforce with Azure Active Directory to enable single sign-on, automated provisioning, and more!"
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

#Tutorial: How to integrate Salesforce with Azure Active Directory

This tutorial will show you how to connect your Salesforce environment to your Azure Active Directory. You will learn how to configure single sign-on to Salesforce, how to enable automated user provisioning, and how to assign users to have access to Salesforce.

##Prerequisites

1. To access Azure Active Directory through the [Azure classic portal](https://manage.windowsazure.com), you must first have a valid Azure subscription.

2. You must have a valid tenant in [Salesforce.com](https://www.salesforce.com/).

> [AZURE.IMPORTANT] If you are using a Salesforce.com **trial** account, then you will be unable to configure automated user provisioning. Trial accounts do not have the necessary API access enabled until they are purchased.
> 
> You can get around this limitation by using a [free developer account](https://developer.salesforce.com/signup) to complete this tutorial.

If you are using a Salesforce Sandbox environment, please see the [Salesforce Sandbox integration tutorial](https://go.microsoft.com/fwLink/?LinkID=521879).

##Video tutorials

You may follow this tutorial using the videos below.

**Video Tutorial Part One: How to Enable Single Sign-On**

> [AZURE.VIDEO integrating-salesforce-with-azure-ad-how-to-enable-single-sign-on]

**Video Tutorial Part Two: How to Automate User Provisioning**

> [AZURE.VIDEO integrating-salesforce-with-azure-ad-how-to-automate-user-provisioning]

##Step 1: Add Salesforce to your directory

1. In the [Azure classic portal](https://manage.windowsazure.com), on the left navigation pane, click **Active Directory**.

	![Select Active Directory from the left navigation pane.][0]

2. From the **Directory** list, select the directory that you would like to add Salesforce to.

3. Click on **Applications** in the top menu.

	![Click on Applications.][1]

4. Click **Add** at the bottom of the page.

	![Click Add to add a new application.][2]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Click Add an application from the gallery.][3]

6. In the **search box**, type **Salesforce**. Then select **Salesforce** from the results, and click **Complete** to add the application.

	![Add Salesforce.][4]

7. You should now see the Quick Start page for Salesforce:

	![Salesforce's Quick Start page in Azure AD][5]

##Step 2: Enable single sign-on

1. Before you can configure single sign-on, you must set up and deploy a custom domain for your Salesforce environment. For instructions on how to do that, see [Set Up a Domain Name](https://help.salesforce.com/HTViewHelpDoc?id=domain_name_setup.htm&language=en_US).

2. On Salesforce's Quick Start page in Azure AD, click the **Configure single sign-on** button.

	![The configure single sign-on button][6]

3. A dialog will open and you'll see a screen that asks "How would you like users to sign on to Salesforce?" Select **Azure AD Single Sign-On**, and then click **Next**.

	![Select Azure AD Single Sign-On][7]

	> [AZURE.NOTE] To learn more about about the different single sign-on options, [click here](../active-directory-appssoaccess-whatis.md#how-does-single-sign-on-with-azure-active-directory-work)

4. On the **Configure App Settings** page, fill out the **Sign On URL** by typing in your Salesforce domain URL using the following format:
 - Enterprise account: `https://<domain>.my.salesforce.com`
 - Developer account: `https://<domain>-dev-ed.my.salesforce.com` 

	![Type in your Sign On URL][8]

5. On the **Configure single sign-on at Salesforce** page, click on **Download certificate**, and then save the certificate file locally on your computer.

	![Download certificate][9]

6. Open a new tab in your browser and log in to your Salesforce administrator account.

7. Under the **Administrator** navigation pane, click **Security Controls** to expand the related section. Then click on **Single Sign-On Settings**.

	![Click on Single Sign-On Settings under Security Controls][10]

8. On the **Single Sign-On Settings** page, click the **Edit** button.

	![Click the Edit button][11]

	> [AZURE.NOTE] If you are unable to enable Single Sign-On settings for your Salesforce account, you may need to contact Salesforce's support in order to have the feature enabled for you.

9. Select **SAML Enabled**, and then click **Save**.

	![Select SAML Enabled][12]

10. To configure your SAML single sign-on settings, click **New**.

	![Select SAML Enabled][13]

11. On the **SAML Single Sign-On Setting Edit** page, make the following configurations:

	![Screenshot of the configurations that you should make][14]

 - For the **Name** field, type in a friendly name for this configuration. Providing a value for **Name** automatically populate the **API Name** textbox.

 - In Azure AD, copy the **Issuer URL** value, and then paste it into the **Issuer** field in Salesforce.

 - In the **Entity Id textbox**, type your Salesforce domain name using the following pattern:
     - Enterprise account: `https://<domain>.my.salesforce.com`
     - Developer account: `https://<domain>-dev-ed.my.salesforce.com`

 - Click **Browse** or **Choose File** to open the **Choose File to Upload** dialog, select your Salesforce certificate, and then click **Open** to upload the certificate.

 - For **SAML Identity Type**, select **Assertion contains User's salesforce.com username**.

 - For **SAML Identity Location**, select **Identity is in the NameIdentifier element of the Subject statement**

 - In Azure AD, copy the **Remote Login URL** value, and then paste it into the **Identity Provider Login URL** field in Salesforce.

 - For **Service Provider Initiated Request Binding**, select **HTTP Redirect**.

 - Finally, click **Save** to apply your SAML single sign-on settings.

12. On the left navigation pane in Salesforce, click **Domain Management** to expand the related section, and then click **My Domain**.

	![Click on My Domain][15]

13. Scroll down to the **Authentication Configuration** section, and click the **Edit** button.

	![Click the Edit button][16]

14. In the **Authentication Service** section, select the friendly name of your SAML SSO configuration, and then click **Save**.

	![Select your SSO configuration][17]

	> [AZURE.NOTE] If more than one authentication service is selected, then when users attempt to initiate single sign-on to your Salesforce environment, they will be prompted to select which authentication service they would like to sign in with. If you don’t want this to happen, then you should **leave all other authentication services unchecked**.

15. In Azure AD, select the single sign-on configuration confirmation checkbox to enable the certificate that you uploaded to Salesforce. Then click **Next**.

	![Check the confirmation checkbox][18]

16. On the final page of the dialog, type in an email address if you would like to receive email notifications for errors and warnings related to the maintenance of this single sign-on configuration. 

	![Type in your email address.][19]

17. Click **Complete** to close the dialog. To test your configuration, see the section below titled [Assign Users to Salesforce](#step-4-assign-users-to-salesforce).

##Step 3: Enable automated user provisioning

1. In the Azure AD Quick Start page for Salesforce, click on the **Configure user provisioning** button.

	![Click the Configure User Provisioning button][20]

2. In the **Configure user provisioning** dialog, type in your Salesforce admin username and password.

	![Type in your admin username or password][21]

	> [AZURE.NOTE] If you are configuring a production environment, the best practice is to create a new admin account in Salesforce specifically for this step. This account must have the **System Administrator** profile assigned to it in Salesforce.

3. To get your Salesforce security token, open a new tab and sign into the same Salesforce admin account. On the top right corner of the page, click on your name, and then click on **My Settings**.

	![Click on your name, then click on My Settings][22]

4. On the left navigation pane, click on **Personal** to expand the related section, and then click on **Reset My Security Token**.

	![Click on your name, then click on My Settings][23]

5. On the **Reset My Security Token** page, click on the **Reset Security Token** button.

	![Read the warnings.][24]

6. Check the email inbox associated with this admin account. Look for an email from Salesforce.com that contains the new security token.

7. Copy the token, go to your Azure AD window, and paste it into the **User Security Token** field. Then click **Next**.

	![Paste in the security token][25]

8. On the confirmation page, you can choose to receive email notifications for when provisioning failures occur. Click **Complete** to close the dialog.

	![Type in your email address to receive notifications][26]

##Step 4: Assign users to Salesforce

1. To test your configuration, start by creating a new test account in the directory.

2. On the Salesforce Quick Start page, click on the **Assign Users** button.

	![Click on Assign Users][27]

3. Select your test user, and click the **Assign** button at the bottom of the screen:

 - If you haven't enable automated user provisioning, then you'll see the following prompt to confirm:

		![Confirm the assignment.][28]

 - If you have enabled automated user provisioning, then you'll see a prompt to define what type of Salesforce profile the user should have. Newly provisioned users should appear in your Salesforce environment after a few minutes.

		![Confirm the assignment.][29]

		> [AZURE.IMPORTANT] If you are provisioning to a Salesforce **developer** environment, you will have a very limited number of licenses available for each profile. Therefore, it's best to provision users to the **Chatter Free User** profile, which has 4,999 licenses available.

4. To test your single sign-on settings, open the Access Panel at [https://myapps.microsoft.com](https://myapps.microsoft.com/), then sign into the test account, and click on **Salesforce**.

##Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)

[0]: ./media/active-directory-saas-salesforce-tutorial/azure-active-directory.png
[1]: ./media/active-directory-saas-salesforce-tutorial/applications-tab.png
[2]: ./media/active-directory-saas-salesforce-tutorial/add-app.png
[3]: ./media/active-directory-saas-salesforce-tutorial/add-app-gallery.png
[4]: ./media/active-directory-saas-salesforce-tutorial/add-salesforce.png
[5]: ./media/active-directory-saas-salesforce-tutorial/salesforce-added.png
[6]: ./media/active-directory-saas-salesforce-tutorial/config-sso.png
[7]: ./media/active-directory-saas-salesforce-tutorial/select-azure-ad-sso.png
[8]: ./media/active-directory-saas-salesforce-tutorial/config-app-settings.png
[9]: ./media/active-directory-saas-salesforce-tutorial/download-certificate.png
[10]: ./media/active-directory-saas-salesforce-tutorial/sf-admin-sso.png
[11]: ./media/active-directory-saas-salesforce-tutorial/sf-admin-sso-edit.png
[12]: ./media/active-directory-saas-salesforce-tutorial/sf-enable-saml.png
[13]: ./media/active-directory-saas-salesforce-tutorial/sf-admin-sso-new.png
[14]: ./media/active-directory-saas-salesforce-tutorial/sf-saml-config.png
[15]: ./media/active-directory-saas-salesforce-tutorial/sf-my-domain.png
[16]: ./media/active-directory-saas-salesforce-tutorial/sf-edit-auth-config.png
[17]: ./media/active-directory-saas-salesforce-tutorial/sf-auth-config.png
[18]: ./media/active-directory-saas-salesforce-tutorial/sso-confirm.png
[19]: ./media/active-directory-saas-salesforce-tutorial/sso-notification.png
[20]: ./media/active-directory-saas-salesforce-tutorial/config-prov.png
[21]: ./media/active-directory-saas-salesforce-tutorial/config-prov-dialog.png
[22]: ./media/active-directory-saas-salesforce-tutorial/sf-my-settings.png
[23]: ./media/active-directory-saas-salesforce-tutorial/sf-personal-reset.png
[24]: ./media/active-directory-saas-salesforce-tutorial/sf-reset-token.png
[25]: ./media/active-directory-saas-salesforce-tutorial/got-the-token.png
[26]: ./media/active-directory-saas-salesforce-tutorial/prov-confirm.png
[27]: ./media/active-directory-saas-salesforce-tutorial/assign-users.png
[28]: ./media/active-directory-saas-salesforce-tutorial/assign-confirm.png
[29]: ./media/active-directory-saas-salesforce-tutorial/assign-sf-profile.png