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
	ms.date="02/23/2016"
	ms.author="asmalser"/>


# Tutorial: Azure Active Directory integration with Evidence.com

The objective of this tutorial is to show how to set up single sign-on between Azure Active Directory (AAD) and Evidence.com. The scenario outlined in this tutorial assumes that you already have the following items:
	
* A valid Microsoft Azure subscription
* An Evidence.com subscription with single sign On enabled (email earlyaccess@evidence.com if SAML-based single sign on is not enabled)

After completing this tutorial, the AAD users to whom you have assigned Evidence.com access will be able to single sign into the application using the AAD Access Panel.

## Add Evidence.com to your directory

This section outlines how to add Evidence.com as an integrated application in Azure Active Directory.

**To enable the application integration for Evidence:**

1.	In the [Azure classic portal](https://manage.windowsazure.com), on the left navigation pane, click **Active Directory**.

2.	From the **Directory** list, select the directory for which you want to enable directory integration.

3.	To open the applications view, in the directory view, click **Applications** in the top menu.

4.	To open the Application Gallery, click **Add**, and then click **Add an application from the gallery**.

5.	In the search box, type **Evidence.com**.

6.	In the results pane, select **Evidence.com**, and then click **Complete** to add the application.


## Configuring single sign-on

This section outlines how to enable users to authenticate to Evidence.com with their account in Azure Active Directory, using federation based on the SAML protocol.

**To configure single sign-on, perform the following steps:**

1.	After adding Evidence.com in the Azure classic portal, click **Configure Single Sign-On**. 
 
2.	On the next screen, select **Azure AD Single Sign-On**, and then click **Next**.

3.	In the Configure App URL screen, enter the URL where users will sign into your Evidence.com tenant URL (Example: https://yourtenant.evidence.com  and then click **Next**. 

4.	Click the **Download Certificate** link, and save it to your local drive. This certificate and the metadata URLs (  Entity ID, SSO Sign In URL and Sign Out URL ) will be used to set up SSO on Evidence.com site. 

5.	In a separate web browser window, login to your Evidence.com tenant as an administrator and navigate to **Admin** Tab
      
6.	Click on **Agency Single Sign On**
 
7.	Select **SAML Based Single Sign On**
 
8.	Copy the **Issuer URL**, **Single Sign On** and **Single Sign Out** values shown in the Azure classic portal and to the corresponding fields in Evidence.com.

9.	Open the certificate downloaded in step 4 using a text editor like Notepad.exe, and copy and paste the contents into the **Security Certificate** box. 

10. Save the configuration in Evidence.com.
 
11.	In the Azure classic portal, check **Confirm that you have configured single sign-on as described above**. Checking this will enable the current certificate to start working for this application checkbox.
 
12.	On the Single sign-on confirmation page, click **Complete**.  


## Creating an Evidence.com test user

For Azure AD users to be able to sign in, they must be provisioned for access inside the Evidence.com application. This section describes how to create Azure AD user accounts inside Evidence.com

**To provision a user account in Evidence.com:**

1.	In a web browser window, log into your Evidence.com company site as an administrator.

2.	Navigate to **Admin** tab.

3.	Click on **Add User**.

4.	Click the **Add** button.

5.  The **Email Address** of the added user must match the username of the users in Azure AD who you wish to give access. If the username and email address are not the same value in your organization, you can use the **Evidence.com > Attributes > Single Sign-On** section of the Azure classic portal to change the nameidenitifer sent to Evidence.com to be the email address.


## Assigning users to Evidence.com

For provisioned AAD users to be able to see Evidence.com on their Access Panel, they must be assigned access inside the Azure classic portal.

**To assign users to Evidence.com:**

1.	On the quick start page for Evidence.com in the Azure classic portal, click **Assign users to Evidence.com**.
 
2.	In the **Show** menu, select whether you want to assign a user or a group to Evidence.com, and click the Checkmark button.
 
3.	In the **Users** list, select the users to group to whom you want to assign Evidence.com.
 
4.	In the page footer, click the **Assign** button.

