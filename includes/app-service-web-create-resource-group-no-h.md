In the Cloud Shell, create a resource group with the [az group create](/cli/azure/group#create) command.

[!INCLUDE [resource group intro text](resource-group.md)]

The following example creates a resource group named *myResourceGroup* in the *West Europe* location. To see all supported locations for App Service, run the `az appservice list-locations` command.

```azurecli-interactive
az group create --name myResourceGroup --location "West Europe"
```

You generally create your resource group and the resources in a region near you. 