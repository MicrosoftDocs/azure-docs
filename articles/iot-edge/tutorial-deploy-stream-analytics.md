---
title: Deploy Azure Stream Analytics as an Azure IoT Edge Module
description: Deploy Azure Stream Analytics to IoT Edge devices to process data locally, reduce cloud traffic, and react to insights faster. Learn how in this step-by-step guide.
author: PatAltimore
ms.author: patricka
ms.date: 05/16/2025
ms.topic: tutorial
ms.service: azure-iot-edge
ms.custom:
  - mvc
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/16/2025
  - ai-gen-description
  - build-2025
---

# Tutorial: Deploy Azure Stream Analytics as an IoT Edge module

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

In this tutorial, you create an Azure Stream Analytics job in the Azure portal and deploy it as an IoT Edge module with no extra code.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Create an Azure Stream Analytics job to process data on the edge.
> * Connect the new Azure Stream Analytics job with other IoT Edge modules.
> * Deploy the Azure Stream Analytics job to an IoT Edge device from the Azure portal.

:::image type="content" source="./media/tutorial-deploy-stream-analytics/asa-architecture.png" alt-text="Diagram that shows stream architecture, including staging and deploying an Azure Stream Analytics job.":::

The Stream Analytics module in this tutorial calculates the average temperature over a rolling 30-second window. When the average reaches 70, the module sends an alert for the device to take action. In this case, the action is to reset the simulated temperature sensor. In a production environment, you can use this functionality to shut off a machine or take preventative measures when the temperature reaches dangerous levels.

## Why use Azure Stream Analytics in IoT Edge?

Many IoT solutions use analytics services to gain insight about data as it arrives in the cloud from IoT devices. With Azure IoT Edge, you move [Azure Stream Analytics](../stream-analytics/index.yml) logic onto the device itself. Processing telemetry streams at the edge reduces the amount of uploaded data and the time it takes to react to actionable insights. Azure IoT Edge and Azure Stream Analytics integrate to simplify your workload development.

Azure Stream Analytics uses a structured query syntax for data analysis in the cloud and on IoT Edge devices. For more information, see [Azure Stream Analytics documentation](../stream-analytics/stream-analytics-edge.md).

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

* An Azure IoT Edge device.

   Use an Azure virtual machine as an IoT Edge device by following the steps in the quickstart for [Linux](quickstart-linux.md) or [Windows devices](quickstart.md).

* A free or standard-tier [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.

## Create an Azure Stream Analytics job

In this section, you create an Azure Stream Analytics job that:

* Receives data from your IoT Edge device.
* Queries the telemetry data for values outside a set range.
* Takes action on the IoT Edge device based on the query results.

### Create a storage account

When you create an Azure Stream Analytics job to run on an IoT Edge device, you need to store it so the device can access it. You can use an existing Azure Storage account or create a new one.

1. In the Azure portal, go to **Create a resource** > **Storage** > **Storage account**.

1. Provide the following values to create your storage account:

   | Field | Value |
   | ----- | ----- |
   | Subscription | Choose the same subscription as your IoT hub. |
   | Resource group | Use the same resource group for all your test resources for the IoT Edge quickstarts and tutorials. For example, **IoTEdgeResources**. |
   | Name | Provide a unique name for your storage account. |
   | Location | Select a location close to you. |

1. Keep the default values for the other fields, and select **Review + Create**.

1. Review your settings, then select **Create**.

### Create a new job

1. In the [Azure portal](https://portal.azure.com/#home), select:
    1. **Create a resource**
    1. **Internet of Things** from the menu on the left
    1. Type **Stream Analytics** in the search bar to find it in Azure Marketplace
    1. Select **Create**, then **Stream Analytics job** from the dropdown menu
   
1. Provide the following values to create your new Stream Analytics job:

   | Field | Value |
   | ----- | ----- |
   | Name | Provide a name for your job. For example, **IoTEdgeJob** |
   | Subscription | Choose the same subscription as your IoT hub. |
   | Resource group | Use the same resource group for all test resources you create during the IoT Edge quickstarts and tutorials. For example, a resource named **IoTEdgeResources**. |
   | Region | Choose a location close to you. |
   | Hosting environment | Select **Edge**. This option lets you deploy to an IoT Edge device instead of the cloud. |

1. Select **Review + create**.

1. Confirm your options, then select **Create**.

### Configure your job

After you create your Stream Analytics job in the Azure portal, configure it with an *input*, an *output*, and a *query* to run on the data that passes through.

This section shows how to create a job that receives temperature data from an IoT Edge device. It analyzes the data in a rolling 30-second window. If the average temperature in that window goes over 70 degrees, the job sends an alert to the IoT Edge device. 

> [!NOTE]
> You specify where the data comes from and goes in the next section, [Configure IoT Edge settings](#configure-iot-edge-settings), when you deploy the job.  

#### Set your input and output

1. Navigate to your Stream Analytics job in the Azure portal.

1. Under **Job topology**, select **Inputs**, then select **Add input**.

1. Choose **Edge Hub** from the dropdown list.

   If you don't see the **Edge Hub** option in the list, you might have created your Stream Analytics job as a cloud-hosted job. Try creating a new job, and make sure you select **Edge** as the hosting environment.

1. In the **New input** pane, enter **temperature** as the **Input alias**.

1. Keep the default values for the other fields, and select **Save**.

1. Under **Job topology**, select **Outputs**, then select **Add**.

1. Choose **Edge Hub** from the drop-down list.

1. In the **New output** pane, enter **alert** as the output alias.

1. Keep the default values for the other fields, and select **Save**.

#### Create a query

1. Under **Job Topology**, select **Query**.

1. Replace the default text with the following query:

    ```sql
    SELECT  
        'reset' AS command
    INTO
       alert
    FROM
       temperature TIMESTAMP BY timeCreated
    GROUP BY TumblingWindow(second,30)
    HAVING Avg(machine.temperature) > 70
    ```

   In this query, the SQL code sends a reset command to the alert output if the average machine temperature in a 30-second window reaches 70 degrees. The reset command is preprogrammed into the sensor as an action.

1. Select **Save query**.

### Configure IoT Edge settings

To deploy your Stream Analytics job on an IoT Edge device, associate your Azure Stream Analytics job with a storage account. When you deploy your job, the job definition exports to the storage account as a container.

1. In your Stream Analytics service, under the **Settings** menu, select **Storage account settings**.

1. Choose the **Select Blob storage/ADLS Gen 2 from your subscriptions** option.

1. Your Azure storage account automatically shows on the page. If you don't see one, make sure you [create a storage](#create-a-storage-account). If you need to choose a different storage than the one listed in the **Storage account** field, select it from the dropdown menu.

1. Select **Save** if you made any changes.

## Deploy the job

You're now ready to deploy the Azure Stream Analytics job on your IoT Edge device.

In this section, you use the **Set Modules** wizard in the Azure portal to create a *deployment manifest*. A deployment manifest is a JSON file that describes all the modules that get deployed to a device. The manifest also shows the container registries that store the module images, how the modules should be managed, and how the modules can communicate with each other. Your IoT Edge device retrieves its deployment manifest from IoT Hub, then uses the information in it to deploy and configure all of its assigned modules.

For this tutorial, you deploy two modules. The first is **SimulatedTemperatureSensor**, which is a module that simulates a temperature and humidity sensor. The second is your Stream Analytics job. The sensor module provides the stream of data that your job query analyzes.

1. In the Azure portal, navigate to your IoT hub.

1. Select **Devices** under the **Device management** menu, and then select your IoT Edge device to open it.

1. Select **Set modules**.  

1. If you previously deployed the SimulatedTemperatureSensor module on this device, it might autopopulate. If it doesn't, add the module with the following steps:

   1. Select **+ Add** and choose **IoT Edge Module**.
   1. For the name, type **SimulatedTemperatureSensor**.
   1. For the image URI, enter **mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.5**.
   1. Leave the other default settings, then select **Add**.

1. Add your Azure Stream Analytics Edge job with the following steps:

   1. Select **+ Add** and choose **Azure Stream Analytics Module**.
   1. Select your subscription and the Azure Stream Analytics Edge job that you created.
   1. Select **Save**.

   Once you save your changes, the details of your Stream Analytics job are published to the storage container that you created.

1. After your Stream Analytics addition finishes deployment, confirm that two new modules appear on your **Set modules** page.

   :::image type="content" source="media/tutorial-deploy-stream-analytics/two-new-modules.png" alt-text="Screenshot confirming that two new modules are on your device. The screenshot also shows where the Review + create button is located." lightbox="media/tutorial-deploy-stream-analytics/two-new-modules.png":::

1. Select **Review + create**. The deployment manifest appears.

1. Select **Create**.

1. On your **Set modules** page of your device, after a few minutes, you should see the modules listed and running. Refresh the page if you don't see modules, or wait a few more minutes then refresh it again.

### Understand the two new modules

1. From the **Set modules** tab of your device, select your Stream Analytics module name to take you to the **Update IoT Edge Module** page. Here you can update the settings.

   The **Settings** tab has the **Image URI** that points to a standard Azure Stream Analytics image. This single image is used for every Stream Analytics module that gets deployed to an IoT Edge device.

   The **Module Twin Settings** tab shows the JSON that defines the Azure Stream Analytics (ASA) property called **ASAJobInfo**. The value of that property points to the job definition in your storage container. This property is how the Stream Analytics image is configured with your specific job details.

   By default, the Stream Analytics module takes the same name as the job it's based on. You can change the module name on this page if you like, but it's not necessary.

1. Select **Apply** if you made changes or **Cancel** if you didn't make any changes.

### Assign routes to your modules

1. On the **Set modules on device:\<your-device-name\>** page, select **Next: Routes**.

1. On the **Routes** tab, you define how messages are passed between modules and the IoT Hub. Messages are constructed using name and value pairs. 
 
   Add the route names and values with the pairs shown in following table. Replace instances of `{moduleName}` with the name of your Azure Stream Analytics module. This module should be the same name you see in the modules list of your device on the **Set modules** page, as shown in the Azure portal.

   :::image type="content" source="media/tutorial-deploy-stream-analytics/stream-analytics-module-name.png" alt-text="Screenshot showing the name of your Stream Analytics modules in your IoT Edge device in the Azure portal." lightbox="media/tutorial-deploy-stream-analytics/stream-analytics-module-name.png":::

    | Name | Value |
    | --- | --- |
    | telemetryToCloud | `FROM /messages/modules/SimulatedTemperatureSensor/* INTO $upstream` |
    | alertsToCloud | `FROM /messages/modules/{moduleName}/* INTO $upstream` |
    | alertsToReset | `FROM /messages/modules/{moduleName}/* INTO BrokeredEndpoint("/modules/SimulatedTemperatureSensor/inputs/control")` |
    | telemetryToAsa | `FROM /messages/modules/SimulatedTemperatureSensor/* INTO BrokeredEndpoint("/modules/{moduleName}/inputs/temperature")`|

    The routes you declare here define the flow of data through the IoT Edge device. The telemetry data from SimulatedTemperatureSensor are sent to IoT Hub and to the **temperature** input that was configured in the Stream Analytics job. The **alert** output messages are sent to IoT Hub and to the SimulatedTemperatureSensor module to trigger the reset command.

1. Select **Next: Review + Create**.

1. In the **Review + Create** tab, you can see how the information you provided in the wizard is converted into a JSON deployment manifest. 
 
1. When you're done reviewing the manifest, select **Create** to finish setting your module.

## View data

Go to your IoT Edge device to see the interaction between the Azure Stream Analytics module and the SimulatedTemperatureSensor module.

> [!NOTE]
> If you're using a virtual machine for a device, use the [Azure Cloud Shell](/azure/cloud-shell/overview) to directly access all Azure authenticated services.

1. Check that all the modules are running in Docker:

   ```cmd/sh
   iotedge list  
   ```

1. View all system logs and metrics data. Replace *{moduleName}* with the name of your Azure Stream Analytics module:

   ```cmd/sh
   iotedge logs -f {moduleName}  
   ```

1. See how the reset command affects the SimulatedTemperatureSensor by viewing the sensor logs:

   ```cmd/sh
   iotedge logs SimulatedTemperatureSensor
   ```

   You can watch the machine's temperature gradually rise until it reaches 70 degrees for 30 seconds. Then the Stream Analytics module triggers a reset, and the machine temperature drops back to 21.

   :::image type="content" source="./media/tutorial-deploy-stream-analytics/docker-log.png" alt-text="Screenshot of the reset command in the module logs output." lightbox="./media/tutorial-deploy-stream-analytics/docker-log.png":::

## Clean up resources

If you want to continue to the next recommended article, keep the resources and configurations you created and reuse them. You can also keep using the same IoT Edge device as a test device.

Otherwise, delete the local configurations and Azure resources you used in this article to avoid charges.

[!INCLUDE [iot-edge-clean-up-cloud-resources](includes/iot-edge-clean-up-cloud-resources.md)]

## Next steps

In this tutorial, you set up an Azure Stream Analytics job to analyze data from your IoT Edge device. You loaded the Azure Stream Analytics module on your IoT Edge device to process and react to temperature increases locally, and sent the aggregated data stream to the cloud. To learn how Azure IoT Edge can help you build more solutions, try next tutorial.

> [!div class="nextstepaction"]
> [Deploy an Azure Machine Learning model as a module](tutorial-deploy-machine-learning.md)