---
title: Manage the on-premises management console 
description: This article covers various on-premises management console options, for example, backup and restore, defining the host name, and setting up a proxy to sensors.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/12/2020
ms.topic: article
ms.service: azure
---

# Manage the on-premises management console

This article covers various on-premises management console options, for example, backup and restore, defining the host name, and setting up a proxy to sensors.

Management console onboarding is carried out from the Azure portal.

## Define backup and restore settings

The on-premises management console system backup is performed automatically, daily. The data is saved on a different disk: The default location is `/var/cyberx/backups`. 

You can automatically transfer this file to the internal network. 

> Note: The backup and restore procedure can be performed on the same version only. 

To back up the on-premises management console machine: 

- Sign in to an administrative account and type `sudo cyberx-management-backup -full`.

To restore the latest backup file:

- Sign in to an administrative account and type `$ sudo cyberx-management-system-restore`.

To save the backup to external SMB Server:

1. Create a shared folder in the external SMB server.  

   Get the folder path and username and password required to access the SMB server. 

2. In the Defender for IoT, make directory for the backups:

   - `sudo mkdir /<backup_folder_name_on_ server>` 

   - `sudo chmod 777 /<backup_folder_name_on_c_server>/` 

3. Edit fstab:  

   - `sudo nano /etc/fstab` 

   - `add - //<server_IP>/<folder_path> /<backup_folder_name_on_server> cifs rw,credentials=/etc/samba/user,vers=3.0,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0` 

4. Edit or create credentials to share, these are the credentials for the SMB server: 

   - `sudo nano /etc/samba/user` 

5. Add: 

   - `username=<user name>`

   - `password=<password>` 

6. Mount the directory: 

   - `sudo mount -a` 

7. Configure backup directory to the shared folder on the Defender for IoT on-premises management console:  

   - `sudo nano /var/cyberx/properties/backup.properties` 

   - `set Backup.shared_location to <backup_folder_name_on_server>`

## Edit the hostname

Edit the management console hostname configured in the organizational DNS server.

To edit:

1. In the console left pane, select **System Settings**.  

2. In the management console networking section, select **Network**. 

3. Enter the hostname configured in the organizational DNS serve. 

4. Select **Save**.

## Define VLAN names

 VLAN names are not synchronized between the sensor and the management console. You should define identical names on components.

In the networking area, select **VLAN** and add names to the VLAN IDs discovered and select **Save**.

## Define a proxy to sensors

Enhance system security by preventing user sign-in directly to the sensor. Instead leverage proxy tunneling to let users access the sensor directly from the on-premises management console with a single firewall rule. This narrows the possibility of unauthorized access to the network environment beyond the sensor.

Use a proxy in environments where there is no direct connectivity to sensors.

  :::image type="content" source="media/how-to-access-sensors-using-a-proxy/proxy-diagram.png" alt-text="user":::

Perform the following to set up tunneling, including:

  - Connect a Sensor the on-premises management console

  - Set up Tunneling on the on-premises management console

To enable tunneling:

1. Sign in to the on-premises management console appliance CLI with administrative credentials.

2. Type: `sudo cyberx-management-tunnel-enable.`

3. Select **Enter**.

4. Type `--port 10000`.

## Adjust system properties

System properties control various operations and settings in the management console. Editing or modifying them could damage management console operation.

Consult with support.microsoft.com before changing your settings.

To access system properties: 

1. Sign in to the on-premises management console or the sensor.

2. Select **System Settings**.

3. Select **System Properties** from the general section.

## Change the name of the on-premises management console

You can change the name of the on-premises management console. The new names appear in the console web browser, in various console windows, and in troubleshooting logs.

The default name is **management console**.

To change the name:

1. In the bottom of the left pane, select the current name.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/console-name.png" alt-text="Screenshot of the on-premises management console version.":::

2. In the **Edit management console configuration** dialog box, enter the new name. The name can't be longer than 25 characters.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/edit-management-console-configuration.png" alt-text="Screenshot of editing the Defender for IoT platform configuration.":::

3. Select **Save**. The new name is applied.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/name-changed.png" alt-text="Screenshot that shows the changed name of the console.":::

## Next Steps

You may also want to carry out the following on the management console:

[Troubleshoot the sensor and on-premises management console]
(how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
