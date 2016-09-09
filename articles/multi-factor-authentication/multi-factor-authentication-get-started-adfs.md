<properties 
	pageTitle="Getting started with Azure Multi-Factor Authentication and Active Directory Federation Services" 
	description="This is the Azure Multi-Factor authentication page that describes how to get started with Azure MFA and AD FS." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtland"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" ms.topic="get-started-article" 
	ms.date="08/04/2016" 
	ms.author="billmath"/>

# Getting started with Azure Multi-Factor Authentication and Active Directory Federation Services



<center>![Cloud](./media/multi-factor-authentication-get-started-adfs/adfs.png)</center>

If your organization has federated your on-premises Active Directory with Azure Active Directory using AD FS, the following 2 options for using Azure Multi-Factor Authentication are available.

- Secure cloud resources using Azure Multi-Factor Authentication or Active Directory Federation Services 
- Secure cloud and on-premises resources using Azure Multi-Factor Authentication Server 

The following table summarizes the authentication experience between securing resources with Azure Multi-Factor Authentication and AD FS

|Authentication Experience - Browser based Apps|Authentication Experience - Non-Browser based Apps
:------------- | :------------- | :------------- |
Securing Azure AD resources using Azure Multi-Factor Authentication |<li>The 1st factor of authentication is performed on-premises using AD FS.</li> <li>The 2nd factor is a phone based method carried out using cloud authentication.</li>|End users can use app passwords to sign-in.
Securing Azure AD resources using Active Directory Federation Services |<li>The 1st factor of authentication is performed on-premises using AD FS.</li><li>The 2nd factor is performed on-premises by honoring the claim.</li>|End users can use app passwords to sign-in.

Caveats with app passwords for federated users: 

- App Password is verified using cloud authentication and hence bypasses federations. Federation is only actively used when setting up App Password.
- On-premises Client Access Control settings are not honored by App Password.
- You lose on-premises auth logging capability for App Password.
- Account disable/deletion may take up to 3 hours for dirsync, delaying disable/deletion of app password in the cloud identity.

For information on setting up either Azure Multi-Factor Authentication or the Azure Multi-Factor Authentication Server with AD FS see the following:

- [Secure cloud resources using Azure Multi-Factor Authentication and AD FS](multi-factor-authentication-get-started-adfs-cloud.md)
- [Secure cloud and on-premises resources using Azure Multi-Factor Authentication Server with Windows Server 2012 R2 AD FS](multi-factor-authentication-get-started-adfs-w2k12.md)
- [Secure cloud and on-premises resources using Azure Multi-Factor Authentication Server with AD FS 2.0](multi-factor-authentication-get-started-adfs-adfs2.md)







 
