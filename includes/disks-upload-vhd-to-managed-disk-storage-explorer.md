---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/25/2019
 ms.author: rogarana
 ms.custom: include file
---



Storage Explorer 1.10.0 enables users to upload, download, and copy managed disks, as well as create snapshots. Because of these additional capabilities, you can use Storage Explorer to migrate data from on-premises to Azure, and migrate data across Azure regions.

## Prerequisites

To complete this article, you'll need the following:
- An Azure subscription
- One or more Azure managed disks
- The latest version of [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)

## Connect to an Azure subscription

If your Storage Explorer isn't connected to Azure, you will not be able to use it to manage resources. This section goes over connecting it to your Azure account so that you can manage resources using Storage Explorer.

1. Launch Azure Storage Explorer and click the **plug-in** icon on the left.

    ![Click the plug-in icon](media/disks-upload-vhd-to-managed-disk-storage-explorer/plug-in-icon.png)

1. Select **Add an Azure Account**, and then click **Next**.

    ![Add an Azure Account](media/disks-upload-vhd-to-managed-disk-storage-explorer/connect-to-azure.png)

1. In the **Azure Sign in** dialog box, enter your Azure credentials.

    ![Azure sign in dialog](media/disks-upload-vhd-to-managed-disk-storage-explorer/sign-in.png)

1. Select your subscription from the list and then click **Apply**.

    ![Select your subscription](media/disks-upload-vhd-to-managed-disk-storage-explorer/select-subscription.png)

## Upload a managed disk from an on-prem VHD

1. On the left pane, expand **Disks** and select the resource group that you want to upload your disk to.

    ![Select resource group 1](media/disks-upload-vhd-to-managed-disk-storage-explorer/select-rg1.png)

1. Select **Upload**.

    ![Select upload](media/disks-upload-vhd-to-managed-disk-storage-explorer/upload-button.png)

1. In **Upload VHD** specify your source VHD, the name of the disk, the OS type, the region you want to upload the disk to, as well as the account type. In some regions Availability zones are supported, for those regions you can select a zone of your choice.
1. Select **Create** to begin uploading your disk.

    ![Upload vhd dialog](media/disks-upload-vhd-to-managed-disk-storage-explorer/upload-vhd-dialog.png)

1. The status of the upload will now display in **Activities**.

    ![Upload status](media/disks-upload-vhd-to-managed-disk-storage-explorer/activity-uploading.png)

1. If the upload has finished and you don't see the disk in the right pane, select **Refresh**.

## Download a managed disk

The following steps explain how to download a managed disk to an on-prem VHD. A disk's state must be **Unattached** in order to be downloaded, you cannot download an **Attached** disk.

1. On the left pane, if it isn't already expanded, expand **Disks** and select the resource group that you want to download your disk from.

    ![Select resource group 1](media/disks-upload-vhd-to-managed-disk-storage-explorer/select-rg1.png)

1. On the right pane, select the disk you want to download.
1. Select **Download** and then choose where you would like to save the disk.

    ![Download a managed disk](media/disks-upload-vhd-to-managed-disk-storage-explorer/download-button.png)

1. Select **Save** and your disk will begin downloading. The status of the download will display in **Activities**.

    ![Download status](media/disks-upload-vhd-to-managed-disk-storage-explorer/activity-downloading.png)

## Copy a managed disk

With Storage Explorer, you can copy a manged disk within or across regions. To copy a disk:

1. From the **Disks** dropdown on the left, select the resource group that contains the disk you want to copy.

    ![Select resource group 1](media/disks-upload-vhd-to-managed-disk-storage-explorer/select-rg1.png)

1. On the right pane, select the disk you'd like to copy and select **Copy**.

    ![Copy a managed disk](media/disks-upload-vhd-to-managed-disk-storage-explorer/copy-button.png)

1. On the left pane, select the resource group you'd like to paste the disk in.

    ![Select resource group 2](media/disks-upload-vhd-to-managed-disk-storage-explorer/select-rg2.png)

1. Select **Paste** on the right pane.

    ![Paste a managed disk](media/disks-upload-vhd-to-managed-disk-storage-explorer/paste-button.png)

1. In the **Paste Disk** dialog, fill in the values. You can also specify an Availability zone in supported regions.

    ![Paste disk dialog](media/disks-upload-vhd-to-managed-disk-storage-explorer/paste-disk-dialog.png)

1. Select **Paste** and your disk will begin copying, the status is displayed in **Activities**.

    ![Copy paste status](media/disks-upload-vhd-to-managed-disk-storage-explorer/activity-copying.png)

## Create a snapshot

1. From the **Disks** dropdown on the left, select the resource group that contains the disk you want to snapshot.

    ![Select resource group 1](media/disks-upload-vhd-to-managed-disk-storage-explorer/select-rg1.png)

1. On the right, select the disk you'd like to snapshot and select **Create Snapshot**.

    ![Create a snapshot](media/disks-upload-vhd-to-managed-disk-storage-explorer/create-snapshot-button.png)

1. In **Create Snapshot**, specify the name of the snapshot as well as the resource group you want to create it in. Then select **Create**.

    ![Create snapshot dialog](media/disks-upload-vhd-to-managed-disk-storage-explorer/create-snapshot-dialog.png)

1. Once the snapshot has been created, you can select **Open in Portal** in **Activities** to view the snapshot in the Azure portal.

    ![Open snapshot in portal](media/disks-upload-vhd-to-managed-disk-storage-explorer/open-in-portal.png)

## Next steps
