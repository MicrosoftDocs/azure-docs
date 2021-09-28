---
title: 'Quickstart: Set up high availability with Azure Front Door - Azure CLI'
description: This quickstart will show you how to use Azure Front Door to create a high availability and high-performance global web application using Azure CLI.
services: front-door
author: duongau
manager: KumudD
# Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
ms.assetid:
ms.service: frontdoor
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 4/19/2021
ms.author: duau
---

# Quickstart: Create a Front Door for a highly available global web application using Azure CLI

Get started with Azure Front Door by using Azure CLI to create a highly available and high-performance global web application.

The Front Door directs web traffic to specific resources in a backend pool. You defined the frontend domain, add resources to a backend pool, and create a routing rule. This article uses a simple configuration of one backend pool with two web app resources and a single routing rule using default path matching "/*".

:::image type="content" source="media/quickstart-create-front-door/environment-diagram.png" alt-text="Diagram of Front Door deployment environment using the Azure CLI." border="false":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure CLI installed locally or Azure Cloud Shell
- Ensure that the front-door extension is added to your Azure CLI

```azurecli-interactive 
az extension add --name front-door
```

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Create a resource group

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

For this quickstart, you need two resource groups. One in *Central US* and the second in *South Central US*.

Create a resource group with [az group create](/cli/azure/group#az_group_create):

```azurecli-interactive
az group create \
    --name myRGFDCentral \
    --location centralus

az group create \
    --name myRGFDEast \
    --location eastus
```

## Create two instances of a web app

Two instances of a web application that run in different Azure regions is required for this quickstart. Both the web application instances run in Active/Active mode, so either one can service traffic.

If you don't already have a web app, use the following script to set up two example web apps.

### Create app service plans

Before you can create the web apps you will need two app service plans, one in *Central US* and the second in *East US*.

Create app service plans with [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create&preserve-view=true):

```azurecli-interactive
az appservice plan create \
--name myAppServicePlanCentralUS \
--resource-group myRGFDCentral

az appservice plan create \
--name myAppServicePlanEastUS \
--resource-group myRGFDEast
```

### Create web apps

Running the following commands will create a web app in each of the app service plans in the previous step. Web app names have to be globally unique.

Create web app with [az webapp create](/cli/azure/webapp#az_webapp_create&preserve-view=true):

```azurecli-interactive
az webapp create \
--name WebAppContoso-1 \
--resource-group myRGFDCentral \
--plan myAppServicePlanCentralUS 

az webapp create \
--name WebAppContoso-2 \
--resource-group myRGFDEast \
--plan myAppServicePlanEastUS
```

Make note of the default host name of each web app so you can define the backend addresses when you deploy the Front Door in the next step.

## Create the Front Door

Create a basic Front Door with default load balancing settings, health probe, and routing rules by running to follow:

Create Front Door with [az network front-door create](/cli/azure/network/front-door#az_network_front_door_create&preserve-view=true):

```azurecli-interactive
az network front-door create \
--resource-group myRGFDCentral \
--name contoso-frontend \
--accepted-protocols http https \
--backend-address webappcontoso-1.azurewebsites.net webappcontoso-2.azurewebsites.net 
```

**--resource-group:** Specify a resource group where you want to deploy the Front Door.

**--name:** Specify a globally unique name for your Azure Front Door. 

**--accepted-protocols:** Accepted values are **http** and **https**. If you want to use both, specific both separated by a space.

**--backend-address:** Define both web apps host name here separated by a space.

Once the deployment has successfully completed, make note of the host name in the *frontEndpoints* section.

## Test the Front Door

Open a web browser and enter the hostname obtain from the commands. The Front Door will direct your request to one of the backend resources.

:::image type="content" source="./media/quickstart-create-front-door-cli/front-door-testing-page.png" alt-text="Front Door testing page":::

## Clean up resources

When you no longer need the resources that you created with the Front Door, delete both resource groups. When you delete the resource group, you also delete the Front Door and all its related resources. 

To delete the resource group use [az group delete](/cli/azure/group#az_group_delete&preserve-view=true):

```azurecli-interactive
az group delete \
--name myRGFDCentral 

az group delete \
--name myRGFDEast
```

## Next steps

In this quickstart, you created a:
* Front Door
* Two web apps

To learn how to add a custom domain to your Front Door, continue to the Front Door tutorials.

> [!div class="nextstepaction"]
> [Add a custom domain](front-door-custom-domain.md)
