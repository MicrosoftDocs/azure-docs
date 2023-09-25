---
title: HTTP to HTTPS redirection using CLI
titleSuffix: Azure Application Gateway
description: Learn how to create an HTTP to HTTPS redirection and add a certificate for TLS termination using the Azure CLI.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.custom: devx-track-azurecli, devx-track-linux
ms.topic: how-to
ms.date: 04/27/2023
ms.author: greglin
---

# Create an application gateway with HTTP to HTTPS redirection using the Azure CLI

You can use the Azure CLI to create an [application gateway](overview.md) with a certificate for TLS/SSL termination. A routing rule is used to redirect HTTP traffic to the HTTPS port in your application gateway. In this example, you also create a [Virtual Machine Scale Set](../virtual-machine-scale-sets/overview.md) for the backend pool of the application gateway that contains two virtual machine instances.

In this article, you learn how to:

* Create a self-signed certificate
* Set up a network
* Create an application gateway with the certificate
* Add a listener and redirection rule
* Create a Virtual Machine Scale Set with the default backend pool

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a self-signed certificate

For production use, you should import a valid certificate signed by a trusted provider. For this tutorial, you create a self-signed certificate and pfx file using the openssl command.

```console
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out appgwcert.crt
```

Enter values that make sense for your certificate. You can accept the default values.

```console
openssl pkcs12 -export -out appgwcert.pfx -inkey privateKey.key -in appgwcert.crt
```

Enter the password for the certificate. In this example, *Azure123456!* is being used.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group using [az group create](/cli/azure/group).

The following example creates a resource group named *myResourceGroupAG* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroupAG --location eastus
```

## Create network resources

Create the virtual network named *myVNet* and the subnet named *myAGSubnet* using [az network vnet create](/cli/azure/network/vnet). You can then add the subnet named *myBackendSubnet* needed by the backend servers using [az network vnet subnet create](/cli/azure/network/vnet/subnet). Create the public IP address named *myAGPublicIPAddress* using [az network public-ip create](/cli/azure/network/public-ip).

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

You can use [az network application-gateway create](/cli/azure/network/application-gateway#az-network-application-gateway-create) to create the application gateway named *myAppGateway*. When you create an application gateway using the Azure CLI, you specify configuration information, such as capacity, sku, and HTTP settings. 

The application gateway is assigned to *myAGSubnet* and *myAGPublicIPAddress* that you previously created. In this example, you associate the certificate that you created and its password when you create the application gateway. 

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
  --frontend-port 443 \
  --http-settings-port 80 \
  --http-settings-protocol Http \
  --public-ip-address myAGPublicIPAddress \
  --cert-file appgwcert.pfx \
  --cert-password "Azure123456!"

```

 It may take several minutes for the application gateway to be created. After the application gateway is created, you can see these new features of it:

- *appGatewayBackendPool* - An application gateway must have at least one backend address pool.
- *appGatewayBackendHttpSettings* - Specifies that port 80 and an HTTP protocol is used for communication.
- *appGatewayHttpListener* - The default listener associated with *appGatewayBackendPool*.
- *appGatewayFrontendIP* - Assigns *myAGPublicIPAddress* to *appGatewayHttpListener*.
- *rule1* - The default routing rule that is associated with *appGatewayHttpListener*.

## Add a listener and redirection rule

### Add the HTTP port

You can use [az network application-gateway frontend-port create](/cli/azure/network/application-gateway/frontend-port#az-network-application-gateway-frontend-port-create) to add the HTTP port to the application gateway.

```azurecli-interactive
az network application-gateway frontend-port create \
  --port 80 \
  --gateway-name myAppGateway \
  --resource-group myResourceGroupAG \
  --name httpPort
```

### Add the HTTP listener

You can use [az network application-gateway http-listener create](/cli/azure/network/application-gateway/http-listener#az-network-application-gateway-http-listener-create) to add the listener named *myListener* to the application gateway.

```azurecli-interactive
az network application-gateway http-listener create \
  --name myListener \
  --frontend-ip appGatewayFrontendIP \
  --frontend-port httpPort \
  --resource-group myResourceGroupAG \
  --gateway-name myAppGateway
```

### Add the redirection configuration

Add the HTTP to HTTPS redirection configuration to the application gateway using [az network application-gateway redirect-config create](/cli/azure/network/application-gateway/redirect-config#az-network-application-gateway-redirect-config-create).

```azurecli-interactive
az network application-gateway redirect-config create \
  --name httpToHttps \
  --gateway-name myAppGateway \
  --resource-group myResourceGroupAG \
  --type Permanent \
  --target-listener appGatewayHttpListener \
  --include-path true \
  --include-query-string true
```

### Add the routing rule

Add the routing rule named *rule2* with the redirection configuration to the application gateway using [az network application-gateway rule create](/cli/azure/network/application-gateway/rule#az-network-application-gateway-rule-create).

```azurecli-interactive
az network application-gateway rule create \
  --gateway-name myAppGateway \
  --name rule2 \
  --resource-group myResourceGroupAG \
  --http-listener myListener \
  --rule-type Basic \
  --redirect-config httpToHttps
```

## Create a Virtual Machine Scale Set

In this example, you create a Virtual Machine Scale Set named *myvmss* that provides servers for the backend pool in the application gateway. The virtual machines in the scale set are associated with *myBackendSubnet* and *appGatewayBackendPool*. To create the scale set, you can use [az vmss create](/cli/azure/vmss#az-vmss-create).

```azurecli-interactive
az vmss create \
  --name myvmss \
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
  --backend-pool-name appGatewayBackendPool
```

### Install NGINX

```azurecli-interactive
az vmss extension set \
  --publisher Microsoft.Azure.Extensions \
  --version 2.0 \
  --name CustomScript \
  --resource-group myResourceGroupAG \
  --vmss-name myvmss \
  --settings '{ "fileUris": ["https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/install_nginx.sh"],
  "commandToExecute": "./install_nginx.sh" }'
```

## Test the application gateway

To get the public IP address of the application gateway, you can use [az network public-ip show](/cli/azure/network/public-ip). Copy the public IP address, and then paste it into the address bar of your browser.

```azurecli-interactive
az network public-ip show \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress \
  --query [ipAddress] \
  --output tsv
```

![Secure warning](./media/redirect-http-to-https-cli/application-gateway-secure.png)

To accept the security warning if you used a self-signed certificate, select **Details** and then **Go on to the webpage**. Your secured NGINX site is then displayed as in the following example:

![Test base URL in application gateway](./media/redirect-http-to-https-cli/application-gateway-nginxtest.png)

## Next steps

- [Create an application gateway with internal redirection using the Azure CLI](redirect-internal-site-cli.md)
