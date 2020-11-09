---
title: About the Forescout integration
description: The Azure Defender for IoT integration with the Forescout platform provides a new level of centralized visibility, monitoring, and control for the IoT and OT landscape.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 10/26/2020
ms.topic: article
ms.service: azure
---

# About the Forescout integration

Azure Defender for IoT delivers an ICS and IoT cybersecurity platform built by blue team experts with a track record of defending critical national infrastructure. Defender for IoT is the only platform with patented ICS aware threat analytics and machine learning. Azure Defender for IoT provides:

- Immediate insights about ICS the device landscape with an extensive range of details about attributes.
- ICS-aware deep embedded knowledge of OT protocols, devices, applications, and their behaviors
- Immediate insights into vulnerabilities, as well as known and zero-day threats.
- An automated ICS threat modeling technology to predict the most likely paths of targeted ICS attacks via proprietary analytics.

The Defender for IoT integration with the Forescout platform provides a new level of centralized visibility, monitoring, and control for the IoT and OT landscape.

These bridged platforms enable automated device visibility and management to previously unreachable ICS devices and siloed workflows.

The integration provides SOC analysts with multilevel visibility into OT protocols deployed in industrial environments. Details are available for items such as firmware, device types, operating systems, and risk analysis scores based on proprietary Azure Defender for IoT technologies.

## Devices

### Device visibility and management

The device's inventory is enriched with critical attributes detected by the Azure Defender for IoT platform. This will ensures that you:

- Gain comprehensive and continuous visibility into the OT device landscape from a single-pane-of-glass.
- Obtain real-time intelligence about OT risks.

:::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/forescout-device-inventory.png" alt-text="Device inventory":::

:::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/forescout-device-details.png" alt-text="Device details":::

### Device control

The Forescout integration helps reduce the time required for industrial and critical infrastructure organizations to detect, investigate, and act on cyber threats.

- Use Azure Defender for IoT OT device intelligence to close the security cycle by triggering Forescout policy actions. For example, you can automatically send alert email to SOC administrators when specific protocols are detected, or when firmware details change.

- Correlate Defender for IoT information with other *Forescout eyeExtended* modules that oversee monitoring, incident management, and device control.

## System requirements

- Azure Defender for IoT version 2.4 or above
- Forescout version 8.0 or above
- A license for the *Forescout eyeExtend* module for the Azure Defender for IoT Platform.

### Getting more Defender for IoT information

- For white papers, webinars, videos, additional product information, and industrial security news, go to [CyberX.io](https://cyberx-labs.com/).
- For technical support visit [https://cyberx-labs.zendesk.com](https://cyberx-labs.zendesk.com/)
- For additional troubleshooting information, contact <support@cyberx-labs.com>.
- To access the Defender for IoT user guide from the console, select :::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/person-icon.png" alt-text="icon"::: and select **Download User Guide**.

### Getting more Forescout information

For more information about the Forescout platform, see the [Forescout Resource Center](https://www.forescout.com/company/resources/#resource_filter_group).

## System setup

This article describes how to set up communication between the Defender for IoT platform and the Forescout platform.

### Set up the Azure Defender for IoT platform

To ensure communication from Defender for IoT to Forescout, generate an access token in Azure Defender for IoT.

Access tokens allow external systems to access data discovered by Defender for IoT and perform actions with that data using the external REST API, over SSL connections. You can generate access tokens in order to access the Azure Defender for IoT REST API.

To generate a token:

1. Sign in to the Azure Defender for IoT Sensor that will be queried by Forescout.

2. Select **System Settings** and then select **Access Tokens** from the **General** section. The Access Tokens dialog box opens.
   :::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/generate-access-tokens-screen.png" alt-text="Access tokens":::
3. Select **Generate new token** from the Access Tokens dialog box.
4. Enter a token description in the **New access token** dialog box.
   :::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/new-forescout-token.png" alt-text="New access token":::
5. Select **Next.** The token is displayed in the dialog box. :::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/forescout-access-token-display-screen.png" alt-text="View token":::
   > [!NOTE]
   > *Record the token in a safe place. You will need it when configuring the Forescout Platform*.
6. Select **Finish**.
   :::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/forescout-access-token-added-successfully.png" alt-text="Finish adding token":::

### Set up the Forescout platform

You can set up the Forescout platform to communicate with an Azure Defender for IoT sensor.

To set up:

1. Install *the Forescout eyeExtended module for Azure Defender for IoT* on the Forescout platform.

2. Sign in to the CounterACT console and select **Options** from the **Tools** menu. The options dialog box opens.
3. Navigate to and select the **Modules** folder.
4. In the **Modules** pane, select **Defender for IoT Platform**. The Defender for IoT platform pane opens.
   :::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/settings-for-module.png" alt-text="Azure Defender for IoT module settings":::

   Enter the following information:

   - **Server Address** - Enter the IP address of the Defender for IoT sensor that will be queried by the Forescout appliance.
   - **Access Token** - Enter the access token generated for the Defender for IoT sensor that will connect to the Forescout appliance. See ***Set up the Defender for IoT Platform*** for details about generating a token.

5. Select **Apply**.

If you want the Forescout platform to communicate with another sensor:

6. Create a new access token in the relevant Defender for IoT sensor.
7. In the **Forescout Modules>Azure Defender for IoT Platform** dialog box:
   - Delete the information displayed.
   - Enter the new sensor IP address and the new access token information.

### Verify communication

After configuring Defender for IoT and Forescout, open the sensor's Access Tokens dialog box in Defender for IoT.

If **N/A** is displayed in the **Used** field for this token, the connection between the sensor and the Forescout appliance is not working.

**Used** indicates the last time an external call with this token was received.

:::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/forescout-access-token-added-successfully.png" alt-text="Verify token was received":::

## View Defender for IoT detections in Forescout

To view a device's attributes:

1. Sign in to the Forescout platform and then navigate to the **Device Inventory**.
2. Navigate to the **Defender for IoT Platform**. The following device attributes are displayed for OT devices detected by Defender for IoT.

   | Item                 | Description                                                                     |
   | -------------------- | ------------------------------------------------------------------------------- |
   | Authorized by Azure Defender for IoT | A device detected on your network by Defender for IoT during the network learning period. |
   | Firmware             | The firmware details of the device. For example, model and version details.     |
   | Name                 | The name of the device.                                                         |
   | Operating System     | The operating system of the device.                                             |
   | Type                 | The type of device. For example, a PLC, Historian or Engineering Station.        |
   | Vendor               | The vendor of the device. For example, Rockwell Automation.                     |
   | Risk level           | The risk level calculated by Defender for IoT.                            |
   | Protocols            | The protocols detected in the traffic generated by the device.                  |

:::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/device-firmware-attributes-in-forescout.png" alt-text="View firmware attributes":::

:::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/vendor-attributes-in-forescout.png" alt-text="View vendor attributes":::

### Viewing additional details

View additional device information for devices directed by Defender for IoT. For example, Forescout compliance and policy information.

To view additional details:

1. Right-click on a device from the device inventory hosts section. The host details dialog box opens with additional information.
   :::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/details-dialog-box-in-forescout.png" alt-text="Host Details":::

## Create Azure Defender for IoT policies in Forescout

Forescout policies can be used to automate control and management of devices detected by Defender for IoT. For example,

- Automatically email the SOC administrators when specific firmware versions are detected.

- Add specific Defender for IoT detected devices to a Forescout group for further handling in incident and security workflows, for example with other SIEM integrations.

Create a Forescout custom policy, with Defender for IoT using condition properties.

To access Defender for IoT properties:

1. Navigate to the **Properties Tree** from the **Policy Conditions** dialog box.
2. Expand the Defender for IoT folder in the **Properties Tree**. The Defender for IoT following properties are available.

:::image type="content" source="media/how-to-integrate-with-partners/integration-forescout/forescout-property-tree.png" alt-text="Properties":::
