---
title: Manage individual sensors
description: Learn how to activate and set up a sensor, as well as perform sensor management tasks, for example backup and restore. 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/06/2020
ms.topic: how-to
ms.service: azure
---

# Manage individual sensors

This article describes how to activate and set up a sensor, as well as perform sensor management tasks, for example  backup and restore.

## Manage sensor activation files

Your sensor was onboarded with the Defender for IoT from the Azure portal. Each sensor was onboarded as either a locally connected or cloud connected sensor.

A unique activation file should have been uploaded to each sensor you deploy. 

For more information regarding when and how to use a new file, see [Upload new activation files](#upload-new-activation files).

If you can't upload the file, see [Activation file upload troubleshooting](#activation-file-upload-troubleshooting).

### About locally connected sensor activation files

Locally connected sensors are associated with an Azure subscription. The activation file for your locally connected sensors contains an expiration date. One month before this date, a warning message appears at the top of the sensor console. The warning remains until after you have updated the activation file.

   :::image type="content" source="media/how-to-manage-individual-sensors/system-setting-screenshot.png" alt-text="The screenshot of the system settings.":::

You can continue working with Defender for IoT features even if the activation file has expired. 

### About cloud connected sensor activation files

Sensors that are cloud connected are associated with the Defender for IoT hub. These sensors are not limited by activation file time periods. The activation file for cloud connected sensors is used to ensure connection to the Defender for IoT hub.

### Upload new activation files

You may need to upload a new activation file for an onboarded sensor when: 

- An activation file expires on a locally connected sensor. 

- You want to work in a different sensor management mode. 

 - You want to assign a new Defender for IoT hub to a cloud connected sensor.  

To add a new activation file:

1. Navigate to the Sensor Management page.

2. Select the sensor for which you want to upload a new activation file.

3. Delete it.

4. Onboard the sensor again from the Onboarding page in the new mode or with a new Defender for IoT hub.

5. Download the activation file from the Download Activation file page.

6. Save the file.

    :::image type="content" source="media/how-to-manage-individual-sensors/download-activation-file.png" alt-text="Download the activation file from the Defender for IoT hub.":::

7. Sign in to the Defender for IoT sensor console.

8. In the sensor console, select **System Settings** and then select **Reactivation**.

    :::image type="content" source="media/how-to-manage-individual-sensors/reactivation.png" alt-text="System settings screen select reactivation.":::

9. Select **Upload** and select the file you saved.

    :::image type="content" source="media/how-to-manage-individual-sensors/upload-the-file.png" alt-text="Upload the file you saved.":::

10. Select **Activate**.

### Activation file upload troubleshooting

You will receive an error message if the activation file could not be uploaded. The following events may have occurred.

**For locally connected sensors:** The activation file is not valid. If the file is not valid, go to the Defender for IoT portal, Sensor Management page. Select the sensor with the invalid file and download a new activation file.

**For cloud connected sensors:** The sensor cannot connect to the Internet. Check the sensor network configuration. If your sensor needs to connect through a web proxy to access the internet, verify that your proxy server is configured correctly in the Sensor Network Configuration screen. Verify that *.azure-devices.net:443 is allowed in the firewall, and, or proxy. If wildcards are not supported or you want more control, the specific Defender for IoT hub FQDN should be opened in your Firewall, and, or Proxy. For details see [https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-endpoints](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fiot-hub%2Fiot-hub-devguide-endpoints&data=02%7C01%7Cshhazam%40microsoft.com%7C54abec3c770244100bf008d85577bc05%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637353320025591548&sdata=Bt%2BcKHNkS8pPamoqnCLtx6m3P9%2BmR9U11M2sCrtDEm0%3D&reserved=0).  

- **For cloud connected sensors**: The activation file is valid but Defender for IoT rejected it.

If you cannot resolve this issue, you can download another activation from the Defender for IoT portal, Sensor Management page. If this does not work, contact support.

## Connect a sensor to the management console

This section describes how to ensure connection between the sensor and the on-premises management console. You will need to do this if you are working in an air-gapped network and want to send asset and alert information to the management console from the sensor. This also allows the management console to push system settings to the sensor and perform other management tasks on the sensor.

Connection between the sensor and the management console is carried out in three steps:

- In the on-premises management console, copy an automatically generated sensor connection string.

- In the sensor, paste the connection string Management Console Connection dialog box.

- In the on-premises management console, assign the sensor to a zone.

To connect:

1. Sign in to the on-premises management console.

2. Select **System Settings**.

3. In the Sensor Setup – Connection String section copy the connection string.

   :::image type="content" source="media/how-to-manage-individual-sensors/connection-string-screen.png" alt-text="Copy the connection string from this screen."::: 

4. Sign in to sensor console.

5. In the left pane, select **System Settings**.

6. Select **Management Console Connection**.

    :::image type="content" source="media/how-to-manage-individual-sensors/management-console-connection-screen.png" alt-text="Screenshot of the management console connection screen.":::

7. Paste the connection string in the connections string field and select **Connect**.

8. Assign the sensor to a zone in the management console, Site Management window.

## Update sensor network configuration

The sensor network configuration was defined during the sensor installation. You can change configuration parameters. You can also set up a proxy configuration.

If you create a new IP address, you may be required to sign in again.

To change the configuration:

1. On the side menu, select **System Settings**.

2. In the System Setting window, select **Network**.

    :::image type="content" source="media/how-to-manage-individual-sensors/edit-network-configuration-screen.png" alt-text="Configure your network settings.":::

3. Set the parameters as follows:

    | Parameter | Description |
    |--|--|
    | IP address | The sensor IP address |
    | Subnet mask | The mask address |
    | Default gateway | The default gateway address |
    | DNS | The DNS server address |
    | Hostname | The sensor hostname |
    | Proxy | Proxy host and port name. |

4. Select **Save**.

## Synchronize time zones on the sensor

You can configure the sensor time and region so that all the users see the same time and region.

:::image type="content" source="media/how-to-manage-individual-sensors/time-and-region.png" alt-text="Configure the time and region.":::

| Parameter | Description |
|--|--|
| Timezone | The timezone definition for:<br />- Alerts<br />- Trends & statistics widgets<br />- Data mining reports<br />   -Risk assessment reports<br />- Attack vectors |
| Date format | Select one of the following format options:<br />- dd/MM/yyyy HH:mm:ss<br />- MM/dd/yyyy HH:mm:ss<br />- yyyy/MM/dd HH:mm:ss |
| Date and time | Displays the current date and local time in the format you selected.<br />For example, if your actual location is America and New York, but the timezone is set to Europe and Berlin, the time is displayed according to Berlin local time. |

To configure the sensor time:

1. On the side menu, select **System Settings**.

2. In the System Setting window, select **Time & Regional**.

3. Set the parameters and select **Save**.

## Set up backup and restore files

System backup is performed automatically at 3:00 AM daily. The data is saved on a different disk in the sensor, the default location is `/var/cyberx/backups`.

You can automatically transfer this file to the internal network.

> [!NOTE]
> - The backup and restore procedure can be performed between the same versions only.
> - In some architectures, the backup is disabled. You can enable it in `/var/cyberx/properties/backup.properties file`.

When a sensor is controlled by an on-premises management console, the sensor backup schedule capability lets you collect these backups and store them up on the management console, or an external backup server.

**What is backed up:** Configurations and data.

**What is Not backed up:** PCAP files and logs. Backup and restore of PCAPs and logs can be done manually.

**Backup File Naming**

Sensor backup files are automatically named using the following format:

`<sensor name>-backup-version-<version>-<date>.tar`

Example: `Sensor_1-backup-version-2.6.0.102-2019-06-24_09:24:55.tar.`

To configure backup:

- Sign in to an administrative account and type `$ sudo cyberx-xsense-system-backup`.

To restore the latest backup file:

- Sign in to an administrative account and type `$ sudo cyberx-xsense-system-restore`.

To save the backup to external SMB Server:

1. Create a shared folder in the external SMB server.

    Get the folder path and user name and password required to access the SMB server.

2. In the sensor, make a directory for the backups:

    - `sudo mkdir /<backup_folder_name_on_cyberx_server>`

    - `sudo chmod 777 /<backup_folder_name_on_cyberx_server>/`

3. Edit fstab: 

    - `sudo nano /etc/fstab`

    - `add - //<server_IP>/<folder_path> /<backup_folder_name_on_cyberx_server> cifsrw,credentials=/etc/samba/user,vers=X.X,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0`

4. Edit and create credentials to share, these are the credentials for the SMB server:

    - `sudo nano /etc/samba/user` 

5. Add:

    - username=&gt:user name&lt:

    - password=`<password>`

6. Mount the directory:

    - `sudo mount -a`

7. Configure backup directory to the shared folder on the Defender for IoT sensor:  

    - `sudo nano /var/cyberx/properties/backup.properties`

    - `set backup_directory_path to <backup_folder_name_on_cyberx_server>`

### Restoring sensors

Backups can be restored from the sensor console and using CLI.

**To restore from the console:**

  - Select **Restore Image** from the sensor System Setting window.

    :::image type="content" source="media/how-to-manage-individual-sensors/restore-image-screen.png" alt-text="Restore your image by clicking the button.":::

Restore failures will be displayed.

**To restore using CLI:**

  - Sign in to an administrative account and type `$ sudo cyberx-management-system-restore`.

## Update a standalone sensor version

The following procedure describes how to update a standalone sensor using the sensor console. The update process takes approximately 30 minutes.

1. Go to the [Azure portal](https://portal.azure.com/).

2. Go to Defender for IoT.

3. Go to the **Updates** page.

   :::image type="content" source="media/how-to-manage-individual-sensors/updates-page.png" alt-text="Screenshot of Updates page of Defender for IoT.":::

4. Select **Download** from the Sensors section and save the file.

5. In the sensor console sidebar, select **System Settings**.

6. In the Version Upgrade pane, select **Upgrade.**

    :::image type="content" source="media/how-to-manage-individual-sensors/upgrade-pane.png" alt-text="Screenshot of the upgrade pane.":::

7. Select the file you downloaded from the Defender for IoT Updates page.

8. The update process starts, during which time the system is rebooted twice.

9. After the first reboot (before the completion of the update process), the system opens with the sign in window. After the sign in, displays  at the bottom left of the sidebar:

    :::image type="content" source="media/how-to-manage-individual-sensors/defender-for-iot-version.png" alt-text="Screenshot of the upgrade version that appears after signing in.":::

## Adjust system properties

System properties control various operations and settings in the management console. Editing or modifying them could damage your on-premises management console system operation.

Consult with support.microsoft.com before changing your settings.

To access system properties: 

1. Sign in to the on-premises management console or the sensor.

2. Select **System Settings**.

3. Select **System Properties** from the general section.

## See also

[Manage Sensors from the Management Console](how-to-manage-sensors-from-the-on-premises-management-console.md)