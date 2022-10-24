---
title: Enterprise IoT device security with Defender for Endpoint and Microsoft Defender for IoT
description: Learn how integrating Microsoft Defender for Endpoint and Microsoft Defender for IoT enhances your IoT network security.
ms.topic: conceptual
ms.date: 10/19/2022
---

# Secure IoT devices in the enterprise

<!--these include files don't work [!INCLUDE [Microsoft 365 Defender rebranding](/microsoft-365/security/includes/microsoft-defender.md)]-->

**Applies to:**

- [Microsoft Defender for Endpoint P2](https://go.microsoft.com/fwlink/?linkid=2154037)
- [Microsoft 365 Defender](https://go.microsoft.com/fwlink/?linkid=2118804)

<!--these include files don't work--[!INCLUDE[Prerelease information](/microsoft-365/security/includes/prerelease.md)]-->

> Want to experience Microsoft Defender for Endpoint? [Sign up for a free trial.](https://signup.microsoft.com/create-account/signup?products=7f379fee-c4f9-4278-b0a1-e4c8c2fcdf7e&ru=https://aka.ms/MDEp2OpenTrial?ocid=docs-wdatp-enablesiem-abovefoldlink)

The number of IoT devices continues to grow exponentially across enterprise networks, such as the printers, Voice over Internet Protocol (VoIP) devices, smart TVs, and conferencing systems scattered around many office buildings.

While the number of IoT devices continues to grow, they often lack the security safeguards that are common on managed endpoints like laptops and mobile phones. To bad actors, these un-managed devices can be used as a point of entry for lateral movement or evasion, and too often, the use of such tactics leads to the exfiltration of sensitive information.

[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) seamlessly integrates with [Microsoft Defender for IoT](/azure/defender-for-iot/organizations/) to provide both device discovery for all IoT devices in your network, and also security value for IoT devices, including purpose-built alerts, recommendations, and vulnerability data.

## Extra security value in Microsoft 365 Defender

Microsoft Defender for Endpoint customers can add an Enterprise IoT price plan to get extra security value for their IoT devices, including including alerts, recommendations, and vulnerabilities for IoT devices. These extra security benefits are added directly in Microsoft 365 Defender, providing a single portal for all enterprise IoT security monitoring.

For example, you might use the added security recommendations to open a single IT ticket to patch vulnerable applications on both servers and printers. Or, you might request that the network team add firewall rules that apply for both workstations and cameras communicating with a suspicious IP address.

Without an Enterprise IoT plan in Microsoft 365 Defender, Defender for Endpoint doesn't issue IoT-specific alerts and recommendations. Use our [Onboard with Microsoft Defender for IoT](eiot-mde.md) quickstart to get started seeing this extra security value in Microsoft 365 Defender.

For more information, see:

- [Alerts queue in Microsoft 365 Defender](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response).
- [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation).
- [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses).

## Enhanced support with Defender for IoT network sensors (Public preview)

IT networks can be complex, and Defender for Endpoint agents may not give you full visibilty for all IoT devices. For example, if you have a VLAN dedicated to VOIP devices with no other endpoints, Defender for Endpoint may not be able to discover devices on that VLAN.

To discover devices not covered by Defender for Endpoint, install a Defender for IoT Enterprise IoT network sensor, and view newly discovered devices together with the rest of your device inventory. The Enterprise IoT network sensor is a low-touch appliance, with automatic updates and transparent maintenance for customers.

> [!NOTE]
> Deploying a network sensor is optional and is *not* a prerequisite for integrating Defender for Endpoint and Defender for IoT.


Add an Enterprise IoT sensor from Defender for IoT in the Azure portal. For more information, see [Enhance IoT security monitoring with an Enterprise IoT network sensor](eiot-sensor.md).

<!--add supported protocols in the FAQ, similar to MDE. xref between them.-->
<!--relelvant to add comparison between OT sensor? more important we need to explain when to use the OT sensor and when to use the EIoT sensor.-->

### Shared device visibility in the Azure portal

In addition to viewing newly discovered devices in the Microsoft 365 Defender **Device inventory** page, deploying an Enterprise IoT network sensor also displays discovered devices in the Defender for IoT **Device inventory** page, in the Azure portal. This view is especially helpful when you are also managing Operational Technology (OT) devices, monitored by OT network sensors with Defender for IoT. <!--do we view EIoT devices discovered by MDE here too?-->

An Enterprise IoT network sensor provides a single, continuous, and integrated security solution across all your OT and Enterprise IoT devices.

For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

<!--
## IoT security feature comparison summary

<!--nimrod says this isn't relevant for docs here

The following table provides a comparison of the increased security features available for IoT devices as you use Microsoft 365 Defender, add an Enterprise IoT plan, or an extra Enterprise IoT network sensor.

Use the links to find more information about each feature in the Microsoft 365 Defender portal, or Defender for IoT in the Azure portal.

|Security feature  |[Defender for Endpoint only](/microsoft-365/security/defender-endpoint/device-discovery)  |[Defender for Endpoint and <br> an Enterprise IoT plan](eiot-mde.md)  |[Defender for Endpoint, <br>Enterprise IoT plan, <br>and Enterprise IoT network sensors](eiot-sensor.md) (Public preview) |
|---------|---------|---------|---------|
|**Initial device discovery**    |  [Microsoft 365 only](/microsoft-365/security/defender-endpoint/device-discovery)      |     [Microsoft 365](/microsoft-365/security/defender-endpoint/device-discovery)  / [Azure](how-to-manage-device-inventory-for-organizations.md)   |     [Microsoft 365](/microsoft-365/security/defender-endpoint/device-discovery)  / [Azure](how-to-manage-device-inventory-for-organizations.md)   |
|**Full device discovery**   |    -     |    -     |   [Microsoft 365](/microsoft-365/security/defender-endpoint/device-discovery)  / [Azure](how-to-manage-device-inventory-for-organizations.md)     |
|**Security recommendations**      |    -     |   [Microsoft 365 only](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)      |    [Microsoft 365 only](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)     |
|**Vulnerabilities**    |    -     |    [Microsoft 365 only](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses)    |    [Microsoft 365 only](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses)    |
|**Basic alerts**      |  [Microsoft 365 only](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response)      |     [Microsoft 365 only](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response)  | [Microsoft 365 only](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response)        |
|**IoT-focused device alerts**     |    -     |   [Microsoft 365 only](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response)      |     [Microsoft 365 only](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response)  |
|**IoT hunting and custom detections** <!--what does this mean? where can users find this? advanced hunting blade in mde    |    -     |      [Microsoft 365 only]   |     [Microsoft 365 only]   |
|**Response** <br>[Microsoft 365 only]<!--do we include this? when is this getting added? what to xref to. this is the default response in MDE. this is "contain device".   |   [Microsoft 365 only]      |    [Microsoft 365 only]    |    [Microsoft 365 only]     |

-->
## Next steps

Start securing your Enterprise IoT network resources with by [onboarding to Defender for IoT from Microsoft 365 Defender](eiot-mde.md).

For more information, see [Enterprise IoT networks frequently asked questions](faqs-eiot.md).
