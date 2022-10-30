---
title: Secure Enterprise IoT devices from Microsoft 365 with Microsoft Defender for Endpoint and Microsoft Defender for IoT
description: Learn how to start integrating between Microsoft Defender for IoT and Microsoft Defender for Endpoint.
ms.topic: quickstart
ms.date: 10/19/2022
---

# Enable Enterprise IoT security in Defender for Endpoint

This article describes how Microsoft Defender for Endpoint customers can add an Enterprise IoT plan in Microsoft 365 Defender, providing extra security value for IoT devices.

Adding an Enterprise IoT plan to Microsoft 365 Defender integrates Defender for Endpoint with Microsoft Defender for IoT. This integration adds alerts, recommendations, and vulnerability data, purpose-built for IoT devices in your enterprise network.

For example, IoT devices include printers, cameras, VOIP phones, smart TVs, and more. Adding an Enterprise IoT plan means that you can use a recommendations to open a single IT ticket to patch vulnerable applications across both servers and printers.

## Prerequisites

Before starting this quickstart, read through [Secure IoT devices in the enterprise](concept-eiot.md) to understand more about the integration between Defender for Endpoint and Defender for IoT.

Make sure that you have:

- A Microsoft Defender for Endpoint P2 license

- IoT devices in your network, visible in the Microsoft 365 Defender **Device inventory**

- An Azure subscription. If you need to, [sign up for a free account](https://azure.microsoft.com/free/).

- The following user roles:

    |Identity management  |Roles required  |
    |---------|---------|
    |**In Azure Active Directory**     |   [Global administrator](/azure/active-directory/roles/permissions-reference#global-administrator) for your Microsoft 365 tenant      |
    |**In Azure RBAC**     | [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) for the Azure subscription that you'll be using for the integration        |

## Onboard a Defender for IoT plan

1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Select the following options for your plan:

    - **Select an Azure subscription**: Select the Azure subscription that you want to use for the integration. You'll need a [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) role for the subscription.

    - **Price plan**: For the sake of this tutorial, select a trial pricing plan. Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes. For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

1. Select the **I accept the terms and conditions** option and then select **Save**.

For example:

:::image type="content" source="media/enterprise-iot/defender-for-endpoint-onboard.png" alt-text="Screenshot of the Enterprise IoT tab in Defender for Endpoint." lightbox="media/enterprise-iot/defender-for-endpoint-onboard.png":::

<!--remove this procedure, jump straight to security value-->
<!--1. conceptual. be careful with the sensor - also include the agnostic story. 2. onboarding / offboarding in mde, finding security value, 3. how to register and network sensor and shared inventory.-->

## View added security value in Microsoft 365 Defender

This procedure describes how to view related alerts, recommendations, and vulnerabilities for a specific device in Microsoft 365 Defender. These alerts, recommendations, and vulnerabilities are added with the Defender for IoT integration.

1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Assets** \> **Devices** to open the **Device inventory** page.

1. Select the **IoT devices** tab and select a specific device **IP** to drill down for more details. For example:

    :::image type="content" source="media/enterprise-iot/select-a-device.png" alt-text="Screenshot of the IoT devices tab in Microsoft 365 Defender." lightbox="media/enterprise-iot/select-a-device.png":::

1. On the device details page, explore the following tabs to view data added by the Enterprise IoT plan for your device:

    - On the **Alerts** tab, check for any alerts triggered by the device.

    - On the **Security recommendations** tab, check for any recommendations available for the device to reduce risk and maintain a smaller attack surface.

    - On the **Discovered vulnerabilities** tab, check for any known CVEs associated with the device. Known CVEs can help decide whether to patch, remove, or contain the device and mitigate risk to your network.


<!-->
## View detected IoT devices

View and manage your IoT devices in the [Microsoft 365 Defender portal](https://security.microsoft.com/).

1. On the Microsoft Defender **Home** page, scroll down to view the **Total discovered devices** widget. For example:

    :::image type="content" source="media/enterprise-iot/total-discovered-devices.png" alt-text="Screenshot of the Microsoft 365 Defender Home page.":::

1. Select **View all IoT devices** to jump directly to the **IoT devices** tab on the Defender for Endpoint **Device inventory** page. For example:

    :::image type="content" source="media/enterprise-iot/defender-for-endpoint-iot-devices.png" alt-text="Screenshot of the Defender for Endpoint Devices page.":::

1. Some IoT devices come with backdoors, poor configurations, and known vulnerabilities, all which pose risk for customer environments. Sort the grid by the **Risk level** or **Exposure level** columns to identify devices most at risk.

For more information, see [Device inventory](/microsoft-365/security/defender-endpoint/machines-view-overview)

> [!TIP]
> To control the devices discovered by Defender for Endpoint, modify the device discovery options in the Defender for Endpoint **Settings** > **Device discovery** area.
>
> Select whether to discover devices using passive listening only, or both passive listening and smart, active device probing, and whether to run the discovery process on all devices, or specific devices only.
>
> For more information, see [Configure device discovery](/microsoft-365/security/defender-endpoint/configure-device-discovery).
>
-->



## Next steps

After onboarding a Enterprise IoT plan, you can also view detected IoT devices, together with OT network devices, in Defender for IoT in the Azure portal. For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

To gain more visibility into additional IoT segments of your corporate network, not otherwise covered by Defender for Endpoint, set up an Enterprise IoT network sensor (Public preview). 

Customers that have set up an Enterprise IoT network sensor will be able to see all discovered devices in the **Device inventory** in either Microsoft 365 Defender or Defender for IoT in the Azure portal.

For more information, see [Enhance device discovery with an Enterprise IoT network sensor](eiot-sensor.md).


