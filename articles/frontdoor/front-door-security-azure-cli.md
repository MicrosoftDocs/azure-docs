---
title: Create an Azure Front Door with the Azure CLI
description: Learn how to create an Azure Front Door with basic security and custom rules with the Azure CLI that you can use to protect your web apps against vulnerabilities.
ms.topic: sample
author: duau
ms.author: duau
ms.service: frontdoor
ms.date: 10/14/2021
ms.custom: devx-track-azurecli

---

# Create an Azure Front Door with security and custom rules with the Azure CLI

Many web applications have experienced a rapid increase of traffic in recent weeks because of COVID-19. These web applications are also experiencing a surge in malicious traffic, including denial-of-service attacks. There's an effective way to both scale out your application for traffic surges and protect yourself from attacks: configure Azure Front Door with Azure WAF as an acceleration, caching, and security layer in front of your web app.

We'll be using the Azure CLI for your Azure Front Door configuration in this tutorial. You can accomplish the same thing by using the Azure portal, Azure PowerShell, Azure Resource Manager, or the Azure REST APIs.

> [!NOTE]
> This article is for Azure Front Door (Classic). These instructions do not work for Azure Front Door Standard/Premium (Preview).

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> - Create a Front Door.
> - Create an Azure WAF policy.
> - Associate a WAF policy with Front Door.
> - Configure rule sets for a WAF policy.
> - Create custom rules.


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../includes/azure-cli-prepare-your-environment.md)]

## Create a Front Door

### Create a resource group

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

For this tutorial, you need two resource groups. One in *Central US* and the second in *South Central US*.

Create a resource group with [az group create](/cli/azure/group#az_group_create):

```azurecli
az group create \
    --name myRGFDCentral \
    --location centralus

az group create \
    --name myRGFDEast \
    --location eastus
```


### Create two instances of a web app

Two instances of a web application that run in different Azure regions is required for this quickstart. Both the web application instances run in Active/Active mode, so either one can service traffic.

If you don't already have a web app, use the following script to set up two example web apps.

#### Create app service plans

Before you can create the web apps you will need two app service plans, one in *Central US* and the second in *East US*.

Create app service plans with [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create&preserve-view=true):

```azurecli
az appservice plan create \
    --name myAppServicePlanCentralUS \
    --resource-group myRGFDCentral

az appservice plan create \
    --name myAppServicePlanEastUS \
    --resource-group myRGFDEast
```

#### Create web apps

Running the following commands will create a web app in each of the app service plans in the previous step. Web app names have to be globally unique.

Create web app with [az webapp create](/cli/azure/webapp#az_webapp_create&preserve-view=true):

```azurecli
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

### Create the Front Door

Run [az network front-door create](/cli/azure/network/front-door#az_network_front_door_create) to create a basic Front Door with default load balancing settings, health probe, and routing rules. It also creates a default backend pool.

1. Create your Front Door.

    ```azurecli
    az network front-door create \
        --resource-group myRGFDCentral \
        --name contoso-frontend \
        --backend-address webappcontoso-1.azurewebsites.net 
    ```

Once the deployment has successfully completed, make note of the host name in the *frontEndpoints* section.

2. Run [az network front-door backend-pool backend add](/cli/azure/network/front-door/backend-pool/backend#az_network_front_door_backend_pool_backend_add) to add the second backend address to the backend pool.

```azurecli
az network front-door backend-pool backend add \
    --address webappcontoso-2.azurewebsites.net \
    --front-door-name contoso-frontend \
    --pool-name DefaultBackendPool \
    --resource-group myRGFDCentral
```

## Test the Front Door

Open a web browser and enter the hostname obtained from the commands. The Front Door will direct your request to one of the backend resources.

:::image type="content" source="./media/quickstart-create-front-door-cli/front-door-testing-page.png" alt-text="Front Door testing page":::

## Create a WAF policy

Run [az network front-door waf-policy create](/cli/azure/network/front-door/waf-policy#az_network_front_door_waf_policy_create) to create a WAF policy for one of your resource groups.

Create a new WAF policy for your Front Door. This example creates a policy that's enabled and in prevention mode.
    
```azurecli
az network front-door waf-policy create
    --name contosoWAF /
    --resource-group myRGFDCentral /
    --disabled false /
    --mode Prevention
```

    > [!NOTE]
    > If you select `Detection` mode, your WAF doesn't block any requests.

## Add and configure a managed WAF policy rule set

Adding a WAF policy managed rule set provides you with previously created security rules. Once you've selected and added a rule set, you can configure the set to exclude or override a rule if necessary. Run [az network front-door waf-policy managed-rule-definition list](/cli/azure/network/front-door/waf-policy/managed-rule-definition) to see a list of available rule sets. Run [az network front-door waf-policy managed-rules add](/cli/azure/network/front-door/waf-policy/managed-rules) to add a rule set.

### Add a managed rule set

Add a WAF managed rule set to your WAF policy. This example uses the default rule set.

```azurecli
# Run the managed rule definition list command to see a list of available rule sets.
az network front-door waf-policy managed-rule-definition list
# Add a rule set to your WAF policy.
az network front-door waf-policy managed-rules add \
    --policy-name contosoWAF \
    --resource-group myRGFDCentral \
    --type DefaultRuleSet \
    --version 1.0
```

### Configure the managed rule set

If there are specific rules within a set that you want to adjust, run the [az network front-door waf-policy managed-rules exclusion](/cli/azure/network/front-door/waf-policy/managed-rules/exclusion) and [az network front-door waf-policy managed-rules override](/cli/azure/network/front-door/waf-policy/managed-rules/override) commands.

- **Exclusions** prevent the rule set, rule group, or rule from being applied to the content of the specified variable.
- **Overrides** are used to override a rule or rule set in a WAF policy. They can also enable or disable specific actions like **Allow** and **Redirect**.

To add an exclusion to a rule set:

```azurecli
az network front-door waf-policy managed-rules exclusion add \
    --match-variable RequestHeaderNames \
    --operator StartsWith \
    --policy-name contosoWAF \
    --resource-group myRGFDCentral \
    --type DefaultRuleSet \
    --value {ValueName}
```

To add an override to a rule set:

```azurecli
az network front-door waf-policy managed-rules override add \
    --policy-name contosoWAF \
    --resource-group myRGFDCentral \
    --rule-group-id JAVA
    --rule-id 944250 \
    --type DefaultRuleSet \
    --action Allow \
    --disabled false
```

## Associate the WAF policy with the Front Door resource

Associate the WAF policy you created with the Azure Front Door resource that's in front of your web application.

```azurecli
az network front-door update 
    --name contoso-frontend \ 
    --resource-group myRGFDCentral \ 
    --set frontendEndpoints[0].webApplicationFirewallPolicyLink='{"id":"/subscriptions/contoso/resourcegroups/myRGFDCentral/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/contosoWAF"}'
```


