<properties
	pageTitle="Change signature hash algorithm for O365 replying party trust | Microsoft Azure"
	description="This page provides guidelines for changing SHA algorithm for federation trust with O365"
    keywords="SHA1,SHA256,O365,federation,aadconnect,adfs,ad fs,change sha,federation trust,relying party trust"
	services="active-directory"
	documentationCenter=""
	authors="anandyadavmsft"
	manager="samueld"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/01/2016"
	ms.author="anandy"/>

#Change signature hash algorithm for O365 replying party trust

##Overview

AD FS signs it’s tokens to Azure Active Directory to ensure that they cannot be tampered with. This signature can be based on SHA1 or SHA256. Microsoft Azure Active Directory now supports tokens signed with a SHA256 algorithm and recommends setting the token signing algorithm to SHA256 for the highest level of security. This article provides the step to set the token signing algorithm to the more secure SHA256 level.

##Changing the token signing algorithm

Once you have set the signature algorithm as directed in the steps below, AD FS will start signing the tokens for O365 relying party trust with SHA-256. There is no extra configuration change needed and making this change has no impact to your end users accessing Office 365 or other Azure AD applications.

###Using management console

* Open the AD FS management console on the primary AD FS server.
* Expand the AD FS node and click on Relying party trusts.
* Right click on your O365/Azure relying party trust and select Properties.
* Select the advanced tab and select the secure hash algorithm as SHA256
* Click Ok

![SHA256 Signing Algorithm - MMC](./media/active-directory-aadconnectfed-sha256guidance/mmc.png)

###Using AD FS PowerShell cmdlets

* On any AD FS server, open PowerShell under administrator privileges
* Set the secure has algorithm by using the Set-AdfsRelyingPartyTrust cmdlet

 <code>Set-AdfsRelyingPartyTrust -TargetName 'Microsoft Office 365 Identity Platform' -SignatureAlgorithm 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256'</code>

##Also Read

* Repair O365 trust with AAD Connect (https://azure.microsoft.com/en-us/documentation/articles/active-directory-aadconnect-federation-management/#repairing-the-trust) 

