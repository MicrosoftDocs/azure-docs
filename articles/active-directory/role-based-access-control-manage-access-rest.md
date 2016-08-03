<properties
	pageTitle="Managing Role-Based Access Control with the REST API"
	description="Managing role-based access control with the REST API"
	services="active-directory"
	documentationCenter="na"
	authors="kgremban"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="multiple"
	ms.tgt_pltfrm="rest-api"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/03/2016"
	ms.author="kgremban"/>

# Managing Role-Based Access Control with the REST API

> [AZURE.SELECTOR]
- [PowerShell](role-based-access-control-manage-access-powershell.md)
- [Azure CLI](role-based-access-control-manage-access-azure-cli.md)
- [REST API](role-based-access-control-manage-access-rest.md)

Role-Based Access Control (RBAC) in the Azure Portal and Azure Resource Manager API allows you to manage access to your subscription and resources at a fine-grained level. With this feature, you can grant access for Active Directory users, groups, or service principals by assigning some roles to them at a particular scope.

## List all role assignments

Lists all of the role assignments at the specified scope and sub-scopes.

To list role assignments, you must have access to `Microsoft.Authorization/roleAssignments/read` operation at the scope. All of the built-in roles are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure Role-Based Access Control](role-based-access-control-configure.md).

### Request

Use the **GET** method with the following URI:

	https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments?api-version={api-version}&$filter={filter}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the scope for which you wish to list the role assignments. The following examples show how to specify the scope for different levels:

  | Level | *{Scope}* |
  |-------|-----------|
  | Subscription   | /subscriptions/{subscription-id} |
  | Resource Group | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  |
  | Resource       | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1 |

2. Replace *{api-version}* with 2015-07-01.

3. Replace *{filter}* with the condition that you wish to apply to filter the role assignment list. The following conditions are supported.

  | Condition | *{Filter}* | Replace |
  |-----------|------------|---------|
  | To list role assignments for only the specified scope, not including the role assignments at sub-scopes. | `atScope()` | |
  | To list role assignments for only specific user, group, or application                                          | `principalId%20eq%20'{objectId}'` | Replace *{objectId}* with the Azure AD objectId of the user, group, or service principal. For instance, `&$filter=principalId%20eq%20'3a477f6a-6739-4b93-84aa-3be3f8c8e7c2'` |
  | To list role assignments for only specific user including ones assigned to groups of which the user is a member | `assignedTo('{objectId}')` | Replace *{objectId}* with the Azure AD objectId of the user. For instance, `&$filter=assignedTo('3a477f6a-6739-4b93-84aa-3be3f8c8e7c2')` |

### Response

Status code: 200

```
{
  "value": [
    {
      "properties": {
        "roleDefinitionId": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
        "principalId": "2f9d4375-cbf1-48e8-83c9-2a0be4cb33fb",
        "scope": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e",
        "createdOn": "2015-10-08T07:28:24.3905077Z",
        "updatedOn": "2015-10-08T07:28:24.3905077Z",
        "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
        "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
      },
      "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleAssignments/baa6e199-ad19-4667-b768-623fde31aedd",
      "type": "Microsoft.Authorization/roleAssignments",
      "name": "baa6e199-ad19-4667-b768-623fde31aedd"
    }
  ],
  "nextLink": null
}

```

## Get information about a role assignment

Gets information about a single role assignment specified by the role assignment identifier.

To get information about a role assignment, you must have access to `Microsoft.Authorization/roleAssignments/read` operation. All of the built-in roles are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure Role-Based Access Control](role-based-access-control-configure.md).

### Request

Use the **GET** method with the following URI:

	https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments/{role-assignment-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the scope for which you wish to list the role assignments. The following examples show how to specify the scope for different levels:

  | Level | *{Scope}* |
  |-------|-----------|
  | Subscription   | /subscriptions/{subscription-id} |
  | Resource Group | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  |
  | Resource       | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1 |

2. Replace *{role-assignment-id}* with the GUID identifier of the role assignment.

3. Replace *{api-version}* with 2015-07-01.

### Response

Status code: 200

```
{
  "properties": {
    "roleDefinitionId": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
    "principalId": "672f1afa-526a-4ef6-819c-975c7cd79022",
    "scope": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e",
    "createdOn": "2015-10-05T08:36:26.4014813Z",
    "updatedOn": "2015-10-05T08:36:26.4014813Z",
    "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleAssignments/196965ae-6088-4121-a92a-f1e33fdcc73e",
  "type": "Microsoft.Authorization/roleAssignments",
  "name": "196965ae-6088-4121-a92a-f1e33fdcc73e"
}

```

## Create a Role Assignment

Create a role assignment at the specified scope for the specified principal granting the specified role.

To create a role assignment, you must have access to `Microsoft.Authorization/roleAssignments/write` operation. Of the built-in roles, only *Owner* and *User Access Administrator* are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure Role-Based Access Control](role-based-access-control-configure.md).

### Request

Use the **PUT** method with the following URI:

	https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments/{role-assignment-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the scope at which you wish to create the role assignments. When you create a role assignment at a parent scope, all child scopes inherit the same role assignment. The following examples show how to specify the scope for different levels:

  | Level | *{Scope}* |
  |-------|-----------|
  | Subscription   | /subscriptions/{subscription-id} |
  | Resource Group | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  |
  | Resource       | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1 |

2. Replace *{role-assignment-id}* with a new GUID. This will be used as the GUID identifier of the new role assignment.

3. Replace *{api-version}* with 2015-07-01.

For the request body, provide the values in the following format:

```
{
  "properties": {
    "roleDefinitionId": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/resourceGroups/Network/providers/Microsoft.Network/virtualNetworks/EASTUS-VNET-01/subnets/Devices-Engineering-ProjectRND/providers/Microsoft.Authorization/roleDefinitions/9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
    "principalId": "5ac84765-1c8c-4994-94b2-629461bd191b"
  }
}

```

| Element Name     | Required | Type   | Description |
|------------------|----------|--------|-------------|
| roleDefinitionId | Yes      | String | The identifier of the role that is to be assigned. The format of the identifier is: `{scope}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id-guid}` |
| principalId      | Yes      | String | objectId of the Azure AD principal (user, group, or service principal) to which the role is to be assigned. |

### Response

Status code: 201

```
{
  "properties": {
    "roleDefinitionId": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
    "principalId": "5ac84765-1c8c-4994-94b2-629461bd191b",
    "scope": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/resourceGroups/Network/providers/Microsoft.Network/virtualNetworks/EASTUS-VNET-01/subnets/Devices-Engineering-ProjectRND",
    "createdOn": "2015-12-16T00:27:19.6447515Z",
    "updatedOn": "2015-12-16T00:27:19.6447515Z",
    "createdBy": null,
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/resourceGroups/Network/providers/Microsoft.Network/virtualNetworks/EASTUS-VNET-01/subnets/Devices-Engineering-ProjectRND/providers/Microsoft.Authorization/roleAssignments/2e9e86c8-0e91-4958-b21f-20f51f27bab2",
  "type": "Microsoft.Authorization/roleAssignments",
  "name": "2e9e86c8-0e91-4958-b21f-20f51f27bab2"
}

```

## Delete a Role Assignment

Delete a role assignment at the specified scope.

To delete a role assignment, you must have access to the `Microsoft.Authorization/roleAssignments/delete` operation. Of the built-in roles, only *Owner* and *User Access Administrator* are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure Role-Based Access Control](role-based-access-control-configure.md).

### Request

Use the **DELETE** method with the following URI:

	https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments/{role-assignment-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the scope at which you wish to create the role assignments. The following examples show how to specify the scope for different levels:

  | Level | *{Scope}* |
  |-------|-----------|
  | Subscription   | /subscriptions/{subscription-id} |
  | Resource Group | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  |
  | Resource       | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1 |

2. Replace *{role-assignment-id}* with the role assignment id GUID.

3. Replace *{api-version}* with 2015-07-01.

### Response

Status code: 200

```
{
  "properties": {
    "roleDefinitionId": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
    "principalId": "5ac84765-1c8c-4994-94b2-629461bd191b",
    "scope": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/resourceGroups/Network/providers/Microsoft.Network/virtualNetworks/EASTUS-VNET-01/subnets/Devices-Engineering-ProjectRND",
    "createdOn": "2015-12-17T23:21:40.8921564Z",
    "updatedOn": "2015-12-17T23:21:40.8921564Z",
    "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/resourceGroups/Network/providers/Microsoft.Network/virtualNetworks/EASTUS-VNET-01/subnets/Devices-Engineering-ProjectRND/providers/Microsoft.Authorization/roleAssignments/5eec22ee-ea5c-431e-8f41-82c560706fd2",
  "type": "Microsoft.Authorization/roleAssignments",
  "name": "5eec22ee-ea5c-431e-8f41-82c560706fd2"
}

```

## List all Roles

Lists all of the role that are available for assignment at the specified scope.

To list roles, you must have access to `Microsoft.Authorization/roleDefinitions/read` operation at the scope. All of the built-in roles are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure Role-Based Access Control](role-based-access-control-configure.md).

### Request

Use the **GET** method with the following URI:

	https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions?api-version={api-version}&$filter={filter}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the scope for which you wish to list the roles. The following examples show how to specify the scope for different levels:

  | Level | *{Scope}* |
  |-------|-----------|
  | Subscription   | /subscriptions/{subscription-id} |
  | Resource Group | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  |
  | Resource       | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1 |

2. Replace *{api-version}* with 2015-07-01.

3. Replace *{filter}* with the condition that you wish to apply to filter the list of roles. The following conditions are supported.

  | Condition | *{Filter}* | Replace |
  |-----------|------------|---------|
  | To list roles available for assignment at the specified scope and any of its child scopes. | `atScopeAndBelow()` | |
  | To search for a role using exact display name.                                             | `roleName%20eq%20'{role-display-name}'` | Replace *{role-display-name}* by the URL encoded form of the exact display name of the role. For instance, `$filter=roleName%20eq%20'Virtual%20Machine%20Contributor'` |

### Response

Status code: 200

```
{
  "value": [
    {
      "properties": {
        "roleName": "Virtual Machine Contributor",
        "type": "BuiltInRole",
        "description": "Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they\u2019re connected to.",
        "assignableScopes": [
          "/"
        ],
        "permissions": [
          {
            "actions": [
              "Microsoft.Authorization/*/read",
              "Microsoft.Compute/availabilitySets/*",
              "Microsoft.Compute/locations/*",
              "Microsoft.Compute/virtualMachines/*",
              "Microsoft.Compute/virtualMachineScaleSets/*",
              "Microsoft.Insights/alertRules/*",
              "Microsoft.Network/applicationGateways/backendAddressPools/join/action",
              "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
              "Microsoft.Network/loadBalancers/inboundNatPools/join/action",
              "Microsoft.Network/loadBalancers/inboundNatRules/join/action",
              "Microsoft.Network/loadBalancers/read",
              "Microsoft.Network/locations/*",
              "Microsoft.Network/networkInterfaces/*",
              "Microsoft.Network/networkSecurityGroups/join/action",
              "Microsoft.Network/networkSecurityGroups/read",
              "Microsoft.Network/publicIPAddresses/join/action",
              "Microsoft.Network/publicIPAddresses/read",
              "Microsoft.Network/virtualNetworks/read",
              "Microsoft.Network/virtualNetworks/subnets/join/action",
              "Microsoft.Resources/deployments/*",
              "Microsoft.Resources/subscriptions/resourceGroups/read",
              "Microsoft.Storage/storageAccounts/listKeys/action",
              "Microsoft.Storage/storageAccounts/read",
              "Microsoft.Support/*"
            ],
            "notActions": []
          }
        ],
        "createdOn": "2015-06-02T00:18:27.3542698Z",
        "updatedOn": "2015-12-08T03:16:55.6170255Z",
        "createdBy": null,
        "updatedBy": null
      },
      "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
      "type": "Microsoft.Authorization/roleDefinitions",
      "name": "9980e02c-c2be-4d73-94e8-173b1dc7cf3c"
    }
  ],
  "nextLink": null
}

```

## Get information about a Role

Gets information about a single role specified by the role definition identifier. To get information about a single role using its display name, see List all roles and roleName filter.

To get information about a role, you must have access to `Microsoft.Authorization/roleDefinitions/read` operation. All of the built-in roles are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure Role-Based Access Control](role-based-access-control-configure.md).

### Request

Use the **GET** method with the following URI:

	https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the scope for which you wish to list the role assignments. The following examples show how to specify the scope for different levels:

  | Level | *{Scope}* |
  |-------|-----------|
  | Subscription   | /subscriptions/{subscription-id} |
  | Resource Group | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  |
  | Resource       | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1 |

2. Replace *{role-definition-id}* with the GUID identifier of the role definition.

3. Replace *{api-version}* with 2015-07-01.

### Response

Status code: 200

```
{
  "value": [
    {
      "properties": {
        "roleName": "Virtual Machine Contributor",
        "type": "BuiltInRole",
        "description": "Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they\u2019re connected to.",
        "assignableScopes": [
          "/"
        ],
        "permissions": [
          {
            "actions": [
              "Microsoft.Authorization/*/read",
              "Microsoft.Compute/availabilitySets/*",
              "Microsoft.Compute/locations/*",
              "Microsoft.Compute/virtualMachines/*",
              "Microsoft.Compute/virtualMachineScaleSets/*",
              "Microsoft.Insights/alertRules/*",
              "Microsoft.Network/applicationGateways/backendAddressPools/join/action",
              "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
              "Microsoft.Network/loadBalancers/inboundNatPools/join/action",
              "Microsoft.Network/loadBalancers/inboundNatRules/join/action",
              "Microsoft.Network/loadBalancers/read",
              "Microsoft.Network/locations/*",
              "Microsoft.Network/networkInterfaces/*",
              "Microsoft.Network/networkSecurityGroups/join/action",
              "Microsoft.Network/networkSecurityGroups/read",
              "Microsoft.Network/publicIPAddresses/join/action",
              "Microsoft.Network/publicIPAddresses/read",
              "Microsoft.Network/virtualNetworks/read",
              "Microsoft.Network/virtualNetworks/subnets/join/action",
              "Microsoft.Resources/deployments/*",
              "Microsoft.Resources/subscriptions/resourceGroups/read",
              "Microsoft.Storage/storageAccounts/listKeys/action",
              "Microsoft.Storage/storageAccounts/read",
              "Microsoft.Support/*"
            ],
            "notActions": []
          }
        ],
        "createdOn": "2015-06-02T00:18:27.3542698Z",
        "updatedOn": "2015-12-08T03:16:55.6170255Z",
        "createdBy": null,
        "updatedBy": null
      },
      "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
      "type": "Microsoft.Authorization/roleDefinitions",
      "name": "9980e02c-c2be-4d73-94e8-173b1dc7cf3c"
    }
  ],
  "nextLink": null
}

```

## Create a Custom Role
Create a custom role.

To create a custom role, you must have access to `Microsoft.Authorization/roleDefinitions/write` operation on all of its `AssignableScopes`. Of the built-in roles, only *Owner* and *User Access Administrator* are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure Role-Based Access Control](role-based-access-control-configure.md).

### Request

Use the **PUT** method with the following URI:

	https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the first *AssignableScope* of the custom role. The following examples show how to specify the scope for different levels.

  | Level | *{Scope}* |
  |-------|-----------|
  | Subscription   | /subscriptions/{subscription-id} |
  | Resource Group | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  |
  | Resource       | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1 |

2. Replace *{role-definition-id}* with a new GUID. This will be used as the GUID identifier of the new custom role.

3. Replace *{api-version}* with 2015-07-01.

For the request body, provide the values in the following format:

```
{
  "name": "7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7",
  "properties": {
    "roleName": "Virtual Machine Operator",
    "description": "Lets you monitor virtual machines and restart them.",
    "type": "CustomRole",
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ]
  }
}

```

| Element Name | Required | Type | Description |
|--------------|----------|------|-------------|
| name                              | Yes | String   | GUID identifier of the custom role.                                                                                                      |
| properties.roleName               | Yes | String   | Display name of the custom role. Maximum size 128 characters.                                                                            |
| properties.description            | No  | String   | Description of the custom role. Maximum size 1024 characters.                                                                            |
| properties.type                   | Yes | String   | Set this to "CustomRole".                                                                                                                |
| properties.permissions.actions    | Yes | String[] | An array of action strings specifying the operations to which the custom role grants access.                                             |
| properties.permissions.notActions | No  | String[] | An array of action strings specifying the operations that are to be excluded from the operations to which the custom role grants access. |
| properties.assignableScopes       | Yes | String[] | An array of scopes in which the custom role can be used for access management.                                                           |

### Response

Status code: 201

```
{
  "properties": {
    "roleName": "Virtual Machine Operator",
    "type": "CustomRole",
    "description": "Lets you monitor virtual machines and restart them.",
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "createdOn": "2015-12-18T00:10:51.4662695Z",
    "updatedOn": "2015-12-18T00:10:51.4662695Z",
    "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7",
  "type": "Microsoft.Authorization/roleDefinitions",
  "name": "7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7"
}

```

## Update a Custom Role

Modify a custom role.

To modify a custom role, you must have access to `Microsoft.Authorization/roleDefinitions/write` operation on all of its `AssignableScopes`. Of the built-in roles, only *Owner* and *User Access Administrator* are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure Role-Based Access Control](role-based-access-control-configure.md).

### Request

Use the **PUT** method with the following URI:

	https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the first *AssignableScope* of the custom role. The following examples show how to specify the scope for different levels:

  | Level | *{Scope}* |
  |-------|-----------|
  | Subscription   | /subscriptions/{subscription-id} |
  | Resource Group | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  |
  | Resource       | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1 |

2. Replace *{role-definition-id}* with the GUID identifier of the custom role that is to be updated.

3. Replace *{api-version}* with 2015-07-01.

For the request body, provide the values in the following format:

```
{
  "name": "7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7",
  "properties": {
    "roleName": "Virtual Machine Operator",
    "description": "Lets you monitor virtual machines and restart them.",
    "type": "CustomRole",
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ]
  }
}

```

| Element Name | Required | Type | Description |
|--------------|----------|------|-------------|
| name         | Yes      | String | GUID identifier of the custom role to be updated. |
| properties.roleName | Yes | String | Display name of the updated custom role. |
| properties.description | No | String | Description of the updated custom role. |
| properties.type | Yes | String | Set this to "CustomRole". |
| properties.permissions.actions | Yes | String[] | An array of action strings specifying the operations to which the updated custom role grants access. |
| properties.permissions.notActions | No | String[] | An array of action strings specifying the operations that are to be excluded from the operations to which the updated custom role grants access. |
| properties.assignableScopes | Yes | String[] | An array of scopes in which the updated custom role can be used for access management. |

### Response

Status code: 201

```
{
  "properties": {
    "roleName": "Virtual Machine Operator",
    "type": "CustomRole",
    "description": "Lets you monitor virtual machines and restart them.",
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "createdOn": "2015-12-18T00:10:51.4662695Z",
    "updatedOn": "2015-12-18T00:10:51.4662695Z",
    "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7",
  "type": "Microsoft.Authorization/roleDefinitions",
  "name": "7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7"
}

```

## Delete a Custom Role

Delete a custom role.

To delete a custom role, you must have access to `Microsoft.Authorization/roleDefinitions/delete` operation on all of its `AssignableScopes`. Of the built-in roles, only *Owner* and *User Access Administrator* are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure Role-Based Access Control](role-based-access-control-configure.md).

### Request

Use the **DELETE** method with the following URI:

	https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the scope at which you wish to delete the role definition. The following examples show how to specify the scope for different levels:

  | Level | *{Scope}* |
  |-------|-----------|
  | Subscription   | /subscriptions/{subscription-id} |
  | Resource Group | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  |
  | Resource       | /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1 |

2. Replace *{role-definition-id}* with the GUID role definition id of the custom role that is to be deleted.

3. Replace *{api-version}* with 2015-07-01.

### Response

Status code: 200

```
{
  "properties": {
    "roleName": "Virtual Machine Operator",
    "type": "CustomRole",
    "description": "Lets you monitor virtual machines and restart them.",
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "createdOn": "2015-12-16T00:07:02.9236555Z",
    "updatedOn": "2015-12-16T00:07:02.9236555Z",
    "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/0bd62a70-e1b8-4e0b-a7c2-75cab365c95b",
  "type": "Microsoft.Authorization/roleDefinitions",
  "name": "0bd62a70-e1b8-4e0b-a7c2-75cab365c95b"
}

```


[AZURE.INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]
