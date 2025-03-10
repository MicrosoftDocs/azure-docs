---
title: "Tutorial: Manage tag governance with Azure Policy"
description: In this tutorial, you use the modify effect of Azure Policy to create and enforce a tag governance model on new and existing resources.
ms.date: 03/04/2025
ms.topic: tutorial
---

# Tutorial: Manage tag governance with Azure Policy

[Tags](../../../azure-resource-manager/management/tag-resources.md) are a crucial part of organizing your Azure resources into a taxonomy. When following [best practices for tag management](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging#naming-and-tagging-resources), tags can be the basis for applying your business policies with Azure Policy or [tracking costs with Cost Management](../../../cost-management-billing/costs/cost-mgt-best-practices.md#tag-shared-resources). No matter how or why you use tags, it's important that you can quickly add, change, and remove those tags on your Azure resources. To see whether your Azure resource supports tagging, see [Tag support](../../../azure-resource-manager/management/tag-support.md).

Azure Policy's [modify](../concepts/effect-modify.md) effect is designed to aid in the governance of tags no matter what stage of resource governance you are in. `Modify` helps when:

- You're new to the cloud and have no tag governance.
- Already have thousands of resources with no tag governance.
- Already have an existing taxonomy that you need changed.

In this tutorial, you complete the following tasks:

> [!div class="checklist"]
> - Identify your business requirements
> - Map each requirement to a policy definition
> - Group the tag policies into an initiative

## Prerequisites

To complete this tutorial, you need an Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Identify requirements

Like any good implementation of governance controls, the requirements should come from your business needs and be well understood before creating technical controls. For this scenario tutorial, the following items are our business requirements:

- Two required tags on all resources: _CostCenter_ and `Env`.
- _CostCenter_ must exist on all containers and individual resources.
  - Resources inherit from the container they're in, but might be individually overridden.
- `Env` must exist on all containers and individual resources.
  - Resources determine environment by container naming scheme and might not be overridden.
  - All resources in a container are part of the same environment.

## Configure the CostCenter tag

In terms specific to an Azure environment managed by Azure Policy, the _CostCenter_ tag requirements
call for the following outcomes:

- Deny resource groups missing the _CostCenter_ tag.
- Modify resources to add the _CostCenter_ tag from the parent resource group when missing.

### Deny resource groups missing the CostCenter tag

Because the _CostCenter_ for a resource group can't be determined by the name of the resource group, it must have the tag defined on the request to create the resource group. The following policy rule with the [deny](../concepts/effect-deny.md) effect prevents the creation or updating of resource groups that don't have the _CostCenter_ tag:

```json
"if": {
  "allOf": [
    {
      "field": "type",
      "equals": "Microsoft.Resources/subscriptions/resourceGroups"
    },
    {
      "field": "tags['CostCenter']",
      "exists": false
    }
  ]
},
"then": {
  "effect": "deny"
}
```

> [!NOTE]
> As this policy rule targets a resource group, the `mode` on the policy definition must be `All`
> instead of `Indexed`.

### Modify resources to inherit the CostCenter tag when missing

The second _CostCenter_ need is for any resources to inherit the tag from the parent resource group
when it's missing. If the tag is already defined on the resource, even if different from the parent
resource group, it must be left alone. The following policy rule uses
[modify](../concepts/effect-modify.md):

```json
"policyRule": {
  "if": {
    "field": "tags['CostCenter']",
    "exists": "false"
  },
  "then": {
    "effect": "modify",
    "details": {
      "roleDefinitionIds": [
        "/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
      ],
      "operations": [
        {
          "operation": "add",
          "field": "tags['CostCenter']",
          "value": "[resourcegroup().tags['CostCenter']]"
        }
      ]
    }
  }
}
```

This policy rule uses the `add` operation instead of `addOrReplace` as we don't want to alter
the tag value if it's present when [remediating](../how-to/remediate-resources.md) existing
resources. It also uses the `[resourcegroup()]` template function to get the tag value from the
parent resource group.

> [!NOTE]
> As this policy rule targets resources that support tags, the _mode_ on the policy definition must
> be 'Indexed'. This configuration also ensures this policy skips resource groups.

## Configure the Env tag

In terms specific to an Azure environment managed by Azure Policy, the `Env` tag requirements call
for the following outcomes:

- Modify the `Env` tag on the resource group based on the naming scheme of the resource group
- Modify the `Env` tag on all resources in the resource group to the same as the parent resource
  group

### Modify resource groups Env tag based on name

A [modify](../concepts/effect-modify.md) policy is required for each environment that exists in
your Azure environment. The `modify` policy for each looks something like this policy definition:

```json
"policyRule": {
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Resources/subscriptions/resourceGroups"
      },
      {
        "field": "name",
        "like": "prd-*"
      },
      {
        "field": "tags['Env']",
        "notEquals": "Production"
      }
    ]
  },
  "then": {
    "effect": "modify",
    "details": {
      "roleDefinitionIds": [
        "/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
      ],
      "operations": [
        {
          "operation": "addOrReplace",
          "field": "tags['Env']",
          "value": "Production"
        }
      ]
    }
  }
}
```

> [!NOTE]
> As this policy rule targets a resource group, the `mode` on the policy definition must be `All`
> instead of `Indexed`.

This policy only matches resource groups with the sample naming scheme used for production resources
of `prd-`. More complex naming scheme's can be achieved with several `match` conditions instead of
the single `like` in this example.

### Modify resources to inherit the Env tag

The business requirement calls for all resources to have the `Env` tag that their parent resource
group does. This tag can't be overridden, so use the `addOrReplace` operation with the
[modify](../concepts/effect-modify.md) effect. The sample `modify` policy looks like the following
rule:

```json
"policyRule": {
  "if": {
    "anyOf": [
      {
        "field": "tags['Env']",
        "notEquals": "[resourcegroup().tags['Env']]"
      },
      {
        "field": "tags['Env']",
        "exists": false
      }
    ]
  },
  "then": {
    "effect": "modify",
    "details": {
      "roleDefinitionIds": [
        "/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
      ],
      "operations": [
        {
          "operation": "addOrReplace",
          "field": "tags['Env']",
          "value": "[resourcegroup().tags['Env']]"
        }
      ]
    }
  }
}
```

> [!NOTE]
> As this policy rule targets resources that support tags, the `mode` on the policy definition must
> be `Indexed`. This configuration also ensures this policy skips resource groups.

This policy rule looks for any resource that doesn't have its parent resource groups value for the
`Env` tag or is missing the `Env` tag. Matching resources have their `Env` tag set to the parent
resource groups value, even if the tag already existed on the resource but with a different value.

## Assign the initiative and remediate resources

After the tag policies are created, join them into a single initiative for tag governance and
assign them to a management group or subscription. The initiative and included policies then
evaluate compliance of existing resources and alters requests for new or updated resources that
match the `if` property in the policy rule. However, the policy doesn't automatically update
existing non-compliant resources with the defined tag changes.

Like [deployIfNotExists](../concepts/effect-deploy-if-not-exists.md) policies, the `modify` policy
uses remediation tasks to alter existing non-compliant resources. Follow the directions on
[How-to remediate resources](../how-to/remediate-resources.md) to identify your non-compliant
`modify` resources and correct the tags to your defined taxonomy.

## Clean up resources

If you're done working with resources from this tutorial, use the following steps to delete any of
the assignments or definitions you created:

1. Select **Definitions** (or **Assignments** if you're trying to delete an assignment) under
   **Authoring** in the left side of the Azure Policy page.

1. Search for the new initiative or policy definition (or assignment) you want to remove.

1. Right-click the row or select the ellipses at the end of the definition or assignment, and
   select **Delete definition** or **Delete assignment**.

## Review

In this tutorial, you learned about the following tasks:

> [!div class="checklist"]
> - Identified your business requirements
> - Mapped each requirement to a policy definition
> - Grouped the tag policies into an initiative

## Next steps

To learn more about the structures of policy definitions, look at this article:

> [!div class="nextstepaction"]
> [Azure Policy definition structure](../concepts/definition-structure-basics.md)
