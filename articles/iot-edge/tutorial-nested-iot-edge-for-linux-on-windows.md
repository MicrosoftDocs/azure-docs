---
title: Tutorial - Create a hierarchy of IoT Edge devices - Azure IoT Edge for Linux on Windows
description: This tutorial shows you how to create a hierarchical structure of IoT Edge devices using gateways.
author: PatAltimore

ms.author: fcabrera
ms.date: 11/15/2022
ms.topic: tutorial
ms.service: iot-edge
---

# Tutorial: Create a hierarchy of IoT Edge devices using IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

Deploy Azure IoT Edge nodes across networks organized in hierarchical layers. Each layer in a hierarchy is a gateway device that handles messages and requests from devices in the layer beneath it.

You can structure a hierarchy of devices so that only the top layer has connectivity to the cloud, and the lower layers can only communicate with adjacent north and south layers. This network layering is the foundation of most industrial networks, which follow the [ISA-95 standard](https://en.wikipedia.org/wiki/ANSI/ISA-95).

The goal of this tutorial is to create a hierarchy of IoT Edge devices that simulates a simplified production environment. At the end, you'll deploy the [Simulated Temperature Sensor module](https://azuremarketplace.microsoft.com/marketplace/apps/azure-iot.simulated-temperature-sensor) to a lower layer device without internet access by downloading container images through the hierarchy.

To accomplish this goal, this tutorial walks you through creating a hierarchy of IoT Edge devices using IoT Edge for Linux on Windows, deploying IoT Edge runtime containers to your devices, and configuring your devices locally. In this tutorial, you use an automated configuration tool to:

> [!div class="checklist"]
>
> * Create and define the relationships in a hierarchy of IoT Edge devices.
> * Configure the IoT Edge runtime on the devices in your hierarchy.
> * Install consistent certificates across your device hierarchy.
> * Add workloads to the devices in your hierarchy.
> * Use the [IoT Edge API Proxy module](https://azuremarketplace.microsoft.com/marketplace/apps/azure-iot.azureiotedge-api-proxy?tab=Overview) to securely route HTTP traffic over a single port from your lower layer devices.

>[!TIP]
>This tutorial includes a mixture of manual and automated steps to provide a showcase of nested IoT Edge features.
>
>If you would like an entirely automated look at setting up a hierarchy of IoT Edge devices, you guide your own script based on the scripted [Azure IoT Edge for Industrial IoT sample](https://aka.ms/iotedge-nested-sample). This scripted scenario deploys Azure virtual machines as preconfigured devices to simulate a factory environment.
>
>If you would like an in-depth look at the manual steps to create and manage a hierarchy of IoT Edge devices, see [the how-to guide on IoT Edge device gateway hierarchies](how-to-connect-downstream-iot-edge-device.md).

In this tutorial, the following network layers are defined:

* **Top layer**: IoT Edge devices at this layer can connect directly to the cloud.

* **Lower layers**: IoT Edge devices at layers below the top layer can't connect directly to the cloud. They need to go through one or more intermediary IoT Edge devices to send and receive data.

This tutorial uses a two device hierarchy for simplicity, pictured below. One device, the **top layer device**, represents a device at the top layer of the hierarchy, which can connect directly to the cloud. This device will also be referred to as the **parent device**. The other device, the **lower layer device**, represents a device at the lower layer of the hierarchy, which can't connect directly to the cloud. You can add more lower layer devices to represent your production environment, as needed. Devices at lower layers will also be referred to as **child devices**.

![Diagram that shows the structure of the tutorial hierarchy, containing two devices: the top layer device and the lower layer device.](./media/tutorial-nested-iot-edge/tutorial-hierarchy-diagram.png)

>[!NOTE]
>A downstream device emits data directly to the Internet or to gateway devices (IoT Edge-enabled or not). A child device can be a downstream device or a gateway device in a nested topology.

## Prerequisites

To create a hierarchy of IoT Edge devices, you'll need:

* Two Windows devices running Azure IoT Edge for Linux on Windows. Both devices should be deployed using an **external virtual switch**.

> [!TIP]
> It is possible to use **internal** or **default** virtual switch if a port forwarding is configured on the Windows host OS. However, for the simplicity of this tutorial, both devices should use an **external** virtual switch and be connected to the same external network. 
>
> For more information about netowrking, see [Azure IoT Edge for Linux on Windows networking](./iot-edge-for-linux-on-windows-networking.md) and [Networking configuration for Azure IoT Edge for Linux on Windows](./how-to-configure-iot-edge-for-linux-on-windows-networking.md).
>
> If you need to set up the EFLOW devices on a DMZ, see [How to configure Azure IoT Edge for Linux on Windows Industrial IoT & DMZ configuration](how-to-configure-iot-edge-for-linux-on-windows-iiot-dmz.md).

* An Azure account with a valid subscription. If you don't have an [Azure subscription](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/) before you begin.
* A free or standard tier [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.
* Make sure that the following ports are open inbound for all devices except the lowest layer device: 443, 5671, 8883:
  * 443: Used between parent and child edge hubs for REST API calls and to pull docker container images.
  * 5671, 8883: Used for AMQP and MQTT.

> [!TIP]
> For more information on EFLOW virtual machine firewall, see [IoT Edge for Linux on Windows security](iot-edge-for-linux-on-windows-security.md).

## Configure your IoT Edge device hierarchy

### Create a hierarchy of IoT Edge devices

IoT Edge devices make up the layers of your hierarchy. This tutorial will create a hierarchy of two IoT Edge devices: the **top layer device** and its downstream, the **lower layer device**. You can create additional downstream devices as needed.

To create and configure your hierarchy of IoT Edge devices, you'll use the `iotedge-config` tool. This tool simplifies the configuration of the hierarchy by automating and condensing several steps into two:

1. Setting up the cloud configuration and preparing each device configuration, which includes:

   * Creating devices in your IoT Hub
   * Setting the parent-child relationships to authorize communication between devices
   * Generating a chain of certificates for each device to establish secure communication between them
   * Generating configuration files for each device

1. Installing each device configuration, which includes:

   * Installing certificates on each device
   * Applying the configuration files for each device

The `iotedge-config` tool will also make the module deployments to your IoT Edge device automatically.

To use the `iotedge-config` tool to create and configure your hierarchy, follow the steps below in the **top layer IoT Edge for Linux on Windows device**:

1. Log in to [Azure Bash Shell](../cloud-shell/quickstart.md) and start a new bash session.

1. Make a directory for your tutorial's resources:

   ```bash
   mkdir nestedIotEdgeTutorial
   ```

1. Download the release of the configuration tool and configuration templates:

   ```bash
   cd ~/nestedIotEdgeTutorial
   wget -O iotedge_config.tar "https://github.com/Azure-Samples/iotedge_config_cli/releases/download/latest/iotedge_config_cli.tar.gz"
   tar -xvf iotedge_config.tar
   ```

   This will create the `iotedge_config_cli_release` folder in your tutorial directory.

   The template file used to create your device hierarchy is the `iotedge_config.yaml` file found in `~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial`. In the same directory, `deploymentLowerLayer.json` is a JSON deployment file containing instructions for which modules to deploy to your **lower layer device**. The `deploymentTopLayer.json` file is the same, but for your **top layer device**, as the modules deployed to each device aren't the same. The `device_config.toml` file is a template for IoT Edge device configurations and will be used to automatically generate the configuration bundles for the devices in your hierarchy.

   If you'd like to take a look at the source code and scripts for the `iotedge-config` tool, check out [the Azure-Samples repository on GitHub](https://github.com/Azure-Samples/iotedge_config_cli).

1. Open the tutorial configuration template and edit it with your information:

   ```bash
   code ~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial/iotedge_config.yaml
   ```

   In the **iothub** section, populate the `iothub_hostname` and `iothub_name` fields with your information. This information can be found on the overview page of your IoT Hub on the Azure portal.

   In the optional **certificates** section, you can populate the fields with the absolute paths to your certificate and key. If you leave these fields blank, the script will automatically generate self-signed test certificates for your use. If you're unfamiliar with how certificates are used in a gateway scenario, check out [the how-to guide's certificate section](how-to-connect-downstream-iot-edge-device.md#generate-certificates).

   In the **configuration** section, the `template_config_path` is the path to the `device_config.toml` template used to create your device configurations. The `default_edge_agent` field determines what Edge Agent image lower layer devices will pull and from where.

   In the **edgedevices** section, for a production scenario, you can edit the hierarchy tree to reflect your desired structure. For the purposes of this tutorial, accept the default tree. For each device, there's a `device_id` field, where you can name your devices. There's also the `deployment` field, which specifies the path to the deployment JSON for that device.

   You can also manually register IoT Edge devices in your IoT Hub through the Azure portal, Azure Cloud Shell, or Visual Studio Code. To learn how, see [the beginning of the end-to-end guide on manually provisioning a Linux IoT Edge device](how-to-provision-single-device-linux-symmetric.md#register-your-device).

   You can define the parent-child relationships manually as well. See the [create a gateway hierarchy](how-to-connect-downstream-iot-edge-device.md#create-a-gateway-hierarchy) section of the how-to guide to learn more.

   ![Screenshot of the edgedevices section of the configuration file allows you to define your hierarchy.](./media/tutorial-nested-iot-edge/hierarchy-config-sample.png)

1. Save and close the file:

   `CTRL + S`, `CTRL + Q`

1. Create an outputs directory for the configuration bundles in your tutorial resources directory:

   ```bash
   mkdir ~/nestedIotEdgeTutorial/iotedge_config_cli_release/outputs
   ```

1. Navigate to your `iotedge_config_cli_release` directory and run the tool to create your hierarchy of IoT Edge devices:

   ```bash
   cd ~/nestedIotEdgeTutorial/iotedge_config_cli_release
   ./iotedge_config --config ~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial/iotedge_config.yaml --output ~/nestedIotEdgeTutorial/iotedge_config_cli_release/outputs -f
   ```

   With the `--output` flag, the tool creates the device certificates, certificate bundles, and a log file in a directory of your choice. With the `-f` flag set, the tool will automatically look for existing IoT Edge devices in your IoT Hub and remove them, to avoid errors and keep your hub clean.

   The configuration tool creates your IoT Edge devices and sets up the parent-child relationships between them. Optionally, it creates certificates for your devices to use. If paths to deployment JSONs are provided, the tool will automatically create these deployments to your devices, but this isn't required. Finally, the tool will generate the configuration bundles for your devices and place them in the output directory. For a thorough look at the steps taken by the configuration tool, see the log file in the output directory.

   ![Screenshot of the output of the script will display a topology of your hierarchy upon execution.](./media/tutorial-nested-iot-edge/successful-setup-tool-run.png)

1. Navigate to your `output` directory and download the _lower-layer.zip_ and _top-layer.zip_ files. 
   ```bash
   download ~/nestedIotEdgeTutorial/iotedge_config_cli_release/outputs/lower-layer.zip
   download ~/nestedIotEdgeTutorial/iotedge_config_cli_release/outputs/top-layer.zip
   ```
Double-check that the topology output from the script looks correct. Once you're satisfied your hierarchy is correctly structured, you're ready to proceed.

### Configure the IoT Edge runtime

In addition to the provisioning of your devices, the configuration steps establish trusted communication between the devices in your hierarchy using the certificates you created earlier. The steps also begin to establish the network structure of your hierarchy. The top layer device will maintain internet connectivity, allowing it to pull images for its runtime from the cloud, while lower layer devices will route through the top layer device to access these images.

To configure the IoT Edge runtime, you need to apply the configuration bundles created by the setup script to your devices. The configurations slightly differ between the **top layer device** and a **lower layer device**, so be mindful of which device's configuration file you're applying to each device.

Each device needs its corresponding configuration bundle. You can use a USB drive or [secure file copy](https://www.ssh.com/ssh/scp/) to move the configuration bundles to each device. You'll first need to copy the configuration bundle to the Windows host OS of each EFLOW device and then copy it to the EFLOW VM. 

> [!WARNING]
> Be sure to send the correct configuration bundle to each device. 

##### Top-layer device configuration

1. Connect to your _top-level_ Windows host device and copy the _lower-layer.zip_ file. 

1. Unzip the _top-layer.zip_ configuration bundle and check that all data was correctly configured.

1. Start an elevated _PowerShell_ session using **Run as Administrator**.

1. Move to the _top-layer_ directory

1.  Copy all the content of the _top-layer_ directory into the EFLOW VM
    ```powershell
    Copy-EflowVmFile -fromFile *.* -tofile ~/ -pushFile
    ```

1. Connect to your EFLOW virtual machine
    ```powershell
    Connect-EflowVm
    ```

1. Get the EFLOW virtual machine IP address - Check for the _inet addr_ field.

    ```bash
    ifconfig eth0
    ```

    > [!NOTE]
    > On the **top layer device**, you will receive a prompt to enter the hostname. Supply the appropriate IP or FQDN. You can use either, but be consistent in your choice across devices. 

1. Run the _install.sh_ script - When asked the _hostname_ use the IP address obtained in the previous step.
   ```bash
   sudo sh ./install.sh
   ```
   The output of the install script is pictured below.
   
   ![Screenshot of the output of the script installing the configuration bundles will update the config.toml files on your device and restart all IoT Edge services automatically.](./media/tutorial-nested-iot-edge/configuration-install-output.png)

1. Apply the correct certificate permissions and restart the IoT Edge runtime.

   ```bash
   sudo chmod -R 755 /etc/aziot/certificates/
   sudo iotedge system restart
   ```

1. Check that all IoT Edge services are running correctly. 

    ```bash
    sudo iotedge system status
    ```

1. Finally, add the appropriate firewall rules to enable connectivity between the lower-layer device and top-layer device.

    ```bash
    sudo iptables -A INPUT -p tcp --dport 5671 -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 8883 -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
    sudo iptables -A INPUT -p icmp --icmp-type 8 -s 0/0 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
    sudo iptables-save | sudo tee /etc/systemd/scripts/ip4save
    ```

1. Run the configuration and connectivity checks on your devices.

    ```bash
    sudo iotedge check
    ```

    >[!NOTE]
    >On a newly provisioned device, you may see an error related to IoT Edge Hub:
    >
    >**× production readiness: Edge Hub's storage directory is persisted on the host filesystem - Error**
    >
    >**Could not check current state of edgeHub container**
    >
    >This error is expected on a newly provisioned device because the IoT Edge Hub module isn't running. To resolve the error, in IoT Hub, set the modules for the device and create a deployment. Creating a deployment for the device starts the modules on the device including the IoT Edge Hub module.

If you want a closer look at what modifications are being made to your device's configuration file, see [the configure IoT Edge on devices section of the how-to guide](how-to-connect-downstream-iot-edge-device.md#configure-parent-device).

##### Lower-layer device configuration

1. Connect to your lower level Windows host device and copy the _lower-layer.zip_ file. 

1. Unzip the _lower-layer.zip_ configuration bundle and check that all data was correctly configured.

1. Start an elevated _PowerShell_ session using **Run as Administrator**.

1. Move to the _lower-layer_ directory

1.  Copy all the content of the _top-layer_ directory into the EFLOW VM
    ```powershell
    Copy-EflowVmFile -fromFile *.* -tofile ~/ -pushFile
    ```

1. Connect to your EFLOW virtual machine
    ```powershell
    Connect-EflowVm
    ```

1. Check you can ping the EFLOW VM top-layer device using either the FQDN or IP, based on what you used as the _hostname_ configuration. 
    ```powershell
    ping <top-layer-device-hostname>
    ```

    If everything was correctly configured, you should be able to see the ping responses from the top-layer device. 

1. Get the EFLOW virtual machine IP address - Check for the _inet addr_ field.

    ```bash
    ifconfig eth0
    ```

    >[!NOTE]
    > On the **lower layer device**, you will receive a prompt to enter the hostname and the parent hostname. Supply the appropriate **top-layer device** IP or FQDN. You can use either, but be consistent in your choice across devices.sudo

1. Run the _install.sh_ script - When asked the _hostname_ use the IP address obtained in the previous step.
    ```bash
    sudo sh ./install.sh
    ```

1. Apply the correct certificate permissions and restart the IoT Edge runtime.
    ```bash
    sudo chmod -R 755 /etc/aziot/certificates/
    sudo iotedge system restart
    ```

1. Check that all IoT Edge services are running correctly. 
    ```bash
    sudo iotedge system status
    ```

1. Run the configuration and connectivity checks on your devices. For the **lower layer device**, the diagnostics image needs to be manually passed in the command:

    ```bash
    sudo iotedge check --diagnostics-image-name <parent_device_fqdn_or_ip>:443/azureiotedge-diagnostics:1.2
    ```

If you completed the above steps correctly, you can check your devices are configured correctly. Once you're satisfied your configurations are correct on each device, you're ready to proceed.

## Deploy modules to your devices

The module deployments to your devices were automatically generated when the devices were created. The `iotedge-config-cli` tool fed deployment JSONs for the **top and lower layer devices** after they were created. The module deployment were pending while you configured the IoT Edge runtime on each device. Once you configured the runtime, the deployments to the **top layer device** began. After those deployments completed, the **lower layer device** could use the **IoT Edge API Proxy** module to pull its necessary images.

In the [Azure Cloud Shell](https://shell.azure.com/), you can take a look at the **top layer device's** deployment JSON to understand what modules were deployed to your device:

   ```bash
   cat ~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial/deploymentTopLayer.json
   ```

In addition the runtime modules **IoT Edge Agent** and **IoT Edge Hub**, the **top layer device** receives the **Docker registry** module and **IoT Edge API Proxy** module.

The **Docker registry** module points to an existing Azure Container Registry. In this case, `REGISTRY_PROXY_REMOTEURL` points to the Microsoft Container Registry. By default, **Docker registry** listens on port 5000.

The **IoT Edge API Proxy** module routes HTTP requests to other modules, allowing lower layer devices to pull container images or push blobs to storage. In this tutorial, it communicates on port 443 and is configured to send Docker container image pull requests route to your **Docker registry** module on port 5000. Also, any blob storage upload requests route to module AzureBlobStorageonIoTEdge on port 11002. For more information about the **IoT Edge API Proxy** module and how to configure it, see the module's [how-to guide](how-to-configure-api-proxy-module.md).

If you'd like a look at how to create a deployment like this through the Azure portal or Azure Cloud Shell, see [top layer device section of the how-to guide](how-to-connect-downstream-iot-edge-device.md#deploy-modules-to-top-layer-devices).

In the [Azure Cloud Shell](https://shell.azure.com/), you can take a look at the **lower layer device's** deployment JSON to understand what modules were deployed to your device:

   ```bash
   cat ~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial/deploymentLowerLayer.json
   ```

You can see under `systemModules` that the **lower layer device's** runtime modules are set to pull from `$upstream:443`, instead of `mcr.microsoft.com`, as the **top layer device** did. The **lower layer device** sends Docker image requests the **IoT Edge API Proxy** module on port 443, as it can't directly pull the images from the cloud. The other module deployed to the **lower layer device**, the **Simulated Temperature Sensor** module, also makes its image request to `$upstream:443`.

If you'd like a look at how to create a deployment like this through the Azure portal or Azure Cloud Shell, see [lower layer device section of the how-to guide](how-to-connect-downstream-iot-edge-device.md#deploy-modules-to-lower-layer-devices).

You can view the status of your modules using the command:

   ```azurecli
   az iot hub module-twin show --device-id <edge_device_id> --module-id '$edgeAgent' --hub-name <iot_hub_name> --query "properties.reported.[systemModules, modules]"
   ```

   This command will output all the edgeAgent reported properties. Here are some helpful ones for monitoring the status of the device: *runtime status*, *runtime start time*, *runtime last exit time*, *runtime restart count*.

You can also see the status of your modules on the [Azure portal](https://portal.azure.com/). Navigate to the **Devices** section of your IoT Hub to see your devices and modules.

Once you're satisfied with your module deployments, you're ready to proceed.

## View generated data

The **Simulated Temperature Sensor** module that you pushed generates sample environment data. It sends messages that include ambient temperature and humidity, machine temperature and pressure, and a timestamp.

You can also view these messages through the [Azure Cloud Shell](https://shell.azure.com/):

   ```azurecli-interactive
   az iot hub monitor-events -n <iothub_name> -d <lower-layer-device-name>
   ```

## Troubleshooting

Run the `iotedge check` command to verify the configuration and to troubleshoot errors.

You can run `iotedge check` in a nested hierarchy, even if the downstream devices don't have direct internet access.

When you run `iotedge check` from the lower layer, the program tries to pull the image from the parent through port 443.

```bash
sudo iotedge check --diagnostics-image-name $upstream:443/azureiotedge-diagnostics:1.2
```

The `azureiotedge-diagnostics` value is pulled from the container registry that's linked with the registry module. This tutorial has it set by default to https://mcr.microsoft.com:

| Name | Value |
| - | - |
| `REGISTRY_PROXY_REMOTEURL` | `https://mcr.microsoft.com` |

If you're using a private container registry, make sure that all the images (IoTEdgeAPIProxy, edgeAgent, edgeHub, Simulated Temperature Sensor, and diagnostics) are present in the container registry.

## Clean up resources

You can delete the local configurations and the Azure resources that you created in this article to avoid charges.

To delete the resources:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

2. Select the name of the resource group that contains your IoT Edge test resources. 

3. Review the list of resources contained in your resource group. If you want to delete all of them, you can select **Delete resource group**. If you want to delete only some of them, you can click into each resource to delete them individually. 

## Next steps

In this tutorial, you configured two IoT Edge devices as gateways and set one as the parent device of the other. Then, you demonstrated pulling a container image onto the child device through a gateway using the IoT Edge API Proxy module. See [the how-to guide on the proxy module's use](how-to-configure-api-proxy-module.md) if you want to learn more.

To learn more about using gateways to create hierarchical layers of IoT Edge devices, see [the how-to guide on connecting downstream IoT Edge devices](how-to-connect-downstream-iot-edge-device.md).

To see how Azure IoT Edge can create more solutions for your business, continue on to the other tutorials.

> [!div class="nextstepaction"]
> [Deploy an Azure Machine Learning model as a module](tutorial-deploy-machine-learning.md)
