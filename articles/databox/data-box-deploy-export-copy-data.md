---
title: Tutorial to copy data via SMB from your Azure Data Box | Microsoft Docs
description: Learn how to copy data to your Azure Data Box via SMB
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.date: 06/05/2020
ms.author: alkohli
ms.localizationpriority: high

# Customer intent: As an IT admin, I need to be able to copy data from Data Box to download to my on-premises server. 
---


# Tutorial: Copy data from Azure Data Box via SMB (Preview)

This tutorial describes how to connect to and copy data from your Data Box to an on-premises server using the local web UI.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Prerequisites
> * Connect to Data Box
> * Copy data from Data Box

[!INCLUDE [Data Box feature is in preview](../../includes/data-box-feature-is-preview-info.md)]

## Prerequisites

Before you begin, make sure that:

1. You've completed the [Tutorial: Set up Azure Data Box](data-box-deploy-set-up.md).
2. You've received your Data Box and the order status in the portal is **Delivered**.
3. You have a host computer that has the data that you want to copy over from your Data Box. Your host computer must
   * Run a [Supported operating system](data-box-system-requirements.md).
   * Be connected to a high-speed network. We strongly recommend that you have at least one 10-GbE connection. If a 10-GbE connection isn't available, use a 1-GbE data link but the copy speeds will be impacted.

## Connect to Data Box

[!INCLUDE [data-box-shares](../../includes/data-box-shares.md)]

If using a Windows Server host computer, follow these steps to connect to the Data Box.

1. The first step is to authenticate and start a session. Go to **Connect and copy**. Select **Get credentials** to get the access credentials for the shares associated with your storage account. 

    ![Get share credentials 1](media/data-box-deploy-copy-data/get-share-credentials1.png)

2. In the Access share and copy data dialog box, copy the **Username** and the **Password** corresponding to the share. Select **OK**.
    
    ![Get share credentials 1](media/data-box-deploy-copy-data/get-share-credentials2.png)

3. To access the shares associated with your storage account (*devicemanagertest1* in the following example) from your host computer, open a command window. At the command prompt, type:

    `net use \\<IP address of the device>\<share name>  /u:<user name for the share>`

    Depending upon your data format, the share paths are as follows:
    - Azure Block blob - `\\10.126.76.172\devicemanagertest1_BlockBlob`
    - Azure Page blob - `\\10.126.76.172\devicemanagertest1_PageBlob`
    - Azure Files - `\\10.126.76.172\devicemanagertest1_AzFile`

4. Enter the password for the share when prompted. The following sample shows connecting to a share via the preceding command.

    ```
    C:\Users\Databoxuser>net use \\10.126.76.172\devicemanagertest1_BlockBlob /u:devicemanagertest1
    Enter the password for 'devicemanagertest1' to connect to '10.126.76.172':
    The command completed successfully.
    ```

4. Press  Windows + R. In the **Run** window, specify the `\\<device IP address>`. Select **OK** to open File Explorer.
    
    ![Connect to share via File Explorer 2](media/data-box-deploy-copy-data/connect-shares-file-explorer1.png)

    You should now see the shares as folders.
    
    ![Connect to share via File Explorer 2](media/data-box-deploy-copy-data/connect-shares-file-explorer2.png)

    
If using a Linux client, use the following command to mount the SMB share. The "vers" parameter below is the version of SMB that your Linux host supports. Plug in the appropriate version in the command below. For versions of SMB that the Data Box supports see [Supported file systems for Linux clients](https://docs.microsoft.com/azure/databox/data-box-system-requirements#supported-file-systems-for-linux-clients) 

    `sudo mount -t nfs -o vers=2.1 10.126.76.172:/devicemanagertest1_BlockBlob /home/databoxubuntuhost/databox`


## Copy data from Data Box

Once you're connected to the Data Box shares, the next step is to copy data.

Before you begin the data copy:

1. Download the copy log and the verbose log. 
2. Review the verbose log. The verbose log contains a list of all the files that were successfully exported from Azure Storage account. The log also contains file size and checksum computation.

3. Review the copy log for any errors. This log indicates the files that could not be copied due to errors. You have the following options to export those files: 

    - You can transfer the files that could not be copied over the network. 
    - If your data size was larger than the usable device capacity, then a partial copy occurs and all the files that were not copied are listed in this log. You can use this log as an input XML to create a new Data Box order and then copy over these files.

 After you connected to the SMB share, begin data copy. You can use any SMB compatible file copy tool such as Robocopy to copy your data. Multiple copy jobs can be initiated using Robocopy. 

<!--Use the following command:
    
    robocopy <Source> <Target> * /e /r:3 /w:60 /is /nfl /ndl /np /MT:32 or 64 /fft /Log+:<LogFile> 
  
 The attributes are described in the following table.
    
|Attribute  |Description  |
|---------|---------|
|/e     |Copies subdirectories including empty directories.         |
|/r:     |Specifies the number of retries on failed copies.         |
|/w:     |Specifies the wait time between retries, in seconds.         |
|/is     |Includes the same files.         |
|/nfl     |Specifies that file names aren't logged.         |
|/ndl    |Specifies that directory names aren't logged.        |
|/np     |Specifies that the progress of the copying operation (the number of files or directories copied so far) will not be displayed. Displaying the progress significantly lowers the performance.         |
|/MT     | Use multithreading, recommended 32 or 64 threads. This option not used with encrypted files. You may need to separate encrypted and unencrypted files. However, single threaded copy significantly lowers the performance.           |
|/fft     | Use to reduce the time stamp granularity for any file system.        |
|/b     | Copies files in Backup mode.        |
|/z    | Copies files in Restart mode, use this if the environment is unstable. This option reduces throughput due to additional logging.      |
| /zb     | Uses Restart mode. If access is denied, this option uses Backup mode. This option reduces throughput due to checkpointing.         |
|/efsraw     | Copies all encrypted files in EFS raw mode. Use only with encrypted files.         |
|log+:\<LogFile>| Appends the output to the existing log file.|    
 
To optimize the performance, use the following robocopy parameters when copying the data.

|    Platform    |    Mostly small files < 512 KB                           |    Mostly medium  files 512 KB-1 MB                      |    Mostly large files > 1 MB                             |   
|----------------|--------------------------------------------------------|--------------------------------------------------------|--------------------------------------------------------|
|    Data Box         |    2 Robocopy sessions <br> 16 threads per sessions    |    3 Robocopy sessions <br> 16 threads per sessions    |    2 Robocopy sessions <br> 24 threads per sessions    |-->

For more information on Robocopy command, go to [Robocopy and a few examples](https://social.technet.microsoft.com/wiki/contents/articles/1073.robocopy-and-a-few-examples.aspx).




To ensure data integrity, checksum is computed inline as the data is copied. Once the copy is complete, verify the used space and the free space on your device.

   ![Verify free and used space on dashboard](media/data-box-deploy-copy-data/verify-used-space-dashboard.png)


## Next steps

In this tutorial, you learned about Azure Data Box topics such as:

> [!div class="checklist"]
>
> * Prerequisites
> * Connect to Data Box
> * Copy data from Data Box

Advance to the next tutorial to learn how to ship your Data Box back to Microsoft.

> [!div class="nextstepaction"]
> [Ship your Azure Data Box to Microsoft](./data-box-deploy-export-picked-up.md)

::: zone-end
