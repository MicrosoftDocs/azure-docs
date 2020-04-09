---
title: Use IoT Edge device local storage from a module - Azure IoT Edge | Microsoft Docs
description: Use environment variables and create options to enable module access to IoT Edge device local storage.
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 11/18/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Give modules access to a device's local storage

In addition to storing data using Azure storage services or in your device's container storage, you can also dedicate storage on the host IoT Edge device itself for improved reliability, especially when operating offline.

## Link module storage to device storage

To enable a link from module storage to the storage on the host system, create an environment variable for your module that points to a storage folder in the container. Then, use the create options to bind that storage folder to a folder on the host machine.

For example, if you wanted to enable the IoT Edge hub to store messages in your device's local storage and retrieve them later, you can configure the environment variables and the create options in the Azure portal in the **Runtime Settings** section.

1. For both IoT Edge hub and IoT Edge agent, add an environment variable called **storageFolder** that points to a directory in the module.
1. For both IoT Edge hub and IoT Edge agent, add binds to connect a local directory on the host machine to a directory in the module. For example:

   ![Add create options and environment variables for local storage](./media/how-to-access-host-storage-from-module/offline-storage.png)

Or, you can configure the local storage directly in the deployment manifest. For example:

```json
"systemModules": {
    "edgeAgent": {
        "settings": {
            "image": "mcr.microsoft.com/azureiotedge-agent:1.0",
            "createOptions": {
                "HostConfig": {
                    "Binds":["<HostStoragePath>:<ModuleStoragePath>"]
                }
            }
        },
        "type": "docker",
        "env": {
            "storageFolder": {
                "value": "<ModuleStoragePath>"
            }
        }
    },
    "edgeHub": {
        "settings": {
            "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
            "createOptions": {
                "HostConfig": {
                    "Binds":["<HostStoragePath>:<ModuleStoragePath>"],
                    "PortBindings":{"5671/tcp":[{"HostPort":"5671"}],"8883/tcp":[{"HostPort":"8883"}],"443/tcp":[{"HostPort":"443"}]}}}
        },
        "type": "docker",
        "env": {
            "storageFolder": {
                "value": "<ModuleStoragePath>"
            }
        },
        "status": "running",
        "restartPolicy": "always"
    }
}
```

Replace `<HostStoragePath>` and `<ModuleStoragePath>` with your host and module storage path; both values must be an absolute path.

For example, on a Linux system, `"Binds":["/etc/iotedge/storage/:/iotedge/storage/"]` means the directory **/etc/iotedge/storage** on your host system is mapped to the directory **/iotedge/storage/** in the container. On a Windows system, as another example, `"Binds":["C:\\temp:C:\\contemp"]` means the directory **C:\\temp** on your host system is mapped to the directory **C:\\contemp** in the container.

Additionally, on Linux devices, make sure that the user profile for your module has the required read, write, and execute permissions to the host system directory. Returning to the earlier example of enabling IoT Edge hub to store messages in your device's local storage, you need to grant permissions to its user profile, UID 1000. (The IoT Edge agent operates as root, so it doesn't need additional permissions.) There are several ways to manage directory permissions on Linux systems, including using `chown` to change the directory owner and then `chmod` to change the permissions, such as:

```bash
sudo chown 1000 <HostStoragePath>
sudo chmod 700 <HostStoragePath>
```

You can find more details about create options from [docker docs](https://docs.docker.com/engine/api/v1.32/#operation/ContainerCreate).

## Next steps

For an additional example of accessing host storage from a module, see [Store data at the edge with Azure Blob Storage on IoT Edge](how-to-store-data-blob.md).
