---
author: charris-msft
ms.author: charris
ms.topic: include
ms.date: 04/01/2022
---
Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

Azure CLI has a command `az webapp up` that will create the necessary resources and deploy your application in a single step.

#### [bash](#tab/terminal-bash)

Create the webapp and other resources, then deploy your code to Azure using [az webapp up](/cli/azure/webapp#az-webapp-up).

* The `--location` parameter defines the Azure region where the resources will be created.
* The `--resource-group` parameter sets the name of the resource group, which acts as a container for all of the Azure resources related to this application.
* The `--runtime` parameter specifies what version of Python your app is running. This example uses Python 3.9. To list all available runtimes, use the command `az webapp list-runtimes --os linux --output table`.
* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan. This example uses the B1 (Basic) service plan, which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.
* The `--os-type` parameter selects the Linux as the host operating system.
* The `--logs` flag configures default logging required to enable viewing the log stream immediately after launching the webapp.

```azurecli
az webapp up \
    --location eastus \
    --resource-group msdocs-python-webapp-quickstart \
    --runtime 'PYTHON:3.9' \
    --sku B1 \
    --os-type Linux \
    --logs
```

#### [PowerShell terminal](#tab/terminal-powershell)

Create the webapp and other resources, then deploy your code to Azure using [az webapp up](/cli/azure/webapp#az-webapp-up).

* The `--location` parameter defines the Azure region where the resources will be created.
* The `--resource-group` parameter sets the name of the resource group, which acts as a container for all of the Azure resources related to this application.
* The `--runtime` parameter specifies what version of Python your app is running. This example uses Python 3.9. To list all available runtimes, use the command `az webapp list-runtimes --os linux --output table`.
* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan. This example uses the B1 (Basic) service plan, which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.
* The `--os-type` parameter selects the Linux as the host operating system.
* The `--logs` flag configures default logging required to enable viewing the log stream immediately after launching the webapp.

```azurecli
az webapp up `
    --location eastus `
    --resource-group msdocs-python-webapp-quickstart `
    --runtime 'PYTHON:3.9' `
    --sku B1 `
    --os-type Linux `
    --logs
```

---
