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
ms.date: 03/22/2021
ms.subservice: hybrid
ms.author: billmath
---

# Emergency Rotation of the AD FS certificates
In the event that you need to rotate the AD FS certificates immediately, you can follow the steps outlined below in this section.

> [!IMPORTANT]
> Conducting the steps below in the AD FS environment will revoke the old certificates immediately.  Because this is done immediately, the normal time usually allowed for your federation partners to consume your new certificate is by-passed. It might result in a service outage as trusts update to use the new certificates.  This should resolve once all of the federation partners have the new certificates.

> [!IMPORTANT]
> Microsoft highly recommends using a Hardware Security Module (HSM) to protect and secure certificates.
> For more information see [Hardware Security Module](https://docs.microsoft.com/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#hardware-security-module-hsm) under best practices for securing AD FS.

## Summary of emergency rotation of AD FS certificates steps
The following table summarized the steps that are outlined below.

|Step|Name|Description|
|-----|-----|-----|
|1| [Determine your Token Signing Certificate thumbprint](#determine-your-token-signing-certificate-thumbprint)| Determine the thumbprint of your old token-signing certificate.|
|2|[Determine whether AD FS renews the certificates automatically](#determine-whether-ad-fs-renews-the-certificates-automatically)|Determine whether the AutoCertificateRollover property is set to TRUE or FALSE|
|3 a|[Generating new self-signed certificate if AutoCertificateRollover is set to TRUE](#generating-new-self-signed-certificate-if-autocertificaterollover-is-set-to-true)|Create new certificates if you have AutoCertificateRollover property set to TRUE|
|3 b|[Generating new certificates manually if AutoCertificateRollover is set to FALSE](#generating-new-certificates-manually-if-autocertificaterollover-is-set-to-false)|Import new certificates for users who use manually imported certificates and have the AutoCertificateRollover property set to FALSE|
|4|[Update Azure AD with the new token-signing certificate](#update-azure-ad-with-the-new-token-signing-certificate)|Send an update to Azure AD to use the new certificate|
|5|[Replace SSL certificates](#replace-ssl-certificates)|Update the SSL certificates used by AD FS and WAP servers|
|6|[Remove your old certificates](#remove-your-old-certificates)|Remove the old token-signing certificate.|
|7| [Updating federation partners who can consume Federation Metadata](#updating-federation-partners-who-can-consume-federation-metadata)|Information on federation partners|
|8|[Updating federation partners who can NOT consume Federation Metadata](#updating-federation-partners-who-can-not-consume-federation-metadata)|Information on federation partners|
|9|[Revoke refresh tokens via PowerShell](#revoke-refresh-tokens-via-powershell)|Revoke users refresh tokens and force them to re-logon|

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
In this section, you will be creating **two** token-signing certificates.  The first will use the **-urgent** flag, which will replace the current primary certificate immediately.  The second will be used for the secondary certificate.  

>[!IMPORTANT]
>The reason we are creating two certificates is because Azure holds on to information regarding the previous certificate.  By creating a second one, we are forcing Azure to release information about the old certificate and replace it with information about the second certificate.
>
>If you do not create the second certificate and update Azure with it, it may be possible for the  old token-signing certificate to authenticate users.

You can use the following steps to generate the new token-signing certificates.

 1. Ensure that you are logged on to the primary AD FS server.
 2. Open Windows PowerShell as an administrator. 
 3. Check to make sure that your AutoCertificateRollover is set to True.
`PS C:\>Get-AdfsProperties | FL AutoCert*, Certificate*`
 4. To generate a new token signing certificate: `Update-ADFSCertificate –CertificateType token-signing -Urgent`.
 5. Verify the update by running the following command: `Get-ADFSCertificate –CertificateType token-signing`
 6. Now generate the second token signing certificate: `Update-ADFSCertificate –CertificateType token-signing`.
 7. You can verify the update by running the following command again: `Get-ADFSCertificate –CertificateType token-signing`


## Generating new certificates manually if AutoCertificateRollover is set to FALSE
If you are not using the default automatically generated, self-signed token signing and token decryption certificates, you must renew and configure these certificates manually.  This involves creating two new token-signing certificates and importing them.  Then you promote one to primary, revoke the old certificate and configure the second certificate as the secondary certificate.

First, you must obtain a two new certificates from your certificate authority and import them into the local machine personal certificate store on each federation server. For instructions, see the [Import a Certificate](https://technet.microsoft.com/library/cc754489.aspx) article.

>[!IMPORTANT]
>The reason we are creating two certificates is because Azure holds on to information regarding the previous certificate.  By creating a second one, we are forcing Azure to release information about the old certificate and replace it with information about the second certificate.
>
>If you do not create the second certificate and update Azure with it, it may be possible for the  old token-signing certificate to authenticate users.

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
5. Once you promoted the new certificate as the primary certificate, you should remove the old certificate because it can still be used. See the [Remove your old certificates](#remove-your-old-certificates) section below.  

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

## Replace SSL certificates
In the event that you need to replace your token-signing certificate because of a compromise, you should also revoke and replace the SSL certificates for AD FS and your WAP servers.  

Revoking your SSL certificates must be done at the certificate authority (CA) that issued the certificate.  These certificates are often issued by 3rd party providers such as GoDaddy.  For an example, see (Revoke a certificate | SSL Certificates - GoDaddy Help US).  For more information see [How Certificate Revocation Works](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee619754(v=ws.10)?redirectedfrom=MSDN).

Once the old SSL certificate has been revoked and a new one issued, you can replacing the SSL certificates. For more information see [Replacing the SSL certificate for AD FS](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/manage-ssl-certificates-ad-fs-wap#replacing-the-ssl-certificate-for-ad-fs).


## Remove your old certificates
Once you have replaced your old certificates, you should remove the old certificate because it can still be used. . To do this, follow the steps below:.  To do this, follow the steps below:

1. Ensure that you are logged on to the primary AD FS server.
2. Open Windows PowerShell as an administrator. 
4. To remove the old token signing certificate: `Remove-ADFSCertificate –CertificateType token-signing -thumbprint <thumbprint>`.

## Updating federation partners who can consume Federation Metadata
If you have renewed and configure a new token signing or token decryption certificate, you must make sure that the all your federation partners (resource organization or account organization partners that are represented in your AD FS by relying party trusts and claims provider trusts) have picked up the new certificates.

## Updating federation partners who can NOT consume Federation Metadata
If your federation partners cannot consume your federation metadata, you must manually send them the public key of your new token-signing / token-decrypting certificate. Send your new certificate public key (.cer file or .p7b if you wish to include the entire chain) to all of your resource organization or account organization partners (represented in your AD FS by relying party trusts and claims provider trusts). Have the partners implement changes on their side to trust the new certificates.



## Revoke refresh tokens via PowerShell
Now we want to revoke refresh tokens for users who may have them and force them to re-logon and get new tokens.  This will log users out of their phone, current webmail sessions, along with other items that are using Tokens and Refresh Tokens.  Information can be found [here](https://docs.microsoft.com/powershell/module/azuread/revoke-azureaduserallrefreshtoken?view=azureadps-2.0&preserve-view=true) and you can also reference how to [Revoke user access in Azure Active Directory](../../active-directory/enterprise-users/users-revoke-access.md).

## Next steps

- [Managing SSL Certificates in AD FS and WAP in Windows Server 2016](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/manage-ssl-certificates-ad-fs-wap#replacing-the-ssl-certificate-for-ad-fs)
- [Obtain and Configure Token Signing and Token Decryption Certificates for AD FS](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn781426(v=ws.11)#updating-federation-partners)
- [Renew federation certificates for Microsoft 365 and Azure Active Directory](how-to-connect-fed-o365-certs.md)



















