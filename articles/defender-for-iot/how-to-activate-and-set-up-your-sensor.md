---
title: Activate and set up your sensor
description: After completing Defender for IoT sensor deployment, and the onboarding and network setup, you will be able to, sign in to the Defender for IoT sensor console, upload an activation file generated for your sensor, and start working with your sensor.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/10/2020
ms.topic: how-to
ms.service: azure
---

# Sign in and activate a sensor 

After completing Defender for IoT sensor deployment, and the onboarding and network setup, you will be able to:

- Sign in to the Defender for IoT sensor console.

- Upload an activation file generated for your sensor.

- Start working with your sensor.

Your sensor was onboarded with Defender for IoT from the Azure portal. Each sensor was onboarded as either a locally connected or cloud connected sensor, otherwise known as the sensor management mode.

| Mode type | Description |
|--|--|
| **Cloud connected mode** | Information detected by the sensor is displayed in the sensor console. Alert information is also delivered through the IoT Hub and can be shared with other Azure services. For example, Azure Sentinel. |
| **Locally connected mode** | Information detected by the sensor is displayed in the sensor's console. Detection information is also shared with the on-premise management console if the sensor is connected to it. |

During the onboarding process, a locally connected or cloud connected activation file was generated for this sensor. The first time you sign in you need to upload the relevant activation file for this sensor. Upload the file only once in order for it to start working.

## First-time sign in and preliminary setup

If you are logging in for the first time, you need to activate the sensor by uploading the activation file that was generated and downloaded during the onboarding process.

The activation file generation and downloading activity were carried out on the **Azure Defender for IoT portal, Onboard sensor** page.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/azure-defender-for-iot-activation-file-download-button.png" alt-text="Azure Defender for IoT portal, Onboard sensor":::

The activation file contains instructions regarding the management mode of the sensor.

**A unique activation file should be uploaded to each sensor you deploy.**

You can perform the preliminary setup after activation.

## Before you begin

Before you sign in, verify that you have access to the:

- Activation file associated with this sensor.

- Sensor IP address that was defined during the installation.

- User sign in credentials needed for this sensor.

To sign-in for the first time:

1. Access the Azure Defender for IoT sensor console from your browser using the IP defined during the installation. The sign-in dialog box opens.

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/azure-defender-for-iot-sensor-log-in-screen.png" alt-text="Azure Defender for IoT sensor":::

2. Enter the credentials that were defined during the sensor installation.

3. After you sign-in successfully, the activation dialog box opens. Select **Upload** and navigate to the activation file downloaded during sensor onboarding.

   :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/activation-upload-screen-with-upload-button.png" alt-text="Select Upload and navigate":::

4. Select the Sensor Network Configuration link if you want to change the sensor network configuration before activation. See [Update sensor network configuration before activation](#update-sensor-network-configuration-before-activation).

5. Accept the terms and conditions.

6. Select **Activate**.

      - Activation expiration periods

      - Switching from a local sensor management to cloud sensor management

      - Assigning a new IoT Hub to a Cloud Connected sensor.

## Update sensor network configuration before activation  

The sensor network configuration parameters were defined during the software installation or when a pre-configured sensor was purchased. The following parameters were defined:

- IP Address

- DNS  

- Default Gateway

- Subnet Mask

- Host Name

You may want to update this information before activating the sensor because:

- You need to change the preconfigured parameters defined.  

- You want to reconfigure network parameters post installation.

You can also define proxy settings before activating your sensor.

To update sensor network configuration parameters:

1. Select the **Sensor Network Configuration** link form the activation dialog box.  

   :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/editable-network-configuration-screen-v2.png" alt-text="Sensor Network Configuration":::

2. The parameters defined during installation are displayed. The option to define the proxy is also available. Update any settings as required and select **Save**.  

## Subsequent logins

After successful first-time activation, the Azure Defender for IoT sensor console opens after sign-in without requiring an activation file. You only need your sign-in credentials.

After your sign-in, the Azure Defender for IoT console opens.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/azure-defender-for-iot-log-in-screen-dashboard.png" alt-text="Azure Defender for IoT console":::

## Initial learning period

After your first sign-in, the Azure Defender for IoT sensor starts to monitor your network automatically. Network assets will appear in the asset map and asset inventory sections. Azure Defender for IoT will begin to detect and alert you on all security and operational incidents that occur in your network. You can then create reports and queries based on the detected information.

Initially this activity is carried out in the learning mode, which instructs your sensor to learn your networks usual activity. For example, assets discovered in your network, protocols detected in the network, file transfers that occur between specific assets. This activity becomes your networks baseline activity.

Review your systems settings and disable the learning mode.

### Review and update basic system settings

Review the sensor system settings to make sure it is configured to detect and alert you to its fullest potential.

We recommended you define the sensor system settings. For example:

- Define ICS (or IoT) and segregated subnets

- Define port aliases for site-specific protocols

- Define VLANs and names that are in use

- If DHCP is in use, define legitimate DHCP ranges

- Define integration with Active Directory and mail server

### Disable learning mode

After adjusting the system settings, you can let the Azure Defender for IoT sensor run in the Learning mode until you feel system detections accurately reflect your network activity.

The Learning mode should run approximately between 2 to 6 weeks, depending on your network size and complexity. After you disable learning mode, alerts will be triggered by any activity that differs from your baseline activity.

To disable the Learning mode:

1. Select **System Settings** and toggle the Learning option.

## Console tools

You access console tools from the side menu.

**Navigation** 

| Window | Icon | Description |
| -----------|--|--|
| Dashboard | :::image type="icon" source="media/concept-sensor-console-overview/dashboard-icon-azure.png" border="false"::: | View an intuitive snapshot of the state of the network's security. |
| Device map | :::image type="icon" source="media/concept-sensor-console-overview/asset-map-icon-azure.png" border="false"::: | View the network devices, device connections, and device properties in a map. Various zooms, highlight, and filter options are available to display your network. |
| Device inventory | :::image type="icon" source="media/concept-sensor-console-overview/asset-inventory-icon-azure.png" border="false":::  | The device inventory displays an extensive range of device attributes that this sensor detects. Options are available to: <br /> - Filter the information according to the table fields, and see the filtered information displayed. <br /> - Export information to a CSV file. <br /> - Import Windows registry details.|
| Alerts | :::image type="icon" source="media/concept-sensor-console-overview/alerts-icon-azure.png" border="false"::: | Display alerts when policy violations occur, deviations from the baseline behavior occur, or any type of suspicious activity in the network is detected. |
| Reports | :::image type="icon" source="media/concept-sensor-console-overview/reports-icon-azure.png" border="false"::: | View reports that are based on data mining queries. |

**Analysis**

| Window| Icon | Description |
|---|---|---|
| Event timeline | :::image type="icon" source="media/concept-sensor-console-overview/event-timeline-icon-azure.png" border="false"::: | Contains a timeline with information about alerts, network events (informational), and user operations, such as user sign-ins and user deletions.|

**Navigation**

| Window | Icon | Description |
|---|---|---|
| Data mining | :::image type="icon" source="media/concept-sensor-console-overview/data-mining-icon-azure.png" border="false"::: | Generate comprehensive and granular information regarding your network's devices at various layers. |
| Trends and statistics | :::image type="icon" source="media/concept-sensor-console-overview/trends-and-statistics-icon-azure.jpg" border="false"::: | View trends and statistics in an extensive range of widgets. |
| Risk Assessment | :::image type="icon" source="media/concept-sensor-console-overview/vulnerabilities-icon-azure.png" border="false"::: | Display the **Vulnerabilities** window. |

**Admin**

| Window | Icon | Description |
|---|---|---|
| Users | :::image type="icon" source="media/concept-sensor-console-overview/users-icon-azure.png" border="false"::: | Define users and roles with various access levels. |
| Forwarding | :::image type="icon" source="media/concept-sensor-console-overview/forwarding-icon-azure.png" border="false"::: | Forward alert information to partners integrating with Defender for IoT, to email addresses, to webhook servers, and more. <br /> See [Forward alert information](how-to-forward-alert-information-to-partners.md) for details. |
| System settings | :::image type="icon" source="media/concept-sensor-console-overview/system-settings-icon-azure.png" border="false"::: | Configure the system settings. For example, define DHCP settings, provide mail server details, or create port aliases. |
| Import settings | :::image type="icon" source="media/concept-sensor-console-overview/import-settings-icon-azure.png" border="false"::: | Display the **Import Settings** window. You can perform manual changes in a device's information.<br /> See [Import device information](how-to-import-device-information.md) for details. |

**Support**

| Window| Icon | Description |
|----|---|---|
| Support | :::image type="icon" source="media/concept-sensor-console-overview/support-icon-azure.png" border="false"::: | Contact [Microsoft Support](https://support.microsoft.com/) for help. |



### See also

[Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)