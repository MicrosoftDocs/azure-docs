---
title: 'Quickstart: Create an Azure Front Door using Azure CLI'
description: Learn how to create an Azure Front Door using Azure CLI. Use Azure Front Door to deliver content to your global user base and protect your web apps against vulnerabilities.
ms.topic: quickstart
author: duongau
ms.author: duau
ms.service: azure-frontdoor
ms.date: 11/18/2024
ms.custom: devx-track-azurecli
---

# Quickstart: Create an Azure Front Door using Azure CLI

In this quickstart, you learn how to create an Azure Front Door using Azure CLI. You set up a profile with two Azure Web Apps as origins and add a WAF security policy. Finally, you verify connectivity to your Web Apps using the Azure Front Door endpoint hostname.

:::image type="content" source="media/quickstart-create-front-door/environment-diagram.png" alt-text="Diagram of Azure Front Door deployment environment using the Azure CLI." border="false":::

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a resource group

In Azure, related resources are allocated to a resource group. You can use an existing resource group or create a new one.

Run [az group create](/cli/azure/group) to create a resource group.

```azurecli-interactive
az group create --name myRGFD --location centralus
```

## Create an Azure Front Door profile

Next, create the Azure Front Door profile that your two App Services uses as origins.

Run [az afd profile create](/cli/azure/afd/profile#az-afd-profile-create) to create an Azure Front Door profile.

> [!NOTE]
> If you want to deploy Azure Front Door Standard instead of Premium, substitute the value of the sku parameter with `Standard_AzureFrontDoor`. Managed rules with WAF Policy are not available with the Standard SKU. For a detailed comparison, see [Azure Front Door tier comparison](standard-premium/tier-comparison.md).

```azurecli-interactive
az afd profile create \
    --profile-name contosoafd \
    --resource-group myRGFD \
    --sku Premium_AzureFrontDoor
```

## Create two instances of a web app

In this step, you create two web app instances running in different Azure regions. Both instances operate in Active/Active mode, meaning either can handle traffic. This setup is different from an Active/Stand-By configuration, where one instance serves as a failover.

### Create app service plans

First, create two app service plans: one in *Central US* and another in *East US*.

Run the following commands to create the app service plans:

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

Next, create a web app in each of the app service plans created in the previous step. Web app names must be globally unique.

Run the following commands to create the web apps:

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

Make a note of the default host names for each web app, as you'll need them to define the backend addresses when deploying the Azure Front Door in the next step.

## Create an Azure Front Door

### Create an Azure Front Door profile

Run [az afd profile create](/cli/azure/afd/profile#az-afd-profile-create) to create an Azure Front Door profile.

> [!NOTE]
> To deploy an Azure Front Door Standard instead of Premium, set the `sku` parameter to `Standard_AzureFrontDoor`. Managed rules with WAF Policy are not available with the Standard SKU. For a detailed comparison, see [Azure Front Door tier comparison](standard-premium/tier-comparison.md).

```azurecli-interactive
az afd profile create \
    --profile-name contosoafd \
    --resource-group myRGFD \
    --sku Premium_AzureFrontDoor
```

### Add an endpoint

Create an endpoint in your Azure Front Door profile. An *endpoint* is a logical grouping of one or more routes associated with domain names. Each endpoint is assigned a domain name by Azure Front Door, and you can associate endpoints with custom domains using routes. Azure Front Door profiles can contain multiple endpoints.

Run [az afd endpoint create](/cli/azure/afd/endpoint#az-afd-endpoint-create) to create an endpoint in your profile.

```azurecli-interactive
az afd endpoint create \
    --resource-group myRGFD \
    --endpoint-name contosofrontend \
    --profile-name contosoafd \
    --enabled-state Enabled
```

For more information about endpoints in Azure Front Door, see [Endpoints in Azure Front Door](./endpoint.md).

### Create an origin group

Create an origin group that defines the traffic and expected responses for your app instances. Origin groups also define how origins get evaluated by health probes.

Run [az afd origin-group create](/cli/azure/afd/origin-group#az-afd-origin-group-create) to create an origin group containing your two web apps.

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

### Add origins to the origin group

Add both of your app instances created earlier as origins to your new origin group. Origins in Azure Front Door refer to applications that Azure Front Door retrieves content from when caching isn't enabled or when a cache miss occurs.

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

Repeat this step to add your second app instance as an origin to your origin group.

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

For more information about origins, origin groups, and health probes, see [Origins and origin groups in Azure Front Door](./origin.md).

### Add a route

Add a route to map the endpoint you created earlier to the origin group. This route forwards requests from the endpoint to your origin group.

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

Azure Web Application Firewall (WAF) on Azure Front Door provides centralized protection for your web applications, defending them against common exploits and vulnerabilities.

In this tutorial, you create a WAF policy that includes two managed rules. You can also create WAF policies with custom rules.

### Create a WAF policy

Run [az network front-door waf-policy create](/cli/azure/network/front-door/waf-policy#az-network-front-door-waf-policy-create) to create a new WAF policy for your Azure Front Door. This example creates a policy that is enabled and in prevention mode.

> [!NOTE]
> Managed rules are only available with the Azure Front Door Premium tier. You can use custom rules with the Standard tier.

```azurecli-interactive
az network front-door waf-policy create \
    --name contosoWAF \
    --resource-group myRGFD \
    --sku Premium_AzureFrontDoor \
    --disabled false \
    --mode Prevention
```

> [!NOTE]
> If you select `Detection` mode, your WAF will not block any requests.

To learn more about WAF policy settings for Azure Front Door, see [Policy settings for Web Application Firewall on Azure Front Door](../web-application-firewall/afds/waf-front-door-policy-settings.md).

### Assign managed rules to the WAF policy

Azure-managed rule sets provide an easy way to protect your application against common security threats.

Run [az network front-door waf-policy managed-rules add](/cli/azure/network/front-door/waf-policy/managed-rules#az-network-front-door-waf-policy-managed-rules-add) to add managed rules to your WAF Policy. This example adds Microsoft_DefaultRuleSet_2.1 and Microsoft_BotManagerRuleSet_1.0 to your policy.

```azurecli-interactive
az network front-door waf-policy managed-rules add \
    --policy-name contosoWAF \
    --resource-group myRGFD \
    --type Microsoft_DefaultRuleSet \
    --action Block \
    --version 2.1 
```

```azurecli-interactive
az network front-door waf-policy managed-rules add \
    --policy-name contosoWAF \
    --resource-group myRGFD \
    --type Microsoft_BotManagerRuleSet \
    --version 1.0
```

To learn more about managed rules in Azure Front Door, see [Web Application Firewall DRS rule groups and rules](../web-application-firewall/afds/waf-front-door-drs.md).

### Apply the security policy

Now, apply the WAF policies to your Azure Front Door by creating a security policy. This setting applies the Azure-managed rules to the endpoint you defined earlier.

Run [az afd security-policy create](/cli/azure/afd/security-policy#az-afd-security-policy-create) to apply your WAF policy to the endpoint's default domain.

> [!NOTE]
> Replace 'mysubscription' with your Azure Subscription ID in the domains and waf-policy parameters. Run [az account subscription list](/cli/azure/account/subscription#az-account-subscription-list) to get Subscription ID details.

```azurecli-interactive
az afd security-policy create \
    --resource-group myRGFD \
    --profile-name contosoafd \
    --security-policy-name contososecurity \
    --domains /subscriptions/mysubscription/resourcegroups/myRGFD/providers/Microsoft.Cdn/profiles/contosoafd/afdEndpoints/contosofrontend \
    --waf-policy /subscriptions/mysubscription/resourcegroups/myRGFD/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/contosoWAF
```

## Test the Azure Front Door

After you create the Azure Front Door profile, it takes a few minutes for the configuration to be deployed globally. Once completed, you can access the frontend host you created.

Run [az afd endpoint show](/cli/azure/afd/endpoint#az-afd-endpoint-show) to get the hostname of the Azure Front Door endpoint.

```azurecli-interactive
az afd endpoint show --resource-group myRGFD --profile-name contosoafd --endpoint-name contosofrontend
```

In a browser, go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`. Your request is routed to the least latent Web App in the origin group.

:::image type="content" source="./media/create-front-door-portal/front-door-web-app-origin-success.png" alt-text="Screenshot of the message: Your web app is running and waiting for your content":::

To test instant global failover, follow these steps:

1. Open a browser and go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`.

2. Stop one of the Web Apps by running [az webapp stop](/cli/azure/webapp#az-webapp-stop&preserve-view=true):

    ```azurecli-interactive
    az webapp stop --name WebAppContoso-01 --resource-group myRGFD
    ```

3. Refresh your browser. You should see the same information page.

> [!TIP]
> There might be a slight delay for these actions. You may need to refresh again.

4. Stop the other web app as well:

    ```azurecli-interactive
    az webapp stop --name WebAppContoso-02 --resource-group myRGFD
    ```

5. Refresh your browser. This time, you should see an error message.

    :::image type="content" source="./media/create-front-door-portal/web-app-stopped-message.png" alt-text="Screenshot of the message: Both instances of the web app stopped":::

6. Restart one of the Web Apps by running [az webapp start](/cli/azure/webapp#az-webapp-start&preserve-view=true). Refresh your browser, and the page should return to normal.

    ```azurecli-interactive
    az webapp start --name WebAppContoso-01 --resource-group myRGFD
    ```

## Clean up resources

When you no longer need the resources created for the Azure Front Door, you can delete the resource group. This action removes the Azure Front Door and all associated resources.

Run the following command to delete the resource group:

```azurecli-interactive
az group delete --name myRGFD
```

## Next steps

Proceed to the next article to learn how to add a custom domain to your Azure Front Door.
> [!div class="nextstepaction"]
> [Add a custom domain](standard-premium/how-to-add-custom-domain.md)
