---
title: Script Sample - Register an on-premises Windows server or client machine with a Recovery Services vault
description: Learn about how to use a script to registering an on-premises Windows Server or client machine with a Recovery Services vault.
ms.topic: sample
ms.date: 06/23/2021
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# PowerShell Script to register an on-premises Windows server or a client machine with Recovery Services vault

This script helps you to register your on-premises Windows server or client machine with a Recovery Services vault.

## Sample script

```azurepowershell
<#

.SYNOPSIS
Registers MARS agent

.DESCRIPTION
Registers MARS agent

.ROLE
Administrators

#>
param (
    [Parameter(Mandatory = $true)]
    [String]
    $vaultcredPath,
    [Parameter(Mandatory = $true)]
    [String]
    $passphrase
)
Set-StrictMode -Version 5.0
$env:PSModulePath = (Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Session Manager\Environment' -Name PSModulePath).PSModulePath
Import-Module MSOnlineBackup
$ErrorActionPreference = "Stop"
Try {
    $date = Get-Date
    Start-OBRegistration -VaultCredentials $vaultcredPath -Confirm:$false
    $securePassphrase = ConvertTo-SecureString -String $passphrase -AsPlainText -Force
    Set-OBMachineSetting -EncryptionPassphrase $securePassphrase -SecurityPIN " "
}
Catch {
    if ($error[0].ErrorDetails) {
        throw $error[0].ErrorDetails
    }
    throw $error[0]
}

```

## How to execute the script

1. Save the above script on your machine with a name of your choice and .ps1 extension.
1. Execute the script by providing the following parameters:
   - `$vaultcredPath` - Complete Path of downloaded vault credential file
   - `$passphrase` - Plain text string converted into secure string using [ConvertTo-SecureString](/powershell/module/microsoft.powershell.security/convertto-securestring) cmdlet.

>[!Note]
>You also need to provide the Security PIN generated from the Azure portal. To generate the PIN, navigate to **Settings** -> **Properties** -> **Security PIN** in the Recovery Services vault blade, and then select **Generate**.

## Next steps

[Learn more](../backup-client-automation.md) about how to use PowerShell to deploy and manage on-premises backups using MARS agent.
