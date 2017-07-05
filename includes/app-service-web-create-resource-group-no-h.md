Create a resource group with the [az group create](/cli/azure/group#create) command.

[!INCLUDE [resource group intro text](resource-group.md)]

The following example creates a resource group named *myResourceGroup* in the *westeurope* location.

```azurecli-interactive
az group create --name myResourceGroup --location westeurope
```

You generally create your resource group and the resources in a region near you. To see all supported locations for Azure Web Apps, run the `az appservice list-locations` command. 