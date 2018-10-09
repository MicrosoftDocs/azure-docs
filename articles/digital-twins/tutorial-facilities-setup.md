---
title: Provision Azure Digital Twins (.NET) | Microsoft Docs
description: Learn how to deploy and provision your instance of Azure Digital Twins using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 10/04/2018
ms.author: dkshir
#Customer intent: As an Azure IoT developer, I want to walk through a sample application to learn how to use the features of Digital Twins to create an intelligent IoT solution. 
---

# Tutorial: Deploy Azure Digital Twins and configure a spatial graph

Azure Digital Twins service allows you to bring together people, places and devices in a coherent spatial system. This series of tutorials demonstrate how to use Azure Digital Twins to detect room occupancy with optimal conditions of temperature and air quality. These tutorials will walk you through a scenario of an office building, containing multiple floors and rooms within each floor. The rooms contain devices, with attached sensors that detect motion, ambient temperature and air quality. You will learn how to replicate the physical areas and entities in the building as digital objects using the Digital Twins service. You will also learn how to monitor these physical areas and entities in near real-time. As an office manager, you can then use this information to help an employee working in this building to book meeting rooms with optimal conditions for more productive meetings.

In the first tutorial of this series, you learn how to:

> [!div class="checklist"]
> * Deploy Digital Twins
> * Set permissions for your app
> * Modify Digital Twins sample app
> * Provision your building

If you don’t have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

Note that these tutorials use the same sample as the [Quickstart to find available rooms and monitor air quality](quickstart-view-occupancy-dotnet.md), to give you a more detailed and in-depth coverage of the concepts. If you have kept all your Digital Twins resources from the Quickstart intact and simply wish to learn what more you can do with that setup, you may proceed to the [Tutorial to receive notifications from your Azure Digital Twins setup](tutorial-facilities-events.md) to learn how to create notifications from your setup. If you haven't yet provisioned your Digital Twins spatial graph, then start with this tutorial to provision as well as modify a sample graph. 

## Prerequisites

Install [.NET Core 2.1 or above SDK](https://www.microsoft.com/net/download) on your development machine.

<a id="deploy" />

## Deploy Digital Twins

Use the steps in this section to create a new instance of the Digital Twins service. 

[!INCLUDE [create-digital-twins-portal](../../includes/create-digital-twins-portal.md)]


<a id="permissions" />

## Set permissions for your app

Digital Twins uses [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) to control [read/write access](../active-directory/develop/v1-permissions-and-consent.md) to the service. Use the steps in this section to allow your sample application to connect with your Digital Twins instance. 

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]


## Modify Digital Twins sample app

### Download the sample
1. Download the [Digital Twins .Net sample app](https://github.com/Azure-Samples/digital-twins-samples-csharp/archive/master.zip). 
2. Extract the contents of the ZIP folder on your machine. 

### Explore the sample
The sample allows you to configure and provision a [spatial intelligence graph](concepts-objectmodel-spatialgraph.md#graph), as the digital equivalent of your physical spaces, devices, and other objects within those spaces. It uses an [object model](concepts-objectmodel-spatialgraph.md#model) which defines objects for a smart building. For a complete list of Digital Twins objects and REST APIs, visit [this REST API documentation](https://docs.westcentralus.azuresmartspaces.net/management/swagger) or the **Management API** URL that was created for [your instance](#deploy).

The *occupancy-quickstart/src* folder contains the code to provision and communicate with your Digital Twins instance. The following sub-folders divide this work flow:
- *models*: The code in this folder replicates the Digital Twins object model for a smart building. 
- *api*: This folder contains wrapper functions for the Digital Twins REST API calls.
- *actions*: The code in this folder performs advanced tasks using the Digital Twins REST APIs, for example:
    - the *provisionSample.cs* file shows how to provision your spatial graph,
    - the *getSpaces.cs* file gets information about the provisioned spaces,
    - the *getAvailableAndFreshSpaces.cs* gets the results of a custom function called user-defined function, and
    - the *createEndpoints.cs* creates endpoints to interact with other services.


> [!IMPORTANT]
> To prevent unauthorized access to your Digital Twins management API, the sample requires you to sign in with your Azure account credentials every time you run it. It will direct you to a Sign-in page, and give a session-specific code to enter on that page. Follow the prompts to sign in with your Azure account.


### Configure the sample
1. Open a command window, and navigate to the downloaded sample. Run the following command:
```cmd/sh
cd occupancy-quickstart/src
```
1. Restore dependencies to the sample project by running this command:
```cmd/sh
dotnet restore
```
1. In the same folder, open the *appSettings.json* file, and update the following values:
    1. *ClientId*: Enter the **Application ID** of your AAD app registration, noted in the section to [set app permissions](#permissions).
    1. *Tenant*: Enter the **Directory ID** of your [AAD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant), also noted in the section to [set app permissions](#permissions).
    1. *BaseUrl*: Enter the URL of your Digital Twins instance. To get this URL, modify the **Management API** URL from [the section to create your instance](#deploy) to have this format, **https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/api/v1.0/**. Or replace the placeholders in this URL with values for your instance.
2. See a list of Digital Twins features that you can explore using the sample, by running the following command. Follow the prompts to sign in with your Azure account.
```cmd/sh
dotnet run
```

<a id="provision-spaces" />

## Provision your building
This section shows how to provision a spatial graph for a sample building, using the sample we downloaded in the previous section. 

Navigate to the *src\actions* folder in the sample. Open the file *provisionSample.cs* in an editor and note the following function.

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
This function uses the *provisionSample.yaml* in the same folder to provision a spatial graph of an office building. Open this *yaml* file in your editor, and note the hierarchy of the *Venue*, *Floor*, *Area*, and the *Rooms*. Any of these physical spaces can contain *devices* and *sensors*. Each entry is of a predefined `type`, which is a Digital Twin object, for example, *Floor*, *Room*. 

The sample *yaml* file demonstrates a spatial graph using the default Digital Twins object model, which is sufficient for a building. A spatial graph for a different type of space, like a factory or a mine, will use a different set of objects that are more relevant. The Digital Twins service provides a few predefined sets of objects: `Required`, `Default`, `BACnet`, and `Advanced`. In addition to the `Required` set of objects, your configuration may use any one of the others. The `Default` set provides generic names for most types (for example, Temperature for SensorDataType, Map for SpaceBlobType), and space types (for example, Room with subtypes FocusRoom, ConferenceRoom, and so on). You can see which sets are loaded or available by running the command `dotnet run GetOntologies` in the command line for the sample. For more details on spatial graphs and the object model that builds it, read [Understanding Digital Twins Object Model and Spatial Intelligence Graph](concepts-objectmodel-spatialgraph.md). 

### Configure your spatial intelligence graph
The *provisionSample.yaml* contains the following nodes:

- **resources**: The `resources` node creates an IoT Hub resource to communicate with the devices in your setup. You should create an IoT hub at the root node of your graph, so that all the devices and sensors in that hierarchy can send telemetry to the same IoT hub.  

- **spaces**: In the Digital Twins object model, `spaces` represent the physical locations. Each space has a `Type`, e.g. *Region*, *Venue*, or a *Customer*, and a friendly `Name`. Spaces can belong to other spaces creating a hierarchical structure. The *provisionSample.yaml* has a spatial graph of an imaginary building. Note the logical nesting of spaces of type `Floor` within the `Venue`, `Area` in a floor, and `Room` nodes in an area. 

- **devices**: Spaces can contain `devices`, which are physical or virtual entities that manage a number of sensors. For example, a device could be a user’s phone, a Raspberry Pi sensor pod, a gateway, etc. In the imaginary building in your sample, note how the room named *Focus Room* contains a *Raspberry Pi 3 A1* device. Each device node is identified by a unique `hardwareId`, which is hardcoded in the sample. To configure this sample for an actual production, replace these with corresponding IDs from your setup.  

- **sensors**: A device can contain multiple `sensors`, which can detect and record physical changes like temperature, motion, battery level, etc. Each sensor node is uniquely identified by a `hardwareId`, hardcoded here. In an actual application, these should be replaced by the unique identifiers of the sensors in that setup. Note that the *provisionSample.yaml* file has two devices to record *Motion* and *CarbonDioxide*. Add another sensor to record *Temperature*, by adding the following lines, below the lines for the CarbonDioxide sensor:
```yaml
        - dataType: Temperature
          hardwareId: SAMPLE_SENSOR_TEMPERATURE
```

Save and close the *provisionSample.yaml* file. In the next tutorial, you will add more information to this file, and then complete the provisioning of your Azure Digital Twins sample building.


## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select and **Delete** your Digital Twins resource group.
2. If you need to, you may proceed to delete the sample application on your work machine as well. 


## Next steps

Proceed to the next tutorial in the series to learn how to implement a custom logic to monitor conditions in your sample building. 
> [!div class="nextstepaction"]
> [Tutorial: Monitor working conditions in your building](tutorial-facilities-udf.md)

