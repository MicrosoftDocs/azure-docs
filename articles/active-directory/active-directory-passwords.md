<properties 
	pageTitle="What is it: Azure AD Password Management | Microsoft Azure"
	description="Description of password management capabilities in Azure AD, including password reset, change, password management reporting, and writeback to your local on-premises Active Directory." 
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
	ms.date="10/08/2015" 
	ms.author="asteen"/>

# Manage your passwords from anywhere

  >[AZURE.IMPORTANT] Are you here because you want to reset your Azure or O365 password?  If so, please [follow the instructions here](https://support.microsoft.com/kb/2606983).
  
Self-service has long been a key goal for IT departments across the world as a cost-reduction and labor-saving measure.  Indeed, the market is flooded with products that let you manage your on-premises groups, passwords, or user profiles from the cloud or on-premises. Azure AD sets itself apart from these offerings by providing some of the easiest to use and and most powerful self-service capabilities available today.

**Azure AD Password Management** is a set of capabilities that allow your users to manage any password from any device, at any time, from any location, while remaining in compliance with the security policies you define.

## Overview
You can get started with a pilot of Azure AD Password Management in under five minutes, and can have it deployed to your entire organization in hours.  Below are some helpful resources to get you going with the service: 

* [**How it works**](active-directory-passwords-how-it-works.md) - learn about the six different components of the service and what each does
* [**Getting started**](active-directory-passwords-getting-started.md) - learn how to allow you users to reset and change their cloud or on-premises passwords
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**Get insights**](active-directory-passwords-get-insights.md) - learn about our integrated reporting capabilities
* [**FAQ**](active-directory-passwords-faq.md) - get answers to frequently asked questions
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md) - learn how to quickly troubleshoot problems with the service
* [**Learn more**](active-directory-passwords-learn-more.md) - go deep into the technical details of how the service works


## What is possible with Azure AD Password Management?
Here are some of the things you can do with Azure AD's password management capabilities.

- **Self-service password change** allows end users or administrators to change their expired or non-expired passwords without calling an administrator or helpdesk for support.
- **Self-service password reset** allows end users or administrators to reset their passwords automatically without calling an administrator or helpdesk for support. Self-service password reset requires Azure AD Premium or Basic. For more information, see Azure Active Directory Editions.
- **Administrator-initiated password reset** allows an administrator to reset an end user’s or another administrator’s password from within the [Azure Management Portal](https://manage.windowsazure.com).
- **Password management activity reports** give administrators insights into password reset and registration activity occurring in their organization. 
- **Password Writeback** allows management of on-premises passwords from the cloud so all of the above scenarios can be performed by, or on the behalf of, federated or password synchronized users. Password Writeback requires Azure AD Premium. For more information, see Getting started with Azure AD Premium.

## Why use Azure AD Password Management?
Here are some of the reasons you should use Azure AD's password management capabilities

- **Reduce costs** - support-assisted password reset is typically 20% of organization's IT spend
- **Improve user experiences** - users don't want to call helpdesk and spend an hour on the phone every time they forget their passwords
- **Lower helpdesk volumes** - password management is the single largest helpdesk driver for most organizations
- **Enable mobility** - users can reset their passwords from wherever they are

## Recent service updates

**Usability updates to Registration Page** - October 2015

- Now, when a user has data already registered, he or she can just click "looks good" to update the data without needing to re-send the email or phone call.

**Improved Reliability of Password Writeback** - September 2015

- As of the September release of Azure AD Connect, the password writeback agent will now more agressively retry connections and additional, more robust, failover capabilities.

**API for Retrieving Password Reset Reporting Data** - August 2015

- Now, the data behind the password reset reports can be retrieved directly from the [Azure AD Reports and Events API](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprActivityEvent).

**Support for Azure AD Password Reset During Cloud Domain Join** - August 2015

- Now, any cloud user can reset his or her password right from the Windows 10 sign in screen during the cloud domain join onboarding experience.  Note, this is not yet exposed on the Windows 10 sign in screen.

**Enforce Password Reset Registration at Sign-In to Azure and Federated Apps** - July 2015

- In addition to enforcing registration when signing into myapps.microsoft.com, we now support enforcing registration during  sign ins to the Azure Management Portal and any of your federated single-sign on applications

**Security Question Localization Support** - May 2015

- Now, you have the option to select pre-defined security questions which are localized in the full O365 language set when configuring Security Questions for password reset.

**Account Unlock Support during Password Reset** - June 2015

- If you're using password writeback and you reset your password when your account is locked, we'll automatically unlock your Active Directory account!

**Branded SSPR Registration** - April 2015

- The password reset reigstration page is now branded with your company logo!

**Security Questions** - March 2015

- We released security questions to GA!

**Account Unlock** - March 2015

- Now users can unlock their accounts when password reset occurs

## Coming soon

Below are some of the cool features we're working on right now!

**Support for Unlocking Active Directory Accounts without Resetting a Password** - Coming soon!

- Many folks have requested the ability to unlock AD accounts separately from password reset.  We're happy to announce that we are putting the finishing touches on this feature right now, and it will soon be released to anyone using password writeback!

**Support for Reminding Users to Update their Registered Data During Sign-in** - Work in progress

- Today, we support reminding users to update their registered data when accessing myapps.microsoft.com, but we're working on the ability to do so for all sign ins.

**Enforce Password Reset Registration at Sign-In to Office 365 Apps** - Work in progress

- More and more office apps are coming on board to the latest and greatest Azure AD sign in experience.  When they do, they'll automatically be supported for SSPR enforced registration!

<br/>
<br/>
<br/>

**Additional Resources**


* [How Password Management works](active-directory-passwords-how-it-works.md)
* [Getting started with Password Mangement](active-directory-passwords-getting-started.md)
* [Customize Password Management](active-directory-passwords-customize.md)
* [Password Management Best Practices](active-directory-passwords-best-practices.md)
* [How to get Operational Insights with Password Management Reports](active-directory-passwords-get-insights.md)
* [Password Management FAQ](active-directory-passwords-faq.md)
* [Troubleshoot Password Management](active-directory-passwords-troubleshoot.md)
* [Learn More](active-directory-passwords-learn-more.md)
* [Password Management on MSDN](https://msdn.microsoft.com/library/azure/dn510386.aspx)