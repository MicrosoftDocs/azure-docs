---
title: Troubleshooting BitLocker boot errors on an Azure VM | Microsoft Docs
description: Learn how to troubleshoot BitLocker boot errors in an Azure VM
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: cshepard
editor: v-jesits

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 03/25/2019
ms.author: genli
---

# BitLocker boot errors on an Azure VM

 This article describes BitLocker errors that you may experience when you start a Windows virtual machine (VM) in Microsoft Azure.

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]

## Symptom

 A Windows VM doesn't start. When you check the screenshots in the [Boot diagnostics](../windows/boot-diagnostics.md) window, you see one of the following error messages:

- Plug in the USB driver that has the BitLocker key

- You’re locked out! Enter the recovery key to get going again (Keyboard Layout: US) The wrong sign-in info has been entered too many times, so your PC was locked to protect your privacy. To retrieve the recovery key, go to https://windows.microsoft.com/recoverykeyfaq from another PC or mobile device. In case you need it, the key ID is XXXXXXX. Or, you can reset your PC.

- Enter the password to unlock this drive [ ] Press the Insert Key to see the password as you type.
- Enter your recovery key Load your recovery key from a USB device.

## Cause

This problem may occur if the VM cannot locate the BitLocker Recovery Key (BEK) file to decrypt the encrypted disk.

## Solution

To resolve this problem, stop and deallocate the VM, and then restart it. This operation forces the VM to retrieve the BEK file from the Azure Key Vault, and then put it on the encrypted disk. 

If this method does not the resolve the problem, follow these steps to restore the BEK file manually:

1. Take a snapshot of the system disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).
2. [Attach the system disk to a recovery VM](troubleshoot-recovery-disks-portal-windows.md). To run the [manage-bde](https://docs.microsoft.com/windows-server/administration/windows-commands/manage-bde) command in the step 7, the **BitLocker Drive Encryption** feature must be enabled in the recovery VM.

    When you attach a managed disk, you might receive a "contains encryption settings and therefore cannot be used as a data disk” error message. In this situation, run the following script to try again to attach the disk:

    ```Powershell
    $rgName = "myResourceGroup"
    $osDiskName = "ProblemOsDisk"

    New-AzDiskUpdateConfig -EncryptionSettingsEnabled $false |Update-AzDisk -diskName $osDiskName -ResourceGroupName $rgName

    $recoveryVMName = "myRecoveryVM" 
    $recoveryVMRG = "RecoveryVMRG" 
    $OSDisk = Get-AzDisk -ResourceGroupName $rgName -DiskName $osDiskName;

    $vm = get-AzVM -ResourceGroupName $recoveryVMRG -Name $recoveryVMName 

    Add-AzVMDataDisk -VM $vm -Name $osDiskName -ManagedDiskId $osDisk.Id -Caching None -Lun 3 -CreateOption Attach 

    Update-AzVM -VM $vm -ResourceGroupName $recoveryVMRG
    ```
     You cannot attach a managed disk to a VM that was restored from a blob image.

3. After the disk is attached, make a remote desktop connection to the recovery VM so that you can run some Azure PowerShell scripts. Make sure that you have the [latest version of Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) installed on the recovery VM.

4. Open an elevated Azure PowerShell session (Run as administrator). Run the following commands to sign in to Azure subscription:

    ```Powershell
    Add-AzAccount -SubscriptionID [SubscriptionID]
    ```

5. Run the following script to check the name of the BEK file:

    ```powershell
    $vmName = "myVM"
    $vault = "myKeyVault"
    Get-AzureKeyVaultSecret -VaultName $vault | where {($_.Tags.MachineName -eq $vmName) -and ($_.ContentType -match 'BEK')} `
            | Sort-Object -Property Created `
            | ft  Created, `
                @{Label="Content Type";Expression={$_.ContentType}}, `
                @{Label ="Volume"; Expression = {$_.Tags.VolumeLetter}}, `
                @{Label ="DiskEncryptionKeyFileName"; Expression = {$_.Tags.DiskEncryptionKeyFileName}}
    ```

    The following is sample of the output. Locate the BEK file name for the attached disk. In this case, we assume that the drive letter of the attached disk is F, and the BEK file is EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK.

    ```
    Created             Content Type Volume DiskEncryptionKeyFileName               
    -------             ------------ ------ -------------------------               
    4/5/2018 7:14:59 PM Wrapped BEK  C:\    B4B3E070-836C-4AF5-AC5B-66F6FDE6A971.BEK
    4/7/2018 7:21:16 PM Wrapped BEK  F:\    EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK
    4/7/2018 7:26:23 PM Wrapped BEK  G:\    70148178-6FAE-41EC-A05B-3431E6252539.BEK
    4/7/2018 7:26:26 PM Wrapped BEK  H:\    5745719F-4886-4940-9B51-C98AFABE5305.BEK
    ```

    If you see two duplicated volumes, the volume that has the newer timestamp is the current BEK file that is used by the recovery VM.

    If the **Content Type** value is **Wrapped BEK**, go to the [Key Encryption Key (KEK) scenarios](#key-encryption-key-scenario).

    Now that you have the name of the BEK file for the drive, you have to create the secret-file-name.BEK file to unlock the drive.

6.	Download the BEK file to the recovery disk. The following sample saves the BEK file to the C:\BEK folder. Make sure that the `C:\BEK\` path exists before you run the scripts.

    ```powershell
    $vault = "myKeyVault"
    $bek = " EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK"
    $keyVaultSecret = Get-AzureKeyVaultSecret -VaultName $vault -Name $bek
    $bekSecretBase64 = $keyVaultSecret.SecretValueText
    $bekFileBytes = [Convert]::FromBase64String($bekSecretbase64)
    $path = "C:\BEK\DiskEncryptionKeyFileName.BEK"
    [System.IO.File]::WriteAllBytes($path,$bekFileBytes)
    ```

7.	To unlock the attached disk by using the BEK file, run the following command.

    ```powershell
    manage-bde -unlock F: -RecoveryKey "C:\BEK\EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK
    ```
    In this sample, the attached OS disk is drive F. Make sure that you use the correct drive letter. 

    - If the disk was successfully unlocked by using the BEK key. we can consider the BitLocker problem to be resolved. 

    - If using the BEK key does not unlock the disk, you can use suspend protection to temporarily turn BitLocker OFF by running the following command
    
        ```powershell
        manage-bde -protectors -disable F: -rc 0
        ```      
    - If you are going to rebuild the VM by using the dytem disk, you must fully decrypt the drive. To do this, run the following command:

        ```powershell
        manage-bde -off F:
        ```
8.	Detach the disk from the recovery VM, and then re-attach the disk to the affected VM as a system disk. For more information, see [Troubleshoot a Windows VM by attaching the OS disk to a recovery VM](troubleshoot-recovery-disks-windows.md).

### Key Encryption Key scenario

For a Key Encryption Key scenario, follow these steps:

1. Make sure that the logged-in user account requires the "unwrapped" permission in the Key Vault Access policies in the **USER|Key permissions|Cryptographic Operations|Unwrap Key**.
2. Save the following scripts to a .PS1 file:

    ```powershell
    #Set the Parameters for the script
    param (
            [Parameter(Mandatory=$true)]
            [string] 
            $keyVaultName,
            [Parameter(Mandatory=$true)]
            [string] 
            $kekName,
            [Parameter(Mandatory=$true)]
            [string]
            $secretName,
            [Parameter(Mandatory=$true)]
            [string]
            $bekFilePath,
            [Parameter(Mandatory=$true)]
            [string] 
            $adTenant
            )
    # Load ADAL Assemblies. The following script assumes that the Azure PowerShell version you installed is 1.0.0. 
    $adal = "${env:ProgramFiles}\WindowsPowerShell\Modules\Az.Accounts\1.0.0\PreloadAssemblies\Microsoft.IdentityModel.Clients.ActiveDirectory.dll"
    $adalforms = "${env:ProgramFiles}\WindowsPowerShell\Modules\Az.Accounts\1.0.0\PreloadAssemblies\Microsoft.IdentityModel.Clients.ActiveDirectory.Platform.dll"
    [System.Reflection.Assembly]::LoadFrom($adal)
    [System.Reflection.Assembly]::LoadFrom($adalforms)

    # Set well-known client ID for AzurePowerShell
    $clientId = "1950a258-227b-4e31-a9cf-717495945fc2" 
    # Set redirect URI for Azure PowerShell
    $redirectUri = "urn:ietf:wg:oauth:2.0:oob"
    # Set Resource URI to Azure Service Management API
    $resourceAppIdURI = "https://vault.azure.net"
    # Set Authority to Azure AD Tenant
    $authority = "https://login.windows.net/$adtenant"
    # Create Authentication Context tied to Azure AD Tenant
    $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList $authority
    # Acquire token
    $authResult = $authContext.AcquireTokenAsync($resourceAppIdURI, $clientId, $redirectUri, $platformParameters).result
    # Generate auth header 
    $authHeader = $authResult.CreateAuthorizationHeader()
    # Set HTTP request headers to include Authorization header
    $headers = @{'x-ms-version'='2014-08-01';"Authorization" = $authHeader}

    ########################################################################################################################
    # 1. Retrieve wrapped BEK
    # 2. Make KeyVault REST API call to unwrap the BEK
    # 3. Convert the Base64Url string returned by KeyVault unwrap to Base64 string 
    # 4. Convert Base64 string to bytes and write to the BEK file
    ########################################################################################################################

    #Get wrapped BEK and place it in JSON object to send to KeyVault REST API
    $keyVaultSecret = Get-AzureKeyVaultSecret -VaultName $keyVaultName -Name $secretName
    $wrappedBekSecretBase64 = $keyVaultSecret.SecretValueText
    $jsonObject = @"
    {
    "alg": "RSA-OAEP",
    "value" : "$wrappedBekSecretBase64"
    }
    "@

    #Get KEK Url
    $kekUrl = (Get-AzureKeyVaultKey -VaultName $keyVaultName -Name $kekName).Key.Kid;
    $unwrapKeyRequestUrl = $kekUrl+ "/unwrapkey?api-version=2015-06-01";

    #Call KeyVault REST API to Unwrap 
    $result = Invoke-RestMethod -Method POST -Uri $unwrapKeyRequestUrl -Headers $headers -Body $jsonObject -ContentType "application/json" -Debug

    #Convert Base64Url string returned by KeyVault unwrap to Base64 string
    $base64UrlBek = $result.value;
    $base64Bek = $base64UrlBek.Replace('-', '+');
    $base64Bek = $base64Bek.Replace('_', '/');
    if($base64Bek.Length %4 -eq 2)
    {
        $base64Bek+= '==';
    }
    elseif($base64Bek.Length %4 -eq 3)
    {
        $base64Bek+= '=';
    }

    #Convert base64 string to bytes and write to BEK file
    $bekFileBytes = [System.Convert]::FromBase64String($base64Bek);
    [System.IO.File]::WriteAllBytes($bekFilePath,$bekFileBytes)
    ```
3. Set the parameters. The script will process the KEK secret to create the BEK key, and then save it to a local folder on the recovery VM.

4. You see the following output when the script begins:

        GAC    Version        Location                                                                              
        ---    -------        --------                                                                              
        False  v4.0.30319     C:\Program Files\WindowsPowerShell\Modules\Az.Accounts\...
        False  v4.0.30319     C:\Program Files\WindowsPowerShell\Modules\Az.Accounts\...

    When the script finishes, you see the following output:

        VERBOSE: POST https://myvault.vault.azure.net/keys/rondomkey/<KEY-ID>/unwrapkey?api-
        version=2015-06-01 with -1-byte payload
        VERBOSE: received 360-byte response of content type application/json; charset=utf-8


5. To unlock the attached disk by using the BEK file, run the following command:

    ```powershell
    manage-bde -unlock F: -RecoveryKey "C:\BEK\EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK
    ```
    In this sample, the attached OS disk is drive F. Make sure that you use the correct drive letter. 

    - If the disk was successfully unlocked by using the BEK key. we can consider the BitLocker problem to be resolved. 

    - If using the BEK key does not unlock the disk, you can use suspend protection to temporarily turn BitLocker OFF by running the following command
    
        ```powershell
        manage-bde -protectors -disable F: -rc 0
        ```      
    - If you are going to rebuild the VM by using the dytem disk, you must fully decrypt the drive. To do this, run the following command:

        ```powershell
        manage-bde -off F:
        ```

6. Detach the disk from the recovery VM, and then re-attach the disk to the affected VM as a system disk. For more information, see [Troubleshoot a Windows VM by attaching the OS disk to a recovery VM](troubleshoot-recovery-disks-windows.md).
