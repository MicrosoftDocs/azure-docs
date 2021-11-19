---
title: Policy definitions for tagging resources
description: Describes the Azure Policy definitions that you can assign to ensure tag compliance.
ms.topic: conceptual
ms.date: 07/21/2021
---

# Assign policy definitions for tag compliance

You use [Azure Policy](../../governance/policy/overview.md) to enforce tagging rules and conventions. By creating a policy, you avoid the scenario of resources being deployed to your subscription that don't have the expected tags for your organization. Instead of manually applying tags or searching for resources that aren't compliant, you create a policy that automatically applies the needed tags during deployment. Tags can also now be applied to existing resources with the new [Modify](../../governance/policy/concepts/effects.md#modify) effect and a [remediation task](../../governance/policy/how-to/remediate-resources.md). The following section shows example policy definitions for tags.

## Policy definitions

[!INCLUDE [Tag policies](../../../includes/policy/reference/bycat/policies-tags.md)]

## Next steps

* To learn about tagging resources, see [Use tags to organize your Azure resources](tag-resources.md).
* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
