---
title: Create an Azure IoT Hub using a template (.NET) | Microsoft Docs
description: How to use an Azure Resource Manager template to create an IoT Hub with a C# program.
author: robinsh
manager: philmea
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.devlang: csharp
ms.topic: conceptual
ms.date: 08/08/2017
---

# Create an IoT hub using Azure Resource Manager template (.NET)

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

You can use Azure Resource Manager to create and manage Azure IoT hubs programmatically. This tutorial shows you how to use an Azure Resource Manager template to create an IoT hub from a C# program.

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Azure Resource Manager and classic](../azure-resource-manager/resource-manager-deployment-model.md).  This article covers using the Azure Resource Manager deployment model.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To complete this tutorial, you need the following:

* Visual Studio.
* An active Azure account. <br/>If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* An [Azure Storage account][lnk-storage-account] where you can store your Azure Resource Manager template files.
* [Azure PowerShell 1.0][lnk-powershell-install] or later.

[!INCLUDE [iot-hub-prepare-resource-manager](../../includes/iot-hub-prepare-resource-manager.md)]

## Prepare your Visual Studio project

1. In Visual Studio, create a Visual C# Windows Classic Desktop project using the **Console App (.NET Framework)** project template. Name the project **CreateIoTHub**.

2. In Solution Explorer, right-click on your project and then click **Manage NuGet Packages**.

3. In NuGet Package Manager, check **Include prerelease**, and on the **Browse** page search for **Microsoft.Azure.Management.ResourceManager**. Select the package, click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the licenses.

4. In NuGet Package Manager, search for **Microsoft.IdentityModel.Clients.ActiveDirectory**.  Click **Install**, in **Review Changes** click **OK**, then click **I Accept** to accept the license.

5. In Program.cs, replace the existing **using** statements with the following code:

    ```csharp
    using System;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.ResourceManager.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Microsoft.Rest;
    ```

6. In Program.cs, add the following static variables replacing the placeholder values. You made a note of **ApplicationId**, **SubscriptionId**, **TenantId**, and **Password** earlier in this tutorial. **Your Azure Storage account name** is the name of the Azure Storage account where you store your Azure Resource Manager template files. **Resource group name** is the name of the resource group you use when you create the IoT hub. The name can be a pre-existing or new resource group. **Deployment name** is a name for the deployment, such as **Deployment_01**.

    ```csharp
    static string applicationId = "{Your ApplicationId}";
    static string subscriptionId = "{Your SubscriptionId}";
    static string tenantId = "{Your TenantId}";
    static string password = "{Your application Password}";
    static string storageAddress = "https://{Your storage account name}.blob.core.windows.net";
    static string rgName = "{Resource group name}";
    static string deploymentName = "{Deployment name}";
    ```

[!INCLUDE [iot-hub-get-access-token](../../includes/iot-hub-get-access-token.md)]

## Submit a template to create an IoT hub

Use a JSON template and parameter file to create an IoT hub in your resource group. You can also use an Azure Resource Manager template to make changes to an existing IoT hub.

1. In Solution Explorer, right-click on your project, click **Add**, and then click **New Item**. Add a JSON file called **template.json** to your project.

2. To add a standard IoT hub to the **East US** region, replace the contents of **template.json** with the following resource definition. For the current list of regions that support IoT Hub see [Azure Status][lnk-status]:

    ```json
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

3. In Solution Explorer, right-click on your project, click **Add**, and then click **New Item**. Add a JSON file called **parameters.json** to your project.

4. Replace the contents of **parameters.json** with the following parameter information that sets a name for the new IoT hub such as **{your initials}mynewiothub**. The IoT hub name must be globally unique so it should include your name or initials:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "hubName": { "value": "mynewiothub" }
      }
    }
    ```
   [!INCLUDE [iot-hub-pii-note-naming-hub](../../includes/iot-hub-pii-note-naming-hub.md)]

5. In **Server Explorer**, connect to your Azure subscription, and in your Azure Storage account create a container called **templates**. In the **Properties** panel, set the **Public Read Access** permissions for the **templates** container to **Blob**.

6. In **Server Explorer**, right-click on the **templates** container and then click **View Blob Container**. Click the **Upload Blob** button, select the two files, **parameters.json** and **templates.json**, and then click **Open** to upload the JSON files to the **templates** container. The URLs of the blobs containing the JSON data are:

    ```csharp
    https://{Your storage account name}.blob.core.windows.net/templates/parameters.json
    https://{Your storage account name}.blob.core.windows.net/templates/template.json
    ```
7. Add the following method to Program.cs:

    ```csharp
    static void CreateIoTHub(ResourceManagementClient client)
    {

    }
    ```

8. Add the following code to the **CreateIoTHub** method to submit the template and parameter files to the Azure Resource Manager:

    ```csharp
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

9. Add the following code to the **CreateIoTHub** method that displays the status and the keys for the new IoT hub:

    ```csharp
    string state = createResponse.Properties.ProvisioningState;
    Console.WriteLine("Deployment state: {0}", state);

    if (state != "Succeeded")
    {
      Console.WriteLine("Failed to create iothub");
    }
    Console.WriteLine(createResponse.Properties.Outputs);
    ```

## Complete and run the application

You can now complete the application by calling the **CreateIoTHub** method before you build and run it.

1. Add the following code to the end of the **Main** method:

    ```csharp
    CreateIoTHub(client);
    Console.ReadLine();
    ```

2. Click **Build** and then **Build Solution**. Correct any errors.

3. Click **Debug** and then **Start Debugging** to run the application. It may take several minutes for the deployment to run.

4. To verify your application added the new IoT hub, visit the [Azure portal][lnk-azure-portal] and view your list of resources. Alternatively, use the **Get-AzResource** PowerShell cmdlet.

> [!NOTE]
> This example application adds an S1 Standard IoT Hub for which you are billed. You can delete the IoT hub through the [Azure portal][lnk-azure-portal] or by using the **Remove-AzResource** PowerShell cmdlet when you are finished.

## Next steps
Now you have deployed an IoT hub using an Azure Resource Manager template with a C# program, you may want to explore further:

* Read about the capabilities of the [IoT Hub resource provider REST API][lnk-rest-api].
* Read [Azure Resource Manager overview][lnk-azure-rm-overview] to learn more about the capabilities of Azure Resource Manager.
* For the JSON syntax and properties to use in templates, see [Microsoft.Devices resource types](/azure/templates/microsoft.devices/iothub-allversions).

To learn more about developing for IoT Hub, see the following articles:

* [Introduction to C SDK][lnk-c-sdk]
* [Azure IoT SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

* [Deploying AI to edge devices with Azure IoT Edge][lnk-iotedge]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-azure-portal]: https://portal.azure.com/
[lnk-status]: https://azure.microsoft.com/status/
[lnk-powershell-install]: /powershell/azure/install-Az-ps
[lnk-rest-api]: https://docs.microsoft.com/rest/api/iothub/iothubresource
[lnk-azure-rm-overview]: ../azure-resource-manager/resource-group-overview.md
[lnk-storage-account]:../storage/common/storage-create-storage-account.md

[lnk-c-sdk]: iot-hub-device-sdk-c-intro.md
[lnk-sdks]: iot-hub-devguide-sdks.md

[lnk-iotedge]: ../iot-edge/tutorial-simulate-device-linux.md
