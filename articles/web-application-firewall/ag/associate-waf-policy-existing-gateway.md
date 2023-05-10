---
title: Associate a Web Application Firewall policy with an existing Azure Application Gateway
description: Learn how to associate a Web Application Firewall policy with an existing Azure Application Gateway.
services: web-application-firewall
ms.topic: article
author: vhorne
ms.service: web-application-firewall
ms.custom: devx-track-azurepowershell
ms.date: 10/25/2019
ms.author: victorh
---

# Associate a WAF policy with an existing Application Gateway

You can use Azure PowerShell to [create a WAF Policy](create-waf-policy-ag.md), but you might already have an Application Gateway and just want to associate a WAF Policy to it. In this article, you do just that; you create a WAF Policy and associate it to an already existing Application Gateway. 

 > [!NOTE]
 > The WAF policy must be in the same region and subscription as the Application Gateway for it to be associated.

1. Get your Application Gateway and Firewall Policy. If you don't have an existing Firewall Policy, see step 2. 

   ```azurepowershell-interactive
      Connect-AzAccount
      Select-AzSubscription -Subscription "<sub id>"`

      #Get Application Gateway and existing policy object or create new`
      $gw = Get-AzApplicationGateway -Name <Waf v2> -ResourceGroupName <RG name>`
      $policy = Get-AzApplicationGatewayFirewallPolicy -Name <policy name> -ResourceGroupName <RG name>`
   ```

2. (Optional) Create a Firewall Policy.

   ```azurepowershell-interactive
      New-AzApplicationGatewayFirewallPolicy -Name <policy name> -ResourceGroupName <RG name>'
      $policy = Get-AzApplicationGatewayFirewallPolicy -Name <policy name> -ResourceGroupName <RG name>`
   ```
   > [!NOTE]
   > If you are creating this WAF Policy to transition from a WAF Config to a WAF Policy, then the Policy needs to be an exact copy of your old Config. This means that every exclusion, custom rule, disabled rule group, etc. needs to be the exact same as it is in the WAF Config.
3. (Optional) You can configure the WAF policy to suit your needs. This includes custom rules, disabling rules/rule groups, exclusions,    setting file upload limits, etc. If you skip this step, all defaults will be selected. 
   
4. Save the policy, and attach it to your Application Gateway. 
   
   ```azurepowershell-interactive
      #Save the policy itself
      Set-AzApplicationGatewayFirewallPolicy -InputObject $policy`
   
      #Attach the policy to an Application Gateway
      $gw.FirewallPolicy = $policy`
   
      #Save the Application Gateway
      Set-AzApplicationGateway -ApplicationGateway $gw`
   ```

## Next steps
[Learn about Custom Rules.](configure-waf-custom-rules.md)
