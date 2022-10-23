---
title: Secure Enterprise IoT devices from Microsoft 365 with Microsoft Defender for Endpoint and Microsoft Defender for IoT
description: Learn how to start integrating between Microsoft Defender for IoT and Microsoft Defender for Endpoint.
ms.topic: tutorial
ms.date: 10/19/2022
---

# Secure Enterprise IoT devices from Microsoft 365 with Microsoft Defender for Endpoint and Microsoft Defender for IoT

<!--these include files don't work [!INCLUDE [Microsoft 365 Defender rebranding](/microsoft-365/security/includes/microsoft-defender.md)]-->

**Applies to:**

- [Microsoft Defender for Endpoint P2](https://go.microsoft.com/fwlink/?linkid=2154037)
- [Microsoft 365 Defender](https://go.microsoft.com/fwlink/?linkid=2118804)

<!--these include files don't work [!INCLUDE[Prerelease information](/microsoft-365/security/includes/prerelease.md)]-->

> Want to experience Microsoft Defender for Endpoint? [Sign up for a free trial.](https://signup.microsoft.com/create-account/signup?products=7f379fee-c4f9-4278-b0a1-e4c8c2fcdf7e&ru=https://aka.ms/MDEp2OpenTrial?ocid=docs-wdatp-enablesiem-abovefoldlink)

This article describes how to onboard to Microsoft Defender for IoT from Microsoft Defender for Endpoint, providing extra security value in Defender for Endpoint and extending device discovery in Defender for IoT.

Together, Defender for Endpoint and Defender for IoT provide security monitoring for enterprise IoT devices in your network, such as Voice over Internet Protocol (VoIP) devices, printers, and cameras.

For more information, see [Secure Enterprise IoT network resources with Defender for Endpoint and Defender for IoT](concept-eiot.md).

## Prerequisites

To modify settings for your Defender for Endpoint integration, the user must have the following roles:

- **In Azure Active Directory**, [Global administrator](/azure/active-directory/roles/permissions-reference#global-administrator) for your Tenant

- **In Azure RBAC**, [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) for the Azure subscription that you'll be using for the integration

## Onboard a Defender for IoT plan

1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Select the following options for your plan:

    - **Select an Azure subscription**: Select the Azure subscription that you want to use for the integration. You'll need a [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) role for the subscription.

    - **Price plan**: For the sake of this tutorial, select a trial pricing plan. Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes. For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

1. Select the **I accept the terms and conditions** option and then select **Save**.

For example:

:::image type="content" source="media/enterprise-iot/defender-for-endpoint-onboard.png" alt-text="Screenshot of the Enterprise IoT tab in Defender for Endpoint.":::

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

## View related alerts, recommendations, and vulnerabilities

This procedure describes how to view related alerts, recommendations, and vulnerabilities for a specific device, starting in the Microsoft 365 Defender **Device inventory** page.

1. On the **Device inventory** page, select a device **IP** to drill down for more details about the selected device. For example:

    - Use the **Device summary** and **Overview** tabs to understand basic device details, like classification and device software

    - Use the **Alerts** tab to view all alerts triggered by the device.

    - Use the **Timeline** tab to show communication between the IoT device and managed endpoints, for more context when investigating alerts.

    - Use the **Security recommendations** tab to view recommendations for the device for proactively reducing risk and maintaining a smaller attack surface.

    - Use the **Discovered vulnerabilities** tab to see any known CVEs associated with the device, helping you decide whether to patch, remove, or contain the device.

1. View view newly detected data and security assessments from other locations in Microsoft 365 Defender. For example, from the left-hand navigation pane:

    1. Select **Endpoints > Recommendations** to view all current recommendations for your organization. Filter the grid by selecting to view only devices that are **Not onboarded**, to focus in on recommendations for all devices that aren't endpoints.

        For more information, see [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation).


    1. Select **Incidents & alerts > alerts** to view aggregated alerts across your network, including IoT-focused alerts for your IoT devices. For more information, see [Alerts queue in Microsoft 365 Defender](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response).

    1. Select **Endpoints > Weaknesses** to view aggregated vulnerabilities across your network. For more information, see [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses).

## Cancel your Defender for IoT plan

You may need to cancel a Defender for IoT plan if you no longer need the service, or if you want to remove the changes created by this tutorial.

You'd also need to cancel your plan and onboard again if you need to work with a new payment entity or Azure subscription, or if you've [registered an Enterprise IoT network sensor](eiot-sensor.md) and need to update the number of [committed devices](architecture.md#what-is-a-defender-for-iot-committed-device). <!--right? b/c no need to add more committed devices if they're all managed by mde-->

To cancel your Defender for IoT plan in the [https://security.microsoft.com](https://security.microsoft.com/) portal, go to **Settings** \> **Device discovery** \> **Enterprise IoT**, and select **Cancel plan**. For example:

:::image type="content" source="media/enterprise-iot/defender-for-endpoint-cancel-plan.png" alt-text="Screenshot of the Cancel plan option on the Microsoft 365 Defender page.":::

After you cancel your plan, the integration stops and you'll no longer get added security value in Microsoft 365 Defender, or detect new Enterprise IoT devices in Defender for IoT.

> [!IMPORTANT]
> You can also cancel a plan from Defender for IoT in the Azure portal. Canceling a plan from the Azure portal removes all Defender for IoT services from the subscription, including both OT and Enterprise IOT services. Do this with care.
>
> If you've registered an Enterprise IoT network sensor (Public preview), data collected by the sensor, such as extra devices, remains in your Microsoft 365 Defender instance. Make sure to manually delete data from Microsoft 365 Defender as needed. <!-- what data? is this only if we've included a sensor? what if you're switching subscriptions or changing payment? should you delete data? how can you do this? maybe let's move this to the sensor page?-->

## Next steps

After onboarding a Enterprise IoT plan, you can also view detected IoT devices, together with OT network devices, in Defender for IoT in the Azure portal. For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

To gain more visibility into additional IoT segments of your corporate network, not otherwise covered by Defender for Endpoint, set up an Enterprise IoT network sensor (Public preview).

Customers that have set up an Enterprise IoT network sensor will be able to see all discovered devices in the **Device inventory** in either Microsoft 365 Defender or Defender for IoT in the Azure portal.

For more information, see [Enhance device discovery with an Enterprise IoT network sensor](eiot-sensor.md).


