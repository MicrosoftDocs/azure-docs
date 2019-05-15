---
title: Update IoT Edge version on devices - Azure IoT Edge | Microsoft Docs 
description: How to update IoT Edge devices to run the latest versions of the security daemon and the IoT Edge runtime
keywords: 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 03/17/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Update the IoT Edge security daemon and runtime

As the IoT Edge service releases new versions, you'll want to update your IoT Edge devices for the latest features and security improvements. This article provides information about how to update your IoT Edge devices when a new version is available. 

Two components of an IoT Edge device need to be updated if you want to move to a newer version. The first is the security daemon, which runs on the device and starts the runtime modules when the device starts. Currently, the security daemon can only be updated from the device itself. The second component is the runtime, made up of the IoT Edge hub and IoT Edge agent modules. Depending on how you structure your deployment, the runtime can be updated from the device or remotely. 

To find the latest version of Azure IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

>[!IMPORTANT]
>If you are running Azure IoT Edge on a Windows device, do not update to version 1.0.5 if one of the following applies to your device: 
>* You have not upgraded your device to Windows build 17763. IoT Edge version 1.0.5 does not support Windows builds older than 17763.
>* You run Java or Node.js modules on your Windows device. Skip version 1.0.5 even if you have updated your Windows device to the latest build. 
>
>For more information about IoT Edge version 1.0.5, see [1.0.5 release notes](https://github.com/Azure/azure-iotedge/releases/tag/1.0.5). For more information about how to prevent your development tools from updating to the latest version, see [the IoT developer blog](https://devblogs.microsoft.com/iotdev/).


## Update the security daemon

The IoT Edge security daemon is a native component that needs to be updated using the package manager on the IoT Edge device. 

Check the version of the security daemon running on your device by using the command `iotedge version`. 

### Linux devices

On Linux devices, use apt-get or your appropriate package manager to update the security daemon. 

```bash
apt-get update
apt-get install libiothsm iotedge
```

### Windows devices

On Windows devices, use the PowerShell script to uninstall and then reinstall the security daemon. The installation script automatically pulls the latest version of the security daemon. 

Uninstall the security daemon in an administrator PowerShell session. 

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Uninstall-SecurityDaemon
```

Running the `Uninstall-SecurityDaemon` command without any parameters only removes the security daemon from your device, along with the two runtime container images. The config.yaml file is kept on the device, as well as data from the Moby container engine. Keeping the configuration information means that you don't have to provide the connection string or Device Provisioning Service information for your device again during the installation process. 

Reinstall the security daemon depending on whether your IoT Edge device uses Windows containers or Linux containers. Replace the phrase **\<Windows or Linux\>** with the appropriate container operating systems. Use the **-ExistingConfig** flag to point to the existing config.yaml file on your device. 

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Install-SecurityDaemon -ExistingConfig -ContainerOS <Windows or Linux>
```

If you want to install a specific version of the security daemon, download the appropriate iotedged-windows.zip file from [IoT Edge releases](https://github.com/Azure/azure-iotedge/releases). Then, use the `-OfflineInstallationPath` parameter to point to the file location. For more information, see [Offline installation](how-to-install-iot-edge-windows.md#offline-installation).

## Update the runtime containers

The way that you update the IoT Edge agent and IoT Edge hub containers depends on whether you use rolling tags (like 1.0) or specific tags (like 1.0.2) in your deployment. 

Check the version of the IoT Edge agent and IoT Edge hub modules currently on your device using the commands `iotedge logs edgeAgent` or `iotedge logs edgeHub`. 

  ![Find container version in logs](./media/how-to-update-iot-edge/container-version.png)

### Understand IoT Edge tags

The IoT Edge agent and IoT Edge hub images are tagged with the IoT Edge version that they are associated with. There are two different ways to use tags with the runtime images: 

* **Rolling tags** - Use only the first two values of the version number to get the latest image that matches those digits. For example, 1.0 is updated whenever there's a new release to point to the latest 1.0.x version. If the container runtime on your IoT Edge device pulls the image again, the runtime modules are updated to the latest version. This approach is suggested for development purposes. Deployments from the Azure portal default to rolling tags. 
* **Specific tags** - Use all three values of the version number to explicitly set the image version. For example, 1.0.2 won't change after its initial release. You can declare a new version number in the deployment manifest when you're ready to update. This approach is suggested for production purposes.

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

If you use specific tags in your deployment (for example, mcr.microsoft.com/azureiotedge-hub:**1.0.2**) then all you need to do is update the tag in your deployment manifest and apply the changes to your device. 

In the Azure portal, the runtime deployment images are declared in the **Configure advanced Edge Runtime settings** section. 

![Configure advanced edge runtime settings](./media/how-to-update-iot-edge/configure-runtime.png)

In a JSON deployment manifest, update the module images in the **systemModules** section. 

```json
"systemModules": {
  "edgeAgent": {
    "type": "docker",
    "settings": {
      "image": "mcr.microsoft.com/azureiotedge-agent:1.0.2",
      "createOptions": ""
    }
  },
  "edgeHub": {
    "type": "docker",
    "status": "running",
    "restartPolicy": "always",
    "settings": {
      "image": "mcr.microsoft.com/azureiotedge-hub:1.0.2",
      "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}], \"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
    }
  }
},
```

## Next steps

View the latest [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).

Stay up-to-date with recent updates and announcement in the [Internet of Things blog](https://azure.microsoft.com/blog/topics/internet-of-things/) 