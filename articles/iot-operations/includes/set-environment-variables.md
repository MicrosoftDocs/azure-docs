---
author: dominicbetts
ms.author: dobett
ms.date: 07/23/2026
ms.topic: include
ms.service: azure-iot-operations
ai-usage: ai-assisted
ms.custom:
  - include file
---

The Azure CLI examples in this article use environment variables so that you can set each value once and then copy and paste the commands as-is. If you're using the Azure IoT Operations Codespaces environment from the [quickstart](../get-started-end-to-end-sample/quickstart-deploy.md), these variables are already set for you and you can skip this step. Otherwise, set the following environment variables in your shell before you run the commands.

The following scripts set the most commonly used environment variables:

| Environment variable | Description |
|----------------------|-------------|
| `SUBSCRIPTION_ID` | The ID of the subscription that contains your Azure IoT Operations instance. |
| `RESOURCE_GROUP` | The name of the resource group that contains your Azure IoT Operations instance. |
| `AIO_INSTANCE_NAME` | The name of your Azure IoT Operations instance. To list your instances, run `az iot ops list -o table`. |
| `CLUSTER_NAME` | The name of the Azure Arc-enabled Kubernetes cluster that hosts your instance. |
| `LOCATION` | The Azure region to use for new resources, for example `eastus`. |

# [Bash](#tab/bash)

```bash
SUBSCRIPTION_ID=<subscription-id>
RESOURCE_GROUP=<resource-group-name>
AIO_INSTANCE_NAME=<instance-name>
CLUSTER_NAME=<cluster-name>
LOCATION=<region>
```

# [PowerShell](#tab/powershell)

```powershell
$SUBSCRIPTION_ID = "<subscription-id>"
$RESOURCE_GROUP = "<resource-group-name>"
$AIO_INSTANCE_NAME = "<instance-name>"
$CLUSTER_NAME = "<cluster-name>"
$LOCATION = "<region>"
```

---

You only need to set the variables that this article uses. This article might use additional environment variables for resource names that you choose. The article explains how to set them where they're introduced.
