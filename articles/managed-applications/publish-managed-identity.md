---
title: Managed Application with Managed Identity
description: Learn how to configure a Managed Application with a Managed Identity. This can be used to allow the customer to grant the Managed Application access to additional existing resources.
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
- A **user-assigned identity** is a standalone Azure resource that can be assigned to your app. An app can have multiple user-assigned identities.

## Adding Managed Identity to a Managed Application

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

This will enable **system-assigned** identity on the Managed Application. More complex identity objects can be formed by using CreateUIDefinition elements to ask the consumer for inputs. These inputs can be used to construct Managed Applications with **user-assigned identity**.

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

## Granting the Managed Application access to Azure resources

Once a Managed Application is granted an identity it can be granted access to existing azure resources. This can be done through the Access control (IAM)interface in the Azure portal. The name of the Managed Application or **user-assigned identity** can be searched to add a role assignment.

![Add role assignment for Managed Application](./media/publish-managed-identity/identity-role-assignment.png.png)

### Deploying a Managed Application that requires linked existing resources

> [!NOTE]
> A **user-assigned identity** must be [configured](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md) before deploying the Managed Application.

Managed Identity can also be used to deploy a Managed Application that requires access to existing resources during its deployment. When the Managed Application is provisioned by the customer, **user-assigned identities** can be added to provide additional authorizations to the **mainTemplate** deployment. A sample CreateUIDefinition for a customer to input a **user-assigned identity** might look like:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Compute.MultiVm",
  "version": "0.1.2-preview",
    "parameters": {
        "basics": [
            {}
        ],
        "steps": [
            {
                "name": "manageIdentity",
                "label": "Identity",
                "subLabel": {
                    "preValidation": "Manage Identities",
                    "postValidation": "Done"
                },
                "bladeTitle": "Identity",
                "elements": [
                    {
                        "name": "userAssignedText",
                        "type": "Microsoft.Common.TextBox",
                        "label": "User assigned managed identity",
                        "visible": true
                    }
                ]
            }
        ],
        "outputs": {
            "managedIdentity": "[parse(concat('{\"Type\":\"UserAssigned\",\"UserAssignedIdentities\":{',string(steps('manageIdentity').userAssignedText),':{}}}'))]"
        }
    }
}
```

This can be used to solve scenarios like deploying Azure virtual machines (VMs) within the **managed resource group** that are attached to an [existing network interface](../virtual-network/virtual-network-network-interface-vm.md).

## Accessing the Managed Application Managed Identity token

The token of the Managed Application can now be accessed through the `listTokens` api from the publisher tenant. An example request might look like the following:

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