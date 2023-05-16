---
title: Integrate LogRhythm with Microsoft Defender for IoT
description: Learn how to send Microsoft Defender for IoT alerts to ALogRhythmrcSight.
ms.topic: integration
ms.date: 08/02/2022
---

# Integrate LogRhythm with Microsoft Defender for IoT

This article describes how to send Microsoft Defender for IoT alerts to LogRhythm. Integrating Defender for IoT with LogRhythm provides visibility into the security and resiliency of OT networks and a unified approach to IT and OT security.

## Prerequisites

Before you begin, make sure that you have the following prerequisites:

- Access to a Defender for IoT OT sensor as an Admin user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](../roles-on-premises.md).

## Create a Defender for IoT forwarding rule

This procedure describes how to create a forwarding rule from your OT sensor to send Defender for IoT alerts from that sensor to LogRhythm.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created aren't affected by the rule.

For more information, see [Forward alert information](../how-to-forward-alert-information-to-partners.md).

1. Sign in to your OT sensor console and select **Forwarding**.

1. Select **+ Create new rule**.

1. In the **Add forwarding rule** pane, define the rule parameters:

    :::image type="content" source="../media/integrate-logrhythm/create-new-forwarding-rule.png" alt-text="Screenshot of creating a new forwarding rule." lightbox="../media/integrate-logrhythm/create-new-forwarding-rule.png":::

    | Parameter  | Description  |
    |---------|---------|
    | **Rule name**     | Enter a meaningful name for your rule.        |
    | **Minimal alert level**     | The minimal security level incident to forward. For example, if you select Minor, you're notified about all minor, major and critical incidents.        |
    | **Any protocol detected**     |  Toggle off to select the protocols you want to include in the rule.       |
    | **Traffic detected by any engine**     | Toggle off to select the traffic you want to include in the rule.       |

1. In the **Actions** area, define the following values:

    | Parameter  | Description  |
    |---------|---------|
    | **Server** | Select a SYSLOG server option, such as **SYSLOG Server (LEEF format)**. |
    | **Host** | The IP or hostname of your LogRhythm collector |
    | **Port** | Enter 514. |
    | **Timezone** | Enter your timezone. |

1. Select **Save**.

## Configure LogRhythm to collect logs

After configuring a forwarding rule from your OT sensor console, configure LogRhythm to collect your Defender for IoT logs.

For more information, see the [LogRhythm documentation](https://docs.logrhythm.com/docs/devices/syslog-log-sources).

## Next steps

- [Integrations with Microsoft and partner services](../integrate-overview.md)
- [Forward alert information](../how-to-forward-alert-information-to-partners.md)
