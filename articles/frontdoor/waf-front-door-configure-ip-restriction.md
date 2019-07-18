---
title: Configure an IP restriction rule with a web application firewall rule for Azure Front Door Service
description: Learn how to configure a web application firewall rule to restrict IP addresses for an existing Azure Front Door Service endpoint.
services: frontdoor
documentationcenter: ''
author: KumudD
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/31/2019
ms.author: kumud
ms.reviewer: tyao

---
# Configure an IP restriction rule with a web application firewall for Azure Front Door Service
This article shows you how to configure IP restriction rules in a web application firewall (WAF) for Azure Front Door Service by using the Azure CLI, Azure PowerShell, or an Azure Resource Manager template.

An IP address–based access control rule is a custom WAF rule that lets you control access to your web applications. It does this by specifying a list of IP addresses or IP address ranges in Classless Inter-Domain Routing (CIDR) format.

By default, your web application is accessible from the internet. If you want to limit access to clients from a list of known IP addresses or IP address ranges, you must create two IP matching rules. The first IP matching rule contains the list of IP addresses as matching values and sets the action to **Allow**. The second one, with lower priority, blocks all other IP addresses by using the **ALL** operator and setting the action to **Block**. After an IP restriction rule is applied, requests that originate from addresses outside this allowed list receive a 403 Forbidden response.  

## Configure a WAF policy with the Azure CLI

### Prerequisites
Before you begin to configure an IP restriction policy, set up your CLI environment and create an Azure Front Door Service profile.

#### Set up the Azure CLI environment
1. Install the [Azure CLI](/cli/azure/install-azure-cli), or use Azure Cloud Shell. Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. Select the **Try it** button in the CLI commands that follow, and then sign in to your Azure account in the Cloud Shell session that opens. After the session starts, enter `az extension add --name front-door` to add the Azure Front Door Service extension.
 2. If you're using the CLI locally in Bash, sign in to Azure by using `az login`.

#### Create an Azure Front Door Service profile
Create an Azure Front Door Service profile by following the instructions described in [Quickstart: Create a Front Door for a highly available global web application](quickstart-create-front-door.md).

### Create a WAF policy

Create a WAF policy by using the [az network waf-policy create](/cli/azure/ext/front-door/network/waf-policy?view=azure-cli-latest#ext-front-door-az-network-waf-policy-create) command. 
In the example that follows, replace the policy name *IPAllowPolicyExampleCLI* with a unique policy name.

```azurecli-interactive 
az network waf-policy create \
  --resource-group <resource-group-name> \
  --subscription <subscription ID> \
  --name IPAllowPolicyExampleCLI
  ```
### Add a custom IP access control rule

Use the [az network waf-policy custom-rule create](/cli/azure/ext/front-door/network/waf-policy/custom-rule?view=azure-cli-latest#ext-front-door-az-network-waf-policy-custom-rule-create) command to add a custom IP access control rule for the WAF policy you just created.

In the following examples:
-  Replace *IPAllowPolicyExampleCLI* with your unique policy created earlier.
-  Replace *ip-address-range-1*, *ip-address-range-2* with your own range.

First, create the IP allow rule for the specified addresses.

```azurecli
az network waf-policy custom-rule create \
  --name IPAllowListRule \
  --priority 1 \
  --rule-type MatchRule \
  --match-condition RemoteAddr IPMatch ("<ip-address-range-1>","<ip-address-range-2>") \
  --action Allow \
  --resource-group <resource-group-name> \
  --policy-name IPAllowPolicyExampleCLI
```
Next, create a **block all** rule with lower priority than the previous **allow** rule. Again, replace *IPAllowPolicyExampleCLI* in the following example with your unique policy that you created earlier.

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
    
### Find the ID of a WAF policy 
Find a WAF policy's ID by using the [az network waf-policy show](/cli/azure/ext/front-door/network/waf-policy?view=azure-cli-latest#ext-front-door-az-network-waf-policy-show) command. Replace *IPAllowPolicyExampleCLI* in the following example with your unique policy that you created earlier.

   ```azurecli
   az network waf-policy show \
     --resource-group <resource-group-name> \
     --name IPAllowPolicyExampleCLI
   ```

### Link a WAF policy to an Azure Front Door Service front-end host

Set the Azure Front Door Service *WebApplicationFirewallPolicyLink* ID to the policy ID by using the [az network front-door update](/cli/azure/ext/front-door/network/front-door?view=azure-cli-latest#ext-front-door-az-network-front-door-update) command. Replace *IPAllowPolicyExampleCLI* with your unique policy that you created earlier.

   ```azurecli
   az network front-door update \
     --set FrontendEndpoints[0].WebApplicationFirewallPolicyLink.id=/subscriptions/<subscription ID>/resourcegroups/<resource- name>/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/IPAllowPolicyExampleCLI \
     --name <frontdoor-name>
     --resource-group <resource-group-name>
   ```
In this example, the WAF policy is applied to **FrontendEndpoints[0]**. You can link the WAF policy to any of your front ends.
> [!Note]
> You need to set the **WebApplicationFirewallPolicyLink** property only once to link a WAF policy to an Azure Front Door Service front end. Subsequent policy updates are automatically applied to the front end.

## Configure a WAF policy with Azure PowerShell

### Prerequisites
Before you begin to configure an IP restriction policy, set up your PowerShell environment and create an Azure Front Door Service profile.

#### Set up your PowerShell environment
Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) model for managing Azure resources.

You can install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) on your local machine and use it in any PowerShell session. Follow the instructions on the page to sign in to PowerShell by using your Azure credentials, and then install the Az module.

1. Connect to Azure by using the following command, and then use an interactive dialog to sign in.
    ```
    Connect-AzAccount
    ```
 2. Before you install an Azure Front Door Service module, make sure you have the current version of the PowerShellGet module installed. Run the following command, and then reopen PowerShell.

    ```
    Install-Module PowerShellGet -Force -AllowClobber
    ``` 

3. Install the Az.FrontDoor module by using the following command. 
    
    ```
    Install-Module -Name Az.FrontDoor
    ```
### Create an Azure Front Door Service profile
Create an Azure Front Door Service profile by following the instructions described in [Quickstart: Create a Front Door for a highly available global web application](quickstart-create-front-door.md).

### Define an IP match condition
Use the [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject) command to define an IP match condition.
In the following example, replace *ip-address-range-1*, *ip-address-range-2* with your own range.    
```powershell
$IPMatchCondition = New-AzFrontDoorWafMatchConditionObject `
-MatchVariable  RemoteAddr `
-OperatorProperty IPMatch `
-MatchValue "ip-address-range-1", "ip-address-range-2"
```
Create an IP *match all condition* rule by using the following command:
```powershell
$IPMatchALlCondition = New-AzFrontDoorWafMatchConditionObject `
-MatchVariable  RemoteAddr `
-OperatorProperty Any        
  ```
    
### Create a custom IP allow rule

Use the [New-AzFrontDoorCustomRuleObject](/powershell/module/Az.FrontDoor/New-azfrontdoorwafcustomruleobject) command to define an action and set a priority. In the following example, requests from client IPs that match the list will be allowed.

```powershell
$IPAllowRule = New-AzFrontDoorCustomRuleObject `
-Name "IPAllowRule" `
-RuleType MatchRule `
-MatchCondition $IPMatchCondition `
-Action Allow -Priority 1
```
Create a **block all** rule with lower priority than the previous IP **allow** rule.
```powershell
$IPBlockAll = New-AzFrontDoorCustomRuleObject `
-Name "IPDenyAll" `
-RuleType MatchRule `
-MatchCondition $IPMatchALlCondition `
-Action Block `
-Priority 2
```

### Configure a WAF policy
Find the name of the resource group that contains the Azure Front Door Service profile by using `Get-AzResourceGroup`. Next, configure a WAF policy with the IP **block all** rule by using [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy).

```powershell
  $IPAllowPolicyExamplePS = New-AzFrontDoorWafPolicy `
    -Name "IPRestrictionExamplePS" `
    -resourceGroupName <resource-group-name> `
    -Customrule $IPAllowRule $IPBlockAll `
    -Mode Prevention `
    -EnabledState Enabled
   ```

### Link a WAF policy to an Azure Front Door Service front-end host

Link a WAF policy object to an existing front-end host and update Azure Front Door Service properties. First, retrieve the Azure Front Door Service object by using [Get-AzFrontDoor](/powershell/module/Az.FrontDoor/Get-AzFrontDoor). Next, set the **WebApplicationFirewallPolicyLink** property to the resource ID of *$IPAllowPolicyExamplePS*, created in the previous step, by using the [Set-AzFrontDoor](/powershell/module/Az.FrontDoor/Set-AzFrontDoor) command.

```powershell
  $FrontDoorObjectExample = Get-AzFrontDoor `
    -ResourceGroupName <resource-group-name> `
    -Name $frontDoorName
  $FrontDoorObjectExample[0].FrontendEndpoints[0].WebApplicationFirewallPolicyLink = $IPBlockPolicy.Id
  Set-AzFrontDoor -InputObject $FrontDoorObjectExample[0]
```

> [!NOTE]
> In this example, the WAF policy is applied to **FrontendEndpoints[0]**. You can link a WAF policy to any of your front ends. You need to set the **WebApplicationFirewallPolicyLink** property only once to link a WAF policy to an Azure Front Door Service front end. Subsequent policy updates are automatically applied to the front end.


## Configure a WAF policy with a Resource Manager template
To view the template that creates an Azure Front Door Service policy and a WAF policy with custom IP restriction rules, go to [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-waf-clientip).


## Next steps

- Learn how to [create an Azure Front Door Service profile](quickstart-create-front-door.md).
