---
title: Run inference in a data flow graph (preview)
description: Learn how to use the inference transform in an Azure IoT Operations data flow graph to run machine learning inference through the inference connector.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/08/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to add machine learning inference to a data flow graph so that I can process data with a model as it moves through my pipeline.
---

# Run inference in a data flow graph (preview)

The built-in *inference transform* runs inference on each message in a [data flow graph](../../connect-to-cloud/concept-dataflow-graphs.md). It sends the message payload to the inference connector, and replaces the payload with the model's result. This article shows you how to add the transform to a graph, test the graph, and use file-based payloads.

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../../includes/prereq-azure-cli.md)]

- An inference connector that serves at least one model with `mrpc` settings. To learn how to deploy the connector, see [Deploy the inference connector](howto-deploy-inference-connector.md). The examples in this article use a model named `object-detection`.
- A [data flow profile](../../connect-to-cloud/howto-configure-dataflow-profile.md). You can use the default profile.
- A [data flow endpoint](../../connect-to-cloud/howto-configure-dataflow-endpoint.md) for the source and the destination of the graph. The examples in this article use the default MQTT broker endpoint.

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

Also set the `CUSTOM_LOCATION_NAME` variable to the name of the custom location of your instance:

```bash
CUSTOM_LOCATION_NAME=$(az iot ops show --name $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --query "extendedLocation.name" --output tsv | awk -F'/' '{print $NF}')
```

## How the inference transform works

The following diagram shows how the inference transform in a data flow graph uses the inference connector:

:::image type="content" source="media/inference-transform.svg" alt-text="Diagram of a data flow graph in which the inference transform calls the inference connector, which calls the model endpoint." lightbox="media/inference-transform.svg" border="false":::

For each message, the transform sends the payload and content type to the connector in a `predict` command. It then replaces the payload and content type with those of the first result item, and passes the message to the next node. The topic, user properties, and timestamp of the message don't change. If the command fails, the graph drops the message and logs the error.

The transform is a prebuilt graph artifact, `azureiotoperations/graph-dataflow-inference`, on `mcr.microsoft.com`. Data flow graphs pull it through the `default` registry endpoint that Azure IoT Operations creates when you deploy it.

## Inference transform configuration

Configure the inference transform with the following keys in the `configuration` section of the graph node:

| Key | Required | Description |
|--|--|--|
| `model_name` | Yes | The `name` of the model in the inference connector configuration. The model must have `mrpc` settings. The value can't be empty, and it can't contain the `/`, `+`, or `#` characters. |
| `read_request_from_disk` | No | Set to `true` if the payload of each message is the path of an input file relative to the read folder of the model's data volume, instead of the input data itself. The default is `false`. |

## Create a data flow graph with the inference transform

Use Azure CLI or Bicep to create a data flow graph in the default data flow profile. Both alternatives pull the `azureiotoperations/graph-dataflow-inference:0.2.0-preview.0` artifact through the `default` registry endpoint. The graph reads images from the `camera/images` topic, runs inference on each image with the `object-detection` model, and publishes the results to the `camera/inference-results` topic.

# [Azure CLI](#tab/cli)

1. Save the following graph properties as `inference-graph.json`.

    ```json
    {
      "mode": "Enabled",
      "nodes": [
        {
          "nodeType": "Source",
          "name": "images",
          "sourceSettings": {
            "endpointRef": "default",
            "dataSources": [
              "camera/images"
            ]
          }
        },
        {
          "nodeType": "Graph",
          "name": "inference",
          "graphSettings": {
            "registryEndpointRef": "default",
            "artifact": "azureiotoperations/graph-dataflow-inference:0.2.0-preview.0",
            "configuration": [
              {
                "key": "model_name",
                "value": "object-detection"
              }
            ]
          }
        },
        {
          "nodeType": "Destination",
          "name": "results",
          "destinationSettings": {
            "endpointRef": "default",
            "dataDestination": "camera/inference-results"
          }
        }
      ],
      "nodeConnections": [
        {
          "from": { "name": "images" },
          "to": { "name": "inference" }
        },
        {
          "from": { "name": "inference" },
          "to": { "name": "results" }
        }
      ]
    }
    ```

1. Create or replace the graph with [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply):

    ```azurecli
    az iot ops dataflowgraph apply \
      --name inference-graph \
      --instance $AIO_INSTANCE_NAME \
      --resource-group $RESOURCE_GROUP \
      --profile default \
      --config-file inference-graph.json
    ```

    To update the graph, edit the JSON file and run the same `apply` command again. The file replaces the graph properties, so keep all nodes and connections that you want to retain.

# [Bicep](#tab/bicep)

1. Save the following Bicep file as `inference-graph.bicep`.

    ```bicep
    param aioInstanceName string
    param customLocationName string
    param graphName string = 'inference-graph'
    param modelName string = 'object-detection'

    resource aioInstance 'Microsoft.IoTOperations/instances@2026-09-03-preview' existing = {
      name: aioInstanceName
    }

    resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
      name: customLocationName
    }

    resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2026-09-03-preview' existing = {
      parent: aioInstance
      name: 'default'
    }

    resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-09-03-preview' = {
      parent: defaultDataflowProfile
      name: graphName
      extendedLocation: {
        name: customLocation.id
        type: 'CustomLocation'
      }
      properties: {
        mode: 'Enabled'
        nodes: [
          {
            nodeType: 'Source'
            name: 'images'
            sourceSettings: {
              endpointRef: 'default'
              dataSources: [
                'camera/images'
              ]
            }
          }
          {
            nodeType: 'Graph'
            name: 'inference'
            graphSettings: {
              registryEndpointRef: 'default'
              artifact: 'azureiotoperations/graph-dataflow-inference:0.2.0-preview.0'
              configuration: [
                {
                  key: 'model_name'
                  value: modelName
                }
              ]
            }
          }
          {
            nodeType: 'Destination'
            name: 'results'
            destinationSettings: {
              endpointRef: 'default'
              dataDestination: 'camera/inference-results'
            }
          }
        ]
        nodeConnections: [
          {
            from: { name: 'images' }
            to: { name: 'inference' }
          }
          {
            from: { name: 'inference' }
            to: { name: 'results' }
          }
        ]
      }
    }
    ```

1. Deploy the Bicep file:

    ```azurecli
    az deployment group create \
      --resource-group $RESOURCE_GROUP \
      --name inference-graph \
      --template-file inference-graph.bicep \
      --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME
    ```

    To update the graph, edit the Bicep file and run the same deployment command again.

---

## Test the data flow graph

The following steps use the `mqtt-client` pod from [Test connectivity to MQTT broker with MQTT clients](../../manage-mqtt-broker/howto-test-connection.md) to send an image through the data flow graph.

1. Deploy the `mqtt-client` pod if you didn't already, and copy an image that your model accepts to it. This example copies an image named `sample.jpg`:

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml
    kubectl wait --for=condition=Ready pod/mqtt-client -n azure-iot-operations --timeout=120s
    kubectl cp sample.jpg azure-iot-operations/mqtt-client:/tmp/sample.jpg
    ```

1. In one terminal, subscribe to the destination topic of the graph:

    ```bash
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
    mosquitto_sub -h aio-broker -p 18883 -q 1 \
      -t "camera/inference-results" \
      -F "%t | %C | %p" \
      --cafile /var/run/certs/ca.crt \
      -D CONNECT authentication-method "K8S-SAT" \
      -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)"'
    ```

1. In a second terminal, publish the image to the source topic of the graph:

    ```bash
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
    mosquitto_pub -h aio-broker -p 18883 -q 1 \
      -t "camera/images" \
      -f /tmp/sample.jpg \
      -D PUBLISH content-type "image/jpeg" \
      --cafile /var/run/certs/ca.crt \
      -D CONNECT authentication-method "K8S-SAT" \
      -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)"'
    ```

1. The subscriber in the first terminal shows the result. Its content type and format depend on your model:

    ```output
    camera/inference-results | <CONTENT_TYPE> | <MODEL_RESULT>
    ```

If no result arrives, see [Data flow graphs don't produce results](troubleshoot-inference-connector.md#data-flow-graphs-dont-produce-results).

## Use file-based payloads

Producers can write input files to a shared volume and publish the path of each file instead of its contents. The inference connector reads the files, so the data flow graph doesn't need access to the volume.

1. Configure the model with a data volume. To learn how, see [Enable file-based payloads](howto-deploy-inference-connector.md#enable-file-based-payloads).
1. Add the `read_request_from_disk` key to the configuration of the inference transform, by using the same deployment method that you used to create the graph. See the following examples.
1. Publish the path of each input file, relative to the read folder of the model's data volume, as the message payload. For example, `images/board-01.jpg`. To copy a test file to the volume, see [Send file-based requests](howto-inference-connector-mqtt.md#send-file-based-requests).

The following examples add the `read_request_from_disk` key:

# [Azure CLI](#tab/cli)

In `inference-graph.json`, replace the inference node's `graphSettings.configuration` array with the following array. Keep the other graph properties unchanged:

```json
[
  {
    "key": "model_name",
    "value": "object-detection"
  },
  {
    "key": "read_request_from_disk",
    "value": "true"
  }
]
```

Apply the updated graph:

```azurecli
az iot ops dataflowgraph apply \
  --name inference-graph \
  --instance $AIO_INSTANCE_NAME \
  --resource-group $RESOURCE_GROUP \
  --profile default \
  --config-file inference-graph.json
```

# [Bicep](#tab/bicep)

In `inference-graph.bicep`, update the inference node's `graphSettings.configuration` array:

```bicep
configuration: [
  {
    key: 'model_name'
    value: modelName
  }
  {
    key: 'read_request_from_disk'
    value: 'true'
  }
]
```

Deploy the updated graph:

```azurecli
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --name inference-graph \
  --template-file inference-graph.bicep \
  --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME
```

---

The setting applies to every message that the transform processes. To handle both inline data and file paths, use a separate inference transform for each.

If the model sets `write-response-to-disk` to `true`, the transform replaces the payload with the name of the result file in the write folder of the model's data volume, and sets the content type to `text/plain`. To read the result file in a later transform, for example to postprocess it, configure a file store for the write folder in the data flow graph, and read the file from a WASM module. To learn how, see [Read and write files from WASM data flow graphs with the file store](../../develop-edge-apps/howto-webassembly-file-store.md).

## Process data before and after inference

Add other transforms to the graph to prepare the input data and to use the results:

- **Before inference**: Foundry Local preprocesses image inputs for the model when the message has an image content type, such as `image/jpeg`. To convert other input data into the format that the model expects, [build a custom WebAssembly (WASM) transform](../../develop-edge-apps/howto-build-wasm-modules.md).
- **After inference**: Foundry Local returns the raw output of the model, such as a tensor. To convert it into labels or detections, add a custom WASM transform after the inference transform. The [getModelInfo](reference-inference-connector-commands.md#getmodelinfo) command returns the output names, shapes, and labels of a Foundry Local model. If a model returns JSON, use built-in transforms, such as [map](../../connect-to-cloud/howto-dataflow-graphs-map.md) and [filter](../../connect-to-cloud/howto-dataflow-graphs-filter-route.md), to reshape the results or select the ones to keep.
- **In the same step**: To prepare the input and use the result in your own code, write a WASM module that calls the connector instead of using the inference transform. See [Call the inference connector from a WASM module](howto-inference-connector-webassembly-module.md).

## Scale inference

The connector processes up to `worker-count` commands for each model at the same time, where `worker-count` is in the model's `mrpc` settings. If your model server can handle more concurrent requests, for example because it runs several replicas, increase `worker-count`. To run more instances of the data flow graph, increase the instance count of the [data flow profile](../../connect-to-cloud/howto-configure-dataflow-profile.md).

## Related content

- [What is the inference connector?](overview-inference-connector.md)
- [Send inference requests over MQTT](howto-inference-connector-mqtt.md)
- [Call the inference connector from a WASM module](howto-inference-connector-webassembly-module.md)
- [Run inference on camera images captured by the media connector](howto-media-connector-inference.md)
- [Inference connector command reference](reference-inference-connector-commands.md)
- [Data flow graphs in Azure IoT Operations](../../connect-to-cloud/concept-dataflow-graphs.md)
- [Use WebAssembly (WASM) transforms in data flow graphs](../../connect-to-cloud/howto-dataflow-graph-wasm.md)
- [Read and write files from WASM data flow graphs with the file store](../../develop-edge-apps/howto-webassembly-file-store.md)
