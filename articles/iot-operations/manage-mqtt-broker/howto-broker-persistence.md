---
title: Data persistence for the Azure IoT Operations MQTT broker (preview)
description: Learn how to configure the data persistence feature for the Azure IoT Operations MQTT broker for data durability.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 07/22/2025

---

# Configure MQTT broker persistence (preview)

The data persistence feature is designed as a complementary mechanism to the replication system. While the broker replicates data across multiple nodes, a cluster-wide shutdown can still result in data loss.

To mitigate this risk, the MQTT broker supports persistent storage, which allows critical data to be written to disk and preserved across restarts. This data persistence feature is different from the [Disk-backed message buffer](./howto-disk-backed-message-buffer.md), which uses disk as an extension of memory but is ephemeral and doesn't provide durability guarantees.

Storing data on disk introduces a performance cost. The impact varies depending on the type and speed of the underlying storage medium.

You can configure data persistence during initial deployment by using the Azure portal or Azure CLI. Some persistence-related options can also be modified after deployment.

## Configuration methods

To configure data persistence for the MQTT broker, you can use either:

- **Azure portal**: Configure persistence settings through the graphical user interface during IoT Operations deployment.
- **Azure CLI**: Use a JSON configuration file with the `--broker-config-file` flag when you deploy IoT Operations using the `az iot ops create` command.

For the complete list of available settings, see the Azure IoT Operations API documentation.

## Deployment-time configuration options

These settings must be configured at deployment time and can't be changed later.

> [!IMPORTANT]
> Persistence must be configured at deployment time and can't be disabled afterward. However, some persistence-related options can be modified after deployment.

### Volume and volume size

To persist data on disk, the MQTT broker uses a Persistent Volume (PV). Two settings control how this volume is provisioned:

- **`maxSize`** *(required)*: Specifies the maximum size of the persistent volume used for storing broker data. This field is always required, even if a custom volume claim is provided. The value must be above 100 MB.
  
  **Example:** `10GiB`

- **`persistentVolumeClaimSpec`** *(optional)*: Defines a custom PersistentVolumeClaim (PVC) template to control how the persistent volume is provisioned. If you don't specify this setting, a default PVC is automatically created using the specified `maxSize` and the default storage class, which may result in suboptimal performance if the default class isn't backed by a local path provisioner.

> [!IMPORTANT]
> When you specify `persistentVolumeClaimSpec`, the access mode must be set to `ReadWriteOncePod`.

# [Azure portal](#tab/portal)

[Screenshot placeholder: Volume and volume size configuration in Azure portal]

To configure volume settings in the Azure portal:

1. During IoT Operations deployment, navigate to the **MQTT Broker** configuration section.
2. In the **Data Persistence** settings:
   - Set the **Maximum Size** for the persistent volume (required).
   - Optionally configure **Persistent Volume Claim Spec** settings for custom storage class requirements.

# [Azure CLI](#tab/azurecli)

To configure volume settings using Azure CLI, prepare a Broker configuration file in JSON format:

```json
{
  "persistence": {
    "maxSize": "10GiB",
    "persistentVolumeClaimSpec": {
      "storageClassName": "example-storage-class",
      "accessModes": [
        "ReadWriteOncePod"
      ]
    }
  }
}
```

Then deploy IoT Operations using the `az iot ops create` command with the `--broker-config-file` flag:

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

---

### Encryption

To protect data, the MQTT broker encrypts all persistence data on disk by default using strong AES-256-GCM encryption. This ensures that even if an attacker gains access to the underlying volume, sensitive broker state or session data remains protected.

Encryption is optional and is enabled automatically. However, you can disable encryption if needed. Note that encryption protects data at rest only and data in memory isn't encrypted. The performance cost of using encryption should be minimal, but key rotation isn't supported yet.

# [Azure portal](#tab/portal)

[Screenshot placeholder: Encryption configuration in Azure portal]

To configure encryption settings in the Azure portal:

1. During IoT Operations deployment, navigate to the **MQTT Broker** configuration section.
2. In the **Data Persistence** settings:
   - Toggle **Encryption** to enable or disable data encryption.
   - By default, encryption is enabled using AES-256-GCM.

# [Azure CLI](#tab/azurecli)

To disable encryption using Azure CLI, add the following to your Broker configuration file:

```json
{
  "persistence": {
    "encryption": {
      "mode": "Disabled"
    }
  }
}
```

---

## Runtime configuration options

These options can be updated after you deploy Azure IoT Operations MQTT broker.

### Retained messages persistence

Retained messages are MQTT messages that the broker stores and delivers to new subscribers when they connect to a topic. These messages help ensure that subscribers receive the most recent data even if they weren't connected when the message was originally published. This is particularly useful for status updates, configuration data, or last-known values that new subscribers need immediately upon connection.

Persisting retained messages to disk ensures that these important messages survive broker restarts and aren't lost during maintenance or unexpected shutdowns. Without persistence, retained messages exist only in memory and are lost when the broker restarts, which could leave new subscribers without critical initial data.

This setting controls which retained messages are persisted to disk.

- **`mode`** *(required if `retain` is set)*: Options are `None`, `All`, or `Custom`.
  - `None`: No retained messages are persisted.
  - `All`: All retained messages are persisted.
  - `Custom`: Only the topics listed in `retainSettings.topics` are persisted.

- If you select `Custom`:
    - **`retainSettings.topics`** *(optional)*: List of topic patterns to persist. Wildcards `#` and `+` are supported.

    - **`retainSettings.dynamic.mode`** *(optional, default: `Enabled`)*: Allows MQTT clients to request disk persistence for retained messages using an MQTT v5 user property.

# [Azure portal](#tab/portal)

[Screenshot placeholder: Retained messages persistence configuration in Azure portal]

To configure retained messages persistence in the Azure portal:

1. Navigate to your IoT Operations instance.
2. Go to **MQTT Broker** > **Data Persistence**.
3. In the **Retained Messages** section:
   - Select the **Mode**: None, All, or Custom.
   - If Custom is selected, specify topic patterns and dynamic mode settings.

# [Azure CLI](#tab/azurecli)

To configure retained messages persistence using Azure CLI, add the following to your Broker configuration file:

```json
{
  "persistence": {
    "retain": {
      "mode": "Custom",
      "retainSettings": {
        "topics": ["my/+/topics"],
        "dynamic": {
          "mode": "Enabled"
        }
      }
    }
  }
}
```

---

### Subscriber queue persistence

Subscriber queues hold messages that are waiting to be delivered to MQTT clients with Quality of Service (QoS) 1 subscriptions. When a client subscribes with QoS 1, the broker guarantees message delivery by queuing messages until the client acknowledges receipt. These queues are especially important for clients that may be temporarily disconnected or processing messages slowly.

Persisting subscriber queues to disk ensures that messages waiting for delivery aren't lost during broker restarts. This is critical for IoT scenarios where devices may have intermittent connectivity, slow processing capabilities, or persistent sessions that need to maintain message delivery guarantees across broker restarts. Without persistence, queued messages would be lost, potentially causing data loss for important device communications.

For more information about subscriber queues and message delivery, see [Configure broker MQTT client options](./howto-broker-mqtt-client-options.md#subscriber-queue-limit).

This setting controls which subscriber message queues are persisted to disk. Session state metadata is always persisted regardless of these settings.

- **`mode`** *(required if `subscriberQueue` is set)*: Options are `None`, `All`, or `Custom`.

- If you select `Custom`:
    - **`subscriberQueueSettings.subscriberClientIds`** *(optional)*: List of subscriber client IDs to persist. Wildcards `*` are supported.

    - **`subscriberQueueSettings.dynamic.mode`** *(optional, default: `Enabled`)*: Enables MQTT clients to request persistence dynamically.

# [Azure portal](#tab/portal)

[Screenshot placeholder: Subscriber queue persistence configuration in Azure portal]

To configure subscriber queue persistence in the Azure portal:

1. Navigate to your IoT Operations instance.
2. Go to **MQTT Broker** > **Data Persistence**.
3. In the **Subscriber Queue** section:
   - Select the **Mode**: None, All, or Custom.
   - If Custom is selected, specify subscriber client IDs and dynamic mode settings.

# [Azure CLI](#tab/azurecli)

To configure subscriber queue persistence using Azure CLI, add the following to your Broker configuration file:

```json
{
  "persistence": {
    "subscriberQueue": {
      "mode": "Custom",
      "subscriberQueueSettings": {
        "subscriberClientIds": ["hello-client-id", "my-other-client-*"],
        "dynamic": {
          "mode": "Enabled"
        }
      }
    }
  }
}
```

---

> [!IMPORTANT]
> A client that wasn't previously persisted can become persisted at any time. However, only the publishes received after persistence is enabled for that specific client are stored on disk. If persistence is later disabled for the client, that change won't take effect until the client reconnects with the MQTT clean start = true flag.

#### Session expiry and subscriber queue persistence

For subscribers to have their subscriber message queues persisted to disk, both the session expiry interval and the broker's persistence configuration must align properly. Specifically:

- MQTTv5 clients: Can specify session expiry interval using the Session Expiry Interval property of CONNECT or DISCONNECT packets. They can also request disk persistence behavior with a specified user property.

- MQTTv3 clients: If the Clean Session flag is true, then the session expiry interval is set to 0. Otherwise, the value of `maxSessionExpirySeconds` configuration in the broker is used.

The broker handles subscriber queue persistence differently based on the configuration mode and session expiry interval:

When mode is set to `None`:
- All subscriber queues remain in-memory only, regardless of session expiry interval

When mode is set to `All`:
- If session expiry interval = 0: Queues remain in-memory
- If session expiry interval > 0: Queues are persisted to disk for the duration of the interval

When mode is set to `Custom`:
- If session expiry interval = 0: Queues remain in-memory
- If session expiry interval > 0: Queues are persisted to disk for the duration of the interval only if:
  - The client ID matches the configured list in `subscriberQueueSettings.subscriberClientIds`, OR
  - Dynamic mode is enabled and an MQTTv5 client provided the matching user property in their CONNECT packet

To ensure that subscriber queues are persisted to disk, remember the following key points:

- Subscriber queues are only persisted when the session expiry interval is greater than 0
- For `Custom` mode, either the client ID must be explicitly listed or dynamic persistence must be enabled with the correct user property
- MQTTv5 clients can use dynamic persistence by including the configured user property (default: `aio-persistence=true`) in their CONNECT packet

### State store persistence

The state store is an internal component of the MQTT broker that maintains various types of operational data and metadata beyond standard MQTT messages. This includes broker configuration state, session information, subscription details, and other internal data structures that the broker uses to manage client connections and message routing efficiently.

Persisting state store data to disk ensures that the broker can maintain operational continuity across restarts. This is particularly important for complex IoT deployments where losing internal state could result in connection issues, subscription losses, or performance degradation as the broker rebuilds its internal data structures from scratch.

State store persistence is especially valuable in production environments where minimizing recovery time and maintaining service consistency are critical. Without persistence, the broker must rebuild all internal state when it restarts, which can cause temporary service disruptions and performance impacts.

For more information about the state store, see [Learn about the MQTT broker state store protocol](../create-edge-apps/concept-about-state-store-protocol.md).

This setting controls which keys in the internal state store are persisted.

- **`mode`** *(required if stateStore is set)*: Options are `None`, `All`, or `Custom`.

- If you select `Custom`:
    - **`stateStoreSettings.stateStoreResources`** *(optional)*: List of key types and keys to persist.

        - **`keyType`**: Pattern, String, or Binary

        - **`keys`**: List of keys/patterns to persist.

    - **`stateStoreSettings.dynamic.mode`** *(optional, default: `Enabled`)*: Enables MQTT clients to request persistence dynamically.

# [Azure portal](#tab/portal)

[Screenshot placeholder: State store persistence configuration in Azure portal]

To configure state store persistence in the Azure portal:

1. Navigate to your IoT Operations instance.
2. Go to **MQTT Broker** > **Data Persistence**.
3. In the **State Store** section:
   - Select the **Mode**: None, All, or Custom.
   - If Custom is selected, specify state store resources with key types, keys, and dynamic mode settings.

# [Azure CLI](#tab/azurecli)

To configure state store persistence using Azure CLI, add the following to your Broker configuration file:

```json
{
  "persistence": {
    "stateStore": {
      "mode": "Custom",
      "stateStoreSettings": {
        "stateStoreResources": [
          {
            "keyType": "Pattern",
            "keys": ["cats", "topics-*"]
          },
          {
            "keyType": "Pattern",
            "keys": ["dogs", "weather-*"]
          }
        ],
        "dynamic": {
          "mode": "Enabled"
        }
      }
    }
  }
}
```

---

### Request persistence from a client using dynamic persistence setting

Clients can request persistence for their data by sending an MQTT v5 user property in their messages. This allows clients to dynamically enable persistence for their messages, subscriber queues, or state store entries without requiring broker configuration changes.

When a client requests persistence, the broker checks its current persistence settings and applies them accordingly. If the requested persistence mode is enabled and set to allow dynamic requests, the broker persists the client's data as specified in the configuration.

The dynamic persistence setting can be enabled or disabled for each data type (retained messages, subscriber queues, and state store entries) by setting the `dynamic.mode` to `Enabled` in the respective configuration sections. The MQTT user property key and value used for dynamic persistence requests are configured separately at the broker level.

# [Azure portal](#tab/portal)

[Screenshot placeholder: Dynamic persistence configuration in Azure portal]

To configure dynamic persistence settings in the Azure portal:

1. Navigate to your IoT Operations instance.
2. Go to **MQTT Broker** > **Data Persistence**.
3. Configure the global MQTT user property settings:
   - Set the **User Property Key** (default: `aio-persistence`)
   - Set the **User Property Value** (default: `true`)
4. In each persistence section (Retained Messages, Subscriber Queue, State Store):
   - Set **Dynamic Mode** to Enabled to allow clients to request persistence for that data type.

# [Azure CLI](#tab/azurecli)

To configure dynamic persistence using Azure CLI, add the MQTT user property settings at the broker level and enable dynamic mode for specific data types:

```json
{
  "persistence": {
    "dynamicSettings": {
      "userPropertyKey": "custom-persistence-key",
      "userPropertyValue": "true"
    },
    "retain": {
      "mode": "Custom",
      "retainSettings": {
        "topics": ["my/+/topics"],
        "dynamic": {
          "mode": "Enabled"
        }
      }
    },
    "subscriberQueue": {
      "mode": "Custom", 
      "subscriberQueueSettings": {
        "subscriberClientIds": ["client-*"],
        "dynamic": {
          "mode": "Enabled"
        }
      }
    },
    "stateStore": {
      "mode": "Custom",
      "stateStoreSettings": {
        "stateStoreResources": [
          {
            "keyType": "Pattern",
            "keys": ["important-*"]
          }
        ],
        "dynamic": {
          "mode": "Enabled"
        }
      }
    }
  }
}
```

--- 

To learn more about Azure CLI support for advanced MQTT broker configuration, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).

