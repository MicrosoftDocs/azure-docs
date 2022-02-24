---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/29/2022
---
Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

First, create a resource group to act as a container for all of the Azure resources related to this application.

#### [bash](#tab/terminal-bash)

```azurecli
# Use 'az account list-locations --output table' to list locations
LOCATION='eastus'
RESOURCE_GROUP_NAME='msdocs-python-webapp-quickstart'

az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
# Use 'az account list-locations --output table' to list locations
$LOCATION='eastus'
$RESOURCE_GROUP_NAME='msdocs-python-webapp-quickstart'

# Create a resource group
az group create `
    --location $LOCATION `
    --name $RESOURCE_GROUP_NAME
```

---

Next, create an App Service plan using the [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create) command.

* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan.  This example uses the B1 (Basic) service plan, which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.
* The `--is-linux` flag selects the Linux as the host operating system.

#### [bash](#tab/terminal-bash)

```azurecli
APP_SERVICE_PLAN_NAME='msdocs-python-webapp-quickstart'    

az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$APP_SERVICE_PLAN_NAME='msdocs-python-webapp-quickstart'    

az appservice plan create `
    --name $APP_SERVICE_PLAN_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --sku B1 `
    --is-linux
```

---

Finally, create the App Service web app using the [az webapp create](/cli/azure/webapp#az_webapp_create) command.  

* The *app service name* is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of `https://<app service name>.azurewebsites.com`.
* The runtime specifies what version of Python your app is running. This example uses Python 3.9. To list all available runtimes, use the command `az webapp list-runtimes --linux --output table`.

#### [bash](#tab/terminal-bash)

```azurecli
# Change 123 to any three characters to form a unique name across Azure
APP_SERVICE_NAME='msdocs-python-webapp-quickstart-123'

az webapp create \
    --name $APP_SERVICE_NAME \
    --runtime 'PYTHON|3.9' \
    --plan $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query 'defaultHostName' \
    --output table
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
# Change 123 to any three characters to form a unique name across Azure
$APP_SERVICE_NAME='msdocs-python-webapp-quickstart-123'

az webapp create `
    --name $APP_SERVICE_NAME `
    --runtime 'PYTHON:3.9' `
    --plan $APP_SERVICE_PLAN_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --query 'defaultHostName' `
    --output table
```

---
