## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command.

[!INCLUDE [resource group intro text](resource-group.md)]

The following example creates a resource group named *myResourceGroup* in the *westeurope* location.

```azurecli
az group create --name myResourceGroup --location westeurope
```

To see the available locations, run the `az appservice list-locations` command. You generally create resources in a region near you.

## Create an Azure App Service plan

Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#create) command.

[!INCLUDE [app-service-plan](app-service-plan.md)]

The following example creates an App Service plan named `quickStartPlan` in the **Free** pricing tier:

```azurecli
az appservice plan create --name quickStartPlan --resource-group myResourceGroup --sku FREE
```

When the App Service plan has been created, the Azure CLI shows information similar to the following example:

```json
{ 
  "adminSiteName": null,
  "appServicePlanName": "quickStartPlan",
  "geoRegion": "West Europe",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/0000-0000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/quickStartPlan",
  "kind": "app",
  "location": "West Europe",
  "maximumNumberOfWorkers": 1,
  "name": "quickStartPlan",
  < JSON data removed for brevity. >
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
} 
```

## Create a Web App

Create a [web app](app-service-web-overview.md) in the `quickStartPlan` App Service plan with the [az appservice web create](/cli/azure/appservice/web#create) command. 

The web app provides a hosting space for your code and provides a URL to view the deployed app.

In the following command, replace *\<app_name>* with a unique name. If `<app_name>` is not unique, you get the error message "Website with given name <app_name> already exists." The default URL of the web app will be `https://<app_name>.azurewebsites.net`. 

```azurecli
az appservice web create --name <app_name> --resource-group myResourceGroup --plan quickStartPlan
```

When the Web App has been created, the Azure CLI shows information similar to the following example:

```json
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app_name>.azurewebsites.net",
  "enabled": true,
  "enabledHostNames": [
    "<app_name>.azurewebsites.net",
    "<app_name>.scm.azurewebsites.net"
  ],
  "gatewaySiteName": null,
  "hostNameSslStates": [
    {
      "hostType": "Standard",
      "name": "<app_name>.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "virtualIp": null
    }
    < JSON data removed for brevity. >
}
```

Browse to the site to see your newly created web app.

```bash
http://<app_name>.azurewebsites.net
```

