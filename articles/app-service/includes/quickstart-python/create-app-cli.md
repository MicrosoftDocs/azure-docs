---
author: charris-msft
ms.author: charris
ms.topic: include
ms.date: 06/28/2022
---
Azure CLI commands can be run on a computer with the [Azure CLI installed](/cli/azure/install-azure-cli).

Azure CLI has a command `az webapp up` that will create the necessary resources and deploy your application in a single step.

If necessary, login to Azure using [az login](/cli/azure/authenticate-azure-cli).

```azurecli
az login
```

Create the webapp and other resources, then deploy your code to Azure using [az webapp up](/cli/azure/webapp#az-webapp-up).

```azurecli
az webapp up --runtime PYTHON:3.9 --sku B1 --logs
```

* The `--runtime` parameter specifies what version of Python your app is running. This example uses Python 3.9. To list all available runtimes, use the command `az webapp list-runtimes --os linux --output table`.
* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan. This example uses the B1 (Basic) service plan, which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.
* The `--logs` flag configures default logging required to enable viewing the log stream immediately after launching the webapp.
* You can optionally specify a name with the argument `--name <app-name>`. If you don't provide one, then a name will be automatically generated.
* You can optionally include the argument `--location <location-name>` where `<location_name>` is an available Azure region. You can retrieve a list of allowable regions for your Azure account by running the [`az account list-locations`](/cli/azure/appservice#az-appservice-list-locations) command.

The command may take a few minutes to complete. While the command is running, it provides messages about creating the resource group, the App Service plan, and the app resource, configuring logging, and doing ZIP deployment. It then gives the message, "You can launch the app at http://&lt;app-name&gt;.azurewebsites.net", which is the app's URL on Azure.

<pre>
The webapp '&lt;app-name>' doesn't exist
Creating Resource group '&lt;group-name>' ...
Resource group creation complete
Creating AppServicePlan '&lt;app-service-plan-name>' ...
Creating webapp '&lt;app-name>' ...
Configuring default logging for the app, if not already enabled
Creating zip with contents of dir /home/cephas/myExpressApp ...
Getting scm site credentials for zip deployment
Starting zip deployment. This operation can take a while to complete ...
Deployment endpoint responded with status code 202
You can launch the app at http://&lt;app-name>.azurewebsites.net
{
  "URL": "http://&lt;app-name>.azurewebsites.net",
  "appserviceplan": "&lt;app-service-plan-name>",
  "location": "centralus",
  "name": "&lt;app-name>",
  "os": "&lt;os-type>",
  "resourcegroup": "&lt;group-name>",
  "runtime_version": "python|3.9",
  "runtime_version_detected": "0.0",
  "sku": "FREE",
  "src_path": "&lt;your-folder-location>"
}
</pre>

[!INCLUDE [az webapp up command note](../../../../includes/app-service-web-az-webapp-up-note.md)]
