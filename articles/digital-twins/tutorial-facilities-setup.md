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

Azure Digital Twins service allows you to bring together people, places and things in a coherant spatial system. This series of tutorials demonstrate how to use the Digital Twins to detect room occupancy with optimal conditions of temperature and air quality. This series shows you how to deploy Digital Twins using the portal[https://portal.azure.com], create a provisioning application using Digital Twins REST APIs in a .Net application, monitor the sensor coming from your devices and rooms, and create customized notifications on that data. This will walk you through a scenario where you have a sample building, with the hierarchy of floors, conference rooms and devices with sensors for temperature and air quality in these rooms. We will show you how to set notifications for room availability with optimal conditions. As a facilities administrator, you can use this information to book meeting rooms.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create your instance of Azure Digital Twins service
> * Grant permissions to an application to access your instance
> * Explore the .Net sample
> * Understand spatial object model
> * Provision your spaces and devices

If you don’t have an Azure, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

- [.NET Core SDK](https://www.microsoft.com/net/download) should be installed on your development machine.


## Create your instance of Azure Digital Twins service

Create a new instance of the Digital Twins in the [portal](https://portal.azure.com) using the steps in this section. 

[!INCLUDE [create-digital-twins-portal](../../includes/create-digital-twins-portal.md)]


## Grant permissions to an application to access your instance

Digital Twins uses [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis) to provide centralized access to the service. Use the steps in this section to grant access rights to your application.

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]


## Download and explore the Digital Twins sample

### Download the sample
[Download or clone the Digital Twins .Net sample app](https://github.com/Azure-Samples/digital-twins-samples-csharp) from Github. To clone the sample using a Git client, run the following command: 
```cmd/sh
git clone https://github.com/Azure-Samples/digital-twins-samples-csharp.git
``` 

### Explore the sample
The sample allows you to configure and provision a spatial topology. Explore the contents of the *src* folder to find the following:
- *models*: This folder replicates the object model used by the Digital Twins, for spaces and other resources. 
- *api*: This folder contains wrapper functions for Digital Twins REST APIs. This is not a complete library. For a complete list of features, visit the swagger URL created for your Digital Twins instance.
- *actions*: It provides an interface to the Digital Twins service to perform tasks like:
    - get information about the provisioned spaces using the *getSpaces.cs*, or 
    - provision your spatial graph using the *provisionSample.cs*.

### Configure the sample
1. In command window, navigate to the *digital-twins-samples-csharp-master\occupancy-quickstart\src* in the sample downloaded in the prerequisite section.
2. Run `dotnet restore` to restore dependencies to the sample project.
3. Open the *appSettings.json* file and update the following values:
    a. *ClientId*: Enter the AAD application id that you noted in the preceding section.
    b. *ClientSecret*: Enter the key that you generated in the preceding section.
    c. *Tenant*: Enter the *Directory Id* of your [AAD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant).
4. Run `dotnet run` to see a list of Digital Twins features that you can explore using the sample.

## Understand spatial object model
In this section, we will learn about the object model that the Digital Twins uses to define a spatial graph. 

## Provision your spaces and devices
In this section, we will learn how to provision a spatial graph for a Smart Building using the .Net sample we downloaded in the previous sections.

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

- Open the file *provisionSample.yaml* in your editor. Note the plan of rooms, sensors and devices in a fictitious building. Each of the entry is of a predefined `type` or a Digital Twin object, for example, *Venue*, *Floor*, *Area*, *Room*. A spatial intelligence graph for a particular *space* is built using the  objects relevant to that space. For example, for a regular building, the objects or types used in the provisionSample.yaml will be sufficient. For a spatial graph for another type of space, for example, a factory or a mine, a different set of objects make sense. For more detailed information on spatial graphs and the object model that builds it, read the [Understanding Digital Twins Object Model and Spatial Intelligence Graph](concepts-objectmodel-spatialgraph.md).

- The *provisionSample.yaml* contains an easy-to-visualize sample spatial graph. The `resources` node lets you create an IoT hub to communicate with the devices in your setup. You would typically create an IoT Hub resource at the root node of your graph, which here is `Venue` type. Since this graph is relevant to a Smart Building application, notice how objects of type `spaces` are nested within each other as logical nesting of `Floor`, `Area` in that floor, and a `Room` in that area. Some of the space objects can have subtypes relevant to a particular building. For a particular `space`, for example a conference room, you could add objects of type `devices`, which are identified by a unique `hardwareId`, and a device will have `sensors` to detect physical changes like temperature or motion. Try adding more spaces, devices and sensors at any level in this graph to better suit your sample scenario. For example, add a second conference room entry below the first one:
```yaml
   - name: Conference Room 2
      type: Room
      subType: ConferenceRoom
```

- Run `dotnet run ProvisionSample` at the command line to provision your spatial topology. Observe the messages in the command window and notice how your spatial graph gets created. Notice how it creates an IoT hub at the root node or the `Venue`. 


## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select and **Delete** your Digital Twins resource group.
2. If you need to, you may proceed to delete the sample applications on your work machine as well. 


## Next steps

Proceed to the next tutorial in the series to learn how to create customized code or User-Defined Functions to monitor conditions in your sample building. 
> [!div class="nextstepaction"]
> [Next steps button](tutorial-facilities-udf.md)

