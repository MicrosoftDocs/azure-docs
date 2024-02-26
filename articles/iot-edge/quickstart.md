---
title: Quickstart to create an Azure IoT Edge device on Windows | Microsoft Docs
description: In this quickstart, learn how to create an IoT Edge device and then deploy prebuilt code remotely from the Azure portal.
author: PatAltimore
manager: lizross
ms.author: patricka
ms.reviewer: fcabrera
ms.date: 1/31/2023
ms.topic: quickstart
ms.service: iot-edge
services: iot-edge
ms.custom: mvc, devx-track-azurecli, mode-other
---

# Quickstart: Deploy your first IoT Edge module to a Windows device

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

Try out Azure IoT Edge in this quickstart by deploying containerized code to a Linux on Windows IoT Edge device. IoT Edge allows you to remotely manage code on your devices so that you can send more of your workloads to the edge. For this quickstart, we recommend using your own Windows Client device to see how easy it is to use Azure IoT Edge for Linux on Windows. If you wish to use Windows Server or an Azure VM to create your deployment, follow the steps in the how-to guide on [installing and provisioning Azure IoT Edge for Linux on a Windows device](how-to-provision-single-device-linux-on-windows-symmetric.md).

In this quickstart, you'll learn how to:

* Create an IoT hub.
* Register an IoT Edge device to your IoT hub.
* Install and start the IoT Edge for Linux on Windows runtime on your device.
* Remotely deploy a module to an IoT Edge device and send telemetry.

:::image type="content" source="./media/quickstart/install-edge-full.png" alt-text="Diagram that shows the architecture of this quickstart for your device and cloud.":::

This quickstart walks you through how to set up your Azure IoT Edge for Linux on Windows device. Then, you'll deploy a module from the Azure portal to your device. The module you'll use is a simulated sensor that generates temperature, humidity, and pressure data. Other Azure IoT Edge tutorials build on the work you do here by deploying modules that analyze the simulated data for business insights.

If you don't have an active Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

## Prerequisites

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

Create a cloud resource group to manage all the resources you'll use in this quickstart.

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus2
   ```

Make sure your IoT Edge device meets the following requirements:

* System Requirements
   * Windows 10<sup>1</sup>/11 (Pro, Enterprise, IoT Enterprise)
   <sub><sup>1</sup> Windows 10 minimum build 17763 with all current cumulative updates installed.</sub>

* Hardware requirements
  * Minimum Free Memory: 1 GB
  * Minimum Free Disk Space: 10 GB

## Create an IoT hub

Start by creating an IoT hub with the Azure CLI.

:::image type="content" source="./media/quickstart/create-iot-hub.png" alt-text="Diagram that shows the step to create an I o T hub.":::

The free level of Azure IoT Hub works for this quickstart. If you've used IoT Hub in the past and already have a hub created, you can use that IoT hub.

The following code creates a free **F1** hub in the resource group `IoTEdgeResources`. Replace `{hub_name}` with a unique name for your IoT hub. It might take a few minutes to create an IoT hub.

```azurecli-interactive
az iot hub create --resource-group IoTEdgeResources --name {hub_name} --sku F1 --partition-count 2
```

If you get an error because you already have one free hub in your subscription, change the SKU to `S1`. If you get an error that the IoT hub name isn't available, someone else already has a hub with that name. Try a new name.

## Register an IoT Edge device

Register an IoT Edge device with your newly created IoT hub.

:::image type="content" source="./media/quickstart/register-device.png" alt-text="Diagram that shows the step to register a device with an I o T hub identity.":::

Create a device identity for your simulated device so that it can communicate with your IoT hub. The device identity lives in the cloud, and you use a unique device connection string to associate a physical device to a device identity.

IoT Edge devices behave and can be managed differently than typical IoT devices. Use the `--edge-enabled` flag to declare that this identity is for an IoT Edge device.

1. In Azure Cloud Shell, enter the following command to create a device named **myEdgeDevice** in your hub.

     ```azurecli-interactive
     az iot hub device-identity create --device-id myEdgeDevice --edge-enabled --hub-name {hub_name}
     ```

     If you get an error about `iothubowner` policy keys, make sure that Cloud Shell is running the latest version of the Azure IoT extension.

1. View the connection string for your device, which links your physical device with its identity in IoT Hub. It contains the name of your IoT hub, the name of your device, and a shared key that authenticates connections between the two.

     ```azurecli-interactive
     az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name {hub_name}
     ```

1. Copy the value of the `connectionString` key from the JSON output and save it. This value is the device connection string. You'll use it to configure the IoT Edge runtime in the next section.

   :::image type="content" source="./media/quickstart/retrieve-connection-string.png" alt-text="Screenshot that shows the connectionString output in Cloud Shell." lightbox="./media/quickstart/retrieve-connection-string.png":::

## Install and start the IoT Edge runtime

Install IoT Edge for Linux on Windows on your device, and configure it with the device connection string.

:::image type="content" source="./media/quickstart/start-runtime.png" alt-text="Diagram that shows the step to start the I o T Edge runtime.":::

Run the following PowerShell commands on the target device where you want to deploy Azure IoT Edge for Linux on Windows. To deploy to a remote target device using PowerShell, use [Remote PowerShell](/powershell/module/microsoft.powershell.core/about/about_remote) to establish a connection to a remote device and run these commands remotely on that device.

1. In an elevated PowerShell session, run the following command to enable Hyper-V. For more information, check [Hyper-V on Windows 10](/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v).

   ```powershell
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
   ```

1. In an elevated PowerShell session, run each of the following commands to download IoT Edge for Linux on Windows.

   * **X64/AMD64**
      ```powershell
      $msiPath = $([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))
      $ProgressPreference = 'SilentlyContinue'
      Invoke-WebRequest "https://aka.ms/AzEFLOWMSI_1_4_LTS_X64" -OutFile $msiPath
      ```

   * **ARM64**
      ```powershell
      $msiPath = $([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))
      $ProgressPreference = 'SilentlyContinue'
      Invoke-WebRequest "https://aka.ms/AzEFLOWMSI_1_4_LTS_ARM64" -OutFile $msiPath
      ```

1. Install IoT Edge for Linux on Windows on your device.

   ```powershell
   Start-Process -Wait msiexec -ArgumentList "/i","$([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))","/qn"
   ```

1. Set the execution policy on the target device to `AllSigned` if it is not already. You can check the current execution policy in an elevated PowerShell prompt using:

   ```powershell
   Get-ExecutionPolicy -List
   ```

   If the execution policy of `local machine` is not `AllSigned`, you can set the execution policy using:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy AllSigned -Force
   ```

1. Create the IoT Edge for Linux on Windows deployment.

   ```powershell
   Deploy-Eflow
   ```

1. Enter 'Y' to accept the license terms.

1. Enter 'O' or 'R' to toggle **Optional diagnostic data** on or off, depending on your preference. A successful deployment is pictured below.

   :::image type="content" source="./media/quickstart/successful-powershell-deployment.png" alt-text="Screenshot that show that a successful deployment will say Deployment successful at the end of the messages in the console." lightbox="./media/quickstart/successful-powershell-deployment.png":::

1. Provision your device using the device connection string that you retrieved in the previous section. Replace the placeholder text with your own value.

   ```powershell
   Provision-EflowVm -provisioningType ManualConnectionString -devConnString "<CONNECTION_STRING_HERE>"
   ```

Your IoT Edge device is now configured. It's ready to run cloud-deployed modules.

## Deploy a module

Manage your Azure IoT Edge device from the cloud to deploy a module that sends telemetry data to IoT Hub.

:::image type="content" source="./media/quickstart/deploy-module.png" alt-text="Diagram that shows the step to deploy a module.":::

One of the key capabilities of Azure IoT Edge is deploying code to your IoT Edge devices from the cloud. *IoT Edge modules* are executable packages implemented as containers. In this section, you'll deploy a pre-built module from the [IoT Edge Modules section of Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1&subcategories=iot-edge-modules) directly from Azure IoT Hub.

The module that you deploy in this section simulates a sensor and sends generated data. This module is a useful piece of code when you're getting started with IoT Edge because you can use the simulated data for development and testing. If you want to see exactly what this module does, you can view the [simulated temperature sensor source code](https://github.com/Azure/iotedge/blob/027a509549a248647ed41ca7fe1dc508771c8123/edge-modules/SimulatedTemperatureSensor/src/Program.cs).

Follow these steps to deploy your first module from Azure Marketplace.

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your IoT hub.

1. From the menu on the left, select **Devices** under the **Device management** menu.

1. Select the device ID of the target device from the list of devices.

   >[!NOTE]
   >When you create a new IoT Edge device, it will display the status code `417 -- The device's deployment configuration is not set` in the Azure portal. This status is normal, and means that the device is ready to receive a module deployment.


1. On the upper bar, select **Set Modules**.

   :::image type="content" source="./media/quickstart-linux/select-set-modules.png" alt-text="Screenshot that shows location of the Set Modules tab.":::

1. Under **IoT Edge Modules**, open the **Add** drop-down menu, and then select **Marketplace Module**.

   :::image type="content" source="./media/quickstart-linux/add-marketplace-module.png" alt-text="Screenshot that shows the Add drop-down menu." lightbox="./media/quickstart-linux/add-marketplace-module.png":::

1. In **IoT Edge Module Marketplace**, search for and select the `Simulated Temperature Sensor` module.

   The module is added to the IoT Edge Modules section with the desired **running** status.

1. Select **Next: Routes** to continue to the next step of the wizard.

   :::image type="content" source="./media/quickstart-linux/view-temperature-sensor-next-routes.png" alt-text="Screenshot that shows where to select the Next:Routes button.":::

1. On the **Routes** tab select **Next: Review + create** to continue to the next step of the wizard.

   :::image type="content" source="./media/quickstart/route-next-review-create.png" alt-text="Screenshot that shows the location of the Next: Review + create button.":::

1. Review the JSON file in the **Review + create** tab. The JSON file defines all of the modules that you deploy to your IoT Edge device. You'll see the **SimulatedTemperatureSensor** module and the two runtime modules, **edgeAgent** and **edgeHub**.

   >[!Note]
   >When you submit a new deployment to an IoT Edge device, nothing is pushed to your device. Instead, the device queries IoT Hub regularly for any new instructions. If the device finds an updated deployment manifest, it uses the information about the new deployment to pull the module images from the cloud then starts running the modules locally. This process can take a few minutes.

1. Select **Create** to deploy.

1. After you create the module deployment details, the wizard returns you to the device details page. View the deployment status on the **Modules** tab.

   You should see three modules: **$edgeAgent**, **$edgeHub**, and **SimulatedTemperatureSensor**. If one or more of the modules has **Yes** under **Specified in Deployment** but not under **Reported by Device**, your IoT Edge device is still starting them. Wait a few minutes, and then refresh the page.

   :::image type="content" source="./media/quickstart-linux/view-deployed-modules.png" alt-text="Screenshot that shows Simulated Temperature Sensor in the list of deployed modules." lightbox="./media/quickstart-linux/view-deployed-modules.png":::

## View the generated data

In this quickstart, you created a new IoT Edge device and installed the IoT Edge runtime on it. Then you used the Azure portal to deploy an IoT Edge module to run on the device without having to make changes to the device itself.

The module that you pushed generates sample environment data that you can use for testing later. The simulated sensor is monitoring both a machine and the environment around the machine. For example, this sensor might be in a server room, on a factory floor, or on a wind turbine. The messages that it sends include ambient temperature and humidity, machine temperature and pressure, and a timestamp. IoT Edge tutorials use the data created by this module as test data for analytics.

1. Log in to your IoT Edge for Linux on Windows virtual machine using the following command in your PowerShell session:

   ```powershell
   Connect-EflowVm
   ```

   >[!NOTE]
   >The only account allowed to SSH to the virtual machine is the user that created it.

1. Once you are logged in, you can check the list of running IoT Edge modules using the following Linux command:

   ```bash
   sudo iotedge list
   ```

   :::image type="content" source="./media/quickstart/iot-edge-list-screen.png" alt-text="Screenshot that shows where to verify that your temperature sensor, agent, and hub modules are running." lightbox="./media/quickstart/iot-edge-list-screen.png":::

1. View the messages being sent from the temperature sensor module to the cloud using the following Linux command:

   ```bash
   sudo iotedge logs SimulatedTemperatureSensor -f
   ```

   >[!IMPORTANT]
   >IoT Edge commands are case-sensitive when they refer to module names.

   :::image type="content" source="./media/quickstart/temperature-sensor-screen.png" alt-text="Screenshot that shows the output logs of the Simulated Temperature Sensor module when it's running." lightbox="./media/quickstart/temperature-sensor-screen.png":::

You can also use the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) to watch messages arrive at your IoT hub.

## Clean up resources

If you want to continue on to the IoT Edge tutorials, skip this step. You can use the device that you registered and set up in this quickstart. Otherwise, you can delete the Azure resources that you created to avoid charges.

If you created your virtual machine and IoT hub in a new resource group, you can delete that group and all the associated resources. If you don't want to delete the whole group, you can delete individual resources instead.

> [!IMPORTANT]
> Check the contents of the resource group to make sure that there's nothing you want to keep. Deleting a resource group is irreversible.

Use the following command to remove the **IoTEdgeResources** group. Deletion might take a few minutes.

```azurecli-interactive
az group delete --name IoTEdgeResources
```

You can confirm that the resource group is removed by using this command to view the list of resource groups.

```azurecli-interactive
az group list
```

<!-- Uninstall IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [uninstall-iot-edge-linux-on-windows.md](includes/iot-edge-uninstall-linux-on-windows.md)]

## Next steps

In this quickstart, you created an IoT Edge device and used the Azure IoT Edge cloud interface to deploy code onto the device. Now you have a test device generating raw data about its environment.

In the next tutorial, you'll learn how to monitor the activity and health of your device from the Azure portal.

> [!div class="nextstepaction"]
> [Monitor IoT Edge devices](tutorial-monitor-with-workbooks.md)
