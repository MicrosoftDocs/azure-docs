---
title: Manage individual sensors
description: Learn how to manage individual sensors, including managing activation files, certificates, performing backups, and updating a standalone sensor. 
ms.date: 03/10/2022
ms.topic: how-to
---

# Manage individual sensors

This article describes how to manage individual sensors. Tasks include managing activation files, performing backups, and updating a standalone sensor.

You can also do certain sensor management tasks from the on-premises management console, where multiple sensors can be managed simultaneously.

You use the Azure portal for sensor onboarding and registration.

## Manage sensor activation files

Your sensor was onboarded with Microsoft Defender for IoT from the Azure portal. Each sensor was onboarded as either a locally connected sensor or a cloud-connected sensor.

A unique activation file is uploaded to each sensor that you deploy. For more information about when and how to use a new file, see [Upload new activation files](#upload-new-activation-files). If you can't upload the file, see [Troubleshoot activation file upload](#troubleshoot-activation-file-upload).

### About activation files for locally connected sensors

Locally connected sensors are associated with an Azure subscription. The activation file for your locally connected sensors contains an expiration date. One month before this date, a warning message appears in the System Messages window in the top-right corner of the console. The warning remains until after you've updated the activation file.

You can continue to work with Defender for IoT features even if the activation file has expired. 

### About activation files for cloud-connected sensors

Sensors that are cloud connected are not limited by time periods for their activation file. The activation file for cloud-connected sensors is used to ensure the connection to Defender for IoT.

### Upload new activation files

You might need to upload a new activation file for an onboarded sensor when:

- An activation file expires on a locally connected sensor. 

- You want to work in a different sensor management mode. 

- For sensors connected via an IoT Hub ([legacy](architecture-connections.md)), you want to assign a new Defender for IoT hub to a cloud-connected sensor.

**To add a new activation file:**

1. Go to the Azure portal for Defender for IoT.
1. Use the search bar to find the sensor you need.  

1. Select the three dots (...) on the row and select **Delete sensor**.

1. Onboard the sensor again by selecting **Getting Started**>  **Set up OT/ICS Security** > **Register this sensor with Microsoft Defender for IoT**.

1. Go to the **Sites and sensors** page.

1. Use the search bar to find the sensor you just added, and select it.
1. Select the three dots (...) on the row and select **Download activation file**.

6. Save the file.

7. Sign in to the Defender for IoT sensor console.

8. Select **System Settings** > **Sensor management** > **Subscription & Activation Mode**.

9. Select **Upload** and select the file that you saved.

10. Select **Activate**.

### Troubleshoot activation file upload

You'll receive an error message if the activation file could not be uploaded. The following events might have occurred:

- **For locally connected sensors**: The activation file is not valid. If the file is not valid, go to [Defender for IoT in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started). On the **Sensor Management** page, select the sensor with the invalid file, and download a new activation file.

- **For cloud-connected sensors**: The sensor can't connect to the internet. Check the sensor's network configuration. If your sensor needs to connect through a web proxy to access the internet, verify that your proxy server is configured correctly on the **Sensor Network Configuration** screen. Verify that \*.azure-devices.net:443 is allowed in the firewall and/or proxy. If wildcards are not supported or you want more control, the FQDN for your specific endpoint (either a sensor, or for legacy connections, an IoT hub) should be opened in your firewall and/or proxy. For more information, see [Reference - IoT Hub endpoints](../../iot-hub/iot-hub-devguide-endpoints.md).

- **For cloud-connected sensors**: The activation file is valid but Defender for IoT rejected it. If you can't resolve this problem, you can download another activation from the **Sites and Sensors** page in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started). If this doesn't work, contact Microsoft Support.

## Manage certificates

Following sensor installation, a local self-signed certificate is generated and used to access the sensor web application. When logging in to the sensor for the first time, Administrator users are prompted to provide an SSL/TLS certificate. 

Sensor Administrators may be required to update certificates that were uploaded after initial login. This may happen for example if a certificate expired.

**To update a certificate:**

1. Select **System Settings** and then select **Basic**.

1. Select **SSL/TLS Certificate.**

    :::image type="content" source="media/how-to-manage-individual-sensors/certificate-upload.png" alt-text="Upload a certificate":::

1. In the SSL/TLS Certificates dialog box, delete the existing certificate and add a new one.

    - Add a certificate name.
    - Upload a CRT file and key file.
    - Upload a PEM file if necessary.

If the upload fails, contact your security or IT administrator, or review the information in [About Certificates](how-to-deploy-certificates.md).

**To change the certificate validation setting:**

1. Enable or disable the **Enable Certificate Validation** toggle. If the option is enabled and validation fails, communication between relevant components is halted and a validation error is presented in the console. If disabled, certificate validation is not carried out. See [About certificate validation](how-to-deploy-certificates.md#about-certificate-validation) for more information.

1. Select **Save**.

For more information about first-time certificate upload see,
[First-time sign-in and activation checklist](how-to-activate-and-set-up-your-sensor.md#first-time-sign-in-and-activation-checklist)

## Connect a sensor to the management console

This section describes how to ensure connection between the sensor and the on-premises management console. You need to do this if you're working in an air-gapped network and want to send device and alert information to the management console from the sensor. This connection also allows the management console to push system settings to the sensor and perform other management tasks on the sensor.

**To connect:**

1. Sign in to the on-premises management console.

2. Select **System Settings**.

3. In the **Sensor Setup – Connection String** section, copy the automatically generated connection string.

   :::image type="content" source="media/how-to-manage-individual-sensors/connection-string-screen.png" alt-text="Copy the connection string from this screen."::: 

4. Sign in to the sensor console.

5. On the left pane, select **System Settings**.

6. Select **Management Console Connection**.

    :::image type="content" source="media/how-to-manage-individual-sensors/management-console-connection-screen.png" alt-text="Screenshot of the Management Console Connection dialog box.":::

7. Paste the connection string in the **Connection string** box and select **Connect**.

8. In the on-premises management console, in the **Site Management** window, assign the sensor to a zone.

## Change the name of a sensor

You can change the name of your sensor console. The new name will appear in:
- The sensor console web browser
- Various console windows
- Troubleshooting logs
- The Sites and sensors page in the Defender for IoT portal on Azure.

The process for changing sensor names is the same for locally managed sensors and cloud-connected sensors.

The sensor name is defined by the name assigned during the registration. The name is included in the activation file that you uploaded when signing in for the first time. To change the name of the sensor, you need to upload a new activation file.

**To change the name:**

1. In the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started), go to the Sites and sensors page.

1. Delete the sensor from the page.

1. Register with the new name by selecting **Set up OT/ICS Security** from the Getting Started page.

1. Download the new activation file.

1. Sign in to the Defender for IoT sensor console.

1. In the sensor console, select **System settings** > **Sensor management** and then select
**Subscription & Activation Mode**.

1. Select **Upload** and select the file you saved.

1. Select **Activate**.

## Update the sensor network configuration

The sensor network configuration was defined during the sensor installation. You can change configuration parameters. You can also set up a proxy configuration.

If you create a new IP address, you might be required to sign in again.

**To change the configuration:**

1. On the side menu, select **System Settings**.

2. In the **System Settings** window, select **Network**.

3. Set the parameters:

    | Parameter | Description |
    |--|--|
    | IP address | The sensor IP address |
    | Subnet mask | The mask address |
    | Default gateway | The default gateway address |
    | DNS | The DNS server address |
    | Hostname | The sensor hostname |
    | Proxy | Proxy host and port name |

4. Select **Save**.

## Synchronize time zones on the sensor

You can configure the sensor's time and region so that all the users see the same time and region.

| Parameter | Description |
|--|--|
| Timezone | The time zone definition for:<br />- Alerts<br />- Trends and statistics widgets<br />- Data mining reports<br />   -Risk assessment reports<br />- Attack vectors |
| Date format | Select one of the following format options:<br />- dd/MM/yyyy HH:mm:ss<br />- MM/dd/yyyy HH:mm:ss<br />- yyyy/MM/dd HH:mm:ss |
| Date and time | Displays the current date and local time in the format that you selected.<br />For example, if your actual location is America and New York, but the time zone is set to Europe and Berlin, the time is displayed according to Berlin local time. |

**To configure the sensor time:**

1. On the side menu, select **System settings** >  **Basic**, > **Time & Region**.

3. Set the parameters and select **Save**.

## Set up backup and restore files

System backup is performed automatically at 3:00 AM daily. The data is saved on a different disk in the sensor. The default location is `/var/cyberx/backups`.

You can automatically transfer this file to the internal network.

> [!NOTE]
> - The backup and restore procedure can be performed between the same versions only.
> - In some architectures, the backup is disabled. You can enable it in the `/var/cyberx/properties/backup.properties` file.

When you control a sensor by using the on-premises management console, you can use the sensor's backup schedule to collect these backups and store them on the management console or on an external backup server.

**What is backed up**: Configurations and data.

**What is not backed up**: PCAP files and logs. You can manually back up and restore PCAPs and logs.

Sensor backup files are automatically named through the following format: `<sensor name>-backup-version-<version>-<date>.tar`. An example is `Sensor_1-backup-version-2.6.0.102-2019-06-24_09:24:55.tar`.

**To configure backup:**

- Sign in to an administrative account and enter `$ sudo cyberx-xsense-system-backup`.

**To restore the latest backup file:**

- Sign in to an administrative account and enter `$ sudo cyberx-xsense-system-restore`.

**To save the backup to an external SMB server:**

1. Create a shared folder in the external SMB server.

    Get the folder path, username, and password required to access the SMB server.

2. In the sensor, make a directory for the backups:

    - `sudo mkdir /<backup_folder_name_on_cyberx_server>`

    - `sudo chmod 777 /<backup_folder_name_on_cyberx_server>/`

3. Edit `fstab`:

    - `sudo nano /etc/fstab`

    - `add - //<server_IP>/<folder_path> /<backup_folder_name_on_cyberx_server> cifsrw,credentials=/etc/samba/user,vers=X.X,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0`

4. Edit and create credentials to share for the SMB server:

    `sudo nano /etc/samba/user` 

5. Add:

    - `username=&gt:user name&lt:`

    - `password=<password>`

6. Mount the directory:

    `sudo mount -a`

7. Configure a backup directory to the shared folder on the Defender for IoT sensor:  

    - `sudo nano /var/cyberx/properties/backup.properties`

    - `set backup_directory_path to <backup_folder_name_on_cyberx_server>`

### Restore sensors

You can restore backups from the sensor console and by using the CLI.

**To restore from the console:**

- Select **Restore Image** from the sensor's **System Settings** window.

:::image type="content" source="media/how-to-manage-individual-sensors/restore-image-screen.png" alt-text="Restore your image by selecting the button.":::

The console will display restore failures.

**To restore by using the CLI:**

- Sign in to an administrative account and enter `$ sudo cyberx-management-system-restore`.

## Update a standalone sensor version

This procedure describes how to update a standalone sensor version. If you are upgrading from a version higher than 22.1.x, you can jump straight to [Update your sensor software version](#update-your-sensor-software-version). 

However, if you're upgrading from a version earlier than 22.1.x, make sure to [Download a new activation file for version 22.1.x or higher](#download-a-new-activation-file-for-version-221x-or-higher) before you upgrade, and then [reactivate your sensor](#reactivate-your-sensor-for-version-221x-or-higher) after upgrading.

Updates from legacy versions may require a series of upgrades. For example, if you still have a sensor version 3.1.1 installed, you'll need to first upgrade to version 10.5.5, and then to a 22.x version.

### Download a new activation file for version 22.1.x or higher

Version [22.1.x ](release-notes.md#update-to-version-221x) is a large upgrade with more complicated background processes. You should expect this upgrade to take more time than earlier upgrades have required.

1. Update your firewall rules between the sensor and the Azure portal. For more information, see [Sensor access to Azure portal](how-to-set-up-your-network.md#sensor-access-to-azure-portal).

1. In Defender for IoT, select **Sites and sensors** on the left.

1. Select the site where you want to update your sensor, and then navigate to the sensor you want to update.

1. Expand the row for your sensor, select the options **...** menu on the right of the row, and then select **Prepare to update to 22.x**.

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/prepare-to-update.png" alt-text="Screenshot of the Prepare to update option." lightbox="media/how-to-manage-sensors-on-the-cloud/prepare-to-update.png":::

1. In the **Prepare to update sensor to version 22.X** message, select **Let's go**.

1. When the new activation file is ready, download it and verify that the sensor status has switched to **Pending activation**.

### Update your sensor software version

1. In the Azure portal, go to **Defender for IoT** > **Getting started** > **Updates**.

1. From the **Sensors** section, select **Download** for the sensor update, and save your `<legacy/upstream>-sensor-secured-patcher-<version number>.tar` file locally. For example:

   :::image type="content" source="media/how-to-manage-individual-sensors/updates-page.png" alt-text="Screenshot of the Updates page of Defender for IoT.":::

1. On your sensor console, select **System Settings** > **Sensor management** > **Software Update**.

1. On the **Software Update** pane on the right, select **Upload file**, and then navigate to and select your downloaded `legacy-sensor-secured-patcher-<Version number>.tar` file.

    :::image type="content" source="media/how-to-manage-individual-sensors/upgrade-pane-v2.png" alt-text="Screenshot of the update pane.":::

    The update process starts, and may take about 30 minutes. During your upgrade, the system is rebooted twice.

    Sign in when prompted, and then return to the **System Settings** > **Sensor management** > **Software Update** pane to confirm that the new version is listed.

    :::image type="content" source="media/how-to-manage-individual-sensors/defender-for-iot-version.png" alt-text="Screenshot of the upgrade version that appears after you sign in.":::

### Reactivate your sensor for version 22.1.x or higher

If you're upgrading from a legacy version to version 22.1.x or higher, make sure to reactivate your sensor using the activation file you downloaded earlier.

1. On your sensor, select **System settings > Sensor management > Subscription & Mode Activation**.

1. In the **Subscription & Mode Activation** pane that appears on the right, select **Select file**, and then browse to and select your new activation file.

1. In Defender for IoT on the Azure portal, monitor your sensor's activation status. When the sensor is fully activated:

    - The sensor's **Overview** page shows an activation status of **Valid**.
    - In the Azure portal, on the **Sites and sensors** page, the sensor is listed as **OT cloud connected** and with the updated sensor version.

Your legacy sensors will continue to appear in the **Sites and sensors** page until you delete them. For more information, see [Manage on-boarded sensors](how-to-manage-sensors-on-the-cloud.md#manage-on-boarded-sensors).

> [!NOTE]
> After upgrading to version 22.1.x, the new upgrade log can be found at the following path, accessed via SSH and the *cyberx_host* user: `/opt/sensor/logs/legacy-upgrade.log`.
>
## Forward sensor failure alerts

You can forward alerts to third parties to provide details about:

- Disconnected sensors

- Remote backup failures

This information is sent when you create a forwarding rule for system notifications.

> [!NOTE]
> Administrators can send system notifications.

To send notifications:

1. Sign in to the on-premises management console.
1. Select **Forwarding** from the side menu.
1. Create a forwarding rule.
1. Select **Report System Notifications**.

For more information about forwarding rules, see [Forward alert information](how-to-forward-alert-information-to-partners.md).

## Adjust system properties

System properties control various operations and settings in the sensor. Editing or modifying them might damage the operation of the sensor console.

Consult with [Microsoft Support](https://support.microsoft.com/) before you change your settings.

To access system properties:

1. Sign in to the on-premises management console or the sensor.

2. Select **System Settings**.

3. Select **System Properties** from the **General** section.

## Next steps

For more information, see:

- [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md)

- [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
