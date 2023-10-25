---
title: Route web traffic based on the URL - Azure CLI
description: In this article, learn how to route web traffic based on the URL to specific scalable pools of servers using the Azure CLI.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 04/27/2023
ms.author: greglin
ms.custom: mvc, devx-track-azurecli, devx-track-linux
#Customer intent: As an IT administrator, I want to use Azure CLI to set up routing of web traffic to specific pools of servers based on the URL that the customer uses, so I can ensure my customers have the most efficient route to the information they need.
---

# Route web traffic based on the URL using the Azure CLI

As an IT administrator managing web traffic, you want to help your customers and users get the information they need as quickly as possible. One way you can optimize their experience is by routing different kinds of web traffic to different server resources. This article shows you how to use the Azure CLI to set up and configure Application Gateway routing for different types of traffic from your application. The routing then directs the traffic to different server pools based on the URL.

![URL routing example](./media/tutorial-url-route-cli/scenario.png)

In this article, you learn how to:

* Create a resource group for the network resources you need
* Create the network resources
* Create an application gateway for the traffic coming from your application
* Specify server pools and routing rules for the different types of traffic
* Create a scale set for each pool so the pool can automatically scale
* Run a test so you can verify that the different types of traffic go to the correct pool

If you prefer, you can complete this procedure using [Azure PowerShell](tutorial-url-route-powershell.md) or the [Azure portal](create-url-route-portal.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

A resource group is a logical container where Azure resources are deployed and managed. Create a resource group using `az group create`.

The following example creates a resource group named *myResourceGroupAG* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroupAG --location eastus
```

## Create network resources

Create the virtual network named *myVNet* and the subnet named *myAGSubnet* using `az network vnet create`. Then add a subnet named *myBackendSubnet* needed by the backend servers using `az network vnet subnet create`. Create the public IP address named *myAGPublicIPAddress* using `az network public-ip create`.

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
  --name myAGPublicIPAddress \
  --allocation-method Static \
  --sku Standard
```

## Create the app gateway with a URL map

Use `az network application-gateway create` to create an application gateway named *myAppGateway*. When you create an application gateway using the Azure CLI, you specify configuration information, such as capacity, sku, and HTTP settings. The application gateway is assigned to *myAGSubnet* and *myAGPublicIPAddress*.

```azurecli-interactive
az network application-gateway create \
  --name myAppGateway \
  --location eastus \
  --resource-group myResourceGroupAG \
  --vnet-name myVNet \
  --subnet myAGsubnet \
  --capacity 2 \
  --sku Standard_v2 \
  --http-settings-cookie-based-affinity Disabled \
  --frontend-port 80 \
  --http-settings-port 80 \
  --http-settings-protocol Http \
  --public-ip-address myAGPublicIPAddress \
  --priority 100
```

 It may take several minutes to create the application gateway. After the application gateway is created, you can see these new features:


|Feature  |Description  |
|---------|---------|
|appGatewayBackendPool     |An application gateway must have at least one backend address pool.|
|appGatewayBackendHttpSettings     |Specifies that port 80 and an HTTP protocol are used for communication.|
|appGatewayHttpListener     |The default listener associated with appGatewayBackendPool|
|appGatewayFrontendIP     |Assigns myAGPublicIPAddress to appGatewayHttpListener.|
|rule1     |The default routing rule that is associated with appGatewayHttpListener.|

### Add image and video backend pools and a port

Add backend pools named *imagesBackendPool* and *videoBackendPool* to your application gateway by using `az network application-gateway address-pool create`. You add the frontend port for the pools using `az network application-gateway frontend-port create`.

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
  --name port8080
```

### Add a backend listener

Add the backend listener named *backendListener* that's needed to route traffic using `az network application-gateway http-listener create`.


```azurecli-interactive
az network application-gateway http-listener create \
  --name backendListener \
  --frontend-ip appGatewayFrontendIP \
  --frontend-port port8080 \
  --resource-group myResourceGroupAG \
  --gateway-name myAppGateway
```

### Add a URL path map

URL path maps ensure that specific URLs are routed to specific backend pools. Create URL path maps named *imagePathRule* and *videoPathRule* using `az network application-gateway url-path-map create` and `az network application-gateway url-path-map rule create`.

```azurecli-interactive
az network application-gateway url-path-map create \
  --gateway-name myAppGateway \
  --name myPathMap \
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
  --path-map-name myPathMap \
  --paths /video/* \
  --address-pool videoBackendPool \
  --http-settings appGatewayBackendHttpSettings
```

### Add a routing rule

The routing rule associates the URL maps with the listener that you created. Add a rule named *rule2* using `az network application-gateway rule create`.

```azurecli-interactive
az network application-gateway rule create \
  --gateway-name myAppGateway \
  --name rule2 \
  --resource-group myResourceGroupAG \
  --http-listener backendListener \
  --rule-type PathBasedRouting \
  --url-path-map myPathMap \
  --address-pool appGatewayBackendPool \
  --priority 200
```

## Create Virtual Machine Scale Sets

In this article, you create three Virtual Machine Scale Sets that support the three backend pools you created. You create scale sets named *myvmss1*, *myvmss2*, and *myvmss3*. Each scale set contains two virtual machine instances where you install NGINX.

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
    --image Ubuntu2204 \
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

To get the public IP address of the application gateway, use az network public-ip show. Copy the public IP address, and then paste it into the address bar of your browser. Such as, `http://40.121.222.19`, `http://40.121.222.19:8080/images/test.htm`, or `http://40.121.222.19:8080/video/test.htm`.

```azurecli-interactive
az network public-ip show \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress \
  --query [ipAddress] \
  --output tsv
```

![Test base URL in application gateway](./media/tutorial-url-route-cli/application-gateway-nginx.png)

Change the URL to http://&lt;ip-address&gt;:8080/images/test.html, replacing your IP address for &lt;ip-address&gt;, and you should see something like the following example:

![Test images URL in application gateway](./media/tutorial-url-route-cli/application-gateway-nginx-images.png)

Change the URL to http://&lt;ip-address&gt;:8080/video/test.html, replacing your IP address for &lt;ip-address&gt;, and you should see something like the following example.

![Test video URL in application gateway](./media/tutorial-url-route-cli/application-gateway-nginx-video.png)

## Clean up resources

When they're no longer needed, remove the resource group, application gateway, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroupAG
```

## Next steps

[Create an application gateway with URL path-based redirection](./tutorial-url-redirect-cli.md)
