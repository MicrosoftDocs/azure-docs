---
title: Maintaining the MySQL resource provider on Azure Stack | Microsoft Docs
description: Learn how you can maintain the MySQL resource provider service on Azure Stack.
services: azure-stack
documentationCenter: ''
author: jeffgilb
manager: femila
editor: ''
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/29/2018
ms.author: jeffgilb
ms.reviewer: jeffgo

---

# MySQL resource provider maintenance operations

The MySQL resource provider runs on a locked down virtual machine. To enable maintenance operations, you need to update the virtual machine's security. To do this using the principle of Least Privilege, you can use PowerShell Just Enough Administration (JEA) endpoint DBAdapterMaintenance. The resource provider installation package includes a script for this operation.

## Update the virtual machine operating system

Because the resource provider runs on a *user* virtual machine, you need to apply the required patches and updates when they're released. You can use the Windows update packages that are provided as part of the patch-and-update cycle to apply updates to the VM.

Update the provider virtual machine using one of the following methods:

- Install the latest resource provider package using a currently patched Windows Server 2016 Core image.
- Install a Windows Update package during the installation of, or update to the resource provider.

## Update the virtual machine Windows Defender definitions

To update the Defender definitions, follow these steps:

1. Download the Windows Defender definitions update from [Windows Defender Definition](https://www.microsoft.com/en-us/wdsi/definitions).

    On the definitions page, scroll down to "Manually download and install the definitions". Download the "Windows Defender Antivirus for Windows 10 and Windows 8.1" 64-bit file.

    Alternatively, use [this direct link](https://go.microsoft.com/fwlink/?LinkID=121721&arch=x64) to download/run the fpam-fe.exe file.

2. Open a PowerShell session to the MySQL resource provider adapter virtual machine’s maintenance endpoint.

3. Copy the definitions update file to the resource provider adapter VM using the maintenance endpoint session.

4. On the maintenance PowerShell session, run the _Update-DBAdapterWindowsDefenderDefinitions_ command.

5. After you install the definitions, we recommend that you delete the definitions update file by using the _Remove-ItemOnUserDrive)_ command.

**PowerShell script example for updating definitions.**

You can edit and run the following script to update the Defender definitions. Replace values in the script with values from your environment.

```powershell
# Set credentials for the local admin on the resource provider VM.
$vmLocalAdminPass = ConvertTo-SecureString "<local admin user password>" -AsPlainText -Force
$vmLocalAdminUser = "<local admin user name>"
$vmLocalAdminCreds = New-Object System.Management.Automation.PSCredential `
    ($vmLocalAdminUser, $vmLocalAdminPass)

# Provide the public IP address for the adapter VM.
$databaseRPMachine  = "<RP VM IP address>"
$localPathToDefenderUpdate = "C:\DefenderUpdates\mpam-fe.exe"

# Download Windows Defender update definitions file from https://www.microsoft.com/en-us/wdsi/definitions.  
Invoke-WebRequest -Uri 'https://go.microsoft.com/fwlink/?LinkID=121721&arch=x64' `
    -Outfile $localPathToDefenderUpdate  

# Create a session to the maintenance endpoint.
$session = New-PSSession -ComputerName $databaseRPMachine `
    -Credential $vmLocalAdminCreds -ConfigurationName DBAdapterMaintenance

# Copy the defender update file to the adapter virtual machine.
Copy-Item -ToSession $session -Path $localPathToDefenderUpdate `
     -Destination "User:\"

# Install the update definitions.
Invoke-Command -Session $session -ScriptBlock `
    {Update-AzSDBAdapterWindowsDefenderDefinition -DefinitionsUpdatePackageFile "User:\mpam-fe.exe"}

# Cleanup the definitions package file and session.
Invoke-Command -Session $session -ScriptBlock `
    {Remove-AzSItemOnUserDrive -ItemPath "User:\mpam-fe.exe"}
$session | Remove-PSSession

```

## Secrets rotation

*These instructions only apply to Azure Stack Integrated Systems Version 1804 and Later. Don't try to rotate secrets  on pre-1804 versions of Azure Stack.*

When using the SQL and MySQL resource providers with Azure Stack integrated systems, you can rotate the following infrastructure (deployment) secrets:

- External SSL Certificate [provided during deployment](azure-stack-pki-certs.md).
- The resource provider VM local administrator account password provided during deployment.
- Resource provider diagnostic user (dbadapterdiag) password.

### PowerShell examples for rotating secrets

**Change all the secrets at the same time.**

```powershell
.\SecretRotationMySQLProvider.ps1 `
    -Privilegedendpoint $Privilegedendpoint `
    -CloudAdminCredential $cloudCreds `
    -AzCredential $adminCreds `
    –DiagnosticsUserPassword $passwd `
    -DependencyFilesLocalPath $certPath `
    -DefaultSSLCertificatePassword $certPasswd `  
    -VMLocalCredential $localCreds

```

**Change the diagnostic user password.**

```powershell
.\SecretRotationMySQLProvider.ps1 `
    -Privilegedendpoint $Privilegedendpoint `
    -CloudAdminCredential $cloudCreds `
    -AzCredential $adminCreds `
    –DiagnosticsUserPassword  $passwd

```

**Change the VM local administrator account password.**

```powershell
.\SecretRotationMySQLProvider.ps1 `
    -Privilegedendpoint $Privilegedendpoint `
    -CloudAdminCredential $cloudCreds `
    -AzCredential $adminCreds `
    -VMLocalCredential $localCreds

```

**Change the SSL certificate password.**

```powershell
.\SecretRotationMySQLProvider.ps1 `
    -Privilegedendpoint $Privilegedendpoint `
    -CloudAdminCredential $cloudCreds `
    -AzCredential $adminCreds `
    -DependencyFilesLocalPath $certPath `
    -DefaultSSLCertificatePassword $certPasswd

```

### SecretRotationMySQLProvider.ps1 parameters

|Parameter|Description|
|-----|-----|
|AzCredential|Azure Stack Service Admin account credential.|
|CloudAdminCredential|Azure Stack cloud admin domain account credential.|
|PrivilegedEndpoint|Privileged Endpoint to access Get-AzureStackStampInformation.|
|DiagnosticsUserPassword|Diagnostics user account password.|
|VMLocalCredential|The local administrator account on the MySQLAdapter VM.|
|DefaultSSLCertificatePassword|Default SSL Certificate (*pfx) Password.|
|DependencyFilesLocalPath|Dependency files local path.|
|     |     |

### Known issues

**Issue:**<br>
The logs for secrets rotation aren't automatically collected if the secret rotation script fails when it's run.

**Workaround:**<br>
Use the Get-AzsDBAdapterLogs cmdlet to collect all the resource provider logs, including AzureStack.DatabaseAdapter.SecretRotation.ps1_*.log, saved in C:\Logs.

## Collect diagnostic logs

To collect logs from the locked down virtual machine, you can use the PowerShell Just Enough Administration (JEA) endpoint DBAdapterDiagnostics. This endpoint provides the following commands:

- **Get-AzsDBAdapterLog**. This command creates a zip package of the resource provider diagnostics logs and saves the file on the session's user drive. You can run this command without any parameters and the last four hours of logs are collected.

- **Remove-AzsDBAdapterLog**. This command removes existing log packages on the resource provider VM.

### Endpoint requirements and process

When a resource provider is installed or updated, the dbadapterdiag user account is created. You'll use this account to collect diagnostic logs.

>[!NOTE]
>The dbadapterdiag account password is the same as the password used for the local administrator on the virtual machine that's created during a provider deployment or update.

To use the _DBAdapterDiagnostics_ commands, create a remote PowerShell session to the resource provider virtual machine and run the **Get-AzsDBAdapterLog** command.

You set the time span for log collection by using the **FromDate** and **ToDate** parameters. If you don't specify one or both of these parameters, the following defaults are used:

* FromDate is four hours before the current time.
* ToDate is the current time.

**PowerShell script example for collecting logs.**

The following script shows how to collect diagnostic logs from the resource provider VM.

```powershell
# Create a new diagnostics endpoint session.
$databaseRPMachineIP = '<RP VM IP address>'
$diagnosticsUserName = 'dbadapterdiag'
$diagnosticsUserPassword = '<Enter Diagnostic password>'
$diagCreds = New-Object System.Management.Automation.PSCredential `
        ($diagnosticsUserName, (ConvertTo-SecureString -String $diagnosticsUserPassword -AsPlainText -Force))
$session = New-PSSession -ComputerName $databaseRPMachineIP -Credential $diagCreds
        -ConfigurationName DBAdapterDiagnostics

# Sample that captures logs from the previous hour.
$fromDate = (Get-Date).AddHours(-1)
$dateNow = Get-Date
$sb = {param($d1,$d2) Get-AzSDBAdapterLog -FromDate $d1 -ToDate $d2}
$logs = Invoke-Command -Session $session -ScriptBlock $sb -ArgumentList $fromDate,$dateNow

# Copy the logs to the user drive.
$sourcePath = "User:\{0}" -f $logs
$destinationPackage = Join-Path -Path (Convert-Path '.') -ChildPath $logs
Copy-Item -FromSession $session -Path $sourcePath -Destination $destinationPackage

# Cleanup the logs.
$cleanup = Invoke-Command -Session $session -ScriptBlock {Remove-AzsDBAdapterLog}
# Close the session.
$session | Remove-PSSession

```

## Next steps

[Remove the MySQL resource provider](azure-stack-mysql-resource-provider-remove.md)
