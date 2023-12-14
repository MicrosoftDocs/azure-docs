---
title: Tutorial to copy data to Azure Data Box Disk| Microsoft Docs
description: In this tutorial, learn how to copy data from your host computer to Azure Data Box Disk and then generate checksums to verify data integrity.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: disk
ms.topic: tutorial
ms.date: 11/18/2022
ms.author: shaas
---

<!--
# Customer intent: As an IT admin, I need to be able to order Data Box Disk to upload on-premises data from my server onto Azure.

# Doc scores:
#    11/18/22: 75 (2456/62)
#    09/01/23: 100 (2159/0)

::: zone target="docs"
-->

# Tutorial: Copy data to Azure Data Box Disk and verify

<!--
::: zone-end

::: zone target="chromeless"

## Copy data to Azure Data Box Disk and validate

After the disks are connected and unlocked, you can copy data from your source data server to your disks. After the data copy is complete, you should validate the data to ensure that it will successfully upload to Azure.

::: zone-end

::: zone target="docs"
-->

This tutorial describes how to copy data from your host computer and generate checksums to verify data integrity.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Copy data to Data Box Disk
> * Verify data

## Prerequisites

Before you begin, make sure that:

- You have completed the [Tutorial: Install and configure your Azure Data Box Disk](data-box-disk-deploy-set-up.md).
- Your disks are unlocked and connected to a client computer.
- The client computer used to copy data to the disks is running a [Supported operating system](data-box-disk-system-requirements.md#supported-operating-systems-for-clients).
- The intended storage type for your data matches [Supported storage types](data-box-disk-system-requirements.md#supported-storage-types-for-upload).
- You've reviewed [Managed disk limits in Azure object size limits](data-box-disk-limits.md#azure-object-size-limits).

## Copy data to disks

Review the following considerations before you copy the data to the disks:

- It is your responsibility to ensure that you copy your local data to the folders that correspond to the appropriate data format. For instance, copy block blob data to the *BlockBlob* folder. Block blobs being archived should be copied to the *BlockBlob_Archive* folder. If the local data format doesn't match the appropriate folder for the chosen storage type, the data upload to Azure fails in a later step.
- While copying data, ensure that the data size conforms to the size limits described within in the [Azure storage and Data Box Disk limits](data-box-disk-limits.md) article.
- To preserve metadata such as ACLs, timestamps, and file attributes when transferring data to Azure Files, follow the guidance within the [Preserving file ACLs, attributes, and timestamps with Azure Data Box Disk](data-box-disk-file-acls-preservation.md) article.
- If you use both Data Box Disk and other applications to upload data simultaneously, you may experience upload job failures and data corruption.

   > [!IMPORTANT]
   > Data uploaded to the archive tier remains offline and needs to be rehydrated before reading or modifying. Data copied to the archive tier must remain for at least 180 days or be subject to an early deletion charge. Archive tier is not supported for ZRS, GZRS, or RA-GZRS accounts.

   > [!IMPORTANT]
   >  If you specified managed disks as one of the storage destinations during order creation, the following section is applicable.

- Ensure that virtual hard disks (VHDs) uploaded to the precreated folders have unique names within resource groups. Managed disks must have unique names within a resource group across all the precreated folders on the Data Box Disk. If you're using multiple Data Box Disks, managed disk names must be unique across all folder and disks. When VHDs with duplicate names are found, only one is converted to a managed disk with that name. The remaining VHDs are uploaded as page blobs into the staging storage account.
- Always copy the VHDs to one of the precreated folders. VHDs placed outside of these folders or in a folder that you created are uploaded to Azure Storage accounts as page blobs instead of managed disks.
- Only fixed VHDs can be uploaded to create managed disks. Dynamic VHDs, differencing VHDs and VHDX files aren't supported.
- The Data Box Disk Split Copy and Validation tools, `DataBoxDiskSplitCopy.exe` and `DataBoxDiskValidation.cmd`, report failures when long paths are processed. These failures are common when long paths aren't enabled on the client, and your data copy's paths and file names exceed 256 characters. To avoid these failures, follow the guidance within the [enable long paths on your Windows client](/windows/win32/fileio/maximum-file-path-limitation?tabs=cmd#enable-long-paths-in-windows-10-version-1607-and-later) article.

Perform the following steps to connect and copy data from your computer to the Data Box Disk.

1. View the contents of the unlocked drive. The list of the precreated folders and subfolders in the drive varies according to the options you select when placing the Data Box Disk order. The creation of extra folders isn't permitted, as copying data to a user-created folder causes upload failures.

    |Selected storage destination  |Storage account type|Staging storage account type |Folders and subfolders  |
    |------------------------------|--------------------|-----------------------------|------------------------|
    |Storage account               |GPv1 or GPv2        | NA                          | BlockBlob<br>BlockBlob_Archive<br>PageBlob<br>AzureFile |
    |Storage account               |Blob storage account| NA                          | BlockBlob<br>BlockBlob_Archive |
    |Managed disks                 |NA                  | GPv1 or GPv2                | ManagedDisk<ul><li>PremiumSSD</li><li>StandardSSD</li><li>StandardHDD</li></ul> |
    |Storage account<br>Managed disks |GPv1 or GPv2     | GPv1 or GPv2                | BlockBlob<br/>BlockBlob_Archive<br/>PageBlob<br/>AzureFile<br/>ManagedDisk<ul><li>PremiumSSD</li><li>StandardSSD</li><li>StandardHDD</li></ul>|
    |Storage account <br> Managed disks |Blob storage account | GPv1 or GPv2          |BlockBlob<br>BlockBlob_Archive<br>ManagedDisk<ul> <li>PremiumSSD</li><li>StandardSSD</li><li>StandardHDD</li></ul> |

    The following screenshot shows an order where a GPv2 storage account and archive tier were specified:

    :::image type="content" source="media/data-box-disk-deploy-copy-data/content-sml.png" alt-text="Screenshot of the contents of the disk drive." lightbox="media/data-box-disk-deploy-copy-data/content.png":::

1. Copy data to be imported as block blobs into the *BlockBlob* folder. Copy data to be stored as block blobs with the archive tier into the *BlockBlob_Archive* folder. Similarly, copy VHD or VHDX data to the *PageBlob* folder, and file share data into *AzureFile* folder.

   A container is created in the Azure storage account for each subfolder within the *BlockBlob* and *PageBlob* folders. All files copied to the *BlockBlob* and *PageBlob* folders are copied into a default `$root` container within the Azure Storage account. Any files in the `$root` container are always uploaded as block blobs.

   Copy data to be placed in Azure file shares to a subfolder within the *AzureFile* folder. All files copied to the *AzureFile* folder are copied as files to a default container of type `databox-format-[GUID]`, for example, `databox-azurefile-7ee19cfb3304122d940461783e97bf7b4290a1d7`.

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

   - Provide a job name. A folder with this name is created on the Data Box Disk. It's also used to create a container in the Azure storage account associated with these disks. The job name must follow the [Azure container naming conventions](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).
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

If you didn't use the Data Box Split Copy tool to copy data, you need to validate your data. Perform the following steps on each of your Data Box Disks to verify the data. If you encounter errors during validation, follow the steps within the [troubleshoot validation errors](data-box-disk-troubleshoot.md) article.

1. Run `DataBoxDiskValidation.cmd` for checksum validation in the *DataBoxDiskImport* folder of your drive. This tool is only available for the Windows environment. Linux users need to validate that the source data copied to the disk meets [Azure Data Box prerequisites](./data-box-disk-limits.md).

   :::image type="content" source="media/data-box-disk-deploy-copy-data/validation-tool-output-sml.png" alt-text="Screenshot showing Data Box Disk validation tool output." lightbox="media/data-box-disk-deploy-copy-data/validation-tool-output.png":::

1. Choose the appropriate validation option when prompted. **We recommend that you always validate the files and generate checksums by selecting option 2**. After the script has completed, exit out of the command window. The time required for validation to complete depends upon the size of your data. The tool notifies you of any errors encountered during validation and checksum generation, and provides you with a link to the error logs.

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

<!--
::: zone-end
-->
<!--
::: zone target="chromeless"

### Copy data to disks

Take the following steps to connect and copy data from your computer to the Data Box Disk.

1. View the contents of the unlocked drive. The list of the precreated folders and subfolders in the drive is different depending upon the options selected when placing the Data Box Disk order.
2. Copy the data to folders that correspond to the appropriate data format. For instance, copy the unstructured data to the folder for *BlockBlob* folder, VHD or VHDX data to *PageBlob* folder and files to *AzureFile*. If the data format does not match the  appropriate folder (storage type), then at a later step, the data upload to Azure fails.

    - Make sure that all the containers, blobs, and files conform to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions) and [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). If these rules or limits are not followed, the data upload to Azure will fail.     
    - If your order has Managed Disks as one of the storage destinations, see the naming conventions for [managed disks](data-box-disk-limits.md#managed-disk-naming-conventions).
    - A container is created in the Azure storage account for each subfolder under BlockBlob and PageBlob folders. All files under *BlockBlob* and *PageBlob* folders are copied into a default container $root under the Azure Storage account. Any files in the $root container are always uploaded as block blobs.
    - Create a sub-folder within *AzureFile* folder. This sub-folder maps to a fileshare in the cloud. Copy files to the sub-folder. Files copied directly to *AzureFile* folder fail and are uploaded as block blobs.
    - If files and folders exist in the root directory, then you must move those to a different folder before you begin data copy.

3. Use drag and drop with File Explorer or any SMB compatible file copy tool such as Robocopy to copy your data. Multiple copy jobs can be initiated using the following command:

    ```
    Robocopy <source> <destination>  * /MT:64 /E /R:1 /W:1 /NFL /NDL /FFT /Log:c:\RobocopyLog.txt
    ```
4. Open the target folder to view and verify the copied files. If you have any errors during the copy process, download the log files for troubleshooting. The log files are located as specified in the robocopy command.

Use the optional procedure of [split and copy](data-box-disk-deploy-copy-data.md#split-and-copy-data-to-disks) when you are using multiple disks and have a large dataset that needs to be split and copied across all the disks.

### Validate data

Take the following steps to verify your data.

1. Run the `DataBoxDiskValidation.cmd` for checksum validation in the *DataBoxDiskImport* folder of your drive.
2. Use option 2 to validate your files and generate checksums. Depending upon your data size, this step may take a while. If there are any errors during validation and checksum generation, you are notified and a link to the error logs is also provided.

    For more information on data validation, see [Validate data](#validate-data). If you experience errors during validation, see [troubleshoot validation errors](data-box-disk-troubleshoot.md).

::: zone-end
-->