---
title: Tutorial to copy data to Azure Data Box Disk| Microsoft Docs
description: In this tutorial, learn how to copy data from your host computer to Azure Data Box Disk and then generate checksums to verify data integrity.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: disk
ms.topic: tutorial
ms.date: 03/26/2024
ms.author: shaas
---

<!--
# Customer intent: As an IT admin, I need to be able to order Data Box Disk to upload on-premises data from my server onto Azure.

# Doc scores:
#    11/18/22: 75 (2456/62)
#    09/01/23: 100 (2159/0)
-->

::: zone target="docs"

# Tutorial: Copy data to Azure Data Box Disk and verify

::: zone-end

::: zone target="chromeless"

## Copy data to Azure Data Box Disk and validate

After the disks are connected and unlocked, you can copy data from your source data server to your disks. After the data copy is complete, you should validate the data to ensure that it will successfully upload to Azure.

::: zone-end

::: zone target="docs"

> [!IMPORTANT]
> Azure Data Box now supports access tier assignment at the blob level. The steps contained within this tutorial reflect the updated data copy process and are specific to block blobs. 
>
>For help with determining the appropriate access tier for your block blob data, refer to the [Determine appropriate access tiers for block blobs](#determine-appropriate-access-tiers-for-block-blobs) section. Follow the steps containined within the [Copy data to disks](#copy-data-to-disks) section to copy your data to the appropriate access tier.
>
> The information contained within this section applies to orders placed after April 1, 2024.

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly.

This tutorial describes how to copy data from your host computer and generate checksums to verify data integrity.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Determine appropriate access tiers for block blobs
> * Copy data to Data Box Disk
> * Verify data

## Prerequisites

Before you begin, make sure that:

- You have completed the [Tutorial: Install and configure your Azure Data Box Disk](data-box-disk-deploy-set-up.md).
- Your disks are unlocked and connected to a client computer.
- The client computer used to copy data to the disks is running a [Supported operating system](data-box-disk-system-requirements.md#supported-operating-systems-for-clients).
- The intended storage type for your data matches the [Supported storage types](data-box-disk-system-requirements.md#supported-storage-types-for-upload).
- You've reviewed [Managed disk limits in Azure object size limits](data-box-disk-limits.md#azure-object-size-limits).

## Determine appropriate access tiers for block blobs

> [!IMPORTANT]
> The information contained within this section applies to orders placed after April 1<sup>st</sup>, 2024.

Azure Storage allows you to store block blob data in multiple access tiers within the same storage account. This ability allows data to be organized and stored more efficiently based on how often it's accessed. The following table contains information and recommendations about Azure Storage access tiers.

| Tier        | Recommendation | Best practice |
|-------------|----------------|---------------|
| **Hot**     | Useful for online data accessed or modified frequently. This tier has the highest storage costs, but the lowest access costs. | Data in this tier should be in regular and active use. |
| **Cool**    | Useful for online data accessed or modified infrequently. This tier has lower storage costs and higher access costs than the hot tier. | Data in this tier should be stored for at least 30 days. |
| **Cold**    | Useful for online data accessed or modified rarely but still requiring fast retrieval. This tier has lower storage costs and higher access costs than the cool tier.| Data in this tier should be stored for a minimum of 90 days. |
| **Archive** | Useful for offline data rarely accessed and having lower latency requirements. | Data in this tier should be stored for a minimum of 180 days. Data removed from the archive tier within 180 days is subject to an early deletion charge. |

For more information about blob access tiers, see [Access tiers for blob data](../storage/blobs/access-tiers-overview.md). For more detailed best practices, see [Best practices for using blob access tiers](../storage/blobs/access-tiers-best-practices.md).

You can transfer your block blob data to the appropriate access tier by copying it to the corresponding folder within Data Box Disk. This process is discussed in greater detail within the [Copy data to disks](#copy-data-to-disks) section.

## Copy data to disks

Review the following considerations before you copy the data to the disks:

- It is your responsibility to copy local data to the share that corresponds to the appropriate data format. For instance, copy block blob data to the *BlockBlob* share. Copy VHDs to the *PageBlob* share. If the local data format doesn't match the appropriate folder for the chosen storage type, the data upload to Azure fails in a later step.
- You can't copy data directly to a share's *root* folder. Instead, create a folder within the appropriate share and copy your data into it.
    - Folders located at the *PageBlob* share's *root* correspond to containers within your storage account. A new container is created for any folder whose name doesn't match an existing container within your storage account.
    - Folders located at the *AzFile* share's *root* correspond to Azure file shares. A new file share is created for any folder whose name doesn't match an existing file share within your storage account.
    - The *BlockBlob* share's *root* level contains one folder corresponding to each access tier. When copying data to the *BlockBlob* share, create a subfolder within the top-level folder corresponding to the desired access tier. As with the *PageBlob* share, a new container is created for any folder whose name doesn't match an existing container. Data within the container is copied to the tier corresponding to the subfolder's top-level parent.
    
      A container is also created for any folder residing at the *BlockBlob* share's *root*, and data it contains is copied to the container's default access tier. To ensure that your data is copied to the desired access tier, don't create folders at the *root* level.

   > [!IMPORTANT]
   > Data uploaded to the archive tier remains offline and needs to be rehydrated before reading or modifying. Data copied to the archive tier must remain for at least 180 days or be subject to an early deletion charge. Archive tier is not supported for ZRS, GZRS, or RA-GZRS accounts.
    
- While copying data, ensure that the data size conforms to the size limits described within in the [Azure storage and Data Box Disk limits](data-box-disk-limits.md) article.
- Don't disable BitLocker encryption on Data Box Disks. Disabling BitLocker encryption results in upload failure after the disks are returned. Disabling BitLocker also leaves disks in an unlocked state, creating security concerns.
- To preserve metadata such as ACLs, timestamps, and file attributes when transferring data to Azure Files, follow the guidance within the [Preserving file ACLs, attributes, and timestamps with Azure Data Box Disk](data-box-disk-file-acls-preservation.md) article.
- If you use both Data Box Disk and other applications to upload data simultaneously, you might experience upload job failures and data corruption.

   > [!IMPORTANT]
   >  If you specified managed disks as one of the storage destinations during order creation, the following section is applicable.

- Ensure that virtual hard disks (VHDs) uploaded to the precreated folders have unique names within resource groups. Managed disks must have unique names within a resource group across all the precreated folders on the Data Box Disk. If you're using multiple Data Box Disks, managed disk names must be unique across all folder and disks. When VHDs with duplicate names are found, only one is converted to a managed disk with that name. The remaining VHDs are uploaded as page blobs into the staging storage account.
- Always copy the VHDs to one of the precreated folders. VHDs placed outside of these folders or in a folder that you created are uploaded to Azure Storage accounts as page blobs instead of managed disks.
- Only fixed VHDs can be uploaded to create managed disks. Dynamic VHDs, differencing VHDs, and VHDX files aren't supported.
- The Data Box Disk Split Copy and Validation tools, `DataBoxDiskSplitCopy.exe` and `DataBoxDiskValidation.cmd`, report failures when long paths are processed. These failures are common when long paths aren't enabled on the client, and your data copy's paths and file names exceed 256 characters. To avoid these failures, follow the guidance within the [enable long paths on your Windows client](/windows/win32/fileio/maximum-file-path-limitation?tabs=cmd#enable-long-paths-in-windows-10-version-1607-and-later) article.

Perform the following steps to connect and copy data from your computer to the Data Box Disk.

1. View the contents of the unlocked drive. The list of the precreated folders and subfolders in the drive varies according to the options you select when placing the Data Box Disk order. The creation of extra folders isn't permitted, as copying data to a user-created folder causes upload failures.

    |Selected storage destination  |Storage account type|Staging storage account type |Folders and subfolders  |
    |------------------------------|--------------------|-----------------------------|------------------------|
    |Storage account               |GPv1 or GPv2        | NA                          | BlockBlob<ul><li>Archive</li><li>Cold</li><li>Cool</li><li>Hot</li></ul>PageBlob<br>AzureFile |
    |Storage account               |Blob storage account| NA                          | BlockBlob<ul><li>Archive</li><li>Cold</li><li>Cool</li><li>Hot</li></ul> |
    |Managed disks                 |NA                  | GPv1 or GPv2                | ManagedDisk<ul><li>PremiumSSD</li><li>StandardSSD</li><li>StandardHDD</li></ul> |
    |Storage account<br>Managed disks |GPv1 or GPv2     | GPv1 or GPv2                | BlockBlob<ul><li>Archive</li><li>Cold</li><li>Cool</li><li>Hot</li></ul>PageBlob<br/>AzureFile<br/>ManagedDisk<ul><li>PremiumSSD</li><li>StandardSSD</li><li>StandardHDD</li></ul>|
    |Storage account <br> Managed disks |Blob storage account | GPv1 or GPv2          |BlockBlob<ul><li>Archive</li><li>Cold</li><li>Cool</li><li>Hot</li></ul>ManagedDisk<ul> <li>PremiumSSD</li><li>StandardSSD</li><li>StandardHDD</li></ul> |

    The following screenshot shows an order where a GPv2 storage account and archive tier were specified:

    :::image type="content" source="media/data-box-disk-deploy-copy-data/content-sml.png" alt-text="Screenshot of the contents of the disk drive." lightbox="media/data-box-disk-deploy-copy-data/content.png":::

1.  Copy VHD or VHDX data to the *PageBlob* folder. All files copied to the *PageBlob* folder are copied into a default `$root` container within the Azure Storage account. A container is created in the Azure storage account for each subfolder within the *PageBlob* folder.

    Copy data to be placed in Azure file shares to a subfolder within the *AzureFile* folder. All files copied to the *AzureFile* folder are copied as files to a default container of type `databox-format-[GUID]`, for example, `databox-azurefile-7ee19cfb3304122d940461783e97bf7b4290a1d7`.

    You can't copy files directly to the *BlockBlob*'s *root* folder. Within the root folder, you find a subfolder corresponding to each of the available access tiers. To copy your blob data, you must first select the folder corresponding to one of the access tiers. Next, create a subfolder within that tier's folder to store your data. Finally, copy your data to the newly created subfolder. Your new subfolder represents the container created within the storage account during ingestion. Your data is uploaded to this container as blobs. As with the *AzureFile* share, a new blob storage container is created for each subfolder located at the *BlockBlob*'s *root* folder. The data within these folders is saved according to the storage account's default access tier.

    Before you begin to copy data, you need to move any files and folders that exist in the root directory to a different folder.

    > [!IMPORTANT]
    > All the containers, blobs, and filenames should conform to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). If these rules are not followed, the data upload to Azure will fail.

1. When copying files, ensure that files don't exceed 4.7 TiB for block blobs, 8 TiB for page blobs, and 1 TiB for Azure Files.
1. You can use File Explorer's drag and drop functionality to copy the data. You can also use any SMB compatible file copy tool such as Robocopy to copy your data.

   One benefit of using a file copy tool is the ability to initiate multiple copy jobs, as in the following example using the Robocopy tool:

    `Robocopy <source> <destination>  * /MT:64 /E /R:1 /W:1 /NFL /NDL /FFT /Log:c:\RobocopyLog.txt`

    >[!NOTE]
    > The parameters used in this example are based on the environment used during in-house testing. Your paramters and values are likely different.

    The parameters and options for the command are used as follows:

    |Parameters/Options |Description |
    |-------------------|------------|
    |Source             | Specifies the path to the source directory. |
    |Destination        | Specifies the path to the destination directory. |
    |/E                 | Copies subdirectories including empty directories. |
    |/MT[:n]            | Creates multi-threaded copies with *n* threads where *n* is an integer between 1 and 128.<br>The default value for *n* is 8. |
    |/R: \<n>           | Specifies the number of retries on failed copies.<br>The default value of *n* is 1,000,000 retries. |
    |/W: \<n>           | Specifies the wait time between retries, in seconds.<br>The default value of *n* is 30 and is equivalent to a wait time 30 seconds. |
    |/NFL               | Specifies that file names aren't logged. |
    |/NDL               | Specifies that directory names aren't to be logged. |
    |/FFT               | Assumes FAT file times with a resolution precision of two seconds. |
    |/Log:\<Log File>   | Writes the status output to the log file.<br>Any existing log file is overwritten. |

    Multiple disks can be used in parallel with multiple jobs running on each disk. Keep in mind that duplicate filenames are either overwritten or result in a copy error.

1. Check the copy status when the job is in progress. The following sample shows the output of the robocopy command to copy files to the Data Box Disk.

   ```Sample output
      
   C:\Users>robocopy
   -------------------------------------------------------------------------------
      ROBOCOPY     ::     Robust File Copy for Windows
   -------------------------------------------------------------------------------
 
      Started : Thursday, March 8, 2018 2:34:53 PM
         Simple Usage :: ROBOCOPY source destination /MIR

               source :: Source Directory (drive:\path or \\server\share\path).
          destination :: Destination Dir  (drive:\path or \\server\share\path).
                 /MIR :: Mirror a complete directory tree.

     For more usage information run ROBOCOPY /?    

     ****  /MIR can DELETE files as well as copy them !
    
   C:\Users>Robocopy C:\Repository\guides \\10.126.76.172\AzFileUL\templates /MT:64 /E /R:1 /W:1 /FFT 
   -------------------------------------------------------------------------------
      ROBOCOPY     ::     Robust File Copy for Windows
   -------------------------------------------------------------------------------

      Started : Thursday, March 8, 2018 2:34:58 PM
       Source : C:\Repository\guides\
         Dest : \\10.126.76.172\devicemanagertest1_AzFile\templates\
    
        Files : *.*
    
      Options : *.* /DCOPY:DA /COPY:DAT /MT:8 /R:1000000 /W:30
    
    ------------------------------------------------------------------------------
    
    100%    New File    206    C:\Repository\guides\article-metadata.md
    100%    New File    209    C:\Repository\guides\content-channel-guidance.md
    100%    New File    732    C:\Repository\guides\index.md
    100%    New File    199    C:\Repository\guides\pr-criteria.md
    100%    New File    178    C:\Repository\guides\pull-request-co.md
    100%    New File    250    C:\Repository\guides\pull-request-ete.md
    100%    New File    174    C:\Repository\guides\create-images-markdown.md
    100%    New File    197    C:\Repository\guides\create-links-markdown.md
    100%    New File    184    C:\Repository\guides\create-tables-markdown.md
    100%    New File    208    C:\Repository\guides\custom-markdown-extensions.md
    100%    New File    210    C:\Repository\guides\file-names-and-locations.md
    100%    New File    234    C:\Repository\guides\git-commands-for-master.md
    100%    New File    186    C:\Repository\guides\release-branches.md
    100%    New File    240    C:\Repository\guides\retire-or-rename-an-article.md
    100%    New File    215    C:\Repository\guides\style-and-voice.md
    100%    New File    212    C:\Repository\guides\syntax-highlighting-markdown.md
    100%    New File    207    C:\Repository\guides\tools-and-setup.md
    ------------------------------------------------------------------------------
    
                   Total    Copied   Skipped  Mismatch    FAILED    Extras
        Dirs :         1         1         1         0         0         0
       Files :        17        17         0         0         0         0
       Bytes :     3.9 k     3.9 k         0         0         0         0
       Times :   0:00:05   0:00:00                       0:00:00   0:00:00
        
       Speed :                5620 Bytes/sec.
       Speed :               0.321 MegaBytes/min.
       Ended : Thursday, August 31, 2023 2:34:59 PM

    ```

    To optimize the performance, use the following robocopy parameters when copying the data.

    | Platform      | Mostly small files < 512 KB | Mostly medium  files 512 KB-1 MB | Mostly large files > 1 MB |
    |---------------|-----------------------------|----------------------------------|---------------------------|
    | Data Box Disk | 4 Robocopy sessions*<br>16 threads per session | 2 Robocopy session*<br>16 threads per session | 2 Robocopy session*<br>16 threads per session |

    **Each Robocopy session can have a maximum of 7,000 directories and 150 million files.*

    For more information on the Robocopy command, read the [Robocopy and a few examples](https://social.technet.microsoft.com/wiki/contents/articles/1073.robocopy-and-a-few-examples.aspx) article.

1. Open the target folder, then view and verify the copied files. If you have any errors during the copy process, download the log files for troubleshooting. The robocopy command's output specifies the location of the log files.

### Split and copy data to disks

The Data Box Split Copy tool helps split and copy data across two or more Azure Data Box Disks. The tool is only available for use on a Windows computer. This optional procedure is helpful when you have a large dataset that needs to be split and copied across several disks.

>[!IMPORTANT]
> The Data Box Split Copy tool can also validate your data. If you use Data Box Split Copy tool to copy data, you can skip the [validation step](#validate-data).
> The Split Copy tool is not supported with managed disks.

1. On your Windows computer, ensure that you have the Data Box Split Copy tool downloaded and extracted in a local folder. This tool is included within the Data Box Disk toolset for Windows.
1. Open File Explorer. Make a note of the data source drive and drive letters assigned to Data Box Disk.

   :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-1-sml.png" alt-text="Screenshot of the data source drive and drive letters assigned to Data Box Disk." lightbox="media/data-box-disk-deploy-copy-data/split-copy-1.png":::

1. Identify the source data to copy. For instance, in this case:
   - The following block blob data was identified.

      :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-2-sml.png" alt-text="Screenshot of block blob data identified for the copy process." lightbox="media/data-box-disk-deploy-copy-data/split-copy-2.png":::

   - The following page blob data was identified.

      :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-3-sml.png" alt-text="Screenshot of page blob data identified for the copy process." lightbox="media/data-box-disk-deploy-copy-data/split-copy-3.png":::

1. Navigate to the folder where the software is extracted and locate the `SampleConfig.json` file. This file is a read-only file that you can modify and save.

   :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-4-sml.png" alt-text="Screenshot showing the location of the sample configuration file." lightbox="media/data-box-disk-deploy-copy-data/split-copy-4.png":::

1. Modify the `SampleConfig.json` file.

   - Provide a job name. A folder with this name is created on the Data Box Disk. The name is also used to create a container in the Azure storage account associated with these disks. The job name must follow the [Azure container naming conventions](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).
   - Supply a source path, making note of the path format in the `SampleConfigFile.json`.
   - Enter the drive letters corresponding to the target disks. Data is taken from the source path and copied across multiple disks.
   - Provide a path for the log files. By default, log files are sent to the directory where the `.exe` file is located.
   - To validate the file format, go to `JSONlint`.

      :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-5.png" alt-text="Screenshot showing the contents of the sample configuration file.":::

   - Save the file as `ConfigFile.json`.

      :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-6-sml.png" alt-text="Screenshot showing the location of the replacement configuration file." lightbox="media/data-box-disk-deploy-copy-data/split-copy-6.png":::

1. Open a Command Prompt window with elevated privileges and run the `DataBoxDiskSplitCopy.exe` using the following command.

   ```Command prompt
   DataBoxDiskSplitCopy.exe PrepImport /config:ConfigFile.json
   ```

1. When prompted, press any key to continue running the tool.

   :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-8-sml.png" alt-text="Screenshot showing the command prompt window executing the Split Copy tool." lightbox="media/data-box-disk-deploy-copy-data/split-copy-8.png":::
  
1. After the dataset is split and copied, the summary of the Split Copy tool for the copy session is presented as shown in the following sample output.

   :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-9-sml.png" alt-text="Screenshot showing the summary presented after successful execution of the Split Copy tool." lightbox="media/data-box-disk-deploy-copy-data/split-copy-9.png":::

1. Verify that the data is split properly across the target disks.

   :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-10-sml.png" alt-text="Screenshot indicating resulting data split properly across the first of two target disks." lightbox="media/data-box-disk-deploy-copy-data/split-copy-10.png":::

   :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-11-sml.png" alt-text="Screenshot indicating resulting data split properly across the second of two target disks." lightbox="media/data-box-disk-deploy-copy-data/split-copy-11.png":::

   Examine the `H:` drive contents and ensure that two subfolders are created that correspond to block blob and page blob format data.

   :::image type="content" source="media/data-box-disk-deploy-copy-data/split-copy-12-sml.png" alt-text="Screenshot showing two subfolders created which correspond to block blob and page blob format data." lightbox="media/data-box-disk-deploy-copy-data/split-copy-12.png":::

1. If the copy session fails, use the following command to recover and resume:

   `DataBoxDiskSplitCopy.exe PrepImport /config:ConfigFile.json /ResumeSession`

If you encounter errors while using the Split Copy tool, follow the steps within the [troubleshoot Split Copy tool errors](data-box-disk-troubleshoot-data-copy.md) article.

>[!IMPORTANT]
> The Data Box Split Copy tool also validates your data. If you use Data Box Split Copy tool to copy data, you can skip the [validation step](#validate-data).
> The Split Copy tool is not supported with managed disks.

## Validate data

If you didn't use the Data Box Split Copy tool to copy data, you need to validate your data. Verify the data by performing the following steps on each of your Data Box Disks. If you encounter errors during validation, follow the steps within the [troubleshoot validation errors](data-box-disk-troubleshoot.md) article.

1. Run `DataBoxDiskValidation.cmd` for checksum validation in the *DataBoxDiskImport* folder of your drive. This tool is only available for the Windows environment. Linux users need to validate that the source data copied to the disk meets [Azure Data Box prerequisites](./data-box-disk-limits.md).

   :::image type="content" source="media/data-box-disk-deploy-copy-data/validation-tool-output-sml.png" alt-text="Screenshot showing Data Box Disk validation tool output." lightbox="media/data-box-disk-deploy-copy-data/validation-tool-output.png":::

1. Choose the appropriate validation option when prompted. **We recommend that you always validate the files and generate checksums by selecting option 2**. Exit the command window after the script completes. The time required for validation to complete depends upon the size of your data. The tool notifies you of any errors encountered during validation and checksum generation, and provides you with a link to the error logs.

   :::image type="content" source="media/data-box-disk-deploy-copy-data/checksum-output-sml.png" alt-text="Screenshot showing a failed execution attempt and indicating the location of the corresponding log file." lightbox="media/data-box-disk-deploy-copy-data/checksum-output.png":::

   > [!TIP]
   > - Reset the tool between two runs.
   > - The checksum process may take more time if you have a large data set containing many files that take up relatively little storage capacity. If you validate files and skip checksum creation, you should independently verify data integrity on the Data Box Disk prior to deleting any copies. This verification ideally includes generating checksums.

## Next steps

In this tutorial, you learned how to complete the following tasks with Azure Data Box Disk:

> [!div class="checklist"]
> * Copy data to Data Box Disk
> * Verify data integrity

Advance to the next tutorial to learn how to return the Data Box Disk and verify the data upload to Azure.

> [!div class="nextstepaction"]
> [Ship your Azure Data Box back to Microsoft](./data-box-disk-deploy-picked-up.md)

::: zone-end

::: zone target="chromeless"

### Copy data to disks

Take the following steps to connect and copy data from your computer to the Data Box Disk.

1. View the contents of the unlocked drive. The list of the precreated folders and subfolders in the drive is different depending upon the options selected when placing the Data Box Disk order.
2. Copy the data to folders that correspond to the appropriate data format. For instance, copy unstructured data to the *BlockBlob* folder, VHD or VHDX data to the *PageBlob* folder, and files to *AzureFile* folder. If the data format doesn't match the appropriate folder (storage type), the data upload to Azure fails at a later step.

    - Make sure that all the containers, blobs, and files conform to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions) and [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). If these rules or limits aren't followed, the data upload to Azure fails.     
    - If your order has Managed Disks as one of the storage destinations, see the naming conventions for [managed disks](data-box-disk-limits.md#managed-disk-naming-conventions).
    - A container is created in the Azure storage account for each subfolder within the *BlockBlob* and *PageBlob* folders. All files within the *BlockBlob* and *PageBlob* folders are copied to the default *$root* container within the Azure Storage account. Any files within the *$root* container are always uploaded as block blobs.
    - Create a subfolder within *AzureFile* folder. This subfolder maps to a fileshare in the cloud. Copy files to the subfolder. Files copied directly to *AzureFile* folder fail and are uploaded as block blobs.
    - If files and folders exist in the root directory, they must be moved to a different folder before data copy can begin.

3. Use drag and drop with File Explorer or any SMB compatible file copy tool such as Robocopy to copy your data. Multiple copy jobs can be initiated using the following command:

    ```
    Robocopy <source> <destination>  * /MT:64 /E /R:1 /W:1 /NFL /NDL /FFT /Log:c:\RobocopyLog.txt
    ```
4. Open the target folder to view and verify the copied files. If you have any errors during the copy process, download the log files for troubleshooting. The log files are located as specified in the robocopy command.

Use the optional procedure of [split and copy](data-box-disk-deploy-copy-data.md#split-and-copy-data-to-disks) when you're using multiple disks and have a large dataset that needs to be split and copied across all the disks.

### Validate data

Verify your data by following these steps:

1. Run the `DataBoxDiskValidation.cmd` for checksum validation in the *DataBoxDiskImport* folder of your drive.
2. Use option 2 to validate your files and generate checksums. Depending upon your data size, this step might take a while. If there are any errors during validation and checksum generation, you're notified and a link to the error logs is also provided.

    For more information on data validation, see [Validate data](#validate-data). If you experience errors during validation, see [troubleshoot validation errors](data-box-disk-troubleshoot.md).

::: zone-end
