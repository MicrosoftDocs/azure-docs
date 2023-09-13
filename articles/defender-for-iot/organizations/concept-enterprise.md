---
title: Securing IoT devices | Microsoft Defender for IoT
description: Learn how integrating Microsoft Defender for Endpoint and Microsoft Defender for IoT's security content enhances your IoT network security.
ms.topic: concept-article
ms.date: 09/13/2023
ms.custom: enterprise-iot
#CustomerIntent: As a Defender for IoT customer, I want to understand how I can secure my enterprise IoT devices with Microsoft Defender for IoT so that I can protect my organization from IoT threats.
---

# Securing IoT devices in the enterprise

The number of IoT devices continues to grow exponentially across enterprise networks, such as the printers, Voice over Internet Protocol (VoIP) devices, smart TVs, and conferencing systems scattered around many office buildings. 

While the number of IoT devices continues to grow, they often lack the security safeguards that are common on managed endpoints like laptops and mobile phones. To bad actors, these unmanaged devices can be used as a point of entry for lateral movement or evasion, and too often, the use of such tactics leads to the exfiltration of sensitive information.

[Microsoft Defender for IoT](./index.yml) seamlessly integrates with [Microsoft 365 Defender](/microsoft-365/security/defender) and [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) to provide both IoT device discovery and security value for IoT devices, including purpose-built alerts, recommendations, and vulnerability data.

## IoT security across Microsoft 365 Defender and Azure

Defender for IoT provides IoT security functionality across both the Microsoft 365 Defender and [Azure portals](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started).

If you're a Microsoft 365 E5 (ME5) or E5 Security customer, toggle on support for enterprise IoT (eIoT) devices in the Microsoft 365 Defender portal to view IoT-specific security value, including risk levels, exposure levels, vulnerabilities, and recommendations in Microsoft 365 Defender. <!--what about alerts?--> If you don't have ME5/E5 Security licenses, but you are a Microsoft Defender for Endpoint customer, purchase standalone, per-device licenses to gain the same IoT-specific security value.

The added security value is available in Microsoft 365 Defender, which is Microsoft's central portal for combined enterprise IT and IoT device security.<!--discovered by MDE agents? what if i don't have MDE?-->

Integrating your Enterprise IoT plan with Microsoft 365 Defender requires the following:

- Either an ME5 or E5 Security license, or a Microsoft Defender for Endpoint P2 license for standalone licenses
- Microsoft 365 Defender access as a [Global administrator](../../active-directory/roles/permissions-reference.md#global-administrator)
<!--removing this- Azure access as a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner)-->


<!--not sure this is still correct. 
The following image shows the architecture and extra features added with an Enterprise IoT plan in Microsoft 365 Defender:

:::image type="content" source="media/enterprise-iot/architecture-endpoint-only.png" alt-text="Diagram of the service architecture when you have an Enterprise IoT plan added to Defender for Endpoint." border="false":::
-->

For more information, see:

- [Defender for IoT subscription billing](billing.md)
- [Device discovery overview](/microsoft-365/security/defender-endpoint/device-discovery)
- [Alerts queue in Microsoft 365 Defender](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response) <!--do we still have alerts?-->
- [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)
- [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses)
- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Proactively hunt with advanced hunting in Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview)

## Next steps

Start securing your Enterprise IoT network resources with by [onboarding to Defender for IoT from Microsoft 365 Defender](eiot-defender-for-endpoint.md).
