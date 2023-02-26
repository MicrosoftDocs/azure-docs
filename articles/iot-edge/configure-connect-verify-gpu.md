---
title: Configure, connect, and verify an IoT Edge module with a GPU
description: Configure your environment to connect and verify your GPU to process modules from your IoT Edge device.
author: PatAltimore

ms.author: patricka
ms.date: 9/22/2022
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
---

# Tutorial: Configure, connect, and verify an IoT Edge module for a GPU

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This tutorial shows you how to build a GPU-enabled virtual machine (VM). From the VM, you'll see how to run an IoT Edge device that allocates work from one of its modules to your GPU. 

We'll use the Azure portal, the Azure Cloud Shell, and your VM's command line to:
* Build a GPU-capable VM
* Install the [NVIDIA driver extension](../virtual-machines/extensions/hpccompute-gpu-linux.md) on the VM
* Configure a module on an IoT Edge device to allocate work to a GPU

## Prerequisites

* Azure account - [create a free account](https://azure.microsoft.com/free/search/)

* Azure IoT Hub - [create an IoT Hub](https://azure.microsoft.com/services/iot-hub/#overview)

* Azure IoT Edge device

  If you don't already have an IoT Edge device and need to quickly create one, run the following command. Use the [Azure Cloud Shell](../cloud-shell/overview.md) located in the Azure portal. Create a new device name for `<DEVICE-NAME>` and replace the IoT `<IOT-HUB-NAME>` with your own. 
    
  ```azurecli
  az iot hub device-identity create --device-id <YOUR-DEVICE-NAME> --edge-enabled --hub-name <YOUR-IOT-HUB-NAME>
  ```
    
  For more information on creating an IoT Edge device, see [Quickstart: Deploy your first IoT Edge module to a virtual Linux device](quickstart-linux.md). Later in this tutorial, we'll add an NVIDIA module to our IoT Edge device.

## Create a GPU-optimized virtual machine

To create a GPU-optimized virtual machine (VM), choosing the right size is important. Not all VM sizes will accommodate GPU processing. In addition, there are different VM sizes for different workloads. For more information, see [GPU optimized virtual machine sizes](../virtual-machines/sizes-gpu.md) or try the [Virtual machines selector](https://azure.microsoft.com/pricing/vm-selector/).

Let's create an IoT Edge VM with the [Azure Resource Manager (ARM)](../azure-resource-manager/management/overview.md) template in GitHub, then configure it to be GPU-optimized.

1. Go to the IoT Edge VM deployment template in GitHub: [Azure/iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy/tree/1.4).

1. Select the **Deploy to Azure** button, which initiates the creation of a custom VM for you in the Azure portal. 

   :::image type="content" source="media/configure-connect-verify-gpu/deploy-to-azure-button.png" alt-text="Screenshot of the Deploy to Azure button in GitHub.":::

1. Fill out the **Custom deployment** fields with your Azure credentials and resources:

   | **Property**             | **Description or sample value**        |
   | :----------------------- | -------------------------------------- |
   | Subscription             | Choose your Azure account subscription.|
   | Resource group           | Add your Azure resource group.         |
   | Region                   | `East US` <br> GPU VMs aren't available in all regions. |
   | Dns Label Prefix         | Create a name for your VM.             |
   | Admin Username           | `adminUser` <br> Alternatively, create your own user name. |
   | Device Connection String | Copy your connection string from your IoT Edge device, then paste here.                                                               |
   | VM size                  | `Standard_NV6`                         |
   | Authentication type      | Choose either **password** or **SSH Public Key**, then create a password or key pair name if needed.                                                             |

   > [!TIP]
   >
   > Check which GPU VMs are supported in each region: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?regions=us-central,us-east,us-east-2,us-north-central,us-south-central,us-west-central,us-west,us-west-2,us-west-3&products=virtual-machines).
   >
   > To check [which region your Azure subscription allows](../azure-resource-manager/troubleshooting/error-sku-not-available.md?tabs=azure-cli#solution), try this Azure command from the Azure portal. The `N` in `Standard_N` means it's a GPU-enabled VM.
   > ```azurecli
   > az vm list-skus --location <YOUR-REGION> --size Standard_N --all --output table
   > ```

1. Select the **Review + create** button at the bottom, then the **Create** button. Deployment can take up one minute to complete.

## Install the NVIDIA extension
Now that we have a GPU-optimized VM, let's install the [NVIDIA extension](../virtual-machines/extensions/hpccompute-gpu-linux.md) on the VM using the Azure portal. 

1. Open your VM in the Azure portal and select **Extensions + applications** from the left menu.

1. Select **Add** and choose the **NVIDIA GPU Driver Extension** from the list, then select **Next**.

1. Choose **Review + create**, then **Create**. The deployment can take up to 30 minutes to complete.

1. To confirm the installation in the Azure portal, return to **Extensions + applications** menu in your VM. The new extension named `NvidiaGpuDriverLinux` should be in your extensions list and show **Provisioning succeeded** under **Status**.

1. To confirm the installation using Azure Cloud Shell, run this command to list your extensions. Replace the `<>` placeholders with your values:

   ```azurecli
   az vm extension list --resource-group <YOUR-RESOURCE-GROUP> --vm-name <YOUR-VM-NAME> -o table
   ```

1. With an NVIDIA module, we'll use the [NVIDIA System Management Interface program](https://developer.download.nvidia.com/compute/DCGM/docs/nvidia-smi-367.38.pdf), also known as `nvidia-smi`. 

   From your device, install the `nvidia-smi` package based on your version of Ubuntu. For this tutorial, we'll install `nvidia-utils-515` for Ubuntu 20.04. Select `Y` when prompted in the installation.

   ```bash
   sudo apt install nvidia-utils-515
   ```

   Here's a list of all `nvidia-smi` versions. If you run `nvidia-smi` without installing it first, this list will print in your console.

   :::image type="content" source="media/configure-connect-verify-gpu/nvidia-smi-versions.png" alt-text="Screenshot of all `nvidia-smi` versions.":::

1. After installation, run this command to confirm it's installed:
 
   ```bash
   nvidia-smi
   ```
 
   A confirmation table will appear, similar to this table.

   :::image type="content" source="media/configure-connect-verify-gpu/nvidia-driver-installed.png" alt-text="Screenshot of the NVIDIA driver table.":::

> [!NOTE]
> The NVIDIA extension is a simplified way to install the NVIDIA drivers, but you may need more customization. For more information about custom installations on N-series VMs, see [Install NVIDIA GPU drivers on N-series VMs running Linux](../virtual-machines/linux/n-series-driver-setup.md).

## Enable a module with GPU acceleration

There are different ways to enable an IoT Edge module so that it uses a GPU for processing. One way is to configure an existing IoT Edge module on your device to become GPU-accelerated. Another way is to use a prefabricated container module, for example, a module from [NVIDIA DIGITS](https://developer.nvidia.com/digits) that's already GPU-optimized. Let's see how both ways are done.

### Enable GPU in an existing module using DeviceRequests

If you have an existing module on your IoT Edge device, adding a configuration using `DeviceRequests` in `createOptions` of the deployment manifest makes the module GPU-optimized. Follow these steps to configure an existing module.

1. Go to your IoT Hub in the Azure portal and choose **Devices** under the **Device management** menu.

1. Select your IoT Edge device to open it.

1. Select the **Set modules** tab at the top.

1. Select the module you want to enable for GPU use in the **IoT Edge Modules** list.

1. A side panel opens, choose the **Container Create Options** tab.

1. Copy this `HostConfig` JSON string and paste into the **Create options** box.

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

1. Select **Update**.

1. Select **Review + create**. The new `HostConfig` object is now visible in the `settings` of your module.

1. Select **Create**.

1. To confirm the new configuration works, run this command in your VM:

   ```bash
   sudo docker inspect <YOUR-MODULE-NAME>
   ```

   You should see the parameters you specified for `DeviceRequests` in the JSON printout in the console.

> [!NOTE]
> To understand the `DeviceRequests` parameter better, view the source code: [moby/host_config.go](https://github.com/moby/moby/blob/master/api/types/container/hostconfig.go)

### Enable a GPU in a prefabricated NVIDIA module

Let's add an [NVIDIA DIGITS](https://docs.nvidia.com/deeplearning/digits/index.html) module to the IoT Edge device and then allocate a GPU to the module by setting its environment variables. This NVIDIA module is already in a Docker container. 

1. Select your IoT Edge device in the Azure portal from your IoT Hub's **Devices** menu.

1. Select the **Set modules** tab at the top.

1. Select **+ Add** under the IoT Edge modules heading and choose **IoT Edge Module**.

1. Provide a name in the **IoT Edge Module Name** field.

1. Under the **Module Settings** tab, add `nvidia/digits:6.0` to the **Image URI** field.

1. Select the **Environment Variables** tab.

1. Add the environment variable name `NVIDIA_VISIBLE_DEVICES` with the value `0`. This variable controls which GPUs are visible to the containerized application running on the edge device. The `NVIDIA_VISIBLE_DEVICES` environment variable can be set to a comma-separated list of device IDs, which correspond to the physical GPUs in the system. For example, if there are two GPUs in the system with device IDs 0 and 1, the variable can be set to "NVIDIA_VISIBLE_DEVICES=0,1" to make both GPUs visible to the container. In this article, since the VM only has one GPU, we will use the first (and only) one.

   | Name                   | Type | Value |
   | :--------------------- | ---- | ----- |
   | NVIDIA_VISIBLE_DEVICES | Text | 0     |

1. Select **Add**.

1. Select **Review + create**. Your deployment manifest properties will appear.

1. Select **Create** to create the module.

1. Select **Refresh** to update your module list. The module will take a couple of minutes to show *running* in the **Runtime status**, so keep refreshing the device.
 
1. From your device, run this command to confirm your new NVIDIA module exists and is running.

   ```bash
   iotedge list
   ```
   You should see your NVIDIA module in a list of modules on your IoT Edge device with a status of `running`.

   :::image type="content" source="media/configure-connect-verify-gpu/iot-edge-list.png" alt-text="Screenshot of the result of the 'iotedge list' command.":::

> [!NOTE]
> For more information on the **NVIDIA DIGITS** container module, see the [Deep Learning Digits Documentation](https://docs.nvidia.com/deeplearning/digits/digits-container-user-guide/index.html#digitsovr).

## Clean up resources

If you want to continue with other IoT Edge tutorials, you can use the device that you created for this tutorial. Otherwise, you can delete the Azure resources that you created to avoid charges.

If you created your virtual machine and IoT hub in a new resource group, you can delete that group, which will delete all the associated resources. Double check the contents of the resource group to make sure that there's nothing you want to keep. If you don't want to delete the whole group, you can delete individual resources (virtual machine, device, or GPU-module) instead.

> [!IMPORTANT]
> Deleting a resource group is irreversible.

Use the following command to remove your Azure resource group. It might take a few minutes to delete a resource group.

```azurecli-interactive
az group delete --name <YOUR-RESOURCE-GROUP> --yes
```

You can confirm the resource group is removed by viewing the list of resource groups.

```azurecli-interactive
az group list
```

## Next steps

This article helped you set up your virtual machine and IoT Edge device to be GPU-accelerated. To run an application with a similar setup, try the learning path for [NVIDIA DeepStream development with Microsoft Azure](/training/paths/nvidia-deepstream-development-with-microsoft-azure/?WT.mc_id=iot-47680-cxa). The Learn tutorial shows you how to develop optimized Intelligent Video Applications that can consume multiple video, image, and audio sources.
