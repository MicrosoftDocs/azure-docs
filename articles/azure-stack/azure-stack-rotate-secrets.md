---
title: Azure Stack secret rotation | Microsoft Docs
description: Describes how to rotate Azure Stack secrets. 
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
# Azure Stack secret rotation

*These instructions apply only to Azure Stack Integrated Systems Version 1802 and Later. Do not attempt secret rotation on pre-1802 Azure Stack Versions*

Azure Stack uses various secrets to maintain secure communication between the Azure Stack infrastructure resources and services. Here “secrets” refers to the following: 

- **Internal secrets**. All certificates, passwords, secure strings, and keys used by the Azure Stack infrastructure without intervention of the Azure Stack Operator. 

- **External secrets**. Infrastructure service certificates for external-facing services that are provided by the Azure Stack Operator. This includes the certificates for the following services: 
    - Administrator Portal 
    - Public Portal 
    - Administrator Azure Resource Manager 
    - Public Azure Resource Manager 
    - Administrator Keyvault 
    - Keyvault 
    - ACS (including blob, table, and queue storage) 
    - ADFS<sup>*</sup>
    - Graph<sup>*</sup>

> <sup>*</sup> Only applicable if the environment’s identity provider is AD FS.

> [!NOTE]
> All other secure keys and strings, including BMC and switch passwords, user and administrator account passwords are still manually updated by the administrator. 

In order to maintain the integrity of the Azure Stack infrastructure, operators need the ability to periodically rotate their infrastructure’s secrets at frequencies that are consistent with their organization’s security requirements. 

## Alert remediations 
When secrets are within 30 days of expiration, the following alerts will be generated and displayed in the Administrator Portal: 
- Pending service account password expiration 
- Pending internal certificate expiration 
- Pending external certificate expiration 

Running secret rotation using the instructions below will remediate these alerts.

## Pre-steps 
1. We strongly recommend that you notify users of any maintenance operations, and that you schedule normal maintenance windows during non-business hours as much as possible. Maintenance operations may affect both user workloads and portal operations.
2. Prepare a new set of replacement external certificates matching the certificate specifications outlined in the [Azure Stack PKI certificate requirements](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs).
3. Create a fileshare that is accessible from your ERCS VMs. 
4. Open a Powershell ISE console and navigate to your fileshare from pre-step #3. 
5. Run **[CertDirectoryMaker.ps1](http://www.aka.ms/azssecretrotationhelper)** to create the required directories for your external certificates.

## Rotating all secrets 
To rotate all secrets in Azure Stack, including external certificates: 

1. Within the newly created /Certificates directory from pre-step #5, place your certificates from pre-step #2 in the directory structure according to the format outlined in the Mandatory Certificates section of the [Azure Stack PKI certificate requirements](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs#mandatory-certificates). 
2. Create a Powershell Session with the [Privileged Endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint) and store it as a variable.
  
  > [!IMPORTANT]
  > Do not enter the session, store it as a variable.

3. Run **[invoke-command](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/invoke-command?view=powershell-5.1)**. Pass your Privileged Endpoint powershell session variable stored from Step 2 as the **Session** parameter. Run **Start-SecretRotation** with the following parameters:
- **PfxFilesPath** should be the network path to your Certificates directory created earlier.  
- **PathAccessCredential** should be a PSCredential object for credentials to the share. 
- **CertificatePassword** should be a secure string of the password used for all of the pfx certificate files created.
5. Wait while your secrets rotate.
6. After successful completion of secret rotation, remove your certificates from the share created in pre-step #3 and store in a secure location. 

### Example
```powershell
#Create a PEP Session
winrm s winrm/config/client '@{TrustedHosts= "<IPofERCSMachine>"}'
$PEPCreds = Get-Credential 
$PEPsession = New-PSSession -computername <IPofERCSMachine> -Credential $PEPCreds -ConfigurationName PrivilegedEndpoint 

#Run Secret Rotation
$CertPassword = "CertPasswordHere"  | ConvertTo-SecureString 
$CertShareCred = Get-Credential 
$CertSharePath = <NetworkPathofCertShare>   
Invoke-Command -session $PEPsession -ScriptBlock { 
Start-SecretRotation -PfxFilesPath $using:CertSharePath -PathAccessCredential $using:CertShareCred -CertificatePassword $using:CertPassword }
Remove-PSSession -Session $PEPSession
```



## Rotating only internal secrets 
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

**Description**

The Start-SecretRotation cmdlet rotates the infrastructure secrets of an Azure Stack system. By default it rotates all secrets exposed to the internal infrastructure network, with user-input it also rotates the certificates of all external network infrastructure endpoints. When rotating external network infrastructure endpoints, Start-SecretRotation should be executed via an Invoke-Command script block with the Azure Stack environment's privileged endpoint session passed in as the session parameter.
 
**Parameters**

- **PfxFilesPath**. The fileshare path to the \Certificates directory containing all external network endpoint certificates. Only required when rotating internal **and** external secrets. End directory must be *Certificates*.
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
 
**Rotate only internal infrastructure secrets**

```powershell  
PS C:\> Start-SecretRotation  
```

This command rotates all of the infrastructure secrets exposed to Azure Stack internal network. Start-SecretRotation rotates all stack-generated secrets, but because there are no provided certificates, external endpoint certificates will not be rotated.  

**Rotate internal and external infrastructure secrets**
  
```powershell
PS C:\> Invoke-Command -session $PEPSession -ScriptBlock { 
Start-SecretRotation -PfxFilesPath “C:\Path\to\my\Certificates” -PathAccessCredential $share_credential -CertificatePassword $securePassword } 
Remove-PSSession -Session $PEPSession
```

This command rotates all of the infrastructure secrets exposed to Azure Stack internal network as well as the TLS certificates used for Azure Stack’s external network infrastructure endpoints. Start-SecretRotation rotates all stack-generated secrets, and because there are provided certificates, external endpoint certificates will also be rotated.  


## Update the baseboard management controller (BMC) password

The baseboard management controllers (BMC) monitors the physical state of your servers. The specifications and instructions on updating the password of the BMC vary based on your original equipment manufacturer (OEM) hardware vendor. You shoul update your passwords for Azure Stack components at a regular cadence.

1. Update the BMC on the Azure Stack’s physical servers by following your OEM instructions. The password for each BMC in your environment must be the same.
2. Open a privileged endpoint in Azure Stack Sessions. For instruction, see [Using the privileged endpoint in Azure Stack](azure-stack-privileged-endpoint.md).
3. After your PowerShell prompt has changed to **[IP address or ERCS VM name]: PS>** or to **[azs-ercs01]: PS>**, depending on the environment, run `Set-BmcPassword` by running `invoke-command`. Pass your privileged endpoint session variable as a parameter. For example:

    ```powershell
    # Interactive Version
    $PEip = "<Privileged Endpoint IP or Name>" # You can also use the machine name instead of IP here.
    $PECred = Get-Credential "<Domain>\CloudAdmin" -Message "PE Credentials" 
    $NewBMCpwd = Read-Host -Prompt "Enter New BMC password" -AsSecureString 

    $PEPSession = New-PSSession -ComputerName $PEip -Credential $PECred -ConfigurationName "PrivilegedEndpoint" 

    Invoke-Command -Session $PEPSession -ScriptBlock {
        Set-Bmcpassword -bmcpassword $using:NewBMCpwd
    }
    Remove-PSSession -Session $PEPSession
    ```
    
    You can also use the static PowerShell version with the Passwords as code lines:
    
    ```powershell
    # Static Version
    $PEip = "<Privileged Endpoint IP or Name>" # You can also use the machine name instead of IP here.
    $PEUser = "<Privileged Endpoint user for exmaple Domain\CloudAdmin>"
    $PEpwd = ConvertTo-SecureString "<Privileged Endpoint Password>" -AsPlainText -Force
    $PECred = New-Object System.Management.Automation.PSCredential ($PEUser, $PEpwd) 
    $NewBMCpwd = ConvertTo-SecureString "<New BMC Password>" -AsPlainText -Force 

    $PEPSession = New-PSSession -ComputerName $PEip -Credential $PECred -ConfigurationName "PrivilegedEndpoint" 

    Invoke-Command -Session $PEPSession -ScriptBlock {
        Set-Bmcpassword -bmcpassword $using:NewBMCpwd
    }
    Remove-PSSession -Session $PEPSession
    ```

## Next steps

[Learn more about Azure Stack security](azure-stack-security-foundations.md)
