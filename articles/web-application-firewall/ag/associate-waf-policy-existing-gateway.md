---
title: Associate a Web Application Firewall policy with an existing Azure Application Gateway
description: Learn how to associate a Web Application Firewall policy with an existing Azure Application Gateway.
services: web-application-firewall
ms.topic: article
author: vhorne
ms.service: web-application-firewall
ms.date: 10/25/2019
ms.author: victorh
---

# Associate a WAF policy with an existing Application Gateway

You can use Azure PowerShell to [create a WAF Policy](create-waf-policy-ag.md), but you might already have an Application Gateway and just want to associate a WAF Policy to it. In this article, you do just that; you create a WAF Policy and associate it to an already existing Application Gateway. 

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
[Learn about Custom Rules.](/configure-waf-custom-rules.md)
