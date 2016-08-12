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

# Change signature hash algorithm for O365 replying party trust

## Overview

Azure Active Directory Federation Services (AD FS) signs its tokens to Microsoft Azure Active Directory to ensure that they cannot be tampered with. This signature can be based on SHA1 or SHA256. Microsoft Azure Active Directory now supports tokens signed with an SHA256 algorithm and recommends setting the token signing algorithm to SHA256 for the highest level of security. This article describes the steps needed to set the token-signing algorithm to the more secure SHA256 level.

## To change the token signing algorithm

After you have set the signature algorithm with one of the two processes below, AD FS signs the tokens for O365 relying party trust with SHA256. You don't need to make any extra configuration changes, and this change has no impact on your ability to access Office 365 or other Azure AD applications.

### AD FS Management Console

1. Open AD FS Management Console on the primary AD FS server.
2. Expand the AD FS node and click **Relying Party Trusts**.
3. Right-click your O365/Azure relying party trust and select **Properties**.
4. Select the **Advanced** tab and select the secure hash algorithm SHA256.
5. Click **OK**.

![SHA256 Signing Algorithm - MMC](./media/active-directory-aadconnectfed-sha256guidance/mmc.png)

### AD FS PowerShell cmdlets

1. On any AD FS server, open PowerShell under **administrator privileges**.
2. Set the secure hash algorithm by using the **Set-AdfsRelyingPartyTrust** cmdlet.

 <code>Set-AdfsRelyingPartyTrust -TargetName 'Microsoft Office 365 Identity Platform' -SignatureAlgorithm 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256'</code>

## Also read

* [Repair O365 trust with AAD Connect](./active-directory-aadconnect-federation-management.md#repairing-the-trust)
