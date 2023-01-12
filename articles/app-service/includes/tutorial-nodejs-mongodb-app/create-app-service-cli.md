---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/30/2022
---
Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

First, create a resource group to act as a container for all of the Azure resources related to this application.

#### [bash](#tab/terminal-bash)

```azurecli
# Use 'az account list-locations --output table' to list locations
LOCATION='eastus'
RESOURCE_GROUP_NAME='msdocs-expressjs-mongodb-tutorial'

az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
# Use 'az account list-locations --output table' to list locations
$location='eastus'
$resourceGroupName='msdocs-expressjs-mongodb-tutorial'

# Create a resource group
az group create `
    --location $location `
    --name $resourceGroupName
```

---

Next, create an App Service plan using the [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) command.

* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan.  This example uses the F1 (Free) service plan.  For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/) page.
* The `--is-linux` flag selects the Linux as the host operating system.  To use Windows, remove this flag from the command.

#### [bash](#tab/terminal-bash)

```azurecli
APP_SERVICE_PLAN_NAME='msdocs-expressjs-mongodb-plan'    

az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$appServicePlanName='msdocs-expressjs-mongodb-plan'

az appservice plan create `
    --name $appServicePlanName `
    --resource-group $resourceGroupName `
    --sku B1 `
    --is-linux
```

---

Finally, create the App Service web app using the [az webapp create](/cli/azure/webapp#az-webapp-create) command.  

* The *app service name* is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of `https://<app service name>.azurewebsites.com`.
* The runtime specifies what version of Node your app is running. This example uses Node 14 LTS. To list all available runtimes, use the command `az webapp list-runtimes --os linux --output table` for Linux and `az webapp list-runtimes --os windows --output table` for Windows.

#### [bash](#tab/terminal-bash)

```azurecli
# Change 123 to any three characters to form a unique name across Azure
APP_SERVICE_NAME='msdocs-expressjs-mongodb-123'

az webapp create \
    --name $APP_SERVICE_NAME \
    --runtime 'NODE|14-lts' \
    --plan $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query 'defaultHostName' \
    --output table
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
# Change 123 to any three characters to form a unique name across Azure
$appServiceName='msdocs-expressjs-mongodb-123'

az webapp create `
    --name $appServiceName `
    --runtime 'NODE:14-lts' `
    --plan $appServicePlanName `
    --resource-group $resourceGroupName `
    --query 'defaultHostName' `
    --output table
```

---
