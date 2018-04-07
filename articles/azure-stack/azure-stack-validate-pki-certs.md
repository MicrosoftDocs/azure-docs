---
title: Validate Azure Stack Public Key Infrastructure certificates for Azure Stack integrated systems deployment | Microsoft Docs
description: Describes how to validate the Azure Stack PKI certificates for Azure Stack integrated systems.
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
ms.date: 03/22/2018
ms.author: mabrigg
ms.reviewer: ppacent
---

# Validate Azure Stack PKI certificates

The Azure Stack Certificate Checker tool described in this article is provided by the OEM included with the deploymentdata.json file in order to validate that the [generated PKI certificates](azure-stack-get-pki-certs.md) are suitable for pre-deployment. Certificates should be validated with enough time to test and get certificates reissued if necessary.

The Certificate Checker tool (Certchecker) performs the following checks:

- **Read PFX**. Checks for valid PFX file, correct password and warns if public information is not protected by the password. 
- **Signature Algorithm**. Checks the Signature Algorithm is not SHA1.
- **Private Key**. Checks the private key is present and is exported with the Local Machine attribute. 
- **Cert Chain**. Checks certificate chain is in tact including for self-signed certificates. 
- **DNS Names**. Checks the SAN contains relevant DNS names for each endpoint or if a supporting wildcard is present. 
- **Key Usage**. Checks Key Usage contains Digital Signature and Key Encipherment and Enhanced Key Usage contains Server Authentication and Client Authentication.
- **Key Size**. Checks Key Size is 2048 or larger.
- **Chain Order**. Checks the order of the other certificates making the chain is correct.
- **Other Certificates**. Ensure no other certificates have been packaged in PFX other than the relevant leaf certificate and its chain.
- **No Profile**. Checks a new user can load the PFX data without a user profile loaded, mimicking the behavior of gMSA accounts during certificate servicing.

> [!IMPORTANT]  
> The PKI certificate PFX file and password should be treated as sensitive information.

## Prerequisites
Your system should meet the following prerequisites before validating PKI certificates for Azure Stack deployment:
- CertChecker (in **PartnerToolKit** under **\utils\certchecker**)
- SSL Certificate(s) exported following the [preparation instructions](azure-stack-prepare-pki-certs.md)
- DeploymentData.json
- Windows 10 or Windows Server 2016

## Perform certificate validation

Use these steps to prepare and validate the Azure Stack PKI certificates: 

1. Extract the contents of <partnerToolkit>\utils\certchecker to a new directory, for example, **c:\certchecker**.

2. Open PowerShell as Administrator and change the directory to the certchecker folder:

  ```powershell
  cd c:\certchecker
  ```
 
3. Create a directory structure for the certificates by running the following PowerShell commands:

  ```powershell 
  $directories = "ACS","ADFS","Admin Portal","ARM Admin","ARM Public","Graph","KeyVault","KeyVaultInternal","Public Portal" 
  $destination = '.\certs' 
  $directories | % { New-Item -Path (Join-Path $destination $PSITEM) -ItemType Directory -Force}  
  ```

  >  [!NOTE]
  >  If the identity provider for the Azure Stack deployment is Azure AD, remove the **ADFS** and **Graph** directories. 

4. Place your certificate(s) in the appropriate directories created in the previous step for example: 
  - c:\certchecker\Certs\ACS\CustomerCertificate.pfx,  
  - c:\certchecker\Certs\Admin Portal\CustomerCertificate.pfx  
  - c:\certchecker\Certs\ARM Admin\CustomerCertificate.pfx  
  - and so on… 

5. Copy **deploymentdata.json** into the **c:\certchecker** directory.

6. In the PowerShell window run the following commands: 

  ```powershell
  $password = Read-Host -Prompt "Enter PFX Password" -AsSecureString 
  .\CertChecker.ps1 -CertificatePath .\Certs\ -pfxPassword $password -deploymentDataJSONPath .\DeploymentData.json  
  ```

7. The output should contain OK for all certificates and all attributes checked: 

  ```powershell
  Starting Azure Stack Certificate Validation 1.1802.221.1
  Testing: ADFS\ContosoSSL.pfx
    Read PFX: OK
    Signature Algorithm: OK
    Private Key: OK
    Cert Chain: OK
    DNS Names: OK
    Key Usage: OK
    Key Size: OK
    Chain Order: OK
    Other Certificates: OK
    No Profile: OK
  Testing: KeyVaultInternal\ContosoSSL.pfx
    Read PFX: OK
    Signature Algorithm: OK
    Private Key: OK
    Cert Chain: OK
    DNS Names: OK
    Key Usage: OK
    Key Size: OK
    Chain Order: OK
    Other Certificates: OK
    No Profile: OK
  Testing: ACS\ContosoSSL.pfx
  WARNING: Pre-1803 certificate structure. The folder structure for Azure Stack 1803 and above is: ACSBlob, ACSQueue, ACSTable instead of ACS folder. Refer to deployment documentation for further informat
  ion.
    Read PFX: OK
    Signature Algorithm: OK
    Private Key: OK
    Cert Chain: OK
    DNS Names: OK
    Key Usage: OK
    Key Size: OK
    Chain Order: OK
    Other Certificates: OK
    No Profile: OK
  Detailed log can be found C:\CertChecker\CertChecker.log 
  ```

### Known issues 
**Symptom**: Certchecker exits prematurely and you receive the following error: 
> Failed

> Detail: This command cannot be run due to the error: The directory name is invalid. 

**Cause**: Running certchecker.ps1 from a restrictive folder, for example, c:\temp or %temp% 

**Resolution**: Move the certchecker tool to new directory, for example, C:\CertChecker 


**Symptom**: Certchecker gives a warning about using Pre-1803 (as in the example above from step 7):

> [!WARNING]
> Pre-1803 certificate structure. The folder structure for Azure Stack 1803 and above is: ACSBlob, ACSQueue, ACSTable instead of ACS folder. For more information see the deployment documentation.

**Cause**: CertChecker detected the use of a single ACS folder, this is correct for deployments before 1803. For Azure Stack version 1803 and above deployments, the folder structure changes to ACSTable, ACSQueue, ACSBlob. Certchecker has already be updated to support this functionality.

**Resolution**: If deploying 1802, no action is required. 
If deploying 1803 and above, replace ACS with ACSTable, ACSQueue, ACSBlob and copy the ACS certificate(s) into those folders.

**Symptom**: Tests are skipped

**Cause**: CertChecker skips certain tests if a dependency isn’t met:
- Other certificates are skipped if Certificate Chain fails.
- No Profile is skipped if:
  - There is a security policy restricting the ability to create a temporary user and run powershell as that user.
  - Private Key check fails.

**Resolution**: Follow the tools guidance in the details section under each certificate’s set of tests.


## Prepare deployment script certificates 
As a final step, all certificates that you’ve prepared need to be placed in the appropriate directories on the deployment host. On your deployment host, create a folder named. Certificates** and place your exported certificate files in the corresponding subfolders specified in the [mandatory certificates](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs#mandatory-certificates) section:

```
\Certificates
\ACS\ssl.pfx
\Admin Portal\ssl.pfx
\ARM Admin\ssl.pfx
\ARM Public\ssl.pfx
\KeyVault\ssl.pfx
\KeyVaultInternal\ssl.pfx
\Public Portal\ssl.pfx
\ADFS\ssl.pfx*
\Graph\ssl.pfx*
```

<sup>*</sup> The certificates marked with an asterisk * are only needed when AD FS is used as the identity store.


## Next steps
[Datacenter identity integration](azure-stack-integrate-identity.md)
