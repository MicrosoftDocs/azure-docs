---
title: Forward alert information
description: You can send alert information to partner systems by working with Forwarding Rules.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/02/2020
ms.topic: how-to
ms.service: azure
---

# Forward alert information

You can send alert information to partners integrating with Defender for IoT, to SYSLOG servers, email addresses and more. Working with Forwarding rules lets you quickly deliver alert information to security stakeholders.  

SYSLOG and other default forwarding actions are delivered with your system. In addition, other forwarding actions may become available when you integrate with partner vendors, such as Microsoft Sentinel, ServiceNow or Splunk.

:::image type="content" source="media/how-to-work-with-alerts-sensor/alert-information-screen.png" alt-text="Alert information.":::

Defender for IoT Administrators have permission to use Forwarding rules.

## About alert information forwarded

Alerts provide information about an extensive range of security and operational events. For example,

  - Date and time of the alert

  - Engine that detected the event

  - Alert title and descriptive message

  - Alert severity

  - Source and destination name and IP address

  - Suspicious traffic detected

:::image type="content" source="media/how-to-work-with-alerts-sensor/address-scan-detected-screen.png" alt-text="Address scan detected.":::

Relevant information is sent to partner systems when Forwarding Rules are created.

## Create forwarding rules

This section describes how to create forwarding rules.

**To create a new forwarding rule:**

1. Select **Forwarding** on the side menu.

   :::image type="content" source="media/how-to-work-with-alerts-sensor/create-forwarding-rule-screen.png" alt-text="Create a forwarding rule icon.":::

2. Select **Create Forwarding Rule.**

   :::image type="content" source="media/how-to-work-with-alerts-sensor/create-a-forwardong-rule.png" alt-text="Create a new forwarding rule.":::

3. Enter the name of the Forwarding Rule.

### Forwarding rule criteria 

Define criteria by which to trigger a forwarding rule. Working with forwarding rule criteria helps pinpoint and manage the volume of information sent from the sensor to external systems. The following options are available:

**Protocols:** Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

**Engines:** Select the required engines or choose them all. Alerts from selected engines will be sent.

**Severity levels:** This is the minimum security level incident to forward. For example, if minor is selected, minor alerts and any alert above this severity level will be forwarded. Levels are predefined.

### Forwarding rule actions

Forwarding rule actions instruct the sensor to forward alert information to partner vendors or servers. You can create multiple actions for each Forwarding rule.

In addition to the Forwarding actions delivered with your system, other actions may become available when you integrate with partner vendors. 

#### Email address action

Send mail that includes the alert information. You can enter one email address per rule.

To define to the Forwarding rule:

1. Enter a single email address. If more than one mail needs to be sent, create another action.

2. Enter the timezone. The time stamp for the alert detection at the SIEM.

#### SYSLOG server actions

The following formats are supported:

  - Text messages

  - CEF messages

  - LEEF messages

  - Object messages

:::image type="content" source="media/how-to-work-with-alerts-sensor/create-actions-rule.png" alt-text="Create forwarding rule actions.":::

Enter the following parameters:

  - SYSLOG hostname and port.

  - Enter the protocol TCP and UDP.

  - Enter the timezone. The time stamp for the alert detection at the SIEM.

  - TLS encryption certificate file and key file for CEF servers (optional).
    
:::image type="content" source="media/how-to-work-with-alerts-sensor/configure-encryption.png" alt-text="Configure your encryption for your forwarding rule.":::

| SYSLOG text message output fields | Description |
|--|--|
| Date and time | Date and time the syslog server machine received the information. |
| Priority | User.Alert |
| Hostname | Sensor IP address |
| Protocol | TCP or UDP |
| Message | Sensor – sensor name<br /> Alert – the title of the alert<br /> Type – the type of the alert. Can be, Protocol Violation, Policy Violation, Malware, Anomaly, or Operational<br /> Severity – the severity of the alert. Can be, Warning, Minor, Major, or Critical<br /> Source – source device name<br /> Source IP  – source device IP address<br /> Destination – destination device name<br /> Destination IP – destination device IP address<br /> Message – the message of the alert<br /> Alert group - The alert group associated with the alert. |


| SYSLOG object output | Description |
|--|--|
| Date and Time |	Date and time the syslog server machine received the information |  
| Priority |	User.Alert | 
| Hostname |	Sensor IP | 
| Message |	Sensor name: the name of the appliance <br /> Alert time: the time the alert was detected: May vary from the time of the Syslog server machine depends on the Forwarding rule timezone configuration. <br /> Alert title: the title of the alert <br /> Alert message: the message of the alert <br /> Alert severity: the severity of the alert: Warning, Minor, Major, or Critical <br /> Alert type: Protocol Violation, Policy Violation, Malware, Anomaly, or Operational <br /> Protocol: the protocol of the alert  <br /> Source_MAC, IP address, name, vendor, or OS of the source device <br /> Destination_MAC, IP address, name, vendor, or OS of the destination. If data is missing, the value will be “N/A”.  <br /> alert_group The alert group associated with the alert. |


| SYSLOG CEF output format | Description |
|--|--|
| Date and time | Date and time the syslog server machine received the information. |
| Priority | User.Alert | 
| Hostname | Sensor IP address |
| Message | CEF:0 <br />Azure Defender for IoT <br />Sensor name – the name of the sensor appliance <br />Sensor version <br />Alert title – the title of the alert <br />msg – the message of the alert <br />protocol – the protocol of the alert <br />severity – Warning, Minor, Major, or Critical <br />type – Protocol Violation, Policy Violation, Malware, Anomaly, or Operational <br /> start – the time the alert was detected <br />May vary from the time of the syslog server machine, depends on the Forwarding rule timezone configuration. <br />src_ip – source device IP address  <br />dst_ip – destination device IP address<br />cat - The alert group associated with the alert.  |

| SYSLOG LEEF output format | Description |
|--|--|
| Date and time |	Date and time the syslog server machine received the information |  
| Priority |	User.Alert | 
| Hostname |	Sensor IP |
| Message |	Sensor Name: the name of the Azure Defender for IoT appliance <br />LEEF:1.0 <br />Azure Defender for IoT <br />Sensor  <br />Sensor Version <br />Azure Defender for IoT Alert <br />title – the title of the alert <br />msg – the message of the alert <br />protocol – the protocol of the alert<br />severity – the severity of the alert: Warning, Minor, Major, or Critical <br />type – the type of the alert: Protocol Violation, Policy Violation, Malware, Anomaly, or Operational <br />start – the time of the alert Note: It may be different from the time of the syslog server machine (this depends on the time zone configuration) <br />src_ip – source device IP address<br />dst_ip – destination device IP address <br />cat - The alert group associated with the alert. |

3. Select **Submit**.

#### Netwitness action

Send alert information to a NetWitness server.

To define NetWitness Forwarding parameters:

1. Enter NetWitness **Hostname** and **Port**.

2. Enter the timezone. The time stamp for the alert detection at the SIEM.

   :::image type="content" source="media/how-to-work-with-alerts-sensor/add-timezone.png" alt-text="Add a timezone to your forwarding rule.":::

3. Select **Submit**.

#### Integrated vendor actions

You may have integrated your system with a security, device management, or other industry vendor. These integrations let you:

  - Send alert information

  - Send device inventory information

  - Communicate with vendor side firewalls

Integrations help bridge previously siloed security solutions, enhance device visibility, and can accelerate system-wide response to more rapidly mitigate risks.

Use the actions section to enter the credentials and other information required to communicate with integrated vendors.

Refer to the relevant partner integration articles for details about setting up Forwarding rules for the integrations.

### Test forwarding rules

Test the connection between the sensor and selected partner server defined in your Forwarding rules.

To test the connection:

1. Select the rule from the Forwarding rule dialog box.

2. Select the **More** box.

3. Select **Send Test Message**.

4. Navigate to your partner system to verify that the information sent by the sensor was received.

### Edit and delete forwarding rules 

To edit a forwarding rule:

  - In the Forwarding Rule screen, select **Edit** under the **More** drop-down menu. Make the desired changes and select **Submit**.

To remove a forwarding rule:

  - In the Forwarding Rule screen, select **Remove** under the **More** drop-down menu. In the Warning dialog box, select **OK**.

### Forwarding rules and alert exclusion rules

Alert exclusion rules may also have been defined by the administrator. These rules help administrators achieve more granular control over alert triggering by instructing the sensor to ignore alert events based on various parameters. For example device addresses, alert names, or specific sensors.

This means the Forwarding Rules you define may be ignored based on Exclusion Rules created by your administrator. Exclusion Rules are defined in the on-premises management console.

## See also

[Integrations](concept-integrations.md)
