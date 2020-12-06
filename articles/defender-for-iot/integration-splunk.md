---
title: About the Splunk integration
description:
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/11/2020
ms.topic: article
ms.service: azure
---

# CyberX IIoT & ICS threat monitoring app for Splunk

CyberX mitigates IIoT and ICS/SCADA risk with patented, ICS-aware self-learning engines that deliver immediate insights about ICS assets, vulnerabilities, and threats — in less than animage hour and without relying on agents, rules or signatures, specialized skills, or prior knowledge of the environment.

To address a lack of visibility into the security and resiliency of OT networks, CyberX developed the CyberX IIoT & ICS Threat Monitoring App for Splunk — a native integration between CyberX and Splunk that enables a unified approach to IT and OT security.

## About the Splunk app

The app provides SOC analysts with multidimensional visibility into the specialized OT protocols and IIoT devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior. The app also enables both IT and OT incident response from within one corporate SOC. This is an important evolution given the ongoing convergence of IT and OT to support new IIoT initiatives, such as smart machines and real-time intelligence.

Splunk app can be installed locally or run on a cloud. The integration with CyberX supports both deployments.

## About the integration

The integration of CyberX and Splunk via the native app lets users:

  - Reduce the time required for industrial and critical infrastructure organizations to detect, investigate, and act on cyber threats.

  - Obtain real-time intelligence about OT risks.

  - Correlate CyberX alerts with Splunk Enterprise Security Threat Intelligence repositories.

  - Monitor and respond from a single-pane-of-glass.

:::image type="content" source="media/integration-splunk/image3.png" alt-text="Screenshot of splunk tool":::

:::image type="content" source="media/integration-splunk/image4.png" alt-text="Screenshot of alerts":::

The app allows Splunk administrators to analyze OT alerts that CyberX sends, and monitor the entire OT security deployment, including details such as:

  - Which of the 5 analytics engines detected the alert

  - Which protocol generated the alert

  - Which CyberX sensor generated the alert

  - Severity level of the alert

  - Source/destination of the communication

  - and more

## Getting more information

  - For support and troubleshooting information, contact <support@cyberx-labs.com>

  - For information on an add-on in a distributed Splunk Enterprise deployment, go to <https://docs.splunk.com/Documentation/AddOns/released/Overview/Distributedinstall>

## Requirements

### Version requirements

This section describes system version requirements.

  - CyberX version 2.4 and above.

  - Splunkbase version 11 and above.

  - Splunk Enterprise version 7.2 and above.
  
## Download the app

Download the *CyberX ICS Threat Monitoring for Splunk App* from the [Splunkbase](https://splunkbase.splunk.com/app/4313/).

## Splunk permission requirements

The following Splunk permission is required:

  - Any user with "admin" user role permissions.

## Send CyberX alerts to Splunk

CyberX alerts provide information about an extensive range of security events, including:

  - Deviations from learned baseline network activity

  - Malware detections

  - Detections based on suspicious operational changes

  - Network anomalies

  - Protocol deviations from protocol specifications

:::image type="content" source="media/integration-splunk/image5.png" alt-text="Screenshot of detections":::

You can configure CyberX to send alerts to the Splunk server, where alert information is displayed in the Splunk Enterprise dashboard.

:::image type="content" source="media/integration-splunk/image6.png" alt-text="Screenshot of alerts":::

The following alert information is sent to the Splunk server.

  - Date and time of the alert

  - CyberX engine that detected the event: Protocol Violation, Policy Violation, Malware, Anomaly or Operational engine

  - Alert title

  - Alert message

  - Severity of the alert: Warning, Minor, Major or Critical

  - Source device name

  - Source device IP

  - Destination device name

  - Destination device IP

  - CyberX platform IP (Host)

  - Name of the CyberX platform appliance (source type)

Sample output is shown below:

| Time | Event |
|--|--|
| 7/23/15<br />9:28:31.000 PM | **CyberX platform Alert**: An Asset was stopped by a PLC Command<br /><br />**Type**:Operational Violation <br /><br />**Severity**: Major <br /><br />**Source name**: my_device1 <br /><br />**Source IP**: 192.168.110.131 <br /><br />**Destination name**: my_device2<br /><br /> **Destination IP**: 10.140.33.238 <br /><br />**Message**: A network asset was stopped using a Stop PLC command. This asset will not operate until a Start command is sent. 192.168.110.131 was stopped by 10.140.33.238 (a Siemens S7 device), using a PLC Stop command.<br /><br />**Host**: 192.168.90.43 <br /><br />**Sourcetype**: Sensor_Agent|

## Define alert forwarding rules

Use CyberX *Forwarding Rules* to send alert information to Splunk servers.

Options are available to customize the alert rules based on the:

  - Specific protocols detected

  - Severity of the event

  - CyberX engine that detects events

**To create a forwarding rule:**

1.  From the Sensor or on-premises management console left pane, select **Forwarding.**

    :::image type="content" source="media/integration-splunk/image7.png" alt-text="Screenshot of select forwarding":::

2.  Select **Create Forwarding Rules**. In the **Create Forwarding Rule** window define rule parameters.

    :::image type="content" source="media/integration-splunk/image8.png" alt-text="Screenshot of create forwarding rules":::

    | Parameter | Description |
    |--|--|
    | **Name** | The forwarding rule name. |
    | **Select Severity** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts <u>and any alert above this severity level will be forwarded.</u> |
    | **Protocols** | By default, all the protocols are selected. To select a specific protocol, select **Specific** and select the protocol for which this rule is applied. |
    | **Engines** | By default, all the security engines are involved. To select a specific security engine for which this rule is applied, select **Specific** and select the engine. |
    | **System Notifications** | Forward sensor online/offline status. This option is only available if you have logged into the Central Manager. |                                            |


3.  To instruct CyberX to send assert information to Splunk, select **Action** and then select **Send to Splunk Server**.

4.  Enter the following Splunk parameters.

    :::image type="content" source="media/integration-splunk/image9.png" alt-text="Screenshot of Splunk parameters":::

    | Parameter | Description            |
    | --------- | ---------------------- |
    | **Host**      | Splunk server address  |
    | **Port**      | 8089                   |
    | **Username**  | Splunk server username |
    | **Password**  | Splunk server password |

5.  Select **Submit**
