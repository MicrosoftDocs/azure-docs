## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the resource group, Azure Redis Cache instance, and any related resources in the resource group.

```azurecli
az group delete --name contosoGroup
```