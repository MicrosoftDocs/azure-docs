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
ms.date: 04/15/2019
ms.reviewer: ppacent
ms.lastreviewed: 04/15/2019

---

# Rotate secrets in Azure Stack

*These instructions apply only to Azure Stack Integrated Systems Version 1803 and Later. Do not attempt secret rotation on pre-1802 Azure Stack Versions*

Azure Stack uses various secrets to maintain secure communication between the Azure Stack infrastructure resources and services.

- **Internal secrets**

All the certificates, passwords, secure strings, and keys used by the Azure Stack infrastructure without intervention of the Azure Stack Operator.

- **External secrets**

Infrastructure service certificates for external-facing services that provided by the Azure Stack Operator. External secrets include the certificates for the following services:

- Administrator Portal
- Public Portal
- Administrator Azure Resource Manager
- Global Azure Resource Manager
- Administrator KeyVault
- KeyVault
- Admin Extension Host
- ACS (including blob, table, and queue storage)
- ADFS *
- Graph *

\* Only applicable if the environment's identity provider is Active Directory Federated Services (AD FS).

> [!Note]
> All other secure keys and strings, including BMC and switch passwords, user and administrator account passwords are still manually updated by the administrator.

> [!Important]
> Starting with Azure Stack's 1811 release, secret rotation has been separated for internal and external certificates.

In order to maintain the integrity of the Azure Stack infrastructure, operators need the ability to periodically rotate their infrastructure's secrets at frequencies that are consistent with their organization's security requirements.

### Rotating Secrets with External Certificates from a new Certificate Authority

Azure Stack supports secret rotation with external certificates from a new Certificate Authority (CA) in the following contexts:

|Installed Certificate CA|CA to Rotate To|Supported|Azure Stack Versions Supported|
|-----|-----|-----|-----|
|From Self-Signed|To Enterprise|Supported|1903 & Later|
|From Self-Signed|To Self-Signed|Not Supported||
|From Self-Signed|To Public<sup>*</sup>|Supported|1803 & Later|
|From Enterprise|To Enterprise|Supported. From 1803-1903: supported so long as customers use the SAME enterprise CA as used at deployment|1803 & Later|
|From Enterprise|To Self-Signed|Not Supported||
|From Enterprise|To Public<sup>*</sup>|Supported|1803 & Later|
|From Public<sup>*</sup>|To Enterprise|Supported|1903 & Later|
|From Public<sup>*</sup>|To Self-Signed|Not Supported||
|From Public<sup>*</sup>|To Public<sup>*</sup>|Supported|1803 & Later|

<sup>*</sup>Indicates that the Public Certificate Authorities are those that are part of the Windows Trusted Root Program. You can find the full list in the article [Microsoft Trusted Root Certificate Program: Participants (as of June 27, 2017)](https://gallery.technet.microsoft.com/Trusted-Root-Certificate-123665ca).

## Alert remediation

When secrets are within 30 days of expiration, the following alerts are generated in the Administrator Portal:

- Pending service account password expiration
- Pending internal certificate expiration
- Pending external certificate expiration

Running secret rotation using the instructions below will remediate these alerts.

> [!Note]
> Azure Stack environments on pre-1811 versions may see alerts for pending internal certificate or secret expirations.
> These alerts are inaccurate and should be ignored without running internal secret rotation.
> Inaccurate internal secret expiration alerts are a known issue that is resolved in 1811– internal secrets will not expire unless the environment has been active for two years.

## Pre-steps for secret rotation

   > [!IMPORTANT]
   > If secret rotation has already been performed on your Azure Stack environment then you must update the system to version 1811 or later before you execute secret rotation again.
   > Secret Rotation must be executed by via the [Privileged Endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint) and requires Azure Stack Operator credentials.
   > If your environment Azure Stack Operator(s) do not know whether secret rotation has been run on your environment, update to 1811 before executing secret rotation again.

1. It is highly recommended that you update your Azure Stack instance to version 1811.

    > [!Note] 
    > For pre-1811 versions you do not need to rotate secrets to add extension host certificates. You should follow the instructions in the article [Prepare for extension host for Azure Stack](azure-stack-extension-host-prepare.md) to add extension host certificates.

2. Operators may notice alerts open and automatically close during rotation of Azure Stack secrets.  This behavior is expected and the alerts can be ignored.  Operators can verify the validity of these alerts by running **Test-AzureStack**.  For operators using System Center Operations Manager to monitor Azure Stack systems, placing a system in maintenance mode will prevent these alerts from reaching their ITSM systems but will continue to alert if the Azure Stack system becomes unreachable.

3. Notify your users of any maintenance operations. Schedule normal maintenance windows, as much as possible,  during non-business hours. Maintenance operations may affect both user workloads and portal operations.

    > [!Note]
    > The next steps only apply when rotating Azure Stack external secrets.

4. Run **[Test-AzureStack](https://docs.microsoft.com/azure/azure-stack/azure-stack-diagnostic-test)** and confirm all test outputs are healthy prior to rotating secrets.
5. Prepare a new set of replacement external certificates. The new set matches the certificate specifications outlined in the [Azure Stack PKI certificate requirements](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs). You can generate a certificate signing request (CSR) for purchasing or creating new certificates using the steps outlined in [Generate PKI Certificates](https://docs.microsoft.com/azure/azure-stack/azure-stack-get-pki-certs) and prepare them for use in your Azure Stack environment using the steps in [Prepare Azure Stack PKI Certificates](https://docs.microsoft.com/azure/azure-stack/azure-stack-prepare-pki-certs). Be sure to validate the certificates you prepare with the steps outlined in [Validate PKI Certificates](https://docs.microsoft.com/azure/azure-stack/azure-stack-validate-pki-certs).
6. Store a back up to the certificates used for rotation in a secure backup location. If your rotation runs and then fails, replace the certificates in the file share with the backup copies before you rerun the rotation. Note, keep backup copies in the secure backup location.
7. Create a fileshare you can access from the ERCS VMs. The file share must be  readable and writable for the **CloudAdmin** identity.
8. Open a PowerShell ISE console from a computer where you have access to the fileshare. Navigate to your fileshare.
9. Run **[CertDirectoryMaker.ps1](https://www.aka.ms/azssecretrotationhelper)** to create the required directories for your external certificates.

> [!IMPORTANT]
> The CertDirectoryMaker script will create a folder structure that will adhere to:
>
> **.\Certificates\AAD** or ***.\Certificates\ADFS*** depending on your Identity Provider used for Azure Stack
>
> It is of utmost importance that your folder structure ends with **AAD** or **ADFS** folders and all subdirectories are within this structure; otherwise, **Start-SecretRotation** will come up with:
> ```powershell
> Cannot bind argument to parameter 'Path' because it is null.
> + CategoryInfo          : InvalidData: (:) [Test-Certificate], ParameterBindingValidationException
> + FullyQualifiedErrorId : ParameterArgumentValidationErrorNullNotAllowed,Test-Certificate
> + PSComputerName        : xxx.xxx.xxx.xxx
> ```
>
> As you can see the error massage would indicate that there is a problem accessing your fileshare but in reality it is the folder structure that is being enforced here.
> More information can be found in the Microsoft AzureStack Readiness Checker - [PublicCertHelper module](https://www.powershellgallery.com/packages/Microsoft.AzureStack.ReadinessChecker/1.1811.1101.1/Content/CertificateValidation%5CPublicCertHelper.psm1)
>
> It is also important that your fileshare folder structure begins with **Certificates** folder otherwise it will also fail on validation.
> Fileshare mount should look like **\\\\\<IPAddress>\\\<ShareName>\\** and it should contain folder **Certificates\AAD** or **Certificates\ADFS** inside.
>
> For example:
> - Fileshare = **\\\\\<IPAddress>\\\<ShareName>\\**
> - CertFolder = **Certificates\AAD**
> - FullPath = **\\\\\<IPAddress>\\\<ShareName>\Certificates\AAD**

## Rotating external secrets

To rotate external secrets:

1. Within the newly created **\Certificates\\\<IdentityProvider>** directory created in the Pre-steps, place the new set of replacement external certificates in the directory structure according to the format outlined in the Mandatory Certificates section of the [Azure Stack PKI certificate requirements](https://docs.microsoft.com/azure/azure-stack/azure-stack-pki-certs#mandatory-certificates).

    Example of folder structure for the AAD Identity Provider:
    ```powershell
        <ShareName>
        │   │
        │   ├───Certificates
        │   └───AAD
        │       ├───ACSBlob
        │       │       <CertName>.pfx
        │       │
        │       ├───ACSQueue
        │       │       <CertName>.pfx
        │       │
        │       ├───ACSTable
        │       │       <CertName>.pfx
        │       │
        │       ├───Admin Extension Host
        │       │       <CertName>.pfx
        │       │
        │       ├───Admin Portal
        │       │       <CertName>.pfx
        │       │
        │       ├───ARM Admin
        │       │       <CertName>.pfx
        │       │
        │       ├───ARM Public
        │       │       <CertName>.pfx
        │       │
        │       ├───KeyVault
        │       │       <CertName>.pfx
        │       │
        │       ├───KeyVaultInternal
        │       │       <CertName>.pfx
        │       │
        │       ├───Public Extension Host
        │       │       <CertName>.pfx
        │       │
        │       └───Public Portal
        │               <CertName>.pfx

    ```

2. Create a PowerShell Session with the [Privileged Endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint) using the **CloudAdmin** account and store the sessions as a variable. You will use this variable as the parameter in the next step.

    > [!IMPORTANT]  
    > Do not enter the session, store the session as a variable.

3. Run **[Invoke-Command](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/Invoke-Command?view=powershell-5.1)**. Pass your Privileged Endpoint PowerShell session variable as the **Session** parameter.

4. Run **Start-SecretRotation** with the following parameters:
    - **PfxFilesPath**  
    Specify the network path to your Certificates directory created earlier.  
    - **PathAccessCredential**  
    A PSCredential object for credentials to the share.
    - **CertificatePassword**  
    A secure string of the password used for all of the pfx certificate files created.

5. Wait while your secrets rotate. External secret rotation usually takes approximately one hour.

    When secret rotation successfully completes, your console will display **Overall action status: Success**.

    > [!Note]
    > If secret rotation fails, follow the instructions in the error message and re-run **Start-SecretRotation** with the **-ReRun** Parameter.

    ```powershell
    Start-SecretRotation -ReRun
    ```
    Contact Support if you experience repeated secret rotation failures.

6. After successful completion of secret rotation, remove your certificates from the share created in the pre-step and store them in their secure backup location.

## Walkthrough of secret rotation

The following PowerShell example demonstrates the cmdlets and parameters to run in order to rotate your secrets.

```powershell
# Create a PEP Session
winrm s winrm/config/client '@{TrustedHosts= "<IpOfERCSMachine>"}'
$PEPCreds = Get-Credential
$PEPSession = New-PSSession -ComputerName <IpOfERCSMachine> -Credential $PEPCreds -ConfigurationName "PrivilegedEndpoint"

# Run Secret Rotation
$CertPassword = ConvertTo-SecureString "<CertPasswordHere>" -AsPlainText -Force
$CertShareCreds = Get-Credential
$CertSharePath = "<NetworkPathOfCertShare>"
Invoke-Command -Session $PEPSession -ScriptBlock {
    Start-SecretRotation -PfxFilesPath $using:CertSharePath -PathAccessCredential $using:CertShareCreds -CertificatePassword $using:CertPassword
}
Remove-PSSession -Session $PEPSession
```

## Rotating only internal secrets

> [!Note]
> Internal Secret Rotation should only be done if you suspect an internal secret has been compromised by a malicious entity, or if you have received an alert (on build 1811 or later) indicating internal certificates are nearing expiration.
> Azure Stack environments on pre-1811 versions may see alerts for pending internal certificate or secret expirations.
> These alerts are inaccurate and should be ignored without running internal secret rotation.
> Inaccurate internal secret expiration alerts are a known issue that is resolved in 1811– internal secrets will not expire unless the environment has been active for two years.

1. Create a PowerShell session with the [Privileged Endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint).
2. In the Privileged Endpoint session, run **Start-SecretRotation -Internal**.

    > [!Note]
    > Azure Stack environments on pre-1811 versions will not require the **-Internal** flag. **Start-SecretRotation** will rotate only internal secrets.

3. Wait while your secrets rotate.

When secret rotation successfully completes, your console will display **Overall action status: Success**.
    > [!Note]
    > If secret rotation fails, follow the instructions in the error message and rerun **Start-SecretRotation** with the  **–Internal** and **-ReRun** parameters.  

```powershell
Start-SecretRotation -Internal -ReRun
```

Contact Support if you experience repeated secret rotation failures.

## Start-SecretRotation reference

Rotates the secrets of an Azure Stack System. Only executed against the Azure Stack Privileged Endpoint.

### Syntax

#### For external secret rotation

```powershell
Start-SecretRotation [-PfxFilesPath <string>] [-PathAccessCredential <PSCredential>] [-CertificatePassword <SecureString>]  
```

#### For internal secret rotation

```powershell
Start-SecretRotation [-Internal]  
```

#### For external secret rotation rerun

```powershell
Start-SecretRotation [-ReRun]
```

#### For internal secret rotation rerun

```powershell
Start-SecretRotation [-ReRun] [-Internal]
```

### Description

The **Start-SecretRotation** cmdlet rotates the infrastructure secrets of an Azure Stack system. By default it rotates only the certificates of all external network infrastructure endpoints. If used with the -Internal flag internal infrastructure secrets will be rotated. When rotating external network infrastructure endpoints, **Start-SecretRotation** should be run with an **Invoke-Command** script block with the Azure Stack environment's privileged endpoint session passed in as the **Session** parameter.

### Parameters

| Parameter | Type | Required | Position | Default | Description |
| -- | -- | -- | -- | -- | -- |
| `PfxFilesPath` | String  | False  | Named  | None  | The fileshare path to the **\Certificates** directory containing all external network endpoint certificates. Only required when rotating external secrets. End directory must be **\Certificates**. |
| `CertificatePassword` | SecureString | False  | Named  | None  | The password for all certificates provided in the -PfXFilesPath. Required value if PfxFilesPath is provided when external secrets are rotated. |
| `Internal` | String | False | Named | None | Internal flag must be used anytime an Azure Stack operator wishes to rotate internal infrastructure secrets. |
| `PathAccessCredential` | PSCredential | False  | Named  | None  | The PowerShell credential for the fileshare of the **\Certificates** directory containing all external network endpoint certificates. Only required when rotating external secrets.  |
| `ReRun` | SwitchParameter | False  | Named  | None  | ReRun must be used anytime secret rotation is reattempted after a failed attempt. |

### Examples

#### Rotate only internal infrastructure secrets

This must be run via your Azure Stack [environment's privileged endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint).

```powershell
PS C:\> Start-SecretRotation -Internal
```

This command rotates all of the infrastructure secrets exposed to Azure Stack internal network.

#### Rotate only external infrastructure secrets  

```powershell
# Create a PEP Session
winrm s winrm/config/client '@{TrustedHosts= "<IpOfERCSMachine>"}'
$PEPCreds = Get-Credential
$PEPSession = New-PSSession -ComputerName <IpOfERCSMachine> -Credential $PEPCreds -ConfigurationName "PrivilegedEndpoint"

# Create Credentials for the fileshare
$CertPassword = ConvertTo-SecureString "<CertPasswordHere>" -AsPlainText -Force
$CertShareCreds = Get-Credential
$CertSharePath = "<NetworkPathOfCertShare>"
# Run Secret Rotation
Invoke-Command -Session $PEPSession -ScriptBlock {  
    Start-SecretRotation -PfxFilesPath $using:CertSharePath -PathAccessCredential $using:CertShareCreds -CertificatePassword $using:CertPassword
}
Remove-PSSession -Session $PEPSession
```

This command rotates the TLS certificates used for Azure Stack's external network infrastructure endpoints.

#### Rotate internal and external infrastructure secrets (**pre-1811** only)

> [!IMPORTANT]
> This command only applies to Azure Stack **pre-1811** as the rotation has been split for internal and external certificates.
>
> **From *1811+* you cannot rotate both internal and external certificates any more!!!**

```powershell
# Create a PEP Session
winrm s winrm/config/client '@{TrustedHosts= "<IpOfERCSMachine>"}'
$PEPCreds = Get-Credential
$PEPSession = New-PSSession -ComputerName <IpOfERCSMachine> -Credential $PEPCreds -ConfigurationName "PrivilegedEndpoint"

# Create Credentials for the fileshare
$CertPassword = ConvertTo-SecureString "<CertPasswordHere>" -AsPlainText -Force
$CertShareCreds = Get-Credential
$CertSharePath = "<NetworkPathOfCertShare>"
# Run Secret Rotation
Invoke-Command -Session $PEPSession -ScriptBlock {
    Start-SecretRotation -PfxFilesPath $using:CertSharePath -PathAccessCredential $using:CertShareCreds -CertificatePassword $using:CertPassword
}
Remove-PSSession -Session $PEPSession
```

This command rotates all of the infrastructure secrets exposed to Azure Stack internal network as well as the TLS certificates used for Azure Stack's external network infrastructure endpoints. Start-SecretRotation rotates all stack-generated secrets, and because there are provided certificates, external endpoint certificates will also be rotated.  

## Update the baseboard management controller (BMC) credential

The baseboard management controller (BMC) monitors the physical state of your servers. The specifications and instructions on updating the user account name and password of the BMC vary based on your original equipment manufacturer (OEM) hardware vendor. You should update your passwords for Azure Stack components on a regular basis.

1. Update the BMC on the Azure Stack physical servers by following your OEM instructions. The user name and password for each BMC in your environment must be the same. Note that BMC user names can't exceed 16 characters.
2. Open a privileged endpoint in Azure Stack sessions. For instructions, see [Using the privileged endpoint in Azure Stack](azure-stack-privileged-endpoint.md).
3. After your PowerShell prompt has changed to **[IP address or ERCS VM name]: PS>** or to **[azs-ercs01]: PS>**, depending on the environment, run `Set-BmcCredential` by running `Invoke-Command`. Pass your privileged endpoint session variable as a parameter. For example:

    ```powershell
    # Interactive Version
    $PEPIp = "<Privileged Endpoint IP or Name>" # You can also use the machine name instead of IP here.
    $PEPCreds = Get-Credential "<Domain>\CloudAdmin" -Message "PEP Credentials"
    $NewBmcPwd = Read-Host -Prompt "Enter New BMC password" -AsSecureString
    $NewBmcUser = Read-Host -Prompt "Enter New BMC user name"

    $PEPSession = New-PSSession -ComputerName $PEPIp -Credential $PEPCreds -ConfigurationName "PrivilegedEndpoint"

    Invoke-Command -Session $PEPSession -ScriptBlock {
        # Parameter BmcPassword is mandatory, while the BmcUser parameter is optional.
        Set-BmcCredential -BmcPassword $using:NewBmcPwd -BmcUser $using:NewBmcUser
    }
    Remove-PSSession -Session $PEPSession
    ```

    You can also use the static PowerShell version with the Passwords as code lines:

    ```powershell
    # Static Version
    $PEPIp = "<Privileged Endpoint IP or Name>" # You can also use the machine name instead of IP here.
    $PEPUser = "<Privileged Endpoint user for example Domain\CloudAdmin>"
    $PEPPwd = ConvertTo-SecureString "<Privileged Endpoint Password>" -AsPlainText -Force
    $PEPCreds = New-Object System.Management.Automation.PSCredential ($PEPUser, $PEPPwd)
    $NewBmcPwd = ConvertTo-SecureString "<New BMC Password>" -AsPlainText -Force
    $NewBmcUser = "<New BMC User name>"

    $PEPSession = New-PSSession -ComputerName $PEPIp -Credential $PEPCreds -ConfigurationName "PrivilegedEndpoint"

    Invoke-Command -Session $PEPSession -ScriptBlock {
        # Parameter BmcPassword is mandatory, while the BmcUser parameter is optional.
        Set-BmcCredential -BmcPassword $using:NewBmcPwd -BmcUser $using:NewBmcUser
    }
    Remove-PSSession -Session $PEPSession
    ```

## Next steps

[Learn more about Azure Stack security](azure-stack-security-foundations.md)
