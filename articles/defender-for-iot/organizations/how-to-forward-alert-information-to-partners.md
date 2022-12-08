---
title: Forward OT alert information to partners - Microsoft Defender for IoT
description: Learn how to forward OT alert details from an OT sensor or on-premises management console to partner services.
forwarding rules.
ms.date: 12/08/2022
ms.topic: how-to
---

# Forward OT alert information

Microsoft Defender for IoT alerts enhance your network security and operations with real-time details about events logged in your network. OT alerts are triggered when OT network sensors detect changes or suspicious activity in network traffic that need your attention.

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



## Prerequisites

- Depending on where you want to create your forwarding alert rules, you'll need to have either an [OT network sensor or on-premises management console installed](how-to-install-software.md), with access as an **Admin** user.

    For more information, see [Install OT agentless monitoring software](how-to-install-software.md) and [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- You'll also need to define SMTP settings on the OT sensor or on-premises management console. For more information, see:

    - [Configure SMTP settings on an OT sensor](how-to-manage-individual-sensors.md#configure-smtp-settings)
    - [Configure SMTP settings on an on-premises management console](how-to-manage-the-on-premises-management-console.md#mail-server-settings)

## Create forwarding rules on an OT sensor

1. Sign in to the OT sensor and select **Forwarding** on the left > **+ Create new rule**.

1. In the **Add forwarding rule** pane, enter a meaningful rule name, and then define rule conditions and actions as follows:

    |Name  |Description  |
    |---------|---------|
    |**Minimal alert level**     | Select the minimum [alert severity level](alert-engine-messages.md#alert-severities) you want to forward.        |
    |**Any protocol detected**     | Toggle on to forward alerts from all protocol traffic, or toggle off and select the specific protocols you want to include.        |
    |**Traffic detected by any engine**     |  Toggle on to forward alerts from all [analytics engines](architecture.md#analytics-engines), or toggle off and select the specific engines you want to include.             |
    |**Actions**     | Select the type of server you want to forward alerts to, and then define any other required information for that server type. To add multiple servers to the same rule, select **+ Add server** and add more details. <br><br>For more information, see [Supported forwarding rule actions](#supported-forwarding-rule-actions).       |

1. When you're done configuring the rule, select **Save**. The rule is listed on the **Forwarding** page

1. Test the rule you've just created.

    1. Select the options menu (**...**) for your rule > **Send Test Message**.
    1. Go to your partner system to verify that the information sent by the sensor was received.

### Edit or delete forwarding rules on an OT sensor

To edit or delete an existing rule:

1. Sign into your OT sensor and select **Forwarding** on the left.

1. Select the options menu (**...**) for your rule, and then do one of the following:

    - Select **Edit** and [update the fields as needed](#create-forwarding-rules-on-an-ot-sensor). When you're done, select **Save**.

    - Select **Delete** > **Yes** to confirm the deletion.

## Configure alert forwarding rule actions

This section describes how to configure settings for supported forwarding rule actions.

### Email address action

In the **Actions** area, enter the following details:

|Name  |Description  |
|---------|---------|
|**Server**     | Select **Email**.        |
|**Email**     | Enter the email address you want to forward the alerts to. Each rule supports a single email address.        |
|**Timezone**    |  Select the time zone you want to use for the alert detection in the target system.  |


### Syslog server actions

In the **Actions** area, enter the following details:

|Name  |Description  |
|---------|---------|
| **Server** | Select one of the following types of syslog formats: <br>SYSLOG Server (CEF format) <br>- SYSLOG Server (LEEF format) <br>SYSLOG Server (Object) <br>SYSLOG Server (Text Message) |
| **Host** / **Port** | Enter the syslog server's host name and port
|**Timezone**    |  Select the time zone you want to use for the alert detection in the target system.  |
| **Protocol** | Supported for text messages only. Select **TCP** or **UDP**. |
| **Enable encryption** | Supported for CEF format only. Toggle on to configure a TLS encryption certificate file, key file, and passphrase. |

Syslog outputs have the following syntax:

#### Syslog text message output fields

| Name | Description |
|--|--|
| Priority | User. Alert |
| Message | CyberX platform name: The sensor name.<br /> Microsoft Defender for IoT Alert: The title of the alert.<br /> Type: The type of the alert. Can be **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**.<br /> Severity: The severity of the alert. Can be **Warning**, **Minor**, **Major**, or **Critical**.<br /> Source: The source device name.<br /> Source IP: The source device IP address.<br /> Protocol (Optional): The detected source protocol.<br /> Address (Optional): Source protocol address.<br /> Destination: The destination device name.<br /> Destination IP: The IP address of the destination device.<br /> Protocol (Optional): The detected destination protocol.<br /> Address (Optional): The destination protocol address.<br /> Message: The message of the alert.<br /> Alert group: The alert group associated with the alert. <br /> UUID (Optional): The UUID the alert. |

#### Syslog object output fields

| Name | Description |
|--|--|
| Date and Time | Date and time that the syslog server machine received the information. |
| Priority | User.Alert |
| Hostname | Sensor IP |
| Message | Sensor name: The name of the appliance. <br /> Alert time: The time that the alert was detected: Can vary from the time of the syslog server machine, and depends on the time-zone configuration of the forwarding rule. <br /> Alert title: The title of the alert. <br /> Alert message: The message of the alert. <br /> Alert severity: The severity of the alert: **Warning**, **Minor**, **Major**, or **Critical**. <br /> Alert type: **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**. <br /> Protocol: The protocol of the alert.  <br /> **Source_MAC**: IP address, name, vendor, or OS of the source device. <br /> Destination_MAC: IP address, name, vendor, or OS of the destination. If data is missing, the value will be **N/A**. <br /> alert_group: The alert group associated with the alert. |

#### Syslog CEF output fields

| Name | Description |
|--|--|
| Priority | User.Alert |
| Date and time | Date and time that sensor sent the information |
| Hostname | Sensor hostname |
| Message | CEF:0 <br />Microsoft Defender for IoT/CyberX <br />Sensor name <br />Sensor version <br />Microsoft Defender for IoT Alert <br />Alert title <br />Integer indication of severity. 1=**Warning**, 4=**Minor**, 8=**Major**, or 10=**Critical**.<br />msg= The message of the alert. <br />protocol= The protocol of the alert. <br />severity= **Warning**, **Minor**, **Major**, or **Critical**. <br />type= **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**. <br />UUID= UUID of the alert  (Optional) <br /> start= The time that the alert was detected. <br />Might vary from the time of the syslog server machine, and depends on the time-zone configuration of the forwarding rule. <br />src_ip= IP address of the source device. (Optional) <br />src_mac= MAC address of the source device. (Optional)  <br />dst_ip= IP address of the destination device. (Optional)<br />dst_mac= MAC address of the destination device. (Optional)<br />cat= The alert group associated with the alert.  |

#### Syslog LEEF output fields

| Name | Description |
|--|--|
| Date and time | Date and time that the syslog server machine received the information. |
| Priority | User.Alert |
| Hostname | Sensor IP |
| Message | Sensor name: The name of the Microsoft Defender for IoT appliance. <br />LEEF:1.0 <br />Microsoft Defender for IoT <br />Sensor  <br />Sensor version <br />Microsoft Defender for IoT Alert <br />title: The title of the alert. <br />msg: The message of the alert. <br />protocol: The protocol of the alert.<br />severity: **Warning**, **Minor**, **Major**, or **Critical**. <br />type: The type of the alert: **Protocol Violation**, **Policy Violation**, **Malware**, **Anomaly**, or **Operational**. <br />start: The time of the alert. It may be different from the time of the syslog server machine. (This depends on the time-zone configuration.) <br />src_ip: IP address of the source device.<br />dst_ip: IP address of the destination device. <br />cat: The alert group associated with the alert. |

### Webhook server action

Send alert information to a webhook server. Working with webhook servers lets you set up integrations that subscribe to alert events with Defender for IoT. When an alert event is triggered, the management console sends an HTTP POST payload to the webhook's configured URL. Webhooks can be used to update an external SIEM system, SOAR systems, Incident management systems, etc.

This action is available from the on-premises management console.

**To define to a webhook action:**

1. Select the Webhook action.

1. Enter the server address in the **URL** field.

1. In the **Key** and **Value fields**, customize the HTTP header with a key and value definition. Keys can only contain letters, numbers, dashes, and underscores. Values can only contain one leading and/or one trailing space.

1. Select **Save**.

### Webhook extended

Webhook extended can be used to send extra data to the endpoint. The extended feature includes all of the information in the Webhook alert, and adds the following information to the report:

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

**To define a webhook extended action**:

1. Add the endpoint data URL in the URL field.

1. (Optional) Customize the HTTP header with a key and value definition. Add extra headers by selecting the :::image type="icon" source="media/how-to-forward-alert-information-to-partners/add-header.png" border="false"::: button.

1. Select **Save**.

Once the Webhook Extended forwarding rule has been configured, you can test the alert from the Forwarding screen on the management console.

**To test the Webhook Extended forwarding rule**:

1. In the management console, select **Forwarding** from the left-hand pane.

1. Select the **run** button to test your alert.

    :::image type="content" source="media/how-to-forward-alert-information-to-partners/run-button.png" alt-text="Select the run button to test your forwarding rule.":::

You'll know the forwarding rule is working if you see the Success notification.


### NetWitness action

Send alert information to a NetWitness server.

**To define NetWitness forwarding parameters:**

1. Enter NetWitness **Hostname** and **Port** information.

1. Enter the time zone for the time stamp for the alert detection at the SIEM.

1. Select **Save**.

### Integrated vendor actions

You might have integrated your system with a security, device management, or other industry vendor. These integrations let you:

  - Send alert information.

  - Send device inventory information.

  - Communicate with vendor-side firewalls.

Integrations help bridge previously siloed security solutions, enhance device visibility, and accelerate system-wide response to more rapidly mitigate risks.

Use the actions section to enter the credentials and other information required to communicate with integrated vendors.

For details about setting up forwarding rules for the integrations, refer to the relevant partner integration articles.


## Create forwarding rules on an on-premises management console

**To create a forwarding rule on the management console**:

1. Sign in to the sensor.

1. Select **Forwarding** on the side menu.

1. Select the :::image type="icon" source="media/how-to-work-with-alerts-on-premises-management-console/plus-add-icon.png" border="false"::: icon.

1. In the Create Forwarding Rule window, enter a name for the rule

    :::image type="content" source="media/how-to-work-with-alerts-on-premises-management-console/management-console-create-forwarding-rule.png" alt-text="Screenshot of the Create Forwarding Rule window..":::

   Define criteria by which to trigger a forwarding rule. Working with forwarding rule criteria helps pinpoint and manage the volume of information sent from the sensor to external systems.

1. Select the severity level from the drop-down menu.

    This is the minimum incident to forward, in terms of severity level. For example, if you select **Minor**, minor alerts and any alert above this severity level will be forwarded. Levels are predefined.

1. Select any protocols to apply.

    Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

1. Select which engines the rule should apply to.
 
   Select the required engines, or choose them all. Alerts from selected engines will be sent. 

1. Select which notifications you want to forward:
 
    -	**Report system notifications:** disconnected sensors, remote backup failures.

    -	**Report alert notifications:** date and time of alert, alert title, alert severity, source and destination name and IP, suspicious traffic and engine that detected the event.

1. Select **Add** to add an action to apply. Fill in any parameters needed for the selected action.

    Forwarding rule actions instruct the sensor to forward alert information to partner vendors or servers. You can create multiple actions for each forwarding rule.

1. Add another action if desired.

1. Select **Save**.

You can learn more [About forwarded alert information](how-to-forward-alert-information-to-partners.md#about-forwarded-alert-information). You can also [Test forwarding rules](how-to-forward-alert-information-to-partners.md#test-forwarding-rules), or [Edit and delete forwarding rules](how-to-forward-alert-information-to-partners.md#edit-and-delete-forwarding-rules). You can also learn more about [Forwarding rules and alert exclusion rules](how-to-forward-alert-information-to-partners.md#forwarding-rules-and-alert-exclusion-rules).

## Troubleshoot forwarding rules

If your forwarding alert rules aren't working as expected, check the following details:

- **Certificate validation**. Forwarding rules for Syslog CEF, Microsoft Sentinel, and QRadar support encryption and certificate validation.

    If your OT sensors or on-premises management console are configured to [validate certificates](how-to-deploy-certificates.md#about-certificate-validation) and the certificate can't be verified, the alerts aren't forwarded.

    <!--In these cases, the sensor or on-premises management console is the client and initiator of the session.  The certificates are typically received from the server, or use asymmetric encryption where a specific certificate will be provided to set up the integration.
    -->

- **Alert exclusion rules**. If you have exclusion rules configured on your on-premises management console, your sensors might be ignoring the alerts you're trying to forward. For more information, see [Create alert exclusion rules on an on-premises management console](how-to-accelerate-alert-incident-response.md#create-alert-exclusion-rules-on-an-on-premises-management-console).


## Next steps

> [!div class="nextstepaction"]
> [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)

> [!div class="nextstepaction"]
> [View and manage alerts on your OT sensor](how-to-view-alerts.md)

> [!div class="nextstepaction"]
> [Accelerate alert workflows on an OT network sensor](how-to-accelerate-alert-incident-response.md)

> [!div class="nextstepaction"]
> [OT monitoring alert types and descriptions](alert-engine-messages.md)

> [!div class="nextstepaction"]
> [Forward alert information](how-to-forward-alert-information-to-partners.md)






## Accelerate incident workflows by using alert groups

Alert groups let SOC teams view and filter alerts in their SIEM solutions and then manage these alerts based on enterprise security policies and business priorities. For example, alerts about new detections are organized in a discovery group. This group includes alerts that deal with detecting new devices, new VLANs, new user accounts, new MAC addresses, and more.

Alert groups are applied when you create forwarding rules for the following partner solutions:

  - Syslog servers

  - QRadar

  - ArcSight


The relevant alert group appears in partner output solutions. 

### Requirements

The alert group will appear in supported partner solutions with the following prefixes:

- **cat** for QRadar, ArcSight, Syslog CEF, Syslog LEEF

- **Alert Group** for Syslog text messages

- **alert_group** for Syslog objects

These fields should be configured in the partner solution to display the alert group name. If there's no alert associated with an alert group, the field in the partner solution will display **NA**.

### Default alert groups

The following alert groups are automatically defined:

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

Alert groups are predefined. For details about alerts associated with alert groups, and about creating custom alert groups, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c8f35-1b8e-f274-ec11-c6efdd6dd099).

