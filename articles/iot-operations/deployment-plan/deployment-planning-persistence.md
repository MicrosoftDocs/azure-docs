---
title: Deployment planning - Persistence
description: Plan MQTT broker persistence settings for your Azure IoT Operations deployment.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.service: azure-iot-operations
ms.date: 04/21/2026
ai-usage: ai-assisted
#customer intent: As an IT administrator, I want to understand MQTT broker persistence options so I can decide whether to enable data persistence before deploying Azure IoT Operations.
---

# Deployment planning - Persistence

Data persistence writes critical MQTT broker data to disk so it survives cluster restarts. Decide before deployment whether you need data persistence for the MQTT broker.

Persistence complements the broker's replication system. Replication keeps data available across nodes, but a cluster-wide shutdown can still cause data loss — persistence prevents that. Persistence is different from the [disk-backed message buffer](deployment-planning-disk-buffer.md), which uses disk as an extension of memory and doesn't provide durability guarantees.

Writing data to disk has a significant performance cost. The exact cost depends on the type and speed of the underlying storage.

> [!IMPORTANT]
> Persistence is enabled at deployment and can't be turned off afterward. Some related options can be changed later — see [Runtime persistence options](#runtime-persistence-options).

## Persistent volume settings

The MQTT broker uses a persistent volume (PV) to store data on disk. Two settings control how this volume is provisioned:

- **`maxSize`** *(required)*: Sets the maximum size of the persistent volume for storing broker data. This field is always required, even if you provide a custom volume claim. The value must be at least 100 MB.

  **Example:** `10Gi`

- **`persistentVolumeClaimSpec`** *(optional)*: Defines a custom PersistentVolumeClaim (PVC) template that controls how the persistent volume is provisioned. If you don't set this option, the broker creates a default PVC by using the `maxSize` value and the cluster's default storage class.

  For best performance, use a storage class backed by a local path provisioner. The default storage class often isn't, which can degrade performance.

> [!IMPORTANT]
> When you specify `persistentVolumeClaimSpec`, the access mode must be set to `ReadWriteOncePod`.

## Configure persistence

Configure persistence at deployment with the `az iot ops create` command. At minimum, set the persistent volume size:

```azurecli
az iot ops create ... --persist-max-size 10Gi
```

To customize the storage class or persist mode, add the `--persist-pvc-sc` and `--persist-mode` flags:

```azurecli
az iot ops create ... --persist-max-size 10Gi --persist-pvc-sc <MYSTORAGECLASS> --persist-mode retain=All stateStore=None
```

For the full set of options, pass a configuration file with `--broker-config-file`. For more information, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config) and the [Persistence API reference](/rest/api/iotoperations/broker/create-or-update#brokerpersistence).

The following example sets a maximum size of 10 GiB and a custom storage class:

```json
{
  "persistence": {
    "maxSize": "10G",
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

By default, the MQTT broker encrypts all persistence data on disk by using AES-256-GCM encryption. Encryption protects broker state and session data if an attacker gains access to the underlying volume.

Encryption is on by default. You can disable it, but encryption only protects data at rest — data in memory isn't encrypted. The performance cost is minimal, but key rotation isn't yet supported.

To disable encryption, add the following to your broker configuration file, then pass it to [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) with the `--broker-config-file` flag:

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

Some persistence options — retained messages, subscriber queues, and state store — can be configured after deployment. For details on those options, see [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md).

## Next steps

- [Review diagnostics settings](deployment-planning-diagnostics.md)
- [Review advanced MQTT options](deployment-planning-mqtt-options.md)
- [Review disk-backed message buffer settings](deployment-planning-disk-buffer.md)
- [Prepare your cluster](../deploy-iot-ops/howto-prepare-cluster.md)
