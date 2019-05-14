---
title: Managed Application with Managed Identity
description: Learn how to configure a Managed Application to contain a Managed Identity. This can be used to allow the customer to grant the Managed Application access to additional existing resources.
services: managed-applications
ms.service: managed-applications
ms.topic: conceptual
ms.reviewer:
ms.author: jobreen
author: jjbfour
ms.date: 05/13/2019
---
# How to deploy and use Managed Application with Managed Identity

> [!NOTE]
> Managed Identity support for Managed Applications is currently in preview. Please use the 2018-09-01-preview api version to utilize Managed Identity.

Learn how to configure a Managed Application to contain a Managed Identity. This can be used to allow the customer to grant the Managed Application access to additional existing resources. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about managed identities in AAD, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

Your application can be granted two types of identities:

- A **system-assigned identity** is tied to your application and is deleted if your app is deleted. An app can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource which can be assigned to your app. An app can have multiple user-assigned identities.

## Adding Managed Identity to a Managed Application

> [!NOTE]
> A **user-assigned identity** must be [configured](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md) before deploying the Managed Application.

Creating a Managed Application with a Managed Identity requires an additional property to be set on the Azure resource. An example of an identity property on a Managed Application would like:

```json
{
        "type": "Microsoft.Solutions/applications",
        "name": "identityManagedApp",
        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Solutions/applications/identityManagedApp",
        "location": "east us",
        "identity": {
            "type": "SystemAssigned, UserAssigned",
            "userAssignedIdentities": {
                "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.ManagedIdentity/userassignedidentites/myuserassignedidentity": {}
            }
        },
        "properties": {
            "ManagedResourceGroupId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testManagedRG",
            "parameters": { }
        }
}
```

### Using CreateUIDefinition

A Managed Application can be configured with Managed Identity through the [CreateUIDefinition.json](./create-uidefinition-overview.md). In the [outputs section](./create-uidefinition-overview.md#outputs), the key `managedIdentity` can be used to override the identity property of the Managed Application template.

```json
"outputs": {
    "managedIdentity": "[parse('{\"Type\":\"SystemAssigned\"}')]"
}
```

This will enable **system-assigned** identity on the Managed Application. Customers can then give the Managed Application permission to other existing resources within their Azure subscription.

### Using Azure Resource Manager templates

> [!NOTE]
> Marketplace Managed Application templates are automatically generated for customers going through the Azure portal create experience.
> For these scenarios, the `managedIdentity` output key must be used instead to enabled identity.

The Managed Identity can also be enabled through Azure Resource Manager templates.

```json
"resources": [
    {
        "type": "Microsoft.Solutions/applications",
        "name": "[parameters('applicationName')]",
        "apiVersion": "2018-09-01-preview",
        "location": "[parameters('location')]",
        "identity": {
            "type": "SystemAssigned"
        },
        "properties": {
            "ManagedResourceGroupId": "[parameters('managedByResourceGroupId')]",
            "parameters": { }
        }
    }
]
```

## Accessing the Managed Application Managed Identity token

The token of the Managed Application can now be accessed through the `listTokens` api. An example request might look like the following:

``` HTTP
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Solutions/applications/{applicationName}?api-version=2018-09-01-preview HTTP/1.1
```

A sample response might look like:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json

{
    "value": [
        {
            "access_token": "eyJ0eXAi…",
            "expires_in": "2…",
            "expires_on": "1557…",
            "not_before": "1557…",
            "authorizationAudience": "https://management.azure.com/",
            "resourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Solutions/applications/{applicationName}",
            "token_type": "Bearer"
        }
    ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [How to configure a Managed Application with a Custom Provider](./custom-providers-overview.md)