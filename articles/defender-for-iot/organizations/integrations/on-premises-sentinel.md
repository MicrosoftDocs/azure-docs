---
title: How to connect on-premises Defender for IoT resources to Microsoft Sentinel
description: Learn how to stream data into Microsoft Sentinel from an on-premises and locally-managed Microsoft Defender for IoT OT network sensor or an on-premises management console.
ms.topic: how-to
ms.date: 12/26/2022
ms.custom: template-how-to-pattern
---

# Connect on-premises OT network sensors to Microsoft Sentinel

You can [stream Microsoft Defender for IoT data into Microsoft Sentinel](../iot-solution.md) via the Azure portal, for any data coming from cloud-connected OT network sensors.

However, if you're working either in a hybrid environment, or completely on-premises, you might want to stream data in from your locally-managed sensors to Microsoft Sentinel. To do this, create forwarding rules on either your OT network sensor, or for multiple sensors from an on-premises management console.

Stream data into Microsoft Sentinel whenever you want to use Microsoft Sentinel's advanced threat hunting, security analytics, and automation features when responding to security incidents and threats across your network. For more information, see [Microsoft Sentinel documentation](../../../sentinel/index.yml).

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
