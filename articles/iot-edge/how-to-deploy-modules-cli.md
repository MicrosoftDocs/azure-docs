---
title: Deploy Azure IoT Edge Modules Using Azure CLI
description: Use the Azure CLI with the Azure IoT Extension to push an IoT Edge module from your IoT Hub to your IoT Edge device, as configured by a deployment manifest.
author: PatAltimore
ms.author: patricka
ms.date: 05/08/2025
ms.topic: concept-article
ms.service: azure-iot-edge
ms.custom:
  - devx-track-azurecli
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/08/2025
services: iot-edge
---

# Deploy Azure IoT Edge modules using Azure CLI

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

After creating Azure IoT Edge modules with your business logic, deploy them to your devices to operate at the edge. If multiple modules work together to collect and process data, deploy them all at once. Declare the routing rules that connect them as well.

[Azure CLI](/cli/azure) is an open-source, cross-platform command-line tool for managing Azure resources like IoT Edge. It lets you manage Azure IoT Hub resources, device provisioning service instances, and linked hubs out of the box. The new IoT extension enriches Azure CLI with features like device management and full IoT Edge capabilities.

This article explains how to create a JSON deployment manifest and use that file to push the deployment to an IoT Edge device. For information about creating a deployment that targets multiple devices based on their shared tags, see [Deploy and monitor IoT Edge modules at scale](how-to-deploy-cli-at-scale.md).

## Prerequisites

* An [IoT Hub](../iot-hub/iot-hub-create-using-cli.md) in your Azure subscription.
* An IoT Edge device

  If you don't have an IoT Edge device set up, create one in an Azure virtual machine. Follow the steps in one of the quickstart articles to [create a virtual Linux device](quickstart-linux.md) or [create a virtual Windows device](quickstart.md).

* [Azure CLI](/cli/azure/install-azure-cli) in your environment. Your Azure CLI version must be 2.0.70 or higher. Use `az --version` to check. This version supports az extension commands and uses the Knack command framework.
* The [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension)

## Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. For more information about how deployment manifests work and how to create them, see [understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

To deploy modules using the Azure CLI, save the deployment manifest locally as a .json file. Use the file path in the next section to run the command and apply the configuration to your device.

Here is a basic deployment manifest with one module as an example:

>[!NOTE]
>This sample deployment manifest uses schema version 1.1 for the IoT Edge agent and hub. Schema version 1.1 is included with IoT Edge version 1.0.10 and enables features like module startup order and route prioritization.

```json
{
  "content": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired": {
          "schemaVersion": "1.1",
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
                "image": "mcr.microsoft.com/azureiotedge-agent:1.5",
                "createOptions": "{}"
              }
            },
            "edgeHub": {
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-hub:1.5",
                "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
              }
            }
          },
          "modules": {
            "SimulatedTemperatureSensor": {
              "version": "1.0",
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.5",
                "createOptions": "{}"
              }
            }
          }
        }
      },
      "$edgeHub": {
        "properties.desired": {
          "schemaVersion": "1.1",
          "routes": {
            "upstream": "FROM /messages/* INTO $upstream"
          },
          "storeAndForwardConfiguration": {
            "timeToLiveSecs": 7200
          }
        }
      },
      "SimulatedTemperatureSensor": {
        "properties.desired": {
          "SendData": true,
          "SendInterval": 5
        }
      }
    }
  }
}
```

## Deploy to your device

You deploy modules to your device by applying the deployment manifest that you configured with the module information.

Change directories into the folder where you saved your deployment manifest. If you used one of the Visual Studio Code IoT Edge templates, use the `deployment.json` file in the **config** folder of your solution directory and not the `deployment.template.json` file.

Use the following command to apply the configuration to an IoT Edge device:

   ```azurecli
   az iot edge set-modules --device-id [device id] --hub-name [hub name] --content [file path]
   ```

The device ID parameter is case-sensitive. The content parameter points to the deployment manifest file that you saved.

:::image type="content" source="./media/how-to-deploy-cli/set-modules.png" alt-text="Screenshot showing the az iot edge set-modules command line output.":::

## View modules on your device

Once you've deployed modules to your device, you can view all of them with the following command:

View the modules on your IoT Edge device:

   ```azurecli
   az iot hub module-identity list --device-id [device id] --hub-name [hub name]
   ```

The device ID parameter is case-sensitive.

:::image type="content" source="./media/how-to-deploy-cli/list-modules.png" alt-text="Screenshot showing the az iot hub module-identity list command output.":::

## Next steps

Learn how to [Deploy and monitor IoT Edge modules at scale](how-to-deploy-at-scale.md)