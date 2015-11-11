<properties
	pageTitle="Azure AD Connect FAQ | Microsoft Azure"
	description="This page has frequently asked questions about Azure AD Connect."
	services="active-directory"
	documentationCenter=""
	authors="billmath"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/10/2015"
	ms.author="billmath"/>

# Azure Active Directory Connect FAQ

## General installation
**Q: Will installation work if the Azure AD Global Admin has 2FA enabled?**

Installation will not work in this case. The Global Admin installing Azure AD Connect must not have MFA enabled. We are aware of this limitation and will support this in the future.

**Q: Is there a way to install Azure AD Connect unattended?**

It is only supported to install Azure AD Connect using the installation wizard. An unattended and silent installation is not supported.

## Express installation

## Custom installation

## Network
**Q: I have a firewall, network device, or something else that limits the maximum time connections can stay open on my network. How long should my client side timeout threshold be when using Azure AD Connect?**

All networking software, physical devices, or anything else that limits the maximum time connections can remain open should use a threshold of at least 5 minutes (300 seconds) for connectivity between the server where the Azure AD Connect client is installed and Azure Active Directory. This also applies to all previously released Microsoft Identity synchronization tools.

**Q: What do I do if I receive an email that asking me to renew my Office 365 certificate**

Use the guidance that is outlined in the article here to resolve to [here](active-directory-aadconnect-o365-certs.md) renew the certificate.

## Troubleshooting

**Q: How can I get help with Azure AD Connect?**

[Search the Microsoft Knowledge Base (KB)](https://www.microsoft.com/en-us/Search/result.aspx?q=azure%20active%20directory%20connect&form=mssupport)

- Search the Microsoft Knowledge Base (KB) for technical solutions to common break-fix issues about Support for Azure AD Connect.

[Microsoft Azure Active Directory Forums](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WindowsAzureAD)

- You can search and browse for technical questions and answers from the community or ask your own question by clicking [here](https://social.msdn.microsoft.com/Forums/azure/en-US/newthread?category=windowsazureplatform&forum=WindowsAzureAD&prof=required).


[Azure AD Connect customer support](https://manage.windowsazure.com/?getsupport=true)

- Use this link to get support through the Azure portal.
