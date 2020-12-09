---
title: Manage sensors from the on-premises management console 
description: Learn how to manage sensors from the management console, including, updating sensor versions, pushing system settings to sensors, enabling and disabling engines on sensors, and more.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/07/2020
ms.topic: how-to
ms.service: azure
---

# Manage sensors from the management console

This article describes how to manage sensors from the management console, including:

- Push system settings to sensors

- Enable and disable engines on sensors

- Update sensor version

## Push configurations

You can define various system settings and automatically apply them to sensors connected to the management console. This saves time and helps ensure streamlined settings across your enterprise sensors.

The following sensor system settings can be defined from the management console:

- Mail server

- SNMP MIB monitoring

- Active directory

- DNS settings

- Subnets

- Port aliases

To apply system settings:

1. In the console left pane, select **System Settings**.

2. In the **Configure Sensors** pane, select one of the sensor system setting options.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/sensor-system-setting-options.png" alt-text="The system setting options for your sensor":::

   The following example describes how to define Mail Server parameters for your enterprise sensors.

3. Select **Mail Server**.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/edit-system-settings-screen.png" alt-text="Select your mail server from the system setting screen":::

4. Select a sensor on the left.

5. Set the mail server parameters and select **Duplicate**. Each item in the sensors tree appears with a checkbox next to it.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/check-off-each-sensor.png" alt-text="Ensure the checkbox is selected for your sensors":::

6. In the sensors tree, select the items to which you want to apply the configuration.

7. Select **Save**.

## Update versions

You can update several sensors simultaneously from the on-premises management console.

To update several sensors:

1. Go to the [Azure portal](https://portal.azure.com/).

2. Go to Defender for IoT.

3. Go to the **Updates** page.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/update-screen.png" alt-text="Screenshot of the updates dashbord view.":::

4. Select **Download** from the sensors section and save the file.

5. Sign in to the management console and select **System Settings**.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/admin-system-settings.png" alt-text="Screenshot of Administration menu to select System Settings.":::

6. Mark the sensors you want to update in the **Sensor Engine Configuration** section and select **Automatic Updates**.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/sensors-select.png" alt-text="Two sensors showing learning mode and automatic updates.":::

7. Select **Save Changes**.

8. In the **Sensors Version upgrade** pane, select :::image type="icon" source="media/how-to-manage-sensors-from-the-on-premises-management-console/plus-icon.png" border="false":::.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/display-files.png" alt-text="Sensor version upgrade screen to display files.":::

9. An **Upload File** dialog box opens. Upload the file you downloaded from the **Updates** page.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/upload-file.png" alt-text="Click the Browse button to upload your file.":::

10. During the update process, the update status of each sensor appears in the **Site Management** window.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/progress.png" alt-text="Observe the progress of your update.":::

## Update Threat Intelligence packages 

The Threat Intelligence data package is provided with each new Defender for IoT version, or if needed in between releases. The package contains signatures, including malware signatures, CVE's, and other security content. 

This file can be manually uploaded from the Defender to IoT portal **Updates** page and automatically updated to sensors. 

To update the Threat Intelligence data: 

1. Navigate to the Defender for IoT **Updates** page. 

2. Download and save the file.

3. Sign in to the management console. 

4. On the side menu, select **System Settings**. 

5. Select the sensors that should receive the update in **Sensor Engine Configuration** section.  

6. In the **Select Threat Intelligence Data** section, select the **+**. 

7. Upload the package downloaded from the Defender for IoT Updates page.

## Understand sensor disconnection events

The **Site Manager** window displays disconnect information if sensors disconnect from their assigned on-premises management console. The following sensor disconnect information is available:

- The on-premises management console cannot process data received from the sensor.

- Times drift detected. The on-premises management console has been disconnected from sensor.

- Sensor not communicating with on-premises management console. Check network connectivity.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/edit-system-settings-screen.png" alt-text="Screenshot of the zone 1 view.":::

## Enable or disable sensors

Sensors are protected by five Defenders for IoT engines. You can enable or disable the engines for connected sensors.

| Engine | Description | Example scenario |
|--|--|--|
| Protocol Violation Engine | A protocol violation occurs when the packet structure or field values don't comply with the protocol specification. | "Illegal MODBUS Operation (Function Code Zero)" alert. This alert indicates that a primary device sent a request with function code 0 to a secondary device. This is not allowed according to the protocol specification and the secondary device might not handle the input correctly. |
| Policy Violation Engine | A policy violation occurs with a deviation from baseline behavior defined in the learned or configured policy. | "Unauthorized HTTP User Agent" alert. This alert indicates that an application that was not learned or approved by the policy is used as an HTTP client on an device. This may be a new web browser or application on that device. |
| Malware Engine | The malware engine detects malicious network activity. | "Suspicion of Malicious Activity (Stuxnet)" alert. This alert indicates that the sensor found suspicious network activity known to be related to the Stuxnet malware, which is an advanced persistent threat aimed at industrial control / SCADA networks. |
| Anomaly Engine | The malware engine detects anomaly in network behavior. | "Periodic Behavior in Communication Channel." This is a component that inspects network connections and finds periodic/cyclic behavior of data transmission, which is very common in industrial networks. |
| Operational Engine | Operational incidents or malfunctioning entities. | “Asset is Suspected to be Disconnected (Unresponsive)" alert. This alert triggered when a device is not responding to any requests for a pre-defined period, this may indicate on an device shutdown, disconnection or malfunction.
|

To enable or disable:

1. In the console left pane, select **System Settings**.

2. In the Sensor Engine Configuration section, **Enable** or **Disable** engines for connected sensors.
 	 	 
3. Select **SAVE CHANGES**.

   A red exclamation mark appears if there is a mismatch of enabled engines on one of your enterprise sensors. The engine may have been disabled directly form the sensor.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/red-exclamation-example.png" alt-text="Mismatch of enabled engines "::: 

## Define sensor backup schedules

You can schedule sensor backups and perform on-demand sensor backups from the on-premises management console. This provides safety and protection against hard drive failures and data loss.

What is backed up: Configurations and data.

What is not backed up: PCAP files and logs. Backup and restore of PCAPs and logs can be done manually.

By default, sensors are automatically backed up at 3:00 AM daily. The sensor Backup Schedule feature lets you collect these backups and store them up on the on-premises management console, or an external backup server. Copying files from sensors to the on-premises management console is carried out over an encrypted channel.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/sensor-backup-schedule-screen.png" alt-text="A view of the sensor backup screen":::

When the default sensor backup location is changed, the on-premises management console automatically retrieves the files from the new location on the sensor or an external location, provided the on-premises management console has permission to access the location. 

When the sensors are not registered with the on-premises management console, the **Sensor Backup Schedule** dialog box indicates that no sensors are managed.  

The restore process is the same regardless of where the files are stored.

### On-premises management console backup storage for sensors

You can maintain up to 9 backups for each managed sensor, provided that the backed-up files do not exceed the maximum backup space allocated. 

On-premises management console storage:  

The space available is calculated based on the management console model you are working with. 

- Production model: default storage: 40 GB, limit: 100 GB 

- Medium model: default storage: 20 GB, limit: 50 GB 

- Laptop model: default storage: 10 GB, limit: 25 GB 

- Thin model: default storage: 2 GB, limit: 4 GB 

- Rugged model: default storage: 10 GB, limit: 25 GB 

The default allocation is displayed in the **Sensor Backup Schedule** dialog box. 

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/edit-mail-server-configuration.png" alt-text="The edit mail server configuration screen":::

External server storage (custom path):

There is no storage limitation when backing up to an external server. You must, however: 

- Define an upper allocation limit in the **Sensor Backup Schedule**, **Custom Path** field. The following numbers and characters are supported: `/ a-z A-Z 0-9 and _`. 

Exceeding allocation storage limitation:

- If you exceed the storage space allocated, the sensor is not backed up. 

- If you are backing up more than one sensor, the management console attempts to retrieve sensor files for the managed sensors.  

- If the retrieval from one sensor exceeds the limit, the management console attempts to retrieve backup information from the next sensor. 

Exceeding retained number of backups limitation:

When you exceed the retained number of backups defined, the oldest backed up file is deleted to accommodate the new one.

Backup file naming:

Sensor backup files are automatically named using the following format:   

`<sensor name>-backup-version-<version>-<date>.tar`

Example: `Sensor_1-backup-version-2.6.0.102-2019-06-24_09:24:55.tar`. 

To backup: 

1. Select **Schedule Sensor Backup** from the **System Settings** window. Sensors managed by your on-premises management console appear in the **Sensor Backup Schedule** window.  

2. Enable the **Collect Backups** toggle.  

3. Select a calendar interval, date and time zone. The time format is based on a 24-hour clock. For example, 6:00 PM should be entered as 18:00. 

4. In the **Backup Storage Allocation** field, enter the storage you want to allocate for your backups. You will be notified if the maximum space is exceeded. 

5. In the **Retain Last** field, indicate the number of backups per sensor you want to retain. When the limit is exceeded, the oldest backup is exceeded.  

6. Choose a backup location:  

 - To back up to the on-premises management console, disable the **Custom Path** toggle. The default location is `/var/cyberx/sensor-backups`.  

 - To back up to an external server, enable the **Custom Path** toggle and enter a location. The following numbers and characters are supported: `/ a-z A-Z 0-9 and _`. 

7. Select **Save**. 

To backup immediately: 

- Select **Back Up Now**. The sensor backup files are created and collected by the on-premises management console. 

### Receiving backup notifications for sensors 

Information about backup successes and failures are automatically listed in the sensor backup schedule dialog box and backup log.  

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/sensor-location.png" alt-text="View your sensors and where they are located and all relevant information.":::

Failures may occur because:    

- No backup file is found. 

- A file was found but cannot be retrieved.  

- There is a network connection failure. 

- There is not enough room allocated to the on-premises management console to complete the backup.  

You can send an email notification, Syslog updates, and system notifications when a failure occurs. To do this create a Forwarding Rule with System Notifications. 

### Restoring sensors 

Backups can be restored from the on-premises management console and by using CLI.  

To restore from the console: 

- Select **Restore Image** from the **Sensor System** setting window.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/restore.png" alt-text="Restore a backup of your image":::

Restore failures will be displayed.  

To restore using CLI: 

- Sign in to an administrative account and type `$ sudo cyberx-xsense-system-restore`. 

### Set up for saving sensors backup to an external SMB server

This article describes how to set up the SMB server when saving a backup to an external drive.  

To save sensor backup to an external SMB server: 

1. Create a shared folder in the external SMB server. 

2. Get the folder path and username and password required to access the SMB server. 

3. In Defender for IoT, make directory for the backups: 

 - `sudo mkdir /<backup_folder_name_on_server>` 

 - `sudo chmod 777 /<backup_folder_name_on_server>/` 

4. Edit fstab:  

 - `sudo nano /etc/fstab` 

 - `add - //<server_IP>/<folder_path> /<backup_folder_name_on_cyberx_server> cifs rw,credentials=/etc/samba/user,vers=3.0,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0` 

5. Edit/create credentials to share. These are the credentials for the SMB server: 

 - `sudo nano /etc/samba/user` 

6. Add:  

 - `username=<user name>` 

 - `password=<password>` 

7. Mount the directory: 

 - `sudo mount -a` 

8. Configure backup directory to the shared folder on the Defender for IoT sensor:  

 - `sudo nano /var/cyberx/properties/backup.properties` 

9. Set Backup.shared_location to `<backup_folder_name_on_cyberx_server>`.

## See also

[Manage individual sensors](how-to-manage-individual-sensors.md)
