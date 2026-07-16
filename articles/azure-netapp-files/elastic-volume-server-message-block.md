---
title: Create an SMB volume for Azure NetApp Files Elastic zone-redundant storage
description: Learn about the requirements and steps to create an SMB volume for Elastic zone-redundant storage in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 01/26/2026
ms.author: anfdocs
# Customer intent: As a cloud administrator, I want to create an SMB volume in Azure NetApp Files, so that I can leverage scalable storage solutions that meet my organization’s data management and sharing requirements.
---
# Create an SMB volume for Azure NetApp Files Elastic zone-redundant storage

Learn how to create an SMB volume for Elastic zone-redundant storage. 

>[!NOTE]
>This workflow is for Elastic zone-redundant storage. For Flexible, Standard, Premium, and Ultra volumes, see [Create an SMB volume](azure-netapp-files-create-volumes-smb.md).

## Before you begin 

* You must have a NetApp Elastic account. 
* You must have configured a capacity pool for Elastic zone-redundant storage. 
    * If you're creating SMB volumes, you must have configured Active Directory on the capacity pool. 
* After you create an SMB volume, you can resize it. You can also assign a snapshot policy, edit the hide snapshot path option, or enable/disable SMB3 encryption. 

>[!NOTE]
>If you're creating a volume with the REST API and no option is provided for the hide snapshot path, it's hidden by default. 

## Considerations 

* You can't change the protocol of a volume after creating it. 
* Each volume in a capacity pool must have a unique name.
* You must have configured a capacity pool for the Zone-Redundant service level. 
* If you encounter the error message "Error when creating. A problem occurred. Please try again after some time. If the issue persists, contact support.", the Active Directory password might have expired. Reset the password then try to create the volume again. 
* After creating the volume, you can check its status in the volume's overview page to see if it's online or offline. 

## Create an SMB volume 

1. In your NetApp account, select **Volumes**. 
1. Select **+ Add Volume**. 
1. In the Basics tab: 
    * Select the **Capacity pool** the volume belongs to. 
    * Enter the **Volume name**. 
    * Assign the **Quota** in GiB. 
        For sizing limits, see [Azure NetApp Files Elastic service level resource limits](azure-netapp-files-resource-limits.md).
    Select **Next**. 

    :::image type="content" source="./media/shared/elastic-create-volume.png" alt-text="Screenshot the volume creation Basic tab." lightbox="./media/shared/elastic-create-volume.png":::

1. Configure the **Protocol**. 

    * Choose **SMB**. 
        When you choose SMB, the **Active Directory configuration** is automatically set to the Active Directory connection configured for the capacity pool.
    * Enter a **Share name**. 
    * To encrypt SMB3 data in flight, select **SMB3 Protocol Encryption**.

        If you enable SMB3 encryption, SMB clients not using SMB3 encryption can't access this volume. Data at rest is encrypted regardless of this setting.

    :::image type="content" source="./media/elastic-volume-server-message-block/elastic-create-volume-protocol.png" alt-text="Screenshot of the volume creation protocol tab." lightbox="./media/elastic-volume-server-message-block/elastic-create-volume-protocol.png":::

1. Select **Review + create**. 
1. Review your selections. Select **Create** to finalize the volume.
1. Return to the **Volume** menu then select your volume to view it. 

## Resize a volume 

1. In your NetApp account, select **Volumes**. 
1. Select the volume you want to modify. 
1. In the overview for the volume, select **Resize**. 
1. Enter the new quota in GiB in the **Quota** field. The Available quota displays the available space in the capacity pool.

    :::image type="content" source="./media/shared/edit-volume.png" alt-text="Screenshot showing how to edit a snapshot policy." lightbox="./media/shared/edit-volume.png":::

1. Select **OK** to confirm the new quota. 

## Next steps 

* [Understand Elastic zone-redundant storage](elastic-zone-redundant-concept.md)
  
