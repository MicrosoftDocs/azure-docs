---
title: Activate and set up your sensor
description: This article describes how to sign in and activate a sensor console.
ms.date: 04/29/2021
ms.topic: how-to
---

# Activate and set up your sensor

This article describes how to activate a sensor and perform initial setup.

Administrator users carry out activation when signing in for the first time and when activation management is required. Setup ensures that the sensor is configured to optimally detect and alert.

Security analysts and read-only users can't activate a sensor or generate a new password.

## Sign-in and activation for administrator users

Administrators who sign in for the first time should verify that they have access to activation and password recovery files that were downloaded during sensor onboarding. If not, they need Azure security administrator, subscription contributor, or subscription owner permissions to generate these files on the Azure Defender for IoT portal.

### First-time sign-in and activation checklist

Before signing in to the sensor console, administrator users should have access to:

- The sensor IP address that was defined during the installation.

- User sign-in credentials for the sensor. If you downloaded an ISO for the sensor, use the default credentials that you received during the installation. We recommend that you create a new *Administrator* user after activation.

- An initial password. If you purchased a preconfigured sensor from Arrow, you need to generate a password when signing in for the first time.

- The activation file associated with this sensor. The file was generated and downloaded during sensor onboarding on the Defender for IoT portal.

- An SSL/TLS CA-signed certificate that your company requires.

### About activation files

Your sensor was onboarded to Azure Defender for IoT in a specific management mode:

| Mode type | Description |
|--|--|
| **Cloud connected mode** | Information that the sensor detects is displayed in the sensor console. Alert information is also delivered through the IoT hub and can be shared with other Azure services, such as Azure Sentinel. You can also enable automatic threat intelligence updates. |
| **Locally connected mode** | Information that the sensor detects is displayed in the sensor console. Detection information is also shared with the on-premises management console, if the sensor is connected to it. |

A locally connected, or cloud-connected activation file was generated and downloaded for this sensor during onboarding. The activation file contains instructions for the management mode of the sensor. *A unique activation file should be uploaded to each sensor you deploy.*  The first time you sign in, you need to upload the relevant activation file for this sensor.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/azure-defender-for-iot-activation-file-download-button.png" alt-text="Azure Defender for IoT portal, onboard sensor.":::

### About certificates

Following sensor installation, a local self-signed certificate is generated and used to access the sensor console. After an administrator signs in to the console for the first time, that user is prompted to onboard an SSL/TLS certificate.

Two levels of security are available:

- Meet specific certificate and encryption requirements requested by your organization, by uploading the CA-signed certificate.
- Allow validation between the management console and connected sensors. Validation is evaluated against a certificate revocation list and the certificate expiration date. *If validation fails, communication between the management console and the sensor is halted and a validation error appears in the console.* This option is enabled by default after installation.  

The console supports the following certificate types:

- Private and Enterprise Key Infrastructure (private PKI)

- Public Key Infrastructure (public PKI)

- Locally generated on the appliance (locally self-signed) 

  > [!IMPORTANT]
  > We recommend that you don't use the default self-signed certificate. The certificate is not secure and should be used for test environments only. The owner of the certificate can't be validated, and the security of your system can't be maintained. Never use this option for production networks.

See [Manage certificates](how-to-manage-individual-sensors.md#manage-certificates) for more information about working with certificates.

### Sign in and activate the sensor

**To sign in and activate:**

1. Go to the sensor console from your browser by using the IP defined during the installation. The sign-in dialog box opens.

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/azure-defender-for-iot-sensor-log-in-screen.png" alt-text="Azure Defender for IoT sensor.":::

1. Enter the credentials defined during the sensor installation, or select the **Password recovery** option. If you purchased a preconfigured sensor from Arrow, generate a password first. For more information on password recovery, see [Investigate password failure at initial sign-in](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md#investigate-password-failure-at-initial-sign-in).

1. After you sign in, the **Activation** dialog box opens. Select **Upload** and go to the activation file that you downloaded during the sensor onboarding.

   :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/activation-upload-screen-with-upload-button.png" alt-text="Select Upload and go to the activation file.":::

1. Select the **Sensor Network Configuration** link if you want to change the sensor network configuration before activation. See [Update sensor network configuration before activation](#update-sensor-network-configuration-before-activation).

1. Accept the terms and conditions.

1. Select **Activate**. The SSL/TLS certificate dialog box opens.

1. Define a certificate name.
1. Upload the CRT and key files.
1. Enter a passphrase and upload a PEM file if required.
1. Select **Next**. The validation screen opens. By default, validation between the management console and connected sensors is enabled.
1. Turn off the **Enable system-wide validation** toggle to disable validation. We recommend that you enable validation.
1. Select **Save**.  

You might need to refresh your screen after uploading the CA-signed certificate.

For information about uploading a new certificate, supported certificate parameters, and working with CLI certificate commands, see [Manage individual sensors](how-to-manage-individual-sensors.md).

#### Update sensor network configuration before activation  

The sensor network configuration parameters were defined during the software installation, or when you purchased a preconfigured sensor. The following parameters were defined:

- IP address
- DNS
- Default gateway
- Subnet mask
- Host name

You might want to update this information before activating the sensor. For example, you might need to change the preconfigured parameters defined by Arrow. You can also define proxy settings before activating your sensor.

**To update sensor network configuration parameters:**

1. Select the **Sensor Network Configuration** link form the **Activation** dialog box.

   :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/editable-network-configuration-screen-v2.png" alt-text="Sensor Network Configuration.":::

2. The parameters defined during installation are displayed. The option to define the proxy is also available. Update any settings as required and select **Save**.

### Activate an expired license (versions under 10.0)

For users with versions prior to 10.0, your license may expire, and the following alert will be displayed. 

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/activation-popup.png" alt-text="When your license expires you will need to update your license through the activation file.":::

**To activate your license:**

1. Open a case with [support](https://ms.portal.azure.com/?passwordRecovery=true&Microsoft_Azure_IoT_Defender=canary#create/Microsoft.Support).

1. Supply support with your Activation ID number.

1. Support will supply you with new license information in the form of a string of letters.

1. Read the terms and conditions, and check the checkbox to approve.

1. Paste the string into space provided.

    :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/add-license.png" alt-text="Paste the string into the provided field.":::

1. Select **Activate**.

### Subsequent sign-ins

After first-time activation, the Azure Defender for IoT sensor console opens after sign-in without requiring an activation file. You need only your sign-in credentials.

After your sign in, the Azure Defender for IoT console opens.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/azure-defender-for-iot-log-in-screen-dashboard-v2.png" alt-text="Azure Defender for IoT console.":::

## Initial setup and learning (for administrators)

After your first sign-in, the Azure Defender for IoT sensor starts to monitor your network automatically. Network devices will appear in the device map and device inventory sections. Azure Defender for IoT will begin to detect and alert you on all security and operational incidents that occur in your network. You can then create reports and queries based on the detected information.

Initially this activity is carried out in the Learning Mode, which instructs your sensor to learn your network's usual activity. For example, the sensor learns devices discovered in your network, protocols detected in the network, and file transfers that occur between specific devices. This activity becomes your network's baseline activity.

### Review and update basic system settings

Review the sensor's system settings to make sure the sensor is configured to optimally detect and alert.

Define the sensor's system settings. For example:

- Define ICS (or IoT) and segregated subnets.

- Define port aliases for site-specific protocols.

- Define VLANs and names that are in use.

- If DHCP is in use, define legitimate DHCP ranges.

- Define integration with Active Directory and mail server as appropriate.

### Disable learning mode

After adjusting the system settings, you can let the Azure Defender for IoT sensor run in learning mode until you feel that system detections accurately reflect your network activity.

The learning mode should run for about 2 to 6 weeks, depending on your network size and complexity. After you disable learning mode, any activity that differs from your baseline activity will trigger an alert.

**To disable learning mode:**

- Select **System Settings** and turn off the **Learning** option.

## First-time sign-in for security analysts and read-only users

Before you sign in, verify that you have:

- The sensor IP address.
- Sign-in credentials that your administrator provided.

## Console tools: Overview

You access console tools from the side menu.

**Navigation** 

| Window | Icon | Description |
| -----------|--|--|
| Dashboard | :::image type="icon" source="media/concept-sensor-console-overview/dashboard-icon-azure.png" border="false"::: | View an intuitive snapshot of the state of the network's security. |
| Device map | :::image type="icon" source="media/concept-sensor-console-overview/asset-map-icon-azure.png" border="false"::: | View the network devices, device connections, and device properties in a map. Various zooms, highlight, and filter options are available to display your network. |
| Device inventory | :::image type="icon" source="media/concept-sensor-console-overview/asset-inventory-icon-azure.png" border="false":::  | The device inventory displays a list of device attributes that this sensor detects. Options are available to: <br /> - Sort, or filter the information according to the table fields, and see the filtered information displayed. <br /> - Export information to a CSV file. <br /> - Import Windows registry details.|
| Alerts | :::image type="icon" source="media/concept-sensor-console-overview/alerts-icon-azure.png" border="false"::: | Display alerts when policy violations occur, deviations from the baseline behavior occur, or any type of suspicious activity in the network is detected. |
| Reports | :::image type="icon" source="media/concept-sensor-console-overview/reports-icon-azure.png" border="false"::: | View reports that are based on data-mining queries. |

**Analysis**

| Window| Icon | Description |
|---|---|---|
| Event timeline | :::image type="icon" source="media/concept-sensor-console-overview/event-timeline-icon-azure.png" border="false"::: | View a timeline with information about alerts, network events (informational), and user operations, such as user sign-ins and user deletions.|

**Navigation**

| Window | Icon | Description |
|---|---|---|
| Data mining | :::image type="icon" source="media/concept-sensor-console-overview/data-mining-icon-azure.png" border="false"::: | Generate comprehensive and granular information about your network's devices at various layers. |
| Investigation | :::image type="icon" source="media/concept-sensor-console-overview/trends-and-statistics-icon-azure.jpg" border="false"::: | View trends and statistics in an extensive range of widgets. |
| Risk Assessment | :::image type="icon" source="media/concept-sensor-console-overview/vulnerabilities-icon-azure.png" border="false"::: | Display the **Vulnerabilities** window. |

**Admin**

| Window | Icon | Description |
|---|---|---|
| Users | :::image type="icon" source="media/concept-sensor-console-overview/users-icon-azure.png" border="false"::: | Define users and roles with various access levels. |
| Forwarding | :::image type="icon" source="media/concept-sensor-console-overview/forwarding-icon-azure.png" border="false"::: | Forward alert information to partners, and internal sources (for example, Azure Sentinel) integrating with Defender for IoT, to email addresses, to webhook servers, and more. <br /> See [Forward alert information](how-to-forward-alert-information-to-partners.md) for details. |
| System settings | :::image type="icon" source="media/concept-sensor-console-overview/system-settings-icon-azure.png" border="false"::: | Configure the system settings. For example, define DHCP settings, provide mail server details, or create port aliases. |
| Import settings | :::image type="icon" source="media/concept-sensor-console-overview/import-settings-icon-azure.png" border="false"::: | Display the **Import Settings** window. You can perform manual changes in a device's information.<br /> See [Import device information](how-to-import-device-information.md) for details. |

**Support**

| Window| Icon | Description |
|----|---|---|
| Support | :::image type="icon" source="media/concept-sensor-console-overview/support-icon-azure.png" border="false"::: | Contact [Microsoft Support](https://support.microsoft.com/) for help. |

## See also

[Threat intelligence research and packages #](how-to-work-with-threat-intelligence-packages.md)

[Onboard a sensor](getting-started.md#onboard-a-sensor)

[Manage sensor activation files](how-to-manage-individual-sensors.md#manage-sensor-activation-files)

[Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
