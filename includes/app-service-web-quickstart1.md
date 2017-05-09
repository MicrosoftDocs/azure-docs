## Create a resource group

 An [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups) is a logical container in which resources such as web apps and databases are managed. You deploy, update, and delete the resources in a resource group.

Create a resource group with the [az group create](/cli/azure/group#create) command.

```azurecli
az group create --name myResourceGroup --location westeurope
```

To see the available locations, use the `az appservice list-locations` command. You generally create resources in a region near you.

## Create an Azure App Service plan

Create a "FREE" [App Service plan](../articles/app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md) with the [az appservice plan create](/cli/azure/appservice/plan#create) command.

[!INCLUDE [app-service-plan](app-service-plan.md)]

The following command creates an App Service plan named `quickStartPlan` using the **Free** pricing tier.

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