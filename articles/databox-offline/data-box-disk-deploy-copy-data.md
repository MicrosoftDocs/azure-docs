---
title: Copy data to  your Microsoft Azure Data Box Disk| Microsoft Docs
description: Use this tutorial to learn how to copy data to your Azure Data Box Disk
services: databox
documentationcenter: NA
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox
ms.devlang: NA
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/05/2018
ms.author: alkohli
Customer intent: As an IT admin, I need to be able to order Data Box Disk to upload on-premises data from my server onto Azure.
---
# Tutorial: Copy data to Azure Data Box Disk and verify

This tutorial describes how to copy data from your host computer and then generate checksums to verify data integrity.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Copy data to Data Box Disk
> * Verify data integrity

## Prerequisites

Before you begin, make sure that:
- You have completed the [Tutorial: Install and configure your Azure Data Box Disk](data-box-disk-deploy-set-up.md).
- Your disks are unpacked and turned on.
- You have a host computer to copy data to the disks. Your host computer must
    - Run a [Supported operating system](data-box-disk-system-requirements.md).
    - Have [Windows PowerShell 4 installed](https://www.microsoft.com/download/details.aspx?id=40855).
    - Have [.NET Framework 4.5 installed](https://www.microsoft.com/download/details.aspx?id=30653).


## Copy data to disks

Perform the following steps to connect and copy data from your computer to the Data Box Disk.

1. View the contents of the unlocked drive. 

    ![View drive content](media/data-box-disk-deploy-copy-data/data-box-disk-content.png)
 
2. Copy the data that needs to be imported as block blobs in to BlockBlob folder. Similarly, copy data such as VHD/VHDX to PageBlob folder. 

    A container is created in the Azure storage account for each subfolder under BlockBlob and PageBlob folders. All files under BlockBlob and PageBlob folders are copied into a default container `$root` under the Azure Storage account. Any files in the `$root` container are always uploaded as block blobs.

    If files and folders exist in the root directory, then you must move those to a different folder before you begin data copy.

    Follow the Azure naming requirements for container and blob names.

    |Entity   |Conventions  |
    |---------|---------|
    |Container names block blob and page blob     |Must start with a letter or number, and can contain only lowercase letters, numbers, and the hyphen (-). Every hyphen (-) must be immediately preceded and followed by a letter or number. Consecutive hyphens are not permitted in names. <br>Must be a valid DNS name, which is 3 to 63 characters long.          |
    |Blob names for block blob and page blob    |Blob names are case-sensitive and can contain any combination of characters. <br>A blob name must be between 1 to 1,024 characters long.<br>Reserved URL characters must be properly escaped.<br>The number of path segments comprising the blob name cannot exceed 254. A path segment is the string between consecutive delimiter characters (for example, the forward slash '/') that correspond to the name of a virtual directory.         |

    > [!IMPORTANT] 
    > All the containers and blobs should conform to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-and-page-blob-naming-conventions). If these rules are not followed, the data upload to Azure will fail.

3. When copying files, ensure that files do not exceed ~4.7 TiB for block blobs and ~8 TiB for page blobs. 
4. You can use drag and drop with File Explorer to copy the data. You can also use any SMB compatible file copy tool such as Robocopy to copy your data. Multiple copy jobs can be initiated using the following Robocopy command:

    `Robocopy <source> <destination>  * /MT:64 /E /R:1 /W:1 /NFL /NDL /FFT /Log:c:\RobocopyLog.txt` 
    
    The parameters and options for the command are tabulated as follows:
    
    |Parameters/Options  |Description |
    |--------------------|------------|
    |Source            | Specifies the path to the source directory.        |
    |Destination       | Specifies the path to the destination directory.        |
    |/E                  | Copies subdirectories including empty directories. |
    |/MT[:N]             | Creates multi-threaded copies with N threads where N is an integer between 1 and 128. <br>The default value for N is 8.        |
    |/R: <N>             | Specifies the number of retries on failed copies. The default value of N is 1,000,000 (one million retries).        |
    |/W: <N>             | Specifies the wait time between retries, in seconds. The default value of N is 30 (wait time 30 seconds).        |
    |/NFL                | Specifies that file names are not to be logged.        |
    |/NDL                | Specifies that directory names are not to be logged.        |
    |/FFT                | Assumes FAT file times (two-second precision).        |
    |/Log:<Log File>     | Writes the status output to the log file (overwrites the existing log file).         |

    Multiple disks can be used in parallel with multiple jobs running on each disk. 

6. Check the copy status when the job is in progress. The following sample shows the output of the robocopy command to copy files to the Data Box Disk.

    ```
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
    
    C:\Users>Robocopy C:\Git\azure-docs-pr\contributor-guide \\10.126.76.172\devicemanagertest1_AzFile\templates /MT:64 /E /R:1 /W:1 /FFT 
    -------------------------------------------------------------------------------
       ROBOCOPY     ::     Robust File Copy for Windows
    -------------------------------------------------------------------------------
    
      Started : Thursday, March 8, 2018 2:34:58 PM
       Source : C:\Git\azure-docs-pr\contributor-guide\
         Dest : \\10.126.76.172\devicemanagertest1_AzFile\templates\
    
        Files : *.*
    
      Options : *.* /DCOPY:DA /COPY:DAT /MT:8 /R:1000000 /W:30
    
    ------------------------------------------------------------------------------
    
    100%        New File                 206        C:\Git\azure-docs-pr\contributor-guide\article-metadata.md
    100%        New File                 209        C:\Git\azure-docs-pr\contributor-guide\content-channel-guidance.md
    100%        New File                 732        C:\Git\azure-docs-pr\contributor-guide\contributor-guide-index.md
    100%        New File                 199        C:\Git\azure-docs-pr\contributor-guide\contributor-guide-pr-criteria.md
                New File                 178        C:\Git\azure-docs-pr\contributor-guide\contributor-guide-pull-request-co100%  .md
                New File                 250        C:\Git\azure-docs-pr\contributor-guide\contributor-guide-pull-request-et100%  e.md
    100%        New File                 174        C:\Git\azure-docs-pr\contributor-guide\create-images-markdown.md
    100%        New File                 197        C:\Git\azure-docs-pr\contributor-guide\create-links-markdown.md
    100%        New File                 184        C:\Git\azure-docs-pr\contributor-guide\create-tables-markdown.md
    100%        New File                 208        C:\Git\azure-docs-pr\contributor-guide\custom-markdown-extensions.md
    100%        New File                 210        C:\Git\azure-docs-pr\contributor-guide\file-names-and-locations.md
    100%        New File                 234        C:\Git\azure-docs-pr\contributor-guide\git-commands-for-master.md
    100%        New File                 186        C:\Git\azure-docs-pr\contributor-guide\release-branches.md
    100%        New File                 240        C:\Git\azure-docs-pr\contributor-guide\retire-or-rename-an-article.md
    100%        New File                 215        C:\Git\azure-docs-pr\contributor-guide\style-and-voice.md
    100%        New File                 212        C:\Git\azure-docs-pr\contributor-guide\syntax-highlighting-markdown.md
    100%        New File                 207        C:\Git\azure-docs-pr\contributor-guide\tools-and-setup.md
    ------------------------------------------------------------------------------
    
                   Total    Copied   Skipped  Mismatch    FAILED    Extras
        Dirs :         1         1         1         0         0         0
       Files :        17        17         0         0         0         0
       Bytes :     3.9 k     3.9 k         0         0         0         0
       Times :   0:00:05   0:00:00                       0:00:00   0:00:00
        
       Speed :                5620 Bytes/sec.
       Speed :               0.321 MegaBytes/min.
       Ended : Thursday, March 8, 2018 2:34:59 PM
        
    C:\Users>
    ```
 
    
7. Open the target folder to view and verify the copied files. If you have any errors during the copy process, download the log files for troubleshooting. The log files are located as specified in the robobopy command.
 


> [!IMPORTANT]
> - It is your responsibility to ensure that you copy the data to folders that correspond to the appropriate data format. For instance, copy the block blob data to the folder for block blobs. If the data format does not match the appropriate folder (storage type), then at a later step, the data upload to Azure fails.
> -  While copying data, ensure that the data size conforms to the size limits described in the [Azure storage and Data Box Disk limits](data-box-disk-limits.md). 
> - If data, which is being uploaded by Data Box Disk, is concurrently uploaded by other applications outside of Data Box Disk, then this could result in upload job failures and data corruption.

## Verify data integrity

To verify the data integrity, perform the following steps.

1. Run the `AzureExpressDiskService.ps1` for checksum validation. In File Explorer, go to the *AzureImportExport* folder of the drive. Right-click and select **Run with PowerShell**. 

    ![Run checksum](media/data-box-disk-deploy-copy-data/data-box-disk-checksum.png)

2. Depending upon your data size, this step may take a while. A summary of the data integrity check process along with time to complete the process is displayed when the script has completed. You can press **Enter** to exit out of the command window.

    ![Checksum output](media/data-box-disk-deploy-copy-data/data-box-disk-checksum-output.png)

3. If using multiple disks, run the command for each disk.

## Next steps

In this tutorial, you learned about Azure Data Box Disk topics such as:

> [!div class="checklist"]
> * Copy data to Data Box Disk
> * Verify data integrity

Advance to the next tutorial to learn how to return the Data Box Disk and verify the data upload to Azure.

> [!div class="nextstepaction"]
> [Ship your Azure Data Box back to Microsoft](./data-box-disk-deploy-picked-up.md)

