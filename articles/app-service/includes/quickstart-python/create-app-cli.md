---
author: charris-msft
ms.author: charris
ms.topic: include
ms.date: 06/28/2022
ms.service: azure-app-service
---
Azure CLI commands can be run on a computer with the [Azure CLI installed](/cli/azure/install-azure-cli).

Create the Azure resources, and then deploy your application by using separate Azure CLI commands.

If necessary, log in to Azure using [az login](/cli/azure/authenticate-azure-cli).

```azurecli
az login
```

Replace `<app-name>` with a globally unique name. Create a resource group and an App Service plan, and then create the web app by using [az webapp create](/cli/azure/webapp#az-webapp-create).

```azurecli
az group create --name myResourceGroup --location eastus
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku P0v3 --is-linux
az webapp create --name <app-name> --resource-group myResourceGroup --plan myAppServicePlan --runtime "PYTHON:3.14"
az webapp config appsettings set --name <app-name> --resource-group myResourceGroup --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

* Use the `--runtime` parameter to specify the version of Python your app runs. This example uses Python 3.14. To list supported Python runtimes, use `az webapp list-runtimes --os-type linux --runtime python --output table`.
* Use the `--sku` parameter to define the size (CPU and memory) and cost of the App Service plan. This example uses the P0v3 (Premium v3) service plan, which incurs a cost in your Azure subscription. For a full list of App Service plans, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
* Replace `eastus` with your preferred region. To list available regions, run [`az account list-locations`](/cli/azure/account#az-account-list-locations) with `--output table`.
* The `SCM_DO_BUILD_DURING_DEPLOYMENT` setting enables the Oryx build, including installation of the dependencies in *requirements.txt*, when you deploy the source archive.

Create a ZIP file with the application files, including *requirements.txt*, at the root of the archive. Exclude local files such as *.venv*, *.git*, and *.env*. For platform-specific instructions, see [Create a ZIP file of your application](../../quickstart-python.md#deploy-your-application-code-to-azure) in the **Deploy using a ZIP file** tab. Then deploy the archive by using [az webapp deploy](/cli/azure/webapp#az-webapp-deploy):

```azurecli
az webapp deploy --name <app-name> --resource-group myResourceGroup --src-path <zip-file-path> --type zip
```

The deployment can take a few minutes. Browse to `https://<app-name>.azurewebsites.net` to view your app. To stream logs, enable them by running `az webapp log config --name <app-name> --resource-group myResourceGroup --docker-container-logging filesystem`, and then run `az webapp log tail --name <app-name> --resource-group myResourceGroup`.
