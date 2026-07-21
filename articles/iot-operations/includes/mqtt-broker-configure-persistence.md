---
author: dominicbetts
ms.author: dobett
ms.topic: include
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 04/21/2026
ms.custom: include file
---

Configure persistence at deployment by using the `az iot ops create` command. At minimum, set the persistent volume size:

```azurecli
az iot ops create ... --persist-max-size 10Gi
```

To customize the storage class or persist mode, add the `--persist-pvc-sc` and `--persist-mode` flags:

```azurecli
az iot ops create ... --persist-max-size 10Gi --persist-pvc-sc <MYSTORAGECLASS> --persist-mode retain=All stateStore=None
```

> [!NOTE]
> You can also configure these persistence settings during the deployment steps in the Azure portal.

For the full set of options, pass a configuration file by using `--broker-config-file`. For more information, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config) and the [Persistence API reference](/rest/api/iotoperations/broker/create-or-update#brokerpersistence).

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
