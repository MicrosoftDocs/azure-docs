---
title: Monitor a space with Azure Digital Twins | Microsoft Docs
description: Learn how to monitor the working conditions of your spaces with Azure Digital Twins using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 08/30/2018
ms.author: dkshir
---

# Tutorial: Monitor temperature and air in your building with Azure Digital Twins

This tutorial demonstrates how to use Azure Digital Twins to monitor your spaces for desired temperature conditions and comfort level. Once you have provisioned your sample building using the steps in [the previous tutorial](tutorial-facilities-setup.md), you can create and run custom computations on your sensor data using the steps in this tutorial.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Define conditions to monitor
> * Create a User-Defined Function
> * Simulate sensor data
> * Get results of User-Defined Function

If you don’t have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

This tutorial assumes that you have completed the steps to [Provision your Azure Digital Twins setup](tutorial-facilities-setup.md). Before proceeding, make sure that you have:
- an instance of Digital Twins running, and 
- the [Azure Digital Twins sample application](https://github.com/Azure-Samples/digital-twins-samples-csharp) downloaded and extracted on your work machine.

## Define conditions to monitor
You can define a set of specific conditions in the device or sensor data, these conditions are called **Matchers**. Matchers will help you take action on the particular set of conditions, with the help of *user-defined functions*. A user-defined function can use one or more matchers to implement a custom logic that acts on the events coming from your spaces and devices. For more information, read the [Data Processing and User-Defined Functions](concepts-user-defined-functions.md). 

In the Digital Twins sample, navigate to the folder *occupancy-quickstart\src\actions* and open the file *provisionSample.yaml*. Note the section that begins with the type **matchers**. Each entry under this type creates a matcher with the specified **Name**, that will monitor a sensor of type **dataTypeValue**. Notice how it relates to the space named *Focus Room A1*, which has a **devices** node, containing a few **sensors**. To provision a matcher that will track one of these sensors, its **dataTypeValue** should match with that sensor's **dataType**. 

Add the following matcher below the existing matchers:

```yaml
      - name: Matcher Temperature
        dataTypeValue: Temperature
```

This will track the *SAMPLE_SENSOR_TEMPERATURE* sensor that we added in [the first tutorial](tutorial-facilities-setup.md).

> [!IMPORTANT]
> While copying *YAML* snippets, make sure your editor does not convert spaces to tabs.

## Create a User-Defined Function
User-defined functions or UDFs allow you to customize the processing of telemetry data from your sensors. They are custom JavaScript code that can run within your Digital Twins instance, when specific conditions as described by the matchers occur. You can create *matchers* and *user-defined functions* for each sensor that you want to monitor. For more detailed information, read [Data Processing and User-Defined Functions](concepts-user-defined-functions.md). 

In the sample *provisionSample.yaml* file, look for a section beginning with the type **userdefinedfunctions**. This section provisions a user-defined function with a given **Name**, that acts on the list of matchers under the **matcherNames**. Notice how you can provide your own JavaScript file for the UDF as the **script**. Also note the section named **roleassignments**. It assigns the *Space Administrator* role to the user-defined function. This is required for the function to access the events coming from any of the provisioned spaces. 

1. Configure the UDF to include the temperature matcher by adding the following line to the `matcherNames` node in the *provisionSample.yaml* file:

```yaml
        - Matcher Temperature
```

1. Open the file *src\actions\userDefinedFunctions\availability.js* in your editor. This is the file mentioned in the **script** element of the *provisionSample.yaml*. The user-defined function in this file looks for conditions when no motion is detected in the room, as well as carbon dioxide levels are below 1000 ppm. Modify the JavaScript file to add monitor temperature in addition to other conditions. Add the following lines of code to look for conditions when no motion is detected in the room, carbon dioxide levels are below 1000 ppm, and temperature is below 73 degrees Fahrenheit:
    1. At the top of the file, add the following lines for temperature:

        ```JavaScript
            var temperatureType = "Temperature";
            var temperatureThreshold = 73;
        ```
   
    1. Add the following lines after the statement which defines `var motionSensor`:

        ```JavaScript
            var temperatureSensor = otherSensors.find(function(element) {
                return element.DataType === temperatureType;
            });
        ```
    
    1. Add the following line after the statement which defines `var carbonDioxideValue`:

        ```JavaScript
            var temperatureValue = getFloatValue(temperatureSensor.Value().Value);
        ```
    
    1. Remove the following lines of code: 

        ```JavaScript
            if(carbonDioxideValue === null || motionValue === null) {
                sendNotification(telemetry.SensorId, "Sensor", "Error: Carbon dioxide or motion are null, returning");
                return;
            }
        ```
       
       Replace this code snippet with the following:

        ```JavaScript
            if(carbonDioxideValue === null || motionValue === null || temperatureValue === null){
                sendNotification(telemetry.SensorId, "Sensor", "Error: Carbon dioxide, motion, or temperature are null, returning");
                return;
            }
        ```
    
    1. Replace the line `var availableFresh = "Room is available and air is fresh";` with `var availableFresh = "Room is available, air is fresh, and temperature is just right.";`.
    
    1. Remove the following lines of code:

        ```JavaScript
            if(carbonDioxideValue < carbonDioxideThreshold && !presence) {
                log(`${availableFresh}. Carbon Dioxide: ${carbonDioxideValue}. Presence: ${presence}.`);
                setSpaceValue(parentSpace.Id, spaceAvailFresh, availableFresh);

                // Set up custom notification for air quality
                parentSpace.Notify(JSON.stringify(availableFresh));
            }
            else {
                log(`${noAvailableOrFresh}. Carbon Dioxide: ${carbonDioxideValue}. Presence: ${presence}.`);
                setSpaceValue(parentSpace.Id, spaceAvailFresh, noAvailableOrFresh);

                // Set up custom notification for air quality
                parentSpace.Notify(JSON.stringify(noAvailableOrFresh));
            }
        ```
      
       And replace them with the following:

        ```JavaScript
            if(carbonDioxideValue < carbonDioxideThreshold && temperatureValue < temperatureThreshold && !presence) {
                log(`${availableFresh}. Carbon Dioxide: ${carbonDioxideValue}. Temperature: ${temperatureValue}. Presence: ${presence}.`);
                setSpaceValue(parentSpace.Id, spaceAvailFresh, availableFresh);

                // Set up custom notification for air quality
                parentSpace.Notify(JSON.stringify(availableFresh));
            }
            else {
                log(`${noAvailableOrFresh}. Carbon Dioxide: ${carbonDioxideValue}. Temperature: ${temperatureValue}. Presence: ${presence}.`);
                setSpaceValue(parentSpace.Id, spaceAvailFresh, noAvailableOrFresh);

                // Set up custom notification for air quality
                parentSpace.Notify(JSON.stringify(noAvailableOrFresh));
            }
        ```
    
    1. Save the file. 

1. Open command window, and navigate to the folder **_occupancy-quickstart\src_**. Run the following command to provision your spatial intelligence graph and user-defined function. Sign in with your account when prompted. 
```cmd/sh
dotnet run ProvisionSample
```

1. Once your login is authenticated, the application creates a sample spatial graph as configured in the *provisionSample.yaml*. Observe the messages in the command window and notice how your spatial graph gets created. Notice how it creates an IoT hub at the root node or the `Venue`. 

1. From the output in the command window, copy the value of the `ConnectionString`, under the `Devices` section, to your clipboard. You will need this value to simulate the device connection in the following section.

    ![Provision Sample](./media/tutorial-facilities-udf/run-provision-sample.png)


## Simulate sensor data
In this section, you will use the project named *device-connectivity* in the sample to simulate sensor data for detecting motion, temperature and carbon dioxide. This project generates random values for the sensors, and sends them to the IoT hub by using the device connection string.

1. In a separate command window, navigate to the Digital Twins sample, and then to the **_device-connectivity_** folder.
1. Run this command to make sure the dependencies for the project are correct:
```cmd/sh
dotnet restore
```
1. Open the *appSettings.json* file in your editor, edit the following values:
    1. *DeviceConnectionString*: Assign the value of `ConnectionString` in the output window from the previous section.
    2. *HardwareId* within the *Sensors* array: Since we are simulating events from sensors provisioned to our Digital Twins instance, the hardware ID and the names of the sensors in this file should match with those in the `sensors` node of the *provisionSample.yaml* file. Add a new entry for the temperature sensor; the **Sensors** node in the *appSettings.json* should look like the following:

    ```JSON
    "Sensors": [{
      "DataType": "Motion",
      "HardwareId": "SAMPLE_SENSOR_MOTION"
    },{
      "DataType": "CarbonDioxide",
      "HardwareId": "SAMPLE_SENSOR_CARBONDIOXIDE"
    },{
      "DataType": "Temperature",
      "HardwareId": "SAMPLE_SENSOR_TEMPERATURE"
    }]
    ```

1. Run this command to start simulating device events for temperature, motion and carbon dioxide:
```cmd/sh
dotnet run
```

## Get results of User-Defined Function
The user-defined function runs every time your instance receives telemetry data. This section queries your Digital Twins instance to get the results of the user-defined function. You will see in near real time, when a room is available, the air is fresh and temperature is right. 

1. In a separate command window, navigate to the sample again. 

1. Run the following commands:

```cmd/sh
cd occupancy-quickstart\src
dotnet run GetAvailableAndFreshSpaces
```

The output window will show how the user-defined function executes, and intercepts events from the device simulation. 

   ![Execute UDF](./media/tutorial-facilities-udf/udf-running.png)


## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select and **Delete** your Digital Twins resource group.
2. If you need to, you may proceed to delete the sample applications on your work machine as well. 


## Next steps

Proceed to the next tutorial in the series to learn how to create notifications for the simulated sensor data for your sample building. 
> [!div class="nextstepaction"]
> [Tutorial: Receive notifications from your building](tutorial-facilities-events.md)

