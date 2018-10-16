---
title: Update devices to the latest version of Azure IoT Edge | Microsoft Docs 
description: How to update IoT Edge devices to run the latest versions of the security daemon and the IoT Edge runtime
keywords: 
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 10/05/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Update the IoT Edge runtime

As the IoT Edge service releases new versions, you'll want to update your IoT Edge devices to have the latest features and security improvements. This article provides information about how to update your IoT Edge devices when a new version is available. 

Two components of an IoT Edge device need to be updated if you want to move to a newer version. The first is the security daemon which runs on the device and starts the runtime when the device starts. Currently, the security daemon can only be updated from the device itself. The second component is the runtime, made up of the Edge hub and Edge agent modules. Depending on how you structure your deployment, the runtime can be updated from the device or remotely. 

To find the latest version of Azure IoT Edge, see [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases).


## Update the security daemon

The IoT Edge security daemon is a native component that needs to be updated using the package manager on the IoT Edge device. 

### Linux devices

On Linux devices, use apt-get or your appropriate package manager to update the security daemon. 

```bash
apt-get update
apt-get install libiothsm iotedge
```

### Windows devices

On Windows devices, use the PowerShell script to uninstall and then reinstall the security daemon. The installation script automatically pulls the latest version of the security daemon. You have to provide the connection string for your device again during the installation process. 

Uninstall the security daemon in an administrator PowerShell session. 

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
UnInstall-SecurityDaemon
```

Reinstall the security daemon depending on whether your IoT Edge device uses Windows containers or Linux containers. Replace the phrase **\<Windows or Linux\>** with one of the container operating systems. 

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
Install-SecurityDaemon -Manual -ContainerOS <Windows or Linux>
```

## Update the runtime containers

The way that you update the Edge agent and Edge hub containers depends on whether you use rolling tags (like 1.0) or specific tags (like 1.0.2) in your deployment. 

### Understand IoT Edge tags

The Edge agent and Edge hub images are tagged with the IoT Edge version that they are associated with. There are two different ways to use tags with the runtime images: 

* **Rolling tags** - Use only the first two values of the version number to get the latest image that matches those digits. For example, 1.0 is updated whenever there's a new release to point to the latest 1.0.x version. If the container runtime on your IoT Edge device pulls the image again, the runtime modules are updated to the latest version. This approach is suggested for development purposes. Deployments from the Azure portal default to rolling tags. 
* **Specific tags** - Use all three values of the version number to explicitly set the image version. For example, 1.0.2 won't change after its initial release. You can declare a new version number in the deployment manifest when you're ready to update. This approach is suggested for production purposes.

### Update a rolling tag image

If you use rolling tags in your deployment (for example, mcr.microsoft.com/azureiotedge-hub:**1.0**) then you need to force the container runtime on your device to pull the latest version of the image. 

Delete the local version of the image from your IoT Edge device. 

```cmd/sh
docker rmi mcr.microsoft.com/azureiotedge-hub:1.0
docker rmi mcr.microsoft.com/azureiotedge-agent:1.0
```

You may need to use the force `-f` flag to remove the images. 

The IoT Edge service will pull the latest versions of the runtime images and automatically start them on your device again. 

### Update a specific tag image

If you use specific tags in your deployment (for example, mcr.microsoft.com/azureiotedge-hub:**1.0.2**) then all you need to do is update the tag in your deployment manifest and apply the changes to your device. 

In the Azure portal, the runtime deployment images are declared in the **Configure advanced Edge Runtime settings** section. 

[Configure advanced edge runtime settings](./media/how-to-update-iot-edge/configure-runtime.png)

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

Stay up to date with recent updates and announcement in the [Internet of Things blog](https://azure.microsoft.com/blog/topics/internet-of-things/
) 