---
title: 'Azure Active Directory Connect: FAQ - | Microsoft Docs'
description: This page has frequently asked questions about Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: femila
ms.assetid: 4e47a087-ebcd-4b63-9574-0c31907a39a3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/22/2017
ms.author: billmath

---
# Frequently asked questions for Azure Active Directory Connect

## General installation
**Q: Will installation work if the Azure AD Global Admin has 2FA enabled?**  
With the builds from February 2016, this is supported.

**Q: Is there a way to install Azure AD Connect unattended?**  
It is only supported to install Azure AD Connect using the installation wizard. An unattended and silent installation is not supported.

**Q: I have a forest where one domain cannot be contacted. How do I install Azure AD Connect?**  
With the builds from February 2016, this is supported.

**Q: Does the AD DS health agent work on server core?**  
Yes. After installing the agent, you can complete the registration process using the following PowerShell commandlet: 

`Register-AzureADConnectHealthADDSAgent -Credentials $cred`

## Network
**Q: I have a firewall, network device, or something else that limits the maximum time connections can stay open on my network. How long should my client side timeout threshold be when using Azure AD Connect?**  
All networking software, physical devices, or anything else that limits the maximum time connections can remain open should use a threshold of at least 5 minutes (300 seconds) for connectivity between the server where the Azure AD Connect client is installed and Azure Active Directory. This also applies to all previously released Microsoft Identity synchronization tools.

**Q: Are SLDs (Single Label Domains) supported?**  
No, Azure AD Connect does not support on-premises forests/domains using SLDs.

**Q: Are "dotted" NetBios named supported?**  
No, Azure AD Connect does not support on-premises forests/domains where the NetBios name contains a period "." in the name.

## Federation
**Q: What do I do if I receive an email that asking me to renew my Office 365 certificate**  
Use the guidance that is outlined in the [renew certificates](active-directory-aadconnect-o365-certs.md) topic on how to renew the certificate.

**Q: I have "Automatically update relying party" set for O365 relying party. Do I have to take any action when my token signing certificate automatically rolls over?**  
Use the guidance that is outlined in the article [renew certificates](active-directory-aadconnect-o365-certs.md).

## Environment
**Q: Is it supported to rename the server after Azure AD Connect has been installed?**  
No. Changing the server name will cause the sync engine to not be able to connect to the SQL database and the service will not be able to start.

## Identity data
**Q: The UPN (userPrincipalName) attribute in Azure AD does not match the on-prem UPN - why?**  
See these articles:

* [User names in Office 365, Azure, or Intune don't match the on-premises UPN or alternate login ID](https://support.microsoft.com/en-us/kb/2523192)
* [Changes aren't synced by the Azure Active Directory Sync tool after you change the UPN of a user account to use a different federated domain](https://support.microsoft.com/en-us/kb/2669550)

You can also configure Azure AD to allow the sync engine to update the userPrincipalName as described in [Azure AD Connect sync service features](active-directory-aadconnectsyncservice-features.md).

**Q: Is it supported to soft match on-premises AD Group/Contact objects with existing Azure AD Group/Contact objects?**  
No, this is currently not supported.

**Q: Is it supported to manually set ImmutableId attribute on existing Azure AD Group/Contact objects to hard match it to on-premises AD Group/Contact objects?**  
No, this is currently not supported.



## Custom configuration
**Q: Where are the PowerShell cmdlets for Azure AD Connect documented?**  
With the exception of the cmdlets documented on this site, other PowerShell cmdlets found in Azure AD Connect are not supported for customer use.

**Q: Can I use "Server export/server import" found in *Synchronization Service Manager* to move configuration between servers?**  
No. This option will not retrieve all configuration settings and should not be used. You should instead use the wizard to create the base configuration on the second server and use the sync rule editor to generate PowerShell scripts to move any custom rule between servers. See [Swing migration](active-directory-aadconnect-upgrade-previous-version.md#swing-migration).

**Q: Can passwords be cached for the Azure sign-in page and can this be prevented since it contains a password input element with the autocomplete = "false" attribute?**</br>
We currently do not support modifying the HTML attributes of the Password input field, including the autocomplete tag. We are currently working on a feature that will allow for custom Javascript which will allow you to add any attribute to the password field. This should be available later part of 2017.

**Q: On the Azure sign-in page, usernames for users who have previously signed in successfully are shown.  Can this behavior be turned off?**</br>
We currently do not support modifying the HTML attributes of the sign-in page. We are currently working on a feature that will allow for custom Javascript which will allow you to add any attribute to the password field. This should be available later part of 2017.

**Q: Is there a way to prevent concurrent sessions?**</br>
No.



## Troubleshooting
**Q: How can I get help with Azure AD Connect?**

[Search the Microsoft Knowledge Base (KB)](https://www.microsoft.com/en-us/Search/result.aspx?q=azure%20active%20directory%20connect&form=mssupport)

* Search the Microsoft Knowledge Base (KB) for technical solutions to common break-fix issues about Support for Azure AD Connect.

[Microsoft Azure Active Directory Forums](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WindowsAzureAD)

* You can search and browse for technical questions and answers from the community or ask your own question by clicking [here](https://social.msdn.microsoft.com/Forums/azure/en-US/newthread?category=windowsazureplatform&forum=WindowsAzureAD&prof=required).

[Azure AD Connect customer support](https://manage.windowsazure.com/?getsupport=true)

* Use this link to get support through the Azure portal.

