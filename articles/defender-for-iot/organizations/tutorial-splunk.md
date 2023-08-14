---
title: Integrate Splunk with Microsoft Defender for IoT (legacy)
description: This article describes how to integrate Splunk with Microsoft Defender for IoT using Defender for IoT's legacy, on-premises integration.
ms.topic: tutorial
ms.date: 08/07/2023
ms.custom: how-to
---

# Integrate Splunk with Microsoft Defender for IoT (on-premises integration)

> [!IMPORTANT]
> In line with our focus on cloud integrations, Defender for IoT plans to end support for the legacy, on-premises Splunk integration with an upcoming patch version of 23.1.x.
>
> We recommend that you use the the [OT Security Add-on for Splunk](https://apps.splunk.com/app/5151) instead. For more information, see:
>
>- [The Splunk documentation on installing add-ins](https://docs.splunk.com/Documentation/AddOns/released/Overview/Distributedinstall)
>- [The Splunk documentation on the OT Security Add-on for Splunk](https://splunk.github.io/ot-security-solution/integrationguide/)
>
> Note that after integration support ends, you can continue to send syslog files to ClearPass. For more information, see [Configure alert forwarding rule actions](how-to-forward-alert-information-to-partners.md#configure-alert-forwarding-rule-actions).


This article helps you learn how to integrate and use Splunk with Microsoft Defender for IoT via the on-premises, legacy integration.

Defender for IoT mitigates IIoT, ICS, and SCADA risk with patented, ICS-aware self-learning engines that deliver immediate insights about ICS devices, vulnerabilities, and threats in less than an image hour and without relying on agents, rules or signatures, specialized skills, or prior knowledge of the environment.

To address a lack of visibility into the security and resiliency of OT networks, Defender for IoT developed the Defender for IoT, IIoT, and ICS threat monitoring application for Splunk, a native integration between Defender for IoT and Splunk that enables a unified approach to IT and OT security.

The application provides SOC analysts with multidimensional visibility into the specialized OT protocols and IIoT devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior. The application also enables both IT, and OT incident response from within one corporate SOC. This is an important evolution given the ongoing convergence of IT and OT to support new IIoT initiatives, such as smart machines and real-time intelligence.

The Splunk application can be installed locally ('Splunk Enterprise') or run on a cloud ('Splunk Cloud'). The Splunk integration along with Defender for IoT supports 'Splunk Enterprise' only.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Download the Defender for IoT application in Splunk
> - Send Defender for IoT alerts to Splunk

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Microsoft Defender for IoT was formally known as [CyberX](https://blogs.microsoft.com/blog/2020/06/22/microsoft-acquires-cyberx-to-accelerate-and-secure-customers-iot-deployments/). References to CyberX refer to Defender for IoT.

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

For more information, see [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md).

## Next steps

> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](integrate-overview.md)
