---
title: Forward on-premises OT alert information to partners - Microsoft Defender for IoT
description: Learn how to forward OT alert details from an OT sensor or on-premises management console to partner services.
ms.date: 01/01/2023
ms.topic: how-to
---

# Forward on-premises OT alert information

Microsoft Defender for IoT alerts enhance your network security and operations with real-time details about events logged in your network. OT alerts are triggered when OT network sensors detect changes or suspicious activity in network traffic that needs your attention.

This article describes how to configure your OT sensor or on-premises management console to forward alerts to partner services, syslog servers, email addresses, and more. Forwarded alert information includes details like:

:::row:::
    :::column:::
    - Date and time of the alert
    - Engine that detected the event
    - Alert title and descriptive message
    - Alert severity
    :::column-end:::
    :::column:::
    - Source and destination name and IP address
    - Suspicious traffic detected
    - Disconnected sensors
    - Remote backup failures
    :::column-end:::
:::row-end:::

> [!NOTE]
> Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created are not affected by the rule.

## Prerequisites

- Depending on where you want to create your forwarding alert rules, you need to have either an [OT network sensor or on-premises management console installed](how-to-install-software.md), with access as an **Admin** user.

    For more information, see [Install OT agentless monitoring software](how-to-install-software.md) and [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- You also need to define SMTP settings on the OT sensor or on-premises management console.

    For more information, see [Configure SMTP mail server settings on an OT sensor](how-to-manage-individual-sensors.md#configure-smtp-mail-server-settings) and [Configure SMTP mail server settings on the on-premises management console](how-to-manage-the-on-premises-management-console.md#configure-smtp-mail-server-settings).

## Create forwarding rules on an OT sensor

1. Sign into the OT sensor and select **Forwarding** on the left-hand menu > **+ Create new rule**.

1. In the **Add forwarding rule** pane, enter a meaningful rule name, and then define rule conditions and actions as follows:

    |Name  |Description  |
    |---------|---------|
    |**Minimal alert level**     | Select the minimum [alert severity level](alert-engine-messages.md#alert-severities) you want to forward. <br><br>  For example, if you select **Minor**, minor alerts and any alert above this severity level are forwarded.     |
    |**Any protocol detected**     | Toggle on to forward alerts from all protocol traffic or toggle off and select the specific protocols you want to include.        |
    |**Traffic detected by any engine**     |  Toggle on to forward alerts from all [analytics engines](architecture.md#defender-for-iot-analytics-engines), or toggle off and select the specific engines you want to include.             |
    |**Actions**     | Select the type of server you want to forward alerts to, and then define any other required information for that server type. <br><br>To add multiple servers to the same rule, select **+ Add server** and add more details. <br><br>For more information, see [Configure alert forwarding rule actions](#configure-alert-forwarding-rule-actions).   |

1. When you're done configuring the rule, select **Save**. The rule is listed on the **Forwarding** page.

1. Test the rule you've created:

    1. Select the options menu (**...**) for your rule > **Send Test Message**.
    1. Go to the target service to verify that the information sent by the sensor was received.

### Edit or delete forwarding rules on an OT sensor

To edit or delete an existing rule:

1. Sign into your OT sensor and select **Forwarding** on the left-hand menu.

1. Select the options menu (**...**) for your rule, and then do one of the following:

    - Select **Edit** and [update the fields as needed](#create-forwarding-rules-on-an-ot-sensor). When you're done, select **Save**.

    - Select **Delete** > **Yes** to confirm the deletion.

## Create forwarding rules on an on-premises management console

**To create a forwarding rule on the management console**:

1. Sign in to the on-premises management console and select **Forwarding** on the left-hand menu.

1. Select the **+** button at the top-right to create a new rule.

1. In the **Create Forwarding Rule** window, enter a meaningful name for the rule, and then define rule conditions and actions as follows:

    |Name  |Description  |
    |---------|---------|
    |**Minimal alert level**     | At the top-right of the dialog, use the dropdown list to select the minimum [alert severity level](alert-engine-messages.md#alert-severities) that you want to forward.    <br><br>For example, if you select **Minor**, minor alerts and any alert above this severity level are forwarded.    |
    |**Protocols**     |   Select **All** to forward alerts from all protocol traffic, or select **Specific** to add specific protocols only.     |
    |**Engines**     |  Select **All** to forward alerts triggered by all sensor analytics engines, or select **Specific** to add specific engines only.       |
    |**System Notifications**     | Select the **Report System Notifications** option to notify about disconnected sensors or remote backup failures.        |
    |**Alert Notifications**     |  Select the **Report Alert Notifications** option to notify about an alert's date and time, title, severity, source and destination name and IP address, suspicious traffic, and the engine that detected the event.     |
    |**Actions**     |   Select **Add** to add an action to apply and enter any parameters values needed for the selected action. Repeat as needed to add multiple actions.  <br><br>For more information, see [Configure alert forwarding rule actions](#configure-alert-forwarding-rule-actions).    |

1. When you're done configuring the rule, select **SAVE**. The rule is listed on the **Forwarding** page.

1. Test the rule you've created:

    1. On the row for your rule, select the :::image type="icon" source="media/how-to-forward-alert-information-to-partners/run-button.png" border="false"::: **test this forwarding rule** button. A success notification is shown if the message sent successfully.
    1. Go to your partner system to verify that the information sent by the sensor was received.

### Edit or delete forwarding rules on an on-premises management console

To edit or delete an existing rule:

1. Sign into your on-premises management console and select **Forwarding** on the left-hand menu.

1. Find the row for your rule and then select either the :::image type="icon" source="media/how-to-forward-alert-information-to-partners/edit-button.png" border="false"::: **Edit** or :::image type="icon" source="media/how-to-forward-alert-information-to-partners/delete-icon.png" border="false"::: **Delete** button.

    - If you're editing the rule, [update the fields as needed](#create-forwarding-rules-on-an-on-premises-management-console) and select **SAVE**.

    - If you're deleting the rule, select **CONFIRM** to confirm the deletion.

## Configure alert forwarding rule actions

This section describes how to configure settings for supported forwarding rule actions, on either an OT sensor or the on-premises management console.

### Email address action

Configure an **Email** action to forward alert data to the configured email address.

In the **Actions** area, enter the following details:

|Name  |Description  |
|---------|---------|
|**Server**     | Select **Email**.        |
|**Email**     | Enter the email address you want to forward the alerts to. Each rule supports a single email address.        |
|**Timezone**    |  Select the time zone you want to use for the alert detection in the target system.  |

### Syslog server actions

Configure a Syslog server action to forward alert data to the selected type of Syslog server.

In the **Actions** area, enter the following details:

|Name  |Description  |
|---------|---------|
| **Server** | Select one of the following types of syslog formats: <br><br>- **SYSLOG Server (CEF format)** <br>- **SYSLOG Server (LEEF format)** <br>- **SYSLOG Server (Object)** <br>- **SYSLOG Server (Text Message)** |
| **Host** / **Port** | Enter the syslog server's host name and port
|**Timezone**    |  Select the time zone you want to use for the alert detection in the target system.  |
| **Protocol** | Supported for text messages only. Select **TCP** or **UDP**. |
| **Enable encryption** | Supported for CEF format only. Toggle on to configure a TLS encryption certificate file, key file, and passphrase. |

The following sections describe the syslog output syntax for each format.

#### Syslog text message output fields

| Name | Description |
|--|--|
| Priority | User. Alert |
| Message | CyberX platform name: The sensor name.<br /> Microsoft Defender for IoT Alert: The title of the alert.<br /> Type: The type of the alert. Can be **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**.<br /> Severity: The severity of the alert. Can be **Warning**, **Minor**, **Major**, or **Critical**.<br /> Source: The source device name.<br /> Source IP: The source device IP address.<br /> Protocol (Optional): The detected source protocol.<br /> Address (Optional): Source protocol address.<br /> Destination: The destination device name.<br /> Destination IP: The IP address of the destination device.<br /> Protocol (Optional): The detected destination protocol.<br /> Address (Optional): The destination protocol address.<br /> Message: The message of the alert.<br /> Alert group: The alert group associated with the alert. <br /> UUID (Optional): The UUID the alert. |

#### Syslog object output fields

| Name | Description |
|--|--|
| Priority | `User.Alert` |
| Date and Time | Date and time that the syslog server machine received the information. |
| Hostname | Sensor IP |
| Message | Sensor name: The name of the appliance. <br /> Alert time: The time that the alert was detected: Can vary from the time of the syslog server machine, and depends on the time-zone configuration of the forwarding rule. <br /> Alert title: The title of the alert. <br /> Alert message: The message of the alert. <br /> Alert severity: The severity of the alert: **Warning**, **Minor**, **Major**, or **Critical**. <br /> Alert type: **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**. <br /> Protocol: The protocol of the alert.  <br /> **Source_MAC**: IP address, name, vendor, or OS of the source device. <br /> Destination_MAC: IP address, name, vendor, or OS of the destination. If data is missing, the value is **N/A**. <br /> alert_group: The alert group associated with the alert. |

#### Syslog CEF output fields

| Name | Description |
|--|--|
| Priority | `User.Alert` |
| Date and time | Date and time that the sensor sent the information, in UTC format |
| Hostname | Sensor hostname |
| Message | *CEF:0* <br />Microsoft Defender for IoT/CyberX <br />Sensor name <br />Sensor version <br />Microsoft Defender for IoT Alert <br />Alert title <br />Integer indication of severity. 1=**Warning**, 4=**Minor**, 8=**Major**, or 10=**Critical**.<br />msg= The message of the alert. <br />protocol= The protocol of the alert. <br />severity= **Warning**, **Minor**, **Major**, or **Critical**. <br />type= **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**. <br />UUID= UUID of the alert  (Optional) <br /> start= The time that the alert was detected. <br />Might vary from the time of the syslog server machine, and depends on the time-zone configuration of the forwarding rule. <br />src_ip= IP address of the source device. (Optional) <br />src_mac= MAC address of the source device. (Optional)  <br />dst_ip= IP address of the destination device. (Optional)<br />dst_mac= MAC address of the destination device. (Optional)<br />cat= The alert group associated with the alert.  |

#### Syslog LEEF output fields

| Name | Description |
|--|--|
| Priority | `User.Alert` |
| Date and time | Date and time that the sensor sent the information, in UTC format |
| Hostname | Sensor IP |
| Message | Sensor name: The name of the Microsoft Defender for IoT appliance. <br />*LEEF:1.0* <br />Microsoft Defender for IoT <br />Sensor  <br />Sensor version <br />Microsoft Defender for IoT Alert <br />title: The title of the alert. <br />msg: The message of the alert. <br />protocol: The protocol of the alert.<br />severity: **Warning**, **Minor**, **Major**, or **Critical**. <br />type: The type of the alert: **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**. <br />start: The time of the alert. It might be different from the time of the syslog server machine, and depends on the time-zone configuration. <br />src_ip: IP address of the source device.<br />dst_ip: IP address of the destination device. <br />cat: The alert group associated with the alert. |

### Webhook server action

**Supported from the on-premises management console only**

Configure a **Webhook** action to configure an integration that subscribes to Defender for IoT alert events. For example, send alert data to a webhook server to update an external SIEM system, SOAR system, or incident management system.

When you've configured alerts to be forwarded to a webhook server and an alert event is triggered, the on-premises management console sends an HTTP POST payload to the configured webhook URL.

In the **Actions** area, enter the following details:

|Name  |Description  |
|---------|---------|
|**Server**     | Select **Webhook**.        |
|**URL**     | Enter the webhook server URL.        |
|**Key / Value**    | Enter key/value pairs to customize the HTTP header as needed. Supported characters include: <br>- **Keys** can contain only letters, numbers, dashes, and underscores. <br>- **Values** can contain only one leading and/or trailing space.  |

### Webhook extended

**Supported from the on-premises management console only**

Configure a **Webhook extended** action to send the following extra data to your webhook server:

- sensorID
- sensorName
- zoneID
- zoneName
- siteID
- siteName
- sourceDeviceAddress
- destinationDeviceAddress
- remediationSteps
- handled
- additionalInformation

In the **Actions** area, enter the following details:

|Name  |Description  |
|---------|---------|
|**Server**     | Select **Webhook extended**.        |
|**URL**     | Enter the endpoint data URL.        |
|**Key / Value**    | Enter key/value pairs to customize the HTTP header as needed. Supported characters include: <br>- **Keys** can contain only letters, numbers, dashes, and underscores. <br>- **Values** can contain only one leading and/or trailing space.  |

### NetWitness action

Configure a **NetWitness** action to send alert information to a NetWitness server.

In the **Actions** area, enter the following details:

|Name  |Description  |
|---------|---------|
|**Server**     | Select **NetWitness**.        |
|**Hostname / Port**     | Enter the NetWitness server's hostname and port. |
|**Time zone**    | Enter the time zone you want to use in the time stamp for the alert detection at the SIEM. |

## Configure forwarding rules for partner integrations

You might be integrating Defender for IoT with a partner service to send alert or device inventory information to another security or device management system, or to communicate with partner-side firewalls.

[Partner integrations](integrate-overview.md) can help to bridge previously siloed security solutions, enhance device visibility, and accelerate system-wide response to more rapidly mitigate risks.

In such cases, use supported **Actions** to enter credentials and other information required to communicate with integrated partner services.

For more information, see:

- [Integrate Fortinet with Microsoft Defender for IoT](tutorial-fortinet.md)
- [Integrate Qradar with Microsoft Defender for IoT](tutorial-qradar.md)

### Configure alert groups in partner services

When you configure forwarding rules to send alert data to Syslog servers, QRadar, and ArcSight, *alert groups* are automatically applied and are available in those partner servers.

*Alert groups* help SOC teams using those partner solutions to manage alerts based on enterprise security policies and business priorities. For example, alerts about new detections are organized into a *discovery* group, which includes any alerts about new devices, VLANs, user accounts, MAC addresses, and more.

Alert groups appear in partner services with the following prefixes:

|Prefix  |Partner service  |
|---------|---------|
|`cat`     |  [QRadar](tutorial-qradar.md), [ArcSight](integrations/arcsight.md), [Syslog CEF](#syslog-cef-output-fields), [Syslog LEEF](#syslog-leef-output-fields)       |
|`Alert Group`     |   [Syslog text messages](#syslog-text-message-output-fields)      |
|`alert_group`     | [Syslog objects](#syslog-object-output-fields)        |

To use alert groups in your integration, make sure to configure your partner services to display the alert group name.

By default, alerts are grouped as follows:

:::row:::
    :::column:::
    - Abnormal communication behavior
    - Custom alerts
    - Remote access
    - Abnormal HTTP communication behavior
    - Discovery
    - Restart and stop commands
    - Authentication
    - Firmware change
    - Scan
    - Unauthorized communication behavior
    - Illegal commands
    :::column-end:::
    :::column:::
    - Sensor traffic
    - Bandwidth anomalies
    - Internet access
    - Suspicion of malware
    - Buffer overflow
    - Operation failures
    - Suspicion of malicious activity
    - Command failures
    - Operational issues
    - Configuration changes
    - Programming
    :::column-end:::
:::row-end:::

For more information and to create custom alert groups, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c8f35-1b8e-f274-ec11-c6efdd6dd099).

## Troubleshoot forwarding rules

If your forwarding alert rules aren't working as expected, check the following details:

- **Certificate validation**. Forwarding rules for [Syslog CEF](#syslog-server-actions), [Microsoft Sentinel](integrate-overview.md#microsoft-sentinel), and [QRadar](tutorial-qradar.md) support encryption and certificate validation.

    If your OT sensors or on-premises management console are configured to [validate certificates](ot-deploy/create-ssl-certificates.md#verify-crl-server-access) and the certificate can't be verified, the alerts aren't forwarded.

    In these cases, the sensor or on-premises management console is the session's client and initiator. Certificates are typically received from the server or use asymmetric encryption, where a specific certificate is provided to set up the integration.

- **Alert exclusion rules**. If you have exclusion rules configured on your on-premises management console, your sensors might be ignoring the alerts you're trying to forward. For more information, see [Create alert exclusion rules on an on-premises management console](how-to-accelerate-alert-incident-response.md#create-alert-exclusion-rules-on-an-on-premises-management-console).

## Next steps

> [!div class="nextstepaction"]
> [Microsoft Defender for IoT alerts](alerts.md)
