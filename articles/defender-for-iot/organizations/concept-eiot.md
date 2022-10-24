---
title: Enterprise IoT device security with Defender for Endpoint and Microsoft Defender for IoT
description: Learn how integrating Microsoft Defender for Endpoint and Microsoft Defender for IoT enhances your IoT network security.
ms.topic: conceptual
ms.date: 10/19/2022
---

# Enterprise IoT device security with Defender for Endpoint and Defender for IoT

<!--these include files don't work [!INCLUDE [Microsoft 365 Defender rebranding](/microsoft-365/security/includes/microsoft-defender.md)]-->

**Applies to:**

- [Microsoft Defender for Endpoint P2](https://go.microsoft.com/fwlink/?linkid=2154037)
- [Microsoft 365 Defender](https://go.microsoft.com/fwlink/?linkid=2118804)

<!--these include files don't work--[!INCLUDE[Prerelease information](/microsoft-365/security/includes/prerelease.md)]-->

> Want to experience Microsoft Defender for Endpoint? [Sign up for a free trial.](https://signup.microsoft.com/create-account/signup?products=7f379fee-c4f9-4278-b0a1-e4c8c2fcdf7e&ru=https://aka.ms/MDEp2OpenTrial?ocid=docs-wdatp-enablesiem-abovefoldlink)

[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) seamlessly integrates with [Microsoft Defender for IoT](/azure/defender-for-iot/organizations/) for extra security value for IoT devices and extended IoT device discovery across your network.

Enterprise IoT devices include Voice over Internet Protocol (VoIP) devices, printers, and cameras, and more, and can be viewed in Microsoft 365 Defender alongside other IT devices like workstations, servers, and mobile devices.

## Extra security value in Microsoft 365 Defender

While Microsoft 365 P2 customers can already view discovered IoT devices in the Microsoft 365 Defender [Device inventory](/microsoft-365/security/defender-endpoint/machines-view-overview), onboarding an Enterprise IoT plan provides extra security value with alerts, recommendations and vulnerabilities for discovered IoT devices.

For example, use the augmented security recommendations to open a single IT ticket to patch vulnerable applications on both servers and printers. Or as the network team to add firewall rules that apply for both workstations and cameras communicating with a suspicious IP address.

Use our [Onboard with Microsoft Defender for IoT](eiot-mde.md) tutorial to get started seeing this extra security value in your environments.

For more information, see:

- [Alerts queue in Microsoft 365 Defender](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response).
- [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation).
- [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses).


## Enhanced support with Defender for IoT network sensors (Public preview)

To discover extra devices not covered by Defender for Endpoint, Microsoft 365 P2 and Defender for IoT customers can also install the Enterprise IoT network sensor. The Enterprise IoT network sensor provides visibility into IoT segments of the corporate network that may not be covered by Defender for Endpoint, such as if you have a VLAN dedicated to VOIP phones. 

> [!NOTE]
> Deploying a network sensor is optional and is *not* a prerequisite for integrating Defender for Endpoint and Defender for IoT.

For more information, see [Enhance IoT security monitoring with an Enterprise IoT network sensor](eiot-sensor.md).

<!--add supported protocols in the FAQ, similar to MDE. xref between them.-->
<!--relelvant to add comparison between OT sensor? more important we need to explain when to use the OT sensor and when to use the EIoT sensor.-->
<!--we can mention that the sensor is "low touch", is updated automatically, and we don't need to maintain it. they're completely transparent.-->

### Shared device visibility in the Azure portal

In addition to viewing IoT devices in Microsoft 365 Defender's **Device inventory**, customers onboarded to Enterprise IoT can also view detected IoT devices in the Azure portal. Viewing IoT devices in the Azure portal is especially helpful when you're also using Defender for IoT to view and manage Operational Technology (OT) network devices.

View your devices in Azure's Defender for IoT's **Device inventory** for a single, continuous, and integrated security solution across all your OT and Enterprise IoT devices.

For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

## IoT security feature comparison summary

<!--nimrod says this isn't relevant for docs here--> 

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
|**IoT hunting and custom detections** <!--what does this mean? where can users find this? advanced hunting blade in mde-->     |    -     |      [Microsoft 365 only]   |     [Microsoft 365 only]   |
|**Response** <br>[Microsoft 365 only]<!--do we include this? when is this getting added? what to xref to. this is the default response in MDE. this is "contain device".-->     |   [Microsoft 365 only]      |    [Microsoft 365 only]    |    [Microsoft 365 only]     |

## Next steps

Start securing your Enterprise IoT network resources with by [onboarding to Defender for IoT from Microsoft 365 Defender](eiot-mde.md).

For more information, see [Enterprise IoT networks frequently asked questions](faqs-eiot.md).
