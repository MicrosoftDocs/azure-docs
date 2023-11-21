---
title: Details of the policy definition structure
description: Describes how policy definitions are used to establish conventions for Azure resources in your organization.
ms.date: 08/15/2023
ms.topic: conceptual
ms.author: davidsmatlak
author: davidsmatlak
---

# Azure Policy definition structure

Azure Policy establishes conventions for resources. Policy definitions describe resource compliance
[conditions](#conditions) and the effect to take if a condition is met. A condition compares a
resource property [field](#fields) or a [value](#value) to a required value. Resource property
fields are accessed by using [aliases](#aliases). When a resource property field is an array, a
special [array alias](#understanding-the--alias) can be used to select values from all array members
and apply a condition to each one. Learn more about [conditions](#conditions).

By defining conventions, you can control costs and more easily manage your resources. For example,
you can specify that only certain types of virtual machines are allowed. Or, you can require that
resources have a particular tag. Policy assignments are inherited by child resources. If a policy
assignment is applied to a resource group, it's applicable to all the resources in that resource
group.

The policy definition _policyRule_ schema is found here:
[https://schema.management.azure.com/schemas/2020-10-01/policyDefinition.json](https://schema.management.azure.com/schemas/2020-10-01/policyDefinition.json)

You use JSON to create a policy definition. The policy definition contains elements for:

- display name
- description
- mode
- metadata
- parameters
- policy rule
  - logical evaluation
  - effect

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
                "defaultValue": [ "westus2" ]
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

Azure Policy built-ins and patterns are at [Azure Policy samples](../samples/index.md).

## Display name and description

You use **displayName** and **description** to identify the policy definition and provide context
for when it's used. **displayName** has a maximum length of _128_ characters and **description**
a maximum length of _512_ characters.

> [!NOTE]
> During the creation or updating of a policy definition, **id**, **type**, and **name** are defined
> by properties external to the JSON and aren't necessary in the JSON file. Fetching the policy
> definition via SDK returns the **id**, **type**, and **name** properties as part of the JSON, but
> each are read-only information related to the policy definition.

## Type

While the **type** property can't be set, there are three values that are returned by SDK and
visible in the portal:

- `Builtin`: These policy definitions are provided and maintained by Microsoft.
- `Custom`: All policy definitions created by customers have this value.
- `Static`: Indicates a [Regulatory Compliance](./regulatory-compliance.md) policy definition with
  Microsoft **Ownership**. The compliance results for these policy definitions are the results of
  third-party audits on Microsoft infrastructure. In the Azure portal, this value is sometimes
  displayed as **Microsoft managed**. For more information, see
  [Shared responsibility in the cloud](../../../security/fundamentals/shared-responsibility.md).

## Mode

**Mode** is configured depending on if the policy is targeting an Azure Resource Manager property or
a Resource Provider property.

### Resource Manager modes

The **mode** determines which resource types are evaluated for a policy definition. The supported
modes are:

- `all`: evaluate resource groups, subscriptions, and all resource types
- `indexed`: only evaluate resource types that support tags and location

For example, resource `Microsoft.Network/routeTables` supports tags and location and is evaluated in
both modes. However, resource `Microsoft.Network/routeTables/routes` can't be tagged and isn't
evaluated in `Indexed` mode.

We recommend that you set **mode** to `all` in most cases. All policy definitions created through
the portal use the `all` mode. If you use PowerShell or Azure CLI, you can specify the **mode**
parameter manually. If the policy definition doesn't include a **mode** value, it defaults to `all`
in Azure PowerShell and to `null` in Azure CLI. A `null` mode is the same as using `indexed` to
support backward compatibility.

`indexed` should be used when creating policies that enforce tags or locations. While not required,
it prevents resources that don't support tags and locations from showing up as non-compliant in the
compliance results. The exception is **resource groups** and **subscriptions**. Policy definitions
that enforce location or tags on a resource group or subscription should set **mode** to `all` and
specifically target the `Microsoft.Resources/subscriptions/resourceGroups` or
`Microsoft.Resources/subscriptions` type. For an example, see
[Pattern: Tags - Sample #1](../samples/pattern-tags.md). For a list of resources that support tags,
see [Tag support for Azure resources](../../../azure-resource-manager/management/tag-support.md).

### Resource Provider modes

The following Resource Provider modes are fully supported:

- `Microsoft.Kubernetes.Data` for managing Kubernetes clusters and components such as pods, containers, and ingresses. Supported for Azure Kubernetes Service clusters and [Azure Arc-enabled Kubernetes clusters](../../../aks/intro-kubernetes.md). Definitions
  using this Resource Provider mode use effects _audit_, _deny_, and _disabled_.
- `Microsoft.KeyVault.Data` for managing vaults and certificates in
  [Azure Key Vault](../../../key-vault/general/overview.md). For more information on these policy
  definitions, see
  [Integrate Azure Key Vault with Azure Policy](../../../key-vault/general/azure-policy.md).
- `Microsoft.Network.Data` for managing [Azure Virtual Network Manager](../../../virtual-network-manager/overview.md) custom membership policies using Azure Policy.

The following Resource Provider modes are currently supported as a **[preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)**:

- `Microsoft.ManagedHSM.Data` for managing [Managed HSM](../../../key-vault/managed-hsm/azure-policy.md) keys using Azure Policy.
- `Microsoft.DataFactory.Data` for using Azure Policy to deny [Azure Data Factory](../../../data-factory/introduction.md) outbound traffic domain names not specified in an allow list.

> [!NOTE]
>Unless explicitly stated, Resource Provider modes only support built-in policy definitions, and exemptions are not supported at the component-level.

## Metadata

The optional `metadata` property stores information about the policy definition. Customers can
define any properties and values useful to their organization in `metadata`. However, there are some
_common_ properties used by Azure Policy and in built-ins. Each `metadata` property has a limit of
1024 characters.

### Common metadata properties

- `version` (string): Tracks details about the version of the contents of a policy definition.
- `category` (string): Determines under which category in the Azure portal the policy definition is
  displayed.
- `preview` (boolean): True or false flag for if the policy definition is _preview_.
- `deprecated` (boolean): True or false flag for if the policy definition has been marked as
  _deprecated_.
- `portalReview` (string): Determines whether parameters should be reviewed in the portal, regardless of the required input.

> [!NOTE]
> The Azure Policy service uses `version`, `preview`, and `deprecated` properties to convey level of
> change to a built-in policy definition or initiative and state. The format of `version` is:
> `{Major}.{Minor}.{Patch}`. Specific states, such as _deprecated_ or _preview_, are appended to the
> `version` property or in another property as a **boolean**. For more information about the way
> Azure Policy versions built-ins, see
> [Built-in versioning](https://github.com/Azure/azure-policy/blob/master/built-in-policies/README.md).
> To learn more about what it means for a policy to be _deprecated_ or in _preview_, see [Preview and deprecated policies](https://github.com/Azure/azure-policy/blob/master/built-in-policies/README.md#preview-and-deprecated-policies).

## Parameters

Parameters help simplify your policy management by reducing the number of policy definitions. Think
of parameters like the fields on a form - `name`, `address`, `city`, `state`. These parameters
always stay the same, however their values change based on the individual filling out the form.
Parameters work the same way when building policies. By including parameters in a policy definition,
you can reuse that policy for different scenarios by using different values.

Parameters may be added to an existing and assigned definition. The new parameter must include the
**defaultValue** property. This prevents existing assignments of the policy or initiative from
indirectly being made invalid.

Parameters can't be removed from a policy definition because there may be an assignment that sets the parameter value, and that reference would become broken. Instead of removing, you can classify the parameter as deprecated in the parameter metadata.

### Parameter properties

A parameter has the following properties that are used in the policy definition:

- `name`: The name of your parameter. Used by the `parameters` deployment function within the
  policy rule. For more information, see [using a parameter value](#using-a-parameter-value).
- `type`: Determines if the parameter is a **string**, **array**, **object**, **boolean**,
  **integer**, **float**, or **datetime**.
- `metadata`: Defines subproperties primarily used by the Azure portal to display user-friendly
  information:
  - `description`: The explanation of what the parameter is used for. Can be used to provide
    examples of acceptable values.
  - `displayName`: The friendly name shown in the portal for the parameter.
  - `strongType`: (Optional) Used when assigning the policy definition through the portal. Provides
    a context aware list. For more information, see [strongType](#strongtype).
  - `assignPermissions`: (Optional) Set as _true_ to have Azure portal create role assignments
    during policy assignment. This property is useful in case you wish to assign permissions outside
    the assignment scope. There's one role assignment per role definition in the policy (or per role
    definition in all of the policies in the initiative). The parameter value must be a valid
    resource or scope.
- `defaultValue`: (Optional) Sets the value of the parameter in an assignment if no value is given. Required when updating an existing policy definition that is assigned. For oject-type parameters, the value must match the appropriate schema.
- `allowedValues`: (Optional) Provides an array of values that the parameter accepts during
  assignment. Allowed value comparisons are case-sensitive. For object-type parameters, the values must match the appropriate schema.
- `schema`: (Optional) Provides validation of parameter inputs during assignment using a self-defined JSON schema. This property is only supported for object-type parameters and follows the [Json.NET Schema](https://www.newtonsoft.com/jsonschema) 2019-09 implementation. You can learn more about using schemas at https://json-schema.org/ and test draft schemas at https://www.jsonschemavalidator.net/.

### Sample Parameters

#### Example 1

As an example, you could define a policy definition to limit the locations where resources can be
deployed. A parameter for that policy definition could be **allowedLocations**. This parameter would
be used by each assignment of the policy definition to limit the accepted values. The use of
**strongType** provides an enhanced experience when completing the assignment through the portal:

```json
"parameters": {
    "allowedLocations": {
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

A sample input for this array-type parameter (without strongType) at assignment time might be ["westus", "eastus2"].

#### Example 2

In a more advanced scenario, you could define a policy that requires Kubernetes cluster pods to use specified labels. A parameter for that policy definition could be **labelSelector**, which would be used by each assignment of the policy definition to specify Kubernetes resources in question based on label keys and values:

```json
"parameters": {
    "labelSelector": {
        "type": "Object",
        "metadata": {
            "displayName": "Kubernetes label selector",
            "description": "Label query to select Kubernetes resources for policy evaluation. An empty label selector matches all Kubernetes resources."
        },
        "defaultValue": {},
        "schema": {
            "description": "A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all resources.",
            "type": "object",
            "properties": {
                "matchLabels": {
                    "description": "matchLabels is a map of {key,value} pairs.",
                    "type": "object",
                    "additionalProperties": {
                        "type": "string"
                    },
                    "minProperties": 1
                },
                "matchExpressions": {
                    "description": "matchExpressions is a list of values, a key, and an operator.",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "key": {
                                "description": "key is the label key that the selector applies to.",
                                "type": "string"
                            },
                            "operator": {
                                "description": "operator represents a key's relationship to a set of values.",
                                "type": "string",
                                "enum": [
                                    "In",
                                    "NotIn",
                                    "Exists",
                                    "DoesNotExist"
                                ]
                            },
                            "values": {
                                "description": "values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty.",
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "key",
                            "operator"
                        ],
                        "additionalProperties": false
                    },
                    "minItems": 1
                }
            },
            "additionalProperties": false
        }
    },
}
```

A sample input for this object-type parameter at assignment time would be in JSON format, validated by the specified schema, and might be:

```json
{
    "matchLabels": {
        "poolID": "abc123",
        "nodeGroup": "Group1",
        "region": "southcentralus"
    },
    "matchExpressions": [
        {
            "key": "name",
            "operator": "In",
            "values": ["payroll", "web"]
        },
        {
            "key": "environment",
            "operator": "NotIn",
            "values": ["dev"]
        }
    ]
}
```

### Using a parameter value

In the policy rule, you reference parameters with the following `parameters` function syntax:

```json
{
    "field": "location",
    "in": "[parameters('allowedLocations')]"
}
```

This sample references the **allowedLocations** parameter that was demonstrated in [parameter
properties](#parameter-properties).

### strongType

Within the `metadata` property, you can use **strongType** to provide a multiselect list of options
within the Azure portal. **strongType** can be a supported _resource type_ or an allowed value. To
determine whether a _resource type_ is valid for **strongType**, use
[Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider). The format for a
_resource type_ **strongType** is `<Resource Provider>/<Resource Type>`. For example,
`Microsoft.Network/virtualNetworks/subnets`.

Some _resource types_ not returned by **Get-AzResourceProvider** are supported. Those types are:

- `Microsoft.RecoveryServices/vaults/backupPolicies`

The non _resource type_ allowed values for **strongType** are:

- `location`
- `resourceTypes`
- `storageSkus`
- `vmSKUs`
- `existingResourceGroups`

## Definition location

While creating an initiative or policy, it's necessary to specify the definition location. The
definition location must be a management group or a subscription. This location determines the scope
to which the initiative or policy can be assigned. Resources must be direct members of or children
within the hierarchy of the definition location to target for assignment.

If the definition location is a:

- **Subscription** - Only resources within that subscription can be assigned the policy definition.
- **Management group** - Only resources within child management groups and child subscriptions can
  be assigned the policy definition. If you plan to apply the policy definition to several
  subscriptions, the location must be a management group that contains each subscription.

For more information, see [Understand scope in Azure Policy](./scope.md#definition-location).

## Policy rule

The policy rule consists of **If** and **Then** blocks. In the **If** block, you define one or more
conditions that specify when the policy is enforced. You can apply logical operators to these
conditions to precisely define the scenario for a policy.

In the **Then** block, you define the effect that happens when the **If** conditions are fulfilled.

```json
{
    "if": {
        <condition> | <logical operator>
    },
    "then": {
        "effect": "deny | audit | modify | denyAction | append | auditIfNotExists | deployIfNotExists | disabled"
    }
}
```

### Logical operators

Supported logical operators are:

- `"not": {condition  or operator}`
- `"allOf": [{condition or operator},{condition or operator}]`
- `"anyOf": [{condition or operator},{condition or operator}]`

The **not** syntax inverts the result of the condition. The **allOf** syntax (similar to the logical
**And** operation) requires all conditions to be true. The **anyOf** syntax (similar to the logical
**Or** operation) requires one or more conditions to be true.

You can nest logical operators. The following example shows a **not** operation that is nested
within an **allOf** operation.

```json
"if": {
    "allOf": [{
            "not": {
                "field": "tags",
                "containsKey": "application"
            }
        },
        {
            "field": "type",
            "equals": "Microsoft.Storage/storageAccounts"
        }
    ]
},
```

### Conditions

A condition evaluates whether a value meets certain criteria. The supported conditions are:

- `"equals": "stringValue"`
- `"notEquals": "stringValue"`
- `"like": "stringValue"`
- `"notLike": "stringValue"`
- `"match": "stringValue"`
- `"matchInsensitively": "stringValue"`
- `"notMatch": "stringValue"`
- `"notMatchInsensitively": "stringValue"`
- `"contains": "stringValue"`
- `"notContains": "stringValue"`
- `"in": ["stringValue1","stringValue2"]`
- `"notIn": ["stringValue1","stringValue2"]`
- `"containsKey": "keyName"`
- `"notContainsKey": "keyName"`
- `"less": "dateValue"` | `"less": "stringValue"` | `"less": intValue`
- `"lessOrEquals": "dateValue"` | `"lessOrEquals": "stringValue"` | `"lessOrEquals": intValue`
- `"greater": "dateValue"` | `"greater": "stringValue"` | `"greater": intValue`
- `"greaterOrEquals": "dateValue"` | `"greaterOrEquals": "stringValue"` |
  `"greaterOrEquals": intValue`
- `"exists": "bool"`

For **less**, **lessOrEquals**, **greater**, and **greaterOrEquals**, if the property type doesn't
match the condition type, an error is thrown. String comparisons are made using
`InvariantCultureIgnoreCase`.

When using the **like** and **notLike** conditions, you provide a wildcard `*` in the value. The
value shouldn't have more than one wildcard `*`.

When using the **match** and **notMatch** conditions, provide `#` to match a digit, `?` for a
letter, `.` to match any character, and any other character to match that actual character. While
**match** and **notMatch** are case-sensitive, all other conditions that evaluate a _stringValue_
are case-insensitive. Case-insensitive alternatives are available in **matchInsensitively** and
**notMatchInsensitively**.

### Fields

Conditions that evaluate whether the values of properties in the resource request payload meet
certain criteria can be formed using a **field** expression. The following fields are supported:

- `name`
- `fullName`
  - Returns the full name of the resource. The full name of a resource is the resource name
    prepended by any parent resource names (for example "myServer/myDatabase").
- `kind`
- `type`
- `location`
  - Location fields are normalized to support various formats. For example, `East US 2` is
    considered equal to `eastus2`.
  - Use **global** for resources that are location agnostic.
- `id`
  - Returns the resource ID of the resource that is being evaluated.
  - Example: `/subscriptions/06be863d-0996-4d56-be22-384767287aa2/resourceGroups/myRG/providers/Microsoft.KeyVault/vaults/myVault`
- `identity.type`
  - Returns the type of
    [managed identity](../../../active-directory/managed-identities-azure-resources/overview.md)
    enabled on the resource.
- `tags`
- `tags['<tagName>']`
  - This bracket syntax supports tag names that have punctuation such as a hyphen, period, or space.
  - Where **\<tagName\>** is the name of the tag to validate the condition for.
  - Examples: `tags['Acct.CostCenter']` where **Acct.CostCenter** is the name of the tag.
- `tags['''<tagName>''']`
  - This bracket syntax supports tag names that have apostrophes in it by escaping with double
    apostrophes.
  - Where **'\<tagName\>'** is the name of the tag to validate the condition for.
  - Example: `tags['''My.Apostrophe.Tag''']` where **'My.Apostrophe.Tag'** is the name of the tag.
- property aliases - for a list, see [Aliases](#aliases).

> [!NOTE]
> `tags.<tagName>`, `tags[tagName]`, and `tags[tag.with.dots]` are still acceptable ways of
> declaring a tags field. However, the preferred expressions are those listed above.

> [!NOTE]
> In **field** expressions referring to **\[\*\] alias**, each element in the array is evaluated
> individually with logical **and** between elements. For more information, see
> [Referencing array resource properties](../how-to/author-policies-for-arrays.md#referencing-array-resource-properties).

#### Use tags with parameters

A parameter value can be passed to a tag field. Passing a parameter to a tag field increases the
flexibility of the policy definition during policy assignment.

In the following example, `concat` is used to create a tags field lookup for the tag named the value
of the **tagName** parameter. If that tag doesn't exist, the **modify** effect is used to add the
tag using the value of the same named tag set on the audited resources parent resource group by
using the `resourcegroup()` lookup function.

```json
{
    "if": {
        "field": "[concat('tags[', parameters('tagName'), ']')]",
        "exists": "false"
    },
    "then": {
        "effect": "modify",
        "details": {
            "operations": [{
                "operation": "add",
                "field": "[concat('tags[', parameters('tagName'), ']')]",
                "value": "[resourcegroup().tags[parameters('tagName')]]"
            }],
            "roleDefinitionIds": [
                "/providers/microsoft.authorization/roleDefinitions/4a9ae827-6dc8-4573-8ac7-8239d42aa03f"
            ]
        }
    }
}
```

### Value

Conditions that evaluate whether a value meets certain criteria can be formed using a **value**
expression. Values can be literals, the values of [parameters](#parameters), or the returned values
of any [supported template functions](#policy-functions).

> [!WARNING]
> If the result of a _template function_ is an error, policy evaluation fails. A failed evaluation
> is an implicit **deny**. For more information, see
> [avoiding template failures](#avoiding-template-failures). Use
> [enforcementMode](./assignment-structure.md#enforcement-mode) of **DoNotEnforce** to prevent
> impact of a failed evaluation on new or updated resources while testing and validating a new
> policy definition.

#### Value examples

This policy rule example uses **value** to compare the result of the `resourceGroup()` function and
the returned **name** property to a **like** condition of `*netrg`. The rule denies any resource not
of the `Microsoft.Network/*` **type** in any resource group whose name ends in `*netrg`.

```json
{
    "if": {
        "allOf": [{
                "value": "[resourceGroup().name]",
                "like": "*netrg"
            },
            {
                "field": "type",
                "notLike": "Microsoft.Network/*"
            }
        ]
    },
    "then": {
        "effect": "deny"
    }
}
```

This policy rule example uses **value** to check if the result of multiple nested functions
**equals** `true`. The rule denies any resource that doesn't have at least three tags.

```json
{
    "mode": "indexed",
    "policyRule": {
        "if": {
            "value": "[less(length(field('tags')), 3)]",
            "equals": "true"
        },
        "then": {
            "effect": "deny"
        }
    }
}
```

#### Avoiding template failures

The use of _template functions_ in **value** allows for many complex nested functions. If the result
of a _template function_ is an error, policy evaluation fails. A failed evaluation is an implicit
**deny**. An example of a **value** that fails in certain scenarios:

```json
{
    "policyRule": {
        "if": {
            "value": "[substring(field('name'), 0, 3)]",
            "equals": "abc"
        },
        "then": {
            "effect": "audit"
        }
    }
}
```

The example policy rule above uses
[substring()](../../../azure-resource-manager/templates/template-functions-string.md#substring) to
compare the first three characters of **name** to **abc**. If **name** is shorter than three
characters, the `substring()` function results in an error. This error causes the policy to become a
**deny** effect.

Instead, use the [if()](../../../azure-resource-manager/templates/template-functions-logical.md#if)
function to check if the first three characters of **name** equal **abc** without allowing a
**name** shorter than three characters to cause an error:

```json
{
    "policyRule": {
        "if": {
            "value": "[if(greaterOrEquals(length(field('name')), 3), substring(field('name'), 0, 3), 'not starting with abc')]",
            "equals": "abc"
        },
        "then": {
            "effect": "audit"
        }
    }
}
```

With the revised policy rule, `if()` checks the length of **name** before trying to get a
`substring()` on a value with fewer than three characters. If **name** is too short, the value "not
starting with abc" is returned instead and compared to **abc**. A resource with a short name that
doesn't begin with **abc** still fails the policy rule, but no longer causes an error during
evaluation.

### Count

Conditions that count how many members of an array meet certain criteria can be formed using a
**count** expression. Common scenarios are checking whether 'at least one of', 'exactly one of',
'all of', or 'none of' the array members satisfy a condition. **Count** evaluates each array member
for a condition expression and sums the _true_ results, which is then compared to the expression
operator.

#### Field count

Count how many members of an array in the request payload satisfy a condition expression. The
structure of **field count** expressions is:

```json
{
    "count": {
        "field": "<[*] alias>",
        "where": {
            /* condition expression */
        }
    },
    "<condition>": "<compare the count of true condition expression array members to this value>"
}
```

The following properties are used with **field count**:

- **count.field** (required): Contains the path to the array and must be an array alias.
- **count.where** (optional): The condition expression to individually evaluate for each [\[\*\]
  alias](#understanding-the--alias) array member of `count.field`. If this property isn't
  provided, all array members with the path of 'field' are evaluated to _true_. Any
  [condition](../concepts/definition-structure.md#conditions) can be used inside this property.
  [Logical operators](#logical-operators) can be used inside this property to create complex
  evaluation requirements.
- **\<condition\>** (required): The value is compared to the number of items that met the
  **count.where** condition expression. A numeric
  [condition](../concepts/definition-structure.md#conditions) should be used.

For more details on how to work with array properties in Azure Policy, including detailed
explanation on how the **field count** expression is evaluated, see
[Referencing array resource properties](../how-to/author-policies-for-arrays.md#referencing-array-resource-properties).

#### Value count

Count how many members of an array satisfy a condition. The array can be a literal array or a
[reference to array parameter](#using-a-parameter-value). The structure of **value count**
expressions is:

```json
{
    "count": {
        "value": "<literal array | array parameter reference>",
        "name": "<index name>",
        "where": {
            /* condition expression */
        }
    },
    "<condition>": "<compare the count of true condition expression array members to this value>"
}
```

The following properties are used with **value count**:

- **count.value** (required): The array to evaluate.
- **count.name** (required): The index name, composed of English letters and digits. Defines a name
  for the value of the array member evaluated in the current iteration. The name is used for
  referencing the current value inside the `count.where` condition. Optional when the **count**
  expression isn't in a child of another **count** expression. When not provided, the index name is
  implicitly set to `"default"`.
- **count.where** (optional): The condition expression to individually evaluate for each array
  member of `count.value`. If this property isn't provided, all array members are evaluated to
  _true_. Any [condition](../concepts/definition-structure.md#conditions) can be used inside this
  property. [Logical operators](#logical-operators) can be used inside this property to create
  complex evaluation requirements. The value of the currently enumerated array member can be
  accessed by calling the [current](#the-current-function) function.
- **\<condition\>** (required): The value is compared to the number of items that met the
  `count.where` condition expression. A numeric
  [condition](../concepts/definition-structure.md#conditions) should be used.

#### The current function

The `current()` function is only available inside the `count.where` condition. It returns the value
of the array member that is currently enumerated by the **count** expression evaluation.

**Value count usage**

- `current(<index name defined in count.name>)`. For example: `current('arrayMember')`.
- `current()`. Allowed only when the **value count** expression isn't a child of another **count**
  expression. Returns the same value as above.

If the value returned by the call is an object, property accessors are supported. For example:
`current('objectArrayMember').property`.

**Field count usage**

- `current(<the array alias defined in count.field>)`. For example,
  `current('Microsoft.Test/resource/enumeratedArray[*]')`.
- `current()`. Allowed only when the **field count** expression isn't a child of another **count**
  expression. Returns the same value as above.
- `current(<alias of a property of the array member>)`. For example,
  `current('Microsoft.Test/resource/enumeratedArray[*].property')`.

#### Field count examples

Example 1: Check if an array is empty

```json
{
    "count": {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]"
    },
    "equals": 0
}
```

Example 2: Check for only one array member to meet the condition expression

```json
{
    "count": {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
        "where": {
            "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].description",
            "equals": "My unique description"
        }
    },
    "equals": 1
}
```

Example 3: Check for at least one array member to meet the condition expression

```json
{
    "count": {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
        "where": {
            "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].description",
            "equals": "My common description"
        }
    },
    "greaterOrEquals": 1
}
```

Example 4: Check that all object array members meet the condition expression

```json
{
    "count": {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
        "where": {
            "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].description",
            "equals": "description"
        }
    },
    "equals": "[length(field('Microsoft.Network/networkSecurityGroups/securityRules[*]'))]"
}
```

Example 5: Check that at least one array member matches multiple properties in the condition
expression

```json
{
    "count": {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
        "where": {
            "allOf": [
                {
                    "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].direction",
                    "equals": "Inbound"
                },
                {
                    "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].access",
                    "equals": "Allow"
                },
                {
                    "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].destinationPortRange",
                    "equals": "3389"
                }
            ]
        }
    },
    "greater": 0
}
```

Example 6: Use `current()` function inside the `where` conditions to access the value of the
currently enumerated array member in a template function. This condition checks whether a virtual
network contains an address prefix that isn't under the 10.0.0.0/24 CIDR range.

```json
{
    "count": {
        "field": "Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]",
        "where": {
          "value": "[ipRangeContains('10.0.0.0/24', current('Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]'))]",
          "equals": false
        }
    },
    "greater": 0
}
```

Example 7: Use `field()` function inside the `where` conditions to access the value of the currently
enumerated array member. This condition checks whether a virtual network contains an address prefix
that isn't under the 10.0.0.0/24 CIDR range.

```json
{
    "count": {
        "field": "Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]",
        "where": {
          "value": "[ipRangeContains('10.0.0.0/24', first(field(('Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]')))]",
          "equals": false
        }
    },
    "greater": 0
}
```

#### Value count examples

Example 1: Check if resource name matches any of the given name patterns.

```json
{
    "count": {
        "value": [ "prefix1_*", "prefix2_*" ],
        "name": "pattern",
        "where": {
            "field": "name",
            "like": "[current('pattern')]"
        }
    },
    "greater": 0
}
```

Example 2: Check if resource name matches any of the given name patterns. The `current()` function
doesn't specify an index name. The outcome is the same as the previous example.

```json
{
    "count": {
        "value": [ "prefix1_*", "prefix2_*" ],
        "where": {
            "field": "name",
            "like": "[current()]"
        }
    },
    "greater": 0
}
```

Example 3: Check if resource name matches any of the given name patterns provided by an array
parameter.

```json
{
    "count": {
        "value": "[parameters('namePatterns')]",
        "name": "pattern",
        "where": {
            "field": "name",
            "like": "[current('pattern')]"
        }
    },
    "greater": 0
}
```

Example 4: Check if any of the virtual network address prefixes isn't under the list of approved
prefixes.

```json
{
    "count": {
        "field": "Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]",
        "where": {
            "count": {
                "value": "[parameters('approvedPrefixes')]",
                "name": "approvedPrefix",
                "where": {
                    "value": "[ipRangeContains(current('approvedPrefix'), current('Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]'))]",
                    "equals": true
                },
            },
            "equals": 0
        }
    },
    "greater": 0
}
```

Example 5: Check that all the reserved NSG rules are defined in an NSG. The properties of the
reserved NSG rules are defined in an array parameter containing objects.

Parameter value:

```json
[
    {
        "priority": 101,
        "access": "deny",
        "direction": "inbound",
        "destinationPortRange": 22
    },
    {
        "priority": 102,
        "access": "deny",
        "direction": "inbound",
        "destinationPortRange": 3389
    }
]
```

Policy:

```json
{
    "count": {
        "value": "[parameters('reservedNsgRules')]",
        "name": "reservedNsgRule",
        "where": {
            "count": {
                "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
                "where": {
                    "allOf": [
                        {
                            "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].priority",
                            "equals": "[current('reservedNsgRule').priority]"
                        },
                        {
                            "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].access",
                            "equals": "[current('reservedNsgRule').access]"
                        },
                        {
                            "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].direction",
                            "equals": "[current('reservedNsgRule').direction]"
                        },
                        {
                            "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].destinationPortRange",
                            "equals": "[current('reservedNsgRule').destinationPortRange]"
                        }
                    ]
                }
            },
            "equals": 1
        }
    },
    "equals": "[length(parameters('reservedNsgRules'))]"
}
```

### Policy functions

Functions can be used to introduce additional logic into a policy rule. They are resolved within the [policy rule](#policy-rule) of a policy definition and within [parameter values assigned to policy definitions in an initiative](initiative-definition-structure.md#passing-a-parameter-value-to-a-policy-definition).

All [Resource Manager template
functions](../../../azure-resource-manager/templates/template-functions.md) are available to use
within a policy rule, except the following functions and user-defined functions:

- copyIndex()
- dateTimeAdd()
- deployment()
- environment()
- extensionResourceId()
- [lambda()](../../../azure-resource-manager/templates/template-functions-lambda.md)
- listAccountSas()
- listKeys()
- listSecrets()
- list*
- managementGroup()
- newGuid()
- pickZones()
- providers()
- reference()
- resourceId()
- subscriptionResourceId()
- tenantResourceId()
- tenant()
- utcNow(format)
- variables()

> [!NOTE]
> These functions are still available within the `details.deployment.properties.template` portion of
> the template deployment in a **deployIfNotExists** policy definition.

The following function is available to use in a policy rule, but differs from use in an Azure
Resource Manager template (ARM template):

- `utcNow()` - Unlike an ARM template, this property can be used outside _defaultValue_.
  - Returns a string that is set to the current date and time in Universal ISO 8601 DateTime format
    `yyyy-MM-ddTHH:mm:ss.fffffffZ`.

The following functions are only available in policy rules:

- `addDays(dateTime, numberOfDaysToAdd)`
  - **dateTime**: [Required] string - String in the Universal ISO 8601 DateTime format
    'yyyy-MM-ddTHH:mm:ss.FFFFFFFZ'
  - **numberOfDaysToAdd**: [Required] integer - Number of days to add

- `field(fieldName)`
  - **fieldName**: [Required] string - Name of the [field](#fields) to retrieve
  - Returns the value of that field from the resource that is being evaluated by the If condition.
  - `field` is primarily used with **AuditIfNotExists** and **DeployIfNotExists** to reference
    fields on the resource that are being evaluated. An example of this use can be seen in the
    [DeployIfNotExists example](effects.md#deployifnotexists-example).

- `requestContext().apiVersion`
  - Returns the API version of the request that triggered policy evaluation (example: `2021-09-01`).
    This value is the API version that was used in the PUT/PATCH request for evaluations on resource
    creation/update. The latest API version is always used during compliance evaluation on existing
    resources.

- `policy()`
  - Returns the following information about the policy that is being evaluated. Properties can be
    accessed from the returned object (example: `[policy().assignmentId]`).

    ```json
    {
      "assignmentId": "/subscriptions/ad404ddd-36a5-4ea8-b3e3-681e77487a63/providers/Microsoft.Authorization/policyAssignments/myAssignment",
      "definitionId": "/providers/Microsoft.Authorization/policyDefinitions/34c877ad-507e-4c82-993e-3452a6e0ad3c",
      "setDefinitionId": "/providers/Microsoft.Authorization/policySetDefinitions/42a694ed-f65e-42b2-aa9e-8052e9740a92",
      "definitionReferenceId": "StorageAccountNetworkACLs"
    }
    ```

- `ipRangeContains(range, targetRange)`
  - **range**: [Required] string - String specifying a range of IP addresses to check if the
    _targetRange_ is within.
  - **targetRange**: [Required] string - String specifying a range of IP addresses to validate as
    included within the _range_.
  - Returns a _boolean_ for whether the _range_ IP address range contains the _targetRange_ IP
    address range. Empty ranges, or mixing between IP families isn't allowed and results in
    evaluation failure.

  Supported formats:
  - Single IP address (examples: `10.0.0.0`, `2001:0DB8::3:FFFE`)
  - CIDR range (examples: `10.0.0.0/24`, `2001:0DB8::/110`)
  - Range defined by start and end IP addresses (examples: `192.168.0.1-192.168.0.9`, `2001:0DB8::-2001:0DB8::3:FFFF`)

- `current(indexName)`
  - Special function that may only be used inside [count expressions](#count).

#### Policy function example

This policy rule example uses the `resourceGroup` resource function to get the **name** property,
combined with the `concat` array and object function to build a `like` condition that enforces the
resource name to start with the resource group name.

```json
{
    "if": {
        "not": {
            "field": "name",
            "like": "[concat(resourceGroup().name,'*')]"
        }
    },
    "then": {
        "effect": "deny"
    }
}
```

### Policy rule limits

#### Limits enforced during authoring

Limits to the structure of policy rules are enforced during the authoring or assignment of a policy.
Attempts to create or assign policy definitions that exceed these limits will fail.

| Limit | Value | Additional details |
|:---|:---|:---|
| Condition expressions in the **if** condition | 4096 | |
| Condition expressions in the **then** block | 128 | Applies to the **existenceCondition** of **AuditIfNotExists** and **DeployIfNotExists** policies |
| Policy functions per policy rule | 2048 | |
| Policy function number of parameters | 128 | Example: `[function('parameter1', 'parameter2', ...)]` |
| Nested policy functions depth | 64 | Example: `[function(nested1(nested2(...)))]` |
| Policy functions expression string length | 81920 | Example: the length of `"[function(....)]"` |
| **Field count** expressions per array | 5 | |
| **Value count** expressions per policy rule | 10 | |
| **Value count** expression iteration count | 100 | For nested **Value count** expressions, this also includes the iteration count of the parent expression |

#### Limits enforced during evaluation

Limits to the size of objects that are processed by policy functions during policy evaluation. These limits can't always be enforced during authoring since they depend on the evaluated content. For example:

```json
{
    "field": "name",
    "equals": "[concat(field('stringPropertyA'), field('stringPropertyB'))]"
}
```

The length of the string created by the `concat()` function depends on the value of properties in the evaluated resource.

| Limit | Value | Example |
|:---|:---|:---|
| Length of string returned by a function | 131072 | `[concat(field('longString1'), field('longString2'))]`|
| Depth of complex objects provided as a parameter to, or returned by a function | 128 | `[union(field('largeObject1'), field('largeObject2'))]` |
| Number of nodes of complex objects provided as a parameter to, or returned by a function | 32768 | `[concat(field('largeArray1'), field('largeArray2'))]` |

> [!WARNING]
> Policy that exceed the above limits during evaluation will effectively become a **deny** policy and can block incoming requests.
> When writing policies with complex functions, be mindful of these limits and test your policies against resources that have the potential to exceed them.

## Aliases

You use property aliases to access specific properties for a resource type. Aliases enable you to
restrict what values or conditions are allowed for a property on a resource. Each alias maps to
paths in different API versions for a given resource type. During policy evaluation, the policy
engine gets the property path for that API version.

The list of aliases is always growing. To find what aliases are currently supported by Azure
Policy, use one of the following methods:

- Azure Policy extension for Visual Studio Code (recommended)

  Use the [Azure Policy extension for Visual Studio Code](../how-to/extension-for-vscode.md) to view
  and discover aliases for resource properties.

  :::image type="content" source="../media/extension-for-vscode/extension-hover-shows-property-alias.png" alt-text="Screenshot of the Azure Policy extension for Visual Studio Code hovering a property to display the alias names." border="false":::

- Azure PowerShell

  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell

  # Use Get-AzPolicyAlias to list available providers
  Get-AzPolicyAlias -ListAvailable

  # Use Get-AzPolicyAlias to list aliases for a Namespace (such as Azure Compute -- Microsoft.Compute)
  (Get-AzPolicyAlias -NamespaceMatch 'compute').Aliases
  ```

  > [!NOTE]
  > To find aliases that can be used with the [modify](./effects.md#modify) effect, use the
  > following command in Azure PowerShell **4.6.0** or higher:
  >
  > ```azurepowershell-interactive
  > Get-AzPolicyAlias | Select-Object -ExpandProperty 'Aliases' | Where-Object { $_.DefaultMetadata.Attributes -eq 'Modifiable' }
  > ```

- Azure CLI

  ```azurecli-interactive
  # Login first with az login if not using Cloud Shell

  # List namespaces
  az provider list --query [*].namespace

  # Get Azure Policy aliases for a specific Namespace (such as Azure Compute -- Microsoft.Compute)
  az provider show --namespace Microsoft.Compute --expand "resourceTypes/aliases" --query "resourceTypes[].aliases[].name"
  ```

- REST API / ARMClient

  ```http
  GET https://management.azure.com/providers/?api-version=2019-10-01&$expand=resourceTypes/aliases
  ```

### Understanding the [*] alias

Several of the aliases that are available have a version that appears as a 'normal' name and another
that has **\[\*\]** attached to it. For example:

- `Microsoft.Storage/storageAccounts/networkAcls.ipRules`
- `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]`

The 'normal' alias represents the field as a single value. This field is for exact match comparison
scenarios when the entire set of values must be exactly as defined, no more and no less.

The **\[\*\]** alias represents a collection of values selected from the elements of an array
resource property. For example:

| Alias | Selected values |
|:---|:---|
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]` | The elements of the `ipRules` array. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].action` | The values of the `action` property from each element of the `ipRules` array. |

When used in a [field](#fields) condition, array aliases make it possible to compare each individual
array element to a target value. When used with [count](#count) expression, it's possible to:

- Check the size of an array
- Check if all\any\none of the array elements meet a complex condition
- Check if exactly ***n*** array elements meet a complex condition

For more information and examples, see
[Referencing array resource properties](../how-to/author-policies-for-arrays.md#referencing-array-resource-properties).

### Effect

Azure Policy supports the following types of effect:

- **Append**: adds the defined set of fields to the request
- **Audit**: generates a warning event in activity log but doesn't fail the request
- **AuditIfNotExists**: generates a warning event in activity log if a related resource doesn't
  exist
- **Deny**: generates an event in the activity log and fails the request based on requested resource configuration
- **DenyAction**: generates an event in the activity log and fails the request based on requested action
- **DeployIfNotExists**: deploys a related resource if it doesn't already exist
- **Disabled**: doesn't evaluate resources for compliance to the policy rule
- **Modify**: adds, updates, or removes the defined set of fields in the request
- **EnforceOPAConstraint** (deprecated): configures the Open Policy Agent admissions controller with
  Gatekeeper v3 for self-managed Kubernetes clusters on Azure
- **EnforceRegoPolicy** (deprecated): configures the Open Policy Agent admissions controller with
  Gatekeeper v2 in Azure Kubernetes Service

For complete details on each effect, order of evaluation, properties, and examples, see
[Understanding Azure Policy Effects](effects.md).

## Next steps

- See the [initiative definition structure](./initiative-definition-structure.md)
- Review examples at [Azure Policy samples](../samples/index.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
