---
title: Emergency Rotation of the AD FS certificates | Microsoft Docs
description: This article explains how to revoke and update AD FS certificates immediately.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/22/2020
ms.subservice: hybrid
ms.author: billmath
---

# Emergency Rotation of the AD FS certificates
In the event that you need to rotate the AD FS certificates immediately, you can follow the steps outlined below in this section.

> [!IMPORTANT]
> Conducting the steps below in the AD FS environment will revoke the old certifciates immediately.  Because this is done immediately, the normal time usually allowed for your federation partners to consume your new certificate is by-passed. It might result in a service outage as trusts update to use the new certificates.  This should resolve once all of the federation partners have the new certificates.

> [!IMPORTANT]
> Microsoft highly recommends using a Hardware Security Module (HSM) to protect and secure certificates.
> For more information see [Hardware Security Module](https://docs.microsoft.com/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#hardware-security-module-hsm) under best practices for securing AD FS.

## Determine your Token Signing Certificate thumbprint
In order to revoke the old Token Signing Certificate which AD FS is currently using, you need to determine the thumbprint of the token-sigining certificate.  To do this, use the following steps below:

 1.	Connect to the Microsoft Online Service
`PS C:\>Connect-MsolService`
 2.	Document both your on-premise and cloud Token Signing Certificate thumbprint and expiration dates.
`PS C:\>Get-MsolFederationProperty -DomainName <domain>` 
 3.  Copy down the the thumbprint.  It will be used later to remove the existing certificates.

You can also get the thumbprint by using AD FS Management, navigating to Service/Certificates, right-clicking on the certificate, select View certificate and then selecting Details. 

## Determine whether AD FS renews the certificates automatically
By default, AD FS is configured to generate token signing and token decryption certificates automatically, both at the initial configuration time and when the certificates are approaching their expiration date.

You can run the following Windows PowerShell command: `PS C:\>Get-AdfsProperties | FL AutoCert*, Certificate*`.

The AutoCertificateRollover property describes whether AD FS is configured to renew token signing and token decrypting certificates automatically.  If AutoCertificateRollover is set to TRUE, follow the instructions outlined below in [Generating new self-signed certificate if AutoCertificateRollover is set to TRUE].  If If AutoCertificateRollover is set to FALSE, follow the instructions outlined below in [Generating new certificates manually if AutoCertificateRollover is set to FALSE]


## Generating new self-signed certificate if AutoCertificateRollover is set to TRUE
In this section, you will be creating **two** token-signing certificates.  The first will use the **-urgent** flag, which will replace the current primary certificate immediately.  The second will be used for the secondary certificate.  You can use the following steps to generate a new self-signed token signing and token decryption certificates.

1. Ensure that you are logged on to the primary AD FS server.
2. Open Windows PowerShell as an administrator. 
3. Check to make sure that your AutoCertificateRollover is set to True.
`PS C:\>Get-AdfsProperties | FL AutoCert*, Certificate*`
 If it is not, you can set it with this command:
`PS C:\>Set-ADFSProperties -AutoCertificateRollover $true`
4. To generate a new token signing certificate: `Update-ADFSCertificate –CertificateType token-signing -Urgent`.
5. Verify the update by running the following command again: `Get-ADFSCertificate –CertificateType token-signing`
6. To generate a new token signing certificate: `Update-ADFSCertificate –CertificateType token-signing`.

>[!IMPORTANT]
>You need to allow enough time for your federation partners to consume your new certificate (either they pull your federation metadata or you send them the public key of your new certificate) prior to promoting it to the primary certificate.



## Generating new certificates manually if AutoCertificateRollover is set to FALSE
If you are not using the default automatically generated, self-signed token signing and token decryption certificates, you must renew and configure these certificates manually.  This involves creating two new token-signing certificates and importing them.  Then you promote one to primary, revoke the old certificate and configure the second certificate as the secondary certificate.

First, you must obtain a two new certificates from your certificate authority and import them into the local machine personal certificate store on each federation server. For instructions, see the [Import a Certificate](https://technet.microsoft.com/library/cc754489.aspx) article.

### To configure a new certificate as a secondary certificate
Then you must configure one certificate as the secondary AD FS token signing or decryption certificate and then promote it to the primary

1. Once you have imported the certificate. Open the **AD FS Management** console.
2. Expand **Service** and then select **Certificates**.
3. In the Actions pane, click **Add Token-Signing Certificate**.
4. Select the new certificate from the list of displayed certificates, and then click OK.

### To promote the new certificate from secondary to primary
Now that the new certificate has been imported and configured in AD FS, you need to set as the primary certificate.
1. Open the **AD FS Management** console.
2. Expand **Service** and then select **Certificates**.
3. Click the secondary token signing certificate.
4. In the **Actions** pane, click **Set As Primary**. Click Yes at the confirmation prompt.

### Revoke the old certificate
Once you use `Update-ADFSCertificate –CertificateType <type> -Urgent` the new certificate will become the primary certificate.  However, we still want to remove the old certificate because it can still be used.  To do this, follow the steps below:

### To configure the second certificate as a secondary certificate
Now that you have added the first certificate and made it primary and removed the old one, import the second certificate.  Then you must configure the certificate as the secondary AD FS token signing certificate

1. Once you have imported the certificate. Open the **AD FS Management** console.
2. Expand **Service** and then select **Certificates**.
3. In the Actions pane, click **Add Token-Signing Certificate**.
4. Select the new certificate from the list of displayed certificates, and then click OK.

## Update Azure AD with the new token-signing certificate
Open the Microsoft Azure Active Directory Module for Windows PowerShell. Alternatively, open Windows PowerShell and then run the command `Import-Module msonline`

Connect to Azure AD by run the following command: `Connect-MsolService`, and then, enter your global administrator credentials.

>[!Note]
> If you are running these commands on a computer that is not the primary federation server, enter the following command first: `Set-MsolADFSContext –Computer <servername>`. Replace <servername> with the name of the AD FS server. Then enter the administrator credentials for the AD FS server when prompted.

Optionally, verify whether an update is required by checking the current certificate information in Azure AD. To do so, run the following command: `Get-MsolFederationProperty`. Enter the name of the Federated domain when prompted.

To update the certificate information in Azure AD, run the following command: `Update-MsolFederatedDomain` and then enter the domain name when prompted.

>[!Note]
> If you see an error when running this command, run the following command: Update-MsolFederatedDomain –SupportMultipleDomain, and then enter the domain name when prompted.


## Updating federation partners who can consume Federation Metadata
If you have renewed and configure a new token signing or token decryption certificate, you must make sure that the all your federation partners (resource organization or account organization partners that are represented in your AD FS by relying party trusts and claims provider trusts) have picked up the new certificates.

## Updating federation partners who can NOT consume Federation Metadata
If your federation partners cannot consume your federation metadata, you must manually send them the public key of your new token-signing / token-decrypting certificate. Send your new certificate public key (.cer file or .p7b if you wish to include the entire chain) to all of your resource organization or account organization partners (represented in your AD FS by relying party trusts and claims provider trusts). Have the partners implement changes on their side to trust the new certificates.

## Replace SSL certificates
For information on updating and replaceing the SSL certificates, see [Replacing the SSL certificate for AD FS](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/manage-ssl-certificates-ad-fs-wap#replacing-the-ssl-certificate-for-ad-fs)

## Remove your old certificates
Once you use `Update-ADFSCertificate –CertificateType <type> -Urgent` the new certificate will become the primary certificate.  However, we still want to remove the old certificate because it can still be used.  To do this, follow the steps below:

1. Ensure that you are logged on to the primary AD FS server.
2. Open Windows PowerShell as an administrator. 
4. To remove the old token signing certificate: `Remove-ADFSCertificate –CertificateType token-signing -thumbprint <thumbprint>`.

## Revoke refresh tokens via PowerShell
Now we want to revoke refresh tokens for users who may have them and force them to re-logon and get new tokens.  This will log users out of their phone, current webmail sessions, along with other items that are using Tokens and Refresh Tokens.  Information can be found [here](https://docs.microsoft.com/powershell/module/azuread/revoke-azureaduserallrefreshtoken?view=azureadps-2.0&preserve-view=true) and you can also reference how to [Revoke user access in Azure Active Directory](../../active-directory/enterprise-users/users-revoke-access.md).

## Next steps

- [Managing SSL Certificates in AD FS and WAP in Windows Server 2016](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/manage-ssl-certificates-ad-fs-wap#replacing-the-ssl-certificate-for-ad-fs)
- [Obtain and Configure Token Signing and Token Decryption Certificates for AD FS](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn781426(v=ws.11)#updating-federation-partners)
- [Renew federation certificates for Microsoft 365 and Azure Active Directory](how-to-connect-fed-o365-certs.md)



















