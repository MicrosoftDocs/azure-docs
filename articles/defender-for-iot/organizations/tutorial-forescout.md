---
title: Integrate Forescout with Microsoft Defender for IoT
description: In this tutorial, you learn how to integrate Microsoft Defender for IoT with Forescout.
ms.topic: tutorial
ms.date: 02/08/2022
ms.custom: how-to
---

# Integrate Forescout with Microsoft Defender for IoT

> [!NOTE]
> Microsoft Defender for IoT was formally known as [CyberX](https://blogs.microsoft.com/blog/2020/06/22/microsoft-acquires-cyberx-to-accelerate-and-secure-customers-iot-deployments/). References to CyberX refer to Defender for IoT.

This article helps you learn how to integrate Forescout with Microsoft Defender for IoT.

Microsoft Defender for IoT delivers an ICS and IoT cybersecurity platform. Defender for IoT is the only platform with ICS aware threat analytics and machine learning. Defender for IoT provides:

- Immediate insights about ICS and the device landscape with an extensive range of details about attributes.

- ICS-aware deep embedded knowledge of OT protocols, devices, applications, and their behaviors.

- Immediate insights into vulnerabilities and known zero-day threats.

- An automated ICS threat modeling technology to predict the most likely paths of targeted ICS attacks via proprietary analytics.

The Forescout integration helps reduce the time required for industrial and critical infrastructure organizations to detect, investigate, and act on cyber threats.

- Use Microsoft Defender for IoT OT device intelligence to close the security cycle by triggering Forescout policy actions. For example, you can automatically send an alert email to SOC administrators when specific protocols are detected, or when firmware details change.

- Correlate Defender for IoT information with other *Forescout eyeExtended* modules that oversee monitoring, incident management, and device control.

The Defender for IoT integration with the Forescout platform provides centralized visibility, monitoring, and control for the IoT and OT landscape. These bridged platforms enable automated device visibility, management to ICS devices, and siloed workflows. The integration provides SOC analysts with multilevel visibility into OT protocols deployed in industrial environments. Information becomes available, such as firmware, device types, operating systems, and risk analysis scores, based on proprietary Microsoft Defender for IoT technologies.

In this article, you learn how to:

> [!div class="checklist"]
> - Generate an access token
> - Configure the Forescout platform
> - Verify communication
> - View device attributes in Forescout
> - Create Microsoft Defender for IoT policies in Forescout

## Prerequisites

Before you begin, make sure that you have the following prerequisites:

- Microsoft Defender for IoT version 2.4 or above

- Forescout version 8.0 or above

- A license for the Forescout eyeExtend module for the Microsoft Defender for IoT Platform.

- Access to a Defender for IoT OT sensor as an Admin user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Generate an access token

Access tokens allow external systems to access data discovered by Defender for IoT. Access tokens allow that data to be used for external REST APIs,  and over SSL connections. You can generate access tokens in order to access the Microsoft Defender for IoT REST API.

To ensure communication from Defender for IoT to Forescout, you must generate an access token in Defender for IoT.

**To generate an access token**:

1. Sign in to the Defender for IoT sensor that will be queried by Forescout.

1. Select **System Settings** > **Integrations** > **Access Tokens**.

1. Select **Generate token**.

1. In the **Description** field, add a short description regarding the purpose of the access token. For example: "integration with python script".

1. Select **Generate**. The token is then displayed in the dialog box.

   > [!NOTE]
   > Record the token in a safe place. You will need it when you configure the Forescout Platform.

1. Select **Finish**.

## Configure the Forescout platform

You can now configure the Forescout platform to communicate with a Defender for IoT sensor.

**To configure the Forescout platform**:

1. On the Forescout platform, search for and install **the Forescout eyeExtend module for CyberX**.

1. Sign in to the CounterACT console.

1. From the Tools menu, select **Options**.

1. Navigate to **Modules** > **CyberX Platform**.

1. In the Server Address field, enter the IP address of the Defender for IoT sensor that will be queried by the Forescout appliance.

1. In the Access Token field, enter the access token that was generated earlier.

1. Select **Apply**.

### Change sensors in Forescout

To make the Forescout platform communicate with a different sensor, the configuration within Forescout has to be changed.

**To change sensors in Forescout**:

1. Create a new access token in the relevant Defender for IoT sensor.

1. Navigate to **Forescout Modules** > **CyberX Platform**.

1. Delete the information displayed in both fields.

1. Sign in to the new Defender for IoT sensor and [generate a new access token](#generate-an-access-token).

1. In the Server Address field, enter the new IP address of the Defender for IoT sensor that will be queried by the Forescout appliance.

1. In the Access Token field, enter the new access token.

1. Select **Apply**.

## Verify communication

Once the connection has been configured, you need to confirm that the two platforms are communicating.

**To confirm the two platforms are communicating**:

1. Sign in to the Defender for IoT sensor.

1. Navigate to **System Settings** > **Access Tokens**.

The Used field alerts you if the connection between the sensor and the Forescout appliance isn't working. If **N/A** is displayed, the connection isn't working. If **Used** is displayed, it indicates the last time an external call with this token was received.

:::image type="content" source="media/tutorial-forescout/forescout-access-token-added-successfully.png" alt-text="Screenshot of generated access tokens" lightbox="media/tutorial-forescout/forescout-access-token-added-successfully.png":::

## View device attributes in Forescout

By integrating Defender for IoT with Forescout, you're able to view different device's attributes that were detected by Defender for IoT, in the Forescout application.

**To view a device's attributes**:

1. Sign in to the Forescout platform and then navigate to the **Asset Inventory**.

1. Select the **CyberX Platform**.

    To view additional details, from the **Device Inventory Hosts** section, right-click on a device. The host details dialog box opens with additional information.

The following table lists all of the attributes that are visible through the Forescout application:

| Attribute | Description |
|--|--|
| **Authorized by Microsoft Defender for IoT** | A device detected on your network by Defender for IoT during the network learning period. |
| **Firmware** | The firmware details of the device. For example, model and version details. |
| **Name** | The name of the device. |
| **Operating System** | The operating system of the device. |
| **Type** | The type of device. For example, a PLC, Historian, or Engineering Station. |
| **Vendor** | The vendor of the device. For example, Rockwell Automation. |
| **Risk level** | The risk level calculated by Defender for IoT. |
| **Protocols** | The protocols detected in the traffic generated by the device. |

## Create Microsoft Defender for IoT policies in Forescout

Forescout policies can be used to automate control and management of devices detected by Defender for IoT. For example:

- Automatically email the SOC administrators when specific firmware versions are detected.

- Add specific Defender for IoT detected devices to a Forescout group for further handling in incident and security workflows, for example with other SIEM integrations.

You can create custom policies in Forescout using Defender for IoT conditional properties.

**To access Defender for IoT properties**:

1. Navigate to **Policy Conditions** > **Properties Tree**.

1. In the Properties Tree, expand the **CyberX Platform** folder. The Defender for IoT following properties are available:

    - Protocols
    - Risk Level
    - Authorized by CyberX
    - Type
    - Firmware
    - Name
    - Operating System
    - Vendor

## Next steps

> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](integrate-overview.md)
