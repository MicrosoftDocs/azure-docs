---
title: Use ARM template to publish IoT Hub, storage account, route messages 
description: Use ARM template to publish IoT Hub, storage account, route messages 
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: quickstart
ms.date: 08/14/2020
ms.author: robinsh
ms.custom: mvc
---
# Quickstart: Deploy an Azure IoT Hub and a storage account using an ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create an IoT Hub that will route messages to Azure Storage, and a storage account to hold the messages. After manually adding a virtual IoT device to the hub to submit the messages, you configure that connection information in an application called  *arm-read-write* to submit messages from the device to the hub. The hub is configured so the messages sent to the hub are automatically routed to the storage account. At the end of this quickstart, you can open the storage account and see the messages sent.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## The template

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal and deploy your IoT Hub and storage account. If you want to deploy to Azure Government, select **Deploy to Azure US GOV**.


[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-iothub-auto-route-messages%2Fazuredeploy.json)

[![Deploy To Azure US Gov](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazuregov.svg?sanitize=true)](https://portal.azure.us/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-iothub-auto-route-messages%2Fazuredeploy.json)

[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-iothub-auto-route-messages%2Fazuredeploy.json)

The template used in this quickstart is called `101-iothub-auto-route-messages` from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-iothub-auto-route-messages).

<!-- robin -- should see your tempate here?  -->
> [!NOTE]
> list of templates goes here

:::code language="json" source="~/quickstart-templates/101-iothub-auto-route-messages/azuredeploy.json" :::

Two Azure resources are defined in the template: 
* [Microsoft.Devices/Iothubs](/azure/templates/microsoft.iothubs)
* [Microsoft.Storage/](/azure/templates/microsoft.storage)

## Overview

This section provides the steps to deploy the template, create a virtual device, and run the arm-read-write application to send the messages.

1. Create the resources by deploying the ARM template.

> [!INFO]
> Start the deployment of the template. While it's running, set up the arm-read-write application to run.

1. Download and unzip the C# IoT samples zip file which is [IoT Samples C#](https://Azure-Samples/azure-iot-samples-csharp).

1. Open a command window and go to the folder where you unzipped the IoT C# Samples. Find the folder with the arm-read-write.csproj file. You create the environment variables in this command window. Log into the [Azure portal](http://portal.azure.com] to get the keys. Select **Resource Groups** then select the resource group used for this quickstart.

   ![Select the resource group](./media/horizontal-arm-route-messages/01-select-resource-group.png)

1. You see the IoT Hub and storage account that were created when you deployed the ARM template. Wait until the template is fully deployed before continuing. Then select your resource group to see your resources.

   ![View resources in the resource group](./media/horizontal-arm-route-messages/02-view-resources-in-group.png)

1. You need the **hub name**. Select the hub in the list of resources. Copy the name of the hub from the top of the IoT Hub section to the Windows clipboard. 
 
  ![Copy the hub name](./media/horizontal-arm-route-messages/03-copy-hub-name.png)

   Substitute the hub name in this command where noted, and execute this command in the command window:
   
```cmd
   SET IOT_HUB_URI="<hub name goes here>.azure-devices-net";
```

   which will look this example:

```cmd
   SET IOT_HUB_URI="ContosoTestHubdlxlud5h.azure-devices-net";
```

1. The next environmental variable is the IoT Device Key. Add a new device to the hub by selecing **IOT Devices** from the IoT Hub menu for the hub. 

   ![Select IoT Devices](./media/horizontal-arm-route-messages/04-select-iot-devices.png)

1. On the right side of the screen, select **+ NEW** to add a new device. 

   Fill in the new device name. This quickstart uses a name starting with **Contoso-Test-Device**. Save the device and then open that screen again to retrieve the device key. (The key is generated for you when you close the pane.) Select either the primary or secondary key and copy it to the Windows clipboard. In the command window, set the command to execute and then press <Enter>. The command should look like this one but with the device key pasted in:

   ```cmd
   SET IOT_DEVICE_KEY=<device-key-goes-here>
   ```

1. The last environment variable is the **Device ID**. In the command window, set up the command and execute it. 
   
   ```CMD
   SET IOT_DEVICE_ID=<device-id-goes-here> 
   ```

   which will look like this example:

   ```CMD
   ```SET IOT_DEVICE_ID=Contoso-Test-Device
   ```

1. To see the environment variables you've defined, type SET on the command line and press <Enter>, then look for the ones starting with **IoT**.

  ![See environmental variables](./media/horizontal-arm-route-messages/06-environmental-variables.png)

Now the environmental variables are set, run the application from the same command window. Because you're using the same window, the variables will be accessible in memory when you run the application.

1. To run the application, type the following command in the command window and press <Enter>.

    `dotnet run arm-read-write\

The application generates and displays messages on the console as it sends each message to the IoT hub. The hub was configured in the ARM template to have automated routing. Messages containing the text "level = storage" are automatically routed to the storage account. Let the app run for 10 to 15 minutes, then press Enter one or twice until it stops running.

** View the results

1. Log in to the (Azure portal)[https://portal.azure.com] and select the Resource Group, then select the storage account.

1. Drill down into the storage account until you find files.'

   ![Look at the storage account files](./media/horizontal-arm-route-messages/07-see-storage.png)

1. Select one of the files and select **Download** and download the file to a location you can find later. It will have a name that's numeric, like 47. Add ".txt" to the end and then double-click on the file to open it.

1. When you open the file, each row is a different message; the body of each messages is encrypted. 

   ![View the sent messages](./media/horizontal-arm-route-messages/08-messages.png)

> [!NOTE]
> The messages are encrypted as UTF32 and then base64. If you want to decrypt one (or more) of the messages, there's a block of code in the sample for the Routing Tutorial that shows how to do that. If you look in the c# samples that you have already unzipped for this quickstart, the method is called ReadOneRowFromFile and is in /iot-hub/Tutorials/Routing/SimulatedDevice/Program.cs. You can set a toggle to read the file, and give the path to the file name, and it will translate it for you.

** You have created an IoT Hub and a storage account, and run a program to send messages to the hub. The messages are then routed to the storage account using the configuration that originally came from the ARM template.

## Clean up resources

To clean up the resources created in this quickstart, log in to the [Azure portal](https://portal.azure.com). Select **Resource Groups**, then find the resource group you used for this quickstart. Delete the resource group. It will delete all of the resources in the group.

## Next steps

```markdown
> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)
```