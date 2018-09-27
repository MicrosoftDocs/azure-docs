---
title: Prepare for extension host for Azure Stack | Microsoft Docs
description: Learn to prepare for extension host, which is automatically enabled via a future Azure Stack Update package.
services: azure-stack
keywords: 
author: mattbriggs
ms.author: mabrigg
ms.date: 09/26/2018
ms.topic: article
ms.service: azure-stack
ms.reviewer: thoroet
manager: femila
---

# Prepare for extension host for Azure Stack

The Extension host secures Azure Stack by reducing the number of required TCP/IP ports. This article looks at preparing Azure Stack for the extension host, which is automatically enabled through an Azure Stack Update package after the 1808 update.

## Certificate requirements

The extension host implements two new domains namespaces to guarantee unique host entries for each portal extension. The new domain namespaces require two additional wild-card certificates to ensure secure communication.

The table shows the new namespaces and the associated certificates:

| Deployment Folder | Required certificate subject and subject alternative names (SAN) | Scope (per region) | SubDomain namespace |
|-----------------------|------------------------------------------------------------------|-----------------------|------------------------------|
| Admin extension host | *.adminhosting.\<region>.\<fqdn> (Wildcard SSL Certificates) | Admin extension host | adminhosting.\<region>.\<fqdn> |
| Public extension host | *.hosting.\<region>.\<fqdn> (Wildcard SSL Certificates) | Public extension host | hosting.\<region>.\<fqdn> |

The detailed certificate requirements can be found in the [Azure Stack public key infrastructure certificate requirements](azure-stack-pki-certs.md) article.

## Create certificate signing request

The Azure Stack Readiness Checker Tool provides the ability to create a certificate signing request for the two new, required SSL certificates. Follow the steps in the article [Azure Stack certificates signing request generation](azure-stack-get-pki-certs.md).

> [!Note]  
> You may skip this step depending on how you requested your SSL certificates.

## Validate new certificates

1. Open PowerShell with elevated permission on the hardware lifecycle host or the Azure Stack management workstation.
2. Run the following cmdlet to install the Azure Stack Readiness Checker tool.

    ```PowerShell  
    Install-Module -Name Microsoft.AzureStack.ReadinessChecker
    ```

3. Run the following script to create the required folder structure:

    ```PowerShell  
    New-Item C:\Certificates -ItemType Directory

    $directories = 'ACSBlob','ACSQueue','ACSTable','Admin Portal','ARM Admin','ARM Public','KeyVault','KeyVaultInternal','Public Portal', 'Admin extension host', 'Public extension host'

    $destination = 'c:\certificates'

    $directories | % { New-Item -Path (Join-Path $destination $PSITEM) -ItemType Directory -Force}
    ```

    > [!Note]  
    > If you deploy with Azure Active Directory Federated Services (AD FS) the following directories must be added to **$directories** in the script: `ADFS`, `Graph`.

4. Run the following cmdlets to start the certificate check:

    ```PowerShell  
    $pfxPassword = Read-Host -Prompt "Enter PFX Password" -AsSecureString 

    Start-AzsReadinessChecker -CertificatePath c:\certificates -pfxPassword $pfxPassword -RegionName east -FQDN azurestack.contoso.com -IdentitySystem AAD -ExtensionHostFeature
    ```

5. Place your certificate(s) in the appropriate directories.

6. Check the output and all certificates pass all tests.


## Import extension host certificates

Use a computer that can connect to the Azure Stack privileged endpoint for the next steps. Make sure you have access to the new certificate files from that computer.

1. Use a computer that can connect to the Azure Stack privileged endpoint for the next steps. Make sure you access to the new certificate files from that computer.
2. Open PowerShell ISE to execute the next script blocks
3. Import the certificate for hosting endpoint. Adjust the script to match your environment.
4. Import the certificate for the Admin hosting endpoint.

    ```PowerShell  

    $CertPassword = read-host -AsSecureString -prompt "Certificate Password"

    $CloudAdminCred = Get-Credential -UserName <Privileged endpoint credentials> -Message "Enter the cloud domain credentials to access the privileged endpoint."

    [Byte[]]$AdminHostingCertContent = [Byte[]](Get-Content c:\certificate\myadminhostingcertificate.pfx -Encoding Byte)

    Invoke-Command -ComputerName <PrivilegedEndpoint computer name> `
    -Credential $CloudAdminCred `
    -ConfigurationName "PrivilegedEndpoint" `
    -ArgumentList @($AdminHostingCertContent, $CertPassword) `
    -ScriptBlock {
            param($AdminHostingCertContent, $CertPassword)
            Import-AdminHostingServiceCert $AdminHostingCertContent $certPassword
    }
    ```
5. Import the certificate for the hosting endpoint.
    ```PowerShell  
    $CertPassword = read-host -AsSecureString -prompt "Certificate Password"

    $CloudAdminCred = Get-Credential -UserName <Privileged endpoint credentials> -Message "Enter the cloud domain credentials to access the privileged endpoint."

    [Byte[]]$HostingCertContent = [Byte[]](Get-Content c:\certificate\myhostingcertificate.pfx  -Encoding Byte)

    Invoke-Command -ComputerName <PrivilegedEndpoint computer name> `
    -Credential $CloudAdminCred `
    -ConfigurationName "PrivilegedEndpoint" `
    -ArgumentList @($HostingCertContent, $CertPassword) `
    -ScriptBlock {
            param($HostingCertContent, $CertPassword)
            Import-UserHostingServiceCert $HostingCertContent $certPassword
    }
    ```



### Update DNS configuration

> [!Note]  
> This step is not required if you used DNS Zone delegation for DNS Integration.
If individual host A records have been configured to publish Azure Stack endpoints, you need to create two additional host A records:

| IP | Hostname | Type |
|----|------------------------------|------|
| \<IP> | Adminhosting.<Region>.<FQDN> | A |
| \<IP> | Hosting.<Region>.<FQDN> | A |

Allocated IPs can be retrieved using privileged endpoint by running the cmdlet **Get-AzureStackStampInformation**.

### Ports and protocols

The article, [Azure Stack datacenter integration - Publish endpoints](azure-stack-integrate-endpoints.md), covers the ports and protocols that require inbound communication to publish Azure Stack before the extension host rollout.

### Publish new endpoints

There are two new endpoints required to be published through your firewall. The allocated IPs from the public VIP pool can be retrieved using the cmdlet **Get-AzureStackStampInformation**.

> [!Note]  
> Make this change before enabling the extension host. This allows the Azure Stack portals to be continuously accessible.

| Endpoint (VIP) | Protocol | Ports |
|----------------|----------|-------|
| AdminHosting | HTTPS | 443 |
| Hosting | HTTPS | 443 |

### Update existing publishing Rules (Post enablement of extension host)

> [!Note]  
> The 1808 Azure Stack Update Package does **not** enable extension host yet. It allows to prepare for extension host by importing the required certificates. Do not close any ports before extension host is automatically enabled through an Azure Stack Update package after the 1808 update.

The following existing endpoint ports must be closed in your existing firewall rules.

> [!Note]  
> It is recommended to close those ports after successful validation.

| Endpoint (VIP) | Protocol | Ports |
|----------------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------|
| Portal (administrator) | HTTPS | 12495<br>12499<br>12646<br>12647<br>12648<br>12649<br>12650<br>13001<br>13003<br>13010<br>13011<br>13020<br>13021<br>13026<br>30015 |
| Portal (user) | HTTPS | 12495<br>12649<br>13001<br>13010<br>13011<br>13020<br>13021<br>30015<br>13003 |
| Azure Resource Manager (administrator) | HTTPS | 30024 |
| Azure Resource Manager (user) | HTTPS | 30024 |

## Next steps

- Learn about [Firewall integration](azure-stack-firewall.md).
- Learn about [Azure Stack certificates signing request generation](azure-stack-get-pki-certs.md)
