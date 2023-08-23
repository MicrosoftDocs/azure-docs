---
title: Securing IoT devices in the enterprise with Microsoft Defender for Endpoint
description: Learn how integrating Microsoft Defender for Endpoint and Microsoft Defender for IoT's security content and network sensors enhances your IoT network security.
ms.topic: concept-article
ms.date: 05/31/2023
ms.custom: enterprise-iot
---

# Securing IoT devices in the enterprise

The number of IoT devices continues to grow exponentially across enterprise networks, such as the printers, Voice over Internet Protocol (VoIP) devices, smart TVs, and conferencing systems scattered around many office buildings.

While the number of IoT devices continues to grow, they often lack the security safeguards that are common on managed endpoints like laptops and mobile phones. To bad actors, these unmanaged devices can be used as a point of entry for lateral movement or evasion, and too often, the use of such tactics leads to the exfiltration of sensitive information.

[Microsoft Defender for IoT](./index.yml) seamlessly integrates with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) to provide both IoT device discovery and security value for IoT devices, including purpose-built alerts, recommendations, and vulnerability data.

## IoT security across Microsoft 365 Defender and Azure

Defender for IoT provides IoT security functionality across both the Microsoft 365 Defender and [Azure portals](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started).

[Add an Enterprise IoT plan](eiot-defender-for-endpoint.md) in the **Settings** \> **Device discovery** \> **Enterprise IoT** page in Microsoft 365 Defender to view IoT-specific alerts, recommendations, and vulnerability data in Microsoft 365 Defender. The extra security value is provided for IoT devices detected by Defender for Endpoint.  

Integrating your Enterprise IoT plan with Microsoft 365 Defender requires the following:

- A Microsoft Defender for Endpoint P2 license
- Microsoft 365 Defender access as a [Global administrator](../../active-directory/roles/permissions-reference.md#global-administrator)
- Azure access as a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner)

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
- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Proactively hunt with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)

## Next steps

Start securing your Enterprise IoT network resources with by [onboarding to Defender for IoT from Microsoft 365 Defender](eiot-defender-for-endpoint.md).
