<properties
	pageTitle="Introduction to the Access Panel | Microsoft Azure"
	description="Learn how to use the various flavors of the Access Panel (Web browser, Android app, iPhone and iPad app) to access the SaaS apps that are assigned to you."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/19/2016"
	ms.author="markusvi"/>


# Introduction to the Access Panel


The Access Panel is a web-based portal that allows an end user with an organizational account in Azure Active Directory to view and launch cloud-based applications to which they have been granted access by the Azure AD administrator. If you are an end-user with Azure Active Directory editions, you can also utilize self-service group management capabilities through the Access Panel. <br>
The Access Panel is separate from the Azure Management Portal and does not require users to have an Azure subscription. 


![Access Panel][1] 


The Access Panel allows users to edit some of their profile settings, including the ability to:

- Change the password associated with your organizational account

- Edit password reset settings

- Edit multi-factor authentication-related contact & preference settings (for those accounts that have been required to use it by an administrator)

- View account details, such as your User ID, alternate email, mobile and office phone numbers

- View and launch cloud-based applications to which you have been granted access by the Azure AD administrator. For more information about the Access Panel from the end users’ perspective, see [Using the Access Panel](https://msdn.microsoft.com/library/azure/dn756411.aspx).

- Self-manage groups. More specifically, you can create and manage security groups and request security group memberships in Azure AD. For more information, see [Self-service group management for users in Azure AD](active-directory-accessmanagement-self-service-group-management.md) and [Manage your groups](active-directory-manage-groups.md). 




## Accessing the Access Panel


Users access the Access Panel by visiting the following URL in a web browser: <br> 
**http://myapps.microsoft.com**

If you have custom branding configured for your sign-in page, you can load this branding by default by appending your organization’s domain to the end of the URL: <br> 
**http://myapps.microsoft.com/contosobuild.com**

In this case, any active or verified domain name that has been configured under the Domains tab of your directory in the Azure management portal may be used, as illustrated in the screenshot below.


![Wingtip toys][2]  


This URL must be distributed to all users who will be signing into applications integrated with Azure AD.
 




## Authentication

In order to reach the Access Panel, a user must be authenticated using an organizational account in Azure AD. <br>
A user can be authenticated to Azure AD directly. <br>
Alternatively, if an organization has configured federation using ADFS or other technologies, users can be authenticated by Windows Server Active Directory.

If a user has a subscription for Azure or Office 365 and has been using the Azure Management Portal or an Office 365 application, then they will be presented the list of applications without needing to sign in again. Users who are not authenticated will be prompted to sign in using the username and password for their account in Azure AD. 
If the organization has configured federation, then typing the username is sufficient.

Once authenticated, users will be able to interact with the applications that have been integrated with the directory by the administrator. 
 To learn how to integrate applications with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md).
 




## Web browser requirements

At a minimum, the Access Panel requires a browser with support for JavaScript and CSS enabled. In order for the user to be signed on to applications using Password-based SSO, the Access Panel extension must be installed in the user’s browser. This Access Panel extension is downloaded automatically when a user selects an application that is configured for Password-based SSO.

At the present time, the Access Panel Extension is available for Internet Explorer 8 and later, Chrome, and Firefox browsers.





## Mobile app support

To be able to sign into Password-based SSO applications on iOS and Android devices, users should install My Apps mobile app published by the Azure Active Directory team.





### My Apps for Android


My Apps for Android is supported on any Android device running Android version 4.1 and up, and is available today in the [Google Play store](https://play.google.com/store/apps/details?id=com.microsoft.myapps).


![My apps][3]   






### My Apps for iPhone and iPad


My Apps for iOS is supported on any iPhone or iPad running iOS version 7 and up, and is available today in the Apple App Store.


![Applications profile][4]    




> [AZURE.NOTE] Applications that support federation with Azure AD (including Salesforce, Google Apps, Dropbox, Box, Concur, Workday, Office 365, and over 70 others), can be signed into on virtually any web browser on any device without requiring a plugin or mobile app. The rest of the access panel experience at [https://myapps.microsoft.com](https://myapps.microsoft.com/) also does not require the My Apps mobile app to be used on a mobile device.
 


 

## Tips for testing the end user experience

If you are an Azure administrator and you are signed into the Azure Management Portal using an account in the directory, you will be automatically signed into the Access Panel as your current administrator account. In this case, you can see all applications that have been assigned to this account.

**To test as a different user account:**

1. Click the user menu in the upper-right corner of the Azure portal or the Access Panel, and select “**Sign Out**”. This will sign you out of Azure AD.

2. Go to the Access Panel at **http://myapps.microsoft.com**.

3. In the sign in page, enter the username and password for the account in your directory that you want to test.
 
## Launching Applications

There are several types of applications that can appear on the Access Panel.
 
### Office 365 applications

If an organization is using Office 365 applications and the user is licensed for them, then the Office 365 applications will appear on the user’s Access Panel.

When a user clicks on an application tile for an Office 365 application, they are redirected to that application and automatically signed in.

### Microsoft and third-party applications configured with Federation-based SSO

These are applications that the administrator has added in the Active Directory section of the Azure Management Portal with the single sign-on mode set to “*Azure AD Single Sign-On*”. A user will only see these applications if they have been explicitly granted access to the application by the administrator.

When a user clicks on an application tile for one of these applications, they are redirected to that application and automatically signed in.

### Password-based SSO without identity provisioning

These are applications that the administrator has added in the Active Directory section of the Azure Management Portal with the single sign-on mode set to “*Password-based Single Sign-On*”. <br> 
All users in the directory will see all applications that have been configured in this mode.

The first time a user clicks on an application tile for one of these applications, they will be prompted to install the Password SSO plugin for Internet Explorer or Chrome, which may require a restarting of their web browser. When they are returned to the Access Panel and click on the application tile again, they will be prompted for a username and password for the application. Once the username and password are entered, these credentials will be securely stored in Azure AD and linked to their account in Azure AD, and the Access Panel will automate signing the user in to the application using those credentials.

The next time a user clicks on the application tile, they will be automatically signed into the application without needing to enter the credentials again and without needing to install the Password SSO plugin again.

If a user’s credentials have changed in the target third-party application, then the user must also update their credentials which are stored in Azure AD. To update credentials, a user must select the icon in the lower-right of the application tile, and select “update credentials” to re-enter the username and password for that application.

### Password-based SSO with identity provisioning

These are applications that the administrator has added in the Active Directory section of the Azure Management Portal with the single sign-on mode set to “*Password-based Single Sign-On*” as well as the identity provisioning.

The first time a user clicks on an application tile for one of these applications, they will be prompted to install the Password SSO plugin for Internet Explorer or Chrome, which may require a restarting of their web browser. When they are returned to the Access Panel and click on the application tile again, they will be automatically signed in to the application.

Some applications may require that a user change their password on first sign in. If a user’s credentials have changed in the target third-party application, then the user must also update their credentials which are stored in Azure AD. To update credentials, a user must select the icon in the lower-right of the application tile, and select “update credentials” to re-enter the username and password for that application.

### Application with Existing SSO solutions

When configuring single sign-on for an application, the Azure management portal provides a third option of “Existing Single Sign-On”. This option simply allows the administrator to create a link to an application, and place it on the access panel for selected users. 
For example, if there is an application that is configured to authenticate users using Active Directory Federation Services 2.0, an administrator can use the “Existing Single Sign-On” option to create a link to it on the access panel. When users access the link, they are authenticated using Active Directory Federation Services 2.0, or whatever existing single sign-on solution is provided by the application.

##Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)
- [Introduction to Single Sign-On and Managing App Access with Azure Active Directory](active-directory-appssoaccess-whatis.md)
- [Automate User Provisioning and Deprovisioning to SaaS Applications](active-directory-saas-app-provisioning.md)

<!--Image references-->
[1]: ./media/active-directory-saas-access-panel-introduction/ic767166.png
[2]: ./media/active-directory-saas-access-panel-introduction/ic767167.png
[3]: ./media/active-directory-saas-access-panel-introduction/ic767168.png
[4]: ./media/active-directory-saas-access-panel-introduction/ic767169.png
