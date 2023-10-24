---
title: Define OPC UA assets
description: How to define OPC UA assets using Azure IoT OPC UA Broker Preview
author: timlt
ms.author: timlt
# ms.subservice: opcua-broker
ms.topic: how-to 
ms.date: 10/24/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to to define OPC UA assets 
# so that I can manage the assets in my industrial solution. 
---

# Define OPC UA assets using OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

OPC UA Broker Preview lets you define logical assets that represent your industrial assets. Using these logical assets, you can manage your industrial edge solution.  This article shows you how to use OPC UA Broker to define and deploy asset definitions. 

## Prerequisites

- An OPC UA server connected to OPC UA Broker.  For more information, see [Connect an OPC UA server to Azure IoT OPC UA Broker](howto-connect-an-opcua-server.md). 

## Features supported

The following features are supported for installing OPC UA Broker: 

| Feature                                                  | Supported  | Symbol      |
| -------------------------------------------------------- | ---------- | :---------: |
| Assets creation via K8s/helm                             | Supported  |     ✅     |
| Assets definition via GitOps                             | Supported  |     ✅     |
| Assets importing via AssetGenerator                      | Supported  |     ✅     |
| Assets detection via Akri                                | Supported  |     ✅     |
| Publishing of OPC UA events with predefined event fields | Supported  |     ✅     |
| OPC UA SamplingInterval configuration for datapoints     | Supported  |     ✅     |
| OPC UA QueueSize for datapoints                          | Supported  |     ✅     |
| OPC UA PublishingInterval configuration for Assets       | Supported  |     ✅     |
| OPC UA SamplingInterval configuration for Assets         | Supported  |     ✅     |
| OPC UA QueueSize configuration for Assets                | Supported  |     ✅     |


## Create an AssetType definition
An asset is defined by a type and an instance. The type describes a model of the asset ([DTDL](https://github.com/Azure/opendigitaltwins-dtdl)). The instance maps data points and events to DTDL telemetry events, DTDL properties and DTDL commands of the DTDL model. Assets without a DTDL model still emit telemetry, but can't invoke commands or set properties. 

The following `AssetType` definition describes a simple thermostat:

```yml
apiVersion: opcuabroker.iotoperations.azure.com/v1beta1
kind: AssetType
metadata:
  name: thermostat
  namespace: opcuabroker
  labels:
    com.microsoft.e4i/validation-scope: v1beta1
spec:
  name: Thermostat
  labels:
    - opcuabroker
    - demo
    - thermostat
  schema: |-
    {
      "@context": "dtmi:dtdl:context;2",
      "@id": "dtmi:com:example:Thermostat;1",
      "@type": "Interface",
      "displayName": { "en": "Thermostat" },
      "description": "Reports current temperature and provides desired temperature control.",
      "contents": [
          {
              "@type": "Telemetry",
              "name": "temperature",
              "displayName": { "en": "Temperature" },
              "description": "Temperature in degrees Celsius.",
              "schema": {
                  "@type": "Object",
                  "fields": [
                      {
                          "name": "statusCode",
                          "schema": "integer"
                      },
                      {
                          "name": "sourceTimestamp",
                          "schema": "dateTime"
                      },
                      {
                          "name": "value",
                          "schema": "double"
                      }
                  ]
              }
          },
          {
              "@type": "Telemetry",
              "name": "pressure",
              "displayName":{ "en": "Pressure" },
              "description": "Pressure.",
              "schema": {
                  "@type": "Object",
                  "fields": [
                      {
                          "name": "statusCode",
                          "schema": "integer"
                      },
                      {
                          "name": "sourceTimestamp",
                          "schema": "dateTime"
                      },
                      {
                          "name": "value",
                          "schema": "double"
                      }
                  ]
              }
          },
          {
              "@type": "Telemetry",
              "name": "boilerStatus",
              "displayName": { "en": "Boiler Status" },
              "description": "Boiler Status",
              "schema": {
                  "@type": "Object",
                  "fields": [
                      {
                          "name": "statusCode",
                          "schema": "integer"
                      },
                      {
                          "name": "sourceTimestamp",
                          "schema": "dateTime"
                      },
                      {
                          "name": "value",
                          "schema": {
                              "@type": "Object",
                              "fields": [
                                  {
                                      "name": "Temperature",
                                      "schema": {
                                          "@type": "Object",
                                          "fields": [
                                              {
                                                  "name": "Top",
                                                  "schema": "integer"
                                              },
                                              {
                                                  "name": "Bottom",
                                                  "schema": "integer"
                                              }
                                          ]
                                      }
                                  },
                                  {
                                      "name": "Pressure",
                                      "schema": "integer"
                                  },
                                  {
                                      "name": "HeaterState",
                                      "schema": {
                                          "@type": "Enum",
                                          "valueSchema": "integer",
                                          "enumValues": [
                                              {
                                                  "name": "off",
                                                  "enumValue": 0
                                              },
                                              {
                                                  "name": "on",
                                                  "enumValue": 1
                                              }
                                          ]
                                      }
                                  }
                              ]
                          }
                      }
                  ]
              }
          },
          {
              "@type": "Telemetry",
              "name": "serverEvents",
              "displayName": { "en": "Events" },
              "description": "Demo the event feature.",
              "schema": {
                  "@type": "Object",
                  "fields": [
                      {
                          "name": "eventId",
                          "schema": "string"
                      },
                      {
                          "name": "eventType",
                          "schema": {
                              "@type": "Object",
                              "fields": [
                                  {
                                      "name": "Id",
                                      "schema": "integer"
                                  }
                              ]
                          }
                      },
                      {
                          "name": "sourceNode",
                          "schema": {
                              "@type": "Object",
                              "fields": [
                                  {
                                      "name": "Id",
                                      "schema": "integer"
                                  }
                              ]
                          }
                      },
                      {
                          "name": "sourceName",
                          "schema": "string"
                      },
                      {
                          "name": "time",
                          "schema": "dateTime"
                      },
                      {
                          "name": "receiveTime",
                          "schema": "dateTime"
                      },
                      {
                          "name": "message",
                          "schema": "string"
                      },
                      {
                          "name": "severity",
                          "schema": "integer"
                      }
                  ]
              }
          }
      ]
    }
```

> [!div class="mx-tdBreakAll"]
> | Name                 | Mandatory | Datatype | Default | Comment                                                                                                                                                                                               |
> | -------------------- | --------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `metaData.name`      | true      | String   | ""      | The identifier which will be used to reference the AssetType                                                                                                                                          |
> | `metaData.namespace` | true      | String   | ""      | The namespace of the OPC UA Connector connected to the OPC UA Server where Assets of this type can be accessed                                                                                        |
> | `spec.name`          | true      | String   | ""      | User friendly name to for the AssetType                                                                                                                                                               |
> | `spec.schema`        | true      | String   | ""      | DTDL definition for all Assets of this type. DTDL Telemetry definitions represent subscriptions to OPC UA value change events. Properties represent writable values. Commands are currently not used. |

After an `AssetType` is defined, the next step is to create one or multiple asset instances by using the `AssetType`:

```yml
apiVersion: deviceregistry.microsoft.com/v1beta1
kind: Asset
metadata:
  name: thermostat-sample
  namespace: opcuabroker
  labels:
    com.azure.iotoperations.opcuabroker/validation-scope: v1beta1
spec:
  displayName: Thermostat sample asset
  description: A sample thermostat
  assetType: thermostat
  assetEndpointProfileUri: {{ .Values.endpointProfile }}
  defaultDataPointsConfiguration: |-
    {
      "publishingInterval": 200,
      "samplingInterval": 500,
      "queueSize": 10
    }
  dataPoints:
    - dataSource: nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt1
      capabilityId: dtmi:com:example:Thermostat;1:temperature
      observabilityMode: log
      dataPointConfiguration: |-
        {
          "samplingInterval": 500,
          "queueSize": 15
        }
    - dataSource: nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt2
      capabilityId: dtmi:com:example:Thermostat;1:pressure
      observabilityMode: log
      dataPointConfiguration: |-
        {
          "samplingInterval": 500,
          "queueSize": 15
        }
    - dataSource: nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=15013
      capabilityId: dtmi:com:example:Thermostat;1:boilerStatus
      observabilityMode: log
```

> [!div class="mx-tdBreakAll"]
> | Name                                        | Mandatory | Datatype    | Default                        | Comment                                                                                                                                                                                                                                                                                                                                                  |
> | ------------------------------------------- | --------- | ----------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `metaData.name`                             | true      | String      | ""                             | The identifier which will be used to reference this Asset                                                                                                                                                                                                                                                                                                |
> | `metaData.namespace`                        | true      | String      | ""                             | The namespace of the OPC UA Connector connected to the OPC UA Server where Assets of this type can be accessed                                                                                                                                                                                                                                           |
> | `spec.defaultDataPointsConfiguration`       | false     | String      | ""                             | The Asset's default datapoint configuration settings in JSON format. For OPC UA Asset's allows to set configuration for PublishingInterval, SamplingInterval and QueueSize.                                                                                                        |
> | `spec.defaultEventsConfiguration`           | false     | String      | ""                             | The Asset's default event configuration  settings in JSON format. For OPC UA Asset's allows to set configuration for PublishingInterval and QueueSize.                                                                                                         |
> | `spec.name`                                 | true      | String      | ""                             | User friendly name of the Asset                                                                                                                                                                                                                                                                                                                          |
> | `spec.assetType`                            | false     | String      | ""                             | The AssetType of the Asset. Note that OPC UA Broker does also support untyped Assets.                                                                                                                                                                                                                                                                                                                               |
> | `spec.assetEndpointProfileUri`              | false     | String      | "opc-ua-connector"             | References the downstream connector module which connects to the server allowing access to the Asset's datapoints                                                                                                                                                                                                                                        |
> | `spec.dataPoints`                           | false     | Array       |                                | Defines the mapping of the datapoints (`dataSource`) to the definition in the AssetType's schema (`capabilityId`) and some configuration parameters for each datapoint. The maximum number of datapoints per Asset is configured in the AssetType CRD.                                                                                                     |
> | `spec.dataPoints[].dataSource`              | true      | String      | ""                             | Identifier of the datapoint in the downstream server, where the Asset can be accessed in server specific syntax (OPC UA ExpandedNodeId)                                                                                                                                                                                                                  |
> | `spec.dataPoints[].capabilityId`            | false     | String      | `spec.dataPoints[].dataSource` | If `spec.type` is defined, it has to be the DTMI identifier of the datapoint's Telemetry event in the Asset's DTDL model. If `spec.type` is not set, it can be any string or will fallback to `spec.dataPoints[].dataSource` if omitted. This value will be used as key in the emitted MQTT telemetry messages to identify the data from this datapoint. |
> | `spec.dataPoints[].dataPointConfiguration`  | false     | String      | ""                             | The datapoint's additional configuration in JSON format. For datapoints of an OPC UA Asset it is possible to set the configuration for SamplingInterval and QueueSize. When not provided, the values configured via `spec.additionalConfiguration` will be used.                                                                                         |
> | `spec.dataPoints[].observabilityMode`       | true      | Enumeration | none                           | Defines if and how the datapoint should be mapped to Open Telemetry [none, gauge, counter, histogram, log]                                                                                                                                                                                                                                               |
> | `spec.events`                               | false     | Array       |                                | Defines the mapping of the OPC UA events (`eventNotifier`) to the definition in the AssetType's schema (`capabilityId`) and some configuration parameters for each event. The maximum number of events per Asset is configured in the AssetType CRD.                                                                                                         |
> | `spec.events[].eventNotifier`               | true      | String      |                                | Identifier of the OPC UA event source node in the downstream server, where the Asset can be accessed in server specific syntax (OPC UA ExpandedNodeId)                                                                                                                                                                                                   |
> | `spec.events[].capabilityId`                | false     | String      | `spec.events[].eventNotifier`  | If `spec.type` is defined, it has to be the DTMI identifier of the event's Telemetry event in the Asset's DTDL model. If `spec.type` is not set, it can be any string or will fallback to `spec.events[].eventNotifier` if omitted. This value will be used as key in the emitted MQTT telemetry messages to identify the data from this datapoint.         |  |
> | `spec.events[].eventConfiguration`          | false     | String      | ""                             | The event's  additional configuration in Json format. For events of an OPC UA Asset it is possible to set configuration for SamplingInterval and QueueSize. When not provided, the values configured via `spec.additionalConfiguration` will be used.                                                                                                    |
> | `spec.events[].observabilityMode`           | true      | Enumeration | none                           | Defines if the event should be mapped to Open Telemetry [none, log]                                                                                                                                                                                                                                                                                      |

> [!NOTE]
> Even if `spec.dataPoints` and `spec.events` are optional according to the schema, the validation process only allows assets that have at least one data point or event.

### OPC UA Connector settings for data points and assets
OPC UA Connector lets you configure default values using the fields `DefaultPublishingInterval`, `DefaultSamplingInterval`, and `DefaultQueueSize` in `spec.settings`.  These default values apply to all assets that OPC UA connector processes. When you need to tune the values for the publishing interval, the sampling interval, and the queue size, you can use the configuration fields at the asset level to apply to data points or events. 

### OPC UA Connector limitations
OPC UA Connector has the following limits defined in the custom resource definition:

* A maximum of `1000` data points per asset
* A maximum of `1000` events per asset

There are also soft limits determined by the request size limit for [etcd](https://kubernetes.io/docs/concepts/overview/components/#etcd), which stores custom resources. By default, the maximum size of any request is [1.5 MiB](https://etcd.io/docs/v3.5/dev-guide/limit/). The maximum request size is configurable and can vary between distributions of Kubernetes.

## Create assets manually
By setting `opcPlcSimulation.deploy` parameter to `true` during [installation](howto-install-opcua-broker-using-helm.md), you install OPC UA Broker with one instance of [OPC PLC](https://github.com/Azure-Samples/iot-edge-opc-plc). For demonstration  purposes, the installation creates a helm chart that deploys two assets.

# [bash](#tab/bash)

```bash
# To install demo assets (provided by simulated OPC PLC)
helm upgrade -i aio-opc-demo-assets oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-demo-assets \
  --set image.registry=mcr.microsoft.com \
  --version 0.1.0-preview.2 \
  --namespace opcuabroker \
  --set endpointProfile=aio-opcplc-connector \
  --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# To install demo assets (provided by simulated OPC PLC)
helm upgrade -i aio-opc-demo-assets oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-demo-assets `
  --set image.registry=mcr.microsoft.com `
  --version 0.1.0-preview.2 `
  --namespace opcuabroker `
  --set endpointProfile=aio-opcplc-connector `
  --wait
```
---

## Import assets
OPC UA Broker supports importing assets from [OPC Publisher standalone mode configuration files](https://azure.github.io/Industrial-IoT/modules/publisher.html#configuration-via-configuration-file). The import capability enables you to migrate from IoT Edge deployments to Kubernetes-based systems. 

## Autodetect assets using Akri
OPC UA Broker enables you to autodetect assets by using Azure IoT Akri Preview. For more information, see [Autodetect OPC UA assets using OPC UA Broker](howto-autodetect-opcua-assets.md). 

## Next step

In this article, you learned how to create and deploy asset definitions so that you manage your industrial solution.  Here's the suggested next step for working with assets:
> [!div class="nextstepaction"]
> [Process telemetry using OPC UA Broker](howto-process-telemetry-using-opcua-broker.md)
