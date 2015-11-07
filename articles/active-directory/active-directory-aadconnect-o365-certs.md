<properties
	pageTitle="Certificate renewal guidance for Office 365 and Azure AD users. | Microsoft Azure"
	description="This article explains to Office 365 users how to resolve issues with emails that notify them about renewing a certificate."
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
	ms.date="10/13/2015"
	ms.author="billmath"/>


# Renewing Federation Certificates for Office 365 and Azure AD

If you received an email or a portal notification asking you to renew your certificate for Office 365, this article is intended to help you resolve the issue and keep it from happening again.  This article assumes that you are using AD FS as your federation server.

## Check to see if you have to do anything

If you are using AD FS 2.0 or later, Office 365 and Azure AD will automatically update your certificate before it expires.  You do not need to perform any manual steps or run a script as a scheduled task.  For this to work, both of the following default AD FS configuration settings must be in effect:

- The AD FS property AutoCertificateRollover must be set to True, indicating that AD FS will automatically generate new token signing and token decryption certificates before the old ones expire.
	- If the value is False, you are using custom certificate settings.  Go [here](https://msdn.microsoft.com/library/azure/JJ933264.aspx#BKMK_NotADFSCert)  for comprehensive guidance.
- Your federation metadata must be available to the public internet.

	Here is how to check:

	- Verify that your AD FS installation is using automatic certificate rollover by executing the following command in a PowerShell command window on your primary federation server:

	`PS C:\> Get-ADFSProperties`

(note that if you are using AD FS 2.0, you will need to run Add-Pssnapin Microsoft.Adfs.Powershell first)
else.

Check that your federation metadata is publicly accessible by navigating to the following URL from a computer on the public internet (off of the corporate network):


https://(your_FS_name)/federationmetadata/2007-06/federationmetadata.xml

where `(your_FS_name) `is replaced with the federation service host name your organization uses, such as fs.contoso.com.  If you are able to verify both of these settings successfully, you do not have to do anything else.  

Example: https://fs.contos.com/federationmetadata/2007-06/federationmetadata.xml

## If your AutoCertificateRollover property is set to False

If your AutoCertificateRollover property is set to False, you are using non-default AD FS certificate settings.  The most common reason for this is that your organization manages AD FS certificates enrolled from an organizational certificate authority.  In this case you need to renew and update your certificates yourself.  Use the guidance [here](https://msdn.microsoft.com/library/azure/JJ933264.aspx#BKMK_NotADFSCert).

## If your metadata is not publicly accessible
If your AutocertificateRollover setting is True but your federation metadata is not publicly available, use the procedure below to ensure your certificates are updated both on premises and in the cloud:

### Verify that your AD FS system has generated a new certificate.

- verify that you are logged on to the primary AD FS server.
- Check the current signing certificates in AD FS by opening a PowerShell command window and running the following command:

`PS C:\>Get-ADFSCertificate –CertificateType token-signing.`

(note that if you are using AD FS 2.0, you will need to run Add-Pssnapin Microsoft.Adfs.Powershell first)


- Look at the command output at any certificates listed.  If AD FS has generated a new certificate, you should see two certificates in the output:  One for which the IsPrimary value is True and the NotAfter date is within 5 days, and one for which IsPrimary is False and NotAfter is about a year in the future.

- If you only see one certificate, and the NotAfter date is within 5 days, you need to generate a new certificate by executing the following steps.

- To generate a new certificate, execute the following command at a PowerShell command prompt: `PS C:\>Update-ADFSCertificate –CertificateType token-signing`.

- Verify the update by running the following command again: PS C:\>Get-ADFSCertificate –CertificateType token-signing
- Next, to manually update Office 365 federation trust properties, follow these steps.

Two certificates should be listed now, one of which has a NotAfter date of approximately one year in the future and for which the IsPrimary value is False.


### Manually update Office 365 federation trust properties, follow these steps.

1.	Open the Microsoft Azure Active Directory Module for Windows PowerShell.
2.	Run $cred=Get-Credential. When this cmdlet prompts you for credentials, type your cloud service administrator account credentials.
3.	Run Connect-MsolService –Credential $cred. This cmdlet connects you to the cloud service. Creating a context that connects you to the cloud service is required before running any of the additional cmdlets installed by the tool.
4.	If you are running these commands on a computer that is not the AD FS primary federation server, run Set-MSOLAdfscontext -Computer <AD FS primary server>, where <AD FS primary server> is the internal FQDN name of the primary AD FS server. This cmdlet creates a context that connects you to AD FS.
5.	Run Update-MSOLFederatedDomain –DomainName <domain>. This cmdlet updates the settings from AD FS into the cloud service and configures the trust relationship between the two.

>[AZURE.NOTE] If you need to support multiple top-level domains, such as contoso.com and fabrikam.com, you must use the SupportMultipleDomain switch with any cmdlets. For more information, see Support for Multiple Top Level Domains.
Finally, ensure all Web Application Proxy servers are updated with [Windows Server May 2014](http://support.microsoft.com/kb/2955164) rollup, otherwise the proxies may fail to update themselves with the new certificate, resulting in an outage.
