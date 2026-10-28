---
title: Configure WAF custom rules and the Default Rule Set for Azure Front Door
description: Learn how to configure a web application firewall (WAF) policy that consists of custom and managed rules for an existing Azure Front Door endpoint.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: how-to
ms.date: 08/31/2026
ms.custom: devx-track-azurepowershell
# Customer intent: As a security engineer, I want to configure a web application firewall policy with custom rules and a default rule set for Azure Front Door, so that I can enhance the security of my application against various threats.
---

# Configure a WAF policy by using Azure PowerShell

A web application firewall (WAF) policy defines the inspections that are required when a request arrives at Azure Front Door.

This article shows how to configure a WAF policy for Azure Front Door Standard or Premium that consists of some custom rules and has the Azure-managed Default Rule Set enabled. Custom rules apply to both the Standard and Premium tiers. Managed rule sets, such as the Default Rule Set, require the Premium tier.

Custom rules and the Default Rule Set are optional; include either or both to suit your needs. You set the WAF policy mode (Detection or Prevention) when you create the policy in a later step.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Front Door Standard or Premium profile. If you need to create one, see [Quickstart: Create an Azure Front Door Standard/Premium profile using PowerShell](../../frontdoor/create-front-door-powershell.md). The examples in this article use a Premium profile because managed rule sets require the Premium tier.
- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.
- The `Az.Cdn` and `Az.FrontDoor` PowerShell modules. Use the `Az.Cdn` module to work with Azure Front Door Standard and Premium resources, and the `Az.FrontDoor` module to work with WAF resources. Install both modules by running the following commands:

    ```azurepowershell
    Install-Module -Name Az.Cdn
    Install-Module -Name Az.FrontDoor
    ```

## Custom rule based on HTTP parameters

The following example shows how to configure a custom rule with two match conditions by using [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject). Requests are from a specified site as defined by referrer, and the query string doesn't contain `password`.

```powershell-interactive
$referer = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestHeader -OperatorProperty Equal -Selector "Referer" -MatchValue "www.mytrustedsites.com/referpage.html"
$password = New-AzFrontDoorWafMatchConditionObject -MatchVariable QueryString -OperatorProperty Contains -MatchValue "password"
$AllowFromTrustedSites = New-AzFrontDoorWafCustomRuleObject -Name "AllowFromTrustedSites" -RuleType MatchRule -MatchCondition $referer,$password -Action Allow -Priority 1
```

## Custom rule based on an HTTP request method

Create a rule blocking a PUT method by using [New-AzFrontDoorWafCustomRuleObject](/powershell/module/az.frontdoor/new-azfrontdoorwafcustomruleobject).

```powershell-interactive
$put = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestMethod -OperatorProperty Equal -MatchValue PUT
$BlockPUT = New-AzFrontDoorWafCustomRuleObject -Name "BlockPUT" -RuleType MatchRule -MatchCondition $put -Action Block -Priority 2
```

## Create a custom rule based on size constraint

The following example creates a rule that blocks requests with a URL longer than 100 characters by using Azure PowerShell.

```powershell-interactive
$url = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestUri -OperatorProperty GreaterThanOrEqual -MatchValue 100
$URLOver100 = New-AzFrontDoorWafCustomRuleObject -Name "URLOver100" -RuleType MatchRule -MatchCondition $url -Action Block -Priority 3
```

## Add a managed Default Rule Set

Managed rule sets are available on Azure Front Door Premium. The following example creates a managed Default Rule Set object by using Azure PowerShell.

```powershell-interactive
$managedRules = New-AzFrontDoorWafManagedRuleObject -Type Microsoft_DefaultRuleSet -Version 2.2
```

> [!NOTE]
> Managed rule sets require Azure Front Door Premium. Azure Front Door Standard supports custom rules only. This example uses `Microsoft_DefaultRuleSet` version 2.2. For all available versions, see [Web Application Firewall DRS rule groups and rules](waf-front-door-drs.md).

## Create a WAF policy

Create a WAF policy that includes the custom rules and the managed Default Rule Set from the previous steps by using [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy). Set `-Sku` to `Premium_AzureFrontDoor` to include managed rules, or to `Standard_AzureFrontDoor` for custom rules only.

```powershell-interactive
$myWAFPolicy = New-AzFrontDoorWafPolicy -Name $policyName -ResourceGroupName $resourceGroupName -Sku Premium_AzureFrontDoor -CustomRule $AllowFromTrustedSites,$BlockPUT,$URLOver100 -ManagedRule $managedRules -EnabledState Enabled -Mode Prevention
```

## Associate the WAF policy with your endpoint

For Azure Front Door Standard and Premium, you associate a WAF policy with your endpoint by creating a security policy on the Azure Front Door profile. A security policy associates your WAF policy with the domains that you want the WAF to protect.

Retrieve your endpoint by using [Get-AzFrontDoorCdnEndpoint](/powershell/module/az.cdn/get-azfrontdoorcdnendpoint), and replace the resource group, profile, and endpoint names with your own. Then use [New-AzFrontDoorCdnSecurityPolicy](/powershell/module/az.cdn/new-azfrontdoorcdnsecuritypolicy) to associate the endpoint's default hostname with your WAF policy.

```powershell-interactive
$frontDoorEndpoint = Get-AzFrontDoorCdnEndpoint -ResourceGroupName $resourceGroupName -ProfileName $frontDoorProfileName -EndpointName $frontDoorEndpointName

$securityPolicyAssociation = New-AzFrontDoorCdnSecurityPolicyWebApplicationFirewallAssociationObject `
  -PatternsToMatch @("/*") `
  -Domain @(@{"Id"=$($frontDoorEndpoint.Id)})

$securityPolicyParameters = New-AzFrontDoorCdnSecurityPolicyWebApplicationFirewallParametersObject `
  -Association $securityPolicyAssociation `
  -WafPolicyId $myWAFPolicy.Id

New-AzFrontDoorCdnSecurityPolicy `
  -Name 'MySecurityPolicy' `
  -ProfileName $frontDoorProfileName `
  -ResourceGroupName $resourceGroupName `
  -Parameter $securityPolicyParameters
```

> [!NOTE]
> A security policy applies to the domains in its association. To protect more domains, add them to the association or create additional security policies.

## Related content

- [Web Application Firewall on Azure Front Door](afds-overview.md)
- [Web Application Firewall DRS rule groups and rules](waf-front-door-drs.md)
- [Best practices for Web Application Firewall on Azure Front Door](waf-front-door-best-practices.md)
