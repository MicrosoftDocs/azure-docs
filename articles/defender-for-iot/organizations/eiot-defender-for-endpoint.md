---
title: Get started with enterprise IoT monitoring in Microsoft 365 Defender | Microsoft Defender for IoT
description: Learn how to get added value for enterprise IoT devices in Microsoft 365 Defender.
ms.topic: quickstart
ms.date: 09/13/2023
ms.custom: enterprise-iot
#CustomerIntent: As a Microsoft 365 administrator, I want to understand how to turn on support for enterprise IoT monitoring in Microsoft 365 Defender and where I can find the added security value so that I can keep my EIoT devices safe.
---

# Get started with enterprise IoT monitoring in Microsoft 365 Defender

This article describes how [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) customers can monitor enterprise IoT devices in their environment, using added security value in Microsoft 365 Defender.

While IoT device inventory is already available for Defender for Endpoint P2 customers, turning on enterprise IoT security adds alerts, recommendations, and vulnerability data, purpose-built for IoT devices in your enterprise network.

IoT devices include printers, cameras, VOIP phones, smart TVs, and more. Turning on enterprise IoT security means, for example, that you can use a recommendation in Microsoft 365 Defender to open a single IT ticket for patching vulnerable applications across both servers and printers.

## Prerequisites

Before you start the procedures in this article, read through [Secure IoT devices in the enterprise](concept-enterprise.md) to understand more about the integration between Defender for Endpoint and Defender for IoT.

Make sure that you have:

- IoT devices in your network, visible in the Microsoft 365 Defender **Device inventory**

- Access to the Microsoft 365 Defender portal as a [Security administrator](../../active-directory/roles/permissions-reference.md#security-administrator)

- One of the following licenses:

    - A Microsoft 365 E5 (ME5) or E5 Security license

    - Microsoft Defender for Endpoint P2, with an extra, standalone **Microsoft Defender for IoT - EIoT Device License - add-on** license, available for purchase or trial from the Microsoft 365 admin center.

    > [!TIP]
    > If you have a standalone license, you don't need to toggle on **Enterprise IoT Security** and can skip directly to [View added security value in Microsoft 365 Defender](#view-added-security-value-in-microsoft-365-defender).
    >

    For more information, see [Enterprise IoT security in Microsoft 365 Defender](concept-enterprise.md#enterprise-iot-security-in-microsoft-365-defender).


## Turn on enterprise IoT monitoring

This procedure describes how to turn on enterprise IoT monitoring in Microsoft 365 Defender, and is relevant only for ME5/E5 Security customers.

Skip this procedure if you have one of the following types of licensing plans:

- Customers with legacy Enterprise IoT pricing plan and an ME5/E5 Security license.
- Customers with standalone, per-device licenses added on to Microsoft Defender for Endpoint P2. In such cases, the Enterprise IoT security setting is turned on as read-only.

**To turn on enterprise IoT monitoring**:

1. In [Microsoft 365 Defender](https://security.microsoft.com/), select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Toggle the Enterprise IoT security option to **On**. For example:

    :::image type="content" source="media/enterprise-iot/eiot-toggle-on.png" alt-text="Screenshot of Enterprise IoT toggled on in Microsoft 365 Defender.":::

## View added security value in Microsoft 365 Defender

This procedure describes how to view related alerts, recommendations, and vulnerabilities for a specific device in Microsoft 365 Defender, when the **Enterprise IoT security** option is turned on.

**To view added security value**:

1. In [Microsoft 365 Defender](https://security.microsoft.com/), select **Assets** \> **Devices** to open the **Device inventory** page.

1. Select the **IoT devices** tab and select a specific device **IP** to drill down for more details. For example:

    :::image type="content" source="media/enterprise-iot/select-a-device.png" alt-text="Screenshot of the IoT devices tab in Microsoft 365 Defender." lightbox="media/enterprise-iot/select-a-device.png":::

1. On the device details page, explore the following tabs to view data added by the enterprise IoT security for your device:

    - On the **Alerts** tab, check for any alerts triggered by the device.

    - On the **Security recommendations** tab, check for any recommendations available for the device to reduce risk and maintain a smaller attack surface.

    - On the **Discovered vulnerabilities** tab, check for any known CVEs associated with the device. Known CVEs can help decide whether to patch, remove, or contain the device and mitigate risk to your network.

**To hunt for threats**:

On the **Device inventory** page, select **Go hunt** to query devices using tables like the *[DeviceInfo](/microsoft-365/security/defender/advanced-hunting-deviceinfo-table)* table. On the **Advanced hunting** page, query data using other schemas. 

For more information, see [Advanced hunting](/microsoft-365/security/defender/advanced-hunting-overview) and [Understand the advanced hunting schema](/microsoft-365/security/defender/advanced-hunting-schema-tables).

## Next steps

> [!div class="nextstepaction"]
> [Device discovery overview](/microsoft-365/security/defender-endpoint/device-discovery)
