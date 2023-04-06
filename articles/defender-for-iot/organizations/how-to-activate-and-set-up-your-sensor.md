---
title: Activate and set up your sensor
description: This article describes how to sign in and activate a sensor console.
ms.date: 06/06/2022
ms.topic: install-set-up-deploy
---

# Activate and set up your sensor

This article describes how to activate a sensor and perform initial setup.

Administrator users carry out activation when signing in for the first time and when activation management is required. Setup ensures that the sensor is configured to optimally detect and alert.

Security analysts and read-only users can't activate a sensor or generate a new password.

## Sign in and activation for administrator users

Administrators who sign in for the first time should verify that they have access to the activation and password recovery files for this sensor. These files were downloaded during sensor onboarding. If Administrators don't have these files, they can  generate new ones via Defender for IoT in the Azure portal. The following Azure permissions are needed to generate the files:

- Azure security administrator
- Subscription contributor
- Subscription owner permissions

### First-time sign in and activation checklist

Before administrators sign in to the sensor console, administrator users should have access to:

- The sensor IP address that was defined during the installation.

- User sign in credentials for the sensor. If you downloaded an ISO for the sensor, use the default credentials that you received during the installation. We recommend that you create a new *Administrator* user after activation.

- An initial password. If you purchased a preconfigured sensor from Arrow, you need to generate a password when signing in for the first time.

- The activation file associated with this sensor. The file was generated and downloaded during sensor onboarding by Defender for IoT.


- An SSL/TLS CA-signed certificate that your company requires.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

### About activation files

Your sensor was onboarded to Microsoft Defender for IoT in a specific management mode:

| Mode type | Description |
|--|--|
| **Cloud connected mode** | Information that the sensor detects is displayed in the sensor console. Alert information is also delivered to Azure and can be shared with other Azure services, such as Microsoft Sentinel. You can also enable automatic threat intelligence updates. |
| **Locally connected mode** | Information that the sensor detects is displayed in the sensor console. Detection information is also shared with the on-premises management console, if the sensor is connected to it. |

A locally connected, or cloud-connected activation file was generated and downloaded for this sensor during onboarding. The activation file contains instructions for the management mode of the sensor. *A unique activation file should be uploaded to each sensor you deploy.*  The first time you sign in, you need to upload the relevant activation file for this sensor.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/defender-for-iot-activation-file-download-button.png" alt-text="Screenshot of the download activation file for Defender for IoT sensors in the Azure portal.":::

### About certificates

Following sensor installation, a local self-signed certificate is generated. The certificate is used to access the sensor console. After administrators sign in to the console for the first time, they're  prompted to onboard an SSL/TLS certificate.

Two levels of security are available:

- Meet specific certificate and encryption requirements requested by your organization, by uploading the CA-signed certificate.
- Allow validation between the management console and connected sensors. Validation is evaluated against a certificate revocation list and the certificate expiration date. *If validation fails, communication between the management console and the sensor is halted and a validation error appears in the console.* This option is enabled by default after installation.  

The console supports the following certificate types:

- Private and Enterprise Key Infrastructure (private PKI)

- Public Key Infrastructure (public PKI)

- Locally generated on the appliance (locally self-signed) 

  > [!IMPORTANT]
  > We recommend that you don't use the default self-signed certificate. The certificate is not secure and should be used for test environments only. The owner of the certificate can't be validated, and the security of your system can't be maintained. Never use this option for production networks.

### Sign in and activate the sensor

**To sign in and activate:**

1. Go to the sensor console from your browser by using the IP defined during the installation. The sign-in dialog box opens.

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/sensor-log-in-1.png" alt-text="Screenshot of a Defender for IoT sensor sign-in page.":::


1. Enter the credentials defined during the sensor installation, or select the **Password recovery** option. If you purchased a preconfigured sensor from Arrow, generate a password first. For more information on password recovery, see [Investigate password failure at initial sign-in](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md#investigate-password-failure-at-initial-sign-in).


1. Select **Login/Next**.  The **Sensor Network Settings** tab opens.

      :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/sensor-log-in-wizard-activate.png" alt-text="Screenshot of the sensor network settings options when signing into the sensor.":::   

1. Use this tab if you want to change the sensor network configuration before activation. The configuration parameters were defined during the software installation, or when you purchased a preconfigured sensor. The following parameters were defined:

    - IP address
    - DNS
    - Default gateway
    - Subnet mask
    - Host name

    You might want to update this information before activating the sensor. For example, you might need to change the preconfigured parameters defined by Arrow. You can also define proxy settings before activating your sensor.
    
    If you want to work with a proxy, enable the proxy toggle and add the proxy host, port and username.

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/sensor-log-in-wizard-activate-proxy.png" alt-text="Screenshot of the proxy options for signing in to a sensor.":::

1. Select **Next.** The Activation tab opens.

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/wizard-upload-activation-file.png" alt-text="Screenshot of a first time activation file upload option.":::

1. Select **Upload** and go to the activation file that you downloaded during the sensor onboarding.

1. Approve the terms and conditions.

1. Select **Activate**. The SSL/TLS certificate tab opens. Before defining certificates, see [Deploy SSL/TLS certificates on OT appliances](how-to-deploy-certificates.md).

    It is **not recommended** to use a locally generated certificate in a production environment.

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/wizard-upload-activation-certificates-1.png" alt-text="Screenshot of the SSL/TLS Certificates page when signing in to a sensor.":::

1. Enable the **Import trusted CA certificate (recommended)** toggle.
1. Define a certificate name.
1. Upload the Key, CRT, and PEM files.
1. Enter a passphrase and upload a PEM file if necessary.
1. It's recommended to select **Enable certificate validation** to validate the connections between management console and connected sensors.

1. Select **Finish**.  

You might need to refresh your screen after uploading the CA-signed certificate.

For information about uploading a new certificate, supported certificate parameters, and working with CLI certificate commands, see [Manage individual sensors](how-to-manage-individual-sensors.md).

### Activation expirations

After you've activated your sensor, cloud-connected and locally managed sensors remain activated for as long as your Azure subscription with your Defender for IoT plan is active.

If you're updating an OT sensor from a legacy version, you'll need to re-activate your updated sensor. 

For more information, see [Manage Defender for IoT subscriptions](how-to-manage-subscriptions.md) and [Manage the on-premises management console](how-to-manage-the-on-premises-management-console.md).

### Activate an expired license (versions under 10.0)

For users with versions prior to 10.0, your license may expire, and the following alert will be displayed.

  :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/activation-popup.png" alt-text="Screenshot of a license expiration popup message.":::

**To activate your license:**

1. Open a case with [support](https://portal.azure.com/?passwordRecovery=true&Microsoft_Azure_IoT_Defender=canary#create/Microsoft.Support).

1. Supply support with your Activation ID number.

1. Support will supply you with new license information in the form of a string of letters.

1. Read the terms and conditions, and check the checkbox to approve.

1. Paste the string into space provided.

    :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/add-license.png" alt-text="Screenshot of the license activation box and button.":::

1. Select **Activate**.

### Subsequent sign ins

After first-time activation, the Microsoft Defender for IoT sensor console opens after sign-in without requiring an activation file or certificate definition. You only need your sign-in credentials.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/sensor-log-in-1.png" alt-text="Screenshot of the sensor sign-in page after the initial activation.":::

After your sign-in, the Microsoft Defender for IoT sensor console opens.

  :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/initial-dashboard.png" alt-text="Screenshot of the initial sensor console dashboard Overview page." lightbox="media/how-to-activate-and-set-up-your-sensor/initial-dashboard.png":::

## Initial setup and learning (for administrators)

After your first sign-in, the Microsoft Defender for IoT sensor starts to monitor your network automatically. Network devices will appear in the device map and device inventory sections. Microsoft Defender for IoT will begin to detect and alert you on all security and operational incidents that occur in your network. You can then create reports and queries based on the detected information.

Initially this activity is carried out in the Learning mode, which instructs your sensor to learn your network's usual activity. For example, the sensor learns devices discovered in your network, protocols detected in the network, and file transfers that occur between specific devices. This activity becomes your network's baseline activity.

### Review and update basic system settings

Review the sensor's system settings to make sure the sensor is configured to optimally detect and alert.

Define the sensor's system settings. For example:

- Define ICS (or IoT) and segregated subnets.

- Define port aliases for site-specific protocols.

- Define VLANs and names that are in use.

- If DHCP is in use, define legitimate DHCP ranges.

- Define integration with Active Directory and mail server as appropriate.

### Disable Learning mode

After adjusting the system settings, you can let the sensor run in Learning mode until you feel that system detections accurately reflect your network activity.

The learning mode should run for about 2 to 6 weeks, depending on your network size and complexity. After you disable Learning mode, any activity that differs from your baseline activity will trigger an alert.

**To disable learning mode:**

- Select **System Settings**, **Network Monitoring,**  **Detection Engines and Network Modeling** and disable the **Learning** toggle.

## First-time sign in for security analysts and read-only users

Before you sign in, verify that you have:

- The sensor IP address.
- Sign in credentials that your administrator provided.
 
    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/sensor-log-in-1.png" alt-text="Screenshot of the sensor sign-in page after the initial setup.":::


## Console tools: Overview

You can access console tools from the side menu.  Tools help you:
- Gain deep, comprehensive visibility into your network
- Analyze network risks, vulnerabilities, trends and statistics
- Set up your sensor for maximum performance
- Create and manage users 

   :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/main-page-side-bar.png" alt-text="Screenshot of the sensor console's main menu on the left.":::

### Discover

| Tools| Description |
| -----------|--|
| Overview | View a dashboard with high-level information about your sensor deployment, alerts, traffic, and more. |
| Device map | View the network devices, device connections, Purdue levels, and device properties in a map. Various zooms, highlight, and filter options are available to help you gain the insight you need. For more information, see [Investigate devices on a device map](how-to-work-with-the-sensor-device-map.md) |
| Device inventory | The Device inventory displays a list of device attributes that this sensor detects. Options are available to: <br /> - Sort, or filter the information according to the table fields, and see the filtered information displayed. <br /> - Export information to a CSV file. <br /> - Import Windows registry details. For more information, see [Detect Windows workstations and servers with a local script](detect-windows-endpoints-script.md).|
| Alerts | Alerts are triggered when sensor engines detect changes or suspicious activity in network traffic that requires your attention.  For more information, see [View and manage alerts on your OT sensor](how-to-view-alerts.md).|

### Analyze

| Tools| Description |
|---|---|
| Event timeline | View a timeline with information about alerts, network events, and user operations. For more information, see [Track sensor activity](how-to-track-sensor-activity.md).|
| Data mining | Generate comprehensive and granular information about your network's devices at various layers. For more information, see [Sensor data mining queries](how-to-create-data-mining-queries.md).|
| Trends and Statistics |  View trends and statistics about an extensive range of network traffic and activity.  As a small example, display charts and graphs showing top traffic by port, connectivity drops by hours, S7 traffic by control function, number of devices per VLAN, SRTP errors by day, or Modbus traffic by function. For more information, see [Sensor trends and statistics reports](how-to-create-trends-and-statistics-reports.md).
| Risk Assessment | Proactively address vulnerabilities,  identify risks such as missing patches or unauthorized applications. Detect changes to device configurations, controller logic, and firmware. Prioritize fixes based on risk scoring and automated threat modeling.  For more information, see [Risk assessment reporting](how-to-create-risk-assessment-reports.md#create-risk-assessment-reports).|
| Attack Vector |  Display a graphical representation of a vulnerability chain of exploitable devices. These vulnerabilities can give an attacker access to key network devices. The Attack Vector Simulator calculates attack vectors in real time and analyzes all attack vectors for a specific target. For more information, see [Attack vector reporting](how-to-create-attack-vector-reports.md#create-attack-vector-reports).|

### Manage

| Tools| Description |
|---|---|
| System settings | Configure the system settings. For example, define DHCP settings, provide mail server details, or create port aliases.   |
| Custom alert rules |  Use custom alert rules to more specifically pinpoint activity or traffic of interest to you. For more information, see [Create custom alert rules on an OT sensor](how-to-accelerate-alert-incident-response.md#create-custom-alert-rules-on-an-ot-sensor). |
| Users |  Define users and roles with various access levels. For more information, see [Create and manage users on an OT network sensor](manage-users-sensor.md).  |
| Forwarding |  Forward alert information to partners that integrate with Defender for IoT, for example, Microsoft Sentinel, Splunk, ServiceNow. You can also send to email addresses, webhook servers, and more. <br /> See [Forward alert information](how-to-forward-alert-information-to-partners.md) for details. |


**Support**

| Tool| Description |
|----|---|
| Support | Contact [Microsoft Support](https://support.microsoft.com/) for help.|

## Review system messages

System messages provide general information about your sensor that may require your attention, for example if:

- your sensor activation file is expired or will expire soon
- your sensor isn't detecting traffic
- your sensor SSL certificate is expired or will expire soon

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/system-messages.png" alt-text="Screenshot of the System messages area on the sensor console page, displayed after selecting the bell icon.":::
 
**To review system messages:**
1. Sign into the sensor
1. Select the **System Messages** icon (Bell icon).


## Next steps

For more information, see:

- [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md)

- [Onboard a sensor](tutorial-onboarding.md#onboard-and-activate-the-virtual-sensor)

- [Manage sensor activation files](how-to-manage-individual-sensors.md#upload-a-new-activation-file)

- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
