---
title: Configure an IP restriction rule with web application firewall rule for Azure Front Door
description: Learn how to configure an IP address restriction WAF rule for an existing Front Door endpoint.
services: frontdoor
documentationcenter: ''
author: KumudD
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/31/2019
ms.author: kumud;tyao

---
# Configure an IP restriction rule with web application firewall for Azure Front Door
 This article shows you how to configure IP restriction rules in Azure web application firewall (WAF) for Front Door by using Azure CLI, Azure PowerShell, or Azure Resource Manager template.

An IP address based access control rule is a custom WAF rule that allows you to control access to your web applications by specifying a list of IP addresses or IP address ranges in Classless Inter-Domain Routing (CIDR) form.

By default, your web application is accessible from the internet. If you want to limit access to your web applications only to clients from a list of known IP addresses or IP address ranges, you need to create two IP matching rules. First IP matching rule contains the list of IP addresses as matching values and set the action to "ALLOW". The second one with lower priority, is to block all other IP addresses by using the "All" operator and set the action to "BLOCK". Once an IP restriction rule is applied, any requests originating from addresses outside this allowed list receives a 403 (Forbidden) response.  

## Configure WAF policy with Azure CLI

### Prerequisites
Before you begin to configure an IP restriction policy, set up your CLI environment and create a Front Door profile.

#### Set up Azure CLI environment
1. Install the [Azure CLI](/cli/azure/install-azure-cli), or use the Azure Cloud Shell. The Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI pre-installed and configured to use with your account. Select the **Try it** button in the CLI commands that follow. Selecting **Try it** invokes a Cloud Shell that you can sign in to your Azure account with. Once a cloud shell session starts, enter `az extension add --name front-door` to add the front-door extension.
 2. If using the CLI locally in Bash, sign in to Azure with `az login`.

#### Create Front Door profile
Create a Front Door profile by following the instructions described in [Quickstart: Create a Front Door profile](quickstart-create-front-door.md)

### Create a WAF policy

Create a WAF policy with the [az network waf-policy create](/cli/azure/ext/front-door/network/waf-policy?view=azure-cli-latest#ext-front-door-az-network-waf-policy-create) command. 
In the below example, replace the policy name *IPAllowPolicyExampleCLI* with a unique policy name.

```azurecli-interactive 
az network waf-policy create \
  --resource-group <resource-group-name> \
  --subscription <subscription ID> \
  --name IPAllowPolicyExampleCLI
  ```
### Add custom IP access control rule

Add a custom IP access control rule to the WAF policy created in the previous step with the [az network waf-policy custom-rule create](/cli/azure/ext/front-door/network/waf-policy/custom-rule?view=azure-cli-latest#ext-front-door-az-network-waf-policy-custom-rule-create) command. 

In the below example:
-  replace *IPAllowPolicyExampleCLI* with your unique policy created earlier.
-  replace *ip-address-range-1*, *ip-address-range-2* with your own range.

First, create the IP allow rule for the specified addresses.

```azurecli
az network waf-policy custom-rule create \
  --name IPAllowListRule \
  --priority 1 \
  --rule-type MatchRule \
  --match-condition RemoteAddr IPMatch ["<ip-address-range-1>","<ip-address-range-2>"] \
  --action Allow \
  --resource-group <resource-group-name> \
  --policy-name IPAllowPolicyExampleCLI
```
Next, create a block all IP rule with lower priority than the previous IP allow rule. Replace the *IPAllowPolicyExampleCLI* with your unique policy created earlier.

```azurecli
az network waf-policy custom-rule create \
  --name IPDenyAllRule\
  --priority 2 \
  --rule-type MatchRule \
  --match-condition RemoteAddr Any
  --action Block \
  --resource-group <resource-group-name> \
  --policy-name IPAllowPolicyExampleCLI
 ```

### Find WAF policy ID
Find the ID of a WAF policy with the [az network waf-policy show](/cli/azure/ext/front-door/network/waf-policy?view=azure-cli-latest#ext-front-door-az-network-waf-policy-show) command. Replace the *IPAllowPolicyExampleCLI* with your unique policy created earlier.

   ```azurecli
   az network waf-policy show \
     --resource-group <resource-group-name> \
     --name IPAllowPolicyExampleCLI
   ```

### Link WAF policy to a Front Door front-end host

Set the front-door *WebApplicationFirewallPolicyLink* ID to the policy ID with the [az network front-door update](/cli/azure/ext/front-door/network/front-door?view=azure-cli-latest#ext-front-door-az-network-front-door-update) command. Replace the *IPAllowPolicyExampleCLI* with your unique policy created earlier.

   ```azurecli
   az network front-door update \
     --set FrontendEndpoints[0].WebApplicationFirewallPolicyLink.id=/subscriptions/<subscription ID>/resourcegroups/<resource- name>/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/IPAllowPolicyExampleCLI \
     --name <frontdoor-name>
     --resource-group <resource-group-name>
   ```
In this example, the WAF policy is applied to FrontendEndpoints[0]. You may link WAF policy to any of your front-ends.
> [!Note]
> You only need to set the **WebApplicationFirewallPolicyLink** property once to link a WAF policy to a Front Door front-end. Subsequent policy updates are automatically applied to the front-end.

## Configure WAF policy with Azure PowerShell

### Prerequisites
Before you begin to configure an IP restriction policy, set up your PowerShell environment and create a Front Door profile.

#### Set up your PowerShell environment
Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) model for managing your Azure resources. 

You can install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) on your local machine and use it in any PowerShell session. Follow the instructions on the page, to sign in with your Azure credentials, and install Az PowerShell module.

##### Connect to Azure with an interactive dialog for sign in
```
Connect-AzAccount

```
Before you install Front Door module, make sure you have the current version of PowerShellGet installed. Run the below command and reopen PowerShell.

```
Install-Module PowerShellGet -Force -AllowClobber
``` 

##### Install Az.FrontDoor module 

```
Install-Module -Name Az.FrontDoor
```
### Create a Front Door profile
Create a Front Door profile by following the instructions described in [Quickstart: Create a Front Door profile](quickstart-create-front-door.md)

### Define IP match condition
Use the [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject) command to define an IP match condition. 
In the below example, replace *ip-address-range-1*, *ip-address-range-2* with your own range.

```powershell
  $IPMatchCondition = New-AzFrontDoorWafMatchConditionObject `
    -MatchVariable  RemoteAddr `
    -OperatorProperty IPMatch `
    -MatchValue ["ip-address-range-1", "ip-address-range-2"]
```
Create an IP match all condition rule
```powershell
  $IPMatchALlCondition = New-AzFrontDoorWafMatchConditionObject `
    -MatchVariable  RemoteAddr `
    -OperatorProperty Any
    
```

### Create a custom IP allow rule
   Use the [New-AzFrontDoorCustomRuleObject](/powershell/module/Az.FrontDoor/New-azfrontdoorwafcustomruleobject) command to define an action and set a priority. In the following example, requests from client IPs that match the list will be allowed. 

```powershell
  $IPAllowRule = New-AzFrontDoorWafCustomRuleObject `
    -Name "IPAllowRule" `
    -RuleType MatchRule `
    -MatchCondition $IPMatchCondition `
    -Action Allow -Priority 1
```
Create a Block all IP rule with lower priority than the previous IP allow rule.

```powershell
  $IPBlockAll = New-AzFrontDoorWafCustomRuleObject `
    -Name "IPDenyAll" `
    -RuleType MatchRule `
    -MatchCondition $IPMatchALlCondition `
    -Action Block `
    -Priority 2
   ```

### Configure WAF policy
Find the name of the resource group that contains the Front Door profile using `Get-AzResourceGroup`. Next, configure a WAF policy with the IP block rule using [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy).

```powershell
  $IPAllowPolicyExamplePS = New-AzFrontDoorWafPolicy `
    -Name "IPRestrictionExamplePS" `
    -resourceGroupName <resource-group-name> `
    -Customrule $IPAllowRule $IPBlockAll `
    -Mode Prevention `
    -EnabledState Enabled
   ```

### Link WAF policy to a Front Door front-end host

Link the WAF policy object to an existing Front Door front-end host and update Front Door properties. First retrieve the Front Door object using [Get-AzFrontDoor](/powershell/module/Az.FrontDoor/Get-AzFrontDoor). Next, set the front-end *WebApplicationFirewallPolicyLink* property to the resourceId of the *$IPAllowPolicyExamplePS* created in the previous step with the [Set-AzFrontDoor](/powershell/module/Az.FrontDoor/Set-AzFrontDoor) command.

```powershell
  $FrontDoorObjectExample = Get-AzFrontDoor `
    -ResourceGroupName <resource-group-name> `
    -Name $frontDoorName
  $FrontDoorObjectExample[0].FrontendEndpoints[0].WebApplicationFirewallPolicyLink = $IPBlockPolicy.Id
  Set-AzFrontDoor -InputObject $FrontDoorObjectExample[0]
```

> [!NOTE]
> In this example, the WAF policy is applied to FrontendEndpoints[0]. You may link WAF policy to any of your front-ends.You only need to set *WebApplicationFirewallPolicyLink* property once to link a WAF policy to a Front Door front-end. Subsequent policy updates are automatically applied to the front-end.


## Configure WAF policy with Resource Manager template
View the template that creates a Front Door and a WAF policy with custom IP restriction rules [here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-waf-clientip).


## Next steps

- Learn how to [create a Front Door profile](quickstart-create-front-door.md).
