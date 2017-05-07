## Log in to Azure

You'll use the Azure CLI 2.0 to create the resources needed to host your app in Azure. Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

## Configure a Deployment User

For FTP and local Git, it is necessary to have a deployment user configured on the server to authenticate your deployment.

> [!NOTE]
> A deployment user is required for FTP and Local Git deployment to a Web App.
> The `username` and `password` are account-level, as such, are different from your Azure Subscription credentials.
>


Run the [az appservice web deployment user set](/cli/azure/appservice/web/deployment/user#set) command to create your deployment credentials.

```azurecli
az appservice web deployment user set --user-name <username> --password <password>
```

The username must be unique and the password must be strong. If you get an ` 'Conflict'. Details: 409` error, change the username. If you get a ` 'Bad Request'. Details: 400` error, use a stronger password. 

You only need to create this deployment user once; you can use it for all your Azure deployments.

Record the username and password, as they are used later in the quickstart when you deploy the application.

## Create a resource group

 An [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups) is a logical container in which resources such as web apps and databases are managed. You deploy, update, and delete the resources in a resource group together.

Create a resource group with the [az group create](/cli/azure/group#create) command.

```azurecli
az group create --name myResourceGroup --location westeurope
```

To see the available locations, use the `az appservice list-locations` Azure CLI command. You generally create resources in a region near you.


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