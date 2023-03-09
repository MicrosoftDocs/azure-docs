---
title: Securing IoT devices in the enterprise with Microsoft Defender for Endpoint
description: Learn how integrating Microsoft Defender for Endpoint and Microsoft Defender for IoT's security content and network sensors enhances your IoT network security.
ms.topic: concept-article
ms.date: 10/19/2022
ms.custom: enterprise-iot
---

# Securing IoT devices in the enterprise

The number of IoT devices continues to grow exponentially across enterprise networks, such as the printers, Voice over Internet Protocol (VoIP) devices, smart TVs, and conferencing systems scattered around many office buildings.

While the number of IoT devices continues to grow, they often lack the security safeguards that are common on managed endpoints like laptops and mobile phones. To bad actors, these unmanaged devices can be used as a point of entry for lateral movement or evasion, and too often, the use of such tactics leads to the exfiltration of sensitive information.

[Microsoft Defender for IoT](./index.yml) seamlessly integrates with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) to provide both IoT device discovery and security value for IoT devices, including purpose-built alerts, recommendations, and vulnerability data.

> [!IMPORTANT]
> The Enterprise IoT Network sensor is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## IoT security across Microsoft 365 Defender and Azure

Defender for IoT provides IoT security functionality across both the Microsoft 365 Defender and [Azure portals](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) using the following methods:

|Method  |Description and requirements | Configure in ... |
|---------|---------|---------|
|**[An Enterprise IoT plan](#security-value-in-microsoft-365-defender) only**    | Add an Enterprise IoT plan in Microsoft 365 Defender to view IoT-specific alerts, recommendations, and vulnerability data in Microsoft 365 Defender. <br><br>The extra security value is provided for IoT devices detected by Defender for Endpoint.  <br><br>**Requires**: <br>   - A Microsoft Defender for Endpoint P2 license<br> - Microsoft 365 Defender access as a [Global administrator](../../active-directory/roles/permissions-reference.md#global-administrator)<br>- Azure access as a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner)  | Add your Enterprise IoT plan in the **Settings** \> **Device discovery** \> **Enterprise IoT** page in Microsoft 365 Defender. |
|**[An Enterprise IoT plan](#security-value-in-microsoft-365-defender) plus an [Enterprise IoT sensor](#device-visibility-with-enterprise-iot-sensors-public-preview)**     |  Add an Enterprise IoT plan in Microsoft 365 Defender to add IoT-specific alerts, recommendations, and vulnerability data Microsoft 365 Defender, for IoT devices detected by Defender for Endpoint.  <br><br>Register an Enterprise IoT sensor in Defender for IoT for more device visibility in both Microsoft 365 Defender and the Azure portal. An Enterprise IoT sensor also adds alerts and recommendations triggered by the sensor in the Azure portal.<br><br>**Requires**: <br>- A Microsoft Defender for Endpoint P2 license<br> - Microsoft 365 Defender access as a [Global administrator](../../active-directory/roles/permissions-reference.md#global-administrator)<br>- Azure access as a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner)<br>- A physical or VM appliance to use as a sensor  |Add your Enterprise IoT plan in the **Settings** \> **Device discovery** \> **Enterprise IoT** page in Microsoft 365 Defender. <br><br>Register an Enterprise IoT sensor in the **Getting started** > **Set up Enterprise IoT Security** page in Defender for IoT in the Azure portal. |
|**[An Enterprise IoT sensor only](#device-visibility-with-enterprise-iot-sensors-only)**     |   Register an Enterprise IoT sensor in Defender for IoT for Enterprise IoT device visibility, alerts, and recommendations in the Azure portal only. <br><br>Vulnerability data isn't currently available. <br><br>**Requires**:    <br>- Azure access as a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) <br>- A physical or VM appliance to use as a sensor | Register an Enterprise IoT sensor in the **Getting started** > **Set up Enterprise IoT Security** page in Defender for IoT in the Azure portal. |

## Security value in Microsoft 365 Defender

Defender for IoT's Enterprise IoT plan adds purpose-built alerts, recommendations, and vulnerability data for the IoT devices discovered by Defender for Endpoint agents. The added security value is available in Microsoft 365 Defender, which is Microsoft's central portal for combined enterprise IT and IoT device security.

For example, use the added security recommendations in Microsoft 365 Defender to open a single IT ticket to patch vulnerable applications on both servers and printers. Or, use a recommendation to request that the network team adds firewall rules that apply for both workstations and cameras communicating with a suspicious IP address.

The following image shows the architecture and extra features added with an Enterprise IoT plan in Microsoft 365 Defender:

:::image type="content" source="media/enterprise-iot/architecture-endpoint-only.png" alt-text="Diagram of the service architecture when you have an Enterprise IoT plan added to Defender for Endpoint." border="false":::


> [!NOTE]
> Defender for Endpoint doesn't issue IoT-specific alerts, recommendations, and vulnerability data without an Enterprise IoT plan in Microsoft 365 Defender. Use our [quickstart](eiot-defender-for-endpoint.md) to start seeing this extra security value across your network.
>

For more information, see:

- [Enable Enterprise IoT security in Defender for Endpoint](eiot-defender-for-endpoint.md)
- [Alerts queue in Microsoft 365 Defender](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response)
- [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)
- [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses)

## Device visibility with Enterprise IoT sensors (Public preview)

IT networks can be complex, and Defender for Endpoint agents may not give you full visibility for all IoT devices. For example, if you have a VLAN dedicated to VoIP devices with no other endpoints, Defender for Endpoint may not be able to discover devices on that VLAN.

To discover devices not covered by Defender for Endpoint, register an Enterprise IoT network sensor and gain full visibility over your network devices.

The Enterprise IoT network sensor also triggers IoT-specific alerts and recommendations in the Azure portal. Alerts and recommendations triggered by an Enterprise IoT sensor are available in the Azure portal only, and not in Microsoft 365

The following image shows the architecture of an Enterprise IoT network sensor connected to Defender for IoT, in addition to an Enterprise IoT plan added in Microsoft 365 Defender:

:::image type="content" source="media/enterprise-iot/architecture-endpoint-and-sensor.png" alt-text="Diagram of an Enterprise IoT sensor connected to Defender for IoT with an Enterprise IoT plan in Microsoft 365 Defender." border="false":::

View discovered devices in both Microsoft 365 Defender and Defender for IoT, whether they've been discovered by Defender for Endpoint or discovered by your network sensor.

The Enterprise IoT network sensor is a low-touch appliance, with automatic updates and transparent maintenance for customers.

> [!NOTE]
> Deploying a network sensor is optional and is *not* a prerequisite for integrating Defender for Endpoint and Defender for IoT.

Add an Enterprise IoT sensor from Defender for IoT in the Azure portal. For more information, see:

- [Enhance IoT security monitoring with an Enterprise IoT network sensor](eiot-sensor.md)
- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)
- [Microsoft Defender for IoT alert types and descriptions](alert-engine-messages.md)
- [Enhance security posture with security recommendations](recommendations.md)

### Device visibility with Enterprise IoT sensors only

You can also register an Enterprise IoT network sensor *without* using Defender for Endpoint, and view IoT devices, alerts, and recommendations in Defender for IoT in the Azure portal only. This view is especially helpful when you're also managing Operational Technology (OT) devices, monitored by OT network sensors with Defender for IoT.

The following image shows the architecture of an Enterprise IoT network sensor connected to Defender for IoT, without an Enterprise IoT plan:

:::image type="content" source="media/enterprise-iot/architecture-sensor-only.png" alt-text="Diagram of an Enterprise IoT network sensor with Defender for IoT only." border="false":::

## Next steps

Start securing your Enterprise IoT network resources with by [onboarding to Defender for IoT from Microsoft 365 Defender](eiot-defender-for-endpoint.md). Then, add even more device visibility by [adding an Enterprise IoT network sensor](eiot-sensor.md) to Defender for IoT.

For more information, see [Enterprise IoT networks frequently asked questions](faqs-eiot.md).