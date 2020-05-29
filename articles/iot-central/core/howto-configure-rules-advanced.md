---
title: Use workflows to integrate your Azure IoT Central application with other cloud services | Microsoft Docs
description: This how-to article shows you, as a builder, how to configure rules and actions that integrate your IoT Central application with other cloud services. To create an advanced rule, you use an IoT Central connector in either Power Automate or Azure Logic Apps. 
author: dominicbetts
ms.author: dobett
ms.date: 05/12/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central
---

# Use workflows to integrate your Azure IoT Central application with other cloud services

*This article applies to solution builders.*

You can create rules in IoT Central that trigger actions, such as sending an email, in response to telemetry-based conditions, such as device temperature exceeding a threshold.

The IoT Central connector for Power Automate and Azure Logic Apps lets you create more advanced rules to automate operations in IoT Central:

- When a rule fires in your Azure IoT Central app, it can trigger a workflow in Power Automate or Azure Logic Apps. These workflows can run actions in other cloud services, such as Office 365, or a third-party service.
- An event in another cloud service, such as Office 365, can trigger a workflow in Power Automate or Azure Logic Apps. These workflows can run actions or retrieve data from your IoT Central application.

## Trigger a workflow from a rule

Before you can trigger a workflow in Power Automate or Azure Logic Apps, you need a rule in your IoT Central application. To learn more, see [Configure rules and actions in Azure IoT Central](./howto-configure-rules.md).

To add the **Azure IoT Central - preview** connector as a trigger in Power Automate:

1. In Power Automate, select **+ Create**, select the **Custom** tab.
1. Search for *IoT Central*, and select the **Azure IoT Central - preview** connector.
1. In the list of triggers, select **When a rule is fired (preview)**.
1. In the **When a rule is fired** step, select your IoT Central application and the rule you're using.

To add the **Azure IoT Central - preview** connector as a trigger in Azure Logic Apps:

1. In **Logic Apps Designer**, select the **Blank Logic App** template.
1. In the designer, select the **Custom** tab.
1. Search for *IoT Central*, and select the **Azure IoT Central - preview** connector.
1. In the list of triggers, select **When a rule is fired (preview)**.
1. In the **When a rule is fired** step, select your IoT Central application and the rule you're using.

:::image type="content" source="./media/howto-configure-rules-advanced/triggers.png" alt-text="Find the Azure IoT Central - preview connector and choose the trigger":::

You can now add more steps to your workflow to build out your integration scenario.

## Run an action

You can run actions in an IoT Central application from Power Automate and Azure Logic Apps workflows. First, create your workflow and use a connector to define a trigger to start the workflow. Then use the **Azure IoT Central - preview** connector as an action.

To add the **Azure IoT Central - preview** connector as an action in Power Automate:

1. In Power Automate, in the **Choose an action** panel, select the **Custom** tab.
1. Search for *IoT Central* and select the **Azure IoT Central - preview** connector.
1. In the list of actions, select the IoT Central action you want to use.
1. In the action step, complete the configuration for the action you chose. Then select **Save**.

To add the **Azure IoT Central - preview** connector as an action in Azure Logic Apps:

1. In **Logic Apps Designer**, in the **Choose an action** panel, select the **Custom** tab.
1. Search for *IoT Central*, and select the **Azure IoT Central - preview** connector.
1. In the list of actions, select the IoT Central action you want to use.
1. In the action step, complete the configuration for the action you chose. Then select **Save**.

:::image type="content" source="./media/howto-configure-rules-advanced/actions.png" alt-text="Find the Azure IoT Central - preview connector and choose an action":::

## List of actions

The following list shows all the available IoT Central actions in the **Azure IoT Central - preview** connector and their configuration options. Many of the fields can have dynamically generated content. For example, a previous step could determine the device ID that the current step acts on.

### Create or update a device

Use this action to create or update a device in your IoT Central application.

| Field | Description |
| ----- | ----------- |
| Application | Choose from your list of IoT Central applications. |
| Device | The unique ID of the device to create or update. |
| Approved | Choose whether the device has been approved to connect to IoT Central. |
| Device Description | A detailed description of the device. |
| Device Name | The display name of the device. |
| Device Template | Choose from the list of device templates in your IoT Central application. |
| Simulated | Choose whether the device is simulated. |

### Delete a device

Use this action to delete a device from your IoT Central application.

| Field | Description |
| ----- | ----------- |
| Application | Choose from your list of IoT Central applications. |
| Device | The unique ID of the device to delete. |

### Execute a device command

Use this action to execute a command defined in one of the device's interfaces.

| Field | Description |
| ----- | ----------- |
| Application | Choose from your list of IoT Central applications. |
| Device | The unique ID of the device to delete. |
| Device Component | The interface in the device template that contains the command. |
| Device Command | Choose one of the commands on the selected interface. |
| Device Template | Choose from the list of device templates in your IoT Central application. |
| Device Command Request Payload | If the command requires a request payload, add it here.  |

> [!NOTE]
> You can't choose a device component until you've chosen a device template.

### Get a device by ID

Use this action to retrieve the device's details.

| Field | Description |
| ----- | ----------- |
| Application | Choose from your list of IoT Central applications. |
| Device | The unique ID of the device to delete. |

You can use the returned details in the dynamic expressions in other actions. The device details returned include: **Approved**, **body**, **Device Description**, **Device Name**, **Device Template**, **Provisioned**, and **Simulated**.

### Get device cloud properties

Use this action to retrieve the cloud property values for a specific device.

| Field | Description |
| ----- | ----------- |
| Application | Choose from your list of IoT Central applications. |
| Device | The unique ID of the device to delete. |
| Device Template | Choose from the list of device templates in your IoT Central application. |

You can use the returned cloud property values in the dynamic expressions in other actions.

### Get device properties

Use this action to retrieve the property values for a specific device.

| Field | Description |
| ----- | ----------- |
| Application | Choose from your list of IoT Central applications. |
| Device | The unique ID of the device to delete. |
| Device Template | Choose from the list of device templates in your IoT Central application. |

You can use the returned property values in the dynamic expressions in other actions.

### Get device telemetry value

Use this action to retrieve the telemetry values for a specific device.

| Field | Description |
| ----- | ----------- |
| Application | Choose from your list of IoT Central applications. |
| Device | The unique ID of the device to delete. |
| Device Template | Choose from the list of device templates in your IoT Central application. |

You can use the returned telemetry values in the dynamic expressions in other actions.

### Update device cloud properties

Use this action to update cloud property values for a specific device.

| Field | Description |
| ----- | ----------- |
| Application | Choose from your list of IoT Central applications. |
| Device | The unique ID of the device to delete. |
| Device Template | Choose from the list of device templates in your IoT Central application. |
| Cloud properties | After you choose a device template, a field is added for each cloud property defined in the template. |

### Update device properties

Use this action to update writeable property values for a specific device.

| Field | Description |
| ----- | ----------- |
| Application | Choose from your list of IoT Central applications. |
| Device | The unique ID of the device to delete. |
| Device Template | Choose from the list of device templates in your IoT Central application. |
| Writeable properties | After you choose a device template, a field is added for each writeable property defined in the template. |

## Next steps

Now that you've learned how to create an advanced rule in your Azure IoT Central application, you can learn how to [Analyze device data in your Azure IoT Central application](howto-create-analytics.md)
