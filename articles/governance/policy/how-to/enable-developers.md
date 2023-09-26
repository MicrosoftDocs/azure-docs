---
title: Bring awareness of Policy enforcement sooner
description: 
ms.date: 08/17/2021
ms.topic: conceptual
---
# Evaluate the impact of a new Azure Policy definition

Azure Policy is a powerful tool for managing your Azure resources to meet business standards
compliance needs. When people, processes, or pipelines create or update resources, Azure Policy
reviews the request. When the policy definition effect is [Modify](./effects.md#modify),
[Append](./effects.md#deny), or [DeployIfNotExists](./effects.md#deployifnotexists), Policy alters
the request or adds to it. When the policy definition effect is [Audit](./effects.md#audit) or
[AuditIfNotExists](./effects.md#auditifnotexists), Policy causes an Activity log entry to be created
for new and updated resources. And when the policy definition effect is [Deny](./effects.md#deny) or [DenyAction](./effects.md#denyaction-preview), Policy stops the creation or alteration of the request.

These outcomes are exactly as desired when you know the policy is defined correctly. However, it's
important to 

The tools to help bring awareness of Policy enforcement are:

- Policy assignment noncompliance messages 
- Policy aware Portal experience 
- Deployment What if API

## Policy assignment noncompliance messages 

Policy assignments have a property of nonComplianceMessages that allow for text input of 

```json
"nonComplianceMessages": [
    {
        "message": "Default message"
    }
]
```



## Next steps

- Learn about the [policy definition structure](./definition-structure.md).
- Learn about the [policy assignment structure](./assignment-structure.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with
  [Organize your resources with Azure management groups](../../management-groups/overview.md).
