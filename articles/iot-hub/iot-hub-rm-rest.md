<properties
	pageTitle="Create an IoT Hub using the REST API | Microsoft Azure"
	description="Follow this tutorial to get started using the REST API to create an IoT Hub."
	services="iot-hub"
	documentationCenter=".net"
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="dotnet"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="11/23/2015"
     ms.author="dobett"/>

# Tutorial: Create an IoT hub using a C# program

[AZURE.INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction

You can use the [IoT Hub Resource Provider REST API][lnk-rest-api] to create and manage Azure IoT hubs programmatically. This tutorial shows you how to use the Resource Provider REST API to create an IoT hub from a C# program.

In order to complete this tutorial you'll need the following:

- Microsoft Visual Studio 2015.
- An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].
- [Microsoft Azure PowerShell 1.0][lnk-powershell-install] or later.

[AZURE.INCLUDE [iot-hub-prepare-resource-manager](../../includes/iot-hub-prepare-resource-manager.md)]

## Prepare your Visual Studio project

1. In Visual Studio, create a new Visual C# Windows project using the **Console Application** project template. Name the project **CreateIoTHubREST**.

2. In Solution Explorer, right-click on your project and then click **Manage NuGet Packages**.

3. In NuGet Package Manager, check **Include prerelease** and search for **Microsoft.Azure.Management.Resources**. Select version **2.18.11-preview**. Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the licenses.

4. In NuGet Package Manager, search for **Microsoft.IdentityModel.Clients.ActiveDirectory**. Select version **2.19.208020213**. Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the license.

5. In NuGet Package Manager, search for **Microsoft.Azure.Common**. Select version **2.1.0**. Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the licenses.

6. In Program.cs, replace the existing **using** statements with the following:

    ```
    using System;
    using System.IO;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using Microsoft.Azure;
    using Microsoft.Azure.Management.Resources;
    using Microsoft.Azure.Management.Resources.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Newtonsoft.Json;
    ```
    
7. In Program.cs, add the following static variables replacing the placeholder values. You made a note of **ApplicationId**, **SubscriptionId**, **TenantId**, and **Password** earlier in this tutorial. **Resource group name** is the name of the resource group you will use when you create the IoT hub, it can be a pre-existing resource group or a new one. **IoT Hub name** is the name of the IoT Hub you will create, such as **MyIoTHub**. **Deployment name** is a name for the deployment, such as **Deployment_01**.

    ```
    static string applicationId = "{Your ApplicationId}";
    static string subscriptionId = "{Your SubscriptionId";
    static string tenantId = "{Your TenantId}";
    static string password = "{Your application Password}";
    
    static string rgName = "{Resource group name}";
    static string iotHubName = "{IoT Hub name}";
    static string deploymentName = "{Deployment name}";
    ```

[AZURE.INCLUDE [iot-hub-get-access-token](../../includes/iot-hub-get-access-token.md)]

## Use the REST API to create an IoT hub

Use the IoT Hub Resource Provider REST API to create a new IoT hub in your resource group. You can also use the [REST API][lnk-rest-api] to make changes to an existing IoT hub.

1. Add the following method to Program.cs:
    
    ```
    static bool CreateIoTHub(ResourceManagementClient client, string token)
    {
        
    }
    ```

2. Add the following code to the **CreateIoTHub** method to add the authentication token to the request:

    ```
    client.HttpClient.DefaultRequestHeaders.Authorization = 
      new AuthenticationHeaderValue("Bearer", token);
    ```

3. Add the following code to the **CreateIoTHub** method to describe the IoT hub to create and generate a JSON representation:

    ```
    var description = new
    {
      name = iotHubName,
      location = "East US",
      sku = new
      {
        name = "S1",
        tier = "Standard",
        capacity = 1
      }
    };
    
    var content = new StringContent(
      JsonConvert.SerializeObject(description),
      Encoding.UTF8, "application/json");
    ```

4. Add the following code to the **CreateIoTHub** method to submit the REST request to Azure and check the response:

    ```
    var requestUri = string.Format("https://management.azure.com/subscriptions/{0}/resourcegroups/{1}/providers/Microsoft.devices/IotHubs/{2}?api-version=2015-08-15-preview",
      subscriptionId, rgName, iotHubName);
    var httpsRepsonse = client.HttpClient.PutAsync(
      requestUri, content).Result;

    if (!httpsRepsonse.IsSuccessStatusCode)
    {
      Console.WriteLine("Failed {0}", httpsRepsonse.Content.ReadAsStringAsync().Result);
      return false;
    }
    ```

5. Add the following code to the end of the **CreateIoTHub** method to wait for the deployment to complete:

    ```
    ResourceGetResult resourceGetResult = null;
    do
    {
    resourceGetResult = client.Resources.GetAsync(
      rgName,
      new ResourceIdentity()
      {
        ResourceName = iotHubName,
        ResourceProviderApiVersion = "2015-08-15-preview",
        ResourceProviderNamespace = "Microsoft.Devices",
        ResourceType = "IotHubs"
      }).Result;
    Console.WriteLine("IoTHub state {0}", 
      resourceGetResult.Resource.ProvisioningState);
    } while (resourceGetResult.Resource.ProvisioningState != "Succeeded" 
          && resourceGetResult.Resource.ProvisioningState != "Failed");
    
    if (resourceGetResult.Resource.ProvisioningState != "Succeeded")
    {
        Console.WriteLine("Failed to create iothub");
        return false;
    }
    return true;
    ```

[AZURE.INCLUDE [iot-hub-retrieve-keys](../../includes/iot-hub-retrieve-keys.md)]

## Complete and run the application

You can now complete the application by calling the **CreateIoTHub** and **ShowIoTHubKeys** methods before you build and run it.

1. Add the following code to the end of the **Main** method:

    ```
    if (CreateIoTHub(client, token.AccessToken))
        ShowIoTHubKeys(client, token.AccessToken);
    Console.ReadLine();
    ```
    
2. Click **Build** and then **Build Solution**. Correct any errors.

3. Click **Debug** and then **Start Debugging** to run the application. It may take several minutes for the deployment to run.

4. You can verify that your application added the new IoT hub by visiting the [portal][lnk-azure-portal] and viewing your list of resources, or by using the **Get-AzureRmResource** PowerShell cmdlet.

> [AZURE.NOTE] This example application adds an S1 Standard IoT Hub for which you will be billed. You can delete the IoT hub through the [portal][lnk-azure-portal] or by using the **Remove-AzureRmResource** PowerShell cmdlet when you are finished.

## Next steps

- Explore the capabilities of the [IoT Hub Resource Provider REST API][lnk-rest-api].
- Read [Azure Resource Manager overview][lnk-azure-rm-overview] to learn more about the capabilities of Azure Resource Manager.

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-azure-portal]: https://portal.azure.com/
[lnk-powershell-install]: https://azure.microsoft.com/en-us/blog/azps-1-0-pre/
[lnk-rest-api]: https://msdn.microsoft.com/library/mt589014.aspx
[lnk-azure-rm-overview]: https://azure.microsoft.com/documentation/articles/resource-group-overview/