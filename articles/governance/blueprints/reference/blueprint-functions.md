---
title: Azure Blueprints functions
description: Describes the functions available for use with blueprint artifacts in Azure Blueprints definitions and assignments.
ms.date: 09/07/2023
ms.topic: reference
---
# Functions for use with Azure Blueprints

[!INCLUDE [Blueprints deprecation note](../../../../includes/blueprints-deprecation-note.md)]

Azure Blueprints provides functions making a blueprint definition more dynamic. These functions are
for use with blueprint definitions and blueprint artifacts. An Azure Resource Manager Template (ARM
template) artifact supports the full use of Resource Manager functions in addition to getting a
dynamic value through a blueprint parameter.

The following functions are supported:

- [artifacts](#artifacts)
- [concat](#concat)
- [parameters](#parameters)
- [resourceGroup](#resourcegroup)
- [resourceGroups](#resourcegroups)
- [subscription](#subscription)

## artifacts

`artifacts(artifactName)`

Returns an object of properties populated with that blueprint artifacts outputs.

> [!NOTE]
> The `artifacts()` function can't be used from inside an ARM Template. The function can only be
> used in the blueprint definition JSON or in the artifact JSON when managing the blueprint with
> Azure PowerShell or REST API as part of
> [Blueprints-as-code](https://github.com/Azure/azure-blueprints/blob/master/README.md).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| artifactName |Yes |string |The name of a blueprint artifact. |

### Return value

An object of output properties. The **outputs** properties are dependent on the type of blueprint
artifact being referenced. All types follow the format:

```json
{
  "outputs": {collectionOfOutputProperties}
}
```

#### Policy assignment artifact

```json
{
    "outputs": {
        "policyAssignmentId": "{resourceId-of-policy-assignment}",
        "policyAssignmentName": "{name-of-policy-assignment}",
        "policyDefinitionId": "{resourceId-of-policy-definition}",
    }
}
```

#### ARM template artifact

The **outputs** properties of the returned object are defined within the ARM template and returned
by the deployment.

#### Role assignment artifact

```json
{
    "outputs": {
        "roleAssignmentId": "{resourceId-of-role-assignment}",
        "roleDefinitionId": "{resourceId-of-role-definition}",
        "principalId": "{principalId-role-is-being-assigned-to}",
    }
}
```

### Example

An ARM template artifact with the ID _myTemplateArtifact_ containing the following sample output
property:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    ...
    "outputs": {
        "myArray": {
            "type": "array",
            "value": ["first", "second"]
        },
        "myString": {
            "type": "string",
            "value": "my string value"
        },
        "myObject": {
            "type": "object",
            "value": {
                "myProperty": "my value",
                "anotherProperty": true
            }
        }
    }
}
```

Some examples of retrieving data from the _myTemplateArtifact_ sample are:

| Expression | Type | Value |
|:---|:---|:---|
|`[artifacts("myTemplateArtifact").outputs.myArray]` | Array | \["first", "second"\] |
|`[artifacts("myTemplateArtifact").outputs.myArray[0]]` | String | "first" |
|`[artifacts("myTemplateArtifact").outputs.myString]` | String | "my string value" |
|`[artifacts("myTemplateArtifact").outputs.myObject]` | Object | { "myproperty": "my value", "anotherProperty": true } |
|`[artifacts("myTemplateArtifact").outputs.myObject.myProperty]` | String | "my value" |
|`[artifacts("myTemplateArtifact").outputs.myObject.anotherProperty]` | Bool | True |

## concat

`concat(string1, string2, string3, ...)`

Combines multiple string values and returns the concatenated string.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| string1 |Yes |string |The first value for concatenation. |
| additional arguments |No |string |Additional values in sequential order for concatenation |

### Return value

A string of concatenated values.

### Remarks

The Azure Blueprints function differs from the ARM template function in that it only works with
strings.

### Example

`concat(parameters('organizationName'), '-vm')`

## parameters

`parameters(parameterName)`

Returns a blueprint parameter value. The specified parameter name must be defined in the blueprint
definition or in blueprint artifacts.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| parameterName |Yes |string |The name of the parameter to return. |

### Return value

The value of the specified blueprint or blueprint artifact parameter.

### Remarks

The Azure Blueprints function differs from the ARM template function in that it only works with
blueprint parameters.

### Example

Define parameter _principalIds_ in the blueprint definition:

```json
{
    "type": "Microsoft.Blueprint/blueprints",
    "properties": {
        ...
        "parameters": {
            "principalIds": {
                "type": "array",
                "metadata": {
                    "displayName": "Principal IDs",
                    "description": "This is a blueprint parameter that any artifact can reference. We'll display these descriptions for you in the info bubble. Supply principal IDs for the users,groups, or service principals for the Azure role assignment.",
                    "strongType": "PrincipalId"
                }
            }
        },
        ...
    }
}
```

Then use _principalIds_ as the argument for `parameters()` in a blueprint artifact:

```json
{
    "type": "Microsoft.Blueprint/blueprints/artifacts",
    "kind": "roleAssignment",
    ...
    "properties": {
        "roleDefinitionId": "/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
        "principalIds": "[parameters('principalIds')]",
        ...
    }
}
```

## resourceGroup

`resourceGroup()`

Returns an object that represents the current resource group.

### Return value

The returned object is in the following format:

```json
{
  "name": "{resourceGroupName}",
  "location": "{resourceGroupLocation}",
}
```

### Remarks

The Azure Blueprints function differs from the ARM template function. The `resourceGroup()` function
can't be used in a subscription level artifact or the blueprint definition. It can only be used in
blueprint artifacts that are part of a resource group artifact.

A common use of the `resourceGroup()` function is to create resources in the same location as the
resource group artifact.

### Example

To use the resource group's location, set in either the blueprint definition or during assignment,
as the location for another artifact, declare a resource group placeholder object in your blueprint
definition. In this example, _NetworkingPlaceholder_ is the name of the resource group placeholder.

```json
{
    "type": "Microsoft.Blueprint/blueprints",
    "properties": {
        ...
        "resourceGroups": {
            "NetworkingPlaceholder": {
                "location": "eastus"
            }
        }
    }
}
```

Then use the `resourceGroup()` function in the context of a blueprint artifact that is targeting a
resource group placeholder object. In this example, the template artifact is deployed into the
_NetworkingPlaceholder_ resource group and provides parameter _resourceLocation_ dynamically
populated with the _NetworkingPlaceholder_ resource group location to the template. The location of
the _NetworkingPlaceholder_ resource group could have been statically defined on the blueprint
definition or dynamically defined during assignment. In either case, the template artifact is
provided that information as a parameter and uses it to deploy the resources to the correct
location.

```json
{
  "type": "Microsoft.Blueprint/blueprints/artifacts",
  "kind": "template",
  "properties": {
      "template": {
        ...
      },
      "resourceGroup": "NetworkingPlaceholder",
      ...
      "parameters": {
        "resourceLocation": {
          "value": "[resourceGroup().location]"
        }
      }
  }
}
```

## resourceGroups

`resourceGroups(placeholderName)`

Returns an object that represents the specified resource group artifact. Unlike `resourceGroup()`,
which requires context of the artifact, this function is used to get the properties of a specific
resource group placeholder when not in context of that resource group.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| placeholderName |Yes |string |The placeholder name of the resource group artifact to return. |

### Return value

The returned object is in the following format:

```json
{
  "name": "{resourceGroupName}",
  "location": "{resourceGroupLocation}",
}
```

### Example

To use the resource group's location, set in either the blueprint definition or during assignment,
as the location for another artifact, declare a resource group placeholder object in your blueprint
definition. In this example, _NetworkingPlaceholder_ is the name of the resource group placeholder.

```json
{
    "type": "Microsoft.Blueprint/blueprints",
    "properties": {
        ...
        "resourceGroups": {
            "NetworkingPlaceholder": {
                "location": "eastus"
            }
        }
    }
}
```

Then use the `resourceGroups()` function from the context of any blueprint artifact to get a
reference to the resource group placeholder object. In this example, the template artifact is
deployed outside the _NetworkingPlaceholder_ resource group and provides parameter
_artifactLocation_ dynamically populated with the _NetworkingPlaceholder_ resource group location to
the template. The location of the _NetworkingPlaceholder_ resource group could have been statically
defined on the blueprint definition or dynamically defined during assignment. In either case, the
template artifact is provided that information as a parameter and uses it to deploy the resources to
the correct location.

```json
{
  "kind": "template",
  "properties": {
      "template": {
          ...
      },
      ...
      "parameters": {
        "artifactLocation": {
          "value": "[resourceGroups('NetworkingPlaceholder').location]"
        }
      }
  },
  "type": "Microsoft.Blueprint/blueprints/artifacts",
  "name": "myTemplate"
}
```

## subscription

`subscription()`

Returns details about the subscription for the current blueprint assignment.

### Return value

The returned object is in the following format:

```json
{
    "id": "/subscriptions/{subscriptionId}",
    "subscriptionId": "{subscriptionId}",
    "tenantId": "{tenantId}",
    "displayName": "{name-of-subscription}"
}
```

### Example

Use the subscription's display name and the `concat()` function to create a naming convention passed
as parameter _resourceName_ to the template artifact.

```json
{
  "kind": "template",
  "properties": {
      "template": {
          ...
      },
      ...
      "parameters": {
        "resourceName": {
          "value": "[concat(subscription().displayName, '-vm')]"
        }
      }
  },
  "type": "Microsoft.Blueprint/blueprints/artifacts",
  "name": "myTemplate"
}
```

## Next steps

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
- Resolve issues during the assignment of a blueprint with
  [general troubleshooting](../troubleshoot/general.md).
