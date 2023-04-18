---
title: Enable Enterprise IoT security in Microsoft 365 with Defender for Endpoint - Microsoft Defender for IoT
description: Learn how to start integrating between Microsoft Defender for IoT and Microsoft Defender for Endpoint in Microsoft 365 Defender.
ms.topic: quickstart
ms.date: 10/19/2022
ms.custom: enterprise-iot
---

# Enable Enterprise IoT security with Defender for Endpoint

This article describes how [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) customers can add an Enterprise IoT plan in Microsoft 365 Defender, providing extra security value for IoT devices.

While IoT device inventory is already available for Defender for Endpoint P2 customers, adding an Enterprise IoT plan adds alerts, recommendations, and vulnerability data, purpose-built for IoT devices in your enterprise network.

IoT devices include printers, cameras, VOIP phones, smart TVs, and more. Adding an Enterprise IoT plan means, for example, that you can use a recommendation in Microsoft 365 Defender to open a single IT ticket for patching vulnerable applications across both servers and printers.

## Prerequisites

Before you start the procedures in this article, read through [Secure IoT devices in the enterprise](concept-enterprise.md) to understand more about the integration between Defender for Endpoint and Defender for IoT.

Make sure that you have:

- A Microsoft Defender for Endpoint P2 license

- IoT devices in your network, visible in the Microsoft 365 Defender **Device inventory**

- An Azure subscription. If you need to, [sign up for a free account](https://azure.microsoft.com/free/).

- The following user roles:

    |Identity management  |Roles required  |
    |---------|---------|
    |**In Azure Active Directory**     |   [Global administrator](../../active-directory/roles/permissions-reference.md#global-administrator) for your Microsoft 365 tenant      |
    |**In Azure RBAC**     | [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) for the Azure subscription that you'll be using for the integration        |

## Onboard a Defender for IoT plan

1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Select the following options for your plan:

    - **Select an Azure subscription**: Select the Azure subscription that you want to use for the integration. You'll need a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role for the subscription.

    - **Price plan**: For the sake of this tutorial, select a **Trial** pricing plan. Microsoft Defender for IoT provides a [30-day free trial](billing.md#free-trial) for evaluation purposes. For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

1. Select the **I accept the terms and conditions** option and then select **Save**.

For example:

:::image type="content" source="media/enterprise-iot/defender-for-endpoint-onboard.png" alt-text="Screenshot of the Enterprise IoT tab in Defender for Endpoint." lightbox="media/enterprise-iot/defender-for-endpoint-onboard.png":::

## View added security value in Microsoft 365 Defender

This procedure describes how to view related alerts, recommendations, and vulnerabilities for a specific device in Microsoft 365 Defender. Alerts, recommendations, and vulnerabilities are shown for IoT devices only after you've added an Enterprise IoT plan.

**To view added security value**:

1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Assets** \> **Devices** to open the **Device inventory** page.

1. Select the **IoT devices** tab and select a specific device **IP** to drill down for more details. For example:

    :::image type="content" source="media/enterprise-iot/select-a-device.png" alt-text="Screenshot of the IoT devices tab in Microsoft 365 Defender." lightbox="media/enterprise-iot/select-a-device.png":::

1. On the device details page, explore the following tabs to view data added by the Enterprise IoT plan for your device:

    - On the **Alerts** tab, check for any alerts triggered by the device.

    - On the **Security recommendations** tab, check for any recommendations available for the device to reduce risk and maintain a smaller attack surface.

    - On the **Discovered vulnerabilities** tab, check for any known CVEs associated with the device. Known CVEs can help decide whether to patch, remove, or contain the device and mitigate risk to your network.

## Next steps

Learn how to set up an Enterprise IoT network sensor (Public preview) and gain more visibility into more IoT segments of your corporate network that aren't otherwise covered by Defender for Endpoint.

Customers that have set up an Enterprise IoT network sensor will be able to see all discovered devices in the **Device inventory** in either Microsoft 365 Defender, or Defender for IoT in the Azure portal.

> [!div class="nextstepaction"]
> [Enhance device discovery with an Enterprise IoT network sensor](eiot-sensor.md)
