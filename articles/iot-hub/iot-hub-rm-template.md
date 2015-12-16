<properties
	pageTitle="Create an IoT Hub using a Resource Manager template | Microsoft Azure"
	description="Follow this tutorial to get started using Resource Manager templates to create an IoT Hub."
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

You can use Azure Resource Manager to create and manage Azure IoT hubs programmatically. This tutorial shows you how to use a resource manager template to create an IoT hub from a C# program.

In order to complete this tutorial you'll need the following:

- Microsoft Visual Studio 2015.
- An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].
- [Microsoft Azure PowerShell 1.0][lnk-powershell-install] or later.

[AZURE.INCLUDE [iot-hub-prepare-resource-manager](../../includes/iot-hub-prepare-resource-manager.md)]

## Prepare your Visual Studio project

1. In Visual Studio, create a new Visual C# Windows project using the **Console Application** project template. Name the project **CreateIoTHub**.

2. In Solution Explorer, right-click on your project and then click **Manage NuGet Packages**.

3. In NuGet Package Manager, check **Include prerelease** and search for **Microsoft.Azure.Management.Resources**. Select version **2.18.11-preview**. Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the licenses.

4. In NuGet Package Manager, search for **Microsoft.IdentityModel.Clients.ActiveDirectory**. Select version **2.19.208020213**. Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the license.

5. In NuGet Package Manager, search for **Microsoft.Azure.Common**. Select version **2.1.0**. Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the licenses.

6. In Program.cs, replace the existing **using** statements with the following:

    ```
    using System;
    using System.IO;
    using System.Net;
    using System.Net.Http.Headers;
    using Microsoft.Azure;
    using Microsoft.Azure.Management.Resources;
    using Microsoft.Azure.Management.Resources.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    ```
    
7. In Program.cs, add the following static variables replacing the placeholder values. You made a note of **ApplicationId**, **SubscriptionId**, **TenantId**, and **Password** earlier in this tutorial. **Resource group name** is the name of the resource group you will use when you create the IoT Hub, it can be a pre-existing resource group or a new one. **IoT Hub name** is the name of the IoT Hub you will create, such as **MyIoTHub**. **Deployment name** is a name for the deployment, such as **Deployment_01**.

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

## Submit a template to create an IoT hub

Use a JSON template to create a new IoT hub in your resource group. You can also use a template to make changes to an existing IoT hub.

1. In Solution Explorer, right-click on your project and click **Add** then **New Item**. Add a new JSON file called **template.json** to your project.

2. In Solution Explorer, select **template.json**, and then in **Properties** set **Copy to Output Directory** to **Copy always**.

3. Replace the contents of **template.json** with the following resource definition to add a new standard IoT hub to the **East US** region:

    ```
    {
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",

    "resources": [
      {
        "apiVersion": "2015-08-15-preview",
        "type": "Microsoft.Devices/Iothubs",
        "name": "[IotHubName]",
        "location": "East US",
        "sku": {
          "name": "S1",
          "tier": "Standard",
          "capacity": 1
        },
        "properties": {
          "location": "East US"
        }
      }
    ]
    }
    ```

4. Add the following method to Program.cs:
    
    ```
    static bool CreateIoTHub(ResourceManagementClient client)
    {
        
    }
    ```

5. Add the following code to the **CreateIoTHub** method to load the template file, add the name of the IoT hub, and submit the template to the Azure resource manager:

    ```
    string template = File.ReadAllText("template.json");
    template = template.Replace("[IotHubName]", iotHubName);
    var createResponse = client.Deployments.CreateOrUpdateAsync(
      rgName,
      deploymentName,
      new Deployment()
      {
        Properties = new DeploymentProperties
        {
          Mode = DeploymentMode.Incremental,
          Template = template
        }
      }).Result;
    ```

6. Add the following code to the **CreateIoTHub** method that waits until the deployment completes successfully:

    ```
    string state = createResponse.Deployment.Properties.ProvisioningState;
    while (state != "Succeeded" && state != "Failed")
    {
      var getResponse = client.Deployments.GetAsync(
        rgName,
        deploymentName).Result;

      state = getResponse.Deployment.Properties.ProvisioningState;
      Console.WriteLine("Deployment state: {0}", state);
    }

    if (state != "Succeeded")
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
    if (CreateIoTHub(client))
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
