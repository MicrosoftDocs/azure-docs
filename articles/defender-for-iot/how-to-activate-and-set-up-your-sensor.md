---
title: Activate and set up your sensor
description: This article describes hot to sign in and activate a sensor console.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/26/2020
ms.topic: how-to
ms.service: azure
---

# Activate and set up your sensor

This article describes how-to to activate a sensor and perform initial setup.

Activation is carried out by Administrator users when logging in for the first time and when activation management is required. Set up is carried to ensure that the sensor is configured the optimally detect and alert.
Security analyst users and read only cannot activate a sensor or generate a new password.
## Sign-in and activation for administrator users

Administrators signing-in for the first time should verify they have access to activation and password recovery files downloaded during sensor onboarding. If not, they need Azure Security administrator, Subscription contributor or Subscription owner permissions to generate these files on the Defender for IoT portal.

### First-time sign-in and activation checklist

Before signing in to the sensor console, Administrator users should have access to the:

- Sensor IP address that was defined during the installation.

- User sign-in credentials for the sensor. If you downloaded an ISO for the sensor, use the default credentials you received during the installation. It is recommended to create a new *Administrator* user after activation.

- An initial password. If you purchased a pre-configured sensor from Arrow, you need to generate a password when signing in for the first time.

- Activation file associated with this sensor. The file was generated and downloaded during sensor onboarding on the Defender for IoT portal.

- An SSL/TLS CA-signed certificate required by your company.

### About Activation files

Your sensor was onboarded to Azure Defender for IoT in a specific management mode:

| Mode type | Description |
|--|--|
| **Cloud connected mode** | Information detected by the sensor is displayed in the sensor console. Alert information is also delivered through the IoT Hub and can be shared with other Azure services, for example, Azure Sentinel. |
| **Locally connected mode** | Information detected by the sensor is displayed in the sensor console. Detection information is also shared with the on-premise management console, if the sensor is connected to it. |

A locally connected or cloud connected activation file was generated and downloaded for this sensor during onboarding. The activation file contains instructions regarding the management mode of the sensor. **A unique activation file should be uploaded to each sensor you deploy.**  The first time you sign in you need to upload the relevant activation file for this sensor.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/azure-defender-for-iot-activation-file-download-button.png" alt-text="Azure Defender for IoT portal, Onboard sensor":::

### About certificates

Following sensor installation, a local self-signed certificate is generated and used to access the sensor console. After signing in to the console for the first time, Administrator users are prompted to onboard an SSL/TLS certificate.

Two levels of security are available:

- Meet specific certificate and encryption requirements requested by your organization by uploading the CA-signed certificate.
- Allow validation between the management console and connected sensors. Validations is evaluated against a Certificate Revocation List, and the certificate expiration date. **If validation fails, communication between the management console and the sensor is halted and a validation error is presented in the console. This option is enabled by default after installation.**  

The following  certificate types are supported:

- Private / Enterprise Key Infrastructure (Private PKI)
- Public Key Infrastructure (Public PKI)
- Locally generated on the appliance (locally self-signed). It is recommended **not** to use the default self-signed certificate.*
The certificate is **insecure** and should be used for test environments only. The owner of the certificate cannot be validated and the security of your system cannot be maintained. **This option should never be used for production networks.**

### Sign and activate the sensor

To sign-in and activate:

1. Navigate to the sensor console from your browser using the IP defined during the installation. The sign-in dialog box opens.

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/azure-defender-for-iot-sensor-log-in-screen.png" alt-text="Azure Defender for IoT sensor":::

1. Enter the credentials defined during the sensor installation. If you purchased a pre-configured sensor from Arrow, generate a password first. For more information on password recovery see, [Initial sign in password failure](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md#initial-sign-in-password-failure) .

1. After you sign-in, the Activation dialog box opens. Select **Upload** and navigate to the activation file downloaded during sensor onboarding.

   :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/activation-upload-screen-with-upload-button.png" alt-text="Select Upload and navigate":::

1. Select the Sensor Network Configuration link if you want to change the sensor network configuration before activation. See [Update sensor network configuration before activation](#update-sensor-network-configuration-before-activation).

1. Accept the terms and conditions.

1. Select **Activate**. The SSL/TLS certificate dialog box opens.

1. Define a certificate name.
1. Upload the CRT and Key files.
1. Enter a passphrase and upload a PEM file if required.
1. Select **Next**. The validation screen opens. By default validation between the management console and connected sensors is enabled.
1. Turn-off  the **Enable system-wide validation...** toggle to disable validation. It is recommended to enable validation.
1. Select **Save**.  

You may need to refresh your screen after uploading the CA-signed certificate.

For information about uploading a new certificate, supported certificate parameters and working with CLI certificate commands, see [Manage individual sensors](how-to-manage-individual-sensors.md).

#### Update sensor network configuration before activation  

The sensor network configuration parameters were defined during the software installation or when a pre-configured sensor was purchased. The following parameters were defined:

- IP Address
- DNS
- Default Gateway
- Subnet Mask
- Host Name

You may want to update this information before activating the sensor. For example because you need to change the preconfigured parameters defined by Arrow. You can also define proxy settings before activating your sensor.

To update sensor network configuration parameters:

1. Select the **Sensor Network Configuration** link form the activation dialog box.

   :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/editable-network-configuration-screen-v2.png" alt-text="Sensor Network Configuration":::

2. The parameters defined during installation are displayed. The option to define the proxy is also available. Update any settings as required and select **Save**.

### Subsequent logins

After first-time activation, the Azure Defender for IoT sensor console opens after sign-in without requiring an activation file. You only need your sign-in credentials.

After your sign-in, the Azure Defender for IoT console opens.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/azure-defender-for-iot-log-in-screen-dashboard-v2.png" alt-text="Azure Defender for IoT console":::

## Initial setup and learning (for administrators)

After your first sign-in, the Azure Defender for IoT sensor starts to monitor your network automatically. Network assets will appear in the asset map and asset inventory sections. Azure Defender for IoT will begin to detect and alert you on all security and operational incidents that occur in your network. You can then create reports and queries based on the detected information.

Initially this activity is carried out in the learning mode, which instructs your sensor to learn your networks usual activity. For example, assets discovered in your network, protocols detected in the network, file transfers that occur between specific assets. This activity becomes your networks baseline activity.

Review your systems settings and disable the learning mode.

### Review and update basic system settings

Review the sensor system settings to make sure it is configured to optimally detect and alert.

Define the sensor system settings. For example:

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

## First-time sign-in for security analyst and read only users

Before you sign in, verify that you have the:

- Sensor IP address
- Sign in credentials provided by your administrator

## Console tools - Overview

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

[4. Onboard a sensor](getting-started.md#4-onboard-a-sensor)

[Manage sensor activation files](how-to-manage-individual-sensors.md#manage-sensor-activation-files)

[Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
