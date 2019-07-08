---
title: Create an application gateway with multiple site hosting - Azure CLI | Microsoft Docs
description: Learn how to create an application gateway that hosts multiple sites using the Azure CLI.
services: application-gateway
author: vhorne
manager: jpconnock
editor: tysonn

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 7/14/2018
ms.author: victorh

---
# Create an application gateway with multiple site hosting using the Azure CLI

You can use the Azure CLI to configure [hosting of multiple web sites](application-gateway-multi-site-overview.md) when you create an [application gateway](application-gateway-introduction.md). In this tutorial, you create backend pools using virtual machines scale sets. You then configure listeners and rules based on domains that you own to make sure web traffic arrives at the appropriate servers in the pools. This tutorial assumes that you own multiple domains and uses examples of *www.contoso.com* and *www.fabrikam.com*.

In this article, you learn how to:

> [!div class="checklist"]
> * Set up the network
> * Create an application gateway
> * Create listeners and routing rules
> * Create virtual machine scale sets with the backend pools
> * Create a CNAME record in your domain

![Multi-site routing example](./media/tutorial-multisite-cli/scenario.png)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group using [az group create](/cli/azure/group).

The following example creates a resource group named *myResourceGroupAG* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroupAG --location eastus
```

## Create network resources 

Create the virtual network named *myVNet* and the subnet named *myAGSubnet* using [az network vnet create](/cli/azure/network/vnet). You can then add the subnet named *myBackendSubnet* that's needed by the backend servers using [az network vnet subnet create](/cli/azure/network/vnet/subnet). Create the public IP address named *myAGPublicIPAddress* using [az network public-ip create](/cli/azure/network/public-ip).

```azurecli-interactive
az network vnet create \
  --name myVNet \
  --resource-group myResourceGroupAG \
  --location eastus \
  --address-prefix 10.0.0.0/16 \
  --subnet-name myAGSubnet \
  --subnet-prefix 10.0.1.0/24
az network vnet subnet create \
  --name myBackendSubnet \
  --resource-group myResourceGroupAG \
  --vnet-name myVNet \
  --address-prefix 10.0.2.0/24
az network public-ip create \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress
```

## Create the application gateway

You can use [az network application-gateway create](/cli/azure/network/application-gateway) to create the application gateway named *myAppGateway*. When you create an application gateway using the Azure CLI, you specify configuration information, such as capacity, sku, and HTTP settings. The application gateway is assigned to *myAGSubnet* and *myAGPublicIPAddress* that you previously created. 

```azurecli-interactive
az network application-gateway create \
  --name myAppGateway \
  --location eastus \
  --resource-group myResourceGroupAG \
  --vnet-name myVNet \
  --subnet myAGsubnet \
  --capacity 2 \
  --sku Standard_Medium \
  --http-settings-cookie-based-affinity Disabled \
  --frontend-port 80 \
  --http-settings-port 80 \
  --http-settings-protocol Http \
  --public-ip-address myAGPublicIPAddress
```

It may take several minutes for the application gateway to be created. After the application gateway is created, you can see these new features of it:

- *appGatewayBackendPool* - An application gateway must have at least one backend address pool.
- *appGatewayBackendHttpSettings* - Specifies that port 80 and an HTTP protocol is used for communication.
- *appGatewayHttpListener* - The default listener associated with *appGatewayBackendPool*.
- *appGatewayFrontendIP* - Assigns *myAGPublicIPAddress* to *appGatewayHttpListener*.
- *rule1* - The default routing rule that is associated with *appGatewayHttpListener*.

### Add the backend pools

Add the backend pools named *contosoPool* and *fabrikamPool* that are needed to contain the backend servers using [az network application-gateway address-pool create](/cli/azure/network/application-gateway).

```azurecli-interactive
az network application-gateway address-pool create \
  --gateway-name myAppGateway \
  --resource-group myResourceGroupAG \
  --name contosoPool
az network application-gateway address-pool create \
  --gateway-name myAppGateway \
  --resource-group myResourceGroupAG \
  --name fabrikamPool
```

### Add listeners

A listener is required to enable the application gateway to route traffic appropriately to the backend pool. In this tutorial, you create two listeners for your two domains. In this example, listeners are created for the domains of *www.contoso.com* and *www.fabrikam.com*. 

Add the listeners named *contosoListener* and *fabrikamListener* that are needed to route traffic using [az network application-gateway http-listener create](/cli/azure/network/application-gateway).

```azurecli-interactive
az network application-gateway http-listener create \
  --name contosoListener \
  --frontend-ip appGatewayFrontendIP \
  --frontend-port appGatewayFrontendPort \
  --resource-group myResourceGroupAG \
  --gateway-name myAppGateway \
  --host-name www.contoso.com
az network application-gateway http-listener create \
  --name fabrikamListener \
  --frontend-ip appGatewayFrontendIP \
  --frontend-port appGatewayFrontendPort \
  --resource-group myResourceGroupAG \
  --gateway-name myAppGateway \
  --host-name www.fabrikam.com   
  ```

### Add routing rules

Rules are processed in the order in which they are created, and traffic is directed using the first rule that matches the URL sent to the application gateway. For example, if you have a rule using a basic listener and a rule using a multi-site listener both on the same port, the rule with the multi-site listener must be listed before the rule with the basic listener in order for the multi-site rule to function as expected. 

In this example, you create two new rules and delete the default rule that was created when you created the application gateway. You can add the rule using [az network application-gateway rule create](/cli/azure/network/application-gateway).

```azurecli-interactive
az network application-gateway rule create \
  --gateway-name myAppGateway \
  --name contosoRule \
  --resource-group myResourceGroupAG \
  --http-listener contosoListener \
  --rule-type Basic \
  --address-pool contosoPool
az network application-gateway rule create \
  --gateway-name myAppGateway \
  --name fabrikamRule \
  --resource-group myResourceGroupAG \
  --http-listener fabrikamListener \
  --rule-type Basic \
  --address-pool fabrikamPool
az network application-gateway rule delete \
  --gateway-name myAppGateway \
  --name rule1 \
  --resource-group myResourceGroupAG
```

## Create virtual machine scale sets

In this example, you create three virtual machine scale sets that support the three backend pools in the application gateway. The scale sets that you create are named *myvmss1*, *myvmss2*, and *myvmss3*. Each scale set contains two virtual machine instances on which you install NGINX.

```azurecli-interactive
for i in `seq 1 2`; do
  if [ $i -eq 1 ]
  then
    poolName="contosoPool"
  fi
  if [ $i -eq 2 ]
  then
    poolName="fabrikamPool"
  fi
  az vmss create \
    --name myvmss$i \
    --resource-group myResourceGroupAG \
    --image UbuntuLTS \
    --admin-username azureuser \
    --admin-password Azure123456! \
    --instance-count 2 \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --vm-sku Standard_DS2 \
    --upgrade-policy-mode Automatic \
    --app-gateway myAppGateway \
    --backend-pool-name $poolName
done
```

### Install NGINX

```azurecli-interactive
for i in `seq 1 2`; do
  az vmss extension set \
    --publisher Microsoft.Azure.Extensions \
    --version 2.0 \
    --name CustomScript \
    --resource-group myResourceGroupAG \
    --vmss-name myvmss$i \
    --settings '{
  "fileUris": ["https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/install_nginx.sh"],
  "commandToExecute": "./install_nginx.sh" }'
done
```

## Create a CNAME record in your domain

After the application gateway is created with its public IP address, you can get the DNS address and use it to create a CNAME record in your domain. You can use [az network public-ip show](/cli/azure/network/public-ip) to get the DNS address of the application gateway. Copy the *fqdn* value of the DNSSettings and use it as the value of the CNAME record that you create. 

```azurecli-interactive
az network public-ip show \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress \
  --query [dnsSettings.fqdn] \
  --output tsv
```

The use of A-records is not recommended because the VIP may change when the application gateway is restarted.

## Test the application gateway

Enter your domain name into the address bar of your browser. Such as, http://www.contoso.com.

![Test contoso site in application gateway](./media/tutorial-multisite-cli/application-gateway-nginxtest1.png)

Change the address to your other domain and you should see something like the following example:

![Test fabrikam site in application gateway](./media/tutorial-multisite-cli/application-gateway-nginxtest2.png)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up the network
> * Create an application gateway
> * Create listeners and routing rules
> * Create virtual machine scale sets with the backend pools
> * Create a CNAME record in your domain

> [!div class="nextstepaction"]
> [Learn more about what you can do with application gateway](application-gateway-introduction.md)
