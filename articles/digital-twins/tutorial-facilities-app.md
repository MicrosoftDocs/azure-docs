---
title: Set up Azure Digital Twins (.Net) | Microsoft Docs
description: Learn how to deploy and provision your instance of Azure Digital Twins using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 08/30/2018
ms.author: dkshir
---

# Tutorial: Set up Azure Digital Twins using portal and .Net application

Azure Digital Twins service allows you to bring together people, places and things in a coherant spatial system. This series of tutorials demonstrate how to use the Digital Twins to manage your facilities for efficient space utilization. This series shows you how to deploy Digital Twins using the portal[https://portal.azure.com], create a provisioning application using Digital Twins REST APIs in a .Net application, monitor the telemetry coming from your devices and rooms, and create customized analyses on the telemetry data. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create your instance of Azure Digital Twins service
> * Grant permissions to an application to access your instance
> * Explore the .Net sample
> * Provision your spaces and devices

If you don’t have an Azure, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

- Install [.NET Core SDK](https://www.microsoft.com/net/download) on your development machine.
- Download the Digital Twins .Net sample. Click **Clone or download** on the [sample page](https://github.com/Azure-Samples/digital-twins-samples-csharp), and then **Download ZIP** to a folder on your work machine. Extract the zip folder for use in the proceeding steps. 

## Create your instance of Azure Digital Twins service

Create a new instance of the Digital Twins in the [portal](https://portal.azure.com) using the steps in this section. 

[!INCLUDE [create-digital-twins-portal](../../includes/create-digital-twins-portal.md)]


## Grant permissions to an application to access your instance

Digital Twins uses [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis) to provide centralized access to the service. Use the steps in this section to grant access rights to your application.

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]


## Explore the .Net sample
Most of the following sections will be using the Digital Twins .Net sample that you downloaded in the prerequisites section. The sample allows you to configure and provision a spatial topology. Explore the contents of the *src* folder to find the following:
- *models*: This folder replicates the object model used by the Digital Twins, for spaces and other resources. 
- *api*: This folder contains wrapper functions for Digital Twins REST APIs. This is not a complete library. For a complete list of features, visit the swagger URL created for your Digital Twins instance.
- *actions*: It provides an interface to the Digital Twins service to perform tasks like:
    - get available spaces using the *getSpaces.cs*, or 
    - provision your spatial graph using the *provisionSample.cs*.

### Configure the sample
1. In command window, navigate to the *digital-twins-samples-csharp-master\occupancy-quickstart\src* in the sample downloaded in the prerequisite section.
2. Run `dotnet restore` to restore dependencies to the sample project.
3. Open the *appSettings.json* file and update the following values:
    a. *ClientId*: Enter the AAD application id that you noted in the preceding section.
    b. *ClientSecret*: Enter the key that you generated in the preceding section.
    c. *Tenant*: Enter the *Directory Id* of your [AAD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant).
4. Run `dotnet run` to see a list of Digital Twins features that you can explore using the sample.

## Understanding spatial object model
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

## Understand a User Defined Function
*User-defined functions* (or UDFs) allow you to customize the processing of telemetry data from your sensors. It  In this section, we will use the .Net sample used in the previous sections to understand how to create and configure a UDF. 

- In the *provisionSample.yaml* file, note the entries  of type `userdefinedfunctions`

## Simulate telemetry data
<!--TBD This should be in a proper app in Azure Samples -->
This section shows you how to simulate sensor data for detecting motion, temperature and carbon dioxide. It uses a sample .Net application that generates this data and sends it to your Digital Twins instance. It uses your work machine's MAC id to simulate as a unique device. 

1. Download the Azure-IoT-SSS-Samples-DeviceConnectivity sample <!--download link here-->
2. Generate SAS token for your simulated device. Using a REST client such as Postman, POST a REST call for `https://{{endpoint-management}}/api/v1.0/keystores` to the Digital Twins service with the following payload:
    ```
    {
    "Name": "Friendly name for your key store",
    "Description": "Description for your key store",
    "SpaceId": "<RootTenantId>"
    }
    ```
  Note the response GUID that you will get for this call. 
3. Create a key using the key store GUID that you received from the preceding step. POST a REST call for `https://{{endpoint-management}}/api/v1.0/keystores/<insert keystore GUID here>/keys`. Note down the response code you get for the key. 
4. Get the [SAS token](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1) from key for each individual Hardware Id, which is the MAC Id in your setup. Using a REST client, run `GET https://{{endpoint-management}}/api/v1.0/keystores/<insert keystore GUID here>/keys/<insert the response code for keys here>/token?deviceMac=<HardwareId>`
  Note down the response body. It is a SAS token in this format: *SharedAccessSignature id=<HardwareId>&<key>*.
5. Navigate to the Azure-IoT-SSS-Samples-DeviceConnectivity folder on the command line and run the sample:
    1. Open the *appSettings.json* file and update the following variables:
        - Assign the URL for your Digital Twins instance to the variable *ManagementApiUrl*. It will be in the form of `https://yourDigitalTwinsName.yourDigitalTwinsLocation.azuresmartspaces.net/management/`.
        - Assign the SAS token noted above to the variable *SasToken*.
    1. Run the following on the command line:
        ```cmd/sh
        dotnet restore
        dotnet run
        ```

## Create notifications for telemetry data
This section shows you how to create notifications for the simulated telemetry data using [Event Grid](https://docs.microsoft.com/azure/event-grid/overview). 

1. Create an *Event Grid Topic*:
    1. Log in to the [portal](https://portal.azure.com).
    1. On the left on the portal, click on the **Resource groups** and then select the group you created for your Digital Twins instance. 
    1. Click **Add** and search for *Event grid* in the search box. Select **Event Grid Topic**. 
    1. Enter a name for the Event Grid topic, and select your subscription, the resource group and the location that you used for the Digital Twins. Click **Create**.
6. Create an endpoint in your Digital Twins instance to interact with the Event Grid topic created above.
    1. 

## Clean up resources

Once you are done exploring this tutorial, you may delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select and **Delete** your Digital Twins resource group.
2. If you need to, you may proceed to delete the sample applications on your work machine as well. 


## Next steps

Proceed to the <!-- Link to the concepts ontology/topology here --> to learn the basic concepts behind the Azure Digital Twins. 
> [!div class="nextstepaction"]
> [Next steps button](quickstart-view-occupancy.md)

