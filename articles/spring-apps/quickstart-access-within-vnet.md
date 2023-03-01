# Access your application in a private network

This article explains how to access your application in a private network using Azure Spring Apps Standard Consumption plan.

When you create Azure Container Apps Environment with [internal access](https://learn.microsoft.com/en-us/azure/container-apps/vnet-custom-internal?tabs=bash&pivots=azure-portal), all the apps inside can only be accessed within your virtual network. In this case, when an Azure Spring Apps service instance is created by this Managed Environment, all the spring apps can only be accessed from the virtual network.


# Create a private DNS zone
Create a private DNS zone named as the Container App Environment’s default domain (<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io), with an A record. 

You can find Container Apps Environment's default domain by using Azure CLI:
```azurecli
az containerapp env show \
--name <manage environment name> \
--resource-group <resource group> \
--query 'properties.defaultDomain'
```

Use the following command to create a Private DNS Zone for applications in the virtual network.

```azurecli
az network private-dns zone create \
--resource-group <resource group> \
--name <private dns zone name>
```

# Create an A record 
Create an A record contains the name *<DNS Suffix> and the static IP address of the Container Apps environment.

You can find Container Apps Environment's static ip by using Azure CLI:
```azurecli
az containerapp env show \
--name <manage environment name> \
--resource-group <resource group> \
--query 'properties.staticIp'
```
Use the following command to add an A record:

```azurecli
az network private-dns record-set a add-record \
--resource-group <resource group> \
--zone-name <private dns zone name> \
--record-set-name '*' \
--ipv4-address <static ip>
```

# Link the virtual network
Create a virtual network link to link the private DNS zone to virtual network.

```azurecli
az network private-dns link vnet create \
--resource-group <resource group> \
--name <link name> \
--zone-name <private dns zone name> \
--virtual-network <name of the virtual network> \
--registration-enabled false
```

# Access the spring application
Now you can access your spring application within your virtual network, using the url of the spring application.

