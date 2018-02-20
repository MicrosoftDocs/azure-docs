---
title: Validate Azure Stack Public Key Infrastructure certificates for Azure Stack integrated systems deployment | Microsoft Docs
description: Describes how to validate the Azure Stack PKI certificates for Azure Stack integrated systems.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/22/2018
ms.author: jeffgilb
ms.reviewer: ppacent
---

# Validate Azure Stack PKI certificates
The Certificate Checker tool described in this article is included with the deploymentdata.json file in order to validate that the [generated PKI certificates](azure-stack-get-pki-certs.md) are suitable for pre-deployment. Certificates should be validated with enough time to test and get certificates reissued if necessary. 

> [!IMPORTANT]
> The PKI certificate PFX file and password should be treated as sensitive information.

## Prerequisites
Your system should meet the following prerequisites before validating PKI certificates for Azure Stack deployment:
- CertChecker (in PartnerToolKit under \utils\certchecker)
- SSL Certificate(s) exported following the [preparation instructions](prepare-pki-certs.md).
- DeploymentData.json
- Windows 10 or Windows Server 2016

# Perform certificate validation
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
  Test PFX Certificate .\certs\ACS 
        Read PFX SSL.pfx: OK 
        Signature Algorithm: OK 
        Private Key: OK 
        Key Usage: OK 
        DNS Names: OK 
        No Profile: OK 
  Test PFX Certificate .\certs\Public Portal 
        Read PFX SSL.pfx: OK 
        Signature Algorithm: OK 
        Private Key: OK 
        Key Usage: OK 
        DNS Names: OK 
        No Profile: OK 
  ```

### Known issues 
**Symptom**: Certchecker exits prematurely and you receive the following error: 
> Failed 
> Detail: This command cannot be run due to the error: The directory name is invalid. 

**Cause**: Running certchecker.ps1 from a restrictive folder, for example, c:\temp or %temp% 

**Resolution**: Move the certchecker tool to new directory, for example, C:\CertChecker 

## Prepare deployment script certificates 
As a final step, all certificates that you’ve prepared need to be placed in the appropriate directories on the deployment host. On your deployment host, create a folder named **Certificates** and place your exported certificate files in the corresponding subfolders specified in the [mandatory certificates](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs#mandatory-certificates) section:

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