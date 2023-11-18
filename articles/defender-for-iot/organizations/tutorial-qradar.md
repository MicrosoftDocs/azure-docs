---
title: Integrate Qradar with Microsoft Defender for IoT
description: In this tutorial, learn how to integrate Qradar with Microsoft Defender for IoT.
ms.topic: tutorial
ms.date: 06/20/2022
---

# Integrate Qradar with Microsoft Defender for IoT

This article describes how to integrate Microsoft Defender for IoT with QRadar.

Integrating with QRadar supports:

- Forwarding Defender for IoT alerts to IBM QRadar for unified IT and OT security monitoring and governance.

- An overview of both IT and OT environments, allowing you to detect and respond to multi-stage attacks that often cross IT and OT boundaries.

- Integrating with existing SOC workflows.

## Prerequisites

- Access to a Defender for IoT OT sensor as an Admin user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- Access to a Defender for IoT OT on-premises management console as an Admin user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- Access to the QRadar Admin area.

## Configure Syslog listener for QRadar

**To configure the Syslog listener to work with QRadar**:

1. Sign in to QRadar and select **Admin** > **Data Sources**.

1. In the Data Sources window, select **Log Sources**.

1. In the **Modal** window, select **Add**.

1. In the **Add a log source** dialog box, define the following parameters:

    | Parameter | Description |
    |--|--|
    | **Log Source Name** | `<Sensor name>` |
    | **Log Source Description** | `<Sensor name>` |
    | **Log Source Type** | `Universal LEEF` |
    | **Protocol Configuration** | `Syslog` |
    | **Log Source Identifier** | `<Sensor name>` |

   > [!NOTE]
   > The Log Source Identifier name must not include white spaces. We recommend replacing any white spaces with an underscore.

1. Select **Save**, and then **Deploy Changes**.

## Deploy a Defender for IoT QID

A **QID** is a QRadar event identifier. Since all Defender for IoT reports are tagged under the same, **Sensor Alert** event, you can use the same QID for these events in QRadar.

**To deploy a Defender for IoT QID**:

1. Sign in to the QRadar console.

1. Create a file named `xsense_qids`.

1. In the file, use the following command: `,XSense Alert,XSense Alert Report From <XSense Name>,5,7001`.

1. Run: `sudo /opt/qradar/bin/qidmap_cli.sh -i -f <path>/xsense_qids`. 

   A confirmation message appears, indicating that the QID was deployed successfully.

## Create QRadar forwarding rules

Create a forwarding rule from your on-premises management console to forward alerts to QRadar.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. The rule doesn't affect any alerts already in the system from before the forwarding rule was created.

The following code is an example of a payload sent to QRadar:

```sample payload
<9>May 5 12:29:23 sensor_Agent LEEF:1.0|CyberX|CyberX platform|2.5.0|CyberX platform Alert|devTime=May 05 2019 15:28:54 devTimeFormat=MMM dd yyyy HH:mm:ss sev=2 cat=XSense Alerts title=Device is Suspected to be Disconnected (Unresponsive) score=81 reporter=192.168.219.50 rta=0 alertId=6 engine=Operational senderName=sensor Agent UUID=5-1557059334000 site=Site zone=Zone actions=handle dst=192.168.2.2 dstName=192.168.2.2 msg=Device 192.168.2.2 is suspected to be disconnected (unresponsive).
```

When configuring the forwarding rule:

1. In the **Actions** area, select **Qradar**.

1. Enter details for the QRadar host, port, and timezone.

1. Optionally, select to enable encryption, and then configure encryption, and/or select to manage alerts externally. 

For more information, see [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md).


## Map notifications to QRadar

1. Sign into your QRadar console, and select **QRadar**> **Log Activity** .

1. Select **Add Filter**, and define the following parameters:

    | Parameter | Description |
    |--|--|
    | **Parameter** | `Log Sources [Indexed]` |
    | **Operator** | `Equals` |
    | **Log Source Group** | `Other` |
    | **Log Source** | `<Xsense Name>` |

1. Locate an unknown report detected from your Defender for IoT sensor and double-click it.

1. Select **Map Event**.

1. In the **Modal Log Source Event** page, select:

   - **High-Level Category**: Suspicious Activity + Low-Level Category - Unknown Suspicious Event + Log
   - **Source Type**: Any

1. Select **Search**.

1. From the results, select the line in which the name XSense appears, and select **OK**.

All of the sensor reports from now on are tagged as Sensor Alerts.

The following new fields appear in QRadar:

- **UUID**: Unique alert identifier, such as 1-1555245116250.

- **Site**: The site where the alert was discovered.

- **Zone**: The zone where the alert was discovered.

For example:

```rest
<9>May 5 12:29:23 sensor_Agent LEEF:1.0|CyberX|CyberX platform|2.5.0|CyberX platform Alert|devTime=May 05 2019 15:28:54 devTimeFormat=MMM dd yyyy HH:mm:ss sev=2 cat=XSense Alerts title=Device is Suspected to be Disconnected (Unresponsive) score=81 reporter=192.168.219.50 rta=0 alertId=6 engine=Operational senderName=sensor Agent UUID=5-1557059334000 site=Site zone=Zone actions=handle dst=192.168.2.2 dstName=192.168.2.2 msg=Device 192.168.2.2 is suspected to be disconnected (unresponsive).
```

> [!NOTE]
> The forwarding rule you create for QRadar uses the `UUID` API from the on-premises management console. For more information, see [UUID (Manage alerts based on the UUID)](api/management-alert-apis.md#uuid-manage-alerts-based-on-the-uuid).

## Add custom fields to the alerts

**To add custom fields to alerts**:

1. Select **Extract Property**.

1. Select **Regex Based**.

1. Configure the following fields:

    | Parameter | Description |
    |--|--|
    | **New Property** | One of the following: <br><br> - Sensor Alert Description <br> - Sensor Alert ID <br> - Sensor Alert Score <br> - Sensor Alert Title <br> - Sensor Destination Name <br> - Sensor Direct Redirect <br> - Sensor Sender IP <br> - Sensor Sender Name <br> - Sensor Alert Engine <br> - Sensor Source Device Name |
   | **Optimize Parsing** | Check on. |
   | **Field Type** | `AlphaNumeric` |
   | **Enabled** | Check on. |
   | **Log Source Type** | `Universal LEAF` |
   | **Log Source** | `<Sensor Name>` |
   | **Event Name** | Should be already set as *Sensor Alert* |
   | Capture Group | 1 |
   | Regex | Define the following: <br><br> - Sensor Alert Description RegEx: `msg=(.*)(?=\t)` <br> - Sensor Alert ID RegEx: `alertId=(.*)(?=\t)` <br> - Sensor Alert Score RegEx: `Detected score=(.*)(?=\t)` <br> - Sensor Alert Title RegEx: `title=(.*)(?=\t)` <br> - Sensor Destination Name RegEx: `dstName=(.*)(?=\t)` <br> - Sensor Direct Redirect RegEx: `rta=(.*)(?=\t)` <br> - Sensor Sender IP: RegEx: `reporter=(.*)(?=\t)` <br> - Sensor Sender Name RegEx: `senderName=(.*)(?=\t)` <br> - Sensor Alert Engine RegEx: `engine =(.*)(?=\t)` <br> - Sensor Source Device Name RegEx: `src` |

## Next steps

> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](integrate-overview.md)
