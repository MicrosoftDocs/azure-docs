---
title: About the ServiceNow integration
description: The Defender for IoT ICS Management application for ServiceNow provides SOC analysts with multidimensional visibility into the specialized OT protocols and IoT devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior.
ms.date: 1/17/2021
ms.topic: article
---

# The Defender for IoT ICS management application for ServiceNow

The Defender for IoT ICS Management application for ServiceNow provides SOC analysts with multidimensional visibility into the specialized OT protocols and IoT devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior. This is an important evolution given the ongoing convergence of IT and OT to support new IoT initiatives, such as smart machines and real-time intelligence.

The application also enables both IT and OT incident response from within one corporate SOC.

## About Defender for IoT

Defender for IoT delivers the only ICS and IoT cybersecurity platform built by blue-team experts with a track record defending critical national infrastructure, and the only platform with patented ICS-aware threat analytics and machine learning. Defender for IoT provides:

- Immediate insights about ICS the device landscape with an extensive range of details about attributes.

- ICS-aware deep embedded knowledge of OT protocols, devices, applications, and their behaviors.

- Immediate insights into vulnerabilities, and known zero-day threats.

- An automated ICS threat modeling technology to predict the most likely paths of targeted ICS attacks via proprietary analytics.

> [!Note]
> References to CyberX refer to Azure Defender for IoT.

## About the integration

The Defender for IoT integration with ServiceNow provides a new level of centralized visibility, monitoring, and control for the IoT and OT landscape. These bridged platforms enable automated device visibility and threat management to previously unreachable ICS & IoT devices.

### Threat management

The Defender for IoT ICS Management application helps:

- Reduce the time required for industrial and critical infrastructure organizations to detect, investigate, and act on cyber threats.

- Obtain real-time intelligence about OT risks.

- Correlate Defender for IoT alerts with ServiceNow threat monitoring and incident management workflows.

- Trigger ServiceNow tickets and workflows with other services and applications on the ServiceNow platform.

ICS and SCADA security threats are identified by Defender for IoT security engines, which provide immediate alert response to malware attacks, network, and security policy deviations, as well as operational and protocol anomalies. For details about alert details sent to ServiceNow, see [Alert reporting](#alert-reporting).

### Device visibility and management

The ServiceNow Configuration Management Database (CMDB) is enriched and supplemented with a rich set of device attributes pushed by the Defender for IoT platform. This ensures comprehensive and continuous visibility into the device landscape and lets you monitor and respond from a single-pane-of-glass. For details about device attributes sent to ServiceNowSee, see [View Defender for IoT detections in ServiceNow](#view-defender-for-iot-detections-in-servicenow).

## System requirements and architecture

This article describes:

- **Software Requirements**  
- **Architecture**

## Software requirements

- ServiceNow Service Management version 3.0.2

- Defender for IoT patch 2.8.11.1 or above

> [!Note]
> If you are already working with a Defender for IoT and ServiceNow integration, and upgrade using the on-premises management console, pervious data received from Defender for IoT sensors should be cleared from ServiceNow.

## Architecture

### On-premises management console architecture

The on-premises management console provides a unified source for all the device and alert information sent to ServiceNow.

You can set up an on-premises management console to communicate with one instance of ServiceNow. The on-premises management console pushes sensor data to the Defender for IoT application using REST API.

If you are setting up your system to work with an on-premises management console, disable the ServiceNow Sync, Forwarding Rules and proxy configurations in sensors, if they were set up.

These configurations should be set up for the on-premises management console. Configuration instructions are described in this article.

### Sensor architecture

If you want to set up your environment to include direct communication between  sensors and ServiceNow, for each sensor define the ServiceNow Sync, Forwarding rules, and proxy configuration (if a proxy is needed).

It recommended setting up your integration using the on-premises management console to communicate with ServiceNow.

## Create access tokens in ServiceNow

This article describes how to create an access token in ServiceNow. The token is needed to communicate with Defender for IoT.

You will need the **Client ID** and **Client Secret** when creating Defender for IoT Forwarding rules, which forward alert information to ServiceNow, and when configuring Defender for IoT to push device attributes to ServiceNow tables.

## Set up Defender for IoT to communicate with ServiceNow

This article describes how to set up Defender for IoT to communicate with ServiceNow.

### Send Defender for IoT alert information

This article describes how to configure Defender for IoT to push alert information to ServiceNow tables. For information about alert data sent, see [Alert reporting](#alert-reporting).

Defenders for IoT alerts appear in ServiceNow as security incidents.

Define a Defender for IoT *Forwarding* rule to send alert information to ServiceNow.

To define the rule:

1. In the Defender for IoT left pane, select **Forwarding**.  

1. Select the :::image type="content" source="media/integration-servicenow/plus.png" alt-text="The plus icon button."::: icon. The Create Forwarding Rule dialog box opens.  

    :::image type="content" source="media/integration-servicenow/forwarding-rule.png" alt-text="Create Forwarding Rule":::

1. Add a rule name.

1. Define criteria under which Defender for IoT will trigger the forwarding rule. Working with Forwarding rule criteria helps pinpoint and manage the volume of information sent from Defender for IoT to ServiceNow. The following options are available:

    - **Severity levels:** This is the minimum-security level incident to forward. For example, if **Minor** is selected, minor alerts, and any alert above this severity level will be forwarded. Levels are pre-defined by Defender for IoT.

    - **Protocols:** Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

    - **Engines:** Select the required engines or choose them all. Alerts from selected engines will be sent.

1. Verify that **Report Alert Notifications** is selected.

1. In the Actions section, select **Add** and then select **ServiceNow**.

    :::image type="content" source="media/integration-servicenow/select-servicenow.png" alt-text="Select ServiceNow from the dropdown options.":::

1. Enter the ServiceNow action parameters:

    :::image type="content" source="media/integration-servicenow/parameters.png" alt-text="Fill in the ServiceNow action parameters":::

1. In the **Actions** pane, set the following parameters:

  | Parameter | Description |
  |--|--|
  | Domain | Enter the ServiceNow server IP address. |
  | Username | Enter the ServiceNow server username. |
  | Password | Enter the ServiceNow server password. |
  | Client ID | Enter the Client ID you received for Defender for IoT in the **Application Registries** page in ServiceNow. |
  | Client Secret | Enter the client secret string you created for Defender for IoT in the **Application Registries** page in ServiceNow. |
  | Report Type | **Incidents**: Forward a list of alerts that are presented in ServiceNow with an incident ID and short description of each alert.<br /><br />**Defender for IoT Application**: Forward full alert information, including the  sensor details, the engine, the source, and destination addresses. The information is forwarded to the Defender for IoT on the ServiceNow application. |

1. Select **SAVE**. Defenders for IoT alerts appear as incidents in ServiceNow.

### Send Defender for IoT device attributes

This article describes how to configure Defender for IoT to push an extensive range of device attributes to ServiceNow tables. See ***Inventory Information*** for details about the kind of information pushed to ServiceNow.

To send attributes to ServiceNow, you must map your on-premises management console to a ServiceNow instance. This ensures that the Defender for IoT platform can communicate and authenticate with the instance.

To add a ServiceNow instance:

1. Sign in to your Defender for IoT on-premises management console.

1. Select **System Settings** and then **ServiceNow** from the on-premises management console Integration section.

      :::image type="content" source="media/integration-servicenow/servicenow.png" alt-text="Select the ServiceNow button.":::

1. Enter the following sync parameters in the ServiceNow Sync dialog box.

    :::image type="content" source="media/integration-servicenow/sync.png" alt-text="The ServiceNow sync dialog box.":::

     Parameter | Description |
    |--|--|
    | Enable Sync | Enable and disable the sync after defining parameters. |
    | Sync Frequency (minutes) | By default, information is pushed to ServiceNow every 60 minutes. The minimum is 5 minutes. |
    | ServiceNow Instance | Enter the ServiceNow instance URL. |
    | Client ID | Enter the Client ID you received for Defender for IoT in the **Application Registries** page in ServiceNow. |
    | Client Secret | Enter the Client Secret string you created for Defender for IoT in the **Application Registries** page in ServiceNow. |
    | Username | Enter the username for this instance. |
    | Password | Enter the password for this instance. |

1. Select **SAVE**.

## Verify communication

Verify that the on-premises management console is connected to the ServiceNow instance by reviewing the *Last Sync* date.

:::image type="content" source="media/integration-servicenow/sync-confirmation.png" alt-text="Verify the communication occurred by looking at the last sync.":::

## Set up the integrations using the HTTPS proxy

When setting up the Defender for IoT and ServiceNow integration, the on-premises management console and the ServiceNow server communicate using port 443. If the ServiceNow server is behind the proxy, the default port cannot be used.

Defender for IoT supports an HTTPS proxy in the ServiceNow integration by enabling the change of the default port used for integration.

To configure the proxy:

1. Edit global properties in on-premises management console:  
    `sudo vim /var/cyberx/properties/global.properties`

2. Add the following parameters:

    - `servicenow.http_proxy.enabled=1`

    - `servicenow.http_proxy.ip=1.179.148.9`

    - `servicenow.http_proxy.port=59125`

3. Save and exit.

4. Run the following command: `sudo monit restart all`

After configuration, all the ServiceNow data is forwarded using the configured proxy.

## Download the Defender for IoT application

This article describes how to download the application.

To access the Defender for IoT application:

1. Navigate to <https://store.servicenow.com/>

2. Search for `Defender for IoT` or `CyberX IoT/ICS Management`.

   :::image type="content" source="media/integration-servicenow/search-results.png" alt-text="Search for CyberX in the search bar.":::

3. Select the application.

   :::image type="content" source="media/integration-servicenow/cyberx-app.png" alt-text="Select the application from the list.":::

4. Select **Request App.**

   :::image type="content" source="media/integration-servicenow/sign-in.png" alt-text="Sign in to the application with your credentials.":::

5. Sign in and download the application.

## View Defender for IoT detections in ServiceNow

This article describes the device attributes and alert information presented in ServiceNow.

To view device attributes:

1. Sign in to ServiceNow.

2. Navigate to **CyberX Platform**.

3. Navigate to **Inventory** or **Alert**.

   [:::image type="content" source="media/integration-servicenow/alert-list.png" alt-text="Inventory or Alert":::](media/integration-servicenow/alert-list.png#lightbox)

## Inventory information

The Configuration Management Database (CMDB) is enriched and supplemented by data sent by Defender for IoT to ServiceNow. By adding or updating of device attributes on ServiceNow’s CMDB configuration item tables, Defender for IoT can trigger the ServiceNow workflows and business rules.

The following information is available:

- Device attributes, for example the device MAC, OS, vendor, or protocol detected.

- Firmware information, for example the firmware version and serial number.

- Connected device information, for example the direction of the traffic between the source and destination.

### Devices attributes

This article describes the device attributes pushed to ServiceNow.

| Item | Description |
|--|--|
| Appliance | The name of the sensor that detected the traffic. |
| ID | The device ID assigned by Defender for IoT. |
| Name | The device name. |
| IP Address | The device IP address or addresses. |
| Type | The device type, for example a switch, PLC, historian, or Domain Controller. |
| MAC Address | The device MAC address or addresses. |
| Operating System | The device operating system. |
| Vendor | The device vendor. |
| Protocols | The protocols detected in the traffic generated by the device. |
| Owner | Enter the name of the device owner. |
| Location | Enter the physical location of the device. |

View devices connected to a device in this view.

To view connected devices:

1. Select a device and then select the **Appliance** listed in for that device.

    :::image type="content" source="media/integration-servicenow/appliance.png" alt-text="Select the desired appliance from the list.":::

1. In the **Device Details** dialog box, select **Connected Devices**.

### Firmware details

This article describes the device firmware information pushed to ServiceNow.

| Item | Description |
|--|--|
| Appliance | The name of the sensor that detected the traffic. |
| Device | The device name. |
| Address | The device IP address. |
| Module Address | The device model and slot number or ID. |
| Serial | The device serial number. |
| Model | The device model number. |
| Version | The firmware version number. |
| Additional Data | More data about the firmware as defined by the vendor, for example the device type. |

### Connection details

This article describes the device connection information pushed to ServiceNow.

:::image type="content" source="media/integration-servicenow/connections.png" alt-text="The device's connection information":::

| Item | Description |
|--|--|
| Appliance | The name of the sensor that detected the traffic. |
| Direction | The direction of the traffic. <br /> <br /> - **One Way** indicates that the Destination is the server and Source is the client. <br /> <br /> - **Two Way** indicates that both the source and the destination are servers, or that the client is unknown. |
| Source device ID | The IP address of the device that communicated with the connected device. |
| Source device name | The name of the device that communicated with the connected device. |
| Destination device ID | The IP address of the connected device. |
| Destination device name | The name of the connected device. |

## Alert reporting

Alerts are triggered when Defenders for IoT engines detect changes in network traffic and behavior that require your attention. For details on the kinds of alerts each engine generates, see [About alert engines](#about-alert-engines).

This article describes the device alert information pushed to ServiceNow.

| Item | Description |
|--|--|
| Created | The time and date the alert was generated. |
| Engine | The engine that detected the event. |
| Title | The alert title. |
| Description | The alert description. |
| Protocol | The protocol detected in the traffic. |
| Severity | The alert severity defined by Defender for IoT. |
| Appliance | The name of the  sensor that detected the traffic. |
| Source name | The source name. |
| Source IP address| The source IP address. |
| Destination name | The destination name. |
| Destination IP address | The destination IP address. |
| Assignee | Enter the name of the individual assigned to the ticket. |

### Updating alert information

Select the entry in the created column to view alert information in a form. You can update alert details and assign the alert to an individual to review and handle.

[:::image type="content" source="media/integration-servicenow/alert.png" alt-text="View the alert's information.":::](media/integration-servicenow/alert.png#lightbox)

### About alert engines

This article describes the kind of alerts each engine triggers.

| Alert type | Description |
|--|--|
| Policy violation alerts | Triggered when the Policy Violation engine detects a deviation from traffic previously learned. For example: <br /><br />- A new device is detected. <br /><br />- A new configuration is detected on a device. <br /><br />- A device not defined as a programming device carries out a programming change. <br /><br />- A firmware version changed. |
| Protocol violation alerts | Triggered when the Protocol Violation engine detects a packet structures or field values that don't comply with the protocol specification. |
| Operational alerts | Triggered when the Operational engine detects network operational incidents or device malfunctioning. For example, a network device was stopped using a Stop PLC command, or an interface on a  sensor stopped monitoring traffic. |
| Malware alerts | Triggered when the Malware engine detects malicious network activity, for example, known attacks such as Conficker. |
| Anomaly alerts | Triggered when the Anomaly engine detects a deviation. For example, a device is performing network scanning but is not defined as a scanning device. |

## Next steps

Learn how to [Forward alert information](how-to-forward-alert-information-to-partners.md).
