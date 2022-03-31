---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

Create a rule that allows other Azure services to connect to the PostgreSQL server by using the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command.

#### [bash](#tab/terminal-bash)

```azurecli
az postgres server firewall-rule create --resource-group $RESOURCE_GROUP_NAME \
                                        --server $DB_SERVER_NAME \
                                        --name AllowAllWindowsAzureIps \
                                        --start-ip-address 0.0.0.0 \
                                        --end-ip-address 0.0.0.0
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az postgres server firewall-rule create --resource-group $RESOURCE_GROUP_NAME `
                                        --server $DB_SERVER_NAME `
                                        --name AllowAllWindowsAzureIps `
                                        --start-ip-address 0.0.0.0 `
                                        --end-ip-address 0.0.0.0
```

---

* *resource-group* &rarr; Name of resource group from earlier in this tutorial. (`msdocs-python-postgres-webapp-rg`)
* *server* &rarr; Name of the server from **Step 1**. (`msdocs-python-postgres-webapp-db`)
* *name* &rarr; Name for firewall rule. (use `AllowAllWindowsAzureIps`)
* *start-ip-address, end-ip-address* &rarr; `0.0.0.0` signals that access will be from other Azure services. This is sufficient for a demonstration app, but for a production app you should use an [Azure Virtual Network](../../../virtual-network/virtual-networks-overview.md).