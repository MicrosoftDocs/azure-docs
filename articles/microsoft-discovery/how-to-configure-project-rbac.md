---
title: Configure project-level access in Microsoft Discovery
description: Learn how to assign Microsoft Discovery project roles and supplementary resource roles by using the Azure portal, Azure CLI, or Azure PowerShell.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 08/17/2026
# Customer intent: As a platform administrator, I want to grant a user access to one Microsoft Discovery project and only the shared resources that the project requires.
---

# Configure project-level access in Microsoft Discovery

This article shows you how to grant a user or group access to a specific Microsoft Discovery project without granting workspace-wide access. It also explains how to grant least-privilege access to tools, chat models, storage containers, and knowledge bases used by the project.

For the access model and security considerations, see [Project-level access control in Microsoft Discovery](concept-project-rbac.md).

## Prerequisites

- An existing Microsoft Discovery workspace and project.
- The object ID of the Microsoft Entra user, group, or service principal that needs access.
- **Owner**, **User Access Administrator**, or **Role Based Access Control Administrator** at the project scope or an inherited scope.
- For command-line procedures:
  - [Azure CLI](/cli/azure/install-azure-cli) signed in with `az login`, or
  - [Azure PowerShell](/powershell/azure/install-azure-powershell) signed in with `Connect-AzAccount`.

> [!NOTE]
> A project role manages an existing project. It doesn't grant permission to create a new project or assign Azure roles.

## Choose an assignment bundle

A project role covers project-owned operations. Pair it with access to the shared resources that the user needs.

| User requirement | Project role | Recommended companion roles |
|---|---|---|
| Author agents, manage investigations, and create project artifacts | **Microsoft Discovery Project Contributor (Preview)** | Tools Reader, Chat Model Reader, Storage Account Contributor, Storage Blob Data Contributor, Storage Container Contributor, and Bookshelf Index Data Reader, each scoped to approved resources |
| Run agents that a platform administrator already created | **Microsoft Discovery Project Contributor (Preview)** | Tools Reader and Chat Model Reader aren't required solely to run the pre-created agent; add storage or Bookshelf roles if the user needs direct access |
| Review project investigations and generated content | **Microsoft Discovery Project Reader (Preview)** | Storage Container Reader and Storage Blob Data Reader; optionally Tools Reader and Bookshelf Index Data Reader |

> [!IMPORTANT]
> Treat the project role and its companion resource roles as one paired access package. The built-in role definitions already exist; create role assignments for the project and each approved shared resource instead of creating custom role definitions.

> [!NOTE]
> A Project Contributor can run Discovery Engine without a separate Chat Model Reader assignment for the platform-configured `gpt-5-4` deployment.

> [!NOTE]
> This guidance assumes that a Platform Administrator or Platform Contributor creates and manages Discovery tools. Assign Tools Reader to a Project Contributor only so they can view approved tool definitions and attach those tools to agents that they create or update in the project. Tools Reader doesn't permit tool creation, modification, or deletion.

### Example role selection

| Person | Assign | What the person can do |
|---|---|---|
| Research scientist actively authoring and running a project | **Project Contributor** with the required Contributor companion roles | Create and manage investigations, agents, tasks, shared sessions, storage assets, and project artifacts; select approved tools, models, and knowledge bases |
| Principal investigator, auditor, partner, or scientific reviewer | **Project Reader** with the required Reader companion roles | Inspect project configuration and results, view storage assets and blob content, and optionally inspect tools or query accessible knowledge bases without changing project content |

Project Contributor doesn't permit project creation or role assignment. Project Reader doesn't permit creating, changing, running, or deleting project-owned resources.

## Build the project resource ID

The project scope uses the following format:

```text
/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Discovery/workspaces/{workspace-name}/projects/{project-name}
```

Use the exact subscription, resource group, workspace, and project names. An assignment at the workspace instead of the project grants inherited access to every project in that workspace.

## Assign the project role

# [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open the Microsoft Discovery workspace, and then open the project.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.
1. On the **Role** tab, search for and select either **Microsoft Discovery Project Contributor (Preview)** or **Microsoft Discovery Project Reader (Preview)**.
1. Select **Next**.
1. On the **Members** tab, select **User, group, or service principal**, and then select **Select members**.
1. Select the user, group, or service principal, and then select **Review + assign**.

# [Azure CLI](#tab/azure-cli)

Set values for your environment:

```azurecli
subscriptionId="<subscription-id>"
resourceGroup="<resource-group-name>"
workspaceName="<workspace-name>"
projectName="<project-name>"
principalObjectId="<principal-object-id>"

projectScope="/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Discovery/workspaces/${workspaceName}/projects/${projectName}"

az account set --subscription "$subscriptionId"
```

Assign Project Contributor:

```azurecli
az role assignment create \
  --assignee-object-id "$principalObjectId" \
  --assignee-principal-type User \
  --role "Microsoft Discovery Project Contributor (Preview)" \
  --scope "$projectScope"
```

For a group or service principal, change `--assignee-principal-type` to `Group` or `ServicePrincipal`. To grant read-only access, use **Microsoft Discovery Project Reader (Preview)** as the role name.

# [Azure PowerShell](#tab/azure-powershell)

Set values for your environment:

```azurepowershell
$subscriptionId = "<subscription-id>"
$resourceGroup = "<resource-group-name>"
$workspaceName = "<workspace-name>"
$projectName = "<project-name>"
$principalObjectId = "<principal-object-id>"

$projectScope = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.Discovery/workspaces/$workspaceName/projects/$projectName"

Set-AzContext -SubscriptionId $subscriptionId
```

Assign Project Contributor:

```azurepowershell
New-AzRoleAssignment `
  -ObjectId $principalObjectId `
  -RoleDefinitionName "Microsoft Discovery Project Contributor (Preview)" `
  -Scope $projectScope
```

To grant read-only access, use **Microsoft Discovery Project Reader (Preview)** as the role name.

---

## Assign access to shared resources

A project role doesn't grant access to resources outside the project. Complete the appropriate Contributor or Reader assignment bundle, but assign only the resources required by the user's workflow.

| If the user needs to | Assign | Scope |
|---|---|---|
| View a tool definition or select a tool while creating an agent | **Microsoft Discovery Tools Reader (Preview)** | Individual tool, or the resource group or subscription that contains approved tools |
| Select a chat model when creating an agent | **Microsoft Discovery Chat Model Reader (Preview)** | Individual chat model deployment or its workspace |
| Access and manage the backing storage account | **Storage Account Contributor** | Backing storage account or its resource group |
| List and read Discovery storage container and asset metadata | **Microsoft Discovery Storage Container Reader (Preview)** | Individual Microsoft Discovery storage container |
| Create, update, or delete Discovery storage assets used by project investigations | **Microsoft Discovery Storage Container Contributor (Preview)** | Individual Microsoft Discovery storage container |
| Read blob contents | **Storage Blob Data Reader** | Backing blob container, storage account, resource group, or subscription |
| Upload, change, or delete blob contents | **Storage Blob Data Contributor** | Backing blob container, storage account, resource group, or subscription |
| Discover, select, and query an approved Bookshelf knowledge base | **Microsoft Discovery Bookshelf Index Data Reader - Preview** | Individual bookshelf, resource group, or subscription |

> [!IMPORTANT]
> The Discovery storage container roles control Discovery resource metadata. They don't grant access to the underlying blob contents. Assign the corresponding Azure Storage data role separately.

### Assign linked-resource roles with Azure CLI

The following example grants access to one tool and one chat model:

```azurecli
toolScope="/subscriptions/${subscriptionId}/resourceGroups/<tool-resource-group>/providers/Microsoft.Discovery/tools/<tool-name>"
modelScope="/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Discovery/workspaces/${workspaceName}/chatModelDeployments/<model-name>"

az role assignment create \
  --assignee-object-id "$principalObjectId" \
  --assignee-principal-type User \
  --role "Microsoft Discovery Tools Reader (Preview)" \
  --scope "$toolScope"

az role assignment create \
  --assignee-object-id "$principalObjectId" \
  --assignee-principal-type User \
  --role "Microsoft Discovery Chat Model Reader (Preview)" \
  --scope "$modelScope"
```

The following example grants a Project Contributor access to the storage account, one Discovery storage container, and its backing Azure Blob container:

```azurecli
storageAccountScope="/subscriptions/${subscriptionId}/resourceGroups/<storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
discoveryContainerScope="/subscriptions/${subscriptionId}/resourceGroups/<storage-resource-group>/providers/Microsoft.Discovery/storageContainers/<discovery-container-name>"
blobContainerScope="/subscriptions/${subscriptionId}/resourceGroups/<storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>/blobServices/default/containers/<blob-container-name>"

az role assignment create \
  --assignee-object-id "$principalObjectId" \
  --assignee-principal-type User \
  --role "Storage Account Contributor" \
  --scope "$storageAccountScope"

az role assignment create \
  --assignee-object-id "$principalObjectId" \
  --assignee-principal-type User \
  --role "Microsoft Discovery Storage Container Contributor (Preview)" \
  --scope "$discoveryContainerScope"

az role assignment create \
  --assignee-object-id "$principalObjectId" \
  --assignee-principal-type User \
  --role "Storage Blob Data Contributor" \
  --scope "$blobContainerScope"
```

For a Project Reader, assign **Microsoft Discovery Storage Container Reader (Preview)** at `discoveryContainerScope` and **Storage Blob Data Reader** at `blobContainerScope` instead.

If the user must discover, select, or query a knowledge base, assign the Bookshelf role:

```azurecli
bookshelfScope="/subscriptions/${subscriptionId}/resourceGroups/<bookshelf-resource-group>/providers/Microsoft.Discovery/bookshelves/<bookshelf-name>"

az role assignment create \
  --assignee-object-id "$principalObjectId" \
  --assignee-principal-type User \
  --role "Microsoft Discovery Bookshelf Index Data Reader - Preview" \
  --scope "$bookshelfScope"
```

### Assign linked-resource roles with Azure PowerShell

```azurepowershell
$toolScope = "/subscriptions/$subscriptionId/resourceGroups/<tool-resource-group>/providers/Microsoft.Discovery/tools/<tool-name>"
$modelScope = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.Discovery/workspaces/$workspaceName/chatModelDeployments/<model-name>"
$storageAccountScope = "/subscriptions/$subscriptionId/resourceGroups/<storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
$discoveryContainerScope = "/subscriptions/$subscriptionId/resourceGroups/<storage-resource-group>/providers/Microsoft.Discovery/storageContainers/<discovery-container-name>"
$blobContainerScope = "/subscriptions/$subscriptionId/resourceGroups/<storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>/blobServices/default/containers/<blob-container-name>"
$bookshelfScope = "/subscriptions/$subscriptionId/resourceGroups/<bookshelf-resource-group>/providers/Microsoft.Discovery/bookshelves/<bookshelf-name>"

New-AzRoleAssignment `
  -ObjectId $principalObjectId `
  -RoleDefinitionName "Microsoft Discovery Tools Reader (Preview)" `
  -Scope $toolScope

New-AzRoleAssignment `
  -ObjectId $principalObjectId `
  -RoleDefinitionName "Microsoft Discovery Chat Model Reader (Preview)" `
  -Scope $modelScope

New-AzRoleAssignment `
  -ObjectId $principalObjectId `
  -RoleDefinitionName "Storage Account Contributor" `
  -Scope $storageAccountScope

New-AzRoleAssignment `
  -ObjectId $principalObjectId `
  -RoleDefinitionName "Microsoft Discovery Storage Container Contributor (Preview)" `
  -Scope $discoveryContainerScope

New-AzRoleAssignment `
  -ObjectId $principalObjectId `
  -RoleDefinitionName "Storage Blob Data Contributor" `
  -Scope $blobContainerScope

New-AzRoleAssignment `
  -ObjectId $principalObjectId `
  -RoleDefinitionName "Microsoft Discovery Bookshelf Index Data Reader - Preview" `
  -Scope $bookshelfScope
```

For a Project Reader, omit the chat model and storage account contributor assignments unless another workflow requires them. Use **Microsoft Discovery Storage Container Reader (Preview)** and **Storage Blob Data Reader** for storage access. Assign the Bookshelf role only if the reader should be able to list and query accessible knowledge bases.

## Verify the assignments

# [Azure portal](#tab/verify-portal)

1. Open the project in the Azure portal.
1. Select **Access control (IAM)** > **Role assignments**.
1. Filter by the user's or group's name and verify the project role and scope.
1. Repeat the check on each linked resource where you assigned a supplementary role.

# [Azure CLI](#tab/verify-cli)

```azurecli
az role assignment list \
  --assignee "$principalObjectId" \
  --scope "$projectScope" \
  --include-inherited \
  --output table
```

Run the same command with each tool, model, storage, or bookshelf scope to verify supplementary assignments.

# [Azure PowerShell](#tab/verify-powershell)

```azurepowershell
Get-AzRoleAssignment `
  -ObjectId $principalObjectId `
  -Scope $projectScope |
  Select-Object DisplayName, RoleDefinitionName, Scope
```

---

Allow time for Azure RBAC assignments to propagate. Then verify that the user:

- Can open the assigned project.
- Can't open an unassigned project.
- Can create or update an agent only with approved tools and chat models.
- Can access only the storage and knowledge resources explicitly assigned.

If the user only runs precreated agents, verify agent execution without granting Tools Reader or Chat Model Reader. Also verify that Discovery Engine runs without a separate Chat Model Reader assignment for the platform `gpt-5-4` deployment.

## Troubleshooting

| Symptom | Cause and resolution |
|---|---|
| You can't see the project | Verify that the role is assigned at the full project resource ID and allow time for Azure RBAC propagation. |
| You can see every project | You inherited a Microsoft Discovery Platform role from the workspace, resource group, or subscription. Review and narrow the broader assignment. |
| The tool list is empty or agent creation is denied | Assign **Microsoft Discovery Tools Reader (Preview)** on every referenced tool or an approved containing scope. |
| The model picker is empty or agent creation is denied | Assign **Microsoft Discovery Chat Model Reader (Preview)** on the selected model deployment or workspace. |
| A contributor can run an existing agent but can't view its tool or model | This behavior is expected when the agent was created by a platform administrator. Assign Tools Reader or Chat Model Reader only if the contributor must view those definitions or update the agent. |
| Discovery Engine runs without Chat Model Reader | This behavior is expected. Project Contributor authorizes Discovery Engine, and its platform `gpt-5-4` deployment doesn't require a separate user assignment. |
| You can't access the storage account used for project artifacts | Assign **Storage Account Contributor** on the backing storage account or its resource group. |
| Storage assets are visible, but files can't be opened | Assign **Storage Blob Data Reader** or **Storage Blob Data Contributor** on the backing Azure Storage scope. |
| A knowledge base isn't listed or can't be queried | Assign **Microsoft Discovery Bookshelf Index Data Reader - Preview** on the bookshelf or an inherited scope. |
| Agent creation worked before a linked-resource role was removed | Linked-resource access is checked during agent create or update, not every run. Update or remove agents that reference the revoked resource. |
| A project-only user can't read Workbench session status | Some Workbench read and status operations require inherited workspace access because they don't include project context. |

## Related content

- [Project-level access control in Microsoft Discovery](concept-project-rbac.md)
- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Microsoft Discovery projects and shared sessions](concept-projects-investigations.md)
- [Azure RBAC best practices](/azure/role-based-access-control/best-practices)
