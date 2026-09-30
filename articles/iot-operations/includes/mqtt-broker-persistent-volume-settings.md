---
author: dominicbetts
ms.author: dobett
ms.topic: include
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 04/21/2026
ms.custom: include file
---

The MQTT broker uses a persistent volume (PV) to store data on disk. Two settings control how this volume is provisioned:

- **`maxSize`** *(required)*: Sets the maximum size of the persistent volume for storing broker data. This field is always required, even if you provide a custom volume claim. The value must be at least 100 MB.

  **Example:** `10Gi`

- **`persistentVolumeClaimSpec`** *(optional)*: Defines a custom PersistentVolumeClaim (PVC) template that controls how the persistent volume is provisioned. If you don't set this option, the broker creates a default PVC by using the `maxSize` value and the cluster's default storage class.

  For best performance, use a storage class backed by a local path provisioner. The default storage class often isn't, which can degrade performance.

> [!IMPORTANT]
> When you specify `persistentVolumeClaimSpec`, the access mode must be set to `ReadWriteOncePod`.
