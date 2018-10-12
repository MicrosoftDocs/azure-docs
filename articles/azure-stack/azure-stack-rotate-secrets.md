---
title: Rotate secrets in Azure Stack | Microsoft Docs
description: Learn how to rotate your secrets in Azure Stack.
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
ms.date: 09/06/2018
ms.author: mabrigg
ms.reviewer: ppacent

---

# Rotate secrets in Azure Stack

*These instructions apply only to Azure Stack Integrated Systems Version 1803 and Later. Do not attempt secret rotation on pre-1802 Azure Stack Versions*

Azure Stack uses various secrets to maintain secure communication between the Azure Stack infrastructure resources and services.

- **Internal secrets**  
All the certificates, passwords, secure strings, and keys used by the Azure Stack infrastructure without intervention of the Azure Stack Operator. 

- **External secrets**  
Infrastructure service certificates for external-facing services that are provided by the Azure Stack Operator. This includes the certificates for the following services: 
    - Administrator Portal 
    - Public Portal 
    - Administrator Azure Resource Manager 
    - Global Azure Resource Manager 
    - Administrator Keyvault 
    - Keyvault 
    - ACS (including blob, table, and queue storage) 
    - ADFS<sup>*</sup>
    - Graph<sup>*</sup>

   <sup>*</sup> Only applicable if the environment’s identity provider is Active Directory Federated Services (AD FS).

> [!NOTE]
> All other secure keys and strings, including BMC and switch passwords, user and administrator account passwords are still manually updated by the administrator. 

In order to maintain the integrity of the Azure Stack infrastructure, operators need the ability to periodically rotate their infrastructure’s secrets at frequencies that are consistent with their organization’s security requirements.

### Rotating Secrets with External Certificates from a new Certificate Authority

Azure Stack supports secret rotation with external certificates from a new Certificate Authority (CA) in the following contexts:

|Installed Certificate CA|CA to Rotate To|Supported|Azure Stack Versions Supported|
|-----|-----|-----|-----|
|From Self-Signed|To Enterprise|Not Supported||
|From Self-Signed|To Self-Signed|Not Supported||
|From Self-Signed|To Public<sup>*</sup>|Supported|1803 & Later|
|From Enterprise|To Enterprise|Supported so long as customers use the SAME enterprise CA as used at deployment|1803 & Later|
|From Enterprise|To Self-Signed|Not Supported||
|From Enterprise|To Public<sup>*</sup>|Supported|1803 & Later|
|From Public<sup>*</sup>|To Enterprise|Not Supported|1803 & Later|
|From Public<sup>*</sup>|To Self-Signed|Not Supported||
|From Public<sup>*</sup>|To Public<sup>*</sup>|Supported|1803 & Later|

<sup>*</sup> Here Public Certificate Authorities are those that are part of the Windows Trusted Root Program. You can find the full list [Microsoft Trusted Root Certificate Program: Participants (as of June 27, 2017)](https://gallery.technet.microsoft.com/Trusted-Root-Certificate-123665ca).

## Alert remediation

When secrets are within 30 days of expiration, the following alerts are generated in the Administrator Portal: 

- Pending service account password expiration 
- Pending internal certificate expiration 
- Pending external certificate expiration 

Running secret rotation using the instructions below will remediate these alerts.

## Pre-steps for secret rotation

   > [!IMPORTANT]  
   > Ensure secret rotation hasn't been successfully executed on your environment. If secret rotation has already been performed, update Azure Stack to version 1807 or later before you execute secret rotation. 
1.  Operators may notice alerts open and automatically close during rotation of Azure Stack secrets.  This behavior is expected and the alerts can be ignored.  Operators can verify the validity of these alerts by running Test-AzureStack.  For operators using SCOM to monitor Azure Stack systems, placing a system in maintenance mode will prevent these alerts from reaching their ITSM systems but will continue to alert if the Azure Stack system becomes unreachable. 
2. Notify your users of any maintenance operations. Schedule normal maintenance windows, as much as possible,  during non-business hours. Maintenance operations may affect both user workloads and portal operations.
    > [!note]  
    > The next steps only apply when rotating Azure Stack external secrets.
3. Prepare a new set of replacement external certificates. The new set matches the certificate specifications outlined in the [Azure Stack PKI certificate requirements](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs).
4.  Store a back up to the certificates used for rotation in a secure backup location. If your rotation runs and then fails, replace the certificates in the file share with the backup copies before you rerun the rotation. Note, keep backup copies in the secure backup location.
5.  Create a fileshare you can access from the ERCS VMs. The file share must be  readable and writable for the **CloudAdmin** identity.
6.  Open a PowerShell ISE console from a computer where you have access to the fileshare. Navigate to your fileshare. 
7.  Run **[CertDirectoryMaker.ps1](http://www.aka.ms/azssecretrotationhelper)** to create the required directories for your external certificates.

## Rotating external and internal secrets

To rotate both external an internal secret:

1. Within the newly created **/Certificates** directory created in the Pre-steps, place the new set of replacement external certificates in the directory structure according to the format outlined in the Mandatory Certificates section of the [Azure Stack PKI certificate requirements](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs#mandatory-certificates).
2. Create a PowerShell Session with the [Privileged Endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint) using the **CloudAdmin** account and store the sessions as a variable. You will use this variable as the parameter in the next step.

    > [!IMPORTANT]  
    > Do not enter the session, store the session as a variable.
    
3. Run **[invoke-command](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/invoke-command?view=powershell-5.1)**. Pass your Privileged Endpoint PowerShell session variable as the **Session** parameter. 
4. Run **Start-SecretRotation** with the following parameters:
    - **PfxFilesPath**  
    Specify the network path to your Certificates directory created earlier.  
    - **PathAccessCredential**  
    A PSCredential object for credentials to the share. 
    - **CertificatePassword**  
    A secure string of the password used for all of the pfx certificate files created.
4. Wait while your secrets rotate.  
When secret rotation successfully completes, your console will display **Overall action status: Success**. 
    > [!note]  
    > If secret rotation fails, follow the instructions in the error message and re-run start-secretrotation with the **-Rerun** Parameter. Contact Support if you experience repeated secret rotation failures. 
5. After successful completion of secret rotation, remove your certificates from the share created in the pre-step and store them in their secure backup location. 

## Walkthrough of secret rotation

The following PowerShell example demonstrates the cmdlets and parameters to run in order to rotate your secrets.

```powershell
#Create a PEP Session
winrm s winrm/config/client '@{TrustedHosts= "<IPofERCSMachine>"}'
$PEPCreds = Get-Credential 
$PEPsession = New-PSSession -computername <IPofERCSMachine> -Credential $PEPCreds -ConfigurationName PrivilegedEndpoint 

#Run Secret Rotation
$CertPassword = ConvertTo-SecureString "Certpasswordhere" -AsPlainText -Force
$CertShareCred = Get-Credential 
$CertSharePath = "<NetworkPathofCertShare>"
Invoke-Command -session $PEPsession -ScriptBlock { 
Start-SecretRotation -PfxFilesPath $using:CertSharePath -PathAccessCredential $using:CertShareCred -CertificatePassword $using:CertPassword }
Remove-PSSession -Session $PEPSession
```
## Rotating only internal secrets

To rotate only Azure Stack’s internal secrets:

1. Create a PowerShell session with the [Privileged Endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint).
2. In the Privileged Endpoint session, run **Start-SecretRotation** with no arguments.
3. Wait while your secrets rotate.  
When secret rotation successfully completes, your console will display **Overall action status: Success**. 
    > [!note]  
    > If secret rotation fails, follow the instructions in the error message and rerun start-secretrotation with the **-Rerun** Parameter. Contact Support if you experience repeated secret rotation failures. 

## Start-SecretRotation reference

Rotates the secrets of an Azure Stack System. Only executed against the Azure Stack Privileged Endpoint.

### Syntax

Path (Default)

```powershell
Start-SecretRotation [-PfxFilesPath <string>] [-PathAccessCredential] <PSCredential> [-CertificatePassword <SecureString>]  
```

### Description

The Start-SecretRotation cmdlet rotates the infrastructure secrets of an Azure Stack system. By default it rotates all secrets exposed to the internal infrastructure network, with user-input it also rotates the certificates of all external network infrastructure endpoints. When rotating external network infrastructure endpoints, Start-SecretRotation should be executed via an Invoke-Command script block with the Azure Stack environment's privileged endpoint session passed in as the session parameter.
 
### Parameters

| Parameter | Type | Required | Position | Default | Description |
| -- | -- | -- | -- | -- | -- |
| PfxFilesPath | String  | False  | Named  | None  | The fileshare path to the **\Certificates** directory containing all external network endpoint certificates. Only required when rotating external secrets or all secrets. End directory must be **\Certificates**. |
| CertificatePassword | SecureString | False  | Named  | None  | The password for all certificates provided in the -PfXFilesPath. Required value if PfxFilesPath is provided when both internal and external secrets are rotated. |
| PathAccessCredential | PSCredential | False  | Named  | None  | The PowerShell credential for the fileshare of the **\Certificates** directory containing all external network endpoint certificates. Only required when rotating external secrets or all secrets.  |
| Rerun | SwitchParameter | False  | Named  | None  | Rerun must be used anytime secret rotation is re-attempted after a failed attempt. |

### Examples
 
**Rotate only internal infrastructure secrets**

```powershell  
PS C:\> Start-SecretRotation  
```

This command rotates all of the infrastructure secrets exposed to Azure Stack internal network. Start-SecretRotation rotates all stack-generated secrets, but because there are no provided certificates, external endpoint certificates will not be rotated.  

**Rotate internal and external infrastructure secrets**
  
```powershell
PS C:\> Invoke-Command -session $PEPSession -ScriptBlock { 
Start-SecretRotation -PfxFilesPath $using:CertSharePath -PathAccessCredential $using:CertShareCred -CertificatePassword $using:CertPassword } 
Remove-PSSession -Session $PEPSession
```

This command rotates all of the infrastructure secrets exposed to Azure Stack internal network as well as the TLS certificates used for Azure Stack’s external network infrastructure endpoints. Start-SecretRotation rotates all stack-generated secrets, and because there are provided certificates, external endpoint certificates will also be rotated.  


## Update the baseboard management controller (BMC) password

The baseboard management controller (BMC) monitors the physical state of your servers. The specifications and instructions on updating the password of the BMC vary based on your original equipment manufacturer (OEM) hardware vendor. You should update your passwords for Azure Stack components at a regular cadence.

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
