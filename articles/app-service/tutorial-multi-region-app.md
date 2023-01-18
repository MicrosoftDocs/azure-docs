---
title: 'Tutorial: Create a multi-region app'
description: Learn how to use build a multi-region app on Azure App Service that can be used for high availability and fault tolerance.
keywords: azure app service, web app, multiregion, multi-region, multiple regions
author: seligj95

ms.topic: tutorial
ms.date: 1/20/2023
ms.author: jordanselig
---

# Tutorial: Create a highly available multi-region app in Azure App Service

High availability and fault tolerance are key components of a well-architected solution. It’s best to prepare for the unexpected by having an emergency plan that can shorten downtime and keep your systems up and running automatically when something fails.

When you deploy your application to the cloud, you choose a region in that cloud where your application infrastructure is based. If your application is deployed to a single region, and the region becomes unavailable, your application will also be unavailable. This lack of availability may be unacceptable under the terms of your application's SLA. If so, deploying your application and its services across multiple regions is a good solution. A multi-region deployment can use an active-active or active-passive configuration. An active-active configuration distributes requests across multiple active regions. An active-passive configuration keeps warm instances in the secondary region, but doesn't send traffic there unless the primary region fails. For multi-region deployments, you should deploy to [paired regions](../availability-zones/cross-region-replication-azure.md#azure-cross-region-replication-pairings-for-all-geographies). For more information on designing apps for high availability and fault tolerance, see [Architect Azure applications for resiliency and availability](../architecture/reliability/architect.md).

In tutorial, you'll learn how to deploy a highly available multi-region web app. This scenario will be kept simple by restricting the application components to just a web app and [Azure Front Door](../frontdoor/front-door-overview.md), but the concepts can be expanded and applied to other infrastructure patterns. For example, if your application connects to an Azure database offering or storage account, see [active geo-replication for SQL databases](../azure-sql/database/active-geo-replication-overview.md) and [redundancy options for storage accounts](../storage/common/storage-redundancy.md). For a reference architecture for a more detailed scenario, see [Highly available multi-region web application](..architecture/reference-architectures/app-service-web-app/multi-region.md).

:::image type="content" source="./media/tutorial-multi-region-app/multi-region-app-service.png" alt-text="Architecture diagram of a multi-region App Service.":::

With this architecture:

- Identical App Services are deployed in two separate regions.
- Public traffic directly to the App Services is blocked.
- Azure Front Door is used route traffic to the primary/active region, while the other region is a hot-standby.

What you will learn:

> [!div class="checklist"]
> * Create identical App Services in separate regions.
> * Create Azure Front Door with access restrictions that block public access to the App Services.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

To complete this tutorial:

[!INCLUDE [Azure-CLI-prepare-your-environment-no-header.md](~/articles/reusable-content/Azure-CLI/Azure-CLI-prepare-your-environment-no-header.md)]

## Create two instances of a web app

You'll need two instances of a web app that run in different Azure regions for this tutorial. You'll use the region pair East US/West US as your two regions and create two empty web apps. Feel free to choose you're own regions if needed.

To make management and clean-up simpler, you'll use a single resource group for all resources in this tutorial. Consider using separate resource groups for each region/resource to further isolate your resources in a disaster recovery situation.

Run the following command to create your resource group.

```azurecli-interactive
az group create --name myresourcegroup --location eastus
```

Run the following commands to create the App Service plans. Replace the placeholders for <app-service-plan-east-us> and <app-service-plan-west-us> with two unique names where you can easily identify the region they're in.

```azurecli-interactive
az appservice plan create --name <app-service-plan-east-us> --resource-group myresourcegroup --is-linux --location eastus
az appservice plan create --name <app-service-plan-west-us> --resource-group myresourcegroup --is-linux --location westus
```

Once the App Service plans are created, run the following commands to create the web apps. Replace the placeholders for <web-app-east-us> and <web-app-west-us> with two globally unique names (valid characters are `a-z`, `0-9`, and `-`) and be sure to pay attention to the `--plan` parameter so that you place one app in each plan (and therefore in each region).

```azurecli-interactive
az webapp create --name <web-app-east-us> --resource-group myresourcegroup --plan <app-service-plan-east-us>
az webapp create --name <web-app-west-us> --resource-group myresourcegroup --plan <app-service-plan-west-us>
```

Make note of the default hostname of each web app so you can define the backend addresses when you deploy the Front Door in the next step. It should be in the format `<web-app-name>.azurewebsites.net`. These hostnames can be found by running the following command or by navigating to the app's **Overview** page in the [Azure portal](https://portal.azure.com).

```azurecli-interactive
az webapp show --name <web-app-name> --resource-group myresourcegroup --query "hostNames"
```

## Create an Azure Front Door

### Create an Azure Front Door profile

You'll now create an [Azure Front Door Premium](../frontdoor/front-door-overview.md) to route traffic to your apps. 

Run [az afd profile create](/cli/azure/afd/profile#az-afd-profile-create) to create an Azure Front Door profile.

> [!NOTE]
> If you want to deploy Azure Front Door Standard instead of Premium, substitute the value of the `--sku` parameter with Standard_AzureFrontDoor. You won't be able to deploy managed rules with WAF Policy if you choose the Standard SKU. For a detailed comparison of the SKUs, see [Azure Front Door tier comparison](../frontdoor/standard-premium/tier-comparison.md).

```azurecli-interactive
az afd profile create --profile-name myfrontdoorprofile --resource-group myresourcegroup --sku Premium_AzureFrontDoor
```

### Add an endpoint

Run [az afd endpoint create](/cli/azure/afd/endpoint#az-afd-endpoint-create) to create an endpoint in your profile. You can create multiple endpoints in your profile after finishing the create experience.

```azurecli-interactive
az afd endpoint create --resource-group myresourcegroup --endpoint-name myendpoint --profile-name myfrontdoorprofile --enabled-state Enabled
```

### Create an origin group

Run [az afd origin-group create](/cli/azure/afd/origin-group#az-afd-origin-group-create) to create an origin group that contains your two web apps.

```azurecli-interactive
az afd origin-group create --resource-group myresourcegroup --origin-group-name myorigingroup --profile-name myfrontdoorprofile --probe-request-type GET --probe-protocol Http --probe-interval-in-seconds 60 --probe-path / --sample-size 4 --successful-samples-required 3 --additional-latency-in-milliseconds 50
```

### Add an origin to the group

Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to add an origin to your origin group. For the `--hostname` parameter, replace the placeholder for <web-app-east-us> with your app name in that region.

```azurecli-interactive
az afd origin create --resource-group myresourcegroup --host-name <web-app-east-us>.azurewebsites.net --profile-name myfrontdoorprofile --origin-group-name myorigingroup --origin-name primaryapp --origin-host-header <web-app-east-us>.azurewebsites.net --priority 1 --weight 1000 --enabled-state Enabled --http-port 80 --https-port 443
```

Repeat this step to add your second origin. Pay attention to the `--priority` parameter. For this origin, it's set to "2". This priority setting tells Azure Front Door to direct all traffic to the primary origin unless the primary goes down.

```azurecli-interactive
az afd origin create --resource-group myresourcegroup --host-name <web-app-west-us>.azurewebsites.net --profile-name myfrontdoorprofile --origin-group-name myorigingroup --origin-name secondaryapp --origin-host-header <web-app-west-us>.azurewebsites.net --priority 2 --weight 1000 --enabled-state Enabled --http-port 80 --https-port 443
```

### Add a route

Run [az afd route create](/cli/azure/afd/route#az-afd-route-create) to map your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.

```azurecli-interactive
az afd route create --resource-group myresourcegroup --profile-name myfrontdoorprofile --endpoint-name myendpoint --forwarding-protocol MatchRequest --route-name route --https-redirect Enabled --origin-group myorigingroup --supported-protocols Http Https --link-to-default-domain Enabled 
```

At this point, after about 15 minutes, your Azure Front Door will be fully functional.

### Restrict access to web apps to the Azure Front Door instance

If you try to access your apps directly using their URLs, you'll still be able to. To ensure traffic can only reach your apps through Azure Front Door, you'll set access restrictions on each of your apps. Traffic from Azure Front Door to your application originates from a well known set of IP ranges defined in the AzureFrontDoor.Backend service tag. By using a service tag restriction rule, you can [restrict traffic to only originate from Azure Front Door](../frontdoor/origin-security.md).

Before setting up the App Service access restrictions, take note of the *Front Door ID* by running the following command. This ID will be needed to ensure traffic only originates from your specific Front Door instance by further filtering the incoming requests based on the unique http header that your Azure Front Door sends.

```azurecli-interactive
az afd profile show --resource-group myresourcegroup --profile-name myfrontdoorprofile --query "frontDoorId"
```

Run the following commands to set the access restrictions on your web apps. Replace the placeholder for <front-door-id> with the result from the previous command. Replace the placeholders for the app names.

```azurecli-interactive
az webapp config access-restriction add --resource-groupg myresourcegroup -n <web-app-east-us> --priority 100 --service-tag AzureFrontDoor.Backend --http-header x-azure-fdid=<front-door-id>
az webapp config access-restriction add --resource-groupg myresourcegroup -n <web-app-west-us> --priority 100 --service-tag AzureFrontDoor.Backend --http-header x-azure-fdid=<front-door-id>
```

## Test the Front Door

When you create the Azure Front Door Standard/Premium profile, it takes a few minutes for the configuration to be deployed globally. Once completed, you can access the frontend host you created.

Run [az afd endpoint show](/cli/azure/afd/endpoint#az-afd-endpoint-show) to get the hostname of the Front Door endpoint.

```azurecli-interactive
az afd endpoint show --resource-group myresourcegroup --profile-name myfrontdoorprofile --endpoint-name myendpoint --query "hostName"
```

In a browser, go to the endpoint hostname that the previous command returned: `<myendpoint>-<hash>.z01.azurefd.net`. Your request will automatically get routed to the primary app in East US.

To test instant global failover:

1. Open a browser and go to the endpoint hostname: `<myendpoint>-<hash>.z01.azurefd.net`.
1. Stop the primary app by running [az webapp stop](/cli/azure/webapp#az-webapp-stop&preserve-view=true)

    ```azurecli-interactive
    az webapp stop --name <web-app-east-us> --resource-group myresourcegroup
    ```

1. Refresh your browser. You should see the same information page because traffic is now directed to the running app in West US.

> [!TIP]
> You might need to refresh the page a couple times as failover may take a couple seconds.

1. Now stop the secondary app.

    ```azurecli-interactive
    az webapp stop --name <web-app-west-us> --resource-group myresourcegroup
    ```

1. Refresh your browser. This time, you should see an error message.

    :::image type="content" source="../frontdoor/media/create-front-door-portal/web-app-stopped-message.png" alt-text="Screenshot of the message: Both instances of the web app stopped":::

1. Restart one of the Web Apps by running [az webapp start](/cli/azure/webapp#az-webapp-start&preserve-view=true). Refresh your browser and you should see the app again.

    ```azurecli-interactive
    az webapp start --name <web-app-east-us> --resource-group myresourcegroup
    ```

You've now validated that you can access your apps through Azure Front Door and that failover functions as intended. 

To test your access restrictions and ensure your apps can only be reached through Azure Front Door, open a browser and navigate to each of your app's URLs. To find the URLs, run the following commands:

```azurecli-interactive
az webapp show --name <web-app-east-us> --resource-group myresourcegroup --query "hostNames"
az webapp show --name <web-app-west-us> --resource-group myresourcegroup --query "hostNames"
```

You should see an error page indicating that the apps aren't accessible.

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name myresourcegroup
```

This command may take a few minutes to run.

## Next steps

recommendations and best practices from blog post
bicep template
link to blog - https://azure.github.io/AppService/2022/12/02/multi-region-web-app.html