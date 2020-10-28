---
title: Tutorial - Create a gateway for a downstream IoT Edge device - Azure IoT Edge
description: This tutorial shows you how to create a hierarchical structure of IoT Edge devices using gateways.
author: v-tcassi
manager: philmea
ms.author: v-tcassi
ms.date: 10/27/2020
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
---

# Tutorial: Create a hierarchy of IoT Edge devices using gateways (Preview)

Deploy Azure IoT Edge nodes across networks organized in hierarchical layers.

>[!NOTE]
>This feature requires IoT Edge version 1.2, which is in public preview.

You can structure a hierarchy of devices so that only the top layer has connectivity to the cloud, and the lower layers can only communicate with adjacent north and south layers. This network configuration is typical of manufacturing environments, which follow the [ISA-95 standard](https://en.wikipedia.org/wiki/ANSI/ISA-95).

The goal of this tutorial is to create a hierarchy of IoT Edge devices that simulates a realistic production environment. At the end, you will deploy a Simulated Temperature sensor to a lower layer device without internet access using proxy modules to securely direct an image pull request through the top layer of your hierarchy, which will have access to the cloud.

To accomplish this goal, this tutorial walks you through creating a hierarchy of IoT Edge devices, deploying IoT Edge runtime containers to your devices, and configuring your devices locally. In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create and define the relationships in a hierarchy of IoT Edge devices.
> * Configure the IoT Edge runtime on the devices in your hierarchy.
> * Add workloads to the devices in your hierarchy.
> * Install consistent certificates across your device hierarchy.
> * Use API proxy modules to securely route traffic from your lower layer devices.

In this tutorial, the following network layers are defined:

* **Top layer**: IoT Edge devices at this layer can connect directory to the cloud.

* **Lower layer**: IoT Edge devices at this layer cannot connect directly to the cloud. They need to use an API proxy module to go through one more intermediary IoT Edge devices to send and receive data.

This tutorial uses a two device hierarchy for simplicity. One device, **topLayer_device**, represents a device at the top layer of the hierarchy, which can connect directly to the cloud. This device will also be referred to as the **parent device**. The other device, **lowerLayer_device**, represents a device at the lower layer of the hierarchy, which cannot connect directly to the cloud. This device will also be referred to as the **child device**. You can add additional lower layer devices to represent your production environment. The configuration of any additional lower layer devices will follow **lowerLayer_device**'s configuration.

## Prerequisites

To create a hierarchy of IoT Edge devices, you will need:

* A computer (Windows or Linux) with internet connectivity.

* Two Linux devices to configure as IoT Edge devices.

* An Azure account with a valid subscription. If you don't have an [Azure subscription](https://docs.microsoft.com/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/) before you begin.

* A free or standard tier [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.

* Azure CLI with the Azure IoT extension installed. This tutorial uses the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). If you're unfamiliar with the Azure Cloud Shell, [check out a quickstart for details](https://docs.microsoft.com/azure/iot-edge/quickstart-linux#use-azure-cloud-shell).

## Configure your IoT Edge device hierarchy in IoT Hub

Configuring your IoT Edge device hierarchy consists of three main steps:

1. Creating the devices and defining the parent-child relationships between them.

2. Deploying the IoT Edge runtime containers to the devices in your hierarchy.

3. Deploying workloads to the device in your hierarchy.

### Create a hierarchy of IoT Edge devices

The first step, creating your IoT Edge devices, can be done through the Azure portal or Azure CLI. This tutorial will create a hierarchy of two IoT Edge devices: **topLayer_device** and its child **lowerLayer_device**.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://ms.portal.azure.com/), navigate to your IoT Hub.

2. From the menu on the left pane, under **Automatic Device Management**, select **IoT Edge**.

3. Select **+ Add an IoT Edge device**. This device will be the top layer device, so enter an appropriate unique device ID.

4. Select **+ Add an IoT Edge device** again. This device will be the edge lower layer device, so enter an appropriate unique device ID.

5. Click on the device ID of your top layer edge device. On the upper bar, select **Manage Child Devices**.

6. Select **+ Add** and select your the IoT Edge device you created to be the child.

# [Azure CLI](#tab/azure-cli)

1. In the [Azure Cloud Shell](https://shell.azure.com/), enter the following command to create an edge device in your hub. This device will be the edge top layer device, so enter an appropriate unique device ID:

   ```azurecli-interactive
   az iot hub device-identity create --device-id {device_id} --edge-enabled --hub-name {hub_name}
   ```

2. Use the same command again to create another edge device. This device will be the child edge device, so enter an appropriate unique device ID:

3. Enter the following command to add your child edge device to your parent edge device.

    ```azurecli-interactive
    az iot hub device-identity add-children -d {edge_device_id} --child-list {comma_separated_edge_device_id} -n {iothub_name}
    ```

---

Make note of each IoT Edge device's connection string. They will be used later.

# [Portal](#tab/azure-portal)

1. Navigate to the **IoT Edge** section of your IoT Hub.

2. Click on the device ID of one of the devices in the list of devices.

3. Select **Copy** on the **Primary Connection String** field and record it in a place of your choice.

4. Repeat for all other devices.

# [Azure CLI](#tab/azure-cli)

1. For each device, enter the following command to retrieve the connection string of your device and record it in a place of your choice:

   ```azurecli-interactive
   az iot hub device-identity connection-string show --device-id {device_id} --hub-name {hub_name}
   ```

---

### Create certificates

All devices in a gateway scenario need a shared certificate that they can use to set up secure connections between them. Use the steps in these sections to create demo certificates for both devices in this scenario.

To create demo certificates on a Linux device, you need clone the generation scripts and set them up to run locally in bash.

1. Clone the IoT Edge git repo, which contains scripts to generate demo certificates.

   ```bash
   git clone https://github.com/Azure/iotedge.git
   ```

1. Navigate to the directory in which you want to work. All certificate and key files will be created in this directory.
  
1. Copy the config and script files from the cloned IoT Edge repo into your working directory.

   ```bash
   cp <path>/iotedge/tools/CACertificates/*.cnf .
   cp <path>/iotedge/tools/CACertificates/certGen.sh .
   ```

1. Create the root CA certificate and one intermediate certificate.

   ```bash
   ./certGen.sh create_root_and_intermediate
   ```

   This script command creates several certificate and key files, but we are using the following file as the **root CA certificate** for the gateway hierarchy:

   * `<WRKDIR>/certs/azure-iot-test-only.root.ca.cert.pem`  

1. Create two sets of IoT Edge device CA certificates and private keys with the following command: one set for the top layer device and one set for the lower layer device. Provide memorable names for the CA certificates to distinguish them from each other.

   ```bash
   ./certGen.sh create_edge_device_ca_certificate "top-layer-device"
   ./certGen.sh create_edge_device_ca_certificate "lower-layer-device"
   ```

   This script command creates several certificate and key files, but we are using the following certificate and key pair on each IoT Edge device and referenced in the config.yaml file:

   * `<WRKDIR>/certs/iot-edge-device-<CA cert name>-full-chain.cert.pem`
   * `<WRKDIR>/private/iot-edge-device-<CA cert name>.key.pem`

The name passed to the **create_edge_device_certificate** command should not be the same as the hostname parameter in config.yaml, or the device's ID in IoT Hub.

Each device needs a copy of the root CA certificate and a copy of its own device CA certificate and private key. You can use a USB drive or [secure file copy](https://www.ssh.com/ssh/scp/) to move these to each device.

### Install IoT Edge on the devices

This tutorial uses two or more devices. One device is configured to be the **top layer** device that maintains a connection to the cloud on behalf of its downstream devices. One device is configured for **lower layers**, and routes all messages and requests through it parent device.

Install IoT Edge on both devices. If you don't have devices available, Azure virtual machines can be used. Follow these steps on each of the IoT Edge devices for this tutorial.

<!-- BUG BASH STEPS - Update for public preview -->

1. Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

1. Install the Moby engine.

   ```bash
   sudo apt-get install moby-engine
   ```

1. Install the hsmlib and IoT Edge daemon

   ```bash
   sudo wget -O libiothsm-std_public_preview_amd64.deb "https://iotedgeforiiot.blob.core.windows.net/iotedge-public-preview-assets/libiothsm-std_public_preview_amd64.deb"
   sudo wget -O iotedge_public_preview_amd64.deb "https://iotedgeforiiot.blob.core.windows.net/iotedge-public-preview-assets/iotedge_public_preview_amd64.deb"
   sudo dpkg -i libiothsm-std_public_preview_amd64.deb
   sudo dpkg -i iotedge_public_preview_amd64.deb
   ```

### Configure the IoT Edge runtime

1. On each device, open the IoT Edge configuration file.

   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

1. Find the provisioning configurations of the file and uncomment the **Manual provisioning configuration using a connection string** section.

1. Update the value of **device_connection_string** with the connection string from your IoT Edge device. Make sure any other provisioning sections are commented out. Make sure the **provisioning:** line has no preceding whitespace and that nested items are indented by two spaces.

   ```yml
   # Manual provisioning configuration using a connection string
   provisioning:
     source: "manual"
     device_connection_string: "<ADD DEVICE CONNECTION STRING HERE>"
     dynamic_reprovisioning: false
   ```

   >[!TIP]
   >To paste clipboard contents into Nano `Shift+Right Click` or press `Shift+Insert`.

1. Find the **certificates** section. Update the three certificate fields to point to the certificates that you created in the previous section and moved to the IoT Edge device. Provide the file URI paths, which take the format `file:///<path>/<filename>`.

   * **device_ca_cert**: File URI path to the device CA certificate unique to this device.
   * **device_ca_pk**: File URI path to the device CA private key unique to this device.
   * **trusted_ca_certs**: File URI path to the root CA certificate shared by all devices in the gateway hierarchy.

1. Find the **hostname** parameter. Update the value to be the fully qualified domain name (FQDN) or IP address of the IoT Edge device.

   ```yml
   hostname: <device fqdn or IP>
   ```

1. For IoT Edge devices in **lower layers**, update the config file to point to the FQDN or IP of the parent device, matching whatever is in the parent device's **hostname** field. For IoT Edge devices in the **top layer**, leave this parameter blank.

   ```yml
   parent_hostname: <parent device fqdn or IP>
   ```

1. Save and close the file.

   `CTRL + X`, `Y`, `Enter`

1. After entering the provisioning information in the configuration file, restart the daemon:

   ```bash
   sudo systemctl restart iotedge
   ```

## Deploy modules to the top layer device

The second step, deploying the **public preview** IoT Edge runtime to your devices, can be done through the Azure portal or Azure CLI. The IoT Edge runtime containers explicitly enable the nesting capability of the IoT Edge devices in your hierarchy.

In the [Azure portal](https://ms.portal.azure.com/):

1. Navigate to your IoT Hub.

1. From the menu on the left pane, under **Automatic Device Management**, select **IoT Edge**.

1. Click on the device ID of your top layer edge device in the list of devices.

1. On the upper bar, select **Set Modules**.

1. Provide the following registry credentials: <!-- BUG BASH STEPS - Update for public preview -->

   * **Name**: `iotedgeforiiotACR`
   * **Address**: `iotedgeforiiot.azurecr.io`
   * **Username**: `2ad19b50-7a8a-45c4-8d11-20636732495f`
   * **Password**: `bNi_CoTYr.VNugCZn1wTd_v09AJ6NPIM0_`

1. Select **Runtime Settings**, next to the gear icon.

1. Under **Edge Hub**, in the image field, enter `iotedgeforiiot.azurecr.io/azureiotedge-hub:public-preview`. Under **Edge Agent**, in the image field, enter `iotedgeforiiot.azurecr.io/azureiotedge-agent:public-preview`.<!-- BUG BASH STEPS - Update for public preview -->

1. Add the Docker registry module to your top layer device. Select **+ Add** and choose **IoT Edge Module** from the dropdown. Provide a name for your Docker registry module and enter `registry:latest` for the image URI.

1. Under the environment variables tab, enter the following environment variable name-value pair:

    | Name | Value |
    | - | - |
    | `REGISTRY_PROXY_REMOTEURL` | `https://mcr.microsoft.com` |

1. Under the container create options tab, enter the following JSON:

   ```json
   {
    "HostConfig": {
        "PortBindings": {
            "5000/tcp": [
                {
                    "HostPort": "5000"
                }
            ]
         }
      }
   }
   ```

    These settings point your registry module at mcr.microsoft.com and expose port 5000 as an address for Docker requests.

1. Next, add the API proxy module to your top layer device. Select **+ Add** and choose **IoT Edge Module** from the dropdown. Provide a name for your API proxy module and enter `mcr.microsoft.com/azureiotedge-api-proxy:latest` for the image URI.

1. Under the environment variables tab, enter the following environment variables name-value pairs:

    | Name | Value |
    | - | - |
    | `DOCKER_REQUEST_ROUTE_ADDRESS` | `{registry_module_name}:5000` |
    | `NGINX_DEFAULT_PORT` | `8000` |

1. Under the container create options tab, enter the following JSON:

   ```json
   {
    "HostConfig": {
        "PortBindings": {
            "8000/tcp": [
                {
                    "HostPort": "8000"
                }
            ]
         }
      }
   }
   ```

    These direct Docker requests to the port you opened on your registry module and expose port 8000 as an address for proxy modules to use.

1. Select **Save**, **Review + create**, and **Create** to complete the deployment. Your top layer device's IoT Edge runtime, which has access to the internet, will pull and run the **public preview** configs for IoT Edge hub and IoT Edge agent.

## Deploy modules to the lower layer device

In the [Azure portal](https://ms.portal.azure.com/):

1. Navigate to your IoT Hub.

1. From the menu on the left pane, under **Automatic Device Management**, select **IoT Edge**.

1. Click on the device ID of your lower layer device in the list of IoT Edge devices.

1. On the upper bar, select **Set Modules**.

1. Provide the following registry credentials:<!-- BUG BASH STEPS - Update for public preview -->

   * **Name**: `iotedgeforiiotACR`
   * **Address**: `iotedgeforiiot.azurecr.io`
   * **Username**: `2ad19b50-7a8a-45c4-8d11-20636732495f`
   * **Password**: `bNi_CoTYr.VNugCZn1wTd_v09AJ6NPIM0_`

1. Select **Runtime Settings**, next to the gear icon.

1. Under **Edge Hub**, in the image field, enter `iotedgeforiiot.azurecr.io/azureiotedge-hub:public-preview`. Under **Edge Agent**, in the image field, enter `iotedgeforiiot.azurecr.io/azureiotedge-agent:public-preview`.<!-- BUG BASH STEPS - Update for public preview -->

1. Add the temperature sensor module. Select **+ Add** and choose **IoT Edge Module** from the dropdown. Provide a name for your temperature sensor module and enter `$upstream:8000/azureiotedge-simulated-temperature-sensor:latest` for the image URI.

1. Select **Save**, **Review + create**, and **Create** to complete the deployment.

Notice that the image URI that we used for the simulated temperature sensor module pointed to `$upstream:8000` instead of to a container registry. Since this device is in a lower layer, it can't have direct connections to the cloud. To pull container images, this device requests the image from its parent device instead. At the top layer, the API proxy module routes this container request to the registry module which handles the image pull.

On the device details page for your lower layer IoT Edge device, you should now see the temperature sensor module listed along the system modules as **Specified in deployment**. It may take a few minutes for the device to receive its new deployment, request the container image, and start the module. Refresh the page until you see the temperature sensor module listed as **Reported by device**.

You can also watch the messages arrive at your IoT hub by using the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit).

## Clean up resources

You can delete the local configurations and the Azure resources that your created in this article to avoid charges.

[!INCLUDE [iot-edge-clean-up-cloud-resources](../../includes/iot-edge-clean-up-cloud-resources.md)]

## Next steps

In this tutorial, you configured two IoT Edge devices as gateways and set one as the parent device of the other. Then, you demonstrated pulling a container image onto the child device through a gateway.

To see how Azure IoT Edge can create more solutions for your business, continue on to the other tutorials.

> [!div class="nextstepaction"]
> [Deploy an Azure Machine Learning model as a module](tutorial-deploy-machine-learning.md)