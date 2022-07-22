---
title: Configure, connect, and verify an IoT Edge module with a GPU
description: Configure your environment to connect and verify your GPU to process modules from your IoT Edge device.
author: PatAltimore

ms.author: patricka
ms.date: 7/11/2022
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
---

# Tutorial: Configure, connect, and verify an IoT Edge module for a GPU

This tutorial shows you how to build a GPU-enabled virtual machine (VM). From the VM, you'll see how to run an IoT Edge device that allocates work from one of its modules to your GPU. 

We'll use the Azure portal, the Azure Cloud Shell, and your VM's command line to:
* build a GPU-capable VM
* install the [NVIDIA driver extension](/azure/virtual-machines/extensions/hpccompute-gpu-linux) on the VM
* configure a module on an IoT Edge device to allocate work to a GPU
* run a module to show that it's processing on the GPU

## Prerequisites

* Azure account - [create a free account](https://azure.microsoft.com/account/free)

* Azure resource group - [create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal)

* Azure IoT Hub - [create an IoT Hub](https://azure.microsoft.com/services/iot_hub)

* Azure IoT Edge device

### Create an IoT Edge device

If you don't already have an IoT Edge device and need to quickly create one, run the following command. Use the [Azure Cloud Shell](/azure/cloud-shell/overview) located in the Azure portal. Create a new device name for `<DEVICE-NAME>` and replace the IoT `<IOT-HUB-NAME>` with your own. 

```azurecli
az iot hub device-identity create --device-id <YOUR-DEVICE-NAME> --edge-enabled --hub-name <YOUR-IOT-HUB-NAME>
```

For more information on creating an IoT Edge device, see [Quickstart: Deploy your first IoT Edge module to a virtual Linux device](/quickstart-linux). Later in this tutorial, we'll add an NVIDIA module to our IoT Edge device.

## Create an NVIDIA-compatible virtual machine

To allocate processing power to your GPU, virtual machine (VM) size is important. Not all sizes will accommodate GPU processing. There are different sizes for different workloads. For more information, see [GPU optimized virtual machine sizes](/azure/virtual-machines/sizes-gpu) or [Virtual machines selector](https://azure.microsoft.com/pricing/vm-selector/).

Let's create a VM from the IoT Edge VM deployment repository in GitHub, then configure it to be GPU-enabled.

1. Go to the IoT Edge VM deploy repository in GitHub: [Azure/iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy/tree/1.3).

1. Select the **Deploy to Azure** button, which initiates a custom VM for you in the Azure portal. This VM is based on an [Azure Resource Manager (ARM)](/azure/azure-resource-manager/management/overview) template.

   :::image type="content" source="media/configure-connect-verify-gpu/deploy-to-azure-button.png" alt-text="Screenshot of the Deploy to Azure button in GitHub.":::

1. Fill out the **Custom deployment** fields with your Azure credentials and resources:

   | **Property**             | **Description or sample value**        |
   | :----------------------- | -------------------------------------- |
   | Subscription             | Choose your Azure account subscription.|
   | Resource group           | Add your Azure resource group.         |
   | Region                   | `East US` <br> GPU VMs aren't available in all regions of the US.                                                                 |
   | Dns Label Prefix         | Create a name for your VM.             |
   | Admin Username           | `adminUser` <br> Alternatively, create your own user name.                                                               |
   | Device Connection String | Copy your connection string from your IoT Edge device, then paste here.                                                               |
   | VM size                  | `Standard_NV6`                         |
   | Authentication type      | Choose either **password** or **SSH Public Key**, then create a password or key pair name if needed.                                                             |

   > [!TIP]
   >
   > Check which GPU VMs are supported in each region: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?regions=us-central,us-east,us-east-2,us-north-central,us-south-central,us-west-central,us-west,us-west-2,us-west-3&products=virtual-machines).
   >
   > To check [which region your Azure subscription allows](/azure/azure-resource-manager/troubleshooting/error-sku-not-available?tabs=azure-cli#solution), try this Azure command from the Azure portal. The `N` in `Standard_N` means it's a GPU-enabled VM.
   > ```azurecli
   > az vm list-skus --location <YOUR-REGION> --size Standard_N --all --output table
   > ```

1. Select the **Review + create** button at the bottom, then the **Create** button. Deployment will take a minute.

## Install the NVIDIA extension
Now that we have an NVIDIA-enabled VM, let's install the NVIDIA extension on it using the Azure portal.

1. Open your VM in the Azure portal and select **Extensions + applications** from the left menu.

1. Select the **+ Add** button and choose the **NVIDIA GPU Driver Extension** card in the list, then select **Next**.

1. Choose **Review + create**, then **Create**. The deployment could take up to 30 minutes to complete.

### Confirm successful installation & deployment

1. Go to **Extensions + applications** again in your VM. The extension should be in your extensions list and say **Provisioning succeeded** under **Status**.

1. To confirm that the `NvidiaGpuDriverLinux` is installed, run this command to list your extensions. Replace the `<>` placeholders with your values:

   ```
   az vm extension list --resource-group <YOUR-RESOURCE-GROUP> --vm-name <YOUR-VM-NAME> -o table
   ```

1. From your device, install the `nvidia-smi` library based on your version of Ubuntu. For this tutorial, we'll install `nvidia-utils-515` for Ubuntu 20.04. Select `Y` when prompted in the installation.

   ```bash
   sudo apt install nvidia-utils-515
   ```

   Here's a list of all `nvidia-smi` versions.

   :::image type="content" source="media/configure-connect-verify-gpu/nvidia-smi-versions.png" alt-text="Screenshot of all `nvidia-smi` versions.":::

1. After installation, run this command to confirm it's installed:
 
   ```bash
   nvidia-smi
   ```
 
   A confirmation table will appear, similar to this.

   :::image type="content" source="media/configure-connect-verify-gpu/nvidia-driver-installed.png" alt-text="Screenshot of the NVIDIA driver table.":::

## Enable a module with GPU acceleration

There are different ways to enable an IoT Edge module so that it uses a GPU for processing. One way is to configure an existing IoT Edge module on your device to become GPU-accelerated. Another way is to use a prefabricated container module, for example, a module from [NVIDIA DIGITS](https://developer.nvidia.com/digits) that's already GPU-enabled. Let's see how both ways are done.

### Enable GPU in an existing module, using DeviceRequests

If you have an existing module on your IoT Edge device, adding a configuration using `DeviceRequests` in `createOptions` of the deployment manifest will assign that module to use a GPU to process work. Follow these steps to configure an existing module.

1. Go to your IoT Hub in the Azure portal and choose **IoT Edge** from the **Device management** menu.

1. Select your device to open it.

1. Select the **Set modules** tab at the top.

1. Select the module you want to enable for GPU use in the **IoT Edge Modules** list.

1. A side panel opens, choose the **Container Create Options** tab.

1. Paste the `HostConfig` JSON string into the box provided.

   ```json
    {
        "HostConfig": {
            "DeviceRequests": 
            [
                {
                    "Count": -1,
                    "Capabilities": [
                        [
                            "gpu"
                        ]
                    ]
                }
            ]
        }
    }
   ```

1. Select **Update** at the bottom of the page.

1. Select **Review + create**. The new `HostConfig` object is now visible in the `settings` of your module.

1. Select **Create**.

1. To confirm the new configuration works, run this command from your VM:

   ```bash
   sudo docker inspect <YOUR-MODULE-NAME>
   ```

   You should see a non-null value for `DeviceRequests` printed in the console.

> [!NOTE]
> To understand the `DeviceRequests` parameter better, view the source code: [moby/host_config.go](https://github.com/moby/moby/blob/master/api/types/container/host_config.go)

### Enable a GPU in a prefabricated NVIDIA module

Let's add an NIVDIA module to the IoT Edge device and then allocate a GPU to the module by setting its environment variables. These NVIDIA modules are already in Docker containers. 

1. Select your IoT Edge device in the Azure portal from your IoT Hub's **IoT Edge** menu.

1. Select the **Set modules** tab at the top

1. Select **+ Add** under the IoT Edge modules heading and choose **IoT Edge Module**

1. Provide a name in the **IoT Edge Module Name** field.

1. Under the **Module Settings** tab, add `nvidia/digits:6.0` to the **Image URI** field.

1. Select the **Environment Variables** tab.

1. Add the environment variable name `NVIDIA_VISIBLE_DEVICES` with the value `0`. The value represents a list of your modules on your device, with `0` being the beginning of the list. This value is how many devices you want assigned to a GPU. Since we only have one module here, we want the first one on our list to be GPU-enabled.

   | Name                   | Type | Value |
   | :--------------------- | ---- | ----- |
   | NVIDIA_VISIBLE_DEVICES | Text | 0     |

1. Select the **Add** button at the bottom of the page.

1. Select **Review + create**. Your deployment manifest properties will appear.

1. Select the **Create** button to create the module.

1. Select the **Refresh** button to update your module list. The module will take a couple of minutes to show "running" in the **Runtime status**, so keep refreshing the device.

#### Verify the NVIDIA module is configured and running
 
1. From your device, run this command to confirm your new NVIDIA module is running.

   ```bash
   iotedge list
   ```
   You should see your NVIDIA module in a list of modules on your IoT Edge device with a status of `running`.

   :::image type="content" source="media/configure-connect-verify-gpu/iot-edge-list.png" alt-text="Screenshot of the result of the 'iotedge list' command.":::

