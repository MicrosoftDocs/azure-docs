---
title: Azure IoT Edge and Azure IoT Central | Microsoft Docs
description: Understand how to use Azure IoT Edge with an IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 02/19/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [device-developer, iot-edge]

# This article applies to solution builders and device developers.
---

# Connect Azure IoT Edge devices to an Azure IoT Central application

Azure IoT Edge moves cloud analytics and custom business logic to devices so your organization can focus on business insights instead of data management. Scale out your IoT solution by packaging your business logic into standard containers, deploy those containers to your devices, and monitor them from the cloud.

This article describes:

* How IoT Edge devices connect to an IoT Central application.
* How to use IoT Central to manage your IoT Edge devices.

To learn more about IoT Edge, see [What is Azure IoT Edge?](../../iot-edge/about-iot-edge.md)

## IoT Edge

IoT Edge is made up of three components:

* *IoT Edge modules* are containers that run Azure services, partner services, or your own code. Modules are deployed to IoT Edge devices, and run locally on those devices. To learn more, see [Understand Azure IoT Edge modules](../../iot-edge/iot-edge-modules.md).
* The *IoT Edge runtime* runs on each IoT Edge device, and manages the modules deployed to each device. The runtime consists of two IoT Edge modules: *IoT Edge agent* and *IoT Edge hub*. To learn more, see [Understand the Azure IoT Edge runtime and its architecture](../../iot-edge/iot-edge-runtime.md).
* A *cloud-based interface* enables you to remotely monitor and manage IoT Edge devices. IoT Central is an example of a cloud interface.

An IoT Edge device can be:

* A standalone device composed of modules.
* A *gateway device*, with downstream devices connecting to it.

## IoT Edge as a gateway

An IoT Edge device can operate as a gateway that provides a connection between other downstream devices on the network and your IoT Central application.

There are two gateway patterns:

* In the *transparent gateway* pattern, the IoT Edge hub module behaves like IoT Central and handles connections from devices registered in IoT Central. Messages pass from downstream devices to IoT Central as if there's no gateway between them.

    > [!NOTE]
    > IoT Central currently doesn't support connecting an IoT Edge device as a downstream device to an IoT Edge transparent gateway. This is because all devices that connect to IoT Central are provisioned using the Device Provisioning Service (DPS) and DPS doesn't support nested IoT Edge scenarios.

* In the *translation gateway* pattern, devices that can't connect to IoT Central on their own, connect to a custom IoT Edge module instead. The module in the IoT Edge device processes incoming downstream device messages and then forwards them to IoT Central.

The transparent and translation gateway patterns aren't mutually exclusive. A single IoT Edge device can function as both a transparent gateway and a translation gateway.

To learn more about the IoT Edge gateway patterns, see [How an IoT Edge device can be used as a gateway](../../iot-edge/iot-edge-as-gateway.md).

### Downstream device relationships with a gateway and modules

Downstream devices can connect to an IoT Edge gateway device through the *IoT Edge hub*  module. In this scenario, the IoT Edge device is a transparent gateway:

:::image type="content" source="media/concepts-iot-edge/gateway-transparent.png" alt-text="Diagram of transparent gateway" border="false":::

Downstream devices can also connect to an IoT Edge gateway device through a custom module. In the following scenario, downstream devices connect through a *Modbus* custom module. In this scenario, the IoT Edge device is a translation gateway:

:::image type="content" source="media/concepts-iot-edge/gateway-module.png" alt-text="Diagram of custom module connection" border="false":::

The following diagram shows connections to an IoT Edge gateway device through both types of modules. In this scenario, the IoT Edge device is both a transparent and a translation gateway:

:::image type="content" source="media/concepts-iot-edge/gateway-module-transparent.png" alt-text="Diagram of connecting using both connection modules" border="false":::

Downstream devices can connect to an IoT Edge gateway device through multiple custom modules. The following diagram shows downstream devices connecting through a Modbus custom module, a BLE custom module, and the *IoT Edge hub*  module:

:::image type="content" source="media/concepts-iot-edge/gateway-two-modules-transparent.png" alt-text="Diagram of connecting using multiple custom modules" border="false":::

## IoT Edge devices and IoT Central

IoT Edge devices can use *shared access signature* tokens or X.509 certificates to authenticate with IoT Central. You can manually register your IoT Edge devices in IoT Central before they connect for the first time, or use the Device Provisioning Service to handle the registration. To learn more, see [Get connected to Azure IoT Central](concepts-get-connected.md).

IoT Central uses [device templates](concepts-device-templates.md) to define how IoT Central interacts with a device. For example, a device template specifies:

* The types of telemetry and properties a device sends so that IoT Central can interpret them and create visualizations.
* The commands a device responds to so that IoT Central can display a UI for an operator to use to call the commands.

An IoT Edge device can send telemetry, synchronize property values, and respond to commands in the same way as a standard device. So, an IoT Edge device needs a device template in IoT Central.

### IoT Edge device templates

IoT Central device templates use models to describe the capabilities of devices. The following diagram shows the structure of the model for an IoT Edge device:

:::image type="content" source="media/concepts-iot-edge/iot-edge-model.png" alt-text="Structure of model for IoT Edge device connected to IoT Central" border="false":::

IoT Central models an IoT Edge device as follows:

* Every IoT Edge device template has a capability model.
* For every custom module listed in the deployment manifest, a module  capability model is generated.
* A relationship is established between each module capability model and a device model.
* A module capability model implements one or more module interfaces.
* Each module interface contains telemetry, properties, and commands.

### IoT Edge deployment manifests and IoT Central device templates

In IoT Edge, you deploy and manage business logic in the form of modules. IoT Edge modules are the smallest unit of computation managed by IoT Edge, and can contain Azure services such as Azure Stream Analytics, or your own solution-specific code.

An IoT Edge *deployment manifest* lists the IoT Edge modules to deploy on the device and how to configure them. To learn more, see [Learn how to deploy modules and establish routes in IoT Edge](../../iot-edge/module-composition.md).

In Azure IoT Central, you import a deployment manifest to create a device template for the IoT Edge device.

The following code snippet shows an example IoT Edge deployment manifest:

```json
{
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
              "image": "mcr.microsoft.com/azureiotedge-agent:1.0.9",
              "createOptions": "{}"
            }
          },
          "edgeHub": {
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-hub:1.0.9",
              "createOptions": "{}"
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
              "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
              "createOptions": "{}"
            }
          }
        }
      }
    },
    "$edgeHub": {
      "properties.desired": {
        "schemaVersion": "1.0",
        "routes": {
            "route": "FROM /* INTO $upstream"
        },
        "storeAndForwardConfiguration": {
          "timeToLiveSecs": 7200
        }
      }
    },
    "SimulatedTemperatureSensor": {
      "properties.desired": {
           "SendData": true,
           "SendInterval": 10
      }
    }
  }
}
```

In the previous snippet, you can see:

* There are three modules. The *IoT Edge agent* and *IoT Edge hub* system modules that are present in every deployment manifest. The custom **SimulatedTemperatureSensor** module.
* The public module images are pulled from an Azure Container Registry repository that doesn't require any credentials to connect. For private module images, set the container registry credentials to use in the `registryCredentials` setting for the *IoT Edge agent* module.
* The custom **SimulatedTemperatureSensor** module has two properties `"SendData": true` and `"SendInterval": 10`.

When you import this deployment manifest into an IoT Central application, it generates the following device template:

:::image type="content" source="media/concepts-iot-edge/device-template.png" alt-text="Screenshot showing the device template created from the deployment manifest.":::

In the previous screenshot you can see:

* A module called **SimulatedTemperatureSensor**. The *IoT Edge agent* and *IoT Edge hub* system modules don't appear in the template.
* An interface called **management** that includes two writable properties called **SendData** and **SendInterval**.

The deployment manifest doesn't include information about the telemetry the **SimulatedTemperatureSensor** module sends or the commands it responds to. Add these definitions to the device template manually before you publish it.

To learn more, see [Tutorial: Add an Azure IoT Edge device to your Azure IoT Central application](tutorial-add-edge-as-leaf-device.md).

### Update a deployment manifest

When you replace the deployment manifest, any connected IoT Edge devices download the new manifest and update their modules. However, IoT Central doesn't update the interfaces in the device template with any changes to the module configuration. For example, if you replace the manifest shown in the previous snippet with the following manifest, you don't automatically see the **SendUnits** property in the **management** interface in the device template. Manually add the new property to the **management** interface for IoT Central to recognize it:

```json
{
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
              "image": "mcr.microsoft.com/azureiotedge-agent:1.0.9",
              "createOptions": "{}"
            }
          },
          "edgeHub": {
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-hub:1.0.9",
              "createOptions": "{}"
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
              "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
              "createOptions": "{}"
            }
          }
        }
      }
    },
    "$edgeHub": {
      "properties.desired": {
        "schemaVersion": "1.0",
        "routes": {
            "route": "FROM /* INTO $upstream"
        },
        "storeAndForwardConfiguration": {
          "timeToLiveSecs": 7200
        }
      }
    },
    "SimulatedTemperatureSensor": {
      "properties.desired": {
           "SendData": true,
           "SendInterval": 10,
           "SendUnits": "Celsius"
      }
    }
  }
}
```

## Deploy the IoT Edge runtime

To learn where you can run the IoT Edge runtime, see [Azure IoT Edge supported systems](../../iot-edge/support.md).

You can also install the IoT Edge runtime in the following environments:

* [Install or uninstall Azure IoT Edge for Linux](../../iot-edge/how-to-install-iot-edge.md)
* [Install and provision Azure IoT Edge for Linux on a Windows device (Preview)](../../iot-edge/how-to-install-iot-edge-on-windows.md)
* [Run Azure IoT Edge on Ubuntu Virtual Machines in Azure](../../iot-edge/how-to-install-iot-edge-ubuntuvm.md)

## IoT Edge gateway devices

If you selected an IoT Edge device to be a gateway device, you can add downstream relationships to device models for devices you want to connect to the gateway device.

To learn more, see [How to connect devices through an IoT Edge transparent gateway](how-to-connect-iot-edge-transparent-gateway.md).

## Next steps

A suggested next step is to learn how to [Develop your own IoT Edge modules](../../iot-edge/module-development.md).
