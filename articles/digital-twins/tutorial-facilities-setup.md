---
title: 'Tutorial: Deploy Azure Digital Twins | Microsoft Docs'
description: Learn how to deploy your instance of Azure Digital Twins and configure your spatial resources by using the steps in this tutorial.
services: digital-twins
author: alinamstanciu
ms.custom: seodec18
ms.service: digital-twins
ms.topic: tutorial 
ms.date: 06/26/2019
ms.author: alinast
#Customer intent: As an Azure IoT developer, I want to walk through a sample application to learn how to use the features of Digital Twins to create a spatially aware intelligent IoT solution. 
---

# Tutorial: Deploy Azure Digital Twins Preview and configure a spatial graph

You can use the Azure Digital Twins Preview service to bring together people, places, and devices in a coherent spatial system. This series of tutorials demonstrates how to use Azure Digital Twins to detect room occupancy with optimal conditions of temperature and air quality. 

These tutorials will walk you through a .NET console application to build a scenario of an office building. The building has multiple floors and rooms within each floor. The rooms contain devices with attached sensors that detect motion, ambient temperature, and air quality. 

You'll learn how to replicate the physical areas and entities in the building as digital objects by using the Azure Digital Twins service. You'll simulate device events by using another console application. Then, you'll learn how to monitor the events that come from these physical areas and entities in near real time. 

An office administrator can use this information to help an employee working in this building to book meeting rooms with optimal conditions. An office facilities manager can use your setup to get usage trends of the rooms, and to monitor working conditions for maintenance purposes.

In the first tutorial of this series, you learn how to:

> [!div class="checklist"]
> * Deploy Digital Twins.
> * Grant permissions to your app.
> * Modify a Digital Twins sample app.
> * Provision your building.

These tutorials use and modify the same samples that the [quickstart to find available rooms](quickstart-view-occupancy-dotnet.md) uses, for a more detailed and in-depth coverage of the concepts.

## Prerequisites

- An Azure subscription. If you don’t have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The .NET Core SDK. The Azure Digital Twins samples used in these tutorials are written in C#. Make sure to install [.NET Core SDK version 2.1.403 or later](https://www.microsoft.com/net/download) on your development machine to build and run the sample. Check that the right version is installed on your machine by running `dotnet --version` in a command window.

- [Visual Studio Code](https://code.visualstudio.com/) to explore the sample code. 

<a id="deploy"></a>

## Deploy Digital Twins

Use the steps in this section to create a new instance of the Azure Digital Twins service. Only one instance can be created per subscription. Skip to the next section if you already have one running. 

[!INCLUDE [create-digital-twins-portal](../../includes/digital-twins-create-portal.md)]

<a id="permissions"></a>

## Grant permissions to your app

Digital Twins uses [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) to control [read/write access](../active-directory/develop/v1-permissions-and-consent.md) to the service. Any application that needs to connect with your Digital Twins instance must be registered with Azure AD. The steps in this section show how to register your sample app.

If you already have an app registration, you can reuse it for your sample. However, browse through this section to make sure your app registration is configured correctly.

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]

## Configure the Digital Twins sample

This section walks you through an Azure Digital Twins application that communicates with the [Digital Twins REST APIs](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index). 

### Download the sample

If you already have the samples downloaded for the [quickstart to find available rooms](quickstart-view-occupancy-dotnet.md), you can skip these steps.

1. Download the [Digital Twins .NET samples](https://github.com/Azure-Samples/digital-twins-samples-csharp/archive/master.zip).
2. Extract the contents of the zip folder on your machine.

### Explore the sample

In the extracted sample folder, open the file **digital-twins-samples-csharp\digital-twins-samples.code-workspace** in Visual Studio Code. It contains two projects:

* You can use the provisioning sample **occupancy-quickstart** to configure and provision a [spatial intelligence graph](concepts-objectmodel-spatialgraph.md#graph). This graph is the digitized image of your physical spaces and the resources in them. It uses an [object model](concepts-objectmodel-spatialgraph.md#model), which defines objects for a smart building. For a complete list of Digital Twins objects and REST APIs, visit [this REST API documentation](https://docs.westcentralus.azuresmartspaces.net/management/swagger) or the Management API URL that was created for [your instance](#deploy).

   To explore the sample to see how it communicates with your Digital Twins instance, you can start with the **src\actions** folder. The files in this folder implement the commands that you'll use in these tutorials:
    - The **provisionSample.cs** file shows how to provision your spatial graph.
    - The **getSpaces.cs** file gets information about the provisioned spaces.
    - The **getAvailableAndFreshSpaces.cs** file gets the results of a custom function called a user-defined function.
    - The **createEndpoints.cs** file creates endpoints to interact with other services.

* The simulation sample **device-connectivity** simulates sensor data and sends it to the IoT hub that's provisioned for your Digital Twins instance. You'll use this sample in [the next tutorial after you provision your spatial graph](tutorial-facilities-udf.md#simulate). The sensor and device identifiers that you use to configure this sample should be the same as what you'll use to provision your graph.

### Configure the provisioning sample

1. Open a command window and go to the downloaded sample. Run the following command:

    ```cmd/sh
    cd occupancy-quickstart/src
    ```

1. Restore dependencies to the sample project by running this command:

    ```cmd/sh
    dotnet restore
    ```

1. In Visual Studio Code, open the [appSettings.json](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/appSettings.json) file in the **occupancy-quickstart** project. Update the following values:
   * **ClientId**: Enter the application ID of your Azure AD app registration. You noted this ID in the section where you [set app permissions](#permissions).
   * **Tenant**: Enter the directory ID of your [Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant). You also noted this ID in the section where you [set app permissions](#permissions).
   * **BaseUrl**: Enter the URL of your Digital Twins instance. To get this URL, replace the placeholders in this URL with values for your instance: `https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/api/v1.0/`. You can also get this URL by modifying the Management API URL from [the deployment section](#deploy). Replace **swagger/** with **api/v1.0/**.

1. See a list of Digital Twins features that you can explore by using the sample. Run the following command:

    ```cmd/sh
    dotnet run
    ```

<a id="provision-spaces"></a>

## Understand the provisioning process

This section shows how the sample provisions a spatial graph of a building.

In Visual Studio Code, browse to the **occupancy-quickstart\src\actions** folder and open the file **provisionSample.cs**. Note the following function:

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

This function uses [provisionSample.yaml](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/provisionSample.yaml) in the same folder. Open this file, and note the hierarchy of an office building: *Venue*, *Floor*, *Area*, and *Rooms*. Any of these physical spaces can contain *devices* and *sensors*. Each entry has a predefined `type`&mdash;for example, Floor, Room.

The sample **yaml** file shows a spatial graph that uses the `Default` Digital Twins object model. This model provides generic names for most types. Generic names are sufficient for a building. Examples are Temperature for SensorDataType, and Map for SpaceBlobType. An example space type is Room with subtypes FocusRoom, ConferenceRoom, and so on. 

If you had to create a spatial graph for a different type venue, such as a factory, you might need a different object model. You can find out which models are available to use by running the command `dotnet run GetOntologies` on the command line for the provisioning sample. 

For more information on spatial graphs and object models, read [Understanding Digital Twins object models and spatial intelligence graph](concepts-objectmodel-spatialgraph.md).

### Modify the sample spatial graph

The **provisionSample.yaml** file contains the following nodes:

- **resources**: The `resources` node creates an Azure IoT Hub resource to communicate with the devices in your setup. An IoT hub at the root node of your graph can communicate with all the devices and sensors in your graph.  

- **spaces**: In the Digital Twins object model, `spaces` represent the physical locations. Each space has a `Type`&mdash;for example, Region, Venue, or Customer&mdash;and a friendly `Name`. Spaces can belong to other spaces, creating a hierarchical structure. The provisionSample.yaml file has a spatial graph of an imaginary building. Note the logical nesting of spaces of type `Floor` within `Venue`, `Area` in a floor, and `Room` nodes in an area. 

- **devices**: Spaces can contain `devices`, which are physical or virtual entities that manage a number of sensors. For example, a device might be a user’s phone, a Raspberry Pi sensor pod, or a gateway. In the imaginary building in your sample, note how the room named **Focus Room** contains a **Raspberry Pi 3 A1** device. Each device node is identified by a unique `hardwareId`, which is hardcoded in the sample. To configure this sample for an actual production, replace these with values from your setup.  

- **sensors**: A device can contain multiple `sensors`. They can detect and record physical changes like temperature, motion, and battery level. Each sensor node is uniquely identified by a `hardwareId`, hardcoded here. For an actual application, replace these by using the unique identifiers of the sensors in your setup. The provisionSample.yaml file has two sensors to record *Motion* and *CarbonDioxide*. Add another sensor to record *Temperature*, by adding the following lines, below the lines for the CarbonDioxide sensor. Note that these are provided in provisionSample.yaml as commented-out lines. You can uncomment them by removing the `#` character in the front of each line. 

    ```yaml
            - dataType: Temperature
              hardwareId: SAMPLE_SENSOR_TEMPERATURE
    ```
    > [!NOTE]
    > Make sure the `dataType` and `hardwareId` keys align with the statements above this snippet. Also make sure that your editor does not replace spaces with tabs. 

Save and close the provisionSample.yaml file. In the next tutorial, you'll add more information to this file, and then provision your Azure Digital Twins sample building.

> [!TIP]
> You can view and modify your spatial graph using the [Azure Digital Twins Graph Viewer](https://github.com/Azure/azure-digital-twins-graph-viewer).

## Clean up resources

If you want to stop exploring Azure Digital Twins at this point, feel free to delete resources created in this tutorial:

1. From the left menu in the [Azure portal](https://portal.azure.com), select **All resources**, select your Digital Twins resource group, and select **Delete**.

    > [!TIP]
    > If you experienced trouble deleting your Digital Twins instance, a service update has been rolled out with the fix. Please retry deleting your instance.

1. If necessary, delete the sample application on your work machine.

## Next steps

To learn how to implement a custom logic to monitor conditions in your sample building, go to the next tutorial in the series: 
> [!div class="nextstepaction"]
> [Tutorial: Provision your building and monitor working conditions](tutorial-facilities-udf.md)
