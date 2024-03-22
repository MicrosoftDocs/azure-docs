---
title: Tutorial to import data to Azure Blob Storage with Azure Import/Export service | Microsoft Docs
description: Learn how to create import and export jobs in Azure portal to transfer data to and from Azure Blobs.
author: alkohli
services: storage
ms.service: azure-import-export
ms.topic: tutorial
ms.date: 02/01/2023
ms.author: alkohli
ms.custom: tutorial, devx-track-azurepowershell, devx-track-azurecli
---
# Tutorial: Import data to Blob Storage with Azure Import/Export service

This article provides step-by-step instructions on how to use the Azure Import/Export service to securely import large amounts of data to Azure Blob storage. To import data into Azure Blobs, the service requires you to ship encrypted disk drives containing your data to an Azure datacenter.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prerequisites to import data to Azure Blob storage
> * Step 1: Prepare the drives
> * Step 2: Create an import job
> * Step 3: Configure customer managed key (Optional)
> * Step 4: Ship the drives
> * Step 5: Update job with tracking information
> * Step 6: Verify data upload to Azure

## Prerequisites

Before you create an import job to transfer data into Azure Blob Storage, carefully review and complete the following list of prerequisites for this service.
You must:

* Have an active Azure subscription that can be used for the Import/Export service.
* Have at least one Azure Storage account with a storage container. See the list of [Supported storage accounts and storage types for Import/Export service](storage-import-export-requirements.md).
  * For information on creating a new storage account, see [How to Create a Storage Account](../storage/common/storage-account-create.md).
  * For information on creating storage containers, go to [Create a storage container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container).
* Have adequate number of disks of [supported types](storage-import-export-requirements.md#supported-disks).
* Have a Windows system running a [supported OS version](storage-import-export-requirements.md#supported-operating-systems).
* Enable BitLocker on the Windows system. See [How to enable BitLocker](https://thesolving.com/storage/how-to-enable-bitlocker-on-windows-server-2012-r2/).
* Download the current release of the Azure Import/Export version 1 tool, for blobs, on the Windows system:
  1. [Download WAImportExport version 1](https://www.microsoft.com/download/details.aspx?id=42659). The current version is 1.5.0.300.
  1. Unzip to the default folder `WaImportExportV1`. For example, `C:\WaImportExportV1`.
- [!INCLUDE [storage-import-export-shipping-prerequisites.md](../../includes/storage-import-export-shipping-prerequisites.md)]


## Step 1: Prepare the drives

This step generates a journal file. The journal file stores basic information such as drive serial number, encryption key, and storage account details.

Perform the following steps to prepare the drives.

1. Connect your disk drives to the Windows system via SATA connectors.
2. Create a single NTFS volume on each drive. Assign a drive letter to the volume. Don't use mountpoints.
3. Enable BitLocker encryption on the NTFS volume. If using a Windows Server system, use the instructions in [How to enable BitLocker on Windows Server 2012 R2](https://thesolving.com/storage/how-to-enable-bitlocker-on-windows-server-2012-r2/).
4. Copy data to encrypted volume. Use drag and drop or Robocopy or any such copy tool. A journal (*.jrn*) file is created in the same folder where you run the tool.

   If the drive is locked and you need to unlock the drive, the steps to unlock may be different depending on your use case.

   * If you have added data to a pre-encrypted drive (WAImportExport tool wasn't used for encryption), use the BitLocker key (a numerical password that you specify) in the popup to unlock the drive.

   * If you have added data to a drive that was encrypted by WAImportExport tool, use the following command to unlock the drive:

        `WAImportExport Unlock /bk:<BitLocker key (base 64 string) copied from journal (*.jrn*) file>`

5. Open a PowerShell or command-line window with administrative privileges. To change directory to the unzipped folder, run the following command:

    `cd C:\WaImportExportV1`
6. To get the BitLocker key of the drive, run the following command:

    `manage-bde -protectors -get <DriveLetter>:`
7. To prepare the disk, run the following command. **Depending on the data size, disk preparation may take several hours to days.**

    ```powershell
    ./WAImportExport.exe PrepImport /j:<journal file name> /id:session<session number> /t:<Drive letter> /bk:<BitLocker key> /srcdir:<Drive letter>:\ /dstdir:<Container name>/ /blobtype:<BlockBlob or PageBlob> /skipwrite
    ```
    
    A journal file is created in the same folder where you ran the tool. Two other files are also created - an *.xml* file (folder where you run the tool) and a *drive-manifest.xml* file (folder where data resides).

    The parameters used are described in the following table:

    |Option  |Description  |
    |---------|---------|
    |/j:     |The name of the journal file, with the .jrn extension. A journal file is generated per drive. We recommend that you use the disk serial number as the journal file name.         |
    |/id:     |The session ID. Use a unique session number for each instance of the command.      |
    |/t:     |The drive letter of the disk to be shipped. For example, drive `D`.         |
    |/bk:     |The BitLocker key for the drive. Its numerical password from output of `manage-bde -protectors -get D:`      |
    |/srcdir:     |The drive letter of the disk to be shipped followed by `:\`. For example, `D:\`.         |
    |/dstdir:     |The name of the destination container in Azure Storage.         |
    |/blobtype:     |This option specifies the type of blobs you want to import the data to. For block blobs, the blob type is `BlockBlob` and for page blobs, it's `PageBlob`.         |
    |/skipwrite:     | Specifies that there's no new data required to be copied and existing data on the disk is to be prepared.          |
    |/enablecontentmd5:     |The option when enabled, ensures that MD5 is computed and set as `Content-md5` property on each blob. Use this option only if you want to use the `Content-md5` field after the data is uploaded to Azure. <br> This option doesn't affect the data integrity check (that occurs by default). The setting does increase the time taken to upload data to cloud.          |

    > [!NOTE]
    > - If you import a blob with the same name as an existing blob in the destination container, the imported blob will overwrite the existing blob. In earlier tool versions (before 1.5.0.300), the imported blob was renamed by default, and a \Disposition parameter let you specify whether to rename, overwrite, or disregard the blob in the import.
    > - If you don't have long paths enabled on the client, and any path and file name in your data copy exceeds 256 characters, the WAImportExport tool will report failures. To avoid this kind of failure, [enable long paths on your Windows client](/windows/win32/fileio/maximum-file-path-limitation?tabs=cmd#enable-long-paths-in-windows-10-version-1607-and-later).

8. Repeat the previous step for each disk that needs to be shipped. 

   A journal file with the provided name is created for every run of the command line. 

   Together with the journal file, a `<Journal file name>_DriveInfo_<Drive serial ID>.xml` file is also created in the same folder where the tool resides. The .xml file is used in place of the journal file when creating a job if the journal file is too large.

> [!IMPORTANT]
> * Do not modify the journal files or the data on the disk drives, and don't reformat any disks, after completing disk preparation.
> * The maximum size of the journal file that the portal allows is 2 MB. If the journal file exceeds that limit, an error is returned.


## Step 2: Create an import job

# [Portal](#tab/azure-portal-preview)

[!INCLUDE [storage-import-export-preview-import-steps.md](../../includes/storage-import-export-preview-import-steps.md)]


# [Azure CLI](#tab/azure-cli)

Use the following steps to create an import job in the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-h3.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

### Create a job

1. Use the [az extension add](/cli/azure/extension#az-extension-add) command to add the [az import-export](/cli/azure/import-export) extension:

    ```azurecli
    az extension add --name import-export
    ```

1. You can use an existing resource group or create one. To create a resource group, run the [az group create](/cli/azure/group#az-group-create) command:

    ```azurecli
    az group create --name myierg --location "West US"
    ```

1. You can use an existing storage account or create one. To create a storage account, run the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command:

    ```azurecli
    az storage account create --resource-group myierg --name myssdocsstorage --https-only
    ```

1. To get a list of the locations to which you can ship disks, use the [az import-export location list](/cli/azure/import-export/location#az-import-export-location-list) command:

    ```azurecli
    az import-export location list
    ```

1. Use the [az import-export location show](/cli/azure/import-export/location#az-import-export-location-show) command to get locations for your region:

    ```azurecli
    az import-export location show --location "West US"
    ```

1. Run the following [az import-export create](/cli/azure/import-export#az-import-export-create) command to create an import job:

    ```azurecli
    az import-export create \
        --resource-group myierg \
        --name MyIEjob1 \
        --location "West US" \
        --backup-drive-manifest true \
        --diagnostics-path waimportexport \
        --drive-list bit-locker-key=439675-460165-128202-905124-487224-524332-851649-442187 \
            drive-header-hash= drive-id=AZ31BGB1 manifest-file=\\DriveManifest.xml \
            manifest-hash=69512026C1E8D4401816A2E5B8D7420D \
        --type Import \
        --log-level Verbose \
        --shipping-information recipient-name="Microsoft Azure Import/Export Service" \
            street-address1="3020 Coronado" city="Santa Clara" state-or-province=CA postal-code=98054 \
            country-or-region=USA phone=4083527600 \
        --return-address recipient-name="Gus Poland" street-address1="1020 Enterprise way" \
            city=Sunnyvale country-or-region=USA state-or-province=CA postal-code=94089 \
            email=gus@contoso.com phone=4085555555" \
        --return-shipping carrier-name=FedEx carrier-account-number=123456789 \
        --storage-account myssdocsstorage
    ```

   > [!TIP]
   > Instead of specifying an email address for a single user, provide a group email. This ensures that you receive notifications even if an admin leaves.

1. Use the [az import-export list](/cli/azure/import-export#az-import-export-list) command to see all the jobs for the myierg resource group:

    ```azurecli
    az import-export list --resource-group myierg
    ```

1. To update your job or cancel your job, run the [az import-export update](/cli/azure/import-export#az-import-export-update) command:

    ```azurecli
    az import-export update --resource-group myierg --name MyIEjob1 --cancel-requested true
    ```


# [Azure PowerShell](#tab/azure-powershell)

Use the following steps to create an import job in Azure PowerShell.

[!INCLUDE [azure-powershell-requirements-h3.md](../../includes/azure-powershell-requirements-h3.md)]

> [!IMPORTANT]
> While the **Az.ImportExport** PowerShell module is in preview, you must install it separately
> using the `Install-Module` cmdlet. After this PowerShell module becomes generally available, it
> will be part of future Az PowerShell module releases and available by default from within Azure
> Cloud Shell.

```azurepowershell-interactive
Install-Module -Name Az.ImportExport
```

### Create a job

1. You can use an existing resource group or create one. To create a resource group, run the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet:

   ```azurepowershell-interactive
   New-AzResourceGroup -Name myierg -Location westus
   ```

1. You can use an existing storage account or create one. To create a storage account, run the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet:

   ```azurepowershell-interactive
   New-AzStorageAccount -ResourceGroupName myierg -AccountName myssdocsstorage -SkuName Standard_RAGRS -Location westus -EnableHttpsTrafficOnly $true
   ```

1. To get a list of the locations to which you can ship disks, use the [Get-AzImportExportLocation](/powershell/module/az.importexport/get-azimportexportlocation) cmdlet:

   ```azurepowershell-interactive
   Get-AzImportExportLocation
   ```

1. Use the `Get-AzImportExportLocation` cmdlet with the `Name` parameter to get locations for your region:

   ```azurepowershell-interactive
   Get-AzImportExportLocation -Name westus
   ```

1. Run the following [New-AzImportExport](/powershell/module/az.importexport/new-azimportexport) example to create an import job:

   ```azurepowershell-interactive
   $driveList = @(@{
     DriveId = '9CA995BA'
     BitLockerKey = '439675-460165-128202-905124-487224-524332-851649-442187'
     ManifestFile = '\\DriveManifest.xml'
     ManifestHash = '69512026C1E8D4401816A2E5B8D7420D'
     DriveHeaderHash = 'AZ31BGB1'
   })

   $Params = @{
      ResourceGroupName = 'myierg'
      Name = 'MyIEjob1'
      Location = 'westus'
      BackupDriveManifest = $true
      DiagnosticsPath = 'waimportexport'
      DriveList = $driveList
      JobType = 'Import'
      LogLevel = 'Verbose'
      ShippingInformationRecipientName = 'Microsoft Azure Import/Export Service'
      ShippingInformationStreetAddress1 = '3020 Coronado'
      ShippingInformationCity = 'Santa Clara'
      ShippingInformationStateOrProvince = 'CA'
      ShippingInformationPostalCode = '98054'
      ShippingInformationCountryOrRegion = 'USA'
      ShippingInformationPhone = '4083527600'
      ReturnAddressRecipientName = 'Gus Poland'
      ReturnAddressStreetAddress1 = '1020 Enterprise way'
      ReturnAddressCity = 'Sunnyvale'
      ReturnAddressStateOrProvince = 'CA'
      ReturnAddressPostalCode = '94089'
      ReturnAddressCountryOrRegion = 'USA'
      ReturnAddressPhone = '4085555555'
      ReturnAddressEmail = 'gus@contoso.com'
      ReturnShippingCarrierName = 'FedEx'
      ReturnShippingCarrierAccountNumber = '123456789'
      StorageAccountId = '/subscriptions/<SubscriptionId>/resourceGroups/myierg/providers/Microsoft.Storage/storageAccounts/myssdocsstorage'
   }
   New-AzImportExport @Params
   ```

   > [!TIP]
   > Instead of specifying an email address for a single user, provide a group email. This ensures that you receive notifications even if an admin leaves.

1. Use the [Get-AzImportExport](/powershell/module/az.importexport/get-azimportexport) cmdlet to see all the jobs for the myierg resource group:

   ```azurepowershell-interactive
   Get-AzImportExport -ResourceGroupName myierg
   ```

1. To update your job or cancel your job, run the [Update-AzImportExport](/powershell/module/az.importexport/update-azimportexport) cmdlet:

   ```azurepowershell-interactive
   Update-AzImportExport -Name MyIEjob1 -ResourceGroupName myierg -CancelRequested
   ```

---

## Step 3 (Optional): Configure customer managed key

Skip this step and go to the next step if you want to use the Microsoft managed key to protect your BitLocker keys for the drives. To configure your own key to protect the BitLocker key, follow the instructions in [Configure customer-managed keys with Azure Key Vault for Azure Import/Export in the Azure portal](storage-import-export-encryption-key-portal.md).

## Step 4: Ship the drives

[!INCLUDE [storage-import-export-ship-drives](../../includes/storage-import-export-ship-drives.md)]

## Step 5: Update the job with tracking information

[!INCLUDE [storage-import-export-update-job-tracking](../../includes/storage-import-export-update-job-tracking.md)]

## Step 6: Verify data upload to Azure

[!INCLUDE [storage-import-export-verify-data-copy](../../includes/storage-import-export-verify-data-copy.md)]

> [!NOTE]
> If any path and file name exceeds 256 characters, and long paths aren't enabled on the client, the data upload will fail. To avoid this kind of failure, [enable long paths on your Windows client](/windows/win32/fileio/maximum-file-path-limitation?tabs=cmd#enable-long-paths-in-windows-10-version-1607-and-later).

## Next steps

* [View the job and drive status](storage-import-export-view-drive-status.md)
* [Review Import/Export copy logs](storage-import-export-tool-reviewing-job-status-v1.md)
