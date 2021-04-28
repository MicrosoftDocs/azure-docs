---
# Mandatory fields.
title: Auto-manage devices using Device Provisioning Service
titleSuffix: Azure Digital Twins
description: See how to set up an automated process to provision and retire IoT devices in Azure Digital Twins using Device Provisioning Service (DPS).
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/21/2021
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

Before you can set up the provisioning, you'll need to set up the following:
* an **Azure Digital Twins instance**. Follow the instructions in [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md) to create an Azure digital twins instance. Gather the instance's **_host name_** in the Azure portal ([instructions](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values)).
* an **IoT hub**. For instructions, see the *Create an IoT Hub* section of this [IoT Hub quickstart](../iot-hub/quickstart-send-telemetry-cli.md).
* an [**Azure function**](../azure-functions/functions-overview.md) that updates digital twin information based on IoT Hub data. Follow the instructions in [*How to: Ingest IoT hub data*](how-to-ingest-iot-hub-data.md) to create this Azure function. Gather the function **_name_** to use it in this article.

This sample also uses a **device simulator** that includes provisioning using the Device Provisioning Service. The device simulator is located here: [Azure Digital Twins and IoT Hub Integration Sample](/samples/azure-samples/digital-twins-iothub-integration/adt-iothub-provision-sample/). Get the sample project on your machine by navigating to the sample link and selecting the **Browse code** button underneath the title. This will take you to the GitHub repo for the sample, which you can download as a *.ZIP* file by selecting the **Code** button and **Download ZIP**. 

:::image type="content" source="media/how-to-provision-using-device-provisioning-service/download-repo-zip.png" alt-text="Screenshot of the digital-twins-iothub-integration repo on GitHub. The Code button is selected, producing a small dialog box where the Download ZIP button is highlighted." lightbox="media/how-to-provision-using-device-provisioning-service/download-repo-zip.png":::

Unzip the downloaded folder.

You'll need [**Node.js**](https://nodejs.org/download) installed on your machine. The device simulator is based on **Node.js**, version 10.0.x or later.

## Solution architecture

The image below illustrates the architecture of this solution using Azure Digital Twins with Device Provisioning Service. It shows both the device provision and retire flow.

:::image type="content" source="media/how-to-provision-using-device-provisioning-service/flows.png" alt-text="Diagram of device and several Azure services in an end-to-end scenario. Data flows back and forth between a thermostat device and DPS. Data also flows out from DPS into IoT Hub, and to Azure Digital Twins through an Azure function labeled 'Allocation'. Data from a manual 'Delete Device' action flows through IoT Hub > Event Hubs > Azure Functions > Azure Digital Twins." lightbox="media/how-to-provision-using-device-provisioning-service/flows.png":::

This article is divided into two sections:
* [*Auto-provision device using Device Provisioning Service*](#auto-provision-device-using-device-provisioning-service)
* [*Auto-retire device using IoT Hub lifecycle events*](#auto-retire-device-using-iot-hub-lifecycle-events)

For deeper explanations of each step in the architecture, see their individual sections later in the article.

## Auto-provision device using Device Provisioning Service

In this section, you'll be attaching Device Provisioning Service to Azure Digital Twins to auto-provision devices through the path below. This is an excerpt from the full architecture shown [earlier](#solution-architecture).

:::image type="content" source="media/how-to-provision-using-device-provisioning-service/provision.png" alt-text="Diagram of Provision flow-- an excerpt of the solution architecture diagram, with numbers labeling sections of the flow. Data flows back and forth between a thermostat device and DPS (1 for device > DPS and 5 for DPS > device). Data also flows out from DPS into IoT Hub (4), and to Azure Digital Twins (3) through an Azure function labeled 'Allocation' (2)." lightbox="media/how-to-provision-using-device-provisioning-service/provision.png":::

Here is a description of the process flow:
1. Device contacts the DPS endpoint, passing identifying information to prove its identity.
2. DPS validates device identity by validating the registration ID and key against the enrollment list, and calls an [Azure function](../azure-functions/functions-overview.md) to do the allocation.
3. The Azure function creates a new [twin](concepts-twins-graph.md) in Azure Digital Twins for the device. The twin will have the same name as the device's **registration ID**.
4. DPS registers the device with an IoT hub, and populates the device's desired twin state.
5. The IoT hub returns device ID information and the IoT hub connection information to the device. The device can now connect to the IoT hub.

The following sections walk through the steps to set up this auto-provision device flow.

### Create a Device Provisioning Service

When a new device is provisioned using Device Provisioning Service, a new twin for that device can be created in Azure Digital Twins with the same name as the registration ID.

Create a Device Provisioning Service instance, which will be used to provision IoT devices. You can either use the Azure CLI instructions below, or use the Azure portal: [*Quickstart: Set up the IoT Hub Device Provisioning Service with the Azure portal*](../iot-dps/quick-setup-auto-provision.md).

The following Azure CLI command will create a Device Provisioning Service. You'll need to specify a Device Provisioning Service name, resource group, and region. To see what regions support Device Provisioning Service, visit [*Azure products available by region*](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub).
The command can be run in [Cloud Shell](https://shell.azure.com), or locally if you have the Azure CLI [installed on your machine](/cli/azure/install-azure-cli).

```azurecli-interactive
az iot dps create --name <Device Provisioning Service name> --resource-group <resource group name> --location <region>
```

### Add a function to use with Device Provisioning Service

Inside your function app project that you created in the [prerequisites](#prerequisites) section, you'll create a new function to use with the Device Provisioning Service. This function will be used by the Device Provisioning Service in a [Custom Allocation Policy](../iot-dps/how-to-use-custom-allocation-policies.md) to provision a new device.

Start by opening the function app project in Visual Studio on your machine and follow the steps below.

#### Step 1: Add a new function 

Add a new function of type *HTTP-trigger* to the function app project in Visual Studio.

:::image type="content" source="media/how-to-provision-using-device-provisioning-service/add-http-trigger-function-visual-studio.png" alt-text="Screenshot of the Visual Studio view to add Azure function of type Http Trigger in your function app project." lightbox="media/how-to-provision-using-device-provisioning-service/add-http-trigger-function-visual-studio.png":::

#### Step 2: Fill in function code

Add a new NuGet package to the project: [Microsoft.Azure.Devices.Provisioning.Service](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/). You might need to add more packages to your project as well, if the packages used in the code aren't part of the project already.

In the newly created function code file, paste in the following code, rename the function to *DpsAdtAllocationFunc.cs*, and save the file.

:::code language="csharp" source="~/digital-twins-docs-samples-dps/functions/DpsAdtAllocationFunc.cs":::

#### Step 3: Publish the function app to Azure

Publish the project with *DpsAdtAllocationFunc.cs* function to the function app in Azure.

[!INCLUDE [digital-twins-publish-and-configure-function-app.md](../../includes/digital-twins-publish-and-configure-function-app.md)]

### Create Device Provisioning enrollment

Next, you'll need to create an enrollment in Device Provisioning Service using a **custom allocation function**. Follow the instructions to do this in the [*Create the enrollment*](../iot-dps/how-to-use-custom-allocation-policies.md#create-the-enrollment) section of the custom allocation policies article in the Device Provisioning Service documentation.

While going through that flow, make sure you select the following options to link the enrollment to the function you just created.

* **Select how you want to assign devices to hubs**: Custom (Use Azure Function).
* **Select the IoT hubs this group can be assigned to:** Choose your IoT hub name or select the *Link a new IoT hub* button, and choose your IoT hub from the dropdown.

Next, choose the *Select a new function* button to link your function app to the enrollment group. Then, fill in the following values:

* **Subscription**: Your Azure subscription is auto-populated. Make sure it is the right subscription.
* **Function App**: Choose your function app name.
* **Function**: Choose DpsAdtAllocationFunc.

Save your details.                  

:::image type="content" source="media/how-to-provision-using-device-provisioning-service/link-enrollment-group-to-iot-hub-and-function-app.png" alt-text="Screenshot of the Customs enrollment group details window to Select Custom(Use Azure Function) and your IoT hub name in the sections Select how you want to assign devices to hubs and Select the IoT hubs this group can be assigned to. Also, select your subscription, function app from the dropdown and make sure to select DpsAdtAllocationFunc." lightbox="media/how-to-provision-using-device-provisioning-service/link-enrollment-group-to-iot-hub-and-function-app.png":::

After creating the enrollment, the **Primary Key** for the enrollment will be used later to configure the device simulator for this article.

### Set up the device simulator

This sample uses a device simulator that includes provisioning using the Device Provisioning Service. The device simulator is located in the [Azure Digital Twins and IoT Hub Integration Sample](/samples/azure-samples/digital-twins-iothub-integration/adt-iothub-provision-sample/) that you downloaded in the [Prerequisites](#prerequisites) section.

#### Upload the model

The device simulator is a thermostat-type device that uses the model with this ID: `dtmi:contosocom:DigitalTwins:Thermostat;1`. You'll need to upload this model to Azure Digital Twins before you can create a twin of this type for the device.

[!INCLUDE [digital-twins-thermostat-model-upload.md](../../includes/digital-twins-thermostat-model-upload.md)]

For more information about models, refer to [*How-to: Manage models*](how-to-manage-model.md#upload-models).

#### Configure and run the simulator

In your command window, navigate to the downloaded sample *Azure Digital Twins and IoT Hub Integration* that you unzipped earlier, and then into the *device-simulator* directory. Next, install the dependencies for the project using the following command:

```cmd
npm install
```

Next, in your device simulator directory, copy the .env.template file to a new file called .env, and gather the following values to fill in the settings:

* PROVISIONING_IDSCOPE: To get this value, navigate to your device provisioning service in the [Azure portal](https://portal.azure.com/), then select *Overview* in the menu options and look for the field *ID Scope*.

    :::image type="content" source="media/how-to-provision-using-device-provisioning-service/id-scope.png" alt-text="Screenshot of the Azure portal view of the device provisioning overview page to copy the ID Scope value." lightbox="media/how-to-provision-using-device-provisioning-service/id-scope.png":::

* PROVISIONING_REGISTRATION_ID: You can choose a registration ID for your device.
* ADT_MODEL_ID: `dtmi:contosocom:DigitalTwins:Thermostat;1`
* PROVISIONING_SYMMETRIC_KEY: This is the primary key for the enrollment you set up earlier. To get this value again, navigate to your device provisioning service in the Azure portal, select *Manage enrollments*, then select the enrollment group that you created earlier and copy the *Primary Key*.

    :::image type="content" source="media/how-to-provision-using-device-provisioning-service/sas-primary-key.png" alt-text="Screenshot of the Azure portal view of the device provisioning service manage enrollments page to copy the SAS primary key value." lightbox="media/how-to-provision-using-device-provisioning-service/sas-primary-key.png":::

Now, use the values above to update the .env file settings.

```cmd
PROVISIONING_HOST = "global.azure-devices-provisioning.net"
PROVISIONING_IDSCOPE = "<Device Provisioning Service Scope ID>"
PROVISIONING_REGISTRATION_ID = "<Device Registration ID>"
ADT_MODEL_ID = "dtmi:contosocom:DigitalTwins:Thermostat;1"
PROVISIONING_SYMMETRIC_KEY = "<Device Provisioning Service enrollment primary SAS key>"
```

Save and close the file.

### Start running the device simulator

Still in the *device-simulator* directory in your command window, start the device simulator using the following command:

```cmd
node .\adt_custom_register.js
```

You should see the device being registered and connected to IoT Hub, and then starting to send messages.
:::image type="content" source="media/how-to-provision-using-device-provisioning-service/output.png" alt-text="Screenshot of the Command window showing device registration and sending messages" lightbox="media/how-to-provision-using-device-provisioning-service/output.png":::

### Validate

As a result of the flow you've set up in this article, the device will be automatically registered in Azure Digital Twins. Use the following [Azure Digital Twins CLI](how-to-use-cli.md) command to find the twin of the device in the Azure Digital Twins instance you created.

```azurecli-interactive
az dt twin show -n <Digital Twins instance name> --twin-id "<Device Registration ID>"
```

You should see the twin of the device being found in the Azure Digital Twins instance.
:::image type="content" source="media/how-to-provision-using-device-provisioning-service/show-provisioned-twin.png" alt-text="Screenshot of the Command window showing newly created twin." lightbox="media/how-to-provision-using-device-provisioning-service/show-provisioned-twin.png":::

## Auto-retire device using IoT Hub lifecycle events

In this section, you will be attaching IoT Hub lifecycle events to Azure Digital Twins to auto-retire devices through the path below. This is an excerpt from the full architecture shown [earlier](#solution-architecture).

:::image type="content" source="media/how-to-provision-using-device-provisioning-service/retire.png" alt-text="Diagram of the Retire device flow-- an excerpt of the solution architecture diagram, with numbers labeling sections of the flow. The thermostat device is shown with no connections to the Azure services in the diagram. Data from a manual 'Delete Device' action flows through IoT Hub (1) > Event Hubs (2) > Azure Functions > Azure Digital Twins (3)." lightbox="media/how-to-provision-using-device-provisioning-service/retire.png":::

Here is a description of the process flow:
1. An external or manual process triggers the deletion of a device in IoT Hub.
2. IoT Hub deletes the device and generates a [device lifecycle](../iot-hub/iot-hub-device-management-overview.md#device-lifecycle) event that will be routed to an [event hub](../event-hubs/event-hubs-about.md).
3. An Azure function deletes the twin of the device in Azure Digital Twins.

The following sections walk through the steps to set up this auto-retire device flow.

### Create an event hub

Next, you'll create an Azure [event hub](../event-hubs/event-hubs-about.md) to receive IoT Hub lifecycle events. 

Follow the steps described in the [*Create an event hub*](../event-hubs/event-hubs-create.md) quickstart. Name your event hub *lifecycleevents*. You'll use this event hub name when you set up IoT Hub route and an Azure function in the next sections.

The screenshot below illustrates the creation of the event hub.
:::image type="content" source="media/how-to-provision-using-device-provisioning-service/create-event-hub-lifecycle-events.png" alt-text="Screenshot of the Azure portal window to create an event hub with the name lifecycleevents." lightbox="media/how-to-provision-using-device-provisioning-service/create-event-hub-lifecycle-events.png":::

#### Create SAS policy for your event hub

Next, you'll need to create a [shared access signature (SAS) policy](../event-hubs/authorize-access-shared-access-signature.md) to configure the event hub with your function app.
To do this,
1. Navigate to the event hub you just created in the Azure portal and select **Shared access policies** in the menu options on the left.
2. Select **Add**. In the *Add SAS Policy* window that opens, enter a policy name of your choice and select the *Listen* checkbox.
3. Select **Create**.
    
:::image type="content" source="media/how-to-provision-using-device-provisioning-service/add-event-hub-sas-policy.png" alt-text="Screenshot of the Azure portal to add an event hub SAS policy." lightbox="media/how-to-provision-using-device-provisioning-service/add-event-hub-sas-policy.png":::

#### Configure event hub with function app

Next, configure the Azure function app that you set up in the [prerequisites](#prerequisites) section to work with your new event hub. You'll do this by setting an environment variable inside the function app with the event hub's connection string.

1. Open the policy that you just created and copy the **Connection string-primary key** value.

    :::image type="content" source="media/how-to-provision-using-device-provisioning-service/event-hub-sas-policy-connection-string.png" alt-text="Screenshot of the Azure portal to copy the connection string-primary key." lightbox="media/how-to-provision-using-device-provisioning-service/event-hub-sas-policy-connection-string.png":::

2. Add the connection string as a variable in the function app settings with the following Azure CLI command. The command can be run in [Cloud Shell](https://shell.azure.com), or locally if you have the Azure CLI [installed on your machine](/cli/azure/install-azure-cli).

    ```azurecli-interactive
    az functionapp config appsettings set --settings "EVENTHUB_CONNECTIONSTRING=<Event Hubs SAS connection string Listen>" -g <resource group> -n <your App Service (function app) name>
    ```

### Add a function to retire with IoT Hub lifecycle events

Inside your function app project that you created in the [prerequisites](#prerequisites) section, you'll create a new function to retire an existing device using IoT Hub lifecycle events.

For more about lifecycle events, see [*IoT Hub Non-telemetry events*](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events). For more information about using Event Hubs with Azure functions, see [*Azure Event Hubs trigger for Azure Functions*](../azure-functions/functions-bindings-event-hubs-trigger.md).

Start by opening the function app project in Visual Studio on your machine and follow the steps below.

#### Step 1: Add a new function
     
Add a new function of type *Event Hub Trigger* to the function app project in Visual Studio.

:::image type="content" source="media/how-to-provision-using-device-provisioning-service/create-event-hub-trigger-function.png" alt-text="Screenshot of the Visual Studio window to add an Azure function of type Event Hub Trigger in your function app project." lightbox="media/how-to-provision-using-device-provisioning-service/create-event-hub-trigger-function.png":::

#### Step 2: Fill in function code

In the newly created function code file, paste in the following code, rename the function to `DeleteDeviceInTwinFunc.cs`, and save the file.

:::code language="csharp" source="~/digital-twins-docs-samples-dps/functions/DeleteDeviceInTwinFunc.cs":::

#### Step 3: Publish the function app to Azure

Publish the project with *DeleteDeviceInTwinFunc.cs* function to the function app in Azure.

[!INCLUDE [digital-twins-publish-and-configure-function-app.md](../../includes/digital-twins-publish-and-configure-function-app.md)]

### Create an IoT Hub route for lifecycle events

Now you'll set up an IoT Hub route, to route device lifecycle events. In this case, you will specifically listen to device delete events, identified by `if (opType == "deleteDeviceIdentity")`. This will trigger the delete of the digital twin item, finalizing the retirement of a device and its digital twin.

First, you'll need to create an event hub endpoint in your IoT hub. Then, you'll add a route in IoT hub to send lifecycle events to this event hub endpoint.
Follow these steps to create an event hub endpoint:

1. In the [Azure portal](https://portal.azure.com/), navigate to the IoT hub you created in the [prerequisites](#prerequisites) section and select **Message routing** in the menu options on the left.
2. Select the **Custom endpoints** tab.
3. Select **+ Add** and choose **Event hubs** to add an event hubs type endpoint.

    :::image type="content" source="media/how-to-provision-using-device-provisioning-service/event-hub-custom-endpoint.png" alt-text="Screenshot of the Visual Studio window to add an event hub custom endpoint." lightbox="media/how-to-provision-using-device-provisioning-service/event-hub-custom-endpoint.png":::

4. In the window *Add an event hub endpoint* that opens, choose the following values:
    * **Endpoint name**: Choose an endpoint name.
    * **Event hub namespace**: Select your event hub namespace from the dropdown list.
    * **Event hub instance**: Choose the event hub name that you created in the previous step.
5. Select **Create**. Keep this window open to add a route in the next step.

    :::image type="content" source="media/how-to-provision-using-device-provisioning-service/add-event-hub-endpoint.png" alt-text="Screenshot of the Visual Studio window to add an event hub endpoint." lightbox="media/how-to-provision-using-device-provisioning-service/add-event-hub-endpoint.png":::

Next, you'll add a route that connects to the endpoint you created in the above step, with a routing query that sends the delete events. Follow these steps to create a route:

1. Navigate to the *Routes* tab and select **Add** to add a route.

    :::image type="content" source="media/how-to-provision-using-device-provisioning-service/add-message-route.png" alt-text="Screenshot of the Visual Studio window to add a route to send events." lightbox="media/how-to-provision-using-device-provisioning-service/add-message-route.png":::

2. In the *Add a route* page that opens, choose the following values:

   * **Name**: Choose a name for your route. 
   * **Endpoint**: Choose the event hubs endpoint you created earlier from the dropdown.
   * **Data source**: Choose *Device Lifecycle Events*.
   * **Routing query**: Enter `opType='deleteDeviceIdentity'`. This query limits the device lifecycle events to only send the delete events.

3. Select **Save**.

    :::image type="content" source="media/how-to-provision-using-device-provisioning-service/lifecycle-route.png" alt-text="Screenshot of the Azure portal window to add a route to send lifecycle events." lightbox="media/how-to-provision-using-device-provisioning-service/lifecycle-route.png":::

Once you have gone through this flow, everything is set to retire devices end-to-end.

### Validate

To trigger the process of retirement, you need to manually delete the device from IoT Hub.

You can do this with an [Azure CLI command](/cli/azure/iot/hub/module-identity#az_iot_hub_module_identity_delete) or in the Azure portal. 
Follow the steps below to delete the device in the Azure portal:

1. Navigate to your IoT hub, and choose **IoT devices** in the menu options on the left. 
2. You'll see a device with the device registration ID you chose in the [first half of this article](#auto-provision-device-using-device-provisioning-service). Alternatively, you can choose any other device to delete, as long as it has a twin in Azure Digital Twins so you can verify that the twin is automatically deleted after the device is deleted.
3. Select the device and choose **Delete**.

:::image type="content" source="media/how-to-provision-using-device-provisioning-service/delete-device-twin.png" alt-text="Screenshot of the Azure portal to delete device twin from the IoT devices." lightbox="media/how-to-provision-using-device-provisioning-service/delete-device-twin.png":::

It might take a few minutes to see the changes reflected in Azure Digital Twins.

Use the following [Azure Digital Twins CLI](how-to-use-cli.md) command to verify the twin of the device in the Azure Digital Twins instance was deleted.

```azurecli-interactive
az dt twin show -n <Digital Twins instance name> --twin-id "<Device Registration ID>"
```

You should see that the twin of the device cannot be found in the Azure Digital Twins instance anymore.

:::image type="content" source="media/how-to-provision-using-device-provisioning-service/show-retired-twin.png" alt-text="Screenshot of the Command window showing twin not found." lightbox="media/how-to-provision-using-device-provisioning-service/show-retired-twin.png":::

## Clean up resources

If you no longer need the resources created in this article, follow these steps to delete them.

Using the Azure Cloud Shell or local Azure CLI, you can delete all Azure resources in a resource group with the [az group delete](/cli/azure/group#az_group_delete) command. This removes the resource group; the Azure Digital Twins instance; the IoT hub and the hub device registration; the event grid topic and associated subscriptions; the event hubs namespace and both Azure Functions apps, including associated resources like storage.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

```azurecli-interactive
az group delete --name <your-resource-group>
```

Then, delete the project sample folder you downloaded from your local machine.

## Next steps

The digital twins created for the devices are stored as a flat hierarchy in Azure Digital Twins, but they can be enriched with model information and a multi-level hierarchy for organization. To learn more about this concept, read:

* [*Concepts: Digital twins and the twin graph*](concepts-twins-graph.md)

For more information about using HTTP requests with Azure functions, see:

* [*Azure Http request trigger for Azure Functions*](../azure-functions/functions-bindings-http-webhook-trigger.md)

You can write custom logic to automatically provide this information using the model and graph data already stored in Azure Digital Twins. To read more about managing, upgrading, and retrieving information from the twins graph, see the following:

* [*How-to: Manage a digital twin*](how-to-manage-twin.md)
* [*How-to: Query the twin graph*](how-to-query-graph.md)