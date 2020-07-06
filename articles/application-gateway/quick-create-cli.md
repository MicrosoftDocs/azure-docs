---
title: 'Quickstart: Direct web traffic using CLI'
titleSuffix: Azure Application Gateway
description: Learn how to use the Azure CLI to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: quickstart
ms.date: 03/05/2020
ms.author: victorh
ms.custom: mvc
---

# Quickstart: Direct web traffic with Azure Application Gateway - Azure CLI

In this quickstart, you use Azure CLI to create an application gateway. Then you test it to make sure it works correctly. 

The application gateway directs application web traffic to specific resources in a backend pool. You assign listeners to ports, create rules, and add resources to a backend pool. For the sake of simplicity, this article uses a simple setup with a public front-end IP, a basic listener to host a single site on the application gateway, a basic request routing rule, and two virtual machines in the backend pool.

You can also complete this quickstart using [Azure PowerShell](quick-create-powershell.md) or the [Azure portal](quick-create-portal.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure CLI version 2.0.4 or later](/cli/azure/install-azure-cli) (if you run Azure CLI locally).

## Create resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using `az group create`. 

The following example creates a resource group named *myResourceGroupAG* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroupAG --location eastus
```

## Create network resources 

For Azure to communicate between the resources that you create, it needs a virtual network.  The application gateway subnet can contain only application gateways. No other resources are allowed.  You can either create a new subnet for Application Gateway or use an existing one. In this example, you create two subnets: one for the application gateway, and another for the backend servers. You can configure the Frontend IP of the Application Gateway to be Public or Private as per your use case. In this example, you'll choose a Public Frontend IP address.

To create the virtual network and subnet, use `az network vnet create`. Run `az network public-ip create` to create the public IP address.

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
  --vnet-name myVNet   \
  --address-prefix 10.0.2.0/24
az network public-ip create \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress \
  --allocation-method Static \
  --sku Standard
```

## Create the backend servers

A backend can have NICs, virtual machine scale sets, public IPs, internal IPs, fully qualified domain names (FQDN), and multi-tenant back-ends like Azure App Service. In this example, you create two virtual machines to use as backend servers for the application gateway. You also install IIS on the virtual machines to test the application gateway.

#### Create two virtual machines

Install the NGINX web server on the virtual machines to verify the application gateway was successfully created. You can use a cloud-init configuration file to install NGINX and run a "Hello World" Node.js app on a Linux virtual machine. For more information about cloud-init, see
[Cloud-init support for virtual machines in Azure](../virtual-machines/linux/using-cloud-init.md).

In your Azure Cloud Shell, copy and paste the following configuration into a file named *cloud-init.txt*. Enter *editor cloud-init.txt* to create the file.

```yaml
#cloud-config
package_upgrade: true
packages:
  - nginx
  - nodejs
  - npm
write_files:
  - owner: www-data:www-data
  - path: /etc/nginx/sites-available/default
    content: |
      server {
        listen 80;
        location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection keep-alive;
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
        }
      }
  - owner: azureuser:azureuser
  - path: /home/azureuser/myapp/index.js
    content: |
      var express = require('express')
      var app = express()
      var os = require('os');
      app.get('/', function (req, res) {
        res.send('Hello World from host ' + os.hostname() + '!')
      })
      app.listen(3000, function () {
        console.log('Hello world app listening on port 3000!')
      })
runcmd:
  - service nginx restart
  - cd "/home/azureuser/myapp"
  - npm init
  - npm install express -y
  - nodejs index.js
```

Create the network interfaces with `az network nic create`. To create the virtual machines, you use `az vm create`.

```azurecli-interactive
for i in `seq 1 2`; do
  az network nic create \
    --resource-group myResourceGroupAG \
    --name myNic$i \
    --vnet-name myVNet \
    --subnet myBackendSubnet
  az vm create \
    --resource-group myResourceGroupAG \
    --name myVM$i \
    --nics myNic$i \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud-init.txt
done
```

## Create the application gateway

Create an application gateway using `az network application-gateway create`. When you create an application gateway with the Azure CLI, you specify configuration information, such as capacity, SKU, and HTTP settings. Azure then adds the private IP addresses of the network interfaces as servers in the backend pool of the application gateway.

```azurecli-interactive
address1=$(az network nic show --name myNic1 --resource-group myResourceGroupAG | grep "\"privateIpAddress\":" | grep -oE '[^ ]+$' | tr -d '",')
address2=$(az network nic show --name myNic2 --resource-group myResourceGroupAG | grep "\"privateIpAddress\":" | grep -oE '[^ ]+$' | tr -d '",')
az network application-gateway create \
  --name myAppGateway \
  --location eastus \
  --resource-group myResourceGroupAG \
  --capacity 2 \
  --sku Standard_v2 \
  --http-settings-cookie-based-affinity Enabled \
  --public-ip-address myAGPublicIPAddress \
  --vnet-name myVNet \
  --subnet myAGSubnet \
  --servers "$address1" "$address2"
```

It can take up to 30 minutes for Azure to create the application gateway. After it's created, you can view the following settings in the **Settings** section of the **Application gateway** page:

- **appGatewayBackendPool**: Located on the **Backend pools** page. It specifies the required backend pool.
- **appGatewayBackendHttpSettings**: Located on the **HTTP settings** page. It specifies that the application gateway uses port 80 and the HTTP protocol for communication.
- **appGatewayHttpListener**: Located on the **Listeners page**. It specifies the default listener associated with **appGatewayBackendPool**.
- **appGatewayFrontendIP**: Located on the **Frontend IP configurations** page. It assigns *myAGPublicIPAddress* to **appGatewayHttpListener**.
- **rule1**: Located on the **Rules** page. It specifies the default routing rule that's associated with **appGatewayHttpListener**.

## Test the application gateway

Although Azure doesn't require an NGINX web server to create the application gateway, you installed it in this quickstart to verify whether Azure successfully created the application gateway. To get the public IP address of the new application gateway, use `az network public-ip show`. 

```azurecli-interactive
az network public-ip show \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress \
  --query [ipAddress] \
  --output tsv
```

Copy and paste the public IP address into the address bar of your browser.
​    
![Test application gateway](./media/quick-create-cli/application-gateway-nginxtest.png)

When you refresh the browser, you should see the name of the second VM. This indicates the application gateway was successfully created and can connect with the backend.

## Clean up resources

When you no longer need the resources that you created with the application gateway, use the `az group delete` command to delete the resource group. When you delete the resource group, you also delete the application gateway and all its related resources.

```azurecli-interactive 
az group delete --name myResourceGroupAG
```

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using the Azure CLI](./tutorial-manage-web-traffic-cli.md)

