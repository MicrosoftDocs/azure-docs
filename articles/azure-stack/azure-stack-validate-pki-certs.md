---
title: Validate Azure Stack Public Key Infrastructure certificates for Azure Stack integrated systems deployment | Microsoft Docs
description: Describes how to validate the Azure Stack PKI certificates for Azure Stack integrated systems. Covers using the Azure Stack Certificate Checker tool.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/11/2019
ms.author: mabrigg
ms.reviewer: ppacent
ms.lastreviewed: 01/08/2019
---

# Validate Azure Stack PKI certificates

The Azure Stack Readiness Checker tool described in this article is available [from the PowerShell Gallery](https://aka.ms/AzsReadinessChecker). You can use the tool to validate that  the [generated PKI certificates](azure-stack-get-pki-certs.md) are suitable for pre-deployment. Validate certificates by leaving  enough time to test and reissue certificates if necessary.

The Readiness Checker tool performs the following certificate validations:

- **Read PFX**  
    Checks for valid PFX file, correct password, and whether the public information isn't protected by the password. 
- **Signature algorithm**  
    Checks that the signature algorithm isn't SHA1.
- **Private Key**  
    Checks that the private key is present and is exported with the local machine attribute. 
- **Cert chain**  
    Checks certificate chain is intact including a check for self-signed certificates.
- **DNS names**  
    Checks the SAN contains relevant DNS names for each endpoint, or if a supporting wildcard is present.
- **Key usage**  
    Checks if the key usage contains a digital signature and key encipherment and enhanced key usage contains server authentication and client authentication.
- **Key size**  
    Checks if the key size is 2048 or larger.
- **Chain order**  
    Checks the order of the other certificates validating that the order is correct.
- **Other certificates**  
    Ensure no other certificates have been packaged in PFX other than the relevant leaf certificate and its chain.
- **No profile**  
    Checks that a new user can load the PFX data without a user profile loaded, mimicking the behavior of gMSA accounts during certificate servicing.

> [!IMPORTANT]  
> The PKI certificate is a PFX file and password should be treated as sensitive information.

## Prerequisites

Your system should meet the following prerequisites before validating PKI certificates for an Azure Stack deployment:

- Microsoft Azure Stack Readiness Checker
- SSL Certificate(s) exported following the [preparation instructions](azure-stack-prepare-pki-certs.md)
- DeploymentData.json
- Windows 10 or Windows Server 2016

## Perform core services certificate validation

Use these steps to prepare and to validate the Azure Stack PKI certificates for deployment and secret rotation:

1. Install **AzsReadinessChecker** from a PowerShell prompt (5.1 or above), by running the following cmdlet:

    ```PowerShell  
        Install-Module Microsoft.AzureStack.ReadinessChecker -force 
    ```

2. Create the certificate directory structure. In the example below, you can change `<c:\certificates>` to a new directory path of your choice.
    ```PowerShell  
    New-Item C:\Certificates -ItemType Directory
    
    $directories = 'ACSBlob', 'ACSQueue', 'ACSTable', 'Admin Extension Host', 'Admin Portal', 'api_appservice', 'ARM Admin', 'ARM Public', 'ftp_appservice', 'KeyVault', 'KeyVaultInternal', 'Public Extension Host', 'Public Portal', 'sso_appservice', 'wildcard_dbadapter', 'wildcard_sso_appservice'
    
    $destination = 'c:\certificates'
    
    $directories | % { New-Item -Path (Join-Path $destination $PSITEM) -ItemType Directory -Force}
    ```
    
    > [!Note]  
    > AD FS and Graph are required if you are using AD FS as your identity system. For example:
    >
    > ```PowerShell  
    > $directories = 'ACSBlob', 'ACSQueue', 'ACSTable', 'ADFS', 'Admin Extension Host', 'Admin Portal', 'api_appservice', 'ARM Admin', 'ARM Public', 'ftp_appservice', 'Graph', 'KeyVault', 'KeyVaultInternal', 'Public Extension Host', 'Public Portal', 'sso_appservice', 'wildcard_dbadapter', 'wildcard_sso_appservice'
    > ```
    
     - Place your certificate(s) in the appropriate directories created in the previous step. For example:  
        - `c:\certificates\ACSBlob\CustomerCertificate.pfx`
        - `c:\certificates\Admin Portal\CustomerCertificate.pfx`
        - `c:\certificates\ARM Admin\CustomerCertificate.pfx`

3. In the PowerShell window, change the values of **RegionName** and **FQDN** appropriate to the Azure Stack environment and run the following:

    ```PowerShell  
    $pfxPassword = Read-Host -Prompt "Enter PFX Password" -AsSecureString 

    Invoke-AzsCertificateValidation -CertificatePath c:\certificates -pfxPassword $pfxPassword -RegionName east -FQDN azurestack.contoso.com -IdentitySystem AAD  
    ```

4. Check the output and all certificates pass all tests. For example:

```PowerShell
Invoke-AzsCertificateValidation v1.1809.1005.1 started.
Testing: ARM Public\ssl.pfx
Thumbprint: 7F6B27****************************E9C35A
	PFX Encryption: OK
	Signature Algorithm: OK
	DNS Names: OK
	Key Usage: OK
	Key Size: OK
	Parse PFX: OK
	Private Key: OK
	Cert Chain: OK
	Chain Order: OK
	Other Certificates: OK
Testing: Admin Extension Host\ssl.pfx
Thumbprint: A631A5****************************35390A
	PFX Encryption: OK
	Signature Algorithm: OK
	DNS Names: OK
	Key Usage: OK
	Key Size: OK
	Parse PFX: OK
	Private Key: OK
	Cert Chain: OK
	Chain Order: OK
	Other Certificates: OK
Testing: Public Extension Host\ssl.pfx
Thumbprint: 4DBEB2****************************C5E7E6
	PFX Encryption: OK
	Signature Algorithm: OK
	DNS Names: OK
	Key Usage: OK
	Key Size: OK
	Parse PFX: OK
	Private Key: OK
	Cert Chain: OK
	Chain Order: OK
	Other Certificates: OK

Log location (contains PII): C:\Users\username\AppData\Local\Temp\AzsReadinessChecker\AzsReadinessChecker.log
Report location (contains PII): C:\Users\username\AppData\Local\Temp\AzsReadinessChecker\AzsReadinessCheckerReport.json
Invoke-AzsCertificateValidation Completed
```

### Known issues

**Symptom**: Tests are skipped

**Cause**: AzsReadinessChecker skips certain tests if a dependency isn’t met:

 - Other certificates are skipped if certificate chain fails.

    ```PowerShell  
    Testing: ACSBlob\singlewildcard.pfx
        Read PFX: OK
        Signature Algorithm: OK
        Private Key: OK
        Cert Chain: OK
        DNS Names: Fail
        Key Usage: OK
        Key Size: OK
        Chain Order: OK
        Other Certificates: Skipped
    Details:
    The certificate records '*.east.azurestack.contoso.com' do not contain a record that is valid for '*.blob.east.azurestack.contoso.com'. Please refer to the documentation for how to create the required certificate file.
    The Other Certificates check was skipped because Cert Chain and/or DNS Names failed. Follow the guidance to remediate those issues and recheck. 
    Detailed log can be found C:\AzsReadinessChecker\CertificateValidation\CertChecker.log

    Log location (contains PII): C:\Users\username\AppData\Local\Temp\AzsReadinessChecker\AzsReadinessChecker.log
    Report location (contains PII): C:\Users\username\AppData\Local\Temp\AzsReadinessChecker\AzsReadinessCheckerReport.json
    Invoke-AzsCertificateValidation Completed
    ```

**Resolution**: Follow the tool's guidance in the details section under each set of tests for each certificate.

## Perform platform as a service certificate validation

Use these steps to prepare and validate the Azure Stack PKI certificates for platform as a service (PaaS) certificates, if SQL/MySQL or App Services deployments are planned.

1.  Install **AzsReadinessChecker** from a PowerShell prompt (5.1 or above), by running the following cmdlet:

    ```PowerShell  
      Install-Module Microsoft.AzureStack.ReadinessChecker -force
    ```

2.  Create a nested hashtable containing paths and password to each PaaS certificate needing validation. In the PowerShell window run:

    ```PowerShell  
        $PaaSCertificates = @{
        'PaaSDBCert' = @{'pfxPath' = '<Path to DBAdapter PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
        'PaaSDefaultCert' = @{'pfxPath' = '<Path to Default PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
        'PaaSAPICert' = @{'pfxPath' = '<Path to API PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
        'PaaSFTPCert' = @{'pfxPath' = '<Path to FTP PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
        'PaaSSSOCert' = @{'pfxPath' = '<Path to SSO PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
        }
    ```

3.  Change the values of **RegionName** and **FQDN** to match your Azure Stack environment to start the validation. Then run:

    ```PowerShell  
    Invoke-AzsCertificateValidation -PaaSCertificates $PaaSCertificates -RegionName east -FQDN azurestack.contoso.com 
    ```
4.  Check that the output and that all certificates pass all tests.

    ```PowerShell
    Invoke-AzsCertificateValidation v1.0 started.
    Thumbprint: 95A50B****************************FA6DDA
        Signature Algorithm: OK
        Parse PFX: OK
        Private Key: OK
        Cert Chain: OK
        DNS Names: OK
        Key Usage: OK
        Key Size: OK
        Chain Order: OK
        Other Certificates: OK
    Thumbprint: EBB011****************************59BE9A
        Signature Algorithm: OK
        Parse PFX: OK
        Private Key: OK
        Cert Chain: OK
        DNS Names: OK
        Key Usage: OK
        Key Size: OK
        Chain Order: OK
        Other Certificates: OK
    Thumbprint: 76AEBA****************************C1265E
        Signature Algorithm: OK
        Parse PFX: OK
        Private Key: OK
        Cert Chain: OK
        DNS Names: OK
        Key Usage: OK
        Key Size: OK
        Chain Order: OK
        Other Certificates: OK
    Thumbprint: 8D6CCD****************************DB6AE9
        Signature Algorithm: OK
        Parse PFX: OK
        Private Key: OK
        Cert Chain: OK
        DNS Names: OK
        Key Usage: OK
        Key Size: OK
    ```

## Certificates

| Directory | Certificate |
| ---    | ----        |
| acsBlob | wildcard_blob_\<region>_\<externalFQDN> |
| ACSQueue  |  wildcard_queue_\<region>_\<externalFQDN> |
| ACSTable  |  wildcard_table_\<region>_\<externalFQDN> |
| Admin Extension Host  |  wildcard_adminhosting_\<region>_\<externalFQDN> |
| Admin Portal  |  adminportal_\<region>_\<externalFQDN> |
| ARM Admin  |  adminmanagement_\<region>_\<externalFQDN> |
| ARM Public  |  management_\<region>_\<externalFQDN> |
| KeyVault  |  wildcard_vault_\<region>_\<externalFQDN> |
| KeyVaultInternal  |  wildcard_adminvault_\<region>_\<externalFQDN> |
| Public Extension Host  |  wildcard_hosting_\<region>_\<externalFQDN> |
| Public Portal  |  portal_\<region>_\<externalFQDN> |

## Using validated certificates

Once your certificates have been validated by the AzsReadinessChecker, you are ready to use them in your Azure Stack deployment or for Azure Stack secret rotation. 

 - For deployment, securely transfer your certificates to your deployment engineer so that they can copy them onto the deployment host as specified in the [Azure Stack PKI requirements documentation](azure-stack-pki-certs.md).
 - For secret rotation, you can use the certificates to update old certificates for your Azure Stack environment’s public infrastructure endpoints by following the [Azure Stack Secret Rotation documentation](azure-stack-rotate-secrets.md).
 - For PaaS services, you can use the certificates to install SQL, MySQL, and App Services Resource Providers in Azure Stack by following the [Overview of offering services in Azure Stack documentation](azure-stack-offer-services-overview.md).

## Next steps

[Datacenter identity integration](azure-stack-integrate-identity.md)
