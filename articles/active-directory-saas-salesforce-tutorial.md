<properties
   pageTitle="Tutorial: Integrating Salesforce with Azure Active Directory | Microsoft Azure"
   description="TODO"
   services="active-directory"
   documentationCenter=""
   authors="liviodlc"
   manager="TerryLanfear"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/07/2015"
   ms.author="liviodlc"/>

#Tutorial: How to integrate Salesforce with Azure Active Directory

This tutorial will help you get started with using Salesforce with Azure Active Directory.

##Prerequisites

1. To access Azure Active Directory through the [Azure Management Portal](https://manage.windowsazure.com), you must first have a valid Azure subscription.

2. You must have a valid tenant in [Salesforce.com](https://www.salesforce.com/).

> [AZURE.WARNING] If you are following this tutorial with a Salesforce.com trial account, then you will be unable to configure automated user provisioning. Trial accounts do not have the necessary API access enabled until they are purchased.
> 
> You can get around this limitation by using a [free developer account](https://developer.salesforce.com/signup) to complete this tutorial.

##Video Tutorials

You can follow this tutorial using the following videos:

-  [Integrating Salesforce with Azure AD: How to enable Single Sign-On (1/2)](http://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Integrating-Salesforce-with-Azure-AD-How-to-enable-Single-Sign-On-12)
- [Integrating Salesforce with Azure AD: How to automate User Provisioning (2/2)](http://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Integrating-Salesforce-with-Azure-AD-How-to-automate-User-Provisioning-22) 

##Step 1: Add Salesforce to your Directory

1. In the (Azure Management Portal)[https://manage.windowsazure.com], on the left navigation pane, click **Active Directory**.

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

##Step 2: Enable Single Sign-On

1. Before you can configure single sign-on, you must set up and deploy a custom domain for your Salesforce environment. For instructions on how to do that, see [Set Up a Domain Name](https://help.salesforce.com/HTViewHelpDoc?id=domain_name_setup.htm&language=en_US).

2. On Salesforce's Quick Start page in Azure AD, click the **Configure single sign-on** button.

	![The configure single sign-on button][6]

3. A dialog will open and you'll see a screen that asks "How would you like users to sign on to Salesforce?" Select **Windows Azure AD Single Sign-On**, and then click **Next**.

	![Select Windows Azure AD Single Sign-On][7]

	> [AZURE.NOTE] To learn more about about the different single sign-on options, [click here](https://msdn.microsoft.com/en-us/library/azure/dn308588.aspx)

4. On the **Configure App Settings** page, fill out the **Sign On URL** by typing in your Salesforce domain URL using the following format:
 - Enterprise account: `https://<domain>.my.salesforce.com`
 - Developer account: `https://<domain>-dev-ed.my.salesforce.com` 

	![Type in your Sign On URL][8]

5. On the **Configure single sign-on at Salesforce** page, click on **Download certificate**, and then save the certificate file locally on your computer.

	![Download certificate][9]

6. Open a new tab in your browser and log in to your Salesforce account as an administrator.

7. Under the **Administrator** navigation pane, click **Security Controls** to expand the related section. Then click on **Single Sign-On Settings**.

	![Click on Single Sign-On Settings under Security Controls][10]

8. On the **Single Sign-On Settings** page, click the **Edit** button.

	![Click the Edit button][11]

9. Select **SAML Enabled**, and then click **Save**.

	![Select SAML Enabled][12]

10. To configure your SAML single sign-on settings, click **New**.

	![Select SAML Enabled][13]

11. On the **SAML Single Sign-On Setting Edit** page, make the following configurations:

	![Screenshot of the configurations that you should make][14]

 - For the **Name** field, type in a friendly name for this configuration. Providing a value for **Name** does automatically populate the **API Name** textbox.
 - In Azure AD, copy the **Issuer URL** value, and then paste it into the **Issuer** textbox in Salesforce.
 - In the Entity Id textbox, type your Salesforce domain name using the following pattern:
     - Enterprise account: `https://<domain>.my.salesforce.com`
     - Developer account: `https://<domain>-dev-ed.my.salesforce.com`
 - Click **Browse** to open the **Choose File to Upload** dialog, select your Salesforce certificate, and the 

	> [AZURE.WARNING] In order to be able to configure single sign-on on your Salesforce environment, you need to first contact the Salesforce Support to get this feature enabled.

##Step 3: Enable Automated User Provisioning

stuff

##Step 4: Assign Users to Salesforce

stuff

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
