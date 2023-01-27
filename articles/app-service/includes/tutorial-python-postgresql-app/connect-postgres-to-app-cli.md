---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['vscode-azure-tools']
ms.custom: devx-track-python
---

To set environment variables in App Service, you create *app settings* with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config appsettings set \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $APP_SERVICE_NAME \
   --settings DBHOST=$DB_SERVER_NAME DBNAME=$DB_NAME  DBUSER=$ADMIN_USERNAME DBPASS=$ADMIN_PWD
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config appsettings set `
   --resource-group $RESOURCE_GROUP_NAME `
   --name $APP_SERVICE_NAME `
   --settings DBHOST=$DB_SERVER_NAME DBNAME=$DB_NAME  DBUSER=$ADMIN_USERNAME DBPASS=$ADMIN_PWD
```

---

* *DBHOST* &rarr; Use the name of the name you used earlier with the `az postgres flexible-server create` command. The code in *azuresite/production.py* automatically appends `.postgres.database.azure.com` to create the full PostgreSQL server URL.
* *DBNAME* &rarr; Use `restaurant`.
* *DBUSER, DBPASS* &rarr; Use the administrator credentials that you used with the earlier `az postgres flexible-server create` command. The code in *azuresite/production.py* automatically constructs the full Postgres username from `DBUSER` and `DBHOST`, so don't include the `@server` portion.
