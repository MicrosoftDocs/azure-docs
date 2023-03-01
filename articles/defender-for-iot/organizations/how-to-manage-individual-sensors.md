---
title: Manage OT sensors from the sensor console - Microsoft Defender for IoT
description: Learn how to manage individual Microsoft Defender for IoT OT network sensors directly from the sensor's console.
ms.date: 11/28/2022
ms.topic: how-to
---

# Manage individual sensors

This article describes how to manage individual sensors, such as managing activation files, certificates, backups, and more.

You can also perform some management tasks for multiple sensors simultaneously from the Azure portal or an on-premises management console. For more information, see [Next steps](#next-steps).

[!INCLUDE [caution do not use manual configurations](includes/caution-manual-configurations.md)]

## View overall sensor status

When you sign into your sensor, the first page shown is the **Overview** page.

For example:

:::image type="content" source="media/how-to-manage-individual-sensors/screenshot-of-overview-page.png" alt-text="Screenshot of the overview page." lightbox="media/how-to-manage-individual-sensors/screenshot-of-overview-page.png":::

The **Overview** page shows the following widgets:

| Name | Description |
|--|--|
| **General Settings** | Displays a list of the sensor's basic configuration settings and [connectivity status](#validate-connectivity-status). |
| **Traffic Monitoring** | Displays a graph detailing traffic in the sensor. The graph shows traffic as units of Mbps per hour on the day of viewing. |
| **Top 5 OT Protocols** | Displays a bar graph that details the top five most used OT protocols. The bar graph also provides the number of devices that are using each of those protocols. |
| **Traffic By Port** | Displays a pie chart showing the types of ports in your network, with the amount of traffic detected in each type of port. |
| **Top open alerts** | Displays a table listing any currently open alerts with high severity levels, including critical details about each alert. |

Select the link in each widget to drill down for more information in your sensor.

### Validate connectivity status

Verify that your sensor is successfully connected to the Azure portal directly from the sensor's **Overview** page.

If there are any connection issues, a disconnection message is shown in the **General Settings** area on the **Overview** page, and a **Service connection error** warning appears at the top of the page in the :::image type="icon" source="media/how-to-manage-individual-sensors/bell-icon.png" border="false"::: **System Messages** area. For example:

:::image type="content" source="media/how-to-manage-individual-sensors/connectivity-status.png" alt-text="Screenshot of a sensor page showing the connectivity status as disconnected." lightbox="media/how-to-manage-individual-sensors/connectivity-status.png":::

1. Find more information about the issue by hovering over the :::image type="icon" source="media/how-to-manage-individual-sensors/information-icon.png" border="false"::: information icon. For example:

    :::image type="content" source="media/how-to-manage-individual-sensors/connectivity-message.png" alt-text="Screenshot of a connectivity error message." lightbox="media/how-to-manage-individual-sensors/connectivity-message.png":::

1. Take action by selecting the **Learn more** option under :::image type="icon" source="media/how-to-manage-individual-sensors/bell-icon.png" border="false"::: **System Messages**. For example:

    :::image type="content" source="media/how-to-manage-individual-sensors/system-messages.png" alt-text="Screenshot of the system messages pane." lightbox="media/how-to-manage-individual-sensors/system-messages.png":::

## Download software for OT sensors

You may need to download software for your OT sensor if you're [installing Defender for IoT software](ot-deploy/install-software-ot-sensor.md) on your own appliances, or [updating software versions](update-ot-software.md).

In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal, use one of the following options:

- For a new installation, select **Getting started** > **Sensor**. Select a version in the **Purchase an appliance and install software** area, and then select **Download**.

- If you're updating your OT sensor, use the options in the **Sites and sensors** page > **Sensor update (Preview)** menu.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

## Manage sensor activation files

Your sensor was onboarded with Microsoft Defender for IoT from the Azure portal. Each sensor was onboarded as either a locally connected sensor or a cloud-connected sensor.

A unique activation file is uploaded to each sensor that you deploy. For more information about when and how to use a new file, see [Upload new activation files](#upload-new-activation-files). If you can't upload the file, see [Troubleshoot activation file upload](#troubleshoot-activation-file-upload).

### About activation files for locally connected sensors

Locally connected sensors are associated with an Azure subscription. The activation file for your locally connected sensors contains an expiration date. One month before this date, a warning message appears in the System Messages window in the top-right corner of the console. The warning remains until after you've updated the activation file.

You can continue to work with Defender for IoT features even if the activation file has expired.
You can continue to work with Defender for IoT features even if the activation file has expired.

### About activation files for cloud-connected sensors

Sensors that are cloud connected aren't limited by time periods for their activation file. The activation file for cloud-connected sensors is used to ensure the connection to Defender for IoT.

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

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. Save the file.

1. Sign in to the Defender for IoT sensor console.

1. Select **System Settings** > **Sensor management** > **Subscription & Activation Mode**.

1. Select **Upload** and select the file that you saved.

1. Select **Activate**.

### Troubleshoot activation file upload

You'll receive an error message if the activation file couldn't be uploaded. The following events might have occurred:

- **For locally connected sensors**: The activation file isn't valid. If the file isn't valid, go to [Defender for IoT in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started). On the **Sensor Management** page, select the sensor with the invalid file, and download a new activation file.

- **For cloud-connected sensors**: The sensor can't connect to the internet. Check the sensor's network configuration. If your sensor needs to connect through a web proxy to access the internet, verify that your proxy server is configured correctly on the **Sensor Network Configuration** screen. Verify that the required endpoints are allowed in the firewall and/or proxy.

    For OT sensors version 22.x, download the list of required endpoints from the  **Sites and sensors** page on the Azure portal. Select an OT sensor with a supported software version, or a site with one or more supported sensors. And then select **More actions** > **Download endpoint details**. For sensors with earlier versions, see [Sensor access to Azure portal](how-to-set-up-your-network.md#sensor-access-to-azure-portal).

- **For cloud-connected sensors**: The activation file is valid but Defender for IoT rejected it. If you can't resolve this problem, you can download another activation from the **Sites and Sensors** page in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started). If this doesn't work, contact Microsoft Support.

## Manage certificates

Following sensor installation, a local self-signed certificate is generated and used to access the sensor web application. When logging in to the sensor for the first time, Administrator users are prompted to provide an SSL/TLS certificate.

Sensor Administrators may be required to update certificates that were uploaded after initial login. This may happen, for example,  if a certificate expired.

**To update a certificate:**

1. Select **System Settings** and then select **Basic**.

1. Select **SSL/TLS Certificate.**

    :::image type="content" source="media/how-to-manage-individual-sensors/certificate-upload.png" alt-text="Upload a certificate":::

1. In the SSL/TLS Certificates dialog box, delete the existing certificate and add a new one.

    - Add a certificate name.
    - Upload a CRT file and key file.
    - Upload a PEM file if necessary.

If the upload fails, contact your security or IT administrator, or review the information in [Deploy SSL/TLS certificates on OT appliances](how-to-deploy-certificates.md).

**To change the certificate validation setting:**

1. Enable or disable the **Enable Certificate Validation** toggle. If the option is enabled and validation fails, communication between relevant components is halted, and a validation error is presented in the console. If disabled, certificate validation is not carried out. See [Verify CRL server access](how-to-deploy-certificates.md#verify-crl-server-access) for more information.

1. Select **Save**.

For more information about first-time certificate upload, see,
[First-time sign-in and activation checklist](how-to-activate-and-set-up-your-sensor.md#first-time-sign-in-and-activation-checklist)

## Connect a sensor to the management console

This section describes how to ensure connection between the sensor and the on-premises management console. You need to do this if you're working in an air-gapped network and want to send device and alert information to the management console from the sensor. This connection also allows the management console to push system settings to the sensor and perform other management tasks on the sensor.

**To connect:**

1. Sign in to the on-premises management console.

1. Select **System Settings**.

1. In the **Sensor Setup – Connection String** section, copy the automatically generated connection string.

   :::image type="content" source="media/how-to-manage-individual-sensors/connection-string-screen.png" alt-text="Screenshot of the Connection string screen.":::

1. Sign in to the sensor console.

1. On the left pane, select **System Settings**.

1. Select **Management Console Connection**.

    :::image type="content" source="media/how-to-manage-individual-sensors/management-console-connection-screen.png" alt-text="Screenshot of the Management Console Connection dialog box.":::

1. Paste the connection string in the **Connection string** box and select **Connect**.

1. In the on-premises management console, in the **Site Management** window, assign the sensor to a site and zone.

Continue with additional settings, such as [adding users](how-to-create-and-manage-users.md), [setting up an SMTP server](how-to-manage-individual-sensors.md#configure-smtp-settings), [forwarding alert rules](how-to-forward-alert-information-to-partners.md), and more. For more information, see [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md).

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

1. In the **System Settings** window, select **Network**.

1. Set the parameters:

    | Parameter | Description |
    |--|--|
    | IP address | The sensor IP address |
    | Subnet mask | The mask address |
    | Default gateway | The default gateway address |
    | DNS | The DNS server address |
    | Hostname | The sensor hostname |
    | Proxy | Proxy host and port name |

1. Select **Save**.

## Synchronize time zones on the sensor

You can configure the sensor's time and region so that all the users see the same time and region.

| Parameter | Description |
|--|--|
| Timezone | The time zone definition for:<br />- Alerts<br />- Trends and statistics widgets<br />- Data mining reports<br />   -Risk assessment reports<br />- Attack vectors |
| Date format | Select one of the following format options:<br />- dd/MM/yyyy HH:mm:ss<br />- MM/dd/yyyy HH:mm:ss<br />- yyyy/MM/dd HH:mm:ss |
| Date and time | Displays the current date and local time in the format that you selected.<br />For example, if your actual location is America and New York, but the time zone is set to Europe and Berlin, the time is displayed according to Berlin local time. |

**To configure the sensor time:**

1. On the side menu, select **System settings** >  **Basic**, > **Time & Region**.

1. Set the parameters and select **Save**.

## Set up backup and restore files

System backup is performed automatically at 3:00 AM daily. The data is saved on a different disk in the sensor. The default location is `/var/cyberx/backups`. You can automatically transfer this file to the internal network.

For more information, see [On-premises backup file capacity](references-data-retention.md#on-premises-backup-file-capacity).

> [!NOTE]
>
> - The backup and restore procedure can be performed between the same versions only.
> - In some architectures, the backup is disabled. You can enable it in the `/var/cyberx/properties/backup.properties` file.

When you control a sensor by using the on-premises management console, you can use the sensor's backup schedule to collect these backups and store them on the management console or on an external backup server. For more information, see [Define sensor backup schedules](how-to-manage-sensors-from-the-on-premises-management-console.md#define-sensor-backup-schedules).

**What is backed up**: Configurations and data.

**What is not backed up**: PCAP files and logs. You can manually back up and restore PCAPs and logs. For more information, see [Upload and play PCAP files](#upload-and-play-pcap-files).

Sensor backup files are automatically named through the following format: `<sensor name>-backup-version-<version>-<date>.tar`. An example is `Sensor_1-backup-version-2.6.0.102-2019-06-24_09:24:55.tar`.

**To configure backup:**

- Sign in to an administrative account and enter `cyberx-xsense-system-backup`.

**To restore the latest backup file:**

- Sign in to an administrative account and enter `cyberx-xsense-system-restore`.

**To save the backup to an external SMB server:**

1. Create a shared folder in the external SMB server.

    Get the folder path, username, and password required to access the SMB server.

1. In the sensor, make a directory for the backups:

    - `sudo mkdir /<backup_folder_name_on_cyberx_server>`

    - `sudo chmod 777 /<backup_folder_name_on_cyberx_server>/`

1. Edit `fstab`:

    - `sudo nano /etc/fstab`

    - `add - //<server_IP>/<folder_path> /<backup_folder_name_on_cyberx_server> cifsrw,credentials=/etc/samba/user,vers=X.X,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0`

1. Edit and create credentials to share for the SMB server:

    `sudo nano /etc/samba/user`

1. Add:

    - `username=&gt:user name&lt:`

    - `password=<password>`

1. Mount the directory:

    `sudo mount -a`

1. Configure a backup directory to the shared folder on the Defender for IoT sensor:  

    - `sudo nano /var/cyberx/properties/backup.properties`

    - `set backup_directory_path to <backup_folder_name_on_cyberx_server>`

### Restore sensors

You can restore a sensor from a backup file using the sensor console or the CLI.

For more information, see [CLI command reference from OT network sensors](cli-ot-sensor.md).

# [Restore from the sensor console](#tab/restore-from-sensor-console)

To restore a backup from the sensor console, the backup file must be accessible from the sensor.

- **To download a backup file:**

    1. Access the sensor using an SFTP client.

    1. Sign in to an administrative account and enter the sensor IP address.

    1. Download the backup file from your chosen location and save it. The default location for system backup files is `/var/cyberx/backups`.

- **To restore the sensor**:

     1. Sign in to the sensor console and go to **System settings** > **Sensor management** > **Backup & restore** > **Restore**. For example:

        :::image type="content" source="media/how-to-manage-individual-sensors/restore-sensor-screen.png" alt-text="Screenshot of Restore tab in sensor console.":::

     1. Select **Browse** to select your downloaded backup file. The sensor will start to restore from the selected backup file.

     1. When the restore process is complete, select **Close**.

# [Restore the latest backup file by using the CLI](#tab/restore-using-cli)

- Sign in to an administrative account and enter `cyberx-xsense-system-restore`.

---

## Reduce DNS alerts

*Learn* unauthorized internet alerts in bulk by FQDN - fully qualified domain names - to reduce the noise of triggered internet alerts in the OT network.

By defining an FQDN allowlist, the system checks each instance of unauthorized internet connectivity attempt against it. If the FQDN is included in the allowlist, then the network will *learn* this alert automatically without triggering it. 

The FQDN list will remain intact through version upgrades.

**To define an FQDN allowlist:**

- Sign in to your OT network sensor console as the **support** [user](references-work-with-defender-for-iot-cli-commands.md), then select **Support**.

- In the search bar, search for "DNS", then look for "Internet Domain Allowlist" under **Description**.

    :::image type="content" source="media/how-to-manage-individual-sensors/dns-edit-configuration.png" alt-text="Screenshot of how to edit configurations for DNS in the sensor console." lightbox="media/how-to-manage-individual-sensors/dns-edit-configuration.png":::

- Select the :::image type="icon" source="media/how-to-generate-reports/manage-icon.png" border="false"::: icon under **Edit**.

- In the **Edit configuration** pane, enter a domain name that you don't want the sensor to trigger alerts for, then select **Submit**.

You can view to the FQDN allowlist in the advanced configurations and in a [data mining report](how-to-create-data-mining-queries.md). A custom Data mining report will present the FQDN, IP addresses, and last resolution time.

**To view in a data mining report:**

[Create a custom data mining report](how-to-create-data-mining-queries.md#create-an-ot-sensor-custom-data-mining-report) and make sure to select **Internet Domain Allowlist** under **DNS** when choosing a category in the **Create new report** pane.

:::image type="content" source="media/how-to-manage-individual-sensors/data-mining-allowlist.png" alt-text="Screenshot of how to create a custom data mining report to show fqdn allowlist in the sensor console." lightbox="media/how-to-manage-individual-sensors/data-mining-allowlist.png":::

## Configure SMTP settings

Define SMTP mail server settings for the sensor so that you configure the sensor to send data to other servers.

You'll need an SMTP mail server configured to enable email alerts about disconnected sensors, failed sensor backup retrievals, and SPAN monitoring port failures from the on-premises management console, and to set up mail forwarding and configure [forwarding alert rules](how-to-forward-alert-information-to-partners.md).

**Prerequisites**:

Make sure you can reach the SMTP server from the [sensor's management port](./best-practices/understand-network-architecture.md).

**To configure an SMTP server on your sensor**:

1. Sign in to the sensor as an **Admin** user and select **System settings** > **Integrations** > **Mail server**.

1. In the **Edit Mail Server Configuration** pane that appears, define the values for your SMTP server as follows:

    |Parameter  |Description  |
    |---------|---------|
    |**SMTP Server Address**     | Enter the IP address or domain address of your SMTP server.        |
    |**SMTP Server Port**     | Default = 25. Adjust the value as needed.        |
    |**Outgoing Mail Account**     | Enter an email address to use as the outgoing mail account from your sensor.        |
    |**SSL**     | Toggle on for secure connections from your sensor.        |
    |**Authentication**     | Toggle on and then enter a username and password for your email account.        |
    |**Use NTLM**     | Toggle on to enable [NTLM](/windows-server/security/kerberos/ntlm-overview). This option only appears when you have the **Authentication** option toggled on.        |

1. Select **Save** when you're done.

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

## Upload and play PCAP files

When troubleshooting, you may want to examine data recorded by a specific PCAP file. To do so, you can upload a PCAP file to your sensor console and replay the data recorded.

The **Play PCAP** option is enabled by default in the sensor console's settings.

Maximum size for uploaded files is 2 GB.

**To upload and play a PCAP file**:

1. On your sensor console, select **System settings > Basic > Play PCAP**.

1. In the **PCAP PLAYER** pane, select **Upload** and then navigate to and select the file or multiple files you want to upload.

1. Select **Play** to play your PCAP file, or **Play All** to play all PCAP files currently loaded.

:::image type="content" source="media/how-to-manage-individual-sensors/upload-and-play-pcaps.png" alt-text="Screenshot of uploading PCAP files on the PCAP PLAYER pane in the sensor console." lightbox="media/how-to-manage-individual-sensors/upload-and-play-pcaps.png":::

> [!TIP]
> Select **Clear All** to clear the sensor of all PCAP files loaded.

## Adjust system properties

System properties control various operations and settings in the sensor. Editing or modifying them might damage the operation of the sensor console.

Consult with [Microsoft Support](https://support.microsoft.com/) before you change your settings.

To access system properties:

1. Sign in to the on-premises management console or the sensor.

1. Select **System Settings**.

1. Select **System Properties** from the **General** section.

## Download a diagnostics log for support

This procedure describes how to download a diagnostics log to send to support in connection with a specific support ticket.

This feature is supported for the following sensor versions:

- **22.1.1** - Download a diagnostic log from the sensor console
- **22.1.3** - For locally managed sensors, [upload a diagnostics log](how-to-manage-sensors-on-the-cloud.md#upload-a-diagnostics-log-for-support) from the **Sites and sensors** page in the Azure portal. This file is automatically sent to support when you open a ticket on a cloud-connected sensor.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

**To download a diagnostics log**:

1. On the sensor console, select **System settings** > **Backup & Restore** > **Backup**.

1. Under **Logs**, select **Support Ticket Diagnostics**, and then select **Export**.

    :::image type="content" source="media/release-notes/support-ticket-diagnostics.png" alt-text="Screenshot of the Backup & Restore pane showing the Support Ticket Diagnostics option." lightbox="media/release-notes/support-ticket-diagnostics.png":::

1. For a locally managed sensor, version 22.1.3 or higher, continue with [Upload a diagnostics log for support](how-to-manage-sensors-on-the-cloud.md#upload-a-diagnostics-log-for-support).

## Retrieve forensics data stored on the sensor

Use Defender for IoT data mining reports on an OT network sensor to retrieve forensic data from that sensor’s storage. The following types of forensic data are stored locally on OT sensors, for devices detected by that sensor:

- Device data
- Alert data
- Alert PCAP files
- Event timeline data
- Log files

Each type of data has a different retention period and maximum capacity. For more information, see [Create data mining queries](how-to-create-data-mining-queries.md) and [Data retention across Microsoft Defender for IoT](references-data-retention.md).

## Clearing sensor data

In cases where the sensor needs to be relocated or erased, the sensor can be reset.

Clearing data deletes all detected or learned data on the sensor. After clearing data on a cloud connected sensor, cloud inventory will be updated accordingly. Additionally, some actions on the corresponding cloud alerts such as downloading PCAPs or learning alerts will not be supported.

> [!NOTE]
> Network settings such as IP/DNS/GATEWAY will not be changed by clearing system data.

**To clear system data**:

1. Sign in to the sensor as the *cyberx* user.

1. Select **Support** > **Clear data**.

1. In the confirmation dialog box, select **Yes** to confirm that you do want to clear all data from the sensor and reset it. For example:

    :::image type="content" source="media/how-to-manage-individual-sensors/clear-system-data.png" alt-text="Screenshot of clearing system data on the support page in the sensor console." lightbox="media/how-to-manage-individual-sensors/clear-system-data.png":::

A confirmation message appears that the action was successful. All learned data, allowlists, policies, and configuration settings are cleared from the sensor.

## Next steps

For more information, see:

- [Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md)
- [Connect your OT sensors to the cloud](connect-sensors.md)
- [Track sensor activity](how-to-track-sensor-activity.md)
- [Update OT system software](update-ot-software.md)
- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md)
- [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
- [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
