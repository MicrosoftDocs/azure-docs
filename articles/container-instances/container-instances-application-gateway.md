---
title: Static IP address for container group
description: Create a container group in a virtual network and assign a static IP address to 
ms.topic: article
ms.date: 12/10/2019
---
# Expose a static IP address for a container group

This article provides steps to expose a static, public IP address for a [container group](container-instances-container-groups.md) by using an Azure [application gateway](../application-gateway/overview.md). By following these steps, you can configure a static entrypoint for an external-facing containerized app running in Azure Container Instances. The IP address for the container group is stable over the group's lifetime, even if the group is restarted or needs to be redeployed.

This article shows you how to use the Azure CLI to create an Azure virtual network, then deploy a container group for a small web app [in the virtual network (preview)](container-instances-vnet.md). You create an application gateway with a public frontend IP address, a listener to host a website on the gateway, and a route that directs web requests to the backend container group.



## Create virtual network

create two subnets in this example: one for the application gateway, and another for the backend servers. You can configure the Frontend IP of the Application Gateway to be Public or Private as per your use case. In this example, you'll choose a Public Frontend IP.

```azurecli
az network vnet create \
  --name myVNet \
  --resource-group myResourceGroup \
  --location eastus \
  --address-prefix 10.0.0.0/16 \
  --subnet-name myAGSubnet \
  --subnet-prefix 10.0.1.0/24
```

```azurecli
az network vnet subnet create \
  --name myACISubnet \
  --resource-group myresourcegroup \
  --vnet-name myVNet   \
  --address-prefix 10.0.2.0/24
```

```azurecli
az network public-ip create \
  --resource-group myresourcegroup \
  --name myAGPublicIPAddress \
  --allocation-method Static \
  --sku Standard
```

## Create container group


```azurecli
az container create \
    --name appcontainer \
    --resource-group myresourcegroup \
    --image mcr.microsoft.com/azuredocs/aci-helloworld \
    --vnet myVNet \
    --vnet-address-prefix 10.0.0.0/16 \
    --subnet myACISubnet \
    --subnet-address-prefix 10.0.2.0/24
```

Now get private IP address of the container group:

az container show -n appcontainer -g myresourcegroup --query ipAddress.ip -o tsv

Output like: 10.0.2.4

Should save in an env variable like $ipaddress

ipaddress=$(az container show -n appcontainer -g myresourcegroup --query ipAddress.ip -o tsv)

## Create application gateway

Create an app gateway following basic steps in:

https://docs.microsoft.com/en-us/azure/application-gateway/quick-create-cli


Create the app gateway with capcity 2 - does this need some explanation?

az network application-gateway create \
  --name myAppGateway \
  --location eastus \
  --resource-group myresourcegroup \
  --capacity 2 \
  --sku Standard_v2 \
  --http-settings-cookie-based-affinity Enabled \
  --public-ip-address myAGPublicIPAddress \
  --vnet-name myVNet \
  --subnet myAGSubnet \
  --servers "$ipaddress" 

  It can take up to 30 minutes for Azure to create the application gateway. Mine took about 15

  ## Test public IP adress
  
  Get the public IP of the app gateway:

  az network public-ip show \
  --resource-group myresourcegroup \
  --name myAGPublicIPAddress \
  --query [ipAddress] \
  --output tsv

  Output similar to: 52.151.237.79

  And it works!

  What happens when I restart the group?

 
  az container restart -n appcontainer -g myresourcegroup

  Seems to work?

  ## Next steps

  * See a [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-aci-wordpress-vnet) to create a container group with a WordPress container instance as a backend server behind an application gateway
  * Depending on your scenario, consider using other Azure load-balancing solutions with Azure Container Instances. For example, use [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) to distribute traffic across multiple container instances and across multiple regions. See this [blog post](https://aaronmsft.com/posts/azure-container-instances/) for an example