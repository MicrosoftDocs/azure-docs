---
title: Set up a security policy for Azure Front Door with the Azure CLI
description: Learn how to create a security policy with Azure CLI that you can use to apply WAF policies and protect your web apps against vulnerabilities.
ms.topic: sample
author: duau
ms.author: duau
ms.service: frontdoor
ms.date: 10/14/2021
ms.custom: devx-track-azurecli

---

# Set up security for Azure Front Door with the Azure CLI

Many web applications have experienced a rapid increase of traffic in recent weeks because of COVID-19. These web applications are also experiencing a surge in malicious traffic, including denial-of-service attacks. There's an effective way to both scale out your application for traffic surges and protect yourself from attacks: configure Azure Front Door with Azure WAF as an acceleration, caching, and security layer in front of your web app.

We'll be using the Azure CLI to configure security for your Azure Front Door in this tutorial. You can accomplish the same thing by using the Azure portal, Azure PowerShell, Azure Resource Manager, or the Azure REST APIs.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> - Create a Front Door.
> - Create an Azure WAF policy.
> - Configure rule sets for a WAF policy.
> - Create a security policy to associate a WAF policy with Front Door.


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

Run [az network front-door create](/cli/azure/network/front-door#az_network_front_door_create) to create a basic Front Door with default load balancing settings, health probe, and routing rules.

```azurecli
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

## Create a WAF policy

Before you create your security policy, you'll need to run [az network front-door waf-policy create](/cli/azure/network/front-door/waf-policy#az_network_front_door_waf_policy_create) to create a WAF policy for one of your resource groups. Later, we'll create a security policy that applies your WAF policy to your endpoint's default domain and a custom domain.

Run [az afd security-policy create](/cli/azure/afd/security-policy#az_afd_security_policy_create) to create a security policy within an existing resource group. Use this policy to apply a WAF policy to an endpoint's default domain and to a custom domain.

1. Create a new Azure Front Door profile.
    
    ```azurecli
    az afd profile create --profile-name Contoso --resource-group ContosoAFD
    ```
2. Create a new WAF policy for your Front Door. This example creates a policy that's enabled and in prevention mode.
    
    ```azurecli
    az network front-door waf-policy create
    --name contosoWAF /
    --resource-group myRGFDCentral /
    --disabled false /
    --mode Prevention
    ```

    > [!NOTE]
    > If you select `Detection` mode, your WAF doesn't block any requests.

## Add and configure a WAF policy rule set

Adding a WAF policy managed rule set provides you with previously created rules. Once you've selected and added a rule set, you can configure the set to exclude or override a rule if necessary. Run [az network front-door waf-policy managed-rule-definition list](/cli/azure/network/front-door/waf-policy/managed-rule-definition) to see a list of available rule sets. Run [az network front-door waf-policy managed-rules add](/cli/azure/network/front-door/waf-policy/managed-rules) to add a rule set.

### Add a rule set

Add a WAF managed rule set to your WAF policy. This example uses the default rule set.

```azurecli
# Run the managed rule definition list command to see a list of available rule sets.
az network front-door waf-policy managed-rule-definition list
# Add a rule set to your WAF policy.
az network front-door waf-policy managed-rules add \
    --policy-name contosoWAF \
    --resource-group myRGFDCentral \
    --type DefaultRuleSet \
    --version preview-0.1
```

### Configure a rule set

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
    --value ValueName
```

To add an override to a rule set:

```azurecli
az network front-door waf-policy managed-rules override add \
    --policy-name contosoWAF \
    --resource-group myRGFDCentral \
    --rule-group-id 8125d145-ddc5-4d90-9bc3-24c5f2de69a2 \
    --rule-id 944300 \
    --type DefaultRuleSet \
    --action Allow \
    --disabled false
```

## Create and manage a security policy

Create an Azure Front Door security policy. This policy applies your WAF policy to your endpoint's default and custom domains.

### Create a security policy

Run [az afd security-policy create](/azure/afd/security-policy#az_afd_security_policy_create) to create a security policy within your resource group.

```azurecli
az afd security-policy create /
    --resource-group ContosoAFD /
    --profile-name Contoso /
    --security-policy-name contososp1 /
    --domains /subscriptions/contoso/resourcegroups/ContosoAFD/providers/Microsoft.Cdn/profiles/profile1/afdEndpoints/endpoint1 /subscriptions/contoso/resourcegroups/ContosoAFD/providers/Microsoft.Cdn/profiles/profile1/customDomains/customDomain1 /
    --waf-policy /subscriptions/contoso/resourcegroups/ContosoAFD/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/ContosoWAF /
```

The WAF policy is now applied to your domains.

### Manage your security policy

You might need to update your security policy with additional domains or WAF policies. Run [az afd security-policy show](/cli/azure/afd/security-policy#az_afd_security_policy_show) to get your existing security policy information, and then run [az afd security-policy update](/azure/afd/security-policy#az_afd_security_policy_update).

```azurecli
# Find the security policy details within your profile.
az afd security-policy show /
    --resource-group ContosoAFD /
    --profile-name Contoso /
    --security-policy-name contososp1
# Update your security policy as needed with new domains or WAF policies.
az afd security-policy update /
    --resource-group ContosoAFD /
    --security-policy-name contososp1 /
    --profile-name Contoso /
    --domains /subscriptions/contoso/resourcegroups/ContosoAFD/providers/Microsoft.Cdn/profiles/profile1/afdEndpoints/endpoint2 /subscriptions/contoso/resourcegroups/rg1/providers/Microsoft.Cdn/profiles/profile1/customDomains/customDomain2 /
```

## Next steps

> [!div class="nextstepaction"]
> [Create rules and rule sets](link to topic)