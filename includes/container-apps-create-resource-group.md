---
ms.service: azure-container-apps
ms.topic: include
ms.date: 02/03/2025
author: v1212
ms.author: wujia
---

## Create an Azure resource group

Create a resource group to organize the services related to your container app deployment.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [PowerShell](#tab/powershell)

```azurepowershell
New-AzResourceGroup -Location $Location -Name $ResourceGroupName
```

---
