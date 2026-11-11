---
title: Send inference requests over MQTT (preview)
description: Learn how to send inference requests to the Azure IoT Operations inference connector by publishing MQTT messages, and how to receive the results.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: how-to
ms.date: 10/08/2026
ai-usage: ai-assisted

#CustomerIntent: As a solution developer, I want to send inference requests to the inference connector over MQTT so that my applications can get predictions from a machine learning model.
---

# Send inference requests over MQTT (preview)

MQTT clients send inference requests by publishing messages to a model's source topic, and receive the results on the model's target topic. This article shows you how to configure the topics, format requests, interpret results, and send test requests.

To run inference as a step in a data flow graph instead, see [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md).

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## Prerequisites

- An inference connector that serves a model with `pub-sub` settings. To deploy one, see [Deploy the inference connector](howto-deploy-inference-connector.md). The examples in this article use a model named `object-detection` with the topics from that article.
- An input file that your model accepts, such as a JPEG image for an image classification model.

## How MQTT inference requests work

The following diagram shows the messages that take part in an MQTT inference request:

:::image type="content" source="media/mqtt-request-sequence.svg" alt-text="Sequence diagram that shows an MQTT client publishing a request, the inference connector calling the model endpoint and publishing the result, and the acknowledgments." lightbox="media/mqtt-request-sequence.svg" border="false":::

The connector subscribes to the model's source topics with QoS 1. For each request, it calls the model, publishes the result to the model's target topic with QoS 1, and acknowledges the request only after the broker acknowledges the result. Design the applications that consume results to handle:

- **Duplicates**: If the connector restarts or disconnects before it acknowledges a request, the broker delivers the request again, so one request can produce more than one result.
- **Out-of-order results**: The connector processes up to `worker-count` requests for each model at the same time, so results can arrive in a different order from the requests.

To match each result to its request, use a correlation ID.

## Configure the MQTT topics for a model

The `pub-sub` settings of a model, in the `models` list of the application configuration, define its topics. The following example configures one topic for inline requests and one for file-based requests:

```bicep
'pub-sub': {
  'source-topics': [
    {
      'source-topic': 'inference/object-detection/request'
    }
    {
      'source-topic': 'inference/object-detection/request-file'
      'read-request-from-disk': true
    }
  ]
  'target-topic': 'inference/object-detection/response'
  'correlation-key': 'correlation-id'
  'worker-count': 2
}
```

| Setting | Description |
|--|--|
| `source-topics` | The topic filters that the connector subscribes to for requests. Filters can include the `+` and `#` wildcards. Set `read-request-from-disk` to `true` on a topic whose payloads are file paths. |
| `target-topic` | The topic that the connector publishes results to. It can't contain wildcards. |
| `correlation-key` | Optional. The name of an MQTT user property that the connector copies from each request to its result. |
| `worker-count` | Optional. The number of requests that the connector processes at the same time for the model. The default is `2`. |

Each model needs its own source and target topics. The source topics of a model can't overlap each other or match the model's target topic, even through wildcards. A model that has a topic with `read-request-from-disk` set to `true` also needs a data volume. To add one, see [Enable file-based payloads](howto-deploy-inference-connector.md#enable-file-based-payloads). The connector checks the settings when it starts, and exits if they break a rule. For all the rules, see [Validation rules](reference-inference-connector-configuration.md#validation-rules).

## Request and result messages

| Part | Request | Result |
|--|--|--|
| Payload | The input data, such as the bytes of an image. For a file-based request, the path of the input file relative to the read folder of the model's data volume. | The model's result. If the model writes results to files, the name of the result file. |
| Content type | The MQTT content type of the input data, such as `image/jpeg`. If it isn't set, the connector uses `application/json`, or for a file-based request, the type that matches the file extension. | The content type of the result, such as `application/json`. For a result file, `text/plain`. |
| Correlation ID | Optional. A user property named after the model's `correlation-key`, with a value that identifies the request. | The same user property and value as the request. |

For a Foundry Local model, set the content type of image inputs, such as `image/jpeg`, so that Foundry Local preprocesses the image for the model. Foundry Local returns the raw output of the model, such as a tensor, so your application must interpret the result for your model.

## Send a test request

The following steps use the `mqtt-client` pod from [Test connectivity to MQTT broker with MQTT clients](../../manage-mqtt-broker/howto-test-connection.md) to send an image to the `object-detection` model.

1. Deploy the `mqtt-client` pod if you haven't already, and copy your input file to it. This example copies an image named `sample.jpg`:

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml
    kubectl wait --for=condition=Ready pod/mqtt-client -n azure-iot-operations --timeout=120s
    kubectl cp sample.jpg azure-iot-operations/mqtt-client:/tmp/sample.jpg
    ```

1. In one terminal, subscribe to the target topic. The output shows the topic, content type, user properties, and payload of each result:

    ```bash
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
    mosquitto_sub -h aio-broker -p 18883 -q 1 \
      -t "inference/object-detection/response" \
      -F "%t | %C | %P | %p" \
      --cafile /var/run/certs/ca.crt \
      -D CONNECT authentication-method "K8S-SAT" \
      -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)"'
    ```

1. In a second terminal, publish the image to the source topic, with its content type and a correlation ID:

    ```bash
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
    mosquitto_pub -h aio-broker -p 18883 -q 1 \
      -t "inference/object-detection/request" \
      -f /tmp/sample.jpg \
      -D PUBLISH content-type "image/jpeg" \
      -D PUBLISH user-property "correlation-id" "request-001" \
      --cafile /var/run/certs/ca.crt \
      -D CONNECT authentication-method "K8S-SAT" \
      -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)"'
    ```

1. The subscriber in the first terminal shows the result. Its content type and format depend on your model:

    ```output
    inference/object-detection/response | <CONTENT_TYPE> | correlation-id:request-001 | <MODEL_RESULT>
    ```

If no result arrives, see [MQTT requests don't produce results](troubleshoot-inference-connector.md#mqtt-requests-dont-produce-results).

## Send file-based requests

For a file-based request, the producer writes the input file to a shared volume and publishes only its path. The model needs a data volume, and a source topic with `read-request-from-disk` set to `true`. To configure them, see [Enable file-based payloads](howto-deploy-inference-connector.md#enable-file-based-payloads). The following steps use the `inference-data` persistent volume claim and the `requests` read folder from that article.

1. Copy the input file to the read folder on the volume. In production, your producers write the files. To copy a test file, use a temporary pod that mounts the volume. This example copies `sample.jpg` to `requests/images/board-01.jpg` on the volume:

    ```bash
    kubectl apply -f - <<'EOF'
    apiVersion: v1
    kind: Pod
    metadata:
      name: inference-data-writer
      namespace: azure-iot-operations
    spec:
      containers:
        - name: writer
          image: mcr.microsoft.com/azurelinux/busybox:1.36
          command: ["sleep", "3600"]
          volumeMounts:
            - name: data
              mountPath: /data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: inference-data
    EOF
    kubectl wait --for=condition=Ready pod/inference-data-writer -n azure-iot-operations --timeout=120s
    kubectl exec inference-data-writer -n azure-iot-operations -- mkdir -p /data/requests/images
    kubectl cp sample.jpg azure-iot-operations/inference-data-writer:/data/requests/images/board-01.jpg
    ```

    The path of the file relative to the read folder is `images/board-01.jpg`.

1. Publish the relative path to the file-based source topic:

    ```bash
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
    mosquitto_pub -h aio-broker -p 18883 -q 1 \
      -t "inference/object-detection/request-file" \
      -m "images/board-01.jpg" \
      -D PUBLISH user-property "correlation-id" "request-002" \
      --cafile /var/run/certs/ca.crt \
      -D CONNECT authentication-method "K8S-SAT" \
      -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)"'
    ```

    The message doesn't have a content type, so the connector uses `image/jpeg` based on the file extension. The subscriber from [Send a test request](#send-a-test-request) shows the result.

1. When you finish testing, delete the temporary pod:

    ```bash
    kubectl delete pod inference-data-writer -n azure-iot-operations
    ```

For the path rules and supported file extensions, see [File settings](reference-inference-connector-configuration.md#file-settings).

If the model sets `write-response-to-disk` to `true`, the connector writes each result to a new file in the write folder of the model's data volume, and publishes the file name instead of the result. The connector doesn't delete request or result files, so your applications must remove them.

## Handle failed requests

If a request fails, the connector doesn't publish a result. It logs the error, counts the failure in the `aio_inference_request_received` [metric](reference-inference-connector-metrics.md), and acknowledges the request so that the broker doesn't deliver it again. A request fails if:

- The connector can't read the input file or write the result file.
- The model endpoint still returns an error after all [retries](reference-inference-connector-configuration.md#retries-and-timeouts). The connector doesn't retry errors like status code 400 or 401.
- The model returns a result that the connector can't use, such as zero or several result items from a Foundry Local model.

Because a failed request produces no result, set a timeout in clients that wait for results.

## Related content

- [What is the inference connector?](overview-inference-connector.md)
- [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md)
- [Inference connector configuration reference](reference-inference-connector-configuration.md)
- [Troubleshoot the inference connector](troubleshoot-inference-connector.md)
