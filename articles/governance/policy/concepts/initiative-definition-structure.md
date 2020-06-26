---
title: Details of the initiative definition structure
description: Describes how policy initiative definitions are used to group policy definitions for deployment to Azure resources in your organization.
ms.date: 05/29/2020
ms.topic: conceptual
---
# Azure Policy initiative definition structure

Initiatives enable you to group several related policy definitions to simplify assignments and
management because you work with a group as a single item. For example, you can group related
tagging policy definitions into a single initiative. Rather than assigning each policy individually,
you apply the initiative.

You use JSON to create a policy initiative definition. The policy initiative definition contains
elements for:

- display name
- description
- metadata
- parameters
- policy definitions
- policy groups (this property is part of the [Regulatory Compliance (Preview) feature](./regulatory-compliance.md))

The following example illustrates how to create an initiative for handling two tags: `costCenter`
and `productName`. It uses two built-in policies to apply the default tag value.

```json
{
    "properties": {
        "displayName": "Billing Tags Policy",
        "policyType": "Custom",
        "description": "Specify cost Center tag and product name tag",
        "metadata": {
            "version": "1.0.0",
            "category": "Tags"
        },
        "parameters": {
            "costCenterValue": {
                "type": "String",
                "metadata": {
                    "description": "required value for Cost Center tag"
                },
                "defaultValue": "DefaultCostCenter"
            },
            "productNameValue": {
                "type": "String",
                "metadata": {
                    "description": "required value for product Name tag"
                },
                "defaultValue": "DefaultProduct"
            }
        },
        "policyDefinitions": [{
                "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/1e30110a-5ceb-460c-a204-c1c3969c6d62",
                "parameters": {
                    "tagName": {
                        "value": "costCenter"
                    },
                    "tagValue": {
                        "value": "[parameters('costCenterValue')]"
                    }
                }
            },
            {
                "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498",
                "parameters": {
                    "tagName": {
                        "value": "costCenter"
                    },
                    "tagValue": {
                        "value": "[parameters('costCenterValue')]"
                    }
                }
            },
            {
                "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/1e30110a-5ceb-460c-a204-c1c3969c6d62",
                "parameters": {
                    "tagName": {
                        "value": "productName"
                    },
                    "tagValue": {
                        "value": "[parameters('productNameValue')]"
                    }
                }
            },
            {
                "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498",
                "parameters": {
                    "tagName": {
                        "value": "productName"
                    },
                    "tagValue": {
                        "value": "[parameters('productNameValue')]"
                    }
                }
            }
        ]
    }
}
```

Azure Policy built-ins and patterns are at [Azure Policy samples](../samples/index.md).

## Metadata

The optional `metadata` property stores information about the policy initiative definition.
Customers can define any properties and values useful to their organization in `metadata`. However,
there are some _common_ properties used by Azure Policy and in built-ins.

### Common metadata properties

- `version` (string): Tracks details about the version of the contents of a policy initiative
  definition.
- `category` (string): Determines under which category in Azure portal the policy definition is
  displayed.

  > [!NOTE]
  > For a [Regulatory Compliance](./regulatory-compliance.md) initiative, the `category` must be
  > **Regulatory Compliance**.

- `preview` (boolean): True or false flag for if the policy initiative definition is _preview_.
- `deprecated` (boolean): True or false flag for if the policy initiative definition has been marked
  as _deprecated_.

> [!NOTE]
> The Azure Policy service uses `version`, `preview`, and `deprecated` properties to convey level of
> change to a built-in policy definition or initiative and state. The format of `version` is:
> `{Major}.{Minor}.{Patch}`. Specific states, such as _deprecated_ or _preview_, are appended to the
> `version` property or in another property as a **boolean**. For more information about the way
> Azure Policy versions built-ins, see
> [Built-in versioning](https://github.com/Azure/azure-policy/blob/master/built-in-policies/README.md).

## Parameters

Parameters help simplify your policy management by reducing the number of policy definitions. Think
of parameters like the fields on a form – `name`, `address`, `city`, `state`. These parameters
always stay the same, however their values change based on the individual filling out the form.
Parameters work the same way when building policy initiatives. By including parameters in a policy
initiative definition, you can reuse that parameter in the included policies.

> [!NOTE]
> Once an initiative is assigned, initative level parameters can't be altered. Due to this, the
> recommendation is to set a **defaultValue** when defining the parameter.

### Parameter properties

A parameter has the following properties that are used in the policy initiative definition:

- `name`: The name of your parameter. Used by the `parameters` deployment function within the policy
  rule. For more information, see
  [using a parameter value](#passing-a-parameter-value-to-a-policy-definition).
- `type`: Determines if the parameter is a **string**, **array**, **object**, **boolean**,
  **integer**, **float**, or **datetime**.
- `metadata`: Defines subproperties primarily used by the Azure portal to display user-friendly
  information:
  - `description`: The explanation of what the parameter is used for. Can be used to provide
    examples of acceptable values.
  - `displayName`: The friendly name shown in the portal for the parameter.
  - `strongType`: (Optional) Used when assigning the policy definition through the portal. Provides
    a context aware list. For more information, see [strongType](#strongtype).
- `defaultValue`: (Optional) Sets the value of the parameter in an assignment if no value is given.
- `allowedValues`: (Optional) Provides an array of values that the parameter accepts during
  assignment.

As an example, you could define a policy initiative definition to limit the locations of resources
in the various included policy definitions. A parameter for that policy initiative definition could
be **allowedLocations**. The parameter is then available to each included policy definition and
defined during assignment of the policy initiative.

```json
"parameters": {
    "init_allowedLocations": {
        "type": "array",
        "metadata": {
            "description": "The list of allowed locations for resources.",
            "displayName": "Allowed locations",
            "strongType": "location"
        },
        "defaultValue": [ "westus2" ],
        "allowedValues": [
            "eastus2",
            "westus2",
            "westus"
        ]
    }
}
```

### Passing a parameter value to a policy definition

You declare which initiative parameters you pass to which included policy definitions in the
[policyDefinitions](#policy-definitions) array of the initiative definition. While the parameter
name can be the same, using different names in the initiatives than in the policy definitions
simplifies code readability.

For example, the **init_allowedLocations** initiative parameter defined previously can be passed to
several included policy definitions and their parameters, **sql_locations** and **vm_locations**,
like this:

```json
"policyDefinitions": [
    {
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/0ec8fc28-d5b7-4603-8fec-39044f00a92b",
        "policyDefinitionReferenceId": "allowedLocationsSQL",
        "parameters": {
            "sql_locations": {
                "value": "[parameters('init_allowedLocations')]"
            }
        }
    },
    {
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/aa09bd0f-aa5f-4343-b6ab-a33a6a6304f3",
        "policyDefinitionReferenceId": "allowedLocationsVMs",
        "parameters": {
            "vm_locations": {
                "value": "[parameters('init_allowedLocations')]"
            }
        }
    }
]
```

This sample references the **init_allowedLocations** parameter that was demonstrated in [parameter
properties](#parameter-properties).

### strongType

Within the `metadata` property, you can use **strongType** to provide a multi-select list of options
within the Azure portal. **strongType** can be a supported _resource type_ or an allowed
value. To determine if a _resource type_ is valid for **strongType**, use
[Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider).

Some resource types not returned by **Get-AzResourceProvider** are supported. Those resource types
are:

- `Microsoft.RecoveryServices/vaults/backupPolicies`

The non-resource type allowed values for **strongType** are:

- `location`
- `resourceTypes`
- `storageSkus`
- `vmSKUs`
- `existingResourceGroups`

## Policy definitions

The `policyDefinitions` portion of the initiative definition is an _array_ of which existing policy
definitions are included in the initiative. As mentioned in
[Passing a parameter value to a policy definition](#passing-a-parameter-value-to-a-policy-definition),
this property is where [initiative parameters](#parameters) are passed to the policy definition.

### Policy definition properties

Each _array_ element that represents a policy definition has the following properties:

- `policyDefinitionId` (string): The ID of the custom or built-in policy definition to include.
- `policyDefinitionReferenceId` (string): A short name for the included policy definition.
- `parameters`: (Optional) The name/value pairs for passing an initiative parameter to the
  included policy definition as a property in that policy definition. For more information, see
  [Parameters](#parameters).
- `groupNames` (array of strings): (Optional) The group the policy definition is a member of. For
  more information, see [Policy groups](#policy-definition-groups).

Here is an example of `policyDefinitions` that has two included policy definitions that are each
passed the same initiative parameter:

```json
"policyDefinitions": [
    {
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/0ec8fc28-d5b7-4603-8fec-39044f00a92b",
        "policyDefinitionReferenceId": "allowedLocationsSQL",
        "parameters": {
            "sql_locations": {
                "value": "[parameters('init_allowedLocations')]"
            }
        }
    },
    {
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/aa09bd0f-aa5f-4343-b6ab-a33a6a6304f3",
        "policyDefinitionReferenceId": "allowedLocationsVMs",
        "parameters": {
            "vm_locations": {
                "value": "[parameters('init_allowedLocations')]"
            }
        }
    }
]
```

## <a name="policy-definition-groups"></a>Policy definitions groups (Preview)

As part of Azure Policy's [Regulatory Compliance](./regulatory-compliance.md) (Preview) feature,
policy definitions in an initiative definition can be grouped. This information is defined in the
`policyDefinitionGroups` _array_ property. These groupings have additional details such as the
**control** and **compliance domain** that the policy definition provides coverage towards.
Additional grouping details may be found in a **policyMetadata** object created by Microsoft. For
information, see [metadata objects](#metadata-objects).

### Policy definition groups parameters

Each _array_ element in `policyDefinitionGroups` must have both of the following properties:

- `name` (string) \[required\]: The short name for the **control**. The value of this property is
  used by `groupNames` in `policyDefinitions`.
- `category` (string): The **compliance domain** of the control.
- `displayName` (string): The friendly name for the **control**. Used by the portal.
- `description` (string): A description of what the **control** does.
- `additionalMetadataId` (string): The location of the [policyMetadata](#metadata-objects) object
  that has additional details about the **control** and **compliance domain**.

  > [!NOTE]
  > Customers may point to an existing [policyMetadata](#metadata-objects) object. However, these
  > objects are _read-only_ and only created by Microsoft.

An example of the `policyDefinitionGroups` property from the NIST built-in initiative definition
looks like this:

```json
"policyDefinitionGroups": [
    {
        "name": "NIST_SP_800-53_R4_AC-1",
        "additionalMetadataId": "/providers/Microsoft.PolicyInsights/policyMetadata/NIST_SP_800-53_R4_AC-1"
    }
]
```

### Metadata objects

Regulatory Compliance built-ins created by Microsoft have additional information about each control.
This information is:

- Displayed in the Azure portal on the overview of a **control** on a Regulatory Compliance
  initiative.
- Available via REST API. See the `Microsoft.PolicyInsights` resource provider and the
  [policyMetadata operation group](/rest/api/policy-insights/policymetadata/getresource).
- Available via Azure CLI. See the
  [az policy metadata](/cli/azure/policy/metadata?view=azure-cli-latest) command.

> [!IMPORTANT]
> Metadata objects for Regulatory Compliance are _read-only_ and can't be created by customers.

The metadata for a policy grouping has the following information in the `properties` node:

- `metadataId`: The **Control ID** the grouping relates to.
- `category` (required): The **compliance domain** the **control** belongs to.
- `title` (required): The friendly name of the **Control ID**.
- `owner` (required): Identifies who has responsibility for the control in Azure: _Customer_,
  _Microsoft_, _Shared_.
- `description`: Additional information about the control.
- `requirements`: Details about responsibility of the implementation of the control.
- `additionalContentUrl`: A link to more information about the control. This property is typically a
  link to the section of documentation that covers this control in the compliance standard.

Below is an example of the **policyMetadata** object. This example metadata belongs to the _NIST SP
800-53 R4 AC-1_ control.

```json
{
  "properties": {
    "metadataId": "NIST SP 800-53 R4 AC-1",
    "category": "Access Control",
    "title": "Access Control Policy and Procedures",
    "owner": "Shared",
    "description": "**The organization:**    \na. Develops, documents, and disseminates to [Assignment: organization-defined personnel or roles]:  \n1. An access control policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and  \n2. Procedures to facilitate the implementation of the access control policy and associated access controls; and  \n  
\nb. Reviews and updates the current:  \n1. Access control policy [Assignment: organization-defined frequency]; and  \n2. Access control procedures [Assignment: organization-defined frequency].",
    "requirements": "**a.**  The customer is responsible for developing, documenting, and disseminating access control policies and procedures. The customer access control policies and procedures address access to all customer-deployed resources and customer system access (e.g., access to customer-deployed virtual machines, access to customer-built applications).  \n**b.**  The customer is responsible for reviewing and updating access control policies and procedures in accordance with FedRAMP requirements.",
    "additionalContentUrl": "https://nvd.nist.gov/800-53/Rev4/control/AC-1"
  },
  "id": "/providers/Microsoft.PolicyInsights/policyMetadata/NIST_SP_800-53_R4_AC-1",
  "name": "NIST_SP_800-53_R4_AC-1",
  "type": "Microsoft.PolicyInsights/policyMetadata"
}
```

## Next steps

- See the [definition structure](./definition-structure.md)
- Review examples at [Azure Policy samples](../samples/index.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
