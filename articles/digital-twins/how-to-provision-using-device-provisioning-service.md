---
# Mandatory fields.
title: Auto-manage devices using DPS
titleSuffix: Azure Digital Twins
description: See how to set up an automated process to provision and retire IoT devices in Azure Digital Twins using Device Provisioning Service (DPS).
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 9/1/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Auto-manage devices in Azure Digital Twins using Device Provisioning Service (DPS)

In this article, you'll learn how to integrate Azure Digital Twins with [Device Provisioning Service (DPS)](../iot-dps/about-iot-dps.md).

The solution described in this article will allow you to automate the process to **_provision_** and **_retire_** IoT Hub devices in Azure Digital Twins, using Device Provisioning Service. 

For more information about the _provision_ and _retire_ stages, and to better understand the set of general device management stages that are common to all enterprise IoT projects, see the [*Device lifecycle* section](../iot-hub/iot-hub-device-management-overview.md#device-lifecycle) of IoT Hub's device management documentation.

## Prerequisites

Before you can set up the provisioning, you need to have an **Azure Digital Twins instance** that contains models and twins. This instance should also be set up with the ability to update digital twin information based on data. 

If you do not have this set up already, you can create it by following the Azure Digital Twins [*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md). The tutorial will walk you through setting up an Azure Digital Twins instance with models and twins, a connected Azure [IoT Hub](../iot-hub/about-iot-hub.md), and several [Azure functions](../azure-functions/functions-overview.md) to propagate data flow.

You will need the following values later in this article from when you set up your instance. If you need to gather these values again, use the links below for instructions.
* Azure Digital Twins instance **_host name_** ([find in portal](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values))
* Azure Event Hubs connection string **_connection string_** ([find in portal](../event-hubs/event-hubs-get-connection-string.md#get-connection-string-from-the-portal))

This sample also uses a **device simulator** that includes provisioning using the Device Provisioning Service. The device simulator is located here: [Azure Digital Twins and IoT Hub Integration Sample](/samples/azure-samples/digital-twins-iothub-integration/adt-iothub-provision-sample/). Get the sample project on your machine by navigating to the sample link and selecting the *Download ZIP* button underneath the title. Unzip the downloaded folder.

The device simulator is based on **Node.js**, version 10.0.x or later. [*Prepare your development environment*](https://github.com/Azure/azure-iot-sdk-node/blob/master/doc/node-devbox-setup.md) describes how to install Node.js for this tutorial on either Windows or Linux.

## Solution architecture

The image below illustrates the architecture of this solution using Azure Digital Twins with Device Provisioning Service. It shows both the device provision and retire flow.

:::image type="content" source="media/how-to-provision-using-dps/flows.png" alt-text="A view of a device and several Azure services in an end-to-end scenario. Data flows back and forth between a thermostat device and DPS. Data also flows out from DPS into IoT Hub, and to Azure Digital Twins through an Azure function labeled 'Allocation'. Data from a manual 'Delete Device' action flows through IoT Hub > Event Hubs > Azure Functions > Azure Digital Twins.":::

This article is divided into two sections:
* [*Auto-provision device using Device Provisioning Service*](#auto-provision-device-using-device-provisioning-service)
* [*Auto-retire device using IoT Hub lifecycle events*](#auto-retire-device-using-iot-hub-lifecycle-events)

For deeper explanations of each step in the architecture, see their individual sections later in the article.

## Auto-provision device using Device Provisioning Service

In this section, you'll be attaching Device Provisioning Service to Azure Digital Twins to auto-provision devices through the path below. This is an excerpt from the full architecture shown [earlier](#solution-architecture).

:::image type="content" source="media/how-to-provision-using-dps/provision.png" alt-text="Provision flow-- an excerpt of the solution architecture diagram, with numbers labeling sections of the flow. Data flows back and forth between a thermostat device and DPS (1 for device > DPS and 5 for DPS > device). Data also flows out from DPS into IoT Hub (4), and to Azure Digital Twins (3) through an Azure function labeled 'Allocation' (2).":::

Here is a description of the process flow:
1. Device contacts the DPS endpoint, passing identifying information to prove its identity.
2. DPS validates device identity by validating the registration ID and key against the enrollment list, and calls an [Azure function](../azure-functions/functions-overview.md) to do the allocation.
3. The Azure function creates a new [twin](concepts-twins-graph.md) in Azure Digital Twins for the device.
4. DPS registers the device with an IoT hub, and populates the device's desired twin state.
5. The IoT hub returns device ID information and the IoT hub connection information to the device. The device can now connect to the IoT hub.

The following sections walk through the steps to set up this auto-provision device flow.

### Create a Device Provisioning Service

When a new device is provisioned using Device Provisioning Service, a new twin for that device can be created in Azure Digital Twins.

Create a Device Provisioning Service instance, which will be used to provision IoT devices. You can either use the Azure CLI instructions below, or use the Azure portal: [*Quickstart: Set up the IoT Hub Device Provisioning Service with the Azure portal*](../iot-dps/quick-setup-auto-provision.md).

The following Azure CLI command will create a Device Provisioning Service. You will need to specify a name, resource group, and region. The command can be run in [Cloud Shell](https://shell.azure.com), or locally if you have the Azure CLI [installed on your machine](/cli/azure/install-azure-cli).

```azurecli-interactive
az iot dps create --name <Device Provisioning Service name> --resource-group <resource group name> --location <region; for example, eastus>
```

### Create an Azure function

Next, you'll create an HTTP request-triggered function inside a function app. You can use the function app created in the end-to-end tutorial ([*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)), or your own.

This function will be used by the Device Provisioning Service in a [Custom Allocation Policy](../iot-dps/how-to-use-custom-allocation-policies.md) to provision a new device. For more information about using HTTP requests with Azure functions, see [*Azure Http request trigger for Azure Functions*](../azure-functions/functions-bindings-http-webhook-trigger.md).

Inside your function app project, add a new function. Also, add a new NuGet package to the project: `Microsoft.Azure.Devices.Provisioning.Service`.

In the newly created function code file, paste in the following code.

:::code language="csharp" source="~/digital-twins-docs-samples-dps/functions/DpsAdtAllocationFunc.cs":::

Save the file and then re-publish your function app. For instructions on publishing the function app, see the [*Publish the app*](tutorial-end-to-end.md#publish-the-app) section of the end-to-end tutorial.

### Configure your function

Next, you'll need to set environment variables in your function app from earlier, containing the reference to the Azure Digital Twins instance you've created. If you used the the end-to-end tutorial ([*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)), the setting will already be configured.

Add the setting with this Azure CLI command:

```azurecli-interactive
az functionapp config appsettings set --settings "ADT_SERVICE_URL=https://<Azure Digital Twins instance _host name_>" -g <resource group> -n <your App Service (function app) name>
```

Ensure that the permissions and Managed Identity role assignment are configured correctly for the function app, as described in the section [*Assign permissions to the function app*](tutorial-end-to-end.md#configure-permissions-for-the-function-app) in the end-to-end tutorial.

### Create Device Provisioning enrollment

Next, you'll need to create an enrollment in Device Provisioning Service using a **custom allocation function**. Follow the instructions to do this in the [*Create the enrollment*](../iot-dps/how-to-use-custom-allocation-policies.md#create-the-enrollment) and [*Derive unique device keys*](../iot-dps/how-to-use-custom-allocation-policies.md#derive-unique-device-keys) sections of the Device Provisioning Services article about custom allocation policies.

While going through that flow, you will link the enrollment to the function you just created by selecting your function during the step to **Select how you want to assign devices to hubs**. After creating the enrollment, the enrollment name and primary or secondary SAS key will be used later to configure the device simulator for this article.

### Set up the device simulator

This sample uses a device simulator that includes provisioning using the Device Provisioning Service. The device simulator is located here: [Azure Digital Twins and IoT Hub Integration Sample](/samples/azure-samples/digital-twins-iothub-integration/adt-iothub-provision-sample/). If you haven't already downloaded the sample, get it now by navigating to the sample link and selecting the *Download ZIP* button underneath the title. Unzip the downloaded folder.

Open a command window and navigate into the downloaded folder, and then into the *device-simulator* directory. Install the dependencies for the project using the following command:

```cmd
npm install
```

Next, copy the *.env.template* file to a new file called *.env*, and fill in these settings:

```cmd
PROVISIONING_HOST = "global.azure-devices-provisioning.net"
PROVISIONING_IDSCOPE = "<Device Provisioning Service Scope ID>"
PROVISIONING_REGISTRATION_ID = "<Device Registration ID>"
ADT_MODEL_ID = "dtmi:contosocom:DigitalTwins:Thermostat;1"
PROVISIONING_SYMMETRIC_KEY = "<Device Provisioning Service enrollment primary or secondary SAS key>"
```

Save and close the file.

### Start running the device simulator

Still in the *device-simulator* directory in your command window, start the device simulator using the following command:

```cmd
node .\adt_custom_register.js
```

You should see the device being registered and connected to IoT Hub, and then starting to send messages.
:::image type="content" source="media/how-to-provision-using-dps/output.png" alt-text="Command window showing device registration and sending messages":::

### Validate

As a result of the flow you've set up in this article, the device will be automatically registered in Azure Digital Twins. Using the following [Azure Digital Twins CLI](how-to-use-cli.md) command to find the twin of the device in the Azure Digital Twins instance you created.

```azurecli-interactive
az dt twin show -n <Digital Twins instance name> --twin-id <Device Registration ID>"
```

You should see the twin of the device being found in the Azure Digital Twins instance.
:::image type="content" source="media/how-to-provision-using-dps/show-provisioned-twin.png" alt-text="Command window showing newly created twin":::

## Auto-retire device using IoT Hub lifecycle events

In this section, you will be attaching IoT Hub lifecycle events to Azure Digital Twins to auto-retire devices through the path below. This is an excerpt from the full architecture shown [earlier](#solution-architecture).

:::image type="content" source="media/how-to-provision-using-dps/retire.png" alt-text="Retire device flow-- an excerpt of the solution architecture diagram, with numbers labeling sections of the flow. The thermostat device is shown with no connections to the Azure services in the diagram. Data from a manual 'Delete Device' action flows through IoT Hub (1) > Event Hubs (2) > Azure Functions > Azure Digital Twins (3).":::

Here is a description of the process flow:
1. An external or manual process triggers the deletion of a device in IoT Hub.
2. IoT Hub deletes the device and generates a [device lifecycle](../iot-hub/iot-hub-device-management-overview.md#device-lifecycle) event that will be routed to an [event hub](../event-hubs/event-hubs-about.md).
3. An Azure function deletes the twin of the device in Azure Digital Twins.

The following sections walk through the steps to set up this auto-retire device flow.

### Create an event hub

You now need to create an Azure [event hub](../event-hubs/event-hubs-about.md), which will be used to receive the IoT Hub lifecycle events. 

Go through the steps described in the [*Create an event hub*](../event-hubs/event-hubs-create.md) quickstart, using the following information:
* If you're using the end-to-end tutorial ([*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)), you can reuse the resource group you created for the end-to-end tutorial.
* Name your event hub *lifecycleevents*, or something else of your choice, and remember the namespace you created. You will use these when you set up the lifecycle function and IoT Hub route in the next sections.

### Create an Azure function

Next, you'll create an Event Hubs-triggered function inside a function app. You can use the function app created in the end-to-end tutorial ([*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)), or your own. 

Name your event hub trigger *lifecycleevents*, and connect the event hub trigger to the event hub you created in the previous step. If you used a different event hub name, change it to match in the trigger name below.

This function will use the IoT Hub device lifecycle event to retire an existing device. For more about lifecycle events, see [*IoT Hub Non-telemetry events*](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events). For more information about using Event Hubs with Azure functions, see [*Azure Event Hubs trigger for Azure Functions*](../azure-functions/functions-bindings-event-hubs-trigger.md).

Inside your published function app, add a new function class of type *Event Hub Trigger*, and paste in the code below.

:::code language="csharp" source="~/digital-twins-docs-samples-dps/functions/DeleteDeviceInTwinFunc.cs":::

Save the project, then publish the function app again. For instructions on publishing the function app, see the [*Publish the app*](tutorial-end-to-end.md#publish-the-app) section of the end-to-end tutorial.

### Configure your function

Next, you'll need to set environment variables in your function app from earlier, containing the reference to the Azure Digital Twins instance you've created and the event hub. If you used the the end-to-end tutorial ([*Tutorial: Connect an end-to-end solution*](./tutorial-end-to-end.md)), the first setting will already be configured.

Add the setting with this Azure CLI command. The command can be run in [Cloud Shell](https://shell.azure.com), or locally if you have the Azure CLI [installed on your machine](/cli/azure/install-azure-cli).

```azurecli-interactive
az functionapp config appsettings set --settings "ADT_SERVICE_URL=https://<Azure Digital Twins instance _host name_>" -g <resource group> -n <your App Service (function app) name>
```

Next, you will need to configure the function environment variable for connecting to the newly created event hub.

```azurecli-interactive
az functionapp config appsettings set --settings "EVENTHUB_CONNECTIONSTRING=<Event Hubs SAS connection string Listen>" -g <resource group> -n <your App Service (function app) name>
```

Ensure that the permissions and Managed Identity role assignment are configured correctly for the function app, as described in the section [*Assign permissions to the function app*](tutorial-end-to-end.md#configure-permissions-for-the-function-app) in the end-to-end tutorial.

### Create an IoT Hub route for lifecycle events

Now you need to set up an IoT Hub route, to route device lifecycle events. In this case, you will specifically listen to device delete events, identified by `if (opType == "deleteDeviceIdentity")`. This will trigger the delete of the digital twin item, finalizing the retirement of a device and its digital twin.

Instructions for creating an IoT Hub route are described in this article: [*Use IoT Hub message routing to send device-to-cloud messages to different endpoints*](../iot-hub/iot-hub-devguide-messages-d2c.md). The section *Non-telemetry events* explains that you can use **device lifecycle events** as the data source for the route.

The steps you need to go through for this setup are:
1. Create a custom IoT Hub event hub endpoint. This endpoint should target the event hub you created in the [*Create an event hub*](#create-an-event-hub) section.
2. Add a *Device Lifecycle Events* route. Use the endpoint created in the previous step. You can limit the device lifecycle events to only send the delete events by adding the routing query `opType='deleteDeviceIdentity'`.
    :::image type="content" source="media/how-to-provision-using-dps/lifecycle-route.png" alt-text="Add a route":::

Once you have gone through this flow, everything is set to retire devices end-to-end.

### Validate

To trigger the process of retirement, you need to manually delete the device from IoT Hub.

In the [first half of this article](#auto-provision-device-using-device-provisioning-service), you created a device in IoT Hub and a corresponding digital twin. 

Now, go to the IoT Hub and delete that device (you can do this with an [Azure CLI command](/cli/azure/ext/azure-iot/iot/hub/module-identity#ext_azure_iot_az_iot_hub_module_identity_delete) or in the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Devices%2FIotHubs)). 

The device will be automatically removed from Azure Digital Twins. 

Use the following [Azure Digital Twins CLI](how-to-use-cli.md) command to verify the twin of the device in the Azure Digital Twins instance was deleted.

```azurecli-interactive
az dt twin show -n <Digital Twins instance name> --twin-id <Device Registration ID>"
```

You should see that the twin of the device cannot be found in the Azure Digital Twins instance anymore.
:::image type="content" source="media/how-to-provision-using-dps/show-retired-twin.png" alt-text="Command window showing twin not found":::

## Clean up resources

If you no longer need the resources created in this article, follow these steps to delete them.

Using the Azure Cloud Shell or local Azure CLI, you can delete all Azure resources in a resource group with the [az group delete](/cli/azure/group#az-group-delete) command. This removes the resource group; the Azure Digital Twins instance; the IoT hub and the hub device registration; the event grid topic and associated subscriptions; the event hubs namespace and both Azure Functions apps, including associated resources like storage.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

```azurecli-interactive
az group delete --name <your-resource-group>
```

Then, delete the project sample folder you downloaded from your local machine.

## Next steps

The digital twins created for the devices are stored as a flat hierarchy in Azure Digital Twins, but they can be enriched with model information and a multi-level hierarchy for organization. To learn more about this concept, read:

* [*Concepts: Digital twins and the twin graph*](concepts-twins-graph.md)

You can write custom logic to automatically provide this information using the model and graph data already stored in Azure Digital Twins. To read more about managing, upgrading, and retrieving information from the twins graph, see the following:

* [*How-to: Manage a digital twin*](how-to-manage-twin.md)
* [*How-to: Query the twin graph*](how-to-query-graph.md)