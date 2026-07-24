---
title: Manage access for Microsoft Planetary Computer Pro
description: Learn how to manage role-based access control (RBAC) for Microsoft Planetary Computer Pro GeoCatalog resources.
author: jglixon
ms.author: jglixon
ms.service: planetary-computer-pro
ms.topic: how-to
ms.date: 05/29/2026
#customer intent: As a GeoCatalog user, I want to manage user access to my GeoCatalog so that I can assign the appropriate permissions to authorized users of Microsoft Planetary Computer Pro.
---

# Manage access for Microsoft Planetary Computer Pro

This article shows you how to manage identities in [Microsoft Entra ID](/entra/fundamentals/whatis), and how to configure role-based access control (RBAC) for Microsoft Planetary Computer Pro. This process allows the user to assign specific GeoCatalog resource access permissions to Microsoft Entra identities.

## Prerequisites

- Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
- An existing [GeoCatalog resource](./deploy-geocatalog-resource.md)
- [Azure CLI](/cli/azure/install-azure-cli) (for CLI-based role assignment)
- Authenticated to Azure via `az login`. The GeoCatalog control plane API requires [Azure Active Directory OAuth2 authentication](/rest/api/planetarycomputer/resource-manager/geocatalogs/create) with the `user_impersonation` scope. The Azure CLI handles this automatically after sign-in.

## Create and manage users

Create and manage your users list by following the Microsoft Entra ID [create, invite, and delete users](/entra/fundamentals/how-to-create-delete-users) how-to article. Once your users are created, you need to grant proper permissions to them to access a GeoCatalog resource with the assignment of one or more RBAC roles. 

Planetary Computer Pro defines two GeoCatalog resource specific roles, in addition to Azure built in roles:

| **Role**                          | **Description**                                                                                     | **Allows RBAC Management?** |
|------------------------------------|-----------------------------------------------------------------------------------------------------|----------------------|
| **GeoCatalog Administrator**       | Allows the user to read, write, and delete data inside a GeoCatalog                                 | No                   |
| **GeoCatalog Reader**              | Allows the user to only read GeoCatalogs data.                                                          | No                   |
| **Owner**                          | Azure built-in role that grants full access to all resources, including the ability to manage RBAC.  | Yes                  |
| **User Access Administrator**      | Azure built-in role that allows management of user access to Azure resources.                      | Yes                  |
| **Role Based Access Control Administrator** | Azure built-in role that allows management of RBAC assignments and permissions.                   | Yes                  |

> [!NOTE]
> **Owner** is also a **GeoCatalog Administrator**.

## Authentication and authorization overview

Before an identity can be authorized via RBAC, it must first authenticate to Microsoft Entra ID. The authentication method depends on the type of identity accessing your GeoCatalog:

| Identity type | Authentication method | Then authorize with |
|---------------|----------------------|---------------------|
| **User** (portal, CLI, Explorer) | Interactive sign-in ([`az login`](/cli/azure/authenticate-azure-cli) or browser OAuth2) | RBAC roles assigned in this article |
| **[Managed identity](/entra/identity/managed-identities-azure-resources/overview)** (apps on Azure) | Automatic token via Azure infrastructure | RBAC roles assigned in this article |
| **Service principal** (apps outside Azure) | Client secret/certificate via [Entra app registration](/entra/identity-platform/quickstart-register-app) | RBAC roles assigned in this article |

All GeoCatalog control plane and data plane operations require a valid OAuth2 bearer token with the `user_impersonation` scope. For detailed setup per scenario, see [Configure application authentication](./application-authentication.md). For more information about Azure RBAC concepts, see [Azure role-based access control overview](/azure/role-based-access-control/overview).

## Assign role-based access control to a user

You can use the Azure portal to assign RBAC roles to Planetary Computer Pro users. This section demonstrates how to use the GeoCatalog **Access Control (IAM)** controls to assign the **GeoCatalog Administrator** role to one or more users.

1. Within Azure portal, go to your GeoCatalog resource **Access control (IAM)** tab in the left sidebar:

    [ ![Screenshot of the IAM blade in the Azure portal for configuring RBAC.](media/role-based-access-control-identity-access-management-blade.png) ](media/role-based-access-control-identity-access-management-blade.png#lightbox)

1. Select **Add** > **Add role Assignment**. 
1. Select **GeoCatalog Administrator** from the list of **Job function roles**, and then select the **Next** button at the bottom of the page:

    [ ![Screenshot showing the RBAC role assignment options in the Azure portal.](media/role-based-access-control-role-assignment.png) ](media/role-based-access-control-role-assignment.png#lightbox)

1. Select the radio button of **User, group, or service principal**:

    [ ![Screenshot showing the members section during RBAC role assignment in the Azure portal.](media/role-based-access-control-members-section.png) ](media/role-based-access-control-members-section.png#lightbox)

1. Select **Select members**
1. Search for the user on the **Select members** pane that appears on the right-hand side. Select a name or identity from the list to add it to the list of **Selected Members**. Repeat this step for each of the users that need to be assigned this role. 
1. When all the users for whom you need to assign this role are selected, use the **Select** button at the bottom of the pane to close the pane.

1. Select **Next** at the bottom of the page.
1. Verify the information, then complete the assignment by selecting **review + assign**.

Now the selected users are able to access the GeoCatalog resource, either through Azure portal or APIs.

## Assign roles using the Azure CLI

You can also assign RBAC roles using the Azure CLI, which calls the ARM control plane API (`Microsoft.Authorization/roleAssignments`).

### Assign a role

```azurecli
# Define variables
SUBSCRIPTION_ID="{your-subscription-id}"
RESOURCE_GROUP="{your-resource-group}"
GEOCATALOG_NAME="{your-geocatalog-name}"
ASSIGNEE_OBJECT_ID="{user-or-service-principal-object-id}"

# GeoCatalog Administrator role definition ID
ROLE_DEFINITION_ID="$(az role definition list --name "GeoCatalog Administrator" --query "[0].id" -o tsv)"

# Assign the role scoped to the GeoCatalog resource
az role assignment create \
  --assignee-object-id "$ASSIGNEE_OBJECT_ID" \
  --role "$ROLE_DEFINITION_ID" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$GEOCATALOG_NAME"
```

### Remove a role assignment

```azurecli
az role assignment delete \
  --assignee "$ASSIGNEE_OBJECT_ID" \
  --role "GeoCatalog Administrator" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$GEOCATALOG_NAME"
```

### List role assignments for a GeoCatalog

```azurecli
az role assignment list \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$GEOCATALOG_NAME" \
  --output table
```

## Related content

- [Configure Application Authentication for Microsoft Planetary Computer Pro](./application-authentication.md)
- [Assign a managed identity to a GeoCatalog resource](./assign-managed-identity-geocatalog-resource.md)
- [Azure role-based access control overview](/azure/role-based-access-control/overview)
- [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli)