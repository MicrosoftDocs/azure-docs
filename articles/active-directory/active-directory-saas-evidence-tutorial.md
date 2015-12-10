<properties
	pageTitle="Tutorial: Azure Active Directory integration with Evidence.com | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and Evidence.com."
	services="active-directory"
	documentationCenter=""
	authors="asmalser-msft"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/10/2015"
	ms.author="asmalser"/>


# Tutorial: Azure Active Directory integration with Evidence.com

The objective of this tutorial is to show how to set up single sign-on between Azure Active Directory (AAD) and Evidence.com. The scenario outlined in this tutorial assumes that you already have the following items:
	
•	A valid Microsoft Azure subscription
•	An Evidence.com subscription with single sign On enabled (email earlyaccess@evidence.com if SAML-based single sign on is not enabled)

After completing this tutorial, the AAD users to whom you have assigned Evidence.com access will be able to single sign into the application using the AAD Access Panel.

## Add Evidence to your directory

This section outlines how to add Evidence.com as an integrated application in Azure Active Directory.

**To enable the application integration for Evidence:**

1.	In the [Azure clasic portal](https://manage.windowsazure.com), on the left navigation pane, click **Active Directory**.

2.	From the **Directory** list, select the directory for which you want to enable directory integration.

3.	To open the applications view, in the directory view, click **Applications** in the top menu.

4.	To open the Application Gallery, click **Add**, and then click **Add an application from the gallery**.

5.	In the search box, type **Evidence.com**.

6.	In the results pane, select **Evidence.com**, and then click **Complete** to add the application.


## Configuring single sign-on

This section outlines how to enable users to authenticate to Evidence.com with their account in Azure Active Directory, using federation based on the SAML protocol.

**To configure single sign-on, perform the following steps:**

1.	After adding Evidence.com in the Windows Azure management portal, click **Configure Single Sign-On**. 
 
2.	On the next screen, select **Azure AD Single Sign-On**, and then click **Next**.

3.	In the Configure App URL screen, enter the URL where users will sign into your Evidence.com tenant URL (Example: https://yourtenant.evidence.com  and then click **Next**. 

4.	Click the **Download Certificate** link, and save it to your local drive. This certificate and the metadata URLs (  Entity ID, SSO Sign In URL and Sign Out URL ) will be used to set up SSO on Evidence.com site. 

5.	In a separate web browser window, login to your Evidence.com tenant as an administrator and navigate to **Admin** Tab
      
a.	Click on **Agency Single Sign On**
 
b.	Select **SAML Based Single Sign On**
 
c.	Copy the **Issuer URL**, **Single Sign On** and **Single Sign Out** values shown in the Azure classic portal and to the corresponding fields in Evidence.com.

d.	Open the certificate downloaded in step 4 using a text editor like Notepad.exe, and copy and paste the contents into the **Security Certificate** box. 

e. Save the configuration in Evidence.com
 
6.	In the Azure classic portal, check **Confirm that you have configured single sign-on as described above**. Checking this will enable the current certificate to start working for this application checkbox.
 
7.	On the Single sign-on confirmation page, click **Complete**.  


## Creating an Evidence test user

For Azure AD users to be able to sign in, they must be provisioned for access inside the Evidence.com application. This section describes how to create Azure AD user accounts inside Evidence.com

**To provision a user account in Evidence.com:**

1.	In a web browser window, log into your Evidence.com company site as an administrator.

2.	Navigate to **Admin** tab.

3.	Click on **Add User**.

4.	Click the **Add** button.

5.  The **Email Address** of the added user must match the username of the users in Azure AD who you wish to give access. If the username and email address are not the same value in your organization, you can use the **Evidence.com > Attributes > Single Sign-On** section of the Azure classic portal to change the nameidenitifer sent to Evidence.com to be the email address.


## Assigning users to Evidence

For provisioned AAD users to be able to see Evidence.com on their Access Panel, they must be assigned access inside the Azure management portal.

**To assign users to Evidence: **

1.	On the quick start page for Evidence.com in the Azure classic portal, click **Assign users to Evidence**.
 
2.	In the **Show** menu, select whether you want to assign a user or a group to Evidence.com, and click the Checkmark button.
 
3.	In the **Users** list, select the users to group to whom you want to assign Evidence.com.
 
4.	In the page footer, click the **Assign** button.







































The objective of this tutorial is to show you how to integrate Facebook at Work with Azure Active Directory (Azure AD).<br>Integrating Facebook at Work with Azure AD provides you with the following benefits: 

- You can control in Azure AD who has access to Facebook at Work 
- You can automatically provision account for users who have been granted access to Facebook at Work
- You can enable your users to automatically get signed-on to Facebook at Work (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location 

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).


## Prerequisites 

To configure Azure AD integration with CS Stars, you need the following items:

- An Azure AD subscription
- Facebook at Work with single sign on enabled

To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/). 


## Adding Facebook at Work from the gallery
To configure the integration of Facebook at Work into Azure AD, you need to add Facebook at Work from the gallery to your list of managed SaaS apps.

**To add Facebook at Work from the gallery, perform the following steps:**

1. In the **Azure Management Portal**, on the left navigation pane, click **Active Directory**. 
<br><br>![Active Directory][1]<br>

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.
<br><br>![Applications][2]<br>

4. Click **Add** at the bottom of the page.
<br><br>![Applications][3]<br>

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.
<br><br>![Applications][4]<br>

6. In the search box, type **Facebook at Work**.

7. In the results pane, select **Facebook at Work**, and then click **Complete** to add the application.


### Configuring Azure AD Single Sign-On

This section outlines how to enable users to authenticate to Facebook at Work with their account in Azure Active Directory, using federation based on the SAML protocol.

**To configure Azure AD single sign-on with Facebook at Work, perform the following steps:**

1.	After adding Facebook at Work in the Azure management portal, click **Configure Single Sign-On**.

2.	In the **Configure App URL** screen, enter the URL where users will sign into your Facebook at Work application. This is your Facebook at Work tenant URL 
(Example: https://example.facebook.com/). Once finished, click **Next**.

3.	In a different web browser window, log into your Facebook at Work company site as an administrator.

4. Follow the instructions at the following URL to configure Facebook at Work to use Azure AD as an identity provider: [https://developers.facebook.com/docs/facebook-at-work/authentication/cloud-providers](https://developers.facebook.com/docs/facebook-at-work/authentication/cloud-providers)

5.	Once completed, return to the browser windows showing the Azure management portal, click the checkbox to confirm you have completed the procedure, then click **Next** and **Complete**.


## Automatically provisioning users to Facebook at Work

Azure AD supports the ability to automatically synchonize the account details of assigned users to Facebook at Work. This automatic sychronization enables Facebook at Work to get the data it needs to authorize users for access, in advance of them attempting to sign-in for the first time. It also de-provisions users from Facebook at Work when access has been revoked in Azure AD.

Automatic provisioning can be set up by clicking **Configure account provisioning** in the Azure management portal window.

For additional details on how to configure automatic provisioning, see [https://developers.facebook.com/docs/facebook-at-work/provisioning/cloud-providers](https://developers.facebook.com/docs/facebook-at-work/provisioning/cloud-providers)


## Assigning users to Facebook at Work

For provisioned AAD users to be able to see Facebook at Work on their Access Panel, they must be assigned access inside the Azure management portal.

**To assign users to Facebook at Work:**

1.	On the start page for Facebook at Work in the Azure management portal, click **Assign accounts**.

2.	In the **Show** menu, select whether you want to assign a user or a group to Facebook at Work and click the Checkmark button.

3.	In the resulting list, select the users or group to whom you want to assign Facebook at Work.

4.	In the page footer, click the **Assign** button.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->
[1]: ./media/active-directory-saas-cs-stars-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-cs-stars-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-cs-stars-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-cs-stars-tutorial/tutorial_general_04.png




