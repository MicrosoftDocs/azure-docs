---
title: About the Splunk integration
description: To address a lack of visibility into the security and resiliency of OT networks, Defender for IoT developed the Defender for IoT, IIoT, and ICS threat monitoring application for Splunk, a native integration between Defender for IoT and Splunk that enables a unified approach to IT and OT security.
ms.date: 1/4/2021
ms.topic: article
---

# Defender for IoT and ICS threat monitoring application for Splunk

Defender for IoT mitigates IIoT, ICS, and SCADA risk with patented, ICS-aware self-learning engines that deliver immediate insights about ICS devices, vulnerabilities, and threats in less than an image hour and without relying on agents, rules or signatures, specialized skills, or prior knowledge of the environment.

To address a lack of visibility into the security and resiliency of OT networks, Defender for IoT developed the Defender for IoT, IIoT, and ICS threat monitoring application for Splunk, a native integration between Defender for IoT and Splunk that enables a unified approach to IT and OT security.

> [!Note]
> References to CyberX refer to Azure Defender for IoT.

## About the Splunk application

The application provides SOC analysts with multidimensional visibility into the specialized OT protocols and IIoT devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior. The application also enables both IT and OT incident response from within one corporate SOC. This is an important evolution given the ongoing convergence of IT and OT to support new IIoT initiatives, such as smart machines and real-time intelligence.

Splunk application can be installed locally or run on a cloud. The integration with Defender for IoT supports both deployments.

## About the integration

The integration of Defender for IoT and Splunk via the native application lets users:

- Reduce the time required for industrial and critical infrastructure organizations to detect, investigate, and act on cyber threats.

- Obtain real-time intelligence about OT risks.

- Correlate Defender for IoT alerts with Splunk Enterprise Security Threat Intelligence repositories.

- Monitor and respond from a single-pane-of-glass.

[:::image type="content" source="media/integration-splunk/splunk-mainpage-v2.png" alt-text="Main page of the splunk tool.":::](media/integration-splunk/splunk-mainpage-v2.png#lightbox)

:::image type="content" source="media/integration-splunk/alerts.png" alt-text="The alerts page in splunk.":::

The application allows Splunk administrators to analyze OT alerts that Defender for IoT sends, and monitor the entire OT security deployment, including details such as:

- Which of the five analytics engines detected the alert.

- Which protocol generated the alert.

- Which Defender for IoT sensor generated the alert.

- The severity level of the alert.

- The source and destination of the communication.

## Requirements

### Version requirements

The following versions are requirements.

- Defender for IoT version 2.4 and above.

- Splunkbase version 11 and above.

- Splunk Enterprise version 7.2 and above.
  
## Download the application

Download the *CyberX ICS Threat Monitoring for Splunk Application* from the [Splunkbase](https://splunkbase.splunk.com/app/4313/).

## Splunk permission requirements

The following Splunk permission is required:

- Any user with *admin* user role permissions.

## Send Defender for IoT alerts to Splunk

Defender for IoT alerts provides information about an extensive range of security events, including:

- Deviations from learned baseline network activity.

- Malware detections.

- Detections based on suspicious operational changes.

- Network anomalies.

- Protocol deviations from protocol specifications.

:::image type="content" source="media/integration-splunk/address-scan.png" alt-text="The detections screen.":::

You can configure Defender for IoT to send alerts to the Splunk server, where alert information is displayed in the Splunk Enterprise dashboard.

:::image type="content" source="media/integration-splunk/alerts-and-details.png" alt-text="View all of the alerts and their details.":::

The following alert information is sent to the Splunk server.

- The date and time of the alert.

- The Defender for IoT engine that detected the event: Protocol Violation, Policy Violation, Malware, Anomaly, or Operational engine.

- The alert title.

- The alert message.

- The severity of the alert: Warning, Minor, Major or Critical.

- The source device name.

- The source device IP address.

- The destination device name.

- The destination device IP address.

- The Defender for IoT platform IP address (Host).

- The name of the Defender for IoT platform appliance (source type).

Sample output is shown below:

| Time | Event |
|--|--|
| 7/23/15<br />9:28:31.000 PM | **Defender for IoT platform Alert**: A device was stopped by a PLC Command<br /><br />**Type**: Operational Violation <br /><br />**Severity**: Major <br /><br />**Source name**: my_device1 <br /><br />**Source IP**: 192.168.110.131 <br /><br />**Destination name**: my_device2<br /><br /> **Destination IP**: 10.140.33.238 <br /><br />**Message**: A network device was stopped using a Stop PLC command. This device will not operate until a Start command is sent. 192.168.110.131 was stopped by 10.140.33.238 (a Siemens S7 device), using a PLC Stop command.<br /><br />**Host**: 192.168.90.43 <br /><br />**Sourcetype**: Sensor_Agent |

## Define alert forwarding rules

Use Defender for IoT *Forwarding Rules* to send alert information to Splunk servers.

Options are available to customize the alert rules based on the:

- Specific protocols detected.

- Severity of the event.

- Defender for IoT engine that detects events.

To create a forwarding rule:

1. From the sensor or on-premises management console left pane, select **Forwarding.**

    :::image type="content" source="media/integration-splunk/forwarding.png" alt-text="Select the blue button Create Forwarding Alert.":::

1. Select **Create Forwarding Rules**. In the **Create Forwarding Rule** window, define the rule parameters.

    :::image type="content" source="media/integration-splunk/forwarding-rule.png" alt-text="Create the rules for your forwarding rule.":::

    | Parameter | Description |
    |--|--|
    | **Name** | The forwarding rule name. |
    | **Select Severity** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Protocols** | By default, all the protocols are selected. To select a specific protocol, select **Specific** and select the protocol for which this rule is applied. |
    | **Engines** | By default, all the security engines are involved. To select a specific security engine for which this rule is applied, select **Specific** and select the engine. |
    | **System Notifications** | Forward sensor online/offline status. This option is only available if you have logged into the Central Manager. |

1. To instruct Defender for IoT to send asset information to Splunk, select **Action**, and then select **Send to Splunk Server**.

1. Enter the following Splunk parameters.

    :::image type="content" source="media/integration-splunk/parameters.png" alt-text="The Splunk parameters you should enter on this screen.":::

    | Parameter | Description |
    |--|--|
    | **Host** | Splunk server address |
    | **Port** | 8089 |
    | **Username** | Splunk server username |
    | **Password** | Splunk server password |

1. Select **Submit**

## Next steps

Learn how to [Forward alert information](how-to-forward-alert-information-to-partners.md).
