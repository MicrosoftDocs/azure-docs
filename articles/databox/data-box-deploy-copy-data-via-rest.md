---
title: Copy data to Azure Data Box Blob storage via REST APIs| Microsoft Docs
description: Learn how to copy data to your Azure Data Box Blob storage via REST APIs
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.date: 01/24/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to be able to copy data to Data Box to upload on-premises data from my server onto Azure.
---
# Tutorial: Copy data to Azure Data Box Blob storage via REST APIs  

This tutorial describes procedures to connect to Azure Data Box Blob storage via REST APIs over *http* or *https*. Once connected, the steps required to copy the data to Data Box Blob storage and prepare the Data Box to ship, are also described.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prerequisites
> * Connect to Data Box Blob storage via *http* or *https*
> * Copy data to Data Box

## Prerequisites

Before you begin, make sure that:

1. You've completed the [Tutorial: Set up Azure Data Box](data-box-deploy-set-up.md).
2. You've received your Data Box and the order status in the portal is **Delivered**.
3. You've reviewed the [system requirements for Data Box Blob storage](data-box-system-requirements-rest.md) and are familiar with supported versions of APIs, SDKs, and tools.
4. You've access to a host computer that has the data that you want to copy over to Data Box. Your host computer must
    - Run a [Supported operating system](data-box-system-requirements.md).
    - Be connected to a high-speed network. We strongly recommend that you have at least one 10-GbE connection. If a 10-GbE connection isn't available, a 1-GbE data link can be used but the copy speeds will be impacted.
5. [Download AzCopy 7.1.0](https://aka.ms/azcopyforazurestack20170417) on your host computer. You'll use AzCopy to copy data to Azure Data Box Blob storage from your host computer.


## Connect to Data Box Blob storage

You can connect to Data Box Blob storage over *http* or *https*. In general, *https* is the secure and recommended way to connect to Data Box Blob storage. *Http* is used  when connecting over trusted networks. Depending on whether you are connecting to Data Box Blob storage over *http* or *https*, the steps can be different.

## Connect via http

Connection to Data Box Blob storage REST APIs over *http* requires the following steps:

- Add the device IP and blob service endpoint to the remote host
- Configure third-party software and verify the connection

Each of these steps is described in the following sections.

#### Add device IP address and blob service endpoint to the remote host

[!INCLUDE [data-box-add-device-ip](../../includes/data-box-add-device-ip.md)]

#### Configure partner software and verify connection

[!INCLUDE [data-box-configure-partner-software](../../includes/data-box-configure-partner-software.md)]

[!INCLUDE [data-box-verify-connection](../../includes/data-box-verify-connection.md)]

## Connect via https

Connection to Azure Blob storage REST APIs over https requires the following steps:

- Download the certificate from Azure portal
- Prepare the host computer for remote management
- Add the device IP and blob service endpoint to the remote host
- Configure third-party software and verify the connection

Each of these steps is described in the following sections.

### Download certificate

Use the Azure portal to download certificate.

1. Sign into the Azure portal.
2. Go to your Data Box order and navigate to **General > Device details**.
3. Under **Device credentials**, go to **API access** to device. Click **Download**. This action downloads a **\<your order name>.cer** certificate file. **Save** this file. You will install this certificate on the client or host computer that you will use to connect to the device.

    ![Download certificate in Azure portal](media/data-box-deploy-copy-data-via-rest/download-cert-1.png)
 
### Prepare the host for remote management

Follow these steps to prepare the Windows client for a remote connection that uses an *https* session:

- Import the .cer file into the root store of the client or remote host.
- Add the device IP address and blob service endpoint to the hosts file on your Windows client.

Each of the preceding procedures, is described below.

#### Import the certificate on the remote host

You can use Windows PowerShell or the Windows Server UI to import and install the certificate on your host system.

**Using PowerShell**

1. Start a Windows PowerShell session as an administrator.
2. At the command prompt, type:

    ```
    Import-Certificate -FilePath C:\temp\localuihttps.cer -CertStoreLocation Cert:\LocalMachine\Root
    ```

**Using Windows Server UI**

1.	Right-click the .cer file and select **Install certificate**. This starts the Certificate Import Wizard.
2.	For **Store location**, select **Local Machine**, and then click **Next**.

    ![Import certificate using PowerShell](media/data-box-deploy-copy-data-via-rest/import-cert-ws-1.png)

3.	Select **Place all certificates in the following store**, and then click **Browse**. Navigate to the root store of your remote host, and then click **Next**.

    ![Import certificate using PowerShell](media/data-box-deploy-copy-data-via-rest/import-cert-ws-2.png)

4.	Click **Finish**. A message that tells you that the import was successful appears.

    ![Import certificate using PowerShell](media/data-box-deploy-copy-data-via-rest/import-cert-ws-3.png)

### To add device IP address and blob service endpoint to the remote host

The steps to follow are identical to what you used while connecting over *http*.

### Configure partner software to establish connection

The steps to follow are identical to what you used while connecting over *http*. The only difference is that you should leave the *Use http option* unchecked.

## Copy data to Data Box

Once you are connected to the Data Box Blob storage, the next step is to copy data. Prior to data copy, review the following considerations:

-  While copying data, ensure that the data size conforms to the size limits described in the [Azure storage and Data Box limits](data-box-limits.md).
- If data, which is being uploaded by Data Box, is concurrently uploaded by other applications outside of Data Box, this may result in upload job failures and data corruption.

In this tutorial, AzCopy is used to copy data to Data Box Blob storage. You can also use Azure Storage Explorer (if you prefer a GUI-based tool) or a partner software to copy the data.
The copy procedure has the following steps:

- Create a container
- Upload contents of a folder to Data Box Blob storage
- Upload modified files to Data Box Blob storage

Each of these steps is described in detail in the following sections.

### Create a container

The first step is to create a container, because blobs are always uploaded into a container. Containers organize groups of blobs like you organize files in folders on your computer. Follow these steps to create a blob container.

1. Open Storage Explorer.
2. In the left pane, expand the storage account within which you wish to create the blob container.
3. Right-click **Blob Containers**, and from the context menu, select **Create Blob Container**.

   ![Create blob containers context menu](media/data-box-deploy-copy-data-via-rest/create-blob-container-1.png)

4. A text box appears below the **Blob Containers** folder. Enter the name for your blob container. See the [Create the container and set permissions](../storage/blobs/storage-quickstart-blobs-dotnet.md) for information on rules and restrictions on naming blob containers.
5. Press **Enter** when done to create the blob container, or **Esc** to cancel. Once the blob container is successfully created, it is displayed under the **Blob Containers** folder for the selected storage account.

   ![Blob container created](media/data-box-deploy-copy-data-via-rest/create-blob-container-2.png)

### Upload contents of a folder to Data Box Blob storage

Use AzCopy to upload all files in a folder to Blob storage on Windows or Linux. To upload all blobs in a folder, enter the following AzCopy command:

#### Linux

    azcopy \
        --source /mnt/myfolder \
        --destination https://data-box-storage-account-name.blob.device-serial-no.microsoftdatabox.com/container-name/files/ \
        --dest-key <key> \
        --recursive

#### Windows

    AzCopy /Source:C:\myfolder /Dest:https://data-box-storage-account-name.blob.device-serial-no.microsoftdatabox.com/container-name/files/ /DestKey:<key> /S


Replace `<key>` with your account key. To get your account key, in the Azure portal, go to your storage account. Go to **Settings > Access keys**, select a key, and paste it into the AzCopy command.

If the specified destination container does not exist, AzCopy creates it and uploads the file into it. Update the source path to your data directory, and replace `data-box-storage-account-name` in the destination URL with the name of the storage account associated with your Data Box.

To upload the contents of the specified directory to Blob storage recursively, specify the `--recursive` (Linux) or `/S` (Windows) option. When you run AzCopy with one of these options, all subfolders and their files are uploaded as well.

### Upload modified files to Data Box Blob storage

Use AzCopy to upload files based on their last-modified time. To try this, modify or create new files in your source directory for test purposes. To upload only updated or new files, add the `--exclude-older` (Linux) or `/XO` (Windows) parameter to the AzCopy command.

If you only want to copy source resources that do not exist in the destination, specify both `--exclude-older` and `--exclude-newer` (Linux) or `/XO` and `/XN` (Windows) parameters in the AzCopy command. AzCopy uploads only the updated data, based on its time stamp.

#### Linux
    azcopy \
    --source /mnt/myfolder \
    --destination https://data-box-storage-account-name.blob.device-serial-no.microsoftdatabox.com/container-name/files/ \
    --dest-key <key> \
    --recursive \
    --exclude-older

#### Windows

    AzCopy /Source:C:\myfolder /Dest:https://data-box-storage-account-name.blob.device-serial-no.microsoftdatabox.com/container-name/files/ /DestKey:<key> /S /XO


Next step is to prepare your device to ship.

## Next steps

In this tutorial, you learned about Azure Data Box topics such as:

> [!div class="checklist"]
> * Prerequisites
> * Connect to Data Box Blob storage via *http* or *https*
> * Copy data to Data Box


Advance to the next tutorial to learn how to ship your Data Box back to Microsoft.

> [!div class="nextstepaction"]
> [Ship your Azure Data Box to Microsoft](./data-box-deploy-picked-up.md)
