---
title: Maintain Defender for IoT OT network sensors from the GUI - Microsoft Defender for IoT
description: Learn how to perform maintenance activities on individual OT network sensors using the OT sensor console.
ms.date: 03/09/2023
ms.topic: how-to
---

# Maintain OT network sensors from the sensor console

This article describes extra OT sensor maintenance activities that you might perform outside of a larger deployment process.

OT sensors can also be maintained from the OT sensor [CLI](cli-ot-sensor.md), the [Azure portal](how-to-manage-sensors-on-the-cloud.md), and an [on-premises management console](how-to-manage-sensors-from-the-on-premises-management-console.md).

[!INCLUDE [caution do not use manual configurations](includes/caution-manual-configurations.md)]

## Prerequisites

Before performing the procedures in this article, make sure that you have:

- An OT network sensor [installed](ot-deploy/install-software-ot-sensor.md), [activated](ot-deploy/activate-deploy-sensor.md), and [onboarded](onboard-sensors.md) to Defender for IoT in the Azure portal.

- Access to the OT sensor as an **Admin** user. Selected procedures and CLI access also requires a privileged user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- To download software for OT sensors, you'll need access to the Azure portal as a [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) user.

- An [SSL/TLS certificate prepared](ot-deploy/create-ssl-certificates.md) if you need to update your sensor's certificate.

## View overall OT sensor status

When you sign into your OT sensor, the first page shown is the **Overview** page.

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

Verify that your OT sensor is successfully connected to the Azure portal directly from the OT sensor's **Overview** page.

If there are any connection issues, a disconnection message is shown in the **General Settings** area on the **Overview** page, and a **Service connection error** warning appears at the top of the page in the :::image type="icon" source="media/how-to-manage-individual-sensors/bell-icon.png" border="false"::: **System Messages** area. For example:

:::image type="content" source="media/how-to-manage-individual-sensors/connectivity-status.png" alt-text="Screenshot of a sensor page showing the connectivity status as disconnected." lightbox="media/how-to-manage-individual-sensors/connectivity-status.png":::

Find more information about the issue by hovering over the :::image type="icon" source="media/how-to-manage-individual-sensors/information-icon.png" border="false"::: information icon. For example:

:::image type="content" source="media/how-to-manage-individual-sensors/connectivity-message.png" alt-text="Screenshot of a connectivity error message." lightbox="media/how-to-manage-individual-sensors/connectivity-message.png":::

Take action by selecting the **Learn more** option under :::image type="icon" source="media/how-to-manage-individual-sensors/bell-icon.png" border="false"::: **System Messages**. For example:

:::image type="content" source="media/how-to-manage-individual-sensors/system-messages.png" alt-text="Screenshot of the system messages pane." lightbox="media/how-to-manage-individual-sensors/system-messages.png":::

## Download software for OT sensors

You may need to download software for your OT sensor if you're [installing Defender for IoT software](ot-deploy/install-software-ot-sensor.md) on your own appliances, or [updating software versions](update-ot-software.md).

In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal, use one of the following options:

- For a new installation, select **Getting started** > **Sensor**. Select a version in the **Purchase an appliance and install software** area, and then select **Download**.

- If you're updating your OT sensor, use the options in the **Sites and sensors** page > **Sensor update (Preview)** menu.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

## Upload a new activation file

Each OT sensor is onboarded as a cloud-connected or locally managed OT sensor and activated using a unique activation file. For cloud-connected sensors, the activation file is used to ensure the connection between the sensor and Azure.

You'll need to upload a new activation file to your sensor if you want to switch sensor management modes, such as moving from a locally managed sensor to a cloud-connected sensor, or if you're [updating from a legacy software version](update-legacy-ot-software.md#update-legacy-ot-sensor-software). Uploading a new activation file to your sensor includes deleting your sensor from the Azure portal and onboarding it again.

**To add a new activation file:**

1. In [Defender for IoT on the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) > **Sites and sensors**, locate and [delete](how-to-manage-sensors-on-the-cloud.md#sensor-maintenance-and-troubleshooting) your OT sensor.

1. Select **Onboard OT sensor > OT** to onboard the sensor again from scratch. For more information, see [Onboard OT sensors](onboard-sensors.md).

1. On the **Sites and sensors** page, locate the sensor you just added.

1. Select the three dots (...) on the sensor's row and select **Download activation file**. Save the file in a location accessible to your sensor.

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. Sign in to the Defender for IoT sensor console and select **System Settings** > **Sensor management** > **Subscription & Activation Mode**.

1. Select **Upload** and browse to the file that you downloaded from the Azure portal.

1. Select **Activate** to upload your new activation file.

### Troubleshoot activation file upload

You'll receive an error message if the activation file couldn't be uploaded. The following events might have occurred:

- **The sensor can't connect to the internet:** Check the sensor's network configuration. If your sensor needs to connect through a web proxy to access the internet, verify that your proxy server is configured correctly on the **Sensor Network Configuration** screen. Verify that the required endpoints are allowed in the firewall and/or proxy.

    For OT sensors version 22.x, download the list of required endpoints from the  **Sites and sensors** page on the Azure portal. Select an OT sensor with a supported software version, or a site with one or more supported sensors. And then select **More actions** > **Download endpoint details**. For sensors with earlier versions, see [Sensor access to Azure portal](networking-requirements.md#sensor-access-to-azure-portal).

- **The activation file is valid but Defender for IoT rejected it:** If you can't resolve this problem, you can download another activation from the **Sites and sensors** page in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started). If this doesn't work, contact Microsoft Support.

## Manage SSL/TLS certificates

If you're working with a production environment, you'd [deployed a CA-signed SSL/TLS certificate](ot-deploy/activate-deploy-sensor.md#deploy-an-ssltls-certificate) as part of your OT sensor deployment. We recommend using self-signed certificates only for testing purposes.

The following procedures describe how to deploy updated SSL/TLS certificates, such as if the certificate has expired.

> [!TIP]
> You can also [import the certificate to your OT sensor using CLI commands](references-work-with-defender-for-iot-cli-commands.md#tlsssl-certificate-commands).
>

# [Deploy a CA-signed certificate](#tab/ca-signed)

**To deploy a CA-signed SSL/TLS certificate:**

1. Sign into your OT sensor and select **System Settings** > **Basic** > **SSL/TLS Certificate**.

1. In the **SSL/TLS Certificates** pane, select the **Import trusted CA certificate (recommended)** option. For example:

    :::image type="content" source="media/how-to-deploy-certificates/recommended-ssl.png" alt-text="Screenshot of importing a trusted CA certificate." lightbox="media/how-to-deploy-certificates/recommended-ssl.png":::

1. Enter the following parameters:

    | Parameter  | Description  |
    |---------|---------|
    | **Certificate Name**     |   Enter your certificate name.      |
    | **Passphrase** - *Optional*    |  Enter a passphrase.       |
    | **Private Key (KEY file)**     |  Upload a Private Key (KEY file).       |
    | **Certificate (CRT file)**     | Upload a Certificate (CRT file).        |
    | **Certificate Chain (PEM file)** - *Optional*     |  Upload a Certificate Chain (PEM file).       |

    Select **Use CRL (Certificate Revocation List) to check certificate status** to validate the certificate against a [CRL server](ot-deploy/create-ssl-certificates.md#verify-crl-server-access). The certificate is checked once during the import process.

    If an upload fails, contact your security or IT administrator. For more information, see [SSL/TLS certificate requirements for on-premises resources](best-practices/certificate-requirements.md) and [Create SSL/TLS certificates for OT appliances](ot-deploy/create-ssl-certificates.md).

1. In the **Validation for on-premises management console certificates** area, select **Required** if SSL/TLS certificate validation is required. Otherwise, select **None**.

    If you've selected **Required** and validation fails, communication between relevant components is halted, and a validation error is shown on the sensor. For more information, see [CRT file requirements](best-practices/certificate-requirements.md#crt-file-requirements).

1. Select **Save** to save your certificate settings.

# [Create and deploy a self-signed certificate](#tab/windows)

Each OT sensor is installed with a self-signed certificate that we recommend you use only for testing purposes. In production environments, we recommend that you always use a CA-signed certificate.

Self-signed certificates lead to a less secure environment, as the owner of the certificate can't be validated and the security of your system can't be maintained.

To create a self-signed certificate, download the certificate file from your OT sensor and then use a certificate management platform to create the certificate files you'll need to upload back to the OT sensor.

**To create a self-signed certificate**:

1. Go to the OT sensor's IP address in a browser.

[!INCLUDE [self-signed-certificate](includes/self-signed-certificate.md)]

When you're done, use the following procedures to validate your certificate files:

- [Verify CRL server access](ot-deploy/create-ssl-certificates.md#verify-crl-server-access)
- [Import the SSL/TLS certificate to a trusted store](ot-deploy/create-ssl-certificates.md#import-the-ssltls-certificate-to-a-trusted-store)
- [Test your SSL/TLS certificates](ot-deploy/create-ssl-certificates.md#test-your-ssltls-certificates)

**To deploy a self-signed certificate**:

1. Sign into your OT sensor and select **System Settings** > **Basic** > **SSL/TLS Certificate**.

1. In the **SSL/TLS Certificates** pane, keep the default **Use Locally generated self-signed certificate (Not recommended)** option selected.

1. Select the **Confirm** option to confirm the warning.

1. In the **Validation for on-premises management console certificates** area, select **Required** if SSL/TLS certificate validation is required. Otherwise, select **None**.

    If this option is toggled on and validation fails, communication between relevant components is halted, and a validation error is shown on the sensor. For more information, see [CRT file requirements](best-practices/certificate-requirements.md#crt-file-requirements).

1. Select **Save** to save your certificate settings.

---

### Troubleshoot certificate upload errors

[!INCLUDE [troubleshoot-ssl](includes/troubleshoot-ssl.md)]

## Update the OT sensor network configuration

You'd configured your OT sensor network configuring during [installation](ot-deploy/install-software-ot-sensor.md). You may need to make changes as part of OT sensor maintenance, such as to modify network values or setting up a proxy configuration.

**To update the OT sensor configuration:**

1. Sign into the OT sensor and select **System Settings** > **Basic** > **Sensor network settings**.

1. In the **Sensor network settings** pane, update the following details for your OT sensor as needed:

    - **IP address**. Changing the IP address may require users to sign into your OT sensor again.
    - **Subnet mask**
    - **Default gateway**
    - **DNS**. Make sure to use the same hostname that's configured in your organization's DNS server.
    - **Hostname** (optional)

1. Toggle the **Enable Proxy** option on or off if needed. If you're using a proxy, enter following values:

    - **Proxy host**
    - **Proxy port**
    - **Proxy username** (optional)
    - **Proxy password** (optional)

1. Select **Save** to save your changes.

### Turn off learning mode manually

A Microsoft Defender for IoT OT network sensor starts monitoring your network automatically after your [first sign-in](ot-deploy/activate-deploy-sensor.md#sign-in-to-your-ot-sensor). Network devices start appearing in your [device inventory](device-inventory.md), and [alerts](alerts.md) are triggered for any security or operational incidents that occur in your network.

Initially, this activity happens in *learning* mode, which instructs your OT sensor to learn your network's usual activity, including the devices and protocols in your network, and the regular file transfers that occur between specific devices. Any regularly detected activity becomes your network's [baseline traffic](ot-deploy/create-learned-baseline.md).

This procedure describes how to turn off learning mode manually if you feel that the current alerts accurately reflect your network activity.

**To turn off learning mode**:

1. Sign into your OT network sensor and select **System settings > Network monitoring > Detection engines and network modeling**.

1. Toggle off one or both of the following options:

    - **Learning**. Toggle off this option about two-six weeks after you've deployed your sensor, when you feel that the OT sensor detections accurately reflect your network activity.

    - **Smart IT Learning**. Keep this option toggled on to keep the number of *nondeterministic* alerts and notifications low. 
  
    Nondeterministic behavior includes changes that are the result of normal IT activity, such as DNS and HTTP requests. Toggling off the **Smart IT Learning** option can trigger many false positive policy violation alerts.

1. In the confirmation message, select **OK**, and then select **Close** to save your changes.

## Synchronize time zones on an OT sensor

You may want to configure your OT sensor with a specific time zone so that all users see the same times regardless of the user's location.

Time zones are used in [alerts](how-to-view-alerts.md), [trends and statistics widgets](how-to-create-trends-and-statistics-reports.md), [data mining reports](how-to-create-data-mining-queries.md), [risk assessment reports](how-to-create-risk-assessment-reports.md), and [attack vector reports](how-to-create-attack-vector-reports.md).

**To configure an OT sensor's time zone**:

1. Sign into your OT sensor and select **System settings** > **Basic** > **Time & Region**.

1. In the **Time & Region** pane, enter the following details:

    - **Time Zone**: Select the time zone you want to use

    - **Date Format**: Select the time and date format you want to use. Supported formats include:

        - `dd/MM/yyyy HH:mm:ss`
        - `MM/dd/yyyy HH:mm:ss`
        - `yyyy/MM/dd HH:mm:ss`

    The **Date & Time** field is automatically updated with the current time in the format you'd selected.

1. Select **Save** to save your changes.

## Configure SMTP mail server settings

Define SMTP mail server settings on your OT sensor so that you configure the OT sensor to send data to other servers and partner services.

You'll need an SMTP mail server configured to enable email alerts about disconnected sensors, failed sensor backup retrievals, and SPAN monitoring port failures from the on-premises management console, and to set up mail forwarding and configure [forwarding alert rules](how-to-forward-alert-information-to-partners.md).

**Prerequisites**:

Make sure you can reach the SMTP server from the [sensor's management port](./best-practices/understand-network-architecture.md).

**To configure an SMTP server on your OT sensor**:

1. Sign in to the OT sensor and select **System settings** > **Integrations** > **Mail server**.

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

## Upload and play PCAP files

When troubleshooting your OT sensor, you may want to examine data recorded by a specific PCAP file. To do so, you can upload a PCAP file to your OT sensor and replay the data recorded.

The **Play PCAP** option is enabled by default in the sensor console's settings.

Maximum size for uploaded files is 2 GB.

**To show the PCAP player in your sensor console**:

1. On your sensor console, go to **System settings > Sensor management > Advanced Configurations**.

1. In the **Advanced configurations** pane, select the **Pcaps** category.

1. In the configurations displayed, change `enabled=0` to `enabled=1`, and select **Save**.

The **Play PCAP** option is now available in the sensor console's settings, under: **System settings > Basic > Play PCAP**.

**To upload and play a PCAP file**:

1. On your sensor console, select **System settings > Basic > Play PCAP**.

1. In the **PCAP PLAYER** pane, select **Upload** and then navigate to and select the file or multiple files you want to upload.

    :::image type="content" source="media/how-to-manage-individual-sensors/upload-and-play-pcaps.png" alt-text="Screenshot of uploading PCAP files on the PCAP PLAYER pane in the sensor console." lightbox="media/how-to-manage-individual-sensors/upload-and-play-pcaps.png":::

1. Select **Play** to play your PCAP file, or **Play All** to play all PCAP files currently loaded.

> [!TIP]
> Select **Clear All** to clear the sensor of all PCAP files loaded.

## Turn off specific analytics engines

By default, each OT network sensor analyzes ingested data using [built-in analytics engines](architecture.md#defender-for-iot-analytics-engines), and triggers alerts based on both real-time and prerecorded traffic.

While we recommend that you keep all analytics engines on, you may want to turn off specific analytics engines on your OT sensors to limit the type of anomalies and risks monitored by that OT sensor.

> [!IMPORTANT]
> When you disable a policy engine, information that the engine generates won't be available to the sensor. For example, if you disable the Anomaly engine, you won't receive alerts on network anomalies. If you'd created a [forwarding alert rule](how-to-forward-alert-information-to-partners.md), anomalies that the engine learns won't be sent.
>

**To manage an OT sensor's analytics engines**:

1. Sign into your OT sensor and select **System settings > Network monitoring > Customization > Detection engines and network modeling**.

1. In the **Detection engines and network modeling** pane, in the **Engines** area, toggle off one or more of the following engines:

    - **Protocol Violation**
    - **Policy Violation**
    - **Malware**
    - **Anomaly**
    - **Operational**

    Toggle the engine back on to start tracking related anomalies and activities again.

    For more information, see [Defender for IoT analytics engines](architecture.md#defender-for-iot-analytics-engines).

1. Select **Close** to save your changes.

**To manage analytics engines from an on-premises management console**:

1. Sign into your on-premises management console and select **System Settings**.

1. In the **Sensor Engine Configuration** section, select one or more OT sensors you want to apply settings for, and clear any of the following options:

    - **Protocol Violation**
    - **Policy Violation**
    - **Malware**
    - **Anomaly**
    - **Operational**

1. Select **SAVE CHANGES** to save your changes.

## Clear OT sensor data

If you need to relocate or erase your OT sensor, reset it to clear all detected or learned data on the OT sensor.

After clearing data on a cloud-connected sensor:

- The device inventory on the Azure portal is updated in parallel.
- Some actions on corresponding alerts in the Azure portal are no longer supported, such as downloading PCAP files or learning alerts.

> [!NOTE]
> Network settings such as IP/DNS/GATEWAY will not be changed by clearing system data.

**To clear system data**:

1. Sign in to the OT sensor as the *cyberx* user. For more information, see [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

1. Select **Support** > **Clear data**.

1. In the confirmation dialog box, select **Yes** to confirm that you do want to clear all data from the sensor and reset it. For example:

    :::image type="content" source="media/how-to-manage-individual-sensors/clear-system-data.png" alt-text="Screenshot of clearing system data on the support page in the sensor console." lightbox="media/how-to-manage-individual-sensors/clear-system-data.png":::

A confirmation message appears that the action was successful. All learned data, allowlists, policies, and configuration settings are cleared from the sensor.

## Next steps

For more information, see:

- [Manage sensors from the on-premises management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
- [Track sensor activity](how-to-track-sensor-activity.md)
- [Troubleshoot the sensor](how-to-troubleshoot-sensor.md)
