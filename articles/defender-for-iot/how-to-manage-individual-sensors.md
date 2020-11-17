---
title: Manage individual sensors
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/04/2020
ms.topic: article
ms.service: azure
---

#

## Manage sensor activation files

Your sensor was onboarded with Azure Defender for IoT from the Azure portal. Each sensor was onboarded as either a Locally Managed or Cloud Managed sensor.

A unique activation file should have been uploaded to each sensor you deploy. 

See [Upload New Activation Files](#upload-new-activationfiles) for information regarding when and how to use a new file.

See [Activation File Upload Troubleshooting](#activation-file-upload-troubleshooting) if you cannot upload the file.

### About locally managed sensor activation files

Locally Managed sensors are associated with an Azure Subscription.  The activation file for your Locally Managed sensors contains an expiration date. One month before this date, a warning message appears at the top of the sensor console. The warning remains until after you have updated the activation file.   

   :::image type="content" source="media/how-to-manage-individual-sensors/image304.png" alt-text="system settings":::

You can continue working with Azure Defender for IoT features even if the activation file has expired. 

### About cloud managed sensor activation files

Sensors that are Cloud Managed are associated with an Azure IoT Hub. These sensors are not limited by activation file time periods. The activation file for Cloud Managed sensors is used to ensure connection to the IoT Hub.

### Upload new activation files

You may need to upload a new activation file for an onboarded sensor when: 

  - An activation file expires on a locally managed sensor. 

  - You want to work in a different sensor management mode. 

  - You want to assign a new IoT Hub to a Cloud Managed sensor.  

**To add a new activation file:**

1. Navigate to the Azure Defender for IoT, **Sensor Management** page.

2. Select the sensor for which you want to upload a new activation file.

3. Delete it.

4. Onboard the sensor again from the **Onboarding** page in the new mode or with a new IoT Hub.

5. Download the activation file from the **Download activation file** page.

6. Save the file.

    :::image type="content" source="media/how-to-manage-individual-sensors/image305.png" alt-text="Download activation file":::

7. Log in to the Azure Defender for IoT sensor console.

8. In the sensor console, select **System Settings** and then select **Reactivation**.

    :::image type="content" source="media/how-to-manage-individual-sensors/image306.png" alt-text="System Settings Reactivation":::

9. Select **Upload** and select the file you saved.

    :::image type="content" source="media/how-to-manage-individual-sensors/image307.png" alt-text="Upload":::

10. Select **Activate**.

### Activation file upload troubleshooting

You will receive an error message if the activation file could not be uploaded. The following events may have occurred.

  - **For Locally Managed sensors:** The activation file is not valid. If the file is not valid, go to the **Azure Defender for IoT portal**, **Sensor Management** page. Select the sensor with the invalid file and download a new activation file.

  - **For Cloud Managed sensors:** The sensor cannot connect to the Internet: Check the sensor network configuration. If your sensor needs to connect through a web proxy to access the internet, verify that your proxy server is configured correctly in the Sensor Network Configuration screen. Verify that *.azure-devices.net:443 is allowed in the firewall and/or proxy. If wildcards are not supported or you want more control, the specific IoT Hub FQDN should be opened in your Firewall and/or Proxy. For details see [https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-endpoints](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fiot-hub%2Fiot-hub-devguide-endpoints&data=02%7C01%7Cshhazam%40microsoft.com%7C54abec3c770244100bf008d85577bc05%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637353320025591548&sdata=Bt%2BcKHNkS8pPamoqnCLtx6m3P9%2BmR9U11M2sCrtDEm0%3D&reserved=0).  

  - **For Cloud Managed sensors**: The activation file is valid but Azure Defender for IoT rejected it.

If you cannot resolve this issue, you can download another activation from the **Azure Defender for IoT portal, Sensor Management** page. If this does not work, contact support.

## Connect a sensor to the management console

This section describes how ensure connection between the sensor and the on-premises management console. You will need to do this if you are working in an air-gapped network and want to send asset and alert information to the management console from the sensor. This also allows the management console to push System Settings to the sensor and perform other management tasks on the sensor.

Connection between the sensor and the management console is carried out in 3 steps:

  - In the on-premises management console: copy an automatically generated sensor connection string.

  - In the sensor: Paste the connection string Management Console Connection dialog box.

  - In the on-premises management console: Assign the sensor to a zone.

**To connect:**

1. Log in to the on-premises management console.

2. Select **System Settings**.

3. In the **Sensor Setup – Connection String** section copy the connection string.

    :::image type="content" source="media/how-to-manage-individual-sensors/image308.png" alt-text="Connection String":::

4. Log in to sensor console.

5. In the left pane, select **System Settings**.

6. Select **Management Console Connection**.

    :::image type="content" source="media/how-to-manage-individual-sensors/image309.png" alt-text="Management Console Connection":::

7. Paste the connection string in the connections string field and select **Connect**.

8. Assign the sensor to a Zone in the management console, Site Management window. Refer to the *On-premises Management Console User Guide* for details.

## Update sensor network configuration

The sensor network configuration was defined during the sensor installation. You can change configuration parameters. You can also set up a proxy configuration.

If you create a new IP you may be required to log in again.

**To change the configuration:**

1. On the side menu, select **System Settings**.

2. In the **System Setting** window, select **Network**.

    :::image type="content" source="media/how-to-manage-individual-sensors/image4.png" alt-text="System Setting":::

3. Set the parameters as follows:

    | Parameter       | Description                 |
    | --------------- | --------------------------- |
    | IP Address      | The sensor IP address       |
    | Subnet Mask     | The mask address            |
    | Default Gateway | The default gateway address |
    | DNS             | The DNS server address      |
    | Hostname        | The sensor hostname         |
    | Proxy           | Proxy host and port name.   |

    Select **Save**.

## Synchronize time zones on the sensor

You can configure the sensor time and region so that all the users see the same time and region.

:::image type="content" source="media/how-to-manage-individual-sensors/image294.png" alt-text="configure time and region":::  

| Parameter | Description |
|--|--|
| Timezone | The timezone definition for:<br />- Alerts<br />- Trends & Statistics widgets<br />- Data Mining reports<br />   -Risk Assessment reports<br />   - Attack Vectors |
| Date Format | Select one of the following format options:<br />- dd/MM/yyyy HH:mm:ss<br />- MM/dd/yyyy HH:mm:ss<br />- yyyy/MM/dd HH:mm:ss |
| Date & Time | Displays the current date and local time in the format you selected.<br />For example: If your actual location is America/New York, but the Timezone is set to Europe/Berlin, the time is displayed according to Berlin local time. |

**To configure Time & Regional:**

1. On the side menu, select **System Settings**.

2. In the **System Setting** window, select **Time & Regional**.

3. Set the parameters and select **Save**.

## Setting up backup and restore files

System backup is performed automatically at 3:00 AM daily. The data is saved on a different disk in the sensor, the default location is `/var/cyberx/backups`.

You can automatically transfer this file to the internal network.

> [!NOTE]
> - The Backup/Restore procedure can be performed between the same versions only.
> - In some architectures, the backup is disabled. You can enable it in `/var/cyberx/properties/backup.properties file`.

When a sensor is controlled by an on-premises management console, the Sensor Backup Schedule capability lets you collect these backups and store them up on the Management console, or an external backup server.

**What is backed up:** Configurations and data.

**What is Not backed up:** PCAP files and logs. Backup and restore of PCAPs and logs can be done manually.

**Backup File Naming**

Sensor backup files are automatically named using the following format:

`<sensor name>-backup-version-<version>-<date>.tar`

Example: `Sensor_1-backup-version-2.6.0.102-2019-06-24_09:24:55.tar.`

**To configure backup:**

  - Log in to an administrative account and type `$ sudo cyberx-xsense-system-backup`.

**To restore the latest backup file:**

  - Log in to an administrative account and type `$ sudo cyberx-xsense-system-restore`.

**To save the backup to external SMB Server:** 

1. Create a shared folder in the external SMB server.

    Get the folder path and user name and password required to access the SMB server.

2. In the sensor make a directory for the backups:

    - `sudo mkdir /<backup_folder_name_on_cyberx_server>`

    - `sudo chmod 777 /<backup_folder_name_on_cyberx_server>/`

3. Edit fstab: 

    - `sudo nano /etc/fstab`

    - `add - //<server_IP>/<folder_path> /<backup_folder_name_on_cyberx_server> cifsrw,credentials=/etc/samba/user,vers=X.X,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0`

4. Edit/create credentials to share, these are the credentials for the SMB server:

    - `sudo nano /etc/samba/user` 

5. Add:

    - username=&gt:user name&lt:

    - password=`<password>`

6. Mount the directory:

    - `sudo mount -a`

7. Configure backup directory to the shared folder on the cyberx sensor:  

    - `sudo nano /var/cyberx/properties/backup.properties`

    - `set backup_directory_path to <backup_folder_name_on_cyberx_server>`

### Restoring sensors

Backups can be restored from the sensor console and using CLI.

**To restore from the console:**

  - Select Restore Image from the sensor System setting window.

    :::image type="content" source="media/how-to-manage-individual-sensors/image312.png" alt-text="Restore Image":::

Restore failures will be displayed.

**To restore using CLI:**

  - Log in to an administrative account and type `$ sudo cyberx-management-system-restore`.

## Update a Standalone Sensor version

The following procedure describes how to update a standalone sensor using the sensor console. The update process takes approximately 30 minutes.

1.  Go to the ***[Azure portal](https://portal.azure.com/).***

2. Go to Azure Defender for IoT.

3. Go to the **Updates** page.

:::image type="content" source="media/how-to-manage-individual-sensors/image13.png" alt-text="Screenshot of Updates page of Azure Defender for IoT":::

4. Select **Download** from the Sensors section and save the file.

5. In the sensor console sidebar, select **System Settings**.

6. In the Version Upgrade pane, select **Upgrade.**

:::image type="content" source="media/how-to-manage-individual-sensors/image14.png" alt-text="Screenshot of Upgrade pane":::

7. Select the file you downloaded from the from the Azure Defender for IoT **Updates** page.

8. The update process starts, during which time the system is rebooted twice.

9. After the first reboot (before the completion of the update process), the system opens with the Log-in window and after the login, the following appears at the bottom left of the sidebar:

:::image type="content" source="media/how-to-manage-individual-sensors/image15.png" alt-text="Screenshot of the Upgrade version that appears after login":::