---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 04/30/2024
ms.author: cshoe
---

## Create an Azure resource group

Create a resource group to organize the services related to your container app deployment.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Location $Location -Name $ResourceGroupName
```

---
