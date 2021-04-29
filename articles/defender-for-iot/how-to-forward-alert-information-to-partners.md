---
title: Forward alert information
description: You can send alert information to partner systems by working with forwarding rules.
ms.date: 12/02/2020
ms.topic: how-to
---

# Forward alert information

You can send alert information to partners who are integrating with Azure Defender for IoT, to syslog servers, to email addresses, and more. Working with forwarding rules lets you quickly deliver alert information to security stakeholders.  

Syslog and other default forwarding actions are delivered with your system. More forwarding actions might become available when you integrate with partner vendors, such as Microsoft Azure Sentinel, ServiceNow, or Splunk.

:::image type="content" source="media/how-to-work-with-alerts-sensor/alert-information-screen.png" alt-text="Alert information.":::

Defender for IoT administrators have permission to use forwarding rules.

## About forwarded alert information

Alerts provide information about an extensive range of security and operational events. For example:

  - Date and time of the alert

  - Engine that detected the event

  - Alert title and descriptive message

  - Alert severity

  - Source and destination name and IP address

  - Suspicious traffic detected

:::image type="content" source="media/how-to-work-with-alerts-sensor/address-scan-detected-screen.png" alt-text="Address scan detected.":::

Relevant information is sent to partner systems when forwarding rules are created.

## Create forwarding rules

To create a new forwarding rule:

1. Select **Forwarding** on the side menu.

   ::image type="content" source="media/how-to-work-with-alerts-sensor/create-forwarding-rule-screen.png" alt-text="Create a Forwarding Rule icon.":::

2. Select **Create Forwarding Rule**.

   :::image type="content" source="media/how-to-work-with-alerts-sensor/create-a-forwardong-rule.png" alt-text="Create a new forwarding rule.":::

3. Enter the name of the forwarding rule.

### Forwarding rule criteria 

Define criteria by which to trigger a forwarding rule. Working with forwarding rule criteria helps pinpoint and manage the volume of information sent from the sensor to external systems. The following options are available:

**Protocols**: Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

**Engines**: Select the required engines or choose them all. Alerts from selected engines will be sent.

**Severity levels**: This is the minimum incident to forward, in terms of severity level. For example, if you select **Minor**, minor alerts and any alert above this severity level will be forwarded. Levels are predefined.

### Forwarding rule actions

Forwarding rule actions instruct the sensor to forward alert information to partner vendors or servers. You can create multiple actions for each forwarding rule.

In addition to the forwarding actions delivered with your system, other actions might become available when you integrate with partner vendors. 

#### Email address action

Send mail that includes the alert information. You can enter one email address per rule.

To define email for the forwarding rule:

1. Enter a single email address. If more than one mail needs to be sent, create another action.

2. Enter the time zone for the time stamp for the alert detection at the SIEM.

3. Select **Submit**.

#### Syslog server actions

The following formats are supported:

- Text messages

- CEF messages

- LEEF messages

- Object messages

:::image type="content" source="media/how-to-work-with-alerts-sensor/create-actions-rule.png" alt-text="Create forwarding rule actions.":::

Enter the following parameters:

- Syslog host name and port.

- Protocol TCP and UDP.

- Time zone for the time stamp for the alert detection at the SIEM.

- TLS encryption certificate file and key file for CEF servers (optional).
    
:::image type="content" source="media/how-to-work-with-alerts-sensor/configure-encryption.png" alt-text="Configure your encryption for your forwarding rule.":::

| Syslog text message output fields | Description |
|--|--|
| Date and time | Date and time that the syslog server machine received the information. |
| Priority | User.Alert |
| Hostname | Sensor IP address |
| Protocol | TCP or UDP |
| Message | Sensor: The sensor name.<br /> Alert: The title of the alert.<br /> Type: The type of the alert. Can be **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**.<br /> Severity: The severity of the alert. Can be **Warning**, **Minor**, **Major**, or **Critical**.<br /> Source: The source device name.<br /> Source IP: The source device IP address.<br /> Destination: The destination device name.<br /> Destination IP: The IP address of the destination device.<br /> Message: The message of the alert.<br /> Alert group: The alert group associated with the alert. |


| Syslog object output | Description |
|--|--|
| Date and Time |	Date and time that the syslog server machine received the information. |  
| Priority |	User.Alert | 
| Hostname |	Sensor IP | 
| Message |	Sensor name: The name of the appliance. <br /> Alert time: The time that the alert was detected: Can vary from the time of the syslog server machine, and depends on the time-zone configuration of the forwarding rule. <br /> Alert title: The title of the alert. <br /> Alert message: The message of the alert. <br /> Alert severity: The severity of the alert: **Warning**, **Minor**, **Major**, or **Critical**. <br /> Alert type: **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**. <br /> Protocol: The protocol of the alert.  <br /> **Source_MAC**: IP address, name, vendor, or OS of the source device. <br /> Destination_MAC: IP address, name, vendor, or OS of the destination. If data is missing, the value will be **N/A**. <br /> alert_group: The alert group associated with the alert. |


| Syslog CEF output format | Description |
|--|--|
| Date and time | Date and time that the syslog server machine received the information. |
| Priority | User.Alert | 
| Hostname | Sensor IP address |
| Message | CEF:0 <br />Azure Defender for IoT <br />Sensor name: The name of the sensor appliance. <br />Sensor version <br />Alert title: The title of the alert. <br />msg: The message of the alert. <br />protocol: The protocol of the alert. <br />severity: **Warning**, **Minor**, **Major**, or **Critical**. <br />type: **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**. <br /> start: The time that the alert was detected. <br />Might vary from the time of the syslog server machine, and depends on the time-zone configuration of the forwarding rule. <br />src_ip: IP address of the source device.  <br />dst_ip: IP address of the destination device.<br />cat: The alert group associated with the alert.  |

| Syslog LEEF output format | Description |
|--|--|
| Date and time |	Date and time that the syslog server machine received the information. |  
| Priority |	User.Alert | 
| Hostname |	Sensor IP |
| Message |	Sensor name: The name of the Azure Defender for IoT appliance. <br />LEEF:1.0 <br />Azure Defender for IoT <br />Sensor  <br />Sensor version <br />Azure Defender for IoT Alert <br />title: The title of the alert. <br />msg: The message of the alert. <br />protocol: The protocol of the alert.<br />severity: **Warning**, **Minor**, **Major**, or **Critical**. <br />type: The type of the alert: **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**. <br />start: The time of the alert. Note that it might be different from the time of the syslog server machine. (This depends on the time-zone configuration.) <br />src_ip: IP address of the source device.<br />dst_ip: IP address of the destination device. <br />cat: The alert group associated with the alert. |

After you enter all the information, select **Submit**.

#### NetWitness action

Send alert information to a NetWitness server.

To define NetWitness forwarding parameters:

1. Enter NetWitness **Hostname** and **Port** information.

2. Enter the time zone for the time stamp for the alert detection at the SIEM.

   :::image type="content" source="media/how-to-work-with-alerts-sensor/add-timezone.png" alt-text="Add a time zone to your forwarding rule.":::

3. Select **Submit**.

#### Integrated vendor actions

You might have integrated your system with a security, device management, or other industry vendor. These integrations let you:

  - Send alert information.

  - Send device inventory information.

  - Communicate with vendor-side firewalls.

Integrations help bridge previously siloed security solutions, enhance device visibility, and accelerate system-wide response to more rapidly mitigate risks.

Use the actions section to enter the credentials and other information required to communicate with integrated vendors.

For details about setting up forwarding rules for the integrations, refer to the relevant partner integration articles.

### Test forwarding rules

Test the connection between the sensor and the partner server that's defined in your forwarding rules:

1. Select the rule from the **Forwarding rule** dialog box.

2. Select the **More** box.

3. Select **Send Test Message**.

4. Go to your partner system to verify that the information sent by the sensor was received.

### Edit and delete forwarding rules 

To edit a forwarding rule:

- On the **Forwarding Rule** screen, select **Edit** under the **More** drop-down menu. Make the desired changes and select **Submit**.

To remove a forwarding rule:

- On the **Forwarding Rule** screen, select **Remove** under the **More** drop-down menu. In the **Warning** dialog box, select **OK**.

### Forwarding rules and alert exclusion rules

The administrator might have defined alert exclusion rules. These rules help administrators achieve more granular control over alert triggering by instructing the sensor to ignore alert events based on various parameters. These parameters might include device addresses, alert names, or specific sensors.

This means that the forwarding rules you define might be ignored based on exclusion rules that your administrator has created. Exclusion rules are defined in the on-premises management console.

## See also

[Accelerate alert workflows](how-to-accelerate-alert-incident-response.md)
