---
title: Alerts and incidents in Microsoft 365 Defender (Preview)
description: Learn about the benefits of receiving Microsoft Defender for Cloud's alerts in Microsoft 365 Defender 
ms.topic: conceptual
ms.date: 11/29/2023
---

# Alerts and incidents in Microsoft 365 Defender (Preview)

Microsoft Defender for Cloud is now integrated with Microsoft 365 Defender (Preview). This integration allows security teams to access Defender for Cloud alerts and incidents within the Microsoft 365 Defender portal. This integration provides richer context to investigations that span cloud resources, devices, and identities. 

The partnership with Microsoft 365 Defender allows security teams to get the complete picture of an attack, including suspicious and malicious events that happen in their cloud environment. Security teams can accomplish this goal through immediate correlations of alerts and incidents. 

Microsoft 365 Defender offers a comprehensive solution that combines protection, detection, investigation, and response capabilities. The solution protects against attacks on devices, email, collaboration, identity, and cloud apps. Our detection and investigation capabilities are now extended to cloud entities, offering security operations teams a single pane of glass to significantly improve their operational efficiency. 

Incidents and alerts are now part of [Microsoft 365 Defender's public API](/microsoft-365/security/defender/api-overview?view=o365-worldwide). This integration allows exporting of security alerts data to any system using a single API. As Microsoft Defender for Cloud, we're committed to providing our users with the best possible security solutions, and this integration is a significant step towards achieving that goal.

## Investigation experience in Microsoft 365 Defender 

The following table describes the detection and investigation experience in Microsoft 365 Defender with Defender for Cloud alerts.

| Area | Description |
|--|--|
| Incidents | All Defender for Cloud incidents are integrated to Microsoft 365 Defender. <br> - Searching for cloud resource assets in the [incident queue](/microsoft-365/security/defender/incident-queue?view=o365-worldwide) is supported. <br> - The [attack story](/microsoft-365/security/defender/investigate-incidents?view=o365-worldwide#attack-story) graph shows cloud resource. <br> - The [assets tab](/microsoft-365/security/defender/investigate-incidents?view=o365-worldwide#assets) in an incident page shows the cloud resource. <br> - Each virtual machine has its own entity page containing all related alerts and activity. <br> <br> There are no duplications of incidents from other Defender workloads. |
| Alerts  | All Defender for Cloud alerts, including multicloud, internal and external providers’ alerts, are integrated to Microsoft 365 Defender. Defenders for Cloud alerts show on the Microsoft 365 Defender [alert queue](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response?view=o365-worldwide). <br>Microsoft 365 Defender <br> The `cloud resource` asset shows up in the Asset tab of an alert. Resources are clearly identified as an Azure, Amazon, or a Google Cloud resource. <br> <br> Defenders for Cloud alerts are automatically be associated with a tenant. <br> <br> There are no duplications of alerts from other Defender workloads.| 
| Alert and incident correlation | Alerts and incidents are automatically correlated, providing robust context to security operations teams to understand the complete attack story in their cloud environment. |
| Threat detection | Accurate matching of virtual entities to device entities to ensure precision and effective threat detection. |
| Unified API | Defender for Cloud alerts and incidents are now included in [Microsoft 365 Defender’s public API](/microsoft-365/security/defender/api-overview?view=o365-worldwide), allowing customers to export their security alerts data into other systems using one API. |

Learn more about [handling alerts in Microsoft 365 Defender](/microsoft-365/security/defender/microsoft-365-security-center-defender-cloud?view=o365-worldwide).

## Sentinel customers

Microsoft Sentinel customers can [benefit from the Defender for Cloud integration with Microsoft 365 Defender](../sentinel/ingest-defender-for-cloud-incidents.md) in their workspaces using the Microsoft 365 Defender incidents and alerts connector.

First you need to [enabled incident integration in your Microsoft 365 Defender connector](../sentinel/connect-microsoft-365-defender.md).

Then, enable the `Tenant-based Microsoft Defender for Cloud (Preview)` connector to synchronize your subscriptions with your tenant-based Defender for Cloud incidents to stream through the Microsoft 365 Defender incidents connector. 

The connector is available through the Microsoft Defender for Cloud solution, version 3.0.0, in the Content Hub. If you have an earlier version of this solution, you can upgrade it in the Content Hub. 

If you have the legacy subscription-based Microsoft Defender for Cloud alerts connector enabled (which is displayed as `Subscription-based Microsoft Defender for Cloud (Legacy)`), we recommend you disconnect the connector in order to prevent duplicating alerts in your logs.

We recommend you disable analytic rules that are enabled (either scheduled or through Microsoft creation rules), from creating incidents from your Defender for Cloud alerts.

You can use automation rules to close incidents immediately and prevent specific types of Defender for Cloud alerts from becoming incidents. You can also use the built-in tuning capabilities in the Microsoft 365 Defender portal to prevent alerts from becoming incidents. 

Customers who integrated their Microsoft 365 Defender incidents into Sentinel and want to keep their subscription-based settings and avoid tenant-based syncing can [opt out of syncing incidents and alerts](/microsoft-365/security/defender/microsoft-365-security-center-defender-cloud?view=o365-worldwide) through the Microsoft 365 Defender connector. 

Learn how [Defender for Cloud and Microsoft 365 Defender handle your data's privacy](data-security.md#defender-for-cloud-and-microsoft-defender-365-defender-integration).

## Next steps

[Security alerts - a reference guide](alerts-reference.md)
