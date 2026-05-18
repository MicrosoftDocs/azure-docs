---
title: Role assignments in Microsoft Discovery
description: Learn about Azure role-based access control (RBAC) for Microsoft Discovery, including the three built-in roles, their permissions, and how to assign them.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 03/10/2026
---

# Role assignments in Microsoft Discovery

Microsoft Discovery uses Azure role-based access control permissions to control who can access resources and what actions they can perform. This article explains the three built-in Microsoft Discovery roles, the other Azure roles commonly required alongside them, and how to assign roles using the Azure portal, Azure CLI, or Azure PowerShell.

## Understanding role assignments

A role assignment is the mechanism by which access is granted or revoked in Azure. Each assignment binds a **security principal** (user, group, or service principal) to a **role definition** at a particular **scope** (subscription, resource group, or resource).

**Example:** "User Sarah Johnson has the *Microsoft Discovery Platform Contributor (Preview)* role assigned on the resource group `contoso-discovery-rg`."

In that example:

| Component | Value |
|-----------|-------|
| Principal | Sarah Johnson (user) |
| Role | Microsoft Discovery Platform Contributor (Preview) |
| Scope | Resource group `contoso-discovery-rg` |

For background on Azure RBAC concepts, see [Azure role-based access control documentation](../role-based-access-control/overview.md).

## Built-in Microsoft Discovery roles

Microsoft Discovery provides four built-in roles. Three are designed around research personas; one is a specialized role for agent-knowledgebase integration scenarios. They're listed here in order of decreasing permissions.

### Microsoft Discovery Platform Administrator (Preview)

**Role definition ID:** `7a2b6e6c-472e-4b39-8878-a26eb63d75c6`

**Target persona:** Platform admins (IT administrators, DevOps engineers)

Platform admins manage the infrastructure that scientists and engineers depend on. They're familiar with Azure, prioritize security and governance, and are responsible for creating the core resources that other users need to work with Microsoft Discovery.

**Assignable scopes:** Subscription, resource group

**Primary interfaces:** Azure portal, Microsoft Discovery Studio, REST APIs, CLIs, and SDKs

**Description:** Grants full access to manage all `Microsoft.Discovery` resources, including both control plane and data plane operations.

**Key capabilities:**

- Full administrative access to all Microsoft Discovery resources
- Create, update, and delete workspaces, supercomputers, storage containers, and node pools
- Complete control over project lifecycle management
- Manage tools, models, agents, workflows, investigations, and bookshelves
- Full access to data containers and data assets
- Configure platform settings and manage access controls
- Assign and revoke Microsoft Discovery roles for users within the assigned scope

> [!NOTE]
> The Microsoft Discovery Platform Administrator (Preview) role includes permissions to assign and delete role assignments within its assigned scope. Administrators don't need the Owner or User Access Administrator role separately for that purpose. However, this role assignment capability is restricted by an ABAC condition that limits which roles the administrator can assign or remove to the three Microsoft Discovery built-in roles only.

**Permissions:**

| Permission | Purpose |
|------------|---------|
| `Microsoft.Discovery/locations/operationStatuses/read` | Fetch the status of ongoing API operations |
| `Microsoft.Discovery/checkNameAvailability/action` | Verify workspace name uniqueness during creation |
| `Microsoft.Discovery/*` | Read, write, and delete access to all Microsoft Discovery resource types |
| `Microsoft.Authorization/*/read` | Check assigned permissions for each resource |
| `Microsoft.Insights/alertRules/*` | Read and modify alert rules on resources |
| `Microsoft.Resources/deployments/*` | Fetch deployment status of resources in the resource group |
| `Microsoft.Resources/subscriptions/resourceGroups/read` | Read resources within a resource group |
| `Microsoft.Network/virtualNetworks/subnets/read` | Read subnet configuration used during supercomputer deployment |
| `Microsoft.Network/virtualNetworks/read` | Read virtual network configuration during supercomputer deployment |
| `Microsoft.Network/virtualNetworks/subnets/join/action` | Linked access check for supercomputer node pool subnet references |
| `Microsoft.Support/*` | Raise support tickets for the subscription |
| `Microsoft.Authorization/roleAssignments/write` | Assign access to platform users and managed identities (ABAC condition–restricted) |
| `Microsoft.Authorization/roleAssignments/delete` | Revoke access when required (ABAC condition–restricted) |

**Data actions:** `Microsoft.Discovery/*`

---

### Microsoft Discovery Platform Contributor (Preview)

**Role definition ID:** `01288891-85ee-45a7-b367-9db3b752fc65`

**Target persona:** Scientists and researchers (computational scientists, domain experts, research teams)

Contributors are end users of the platform: trained scientists and researchers working at commercial enterprises who are domain experts in science verticals such as chemistry, physics, or biology. They work across multiple early-stage R&D projects and are not comfortable with Azure administration or high-performance computing setup.

**Assignable scopes:** Subscription, resource group

**Primary interface:** Microsoft Discovery Studio

**Description:** Grants permissions to view and operate on most Discovery platform resources—including workspaces, supercomputers, storages, agents, bookshelves, data containers, models, tools, workflows, and investigations—and to perform data plane actions. Doesn't allow creating, updating, or deleting core infrastructure resources such as workspaces, supercomputers, storages, bookshelves, node pools, or projects. This role is in preview and subject to change.

**Key capabilities:**

- Create, modify, and manage investigations, tools, models, agents, and workflows
- Full control over data containers and data assets
- Read access to workspaces, supercomputers, storages, bookshelves, and node pools
- Share and collaborate on research through conversations and shared investigations

**Key limitations:**

- Can't create, update, or delete workspaces, supercomputers, storages, bookshelves, node pools, or projects
- Can't manage platform configuration or assign roles to other users

**Permissions:**

| Permission | Purpose |
|------------|---------|
| `Microsoft.Discovery/locations/operationStatuses/read` | Fetch the status of ongoing API operations |
| `Microsoft.Discovery/operations/read` | Fetch operations and their details |
| `Microsoft.Discovery/workspaces/read` | Read workspace details |
| `Microsoft.Discovery/supercomputers/read` | Read supercomputer details |
| `Microsoft.Discovery/storages/read` | Read discovery storage details |
| `Microsoft.Discovery/agents/*` | Read, write, and delete agents |
| `Microsoft.Discovery/bookshelves/read` | Read bookshelf details |
| `Microsoft.Discovery/dataContainers/*` | Read, write, and delete data containers; for backward compatibility with v1 |
| `Microsoft.Discovery/dataContainers/dataAssets/*` | Read, write, and delete data assets within data containers; This is for backward compatibility with v1 |
| `Microsoft.Discovery/storageContainers/*` | Read, write, and delete storage containers |
| `Microsoft.Discovery/storageContainers/storageAssets/*` | Read, write, and delete storage assets within storage containers |
| `Microsoft.Discovery/models/*` | Read, write, and delete models; for backward compatibility with v1 |
| `Microsoft.Discovery/supercomputers/nodePools/read` | Read node pools within supercomputers |
| `Microsoft.Discovery/tools/*` | Read, write, and delete tools |
| `Microsoft.Discovery/workflows/*` | Read, write, and delete workflows; for backward compatibility with v1 |
| `Microsoft.Discovery/workspaces/projects/read` | Read project details |
| `Microsoft.Insights/alertRules/*` | Read and modify alert rules on resources |
| `Microsoft.Authorization/*/read` | Read role assignments for a resource |
| `Microsoft.Resources/deployments/*` | Fetch resource deployment details, including status |
| `Microsoft.Resources/subscriptions/resourceGroups/read` | Read resource groups within the scope |
| `Microsoft.Support/*` | Create support tickets when assistance is required |

**Not actions (explicitly denied):**

| Not action | Description |
|------------|-------------|
| `Microsoft.Discovery/workspaces/write` | Can't create or update workspaces |
| `Microsoft.Discovery/workspaces/delete` | Can't delete workspaces |
| `Microsoft.Discovery/supercomputers/write` | Can't create or update supercomputers |
| `Microsoft.Discovery/supercomputers/delete` | Can't delete supercomputers |
| `Microsoft.Discovery/storages/write` | Can't create or update storages |
| `Microsoft.Discovery/storages/delete` | Can't delete storages |
| `Microsoft.Discovery/bookshelves/write` | Can't create or update bookshelves |
| `Microsoft.Discovery/bookshelves/delete` | Can't delete bookshelves |
| `Microsoft.Discovery/supercomputers/nodePools/write` | Can't create or update node pools |
| `Microsoft.Discovery/supercomputers/nodePools/delete` | Can't delete node pools |
| `Microsoft.Discovery/workspaces/projects/write` | Can't create or update projects |
| `Microsoft.Discovery/workspaces/projects/delete` | Can't delete projects |

**Data actions:** `Microsoft.Discovery/*`

---

### Microsoft Discovery Platform Reader (Preview)

**Role definition ID:** `3bb7c424-af4e-436b-bfcc-8779c8934c31`

**Target persona:** Observers and reviewers (guest users, internal teams, partners)

Readers have limited privileges to view and review information. They can't create or update resources and can't perform any computational work on the platform.

**Assignable scopes:** Subscription, resource group

**Primary interface:** Microsoft Discovery Studio (read-only)

**Description:** Grants read-only permissions to view all `Microsoft.Discovery` resources for both control plane and data plane operations. This role is in preview and subject to change.

**Key capabilities:**

- Read-only access to all resources, including workspaces, projects, investigations, and research outputs
- Monitor research activities, workflow executions, and results
- Read access to bookshelves, conversations, and shared research data
- View tools, models, agents, and workflow configurations

**Key limitations:**

- Can't create, update, or delete any resources
- Can't run workflows, start investigations, or perform computational work
- Can't upload or modify data containers or data assets

**Permissions:**

| Permission | Purpose |
|------------|---------|
| `Microsoft.Discovery/*/read` | List and view all Microsoft Discovery resource types |
| `Microsoft.Resources/deployments/read` | List and view deployments of resources within the scope |
| `Microsoft.Resources/subscriptions/resourceGroups/read` | Read resource group details within the scope |

**Data actions:** `Microsoft.Discovery/*/read`

---

### Microsoft Discovery Bookshelf Index Data Reader (Preview)

**Target persona:** AI developers other than the owner who created the Knowledge base

**Assignable scopes:** Subscription, resource group, resource

**Primary interface:** REST APIs, SDKs

**Description:** Grants query access to search and retrieve data from Microsoft Discovery Bookshelf knowledge bases. 

**Key capabilities:**

- Retrieving data from Microsoft Discovery Bookshelf knowledge base versions using Discovery Agents
- Minimum required access for agents to query linked knowledge bases

**Key limitations:**

- Can't create, update, or delete any resources
- Can't perform any control plane or other data plane operations
- No data action permissions; access is limited to the single search action

**Permissions:**

| Permission | Purpose |
|------------|---------|
| `Microsoft.Discovery/bookshelf/knowledgeBaseVersions/search` | Search and retrieve data from Bookshelf knowledge base versions |

**Data actions:** None

---

### Discovery NSP Perimeter Joiner (custom role)

**Target persona:** Microsoft Discovery first-party service principal (**Discovery control-plane service App**, app ID `92c174ac-8e41-4815-a1b7-d81b19ab03ce`) — *not* a human user.

**Assignable scopes:** Subscription

**Primary interface:** Azure CLI, Azure PowerShell, Azure portal (created by a subscription Owner during initial setup)

**Description:** A *customer-created custom role* that grants the Microsoft Discovery control plane the minimum permissions it needs to associate (join) managed PaaS resources to the workspace's Network Security Perimeter (NSP) when provisioning network-hardened workspaces, supercomputers, and bookshelves. The NSP itself, and its access-rule profiles, are created by the Discovery service in the workspace's managed resource group; this role only authorizes the *resource-association* step. Network hardening is enabled by default for all new Discovery resources, so this role assignment is a one-time setup step per subscription.

**Key capabilities:**

- Joins managed PaaS resources (Azure OpenAI, Cosmos DB, Key Vault, Storage, Azure AI Search) to the Discovery-managed NSP at deployment time (creates the `resourceAssociations` entry on the NSP)
- Reads NSP operation status to track association progress

**Key limitations:**

- Can't create, modify, or delete the NSP resource itself, its profiles, or its access rules
- Can't create, modify, or delete `resourceAssociations` outside the join action (no broad write/delete on the NSP)
- Can't read or modify any other Azure resource
- Doesn't grant any data plane access

**Permissions:**

| Permission | Purpose |
|------------|---------|
| `Microsoft.Network/networkSecurityPerimeters/joinPerimeterRule/action` | Join managed resources to a Network Security Perimeter |
| `Microsoft.Network/locations/networkSecurityPerimeterOperationStatuses/read` | Read the status of NSP operations |

**Data actions:** None

> [!IMPORTANT]
> This role isn't a built-in Azure role — you create it once per subscription. Workspace, supercomputer, and bookshelf creation fail with NSP association errors if this role isn't assigned to the **Discovery control-plane service App** service principal before the first deployment. For full instructions, see [Assign the NSP Perimeter Joiner role](how-to-configure-network-security.md?tabs=azure-cli#assign-the-nsp-perimeter-joiner-role).

---

## Roles required by persona

The following table summarizes the recommended role combinations for each user persona. Roles can be assigned at the subscription or resource group scope. You can add more roles as your requirements grow.

> [!TIP]
> Start with least-privilege roles scoped to the narrowest scope needed, and expand permissions only as required.

| Platform administrator | Scientist / researcher | Reader / viewer |
|-----------------------------|------------------------|-----------------|
| Microsoft Discovery Platform Administrator (Preview) | Microsoft Discovery Platform Contributor (Preview) | Microsoft Discovery Platform Reader (Preview) |
| Managed Identity Contributor | Storage Account Contributor | Reader |
| Managed Identity Operator | Storage Blob Data Contributor | |
| Storage Account Contributor | AcrPush | |
| Storage Blob Data Contributor | Reader (subscription level) | |
| Network Contributor | Azure AI User (Workspace MRG level) | |
| AcrPush | Microsoft Discovery Bookshelf Index Data Reader (Preview) | |
| Reader | | |
| Azure AI Owner (Workspace MRG level) | | |
| Microsoft Discovery Bookshelf Index Data Reader (Preview) | | |

## Other Azure roles definition

Some workflows require Azure built-in roles beyond the Microsoft Discovery roles. The following table lists the most common ones.

| Role | Scenario | Recommended scope |
|------|----------|-------------------|
| Managed Identity Contributor | Create, read, update, and delete User Assigned Managed Identity (UAMI) resources | Subscription, resource group |
| Managed Identity Operator | Assign roles to managed identity resources | Subscription, resource group, resource |
| Storage Account Contributor | Create, read, update, and delete Azure Storage account resources including blob containers | Subscription, resource group |
| Storage Blob Data Contributor | Upload, manage, and delete files within Azure Blob Storage containers | Subscription, resource group, resource |
| Network Contributor | Create, read, update, and delete virtual network resources | Subscription, resource group |
| AcrPush | Upload tool or model images to Azure Container Registry | Subscription, resource group, resource |
| Reader | Read API operation status for deployments | Subscription |

## Who can assign Microsoft Discovery roles

To assign Microsoft Discovery roles, you need one of the following Azure RBAC permissions at the target scope:

| Role | Description |
|------|-------------|
| **Owner** | Can assign any Microsoft Discovery role at subscription, resource group, or resource level. Recommended for initial platform setup. |
| **User Access Administrator** | Designed for managing user access without requiring full resource management permissions. Ideal for dedicated identity and access management teams. |
| **Microsoft Discovery Platform Administrator (Preview)** | Can assign Discovery built-in roles within its assigned scope, subject to the ABAC condition that restricts assignments to the three Discovery roles only. |

## Understanding assignment scopes

Microsoft Discovery roles can be assigned at two scope levels:

**Subscription scope**
- Grants access to all Microsoft Discovery resources within the subscription.
- Best suited for platform administrators who need broad access.
- Use sparingly and only for trusted administrators.

**Resource group scope**
- Grants access to all Microsoft Discovery resources within a specific resource group.
- Well suited for team-based access where multiple workspaces exist in the same resource group.
- Recommended: Assign roles after the resource group containing Discovery resources is created to avoid inheritance gaps.

## Assign roles

### Azure portal

1. Navigate to the appropriate scope (subscription, resource group, or resource).
1. Select **Access control (IAM)** from the left menu.
1. Select **Add** > **Add role assignment**.
1. On the **Role** tab, search for the Microsoft Discovery role you want to assign and select it.
1. Select **Next**.
1. On the **Members** tab, ensure **Assign access to** is set to **User, group, or service principal**.
1. Select **+ Select members**, choose the principals, and select **Next**.
1. Review the assignment and select **Review + assign**.

> [!IMPORTANT]
> Ensure that workspaces and resource groups are fully provisioned before assigning workspace-scoped or resource group-scoped roles to avoid access gaps.

### Azure CLI

```azurecli
# Assign Platform Administrator role to a user at subscription scope
az role assignment create \
  --assignee user@contoso.com \
  --role "Microsoft Discovery Platform Administrator (Preview)" \
  --scope "/subscriptions/{subscription-id}"

# Assign Platform Contributor role to a user at resource group scope
az role assignment create \
  --assignee user@contoso.com \
  --role "Microsoft Discovery Platform Contributor (Preview)" \
  --scope "/subscriptions/{subscription-id}/resourceGroups/{rg-name}"

# Assign Platform Reader role to a group at resource group scope
az role assignment create \
  --assignee-object-id {group-object-id} \
  --role "Microsoft Discovery Platform Reader (Preview)" \
  --scope "/subscriptions/{subscription-id}/resourceGroups/{rg-name}"

# Assign Bookshelf Index Data Reader role to a managed identity at resource group scope
az role assignment create \
  --assignee {managed-identity-object-id} \
  --role "Microsoft Discovery Bookshelf Index Data Reader (Preview)" \
  --scope "/subscriptions/{subscription-id}/resourceGroups/{rg-name}"
```

### Azure PowerShell

```azurepowershell
# Assign Platform Administrator role to a group at resource group scope
New-AzRoleAssignment `
  -ObjectId {group-object-id} `
  -RoleDefinitionName "Microsoft Discovery Platform Administrator (Preview)" `
  -Scope "/subscriptions/{subscription-id}/resourceGroups/{rg-name}"

# Assign Platform Contributor role to a user at resource group scope
New-AzRoleAssignment `
  -SignInName user@contoso.com `
  -RoleDefinitionName "Microsoft Discovery Platform Contributor (Preview)" `
  -Scope "/subscriptions/{subscription-id}/resourceGroups/{rg-name}"

# Assign Platform Reader role to a user at subscription scope
New-AzRoleAssignment `
  -SignInName user@contoso.com `
  -RoleDefinitionName "Microsoft Discovery Platform Reader (Preview)" `
  -Scope "/subscriptions/{subscription-id}"

# Assign Bookshelf Index Data Reader role to a managed identity at resource group scope
New-AzRoleAssignment `
  -ObjectId {managed-identity-object-id} `
  -RoleDefinitionName "Microsoft Discovery Bookshelf Index Data Reader (Preview)" `
  -Scope "/subscriptions/{subscription-id}/resourceGroups/{rg-name}"
```

## Related content

- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Resource provider registration in Microsoft Discovery](concept-resource-provider-registration.md)
- [Azure RBAC documentation](../role-based-access-control/overview.md)
- [Azure built-in roles](../role-based-access-control/built-in-roles.md)
