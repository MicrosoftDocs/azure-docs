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
	ms.date="05/19/2016"
	ms.author="billmath"/>


#Managing Federation Certificates for Office 365 and Azure AD

##Overview

In order for successful federation between Azure AD and AD FS, the certificates used by the RP trust should always be valid. Any mismatch can lead to the trust between AD FS and AAD be broken and therefore, it is important to ensure that Azure AD and AD FS are in sync with valid certificates for the trust. Office 365 will notify you via an email or a portal notification asking you to renew your certificate for Office 365 when your token signing certificates are nearing expiry. This article provides you the information required to ensure you to update your token signing certificates for O365 and Azure AD.

>[AZURE.IMPORTANT] Please be aware that authentication through your proxy may fail in Windows Server 2012 or Windows Server 2008 R2 after doing one of the following:
>
- Your proxy renews its trust token after certificates rollover in AD FS
- You manually replaced your AD FS certificates
>
A hotfix is available to fix this issue.  See [Authentication through proxy fails in Windows Server 2012 or Windows 2008 R2 SP1](http://support.microsoft.com/kb/3094446)

## Renew token signing certificate automatically (Recommended)

The token signing and token decrypting certificates are usually self-signed certificates and are good for one year. Default configuration of the AD FS regarding token signing and token decrypting certificates includes an auto-renewal process called **AutoCertificateRollover**. If you are using AD FS 2.0 or later, Office 365 and Azure AD will automatically update your certificate before it expires.  **You do not need to perform any manual steps or run a script as a scheduled task.**  For this to work, both of the following default AD FS configuration settings must be in effect:

**#1 The AD FS property AutoCertificateRollover must be set to True**

This indicates that AD FS will automatically generate new token signing and token decryption certificates before the old ones expire.

_How to check if AutoCertificateRollover is enabled:_

Verify that your AD FS installation is using automatic certificate rollover by executing the following command in a PowerShell command window on your primary federation server:

	PS C:\> Get-ADFSProperties

[Azure.Note] If you are using AD FS 2.0, you will need to run Add-Pssnapin Microsoft.Adfs.Powershell first.

In the resulting output, check for the following setting:
	
	AutoCertificateRollover :True

**#2 The AD FS federation metadata is publicly accessible**

Check that your federation metadata is publicly accessible by navigating to the following URL from a computer on the public internet (off of the corporate network):


https://(your_FS_name)/federationmetadata/2007-06/federationmetadata.xml

where `(your_FS_name) `is replaced with the federation service host name your organization uses, such as fs.contoso.com.  If you are able to verify both of these settings successfully, you do not have to do anything else.  

Example: https://fs.contoso.com/federationmetadata/2007-06/federationmetadata.xml 

## Renew token signing certifcate manually

You may chose to renew the token signing certificates manually. Some of the common scenarios where you might want to update the token signing certificates manually are:
* Token signing certificates are not self signed certitifcates. The most common reason for this is that your organization manages AD FS certificates enrolled from an organizational certificate authority. 
* Network security does not allow the federation metadata to be publically available.

In these scenarios, everytime you update the token signing certificates, you must update your Office 365 domain using the PowerShell command Update-MsolFederatedDomain also. 

### Steps to renew the token signing certificate and update O365 federation trust

**Step 1: Ensure that AD FS has new token signing certificates**

### Non-default configuration
If you are in a non-default configuration of AD FS where **AutoCertificateRollover** is set to **False** then you are probably using custom certificates (not self-signed). Please read [Guidance for customers not using AD FS self-signed certificates](https://msdn.microsoft.com/library/azure/JJ933264.aspx#BKMK_NotADFSCert) for comprehensive guidance on how to renew the AD FS token signing certificates.

### Federation metadata is not publicly available
On the other hand if **AutoCertificateRollover** is set to **True** but your federation metadata is not publicly accessible, then first make sure that new token signing certificates have been generated by AD FS. Follow the below steps to confirm you have new token signing certificates

1. verify that you are logged on to the primary AD FS server.
2. Check the current signing certificates in AD FS by opening a PowerShell command window and running the following command:

	PS C:\>Get-ADFSCertificate –CertificateType token-signing

[Azure.Note] If you are using AD FS 2.0, you will need to run Add-Pssnapin Microsoft.Adfs.Powershell first.


3. Look at the command output at any certificates listed.  If AD FS has generated a new certificate, you should see two certificates in the output:  One for which the IsPrimary value is True and the NotAfter date is within 5 days, and one for which IsPrimary is False and NotAfter is about a year in the future.

4. If you only see one certificate, and the NotAfter date is within 5 days, you need to generate a new certificate by executing the following steps.

5. To generate a new certificate, execute the following command at a PowerShell command prompt: `PS C:\>Update-ADFSCertificate –CertificateType token-signing`.

6. Verify the update by running the following command again: PS C:\>Get-ADFSCertificate –CertificateType token-signing

Two certificates should be listed now, one of which has a NotAfter date of approximately one year in the future and for which the IsPrimary value is False.

**Step 2: Update the new toke signing certificates for the O365 trust**

Follow the steps given below to update O365 with the new token signing certificates to be used for the trust.

1.	Open the Microsoft Azure Active Directory Module for Windows PowerShell.
2.	Run $cred=Get-Credential. When this cmdlet prompts you for credentials, type your cloud service administrator account credentials.
3.	Run Connect-MsolService –Credential $cred. This cmdlet connects you to the cloud service. Creating a context that connects you to the cloud service is required before running any of the additional cmdlets installed by the tool.
4.	If you are running these commands on a computer that is not the AD FS primary federation server, run Set-MSOLAdfscontext -Computer <AD FS primary server>, where <AD FS primary server> is the internal FQDN name of the primary AD FS server. This cmdlet creates a context that connects you to AD FS.
5.	Run Update-MSOLFederatedDomain –DomainName <domain>. This cmdlet updates the settings from AD FS into the cloud service and configures the trust relationship between the two.

>[AZURE.NOTE] If you need to support multiple top-level domains, such as contoso.com and fabrikam.com, you must use the SupportMultipleDomain switch with any cmdlets. For more information, see [Support for Multiple Top Level Domains](active-directory-aadconnect-multiple-domains.md).
Finally, ensure all Web Application Proxy servers are updated with [Windows Server May 2014](http://support.microsoft.com/kb/2955164) rollup, otherwise the proxies may fail to update themselves with the new certificate, resulting in an outage.
