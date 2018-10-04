---
title: Provision your Azure Digital Twins (.NET) setup | Microsoft Docs
description: Learn how to deploy and provision your instance of Azure Digital Twins using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 08/30/2018
ms.author: dkshir
---

# Tutorial: Set up and provision Azure Digital Twins 

Azure Digital Twins service allows you to bring together people, places and devices in a coherant spatial system. This series of tutorials demonstrate how to use the Digital Twins to detect room occupancy with optimal conditions of temperature and air quality. This will walk you through a scenario of a sample building, containing multiple floors and rooms within each floor. The rooms contain devices with sensors to detect motion, ambient temperature and air quality in the form of carbon dioxide. This series will show you how to represent the rooms in the building to the Digital Twins service, as well as how to connect the sensors to this service, so you can monitor the data coming in near real-time. As a facilities administrator, you can use this information to book meeting rooms with optimal conditions. 

In the first tutorial of this series, you learn how to:

> [!div class="checklist"]
> * Deploy your Digital Twins instance
> * Permit your application to connect to Digital Twins
> * Download and explore the Digital Twins sample
> * Provision your spaces and devices

If you don’t have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

- [.NET Core SDK](https://www.microsoft.com/net/download) should be installed on your development machine.


## Deploy your Digital Twins instance

Use the steps in this section to create a new instance of the Digital Twins service. 

[!INCLUDE [create-digital-twins-portal](../../includes/create-digital-twins-portal.md)]


## Permit your application to connect to Digital Twins

Digital Twins uses [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis) to control access to the service. Grant access rights to your application using the steps in this section.

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]


## Download and explore the Digital Twins sample

### Download the sample
[Download or clone the Digital Twins .Net sample app](https://github.com/Azure-Samples/digital-twins-samples-csharp) from Github. To clone the sample using a Git client, run the following command: 
```cmd/sh
git clone https://github.com/Azure-Samples/digital-twins-samples-csharp.git
``` 

### Explore the sample
The sample allows you to configure and provision a spatial intelligence graph. Take your time to explore the contents of the *src* folder. It contains the following:
- *models*: Explore the code in this folder. This replicates the object model used by the Digital Twins, for spaces and other resources. 
- *api*: This folder contains wrapper functions for Digital Twins REST APIs. This is not a complete library. For a complete list of features, visit the swagger URL created for your Digital Twins instance which has this format: `yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/swagger`.
- *actions*: The code in this folder performs advanced tasks using the Digital Twins REST APIs, for example:
    - provision your spatial graph using the *provisionSample.cs*, and
    - get information about the provisioned spaces using the *getSpaces.cs*. 

### Configure the sample
1. Open a command window, and navigate to the *digital-twins-samples-csharp-master/occupancy-quickstart/src* in the downloaded sample folder.
2. Run `dotnet restore` to restore dependencies to the sample project.
3. In the same folder, open the *appSettings.json* file, and update the following values:
    a. *ClientId*: Enter the *Application ID* of your AAD app registration, noted in the preceding section.
    b. *Tenant*: Enter the *Directory Id* of your [AAD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant), also noted in the previous section.
    c. *BaseUrl*: The *Management API* URL of your Digital Twins instance, which will be in the following format, `https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/api/v1.0/`.
4. Run `dotnet run` to see a list of Digital Twins features that you can explore using the sample.

## Provision your spaces and devices
This section shows how to provision a spatial graph for a sample building, using the sample we downloaded in the previous section.

- Navigate to the *src\actions* folder in the .Net sample. Open the file *provisionSample.cs* in an editor and note the following function.

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
This function uses the *provisionSample.yaml* in the same folder to start provisioning a spatial graph. 

- Open the file *provisionSample.yaml* in your editor. Note the hierarchy of rooms, sensors and devices in a fictitious building. Each of the entry is of a predefined `type` or a Digital Twin object, for example, *Venue*, *Floor*, *Area*, *Room*. A spatial intelligence graph for a particular *space* is built using the  objects relevant to that space. For a building, the objects or types used in the provisionSample.yaml will be sufficient. A spatial graph for another type of space, for example, a factory or a mine, will use a different set of objects that is more relevant. For more detailed information on spatial graphs and the object model that builds it, read [Understanding Digital Twins Object Model and Spatial Intelligence Graph](concepts-objectmodel-spatialgraph.md).

- The *provisionSample.yaml* contains an easy-to-visualize sample spatial graph. 
    - The `resources` node lets you create an IoT hub to communicate with the devices in your setup. You would typically create an IoT Hub resource at the root node of your graph, which here is `Venue` type. 
    - Since this graph is relevant to a building, notice the logical nesting of spaces of type `Floor` within the `Venue`, `Area` in a floor, and `Room` in an area. 
    - Some of the spaces will contain *devices* and *sensors*. For example in a room named *FocusRoom*, note the addition of objects of type `devices`, which are identified by a unique `hardwareId`, and devices containing `sensors` that detect physical changes like temperature or motion. 
    - Try adding more spaces, devices and sensors at any level in this graph to get a better idea of how the graph might work.


## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select and **Delete** your Digital Twins resource group.
2. If you need to, you may proceed to delete the sample application on your work machine as well. 


## Next steps

Proceed to the next tutorial in the series to learn how to create customized code or User-Defined Functions to monitor conditions in your sample building. 
> [!div class="nextstepaction"]
> [Next steps button](tutorial-facilities-udf.md)

