---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/19/2026
ms.author: danlep
---

## Create custom roles

Create the following two [custom roles](/azure/role-based-access-control/custom-roles) that are assigned in later steps. You can use the permissions listed in the following JSON templates to create the custom roles using the [Azure portal](/azure/role-based-access-control/custom-roles-portal), [Azure CLI](/azure/role-based-access-control/custom-roles-cli), [Azure PowerShell](/azure/role-based-access-control/custom-roles-powershell), or other Azure tools.

When configuring the custom roles, update the [`AssignableScopes`](/azure/role-based-access-control/role-definitions#assignablescopes) property with appropriate scope values for your directory, such as a subscription in which your API Management instance is deployed. 

**API Management Configuration API Access Validator Service role**

```json
{
  "Description": "Can access RBAC permissions on the API Management resource to authorize requests in Configuration API.",
  "IsCustom": true,
  "Name": "API Management Configuration API Access Validator Service Role",
  "Permissions": [
    {
      "Actions": [
        "Microsoft.Authorization/*/read"
      ],
      "NotActions": [],
      "DataActions": [],
      "NotDataActions": []
    }
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionID}"
  ]
}
```

**API Management Gateway Configuration Reader role**

```json
{
  "Description": "Can read self-hosted gateway configuration from Configuration API",
  "IsCustom": true,
  "Name": "API Management Gateway Configuration Reader Role",
  "Permissions": [
    {
      "Actions": [],
      "NotActions": [],
      "DataActions": [
        "Microsoft.ApiManagement/service/gateways/getConfiguration/action"
      ],
      "NotDataActions": []
    }
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionID}"
  ]
}
```

## Add role assignments

### Assign API Management Configuration API Access Validator Service role 

Assign the API Management Configuration API Access Validator Service role to the managed identity of the API Management instance. For detailed steps to assign a role, see [Assign Azure roles using the portal](/azure/role-based-access-control/role-assignments-portal). 

- Scope: The resource group or subscription in which the API Management instance is deployed
- Role: API Management Configuration API Access Validator Service Role
- Assign access to: Managed identity of API Management instance