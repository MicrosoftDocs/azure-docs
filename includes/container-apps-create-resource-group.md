---
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: include
ms.date: 02/03/2025
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

# [PowerShell](#tab/powershell)

```azurepowershell
New-AzResourceGroup -Location $Location -Name $ResourceGroupName
```

---
