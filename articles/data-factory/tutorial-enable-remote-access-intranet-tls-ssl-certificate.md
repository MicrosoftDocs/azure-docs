---
title: Enable remote access from intranet with TLS/SSL certificate (Advanced)
description: This tutorial provides steps for setting up a self-hosted integration runtime with multiple on-premises machines and enabling remote access from intranet with TLS/SSL certificate (Advanced) to secure communication between integration runtime nodes.
author: lrtoyou1223
ms.author: lle
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.date: 08/10/2023
---

# Enable remote access from intranet with TLS/SSL certificate (Advanced)

In this tutorial, you will learn how to set up a self-hosted integration runtime with multiple on-premises machines and enable remote access from intranet with TLS/SSL certificate (Advanced) to secure communication between integration runtime nodes.

## Prerequisites

- An introduction to [SSL/TLS Strong Encryption](https://httpd.apache.org/docs/2.0/ssl/ssl_intro.html).
- Certificate could be a general TLS certificate for a Web Server. Requirements:
    - The certificate must be a publicly trusted X509 v3 certificate. We recommend that you use certificates that are issued by a public partner certification authority (CA).
    - Each integration runtime node must trust this certificate.
    - We recommend Subject Alternative Name (SAN) certificates because all the fully qualified domain names (FQDN) of integration runtime nodes are required to be secured by this certificate. (WCF TLS/SSL validate only check last DNS Name in SAN was fixed in .NET Framework 4.6.1. Refer to [Mitigation: X509CertificateClaimSet.FindClaims Method](/dotnet/framework/migration-guide/mitigation-x509certificateclaimset-findclaims-method?redirectedfrom=MSDN) for more information.)
    - Wildcard certificates (*) are not supported.
    - The certificate must have a private key (like PFX format).
    - The certificate can use any key size supported by Windows Server 2012 R2 for TLS/SSL certificates.
    - We only support CSP (Cryptographic Service Provider) certificate so far. Certificates that use CNG keys (Key Storage Provider) aren't supported.

## Steps

1. Run below PowerShell command on all machines to get their FQDNs:

    ```Powershell
    [System.Net.Dns]::GetHostByName("localhost").HostName
    ```
    For example, the FQDNs are **node1.domain.contoso.com** and **node2.domain.contoso.com**.

2. Generate a certificate with the FQDNs of all machines in Subject Alternative Name. 

    :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/generate-certificate-subject-alternative-name.png" alt-text="Screenshot that shows generating certificate in subject alternative name.":::
    
3. Install the certificate on all nodes to **Local Machine** -> **Personal** so that it can be selected on the integration runtime configuration manager:
    1. Click on the certificate and install it.
    1. Select **Local Machine** and enter the password.
    
        :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/select-local-machine.png" alt-text="Screenshot that shows selecting local machine.":::

    1. Select **Place all certificates in the following store**. Click **Browse**. Select **Personal**.
    1. Select **Finish** to install the certificate.

4. Enable remote access from intranet:
    1. 	During the self-hosted integration runtime node registration:
        1. Select **Enable remote access from intranet** and select **Next**.
        
           :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/enable-remote-access-intranet.png" alt-text="Screenshot that shows enabling remote access from intranet.":::

        1. Set the **Tcp Port** (8060 by default). Make sure the port is open on firewall.
        1. Click **Select**. In the pop-up window, choose the right certificate and select **Finish**.
        
            :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/select-certificate.png" alt-text="Screenshot that shows selecting certificate.":::

    1. After the self-hosted integration runtime node is registered:

        > [!Note] 
        > The self-hosted integration runtime can change the remote access settings only when it has **single node**, which is by design. Otherwise, the radio button cannot be checked.
        
        :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/enable-with-tls-ssl-certificate-advanced.png" alt-text="Screenshot that shows enabling with TLS/SSL certificate (Advanced).":::

        1. Go to self-hosted **Integration Runtime Configuration Manager** -> **Settings** -> **Remote access from intranet**. Click **Change**.
        1. Choose **Enable with TLS/SSL certificate (Advanced)**.
        1. Click **Select**. In the pop-up window, choose the right certificate and select **OK**.

            :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/choose-tls-ssl-certificate.png" alt-text="Screenshot that shows choosing certificate.":::

    1. Verify the remote access settings in self-hosted **Integration Runtime Configuration Manager**.
    
        :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/verify-remote-access-settings-1.png" alt-text="Screenshot that shows verifying the remote access settings in Self-hosted Integration Runtime Configuration Manager step 1.":::

        :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/verify-remote-access-settings-2.png" alt-text="Screenshot that shows verifying the remote access settings in Self-hosted Integration Runtime Configuration Manager step 2.":::

5. Using a self-signed certificate if you don’t have the publicly trusted certificate:
    1. Generate and export a self-signed certificate (this step can be skipped if you already have the certificate):
        1. Generate a self-signed certificate via PowerShell (with elevated privileges):
        
            ```Powershell
            New-SelfSignedCertificate -DnsName contoso.com, node1.domain.contoso.com, node2.domain.contoso.com -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider" -CertStoreLocation cert:\LocalMachine\My
            ```
        1. To export the generated certificate with a private key to a password protected PFX file, you will need its thumbprint. It can be copied from the results of `New-SelfSignedCertificate` command. For example, it is `CEB5B4372AA7BF877E56BCE27542F9F0A1AD197F`.
        1. Export the generated certificate with the private key via PowerShell (with elevated privileges):
        
            ```Powershell
            $CertPassword = ConvertTo-SecureString -String “Password” -Force -AsPlainText
            Export-PfxCertificate -Cert
            cert:\LocalMachine\My\CEB5B4372AA7BF877E56BCE27542F9F0A1AD197F -FilePath C:\self-signedcertificate.pfx -Password $CertPassword            
            ```
        1. You have exported the certificate with the private key to *C:\self-signedcertificate.pfx*.

    1. Install the certificate on all nodes to: **Local Machine** -> **Trusted Root Certification Authorities store**:
        1. Click on the certificate and install it.
        1. Select **Local Machine** and enter the password. 
        1. Select **Place all certificates in the following store**. Click Browse. Select **Trusted Root Certification Authorities**.
        1. Select **Finish** to install the certificate.
        
        :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/install-certificate-on-all-nodes.png" alt-text="Screenshot that shows install the certificate on all nodes.":::

6. Troubleshooting
    1. Verify the certificate exists in the target store:
        1. Follow this procedure [How to: View certificates with the MMC snap-in - WCF](/dotnet/framework/wcf/feature-details/how-to-view-certificates-with-the-mmc-snap-in#view-certificates-in-the-mmc-snap-in) to view Certificates (Local Computer) in the MMC snap-in.
        
           :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/view-certificates-mmc-snap-in.png" alt-text="Screenshot that shows viewing certificates in MMC snap in." lightbox="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/view-certificates-mmc-snap-in-expanded.png":::

        1. Confirm the certificate is installed in **Personal** and **Trusted Root Certification Authorities store** (If it is a self-signed certificate).

           :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/certificate-personal-trusted-root-certification-authorities.png" alt-text="Screenshot that shows the certificate installed in Personal and Trusted Root Certification Authorities store.":::

    1. Verify the certificate has a private key and isn’t expired.
    
        :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/verify-certificate.png" alt-text="Screenshot that shows verifying the certificate has a private key and isn’t expired.":::

    1. Make sure the service account for the self-hosted integration runtime (default account is **NT SERVICE\DIAHostService**) has read permission to the private keys of certificate:
        1. Right click on the certificate -> **All Tasks** -> **Manage Private Keys**.
        1. If no, grant the permission, **Apply** and save.
        
            :::image type="content" source="./media/tutorial-enable-remote-access-intranet-tls-ssl-certificate/ensure-read-permission-to-certificate-private-keys.png" alt-text="Screenshot that shows the Service account for the self-hosted integration runtime has read permission to the private keys of certificate.":::

