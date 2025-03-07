---
title: Details of Azure Policy definition structure basics
description: Describes how Azure Policy definition basics are used to establish conventions for Azure resources in your organization.
ms.date: 03/04/2025
ms.topic: conceptual
---

# Azure Policy definition structure basics

Azure Policy definitions describe resource compliance [conditions](./definition-structure-policy-rule.md#conditions) and the effect to take if a condition is met. A condition compares a resource property [field](./definition-structure-policy-rule.md#fields) or a [value](./definition-structure-policy-rule.md#value) to a required value. Resource property fields are accessed by using [aliases](./definition-structure-alias.md). When a resource property field is an array, a special [array alias](./definition-structure-alias.md#understanding-the-array-alias) can be used to select values from all array members and apply a condition to each one. Learn more about [conditions](./definition-structure-policy-rule.md#conditions).

By using policy assignments, you can control costs and manage your resources. For example, you can specify that only certain types of virtual machines are allowed. Or, you can require that resources have a particular tag. Assignments at a scope apply to all resources at that scope and below. If a policy assignment is applied to a resource group, it's applicable to all the resources in that resource group.

You use JSON to create a policy definition that contains elements for:

- `displayName`
- `description`
- `mode`
- `version`
- `metadata`
- `parameters`
- `policyRule`
  - logical evaluations
  - `effect`

For example, the following JSON shows a policy that limits where resources are deployed:

```json
{
  "properties": {
    "displayName": "Allowed locations",
    "description": "This policy enables you to restrict the locations your organization can specify when deploying resources.",
    "mode": "Indexed",
    "metadata": {
      "version": "1.0.0",
      "category": "Locations"
    },
    "parameters": {
      "allowedLocations": {
        "type": "array",
        "metadata": {
          "description": "The list of locations that can be specified when deploying resources",
          "strongType": "location",
          "displayName": "Allowed locations"
        },
        "defaultValue": [
          "westus2"
        ]
      }
    },
    "policyRule": {
      "if": {
        "not": {
          "field": "location",
          "in": "[parameters('allowedLocations')]"
        }
      },
      "then": {
        "effect": "deny"
      }
    }
  }
}
```

For more information, go to the [policy definition schema](https://schema.management.azure.com/schemas/2020-10-01/policyDefinition.json). Azure Policy built-ins and patterns are at [Azure Policy samples](../samples/index.md).

## Display name and description

You use `displayName` and `description` to identify the policy definition and provide context for when the definition is used. The `displayName` has a maximum length of _128_ characters and `description` a maximum length of _512_ characters.

> [!NOTE]
> During the creation or updating of a policy definition, `id`, `type`, and `name` are defined
> by properties external to the JSON and aren't necessary in the JSON file. Fetching the policy
> definition via SDK returns the `id`, `type`, and `name` properties as part of the JSON, but
> each are read-only information related to the policy definition.

## Policy type

While the `policyType` property can't be set, there are three values returned by SDK and visible in the portal:

- `Builtin`: Microsoft provides and maintains these policy definitions.
- `Custom`: All policy definitions created by customers have this value.
- `Static`: Indicates a [Regulatory Compliance](./regulatory-compliance.md) policy definition with Microsoft **Ownership**. The compliance results for these policy definitions are the results of non-Microsoft audits of Microsoft infrastructure. In the Azure portal, this value is sometimes displayed as **Microsoft managed**. For more information, see [Shared responsibility in the cloud](../../../security/fundamentals/shared-responsibility.md).

## Mode

The `mode` is configured depending on if the policy is targeting an Azure Resource Manager property or a Resource Provider property.

### Resource Manager modes

The `mode` determines which resource types are evaluated for a policy definition. The supported modes are:

- `all`: evaluate resource groups, subscriptions, and all resource types
- `indexed`: only evaluate resource types that support tags and location

For example, resource `Microsoft.Network/routeTables` supports tags and location and is evaluated in both modes. However, resource `Microsoft.Network/routeTables/routes` can't be tagged and isn't evaluated in `indexed` mode.

We recommend that you set `mode` to `all` in most cases. All policy definitions created through the portal use the `all` mode. If you use PowerShell or Azure CLI, you can specify the `mode` parameter manually. If the policy definition doesn't include a `mode` value, it defaults to `all` in Azure PowerShell and to `null` in Azure CLI. A `null` mode is the same as using `indexed` to support backward compatibility.

`indexed` should be used when creating policies that enforce tags or locations. While not required, it prevents resources that don't support tags and locations from showing up as non-compliant in the compliance results. The exception is resource groups and subscriptions. Policy definitions that enforce location or tags on a resource group or subscription should set `mode` to `all` and specifically target the `Microsoft.Resources/subscriptions/resourceGroups` or `Microsoft.Resources/subscriptions` type. For an example, see [Pattern: Tags - Sample #1](../samples/pattern-tags.md). For a list of resources that support tags, see [Tag support for Azure resources](../../../azure-resource-manager/management/tag-support.md).

### Resource Provider modes

The following Resource Provider modes are fully supported:

- `Microsoft.Kubernetes.Data` for managing Kubernetes clusters and components such as pods, containers, and ingresses. Supported for Azure Kubernetes Service clusters and [Azure Arc-enabled Kubernetes clusters](/azure/aks/what-is-aks). Definitions using this Resource Provider mode use the effects _audit_, _deny_, and _disabled_.
- `Microsoft.KeyVault.Data` for managing vaults and certificates in [Azure Key Vault](/azure/key-vault/general/overview). For more information on these policy  definitions, see [Integrate Azure Key Vault with Azure Policy](/azure/key-vault/general/azure-policy).
- `Microsoft.Network.Data` for managing [Azure Virtual Network Manager](../../../virtual-network-manager/overview.md) custom membership policies using Azure Policy.

The following Resource Provider modes are currently supported as a [preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/):

- `Microsoft.ManagedHSM.Data` for managing [Managed Hardware Security Module (HSM)](/azure/key-vault/managed-hsm/azure-policy) keys using Azure Policy.
- `Microsoft.DataFactory.Data` for using Azure Policy to deny [Azure Data Factory](../../../data-factory/introduction.md) outbound traffic domain names not specified in an allowlist. This Resource Provider mode is enforcement only and doesn't report compliance in public preview.
- `Microsoft.MachineLearningServices.v2.Data` for managing [Azure Machine Learning](/azure/machine-learning/overview-what-is-azure-machine-learning) model deployments. This Resource Provider mode reports compliance for newly created and updated components. During public preview, compliance records remain for 24 hours. Model deployments that exist before these policy definitions are assigned don't report compliance.
- `Microsoft.LoadTestService.Data` for restricting [Azure Load Testing](../../../load-testing/how-to-use-azure-policy.md) instances to private endpoints.

> [!NOTE]
> Unless explicitly stated, Resource Provider modes only support built-in policy definitions, and exemptions are not supported at the component-level.

When Azure Policy versioning is released, the following Resource Provider modes won't support built-in versioning:

- `Microsoft.DataFactory.Data`
- `Microsoft.MachineLearningServices.v2.Data`
- `Microsoft.ManagedHSM.Data`

## Version (preview)

Built-in policy definitions can host multiple versions with the same `definitionID`. If no version number is specified, all experiences will show the latest version of the definition. To see a specific version of a built-in, it must be specified in API, SDK or UI. To reference a specific version of a definition within an assignment, see [definition version within assignment](../concepts/assignment-structure.md#policy-definition-id-and-version-preview)

The Azure Policy service uses `version`, `preview`, and `deprecated` properties to convey state and level of change to a built-in policy definition or initiative. The format of `version` is: `{Major}.{Minor}.{Patch}`. When a policy definition is in preview state, the suffix _preview_ is appended to the `version` property and treated as a **boolean**. When a policy definition is deprecated, the deprecation is captured as a boolean in the definition's metadata using `"deprecated": "true"`.

- Major Version (example: 2.0.0): introduce breaking changes such as major rule logic changes, removing parameters, adding an enforcement effect by default.
- Minor Version (example: 2.1.0): introduce changes such as minor rule logic changes, adding new parameter allowed values, change to `roleDefinitionIds`, adding or moving definitions within an initiative.
- Patch Version (example: 2.1.4): introduce string or metadata changes and break glass security scenarios (rare).

For more information about Azure Policy versions built-ins, see [Built-in versioning](https://github.com/Azure/azure-policy/blob/master/built-in-policies/README.md). To learn more about what it means for a policy to be _deprecated_ or in _preview_, see [Preview and deprecated policies](https://github.com/Azure/azure-policy/blob/master/built-in-policies/README.md#preview-and-deprecated-policies).

## Metadata

The optional `metadata` property stores information about the policy definition. Customers can define any properties and values useful to their organization in `metadata`. However, there are some _common_ properties used by Azure Policy and in built-ins. Each `metadata` property has a limit of 1,024 characters.

### Common metadata properties

- `version` (string): Tracks details about the version of the contents of a policy definition.
- `category` (string): Determines under which category in the Azure portal the policy definition is displayed.
- `preview` (boolean): True or false flag for if the policy definition is _preview_.
- `deprecated` (boolean): True or false flag for if the policy definition is marked as  _deprecated_.
- `portalReview` (string): Determines whether parameters should be reviewed in the portal, regardless of the required input.

## Definition location

While creating an initiative or policy, it's necessary to specify the definition location. The definition location must be a management group or a subscription. This location determines the scope to which the initiative or policy can be assigned. Resources must be direct members of or children within the hierarchy of the definition location to target for assignment.

If the definition location is a:

- **Subscription** - Only resources within that subscription can be assigned the policy definition.
- **Management group** - Only resources within child management groups and child subscriptions can be assigned the policy definition. If you plan to apply the policy definition to several subscriptions, the location must be a management group that contains each subscription.

For more information, see [Understand scope in Azure Policy](./scope.md#definition-location).

## Next steps

- For more information about policy definition structure, go to [parameters](./definition-structure-parameters.md), [policy rule](./definition-structure-policy-rule.md), and [alias](./definition-structure-alias.md).
- For initiatives, go to [initiative definition structure](./initiative-definition-structure.md).
- Review examples at [Azure Policy samples](../samples/index.md).
- Review [Understanding policy effects](effect-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
