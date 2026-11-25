---
title: Azure Firewall HTTP Header Insertion Configuration
description: Learn how to configure HTTP header insertion in Azure Firewall, including supported scenarios, limitations, and step-by-step setup using the Azure portal, Azure CLI, and Azure PowerShell.
author: rastogideva
ms.service: azure-firewall
ms.topic: how-to
ms.date: 07/20/2026
ms.author: duau
# Customer intent: As a network administrator, I want to configure HTTP header insertion in Azure Firewall, so that I can enforce security policies, embed authentication tokens, and integrate outbound web traffic with backend services.
---

# Configure HTTP header insertion in Azure Firewall

Use Azure Firewall HTTP header insertion to add or modify HTTP headers for web traffic. By customizing headers, organizations can enforce security policies, embed authentication tokens, and integrate with backend services. This feature improves security, helps with compliance, and optimizes traffic management, especially for applications that require specific headers for access or identification. Configure HTTP header insertion per application rule. When traffic matches an application rule that you configure with HTTP header insertion, Azure Firewall inserts the configured HTTP headers.

## Supported scenarios and limitations

The HTTP header insertion feature is designed for specific use cases and has certain constraints.

### Supported scenarios

- In the Premium SKU, this feature supports HTTP traffic and HTTPS traffic that's decrypted by using TLS inspection.
- In the Standard and Basic SKUs, this feature supports HTTP traffic.
- You can also configure this feature by using Azure Firewall Policy Draft + Deployment.

### Limitations

Keep the following limitations in mind:

- You can't insert certain reserved headers as custom HTTP headers in application rules. The following table lists the reserved headers, grouped by category.
- Inserting HTTP headers can reduce the total number of rules in a rule collection group, so use HTTP header insertion thoughtfully. If you reach the JSON limit on a rule collection group, create a new rule collection group and add rules there.
  

| Category | Reserved headers |
| --- | --- |
| General and connection | `host`, `connection`, `content-length`, `transfer-encoding`, `upgrade`, `via`, `te`, `trailer` |
| Authentication and cookies | `proxy-authorization`, `proxy-authenticate`, `authorization`, `cookie`, `set-cookie` |
| Security | `content-security-policy`, `strict-transport-security`, `x-content-type-options`, `x-frame-options`, `referrer-policy`, `x-xss-protection`, `public-key-pins`, `expect-ct`, `x-xsrf-token` |
| Forwarding | `x-forwarded-for`, `x-forwarded-proto`, `x-forwarded-host`, `x-forwarded-port`, `x-forwarded-scheme`, `forwarded` |
| Other | `metadata` |

## Configuration steps

The following sections provide step-by-step guidance for HTTP header insertion.

These steps assume you already have an existing Azure Firewall Policy (`fw-policy` in the following examples). If you don't have one, see [Deploy and configure Azure Firewall Policy](tutorial-firewall-deploy-portal-policy.md).

> [!NOTE]
> Perform the same steps for HTTPS traffic that has TLS inspection enabled.
>  Header names can have up to 100 characters.
> Header values can have up to 16K (16,000) characters.
> The total maximum length of HTTP headers (sum of all the HTTP Header’s Name and HTTP Header’s Value) allowed in each Application Rule is 16KB (16,384 bytes).

# [Portal](#tab/portal)

1. In the Azure portal, go to an existing firewall policy or create a new one.
1. Select **Rules**, and then select **Application rules**.
1. Create a new application rule or edit an existing one.
1. In the rule configuration pane, locate the **HTTP Header Insertion** section.
1. Add the required headers by specifying the header name and value. You can add multiple headers as needed.

   :::image type="content" source="media/http-header-insertion/configure-http-header-insertion.png" alt-text="Screenshot showing HTTP header insertion configuration in Azure Firewall.":::

1. Save the rule.

1. To verify the headers are configured correctly, reopen the rule and confirm the **HTTP Header Insertion** section shows the header names and values you added.

# [CLI](#tab/cli)

1. Sign in to your Azure account by running the [az login](/cli/azure/authenticate-azure-cli) command.

1. Create a rule collection group by using [az network firewall policy rule-collection-group create](/cli/azure/network/firewall/policy/rule-collection-group#az_network_firewall_policy_rule_collection_group_create).

   ```azurecli-interactive
   az network firewall policy rule-collection-group create \
       --name rcg-c \
       --policy-name fw-policy \
       --resource-group test-rg \
       --priority 10000
   ```

1. Add a rule collection that contains an application rule with a custom HTTP header by using [az network firewall policy rule-collection-group collection add-filter-collection](/cli/azure/network/firewall/policy/rule-collection-group/collection#az_network_firewall_policy_rule_collection_group_collection_add_filter_collection).

   ```azurecli-interactive
   az network firewall policy rule-collection-group collection add-filter-collection \
       --policy-name "fw-policy" \
       --resource-group "test-rg" \
       --rcg-name "rcg-c" \
       --name "app_collection_1" \
       --collection-priority 10003 \
       --action Allow \
       --rule-name "app_rule_1" \
       --rule-type ApplicationRule \
       --target-fqdns "*.microsoft.com" "*.azure.com" \
       --source-addresses "10.0.0.5" "10.0.0.6" \
       --protocols Http=80 \
       --description "Allow access to Microsoft and Azure domains with header insertion" \
       --http-headers-to-insert "Restrict-Access-To-Tenants=contoso.com,fabrikam.onmicrosoft.com" "Restrict-Access-Context=aaaabbbb-0000-cccc-1111-dddd2222eeee"
   ```

1. Verify that the rule is created and the headers are configured correctly by using [az network firewall policy rule-collection-group show](/cli/azure/network/firewall/policy/rule-collection-group#az_network_firewall_policy_rule_collection_group_show).

   ```azurecli-interactive
   az network firewall policy rule-collection-group show \
       --policy-name fw-policy \
       --resource-group test-rg \
       --name rcg-c
   ```

   This command returns the full configuration of the rule collection group `rcg-c`. Search the output for your rule name (for example, `app_rule_1`) and verify its properties.

# [PowerShell](#tab/powershell)

1. Create a new application rule by using [New-AzFirewallPolicyApplicationRule](/powershell/module/az.network/new-azfirewallpolicyapplicationrule).

   ```azurepowershell-interactive
   $rule = New-AzFirewallPolicyApplicationRule `
       -Name "app_rule_1" `
       -SourceAddress "10.0.0.5", "10.0.0.6" `
       -Protocol "Http:80" `
       -TargetFqdn "*.microsoft.com", "*.azure.com"
   ```

1. Create the custom HTTP headers by using [New-AzFirewallPolicyApplicationRuleCustomHttpHeader](/powershell/module/az.network/new-azfirewallpolicyapplicationrulecustomhttpheader), and add them to the rule.

   ```azurepowershell-interactive
   $header1 = New-AzFirewallPolicyApplicationRuleCustomHttpHeader -HeaderName "Restrict-Access-To-Tenants" -HeaderValue "contoso.com,fabrikam.onmicrosoft.com"
   $header2 = New-AzFirewallPolicyApplicationRuleCustomHttpHeader -HeaderName "Restrict-Access-Context" -HeaderValue "aaaabbbb-0000-cccc-1111-dddd2222eeee"

   $rule.AddCustomHttpHeaderToInsert($header1)
   $rule.AddCustomHttpHeaderToInsert($header2)
   ```

1. Create an application rule collection that contains the rule by using [New-AzFirewallPolicyFilterRuleCollection](/powershell/module/az.network/new-azfirewallpolicyfilterrulecollection).

   ```azurepowershell-interactive
   $collection = New-AzFirewallPolicyFilterRuleCollection `
       -Name "app_collection_1" `
       -Priority 10003 `
       -Rule @($rule) `
       -ActionType "Allow"
   ```

1. Create a rule collection group that contains the rule collection by using [New-AzFirewallPolicyRuleCollectionGroup](/powershell/module/az.network/new-azfirewallpolicyrulecollectiongroup).

   ```azurepowershell-interactive
   New-AzFirewallPolicyRuleCollectionGroup `
       -Name "rcg-c" `
       -FirewallPolicyName "fw-policy" `
       -ResourceGroupName "test-rg" `
       -Priority 10000 `
       -RuleCollection $collection
   ```

1. Verify that the rule is created and the headers are configured correctly by using [Get-AzFirewallPolicyRuleCollectionGroup](/powershell/module/az.network/get-azfirewallpolicyrulecollectiongroup).

   ```azurepowershell-interactive
   Get-AzFirewallPolicyRuleCollectionGroup `
       -AzureFirewallPolicyName "fw-policy" `
       -ResourceGroupName "test-rg" `
       -Name "rcg-c"
   ```

   This command returns the full configuration of the rule collection group `rcg-c`. Search the output for your rule name (for example, `app_rule_1`) and verify its properties.

---

## Next steps

> [!div class="nextstepaction"]
> [Application rules with SQL FQDNs](sql-fqdn-filtering.md)
