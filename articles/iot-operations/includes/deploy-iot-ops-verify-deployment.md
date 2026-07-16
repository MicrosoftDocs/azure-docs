---
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: include
ms.custom: include file
ms.date: 11/18/2025
---

After the deployment finishes, use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check) to evaluate the IoT Operations service deployment for health, configuration, and usability. The `check` command helps you find problems in your deployment and configuration.

```azurecli
az iot ops check
```

The `check` command displays a warning about missing data flows, which is normal and expected until you create a data flow. For more information, see [Process and route data with data flows](../connect-to-cloud/overview-dataflow.md).

To check the configurations of topic maps, QoS, and message routes, add the `--detail-level 2` parameter to the `check` command for a verbose view.

To view all versions of the Azure IoT Operations CLI extension that are available, run the following command:

```azurecli
az iot ops get-versions
```
