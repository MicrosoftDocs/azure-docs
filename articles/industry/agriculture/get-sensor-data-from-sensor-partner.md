---
title: Get sensor data from the partners
description: Describes how to get sensor data from partners
author: uhabiba04
ms.topic: article
ms.date: 10/25/2019
ms.author: v-umha
ms.service: backup
---

# Get sensor data from sensor partners


  FarmBeats helps you to bring streaming data from your IoT devices and sensors into datahub. Currently the following Sensor device partners are supported:


  ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/partner-information.png)

  Integrating Device data with Azure FarmBeats helps you get ground data from the IoT Sensors deployed in your farm to the Datahub. The data, once available can be visualized through the FarmBeats Accelerator and can be used for data fusion and AI/ML model building using the farmbeats.

  To start sensor data streaming, ensure the following:

  1.	You have installed FarmBeats from the Azure Marketplace
  2.	You have decided on the sensors and devices you want installed on your farm.

    > [!NOTE]
    > If you are planning to use soil moisture sensors, you can use FarmBeats Soil Moisture Sensor Placement map to get a recommendation on the number of sensors and where exactly should place the sensors. For more information, see  Generate Maps section for more details (add link here).

  3. Purchase and deploy device/sensors from your device partner in your farm. Make sure you can access the sensor data via your device partners’ solution.

### Enable device integration with FarmBeats   

    Once you have started the streaming of sensor data, you can start the process of getting the data into your FarmBeats system. You need to provide the following information to your device provider to enable the integration to FarmBeats:  

    1. API Endpoint  
    2. Tenant ID  
    3. Client ID  
    4. Client Secret  
    5. EventHub Connection String

### Generate the credentials

  The above information is provided to you by your System Integrator. For any issues while enabling the device integrations, contact your System Integrator.

  Alternatively, you can generate the credentials by running this script from the Azure CloudShell. Follow the below steps:

    1. Download the ZIP file (add link here) and extract to your local drive. You will find two files inside the ZIP file.
    2. Sign in to https://portal.azure.com/ and open CloudShell (This option is available on the top right bar of the portal)  

      ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/navigation-bar.png)

    3. Ensure the environment is set to *PowerShell* - by default it is set to Bash.

      ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/power-shell-new.png)

    4. Upload the 2 files (from step 1 above) in your Cloud Shell.

      ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/power-shell-two.png)

    5. Go to the directory where the files were uploaded (Usually it gets uploaded to the home directory - *</home<username>*  
    6. Run the script by writing the following command:
    ./generateCredentials.ps1  

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/power-shell-generate-credentials.png)

    Follow the onscreen instructions to capture the values. (API Endpoint, Tenant ID, Client ID, Client Secret and EventHub Connection String)

**Integrate device data using the generated credentials**

  Visit the device partner portal, to link FarmBeats using the set of credentials you generated in the previous section.

  1. API Endpoint  
  2. EventHub Connection String  
  3. Client ID  
  4. Client Secret  
  5. Tenant ID  

  The device provider will confirm a successful integration. Upon confirmation, you can view all the devices and sensors on Azure FarmBeats


## View device(s) and sensor (s)

### Devices

  There are two types of devices, which are currently supported within the FarmBeats system. They are:
    - **Node**: a device to which one or more sensors are attached to
    - **Gateway**: a device to which one or more sensors are attached to

  Use the following to view devices:
  1. On the homepage, click **Devices** from the menu. Devices page displays the device type, model, its status, the farm it is placed in and the last metadata updated date. By default, the   farm column is set to NULL. You can choose to assign a device to a farm – Refer to ( **(add a link Assign devices)** section for more details.
  2. Click the device to view the device properties, telemetry and child devices connected to the device.  

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/view-devices.png)

### Sensors

  1. On the homepage, click **Sensors** from the menu. A Sensors page displays with type of sensor, the farm it is connected, the parent device, port name, port type and the last updated status.
  2. Click the sensor to view sensor properties, active alerts and telemetry from the sensor.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/view-sensors.png)

## Assign Devices  

  Once you have the sensor data flowing in, you can assign it to the farm in which you have deployed the sensors.

  1. On the homepage, click **Farms** from the menu, the Farms list page is displayed.  
  2. Select the Farm to which you want to assign the device and click **Add Devices**.  
  3. The **Add Devices** window displays. Select the device(s) you want to assign to the farm.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/add-devices.png)

  4. Click **Add Devices**.   
    Alternatively, go to the **Devices** menu, select the devices you want to assign to a farm and click **Associate Devices**.  
  5. In the **Associate Devices** window, select the farm from drop-down and click **Apply to All** to associate the farm to all the selected devices.

      ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/associate-devices.png)

  6. To associate each device to a different farm, click the drop-down in the **Assign to Farm** column and select a farm for each device row.  
  7. Click **Assign** to complete device assignment.

### Visualize sensor data

Follow these steps:

  1. On the homepage, click **Farms** from the menu to view the farms page.  
  2. Click the **Farm** for which you want to see the sensor data.  
  3. On the **Farm** dashboard, you can view telemetry data. You can choose to view live telemetry or use **Custom Range** to view in a specific date range.

  ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/telemetry-data.png)

## Delete sensor(s)

Follow these steps:

  1. On the homepage, click **Sensors** from the menu to view the sensors page.  
  2. Select the device you want to delete and click **Delete** from confirmation window.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/delete-sensors.png)

  A confirmation message displays that the sensor is successfully deleted.  

## Delete device(s)

Follow these steps:

  1. On the homepage, click **Devices** from the menu to view the devices page.  
  2. Select the device you want to delete and click **Delete** from the confirmation window.

  ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/delete-device.png)

## Next Steps

You have sensor data flowing into your Azure FarmBeats instance now. See how you can [generate maps](generate-maps.md#generate-maps) for your farms.
