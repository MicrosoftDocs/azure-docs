---
title: Work with alerts sensor
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/08/2020
ms.topic: article
ms.service: azure
---

# Work with alerts sensor

## Overview

Work with alerts to help you enhance the security and operation of your network. Alerts provide you with information about:

  - Deviations from authorized network activity

  - Protocol and operational anomalies

  - Suspected malware traffic

:::image type="content" source="media/how-to-work-with-alerts-sensor/image159.png" alt-text="Address Scan Detected":::

Alert management options let users:

  - Instruct sensors to learn activity detected as authorized traffic.

  - Acknowledge reviewing the alert.

  - Instruct sensors to mute events detected with identical assets and comparable traffic.

Additional tools are available that help you enhance and expedite the alert investigation. For example:

  - Add instructional comments for alert reviewers. See [Accelerate Incident Workflow with Alert Comments](./accelerate-incident-workflow-with-alert-comments.md).

  - Create Alert Groups for display at SOC solutions. See [Accelerate Incident Workflow with Alert Grouping](./accelerate-incident-workflow-with-alert-grouping.md).

  - Search for specific alerts; review related PCAP files; view the detected assets and other connected assets in the Asset Map or send alert details to 3rd party systems.

  - Forward alerts to 3<sup>rd</sup> party vendors, for example SIEM systems, MSSP systems, and more.

### Alerts and engines

Alerts are triggered when sensor engines detect changes in network traffic and behavior that require your attention. This section describes the kind of alerts each engine triggers.

See [Engines](./engines.md) for more information about the engines.

| | |
|-|-|
| Policy violation alerts | Triggered when the Policy Violation engine detects a deviation from traffic previously learned. For example: <br /> A new asset is detected.  <br /> A new configuration is detected on an asset. <br /> An asset not defined as a programming device carries out a programming change. <br /> A firmware version changed. |
| Protocol violation alerts | Triggered when the Protocol Violation engine detects packet structures or field values that don't comply with the protocol specification. |  |
| Operational alerts | Triggered when the Operational engine detects network operational incidents or asset malfunctioning. For example, a network asset was stopped using a Stop PLC command | or an interface on a sensor stopped monitoring traffic. |
| Malware alerts | Triggered when the Malware engine detects malicious network activity. For example, known attacks such as Conficker. |
| Anomaly alerts | Triggered when the Anomaly engine detects a deviation. For example an asset is performing network scanning but is not defined as a scanning asset. |

See [Customized Alert Rules](./customized-alert-rules.md) and [Trigger Horizon Custom Alerts](./trigger-horizon-custom-alerts.md) for information about alternative methods for triggering alerts.

### Accessing alerts

This section describes how to access and search for alerts in the Alerts window. Alerts are also accessible from the Dashboard. See [The Dashboard](./the-dashboard.md) for details about accessing alerts from this location.

**To view alerts triggered for your sensor:**

1. Select **Alerts** from the side-menu. The Alert window displays the alerts detected by your sensor.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image160.png" alt-text="Alerts":::

## Alert Views

You can view alerts according to various categories from the **Alerts, Main View**, and use search features to help you find alerts of interest. Select the alert required to review details and manage the event.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image161.png" alt-text="Learning":::

|                     |                           |
| ------------------- | ------------------------- |
| **Important Alerts**    | Alerts sorted by importance.|
| **Pinned Alerts**       | Alerts that were pinned by the user for further investigation. Pinned alerts are not archived, and are stored for 14 days in the Pinned folder |
| **Recent Alerts**       | Alerts sorted by time.    |
| **Acknowledged Alerts** | Displays alerts that were Acknowledged/Unhadbled or Muted/Unmuted.   |
| **Archived Alerts**     | Alerts that were archived automatically by the system. Accessible by the Admin user only. |

### Search for alerts of interest

The Alerts main view provides various search features to help you find alerts of interest.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image162.png" alt-text="Alerts Learning":::

### Text search 

Use the **Free Search** option to search for alerts by text, numbers or characters.

**To search:**

  - Type the required text in the **Free Search** field and select Enter on your keyboard.

**To clear the search:**

  - Delete the text in the **Free Search** field and select Enter on your keyboard.

### Asset group or asset IP search

Search for alerts that reference specific IP addresses or *Device Groups.* Device Groups are created in the Asset map.

**To use Advanced Filters:**

1. Select **Advanced Filters** from the Alerts Main view.

2. Choose a Device group or an asset(s).

3. Select **Confirm**.

4. To clear the search, select **Clear All**.

### Security vs. operational alert search

Toggle between viewing Operation and Security alerts:

  - **Security** alerts represent potential Malware traffic detected, network anomalies, policy and protocol violations.

  - **Operational** alerts represent network anomalies, policy and protocol violations.

When none of the options is selected, all the alerts are displayed.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image163.png" alt-text="Security":::

## Information provided in alerts

Select an alert from the Alerts window to review alert details. The following information is provided in alerts:

  - ***Alert Metadata***

  - ***Information about Traffic, Assets and the Event***

  - ***Link to Connected Assets in the Asset Map***

  - ***Comments Defined by Security Analysts and Administrators***

  - ***Recommendations for Investigating the Event***

### Alert metadata

The following alert metadata is displayed.

  - Alert ID

  - Policy engine that triggered the alert

  - Date and time the alert was triggered

:::image type="content" source="media/how-to-work-with-alerts-sensor/image164.png" alt-text="Unauthorized":::

### Information about traffic, assets and the event

The alert message provides information about:

  - The detected assets.

  - The traffic detected between the assets, for example: protocols and function codes.

  - Insights into the implications of the event.

You can use this information when deciding how to manage the alert event.

### Link to connected assets in the asset map

To learn more about assets connected to the assets detected, you can select an asset image in the alert and view connected assets in the Map.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image165.png" alt-text="RPC Operation Failed":::

The map filters to the asset you selected, and other assets connected to it. The Quick Properties dialog box for the assets detected in the alerts is displayed on the map as well.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image166.png" alt-text="Assets":::

### Comments defined by security analysts and administrators 

Alerts may include a list of predefined comments, for example with instructions regarding mitigation actions to take, or names of individuals to contact regarding the event.

When managing an alert event, you can choose the comment or comments that best reflect the event status or steps you have taken to investigate the alert.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image167.png" alt-text="Suspicion":::

Selected comments are saved in the alert message. Working with comments enhances commination between individuals and teams during the investigation of an alert event, and as a result, can accelerate incident response time.

Comments are pre-defined by Administrator or Security Analyst users. Selected comments are not forwarded to 3<sup>rd</sup>, party systems defined in Forwarding rules.

See [Accelerate Incident Workflow with Alert Comments](./accelerate-incident-workflow-with-alert-comments.md) for details about creating comments.

## Investigate Alert Events

After reviewing the information provided in an alert, you can carry out various forensic steps to guide you in managing the alert event. For example,

  - Analyze recent asset activity (Data Mining Report). See [Data Mining Reports](./data-mining-reports.md) for details.

  - Analyze other events that occurred at the same time (Event Timeline) See [Event Timeline](./event-timeline.md) for details.

  - Analyze comprehensive event traffic (PCAP file)

#### PCAP files

In some cases, a PCAP file can be accessed from the alert message. This may be more useful if you wanted more detailed information about the associated network traffic.

To download a PCAP file, select :::image type="content" source="media/how-to-work-with-alerts-sensor/image168.png" alt-text="download"::: at the upper right of the Alert details dialog box.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image169.png" alt-text="Device is Suspected":::

:::image type="content" source="media/how-to-work-with-alerts-sensor/image170.png" alt-text="CyberX XSense":::

### Recommendations for investigating the event 

Information that may help you better understand the alert event is displayed in the **Manage this Event** section. Review this information before managing the alert event or taking action on the asset or the network.

## Manage the Alert Event

The following options are available for managing alert events:

|             |                          |
| ----------- | ------------------------ |
| **Learn**       | Authorize the event detected. See ***About Learning and Unlearning Events*** for details.   |
| **Acknowledge** | Hide the alert once for the detected event. The alert will be triggered again if the event is detected again. See ***About Acknowledging and Unacknowledging Events*** for details. |
| **Mute**        | Continuously ignore activity with identical assets and comparable traffic. See ***About Muting and Unmuting Events*** for details.|

### About learning and unlearning events

Events that indicate deviations of the learned network may reflect valid network changes. For example, a new authorized asset that joined the network or an authorized firmware update.

When you select *Learn*, the sensor considers traffic, configurations or activity valid. This means alerts will no longer be triggered for the event and the event will not be calculated when generating Risk Assessment, Attack Vector, and other reports.

For example, you receive an alert indicating address scanning activity on an asset not previously defined by a network scanner. If this asset was added to the network for the purpose of scanning, you may instruct the sensor to learn the asset as a scanning device.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image171.png" alt-text="Address Scan Detected":::

Learned events can be *Unlearned*. When unlearned the sensor will retrigger, alerts relate to this event.

### About acknowledging and unacknowledging events

In certain situations, you may *not* want to learn the event detected, or the option may not be available. Instead, the incident may require mitigation. For example,

|                                            |                                       |
|--------------------------------------------|-------------------------------------- |
| **Mitigate a network configuration or device** | You receive an alert indicating that a new asset was detected on the network. When investigating, you discover that the asset is an unauthorized network device.</br>The incident is handled by disconnecting the asset from the network.  |
| **Update a sensor configuration**              | You receive an alert indicating that an excessive number of remote connections were initiated with a server. This alert was triggered because the sensor anomaly thresholds were defined to alert trigger alerts above (x) sessions within (x) one minute. The incident is handled by updating the thresholds. |

Once mitigation or investigation is carried out, you can instruct the sensor to hide the alert by selecting *Acknowledge*. If the event is detected again, the alert will be retriggered.

**To hide the alert:**

  - Select **Acknowledge.**

**To view the alert again.**

  - Access the alert and select **Unacknowledge**.

*Unacknowledge* alerts if further investigation is required.

### About muting and unmuting events

Under certain circumstances, you may want to instruct your sensor to ignore a specific scenario on your network. For example,

  - The Anomaly engine triggers an alert on a spike in bandwidth between two assets, but the spike is valid for these assets.

  - The Protocol Violation engine triggers an alert on a protocol deviation detected between two assets, but the deviation is valid between the assets.

In these situations, learning is not available. When learning cannot be carried out and you want to suppress the alert and remove the asset when calculating risks and attack vectors, you can mute the alert event instead.

> [!NOTE] 
> You cannot mute events in which an internet device is defined as the source or destination.

#### What traffic is muted?

A muted scenario will include the network asset(s) and traffic detected for an event. The traffic being muted is described in the alert title.

The asset or assets being muted will be displayed as an image in the alert. If two assets are shown, the traffic between will both be muted.

**Example 1**

When muted, the event is ignored any time this Master (source) sends this slave (destination) an illegal function code as defined by the vendor.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image172.png" alt-text="Slave Device Received":::

**Example 2**

When muted, the event is ignored any time the source sends an HTTP header with illegal content, regardless of the destination.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image173.png" alt-text="Illegal HTTP Header Content":::

**Once muted:**

  - The alert will be accessible in the Acknowledged alert view until it is unmuted.

  - The Mute action will be displayed in the Event Timeline.

    :::image type="content" source="media/how-to-work-with-alerts-sensor/image174.png" alt-text="Event Detected and Muted":::

  - The sensor will recalculate assets when generating Risk Assessment reports, Attack Vectors and other reports. For example, if you muted an Alert that detected malicious traffic on an asset, that asset will not be calculated in the Risk Assessment report.

**To mute/unmute an alert:**

1. Select the mute icon on the alert.

    :::image type="content" source="media/how-to-work-with-alerts-sensor/image175.png" alt-text="RPC operation failed":::

**To view muted alerts:**

1. Select the Acknowledged option form the Alerts main screen.

2. Hover over an alert to see if it muted

    :::image type="content" source="media/how-to-work-with-alerts-sensor/image176.png" alt-text="Alerts":::

## Generate a PDF for an alert event

You can generate a PDF report with alert event information.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image177.png" alt-text="Alert Report":::

**To generate a PDF:**

1. Select the PDF icon from the alert.

   :::image type="content" source="media/how-to-work-with-alerts-sensor/image178.png" alt-text="MODBUS Device":::

### Alert window options

Alert messages provide the following actions:

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image179.png" alt-text="tick":::to acknowledge an alert

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image180.png" alt-text="Tick":::to unacknowledge an alert

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image181.png" alt-text="pin"::: to pin an alert

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image182.png" alt-text="unpin":::to unpin an alert

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image183.png" alt-text="acknowledge"::: to acknowledge all alerts

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image184.png" alt-text="learn"::: to learn and acknowledge all the alerts

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image185.png" alt-text="CSV"::: to export the alert list to a CSV file and select the export option. Choose Alert Export for the regular export to CSV option or Extended Alert Export for the possibility to add a separate row for each additional info about an alert in the alert export CSV file.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image36.png" alt-text="PDF"::: icon to download an alert report as a PDF file.

  - Select the :::image type="content" source="https://www.wireshark.org/" alt-text="download](media/how-to-work-with-alerts-sensor/image38.png) icon to download the PCAP file, viewable with [<span class="underline">Wireshark</span>":::, the free network protocol analyzer.

  - Select :::image type="content" source="https://www.wireshark.org/" alt-text="packets](media/how-to-work-with-alerts-sensor/image39.png) to download a filtered PCAP file that contains only the alert-relevant packets, thereby reducing output file size and allowing a more focused analysis. You can view it using <span class="underline">[Wireshark":::.</span>

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image186.png" alt-text="Event"::: icon to show the Alert in the Event Timeline.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image181.png" alt-text="Pin"::: icon to pin the alert.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image182.png" alt-text="Unpin":::icon to unpin the alert.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image42.png) icon to approve the traffic (Security Analysts and Administrators only" alt-text="Learn":::.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image187.png" alt-text="Close":::icon to close the alert details window.

  - Select an asset to display it in the Asset Map.

## Alerts and sensor reporting

Events reflected in alerts may be calculated when generating Data Mining, Risk Assessment and Attack Vector reports. When you manage these events, the sensor updates the reports accordingly.

For example,

  - Unauthorized connectivity between and asset in a defined subnet and devices located outside the subnet (public) will appear in the Data Mining *Internet Activity* report and Risk Assessment *Internet Connections* section. Once authorized (Learned) these assets will not be calculated when generating these reports.

  - Malware events are reported in Risk Assessment reports. When alerts about these events are muted these assets will not be calculated when generating these reports.

## Accelerate incident workflow with alert comments

Work with alert comments improve communication between individuals and teams during the investigation of an alert event.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image167.png" alt-text="Malicious Activity":::

Use alert commenting to improve:

  - **Workflow Steps**: Provide guidelines regarding alert mitigations steps.

  - **Workflow follow-up**: Notify that steps were taken.

  - **Workflow guidance**: Provide recommendations, insights or warnings about the event.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image188.png" alt-text="Alert Comments":::

The list of available options appears in each Alert. Users can select one or several messages.

**To add alert comments:**

1. On the side menu, select **System Settings**.

2. In the **System Setting** window, select **Alert Comments**.

3. In the **Add comments** box, type the comment text. Use up to 50 characters; do not use commas.

4. Select **Add**.

## Accelerate incident workflow with alert grouping

*Alert Groups* let SOC teams view and filter alerts in their SIEM solutions and manage them based on enterprise security policies and business priorities. For example, alerts regarding new detections are organized in a **Discovery** group. This group includes alerts that deal with new assets detected, new VLANs detected, new user accounts, new MAC addresses detected and more.

Alert grouping is applied when Forwarding Rules are created for the following 3rd party solutions:

  - SYSLOG servers

  - QRadar

  - ArcSight

:::image type="content" source="media/how-to-work-with-alerts-sensor/image189.png" alt-text="Create Forwarding Rule":::

The relevant Alert Group appears in 3rd party output solutions. In the example below, the *Discovery* Alert Group is displayed.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image190.png" alt-text="TimeGenerated UTC":::

**Requirements**

The Alert Group will be shown in supported 3rd party solutions with the following prefixes:

  - **cat** for QRadar, ArcSight, Syslog CEF, Syslog LEEF

  - **Alert Group** for Syslog Text Messages

  - **alert_group** for Syslog Object

These fields should be configured in the 3rd party solution to display the Alert Group name. If there is no alert associated with an Alert Group, the field in the 3rd party solution will display **NA**.

**Default Alert Groups**

The following Alert Groups are automatically defined:
|  |  |  |
|--|--|--|
| Abnormal Communication Behavior | Custom Alerts | Remote access |
| Abnormal HTTP Communication Behavior | Discovery | Restart/ Stop Commands |
| Authentication | Firmware change | Scan |
| Unauthorized Communication Behavior | Illegal commands | Sensor traffic |
| Bandwidth Anomalies | Internet Access | Suspicion of Malware |
| Buffer overflow | Operation Failures | Suspicion of malicious activity |
| Command Failures | Operational issues |  |
| Configuration changes | Programming |  |

Alert Groups are pre-defined. Contact [support.microsoft.com](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099) for details about alerts associated with Alert Groups, and about creating custom Alert Groups.

## Forward alert information to 3rd parties

You can send alert information to 3<sup>rd</sup> party systems by working with *Forwarding Rules*. For example, forward alert information to an email server, SYSLOG server or Webhook server. Working with Forwarding Rules lets you monitor and respond to alerts from a single-pane-of-glass.

SYSLOG and other default forwarding actions are delivered with your system. In addition, other forwarding actions may become available when you integrate with 3rd party vendors, such as Microsoft Sentinel, ServiceNow or Splunk. Working with Forwarding Rules let you monitor and respond to alerts from a single-pane-of-glass.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image191.png" alt-text="Alert information":::

> [!NOTE] 
> **Administrators** may perform the procedures described in this section.

### About alert information forwarded

Alerts provide information about an extensive range of security and operational events, for example:

  - Date and time of the alert

  - Engine that detected the event

  - Alert title and descriptive message

  - Alert Severity

  - Source and destination name and IP

  - Suspicious traffic detected

  - And more.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image159.png" alt-text="Address Scan Detected":::

Relevant information is sent to 3<sup>rd</sup> party systems when Forwarding Rules are created.

### Create forwarding rules

This section describes how to create forwarding rules.

**To create a new forwarding rule:**

1. Select **Forwarding** on the side menu.

   :::image type="content" source="media/how-to-work-with-alerts-sensor/image192.png" alt-text="Forwarding":::

2. Select **Create Forwarding Rule.**

   :::image type="content" source="media/how-to-work-with-alerts-sensor/image193.png" alt-text="Create forwarding rule":::

3. Enter the Name of the Forwarding Rule.

#### Forwarding rule criteria 

Define criteria by which to trigger a Forwarding rule. Working with Forwarding rule criteria helps pinpoint and manage the volume of information sent from the sensor to external systems. The following options are available:

**Protocols:** Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

**Engines:** Select the required engines or choose them all. Alerts from selected engines will be sent.

**Severity levels:** This is the minimum-security level incident to forward. For example, if Minor is selected, minor alerts <span class="underline">and any alert above this severity level will be forwarded.</span> Levels are pre-defined.

#### Forwarding rule actions

Forwarding rule actions instruct the sensor to forward alert information to 3<sup>rd</sup> party vendors or systems. You can create multiple actions for each Forwarding rule.

In addition to the Forwarding actions delivered with your system, other actions may become available when you integrate with 3rd party vendors. See ***Integrated Vendor Actions*** for details

### Email address action

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


| SYSLOG OBJECT Output |  |
|--|--|
| Date/Time |	Date and time the syslog server machine received the information |  
| Priority |	User.Alert | 
| Hostname |	Sensor IP | 
| Message |	Sensor Name: the name of the appliance <br /> Alert Time: the time the alert was detected: May vary from the time of the syslog server machine depends on the Forwarding rule timezone configuration. <br /> Alert Title: the title of the alert <br /> Alert Message: the message of the alert <br /> Alert Severity: the severity of the alert: Warning, Minor, Major or Critical <br /> Alert Type: Protocol Violation Policy Violation, Malware, Anomaly or Operational <br /> Protocol: the protocol of the alert  <br /> Source_MAC/IP/name/Vendor/OS of the source device <br /> Destination_MAC/IP/name/vendor/OS of the destination. If data is missing the value will be “N/A”.  <br /> alert_group The Alert Group associated with the alert. See Accelerate Incident Workflow with Alert GroupingAccelerate Incident Workflow with Alert Grouping for details. |


| SYSLOG CEF Output Format |  |
|--|--|
| Date/Time | Date/Time the syslog server machine received the information. |
| Priority | User.Alert |  |
| Hostname | Sensor IP |  |
| Message | CEF:0 <br />Azure Defender for IoT <br />Sensor Name – the name of the Sensor appliance <br />Sensor Version <br />Alert <br /> title – the title of the alert <br />msg – the message of the alert <br />protocol – the protocol of the alert <br />severity – Warning, Minor, Major or Critical <br />type – Protocol Violation, Policy Violation, Malware, Anomaly, or Operational <br /> start – the time the alert was detected <br />May vary from the time of the syslog server machine, depends on the Forwarding rule timezone configuration. <br />src_ip – source device IP  <br />dst_ip – destination device IP <br />cat - The Alert Group associated with the alert. See Accelerate Incident Workflow with Alert GroupingAccelerate Incident Workflow with Alert Grouping for details. |


| SYSLOG LEEF Output Format | |
|--|--|
| Date/Time |	Date/Time the syslog server machine received the information |  
| Priority |	User.Alert | 
| Hostname |	Sensor IP | |
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

Test the connection between the sensor and selected 3<sup>rd</sup> party server defined in your Forwarding rules.

**To test the connection:**

1. Select the rule form the Forwarding rule dialog box.

2. Select the **More** box.

3. Select **Send Test Message**.

4. Navigate to your 3<sup>rd</sup> party system to verify that the information sent by the sensor was received.

### Edit and delete forwarding rules 

**To edit a forwarding rule:**

  - In the Forwarding Rule screen, select **Edit** under the **More** drop-down menu. Make the desired changes and select **Submit**.

**To remove a forwarding rule:**

  - In the Forwarding Rule screen, select **Remove** under the **More** drop-down menu. In the Warning dialog box, select **OK**.

### Forwarding rules and alert exclusion rules

Alert Exclusion Rules may also have been defined by the administrator. These rules help administrators achieve more granular control over alert triggering by instructing the sensor to *ignore* alert events based on various parameters, for example asset addresses, alert names, or specific sensors.

This means the Forwarding Rules you define may be ignored based on Exclusion Rules created by your administrator. Exclusion Rules are defined in the on-premises management console.

## Customized alert rules

You can add custom alert rules based on information detected by the sensor. For example, define a rule that instructs the sensor to trigger an alert based on a Source IP, Destination IP, Command (within a protocol), or other values. When the sensor detects the traffic defined in the rule, an Alert or event is generated.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image267.png" alt-text="create rule":::

To create a customized rule:

1.  Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image268.png" alt-text="create a customized rule":::, Or *Click here.*

2. Choose Category/ Protocol.

3. Provide rule name.

4. Choose IP or MAC port and/or destination or leave empty to define “Any”.

5. Add a condition, A list of conditions and their properties is unique for each category.

6. It possible to select more than one condition.

7. Indicate if the rule trigger an Alarm or Event.

8. Select Severity.

9. Select if the rule will include a PCAP file.

10. Save. The rule is added to the Rules list and the user has an option to:


    - See basic rule parameters
  
    - See when the rule occurred last time
  
    - Enable/Disable rule
  
    - Modify/Delete rule
  
    - The user can Delete/Enable/Disable rule by multiple selection

      :::image type="content" source="media/how-to-work-with-alerts-sensor/image269.png" alt-text="customized alert":::

      If the customized alarm is triggered, the alert message indicates that a user-defined rule was created triggered the alert.

      :::image type="content" source="media/how-to-work-with-alerts-sensor/image270.png" alt-text="user defind rule":::


