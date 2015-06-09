<properties 
	pageTitle="Azure Multi-Factor Authentication - Getting Started" 
	description="Choose the multi-factor authentication secutiry solution that is right for you by asking what am i trying to secure and where are my users located.  Then choose cloud, MFA Server or AD FS." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="bryanla"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2015" 
	ms.author="billmath"/>

#Choose the multi-factor security solution for you

[Whats Is It](multi-factor-authentication.md)<br> 
[How it Works](multi-factor-authentication-how-it-works.md)<br>
[Getting Started](multi-factor-authentication-get-started.md)<br>
[What's Next](multi-factor-authentication-whats-next.md)<br>
[Learn More](multi-factor-authentication-learn-more.md)

Because there are several flavors of Azure Multi-Factor Authentication we must determine a couple of things to determine which one is the correct one to use.  Those things are:

-	What am I trying to secure
-	Where are the users located

The following sections will provide guidance on determining each of these.

## What am I trying to secure?

In order to determine the correct multi-factor authentication solution, first we must answer the question of what are you trying to secure with a second method of authentication.  Is it an application that is in Azure?  Or is it a remote access system for example.  By determining what we are trying to secure, we will see to answer the question of where multi-factor authentication needs to be enabled.  



What are you trying to secure| Cloud Multi-Factor Authentication|Multi-Factor Authentication Server 
------------- | :-------------: | :-------------: |
First party Microsoft apps|* |* |
Saas apps in the app gallery|* |* |
IIS applications published through CWAP|* |* |
IIS applications not published through CWAP| |* |
Remote access such as VPN, RDG| |* |



## Where are the users located

Next, depending on where are users are located, we can determine the correct solution to use, whether it is cloud mutli-factor authentication or on-premises using the MFA Server.



User Location| Solution
------------- | :-------------: | 
Azure Active Directory| Cloud Multi-Factor Authentication|
Azure AD and on-premises AD using federation with AD FS| Both Cloud Multi-Factor Authentication and Multi-Factor Authentication Server are available options 
Azure AD and on-premises AD using DirSync, Azure AD Sync, Azure AD Connect - no password sync|Both Cloud Multi-Factor Authentication and Multi-Factor Authentication Server are available options 
Azure AD and on-premises AD using DirSync, Azure AD Sync, Azure AD Connect - with password sync|Cloud Multi-Factor Authentication
On-premises Active Directory|Multi-Factor Authentication Server


Now that we have determined whether to use cloud multi-factor authentication or the MFA Server on-premises, we can get started setting up and using Azure Multi-Factor Authentication.   **Select the icon that represents your scenario!**

<center>


[![Cloud](./media/multi-factor-authentication-get-started/cloud.png)](multi-factor-authentication-get-started-cloud.md)  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Proofup](./media/multi-factor-authentication-get-started/server.png)](multi-factor-authentication-get-started-server.md) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Proofup](./media/multi-factor-authentication-get-started/adfs.png)](multi-factor-authentication-adfs.md)
</center>

