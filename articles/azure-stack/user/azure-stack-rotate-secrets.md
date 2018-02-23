---
title: Azure Stack Secret Rotation | Microsoft Docs
description: Learn how to rotate Azure Stack secrets. 
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/27/2018
ms.author: jeffgilb
ms.reviewer: ppacent

---
# Azure Stack Secret Rotation

*These instructions apply only to Azure Stack Integrated Systems Version 1802 and Later. Do not attempt secret rotation on pre-1802 Azure Stack Versions as it leads to environment failure.*

Azure Stack uses various secrets to maintain secure communication between the Azure Stack infrastructure’s resources and services. Here “secrets” describes the following: 
- Infrastructure service account passwords 
- Internal infrastructure certificates 
- Infrastructure service storage account keys 
- Infrastructure service certificates for external-facing services, including 
- Administrator Portal 
- Public Portal 
- Administrator Azure Resource Manager 
- Public Azure Resource Manager 
- Administrator Keyvault 
- Keyvault 
- ACS (including Blob, Table, and Queue Storage) 
- ADFS<sup>*</sup>  
- Graph<sup>*</sup>

> <sup>*</sup> Only applicable if the environment’s identity provider is ADFS.

> [!NOTE]
> All other secure keys and strings, including BMC and switch passwords, user and administrator account passwords are still manually updated by the administrator. 

In order to maintain the integrity of the Azure Stack infrastructure, operators need the ability to periodically rotate their infrastructure’s secrets at frequencies that are consistent with their organization’s security requirements. 

## Alert Remediations 
Secret Rotation is a remediation for the following alerts: 
- Pending service account password expiration 
- Pending internal certificate expiration 
- Pending external certificate expiration 


## Pre-Steps 
1. Schedule a maintenance window for Secret Rotation. Secret Rotation generally lasts about seven hours and has the potential to impact infrastructure and Tenant services. Tenant services can be down for up to 40 minutes during this time.
2. Prepare a new set of replacement external certificates matching the certificate specifications outlined in the [Azure Stack PKI certificate requirements](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs).
3. Create a fileshare that is accessible from your ERCS VMs. 
  
  > [!NOTE]
  > A Fileshare on the HLH should suffice for this step.

4. Open a Powershell ISE console and navigate to your fileshare from Pre-Step #3. 
5. Run **[CertDirectoryMaker.ps1](http://www.aka.ms/azssecretrotationhelper)** to create the required directories for your external certificates.

## Rotating All Secrets 
To rotate all secrets in Azure Stack, including external certificates: 

1. Within the newly created /Certificates directory from Pre-Step #5, place your certificates from Pre-Step #2 in the directory structure according to the format outlined in the Mandatory Certificates section of the [Azure Stack PKI certificate requirements](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs#mandatory-certificates). 
2. Create a Powershell Session with the [Privileged Endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint) and store it as a variable.
  
  > [!IMPORTANT]
  > Do not enter the session, store it as a variable.

3. Run **[invoke-command](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/invoke-command?view=powershell-5.1)**. Pass your Privileged Endpoint powershell session variable stored from Step 2 as the **Session** parameter. Run **Start-SecretRotation** with the following parameters:
- **PfxFilesPath** should be the network path to your Certificates directory created earlier.  
- **PathAccessCredential** should be a PSCredential object for credentials to the share. 
- **CertificatePassword** should be a secure string of the password used for all of the pfx certificate files created.
5. Wait while your secrets rotate.
6. After successful completion of secret rotation, remove your certificates from the share created in pre-step #3 and store in a secure location. 

## Rotating Only Internal Secrets 
1. Create a Powershell Session with the [Privileged Endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint).
2. In the Privileged Endpoint session run **Start-SecretRotation** with no arguments.

## Start-SecretRotation reference 
**Synopsis**

Rotates the secrets of an Azure Stack System. Only executed against the Azure Stack Privileged Endpoint.
  
**Syntax**

Path (Default)


```powershell
Start-SecretRotation [-PfxFilesPath <string>] [-PathAccessCredential] <PSCredential> [-CertificatePassword <SecureString>]  
```

**DESCRIPTION**

The Start-SecretRotation cmdlet rotates the infrastructure secrets of an Azure Stack system. By default it rotates all secrets exposed to the internal infrastructure network, with user-input it also rotates the certificates of all external network infrastructure endpoints. When rotating external network infrastructure endpoints, Start-SecretRotation should be executed via an Invoke-Command script block with the Azure Stack environment's privileged endpoint session passed in as the session parameter.
 
**Parameters**

- **PfxFilesPath**. The fileshare path to the \Certificates directory containing all external network endpoint certificates. Only required when rotating internal AND external secrets. End directory must be “Certificates”.
- **PathAccessCredential**
    > Type: String  

    > Parameter Sets: (All)  

    > Aliases:   
  
    > Required: False  

    > Position: Named  

    > Default value: None  
  
- **CertificatePassword**. The password for all certificates provided in the -PfXFilesPath. Required value if PfxFilesPath is provided when both internal AND external secrets are rotated.  
    > Type: SecureString

    > Parameter Sets: (All)

    > Aliases:   
  
    > Required: False  

    > Position: Named  

    > Default value: None  

### Examples
 
**Rotate Only Internal Infrastructure Secrets**

```powershell  
PS C:\> Start-SecretRotation  
```

This command rotates all of the infrastructure secrets exposed to Azure Stack internal network. Start-SecretRotation rotates all stack-generated secrets, but because there are no provided certificates, external endpoint certificates will not be rotated.  

**Rotate Internal and External Infrastructure Secrets**
  
```powershell
PS C:\> Invoke-Command -session $YourPEPSession -ScriptBlock { 
Start-SecretRotation -PfxFilesPath “C:\Path\to\my\Certificates” -PathAccessCredential $share_credential -CertificatePassword “Password” } 
```

This command rotates all of the infrastructure secrets exposed to Azure Stack internal network as well as the TLS certificates used for Azure Stack’s external network infrastructure endpoints. Start-SecretRotation rotates all stack-generated secrets, and because there are provided certificates, external endpoint certificates will also be rotated.  

## Next steps

[Use services and build apps for Azure Stack](azure-stack-considerations.md)
