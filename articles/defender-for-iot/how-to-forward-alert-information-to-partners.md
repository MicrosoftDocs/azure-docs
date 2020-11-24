---
title: Forward alert information to partners
description: You can send alert information to partner systems by working with Forwarding Rules.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/23/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Forward alert information to partners

You can send alert information to partner systems by working with *Forwarding Rules*. For example, forward alert information to an email server, SYSLOG server or Webhook server. Working with Forwarding Rules lets you monitor and respond to alerts from a single-pane-of-glass.

SYSLOG and other default forwarding actions are delivered with your system. In addition, other forwarding actions may become available when you integrate with partner vendors, such as Microsoft Sentinel, ServiceNow or Splunk. Working with Forwarding Rules let you monitor and respond to alerts from a single-pane-of-glass.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image191.png" alt-text="Alert information":::

> [!NOTE] 
> **Administrators** may perform the procedures described in this section.

## About alert information forwarded

Alerts provide information about an extensive range of security and operational events, for example:

  - Date and time of the alert

  - Engine that detected the event

  - Alert title and descriptive message

  - Alert Severity

  - Source and destination name and IP

  - Suspicious traffic detected

  - And more.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image159.png" alt-text="Address Scan Detected":::

Relevant information is sent to partner systems when Forwarding Rules are created.

## Create forwarding rules

This section describes how to create forwarding rules.

**To create a new forwarding rule:**

1. Select **Forwarding** on the side menu.

   :::image type="content" source="media/how-to-work-with-alerts-sensor/image192.png" alt-text="Forwarding":::

2. Select **Create Forwarding Rule.**

   :::image type="content" source="media/how-to-work-with-alerts-sensor/image193.png" alt-text="Create forwarding rule":::

3. Enter the Name of the Forwarding Rule.

### Forwarding rule criteria 

Define criteria by which to trigger a Forwarding rule. Working with Forwarding rule criteria helps pinpoint and manage the volume of information sent from the sensor to external systems. The following options are available:

**Protocols:** Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

**Engines:** Select the required engines or choose them all. Alerts from selected engines will be sent.

**Severity levels:** This is the minimum-security level incident to forward. For example, if Minor is selected, minor alerts <span class="underline">and any alert above this severity level will be forwarded.</span> Levels are pre-defined.

### Forwarding rule actions

Forwarding rule actions instruct the sensor to forward alert information to partner vendors or systems. You can create multiple actions for each Forwarding rule.

In addition to the Forwarding actions delivered with your system, other actions may become available when you integrate with partner vendors. See ***Integrated Vendor Actions*** for details

## Email address action

Send mail that includes the alert information. You can enter one email address per rule.

**To define to the Forwarding rule:**

1. Enter a single email address. If more than one mail needs to be sent, create another action.

2. Enter the timezone. The time stamp for the alert detection at the SIEM.

### SYSLOG server actions

The following formats are supported:

  - Text Messages

  - CEF Messages

  - LEEF Messages

  - Object Messages

:::image type="content" source="media/how-to-work-with-alerts-sensor/image194.png" alt-text="Create Forwarding Rule":::

Enter the following parameters:

  - SYSLOG Hostname and Port.

  - Enter the Protocol TCP/UDP.

  - Enter the Timezone. The time stamp for the alert detection at the SIEM.

  - TLS encryption certificate file and key file for CEF servers (optional)
    
:::image type="content" source="media/how-to-work-with-alerts-sensor/image195.png" alt-text="Configure Encruption":::


| SYSLOG Text Message Output fields | Description |
|--|--|
| Date/Time | The date/time the syslog server machine received the information. |
| Priority | User.Alert |
| Hostname | Sensor IP |
| Protocol | TCP or UDP |
| Message | Sensor – Sensor name<br /> Alert – the title of the alert<br /> Type – the type of the alert: Protocol Violation, Policy Violation, Malware, Anomaly or Operational<br /> Severity – the severity of the alert: Warning, Minor, Major or Critical<br /> Source – source device name<br /> Source ip – source device IP<br /> Destination – destination device name<br /> Destination ip – destination device IP<br /> Message – the message of the alert<br /> Alert Group - The Alert Group associated with the alert.<br />See Accelerate Incident Workflow with Alert Grouping Accelerate Inciden<br />Workflow with Alert Grouping for details. |


| SYSLOG OBJECT Output | Description |
|--|--|
| Date/Time |	Date and time the syslog server machine received the information |  
| Priority |	User.Alert | 
| Hostname |	Sensor IP | 
| Message |	Sensor Name: the name of the appliance <br /> Alert Time: the time the alert was detected: May vary from the time of the syslog server machine depends on the Forwarding rule timezone configuration. <br /> Alert Title: the title of the alert <br /> Alert Message: the message of the alert <br /> Alert Severity: the severity of the alert: Warning, Minor, Major or Critical <br /> Alert Type: Protocol Violation Policy Violation, Malware, Anomaly or Operational <br /> Protocol: the protocol of the alert  <br /> Source_MAC/IP/name/Vendor/OS of the source device <br /> Destination_MAC/IP/name/vendor/OS of the destination. If data is missing the value will be “N/A”.  <br /> alert_group The Alert Group associated with the alert. See Accelerate Incident Workflow with Alert GroupingAccelerate Incident Workflow with Alert Grouping for details. |


| SYSLOG CEF Output Format | Description |
|--|--|
| Date/Time | Date/Time the syslog server machine received the information. |
| Priority | User.Alert | 
| Hostname | Sensor IP |
| Message | CEF:0 <br />Azure Defender for IoT <br />Sensor Name – the name of the Sensor appliance <br />Sensor Version <br />Alert <br /> title – the title of the alert <br />msg – the message of the alert <br />protocol – the protocol of the alert <br />severity – Warning, Minor, Major or Critical <br />type – Protocol Violation, Policy Violation, Malware, Anomaly, or Operational <br /> start – the time the alert was detected <br />May vary from the time of the syslog server machine, depends on the Forwarding rule timezone configuration. <br />src_ip – source device IP  <br />dst_ip – destination device IP <br />cat - The Alert Group associated with the alert. See Accelerate Incident Workflow with Alert GroupingAccelerate Incident Workflow with Alert Grouping for details. |


| SYSLOG LEEF Output Format | Description |
|--|--|
| Date/Time |	Date/Time the syslog server machine received the information |  
| Priority |	User.Alert | 
| Hostname |	Sensor IP |
| Message |	Sensor Name: the name of the Azure Defender for IoT appliance <br />LEEF:1.0 <br />Azure Defender for IoT <br />Sensor  <br />Sensor Version <br />Axure Defender for IoT Alert <br />title – the title of the alert <br />msg – the message of the alert <br />protocol – the protocol of the alert: see possible values in figure 5 <br />severity – the severity of the alert: Warning, Minor, Major or Critical <br />type – the type of the alert: Protocol Violation, Policy Violation, Malware, Anomaly or Operational <br />start – the time of the alert Note: It may be different from the time of the syslog server machine (this depends on the time zone configuration) <br />src_ip – source device IP <br />dst_ip – destination device IP <br />cat - The Alert Group associated with the alert. See Accelerate Incident Workflow with Alert GroupingAccelerate Incident Workflow with Alert Grouping for details. |

3. Select **Submit**.

### Netwitness action

Send Alert information to a NetWitness server.

**To define NetWitness Forwarding parameters:**

1. Enter NetWitness **Hostname** and **Port**.

2. Enter the **Timezone**. The time stamp for the alert detection at the SIEM.

   :::image type="content" source="media/how-to-work-with-alerts-sensor/image196.png" alt-text="Forwarding Rule":::

3. Select **Submit**.

### Integrated vendor actions

You may have integrated your system with a security, asset management or other industry vendor. These integrations let you:

  - Send Alert information

  - Send Asset Inventory information

  - Communicate with vendor-side firewalls

  - And more

Integrations help bridge previously siloed security solutions, enhance asset visibility and can accelerate system-wide response to more rapidly mitigate risks.

Use the actions section to enter the credentials and other information required to communicate with integrated vendors.

Refer to the relevant integration guides on the [Help Center](https://cyberx-labs.zendesk.com/hc/en-us/categories/360000602111-Integrations) for details about setting up Forwarding rules for the integrations.

Refer to the *On-premises Management Console User Guide* for details about forwarding alert details to a Webhook server.

### Test forwarding rules

Test the connection between the sensor and selected partner server defined in your Forwarding rules.

**To test the connection:**

1. Select the rule form the Forwarding rule dialog box.

2. Select the **More** box.

3. Select **Send Test Message**.

4. Navigate to your partner system to verify that the information sent by the sensor was received.

### Edit and delete forwarding rules 

**To edit a forwarding rule:**

  - In the Forwarding Rule screen, select **Edit** under the **More** drop-down menu. Make the desired changes and select **Submit**.

**To remove a forwarding rule:**

  - In the Forwarding Rule screen, select **Remove** under the **More** drop-down menu. In the Warning dialog box, select **OK**.

### Forwarding rules and alert exclusion rules

Alert Exclusion Rules may also have been defined by the administrator. These rules help administrators achieve more granular control over alert triggering by instructing the sensor to *ignore* alert events based on various parameters, for example asset addresses, alert names, or specific sensors.

This means the Forwarding Rules you define may be ignored based on Exclusion Rules created by your administrator. Exclusion Rules are defined in the on-premises management console.
