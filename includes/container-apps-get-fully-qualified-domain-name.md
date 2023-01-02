---
author: craigshoemaker
ms.service: app-service
ms.topic: include
ms.date: 10/25/2021
ms.author: cshoe
---

### Get fully qualified domain name

The `az containerapp show` command returns the fully qualified domain name of a container app.

# [Bash](#tab/bash)

```azurecli
az containerapp show \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <CONTAINER_APP_NAME> \
  --query properties.configuration.ingress.fqdn
```

# [PowerShell](#tab/powershell)

```powershell
(Get-AzContainerApp -Name <CONTAINER_APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME>).IngressFqdn
```

---

In this example, replace the placeholders surrounded by `<>` with your values.

The value returned from this command resembles a domain name like the following example:

```console
myapp.happyhill-70162bb9.canadacentral.azurecontainerapps.io
```
