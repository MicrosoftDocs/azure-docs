---
title: How to deploy OPC Twin module for Azure from scratch | Microsoft Docs
description: How to deploy OPC Twin from scratch.
author: dominicbetts
ms.author: dobett
ms.date: 11/26/2018
ms.topic: conceptual
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# Deploy OPC Twin module and dependencies from scratch

The OPC Twin module runs on IoT Edge and provides several edge services to the OPC device twin and registry services. 

There are several options to deploy modules to your [Azure IoT Edge](https://azure.microsoft.com/services/iot-edge/) Gateway, among them

- [Deploying from Azure portal's IoT Edge blade](https://docs.microsoft.com/azure/iot-edge/how-to-deploy-modules-portal)
- [Deploying using AZ CLI](https://docs.microsoft.com/azure/iot-edge/how-to-deploy-monitor-cli)

> [!NOTE]
> For more information on deployment details and instructions, see the GitHub [repository](https://github.com/Azure/azure-iiot-components).

## Deployment manifest

All modules are deployed using a deployment manifest.  An example manifest to deploy both [OPC Publisher](https://github.com/Azure/iot-edge-opc-publisher) and [OPC Twin](https://github.com/Azure/azure-iiot-opc-twin-module) is shown below.

```json
{
  "content": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired": {
          "schemaVersion": "1.0",
          "runtime": {
            "type": "docker",
            "settings": {
              "minDockerVersion": "v1.25",
              "loggingOptions": "",
              "registryCredentials": {}
            }
          },
          "systemModules": {
            "edgeAgent": {
              "type": "docker",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-agent:1.0",
                "createOptions": ""
              }
            },
            "edgeHub": {
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
                "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}], \"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
              }
            }
          },
          "modules": {
            "opctwin": {
              "version": "1.0",
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/iotedge/opc-twin:latest",
                "createOptions": "{\"NetworkingConfig\": {\"EndpointsConfig\": {\"host\": {}}}, \"HostConfig\": {\"NetworkMode\": \"host\" }}"
              }
            },
            "opcpublisher": {
              "version": "2.0",
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/iotedge/opc-publisher:latest",
                "createOptions": "{\"Hostname\":\"publisher\",\"Cmd\":[\"publisher\",\"--pf=./pn.json\",\"--di=60\",\"--to\",\"--aa\",\"--si=0\",\"--ms=0\"],\"ExposedPorts\":{\"62222/tcp\":{}},\"NetworkingConfig\":{\"EndpointsConfig\":{\"host\":{}}},\"HostConfig\":{\"NetworkMode\":\"host\",\"PortBindings\":{\"62222/tcp\":[{\"HostPort\":\"62222\"}]}}}"
              }
            }
          }
        }
      },
      "$edgeHub": {
        "properties.desired": {
          "schemaVersion": "1.0",
          "routes": {
            "opctwinToIoTHub": "FROM /messages/modules/opctwin/* INTO $upstream",
            "opcpublisherToIoTHub": "FROM /messages/modules/opcpublisher/* INTO $upstream"
          },
          "storeAndForwardConfiguration": {
            "timeToLiveSecs": 7200
          }
        }
      }
    }
  }
}
```

## Deploying from Azure portal

The easiest way to deploy the modules to an Azure IoT Edge gateway device is through the Azure portal.  

### Prerequisites

1. Deploy the OPC Twin [dependencies](howto-opc-twin-deploy-dependencies.md) and obtained the resulting `.env` file. Note the deployed `hub name` of the `PCS_IOTHUBREACT_HUB_NAME` variable in the resulting `.env` file.

2. Register and start a [Linux](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) or [Windows](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-windows) IoT Edge gateway and note its `device id`.

### Deploy to an edge device

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to your IoT hub.

2. Select **IoT Edge** from the left-hand menu.

3. Click on the ID of the target device from the list of devices.

4. Select **Set Modules**.

5. In the **Deployment modules** section of the page, select **Add** and **IoT Edge Module.**

6. In the **IoT Edge Custom Module** dialog use `opctwin` as name for the module, then specify the container *image URI* as

   ```bash
   mcr.microsoft.com/iotedge/opc-twin:latest
   ```

   As *create options* use the following JSON:

   ```json
   {"NetworkingConfig": {"EndpointsConfig": {"host": {}}}, "HostConfig": {"NetworkMode": "host" }}
   ```

   Fill out the optional fields if necessary. For more information about container create options, restart policy, and desired status see [EdgeAgent desired properties](https://docs.microsoft.com/azure/iot-edge/module-edgeagent-edgehub#edgeagent-desired-properties). For more information about the module twin see [Define or update desired properties](https://docs.microsoft.com/azure/iot-edge/module-composition#define-or-update-desired-properties).

7. Select **Save** and repeat step **5**.  

8. In the IoT Edge Custom Module dialog, use `opcpublisher` as name for the module and the container *image URI* as 

   ```bash
   mcr.microsoft.com/iotedge/opc-publisher:latest
   ```

   As *create options* use the following JSON:

   ```json
   {"Hostname":"publisher","Cmd":["publisher","--pf=./pn.json","--di=60","--to","--aa","--si=0","--ms=0"],"ExposedPorts":{"62222/tcp":{}},"HostConfig":{"PortBindings":{"62222/tcp":[{"HostPort":"62222"}] }}}
   ```

9. Select **Save** and then **Next** to continue to the routes section.

10. In the routes tab, paste the following 

    ```json
    {
      "routes": {
        "opctwinToIoTHub": "FROM /messages/modules/opctwin/outputs/* INTO $upstream",
        "opcpublisherToIoTHub": "FROM /messages/modules/opcpublisher/outputs/* INTO $upstream"
      }
    }
    ```

    and select **Next**

11. Review your deployment information and manifest.  It should look like the above deployment manifest.  Select **Submit**.

12. Once you've deployed modules to your device, you can view all of them in the **Device details** page of the portal. This page displays the name of each deployed module, as well as useful information like the deployment status and exit code.

## Deploying using Azure CLI

### Prerequisites

1. Install the latest version of the [Azure command line interface (AZ)](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) from [here](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

### Quickstart

1. Save the above deployment manifest into a `deployment.json` file.  

2. Use the following command to apply the configuration to an IoT Edge device:

   ```bash
   az iot edge set-modules --device-id [device id] --hub-name [hub name] --content ./deployment.json
   ```

   The `device id` parameter is case-sensitive. The content parameter points to the deployment manifest file that you saved. 
    ![az IoT Edge set-modules output](https://docs.microsoft.com/azure/iot-edge/media/how-to-deploy-cli/set-modules.png)

3. Once you've deployed modules to your device, you can view all of them with the following command:

   ```bash
   az iot hub module-identity list --device-id [device id] --hub-name [hub name]
   ```

   The device ID parameter is case-sensitive. ![az iot hub module-identity list output](https://docs.microsoft.com/azure/iot-edge/media/how-to-deploy-cli/list-modules.png)

## Next steps

Now that you have learned how to deploy OPC Twin from scratch, here is the suggested next step:

> [!div class="nextstepaction"]
> [Deploy OPC Twin to an existing project](howto-opc-twin-deploy-existing.md)
