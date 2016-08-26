<properties
	pageTitle="Create an IoT Hub using an ARM template and C# | Microsoft Azure"
	description="Follow this tutorial to get started using Resource Manager templates to create an IoT Hub with a C# program."
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
     ms.date="05/31/2016"
     ms.author="dobett"/>

# Create an IoT hub using a C# program with an ARM template

[AZURE.INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction

You can use Azure Resource Manager (ARM) to create and manage Azure IoT hubs programmatically. This tutorial shows you how to use a resource manager template to create an IoT hub from a C# program.

> [AZURE.NOTE] Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md).  This article covers using the Resource Manager deployment model.

In order to complete this tutorial you'll need the following:

- Microsoft Visual Studio 2015.
- An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].
- An [Azure storage account][lnk-storage-account] where you can store your template files.
- [Microsoft Azure PowerShell 1.0][lnk-powershell-install] or later.

[AZURE.INCLUDE [iot-hub-prepare-resource-manager](../../includes/iot-hub-prepare-resource-manager.md)]

## Prepare your Visual Studio project

1. In Visual Studio, create a new Visual C# Windows project using the **Console Application** project template. Name the project **CreateIoTHub**.

2. In Solution Explorer, right-click on your project and then click **Manage NuGet Packages**.

3. In NuGet Package Manager, check **Include prerelease**, and search for **Microsoft.Azure.Management.ResourceManager**. Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the licenses.

4. In NuGet Package Manager, search for **Microsoft.IdentityModel.Clients.ActiveDirectory**.  Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the license.

5. In NuGet Package Manager, search for **Microsoft.Azure.Common**. Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the licenses.

6. In Program.cs, replace the existing **using** statements with the following:

    ```
    using System;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.ResourceManager.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Microsoft.Rest;
    ```
    
7. In Program.cs, add the following static variables replacing the placeholder values. You made a note of **ApplicationId**, **SubscriptionId**, **TenantId**, and **Password** earlier in this tutorial. **Your storage account name** is the name of the Azure storage account where you will store your template files. **Resource group name** is the name of the resource group you will use when you create the IoT Hub, it can be a pre-existing resource group or a new one. **Deployment name** is a name for the deployment, such as **Deployment_01**.

    ```
    static string applicationId = "{Your ApplicationId}";
    static string subscriptionId = "{Your SubscriptionId}";
    static string tenantId = "{Your TenantId}";
    static string password = "{Your application Password}";
    static string storageAddress = "https://{Your storage account name}.blob.core.windows.net";
    static string rgName = "{Resource group name}";
    static string deploymentName = "{Deployment name}";
    ```

[AZURE.INCLUDE [iot-hub-get-access-token](../../includes/iot-hub-get-access-token.md)]

## Submit a template to create an IoT hub

Use a JSON template and parameter file to create a new IoT hub in your resource group. You can also use a template to make changes to an existing IoT hub.

1. In Solution Explorer, right-click on your project, click **Add**, and then click **New Item**. Add a new JSON file called **template.json** to your project.

2. Replace the contents of **template.json** with the following resource definition to add a new standard IoT hub to the **East US** region:

    ```
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "hubName": {
          "type": "string"
        }
      },
      "resources": [
      {
        "apiVersion": "2016-02-03",
        "type": "Microsoft.Devices/IotHubs",
        "name": "[parameters('hubName')]",
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
      ],
      "outputs": {
        "hubKeys": {
          "value": "[listKeys(resourceId('Microsoft.Devices/IotHubs', parameters('hubName')), '2016-02-03')]",
          "type": "object"
        }
      }
    }
    ```

3. In Solution Explorer, right-click on your project, click **Add**, and then click **New Item**.  Add a new JSON file called **parameters.json** to your project.

4. Replace the contents of **parameters.json** with the following parameter information that sets a name for the new IoT hub such as **{your initials}mynewiothub**  (note that this name must be globally unique so it should include your name or initials):

    ```
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "hubName": { "value": "mynewiothub" }
      }
    }
    ```

5. In **Server Explorer**, connect to your Azure subscription, and in your storage account create a new container called **templates**. In the **Properties** panel, set the **Public Read Access** permissions for the **templates** container to **Blob**.

6. In **Server Explorer**, right-click on the **templates** container and then click **View BLob Container**. Click the **Upload Blob** button, select the two files, **parameters.json** and **templates.json**, and then click **Open** to upload the JSON files to the **templates** container. The URLs of the blobs containing the JSON data are:

    ```
    https://{Your storage account name}.blob.core.windows.net/templates/parameters.json
    https://{Your storage account name}.windows.net/templates/template.json
    ```

7. Add the following method to Program.cs:
    
    ```
    static void CreateIoTHub(ResourceManagementClient client)
    {
        
    }
    ```

5. Add the following code to the **CreateIoTHub** method to submit the template and parameter files to the Azure resource manager:

    ```
    var createResponse = client.Deployments.CreateOrUpdate(
        rgName,
        deploymentName,
        new Deployment()
        {
          Properties = new DeploymentProperties
          {
            Mode = DeploymentMode.Incremental,
            TemplateLink = new TemplateLink
            {
              Uri = storageAddress + "/templates/template.json"
            },
            ParametersLink = new ParametersLink
            {
              Uri = storageAddress + "/templates/parameters.json"
            }
          }
        });
    ```

6. Add the following code to the **CreateIoTHub** method that displays the status and the keys for the new IoT hub:

    ```
    string state = createResponse.Properties.ProvisioningState;
    Console.WriteLine("Deployment state: {0}", state);

    if (state != "Succeeded")
    {
      Console.WriteLine("Failed to create iothub");
    }
    Console.WriteLine(createResponse.Properties.Outputs);
    ```

## Complete and run the application

You can now complete the application by calling the **CreateIoTHub**  method before you build and run it.

1. Add the following code to the end of the **Main** method:

    ```
    CreateIoTHub(client);
    Console.ReadLine();
    ```
    
2. Click **Build** and then **Build Solution**. Correct any errors.

3. Click **Debug** and then **Start Debugging** to run the application. It may take several minutes for the deployment to run.

4. You can verify that your application added the new IoT hub by visiting the [portal][lnk-azure-portal] and viewing your list of resources, or by using the **Get-AzureRmResource** PowerShell cmdlet.

> [AZURE.NOTE] This example application adds an S1 Standard IoT Hub for which you will be billed. You can delete the IoT hub through the [portal][lnk-azure-portal] or by using the **Remove-AzureRmResource** PowerShell cmdlet when you are finished.

## Next steps

Now you have deployed an IoT hub using an ARM template with a C# program, you may want to explore further:

- Read about the capabilities of the [IoT Hub Resource Provider REST API][lnk-rest-api].
- Read [Azure Resource Manager overview][lnk-azure-rm-overview] to learn more about the capabilities of Azure Resource Manager.

To learn more about developing for IoT Hub, see the following:

- [Introduction to C SDK][lnk-c-sdk]
- [IoT Hub SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-azure-portal]: https://portal.azure.com/
[lnk-powershell-install]: ../powershell-install-configure.md
[lnk-rest-api]: https://msdn.microsoft.com/library/mt589014.aspx
[lnk-azure-rm-overview]: ../resource-group-overview.md
[lnk-storage-account]: ../storage/storage-create-storage-account.md

[lnk-c-sdk]: iot-hub-device-sdk-c-intro.md
[lnk-sdks]: iot-hub-sdks-summary.md

[lnk-design]: iot-hub-guidance.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md