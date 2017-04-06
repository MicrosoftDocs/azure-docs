---
title: Create an Azure IoT hub using the resource provider REST API | Microsoft Docs
description: How to use the resource provider REST API to create an IoT Hub.
services: iot-hub
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 52814ee5-bc10-4abe-9eb2-f8973096c2d8
ms.service: iot-hub
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/03/2017
ms.author: dobett

---
# Create an IoT hub using the resource provider REST API (.NET)
[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction
You can use the [IoT Hub resource provider REST API][lnk-rest-api] to create and manage Azure IoT hubs programmatically. This tutorial shows you how to use the IoT Hub resource provider REST API to create an IoT hub from a C# program.

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Azure Resource Manager and classic](../azure-resource-manager/resource-manager-deployment-model.md).  This article covers using the Azure Resource Manager deployment model.
> 
> 

To complete this tutorial, you need the following:

* Visual Studio 2015 or Visual Studio 2017.
* An active Azure account. <br/>If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* [Azure PowerShell 1.0][lnk-powershell-install] or later.

[!INCLUDE [iot-hub-prepare-resource-manager](../../includes/iot-hub-prepare-resource-manager.md)]

## Prepare your Visual Studio project
1. In Visual Studio, create a Visual C# Windows Classic Desktop project using the **Console App (.NET Framework)** project template. Name the project **CreateIoTHubREST**.
2. In Solution Explorer, right-click on your project and then click **Manage NuGet Packages**.
3. In NuGet Package Manager, check **Include prerelease**, and on the **Browse** page search for **Microsoft.Azure.Management.ResourceManager**. Select the package, click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the licenses.
4. In NuGet Package Manager, search for **Microsoft.IdentityModel.Clients.ActiveDirectory**.  Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the license.
5. In Program.cs, replace the existing **using** statements with the following code:
   
    ```
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.ResourceManager.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Newtonsoft.Json;
    using Microsoft.Rest;
    using System.Linq;
    using System.Threading;
    ```
6. In Program.cs, add the following static variables replacing the placeholder values. You made a note of **ApplicationId**, **SubscriptionId**, **TenantId**, and **Password** earlier in this tutorial. **Resource group name** is the name of the resource group you use when you create the IoT hub, it can be a pre-existing resource group or a new one. **IoT Hub name** is the name of the IoT Hub you create, such as **MyIoTHub** (this name must be globally unique, so it should include your name or initials). **Deployment name** is a name for the deployment, such as **Deployment_01**.
   
    ```
    static string applicationId = "{Your ApplicationId}";
    static string subscriptionId = "{Your SubscriptionId}";
    static string tenantId = "{Your TenantId}";
    static string password = "{Your application Password}";
   
    static string rgName = "{Resource group name}";
    static string iotHubName = "{IoT Hub name including your initials}";
    ```

[!INCLUDE [iot-hub-get-access-token](../../includes/iot-hub-get-access-token.md)]

## Use the resource provider REST API to create an IoT hub
Use the [IoT Hub resource provider REST API][lnk-rest-api] to create an IoT hub in your resource group. You can also use the resource provider REST API to make changes to an existing IoT hub.

1. Add the following method to Program.cs:
   
    ```
    static void CreateIoTHub(string token)
    {
   
    }
    ```
2. Add the following code to the **CreateIoTHub** method. This code creates an **HttpClient** object with the authentication token in the headers:
   
    ```
    HttpClient client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    ```
3. Add the following code to the **CreateIoTHub** method. This code describes the IoT hub to create and generates a JSON representation. For the current list of locations that support IoT Hub see [Azure Status][lnk-status]:
   
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
   
    var json = JsonConvert.SerializeObject(description, Formatting.Indented);
    ```
4. Add the following code to the **CreateIoTHub** method. This code submits the REST request to Azure, checks the response, and retrieves the URL you can use to monitor the state of the deployment task:
   
    ```
    var content = new StringContent(JsonConvert.SerializeObject(description), Encoding.UTF8, "application/json");
    var requestUri = string.Format("https://management.azure.com/subscriptions/{0}/resourcegroups/{1}/providers/Microsoft.devices/IotHubs/{2}?api-version=2016-02-03", subscriptionId, rgName, iotHubName);
    var result = client.PutAsync(requestUri, content).Result;
   
    if (!result.IsSuccessStatusCode)
    {
      Console.WriteLine("Failed {0}", result.Content.ReadAsStringAsync().Result);
      return;
    }
   
    var asyncStatusUri = result.Headers.GetValues("Azure-AsyncOperation").First();
    ```
5. Add the following code to the end of the **CreateIoTHub** method. This code uses the **asyncStatusUri** address retrieved in the previous step to wait for the deployment to complete:
   
    ```
    string body;
    do
    {
      Thread.Sleep(10000);
      HttpResponseMessage deploymentstatus = client.GetAsync(asyncStatusUri).Result;
      body = deploymentstatus.Content.ReadAsStringAsync().Result;
    } while (body == "{\"status\":\"Running\"}");
    ```
6. Add the following code to the end of the **CreateIoTHub** method. This code retrieves the keys of the IoT hub you created and prints them to the console:
   
    ```
    var listKeysUri = string.Format("https://management.azure.com/subscriptions/{0}/resourceGroups/{1}/providers/Microsoft.Devices/IotHubs/{2}/IoTHubKeys/listkeys?api-version=2016-02-03", subscriptionId, rgName, iotHubName);
    var keysresults = client.PostAsync(listKeysUri, null).Result;
   
    Console.WriteLine("Keys: {0}", keysresults.Content.ReadAsStringAsync().Result);
    ```

## Complete and run the application
You can now complete the application by calling the **CreateIoTHub** method before you build and run it.

1. Add the following code to the end of the **Main** method:
   
    ```
    CreateIoTHub(token.AccessToken);
    Console.ReadLine();
    ```
2. Click **Build** and then **Build Solution**. Correct any errors.
3. Click **Debug** and then **Start Debugging** to run the application. It may take several minutes for the deployment to run.
4. You can verify that your application added the new IoT hub by visiting the [Azure portal][lnk-azure-portal] and viewing your list of resources, or by using the **Get-AzureRmResource** PowerShell cmdlet.

> [!NOTE]
> This example application adds an S1 Standard IoT Hub for which you are billed. When you are finished, you can delete the IoT hub through the [Azure portal][lnk-azure-portal] or by using the **Remove-AzureRmResource** PowerShell cmdlet when you are finished.
> 
> 

## Next steps
Now you have deployed an IoT hub using the resource provider REST API, you may want to explore further:

* Read about the capabilities of the [IoT Hub resource provider REST API][lnk-rest-api].
* Read [Azure Resource Manager overview][lnk-azure-rm-overview] to learn more about the capabilities of Azure Resource Manager.

To learn more about developing for IoT Hub, see the following articles:

* [Introduction to C SDK][lnk-c-sdk]
* [Azure IoT SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

* [Simulating a device with the IoT Gateway SDK][lnk-gateway]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-azure-portal]: https://portal.azure.com/
[lnk-status]: https://azure.microsoft.com/status/
[lnk-powershell-install]: /powershell/azureps-cmdlets-docs
[lnk-rest-api]: https://docs.microsoft.com/rest/api/iothub/iothubresource
[lnk-azure-rm-overview]: ../azure-resource-manager/resource-group-overview.md

[lnk-c-sdk]: iot-hub-device-sdk-c-intro.md
[lnk-sdks]: iot-hub-devguide-sdks.md

[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
