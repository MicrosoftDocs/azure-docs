---
title: Emergency rotation of the AD FS certificates
description: This article explains how to revoke and update AD FS certificates immediately.
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
---

# Emergency rotation of the AD FS certificates

If you need to rotate the Active Directory Federation Services (AD FS) certificates immediately, you can follow the steps in this section.

> [!IMPORTANT]
> Rotating certificates in the AD FS environment revokes the old certificates immediately, and the time it usually takes for your federation partners to consume your new certificate is bypassed. The action might also result in a service outage as trusts update to use the new certificates. The outage should be resolved after all the federation partners have the new certificates.

> [!NOTE]
> We highly recommend that you use a Hardware Security Module (HSM) to protect and secure certificates.
> For more information, see the [Hardware Security Module](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#hardware-security-module-hsm) section in the best practices for securing AD FS.

## Determine your Token Signing Certificate thumbprint

To revoke the old Token Signing Certificate that AD FS is currently using, you need to determine the thumbprint of the token-signing certificate. Do the following:

1. Connect to the Microsoft Online Service by running `PS C:\>Connect-MsolService`.

1. Document both your on-premises and cloud Token Signing Certificate thumbprint and expiration dates by running `PS C:\>Get-MsolFederationProperty -DomainName <domain>`.
1. Copy down the thumbprint. You'll use it later to remove the existing certificates.

You can also get the thumbprint by using AD FS Management. Go to **Service** > **Certificates**, right-click the certificate, select **View certificate**, and then select **Details**.

## Determine whether AD FS renews the certificates automatically
By default, AD FS is configured to generate token signing and token decryption certificates automatically. It does so both during the initial configuration and when the certificates are approaching their expiration date.

You can run the following PowerShell command: `Get-AdfsProperties | FL AutoCert*, Certificate*`.

The `AutoCertificateRollover` property describes whether AD FS is configured to renew token signing and token decrypting certificates automatically. Do either of the following:

* If `AutoCertificateRollover` is set to `TRUE`, [generate a new self-signed certificate](#if-autocertificaterollover-is-set-to-true-generate-a-new-self-signed-certificate). 
* If `AutoCertificateRollover` is set to `FALSE`, [generate new certificates manually](#if-autocertificaterollover-is-set-to-false-generate-new-certificates-manually).


## If AutoCertificateRollover is set to TRUE, generate a new self-signed certificate 

In this section, you create *two* token-signing certificates. The first uses the `-urgent` flag, which replaces the current primary certificate immediately. The second is used for the secondary certificate.

>[!IMPORTANT]
> You're creating two certificates because Azure holds on to information about the previous certificate. By creating a second one, you're forcing Azure to release information about the old certificate and replace it with information about the second one.
>
>If you don't create the second certificate and update Azure with it, it might be possible for the old token-signing certificate to authenticate users.

To generate the new token-signing certificates, do the following:

1. Ensure that you're logged in to the primary AD FS server.
1. Open Windows PowerShell as an administrator.
1. Make sure that `AutoCertificateRollover` is set to `True` by running:

   `PS C:\>Get-AdfsProperties | FL AutoCert*, Certificate*`

1. To generate a new token signing certificate, run: 

   `Update-ADFSCertificate –CertificateType token-signing -Urgent`

1. Verify the update by running: 

   `Get-ADFSCertificate –CertificateType token-signing`

1. Now generate the second token signing certificate by running:    

   `Update-ADFSCertificate –CertificateType token-signing`

1. You can verify the update by running the following command again: 
   
   `Get-ADFSCertificate –CertificateType token-signing`


## If AutoCertificateRollover is set to FALSE, generate new certificates manually

If you're not using the default automatically generated, self-signed token signing and token decryption certificates, you must renew and configure these certificates manually. Doing so involves creating two new token-signing certificates and importing them. Then, you promote one to primary, revoke the old certificate, and configure the second certificate as the secondary certificate.

First, you must obtain two new certificates from your certificate authority and import them into the local machine personal certificate store on each federation server. For instructions, see [Import a Certificate](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754489(v=ws.11)).

>[!IMPORTANT]
>You're creating two certificates because Azure holds on to information about the previous certificate. By creating a second one, you're forcing Azure to release information about the old certificate and replace it with information about the second one.
>
>If you don't create the second certificate and update Azure with it, it might be possible for the old token-signing certificate to authenticate users.

### Configure a new certificate as a secondary certificate

Next, configure one certificate as the secondary AD FS token signing or decryption certificate and then promote it to the primary.

1. After you've imported the certificate, open the **AD FS Management** console.

1. Expand **Service**, and then select **Certificates**.
1. On the **Actions** pane, select **Add Token-Signing Certificate**.
1. Select the new certificate from the list of displayed certificates, and then select **OK**.

### Promote the new certificate from secondary to primary

Now that you've imported the new certificate and configured it in AD FS, you need to set it as the primary certificate.

1. Open the **AD FS Management** console.

1. Expand **Service**, and then select **Certificates**.
1. Select the secondary token signing certificate.
1. On the **Actions** pane, select **Set As Primary**. At the prompt, select **Yes**.
1. After you've promoted the new certificate as the primary certificate, you should remove the old certificate because it can still be used. For more information, see the [Remove your old certificates](#remove-your-old-certificates) section.

### To configure the second certificate as a secondary certificate
Now that you've added the first certificate, made it primary, and removed the old one, you can import the second certificate. Configure the certificate as the secondary AD FS token signing certificate by doing the following:

1. After you've imported the certificate, open the **AD FS Management** console.

1. Expand **Service**, and then select **Certificates**.
1. On the **Actions** pane, select **Add Token-Signing Certificate**.
1. Select the new certificate from the list of displayed certificates, and then select **OK**.

<a name='update-azure-ad-with-the-new-token-signing-certificate'></a>

## Update Microsoft Entra ID with the new token-signing certificate

1. Open the Azure AD PowerShell module. Alternatively, open Windows PowerShell, and then run the `Import-Module msonline` command.

1. Connect to Microsoft Entra ID by running the following command: 

   `Connect-MsolService`
   
1. Enter your Hybrid Identity Administrator credentials.

    > [!Note]
    > If you're running these commands on a computer that isn't the primary federation server, enter the following command first: 
    >
    >   `Set-MsolADFSContext –Computer <servername>`
    >
    > Replace \<servername\> with the name of the AD FS server and then, at the prompt, enter the administrator credentials for the AD FS server.

1. Optionally, verify whether an update is required by checking the current certificate information in Microsoft Entra ID. To do so, run the following command: `Get-MsolFederationProperty`. Enter the name of the Federated domain when prompted.

1. To update the certificate information in Microsoft Entra ID, run the following command: `Update-MsolFederatedDomain` and then enter the domain name when prompted.

    > [!Note]
    > If you receive an error when you run this command, run `Update-MsolFederatedDomain –SupportMultipleDomain` and then, at the prompt, enter the domain name.

## Replace SSL certificates

If you need to replace your token-signing certificate because of a compromise, you should also revoke and replace the Secure Sockets Layer (SSL) certificates for AD FS and your Web Application Proxy (WAP) servers.

Revoking your SSL certificates must be done at the certificate authority (CA) that issued the certificate. These certificates are often issued by third-party providers, such as GoDaddy. For an example, see [Revoke a certificate | SSL Certificates - GoDaddy Help US](https://www.godaddy.com/help/revoke-a-certificate-4747). For more information, see [How certificate revocation works](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee619754(v=ws.10)).

After the old SSL certificate has been revoked and a new one issued, you can replace the SSL certificates. For more information, see [Replace the SSL certificate for AD FS](/windows-server/identity/ad-fs/operations/manage-ssl-certificates-ad-fs-wap#replacing-the-ssl-certificate-for-ad-fs).

## Remove your old certificates
After you've replaced your old certificates, you should remove the old certificate because it can still be used. To do so:

1. Ensure that you're logged in to the primary AD FS server.
1. Open Windows PowerShell as an administrator.
1. To remove the old token signing certificate, run: 

   `Remove-ADFSCertificate –CertificateType token-signing -thumbprint <thumbprint>`

## Update federation partners who can consume federation metadata
If you've renewed and configure a new token signing or token decryption certificate, you must make sure that all your federation partners have picked up the new certificates. This list includes resource organization or account organization partners that are represented in AD FS by relying party trusts and claims provider trusts. 

## Update federation partners who can't consume federation metadata
If your federation partners can't consume your federation metadata, you must manually send them the public key of your new token-signing / token-decrypting certificate. Send your new certificate public key (.cer file or .p7b if you want to include the entire chain) to all your resource organization or account organization partners (represented in your AD FS by relying party trusts and claims provider trusts). Have the partners implement changes on their side to trust the new certificates.



## Revoke the refresh tokens via PowerShell
Now you want to revoke the refresh tokens for users who might have them and force them to log in again and get new tokens. This logs users out of their phones, current webmail sessions, and other places that are using tokens and refresh tokens. For more information, see [Revoke-AzureADUserAllRefreshToken](/powershell/module/azuread/revoke-azureaduserallrefreshtoken?preserve-view=true&view=azureadps-2.0). Also see [Revoke user access in Microsoft Entra ID](../../enterprise-users/users-revoke-access.md).

## Next steps

- [Manage SSL certificates in AD FS and WAP in Windows Server 2016](/windows-server/identity/ad-fs/operations/manage-ssl-certificates-ad-fs-wap#replacing-the-ssl-certificate-for-ad-fs)
- [Obtain and configure token signing and token decryption certificates for AD FS](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn781426(v=ws.11)#updating-federation-partners)
- [Renew federation certificates for Microsoft 365 and Microsoft Entra ID](how-to-connect-fed-o365-certs.md)
