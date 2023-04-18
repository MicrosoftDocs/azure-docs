---
title: Create and provision devices with a virtual TPM on Linux - Azure IoT Edge
description: Use a simulated TPM on a Linux device to test the Azure IoT Hub device provisioning service for Azure IoT Edge.
author: PatAltimore
manager: lizross
ms.author: patricka
ms.date: 05/13/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---
# Create and provision IoT Edge devices at scale with a TPM on Linux

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article provides instructions for autoprovisioning an Azure IoT Edge for Linux device by using a Trusted Platform Module (TPM). You can automatically provision IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml). If you're unfamiliar with the process of autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before you continue.

This article outlines two methodologies. Select your preference based on the architecture of your solution:

- Autoprovision a Linux device with physical TPM hardware. An example is the [Infineon OPTIGA&trade; TPM SLB 9670](https://devicecatalog.azure.com/devices/3f52cdee-bbc4-d74e-6c79-a2546f73df4e).
- Autoprovision a Linux virtual machine (VM) with a simulated TPM running on a Windows development machine with Hyper-V enabled. We recommend using this methodology only as a testing scenario. A simulated TPM doesn't offer the same security as a physical TPM.

Instructions differ based on your methodology, so make sure you're on the correct tab going forward.

# [Physical device](#tab/physical-device)

The tasks are as follows:

1. Retrieve provisioning information for your TPM.
1. Create an individual enrollment for your device in an instance of the IoT Hub device provisioning service.
1. Install the IoT Edge runtime and connect the device to the IoT hub.

# [Virtual machine](#tab/virtual-machine)

The tasks are as follows:

1. Create a Linux VM in Hyper-V with a simulated TPM for hardware security.
1. Retrieve provisioning information for your TPM.
1. Create an individual enrollment for your device in an instance of the IoT Hub device provisioning service.
1. Install the IoT Edge runtime and connect the device to the IoT hub.

---

## Prerequisites

<!-- Cloud resources prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-at-scale-cloud-resources.md](includes/iot-edge-prerequisites-at-scale-cloud-resources.md)]

### Device requirements

# [Physical device](#tab/physical-device)

A physical Linux device to be the IoT Edge device.

If you are a device manufacturer then refer to guidance on [integrating a TPM into the manufacturing process](../iot-dps/concepts-device-oem-security-practices.md#integrating-a-tpm-into-the-manufacturing-process).

# [Virtual machine](#tab/virtual-machine)

A Windows development machine with [Hyper-V enabled](/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v). This article uses Windows 10 running an Ubuntu Server VM.

---

> [!NOTE]
> TPM 2.0 is required when you use TPM attestation with the device provisioning service.
>
> You can only create individual, not group, device provisioning service enrollments when you use a TPM.

## Set up your device

# [Physical device](#tab/physical-device)

If you're using a physical Linux device with a TPM, there are no extra steps to set up your device.

You're ready to continue.

# [Virtual machine](#tab/virtual-machine)

In this section, you create a new Linux VM on Hyper-V. You configure this VM with a simulated TPM for testing how automatic provisioning works with IoT Edge.

> [!TIP]
> If you're using a VM, you'll copy and paste on the VM many times throughout this article. Copying and pasting isn't easy through the Hyper-V Manager connection application. You might want to connect to the VM through Hyper-V Manager once to retrieve its IP address. First, run `sudo apt install net-tools`, and then run `hostname -I`. Then, you can use the IP address to connect through SSH: `ssh <username>@<ipaddress>`.

### Create a virtual switch

A virtual switch enables your VM to connect to a physical network.

1. Open Hyper-V manager on your Windows machine.

1. On the **Actions** menu, select **Virtual Switch Manager**.

1. Select an **External** virtual switch, and then select **Create Virtual Switch**.

1. Give your new virtual switch a name. For example, use **EdgeSwitch**. Make sure that the connection type is set to **External network**, and then select **OK**.

1. A pop-up warns you that network connectivity might be disrupted. Select **Yes** to continue.

> [!TIP]
> If you see errors while you create the new virtual switch, ensure that no other switches are using the ethernet adapter, and that no other switches use the same name.

### Create the virtual machine

Create a new VM from a bootable image file.

1. Download a disk image file to use for your VM and save it locally. For example, [Ubuntu Server 22.04](http://releases.ubuntu.com/22.04/). For information about supported operating systems for IoT Edge devices, see [Azure IoT Edge supported systems](./support.md).

1. In Hyper-V Manager, select **Action** > **New** > **Virtual Machine** on the **Actions** menu.

1. Complete the **New Virtual Machine Wizard** with the following specific configurations:

   1. **Specify Generation**: Select **Generation 2**. Generation 2 VMs have nested virtualization enabled, which is required to run IoT Edge on a VM.
   1. **Configure Networking**: Set the value of **Connection** to the virtual switch that you created in the previous section.
   1. **Installation Options**: Select **Install an operating system from a bootable image file** and browse to the disk image file that you saved locally.

1. Select **Finish** in the wizard to create the VM.

It might take a few minutes to create the new VM.

### Enable virtual TPM

After your VM is created, open its settings to enable the virtual TPM that lets you autoprovision the device.

1. In Hyper-V Manager, right-click the VM and select **Settings**.

1. Go to **Security**.

1. Clear **Enable Secure Boot**.

1. Select **Enable Trusted Platform Module**.

1. Select **OK**.

### Start the virtual machine

Start your VM to complete the installation process.

1. In Hyper-V Manager, start your VM and connect to it.

1. Follow the prompts within the VM to finish the installation process and reboot the machine.

After the installation is finished and you've signed back in to your VM, you're ready to continue.

---

## Retrieve provisioning information for your TPM

> [!NOTE]
> This article previously used the `tpm_device_provision` tool from the IoT C SDK to generate provisioning info. If you relied on that tool previously, then be aware the steps below generate a different registration ID for the same public endorsement key. If you need to recreate the registration ID as before then refer to how the C SDK's [tpm_device_provision tool](https://github.com/Azure/azure-iot-sdk-c/tree/main/provisioning_client/tools/tpm_device_provision) generates it. Be sure the registration ID for the individual enrollment in DPS matches the regisration ID the IoT Edge device is configured to use.

In this section, you use the TPM2 software tools to retrieve the endorsement key for your TPM and then generate a unique registration ID. This section corresponds with [Step 3: Device has firmware and software installed](../iot-dps/concepts-device-oem-security-practices.md#step-3-device-has-firmware-and-software-installed) in the process for [integrating a TPM into the manufacturing process](../iot-dps/concepts-device-oem-security-practices.md#integrating-a-tpm-into-the-manufacturing-process).

### Install the TPM2 Tools
Sign in to your device, and install the `tpm2-tools` package.

# [Ubuntu / Debian](#tab/ubuntu+debian)


   ```bash
   sudo apt-get install tpm2-tools
   ```

# [Red Hat Enterprise Linux](#tab/rhel)


   ```bash
   sudo yum install tpm2-tools
   ```

---

Run the following script to read the endorsement key, creating one if it does not already exist.

   ```bash
   #!/bin/sh
   if [ "$USER" != "root" ]; then
     SUDO="sudo "
   fi

   $SUDO tpm2_readpublic -Q -c 0x81010001 -o ek.pub 2> /dev/null
   if [ $? -gt 0 ]; then
     # Create the endorsement key (EK)
     $SUDO tpm2_createek -c 0x81010001 -G rsa -u ek.pub

     # Create the storage root key (SRK)
     $SUDO tpm2_createprimary -Q -C o -c srk.ctx > /dev/null

     # make the SRK persistent
     $SUDO tpm2_evictcontrol -c srk.ctx 0x81000001 > /dev/null

     # open transient handle space for the TPM
     $SUDO tpm2_flushcontext -t > /dev/null
   fi

   printf "Gathering the registration information...\n\nRegistration Id:\n%s\n\nEndorsement Key:\n%s\n" $(sha256sum -b ek.pub | cut -d' ' -f1 | sed -e 's/[^[:alnum:]]//g') $(base64 -w0 ek.pub)
   $SUDO rm ek.pub srk.ctx 2> /dev/null

   ```

The output window displays the device's **Endorsement key** and a unique **Registration ID**. Copy these values for use later when you create an individual enrollment for your device in the device provisioning service.

After you have your registration ID and endorsement key, you're ready to continue.

> [!TIP]
> If you don't want to use the TPM2 software tools to retrieve the information, you need to find another way to obtain the provisioning information. The endorsement key, which is unique to each TPM chip, is obtained from the TPM chip manufacturer associated with it. You can derive a unique registration ID for your TPM device. For example, as shown above you can create an SHA-256 hash of the endorsement key.

<!-- Create an enrollment for your device using TPM provisioning information H2 and content -->
[!INCLUDE [tpm-create-a-device-provision-service-enrollment.md](../../includes/tpm-create-a-device-provision-service-enrollment.md)]

<!-- Install IoT Edge on Linux H2 and content -->
[!INCLUDE [install-iot-edge-linux.md](includes/iot-edge-install-linux.md)]

## Provision the device with its cloud identity

After the runtime is installed on your device, configure the device with the information it uses to connect to the device provisioning service and IoT Hub.

1. Know your device provisioning service **ID Scope** and device **Registration ID** that were gathered previously.

1. Create a configuration file for your device based on a template file that's provided as part of the IoT Edge installation.

   ```bash
   sudo cp /etc/aziot/config.toml.edge.template /etc/aziot/config.toml
   ```

1. Open the configuration file on the IoT Edge device.

   ```bash
   sudo nano /etc/aziot/config.toml
   ```

1. Find the provisioning configurations section of the file. Uncomment the lines for TPM provisioning, and make sure any other provisioning lines are commented out.

   ```toml
   # DPS provisioning with TPM
   [provisioning]
   source = "dps"
   global_endpoint = "https://global.azure-devices-provisioning.net"
   id_scope = "SCOPE_ID_HERE"

   # Uncomment to send a custom payload during DPS registration
   # payload = { uri = "PATH_TO_JSON_FILE" }
   
   [provisioning.attestation]
   method = "tpm"
   registration_id = "REGISTRATION_ID_HERE"

   # auto_reprovisioning_mode = Dynamic
   ```

1. Update the values of `id_scope` and `registration_id` with your device provisioning service and device information. The `scope_id` value is the **ID Scope** from your device provisioning service instance's overview page.

1. Optionally, find the auto reprovisioning mode section of the file. Use the `auto_reprovisioning_mode` parameter to configure your device's reprovisioning behavior. **Dynamic** - Reprovision when the device detects that it may have been moved from one IoT Hub to another. This is the default. **AlwaysOnStartup** - Reprovision when the device is rebooted or a crash causes the daemon(s) to restart. **OnErrorOnly** - Never trigger device reprovisioning automatically. Each mode has an implicit device reprovisioning fallback if the device is unable to connect to IoT Hub during identity provisioning due to connectivity errors. For more information, see [IoT Hub device reprovisioning concepts](../iot-dps/concepts-device-reprovision.md).

1. Optionally, uncomment the `payload` parameter to specify the path to a local JSON file. The contents of the file will be [sent to DPS as additional data](../iot-dps/how-to-send-additional-data.md#iot-edge-support) when the device registers. This is useful for [custom allocation](../iot-dps/how-to-use-custom-allocation-policies.md). For example, if you want to allocate your devices based on an IoT Plug and Play model ID without human intervention.

1. Save and close the file.

## Give IoT Edge access to the TPM

The IoT Edge runtime relies on a TPM service that brokers access to a device's TPM. This service needs to access the TPM to automatically provision your device.

You can give access to the TPM by overriding the systemd settings so that the `aziottpm` service has root privileges. If you don't want to elevate the service privileges, you can also use the following steps to manually provide TPM access.

1. Create a new rule that will give the IoT Edge runtime access to `tpm0` and `tpmrm0`.

   ```bash
   sudo touch /etc/udev/rules.d/tpmaccess.rules
   ```

1. Open the rules file.

   ```bash
   sudo nano /etc/udev/rules.d/tpmaccess.rules
   ```

1. Copy the following access information into the rules file. The `tpmrm0` might not be present on devices that use a kernel earlier than 4.12. Devices that don't have `tpmrm0` will safely ignore that rule.

   ```input
   # allow aziottpm access to tpm0 and tpmrm0
   KERNEL=="tpm0", SUBSYSTEM=="tpm", OWNER="aziottpm", MODE="0660"
   KERNEL=="tpmrm0", SUBSYSTEM=="tpmrm", OWNER="aziottpm", MODE="0660"
   ```

1. Save and exit the file.

1. Trigger the `udev` system to evaluate the new rule.

   ```bash
   /bin/udevadm trigger --subsystem-match=tpm --subsystem-match=tpmrm
   ```

1. Verify that the rule was successfully applied.

   ```bash
   ls -l /dev/tpm*
   ```

   Successful output appears as follows:

   ```output
   crw-rw---- 1 root aziottpm 10, 224 Jul 20 16:27 /dev/tpm0
   crw-rw---- 1 root aziottpm 10, 224 Jul 20 16:27 /dev/tpmrm0
   ```

   If you don't see that the correct permissions have been applied, try rebooting your machine to refresh `udev`.

1. Apply the configuration changes that you made on the device.

   ```bash
   sudo iotedge config apply
   ```

## Verify successful installation

If you didn't already, apply the configuration changes that you made on the device.

   ```bash
   sudo iotedge config apply
   ```

Check to see that the IoT Edge runtime is running.

   ```bash
   sudo iotedge system status
   ```

Examine daemon logs.

   ```cmd/sh
   sudo iotedge system logs
   ```

If you see provisioning errors, it might be that the configuration changes haven't taken effect yet. Try restarting the IoT Edge daemon.

   ```bash
   sudo systemctl daemon-reload
   ```

Or, try restarting your VM to see if the changes take effect on a fresh start.

If the runtime started successfully, you can go into your IoT hub and see that your new device was automatically provisioned. Now your device is ready to run IoT Edge modules.

List running modules.

```cmd/sh
iotedge list
```

You can verify that the individual enrollment that you created in the device provisioning service was used. Go to your device provisioning service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

## Next steps

The device provisioning service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices by using automatic device management.

Learn how to [deploy and monitor IoT Edge modules at scale by using the Azure portal](how-to-deploy-at-scale.md) or [the Azure CLI](how-to-deploy-cli-at-scale.md).
