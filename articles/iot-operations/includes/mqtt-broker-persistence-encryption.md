---
author: dominicbetts
ms.author: dobett
ms.topic: include
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 07/21/2026
ms.custom: include file
---

By default, the MQTT broker encrypts all persistence data on disk by using AES-256-GCM encryption. Encryption protects broker state and session data if an attacker gains access to the underlying volume.

Encryption is on by default. You can disable it, but encryption only protects data at rest - data in memory isn't encrypted. The performance cost is minimal, but key rotation isn't yet supported.

> [!NOTE]
> Encryption is enabled by default when deploying by using the Azure portal. You can disable encryption in the broker configuration file if you deploy by using Azure CLI.

To disable encryption, add the following code to your broker configuration file, then pass it to [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) with the `--broker-config-file` flag:

```json
{
  "persistence": {
    "encryption": {
      "mode": "Disabled"
    }
  }
}
```
