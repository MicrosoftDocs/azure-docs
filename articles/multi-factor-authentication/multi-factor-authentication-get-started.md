<properties 
	pageTitle="Azure Multi-Factor Authentication - Getting Started" 
	description="Choose the multi-factor authentication secutiry solution that is right for you by asking what am i trying to secure and where are my users located.  Then choose cloud, MFA Server or AD FS." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtland"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="08/24/2015" 
	ms.author="billmath"/>

#Choose the multi-factor security solution for you

Because there are several flavors of Azure Multi-Factor Authentication we must determine a couple of things in order to figure out which version is the proper one to use.  Those things are:

-	[What am I trying to secure](#what-am-i-trying-to-secure)
-	[Where are the users located](#where-are-the-users-located)

The following sections will provide guidance on determining each of these.

## What am I trying to secure?

In order to determine the correct multi-factor authentication solution, first we must answer the question of what are you trying to secure with a second method of authentication.  Is it an application that is in Azure?  Or is it a remote access system for example.  By determining what we are trying to secure, we will see to answer the question of where multi-factor authentication needs to be enabled.  



What are you trying to secure| Multi-Factor Authentication in the cloud|Multi-Factor Authentication Server 
------------- | :-------------: | :-------------: |
First party Microsoft apps|* |* |
Saas apps in the app gallery|* |* |
IIS applications published through Azure AD App Proxy|* |* |
IIS applications not published through Azure AD App Proxy | |* |
Remote access such as VPN, RDG| |* |



## Where are the users located

Next, depending on where are users are located, we can determine the correct solution to use, whether it is mutli-factor authentication in the cloud or on-premises using the MFA Server.



User Location| Solution
------------- | :------------- | 
Azure Active Directory| Multi-Factor Authentication in the cloud|
Azure AD and on-premises AD using federation with AD FS| Both MFA in the cloud and MFA Server are available options 
Azure AD and on-premises AD using DirSync, Azure AD Sync, Azure AD Connect - no password sync|Both MFA in the cloud and MFA Server are available options 
Azure AD and on-premises AD using DirSync, Azure AD Sync, Azure AD Connect - with password sync|Multi-Factor Authentication in the cloud
On-premises Active Directory|Multi-Factor Authentication Server

The following table is a comparison of the features that are a with Multi-Factor Authentication in the cloud and with the Multi-Factor Authentication Server.

 | Multi-Factor Authentication in the cloud | Multi-Factor Authentication Server
------------- | :-------------: | :-------------: |
Mobile app notification as a second factor | ● | ● |
Mobile app verification code as a second factor | ● | ●
Phone call as second factor | ● | ● 
One-way SMS as second factor | ● | ●
Two-way SMS as second factor |  | ● 
Hardware Tokens as second factor |  | ● 
App passwords for clients that don’t support MFA | ● |  
Admin control over authentication methods |  | ● 
PIN mode |  | ●
Fraud alert | ● | ●
MFA Reports | ● | ● 
One-Time Bypass | ● | ● 
Custom greetings for phone calls | ● | ● 
Customizable caller ID for phone calls | ● | ● 
Trusted IPs | ● | ● 
Suspend MFA for remembered devices (Public Preview) | ● |  
Conditional access | ● | ● 
Cache | ● | ● 

Now that we have determined whether to use cloud multi-factor authentication or the MFA Server on-premises, we can get started setting up and using Azure Multi-Factor Authentication.   **Select the icon that represents your scenario!**

<center>




[![Cloud](./media/multi-factor-authentication-get-started/cloud2.png)](multi-factor-authentication-get-started-cloud.md)  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Proofup](./media/multi-factor-authentication-get-started/server2.png)](multi-factor-authentication-get-started-server.md) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</center>

**Additional Resources**

* [For Users](multi-factor-authentication-end-user.md)
* [Azure Multi-Factor Authentication on MSDN](https://msdn.microsoft.com/library/azure/dn249471.aspx) 
