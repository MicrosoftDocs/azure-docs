---
author: b-mchabbria
ms.service: azure-netapp-files
ms.topic: include
ms.date: 02/11/2026
ms.author: anfdocs
ms.custom:
  - include file
  

# azure-netapp-files-create-volumes.md
# azure-netapp-files-create-volumes-smb.md
# create-volumes-dual-protocol.md

# Customer intent: "As a IT administrator, I want to configure the backup protection settings to protect my volume."
---

Data protection settings can now be included as part of the "create volume" workflow (preview). To configure backup protection settings, you should [register the feature](../protect-volumes.md#register-the-feature) and then select **Data Protection**.

>[!NOTE]
>By default, the **Enable scheduled backup** option is enabled. If you do not want to enable scheduled backup on the volume, you can disable the **Enable scheduled backup** option.

:::image type="content" source="~/articles/azure-netapp-files/media/azure-netapp-files-create-volumes-smb/backup-protection-volume.png" alt-text="Screenshot showing the Protection tab of creating a volume." lightbox="~/articles/azure-netapp-files/media/azure-netapp-files-create-volumes-smb/backup-protection-volume.png":::

>[!NOTE]
> To enable scheduled backups, you must acknowledge the option, **I acknowledge that enabling scheduled backups may incur additional charges as per backup pricing.**

* **Backup vault**      
    Specify the backup vault for the volume or [create a new backup vault](../backup-vault-manage.md). 
        
* **Backup policy**  
    Specify the backup policy for the volume or [create a new backup policy](../backup-configure-policy-based.md).
        
    You can select only an enabled backup policy. The daily, weekly, and monthly backup retention periods are displayed based on the selected backup policy.  

* **Daily backups retained**  
    Specifies the number of backups that can be retained on a daily basis.

* **Weekly backups retained**  
    Specifies the number of backups that can be retained on a weekly basis. 

* **Monthly backups retained**  
    Specifies the number of backups that can be retained on a monthly basis.

