---
title: Back up OT network sensors from the on-premises management console - Microsoft Defender for IoT
description: Learn how to back up Microsoft Defender for IoT OT network sensors from the on-premises management console.
ms.date: 03/09/2023
ms.topic: how-to
---

# Back up OT network sensors from the on-premises management console

Back up your OT network sensors from the on-premises management console to help protect against hard drive failures and data loss. In this article, learn how to:

- Manage the sensor backup files
- Configure backup settings
- Run an unscheduled backup
- View backup notifications
- Use an SMB server to save your backup files to an external server

## Manage OT sensor backup files

Define OT sensor backup schedules from your on-premises management console to streamline settings across your system and store backup files on your on-premises management console.

The on-premises management console can store up to nine backup files for each connected OT sensor, provided that the backup files don't exceed the allocated backup space.

Backup files are copied from the OT sensor to the on-premises management console over an encrypted channel.

For more information, see [Set up backup and restore files](back-up-restore-sensor.md#set-up-backup-and-restore-files).

## Configure OT sensor backup settings

1. Sign into your on-premises management console and go to **System Settings**. In the **Management console general configuration** area, select **Schedule Sensor Backups**.

1. In the **Sensor Backup Schedule** dialog, toggle on the **Collect Backups** option so that it reads **Collect Backups On**.

1. Enter scheduling details for your backup, using a 24-hour clock in the time value. For example, to schedule a backup at 6:00 PM, enter **18:00**.

1. Enter the number of GB you want to allocate for backup storage. When the configured limit is exceeded, the oldest backup file is deleted.

    **If you're storing backup files on the on-premises management console**, supported values are defined based on your [hardware profiles](ot-appliance-sizing.md). For example:
    
    |Hardware profile  |Backup storage availability  |
    |---------|---------|
    |**E1800**     |Default storage is 40 GB; limit is 100 GB.        |
    |**L500**     |   Default storage is 20 GB; limit is 50 GB.     |
    |**L100**     |  Default storage is 10 GB; limit is 25 GB.       |
    |**L60** [*](ot-appliance-sizing.md#l60)        |    Default storage is 10 GB; limit is 25 GB.     |

    **If you're storing backup files on an external server**, there's no maximum storage. However, keep in mind:

    - If the allocated storage space is exceeded, the OT sensor isn't backed up.
    - The on-premises management console will still attempt to retrieve backup files for managed OT sensors. If the backup file for one OT sensor exceeds the configured storage, the on-premises management console skips it and continues on to the next OT sensor's backup file.

1. Enter the number of backup files you want to retain on each OT sensor.

1. To define a custom path for your backup storage on the on-premises management console, toggle on the **Custom Path** option and enter the path to your backup storage. For example, you may want to save your backup files on an external server. 

    Supported characters include alphanumeric characters, forward slashes (**/**), and underscores (**_**).

    Make sure that the location you enter is accessible by the on-premises management console.

    By default, backup files are stored on your on-premises management console at `/var/cyberx/sensor-backups`.

1. Select **SAVE** to save your changes.

## Run an immediate, unscheduled backup

1. Sign into your on-premises management console and go to **System Settings**. In the **Management console general configuration** area, select **Schedule Sensor Backups**.

1. Locate the OT sensor you want to back up and select **Back up Now**.

1. Select **CLOSE** to close the dialog.

## View backup notifications

To check for backup notifications on the on-premises management console:

1. Sign into your on-premises management console and go to **System Settings**. In the **Management console general configuration** area, select **Schedule Sensor Backups**.

1. In the **Sensor Backup Schedule** dialog, check for details about recent backup activities for each sensor listed. For example:

    :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/sensor-location.png" alt-text="View your sensors and where they're located and all relevant information.":::

Backup failures might occur for any of the following scenarios:

- A backup file can't be found or retrieved.
- Network connection failures.
- There isn't enough storage space allocated on the on-premises management console for the backup file.

> [!TIP]
> You may want to send alerts about backup notifications to partner services. 
>
> To do this, [create a forwarding alert rule](how-to-forward-alert-information-to-partners.md#create-forwarding-rules-on-an-on-premises-management-console) on your on-premises management console. In the **Create Forwarding Rule** dialog box, make sure to select **Report System Notifications**. 

## Save your backup file to an external server (SMB)

We recommend saving your OT sensor backup files on your internal network. To do this, you may want to use an SMB server. For example:

1. Create a shared folder on the external SMB server, and make sure that you have the folder's path and the credentials required to access the SMB server.

1. Sign into your OT sensor via SFTP and create a directory for your backup files. Run:

    ```bash
    sudo mkdir /<backup_folder_name_on_server> 
    
    sudo chmod 777 /<backup_folder_name_on_server>/
    ```

1. Edit the `fstab` file with details about your backup folder. Run:

    ```bash
    sudo nano /etc/fstab

    add - //<server_IP>/<folder_path> /opt/sensor/persist/backups cifs 
    rw,credentials=/etc/samba/user,vers=3.0,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0
    ```

1. Edit and create credentials to share for the SMB server. Run:

    ```bash
    sudo nano /etc/samba/user
    ```

1. Add your credentials as follows:

    ```bash
    username=<user name>

    password=<password>
    ```

1. Mount the backup directory. Run:

    ```bash
    sudo mount -a
    ```
    Backups are stored in the remote location.

## Next steps

For more information, see:

[Manage sensors from the on-premises management console](how-to-manage-sensors-from-the-on-premises-management-console.md)

[Back up and restore OT network sensors from the sensor console](back-up-restore-sensor.md)
