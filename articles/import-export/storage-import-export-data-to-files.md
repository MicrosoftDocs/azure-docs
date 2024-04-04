---
title: Tutorial to transfer data to Azure Files with Azure Import/Export | Microsoft Docs
description: Learn how to create import jobs in the Azure portal to transfer data to Azure Files.
author: alkohli
services: storage
ms.service: azure-import-export
ms.topic: tutorial
ms.date: 02/13/2023
ms.author: alkohli
ms.custom: tutorial, devx-track-azurepowershell, devx-track-azurecli
---
# Tutorial: Transfer data to Azure Files with Azure Import/Export

This article provides step-by-step instructions on how to use the Azure Import/Export service to securely import large amounts of data into Azure Files. To import data, the service requires you to ship supported disk drives containing your data to an Azure datacenter.

The Import/Export service supports only import of Azure Files into Azure Storage. Exporting Azure Files isn't supported.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prerequisites to import data to Azure Files
> * Step 1: Prepare the drives
> * Step 2: Create an import job
> * Step 3: Ship the drives to Azure datacenter
> * Step 4: Update the job with tracking information
> * Step 5: Verify data upload to Azure

## Prerequisites

Before you create an import job to transfer data into Azure Files, carefully review and complete the following list of prerequisites. You must:

- Have an active Azure subscription to use with Import/Export service.
- Have at least one Azure Storage account. See the list of [Supported storage accounts and storage types for Import/Export service](storage-import-export-requirements.md).
  - Consider configuring large file shares on the storage account. During imports to Azure Files, if a file share doesn't have enough free space, auto splitting the data to multiple Azure file shares is no longer supported, and the copy will fail. For instructions, see [Configure large file shares on a storage account](../storage/files/storage-how-to-create-file-share.md?tabs=azure-portal#enable-large-file-shares-on-an-existing-account).
  - For information on creating a new storage account, see [How to create a storage account](../storage/common/storage-account-create.md).
- Have an adequate number of disks of [supported types](storage-import-export-requirements.md#supported-disks).
- Have a Windows system running a [supported OS version](storage-import-export-requirements.md#supported-operating-systems).
- Download the current release of the Azure Import/Export version 2 tool, for files, on the Windows system:
  1. [Download WAImportExport version 2](https://aka.ms/waiev2). The current version is 2.2.0.300.
  1. Unzip to the default folder `WaImportExportV2`. For example, `C:\WaImportExportV2`.
- [!INCLUDE [storage-import-export-shipping-prerequisites.md](../../includes/storage-import-export-shipping-prerequisites.md)]


## Step 1: Prepare the drives

This step generates a journal file. The journal file stores basic information such as drive serial number, encryption key, and storage account details.

Do the following steps to prepare the drives.

1. Connect your disk drives to the Windows system via SATA connectors.
2. Create a single NTFS volume on each drive. Assign a drive letter to the volume. Do not use mountpoints.
3. Modify the *dataset.csv* file in the root folder where the tool is. Depending on whether you want to import a file or folder or both, add entries in the *dataset.csv* file similar to the following examples.

   - **To import a file**: In the following example, the data to copy is on the F: drive. Your file *MyFile1.txt*  is copied to the root of the *MyAzureFileshare1*. If the *MyAzureFileshare1* doesn't exist, it's created in the Azure Storage account. Folder structure is maintained.

       ```
           BasePath,DstItemPathOrPrefix,ItemType
           "F:\MyFolder1\MyFile1.txt","MyAzureFileshare1/MyFile1.txt",file
       ```

   - **To import a folder**: All files and folders under *MyFolder2* are recursively copied to the fileshare. Folder structure is maintained. If you import a file with the same name as an existing file in the destination folder, the imported file will overwrite that file.

       ```
           "F:\MyFolder2\","MyAzureFileshare1/",file
       ```
   
       > [!NOTE]
       > The /Disposition parameter, which let you choose what to do when you import a file that already exists in earlier versions of the tool, isn't supported in Azure Import/Export version 2.2.0.300. In the earlier tool versions, an imported file with the same name as an existing file was renamed by default.

     Multiple entries can be made in the same file corresponding to folders or files that are imported.

       ```
           "F:\MyFolder1\MyFile1.txt","MyAzureFileshare1/MyFile1.txt",file
           "F:\MyFolder2\","MyAzureFileshare1/",file
       ```

4. Modify the *driveset.csv* file in the root folder where the tool is. Add entries in the *driveset.csv* file similar to the following examples. The driveset file has the list of disks and corresponding drive letters so that the tool can correctly pick the list of disks to be prepared.

    This example assumes that two disks are attached and basic NTFS volumes G:\ and H:\ are created. H:\is not encrypted while G: is already encrypted. The tool formats and encrypts the disk that hosts H:\ only (and not G:\).

   - **For a disk that isn't encrypted**: Specify *Encrypt* to enable BitLocker encryption on the disk.

       ```
       DriveLetter,FormatOption,SilentOrPromptOnFormat,Encryption,ExistingBitLockerKey
       H,Format,SilentMode,Encrypt,
       ```

   - **For a disk that is already encrypted**: Specify *AlreadyEncrypted* and supply the BitLocker key.

       ```
       DriveLetter,FormatOption,SilentOrPromptOnFormat,Encryption,ExistingBitLockerKey
       G,AlreadyFormatted,SilentMode,AlreadyEncrypted,060456-014509-132033-080300-252615-584177-672089-411631
       ```

     Multiple entries can be made in the same file corresponding to multiple drives. Learn more about [preparing the driveset CSV file](/previous-versions/azure/storage/common/storage-import-export-tool-preparing-hard-drives-import).

5. Use the `PrepImport` option to copy and prepare data to the disk drive. For the first copy session to copy directories and/or files with a new copy session, run the following command:

    ```cmd
    .\WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> [/logdir:<LogDirectory>] [/silentmode] [/InitialDriveSet:<driveset.csv>]/DataSet:<dataset.csv>
    ```

   An import example is shown below.

    ```cmd
    .\WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#1 /InitialDriveSet:driveset.csv /DataSet:dataset.csv /logdir:C:\logs
    ```

    > [!NOTE]
    > If you don't have long paths enabled on the client, and any path and file name in your data copy exceeds 256 characters, the WAImportExport tool will report failures. To avoid this kind of failure, [enable long paths on your Windows client](/windows/win32/fileio/maximum-file-path-limitation?tabs=cmd#enable-long-paths-in-windows-10-version-1607-and-later).

6. A journal file with name you provided with `/j:` parameter, is created for every run of the command line. Each drive you prepare has a journal file that must be uploaded when you create the import job. Drives without journal files aren't processed.

    > [!IMPORTANT]
    > Do not modify the journal files or the data on the disk drives, and don't reformat any disks, after completing disk preparation.

For additional samples, go to [Samples for journal files](#samples-for-journal-files).

## Step 2: Create an import job

### [Portal](#tab/azure-portal-preview)

[!INCLUDE [storage-import-export-preview-import-steps.md](../../includes/storage-import-export-preview-import-steps.md)]

### [Azure CLI](#tab/azure-cli)

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
    az storage account create -resource-group myierg -name myssdocsstorage --https-only
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
   > Instead of specifying an email address for a single user, provide a group email to ensure that you receive notifications even if an admin leaves.


1. Use the [az import-export list](/cli/azure/import-export#az-import-export-list) command to see all the jobs for the myierg resource group:

    ```azurecli
    az import-export list --resource-group myierg
    ```

1. To update your job or cancel your job, run the [az import-export update](/cli/azure/import-export#az-import-export-update) command:

    ```azurecli
    az import-export update --resource-group myierg --name MyIEjob1 --cancel-requested true
    ```

### [Azure PowerShell](#tab/azure-powershell)

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
   > Instead of specifying an email address for a single user, provide a group email to ensure that you receive notifications even if an admin leaves.

1. Use the [Get-AzImportExport](/powershell/module/az.importexport/get-azimportexport) cmdlet to see all the jobs for the myierg resource group:

   ```azurepowershell-interactive
   Get-AzImportExport -ResourceGroupName myierg
   ```

1. To update your job or cancel your job, run the [Update-AzImportExport](/powershell/module/az.importexport/update-azimportexport) cmdlet:

   ```azurepowershell-interactive
   Update-AzImportExport -Name MyIEjob1 -ResourceGroupName myierg -CancelRequested
   ```

---

## Step 3: Ship the drives to the Azure datacenter

[!INCLUDE [storage-import-export-ship-drives](../../includes/storage-import-export-ship-drives.md)]

## Step 4: Update the job with tracking information

[!INCLUDE [storage-import-export-update-job-tracking](../../includes/storage-import-export-update-job-tracking.md)]

## Step 5: Verify data upload to Azure

[!INCLUDE [storage-import-export-verify-data-copy](../../includes/storage-import-export-verify-data-copy.md)]

> [!NOTE]
> In the latest version of the Azure Import/Export tool for files (2.2.0.300), if a file share doesn't have enough free space, the data is no longer auto split to multiple Azure file shares. Instead, the copy fails, and you'll be contacted by Support. You'll need to either configure large file shares on the storage account or move around some data to make space in the share. For more information, see [Configure large file shares on a storage account](../storage/files/storage-how-to-create-file-share.md?tabs=azure-portal#enable-large-file-shares-on-an-existing-account).


## Samples for journal files

To **add more drives**, create a new driveset file and run the command as below.

For subsequent copy sessions to disk drives other than those specified in the *InitialDriveset .csv* file, specify a new driveset *.csv* file and provide it as a value to the parameter `AdditionalDriveSet`. Use the **same journal file** name and provide a **new session ID**. The format of AdditionalDriveset CSV file is same as InitialDriveSet format.

```cmd
WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> /AdditionalDriveSet:<driveset.csv>
```

An import example is shown below.

```cmd
WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#3  /AdditionalDriveSet:driveset-2.csv
```


To add additional data to the same driveset, use the PrepImport command for subsequent copy sessions to copy additional files/directory.

For subsequent copy sessions to the same hard disk drives specified in *InitialDriveset.csv* file, specify the **same journal file** name and provide a **new session ID**; there is no need to provide the storage account key.

```cmd
WAImportExport PrepImport /j:<JournalFile> /id:<SessionId> /j:<JournalFile> /id:<SessionId> [/logdir:<LogDirectory>] DataSet:<dataset.csv>
```

An import example is shown below.

```cmd
WAImportExport.exe PrepImport /j:JournalTest.jrn /id:session#2  /DataSet:dataset-2.csv
```

## Next steps

* [View the job and drive status](storage-import-export-view-drive-status.md)
* [Review Import/Export copy logs](storage-import-export-tool-reviewing-job-status-v1.md)
