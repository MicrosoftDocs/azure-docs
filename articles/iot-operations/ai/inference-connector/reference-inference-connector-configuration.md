---
title: Inference connector configuration reference (preview)
description: Reference for the Azure IoT Operations inference connector settings, including model, authentication, MQTT, command, file, and runtime settings.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: reference
ms.date: 10/08/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT administrator, I want a complete reference for the inference connector settings so that I can configure the models that the connector serves.
---

# Inference connector configuration reference (preview)

This article describes the settings of the inference connector. You specify the settings in the application configuration resource of the connector, `Microsoft.IoTOperations/instances/aioApplicationDefinitions/aioApplicationConfigurations`. To learn how to create the resource, see [Deploy the inference connector](howto-deploy-inference-connector.md).

The application configuration is a child of a reusable *application definition*, which identifies the connector image and application metadata. Both are Azure Resource Manager resources under your Azure IoT Operations instance. Model settings and runtime mounts belong to the per-deployment application configuration, not the definition. To change them, update and redeploy the application configuration through the same Azure Resource Manager workflow.

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## Configuration structure

The `properties` object of the application configuration has two sections:

- `configuration`: The settings of the inference connector. The `models` list in this section contains one entry for each model that the connector serves.
- `runtimeConfiguration`: The settings that Azure IoT Operations uses to run the connector, such as the replica count, the secrets and trust list to mount, and the volumes to mount.

The following example shows the `properties` of an application configuration for a connector that serves one Foundry Local model. This JSON represents the same `properties` object as the Bicep application configuration in the deployment guide, with the optional file-based payload settings included. It isn't a standalone deployment template or a separate connector configuration system. The model accepts inline requests and file-based requests over MQTT, and `predict` and `getModelInfo` commands from data flow graphs:

```json
{
  "configuration": {
    "models": [
      {
        "name": "object-detection",
        "inference-provider": "FoundryLocal",
        "http-endpoint": "https://object-detection-cpu.foundry-local-operator.svc.cluster.local:5000",
        "fl-client-max-retries": 3,
        "auth": {
          "sat": {}
        },
        "trust-bundle": {
          "trust-settings-key": "ca.crt"
        },
        "pub-sub": {
          "source-topics": [
            {
              "source-topic": "inference/object-detection/request"
            },
            {
              "source-topic": "inference/object-detection/request-file",
              "read-request-from-disk": true
            }
          ],
          "target-topic": "inference/object-detection/response",
          "correlation-key": "correlation-id",
          "worker-count": 2
        },
        "mrpc": {
          "worker-count": 2
        },
        "data-volume": {
          "mount-path": "/data",
          "read-sub-path": "requests",
          "write-sub-path": "responses"
        },
        "write-response-to-disk": false
      }
    ]
  },
  "runtimeConfiguration": {
    "runtimeConfigurationType": "ImageConfiguration",
    "imageConfigurationSettings": {
      "replicas": 1,
      "imagePullPolicy": "IfNotPresent",
      "persistentVolumeClaims": [
        {
          "claimName": "inference-data",
          "mountPath": "/data"
        }
      ],
      "trustSettings": {
        "trustListSecretRef": "<FOUNDRY_LOCAL_TRUST_BUNDLE>"
      }
    }
  }
}
```

All the setting names in the `configuration` section use lowercase words separated by hyphens. The connector rejects a model entry that contains a setting that isn't listed in this article.

Model settings don't contain file paths. They refer to the secrets, the trust list, and the volumes in the [runtime settings](#runtime-settings) by name, and the connector finds the files where Azure IoT Operations mounts them.

## Model settings

Each entry in the `configuration.models` list supports the following settings:

| Setting | Type | Required | Description |
|--|--|--|--|
| `name` | string | Yes | A name for the model. The name must be unique in the configuration, can't be empty, and can't contain the `/`, `+`, or `#` characters. The inference transform and the command topics identify the model by this name, and metrics report it in the `model` dimension. |
| `inference-provider` | string | No | The backend that hosts the model: `FoundryLocal` or `AmlStudio`. The default is `FoundryLocal`. |
| `http-endpoint` | string | Yes | The URL of the model endpoint. For `FoundryLocal`, the base URL of the model deployment, for example `https://object-detection-cpu.foundry-local-operator.svc.cluster.local:5000`. The connector adds `/v1/predict` and `/v1/model` to this URL. For `AmlStudio`, the full scoring URI of the online endpoint. |
| `auth` | object | Yes | The credential that the connector uses to call the model endpoint. See [Authentication settings](#authentication-settings). |
| `fl-client-max-retries` | integer | Yes | The maximum number of times the connector retries a failed HTTP request to the model endpoint. This setting applies to both backends. Set it to `0` to disable retries. See [Retries and timeouts](#retries-and-timeouts). |
| `trust-bundle` | object | No | The CA certificate that issues the TLS certificate of the model endpoint. If you don't set it, the connector validates the endpoint certificate by using its default set of trusted root certificates. See [Trust bundle settings](#trust-bundle-settings). |
| `pub-sub` | object | Conditional | The MQTT topics for requests and results. A model must have `pub-sub` settings, `mrpc` settings, or both. See [MQTT settings](#mqtt-settings). |
| `mrpc` | object | Conditional | Enables the `predict` and `getModelInfo` commands for the model. Data flow graphs use these commands. A model must have `pub-sub` settings, `mrpc` settings, or both. See [Command settings](#command-settings). |
| `data-volume` | object | Conditional | The volume and folders for request files and result files. Required if a source topic of the model sets `read-request-from-disk` to `true`, or if `write-response-to-disk` is `true`. Also required to handle `predict` commands that refer to files. See [File settings](#file-settings). |
| `write-response-to-disk` | boolean | No | If `true`, the connector writes each result to a new file in the write folder of `data-volume`, and returns the name of the file instead of the result. Applies to results over MQTT and to command results. The default is `false`. |

## Authentication settings

The `auth` object of a model contains exactly one of the following methods:

| Method | Backends | Description |
|--|--|--|
| `key` | `FoundryLocal`, `AmlStudio` | Set `key.secret-alias` to the `secretAlias` of the `secrets` entry that contains the API key of a Foundry Local model deployment or the key of an Azure Machine Learning online endpoint. |
| `sat` | `FoundryLocal` | Set `sat` to an empty object, `{}`, to use the service account token (SAT) that Azure IoT Operations provides to the connector for the MQTT broker. Kubernetes refreshes this token automatically. Foundry Local must accept the token's `aio-internal` audience, and the model deployment must authorize the connector's service account. Azure IoT Operations names the service account `aioappcfg-<CONFIGURATION_NAME>-sa`, where `<CONFIGURATION_NAME>` is the name of the application configuration, for example `aioappcfg-inference-connector-sa`. |
| `aml-token` | `AmlStudio` | Set `aml-token.secret-alias` to the `secretAlias` of the `secrets` entry that contains an Azure Machine Learning token for the online endpoint. |

For every method, the connector sends the credential, without leading and trailing whitespace, as a bearer token in the `Authorization` header. For `key` and `aml-token`, store the credential in a secret in the `azure-iot-operations` namespace, and add the secret to the `secrets` list of the [runtime settings](#runtime-settings).

The connector rereads the credential every 15 seconds, so an updated secret takes effect without a restart. If the credential is empty, the connector keeps the previous credential. If the credential doesn't exist when the connector starts, the connector exits.

Azure Machine Learning tokens expire, so if you use `aml-token`, replace the token in its secret before it expires. For details, see [Authenticate clients for online endpoints](/azure/machine-learning/how-to-authenticate-online-endpoint).

## Trust bundle settings

The `trust-bundle` object of a model contains exactly one of the following settings:

| Setting | Type | Description |
|--|--|--|
| `trust-settings-key` | string | A key of the secret in `trustSettings.trustListSecretRef` of the [runtime settings](#runtime-settings), for example `ca.crt`. The value of the key is the CA certificate. |
| `secret-alias` | string | The `secretAlias` of the `secrets` entry that contains the CA certificate. Use this setting when the CA certificate isn't in the trust list secret. |

The certificate must be PEM-encoded. The connector uses only the first certificate in a key, so store each CA certificate in its own key.

## MQTT settings

The `pub-sub` object of a model supports the following settings:

| Setting | Type | Required | Description |
|--|--|--|--|
| `source-topics` | array | Yes | The topics that the connector subscribes to for requests. The list must contain at least one entry. |
| `source-topics[].source-topic` | string | Yes | An MQTT topic filter. The filter can include the `+` and `#` wildcards. |
| `source-topics[].read-request-from-disk` | boolean | No | If `true`, the payload of each message on this topic is the path of a request file relative to the read folder of the model's `data-volume`. The default is `false`. |
| `target-topic` | string | Yes | The MQTT topic that the connector publishes results to. The topic can't contain wildcards. |
| `correlation-key` | string | No | The name of an MQTT user property. If a request has a user property with this name, the connector adds the same user property to the result. |
| `worker-count` | integer | No | The maximum number of requests from the source topics that the connector processes at the same time for the model. The value must be at least `1`. The default is `2`. |

The connector subscribes to the source topics with QoS 1, publishes results with QoS 1, and acknowledges each request after the broker acknowledges its result. To learn more about the request and result messages, see [Send inference requests over MQTT](howto-inference-connector-mqtt.md).

## Command settings

The `mrpc` object of a model enables the `predict` and `getModelInfo` commands for the model. It supports the following setting:

| Setting | Type | Required | Description |
|--|--|--|--|
| `worker-count` | integer | No | The maximum number of commands that the connector processes at the same time for the model. The value must be at least `1`. The default is `2`. |

To enable the commands with the default settings, set `mrpc` to an empty object. To learn more about the commands, see [Inference connector command reference](reference-inference-connector-commands.md).

## File settings

The `data-volume` object of a model selects a volume and the folders on it for request files and result files. It supports the following settings:

| Setting | Type | Required | Description |
|--|--|--|--|
| `mount-path` | string | Yes | The `mountPath` of an entry in the `persistentVolumeClaims` list of the [runtime settings](#runtime-settings). |
| `read-sub-path` | string | No | The folder that the connector reads request files from, relative to the root of the volume. The default is the root of the volume. |
| `write-sub-path` | string | No | The folder that the connector writes result files to, relative to the root of the volume. The default is the root of the volume. |

The sub-paths must be relative paths in the volume, without `..` segments. Use different folders for request files and result files. The connector opens each folder once and keeps using it, so if you rename, replace, or delete and re-create a folder, restart the connector.

For request files, the connector applies the following rules:

- The path in a request must be relative to the read folder. It can include subfolders. The connector removes leading and trailing whitespace from the path.
- The connector rejects absolute paths, paths that contain `..` segments, absolute symbolic links, and relative symbolic links that point outside the read folder.
- If the read folder doesn't exist when the connector starts, the connector logs a warning, and file-based requests fail until the folder exists.
- If a request doesn't specify a content type, the connector infers it from the file extension, as shown in the following table. For other extensions, the connector uses `application/json`.

  | Extension | Content type |
  |--|--|
  | `.jpg`, `.jpeg` | `image/jpeg` |
  | `.png` | `image/png` |
  | `.gif` | `image/gif` |
  | `.webp` | `image/webp` |
  | `.bmp` | `image/bmp` |
  | `.svg` | `image/svg+xml` |

For result files, the connector applies the following rules:

- The connector writes each result to a new file directly in the write folder. When the connector starts, it creates the write folder if it doesn't exist, and exits if it can't write to the folder. The file name is a unique identifier without an extension.
- For a Foundry Local model, the file contains the data of a result item. For an Azure Machine Learning model, the file contains the body of the scoring response.

The connector doesn't delete request files or result files. The applications that use the files are responsible for removing them.

## Runtime settings

The `runtimeConfiguration` object of the application configuration supports the following settings:

| Setting | Description |
|--|--|
| `runtimeConfigurationType` | Set to `ImageConfiguration`. |
| `imageConfigurationSettings.replicas` | The number of connector replicas. Set to `1`. The inference connector doesn't support more than one replica. |
| `imageConfigurationSettings.imagePullPolicy` | The Kubernetes image pull policy for the connector container: `Always`, `IfNotPresent`, or `Never`. The default is `IfNotPresent`. |
| `imageConfigurationSettings.resources.limits` | The CPU and memory limits of the connector container, for example `cpu: '500m'` and `memory: '400Mi'`. The application definition sets the requests. |
| `imageConfigurationSettings.secrets` | The secrets to mount in the connector container. Each entry has a `secretAlias`, which model settings use to refer to the entry, a `secretRef` (the name of a secret in the `azure-iot-operations` namespace), and a `secretKey` (a key in that secret). |
| `imageConfigurationSettings.trustSettings.trustListSecretRef` | The name of a secret in the `azure-iot-operations` namespace that contains CA certificates. Model settings refer to a key of this secret with `trust-bundle.trust-settings-key`. You can set only one trust list secret. To trust CA certificates from other secrets, add them to `secrets`, and refer to them with `trust-bundle.secret-alias`. |
| `imageConfigurationSettings.persistentVolumeClaims` | The existing persistent volume claims to mount in the connector container. Each entry has a `claimName` (the name of a persistent volume claim in the `azure-iot-operations` namespace) and a `mountPath`, which model settings use to refer to the volume in `data-volume.mount-path`. The mount path must be an absolute path. It can't be `/`, it can't be in the `/etc/akri` or `/var/run/secrets` folders, and each entry needs a different mount path. Azure IoT Operations mounts the volumes with read and write access. |

The connector pod doesn't start until all the secrets and persistent volume claims that the runtime settings reference exist in the `azure-iot-operations` namespace.

## Validation rules

The connector validates its configuration when it starts. If the configuration isn't valid, the connector logs an error that describes the problem, and exits. Kubernetes then restarts the connector, so the pod shows repeated restarts until you fix the configuration.

The configuration must follow these rules:

- The `models` list contains at least one model, and each model has a unique `name`.
- Each model entry contains only the settings that this article describes, and has values for all the required settings.
- Each model has `pub-sub` settings, `mrpc` settings, or both.
- The `auth` object of each model contains exactly one method, and the method is valid for the model's `inference-provider`. `sat` is valid only for `FoundryLocal`, and `aml-token` is valid only for `AmlStudio`.
- Each `pub-sub` object has at least one source topic, and every source topic is a valid MQTT topic filter.
- Every source topic is unique across all models, and the source topics of a model don't overlap.
- Every target topic is a valid MQTT topic name without wildcards, and is unique across all models.
- No source topic of a model matches the target topic of the same model, including through wildcards.
- Every `worker-count` value is at least `1`.
- A model that has a source topic with `read-request-from-disk` set to `true`, or that sets `write-response-to-disk` to `true`, also has a `data-volume`.
- Every `secret-alias` matches the `secretAlias` of an entry in the `secrets` list, and every `data-volume.mount-path` matches the `mountPath` of an entry in the `persistentVolumeClaims` list.
- A model that uses `trust-bundle.trust-settings-key` has a trust list secret in `trustSettings`.
- Every `read-sub-path` and `write-sub-path` is a relative path in the volume, without `..` segments.

The connector also exits if it can't read a credential or a CA certificate of a model when it starts, or if it can't create or write to the write folder of a model. The connector doesn't call the model endpoints when it starts, so an unreachable endpoint doesn't prevent the connector from starting. Requests to that model fail until the endpoint is available.

## Retries and timeouts

The connector handles transient failures as described in the following table:

| Operation | Behavior |
|--|--|
| HTTP requests to the model endpoint | Each attempt times out after 30 seconds. The connector retries network errors, timeouts, and the status codes 408, 429, 500, 502, 503, and 504, up to `fl-client-max-retries` times. The delay between attempts grows exponentially from about 1 second, with random jitter, up to 30 seconds. Other status codes fail immediately. |
| Credential files | The connector checks each credential file for changes every 15 seconds. |
| Request and result files | The connector retries transient file system errors, such as a full or busy volume, with exponential backoff for up to 30 seconds. |
| MQTT connections | The connector reconnects automatically after it loses a connection to the MQTT broker, with exponential backoff. |

Because of retries, a single request can take longer than 30 seconds to complete. Consider the retry settings when you set timeouts in the clients that send requests.

## Related content

- [Deploy the inference connector](howto-deploy-inference-connector.md)
- [Send inference requests over MQTT](howto-inference-connector-mqtt.md)
- [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md)
- [Inference connector command reference](reference-inference-connector-commands.md)
- [Troubleshoot the inference connector](troubleshoot-inference-connector.md)
