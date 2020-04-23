---
title: Quickstart:Create a profile for HA of applications - Azure CLI - Azure Traffic Manager
description: This quickstart article describes how to create a Traffic Manager profile to build a highly available web application.
services: traffic-manager
author: rohinkoul
mnager: twooley
Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
ms.service: traffic-manager
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/29/2019
ms.author: rohink
---

# Quickstart: Create a Traffic Manager profile for a highly available web application using Azure CLI

This quickstart describes how to create a Traffic Manager profile that delivers high availability for your web application.

In this quickstart, you'll create two instances of a web application. Each of them is running in a different Azure region. You'll create a Traffic Manager profile based on [endpoint priority](traffic-manager-routing-methods.md#priority-traffic-routing-method). The profile directs user traffic to the primary site running the web application. Traffic Manager continuously monitors the web application. If the primary site is unavailable, it provides automatic failover to the backup site.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running a version of the Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Create a resource group
Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive

  az group create \
    --name myResourceGroup \
    --location eastus

```

## Create a Traffic Manager profile

Create a Traffic Manager profile using [az network traffic-manager profile create](https://docs.microsoft.com/cli/azure/network/traffic-manager/profile?view=azure-cli-latest#az-network-traffic-manager-profile-create) that directs user traffic based on endpoint priority.

In the following example, replace **<profile_name>** with a unique Traffic Manager profile name.

```azurecli-interactive

az network traffic-manager profile create \
	--name <profile_name> \
	--resource-group myResourceGroup \
	--routing-method Priority \
	--path "/" \
	--protocol HTTP \
	--unique-dns-name <profile_name> \
	--ttl 30 \
	--port 80

```

## Create web apps

For this quickstart, you'll need two instances of a web application deployed in two different Azure regions (*East US* and *West Europe*). Each will serve as primary and failover endpoints for Traffic Manager.

### Create web app service plans
Create web app service plans using [az appservice plan create](https://docs.microsoft.com/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create) for the two instances of the web application that you will deploy in two different Azure regions.

In the following example, replace **<appspname_eastus>** and **<appspname_westeurope>** with a unique App Service Plan Name

```azurecli-interactive

az appservice plan create \
    --name <appspname_eastus> \
    --resource-group myResourceGroup \
    --location eastus \
    --sku S1

az appservice plan create \
    --name <appspname_westeurope> \
    --resource-group myResourceGroup \
    --location westeurope \
    --sku S1

```

### Create a web app in the app service plan
Create two instances the web application using [az webapp create](https://docs.microsoft.com/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) in the App Service plans in the *East US* and *West Europe* Azure regions.

In the following example, replace **<app1name_eastus>** and **<app2name_westeurope>** with a unique App Name, and replace **<appspname_eastus>** and **<appspname_westeurope>** with the name used to create the App Service plans in the previous section.

```azurecli-interactive

az webapp create \
    --name <app1name_eastus> \
    --plan <appspname_eastus> \
    --resource-group myResourceGroup

az webapp create \
    --name <app2name_westeurope> \
    --plan <appspname_westeurope> \
    --resource-group myResourceGroup

```

## Add Traffic Manager endpoints
Add the two Web Apps as Traffic Manager endpoints using [az network traffic-manager endpoint create](https://docs.microsoft.com/cli/azure/network/traffic-manager/endpoint?view=azure-cli-latest#az-network-traffic-manager-endpoint-create) to the Traffic Manager profile as follows:

- Determine the Web App id and add the Web App located in the *East US* Azure region as the primary endpoint to route all the user traffic. 
- Determine the Web App id and add the Web App located in the *West Europe* Azure region as the failover endpoint. 

When the primary endpoint is unavailable, traffic automatically routes to the failover endpoint.

In the following example, replace **<app1name_eastus>** and **<app2name_westeurope>** with the App Names created for each region in the previous section, replace **<appspname_eastus>** and **<appspname_westeurope>** with the name used to create the App Service plans in the previous section, and replace **<profile_name>** with the profile name used in the previous section. 

**East US endpoint**

```azurecli-interactive

az webapp show \
    --name <app1name_eastus> \
    --resource-group myResourceGroup \
    --query id

```

Make note of id displayed in output and use in the following command to add the endpoint:

```azurecli-interactive

az network traffic-manager endpoint create \
    --name <app1name_eastus> \
    --resource-group myResourceGroup \
    --profile-name <profile_name> \
    --type azureEndpoints \
    --target-resource-id <ID from az webapp show> \
    --priority 1 \
    --endpoint-status Enabled
```

**West Europe endpoint**

```azurecli-interactive

az webapp show \
    --name <app2name_westeurope> \
    --resource-group myResourceGroup \
    --query id

```

Make note of id displayed in output and use in the following command to add the endpoint:

```azurecli-interactive

az network traffic-manager endpoint create \
    --name <app1name_westeurope> \
    --resource-group myResourceGroup \
    --profile-name <profile_name> \
    --type azureEndpoints \
    --target-resource-id <ID from az webapp show> \
    --priority 2 \
    --endpoint-status Enabled

```

## Test your Traffic Manager profile

In this section, you'll check the domain name of your Traffic Manager profile. You'll also configure the primary endpoint to be unavailable. Finally, you get to see that the web app is still available. It's because Traffic Manager sends the traffic to the failover endpoint.

In the following example, replace **<app1name_eastus>** and **<app2name_westeurope>** with the App Names created for each region in the previous section, replace **<appspname_eastus>** and **<appspname_westeurope>** with the name used to create the App Service plans in the previous section, and replace **<profile_name>** with the profile name used in the previous section.

### Determine the DNS name

Determine the DNS name of the Traffic Manager profile using [az network traffic-manager profile show](https://docs.microsoft.com/cli/azure/network/traffic-manager/profile?view=azure-cli-latest#az-network-traffic-manager-profile-show).

```azurecli-interactive

az network traffic-manager profile show \
    --name <profile_name> \
    --resource-group myResourceGroup \
    --query dnsConfig.fqdn

```

Copy the **RelativeDnsName** value. The DNS name of your Traffic Manager profile is *http://<*relativednsname*>.trafficmanager.net*. 

### View Traffic Manager in action
1. In a web browser, enter the DNS name of your Traffic Manager profile (*http://<*relativednsname*>.trafficmanager.net*) to view your Web App's default website.

    > [!NOTE]
    > In this quickstart scenario, all requests route to the primary endpoint. It is set to **Priority 1**.
2. To view Traffic Manager failover in action, disable your primary site using [az network traffic-manager endpoint update](https://docs.microsoft.com/cli/azure/network/traffic-manager/endpoint?view=azure-cli-latest#az-network-traffic-manager-endpoint-update).

   ```azurecli-interactive

    az network traffic-manager endpoint update \
        --name <app1name_eastus> \
        --resource-group myResourceGroup \
        --profile-name <profile_name> \
        --type azureEndpoints \
        --endpoint-status Disabled
    
   ```

3. Copy the DNS name of your Traffic Manager profile (*http://<*relativednsname*>.trafficmanager.net*) to view the website in a new web browser session.
4. Verify that the web app is still available.

## Clean up resources

When you're done, delete the resource groups, web applications, and all related resources using [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete).

```azurecli-interactive

az group delete \
    --resource-group myResourceGroup

```

## Next steps

In this quickstart, you created a Traffic Manager profile that provides high availability for your web application. To learn more about routing traffic, continue to the Traffic Manager tutorials.

> [!div class="nextstepaction"]
> [Traffic Manager tutorials](tutorial-traffic-manager-improve-website-response.md)
