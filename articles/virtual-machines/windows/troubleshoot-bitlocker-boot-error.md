---

title: Troubleshoot BitLocker boot errors in an Azure VM
| Microsoft Docs
description: Learn how to troubleshoot BitLocker boot errors in an Azure VM
services: virtual-machines-windows
documentationCenter: ''
authors: genlin
manager: cshepard
editor: ''

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/13/2018
ms.author: genli

---

# BitLocker boot errors in an Azure VM

 This article describes BitLocker errors you may encounter when you boot a Windows VM in Microsoft Azure.

 [!NOTE] Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](../../azure-resource-manager/resource-manager-deployment-model.md). This article covers using the Resource Manager deployment model, which Microsoft recommends for new deployments instead of the classic deployment model.

 ## Symptom 

 Windows VM doesn't start. When you check the boot screenshots in the [Boot diagnostics](boot-diagnostics.md), you see one of the following error messages:

- Plug in the USB driver that has the BitLocker key

- You’re locked out! Enter the recovery key to get going again (Keyboard Layout: US) The wrong sign-in info has been entered too many times, so your PC was locked to protect your privacy. To retrieve the recovery key, go to http://windows.microsoft.com/recoverykeyfaq from another PC or mobile device. In case you need it, the key ID is XXXXXXX. Or, you can reset your PC.

- Enter the password to unlock this drive [ ] Press the Insert Key to see the password as you type.
- Bitlocker Enter your recovery key Load your recovery key from a USB device.

## Cause

This problem may occur if the VM cannot find the BitLocker Recovery Key (BEK) file for decrypting the encrypted disk.

## Solution

To resolve this issue, stop and deallocate the VM, and then restart it. This operation will force the VM to retrieve the BEK file from the Azure Key Vault and place it in the encrypted disk. 

If this method does not the resolve the issue, follow these steps to restore the BEK file manually.

1. Take a snapshot of the OS disk of the affected VM as a backup. For more information, see [Snapshot a disk](./snapshot-copy-managed-disk.md).
2. [Attach the OS disk to a recovery VM](./troubleshoot-recovery-disks-portal.md) that is encrypted by BitLocker.  We will need to run [manage-bde](https://docs.microsoft.com/windows-server/administration/windows-commands/manage-bde) command that is only available on the BitLocker encrypted VM.

    If you receive the” contains encryption settings and therefore cannot be used as a data disk” error when you attach an managed disk, run the following script to attach the disk again:

    ```Powershell
        $rgName = "myResourceGroup"
        $osDiskName = "ProblemOsDisk"

        New-AzureRmDiskUpdateConfig -EncryptionSettingsEnabled $false |Update-AzureRmDisk -diskName $osDiskName -ResourceGroupName $rgName

        $recoveryVMName = "myRecoveryVM" 
        $recoveryVMRG = "RecoveryVMRG" 
        $OSDisk = Get-AzureRmDisk -ResourceGroupName $rgName -DiskName $osDiskName;

        $vm = get-AzureRMVM -ResourceGroupName $recoveryVMRG -Name $recoveryVMName 

        Add-AzureRmVMDataDisk -VM $vm -Name $osDiskName -ManagedDiskId $osDisk.Id -Caching None -Lun 3 -CreateOption Attach 

        Update-AzureRMVM -VM $vm -ResourceGroupName $recoveryVMRG

     ```
     **Note** You cannot attach a managed disk to a VM that was restored from a blob image

3. After the disk is attached, remote desktop to the recovery the VM. We need to run some Azure PowerShell scripts on this recovery VM. Make sure that you have the [latest Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) installed on the recovery VM.

4. Open an elevated Azure PowerShell session (Run as administrator). Run the following commands to log in to Azure subscription:


    ```powershell
        Add-AzureRMAccount -SubscriptionID [SubscriptionID]
    ```

5. Run following and the script to check the name of the BEK file. 

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

    The following is sample of the output. Locate the BKE file name for the attached disk. In this case, we assume driver letter of the attached disk is F, and the BEK file is EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK.



        Created             Content Type Volume DiskEncryptionKeyFileName               
        -------             ------------ ------ -------------------------               
        4/5/2018 7:14:59 PM Wrapped BEK  C:\    B4B3E070-836C-4AF5-AC5B-66F6FDE6A971.BEK
        4/7/2018 7:21:16 PM Wrapped BEK  F:\    EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK
        4/7/2018 7:26:23 PM Wrapped BEK  G:\    70148178-6FAE-41EC-A05B-3431E6252539.BEK
        4/7/2018 7:26:26 PM Wrapped BEK  H:\    5745719F-4886-4940-9B51-C98AFABE5305.BEK

    You might see two duplicated volumes. In that case, the volume with newer timestamp is the current BEK file that used by the recovery VM.  

    If the Content Type is Wrapped BEK, move to the [Key Encryption Key (KEK) scenarios](#key-encryption-key-scenario).

    Now that you have the name of the .BEK for the drive, you need to create the secret-file-name.BEK file to unlock the drive. 

5.	Download the BEK file to the recovery disk. The following sample saves the BEK file into C:\BEK folder. Make sure that the `C:\BEK\` path exists before running the scripts.

```powershell
    $vault = "myKeyVault"
    $bek = " EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK"
    $keyVaultSecret = Get-AzureKeyVaultSecret -VaultName $vault -Name $bek
    $bekSecretBase64 = $keyVaultSecret.SecretValueText
    $bekFileBytes = [Convert]::FromBase64String($bekSecretbase64)
    $path = "C:\BEK\DiskEncryptionKeyFileName.BEK"
    [System.IO.File]::WriteAllBytes($path,$bekFileBytes)
```

6.	To unlock the attached disk by using the BEK file:

    ```powershell
    manage-bde -unlock F: -RecoveryKey "C:\BEK\EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK
    ```

    **Note** With the -unlock or -disable switch, the drive letter refers to the encrypted drive, so make sure you put the correct drive letter. 

    A. If the disk was successfully unlocked by using the BEK key. we can consider the BItLocker problem is resolved. 

    B.	If the disk fails to unlock by using the BEK key, you can use suspend protection, so that BitLocker is temporarily OFF:

    ```powershell
    manage-bde -protectors -disable F: -rc 0
    ```

    C. If you are going to rebuild the VM with the OS disk, then it is required to fully decrypt the drive, using this command:

    ```powershell
    manage-bde -off F:
    ```

7.	Detach the disk from the recovery VM, and then re-attach the disk to the affected VM as OS disk.  For more information, see [Troubleshoot a Windows VM by attaching the OS disk to a recovery VM](troubleshoot-recovery-disks.md).

### Key Encryption Key scenario

For Key Encryption Key scenario, follow these steps:

1. Make sure that the logged in user account must have "unwrapped" permission in the Key Vault Access policies in the **USER|Key permissions|Cryptographic Operations|Unwrap Key**.
2. Save the following scripts into a .PS1 file:

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
    # Load ADAL Assemblies
    $adal = "${env:ProgramFiles(x86)}\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Services\Microsoft.IdentityModel.Clients.ActiveDirectory.dll"
    $adalforms = "${env:ProgramFiles(x86)}\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Services\Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms.dll"
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
    $authResult = $authContext.AcquireToken($resourceAppIdURI, $clientId, $redirectUri, "Auto")
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
3. Set the parameters. The script will process the KEK secret to create the BEK key, and save it into a local folder in the recovery VM.

4. You will see the following output when the script begins:

        GAC    Version        Location                                                                              
        ---    -------        --------                                                                              
        False  v4.0.30319     C:\Program Files\WindowsPowerShell\Modules\AzureRM.profile\4.0.0\Microsoft.Identity...
        False  v4.0.30319     C:\Program Files\WindowsPowerShell\Modules\AzureRM.profile\4.0.0\Microsoft.Identity...

    When the script completes, you will see the following output:


        VERBOSE: POST https://myvault.vault.azure.net/keys/rondomkey/<KEY-ID>/unwrapkey?api-
        version=2015-06-01 with -1-byte payload
        VERBOSE: received 360-byte response of content type application/json; charset=utf-8


5. To unlock the attached disk by using the BEK file. In this case, we assume the BEK key is C:\BEK\EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK

 
    manage-bde -unlock F: -RecoveryKey "C:\BEK\EF7B2F5A-50C6-4637-9F13-7F599C12F85C.BEK



    A. You will then see that BDE was successfully able to use the BEK key to unlock the drive.

    B. If the disk fails to unlock by using the BEK key, you can use suspend protection, so that BitLocker is temporarily OFF:

        manage-bde -protectors -disable F: -rc 0


    C. If you are going to rebuild the VM with the OS disk, then it is required to fully decrypt the drive, using this command:

        manage-bde -off F:

6. Detach the disk from the recovery VM, and then re-attach the disk to the affected VM as OS disk.  For more information, see [Troubleshoot a Windows VM by attaching the OS disk to a recovery VM](troubleshoot-recovery-disks.md).









