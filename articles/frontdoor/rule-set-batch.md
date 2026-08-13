---
title: Batch Rule Updates for Rule Sets
titleSuffix: Azure Front Door
description: Learn how batch rule updates for Azure Front Door rule sets apply multiple rule changes atomically for safe, repeatable Infrastructure-as-Code deployments.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 08/11/2026
---

# Batch rule updates for Azure Front Door rule sets

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door Standard and Premium support batch rule updates for rule sets. This feature helps you safely and predictably update multiple rules in a rule set, ensuring that all rule changes are applied together or not applied at all. Batch rule updates are especially useful for Infrastructure as Code (IaC) scenarios like Terraform, ARM/REST, Azure CLI, or PowerShell, where deterministic deployments are required.

By default, Azure Front Door continues to use the existing rule management model to maintain full backward compatibility.

In large or complex rule sets, updating or reordering rules individually can lead to:

- Temporary or inconsistent rule behavior during updates.
- Deployment failures or retries in IaC workflows.
- Operational risk when multiple updates happen in parallel.

Batch rule updates eliminate these problems by applying rule changes together at the rule set level.

## Rule management modes

Azure Front Door supports two rule management modes at the rule set level.

### Classic rule updates (default)

This mode is the existing behavior and remains the default for all customers. It's best for simple configurations or incremental rule changes.

- Each rule is managed independently.
- Update rules by using individual rule create, update, and delete operations.
- Reordering or bulk edits aren't atomic.
- No changes are required for existing configurations.

### Batch rule updates (opt-in)

This mode enables batch updates for all rules in a rule set. It's best for large rule sets, frequent reordering, and IaC-driven deployments.

- Update rules as a set, not individually.
- All rule changes succeed or fail together.
- Eliminate transient or partial rule states.
- Use the mode for safe, repeatable automation (Terraform, CLI, PowerShell).

## How batch rule updates work

### Batch mode at the rule set level

Enable batch updates by creating a rule set with batch mode enabled.

- Explicitly, opt in to batch mode at the rule set level.
- Batch mode is immutable after creation.

### Declaring rules

When you enable batch mode:

- Add, update, or delete rules with the proper order.
- The array represents the desired final state of the rule set.
- Azure Front Door computes the changes and applies them in a batch, which succeeds or fails together.

## Backward compatibility

This feature is fully backward compatible:

- Existing rule sets continue to function without changes.
- Default behavior remains unchanged.
- You must explicitly opt in to batch mode.
- You need to create a new rule set to change the mode.

## Choose the right mode

| Scenario                      | Recommended mode             |
|-------------------------------|------------------------------|
| Few rules, occasional updates | Classic                      |
| Large rule sets               | Batch                        |
| Frequent reordering           | Batch                        |
| Terraform / IaC deployments   | Batch                        |
| Portal-only management        | Classic (or Batch if needed) |

## Important considerations

- After batch mode is enabled, you can't switch to classic mode.
- To switch modes, create a new rule set and reassociate routes.
- Batch operations enforce size and operation limits to ensure platform reliability.

## Batch rule set quota limits

- Maximum rules per rule set: Up to 100 rules per rule set, consistent with [Azure subscription and service limits, quotas, and constraints](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-front-door-standard-and-premium-service-limits). However, any rule that enables caching under Route Override counts as two rules. For example, if a rule set contains 99 rules and 2 of those rules have caching enabled, the effective rule count becomes 97 + (2 × 2) = 101, which exceeds the limit and causes the configuration update to fail.

- Batch update consideration with caching enabled: If a rule set contains 50 rules and all have caching enabled, the effective rule count is 50 × 2 = 100, which reaches the rule set limit. Attempting to replace all 50 rules in a single batch update fails, because during the operation the existing rules (counted as 100) must be deleted *before* the new rules are added, temporarily exceeding the quota. The recommended approach is to perform the update in two batches of 25 rules to stay within the effective rule limit during the replacement process.

## Related content

- [What is a rule set?](front-door-rules-engine.md?pivots=front-door-standard-premium)
- [Configure rule sets](standard-premium/how-to-configure-rule-set.md)
- [Rules engine scenarios and configurations](rules-engine-scenarios.md)


