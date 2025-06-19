---
title: Data persistence for the Azure IoT Operations MQTT broker
description: Learn how to configure the data persistence feature for the Azure IoT Operations MQTT broker for data durability.
author: Hugues Bouvier
ms.author: hbouvie
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 06/18/2025

---

# Configure Data Persistence Behavior

> [!IMPORTANT]
> This setting requires that you modify the **Broker** resource. Persistence must be configured at deployment time and cannot be disabled afterward. However, some persistence-related options can be modified after deployment.

The data persistence feature is designed as a complementary mechanism to the replication system. While the broker replicates data across multiple nodes, a cluster-wide shutdown can still result in data loss.

To mitigate this risk, the Azure MQTT Broker supports persistent storage, allowing critical data to be written to disk and preserved across restarts.

> [!NOTE]
> Do not confuse this feature with the [Disk-backed message buffer](./howto-disk-backed-message-buffer.md), which uses disk as an extension of memory. The buffer is ephemeral and does not provide durability guarantees.

Storing data on disk introduces a performance cost. The impact varies depending on the type and speed of the underlying storage medium.

## Imutable Configuration options
Those options can only be selected at deployment time and can't be modified afterward:

### Encryption
To protect data, the Azure MQTT Broker encrypts all persistence data on disk by default using strong AES-256-GCM encryption. This ensures that even if an attacker gains access to the underlying volume, sensitive broker state or session data remains protected.

Encryption is optional and is enabled automatically, however, encryption can be disabled:

```json
{
  "persistence": {
    "encryption": {
      "mode": "Disabled"
    },
}
```

>[!NOTE]
>Encryption protects data at rest only. Data in memory is not encrypted.

>[!NOTE]
>Performance cost of using encryption should be minimal

>[!NOTE]
>Key rotation is not supported yet.

### Volume and Volume size
To persist data on disk, the Azure MQTT Broker uses a Persistent Volume (PV). Two settings control how this volume is provisioned:

- **`maxSize`** *(required)*
  Specifies the maximum size of the persistent volume used for storing broker data. This field is always required, even if a custom volume claim is provided.
  **Example:** `10GiB`

> [!NOTE]
> maxSize must be above 100Mb

- **`persistentVolumeClaimSpec`** *(optional)*
  Defines a custom PersistentVolumeClaim (PVC) template to control how the persistent volume is provisioned.
  If omitted, a default PVC is created using the cluster's default storage class, which may result in suboptimal performance if the default class is not backed by a local path provisioner.

> [!NOTE]
> When `persistentVolumeClaimSpec` is not set, a default PVC is automatically created using the specified `maxSize` and the default storage class.

> [!IMPORTANT]
> When specifying `persistentVolumeClaimSpec`, the access mode must be set to `ReadWriteOncePod`.


```json
{
  "persistence": {
    "maxSize": "10GiB",
    "persistentVolumeClaimSpec": {
      "storageClassName": "example-storage-class",
      "accessModes": [
        "ReadWriteOncePod"
      ]
    },
}
```

## Mutable Configuration Options

These options can be updated after the broker is deployed.

### Retained Messages Persistence

Controls which retained messages are persisted to disk.
- **`mode`** *(required if `retain` is set)*
  Options: `None`, `All`, or `Custom`.
  - `None`: No retained messages are persisted.
  - `All`: All retained messages are persisted.
  - `Custom`: Only the topics listed in `retainSettings.topics` are persisted.

- If `Custom` is selected
    - **`retainSettings.topics`** *(optional)*
    List of topic patterns to persist. Wildcards `#` and `+` are supported.

    - **`retainSettings.dynamic.mode`** *(optional, default: `Enabled`)*
    Allows MQTT clients to request disk persistence for retained messages using an MQTT v5 user property.

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

### Subscriber Queue Persistence

Controls which subscriber message queues are persisted to disk.

- **`mode`** *(required if `subscriberQueue` is set)*
  Options: `None`, `All`, or `Custom`.

- If `Custom` is selected
    - **`subscriberQueueSettings.subscriberClientIds`** *(optional)*
    List of subscriber client IDs to persist. Wildcards `*` supported.

    - **`subscriberQueueSettings.topics`** *(optional)*
    Topic patterns to persist messages for. Supports wildcards `#` and `+`.

    - **`subscriberQueueSettings.dynamic.mode`** *(optional, default: `Enabled`)*
    Enables MQTT clients to request persistence dynamically.

> **Note:** Session state metadata is always persisted regardless of these settings.

```json
{
  "persistence": {
    "subscriberQueue": {
      "mode": "Custom",
      "subscriberQueueSettings": {
        "subscriberClientIds": ["hello-client-id", "my-other-client-*"],
        "topics": ["my/+/topics"],
        "dynamic": {
          "mode": "Enabled"
        }
      }
    }
  }
}
```

> [!IMPORTANT]
> A client that was not previously persisted can become persisted at any time. However, only the publishes received after persistence is enabled for that specific client will be stored on disk. If persistence is later disabled for the client, that change will not take effect until the client reconnects with the MQTT clean start = true flag.

### State Store Persistence
Controls which keys in the internal state store are persisted.

- **`mode`** *(required if stateStore is set)*
  Options: `None`, `All`, or `Custom`.

- If `Custom` is selected
    - **`stateStoreSettings.stateStoreResources`** *(optional)*
    List of key types and keys to persist.

        - **`keyType`**: Pattern, String, or Binary

        - **`keys`**: List of keys/patterns to persist.

    - **`stateStoreSettings.dynamic.mode`** *(optional, default: `Enabled`)*
    Enables MQTT clients to request persistence dynamically.

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
          },
        ],
        "dynamic": {
          "mode": "Enabled"
        }
      }
    }
  }
}
```


