---
title: Deploy Azure Digital Twins | Microsoft Docs
description: Learn how to deploy your instance of Azure Digital Twins and configure your spatial resources using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 10/15/2018
ms.author: dkshir
#Customer intent: As an Azure IoT developer, I want to walk through a sample application to learn how to use the features of Digital Twins to create a spatially aware intelligent IoT solution. 
---

# Tutorial: Deploy Azure Digital Twins and configure a spatial graph

The Azure Digital Twins service allows you to bring together people, places, and devices in a coherent spatial system. This series of tutorials demonstrate how to use Azure Digital Twins to detect room occupancy with optimal conditions of temperature and air quality. These tutorials will walk you through a .NET console application to build a scenario of an office building, containing multiple floors, and rooms within each floor. The rooms contain devices, with attached sensors that detect motion, ambient temperature, and air quality. You will learn how to replicate the physical areas and entities in the building as digital objects using the Digital Twins service. You will simulate device events using another console application. You will then learn how to monitor the events coming from these physical areas and entities in near real time. An office administrator can use this information to help an employee working in this building to book meeting rooms with optimal conditions. An office facilities manager can use your setup to find out usage trends of the rooms, as well as monitor working conditions for maintenance purposes.

In the first tutorial of this series, you learn how to:

> [!div class="checklist"]
> * Deploy Digital Twins
> * Grant permissions to your app
> * Modify Digital Twins sample app
> * Provision your building


These tutorials use and modify the same samples that the [quickstart to find available rooms](quickstart-view-occupancy-dotnet.md) uses, for a more detailed and in-depth coverage of the concepts.


## Prerequisites

- An Azure subscription. If you don’t have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The Digital Twins samples used in these tutorials are written in C#. Make sure to install [.NET Core SDK version 2.1.403 or above](https://www.microsoft.com/net/download) on your development machine to build and run the sample. Check if the right version is installed on your machine by running `dotnet --version` in a command window.

- [Visual Studio Code](https://code.visualstudio.com/) to explore the sample code. 

<a id="deploy" />

## Deploy Digital Twins

Use the steps in this section to create a new instance of the Digital Twins service. Only one instance can be created per subscription; skip to the next section if you already have one running. 

[!INCLUDE [create-digital-twins-portal](../../includes/create-digital-twins-portal.md)]


<a id="permissions" />

## Grant permissions to your app

Digital Twins uses [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) to control [read/write access](../active-directory/develop/v1-permissions-and-consent.md) to the service. Any application that needs to connect with your Digital Twins instance, must be registered with Azure Active Directory. The steps in this section show how to register your sample app.

If you already have an *app registration*, you can reuse it for your sample. However, browse through this section to make sure your app registration is configured correctly.

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]


## Configure Digital Twins sample

This section walks you through a Digital Twins application that communicates with the [Digital Twins REST APIs](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index). 

### Download the sample
If you already have the samples downloaded for the [quickstart to find available rooms](quickstart-view-occupancy-dotnet.md), you can skip these steps.

1. Download the [Digital Twins .Net samples](https://github.com/Azure-Samples/digital-twins-samples-csharp/archive/master.zip). 
2. Extract the contents of the ZIP folder on your machine. 

### Explore the sample
In the extracted sample folder, open the file **_digital-twins-samples-csharp\digital-twins-samples.code-workspace_** in Visual Studio Code. It contains two projects: 

1. The provisioning sample **_occupancy-quickstart_** allows you to configure and provision a [spatial intelligence graph](concepts-objectmodel-spatialgraph.md#graph), which is the digitized image of your physical spaces, and the resources contained in them. It uses an [object model](concepts-objectmodel-spatialgraph.md#model) which defines objects for a smart building. For a complete list of Digital Twins objects and REST APIs, visit [this REST API documentation](https://docs.westcentralus.azuresmartspaces.net/management/swagger) or the **Management API** URL that was created for [your instance](#deploy).

   To explore the sample to see how it communicates with your Digital Twins instance, you can start with the **_src\actions_** folder. The files in this folder implement the commands that you will use in these tutorials:
    - the *provisionSample.cs* file shows how to provision your spatial graph,
    - the *getSpaces.cs* file gets information about the provisioned spaces,
    - the *getAvailableAndFreshSpaces.cs* gets the results of a custom function called user-defined function, and
    - the *createEndpoints.cs* creates endpoints to interact with other services.

1. The simulation sample **_device-connectivity_** simulates sensor data and sends it to the IoT hub provisioned for your Digital Twin instance. You will use this sample in [the next tutorial after you have provisioned your spatial graph](tutorial-facilities-udf.md#simulate). The sensor and device identifiers used to configure this sample should be the same as what you will use to provision your graph.

### Configure the provisioning sample
1. Open a command window, and navigate to the downloaded sample. Run the following command:

    ```cmd/sh
    cd occupancy-quickstart/src
    ```

1. Restore dependencies to the sample project by running this command:

    ```cmd/sh
    dotnet restore
    ```

1. In Visual Studio Code, open the **_appSettings.json_** file belonging to the **occupancy-quickstart** project, and update the following values:
    1. *ClientId*: Enter the **Application ID** of your AAD app registration, noted in the section to [set app permissions](#permissions).
    1. *Tenant*: Enter the **Directory ID** of your [AAD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant), also noted in the section to [set app permissions](#permissions).
    1. *BaseUrl*: Enter the URL of your Digital Twins instance. To get this URL, replace the placeholders in this URL with values for your instance: **https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/api/v1.0/**. You can also get this URL by modifying the **Management API** URL from [the deployment section](#deploy), replacing the **swagger/** with **api/v1.0/**.

1. See a list of Digital Twins features that you can explore using the sample, by running the following command.

    ```cmd/sh
    dotnet run
    ```

<a id="provision-spaces" />

## Understand provisioning process
This section shows how the sample provisions a spatial graph of a building. 

In Visual Studio Code, navigate to the **_occupancy-quickstart\src\actions_** folder and open the file *provisionSample.cs*. Note the following function:

```csharp
public static async Task<IEnumerable<ProvisionResults.Space>> ProvisionSample(HttpClient httpClient, ILogger logger)
{
    IEnumerable<SpaceDescription> spaceCreateDescriptions;
    using (var r = new StreamReader("actions/provisionSample.yaml"))
    {
        spaceCreateDescriptions = await GetProvisionSampleTopology(r);
    }

    var results = await CreateSpaces(httpClient, logger, spaceCreateDescriptions, Guid.Empty);

    Console.WriteLine($"Completed Provisioning: {JsonConvert.SerializeObject(results, Formatting.Indented)}");

    return results;
}

```

This function uses the *provisionSample.yaml* in the same folder. Open this file, and note the hierarchy of an office building: the *Venue*, *Floor*, *Area*, and the *Rooms*. Any of these physical spaces can contain *devices* and *sensors*. Each entry has a predefined `type`, for example, *Floor*, *Room*. 

The sample *yaml* file shows a spatial graph using the `Default` Digital Twins object model. This model provides generic names for most types (for example, Temperature for SensorDataType, Map for SpaceBlobType), and space types (for example, Room with subtypes FocusRoom, ConferenceRoom, and so on), which is sufficient for a building. If you had to create a spatial graph for a different type venue, such as a factory, you might need a different object model. You can find out which models are available to use by running the command `dotnet run GetOntologies` in the command line for the provisioning sample. For more details on spatial graphs and the object models, read [Understanding Digital Twins object model and spatial intelligence graph](concepts-objectmodel-spatialgraph.md). 

### Modify sample spatial graph
The *provisionSample.yaml* contains the following nodes:

- **resources**: The `resources` node creates an IoT Hub resource to communicate with the devices in your setup. An IoT hub at the root node of your graph, can communicate with all the devices and sensors in your graph.  

- **spaces**: In the Digital Twins object model, `spaces` represent the physical locations. Each space has a `Type`, for example, *Region*, *Venue*, or a *Customer*, and a friendly `Name`. Spaces can belong to other spaces creating a hierarchical structure. The *provisionSample.yaml* has a spatial graph of an imaginary building. Note the logical nesting of spaces of type `Floor` within the `Venue`, `Area` in a floor, and `Room` nodes in an area. 

- **devices**: Spaces can contain `devices`, which are physical or virtual entities that manage a number of sensors. For example, a device could be a user’s phone, a Raspberry Pi sensor pod, a gateway, etc. In the imaginary building in your sample, note how the room named *Focus Room* contains a *Raspberry Pi 3 A1* device. Each device node is identified by a unique `hardwareId`, which is hardcoded in the sample. To configure this sample for an actual production, replace these with values from your setup.  

- **sensors**: A device can contain multiple `sensors`, which can detect and record physical changes like temperature, motion, battery level, etc. Each sensor node is uniquely identified by a `hardwareId`, hardcoded here. For an actual application, replace these by the unique identifiers of the sensors in your setup. The *provisionSample.yaml* file has two sensors to record *Motion* and *CarbonDioxide*. Add another sensor to record *Temperature*, by adding the following lines, below the lines for the CarbonDioxide sensor:

    ```yaml
            - dataType: Temperature
              hardwareId: SAMPLE_SENSOR_TEMPERATURE
    ```
    > [!NOTE]
    > Make sure the alignment of the `dataType` and `hardwareId` keys align with the statements above this snippet. Also make sure that your editor does not replace spaces with tabs. 

Save and close the *provisionSample.yaml* file. In the next tutorial, you will add more information to this file, and then provision your Azure Digital Twins sample building.


## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select your Digital Twins resource group, and **Delete** it.
2. If you need to, you may proceed to delete the sample application on your work machine as well. 


## Next steps

Proceed to the next tutorial in the series to learn how to implement a custom logic to monitor conditions in your sample building. 
> [!div class="nextstepaction"]
> [Tutorial: Provision your building and monitor working conditions](tutorial-facilities-udf.md)

