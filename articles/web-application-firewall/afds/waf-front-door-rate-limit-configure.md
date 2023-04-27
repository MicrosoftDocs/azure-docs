---
title: Configure WAF rate limit rule for Front Door
description: Learn how to configure a rate limit rule for an existing Front Door endpoint.
author: vhorne
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 10/05/2022
ms.author: victorh 
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-bicep
zone_pivot_groups: web-application-firewall-configuration
---

# Configure a Web Application Firewall rate limit rule

The Azure Web Application Firewall (WAF) rate limit rule for Azure Front Door controls the number of requests allowed from a particular socket IP address to the application during a rate limit duration. For more information about rate limiting, see [What is rate limiting for Azure Front Door Service?](waf-front-door-rate-limit.md).

This article shows how to configure a WAF rate limit rule on Azure Front Door Standard and Premium tiers.

::: zone pivot="portal,powershell,cli"

## Scenario

Suppose you're responsible for a public website. You've just added a page with information about a promotion your organization is running. You're concerned that, if clients visit that page too often, some of your backend services might not scale quickly and the application might have performance issues.

You decide to create a rate limiting rule that restricts each socket IP address to a maximum of 1000 requests per minute. You'll only apply this rule to requests that contain `*/promo*` in the request URL.

> [!TIP]
> If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

::: zone-end

::: zone pivot="portal"

## Create a Front Door profile and WAF policy

1. On the Azure portal home page, select **Create a resource**.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/create-resource.png" alt-text="Screenshot of the Azure portal showing the 'Create a resource' button on the home page." :::

1. Search for **Front Door**, and select **Front Door and CDN profiles**.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/create-front-door.png" alt-text="Screenshot of the Azure portal showing the marketplace, with Front Door highlighted." :::

1. Select **Create**.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/create-front-door-2.png" alt-text="Screenshot of the Azure portal showing the marketplace and Front Door, with the create button highlighted." :::

1. Select **Continue to create a Front Door** to use the *quick create* portal creation process.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/quick-create.png" alt-text="Screenshot of the Azure portal showing the Front Door offerings, with the 'Quick create' option selected and the 'Continue to create a Front Door' button highlighted." :::

1. Enter the information required on the *Basics* page:

   - **Resource group:** Select an existing resource group, or create a new resource group for the Front Door and WAF resources.
   - **Name:** Enter the name of your Front Door profile.
   - **Tier:** Select *Standard* or *Premium*. For this scenario, both tiers support rate limiting.
   - **Endpoint name:** Front Door endpoints must have globally unique names, so provide a unique name for your endpoint.
   - **Origin type** and **Origin host name:** Select the origin application that you want to protect with your rate limiting rule.

1. Next to **WAF policy**, select **Create new**.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/front-door-waf-policy-create.png" alt-text="Screenshot of the Azure portal showing the Front Door creation workflow, with the WAF policy 'Create new' button highlighted." :::

1. Enter the name of a WAF policy and select **Create**.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/waf-policy-create.png" alt-text="Screenshot of the Azure portal showing the WAF policy creation prompt, with the 'Create' button highlighted." :::

1. Select **Review + create**, then select **Create**.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/front-door-create.png" alt-text="Screenshot of the Azure portal showing the completed Front Door profile configuration." :::

1. After the deployment is finished, select **Go to resource**.

## Create a rate limit rule

1. Select **Custom rules** > **Add custom rule**.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/custom-rule-add.png" alt-text="Screenshot of the Azure portal showing the WAF policy's custom rules page." :::

1. Enter the information required to create a rate limiting rule:

   - **Custom rule name:** Enter the name of the custom rule, such as *rateLimitRule*.
   - **Rule type:** Rate limit
   - **Priority:** Enter the priority of the rule, such as *1*.
   - **Rate limit duration:** 1 minute
   - **Rate limit threshold (requests):** 1000

1. In **Conditions**, enter the information required to specify a match condition to identify requests where the URL contains the string */promo*:

   - **Match type:** String
   - **Match variable:** RequestUri
   - **Operation:** Is
   - **Operator:** Contains
   - **Match values:** */promo*

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/custom-rule.png" alt-text="Screenshot of the Azure portal showing the custom rule configuration." :::

1. Select **Add**.

1. Select **Save**.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/custom-rule-save.png" alt-text="Screenshot of the Azure portal showing the custom rule list, including the new rate limiting rule." :::

## Use prevention mode on the WAF

By default, the Azure portal creates WAF policies in detection mode. This setting means that the WAF won't block requests. For more information, see [WAF modes](afds-overview.md#waf-modes).

It's a good practice to [tune your WAF](waf-front-door-tuning.md) before using prevention mode, to avoid false positive detections and your WAF blocking legitimate requests.

Here, you reconfigure the WAF to use prevention mode.

1. Open the WAF policy.

   Notice that the *Policy mode* is *Detection*.

   :::image type="content" source="../media/waf-front-door-rate-limit-configure/waf-policy-mode.png" alt-text="Screenshot of the Azure portal showing the WAF policy, with the policy mode and 'Switch to prevention mode' button highlighted." :::

1. Select **Switch to prevention mode**.

::: zone-end

::: zone pivot="powershell"

## Prerequisites

Before you begin to set up a rate limit policy, set up your PowerShell environment and create a Front Door profile.

### Set up your PowerShell environment

Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) model for managing your Azure resources. 

You can install [Azure PowerShell](/powershell/azure/) on your local machine and use it in any PowerShell session. Here you sign in with your Azure credentials and install the Azure PowerShell module for Front Door Standard/Premium.

#### Connect to Azure with an interactive dialog for sign-in

Sign in to Azure by running the following command:

```azurepowershell
Connect-AzAccount
```

#### Install PowerShellGet

Ensure that current version of PowerShellGet is installed. Run the following command:

```azurepowershell
Install-Module PowerShellGet -Force -AllowClobber
``` 

Then, restart PowerShell to ensure you use the latest version.

#### Install the Front Door PowerShell modules

Install the *Az.FrontDoor* and *Az.Cdn* PowerShell modules to work with Front Door Standard/Premium from PowerShell:

```azurepowershell
Install-Module -Name Az.FrontDoor
Install-Module -Name Az.Cdn
```

You use the *Az.Cdn* module to work with Front Door Standard/Premium resources, and you use the *Az.FrontDoor* module to work with WAF resources.

### Create a resource group

Use the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a new resource group for your Front Door profile and WAF policy. Update the resource group name and location for your own requirements:

```azurepowershell
$resourceGroupName = 'FrontDoorRateLimit'

New-AzResourceGroup -Name $resourceGroupName -Location 'westus'
```

### Create a Front Door profile

Use the [New-AzFrontDoorCdnProfile](/powershell/module/az.cdn/new-azfrontdoorcdnprofile) cmdlet to create a new Front Door profile.

In this example, you create a Front Door standard profile named *MyFrontDoorProfile*:

```azurepowershell
$frontDoorProfile = New-AzFrontDoorCdnProfile `
  -Name 'MyFrontDoorProfile' `
  -ResourceGroupName $resourceGroupName `
  -Location global `
  -SkuName Standard_AzureFrontDoor
```

### Create a Front Door endpoint

Use the [New-AzFrontDoorCdnEndpoint](/powershell/module/az.cdn/new-azfrontdoorcdnendpoint) cmdlet to add an endpoint to your Front Door profile.

Front Door endpoints must have globally unique names, so update the value of the `$frontDoorEndpointName` variable to something unique.

```azurepowershell
$frontDoorEndpointName = '<unique-front-door-endpoint-name>'

$frontDoorEndpoint = New-AzFrontDoorCdnEndpoint `
  -EndpointName $frontDoorEndpointName `
  -ProfileName $frontDoorProfile.Name `
  -ResourceGroupName $frontDoorProfile.ResourceGroupName `
  -Location $frontDoorProfile.Location
```

## Define a URL match condition

Use the [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject) cmdlet to create a match condition, to identify requests that should have the rate limit applied.

The following example matches requests where the *RequestUri* variable contains the string */promo*:

```azurepowershell
$promoMatchCondition = New-AzFrontDoorWafMatchConditionObject `
  -MatchVariable RequestUri `
  -OperatorProperty Contains `
  -MatchValue '/promo'
```

## Create a custom rate limit rule

Use the [New-AzFrontDoorWafCustomRuleObject](/powershell/module/az.frontdoor/new-azfrontdoorwafcustomruleobject) cmdlet to create the rate limit rule, which includes the match condition you defined in the previous step as well as the rate limit request threshold.

The following example sets the limit to 1000:

```azurepowershell
$promoRateLimitRule = New-AzFrontDoorWafCustomRuleObject `
  -Name 'rateLimitRule' `
  -RuleType RateLimitRule `
  -MatchCondition $promoMatchCondition `
  -RateLimitThreshold 1000 `
  -Action Block `
  -Priority 1
```

When any socket IP address sends more than 1000 requests within one minute, the WAF blocks subsequent requests until the next minute starts.

## Create a WAF policy

Use the [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy) cmdlet to create a WAF policy, which includes the custom rule you just created:

```azurepowershell
$wafPolicy = New-AzFrontDoorWafPolicy `
  -Name 'MyWafPolicy' `
  -ResourceGroupName $frontDoorProfile.ResourceGroupName `
  -Sku Standard_AzureFrontDoor `
  -CustomRule $promoRateLimitRule
```

## Configure a security policy to associate your Front Door profile with your WAF policy

Use the [New-AzFrontDoorCdnSecurityPolicy](/powershell/module/az.cdn/new-azfrontdoorcdnsecuritypolicy) cmdlet to create a security policy for your Front Door profile. A security policy associates your WAF policy with domains that you want to be protected by the WAF rule.

In this example, you associate the endpoint's default hostname with your WAF policy:

```azurepowershell
$securityPolicyAssociation = New-AzFrontDoorCdnSecurityPolicyWebApplicationFirewallAssociationObject `
  -PatternsToMatch @("/*") `
  -Domain @(@{"Id"=$($frontDoorEndpoint.Id)})

$securityPolicyParameters = New-AzFrontDoorCdnSecurityPolicyWebApplicationFirewallParametersObject `
  -Association $securityPolicyAssociation `
  -WafPolicyId $wafPolicy.Id

$frontDoorSecurityPolicy = New-AzFrontDoorCdnSecurityPolicy `
  -Name 'MySecurityPolicy' `
  -ProfileName $frontDoorProfile.Name `
  -ResourceGroupName $frontDoorProfile.ResourceGroupName `
  -Parameter $securityPolicyParameters
```

::: zone-end

::: zone pivot="cli"

## Prerequisites

Before you begin to set up a rate limit policy, set up your Azure CLI environment and create a Front Door profile.

### Set up your Azure CLI environment

The Azure CLI provides a set of commands that use the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) model for managing your Azure resources. 

You can install the [Azure CLI](/cli/azure/install-azure-cli) on your local machine and use it in any shell session. Here you sign in with your Azure credentials and install the Azure CLI extension for Front Door Standard/Premium.

#### Connect to Azure with an interactive dialog for sign-in

Sign in to Azure by running the following command:

```azurecli
az login
```

#### Install the Front Door extension for the Azure CLI

Install the `front-door` extension to work with the Front Door WAF from the Azure CLI:

```azurecli
az extension add --name front-door
```

You use the `az afd` commands to work with Front Door Standard/Premium resources, and you use the `az network front-door waf-policy` commands to work with WAF resources.

### Create a resource group

Use the [az group create](/cli/azure/group#az-group-create) command to create a new resource group for your Front Door profile and WAF policy. Update the resource group name and location for your own requirements:

```azurecli
resourceGroupName='FrontDoorRateLimit'

az group create \
  --name $resourceGroupName \
  --location westus
```

## Create a Front Door profile

Use the [az afd profile create](/cli/azure/afd/profile#az-afd-profile-create) command to create a new Front Door profile.

In this example, you create a Front Door standard profile named *MyFrontDoorProfile*:

```azurecli
frontDoorProfileName='MyFrontDoorProfile'

az afd profile create \
  --profile-name $frontDoorProfileName \
  --resource-group $resourceGroupName \
  --sku Standard_AzureFrontDoor
```

### Create a Front Door endpoint

Use the [az afd endpoint create](/cli/azure/afd/endpoint#az-afd-endpoint-create) command to add an endpoint to your Front Door profile.

Front Door endpoints must have globally unique names, so update the value of the `frontDoorEndpointName` variable to something unique.

```azurecli
frontDoorEndpointName='<unique-front-door-endpoint-name>'

az afd endpoint create \
  --endpoint-name $frontDoorEndpointName \
  --profile-name $frontDoorProfileName \
  --resource-group $resourceGroupName \
```

## Create a WAF policy

Use the [az network front-door waf-policy create](/cli/azure/network/front-door/waf-policy#az-network-front-door-waf-policy-create) command to create a WAF policy:

```azurecli
wafPolicyName='MyWafPolicy'

az network front-door waf-policy create \
  --name $wafPolicyName \
  --resource-group $resourceGroupName \
  --sku Standard_AzureFrontDoor
```

## Prepare to add a custom rate limit rule

Use the [az network front-door waf-policy rule create](/cli/azure/network/front-door/waf-policy/rule#az-network-front-door-waf-policy-rule-create) command to create a custom rate limit rule. The following example sets the limit to 1000 requests per minute.

Rate limit rules must contain a match condition, which you create in the next step. So, in this command, you include the `--defer` argument, which tells the Azure CLI not to submit the rule to Azure just yet.

```azurecli
az network front-door waf-policy rule create \
  --name rateLimitRule \
  --policy-name $wafPolicyName \
  --resource-group $resourceGroupName \
  --rule-type RateLimitRule \
  --rate-limit-duration 1 \
  --rate-limit-threshold 1000 \
  --action Block \
  --priority 1 \
  --defer
```

When any socket IP address sends more than 1000 requests within one minute, the WAF blocks subsequent requests until the next minute starts.

## Add a match condition

Use the [az network front-door waf-policy rule match-condition add](/cli/azure/network/front-door/waf-policy/rule/match-condition#az-network-front-door-waf-policy-rule-match-condition-add) command to add a match condition to your custom rule. The match condition identifies requests that should have the rate limit applied.

The following example matches requests where the *RequestUri* variable contains the string */promo*:

```azurecli
az network front-door waf-policy rule match-condition add \
  --match-variable RequestUri \
  --operator Contains \
  --values '/promo' \
  --name rateLimitRule \
  --policy-name $wafPolicyName \
  --resource-group $resourceGroupName
```

When you submit this command, the Azure CLI creates the rate limit rule and match condition together.

## Configure a security policy to associate your Front Door profile with your WAF policy

Use the [az afd security-policy create](/cli/azure/afd/security-policy#az-afd-security-policy-create) command to create a security policy for your Front Door profile. A security policy associates your WAF policy with domains that you want to be protected by the WAF rule.

In this example, you associate the endpoint's default hostname with your WAF policy:

```azurecli
securityPolicyName='MySecurityPolicy'

wafPolicyResourceId=$(az network front-door waf-policy show --name $wafPolicyName --resource-group $resourceGroupName --query id --output tsv)
frontDoorEndpointResourceId=$(az afd endpoint show --endpoint-name $frontDoorEndpointName --profile-name $frontDoorProfileName --resource-group $resourceGroupName --query id --output tsv)

az afd security-policy create \
  --security-policy-name $securityPolicyName \
  --profile-name $frontDoorProfileName \
  --resource-group $resourceGroupName \
  --domains $frontDoorEndpointResourceId \
  --waf-policy $wafPolicyResourceId
```

The preceding code looks up the Azure resource identifiers for the WAF policy and Front Door endpoint so that it can associate them with your security policy.

::: zone-end

::: zone pivot="powershell,cli"

> [!NOTE]
> Whenever you make changes to your WAF policy, you don't need to recreate the Front Door security policy. WAF policy updates are automatically applied to the Front Door domains.

::: zone-end

::: zone pivot="bicep"

## Quickstart

To create a Front Door profile with a rate limit rule by using Bicep, see the [Front Door Standard/Premium with rate limit](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-rate-limit/) Bicep quickstart.

::: zone-end

## Next steps

- Learn more about [Front Door](../../frontdoor/front-door-overview.md).
