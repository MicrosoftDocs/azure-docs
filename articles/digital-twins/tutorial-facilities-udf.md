---
title: Monitor a space with Azure Digital Twins | Microsoft Docs
description: Learn how to provision your spatial resources and monitor the working conditions with Azure Digital Twins by using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 10/26/2018
ms.author: dkshir
---

# Tutorial: Provision your building and monitor working conditions with Azure Digital Twins

This tutorial demonstrates how to use Azure Digital Twins to monitor your spaces for desired temperature conditions and comfort level. After you have [configured your sample building](tutorial-facilities-setup.md), you can provision your building and run custom functions on your sensor data by using the steps in this tutorial.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Define conditions to monitor.
> * Create a user-defined function (UDF).
> * Simulate sensor data.
> * Get results of a user-defined function.

## Prerequisites

This tutorial assumes that you have [configured your Azure Digital Twins setup](tutorial-facilities-setup.md). Before proceeding, make sure that you have:
- An [Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An instance of Digital Twins running. 
- The [Digital Twins C# samples](https://github.com/Azure-Samples/digital-twins-samples-csharp) downloaded and extracted on your work machine. 
- [.NET Core SDK version 2.1.403 or later](https://www.microsoft.com/net/download) on your development machine to build and run the sample. Run `dotnet --version` to verify that the right version is installed. 
- [Visual Studio Code](https://code.visualstudio.com/) to explore the sample code. 

## Define conditions to monitor
You can define a set of specific conditions to monitor in the device or sensor data, called *matchers*. You can then define functions called *user-defined functions*. User-defined functions execute custom logic on data that comes from your spaces and devices, when the conditions specified by the matchers occur. For more information, read [Data processing and user-defined functions](concepts-user-defined-functions.md). 

From the **occupancy-quickstart** sample project, open the file **src\actions\provisionSample.yaml** in Visual Studio Code. Note the section that begins with the type **matchers**. Each entry under this type creates a matcher with the specified **Name**. The matcher will monitor a sensor of type **dataTypeValue**. Notice how it relates to the space named *Focus Room A1*, which has a **devices** node that contains a few sensors. To provision a matcher that will track one of these sensors, make sure that its **dataTypeValue** matches the sensor's **dataType**. 

Add the following matcher below the existing matchers. Make sure the keys are aligned and spaces are not replaced by tabs.

```yaml
      - name: Matcher Temperature
        dataTypeValue: Temperature
```

This matcher will track the SAMPLE_SENSOR_TEMPERATURE sensor that you added in [the first tutorial](tutorial-facilities-setup.md). Note that these lines are also present in the *provisionSample.yaml* file as commented-out lines. You can uncomment them by removing the `#` character in front of each line. 

<a id="udf" />

## Create a user-defined function
You can use user-defined functions to customize the processing of your sensor data. They're custom JavaScript code that can run within your Azure Digital Twins instance, when specific conditions as described by the matchers occur. You can create matchers and user-defined functions for each sensor that you want to monitor. For more information, read [Data processing and user-defined functions](concepts-user-defined-functions.md). 

In the sample provisionSample.yaml file, look for a section that begins with the type **userdefinedfunctions**. This section provisions a user-defined function with a given **Name**. This UDF acts on the list of matchers under **matcherNames**. Notice how you can provide your own JavaScript file for the UDF as the **script**. Also note the section named **roleassignments**. It assigns the Space Administrator role to the user-defined function. This role allows it to access the events that come from any of the provisioned spaces. 

1. Configure the UDF to include the temperature matcher by adding or uncommenting the following line in the `matcherNames` node of the provisionSample.yaml file:

    ```yaml
            - Matcher Temperature
    ```

1. Open the file **src\actions\userDefinedFunctions\availability.js** in your editor. This is the file referenced in the **script** element of provisionSample.yaml. The user-defined function in this file looks for conditions when no motion is detected in the room, as well as carbon dioxide levels below 1,000 ppm. 

   Modify the JavaScript file to monitor temperature and other conditions. Add the following lines of code to look for conditions when no motion is detected in the room, carbon dioxide levels below 1,000 ppm, and temperature below 78 degrees Fahrenheit.

   > [!NOTE]
   > This section modifies the file *src\actions\userDefinedFunctions\availability.js* so you can learn in detail one way to write a user-defined function. However, you can choose to directly use the file [src\actions\userDefinedFunctions\availabilityForTutorial.js](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/userDefinedFunctions/availabilityForTutorial.js) in your setup. This file has all the changes required for this tutorial. If you use this file instead, make sure to use the correct file name for the **script** key in [src\actions\provisionSample.yaml](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/provisionSample.yaml).

    a. At the top of the file, add the following lines for temperature below the comment `// Add your sensor type here`:

        ```JavaScript
            var temperatureType = "Temperature";
            var temperatureThreshold = 78;
        ```
   
    b. Add the following lines after the statement that defines `var motionSensor`, below the comment `// Add your sensor variable here`:

        ```JavaScript
            var temperatureSensor = otherSensors.find(function(element) {
                return element.DataType === temperatureType;
            });
        ```
    
    c. Add the following line after the statement that defines `var carbonDioxideValue`, below the comment `// Add your sensor latest value here`:

        ```JavaScript
            var temperatureValue = getFloatValue(temperatureSensor.Value().Value);
        ```
    
    d. Remove the following lines of code from below the comment `// Modify this line to monitor your sensor value`: 

        ```JavaScript
            if(carbonDioxideValue === null || motionValue === null) {
                sendNotification(telemetry.SensorId, "Sensor", "Error: Carbon dioxide or motion are null, returning");
                return;
            }
        ```
       
       Replace them with the following lines:

        ```JavaScript
            if(carbonDioxideValue === null || motionValue === null || temperatureValue === null){
                sendNotification(telemetry.SensorId, "Sensor", "Error: Carbon dioxide, motion, or temperature are null, returning");
                return;
            }
        ```
    
    e. Remove the following lines of code from below the comment `// Modify these lines as per your sensor`:

        ```JavaScript
            var availableFresh = "Room is available and air is fresh";
            var noAvailableOrFresh = "Room is not available or air quality is poor";
        ```

       Replace them with the following lines:

        ```JavaScript
            var alert = "Room with fresh air and comfortable temperature is available.";
            var noAlert = "Either room is occupied, or working conditions are not right.";
        ```
    
    f. Remove the following *if-else* code block after the comment `// Modify this code block for your sensor`:

        ```JavaScript
            // If carbonDioxide is less than the threshold and no presence is in the room => log, notify, and set parent space computed value
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
      
       And replace it with the following *if-else* block:

        ```JavaScript
            // If sensor values are within range and the room is available
            if(carbonDioxideValue < carbonDioxideThreshold && temperatureValue < temperatureThreshold && !presence) {
                log(`${alert}. Carbon Dioxide: ${carbonDioxideValue}. Temperature: ${temperatureValue}. Presence: ${presence}.`);

                // Log, notify, and set the parent space computed value
                setSpaceValue(parentSpace.Id, spaceAvailFresh, alert);

                // Set up notifications for this alert
                parentSpace.Notify(JSON.stringify(alert));
            }
            else {
                log(`${noAlert}. Carbon Dioxide: ${carbonDioxideValue}. Temperature: ${temperatureValue}. Presence: ${presence}.`);
    
                // Log, notify, and set the parent space computed value
                setSpaceValue(parentSpace.Id, spaceAvailFresh, noAlert);
            }
        ```
        
        The modified UDF will look for a condition where a room becomes available and has the carbon dioxide and temperature within tolerable limits. It will generate a notification with the statement `parentSpace.Notify(JSON.stringify(alert));` when this condition is met. It will set the value of the monitored space regardless of whether the condition is met, with the corresponding message.
    
    g. Save the file. 
    
1. Open a command window, and go to the folder **occupancy-quickstart\src**. Run the following command to provision your spatial intelligence graph and user-defined function: 

    ```cmd/sh
    dotnet run ProvisionSample
    ```

   > [!IMPORTANT]
   > To prevent unauthorized access to your Digital Twins management API, the **_occupancy-quickstart_** application requires you to sign in with your Azure account credentials. It saves your credentials for a brief period, so you might not need to sign in every time you run it. For the first time this program runs, and when your saved credentials expire after that, the application directs you to a sign-in page and gives a session-specific code to enter on that page. Follow the prompts to sign in with your Azure account.


1. After your account is authenticated, the application starts creating a sample spatial graph as configured in provisionSample.yaml. Wait until the provisioning finishes. It will take a few minutes. After that, observe the messages in the command window and notice how your spatial graph is created. Notice how the application creates an IoT hub at the root node or the `Venue`. 

1. From the output in the command window, copy the value of `ConnectionString`, under the `Devices` section, to your clipboard. You'll need this value to simulate the device connection in the next section.

    ![Provision sample](./media/tutorial-facilities-udf/run-provision-sample.png)

> [!TIP]
> If you get an error message similar to "The I/O operation has been aborted because of either a thread exit or an application request" in the middle of the provisioning, try running the command again. This might happen if the HTTP client timed out from a network issue.

<a id="simulate" />

## Simulate sensor data
In this section, you will use the project named *device-connectivity* in the sample, to simulate sensor data for detecting motion, temperature, and carbon dioxide. This project generates random values for the sensors, and sends them to the IoT hub by using the device connection string.

1. In a separate command window, navigate to the Digital Twins sample, and then to the **_device-connectivity_** folder.

1. Run this command to make sure the dependencies for the project are correct:

    ```cmd/sh
    dotnet restore
    ```

1. Open the *appSettings.json* file in your editor, edit the following values:
    1. *DeviceConnectionString*: Assign the value of `ConnectionString` in the output window from the previous section. Make sure to copy this string completely, within the quotes, for the simulator to connect properly with the IoT hub.

    1. *HardwareId* within the *Sensors* array: Since you are simulating events from sensors provisioned to your Digital Twins instance, the hardware ID and the names of the sensors in this file should match with `sensors` node of the *provisionSample.yaml* file. Add a new entry for the temperature sensor; the **Sensors** node in the *appSettings.json* should look like the following:

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

1. Run this command to start simulating device events for temperature, motion, and carbon dioxide:

    ```cmd/sh
    dotnet run
    ```

   > [!NOTE] 
   > Since the simulation sample does not directly communicate with your Digital Twin instance, it does not require you to authenticate.

## Get results of user-defined function
The user-defined function runs every time your instance receives device and sensor data. This section queries your Digital Twins instance to get the results of the user-defined function. You will see in near real time, when a room is available, the air is fresh and temperature is right. 

1. Open the command window you used to provision the sample, or a new command window, and navigate to the **_occupancy-quickstart\src_** folder of the sample again. 

1. Run the following command and sign in when prompted:

    ```cmd/sh
    dotnet run GetAvailableAndFreshSpaces
    ```

The output window will show how the user-defined function executes, and intercepts events from the device simulation. 

   ![Execute UDF](./media/tutorial-facilities-udf/udf-running.png)

Depending on whether the monitored condition is met, user-defined function sets the value of space with the relevant message as we saw in [the section above](#udf), which the `GetAvailableAndFreshSpaces` function prints out on the console. 

## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select your Digital Twins resource group, and **Delete** it.
2. If you need to, you may proceed to delete the sample applications on your work machine as well. 


## Next steps

Now that you have provisioned your spaces and created a framework to trigger custom notifications, you can proceed to any of the following tutorials. 

> [!div class="nextstepaction"]
> [Tutorial: Receive notifications from your Azure Digital Twins spaces using Logic Apps](tutorial-facilities-events.md)

Or,

> [!div class="nextstepaction"]
> [Tutorial: Visualize and analyze events from your Azure Digital Twins spaces using Time Series Insights](tutorial-facilities-analyze.md)
