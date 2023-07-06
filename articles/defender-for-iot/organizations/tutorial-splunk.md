---
title: Integrate Splunk with Microsoft Defender for IoT
description: In this tutorial, learn how to integrate Splunk with Microsoft Defender for IoT.
ms.topic: tutorial
ms.date: 02/07/2022
ms.custom: how-to
---

# Integrate Splunk with Microsoft Defender for IoT

This article helps you learn how to integrate, and use Splunk with Microsoft Defender for IoT.

Defender for IoT mitigates IIoT, ICS, and SCADA risk with patented, ICS-aware self-learning engines that deliver immediate insights about ICS devices, vulnerabilities, and threats in less than an image hour and without relying on agents, rules or signatures, specialized skills, or prior knowledge of the environment.

To address a lack of visibility into the security and resiliency of OT networks, Defender for IoT developed the Defender for IoT, IIoT, and ICS threat monitoring application for Splunk, a native integration between Defender for IoT and Splunk that enables a unified approach to IT and OT security.

The application provides SOC analysts with multidimensional visibility into the specialized OT protocols and IIoT devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior. The application also enables both IT, and OT incident response from within one corporate SOC. This is an important evolution given the ongoing convergence of IT and OT to support new IIoT initiatives, such as smart machines and real-time intelligence.

The Splunk application can be installed locally ('Splunk Enterprise') or run on a cloud ('Splunk Cloud'). The Splunk integration along with Defender for IoT supports 'Splunk Enterprise' only.

> [!NOTE]
> Microsoft Defender for IoT was formally known as [CyberX](https://blogs.microsoft.com/blog/2020/06/22/microsoft-acquires-cyberx-to-accelerate-and-secure-customers-iot-deployments/). References to CyberX refer to Defender for IoT.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Download the Defender for IoT application in Splunk
> - Send Defender for IoT alerts to Splunk

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

Before you begin, make sure that you have the following prerequisites:

### Version requirements

The following versions are required for the application to run.

- Defender for IoT version 2.4 and above.

- Splunkbase version 11 and above.

- Splunk Enterprise version 7.2 and above.

### Permission requirements

Make sure you have:

- Access to a Defender for IoT OT sensor as an Admin user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).
- Splunk user with an *Admin* level user role.

## Download the Defender for IoT application in Splunk

To access the Defender for IoT application within Splunk, you need to download the application form the Splunkbase application store.

**To access the Defender for IoT application in Splunk**:

1. Navigate to the [Splunkbase](https://splunkbase.splunk.com/) application store.

1. Search for `CyberX ICS Threat Monitoring for Splunk`.

1. Select the CyberX ICS Threat Monitoring for Splunk application.

1. Select the **LOGIN TO DOWNLOAD BUTTON**.

## Send Defender for IoT alerts to Splunk

The Defender for IoT alerts provide information about an extensive range of security events. These events include:

- Deviations from the learned baseline network activity.

- Malware detections.

- Detections based on suspicious operational changes.

- Network anomalies.

- Protocol deviations from protocol specifications.

You can also configure Defender for IoT to send alerts to the Splunk server, where alert information is displayed in the Splunk Enterprise dashboard.

:::image type="content" source="media/tutorial-splunk/alerts-and-details.png" alt-text="View all of the alerts and their details." lightbox="media/tutorial-splunk/alerts-and-details-expanded.png":::

To send alert information to the Splunk servers from Defender for IoT, you need to create a Forwarding Rule.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created aren't affected by the rule.

**To create the forwarding rule**:

1. Sign in to the sensor, and select **Forwarding**.

1. Select **Create new rule**.

1. In the **Add forwarding rule** pane, define the rule parameters:

    :::image type="content" source="media/tutorial-splunk/forwarding-rule.png" alt-text="Screenshot of creating the rules for your forwarding rule." lightbox="media/tutorial-splunk/forwarding-rule.png":::

    | Parameter | Description |
    |--|--|
    | **Rule name** | The forwarding rule name. |
    | **Minimal alert level** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Any protocol detected**     |  Toggle off to select the protocols you want to include in the rule.       |
    | **Traffic detected by any engine**     | Toggle off to select the traffic you want to include in the rule.       |

1. In the **Actions** area, define the following values:

    | Parameter | Description |
    |--|--|
    | **Server** | Select Splunk Server. |
    | **Host** | Enter the Splunk server address. |
    | **Port** | Enter 8089. |
    | **Username** | Enter the Splunk server username. |
    | **Password** | Enter the Splunk server password. |

1. Select **Save**.

## Next steps

> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](integrate-overview.md)
