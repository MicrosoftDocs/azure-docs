---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/28/2022
---

**Step 1.** Create a *resource group* using the [az group create](/cli/azure/group#az-group-create) command. A *resource group* will act as a container for all of the Azure resources related to this application.

#### [bash](#tab/terminal-bash)

```azurecli
LOCATION='eastus'
RESOURCE_GROUP_NAME='msdocs-python-postgres-webapp-rg'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$LOCATION='eastus'
$RESOURCE_GROUP_NAME='msdocs-python-postgres-webapp-rg'

# Create a resource group
az group create `
    --location $LOCATION `
    --name $RESOURCE_GROUP_NAME
```

---

* *location* &rarr; A location near you, for example `eastus`. Use `az account list-locations --output table` to list locations.
* *name* &rarr; You will use this resource group to organize all the Azure resources needed to complete this tutorial. (for example, `msdocs-python-postgres-webapp-rg`)

**Step 2.** Create an *App Service plan* using the [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) command.

#### [bash](#tab/terminal-bash)

```azurecli
APP_SERVICE_PLAN_NAME='msdocs-python-postgres-webapp-plan'

az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$APP_SERVICE_PLAN_NAME='msdocs-python-postgres-webapp-plan'

az appservice plan create `
    --name $APP_SERVICE_PLAN_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --sku B1 `
    --is-linux
```

---

* *name* &rarr; Name for the Azure Web App plan, `msdocs-python-postgres-webapp-plan`
* *resource-group* &rarr; Use the same resource group name you used when you created the web app, for example `msdocs-python-postgres-webapp-rg`.
* *sku* &rarr; Defines the size (CPU, memory) and cost of the app service plan.  This example uses the B1 (Basic) service plan, which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.
* *is-linux* &rarr; Selects Linux as the host operating system.

**Step 3.** Create the *App Service web app* using the [az webapp create](/cli/azure/webapp#az-webapp-create) command.

#### [bash](#tab/terminal-bash)

```azurecli
APP_SERVICE_NAME='msdocs-python-postgres-webapp'

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
$APP_SERVICE_NAME='msdocs-python-postgres-webapp'

az webapp create `
    --name $APP_SERVICE_NAME `
    --runtime 'PYTHON:3.9' `
    --plan $APP_SERVICE_PLAN_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --query 'defaultHostName' `
    --output table
```

---

* *name* &rarr; The app service name is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of the server endpoint `https://<app-service-name>.azurewebsites.com`. This name must be **unique across all Azure** and the only allowed characters are `A`-`Z`, `0`-`9`, and `-`. For example, use `msdocs-python-postgres-webapp-\<unique-id>` where `\<unique-id>` is any three characters.
* *runtime* &rarr; The runtime specifies what version of Python your app is running. This example uses **Python 3.9**. To list all available runtimes, use the command `az webapp list-runtimes --os linux --output table`.
* *plan* &rarr; Use the same *app service plan* name from **Step 2**. (`msdocs-python-postgres-webapp-plan`)
* *resource-group* &rarr; Use the same resource group name from **Step 1**. (`msdocs-python-postgres-webapp-rg`)

> [!NOTE]
> This tutorial shows step-by-step use of Azure CLI commands to reinforce the logical steps that go into creating and deploying an App Service. Once you get familiar with the steps, you can try the [`az webapp up`](/cli/azure/webapp?az-webapp-up) that creates a webapp and deploys its code from a local workspace to App Service.
