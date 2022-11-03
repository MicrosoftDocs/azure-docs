---
title: Enterprise IoT device security with Defender for Endpoint and Microsoft Defender for IoT
description: Learn how integrating Microsoft Defender for Endpoint and Microsoft Defender for IoT enhances your IoT network security.
ms.topic: conceptual
ms.date: 10/19/2022
---

# Securing IoT devices in the enterprise

The number of IoT devices continues to grow exponentially across enterprise networks, such as the printers, Voice over Internet Protocol (VoIP) devices, smart TVs, and conferencing systems scattered around many office buildings.

While the number of IoT devices continues to grow, they often lack the security safeguards that are common on managed endpoints like laptops and mobile phones. To bad actors, these un-managed devices can be used as a point of entry for lateral movement or evasion, and too often, the use of such tactics leads to the exfiltration of sensitive information.

[Microsoft Defender for IoT](/azure/defender-for-iot/organizations/) seamlessly integrates with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) to provide both device discovery for all IoT devices in your network and security value for IoT devices, including purpose-built alerts, recommendations, and vulnerability data.

> [!IMPORTANT]
> The Enterprise IoT Network sensor is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## IoT security across Microsoft 365 Defender and Azure

Defender for IoT provides IoT security functionality across both the Microsoft 365 Defender and Azure portals using the following methods:

|Method  |Description | Requirements |
|---------|---------|---------|
|**[An Enterprise IoT plan](#security-value-in-microsoft-365-defender) only**    | Add an Enterprise IoT plan in Microsoft 365 Defender to view IoT-specific alerts, recommendations, and vulnerability data in Microsoft 365 Defender. <br><br>The extra security value is provided for IoT devices detected by Defender for Endpoint.       |- A Microsoft Defender for Endpoint P2 license<br><br> - Microsoft 365 Defender access as a [Global administrator](/azure/active-directory/roles/permissions-reference#global-administrator)<br><br>- Azure access as a [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) |
|**[An Enterprise IoT plan](#security-value-in-microsoft-365-defender) plus an [Enterprise IoT sensor](#support-with-defender-for-iot-network-sensors-public-preview)**     |  Add an Enterprise IoT plan in Microsoft 365 Defender to add IoT-specific alerts, recommendations, and vulnerability data Microsoft 365 Defender, for IoT devices detected by Defender for Endpoint.  <br><br>Register an Enterprise IoT sensor in Defender for IoT for more device visibilty in both Microsoft 365 Defender and the Azure portal.<!--do we view MDE managed devices in the Azure portal? this affects here and also down below-->     |- A Microsoft Defender for Endpoint P2 license<br><br> - Microsoft 365 Defender access as a [Global administrator](/azure/active-directory/roles/permissions-reference#global-administrator)<br><br>- Azure access as a [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner)<br><br>- A physical or VM appliance to use as a sensor |
|**[An Enterprise IoT sensor](#support-with-defender-for-iot-network-sensors-public-preview) only**     |   Register an Enterprise IoT sensor in Defender for IoT for Enterprise IoT device visibility in the Azure portal only. <br><br>Alerts, recommendations, and vulnerability data are not currently available.    |- Azure access as a [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) <br><br>- A physical or VM appliance to use as a sensor |

<!-- 3 options: MDE only, MDE + sensor, sensor only. support matrix - requirements in for each option and what you get from each option. possibly support matrix in a sep page? rayne to send examples. architecture diagram - from nimrod. -->

## Security value in Microsoft 365 Defender

The following image shows the architecture and extra features added with an Enterprise IoT plan in Microsoft 365 Defender:

:::image type="content" source="media/enterprise-iot/architecture-endpoint-only.png" alt-text="Diagram of the service architecture when you have an Enterprise IoT plan added to Defender for Endpoint.":::

Defender for IoT's Enterprise IoT plan adds purpose-built alerts, recommendations, and vulnerability data for the IoT devices discovered by Defender for Endpoint. The added security value is available in Microsoft 365 Defender only, which is Microsoft's central portal for combined enterprise IT and IoT device security.

For example, use the added security recommendations to open a single IT ticket to patch vulnerable applications on both servers and printers. Or, use a recommendation to request that the network team add firewall rules that apply for both workstations and cameras communicating with a suspicious IP address.

> [!NOTE]
> Defender for Endpoint doesn't issue IoT-specific alerts, recommendations, and vulnerability data without an Enterprise IoT plan in Microsoft 365 Defender. Use our [quickstart](eiot-mde.md) to start seeing this extra security value across your network.
>

For more information, see:

- [Enable Enterprise IoT security in Defender for Endpoint](eiot-mde.md)
- [Alerts queue in Microsoft 365 Defender](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response)
- [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)
- [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses)

## Device visibility with Enterprise IoT sensors (Public preview)

IT networks can be complex, and Defender for Endpoint agents may not give you full visibilty for all IoT devices. For example, if you have a VLAN dedicated to VoIP devices with no other endpoints, Defender for Endpoint may not be able to discover devices on that VLAN.

To discover devices not covered by Defender for Endpoint, register an Enterprise IoT network sensor and gain full visibility over your network devices.

The following image shows the architecture of an Enterprise IoT network sensor connected to Defender for IoT, in addition to an Enterprise IoT plan added in Microsoft 365 Defender:

:::image type="content" source="media/enterprise-iot/architecture-endpoint-and-sensor.png" alt-text="Diagram of an Enterprise IoT sensor connected to Defender for IoT with an Enterprise IoT plan in Microsoft 365 Defender.":::

View both devices discovered by Defender for Endpoint and devices discovered by your network sensor, in both Microsoft 365 Defender and Defender for IoT in the Azure portal.

The Enterprise IoT network sensor is a low-touch appliance, with automatic updates and transparent maintenance for customers.

> [!NOTE]
> Deploying a network sensor is optional and is *not* a prerequisite for integrating Defender for Endpoint and Defender for IoT.

Add an Enterprise IoT sensor from Defender for IoT in the Azure portal. For more information, see [Enhance IoT security monitoring with an Enterprise IoT network sensor](eiot-sensor.md) and [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

### Device visibility with Enterprise IoT sensors only

You can also register an Enterprise IoT network sensor *without* using Defender for Endpoint, and view IoT devices in Defender for IoT in the Azure portal only. This view is especially helpful when you are also managing Operational Technology (OT) devices, monitored by OT network sensors with Defender for IoT.

The following image shows the architecture of an Enterprise IoT network sensor connected to Defender for IoT, without an additional Enterprise IoT plan:

:::image type="content" source="media/enterprise-iot/architecture-sensor-only.png" alt-text="Diagram of an Enterprise IoT network sensor with Defender for IoT only.":::

<!--add supported protocols in the FAQ, similar to MDE. xref between them.-->
<!--relelvant to add comparison between OT sensor? more important we need to explain when to use the OT sensor and when to use the EIoT sensor.-->
<!--
### Shared device visibility in the Azure portal


In addition to viewing newly discovered devices in the Microsoft 365 Defender **Device inventory** page, deploying an Enterprise IoT network sensor also displays discovered devices in the Defender for IoT **Device inventory** page in the Azure portal. 
If you deploy an Enterprise IoT network sensor without adding an Enterprise IoT plan in Microsoft 365 Defender, you'll see devices detected by the sensor only, and only in the Azure portal.

Adding the Enterprise IoT network sensor together with an Enterprise IoT plan in Microsoft 365 Defender provides full visibility for all detected devices. You'll be able to view devices detected by the Enterprise IoT network sensor and Defender for Endpoint agents, in both Microsoft 365 Defender and Defender for IoT **Device inventory** pages.

For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).
-->
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
