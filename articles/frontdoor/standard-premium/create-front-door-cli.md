---
title: Create an Azure Front Door Standard/Premium with the Azure CLI
description: Learn how to create an Azure Front Door Standard/Premium with Azure CLI. Use Azure Front Door to deliver content to your global user base and protect your web apps against vulnerabilities.
ms.topic: sample
author: duau
ms.author: duau
ms.service: frontdoor
ms.date: 12/30/2021
ms.custom: devx-track-azurecli

---

# Quickstart: Create an Azure Front Door Premium - Azure CLI

In this quickstart, you'll learn how to create an Azure Front Door Premium profile using  Azure CLI. You'll create this profile using two Web Apps as your origin, and add a WAF security policy. You can then verify connectivity to your Web Apps using the Azure Front Door endpoint hostname.

> [!NOTE]
> This documentation is for Azure Front Door Standard/Premium. Looking for information on Azure Front Door? View [Azure Front Door Docs](../front-door-overview.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../includes/azure-cli-prepare-your-environment.md)]

## Create a resource group

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

Run [az group create](/cli/azure/group) to create resource groups.

```azurecli
az group create --name myRGFD --location centralus
```
## Create an Azure Front Door profile

Run [az afd profile create](/cli/azure/afd/profile#az-afd-profile-create) to create an Azure Front Door profile.

> [!NOTE]
> If you want to deploy Azure Front Door Standard instead of Premium substitute the value of the sku parameter with Standard_AzureFrontDoor. You won't be able to deploy Managed Rules with WAF Policy, if you choose Standard SKU. For detailed  comparison, view [Azure Front Door tier comparison](./tier-comparison.md).

```azurecli
az afd profile create \
    --profile-name contosoafd \
    --resource-group myRGFD \
    --sku Premium_AzureFrontDoor
```

## Create two instances of a web app

You need two instances of a web application that run in different Azure regions for this tutorial. Both the web application instances run in Active/Active mode, so either one can service traffic.

If you don't already have a web app, use the following script to set up two example web apps.

### Create app service plans

Before you can create the web apps you'll need two app service plans, one in *Central US* and the second in *East US*.

Run [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create&preserve-view=true) to create your app service plans.

```azurecli
az appservice plan create \
    --name myAppServicePlanCentralUS \
    --resource-group myRGFD

az appservice plan create \
    --name myAppServicePlanEastUS \
    --resource-group myRGFD
```

### Create web apps

Run [az webapp create](/cli/azure/webapp#az-webapp-create&preserve-view=true) to create a web app in each of the app service plans in the previous step. Web app names have to be globally unique.

```azurecli
az webapp create \
    --name WebAppContoso-01 \
    --resource-group myRGFD \
    --plan myAppServicePlanCentralUS

az webapp create \
    --name WebAppContoso-02 \
    --resource-group myRGFD \
    --plan myAppServicePlanEastUS
```

Make note of the default host name of each web app so you can define the backend addresses when you deploy the Front Door in the next step.

## Add an endpoint

Run [az afd endpoint create](/cli/azure/afd/endpoint#az-afd-endpoint-create) to create an endpoint in your profile. You can create multiple endpoints in your profile after finishing the create experience.

```azurecli
az afd endpoint create \
    --resource-group myRGFD \
    --endpoint-name contosofrontend \
    --profile-name contosoafd \
    --enabled-state Enabled
```

## Create an origin group

Run [az afd origin-group create](/cli/azure/afd/origin-group#az-afd-origin-group-create) to create an origin group that contains your two web apps.

```azurecli
az afd origin-group create \
    --resource-group myRGFD \
    --origin-group-name og2 \
    --profile-name contosoafd \
    --probe-request-type GET \
    --probe-protocol Http \
    --probe-interval-in-seconds 60 \
    --probe-path / \
    --sample-size 4 \
    --successful-samples-required 3 \
    --additional-latency-in-milliseconds 50
```

## Add an origin to the group

Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to add an origin to your origin group.

```azurecli
az afd origin create \
    --resource-group myRGFD \
    --host-name webappcontoso-01.azurewebsites.net \
    --profile-name contosoafd \
    --origin-group-name og \
    --origin-name contoso1 \
    --origin-host-header webappcontoso-01.azurewebsites.net \
    --priority 1 \
    --weight 1000 \
    --enabled-state Enabled \
    --http-port 80 \
    --https-port 443
```

Repeat this step and add your second origin.

```azurecli
az afd origin create \
    --resource-group myRGFD \
    --host-name webappcontoso-02.azurewebsites.net \
    --profile-name contosoafd \
    --origin-group-name og \
    --origin-name contoso2 \
    --origin-host-header webappcontoso-02.azurewebsites.net \
    --priority 1 \
    --weight 1000 \
    --enabled-state Enabled \
    --http-port 80 \
    --https-port 443
```

## Add a route

Run [az afd route create](/cli/azure/afd/route#az-afd-route-create) to map your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.

```azurecli
az afd route create \
    --resource-group myRGFD \
    --profile-name contosoafd \
    --endpoint-name contosofrontend \
    --forwarding-protocol MatchRequest \
    --route-name route \
    --https-redirect Enabled \
    --origin-group og \
    --supported-protocols Http Https \
    --link-to-default-domain Enabled 
```

## Create a new security policy

### Create a WAF policy

Run [az network front-door waf-policy create](/cli/azure/network/front-door/waf-policy#az-network-front-door-waf-policy-create) to create a new WAF policy for your Front Door. This example creates a policy that is enabled and in prevention mode.

> [!NOTE]
> Managed rules will only work with Front Door Premium SKU. You can opt for Standard SKU below to use custom rules.
    
```azurecli
az network front-door waf-policy create \
    --name contosoWAF \
    --resource-group myRGFD \
    --sku Premium_AzureFrontDoor \
    --disabled false \
    --mode Prevention
```

> [!NOTE]
> If you select `Detection` mode, your WAF doesn't block any requests.

### Assign Managed Rules to the WAF Policy
Run [az network front-door waf-policy managed-rules add](/cli/azure/network/front-door/waf-policy/managed-rules#az-network-front-door-waf-policy-managed-rules-add) to add Managed Rules to your WAF Policy. This example adds Microsoft_DefaultRuleSet_1.2 and Microsoft_BotManagerRuleSet_1.0 to your policy.


```azurecli
az network front-door waf-policy managed-rules add \
    --policy-name contosoWAF \
    --resource-group myRGFD \
    --type Microsoft_DefaultRuleSet \
    --version 1.2 
```

```azurecli
az network front-door waf-policy managed-rules add \
    --policy-name contosoWAF \
    --resource-group myRGFD \
    --type Microsoft_BotManagerRuleSet \
    --version 1.0
```
### Create the security policy

Run [az afd security-policy create](/cli/azure/afd/security-policy#az-afd-security-policy-create) to apply your WAF policy to the endpoint's default domain.

> [!NOTE]
> Substitute 'mysubscription' with your Azure Subscription ID in the domains and waf-policy parameters below. Run [az account subscription list](/cli/azure/aaccount/subscription#az-account-subscription-list) to get Subscription ID details.


```azurecli
az afd security-policy create \
    --resource-group myRGFD \
    --profile-name contosoafd \
    --security-policy-name contososecurity \
    --domains /subscriptions/mysubscription/resourcegroups/myRGFD/providers/Microsoft.Cdn/profiles/contosoafd/afdEndpoints/contosofrontend \
    --waf-policy /subscriptions/mysubscription/resourcegroups/myRGFD/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/contosoWAF
```

## Verify Azure Front Door

When you create the Azure Front Door Standard/Premium profile, it takes a few minutes for the configuration to be deployed globally. Once completed, you can access the frontend host you created.

Run [az afd endpoint show](/cli/azure/afd/endpoint#az-afd-endpoint-show) to get the hostname of the Front Door endpoint.

```azurecli
az afd endpoint show --resource-group myRGFD --profile-name contosoafd --endpoint-name contosofrontend
```
In a browser, go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`. Your request will automatically get routed to the least latent Web App in the origin group.

:::image type="content" source="../media/create-front-door-portal/front-door-web-app-origin-success.png" alt-text="Your web app is running and waiting for your content":::

To test instant global failover, we'll use the following steps:

1. Open a browser, as described above, and go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`.

2. Stop one of the Web Apps by running [az webapp stop](/cli/azure/webapp#az-webapp-stop&preserve-view=true)
```azurecli
az webapp stop --name WebAppContoso-01 --resource-group myRGFD
```

4. Refresh your browser. You should see the same information page.

   >[!TIP]
   >There is a little bit of delay for these actions. You might need to refresh again.

5. Find the other web app, and stop it as well.

```azurecli
az webapp stop --name WebAppContoso-02 --resource-group myRGFD
```

6. Refresh your browser. This time, you should see an error message.

:::image type="content" source="../media/create-front-door-portal/web-app-stopped-message.png" alt-text="Both instances of the web app stopped":::


7. Restart one of the Web Apps by running [az webapp start](/cli/azure/webapp#az-webapp-start&preserve-view=true). Refresh your browser and the page will go back to normal.

```azurecli
az webapp start --name WebAppContoso-01 --resource-group myRGFD
```
## Clean up resources

When you don't need the resources for the Front Door, delete both resource groups. Deleting the resource groups also deletes the Front Door and all its related resources.

Run [az group delete](/cli/azure/group#az-group-delete&preserve-view=true):

```azurecli
az group delete \
    --name myRGFD
```

## Next steps

Advance to the next article to learn how to add a custom domain to your Front Door.
> [!div class="nextstepaction"]
> [Add a custom domain](how-to-add-custom-domain.md)
