---
title: Azure Firewall features
description: Learn about Azure Firewall feature draft and deployment
services: firewall
author: vekannan
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 04/22/2025
ms.author: duau
---

# Azure Firewall Draft + Deployment (Preview)

Organizations are required to make frequent changes to their Firewall Policy for several reasons: onboarding a new application or workload, patching security issue, or for maintenance and optimizing their policy by merging rules or deleting unused rules. These updates can be performed by multiple people, while each update can take up to a few minutes to be deployed.
With Azure Firewall Policy Save & Commit, you can now update your policy in a 2-phased approach: 

* Draft: Make as many changes as needed, by one or more people, which will be saved in a temporary policy draft (which is cloned from your current applied policy). These changes are extremely fast to make.

* Deployment: Apply the changes altogether by deploying the draft version and make it your current applied policy.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a draft 
> * Update a draft 
> * Deploy a draft

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you want to use this feature via CLI, then make sure azure-firewall extenstion version is above [1.2.3](https://github.com/Azure/azure-cli-extensions/releases/tag/azure-firewall-1.2.3)

## Use Draft + Deployment

Azure Firewall's draft + deployment feature allows you to make bulk updates to your firewall policy, before applying them to production.  

1. In the Azure portal, navigate to your existing firewall policies or create a new one.
1. On the Azure Firewall Policy blade, under **Management** section click **Draft & Deployment**, then select **Create a new draft.** This creates a draft that is an exact copy of your current applied policy.

    :::image type="content" source="media/draft-deploy/pic1.png" alt-text="screenshot of Draft and Deploy":::

    :::image type="content" source="media/draft-deploy/pic2.png" alt-text="screenshot of create a draft":::

1. On the draft page, make changes or additions to your rules or settings. These pages are identical to the ones in the deployed draft. These changes will only take effect when you deploy the draft.
    :::image type="content" source="media/draft-deploy/pic3.png" alt-text="screenshot of drafting changes":::

1. To verify the changes, return to the **deploy** screen and see the rules or setting changes. To deploy, select **deploy draft**. Once deployed, the draft replaces the current policy and becomes the latest version. The draft itself is deleted after the deployment. 

    :::image type="content" source="media/draft-deploy/pic4.png" alt-text="screenshot of check changes and deploy":::

1. Repeat the process as needed to make further updates to the firewall policy.

> [!NOTE]
> When using this feature via PowerShell or API, you must first download the current policy and manually create a draft based on it. In contrast, when using the Azure portal or CLI, creating a draft automatically generates it from the existing policy.

# [CLI](#tab/CLI)
```azurecli-interactive

az login

Create a draft: 
az network firewall policy draft create --policy-name fw-policy --resource-group test-rg

Update draft (settings):
az network firewall policy draft update --policy-name fw-policy --resource-group test-rg --threat-intel-mode Off --idps-mode Deny

Update draft (rules):

    Create a new RCG in draft:
    az network firewall policy rule-collection-group draft create –rule-collection-group-name rcg-b –policy-name fw-policy –resource-group test-rg –priority 303

    Update a RCG in draft:
    az network firewall policy rule-collection-group draft collection add-nat-collection -n nat_collection_1 --collection-priority 10003 --policy-name fw-policy -g test-rg --rule-collection-group-name rcg-c --action DNAT --rule-name network_rule_21 --description "test" --destination-addresses "202.120.36.15" --source-addresses "202.120.36.13" "202.120.36.14" --translated-address 128.1.1.1 --translated-port 1234 --destination-ports 12000 12001 --ip-protocols TCP UDP

See the Draft: 
az network firewall policy draft show --policy-name fw-policy --resource-group test-rg

Deploy Draft: 
az network firewall policy deploy --name fw-policy --resource-group test-rg

Discard Draft:
az network firewall policy draft delete --policy-name fw-policy --resource-group test-rg

```

# [PowerShell](#tab/powershell)
 
```azurepowershell-interactive 

Create a draft: 
New-AzFirewallPolicyDraft -AzureFirewallPolicyName fw-policy -ResourceGroupName test-rg

Update draft (settings):
Set-AzFirewallPolicyDraft -AzureFirewallPolicyName fw-policy -ResourceGroupName test-rg -ThreatIntelWhitelist $threatIntelWhitelist

Update draft (rules):
    Create a new RCG in draft:
    New-AzFirewallPolicyRuleCollectionGroupDraft -AzureFirewallPolicyRuleCollectionGroupName rcg-a -ResourceGroupName test-rg -AzureFirewallPolicyName fw-policy -Priority 200

    Update a RCG in draft:
    $rule1 = New-AzFirewallPolicyApplicationRule -Name "Allow-HTTP" -Protocol "Http:80" -SourceAddress "10.0.0.0/24" -TargetFqdn www.example.com

    $rule2 = New-AzFirewallPolicyApplicationRule -Name "Allow-HTTPS-2" -Protocol "Https:443" -SourceAddress "10.0.0.0/24" -TargetFqdn "www.secureexample.com"  

    $ruleCollection = New-AzFirewallPolicyFilterRuleCollection -Name "Allow-Rules" -Priority 100 -Rule $rule1, $rule2 -ActionType Allow   

    Set-AzFirewallPolicyRuleCollectionGroupDraft -AzureFirewallPolicyRuleCollectionGroupName rcg-b -ResourceGroupName test-rg -AzureFirewallPolicyName fw-policy -Priority 400 -RuleCollection $ruleCollection

See the draft: 
Get-AzFirewallPolicyDraft -AzureFirewallPolicyName fw-policy -ResourceGroupName test-rg

Deploy the draft:
Deploy-AzFirewallPolicy -Name fw-policy -ResourceGroupName test-rg 

Discard draft:
Remove-AzFirewallPolicyDraft -AzureFirewallPolicyName fw-policy -ResourceGroupName test-rg

```

---


### Draft and Deploy: Supported Scenarios and Limitations

The Draft and Deploy functionality is supported in specific scenarios and comes with the following limitations:

#### Supported Scenarios
- This feature is available only for Azure Firewall Policies. It does not support firewalls using classic rules.

#### Limitations
- A new draft is created as a clone of the currently applied policy. Any changes made to the applied policy after the draft is created will not automatically reflect in the draft unless manually replicated.
- Deploying a draft replaces the entire applied policy. Any updates made to the applied policy after the draft's creation will be overridden unless included in the draft.
- Creating a Rule Collection Group is not supported within a policy draft.
- Only one draft can exist per policy at any given time.

## Next Steps
> [!div class="nextstepaction"]
> [Deploy and configure Azure Firewall Premium](premium-deploy.md)