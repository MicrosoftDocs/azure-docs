---
title: Troubleshoot the inference connector (preview)
description: Diagnose and fix common problems with the Azure IoT Operations inference connector, such as startup failures, authentication errors, and missing results.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: troubleshooting-general
ms.date: 10/08/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT administrator or operator, I want to diagnose and fix problems with the inference connector so that my inference workloads run reliably.
---

# Troubleshoot the inference connector (preview)

This article helps you fix common problems with the inference connector. The commands assume that the application is named `inference-connector`, as in [Deploy the inference connector](howto-deploy-inference-connector.md), and use the `SUBSCRIPTION_ID`, `RESOURCE_GROUP`, and `AIO_INSTANCE_NAME` environment variables from that article.

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## Collect diagnostic information

1. Check the provisioning state of the application configuration in Azure:

    ```azurecli
    APP_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.IoTOperations/instances/$AIO_INSTANCE_NAME/aioApplicationDefinitions/inference-connector"
    az resource show --ids $APP_ID/aioApplicationConfigurations/inference-connector --api-version 2026-09-03-preview --query properties.provisioningState --output tsv
    ```

1. Check the application configuration on the cluster. Its `status` section reports errors from applying the configuration:

    ```bash
    kubectl get aioapplicationconfiguration inference-connector -n azure-iot-operations -o yaml
    ```

1. Check the connector pod, its events, and its logs. If the connector restarted, add `--previous` to `kubectl logs` to see the previous run:

    ```bash
    kubectl describe pods -n azure-iot-operations -l akri.iotoperations.azure.com/aio-application-configuration=inference-connector
    kubectl logs -n azure-iot-operations -l akri.iotoperations.azure.com/aio-application-configuration=inference-connector --tail=200
    ```

1. Check the `error_code` dimension of the `aio_inference_request_received` [metric](reference-inference-connector-metrics.md), which shows where requests fail.

## The application configuration deployment fails

The configuration deployment fails if the application definition isn't provisioned yet. Wait until the provisioning state of the definition is `Succeeded`, and then deploy the configuration again in a separate deployment.

## The connector pod doesn't start

Use `kubectl describe pods` to find out why the pod doesn't start:

| Pod status | Likely cause | Resolution |
|--|--|--|
| `ContainerCreating`, with events about a secret | A secret in the runtime settings doesn't exist in the `azure-iot-operations` namespace. | Create the secret. If Foundry Local's trust bundle is missing, enable trust-manager secret targets, as described in [Prepare the model endpoint](howto-deploy-inference-connector.md#prepare-the-model-endpoint). |
| `Pending`, with events about a persistent volume claim | A persistent volume claim in the runtime settings doesn't exist in the `azure-iot-operations` namespace, or isn't bound. | Create the persistent volume claim, or fix the storage class so that the claim binds. |
| `ErrImagePull` or `ImagePullBackOff` | The cluster can't pull the connector image. | Check the registry, image name, and tag in the application definition. |

## The connector restarts repeatedly

If the pod status is `CrashLoopBackOff` or its restart count keeps increasing, the connector exits soon after it starts. Check the logs of the previous run:

```bash
kubectl logs -n azure-iot-operations -l akri.iotoperations.azure.com/aio-application-configuration=inference-connector --previous --tail=100
```

The following table lists common errors in the logs, and how to fix them. For the rules that the configuration must follow, see [Validation rules](reference-inference-connector-configuration.md#validation-rules).

If a model refers to a secret, the trust list, or a volume that the connector can't use, the error names the model, the setting (`Auth`, `TrustBundle`, or `DataVolume`), and the reason. For example: `Reference { model: "object-detection", field: Auth, error: UnknownAlias("aml-endpoint-key") }`.

| Error in the logs | Cause | Resolution |
|--|--|--|
| `Failed to parse AioApplication configuration` | A model entry contains an unknown setting, is missing a required setting, or has a value of the wrong type. The message includes the name of the setting. | Fix the setting in the application configuration. Setting names use lowercase words separated by hyphens, such as `http-endpoint`. |
| `at least one model must be configured` | The `models` list is missing or empty. | Add at least one model. |
| `duplicate model name` | Two models have the same `name`. | Give each model a unique name. |
| `at least one of pub-sub or mrpc must be enabled` | A model has neither `pub-sub` nor `mrpc` settings. | Add `pub-sub` settings, `mrpc` settings, or both. |
| `auth is only valid for` | The authentication method isn't valid for the model's `inference-provider`. | Use `key` or `sat` for `FoundryLocal`, and `key` or `aml-token` for `AmlStudio`. |
| `overlap`, `duplicate source-topic`, `duplicate target-topic`, or `matches its own target-topic` | The MQTT topics of the models break a topic rule. | Change the topics. For the rules, see [Configure the MQTT topics for a model](howto-inference-connector-mqtt.md#configure-the-mqtt-topics-for-a-model). |
| `invalid source-topic` or `invalid target-topic` | A topic isn't a valid MQTT topic filter or topic name. For example, the target topic contains a wildcard. | Fix the topic. |
| `sets read-request-from-disk but data-volume is not configured` | A source topic reads request files, but the model doesn't have a `data-volume`. | Add `data-volume` to the model. |
| `write-response-to-disk requires data-volume` | The model writes results to files, but doesn't have a `data-volume`. | Add `data-volume` to the model. |
| `worker-count must be >= 1` | A `worker-count` setting is `0`. | Set `worker-count` to `1` or more. |
| `UnknownAlias` | A `secret-alias` in the `auth` or `trust-bundle` settings of the model doesn't match the `secretAlias` of an entry in the `secrets` list of the runtime settings. | Fix the alias, or add the secret to `secrets`. |
| `Unset` or `Metadata` | The model refers to the trust list or to a secret, but the runtime settings don't have `trustSettings` or `secrets`. | Add the trust list secret or the secret to the runtime settings. |
| `UnknownVolume` | The `data-volume.mount-path` of the model doesn't match the `mountPath` of an entry in the `persistentVolumeClaims` list of the runtime settings. | Set `mount-path` to the `mountPath` of the volume. |
| `OutsideVolume` or `OutsideMount` | A `read-sub-path`, `write-sub-path`, `trust-settings-key`, or `secret-alias` is empty, is an absolute path, or contains `..`. | Use a relative path in the volume, or the name of the key or entry. |
| `WriteDir` or `ReadDir` | The connector can't create or write to the write folder of the model, or can't open its read folder. For example, the folder is a symbolic link that points outside the volume, or the connector doesn't have permission to use it. | Check the folders and their permissions on the volume. |
| `Failed to read bearer token from` | The connector can't read the credential of the model. For example, the secret that `secret-alias` refers to doesn't have the key in `secretKey`. | Create the secret in the `azure-iot-operations` namespace with the key in `secretKey`. |
| `CertificateLoad` or `Failed to load certificates` | The connector can't load the CA certificate of the model. For example, the trust list secret doesn't have the key in `trust-settings-key`, or the value isn't a PEM-encoded certificate. | Check that the key in the trust list secret, or the secret that `secret-alias` refers to, contains the CA certificate. If Foundry Local's trust bundle is missing, enable trust-manager secret targets, as described in [Prepare the model endpoint](howto-deploy-inference-connector.md#prepare-the-model-endpoint). |

## The model endpoint returns errors

If requests to a model fail, the connector logs an error for each failed request, and increments `aio_inference_request_received` with the `predict` error code. The following table lists common errors:

| Error in the logs | Cause | Resolution |
|--|--|--|
| `non-retryable status 401 Unauthorized` | The credential is missing, not valid, or expired. | For a Foundry Local model, check that Foundry Local accepts the `aio-internal` audience. If you store the credential in a secret, update the secret. |
| `non-retryable status 403 Forbidden` | The credential is valid, but isn't authorized to call the model. | For a Foundry Local model, check that the model deployment authorizes the connector's service account. Otherwise, check the authorization settings of the endpoint. |
| `non-retryable status 400 Bad Request` or `422 Unprocessable Entity` | The model doesn't accept the input data or its content type. | Send input data in the format that the model expects, and set the content type of the request. |
| `error sending request for url` | The connector can't connect to the model endpoint. For example, the endpoint URL is wrong, the model deployment isn't running, or the connector can't validate the TLS certificate of the endpoint. | Check the `http-endpoint` URL and the status of the model deployment. For HTTPS endpoints that use a private CA, check that the `trust-bundle` of the model refers to the CA certificate that issued the endpoint certificate. |
| `last retryable status 503 Service Unavailable` or another retryable status | The model endpoint is overloaded or not ready, and the requests still failed after all retries. | Check the health and capacity of the model deployment. Reduce `worker-count`, or scale out the model deployment. |

Each HTTP request to a model endpoint times out after 30 seconds. If your model needs more time for each request, reduce the size of the input data or use faster hardware for the model.

## MQTT requests don't produce results

If you publish requests but don't receive results, check the following items:

- **Topics**: Publish to a source topic of the model, and subscribe to the target topic of the same model. At startup, the connector logs each source topic that it subscribes to.
- **Failed requests**: The connector doesn't publish a result for a failed request. Look for errors about the model in the connector logs.
- **File-based requests**: The payload must be a path relative to the read folder of the model's data volume, and the file must exist. The logs report the paths that the connector rejects.
- **Inline requests on a file-based topic**: The connector treats every payload on a topic with `read-request-from-disk` set to `true` as a file path. Publish inline requests to another source topic.
- **Broker authorization**: If you configured [authorization](../../manage-mqtt-broker/howto-configure-authorization.md) for the MQTT broker, allow the connector's service account to subscribe to the source topics and publish to the target topics. To get the name of the service account, run `kubectl get pods -n azure-iot-operations -l akri.iotoperations.azure.com/aio-application-configuration=inference-connector -o jsonpath='{.items[0].spec.serviceAccountName}'`.

## Data flow graphs don't produce results

If a data flow graph with the inference transform doesn't produce results, check the following items:

- **Model name**: The `model_name` of the transform must exactly match the `name` of a model with `mrpc` settings. Otherwise, the connector doesn't respond to the transform. At startup, the connector logs the names of the models that serve commands.
- **File read mode**: Set `read_request_from_disk` to `true` only if the messages carry file paths.
- **Errors in the graph**: When a `predict` command fails, the graph drops the message and logs the error. Check the logs of the graph and the connector. To learn more, see [Troubleshoot data flow graphs](../../connect-to-cloud/howto-dataflow-graph-wasm.md#troubleshoot-data-flow-graphs).

## More than one inference connector is deployed

Two inference connectors on the same Azure IoT Operations instance conflict on the MQTT broker, and both fail. [Remove](howto-deploy-inference-connector.md#remove-the-inference-connector) the extra connector, and add its models to the remaining one.

## A rotated credential isn't used

Kubernetes updates the mounted file after a delay, and the connector rereads it every 15 seconds. If the connector still uses the old credential after a few minutes, check that you updated the secret in the `azure-iot-operations` namespace that the runtime settings reference.

## Related content

- [Deploy the inference connector](howto-deploy-inference-connector.md)
- [Inference connector configuration reference](reference-inference-connector-configuration.md)
- [Metrics for the inference connector](reference-inference-connector-metrics.md)
- [Troubleshoot Azure IoT Operations](../../troubleshoot/troubleshoot.md)
