---
title: About the Servicenow integration
description:
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/11/2020
ms.topic: article
ms.service: azure
---

# About the ServiceNow CyberX integration

## About CyberX

CyberX delivers the only ICS and IoT cybersecurity platform built by blue-team experts with a track record defending critical national infrastructure — and the only platform with patented ICS-aware threat analytics and machine learning. CyberX provides:

  - Immediate insights about ICS the asset landscape with an extensive range of details about attributes.

  - ICS-aware deep embedded knowledge of OT protocols, devices, applications — and their behaviors.

  - Immediate insights into vulnerabilities, as well as known and zero-day threats.

  - An automated ICS threat modeling technology to predict the most likely paths of targeted ICS attacks via proprietary analytics.

## About the integration

The CyberX integration with ServiceNow provides a new level of centralized visibility, monitoring and control for the IoT/OT landscape. These bridged platforms enable automated asset visibility and threat management to previously unreachable ICS & IoT assets.

## About the CyberX ICS management app for ServiceNow

The CyberX ICS Management App for ServiceNow provides SOC analysts with multidimensional visibility into the specialized OT protocols and IoT devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior. This is an important evolution given the ongoing convergence of IT and OT to support new IoT initiatives, such as smart machines and real time intelligence.

The app also enables both IT and OT incident response from within one corporate SOC.

### Threat management

The CyberX ICS Management App helps:

  - Reduce the time required for industrial and critical infrastructure organizations to detect, investigate, and act on cyber threats.

  - Obtain real-time intelligence about OT risks.

  - Correlate CyberX alerts with ServiceNow threat monitoring and incident management workflows.

  - Trigger ServiceNow tickets as well as workflows with other services and Apps on the ServiceNow platform.

ICS/SCADA security threats are identified by CyberX security engines, which provide immediate alert response to malware attacks, network and security policy deviations, as well as operational and protocol anomalies. See ***Alert Reporting*** for details about alert details sent to ServiceNow.

### Asset visibility and management

The ServiceNow Configuration Management Database (CMDB) is enriched and supplemented with a rich set of asset attributes pushed by the CyberX platform. This ensures comprehensive and continuous visibility into the asset landscape and lets you monitor and respond from a single-pane-of-glass. See ***View CyberX Detections in ServiceNow*** for details about asset attributes sent to ServiceNow.

## System requirements and architecture

This section describes:

  - **Software Requirements**  
  - **Architecture**

## Software requirements

  - ServiceNow Service Management version 3.0.2 

  - CyberX patch 2.8.11.1 or above

> [!Note] 
> If you are already working with a CyberX/ServiceNow integration and upgrade using the on-premises management console, pervious data received from CyberX Sensors should be cleared from ServiceNow.

## Architecture

### on-premises management console architecture

The on-premises management console provides a unified source for all the asset and alert information sent to ServiceNow.

You can set up a on-premises management console to communicate with one instance of ServiceNow. The on-premises management console pushes Sensor data to the CyberX App using REST API.

:::image type="content" source="media/integration-servicenow/image3.png" alt-text="on-premises management console Architecture":::

If you are setting up your system to work with a on-premises management console, disable the ServiceNow Sync, Forwarding Rules and proxy configurations in Sensors, if they were set up.

These configurations should be set up for the on-premises management console. Configuration instructions are described in this guide.

### Sensor architecture

If you want to set up your environment to include direct communication between Sensors and ServiceNow, for each Sensor define the ServiceNow Sync, Forwarding rules and proxy configuration (if a proxy is needed).

:::image type="content" source="media/integration-servicenow/image4.png" alt-text="Sensor architecture":::

It recommended to set up your integration using the on-premises management console to communicate with ServiceNow.

## Create access tokens in ServiceNow

This section describes how to create an access token in ServiceNow. The token is needed to communicate with CyberX.

You will need the **Client ID** and **Client** **Secret** when creating CyberX Forwarding rules, which forward alert information to ServiceNow, and when configuring CyberX to push asset attributes to ServiceNow tables.

:::image type="content" source="media/integration-servicenow/image5.png" alt-text="Access Tokens in ServiceNow":::

## Set up CyberX to communicate with ServiceNow

This section describes how to set up CyberX to communicate with ServiceNow.

### Send CyberX alert information

This section describes how to configure CyberX to push alert information to ServiceNow tables. See ***Alert Reporting*** for information about alert data sent.

CyberX alerts appear in ServiceNow as security incidents.

Define a CyberX *Forwarding* rule to send alert information to ServiceNow.

To define the rule:

1. In the CyberX left pane, select **Forwarding**.  
    The Forwarding pane appears.

2. Select the :::image type="content" source="media/integration-servicenow/image6.png" alt-text="Icon of +"::: icon. The Create Forwarding Rule dialog box opens.  
    :::image type="content" source="media/integration-servicenow/image7.png" alt-text="Create Forwarding Rule":::

3. Add a rule name.

4. Define criteria under which CyberX will trigger the forwarding rule. Working with Forwarding rule criteria helps pinpoint and manage the volume of information sent from CyberX to ServiceNow. The following options are available:

   - **Severity levels:** This is the minimum-security level incident to forward. For example, if Minor is selected, minor alerts <span class="underline">and any alert above this severity level will be forwarded.</span> Levels are pre-defined by CyberX.

   - **Protocols:** Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

   - **Engines:** Select the required engines or choose them all. Alerts from selected engines will be sent.


5.  Verify that **Report Alert Notifications** is selected.

6.  In the Actions section, select **Add** and then select **ServiceNow**.

    :::image type="content" source="media/integration-servicenow/image8.png" alt-text="Select ServiceNow":::

7.  Enter the ServiceNow action parameters:

    :::image type="content" source="media/integration-servicenow/image9.png" alt-text="ServiceNow action parameters":::

8.  In the **Actions** pane, set the following parameters:

| Parameter | Description |
|--|--|
| Domain | Enter the ServiceNow server IP address. |
| Username | Enter the ServiceNow server username. |
| Password | Enter the ServiceNow server password. |
| Client ID | Enter the Client ID you received for CyberX in the Application Registries page in ServiceNow. |
| Client Secret | Enter the Client Secret string you created for CyberX in the Application Registries page in ServiceNow. |
| Report Type | **Incidents**: Forward a list of alerts that are presented in ServiceNow with an incident ID and short description of each alert.<br /><br />**CyberX Application**: Forward full alert information, including the Sensor details, the engine, the Source and Destination addresses and so on. The information is forwarded to the CyberX on ServiceNow application. |

9.  Select **SAVE**. CyberX alerts appear as incidents in ServiceNow.

### Send CyberX asset attributes

This section describes how to configure CyberX to push an extensive range of asset attributes to ServiceNow tables. See ***Inventory Information*** for details about the kind of information pushed to ServiceNow.

To send attributes to ServiceNow, you must map your on-premises management console to a ServiceNow instance. This ensures that the CyberX platform can communicate and authenticate with the instance.

To add a ServiceNow instance:

1.  Log in to your CyberX on-premises management console.

2. Select **System Settings** and then **ServiceNow** from the on-premises management console Integration section.

    :::image type="content" source="media/integration-servicenow/image10.png" alt-text="ServiceNow":::

3. Enter the following sync parameters in the ServiceNow Sync dialog box.

    :::image type="content" source="media/integration-servicenow/image11.png" alt-text="ServiceNow Sync dialog box":::

    | Parameter | Description |
    |--|--|
    | Enable Sync | Enable and disable the Sync after defining parameters. |
    | Sync Frequency (minutes) | By default, information is pushed to ServiceNow every 60 minutes. You cannot define a frequency under 5 minutes. |
    | ServiceNow Instance | Enter the ServiceNow instance URL. |
    | Client ID | Enter the Client ID you received for CyberX in the Application Registries page in ServiceNow. |
    | Client Secret | Enter the Client Secret string you created for CyberX in the Application Registries page in ServiceNow. |
    | Username | Enter the username for this instance. |
    | Password | Enter the password for this instance. |

4. Select **SAVE**.

## Verify communication

Verify that the on-premises management console is connected to the ServiceNow instance by reviewing the *Last Sync* date.

  :::image type="content" source="media/integration-servicenow/image12.png" alt-text="Verify Communication":::

## Setting up CyberX-ServiceNow integration using the HTTPS proxy

When setting up the CyberX-ServiceNow integration, the on-premises management console and the ServiceNow server communicate using the port 443. If the ServiceNow server is behind the proxy, the default port cannot be used.

CyberX supports an HTTPS proxy in ServiceNow integration by enabling the change of the default port used for integration.

To configure the proxy:

1.  Edit global properties in on-premises management console:  
    `sudo vim /var/cyberx/properties/global.properties`

2. Add the following parameters:

    - `servicenow.http_proxy.enabled=1`

    - `servicenow.http_proxy.ip=1.179.148.9`

    - `servicenow.http_proxy.port=59125`

3. Save and exit.

4. Run the following command: `sudo monit restart all`

After configuration, all the ServiceNow data is forwarded using the configured proxy.

## Download the CyberX app

This section describes how to download the app.

To access the CyberX App:

1.  Navigate to <https://store.servicenow.com/>

2. Search for CyberX.

   :::image type="content" source="media/integration-servicenow/image13.png" alt-text="Search for CyberX":::

3. Select the App.

   :::image type="content" source="media/integration-servicenow/image14.png" alt-text="Select the App":::

4. Select **Request App.**

   :::image type="content" source="media/integration-servicenow/image15.png" alt-text="Select Request App":::

5. Log in and download the App.

## View CyberX detections in ServiceNow

This section describes the asset attributes and alert information presented in ServiceNow.

To view asset attributes:

1.  Log in to ServiceNow.

2. Navigate to **CyberX Platform**.

3. Navigate to **Inventory** or **Alert**.

   :::image type="content" source="media/integration-servicenow/image16.png" alt-text="Inventory or Alert":::

## Inventory information

The Configuration Management Database (CMDB) is enriched and supplemented by data sent by CyberX to ServiceNow. By adding or updating of asset attributes on ServiceNow’s CMDB configuration item tables, CyberX can trigger the ServiceNow workflows and business rules.

The following information is available:

- Asset attributes, for example the asset MAC, Operating System, Vendor or protocol detected.

- Firmware information, for example the firmware version and serial number.

- Connected asset information, for example the direction of the traffic between the source and destination.

### Assets attributes

This section describes the asset attributes pushed to ServiceNow.

| Item | Description |
|--|--|
| Appliance | The name of the sensor that detected the traffic. |
| ID | The asset ID assigned by CyberX. |
| Name | The asset name. |
| IP Address | The asset IP address or addresses. |
| Type | The asset Type, for example a Switch, PLC, Historian or Domain Controller. |
| MAC Address | The asset MAC address or addresses. |
| Operating System | The asset operating System. |
| Vendor | The asset vendor. |
| Protocols | The protocols detected in the traffic generated by the asset. |
| Owner | Enter the name of the asset owner. |
| Location | Enter the physical location of the asset. |

View assets connected to an asset in this view.

To view connected assets:

1. Select an Asset and then select the **Appliance** listed in for that Asset.

   :::image type="content" source="media/integration-servicenow/image17.png" alt-text="Appliance":::

2. In the Asset Details dialog box select Connected Assets.

   :::image type="content" source="media/integration-servicenow/image18.png" alt-text="Connected Assets":::

### Firmware details

This section describes the asset firmware information pushed to ServiceNow.

| Item            | Description                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| Appliance       | The name of the sensor that detected the traffic.                                        |
| Asset           | The asset name.                                                                          |
| Address         | The asset IP.                                                                            |
| Module Address  | The asset model/slot number or ID.                                                       |
| Serial          | The asset serial number.                                                                 |
| Model           | The asset model number.                                                                  |
| Version         | The firmware version number.                                                             |
| Additional Data | Additional data about the firmware as defined by the vendor, for example the asset type. |

### Connection details

This section describes the asset connection information pushed to ServiceNow.

:::image type="content" source="media/integration-servicenow/image19.png" alt-text="Asset connection information":::

| Item | Description |
|--|--|
| Appliance | The name of the sensor that detected the traffic. |
| Direction | The direction of the traffic. <br /> <br /> - **One Way** indicates that the Destination is the server and Source is the client. <br /> <br /> - **Two Way** indicates that both the Source and the Destination are servers, or that the client is unknown. |
| Source Device ID | The IP of the asset that communicated with the connected asset. |
| Source Device Name | The Name of the asset that communicated with the connected asset. |
| Destination Device ID | The IP of the connected asset. |
| Destination Device Name | The name of the connected asset. |

## Alert reporting

Alerts are triggered when CyberX engines detect changes in network traffic and behavior that require your attention. See ***About Alert Engines*** for details the kinds of alerts each engine generates.

This section describes the asset alert information pushed to ServiceNow.

| Item | Description |
|--|--|
| Created | The time and date the alert was generated. |
| Engine | The engine that detected the event. |
| Title | The alert title. |
| Description | The alert description. |
| Protocol | The protocol detected in the traffic. |
| Severity | The alert severity defined by CyberX. |
| Appliance | The name of the sensor that detected the traffic. |
| Source Name | The source name. |
| Source IP | The source IP. |
| Destination name | The destination name. |
| Destination IP | The destination IP. |
| Assignee | Enter the name of the individual assigned to the ticket. |

### Updating alert information

Select the entry in the Created column to view alert information in a form. You can update alert details and assign the alert to an individual for review and handling.

:::image type="content" source="media/image20.png" alt-text="Alert information":::

### About alert engines

This section describes the kind of alerts each engine triggers.

| Alert type | Description |  |
|--|--|
| Policy violation alerts | Triggered when the Policy Violation engine detects a deviation from traffic previously learned. For example: <br /><br />- A new asset is detected. <br /><br />- A new configuration is detected on an asset. <br /><br />- An asset not defined as a programming device carries out a programming change. <br /><br />- A firmware version changed. |
| Protocol violation alerts | Triggered when the Protocol Violation engine detects a packet structures or field values that don't comply with the protocol specification. |
| Operational alerts | Triggered when the Operational engine detects network operational incidents or asset malfunctioning. For example, a network asset was stopped using a Stop PLC command, or an interface on a sensor stopped monitoring traffic. |
| Malware alerts | Triggered when the Malware engine detects malicious network activity, for example, known attacks such as Conficker. |
| Anomaly alerts | Triggered when the Anomaly engine detects a deviation. For example, an asset is performing network scanning but is not defined as a scanning asset. |
