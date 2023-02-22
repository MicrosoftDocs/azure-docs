---
title: Integrate Splunk with Microsoft Defender for IoT
description: In this tutorial, learn how to integrate Splunk with Microsoft Defender for IoT.
ms.topic: tutorial
ms.date: 02/07/2022
ms.custom: how-to
---

# Integrate Splunk with Microsoft Defender for IoT

This tutorial will help you learn how to integrate, and use Splunk with Microsoft Defender for IoT.

Defender for IoT mitigates IIoT, ICS, and SCADA risk with patented, ICS-aware self-learning engines that deliver immediate insights about ICS devices, vulnerabilities, and threats in less than an image hour and without relying on agents, rules or signatures, specialized skills, or prior knowledge of the environment.

To address a lack of visibility into the security and resiliency of OT networks, Defender for IoT developed the Defender for IoT, IIoT, and ICS threat monitoring application for Splunk, a native integration between Defender for IoT and Splunk that enables a unified approach to IT and OT security.

The application provides SOC analysts with multidimensional visibility into the specialized OT protocols and IIoT devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior. The application also enables both IT, and OT incident response from within one corporate SOC. This is an important evolution given the ongoing convergence of IT and OT to support new IIoT initiatives, such as smart machines and real-time intelligence.

The Splunk application can be installed locally ('Splunk Enterprise') or run on a cloud ('Splunk Cloud'). The Splunk integration along with Defender for IoT supports 'Splunk Enterprise' only.

> [!Note]
> References to CyberX refer to Microsoft Defender for IoT.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Download the Defender for IoT application in Splunk
> * Send Defender for IoT alerts to Splunk

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

### Version requirements

The following versions are required for the application to run.

* Defender for IoT version 2.4 and above.

* Splunkbase version 11 and above.

* Splunk Enterprise version 7.2 and above.

### Splunk permission requirements

The following Splunk permission is required:

* Any user with an *Admin* level user role.

## Download the Defender for IoT application in Splunk

To access the Defender for IoT application within Splunk, you will need to download the application form the Splunkbase application store.

**To access the Defender for IoT application in Splunk**:

1. Navigate to the [Splunkbase](https://splunkbase.splunk.com/) application store.

1. Search for `CyberX ICS Threat Monitoring for Splunk`.

1. Select the CyberX ICS Threat Monitoring for Splunk application.

1. Select the **LOGIN TO DOWNLOAD BUTTON**.

## Send Defender for IoT alerts to Splunk

The Defender for IoT alerts provides information about an extensive range of security events. These events include:

* Deviations from the learned baseline network activity.

* Malware detections.

* Detections based on suspicious operational changes.

* Network anomalies.

* Protocol deviations from protocol specifications.

    :::image type="content" source="media/tutorial-splunk/address-scan.png" alt-text="A screen capture if an Address Scan Detected alert.":::

You can also configure Defender for IoT to send alerts to the Splunk server, where alert information is displayed in the Splunk Enterprise dashboard.

:::image type="content" source="media/tutorial-splunk/alerts-and-details.png" alt-text="View all of the alerts and their details." lightbox="media/tutorial-splunk/alerts-and-details-expanded.png":::

To send alert information to the Splunk servers from Defender for IoT, you will need to create a Forwarding Rule.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created are not affected by the rule.

**To create the forwarding rule**:

1. Sign in to the sensor, and select **Forwarding** from the left side pane.

1. Select **Create nre rule**.

1. In the **Add forwarding rule** dialog box, define the rule parameters.

    :::image type="content" source="media/tutorial-splunk/forwarding-rule.png" alt-text="Create the rules for your forwarding rule." lightbox="media/tutorial-splunk/forwarding-rule-expanded.png":::

    | Parameter | Description |
    |--|--|
    | **Name** | The forwarding rule name. |
    | **Select Severity** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Protocols** | By default, all the protocols are selected. To select a specific protocol, select **Specific** and select the protocol for which this rule is applied. |
    | **Engines** | By default, all the security engines are involved. To select a specific security engine for which this rule is applied, select **Specific** and select the engine. |
    | **System Notifications** | Forward sensor system notifications to the Splunk server. For example, send the online/offline status of connected sensor. This option is only available if you have logged into the Central Manager. |

1. Select **Action**, and then select **Send to Splunk Server**.

1. Enter the following Splunk parameters.

    | Parameter | Description |
    |--|--|
    | **Host** | Splunk server address |
    | **Port** | 8089 |
    | **Username** | Splunk server username |
    | **Password** | Splunk server password |

1. Select **Submit**.

## Clean up resources

There are no resources to clean up.

## Next steps

In this tutorial, you learned how to get started with the Splunk integration. Continue on to learn how to [Integrate ServiceNow with Microsoft Defender for IoT](tutorial-servicenow.md).

> [!div class="nextstepaction"]
> [Integrate ServiceNow with Microsoft Defender for IoT](tutorial-servicenow.md)
