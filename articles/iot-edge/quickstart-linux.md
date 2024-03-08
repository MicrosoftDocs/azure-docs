---
title: Quickstart creates an Azure IoT Edge device on Linux
description: Learn how to create an IoT Edge device on Linux and then deploy prebuilt code remotely from the Azure portal.
author: PatAltimore
ms.author: patricka
ms.date: 07/18/2023
ms.topic: quickstart
ms.service: iot-edge
services: iot-edge
ms.custom: mvc, devx-track-azurecli, mode-other
---

# Quickstart: Deploy your first IoT Edge module to a virtual Linux device

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

Test out Azure IoT Edge in this quickstart by deploying containerized code to a virtual Linux IoT Edge device. IoT Edge allows you to remotely manage code on your devices so that you can send more of your workloads to the edge. For this quickstart, we recommend using an Azure virtual machine for your IoT Edge device, which allows you to quickly create a test machine and then delete it when you're finished.

In this quickstart you learn how to:

* Create an IoT Hub.
* Register an IoT Edge device to your IoT hub.
* Install and start the IoT Edge runtime on a virtual device.
* Remotely deploy a module to an IoT Edge device.

:::image type="content" source="./media/quickstart-linux/install-edge-full.png" alt-text="Diagram of Quickstart architecture for device and cloud.":::

This quickstart walks you through creating a Linux virtual machine that's configured to be an IoT Edge device. Then, you deploy a module from the Azure portal to your device. The module used in this quickstart is a simulated sensor that generates temperature, humidity, and pressure data. The other Azure IoT Edge tutorials build upon the work you do here by deploying additional modules that analyze the simulated data for business insights.

If you don't have an active Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

## Prerequisites

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

Cloud resources:

* A resource group to manage all the resources you use in this quickstart. We use the example resource group name **IoTEdgeResources** throughout this quickstart and the following tutorials.

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus2
   ```

## Create an IoT hub

Start the quickstart by creating an IoT hub with Azure CLI.

:::image type="content" source="./media/quickstart-linux/create-iot-hub.png" alt-text="Diagram of how to create an IoT hub in the cloud.":::

The free level of IoT Hub works for this quickstart. If you've used IoT Hub in the past and already have a hub created, you can use that IoT hub.

The following code creates a free **F1** hub in the resource group **IoTEdgeResources**. Replace `{hub_name}` with a unique name for your IoT hub. It might take a few minutes to create an IoT Hub.

   ```azurecli-interactive
   az iot hub create --resource-group IoTEdgeResources --name {hub_name} --sku F1 --partition-count 2
   ```

   If you get an error because there's already one free hub in your subscription, change the SKU to **S1**. Each subscription can only have one free IoT hub. If you get an error that the IoT Hub name isn't available, it means that someone else already has a hub with that name. Try a new name.

## Register an IoT Edge device

Register an IoT Edge device with your newly created IoT hub.

:::image type="content" source="./media/quickstart-linux/register-device.png" alt-text="Diagram of how to register a device with an IoT Hub identity.":::

Create a device identity for your IoT Edge device so that it can communicate with your IoT hub. The device identity lives in the cloud, and you use a unique device connection string to associate a physical device to a device identity.

Since IoT Edge devices behave and can be managed differently than typical IoT devices, declare this identity to be for an IoT Edge device with the `--edge-enabled` flag.

1. In the Azure Cloud Shell, enter the following command to create a device named **myEdgeDevice** in your hub.

   ```azurecli-interactive
   az iot hub device-identity create --device-id myEdgeDevice --edge-enabled --hub-name {hub_name}
   ```

   If you get an error about iothubowner policy keys, make sure that your Cloud Shell is running the latest version of the *azure-iot* extension.

2. View the connection string for your device, which links your physical device with its identity in IoT Hub. It contains the name of your IoT hub, the name of your device, and then a shared key that authenticates connections between the two. We'll refer to this connection string again in the next section when you set up your IoT Edge device.

   ```azurecli-interactive
   az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name {hub_name}
   ```

   :::image type="content" source="./media/quickstart/retrieve-connection-string.png" alt-text="Screenshot of the connection string from CLI output." lightbox="./media/quickstart/retrieve-connection-string.png":::

## Configure your IoT Edge device

Create a virtual machine with the Azure IoT Edge runtime on it.

:::image type="content" source="./media/quickstart-linux/start-runtime.png" alt-text="Diagram of how to start the runtime on a device.":::

The IoT Edge runtime is deployed on all IoT Edge devices. It has three components. The *IoT Edge security daemon* starts each time an IoT Edge device boots and bootstraps the device by starting the IoT Edge agent. The *IoT Edge agent* facilitates deployment and monitoring of modules on the IoT Edge device, including the IoT Edge hub. The *IoT Edge hub* manages communications between modules on the IoT Edge device, and between the device and IoT Hub.

During the runtime configuration, you provide a device connection string. This is the string that you retrieved from the Azure CLI. This string associates your physical device with the IoT Edge device identity in Azure.

### Deploy the IoT Edge device

This section uses an Azure Resource Manager template to create a new virtual machine and install the IoT Edge runtime on it. If you want to use your own Linux device instead, you can follow the installation steps in [Manually provision a single Linux IoT Edge device](how-to-provision-single-device-linux-symmetric.md), then return to this quickstart.

Use the **Deploy to Azure** button or the CLI commands to create your IoT Edge device based on the prebuilt [iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy/tree/1.4) template.

* Deploy using the IoT Edge Azure Resource Manager template.

   [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fiotedge-vm-deploy%2Fmaster%2FedgeDeploy.json)

* For bash or Cloud Shell users, copy the following command into a text editor, replace the placeholder text with your information, then copy into your bash or Cloud Shell window:

   ```azurecli-interactive
   az deployment group create \
   --resource-group IoTEdgeResources \
   --template-uri "https://raw.githubusercontent.com/Azure/iotedge-vm-deploy/1.4/edgeDeploy.json" \
   --parameters dnsLabelPrefix='<REPLACE_WITH_VM_NAME>' \
   --parameters adminUsername='azureUser' \
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name <REPLACE_WITH_HUB_NAME> -o tsv) \
   --parameters authenticationType='password' \
   --parameters adminPasswordOrKey="<REPLACE_WITH_PASSWORD>"
   ```

* For PowerShell users, copy the following command into your PowerShell window, then replace the placeholder text with your own information:

   ```azurecli
   az deployment group create `
   --resource-group IoTEdgeResources `
   --template-uri "https://raw.githubusercontent.com/Azure/iotedge-vm-deploy/1.4/edgeDeploy.json" `
   --parameters dnsLabelPrefix='<REPLACE_WITH_VM_NAME>' `
   --parameters adminUsername='azureUser' `
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name <REPLACE_WITH_HUB_NAME> -o tsv) `
   --parameters authenticationType='password' `
   --parameters adminPasswordOrKey="<REPLACE_WITH_PASSWORD>"
   ```

This template takes the following parameters:

| Parameter | Description |
| --------- | ----------- |
| **resource-group** | The resource group in which the resources will be created. Use the default **IoTEdgeResources** that we've been using throughout this article or provide the name of an existing resource group in your subscription. |
| **template-uri** | A pointer to the Resource Manager template that we're using. |
| **dnsLabelPrefix** | A string that will be used to create the virtual machine's hostname. Replace the placeholder text with a name for your virtual machine. |
| **adminUsername** | A username for the admin account of the virtual machine. Use the example **azureUser** or provide a new username. |
| **deviceConnectionString** | The connection string from the device identity in IoT Hub, which is used to configure the IoT Edge runtime on the virtual machine. The CLI command within this parameter grabs the connection string for you. Replace the placeholder text with your IoT hub name. |
| **authenticationType** | The authentication method for the admin account. This quickstart uses **password** authentication, but you can also set this parameter to **sshPublicKey**. |
| **adminPasswordOrKey** | The password or value of the SSH key for the admin account. Replace the placeholder text with a secure password. Your password must be at least 12 characters long and have three of four of the following: lowercase characters, uppercase characters, digits, and special characters. |

Once the deployment is complete, you should receive JSON-formatted output in the CLI that contains the SSH information to connect to the virtual machine. Copy the value of the **public SSH** entry of the **outputs** section:

:::image type="content" source="./media/quickstart-linux/outputs-public-ssh.png" alt-text="Screenshot showing how to retrieve public ssh value from output." lightbox="./media/quickstart-linux/outputs-public-ssh.png":::

### View the IoT Edge runtime status

The rest of the commands in this quickstart take place on your IoT Edge device itself, so that you can see what's happening on the device. If you're using a virtual machine, connect to that machine now using the admin username that you set up and the DNS name that was output by the deployment command. You can also find the DNS name on your virtual machine's overview page in the Azure portal. Use the following command to connect to your virtual machine. Replace `{admin username}` and `{DNS name}` with your own values.

   ```console
   ssh {admin username}@{DNS name}
   ```

Once connected to your virtual machine, verify that the runtime was successfully installed and configured on your IoT Edge device.

1. Check to see that IoT Edge is running. The following command should return a status of **Ok** if IoT Edge is running, or provide any service errors.

   ```bash
   sudo iotedge system status
   ```

   >[!TIP]
   >You need elevated privileges to run `iotedge` commands. Once you sign out of your machine and sign back in the first time after installing the IoT Edge runtime, your permissions are automatically updated. Until then, use `sudo` in front of the commands.

2. If you need to troubleshoot the service, retrieve the service logs.

   ```bash
   sudo iotedge system logs
   ```

3. View all the modules running on your IoT Edge device. Since the service just started for the first time, you should only see the **edgeAgent** module running. The edgeAgent module runs by default and helps to install and start any additional modules that you deploy to your device.

   ```bash
   sudo iotedge list
   ```

Your IoT Edge device is now configured. It's ready to run cloud-deployed modules.

## Deploy a module

Manage your Azure IoT Edge device from the cloud to deploy a module that will send telemetry data to IoT Hub.

:::image type="content" source="./media/quickstart-linux/deploy-module.png" alt-text="Diagram of how to deploy a module from cloud to device.":::

One of the key capabilities of Azure IoT Edge is deploying code to your IoT Edge devices from the cloud. *IoT Edge modules* are executable packages implemented as containers. In this section, you'll deploy a pre-built module from the [IoT Edge Modules section of Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1&subcategories=iot-edge-modules) directly from Azure IoT Hub.

The module that you deploy in this section simulates a sensor and sends generated data. This module is a useful piece of code when you're getting started with IoT Edge because you can use the simulated data for development and testing. If you want to see exactly what this module does, you can view the [simulated temperature sensor source code](https://github.com/Azure/iotedge/blob/027a509549a248647ed41ca7fe1dc508771c8123/edge-modules/SimulatedTemperatureSensor/src/Program.cs).

Follow these steps to start the **Set Modules** wizard to deploy your first module from Azure Marketplace.

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your IoT hub.

1. From the menu on the left, under **Device Management**, select **Devices**.

1. Select the device ID of the target IoT Edge device from the list.

   When you create a new IoT Edge device, it will display the status code `417 -- The device's deployment configuration is not set` in the Azure portal. This status is normal, and means that the device is ready to receive a module deployment.

1. On the upper bar, select **Set Modules**.

   :::image type="content" source="./media/quickstart-linux/select-set-modules.png" alt-text="Screenshot that shows location of the Set Modules tab.":::

### Modules

The first step of the wizard is to choose which modules you want to run on your device.

Under **IoT Edge Modules**, open the **Add** drop-down menu, and then select **Marketplace Module**.

:::image type="content" source="./media/quickstart-linux/add-marketplace-module.png" alt-text="Screenshot that shows the Add drop-down menu.":::

In **IoT Edge Module Marketplace**, search for and select the `Simulated Temperature Sensor` module. The module is added to the IoT Edge Modules section with the desired **running** status.

Select **Next: Routes** to continue to the next step of the wizard.

:::image type="content" source="./media/quickstart-linux/view-temperature-sensor-next-routes.png" alt-text="Screenshot that shows continuing to the next step after the module is added.":::

### Routes

A route named *SimulatedTemperatureSensorToIoTHub* was created automatically when you added the module from Azure Marketplace. This route sends all messages from the simulated temperature module to IoT Hub.

:::image type="content" source="./media/quickstart-linux/route-next-review-create.png" alt-text="Screenshot that shows the new temperature sensor route and shows the location of the Next: Review + create button.":::

Select **Next: Review + create**.

### Review and create

Review the JSON file, and then select **Create**. The JSON file defines all of the modules that you deploy to your IoT Edge device. 

   >[!Note]
   >When you submit a new deployment to an IoT Edge device, nothing is pushed to your device. Instead, the device queries IoT Hub regularly for any new instructions. If the device finds an updated deployment manifest, it uses the information about the new deployment to pull the module images from the cloud then starts running the modules locally. This process can take a few minutes.

After you create the module deployment details, the wizard returns you to the device details page. View the deployment status on the **Modules** tab.

You should see three modules: **$edgeAgent**, **$edgeHub**, and **SimulatedTemperatureSensor**. If one or more of the modules has **Yes** under **Specified in Deployment** but not under **Reported by Device**, your IoT Edge device is still starting them. Wait a few minutes, and then refresh the page.

:::image type="content" source="./media/quickstart-linux/view-deployed-modules.png" alt-text="Screenshot that shows the SimulatedTemperatureSensor in the list of deployed modules." lightbox="./media/quickstart-linux/view-deployed-modules.png":::

## View generated data

In this quickstart, you created a new IoT Edge device and installed the IoT Edge runtime on it. Then, you used the Azure portal to deploy an IoT Edge module to run on the device without having to make changes to the device itself.

In this case, the module that you pushed generates sample environment data that you can use for testing later. The simulated sensor is monitoring both a machine and the environment around the machine. For example, this sensor might be in a server room, on a factory floor, or on a wind turbine. The message includes ambient temperature and humidity, machine temperature and pressure, and a timestamp. The IoT Edge tutorials use the data created by this module as test data for analytics.

Open the command prompt on your IoT Edge device again, or use the SSH connection from Azure CLI. Confirm that the module deployed from the cloud is running on your IoT Edge device:

   ```bash
   sudo iotedge list
   ```

:::image type="content" source="./media/quickstart-linux/iot-edge-list-2-version-1.4.png" alt-text="Screenshot that shows three modules on your device." lightbox="./media/quickstart-linux/iot-edge-list-2-version-1.4.png":::

View the messages being sent from the temperature sensor module:

   ```bash
   sudo iotedge logs SimulatedTemperatureSensor -f
   ```

   >[!TIP]
   >IoT Edge commands are case-sensitive when referring to module names.

   :::image type="content" source="./media/quickstart-linux/iot-edge-logs.png" alt-text="Screenshot that shows data from your module in the output console." lightbox="./media/quickstart-linux/iot-edge-logs.png":::

You can also watch the messages arrive at your IoT hub by using the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit).

## Clean up resources

If you want to continue on to the IoT Edge tutorials, you can use the device that you registered and set up in this quickstart. Otherwise, you can delete the Azure resources that you created to avoid charges.

If you created your virtual machine and IoT hub in a new resource group, you can delete that group and all the associated resources. Double check the contents of the resource group to make sure that there's nothing you want to keep. If you don't want to delete the whole group, you can delete individual resources instead.

> [!IMPORTANT]
> Deleting a resource group is irreversible.

Remove the **IoTEdgeResources** group. It might take a few minutes to delete a resource group.

```azurecli-interactive
az group delete --name IoTEdgeResources --yes
```

You can confirm the resource group is removed by viewing the list of resource groups.

```azurecli-interactive
az group list
```

## Next steps

In this quickstart, you created an IoT Edge device and used the Azure IoT Edge cloud interface to deploy code onto the device. Now, you have a test device generating raw data about its environment.

In the next tutorial, you'll learn how to monitor the activity and health of your device from the Azure portal.

> [!div class="nextstepaction"]
> [Monitor IoT Edge devices](tutorial-monitor-with-workbooks.md)
