<properties 
	pageTitle="Azure Active Directory Password Management - How it Works?" 
	description="This article describes how password management capabilities in Azure AD work." 
	services="active-directory" 
	documentationCenter="" 
	authors="asteen" 
	manager="kbrint" 
	editor="billmath"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/27/2015" 
	ms.author="asteen"/>

# How Password Management works

<div class="dev-center-tutorial-selector sublanding">
<a href="../active-directory-passwords/" title="What is it">What is It</a>
<a href="../active-directory-passwords-how-it-works/" title="How it works" class="current">How it Works</a>
<a href="../active-directory-passwords-getting-started/" title="Getting started">Getting Started</a>
<a href="../active-directory-passwords-customize/" title="Customize">Customize</a>
<a href="../active-directory-passwords-best-practices/" title="Best practices">Best Practices</a>
<a href="../active-directory-passwords-get-insights/" title="Get insights">Get Insights</a>
<a href="../active-directory-passwords-faq/" title="FAQ">FAQ</a>
<a href="../active-directory-passwords-troubleshoot/" title="Troubleshooting">Troubleshooting</a>
<a href="../active-directory-passwords-learn-more/" title="Learn more">Learn More</a>
</div>

## Component Overview
Password management in Azure Active Directory is comprised of several logical components that are described below.  Click on each link to learn more about that component.

- [**Password Management Configuration Portal**](sspr-config) – Administrators can control different facets of how passwords are managed in their tenants by navigating to their directory’s Configure tab in the Azure Management Portal.
- [**User Registration Portal**](sspr-registration) – Users can self-register for password reset through this web portal.
- [**User Password Reset Portal**](sspr-portal) – Users can reset their own passwords using a number of different challenges in accordance with the administrator-controlled password reset policy
- [**User Password Change Portal**](sspr-pwdchange) – Users can change their own passwords at any time by entering their old password and selecting a new password using this web portal
- [**Password Management Reports**](sspr-reports) – Administrators can view and analyze password reset and registration activity in their tenant by navigating to the “Activity Reports” section of their directory’s “Reports” tab in the Azure Management Portal
- [**Password Writeback Component of  AAD Sync**](sspr-writeback) - Administrators can optionally enable the Password Writeback feature when installing AADSync to enable management of federated or password synchronized user passwords from the cloud.

## Password Management Configuration Portal <a href="sspr-config"></a>
You can configure password management policies for a specific directory using the Azure Management Portal by navigating to the User Password Reset Policy section in the directory’s Configure tab.  From this configuration page, you can control many aspects of how passwords are managed in your organization, including:

- Enabling and disabling password reset for all users in a directory
- Setting the number of challenges (either one or two) a user must go through to reset his or her password
- Setting the specific types of challenges you want to enable for users in your organization from the choices below:
 - Mobile Phone (a verification code via text or a voice call)
 - Office Phone (a voice call)
 - Alternate Email (a verification code via email)
 - Security Questions (knowledge-based authentication)
- Setting the number of questions a user must register in order to use the security questions authentication method (only visible if security questions are enabled)
- Setting the number of questions a user must supply during reset to use the security questions authentication method (only visible if security questions are enabled)
- Defining the custom security questions that a user may choose to register for to use the security questions authentication method (only visible if security questions are enabled)
- Requiring users to register for password reset when they go to the application Access Panel at http://myapps.microsoft.com. For more information about the Access Panel, see Introduction to the Access Panel.
- Requiring users to re-confirm their previously registered data after a configurable number of days have passed (only visible if enforced registration is enabled)
- Providing a custom helpdesk email or URL that will be shown to users in case they have a problem resetting their passwords
- Enabling or disabling the password writeback capability (when writeback has been deployed using AADSync)
- Viewing the status of the password writeback agent (when writeback has been deployed using AADSync)
- Enabling email notifications to users when their own password has been reset (found in the Notifications section of the Azure Management Portal)
- Enabling email notifications to administrators when other administrators reset their own passwords (found in the Notifications section of the Azure Management Portal)
- Branding the user password reset portal and password reset emails with your organization’s logo and name by using the tenant branding customization feature (found in the Directory Properties section of the Azure Management Portal

To learn more about configuring password management in your organization, see Self-service password reset in Azure AD: how to enable, configure, and test self-service password reset andPassword writeback: how to configure Azure AD to manage on-premises passwords. 

##User Registration Portal <a href="sspr-registration"></a>
Before users are able to use password reset, their cloud user accounts must be updated with the correct authentication data to ensure that they can pass through the appropriate number of password reset challenges defined by their administrator.  Administrators can also define this authentication information on their user’s behalf by using the Azure or Office web portals, DirSync / AADSync, or Windows PowerShell.

However, if you’d rather have your users register their own data, we also provide a web page that users can go to in order to provide this information.  This page will allow users to specify authentication information in accordance with the password reset policies that have been enabled in their organization.  Once this data is verified, it is stored in their cloud user account to be used for account recovery at a later time. Here’s what the registration portal looks like:
  
  ![001]
  
For more information, see Self-service password reset in Azure AD: how to enable, configure, and test self-service password reset and Self-service password reset in Azure AD: deployment and management best practices. 

##User Password Reset Portal <a href="sspr-portal"></a>
Once you have enabled self-service password reset, set up your organization’s self-service password reset policy, and ensured that your users have the appropriate contact data in the directory, users in your organization will be able to reset their own passwords automatically from any web page which uses a Work or School account for sign in (such as portal.microsoftonline.com). On pages such as these, users will see a Can’t access your account link. 
  
  ![002]
  
Clicking on this link will launch a self-service password reset wizard.
  
  ![003]
  
To learn more about how users can reset their own passwords, see Self-service password reset in Azure AD: how to enable, configure, and test self-service password reset.

##User Password Change Portal <a href="sspr-pwdchange"></a>
If users want to change their own passwords, they can do so by using the password change portal at any time.  Users can access the password change portal via the Access Panel profile page, or clicking the “change password” link from within Office 365 applications.  In the case when their passwords expire, users will also be asked to change them automatically when signing in. 
  
  ![004]
  
In both of these cases, if password writeback has been enabled and the user is either federated or password sync’d, these changed passwords are written back to your on-premises Active Directory. Here’s what the password change portal looks like: 
  
  ![005]
  
##Password Management Reports <a href="sspr-reports"></a>
By navigating to the Reports tab and looking under the Activity Logs section, you will see two password management reports: Password reset activity and Password reset registration activity.  Using these two reports, you can get a view of users registering for and using password reset in your organization. Here’s what these reports look like in the Azure Management Portal:
  
  ![006]
  
For more information, see Password management reports in Azure AD: how to view password management activity in your tenant.

##Password Writeback Component of  AAD Sync <a href="sspr-writeback"></a>
If the passwords of users in your organization originate from your on-premises environment (either via federation or password synchronization), you can install the latest version of AADSync to enable updating those passwords directly from the cloud.  This means that when your users forget or want to modify their AD password, they can do so straight from the web.  Here’s where to find Password Writeback in the AADSync installation wizard:
  
  ![007]
  
For more information about AAD Sync, see Directory Integration Tools. For more information about password writeback, see Password writeback: how to configure Azure AD to manage on-premises passwords.


**Additional Resources**


* [What is Password Management](active-directory-passwords.md)
* [Getting started with Password Mangement](active-directory-passwords-getting-started.md)
* [Customize Password Management](active-directory-passwords-customize.md)
* [Password Management Best Practices](active-directory-passwords-best-practices.md)
* [How to get Operational Insights with Password Management Reports](active-directory-passwords-get-insights.md)
* [Password Management FAQ](active-directory-passwords-faq.md)
* [Troubleshoot Password Management](active-directory-passwords-troubleshoot.md)
* [Learn More](active-directory-passwords-learn-more.md)
* [Password Management on MSDN](https://msdn.microsoft.com/library/azure/dn510386.aspx)



[001]: /media/active-directory-passwords-how-it-works/001.jpg "Image_001.jpg"
[002]: /media/active-directory-passwords-how-it-works/002.jpg "Image_002.jpg"
[003]: /media/active-directory-passwords-how-it-works/003.jpg "Image_003.jpg"
[004]: /media/active-directory-passwords-how-it-works/004.jpg "Image_004.jpg"
[005]: /media/active-directory-passwords-how-it-works/005.jpg "Image_005.jpg"
[006]: /media/active-directory-passwords-how-it-works/006.jpg "Image_006.jpg"
[007]: /media/active-directory-passwords-how-it-works/007.jpg "Image_007.jpg"
