---
title: Back up and restore OT network sensors from the sensor console - Microsoft Defender for IoT
description: Learn how to back up and restore Microsoft Defender for IoT OT network sensors from the sensor console.
ms.date: 03/09/2023
ms.topic: how-to
---

# Back up and restore OT network sensors from the sensor console

OT sensor data can be backed up and restored from the sensor console to help protect against hard drive failures and data loss. In this article, learn how to:

- Set up automatic backup files from the sensor console GUI or via CLI
- Back up files manually via sensor console GUI and CLI
- Use an SMB server to save your backup file to an external server
- Restore an OT sensor from the GUI or via CLI

## Set up backup and restore files

OT sensors are automatically backed up daily at 3:00 AM, including configuration and detected data. Backup files do *not* include PCAP or log files, which must be manually backed up if needed.

We recommend that you configure your system to automatically transfer backup files to your own internal network, or an [on-premises management console](back-up-sensors-from-management.md).

For more information, see [On-premises backup file capacity](references-data-retention.md#on-premises-backup-file-capacity).

> [!NOTE]
> Backup files can be used to restore an OT sensor only if the OT sensor's current software version is the same as the version in the backup file.

### Turn on backup functionality

If your OT sensor is configured *not* to run automatic backups, you can turn this back on manually in the `/var/cyberx/properties/backup.properties` file on the OT sensor machine.

## Create a manual backup from the GUI

You may want to create a manual backup file, such as just after updating your OT sensor software.

**To create a manual backup file from the GUI**:

1. Sign into the OT sensor GUI and select **System settings** > **Sensor management** > **Health and troubleshooting** > **Backup & restore**.

1. In the **Backup & restore pane**:

    - Enter a meaningful filename for your backup file.
    - Select the content you want to back up.
    - Select **Export**.

Your new backup file is listed in the **Archived files** area of the backup pane.

> [!NOTE]
> Backup files can be used to restore data, but can't be opened without the one-time password (OTP) provided and assistance from Microsoft support. Open a support ticket if you need to open a backup file.

## Start an immediate, unscheduled backup via CLI

You may want to create a manual backup file, such as just after updating your OT sensor software.

To run a manual backup from the CLI, use the `cyberx-xsense-system-backup` CLI command.

For more information, see the [OT sensor CLI reference](cli-ot-sensor.md#start-an-immediate-unscheduled-backup).

## Save your backup to an external server (SMB)

We recommend saving your OT sensor backup files on your internal network. To do this, you may want to use an SMB server. For example:

1. Create a shared folder on the external SMB server, and make sure that you have the folder's path and the credentials required to access the SMB server.

1. Sign into your OT sensor via SFTP and create a directory for your backup files. Run:

    ```bash
    sudo mkdir /<backup_folder_name>

    sudo chmod 777 /<backup_folder_name>/
    ```

1. Edit the `fstab` file with details about your backup folder. Run:

    ```bash
    sudo nano /etc/fstab

    add - //<server_IP>/<folder_path> /<backup_folder_name_on_cyberx_server> cifsrw,credentials=/etc/samba/user,vers=X.X,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0
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

1. Configure your backup directory on the SMB server to use the shared file on the OT sensor. Run:

    ```bash
    sudo nano /var/cyberx/properties/backup.properties`
    ```

    Set the `backup_directory_path` to the folder on your OT sensor where you want to save your backup files.

## Restore an OT sensor from the GUI

1. Sign into the OT sensor via SFTP and download the backup file you want to use to a location accessible from the OT sensor GUI.

    Backup files are saved on your OT sensor machine, at `/var/cyberx/backups`, and are named using the following syntax: `<sensor name>-backup-version-<version>-<date>.tar`.

    For example: `Sensor_1-backup-version-2.6.0.102-2019-06-24_09:24:55.tar`

    > [!IMPORTANT]
    > Make sure that the backup file you select uses the same OT sensor software version that's currently installed on your OT sensor.
 
1. Sign into the OT sensor GUI and select **System settings** > **Sensor management** > **Health and troubleshooting** > **Backup & restore** > **Restore**. 

1. Select **Browse** to select your downloaded backup file. The sensor will start to restore from the selected backup file.

1. When the restore process is complete, select **Close**.

## Restore an OT sensor from the latest backup via CLI

To restore your OT sensor from the latest backup file via CLI:

1. Make sure that your backup file has the same OT sensor software version as the current software version on the OT sensor.

1. Use the `cyberx-xsense-system-restore` CLI command to restore your OT sensor.

For more information, see the [OT sensor CLI reference](cli-ot-sensor.md#start-an-immediate-unscheduled-backup).

## Next steps

[Maintain OT network sensors from the GUI](how-to-manage-individual-sensors.md)

[Backup OT network sensors from the on-premises management console](back-up-sensors-from-management.md)
