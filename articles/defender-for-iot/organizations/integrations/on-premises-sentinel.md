---
title: How to connect on-premises Defender for IoT resources to Microsoft Sentinel
description: This article describes the legacy method for connecting your OT sensor or on-premises management console to Microsoft Sentinel.
ms.topic: how-to
ms.date: 08/17/2023
ms.custom: template-how-to-pattern
---

# Connect on-premises OT network sensors to Microsoft Sentinel (legacy)

This article describes the legacy method for connecting your OT sensor or on-premises management console to Microsoft Sentinel. Stream data into Microsoft Sentinel whenever you want to use Microsoft Sentinel's advanced threat hunting, security analytics, and automation features when responding to security incidents and threats across your network.

> [!IMPORTANT]
> Defender for IoT plans to end support for the legacy method of connecting to Microsoft Sentinel in an upcoming 23.x version.
>
> We recommend transitioning to newly recommended methods instead, such as [connecting via the cloud](../concept-sentinel-integration.md), [forwarding sylsog files via alert forwarding rules](../how-to-forward-alert-information-to-partners.md), or using [Defender for IoT's API](../references-work-with-defender-for-iot-apis.md). 

## Prerequisites

Before you start, make sure that you have the following prerequisites as needed:

- Access to the OT network sensor or on-premises management console as an **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](../roles-on-premises.md).

- A proxy machine prepared to send data to Microsoft Sentinel. For more information, see [Get CEF-formatted logs from your device or appliance into Microsoft Sentinel](../../../sentinel/connect-common-event-format.md).

- If you want to encrypt the data you send to Microsoft Sentinel using TLS, make sure to generate a valid TLS certificate from the proxy server to use in your forwarding alert rule.

## Set up forwarding alert rules

1. Sign into your OT network sensor or on-premises management console and create a forwarding rule. For more information, see [Forward on-premises OT alert information](../how-to-forward-alert-information-to-partners.md).

1. When creating your forwarding rule, make sure to select **Microsoft Sentinel** as the **Server** value. For example, on the OT sensor:

    :::image type="content" source="../media/integration-on-premises-sentinel/sensor-sentinel.png" alt-text="Screenshot of the Microsoft Sentinel option from the OT sensor." lightbox="../media/integration-on-premises-sentinel/sensor-sentinel.png":::

1. If you're using TLS encryption, make sure to select **Enable encryption** and upload your certificate and key files.

Select **Save** when you're done. Make sure to test the rule to make sure that it works as expected.

> [!IMPORTANT]
> To forward alert details to multiple Microsoft Sentinel instances, make sure to create a separate forwarding rule for each instance. Don't use the **Add server** option in the same forwarding rule to send data to multiple Microsoft Sentinel instances.

## Next steps

> [!div class="nextstepaction"]
> [Stream data from cloud-connected sensors](../iot-solution.md)

> [!div class="nextstepaction"]
> [Investigate in Microsoft Sentinel](../../../sentinel/investigate-cases.md)

For more information, see:
> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](../integrate-overview.md)
