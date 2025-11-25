---
title: Data persistence for the Azure IoT Operations MQTT broker
description: Learn how to configure the data persistence feature for the Azure IoT Operations MQTT broker for data durability.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 10/27/2025

---

# Configure MQTT broker persistence

The data persistence feature is designed as a complementary mechanism to the replication system. While the broker replicates data across multiple nodes, a cluster-wide shutdown can still result in data loss.

To mitigate this risk, the MQTT broker supports persistent storage, which lets critical data be written to disk and preserved across restarts. This data persistence feature is different from the [Disk-backed message buffer](./howto-disk-backed-message-buffer.md), which uses disk as an extension of memory but is ephemeral and doesn't provide durability guarantees.

Storing data on disk introduces a performance cost. The impact varies depending on the type and speed of the underlying storage medium.

You can configure data persistence during initial deployment by using the Azure portal or Azure CLI. You can also change some persistence options after deployment.

## Configuration methods

Configure data persistence for the MQTT broker by using one of these methods:

- **Azure portal**: Configure persistence settings through the graphical user interface during IoT Operations deployment.
- **Azure CLI**: Use a JSON configuration file with the `--broker-config-file` flag when you deploy IoT Operations using the `az iot ops create` command.

For a complete list of available settings, see the Azure IoT Operations API documentation.

## Deployment-time configuration options

You must set these options during deployment and can't change them later.

> [!IMPORTANT]
> You set persistence during deployment and can't turn it off afterward. You can change some persistence-related options after deployment.

### Volume and volume size

The MQTT broker uses a persistent volume (PV) to store data on disk. Two settings control how this volume is provisioned:

- **`maxSize`** *(required)*: Sets the maximum size of the persistent volume for storing broker data. This field is always required, even if you provide a custom volume claim. The value must be greater than 100 MB.
  
  **Example:** `10GiB`

- **`persistentVolumeClaimSpec`** *(optional)*: Lets you define a custom PersistentVolumeClaim (PVC) template to control how the persistent volume is provisioned. If you don't set this option, the broker creates a default PVC using the specified `maxSize` and the default storage class, which can result in suboptimal performance if the default class isn't backed by a local path provisioner.

> [!IMPORTANT]
> When you specify `persistentVolumeClaimSpec`, the access mode must be set to `ReadWriteOncePod`.

# [Azure portal](#tab/portal)


To configure volume settings in the Azure portal:

1. During IoT Operations deployment, navigate to the **MQTT Broker** configuration section.
2. In the **Data Persistence** settings:
    - Set the **Maximum Size** for the persistent volume (required).
    - Optionally configure **Persistent Volume Claim Spec** settings for custom storage class requirements.

    :::image type="content" source="media/howto-broker-persistence/data-persistence-deploy.png" alt-text="[Screenshot showing data persistence options during deployment in the Azure portal]":::

# [Azure CLI](#tab/azurecli)

1. To deploy MQTT Broker with the minimum required settings to enable disk persistence, use the `az iot ops create` command.

    ```azurecli
    az iot ops create --cluster <CLUSTER_NAME> -g <RESOURCE_GROUP_NAME> --name <INSTANCE_NAME> --sr-resource-id <SCHEMA_REGISTRY_RESOURCE_ID> --ns-resource-id <NAMESPACE_RESOURCE_ID> --persist-max-size 10Gi
    ```

1. To deploy MQTT Broker with disk persistence, custom persistent volume claim, and custom persist mode settings, add the `--persist-pvc-sc` and `--persist-mode` flags to the `az iot ops create` command.

    ```azurecli
    az iot ops create --cluster <CLUSTER_NAME> -g <RESOURCE_GROUP_NAME> --name <INSTANCE_NAME> --sr-resource-id <SCHEMA_REGISTRY_RESOURCE_ID> --ns-resource-id <NAMESPACE_RESOURCE_ID> --persist-max-size 10Gi --persist-pvc-sc <MYSTORAGECLASS> --persist-mode retain=All stateStore=None
    ```


1. If you want to use a custom broker configuration file, add the `--broker-config-file` flag and include the persistence settings in the JSON file.

    ```azurecli
    az iot ops create --broker-config-file <BROKER_CONFIG_FILE>.json --cluster <CLUSTER_NAME> --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP_NAME> --sr-resource-id <SCHEMA_REGISTRY_RESOURCE_ID>
    ```

    The following is an example JSON snippet to include in your custom broker configuration file to set up persistence with a maximum size of 10 GiB and a custom storage class.
    
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

---

### Encryption

To protect data, the MQTT broker encrypts all persistence data on disk by default using strong AES-256-GCM encryption. This ensures that even if an attacker gains access to the underlying volume, sensitive broker state or session data remains protected.

Encryption is optional and is on by default. You can turn off encryption if you need to. Encryption protects data at rest only; data in memory isn't encrypted. Using encryption has minimal performance cost, but key rotation isn't supported yet.

# [Azure portal](#tab/portal)

Encryption is enabled by default when deploying using the Azure portal. you can disable encryption in the broker configuration file if you deploy using Azure CLI.

# [Azure CLI](#tab/azurecli)

To disable encryption using Azure CLI, add the following to your Broker configuration file when using the `--broker-config-file` flag with the [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) command:

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

Persisting retained messages to disk makes sure these important messages survive broker restarts and aren't lost during maintenance or unexpected shutdowns. Without persistence, retained messages exist only in memory and are lost when the broker restarts. This can leave new subscribers without critical initial data.

This setting controls which retained messages are persisted to disk.

- **`mode`** *(required if `retain` is set)*: Options are `None`, `All`, or `Custom`.
  - `None`: No retained messages are persisted.
  - `All`: All retained messages are persisted.
  - `Custom`: Only the topics listed in `retainSettings.topics` are persisted.

- If you select `Custom`:
    - **`retainSettings.topics`** *(optional)*: List of topic patterns to persist. Wildcards `#` and `+` are supported.

    - **`retainSettings.dynamic.mode`** *(optional, default: `Enabled`)*: Allows MQTT clients to request disk persistence for retained messages using an MQTT v5 user property.

# [Azure portal](#tab/portal)


To configure retained messages persistence in the Azure portal:

1. Navigate to your IoT Operations instance.
2. Go to **MQTT Broker** > **Data Persistence**.
3. In the **Retained Messages** section:
    - Select the **Mode**: None, All, or Custom.
    - If Custom is selected, specify topic patterns and dynamic mode settings.

    :::image type="content" source="media/howto-broker-persistence/data-persistence-retained-messages.png" alt-text="[Screenshot changing data persistence retained messages options the Azure portal]":::

# [Azure CLI](#tab/azurecli)

Use the `az iot ops broker persist update` command to update the retained messages persistence.

```azurecli
az iot ops broker persist update --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <BrokerName> --persist-mode retain=<PersistMode> --retain-topics "<TopicPattern1>" "<TopicPattern2>"
```

Here's an example command to update custom persistence policy for retain messages:

```azurecli
az iot ops broker persist update --resource-group myResourceGroup --instance myAioInstance --name myBroker --persist-mode retain=Custom --retain-topics "sensor1" "factory/#" "groundfloor/+/temperature"
```

---

### Subscriber queue persistence

Subscriber queues hold messages that are waiting to be delivered to MQTT clients with Quality of Service (QoS) 1 subscriptions. When a client subscribes with QoS 1, the broker guarantees message delivery by queuing messages until the client acknowledges receipt. These queues are especially important for clients that might be temporarily disconnected or processing messages slowly.

Persisting subscriber queues to disk ensures that messages waiting for delivery aren't lost during broker restarts. This feature is critical for IoT scenarios where devices can have intermittent connectivity, slow processing, or persistent sessions that need to keep message delivery guarantees across broker restarts. Without persistence, queued messages are lost, which can cause data loss for important device communications.

For more information about subscriber queues and message delivery, see [Configure broker MQTT client options](./howto-broker-mqtt-client-options.md#subscriber-queue-limit).

This setting controls which subscriber message queues are persisted to disk. Session state metadata is always persisted regardless of these settings.

- **`mode`** *(required if `subscriberQueue` is set)*: Options are `None`, `All`, or `Custom`.

- If you select `Custom`:
    - **`subscriberQueueSettings.subscriberClientIds`** *(optional)*: List of subscriber client IDs to persist. Wildcards `*` are supported.

    - **`subscriberQueueSettings.dynamic.mode`** *(optional, default: `Enabled`)*: Enables MQTT clients to request persistence dynamically.

# [Azure portal](#tab/portal)


To configure subscriber queue persistence in the Azure portal:

1. Navigate to your IoT Operations instance.
2. Go to **MQTT Broker** > **Data Persistence**.
3. In the **Subscriber Queue** section:
    - Select the **Mode**: None, All, or Custom.
    - If Custom is selected, specify subscriber client IDs and dynamic mode settings.

    :::image type="content" source="media/howto-broker-persistence/data-persistence-subscriber.png" alt-text="[Screenshot changing data persistence subscriber options the Azure portal]":::

# [Azure CLI](#tab/azurecli)

Use the `az iot ops broker persist update` command to update the subscriber queue persistence.

```azurecli
az iot ops broker persist update --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <BrokerName> --persist-mode subscriberQueue=<PersistMode>
```

Here's an example command to configure persistence for all subscriber queues:

```azurecli
az iot ops broker persist update --resource-group myResourceGroup --instance myAioInstance --name myBroker --persist-mode subscriberQueue=All
```

---

> [!IMPORTANT]
> A client that wasn't previously persisted can become persisted at any time. However, only the published messages received after persistence is enabled for that specific client are stored on disk. If persistence is later disabled for the client, that change won't take effect until the client reconnects with the MQTT clean start = true flag.

#### Session expiry and subscriber queue persistence

To persist subscriber message queues to disk, both the session expiry interval and the broker's persistence configuration need to align. Specifically:

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

To make sure subscriber queues are persisted to disk, keep these key points in mind:

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


To configure state store persistence in the Azure portal:

1. Navigate to your IoT Operations instance.
2. Go to **MQTT Broker** > **Data Persistence**.
3. In the **State Store** section:
    - Select the **Mode**: None, All, or Custom.
    - If Custom is selected, specify state store resources with key types, keys, and dynamic mode settings.
    :::image type="content" source="media/howto-broker-persistence/data-persistence-state-store.png" alt-text="[Screenshot changing data persistence state store options the Azure portal]":::

# [Azure CLI](#tab/azurecli)

Use the `az iot ops broker persist update` command to update the state store persistence.

```azurecli
az iot ops broker persist update --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <BrokerName> --persist-mode stateStore=<PersistMode> --state-store-str-keys "<StringKey1>" "<StringKey2>" --state-store-glob-keys "<PatternKey1>" "<PatternKey2>" --state-store-bin-keys "<BinaryKey1>" "<BinaryKey2>"
```

Here's an example command to configure state store persistence with multiple key groups including string, pattern, and binary (base64 encoded) keys:

```azurecli
az iot ops broker persist update --resource-group myResourceGroup --instance myAioInstance --name myBroker --persist-mode stateStore=Custom --state-store-str-keys "device-001" "device-002" --state-store-glob-keys "sensors/*" --state-store-bin-keys "bXlrZXkx" "bXlrZXky"
```

---

### Request persistence from a client using dynamic persistence setting

Clients can request persistence for their data by sending an MQTT v5 user property in their messages. This lets clients dynamically enable persistence for their messages, subscriber queues, or state store entries without changing the broker configuration.

When a client requests persistence, the broker checks its current persistence settings and applies them. If the requested persistence mode is enabled and set to let dynamic requests, the broker persists the client's data as specified in the configuration.

You can enable or disable the dynamic persistence setting for each data type (retained messages, subscriber queues, and state store entries) by setting `dynamic.mode` to `Enabled` in the respective configuration sections. The MQTT user property key and value used for dynamic persistence requests are configured separately at the broker level.

# [Azure portal](#tab/portal)


To configure dynamic persistence settings in the Azure portal:

1. Navigate to your IoT Operations instance.
2. Go to **MQTT Broker** > **Data Persistence**.
3. Configure the global MQTT user property settings:
    - Set the **User property key** (default: `aio-persistence`)
    - Set the **User property value** (default: `true`)
4. In each persistence section (Retained Messages, Subscriber Queue, State Store):
    - Set **Dynamic persistence** to enabled to allow clients to request persistence for that data type.

    :::image type="content" source="media/howto-broker-persistence/data-persistence-dynamic.png" alt-text="[Screenshot changing data persistence dynamic options the Azure portal]":::

# [Azure CLI](#tab/azurecli)

To configure dynamic persistence using Azure CLI, add the MQTT user property settings at the broker level and enable dynamic mode for specific data types. Use the `az iot ops broker persist update` command to update MQTT broker data persistence settings.

```azurecli
az iot ops broker persist update --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <BrokerName> --persist-mode <PersistMode>
```

Here's an example command to configure subscriber queue persistence for specific client IDs:

```azurecli
az iot ops broker persist update --resource-group myResourceGroup --instance myAioInstance --name myBroker --persist-mode subscriberQueue=Custom --subscriber-client-ids "factory-client-*" "sensor-gateway-01"
```

---

## Related content

To learn more about Azure CLI support for advanced MQTT broker configuration, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).
