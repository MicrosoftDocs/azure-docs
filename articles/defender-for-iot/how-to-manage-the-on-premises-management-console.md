---
title: Backup and restore the management console 
description: The on-premises management console system backup is performed automatically, daily.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/17/2020
ms.topic: article
ms.service: azure
---

# Overview

## Define on-premises management console system backup and restore 

On-premises management console system backup is performed automatically, daily. The data is saved on a different disk: The default location is */var/cyberx/backups*. 

You can automatically transfer this file to the internal network. 

> Note: The Backup/Restore procedure can be performed on the same version only. 

**To back up the on-premises management console machine**: 

- Log into an administrative account and type sudo cyberx-management-backup -full. 

**To restore the latest backup file**: 

- Log into an administrative account and type $ sudo cyberx-management-system-restore. 

**To save the backup to external SMB Server**: 

1. Create a shared folder in the external SMB server.  

   Get the folder path and username and password required to access the SMB server. 

2. In the CyberX, make directory for the backups: 

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

7. Configure backup directory to the shared folder on the cyberx On-premises management console:  

   - `sudo nano /var/cyberx/properties/backup.properties` 

   - `set Backup.shared_location to <backup_folder_name_on_server>`
   
## See also

- [Manage individual sensors](how-to-manage-individual-sensors.md)
- [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
