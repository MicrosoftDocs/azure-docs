---
title: Azure IoT Edge and Azure IoT Central | Microsoft Docs
description: Understand how to use Azure IoT Edge with an IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 06/08/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [device-developer, iot-edge]

# This article applies to solution builders and device developers.
---

# Connect Azure IoT Edge devices to an Azure IoT Central application

Azure IoT Edge moves cloud analytics and custom business logic from the cloud to your devices. This approach lets your cloud solution focus on business insights instead of data management. Scale out your IoT solution by packaging your business logic into standard containers, deploy those containers to your devices, and monitor them from the cloud.

This article describes:

* IoT Edge gateway patterns with IoT Central.
* How IoT Edge devices connect to an IoT Central application.
* How to use IoT Central to manage your IoT Edge devices.

To learn more about IoT Edge, see [What is Azure IoT Edge?](../../iot-edge/about-iot-edge.md)

## IoT Edge

![Azure IoT Central with Azure IoT Edge](./media/concepts-iot-edge/iotedge.png)

IoT Edge is made up of three components:

* *IoT Edge modules* are containers that run Azure services, partner services, or your own code. Modules are deployed to IoT Edge devices, and run locally on those devices. To learn more, see [Understand Azure IoT Edge modules](../../iot-edge/iot-edge-modules.md).
* The *IoT Edge runtime* runs on each IoT Edge device, and manages the modules deployed to each device. The runtime consists of two IoT Edge modules: *IoT Edge agent* and *IoT Edge hub*. To learn more, see [Understand the Azure IoT Edge runtime and its architecture](../../iot-edge/iot-edge-runtime.md).
* A *cloud-based interface* enables you to remotely monitor and manage IoT Edge devices. IoT Central is an example of a cloud interface.

IoT Central enables the following capabilities to for IoT Edge devices:

* Device templates to describe the capabilities of an IoT Edge device, such as:
  * Deployment manifest upload capability, which helps you manage a manifest for a fleet of devices.
  * Modules that run on the IoT Edge device.
  * The telemetry each module sends.
  * The properties each module reports.
  * The commands each module responds to.
  * The relationships between an IoT Edge gateway device and downstream device.
  * Cloud properties that aren't stored on the IoT Edge device.
  * Device views and forms.
* The ability to provision IoT Edge devices at scale using Azure IoT device provisioning service.
* Rules and actions.
* Custom dashboards and analytics.
* Continuous data export of telemetry from IoT Edge devices.

An IoT Edge device can be:

* A standalone device composed of custom modules.
* A *gateway device*, with downstream devices connecting to it. A gateway device may include custom modules.

## IoT Edge devices and IoT Central

IoT Edge devices can use *shared access signature* tokens or X.509 certificates to authenticate with IoT Central. You can manually register your IoT Edge devices in IoT Central before they connect for the first time, or use the Device Provisioning Service to handle the registration. To learn more, see [How devices connect](overview-iot-central-developer.md#how-devices-connect).

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

To learn more, see [Tutorial: Add an Azure IoT Edge device to your Azure IoT Central application](/training/modules/connect-iot-edge-device-to-iot-central/).

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

## IoT Edge gateway patterns

IoT Central supports the following IoT Edge device patterns:

### IoT Edge as a transparent gateway

Downstream devices connect to IoT Central through the gateway with their own identity.

![IoT Edge as transparent gateway](./media/concepts-iot-edge/edgewithdownstreamdeviceidentity.png)

The IoT Edge device is provisioned in IoT Central along with the downstream devices connected to the IoT Edge device. Runtime support for provisioning downstream devices through the gateway isn't currently supported.

The IoT Edge hub module behaves like IoT Central and handles connections from devices registered in IoT Central. Messages pass from downstream devices to IoT Central as if there's no gateway between them. In a transparent gateway, you can't use custom modules to manipulate the messages from the downstream devices.

> [!NOTE]
> IoT Central currently doesn't support connecting an IoT Edge device as a downstream device to an IoT Edge transparent gateway. This is because all devices that connect to IoT Central are provisioned using the Device Provisioning Service (DPS) and DPS doesn't currently support nested IoT Edge scenarios.

### IoT Edge as a protocol translation gateway

This pattern enables you to connect devices that can't use any of the protocols that IoT Central supports.

![IoT Edge as protocol translation gateway](./media/concepts-iot-edge/edgeasleafdevice.png)

The IoT Edge device is provisioned in IoT Central and any telemetry from your downstream devices is represented as coming from the IoT Edge device. Downstream devices connected to the IoT Edge device aren't provisioned in IoT Central.

### IoT Edge as an identity translation gateway

Downstream devices connect to a module in the gateway that provides IoT Central device identities for them.

![IoT Edge as identity translation gateway](./media/concepts-iot-edge/edgewithoutdownstreamdeviceidentity.png)

The IoT Edge device is provisioned in IoT Central along with the downstream devices connected to the IoT Edge device. Currently, IoT Central doesn't have runtime support for a gateway to provide an identity and to provision downstream devices. If you bring your own identity translation module, IoT Central can support this pattern.

The [Azure IoT Central gateway module for Azure Video Analyzer](https://github.com/iot-for-all/iotc-ava-gateway/blob/main/README.md) on GitHub uses this pattern.

### Downstream device relationships with a gateway and modules

If the downstream devices connect to an IoT Edge gateway device through the *IoT Edge hub* module, the IoT Edge device is a transparent gateway:

:::image type="content" source="media/concepts-iot-edge/gateway-transparent.png" alt-text="Diagram of transparent gateway" border="false":::

If the downstream devices connect to an IoT Edge gateway device through a custom module, the IoT Edge device is a translation gateway. In the following example, downstream devices connect through a *Modbus* custom module that does the protocol translation:

:::image type="content" source="media/concepts-iot-edge/gateway-module.png" alt-text="Diagram of custom module connection" border="false":::

The following diagram shows connections to an IoT Edge gateway device through both types of modules. In this scenario, the IoT Edge device is both a transparent and a translation gateway:

:::image type="content" source="media/concepts-iot-edge/gateway-module-transparent.png" alt-text="Diagram of connecting using both connection modules" border="false":::

Downstream devices can connect to an IoT Edge gateway device through multiple custom modules. The following diagram shows downstream devices connecting through a Modbus custom module, a BLE custom module, and the *IoT Edge hub*  module:

:::image type="content" source="media/concepts-iot-edge/gateway-two-modules-transparent.png" alt-text="Diagram of connecting using multiple custom modules" border="false":::

To learn more about the IoT Edge gateway patterns, see [How an IoT Edge device can be used as a gateway](../../iot-edge/iot-edge-as-gateway.md).

## Deploy the IoT Edge runtime

To learn where you can run the IoT Edge runtime, see [Azure IoT Edge supported systems](../../iot-edge/support.md).

You can also install the IoT Edge runtime in the following environments:

* [Install or uninstall Azure IoT Edge for Linux](../../iot-edge/how-to-provision-single-device-linux-symmetric.md)
* [Install and provision Azure IoT Edge for Linux on a Windows device (Preview)](../../iot-edge/how-to-provision-single-device-linux-on-windows-symmetric.md)
* [Run Azure IoT Edge on Ubuntu Virtual Machines in Azure](../../iot-edge/how-to-install-iot-edge-ubuntuvm.md)

## Monitor your IoT Edge devices

To learn how to remotely monitor your IoT Edge fleet, see [Collect and transport metrics](../../iot-edge/how-to-collect-and-transport-metrics.md).

## Next steps

A suggested next step is to learn how to [Develop your own IoT Edge modules](../../iot-edge/module-development.md).
