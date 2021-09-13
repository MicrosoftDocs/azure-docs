---
title: Integrate Forescout with Azure Defender for IoT
description: In this tutorial, you will learn how to onboard to Azure Defender for IoT with a virtual sensor, on a virtual machine, with a trial subscription of Azure Defender for IoT.
author: ElazarK
ms.author: v-ekrieg
ms.topic: tutorial
ms.date: 09/13/2021
ms.custom: template-tutorial
---

# Tutorial: Integrate Forescout with Azure Defender for IoT

> [!Note]
> References to CyberX refer to Azure Defender for IoT.

This tutorial will help you learn how to integrate Forescout with Azure Defender for IoT.

Azure Defender for IoT delivers an ICS, and IoT cybersecurity platform. Defender for IoT is the only platform with ICS aware threat analytics, and machine learning. Defender for IoT provides:

- Immediate insights about ICS the device landscape with an extensive range of details about attributes.
- ICS-aware deep embedded knowledge of OT protocols, devices, applications, and their behaviors.
- Immediate insights into vulnerabilities, and known zero-day threats.
- An automated ICS threat modeling technology to predict the most likely paths of targeted ICS attacks via proprietary analytics.

The Defender for IoT integration with the Forescout platform provides centralized visibility, monitoring, and control for the IoT, and OT landscape.

These bridged platforms enable automated device visibility and management to ICS devices and, siloed workflows.

The integration provides SOC analysts with multilevel visibility into OT protocols deployed in industrial environments. Details are available for items such as firmware, device types, operating systems, and risk analysis scores based on proprietary Azure Defender for IoT technologies.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Generate an access token
> * Configure the Forescout platform
> * Verify communication
> * View Defender for IoT detections in Forescout

## Prerequisites

- Azure Defender for IoT version 2.4 or above
- Forescout version 8.0 or above
- A license for the *Forescout eyeExtend* module for the Azure Defender for IoT Platform.

## Generate an access token

Access tokens allow external systems to access data discovered by Defender for IoT and perform actions with that data using the external REST API, over SSL connections. You can generate access tokens in order to access the Azure Defender for IoT REST API.

To ensure communication from Defender for IoT to Forescout, you must generate an access token in Defender for IoT.

**To generate an access token**:

1. Sign in to the Defender for IoT sensor that will be queried by Forescout.

1. Select **System Settings** > **Access Tokens** from the **General** section.

1. Select **Generate new token**.

    :::image type="content" source="media/integration-forescout/generate-access-tokens-screen.png" alt-text="Access tokens":::

1. Enter a token description in the **New access token** dialog box.

   :::image type="content" source="media/integration-forescout/new-forescout-token.png" alt-text="New access token":::

1. Select **Next**. The token is then displayed in the dialog box.

   > [!NOTE]
   > Record the token in a safe place. You will need it when you configure the Forescout Platform.

1. Select **Finish**.

   :::image type="content" source="media/integration-forescout/forescout-access-token-added-successfully.png" alt-text="Finish adding token":::

## Configure the Forescout platform

You can now configure the Forescout platform to communicate with a Defender for IoT sensor.

**To configure the Forescout platform**:

1. On the Forescout platform, search for,and install **the Forescout eyeExtend module for CyberX**.

1. Sign in to the CounterACT console.

1. From the Tools menu, select **Options**.

1. Navigate to **Modules** > **CyberX Platform**.

   :::image type="content" source="media/integration-forescout/settings-for-module.png" alt-text="Azure Defender for IoT module settings":::

1. In the Server Address field, enter the IP address of the Defender for IoT sensor that will be queried by the Forescout appliance.

1. In the Access Token field, enter the access token that was generated earlier.

1. Select **Apply**.

### Change sensors in Forescout

If you want the Forescout platform to communicate with a different sensor you will need to change the configuration within Forescout.

**To change sensors in Forescout**:

1. Create a new access token in the relevant Defender for IoT sensor.

1. Navigate to **Forescout Modules** > **CyberX Platform**.

1. Delete the information displayed in both fields.

1. Sign in to the new Defender for IoT sensor and [generate a new access token](#generate-an-access-token).

1. In the Server Address field, enter the new IP address of the Defender for IoT sensor that will be queried by the Forescout appliance.

1. In the Access Token field, enter the new access token.

1. Select **Apply**.

## Verify communication

After configuring the connection between the Defender for IoT sensor to Forescout, you will need to confirm that the two platforms are communicating.

**To confirm the two platforms are communicating**:

1. Sign in to the Defender for IoT sensor.

1. Navigate to **System Settings** > **Access Tokens**.

If **N/A** is displayed in the Used field for the token, the connection between the sensor and the Forescout appliance is not working. **Used** indicates the last time an external call with this token was received.

:::image type="content" source="media/integration-forescout/forescout-access-token-added-successfully.png" alt-text="Verifies the token was received":::

## View Defender for IoT detections in Forescout


# Clean up resources

There are no resources to clean up.

## Next steps

In this tutorial, you learned how to get started with the ServiceNow integration. Continue on to learn about our [Cisco integration](./integration-forescout.md).