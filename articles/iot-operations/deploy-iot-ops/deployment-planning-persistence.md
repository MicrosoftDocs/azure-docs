---
title: Deployment planning - Persistence
description: Plan MQTT broker persistence settings for your Azure IoT Operations deployment.
author: huguesbouvier
ms.author: hubouvie
ms.topic: conceptual
ms.service: azure-iot-operations
ms.date: 04/21/2026
#CustomerIntent: As an IT administrator, I want to understand MQTT broker persistence options so I can decide whether to enable data persistence before deploying Azure IoT Operations.
---

# Deployment planning - Persistence

Decide before deployment whether you need data persistence for the MQTT broker. Data persistence writes critical data to disk and preserves it across restarts.

The data persistence feature is designed as a complementary mechanism to the replication system. While the broker replicates data across multiple nodes, a cluster-wide shutdown can still result in data loss. This data persistence feature is different from the [disk-backed message buffer](deployment-planning-disk-buffer.md), which uses disk as an extension of memory but is ephemeral and doesn't provide durability guarantees.

Storing data on disk introduces a performance cost. The impact varies depending on the type and speed of the underlying storage medium.

> [!IMPORTANT]
> You set persistence during deployment and can't turn it off afterward. You can change some persistence-related options after deployment.

## Volume and volume size

The MQTT broker uses a persistent volume (PV) to store data on disk. Two settings control how this volume is provisioned:

- **`maxSize`** *(required)*: Sets the maximum size of the persistent volume for storing broker data. This field is always required, even if you provide a custom volume claim. The value must be greater than 100 MB.

  **Example:** `10GiB`

- **`persistentVolumeClaimSpec`** *(optional)*: Lets you define a custom PersistentVolumeClaim (PVC) template to control how the persistent volume is provisioned. If you don't set this option, the broker creates a default PVC using the specified `maxSize` and the default storage class, which can result in suboptimal performance if the default class isn't backed by a local path provisioner.

> [!IMPORTANT]
> When you specify `persistentVolumeClaimSpec`, the access mode must be set to `ReadWriteOncePod`.

To deploy the MQTT broker with the minimum required settings to enable disk persistence, use the `az iot ops create` command.

```azurecli
az iot ops create --cluster <CLUSTER_NAME> -g <RESOURCE_GROUP_NAME> --name <INSTANCE_NAME> --sr-resource-id <SCHEMA_REGISTRY_RESOURCE_ID> --ns-resource-id <NAMESPACE_RESOURCE_ID> --persist-max-size 10Gi
```

To deploy the MQTT broker with disk persistence, custom persistent volume claim, and custom persist mode settings, add the `--persist-pvc-sc` and `--persist-mode` flags to the `az iot ops create` command.

```azurecli
az iot ops create --cluster <CLUSTER_NAME> -g <RESOURCE_GROUP_NAME> --name <INSTANCE_NAME> --sr-resource-id <SCHEMA_REGISTRY_RESOURCE_ID> --ns-resource-id <NAMESPACE_RESOURCE_ID> --persist-max-size 10Gi --persist-pvc-sc <MYSTORAGECLASS> --persist-mode retain=All stateStore=None
```

If you want to use a custom broker configuration file, add the `--broker-config-file` flag and include the persistence settings in the JSON file.

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

## Encryption

To protect data, the MQTT broker encrypts all persistence data on disk by default using strong AES-256-GCM encryption. This ensures that even if an attacker gains access to the underlying volume, sensitive broker state or session data remains protected.

Encryption is optional and is on by default. You can turn off encryption if you need to. Encryption protects data at rest only; data in memory isn't encrypted. Using encryption has minimal performance cost, but key rotation isn't supported yet.

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

## Runtime persistence options

Some persistence options -- retained messages, subscriber queues, and state store -- can be configured after deployment. For details on those options, see [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md).

## Next steps

- [Review diagnostics settings](deployment-planning-diagnostics.md)
- [Review advanced MQTT options](deployment-planning-mqtt-options.md)
- [Review disk-backed message buffer settings](deployment-planning-disk-buffer.md)
- [Prepare your cluster](howto-prepare-cluster.md)
