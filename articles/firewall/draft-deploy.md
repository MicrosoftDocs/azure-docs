---
title: Azure Firewall features
description: Learn about Azure Firewall feature draft and deploy
services: firewall
author: vekannan
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 04/22/2025
ms.author: duau
---

# Azure Firewall Draft and Deploy (Preview)

Organizations are required to make frequent changes to their Firewall Policy for several reasons: onboarding a new application or workload, patching security issue, or for maintenance and optimizing their policy by merging rules or deleting unused rules. These updates can be performed by multiple people, while each update can take up to a few minutes to be deployed.
With Azure Firewall Policy Save & Commit, you can now update your policy in a 2-phased approach: 

* Save: Make as many changes as needed, by one or more people, which will be saved in a temporary policy draft (which is cloned from your current applied policy). These changes are extremely fast to make.

* Commit: Apply the changes altogether by deploying the draft version and make it your current applied policy.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a draft 
> * Update a draft 
> * Deploy a draft

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Use Draft + Commit

Azure Firewall's draft and deploy feature allows you to safely test changes in a demo or test environment before applying them to production.  

1. In the Azure portal, navigate to your existing firewall policies or create a new one.
1. On the Azure Firewall Policy blade, click **Draft & Deployment**, then select **Create a new draft.** This will create a new draft associated with this policy, which is a 1-1 copy of your current applied policy.

    :::image type="content" source="media/draft-deploy/Picture1.png" alt-text="screenshot of Draft and Deploy":::

1. On the draft page, make changes or additions to your rules or other settings. These pages are identical to the ones in the deployed draft, but changes you make in a draft will be deployed only when you specifically deploy the draft.
1. Next, return to the **deploy** screen, and select **deploy draft**. Once the draft is deployed, the updated version, including all changes you made in draft, will override the current deployed policy and become the latest version. The draft body itself will be deleted after that. And you will then be able to create a new draft on top of the new deployment again.
1. You can repeat the process as many times as you would like to make further changes to the firewall policy.

# [Powershell](#tab/powershell)
 
```azurepowershell-interactive 
New-AzFirewallPolicyDraft -AzureFirewallPolicyName fw-policy -ResourceGroupName chetan-rg
Set-AzFirewallPolicyDraft -AzureFirewallPolicyName fw-policy -ResourceGroupName chetan-rg -PrivateRange @("99.99.99.0/24", "66.66.0.0/16")                                                                           
 
New-AzFirewallPolicyRuleCollectionGroupDraft -AzureFirewallPolicyRuleCollectionGroupName rcg-a  -ResourceGroupName chetan-rg -AzureFirewallPolicyName -Priority 200
```
# [CLI](#tab/CLI)
```azurecli-interactive
```
# [API](#tab/API)

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