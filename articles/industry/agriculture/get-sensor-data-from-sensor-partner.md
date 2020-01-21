---
title: Get sensor data from the partners
description: This article describes how to get sensor data from partners.
author: uhabiba04
ms.topic: article
ms.date: 11/04/2019
ms.author: v-umha
---

# Get sensor data from sensor partners

Azure FarmBeats helps you to bring streaming data from your IoT devices and sensors into Datahub. Currently, the following sensor device partners are supported.

  ![FarmBeats partners](./media/get-sensor-data-from-sensor-partner/partner-information-1.png)

Integrating device data with Azure FarmBeats helps you get ground data from the IoT sensors deployed in your farm to the datahub. The data, once available, can be visualized through the FarmBeats accelerator. The data can be used for data fusion and machine learning/artificial intelligence (ML/AI) model building by using FarmBeats.

To start sensor data streaming, ensure the following:

-  You installed FarmBeats in Azure Marketplace.
-  You decided on the sensors and devices that you want to install on your farm.
-  If you plan on using soil moisture sensors, use the FarmBeats Soil Moisture Sensor Placement map to get a recommendation on the number of sensors and where exactly you should place them. For more information, see [Generate maps](generate-maps-in-azure-farmbeats.md).
- You purchase and deploy devices or sensors from your device partner on your farm. Make sure you can access the sensor data via your device partners' solution.

## Enable device integration with FarmBeats

After you start the streaming of sensor data, you can begin the process of getting the data into your FarmBeats system. Provide the following information to your device provider to enable the integration to FarmBeats:

 - API endpoint
 - Tenant ID
 - Client ID
 - Client secret
 - EventHub connection string

The previous information is provided to you by your system integrator. For any issues you might encounter when you enable the device integrations, contact your system integrator.

Alternatively, you can generate the credentials by running this script from Azure Cloud Shell. Follow these steps.

1. Download the [zip file](https://aka.ms/farmbeatspartnerscriptv2), and extract it to your local drive. There will be one file inside the zip file.
2. Sign in to https://portal.azure.com/ and go to Azure Active Directory -> App Registrations

3. Click on the App Registration that was created as part of your FarmBeats deployment. It will have the same name as your FarmBeats Datahub.

4. Click on “Expose an API” -> Click “Add a client application” and enter **04b07795-8ddb-461a-bbee-02f9e1bf7b46** and check "Authorize Scope". This will give access to the Azure CLI (Cloud Shell) to perform the below steps.

5. Open Cloud Shell. This option is available on the toolbar in the upper-right corner of the Azure portal.

    ![Azure portal toolbar](./media/get-drone-imagery-from-drone-partner/navigation-bar-1.png)

6. Make sure the environment is set to **PowerShell**. By default, it's set to Bash.

    ![PowerShell toolbar setting](./media/get-sensor-data-from-sensor-partner/power-shell-new-1.png)

7. Upload the file from step 1 in your Cloud Shell instance.

    ![Upload toolbar button](./media/get-sensor-data-from-sensor-partner/power-shell-two-1.png)

8. Go to the directory where the file was uploaded. By default, files get uploaded to the home directory under the username.

9. Run the following script. The script asks for the Tenant ID which can be obtained from Azure Active Directory -> Overview page.

    ```azurepowershell-interactive 

    ./generatePartnerCredentials.ps1   

    ```

10. Follow the onscreen instructions to capture the values for **API Endpoint**, **Tenant ID**, **Client ID**, **Client Secret**, and **EventHub Connection String**.

### Integrate device data by using the generated credentials

Go to the device partner portal to link FarmBeats by using the set of credentials you generated in the previous section:

 - API endpoint
 - EventHub connection string
 - Client ID
 - Client secret
 - Tenant ID

 The device provider confirms a successful integration. Upon confirmation, you can view all the devices and sensors on Azure FarmBeats.

## View devices and sensors

Use the following section to view the devices and sensors for your farm.

### View devices

Currently, FarmBeats supports the following devices:

- **Node**: A device to which one or more sensors are attached.
- **Gateway**: A device to which one or more nodes are attached.

Follow these steps.

1. On the home page, select **Devices** from the menu.
  The **Devices** page displays the device type, model, status, the farm it's placed in, and the last updated date for metadata. By default, the farm column is set to *NULL*. You can choose to assign a device to a farm. For more information, see [Assign devices](#assign-devices).
2. Select the device to view the device properties, telemetry, and child devices connected to the device.

    ![Devices page](./media/get-sensor-data-from-sensor-partner/view-devices-1.png)

### View sensors

Follow these steps.

1. On the home page, select **Sensors** from the menu.
  The **Sensors** page displays details about the type of sensor, the farm it's connected to, parent device, port name, port type, and the last updated status.
2. Select the sensor to view sensor properties, active alerts, and telemetry from the sensor.

    ![Sensors page](./media/get-sensor-data-from-sensor-partner/view-sensors-1.png)

## Assign devices  

After the sensor data is flowing in, you can assign it to the farm where you deployed the sensors.

1. On the home page, select **Farms** from the menu. The **Farms** list page appears.
2. Select the farm to which you want to assign the device, and select **Add Devices**.
3. The **Add Devices** window appears. Select the device you want to assign to the farm.

    ![Add Devices window](./media/get-sensor-data-from-sensor-partner/add-devices-1.png)

4. Select **Add Devices**. Alternatively, go to the **Devices** menu, select the devices you want to assign to a farm, and select **Associate Devices**.
5. In the **Associate Devices** window, select the farm from the drop-down list, and select **Apply to All** to associate the farm to all the selected devices.

    ![Associate Devices window](./media/get-sensor-data-from-sensor-partner/associate-devices-1.png)

6. To associate each device to a different farm, select the drop-down arrow in the **Assign to Farm** column, and select a farm for each device row.
7. Select **Assign** to complete the device assignment.

### Visualize sensor data

Follow these steps.

1. On the home page, select **Farms** from the menu to view the **Farms** page.
2. Select the **Farm** for which you want to see the sensor data.
3. On the **Farm** dashboard, you can view telemetry data. You can view live telemetry or use **Custom Range** to see a specific date range.

    ![Farm dashboard](./media/get-sensor-data-from-sensor-partner/telemetry-data-1.png)

## Delete a sensor

Follow these steps.

1. On the home page, select **Sensors** from the menu to view the **Sensors** page.
2. Select the device you want to delete, and select **Delete** in the confirmation window.

    ![Delete button](./media/get-sensor-data-from-sensor-partner/delete-sensors-1.png)

A confirmation message shows that the sensor is successfully deleted.

## Delete devices

Follow these steps.

1. On the home page, select **Devices** from the menu to view the **Devices** page.
2. Select the device you want to delete, and select **Delete** in the confirmation window.

    ![Delete button](./media/get-sensor-data-from-sensor-partner/delete-device-1.png)

## Next steps

You now have sensor data flowing into your Azure FarmBeats instance. Now, learn how to [generate maps](generate-maps-in-azure-farmbeats.md#generate-maps) for your farms.
