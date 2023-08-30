---
title: 'Quickstart: Create an Azure Front Door Standard/Premium - the Azure CLI'
description: Learn how to create an Azure Front Door Standard/Premium using Azure CLI. Use Azure Front Door to deliver content to your global user base and protect your web apps against vulnerabilities.
ms.topic: quickstart
author: duau
ms.author: duau
ms.service: frontdoor
ms.date: 6/30/2023
ms.custom: devx-track-azurecli
---

# Quickstart: Create an Azure Front Door Standard/Premium - Azure CLI

In this quickstart, you learn how to create an Azure Front Door Standard/Premium profile using  Azure CLI. You create this profile using two Web Apps as your origin, and add a WAF security policy. You can then verify connectivity to your Web Apps using the Azure Front Door endpoint hostname.

:::image type="content" source="media/quickstart-create-front-door/environment-diagram.png" alt-text="Diagram of Front Door deployment environment using the Azure CLI." border="false":::

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a resource group

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

Run [az group create](/cli/azure/group) to create resource groups.

```azurecli-interactive
az group create --name myRGFD --location centralus
```
## Create an Azure Front Door profile

In this step, you create the Azure Front Door profile that your two App services use as your origin.

Run [az afd profile create](/cli/azure/afd/profile#az-afd-profile-create) to create an Azure Front Door profile.

> [!NOTE]
> If you want to deploy Azure Front Door Standard instead of Premium substitute the value of the sku parameter with Standard_AzureFrontDoor. You won't be able to deploy managed rules with WAF Policy, if you choose Standard SKU. For detailed  comparison, view [Azure Front Door tier comparison](standard-premium/tier-comparison.md).

```azurecli-interactive
az afd profile create \
    --profile-name contosoafd \
    --resource-group myRGFD \
    --sku Premium_AzureFrontDoor
```

## Create two instances of a web app

In this step, you create two web app instances that run in different Azure regions for this tutorial. Both the web application instances run in Active/Active mode, so either one can service traffic. This configuration differs from an *Active/Stand-By* configuration, where one acts as a failover.

### Create app service plans

Before you can create the web apps you need two app service plans, one in *Central US* and the second in *East US*.

Run [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create&preserve-view=true) to create your app service plans.

```azurecli-interactive
az appservice plan create \
    --name myAppServicePlanCentralUS \
    --resource-group myRGFD \
    --location centralus
```
```azurecli-interactive
az appservice plan create \
    --name myAppServicePlanEastUS \
    --resource-group myRGFD \
    --location eastus
```

### Create web apps

Once the app service plans have been created, run [az webapp create](/cli/azure/webapp#az-webapp-create) to create a web app in each of the app service plans in the previous step. Web app names have to be globally unique.

```azurecli-interactive
az webapp create \
    --name WebAppContoso-01 \
    --resource-group myRGFD \
    --plan myAppServicePlanCentralUS
```
```azurecli-interactive
az webapp create \
    --name WebAppContoso-02 \
    --resource-group myRGFD \
    --plan myAppServicePlanEastUS
```

Make note of the default host name of each web app so you can define the backend addresses when you deploy the Front Door in the next step.

## Create an Azure Front Door

### Create a Front Door profile

Run [az afd profile create](/cli/azure/afd/profile#az-afd-profile-create) to create an Azure Front Door profile.

> [!NOTE]
> If you want to deploy an Azure Front Door Standard instead of Premium substitute the value for the sku parameter with `Standard_AzureFrontDoor`. You won't be able to deploy managed rules with WAF Policy, if you choose Standard SKU. For detailed comparison, view [Azure Front Door tier comparison](standard-premium/tier-comparison.md).

```azurecli-interactive
az afd profile create \
    --profile-name contosoafd \
    --resource-group myRGFD \
    --sku Premium_AzureFrontDoor
```
### Add an endpoint

In this step, you create an endpoint in your Front Door profile. In Front Door Standard/Premium, an *endpoint* is a logical grouping of one or more routes that are associated with domain names. Each endpoint is assigned a domain name by Front Door, and you can associate endpoints with custom domains by using routes. Front Door profiles can also contain multiple endpoints.

Run [az afd endpoint create](/cli/azure/afd/endpoint#az-afd-endpoint-create) to create an endpoint in your profile.

```azurecli-interactive
az afd endpoint create \
    --resource-group myRGFD \
    --endpoint-name contosofrontend \
    --profile-name contosoafd \
    --enabled-state Enabled
```

For more information about endpoints in Front Door, see [Endpoints in Azure Front Door](./endpoint.md).

### Create an origin group

Create an origin group that defines the traffic and expected responses for your app instances. Origin groups also define how origins get evaluated by health probes, which you can define in this step.

Run [az afd origin-group create](/cli/azure/afd/origin-group#az-afd-origin-group-create) to create an origin group that contains your two web apps.

```azurecli-interactive
az afd origin-group create \
    --resource-group myRGFD \
    --origin-group-name og \
    --profile-name contosoafd \
    --probe-request-type GET \
    --probe-protocol Http \
    --probe-interval-in-seconds 60 \
    --probe-path / \
    --sample-size 4 \
    --successful-samples-required 3 \
    --additional-latency-in-milliseconds 50
```

### Add an origin to the group

Add both of your app instances created earlier as origins to your new origin group. Origins in Front Door refer to applications that Front Door retrieves contents from when caching isn't enabled or when a cache gets missed.

Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to add your first app instance as an origin to your origin group.

```azurecli-interactive
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

Repeat this step and add your second app instances as an origin to your origin group.

```azurecli-interactive
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

For more information about origins, origin groups and health probes, see [Origins and origin groups in Azure Front Door](./origin.md)

### Add a route

Add a route to map the endpoint that you created earlier to the origin group. This route forwards requests from the endpoint to your origin group.

Run [az afd route create](/cli/azure/afd/route#az-afd-route-create) to map your endpoint to the origin group. 

```azurecli-interactive
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

To learn more about routes in Azure Front Door, see [Traffic routing methods to origin](./routing-methods.md).

## Create a new security policy

Azure Web Application Firewall (WAF) on Front Door provides centralized protection for your web applications, defending them against common exploits and vulnerabilities.

In this tutorial, you create a WAF policy that adds two managed rules. You can also create WAF policies with custom rules

### Create a WAF policy

Run [az network front-door waf-policy create](/cli/azure/network/front-door/waf-policy#az-network-front-door-waf-policy-create) to create a new WAF policy for your Front Door. This example creates a policy that is enabled and in prevention mode.

> [!NOTE]
> Managed rules will only work with Front Door Premium tier. You can opt for Standard tier to use onlu custom rules.
    
```azurecli-interactive
az network front-door waf-policy create \
    --name contosoWAF \
    --resource-group myRGFD \
    --sku Premium_AzureFrontDoor \
    --disabled false \
    --mode Prevention
```

> [!NOTE]
> If you select `Detection` mode, your WAF doesn't block any requests.

To learn more about WAF policy settings for Front Door, see [Policy settings for Web Application Firewall on Azure Front Door](../web-application-firewall/afds/waf-front-door-policy-settings.md).

### Assign managed rules to the WAF policy

Azure-managed rule sets provide an easy way to protect your application against common security threats.

Run [az network front-door waf-policy managed-rules add](/cli/azure/network/front-door/waf-policy/managed-rules#az-network-front-door-waf-policy-managed-rules-add) to add managed rules to your WAF Policy. This example adds Microsoft_DefaultRuleSet_1.2 and Microsoft_BotManagerRuleSet_1.0 to your policy.


```azurecli-interactive
az network front-door waf-policy managed-rules add \
    --policy-name contosoWAF \
    --resource-group myRGFD \
    --type Microsoft_DefaultRuleSet \
    --version 1.2 
```

```azurecli-interactive
az network front-door waf-policy managed-rules add \
    --policy-name contosoWAF \
    --resource-group myRGFD \
    --type Microsoft_BotManagerRuleSet \
    --version 1.0
```

To learn more about managed rules in Front Door, see [Web Application Firewall DRS rule groups and rules](../web-application-firewall/afds/waf-front-door-drs.md).

### Create the security policy

Now apply these two WAF policies to your Front Door by creating a security policy. This setting applies the Azure-managed rules to the endpoint that you defined earlier.

Run [az afd security-policy create](/cli/azure/afd/security-policy#az-afd-security-policy-create) to apply your WAF policy to the endpoint's default domain.

> [!NOTE]
> Substitute 'mysubscription' with your Azure Subscription ID in the domains and waf-policy parameters. Run [az account subscription list](/cli/azure/account/subscription#az-account-subscription-list) to get Subscription ID details.


```azurecli-interactive
az afd security-policy create \
    --resource-group myRGFD \
    --profile-name contosoafd \
    --security-policy-name contososecurity \
    --domains /subscriptions/mysubscription/resourcegroups/myRGFD/providers/Microsoft.Cdn/profiles/contosoafd/afdEndpoints/contosofrontend \
    --waf-policy /subscriptions/mysubscription/resourcegroups/myRGFD/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/contosoWAF
```

## Test the Front Door

When you create the Azure Front Door Standard/Premium profile, it takes a few minutes for the configuration to be deployed globally. Once completed, you can access the frontend host you created.

Run [az afd endpoint show](/cli/azure/afd/endpoint#az-afd-endpoint-show) to get the hostname of the Front Door endpoint.

```azurecli-interactive
az afd endpoint show --resource-group myRGFD --profile-name contosoafd --endpoint-name contosofrontend
```
In a browser, go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`. Your request automatically gets routed to the least latent Web App in the origin group.

:::image type="content" source="./media/create-front-door-portal/front-door-web-app-origin-success.png" alt-text="Screenshot of the message: Your web app is running and waiting for your content":::

To test instant global failover, we use the following steps:

1. Open a browser and go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`.

2. Stop one of the Web Apps by running [az webapp stop](/cli/azure/webapp#az-webapp-stop&preserve-view=true)

    ```azurecli-interactive
    az webapp stop --name WebAppContoso-01 --resource-group myRGFD
    ```

3. Refresh your browser. You should see the same information page.

> [!TIP]
> There is a little bit of delay for these actions. You might need to refresh again.

4. Find the other web app, and stop it as well.

    ```azurecli-interactive
    az webapp stop --name WebAppContoso-02 --resource-group myRGFD
    ```

5. Refresh your browser. This time, you should see an error message.

    :::image type="content" source="./media/create-front-door-portal/web-app-stopped-message.png" alt-text="Screenshot of the message: Both instances of the web app stopped":::


6. Restart one of the Web Apps by running [az webapp start](/cli/azure/webapp#az-webapp-start&preserve-view=true). Refresh your browser and the page go back to normal.

    ```azurecli-interactive
    az webapp start --name WebAppContoso-01 --resource-group myRGFD
    ```

## Clean up resources

When you don't need the resources for the Front Door, delete both resource groups. Deleting the resource groups also deletes the Front Door and all its related resources.

Run [az group delete](/cli/azure/group#az-group-delete&preserve-view=true):

```azurecli-interactive
az group delete --name myRGFD
```

## Next steps

Advance to the next article to learn how to add a custom domain to your Front Door.
> [!div class="nextstepaction"]
> [Add a custom domain](standard-premium/how-to-add-custom-domain.md)