---
title: Tutorial - Create an application gateway with URL path-based redirection - Azure CLI
description: In this tutorial, you learn how to create an application gateway with URL path-based redirected traffic using the Azure CLI.
services: application-gateway
author: vhorne
manager: jpconnock

ms.service: application-gateway
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 7/14/2018
ms.author: victorh
ms.custom: mvc
#Customer intent: As an IT administrator, I want to use Azure CLI to set up URL path redirection of web traffic to specific pools of servers so I can ensure my customers have access to the information they need.

---
# Tutorial: Create an application gateway with URL path-based redirection using the Azure CLI

You can use the Azure CLI to configure [URL path-based routing rules](application-gateway-url-route-overview.md) when you create an [application gateway](application-gateway-introduction.md). In this tutorial, you create backend pools using [virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md). You then create URL routing rules that make sure web traffic is redirected to the appropriate backend pool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the network
> * Create an application gateway
> * Add listeners and routing rules
> * Create virtual machine scale sets for backend pools

The following example shows site traffic coming from both ports 8080 and 8081 and being directed to the same backend pools:

![URL routing example](./media/tutorial-url-redirect-cli/scenario.png)

If you prefer, you can complete this tutorial using [Azure PowerShell](tutorial-url-redirect-powershell.md).

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

## Create an application gateway

Use [az network application-gateway create](/cli/azure/network/application-gateway) to create the application gateway named myAppGateway. When you create an application gateway using the Azure CLI, you specify configuration information, such as capacity, sku, and HTTP settings. The application gateway is assigned to *myAGSubnet* and *myPublicIPAddress* that you previously created.

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

 It may take several minutes for the application gateway to be created. After the application gateway is created, you can see these new features:

- *appGatewayBackendPool* - An application gateway must have at least one backend address pool.
- *appGatewayBackendHttpSettings* - Specifies that port 80 and an HTTP protocol is used for communication.
- *appGatewayHttpListener* - The default listener associated with *appGatewayBackendPool*.
- *appGatewayFrontendIP* - Assigns *myAGPublicIPAddress* to *appGatewayHttpListener*.
- *rule1* - The default routing rule that is associated with *appGatewayHttpListener*.


### Add backend pools and ports

You can add backend address pools named *imagesBackendPool* and *videoBackendPool* to your application gateway by using [az network application-gateway address-pool create](/cli/azure/network/application-gateway/address-pool). You add the frontend ports for the pools using [az network application-gateway frontend-port create](/cli/azure/network/application-gateway/frontend-port). 

```azurecli-interactive
az network application-gateway address-pool create \
  --gateway-name myAppGateway \
  --resource-group myResourceGroupAG \
  --name imagesBackendPool

az network application-gateway address-pool create \
  --gateway-name myAppGateway \
  --resource-group myResourceGroupAG \
  --name videoBackendPool

az network application-gateway frontend-port create \
  --port 8080 \
  --gateway-name myAppGateway \
  --resource-group myResourceGroupAG \
  --name bport

az network application-gateway frontend-port create \
  --port 8081 \
  --gateway-name myAppGateway \
  --resource-group myResourceGroupAG \
  --name rport
```

## Add listeners and rules

### Add listeners

Add the backend listeners named *backendListener* and *redirectedListener* that are needed to route traffic using [az network application-gateway http-listener create](/cli/azure/network/application-gateway/http-listener).


```azurecli-interactive
az network application-gateway http-listener create \
  --name backendListener \
  --frontend-ip appGatewayFrontendIP \
  --frontend-port bport \
  --resource-group myResourceGroupAG \
  --gateway-name myAppGateway

az network application-gateway http-listener create \
  --name redirectedListener \
  --frontend-ip appGatewayFrontendIP \
  --frontend-port rport \
  --resource-group myResourceGroupAG \
  --gateway-name myAppGateway
```

### Add the default URL path map

URL path maps make sure that specific URLs are routed to specific backend pools. You can create URL path maps named *imagePathRule* and *videoPathRule* using [az network application-gateway url-path-map create](/cli/azure/network/application-gateway/url-path-map) and [az network application-gateway url-path-map rule create](/cli/azure/network/application-gateway/url-path-map/rule)

```azurecli-interactive
az network application-gateway url-path-map create \
  --gateway-name myAppGateway \
  --name urlpathmap \
  --paths /images/* \
  --resource-group myResourceGroupAG \
  --address-pool imagesBackendPool \
  --default-address-pool appGatewayBackendPool \
  --default-http-settings appGatewayBackendHttpSettings \
  --http-settings appGatewayBackendHttpSettings \
  --rule-name imagePathRule

az network application-gateway url-path-map rule create \
  --gateway-name myAppGateway \
  --name videoPathRule \
  --resource-group myResourceGroupAG \
  --path-map-name urlpathmap \
  --paths /video/* \
  --address-pool videoBackendPool
```

### Add redirection configuration

You can configure redirection for the listener using [az network application-gateway redirect-config create](/cli/azure/network/application-gateway/redirect-config).

```azurecli-interactive
az network application-gateway redirect-config create \
  --gateway-name myAppGateway \
  --name redirectConfig \
  --resource-group myResourceGroupAG \
  --type Found \
  --include-path true \
  --include-query-string true \
  --target-listener backendListener
```

### Add the redirection URL path map

```azurecli-interactive
az network application-gateway url-path-map create \
  --gateway-name myAppGateway \
  --name redirectpathmap \
  --paths /images/* \
  --resource-group myResourceGroupAG \
  --redirect-config redirectConfig \
  --rule-name redirectPathRule
```

### Add routing rules

The routing rules associate the URL path maps with the listeners that you created. You can add the rules named *defaultRule* and *redirectedRule* using [az network application-gateway rule create](/cli/azure/network/application-gateway/rule).

```azurecli-interactive
az network application-gateway rule create \
  --gateway-name myAppGateway \
  --name defaultRule \
  --resource-group myResourceGroupAG \
  --http-listener backendListener \
  --rule-type PathBasedRouting \
  --url-path-map urlpathmap \
  --address-pool appGatewayBackendPool

az network application-gateway rule create \
  --gateway-name myAppGateway \
  --name redirectedRule \
  --resource-group myResourceGroupAG \
  --http-listener redirectedListener \
  --rule-type PathBasedRouting \
  --url-path-map redirectpathmap \
  --address-pool appGatewayBackendPool
```

## Create virtual machine scale sets

In this example, you create three virtual machine scale sets that support the three backend pools that you created. The scale sets that you create are named *myvmss1*, *myvmss2*, and *myvmss3*. Each scale set contains two virtual machine instances on which you install NGINX.

```azurecli-interactive
for i in `seq 1 3`; do
  if [ $i -eq 1 ]
  then
    poolName="appGatewayBackendPool" 
  fi
  if [ $i -eq 2 ]
  then
    poolName="imagesBackendPool"
  fi
  if [ $i -eq 3 ]
  then
    poolName="videoBackendPool"
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
for i in `seq 1 3`; do
  az vmss extension set \
    --publisher Microsoft.Azure.Extensions \
    --version 2.0 \
    --name CustomScript \
    --resource-group myResourceGroupAG \
    --vmss-name myvmss$i \
    --settings '{ "fileUris": ["https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/install_nginx.sh"], "commandToExecute": "./install_nginx.sh" }'

done
```

## Test the application gateway

To get the public IP address of the application gateway, use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show). Copy the public IP address, and then paste it into the address bar of your browser. Such as, `http://40.121.222.19`, `http://40.121.222.19:8080/images/test.htm`, `http://40.121.222.19:8080/video/test.htm`, or `http://40.121.222.19:8081/images/test.htm`.

```azurepowershell-interactive
az network public-ip show \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress \
  --query [ipAddress] \
  --output tsv
```

![Test base URL in application gateway](./media/tutorial-url-redirect-cli/application-gateway-nginx.png)

Change the URL to http://&lt;ip-address&gt;:8080/images/test.html, substituting your IP address for &lt;ip-address&gt;, and you should see something like the following example:

![Test images URL in application gateway](./media/tutorial-url-redirect-cli/application-gateway-nginx-images.png)

Change the URL to http://&lt;ip-address&gt;:8080/video/test.html, substituting your IP address for &lt;ip-address&gt;, and you should see something like the following example:

![Test video URL in application gateway](./media/tutorial-url-redirect-cli/application-gateway-nginx-video.png)

Now, change the URL to http://&lt;ip-address&gt;:8081/images/test.htm, substituting your IP address for &lt;ip-address&gt;, and you should see traffic redirected back to the images backend pool at http://&lt;ip-address&gt;:8080/images.

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroupAG --location eastus
```
## Next steps

> [!div class="nextstepaction"]
> [Learn more about what you can do with application gateway](application-gateway-introduction.md)
