---
title: Update IoT Edge version on devices - Azure IoT Edge | Microsoft Docs 
description: How to update IoT Edge devices to run the latest versions of the security daemon and the IoT Edge runtime
keywords: 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 11/19/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Update the IoT Edge security daemon and runtime

As the IoT Edge service releases new versions, you'll want to update your IoT Edge devices for the latest features and security improvements. This article provides information about how to update your IoT Edge devices when a new version is available.

Two components of an IoT Edge device need to be updated if you want to move to a newer version. The first is the security daemon, which runs on the device and starts the runtime modules when the device starts. Currently, the security daemon can only be updated from the device itself. The second component is the runtime, made up of the IoT Edge hub and IoT Edge agent modules. Depending on how you structure your deployment, the runtime can be updated from the device or remotely.

To find the latest version of Azure IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

## Update the security daemon

The IoT Edge security daemon is a native component that needs to be updated using the package manager on the IoT Edge device.

Check the version of the security daemon running on your device by using the command `iotedge version`.

### Linux devices

On Linux x64 devices, use apt-get or your appropriate package manager to update the security daemon.

```bash
apt-get update
apt-get install libiothsm iotedge
```

On Linux ARM32 devices, use the steps in [Install Azure IoT Edge runtime on Linux (ARM32v7/armhf)](how-to-install-iot-edge-linux-arm.md) to install the latest version of the security daemon.

### Windows devices

On Windows devices, use the PowerShell script to update the security daemon. The script automatically pulls the latest version of the security daemon.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Update-IoTEdge -ContainerOs <Windows or Linux>
```

Running the Update-IoTEdge command removes and updates the security daemon from your device, along with the two runtime container images. The config.yaml file is kept on the device, as well as data from the Moby container engine (if you're using Windows containers). Keeping the configuration information means that you don't have to provide the connection string or Device Provisioning Service information for your device again during the update process.

If you want to install a specific version of the security daemon, download the appropriate Microsoft-Azure-IoTEdge.cab file from [IoT Edge releases](https://github.com/Azure/azure-iotedge/releases). Then, use the `-OfflineInstallationPath` parameter to point to the file location. For more information, see [Offline installation](how-to-install-iot-edge-windows.md#offline-installation).

## Update the runtime containers

The way that you update the IoT Edge agent and IoT Edge hub containers depends on whether you use rolling tags (like 1.0) or specific tags (like 1.0.7) in your deployment.

Check the version of the IoT Edge agent and IoT Edge hub modules currently on your device using the commands `iotedge logs edgeAgent` or `iotedge logs edgeHub`.

  ![Find container version in logs](./media/how-to-update-iot-edge/container-version.png)

### Understand IoT Edge tags

The IoT Edge agent and IoT Edge hub images are tagged with the IoT Edge version that they are associated with. There are two different ways to use tags with the runtime images:

* **Rolling tags** - Use only the first two values of the version number to get the latest image that matches those digits. For example, 1.0 is updated whenever there's a new release to point to the latest 1.0.x version. If the container runtime on your IoT Edge device pulls the image again, the runtime modules are updated to the latest version. This approach is suggested for development purposes. Deployments from the Azure portal default to rolling tags.

* **Specific tags** - Use all three values of the version number to explicitly set the image version. For example, 1.0.7 won't change after its initial release. You can declare a new version number in the deployment manifest when you're ready to update. This approach is suggested for production purposes.

### Update a rolling tag image

If you use rolling tags in your deployment (for example, mcr.microsoft.com/azureiotedge-hub:**1.0**) then you need to force the container runtime on your device to pull the latest version of the image.

Delete the local version of the image from your IoT Edge device. On Windows machines, uninstalling the security daemon also removes the runtime images, so you don't need to take this step again.

```bash
docker rmi mcr.microsoft.com/azureiotedge-hub:1.0
docker rmi mcr.microsoft.com/azureiotedge-agent:1.0
```

You may need to use the force `-f` flag to remove the images.

The IoT Edge service will pull the latest versions of the runtime images and automatically start them on your device again.

### Update a specific tag image

If you use specific tags in your deployment (for example, mcr.microsoft.com/azureiotedge-hub:**1.0.8**) then all you need to do is update the tag in your deployment manifest and apply the changes to your device.

1. In the IoT Hub in the Azure portal, select your IoT Edge device, and select **Set Modules**.

1. In the **IoT Edge Modules** section, select **Runtime Settings**.

   ![Configure runtime settings](./media/how-to-update-iot-edge/configure-runtime.png)

1. In **Runtime Settings**, update the **Image** value for **Edge Hub** with the desired version. Don't select **Save** just yet.

   ![Update Edge Hub Image version](./media/how-to-update-iot-edge/runtime-settings-edgehub.png)

1. Collapse the **Edge Hub** settings, or scroll down, and update the **Image** value for **Edge Agent** with the same desired version.

   ![Update Edge Hub Agent version](./media/how-to-update-iot-edge/runtime-settings-edgeagent.png)

1. Select **Save**.

1. Select **Review + create**, review the deployment, and select **Create**.

## Update to a release candidate version

Azure IoT Edge regularly releases new versions of the IoT Edge service. Before each stable release, there is one or more release candidate (RC) versions. RC versions include all the planned features for the release, but are still going through the testing and validation processes required for a stable release. If you want to test a new feature early, you can install the RC version and provide feedback through GitHub.

Release candidate versions follow the same numbering convention of releases, but have **-rc** plus an incremental number appended to the end. You can see the release candidates in the same list of [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases) as the stable versions. For example, find **1.0.7-rc1** and **1.0.7-rc2**, the two release candidates that came before **1.0.7**. You can also see that RC versions are marked with **pre-release** labels.

As previews, release candidate versions aren't included as the latest version that the regular installers target. Instead, you need to manually target the assets for the RC version that you want to test. Depending on your IoT Edge device operating system, use the following sections to update IoT Edge to a specific version:

* [Linux](how-to-install-iot-edge-linux.md#install-a-specific-runtime-version)
* [Windows](how-to-install-iot-edge-windows.md#offline-installation)

## Next steps

View the latest [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

Stay up-to-date with recent updates and announcement in the [Internet of Things blog](https://azure.microsoft.com/blog/topics/internet-of-things/)
