---
title: Prepare for extension host for Azure Stack | Microsoft Docs
description: Learn to prepare for extension host which is automatically enabled via a future Azure Stack Update package.
services: azure-stack
keywords: 
author: mattbriggs
ms.author: mabrigg
ms.date: 08/28/2018
ms.topic: article
ms.service: azure-stack
ms.reviewer: thoroet
manager: femila
---

# Prepare for extension host for Azure Stack

You can use the extension host to help secure Azure Stack by reducing the number of required TCP/IP ports. This article looks at preparing Azure Stack for the extension host, which is automatically enabled through the Azure Stack Update package for 1808 or later.

## Certificate requirements

The extension host implements two new domains namespaces to guarantee unique host entries for each portal extension. The new domain namespaces require two additional wild-card certificates to ensure secure communication.

The table shows the new namespaces and the associated certificates:

| Deployment Folder | Required certificate subject and subject alternative names (SAN) | Scope (per region) | SubDomain namespace |
|-----------------------|------------------------------------------------------------------|-----------------------|------------------------------|
| Admin extension host | *.adminhosting.<region>.<fqdn> (Wildcard SSL Certificates) | Admin extension host | adminhosting.<region>.<fqdn> |
| Public extension host | *.hosting.<region>.<fqdn> (Wildcard SSL Certificates) | Public extension host | hosting.<region>.<fqdn> |

The detailed certificate requirements can be found in the [Azure Stack public key infrastructure certificate requirements](azure-stack-pki-certs.md) article.

## Create certificate signing request

The Azure Stack Readiness Checker Tool provides the ability to create a certificate signing request for the two new, required SSL certificates. Follow the steps in the article [Azure Stack certificates signing request generation](azure-stack-get-pki-certs.md).

> [!Note]  
> You may skip this step depending on your your request your SSL certificates.

## Validate new certificates

1. Open PowerShell with elevated permission on the hardware lifecycle host or the Privileged Access Workstation.
2. Run the following cmdlet to install the Azure Stack Readiness Checker tool.
    ```PowerShell  
    Install-Module -Name Microsoft.AzureStack.ReadinessChecker
    ```
3. Run the following script to create the required folder structure:

    ```PowerShell  
    New-Item C:\Certificates -ItemType Directory

    $directories = 'ACSBlob','ACSQueue','ACSTable','ADFS','Admin Portal','ARM Admin','ARM Public','Graph','KeyVault','KeyVaultInternal','Public Portal', 'Admin extension host', 'Public extension host'

    $destination = 'c:\certificates'

    $directories | % { New-Item -Path (Join-Path $destination $PSITEM) -ItemType Directory -Force}
    ```

4. Place your certificate(s) in the appropriate directories.
5. Run the following cmdlets to start the certificate check:

    ```PowerShell  
    $pfxPassword = Read-Host -Prompt "Enter PFX Password" -AsSecureString 

    Start-AzsReadinessChecker -CertificatePath c:\certificates -pfxPassword $pfxPassword -RegionName east -FQDN azurestack.contoso.com -IdentitySystem AAD -ExtensionHostFeature $true
    ```

6. Check the output and all certificates pass all tests.


## Import extension host certificates

Use a computer that can connect to the Azure Stack privileged endpoint for the next steps. Make sure you access to the new certificate files from that computer.

1. Sign in as **AzureStack\AzureStackAdmin** on the Azure Stack host computer.
2. Open PowerShell as an administrator.
3. Run: `Enter-PSSession -ComputerName AzS-ERCS01 -ConfigurationName PrivilegedEndpoint`
4. Import the certificate for hosting endpoint. Adjust the script to match your environment.
    ```PowerShell  
    [Byte[]] $HostingCertContent = [Byte[]](Get-Content <File path of hosting certificate> -Encoding Byte)

    Invoke-Command -ComputeName <PrivilegedEndpoint computer name> `
    -Credential $CloudAdminCred `
    -ConfigurationName "PrivilegedEndpoint" `
    -ArgumentList @($HostingCertContent, $CertPassword)
    -ScriptBlock {
            param($HostingCertContent, $CertPassword)
            Import-UserHostingServiceCert $HostingCertContent $certPassword
    }
    ```
4. Import the certificate for the Admin hosting endpoint.

    ```PowerShell  
    $CertPassword = ConvertTo-SecurString "***" -AsPlainText -Force

    $CloudAdminCred = Get-Credential -UserName <Privileged endpoint credentials> -Message "Enter the cloud domain credentials to access the privileged endpoint."

    [Byte[]] $AdminHostingCertContent = [Byte[]](Get-Content <File path of Admin hosting certificate> -Encoding Byte)

    Invoke-Command -ComputeName <PrivilegedEndpoint computer name> `
    -Credential $CloudAdminCred `
    -ConfigurationName "PrivilegedEndpoint" `
    -ArgumentList @($AdminHostingCertContent, $CertPassword)
    -ScriptBlock {
            param($AdminHostingCertContent, $CertPassword)
            Import-AdminHostingServiceCert $AdminHostingCertContent $certPassword
    }
    ```

### Update DNS configuration

> Note  
> This step is not required if you used DNS Zone delegation for DNS Integration.
If individual host A records have been configured to publish Azure Stack endpoints, you need to create two additional host A records:

| IP | Hostname | Type |
|----|------------------------------|------|
|  | Adminhosting.<Region>.<FQDN> | A |
|  | Hosting.<Region>.<FQDN> | A |

Allocated IPs can be retrieved using privileged endpoint by running the cmdlet **Get-AzureStackStampInformation**.

### Ports and protocols

The following article covers the ports and protocols that require inbound communication to publish Azure Stack prior to extension host rollout.

### Publish new endpoints

There are two new endpoints required to be published through your firewall. The allocated IPs from the public VIP pool can be retrieved using the cmdlet **Get-AzureStackStampInformation**.

> Note  
> Make this change before enabling the extension host. This allows the Azure Stack portals to be continuously accessible.

| Endpoint (VIP) | Protocol | Ports |
|----------------|----------|-------|
| AdminHosting | HTTPS | 443 |
| Hosting | HTTPS | 443 |
Update existing publishing Rules (Post enablement of extension host)

> [!Note]  
> The 1808 Azure Stack Update Package does **not** enable extension host yet. It allows to prepare for extension host by importing the required certificates. Do not close any ports before extension host was enabled by a future Azure Stack update package. `how can this be phrased so not to contain future functionality?`

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