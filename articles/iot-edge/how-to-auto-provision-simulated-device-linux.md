---
title: Provision device with a virtual TPM on Linux VM - Azure IoT Edge
description: Use a simulated TPM on a Linux VM to test Azure Device Provisioning Service for Azure IoT Edge
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 3/2/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---
# Create and provision an IoT Edge device with a virtual TPM on a Linux virtual machine

Azure IoT Edge devices can be automatically provisioned using the [Device Provisioning Service](../iot-dps/index.yml). If you're unfamiliar with the process of auto-provisioning, review the [auto-provisioning concepts](../iot-dps/concepts-auto-provisioning.md) before continuing.

This article shows you how to test auto-provisioning on a simulated IoT Edge device with the following steps:

* Create a Linux virtual machine (VM) in Hyper-V with a simulated Trusted Platform Module (TPM) for hardware security.
* Create an instance of IoT Hub Device Provisioning Service (DPS).
* Create an individual enrollment for the device
* Install the IoT Edge runtime and connect the device to IoT Hub

> [!TIP]
> This article describes how to test DPS provisioning using a TPM simulator, but much of it applies to physical TPM hardware such as the [Infineon OPTIGA&trade; TPM](https://catalog.azureiotsolutions.com/details?title=OPTIGA-TPM-SLB-9670-Iridium-Board), an Azure Certified for IoT device.
>
> If you're using a physical device, you can skip ahead to the [Retrieve provisioning information from a physical device](#retrieve-provisioning-information-from-a-physical-device) section in this article.

## Prerequisites

* A Windows development machine with [Hyper-V enabled](https://docs.microsoft.com/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v). This article uses Windows 10 running an Ubuntu Server VM.
* An active IoT Hub.
* If using a simulated TPM, [Visual Studio](https://visualstudio.microsoft.com/vs/) 2015 or later with the ['Desktop development with C++'](https://www.visualstudio.com/vs/support/selecting-workloads-visual-studio-2017/) workload enabled.

> [!NOTE]
> TPM 2.0 is required when using TPM attestation with DPS and can only be used to create individual, not group, enrollments.

## Create a Linux virtual machine with a virtual TPM

In this section, you create a new Linux virtual machine on Hyper-V. You configured this virtual machine with a simulated TPM so that you can use it for testing how automatic provisioning works with IoT Edge.

### Create a virtual switch

A virtual switch enables your virtual machine to connect to a physical network.

1. Open Hyper-V Manager on your Windows machine.

2. In the **Actions** menu, select **Virtual Switch Manager**.

3. Choose an **External** virtual switch, then select **Create Virtual Switch**.

4. Give your new virtual switch a name, for example **EdgeSwitch**. Make sure that the connection type is set to **External network**, then select **Ok**.

5. A pop-up warns you that network connectivity may be disrupted. Select **Yes** to continue.

If you see errors while creating the new virtual switch, ensure that no other switches are using the ethernet adaptor, and that no other switches use the same name.

### Create virtual machine

1. Download a disk image file to use for your virtual machine and save it locally. For example, [Ubuntu server](https://www.ubuntu.com/download/server).

2. In Hyper-V Manager again, select **New** > **Virtual Machine** in the **Actions** menu.

3. Complete the **New Virtual Machine Wizard** with the following specific configurations:

   1. **Specify Generation**: Select **Generation 2**. Generation 2 virtual machines have nested virtualization enabled, which is required to run IoT Edge on a virtual machine.
   2. **Configure Networking**: Set the value of **Connection** to the virtual switch that you created in the previous section.
   3. **Installation Options**: Select **Install an operating system from a bootable image file** and browse to the disk image file that you saved locally.

4. Select **Finish** in the wizard to create the virtual machine.

It may take a few minutes to create the new VM.

### Enable virtual TPM

Once your VM is created, open its settings to enable the virtual trusted platform module (TPM) that lets you auto-provision the device.

1. Select the virtual machine, then open its **Settings**.

2. Navigate to **Security**.

3. Uncheck **Enable Secure Boot**.

4. Check **Enable Trusted Platform Module**.

5. Click **OK**.  

### Start the virtual machine and collect TPM data

In the virtual machine, build a tool that you can use to retrieve the device's **Registration ID** and **Endorsement key**.

1. Start your virtual machine and connect to it.

1. Follow the prompts within the virtual machine to finish the installation process and reboot the machine.

1. Sign in to your VM, then follow the steps in [Set up a Linux development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#linux) to install and build the Azure IoT device SDK for C.

   >[!TIP]
   >In the course of this article, you'll copy to and paste from the virtual machine, which is not easy through the Hyper-V Manager connection application. You may want to connect to the virtual machine through Hyper-V Manager once to retrieve its IP address: `ifconfig`. Then, you can use the IP address to connect through SSH: `ssh <username>@<ipaddress>`.

1. Run the following commands to build the SDK tool that retrieves your device provisioning information from the TPM simulator.

   ```bash
   cd azure-iot-sdk-c/cmake
   cmake -Duse_prov_client:BOOL=ON -Duse_tpm_simulator:BOOL=ON ..
   cd provisioning_client/tools/tpm_device_provision
   make
   sudo ./tpm_device_provision
   ```

1. From a command window, navigate to the `azure-iot-sdk-c` directory and run the TPM simulator. It listens over a socket on ports 2321 and 2322. Do not close this command window; you will need to keep this simulator running.

   From the `azure-iot-sdk-c` directory, run the following command to start the simulator:

   ```bash
   ./provisioning_client/deps/utpm/tools/tpm_simulator/Simulator.exe
   ```

1. Using Visual Studio, open the solution generated in the `cmake` directory named `azure_iot_sdks.sln`, and build it using the **Build solution** command on the **Build** menu.

1. In the **Solution Explorer** pane in Visual Studio, navigate to the folder **Provision\_Tools**. Right-click the **tpm_device_provision** project and select **Set as Startup Project**.

1. Run the solution using either of the **Start** commands on the **Debug** menu. The output window displays the TPM simulator's **Registration ID** and the **Endorsement key**, which you should copy for use later when you create an individual enrollment for your device in You can close this window (with Registration ID and Endorsement key), but leave the TPM simulator window running.

## Retrieve provisioning information from a physical device

On your device, build a tool that you can use to retrieve the device's provisioning information.

1. Follow the steps in [Set up a Linux development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#linux) to install and build the Azure IoT device SDK for C.

1. Run the following commands to build the SDK tool that retrieves your device provisioning information from the TPM device.

   ```bash
   cd azure-iot-sdk-c/cmake
   cmake -Duse_prov_client:BOOL=ON ..
   cd provisioning_client/tools/tpm_device_provision
   make
   sudo ./tpm_device_provision
   ```

1. Copy the values for **Registration ID** and **Endorsement key**. You use these values to create an individual enrollment for your device in DPS.

## Set up the IoT Hub Device Provisioning Service

Create a new instance of the IoT Hub Device Provisioning Service in Azure, and link it to your IoT hub. You can follow the instructions in [Set up the IoT Hub DPS](../iot-dps/quick-setup-auto-provision.md).

After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

## Create a DPS enrollment

Retrieve the provisioning information from your virtual machine, and use that to create an individual enrollment in Device Provisioning Service.

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-at-scale.md).

> [!TIP]
> In the Azure CLI, you can create an [enrollment](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/dps/enrollment) or an [enrollment group](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/dps/enrollment-group) and use the **edge-enabled** flag to specify that a device, or group of devices, is an IoT Edge device.

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

2. Under **Settings**, select **Manage enrollments**.

3. Select **Add individual enrollment** then complete the following steps to configure the enrollment:  

   1. For **Mechanism**, select **TPM**.

   2. Provide the **Endorsement key** and **Registration ID** that you copied from your virtual machine.

      > [!TIP]
      > If you're using a physical TPM device, you need to determine the **Endorsement key**, which is unique to each TPM chip and is obtained from the TPM chip manufacturer associated with it. You can derive a unique **Registration ID** for your TPM device by, for example, creating an SHA-256 hash of the endorsement key.

   3. Select **True** to declare that this virtual machine is an IoT Edge device.

   4. Choose the linked **IoT Hub** that you want to connect your device to. You can choose multiple hubs, and the device will be assigned to one of them according to the selected allocation policy.

   5. Provide an ID for your device if you'd like. You can use device IDs to target an individual device for module deployment. If you don't provide a device ID, the registration ID is used.

   6. Add a tag value to the **Initial Device Twin State** if you'd like. You can use tags to target groups of devices for module deployment. For example:

      ```json
      {
         "tags": {
            "environment": "test"
         },
         "properties": {
            "desired": {}
         }
      }
      ```

   7. Select **Save**.

Now that an enrollment exists for this device, the IoT Edge runtime can automatically provision the device during installation.

## Install the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. Its components run in containers, and allow you to deploy additional containers to the device so that you can run code at the edge. Install the IoT Edge runtime on your virtual machine.

Know your DPS **ID Scope** and device **Registration ID** before beginning the article that matches your device type. If you installed the example Ubuntu server, use the **x64** instructions. Make sure to configure the IoT Edge runtime for automatic, not manual, provisioning.

[Install the Azure IoT Edge runtime on Linux](how-to-install-iot-edge-linux.md)

## Give IoT Edge access to the TPM

In order for the IoT Edge runtime to automatically provision your device, it needs access to the TPM.

You can give TPM access to the IoT Edge runtime by overriding the systemd settings so that the `iotedge` service has root privileges. If you don't want to elevate the service privileges, you can also use the following steps to manually provide TPM access.

1. Find the file path to the TPM hardware module on your device and save it as a local variable.

   ```bash
   tpm=$(sudo find /sys -name dev -print | fgrep tpm | sed 's/.\{4\}$//')
   ```

2. Create a new rule that will give the IoT Edge runtime access to tpm0.

   ```bash
   sudo touch /etc/udev/rules.d/tpmaccess.rules
   ```

3. Open the rules file.

   ```bash
   sudo nano /etc/udev/rules.d/tpmaccess.rules
   ```

4. Copy the following access information into the rules file.

   ```input
   # allow iotedge access to tpm0
   KERNEL=="tpm0", SUBSYSTEM=="tpm", GROUP="iotedge", MODE="0660"
   ```

5. Save and exit the file.

6. Trigger the udev system to evaluate the new rule.

   ```bash
   /bin/udevadm trigger $tpm
   ```

7. Verify that the rule was successfully applied.

   ```bash
   ls -l /dev/tpm0
   ```

   Successful output looks like the following:

   ```output
   crw-rw---- 1 root iotedge 10, 224 Jul 20 16:27 /dev/tpm0
   ```

   If you don't see that the correct permissions have been applied, try rebooting your machine to refresh udev.

## Restart the IoT Edge runtime

Restart the IoT Edge runtime so that it picks up all the configuration changes that you made on the device.

   ```bash
   sudo systemctl restart iotedge
   ```

Check to see that the IoT Edge runtime is running.

   ```bash
   sudo systemctl status iotedge
   ```

If you see provisioning errors, it may be that the configuration changes haven't taken effect yet. Try restarting the IoT Edge daemon again.

   ```bash
   sudo systemctl daemon-reload
   ```

Or, try restarting your virtual machine to see if the changes take effect on a fresh start.

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and see that your new device was automatically provisioned. Now your device is ready to run IoT Edge modules.

Check the status of the IoT Edge Daemon.

```cmd/sh
systemctl status iotedge
```

Examine daemon logs.

```cmd/sh
journalctl -u iotedge --no-pager --no-full
```

List running modules.

```cmd/sh
iotedge list
```

You can verify that the individual enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

## Next steps

The Device Provisioning Service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md).
