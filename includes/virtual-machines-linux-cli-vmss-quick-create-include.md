## Prerequisites

If you haven't already, get an [Azure subscription free trial](https://azure.microsoft.com/pricing/free-trial/) and install the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-az-cli2).

## Create the scale set

First, create a resource group to deploy the scale set into:

```azurecli
az group create --location westus --name myResourceGroup
```

Now create your scale set using the `az vmss create` command. The following example creates a Linux scale set named `myvmss` with in the resource group named `myrg`:

```azurecli
az vmss create --resource-group myResourceGroup --name myVmss \
    --image UbuntuLTS --admin-username azureuser \
    --authentication-type password --admin-password P4$$w0rd
```

The following example creates a Windows scale set with the same configuration:

```azurecli
az vmss create --resource-group myResourceGroup --name myVmss \
    --image Win2016Datacenter --admin-username azureuser \
    --authentication-type password --admin-password P4$$w0rd
```

If you want to choose a different OS image, you can see available images with the command `az vm image list` or `az vm image list --all`. To see the connection information for the VMs in the scale set, use the command `az vmss list_instance_connection_info`:

```azurecli
az vmss list_instance_connection_info --resource-group myResourceGroup --name myVmss
```