---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.custom: ignite-2022
ms.date: 01/30/2022
---
To get the connection string for an Azure Cosmos DB database, use the [az cosmosdb keys list](/cli/azure/cosmosdb/keys) command.

#### [bash](#tab/terminal-bash)

```azurecli
az cosmosdb keys list \
    --type connection-strings \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_DB_NAME \
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" \
    --output tsv
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az cosmosdb keys list `
    --type connection-strings `
    --resource-group $resourceGroupName `
    --name $cosmosDbName `
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" `
    --output tsv
```

---

Rather than copying and pasting the value, the connection string can be stored in a variable to make the next step easier.

#### [bash](#tab/terminal-bash)

```azurecli
COSMOS_DB_CONNECTION_STRING=`az cosmosdb keys list \
    --type connection-strings \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_DB_NAME \
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" \
    --output tsv
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$cosmosDbConnectionString = az cosmosdb keys list `
    --type connection-strings `
    --resource-group $resourceGroupName `
    --name $cosmosDbName `
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" `
    --output tsv
```

---

The [az webapp config appsettings](/cli/azure/webapp/config/appsettings) command is used to set application setting values for an App Service web app.  One or more key-value pairs are set using the `--settings` parameter. To set the `DATABASE_URL` value to the connection string for your web app, use the following command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config appsettings set \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --settings DATABASE_URL=$COSMOS_DB_CONNECTION_STRING
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config appsettings set `
    --name $appServiceName `
    --resource-group $resourceGroupName `
    --settings DATABASE_URL=$cosmosDbConnectionString
```

---
