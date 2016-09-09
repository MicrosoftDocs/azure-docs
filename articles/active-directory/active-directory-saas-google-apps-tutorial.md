<properties
    pageTitle="Tutorial: Azure Active Directory integration with Google Apps | Microsoft Azure"
    description="Learn how to use Google Apps with Azure Active Directory to enable single sign-on, automated provisioning, and more!"
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

#Tutorial: How to integrate Google Apps with Azure Active Directory

This tutorial will show you how to connect your Google Apps environment to your Azure Active Directory (Azure AD). You will learn how to configure single sign-on to Google Apps, how to enable automated user provisioning, and how to assign users to have access to Google Apps. 

##Prerequisites

1. To access Azure Active Directory through the [Azure classic portal](https://manage.windowsazure.com), you must first have a valid Azure subscription.

2. You must have a valid tenant for [Google Apps for Work](https://www.google.com/work/apps/) or [Google Apps for Education](https://www.google.com/edu/products/productivity-tools/). You may use a free trial account for either service.

##Video tutorial

How to Enable Single Sign-On to Google Apps in 2 Minutes:

> [AZURE.VIDEO enable-single-sign-on-to-google-apps-in-2-minutes-with-azure-ad]

##Frequently Asked Questions

1. **Q: Are Chromebooks and other Chrome devices compatible with Azure AD single sign-on?**

	A: Yes, users will be able to sign into their Chromebook devices using their Azure AD credentials. See this [Google Apps support article](https://support.google.com/chrome/a/answer/6060880) for information on why users may get prompted for credentials twice.

2. **Q: If I enable single sign-on, will users be able to use their Azure AD credentials to sign into any Google product, such as Google Classroom, GMail, Google Drive, YouTube, etc?**

	A: Yes, depending on [which Google apps](https://support.google.com/a/answer/182442?hl=en&ref_topic=1227583) you choose to enable or disable for your organization.

3. **Q: Can I enable single sign-on for only a subset of my Google Apps users?**

	A: No, turning on single sign-on will immediately require all of your Google Apps users to authenticate with their Azure AD credentials. Because Google Apps doesn't support having multiple identity providers, the identity provider for your Google Apps environment can either be Azure AD or Google -- but not both at the same time.

4. **Q: If a user is signed in through Windows, will they automatically authenticate to Google Apps without getting prompted for a password?**

	A: There are two options for enabling this scenario. First, users could sign into Windows 10 devices via [Azure Active Directory Join](active-directory-azureadjoin-overview.md). Alternatively, users could sign into Windows devices that are domain-joined to an on-premises Active Directory that has been enabled for single sign-on to Azure AD via an [Active Directory Federation Services (AD FS)](active-directory-aadconnect-user-signin.md) deployment. Of course, both options require that you follow the tutorial below to enable single sign-on between Azure AD and Google Apps.

##Step 1: Add Google Apps to your Directory

1. In the [Azure classic portal](https://manage.windowsazure.com), on the left navigation pane, click **Active Directory**.

	![Select Active Directory from the left navigation pane.][0]

2. From the **Directory** list, select the directory that you would like to add Google Apps to.

3. Click on **Applications** in the top menu.

	![Click on Applications.][1]

4. Click **Add** at the bottom of the page.

	![Click Add to add a new application.][2]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Click Add an application from the gallery.][3]

6. In the **search box**, type **Google Apps**. Then select **Google Apps** from the results, and click **Complete** to add the application.

	![Add Google Apps.][4]

7. You should now see the Quick Start page for Google Apps:

	![Google Apps' Quick Start page in Azure AD][5]

##Step 2: Enable Single Sign-On

1. In Azure AD, on the Quick Start page for Google Apps, click the **Configure single sign-on** button.

	![The configure single sign-on button][6]

2. A dialog will open and you'll see a screen that asks "How would you like users to sign on to Google Apps?" Select **Azure AD Single Sign-On**, and then click **Next**.

	![Select Azure AD Single Sign-On][7]

	> [AZURE.NOTE] To learn more about about the different single sign-on options, [click here](../active-directory-appssoaccess-whatis.md#how-does-single-sign-on-with-azure-active-directory-work)

3. On the **Configure App Settings** page, for the **Sign On URL** field, type in your Google Apps tenant URL using the following format: `https://mail.google.com/a/<yourdomain>`

	![Type in your tenant URL][8]

4. On the **Auto configure single sign-on** page, type in the domain for your Google Apps tenant. Then press the **Configure** button.

	![Type in your domain name and press Configure.](./media/active-directory-saas-google-apps-tutorial/ga-auto-config.png)

	> [AZURE.NOTE] If you prefer to configure single sign-on manually, see [Optional Step: Manually Configure Single Sign-On](#optional-step-manually-configure-single-sign-on)

5. Sign into your Google Apps admin account. Then click **Allow** in order to permit Azure Active Directory to make configuration changes in your Google Apps subscription.

	![Type in your domain name and press Configure.](./media/active-directory-saas-google-apps-tutorial/ga-consent.PNG)

6. Wait a few seconds while Azure Active Directory configures your Google Apps tenant. Once it completes, click **Next**.

10. On the final page of the dialog, type in an email address if you would like to receive email notifications for errors and warnings related to the maintenance of this single sign-on configuration.

	![Type in your email address.][14]

11. Click **Complete** to close the dialog. To test your configuration, see the section below titled [Assign Users to Google Apps](#step-4-assign-users-to-google-apps).

##Optional Step: Manually Configure Single Sign-On

If you prefer to set up single sign-on manually, complete the following steps:

1. In Azure AD, on the Quick Start page for Google Apps, click the **Configure single sign-on** button.

	![The configure single sign-on button][6]

2. A dialog will open and you'll see a screen that asks "How would you like users to sign on to Google Apps?" Select **Azure AD Single Sign-On**, and then click **Next**.

	![Select Azure AD Single Sign-On][7]

	> [AZURE.NOTE] To learn more about about the different single sign-on options, [click here](../active-directory-appssoaccess-whatis.md#how-does-single-sign-on-with-azure-active-directory-work)

3. On the **Configure App Settings** page, for the **Sign On URL** field, type in your Google Apps tenant URL using the following format: `https://mail.google.com/a/<yourdomain>`

	![Type in your tenant URL][8]

4. On the **Auto configure single sign-on** page, select the checkbox labeled **Manually configure this application for single sign-on**. Then click **Next**.

	![Choose manual configuration.](./media/active-directory-saas-google-apps-tutorial/ga-auto-skip.PNG)

4. On the **Configure single sign-on at Google Apps** page, click on **Download certificate**, and then save the certificate file locally on your computer.

	![Download the certificate.][9]

5. Open a new tab in your browser, and sign into the [Google Apps Admin Console](http://admin.google.com/) using your administrator account.

6. Click **Security**. If you don't see the link, it may be hidden under the **More Controls** menu at the bottom of the screen.

	![Click Security.][10]

7. On the **Security** page, click **Set up single sign-on (SSO).**

	![Click SSO.][11]

8. Perform the following configuration changes:

	![Configure SSO][12]

	- Select **Setup SSO with third party identity provider**.

	- In Azure AD, copy the **Single sign-on service URL**, and paste it into the **Sign-in page URL** field in Google Apps.

	- In Azure AD, copy the **Single sign-out service URL**, and paste it into the **Sign-out page URL** field in Google Apps.

	- In Azure AD, copy the **Change password URL**, and paste it into the **Change password URL** field in Google Apps.

	- In Google Apps, for the **Verification certificate**, upload the certificate that you downloaded in step #4.

	- Click **Save Changes**.

9. In Azure AD, select the single sign-on configuration confirmation checkbox to enable the certificate that you uploaded to Google Apps. Then click **Next**.

	![Check the confirmation checkbox][13]

10. On the final page of the dialog, type in an email address if you would like to receive email notifications for errors and warnings related to the maintenance of this single sign-on configuration. 

	![Type in your email address.][14]

11. Click **Complete** to close the dialog. To test your configuration, see the section below titled [Assign Users to Google Apps](#step-4-assign-users-to-google-apps).

##Step 3: Enable Automated User Provisioning

> [AZURE.NOTE] Another viable option for automating user provisioning to Google Apps is to use [Google Apps Directory Sync (GADS)](https://support.google.com/a/answer/106368?hl=en) which provisions your on-premises Active Directory identities to Google Apps. In contrast, the solution in this tutorial provisions your Azure Active Directory (cloud) users and mail-enabled groups to Google Apps.

1. Sign into the [Google Apps Admin Console](http://admin.google.com/) using your administrator account, and click **Security**. If you don't see the link, it may be hidden under the **More Controls** menu at the bottom of the screen.

	![Click Security.][10]

2. On the **Security** page, click **API Reference**.

	![Click API Reference.][15]

3. Select **Enable API access**.

	![Click API Reference.][16]

	> [AZURE.IMPORTANT] For every user that you intend to provision to Google Apps, their username in Azure Active Directory *must* be tied to a custom domain. For example, usernames that look like bob@contoso.onmicrosoft.com will not be accepted by Google Apps, whereas bob@contoso.com will be accepted. You can change an existing user's domain by editing their properties in Azure AD. Instructions for how to set a custom domain for both Azure Active Directory and Google Apps are included below.

4. If you haven't added a custom domain name to your Azure Active Directory yet, then follow the steps below:

	- In the [Azure classic portal](https://manage.windowsazure.com), on the left navigation pane, click **Active Directory**. In the directory list, select your directory. 

	- Click on **Domains** from the top-level menu, and then click on **Add a custom domain**.

		![Add a Custom Domain][17]

	- Type your domain name into the **Domain name** field. This should be the same domain name that you intend to use for Google Apps. When ready, click the **Add** button.

		![Type in your domain name.][18]

	- Click **Next** to go to the verification page. To verify that you own this domain, you must edit the domain's DNS records according to the values provided on this page. You may choose to verify using either **MX records** or **TXT records**, depending on what you select for the **Record Type** option. For more comprehensive instructions on how to verify domain name with Azure AD, see [Add your own domain name to Azure AD](https://go.microsoft.com/fwLink/?LinkID=278919&clcid=0x409).

		![Verify your domain name.][19]

	- Repeat the above steps for all of the domains that you intend to add to your directory.

5. Now that you have verified all of your domains with Azure AD, you must now verify them again with Google Apps. For each domain that isn't already registered with Google Apps, perform the following steps:

	- In the [Google Apps Admin Console](http://admin.google.com/), click on **Domains**.

		![Click on Domains][20]

	- Click **Add a domain or a domain alias**.

		![Add a new domain][21]

	- Select **Add another domain**, and type in the name of the domain that you would like to add.

		![Type in your domain name][22]

	- Click on **Continue and verify domain ownership**. Then follow the steps to verify that you own the domain name. For comprehensive instructions on how to verify your domain with Google Apps, see [Verify your site ownership with Google Apps](https://support.google.com/webmasters/answer/35179).

	- Repeat the above steps for any additional domains that you intend to add to Google Apps.

	> [AZURE.WARNING] If you change the primary domain for your Google Apps tenant, and if you have already configured single sign-on with Azure AD, then you will have to repeat step #3 under [Step Two: Enable Single Sign-On](#step-two-enable-single-sign-on).

6. In the [Google Apps Admin Console](http://admin.google.com/), click on **Admin Roles**.

	![Click on Google Apps][26]

7. Determine which admin account you would like to use to manage user provisioning. For the **admin role** of that account, edit the **Privileges** for that role. Make sure it has all of the **Admin API Privileges** enabled so that this account can be used for provisioning.

	![Click on Google Apps][27]

	> [AZURE.NOTE] If you are configuring a production environment, the best practice is to create a new admin account in Google Apps specifically for this step. These account must have an admin role associated with it that has the necessary API privileges.

8. In Azure Active Directory, click on **Applications** in the top-level menu, and then click on **Google Apps**.

	![Click on Google Apps][23]

9. On the Quick Start page for Google Apps, click on **Configure user provisioning**.

	![Configure user provisioning][24]

10. In the dialog that opens, click on **enable user provisioning** to authenticate into the Google Apps Admin Account that you would like to use to manage provisioning.

	![Enable provisioning][25]

11. Confirm that you would like to give Azure Active Directory permission to make changes to your Google Apps tenant.

	![Confirm permissions.][28]

12. Click **Complete** to close the dialog.

##Step 4: Assign Users to Google Apps

1. To test your configuration, start creating a new test account in the directory.

2. On the Google Apps Quick Start page, click on the **Assign Users** button.

	![Click on Assign Users][29]

3. Select your test user, and click the **Assign** button at the bottom of the screen:

 - If you haven't enable automated user provisioning, then you'll see the following prompt to confirm:

		![Confirm the assignment.][30]

 - If you have enabled automated user provisioning, then you'll see a prompt to define what type of role the user should have in Google Apps. Newly provisioned users should appear in your Google Apps environment after a few minutes.

4. To test your single sign-on settings, open the Access Panel at [https://myapps.microsoft.com](https://myapps.microsoft.com/), then sign into the test account, and click on **Google Apps**.

## Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)

[0]: ./media/active-directory-saas-google-apps-tutorial/azure-active-directory.png
[1]: ./media/active-directory-saas-google-apps-tutorial/applications-tab.png
[2]: ./media/active-directory-saas-google-apps-tutorial/add-app.png
[3]: ./media/active-directory-saas-google-apps-tutorial/add-app-gallery.png
[4]: ./media/active-directory-saas-google-apps-tutorial/add-gapps.png
[5]: ./media/active-directory-saas-google-apps-tutorial/gapps-added.png
[6]: ./media/active-directory-saas-google-apps-tutorial/config-sso.png
[7]: ./media/active-directory-saas-google-apps-tutorial/sso-gapps.png
[8]: ./media/active-directory-saas-google-apps-tutorial/sso-url.png
[9]: ./media/active-directory-saas-google-apps-tutorial/download-cert.png
[10]: ./media/active-directory-saas-google-apps-tutorial/gapps-security.png
[11]: ./media/active-directory-saas-google-apps-tutorial/security-gapps.png
[12]: ./media/active-directory-saas-google-apps-tutorial/gapps-sso-config.png
[13]: ./media/active-directory-saas-google-apps-tutorial/gapps-sso-confirm.png
[14]: ./media/active-directory-saas-google-apps-tutorial/gapps-sso-email.png
[15]: ./media/active-directory-saas-google-apps-tutorial/gapps-api.png
[16]: ./media/active-directory-saas-google-apps-tutorial/gapps-api-enabled.png
[17]: ./media/active-directory-saas-google-apps-tutorial/add-custom-domain.png
[18]: ./media/active-directory-saas-google-apps-tutorial/specify-domain.png
[19]: ./media/active-directory-saas-google-apps-tutorial/verify-domain.png
[20]: ./media/active-directory-saas-google-apps-tutorial/gapps-domains.png
[21]: ./media/active-directory-saas-google-apps-tutorial/gapps-add-domain.png
[22]: ./media/active-directory-saas-google-apps-tutorial/gapps-add-another.png
[23]: ./media/active-directory-saas-google-apps-tutorial/apps-gapps.png
[24]: ./media/active-directory-saas-google-apps-tutorial/gapps-provisioning.png
[25]: ./media/active-directory-saas-google-apps-tutorial/gapps-provisioning-auth.png
[26]: ./media/active-directory-saas-google-apps-tutorial/gapps-admin.png
[27]: ./media/active-directory-saas-google-apps-tutorial/gapps-admin-privileges.png
[28]: ./media/active-directory-saas-google-apps-tutorial/gapps-auth.png
[29]: ./media/active-directory-saas-google-apps-tutorial/assign-users.png
[30]: ./media/active-directory-saas-google-apps-tutorial/assign-confirm.png
