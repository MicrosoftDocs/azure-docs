---
title: include file
description: include file
services: lighthouse
author: JnHs
ms.service: lighthouse
ms.topic: include
ms.date: 12/19/2019
ms.author: jenhayes
ms.custom: include file
---

These samples show how to use Azure Policy with subscriptions that have been onboarded for Azure delegated resource management.

| **Template** | **Description** |
|---------|---------|
| [policy-add-or-replace-tag](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/policy-add-or-replace-tag) | Assigns a policy that adds or removes a tag (using the modify effect) to a delegated subscription. For more info, see [Deploy a policy that can be remediated within a delegated subscription](../articles/lighthouse/how-to/deploy-policy-remediation.md). |
| [policy-audit-delegation](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/policy-audit-delegation) | Assigns a policy that will audit for delegation assignments. |
| [policy-enforce-keyvault-monitoring](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/policy-enforce-keyvault-monitoring) | Assigns a policy that enables diagnostics on Azure Key Vault resources in a delegated subscriptions (using the deployIfNotExists effect). For more info, see [Deploy a policy that can be remediated within a delegated subscription](../articles/lighthouse/how-to/deploy-policy-remediation.md). |
| [policy-enforce-sub-monitoring](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/policy-enforce-sub-monitoring) | Assigns several policies to enable diagnostics on a delegated subscription, and connects all Windows & Linux VMs to the Log Analytics workspace created by the policy. For more info, see [Deploy a policy that can be remediated within a delegated subscription](../articles/lighthouse/how-to/deploy-policy-remediation.md). |
| [policy-initiative](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/policy-initiative) | Applies an initiative (multiple related policy definitions) to a delegated subscription. |

