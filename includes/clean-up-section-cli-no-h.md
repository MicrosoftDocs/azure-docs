In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, you can delete them by deleting the resource group.
 
1. Run the following command to make sure the resource group doesn’t contain any resources that you want to save:

  ```azurecli
  az group show --name myResourceGroup
  ```

2. If the resources shown are all the ones you want to delete, run the following command:
 
  ```azurecli
  az group delete --name myResourceGroup
  ```
