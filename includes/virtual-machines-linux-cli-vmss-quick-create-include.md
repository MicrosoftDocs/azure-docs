## Prerequisites

If you haven't already, get an [Azure subscription free trial](https://azure.microsoft.com/pricing/free-trial/) and install the [Azure CLI 2.0 (Preview)](https://docs.microsoft.com/cli/azure/install-az-cli2).

## Create the scale set

First, create a resource group to deploy the scale set into:

```azcli
az group create --location westus --name myrg
```

Now create your scale set using the `az vmss create` command. The following example creates a Linux scale set named `myvmss` with in the resource group named `myrg`:

```azcli
az vmss create --resource-group myrg --name myvmss --image UbuntuLTS --admin-username azureuser --authentication-type password --admin-password P4$$w0rd
```

The following example creates a Windows scale set with the same configuration:

```azcli
az vmss create --resource-group myrg --name myvmss --image Win2016Datacenter --admin-username azureuser --authentication-type password --admin-password P4$$w0rd
```

If you want to choose a different OS image, you can see available images with the command `az vm image list` or `az vm image list --all`. To see the connection information for the VMs in the scale set, use the command `az vmss list_instance_connection_info`:

```azcli
az vmss list_instance_connection_info --resource-group myrg --name myvmss
```