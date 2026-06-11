---
title: Assign Microsoft Discovery persona roles with a PowerShell script
description: Use the open-source Set-DiscoveryRoleAssignments.ps1 script to assign the full set of Azure RBAC roles required for the Platform Administrator and Scientist personas in Microsoft Discovery in a single, idempotent step.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 06/11/2026
# Customer intent: As a platform administrator, I want to assign all the Azure roles a Microsoft Discovery persona requires in one step, so that scientists and platform admins can start using the platform without hitting permission errors at runtime.
---

# Assign Microsoft Discovery persona roles with a PowerShell script

Microsoft Discovery personas - **Platform Administrator** and **Scientist** - each require multiple Azure built-in roles (storage, networking, managed identity, container registry, Azure AI, and the Microsoft Discovery built-in roles) at the right scope. Assigning them one-by-one through the Azure portal is repetitive and error-prone, and missing even one role typically surfaces only at runtime as an opaque `AuthorizationFailed` error.

To make this process a single, repeatable, idempotent step, the Microsoft Discovery team publishes the open-source PowerShell script **`Set-DiscoveryRoleAssignments.ps1`** in the [microsoft/discovery](https://github.com/microsoft/discovery) GitHub repository. This article shows you how to use it.

> [!TIP]
> Run this script **before** users try to access Microsoft Discovery. Most permission-related support cases come from one or more persona roles being missing or assigned at the wrong scope.

## When to use this script

Use the script when you need to:

- Onboard one or more users as **Platform Administrator** or **Scientist** on a Microsoft Discovery subscription or resource group.
- Re-verify that an existing user holds the full persona role set (the script is idempotent - already-assigned roles are reported as `AlreadyAssigned` and not re-created).
- Preview the role assignments that *would* be made for a user, without making any changes (`-WhatIf`).
- Automate persona onboarding from CI/CD with `-Force` and `-SkipModuleInstall`.

If you only need to assign a single Microsoft Discovery built-in role, the Azure portal, Azure CLI, or Azure PowerShell instructions in [Role assignments in Microsoft Discovery](concept-role-assignments.md#assign-roles) are sufficient.

## Prerequisites

| Requirement | Details |
|---|---|
| PowerShell | 5.1+ on Windows, 7.x on macOS or Linux |
| Az modules | `Az.Accounts >= 3.0.0`, `Az.Resources >= 7.0.0` (the script auto-installs them unless you pass `-SkipModuleInstall`) |
| Executor role | The user running the script must hold **Owner**, **User Access Administrator**, or **Role Based Access Control Administrator** at the target scope. The *Microsoft Discovery Platform Administrator (Preview)* role alone is **not** sufficient - that role can't grant the Azure built-in roles (Storage, Network, Managed Identity, Azure AI) each persona requires. |
| Target users | Must already exist in the tenant. Guest users must be invited to the tenant before role assignment. |

## What the script assigns

The script assigns the following roles for each persona. Roles marked *(Subscription)* are always assigned at subscription scope regardless of the `-Scope` parameter you pick.

### Platform Administrator

- Microsoft Discovery Platform Administrator (Preview)
- Managed Identity Contributor
- Managed Identity Operator
- Storage Account Contributor
- Storage Blob Data Contributor
- Network Contributor
- AcrPush
- Reader *(Subscription)*
- Foundry Owner *(Subscription, or the workspace managed resource group when `-Scope ResourceGroup`)*
- Microsoft Discovery Bookshelf Index Data Reader (Preview)

### Scientist

- Microsoft Discovery Platform Contributor (Preview)
- Storage Account Contributor
- Storage Blob Data Contributor
- AcrPush
- Reader *(Subscription)*
- Foundry User *(Subscription, or the workspace managed resource group when `-Scope ResourceGroup`)*
- Microsoft Discovery Bookshelf Index Data Reader (Preview)

For the full description of each role, see [Role assignments in Microsoft Discovery](concept-role-assignments.md).

## Download the script

Download `Set-DiscoveryRoleAssignments.ps1` from the [microsoft/discovery](https://github.com/microsoft/discovery/tree/main/utilities/rbac-roles-assignment) repository:

```powershell
# Download to the current directory
Invoke-WebRequest `
  -Uri "https://raw.githubusercontent.com/microsoft/discovery/main/utilities/rbac-roles-assignment/Set-DiscoveryRoleAssignments.ps1" `
  -OutFile "./Set-DiscoveryRoleAssignments.ps1"
```

> [!NOTE]
> The full README including parameter reference, exit codes, troubleshooting, and cross-tenant guidance is at [utilities/rbac-roles-assignment/README.md](https://github.com/microsoft/discovery/blob/main/utilities/rbac-roles-assignment/README.md).

## Run the script

### Interactive (recommended for first-time use)

```powershell
./Set-DiscoveryRoleAssignments.ps1
```

The script prompts for `SubscriptionId`, `Persona`, `UserIds`, `Scope`, `ResourceGroupName` (if RG scope), and `WorkspaceManagedRGName` (if RG scope).

### Assign Platform Administrator at subscription scope

```powershell
./Set-DiscoveryRoleAssignments.ps1 `
    -Persona PlatformAdministrator `
    -SubscriptionId "<subscription-guid>" `
    -Scope Subscription `
    -UserIds "alice@contoso.com","bob@contoso.com"
```

### Assign Scientist at resource group scope

This assignment assumes the Azure Container Registry, storage account, virtual network, managed identities, and the Discovery workspace all live in the same resource group `contoso-discovery-rg`.

```powershell
./Set-DiscoveryRoleAssignments.ps1 `
    -Persona Scientist `
    -SubscriptionId "<subscription-guid>" `
    -Scope ResourceGroup `
    -ResourceGroupName "contoso-discovery-rg" `
    -WorkspaceManagedRGName "contoso-discovery-mrg" `
    -UserIds "scientist1@contoso.com;scientist2@contoso.com"
```

### Preview without making changes

```powershell
./Set-DiscoveryRoleAssignments.ps1 `
    -Persona PlatformAdministrator `
    -SubscriptionId "<subscription-guid>" `
    -Scope Subscription `
    -UserIds "alice@contoso.com" `
    -WhatIf
```

### Automate from CI

```powershell
./Set-DiscoveryRoleAssignments.ps1 `
    -Persona Scientist `
    -SubscriptionId "<subscription-guid>" `
    -TenantId "<tenant-guid>" `
    -Scope Subscription `
    -UserIds "user1@contoso.com","user2@contoso.com" `
    -SkipModuleInstall `
    -Force `
    -AllowIncomplete
```

## Important: resource group scope assumption

When you choose **`-Scope ResourceGroup`**, the script grants every non-subscription role at that single resource group. **This works only if every Azure resource that Microsoft Discovery uses lives in that same resource group**, including:

- The Microsoft Discovery workspace
- Azure Container Registry
- Storage accounts used by Discovery
- Virtual network and subnets used by Discovery
- User-assigned managed identities used by Discovery

If your Discovery resources span multiple resource groups (for example, ACR or the virtual network in a shared networking resource group), RG-scoped assignments won't cover them and the platform will surface permission errors at runtime. In that case, use **`-Scope Subscription`** instead, or run the script multiple times, once per resource group using the appropriate persona.

The Reader role is always assigned at subscription scope. The Azure AI Owner (Platform Administrator) and Azure AI User (Scientist) roles are assigned at the workspace managed resource group when `-Scope ResourceGroup`, and at subscription scope when `-Scope Subscription`.

## Two-step workflow when the workspace doesn't exist yet (RG scope only)

The workspace managed resource group is created only after the Microsoft Discovery workspace is provisioned. If you run the script before the workspace exists, the **Azure AI Owner/User** role assignment is skipped.

1. **Step 1: pre-create the other roles.** Run the script without `-WorkspaceManagedRGName`. When prompted to include the AI role, answer **N**. All other roles are assigned and the AI role is reported as `Skipped`.
1. **Create the Microsoft Discovery workspace** through the Azure portal, CLI, or Bicep. Note the generated managed resource group name.
1. **Step 2: finish the AI role.** Rerun the script with `-WorkspaceManagedRGName <mrg-name>`. The script prints a ready-to-paste rerun command at the end of step 1 to make this easy. Already-assigned roles are detected and reported as `AlreadyAssigned`.

With `-Scope Subscription`, the AI role is assigned at subscription scope alongside the other roles, and this two-step workflow isn't needed.

## Output and exit codes

After execution, the script prints three clearly separated sections:

- **ASSIGNED ROLES**: successfully assigned, already in place, or planned (in `-WhatIf`).
- **ROLES THAT COULD NOT BE ASSIGNED (FAILED)**: includes the underlying error per row.
- **SKIPPED ROLES**: includes the reason (for example, the workspace managed resource group name wasn't provided, or the role hasn't propagated to your tenant yet).

| Exit code | Meaning |
|---|---|
| 0 | All assignments succeeded or already existed |
| 2 | Partial success—one or more roles were skipped or failed |
| 3 | Aborted before any changes (validation, permission, or no resolvable users) |
| 4 | Unhandled exception |

## Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `FATAL: -ResourceGroupName is required when -Scope is 'ResourceGroup'.` | Pass `-ResourceGroupName <name>` or choose `-Scope Subscription`. |
| `Role 'Microsoft Discovery Bookshelf Index Data Reader - Preview' not found in this tenant.` | The role hasn't propagated to the tenant yet. The run continues; rerun later to pick it up. |
| `Azure AI Owner/User ... [-WorkspaceManagedRGName not provided; ...]` | The workspace hasn't been created yet. Use the two-step workflow above, or run with `-Scope Subscription`. |
| `Permission denied` from `New-AzRoleAssignment` | The user running the script lacks Owner, User Access Administrator, or Role Based Access Control Administrator at the target scope. |
| `Unable to acquire token for tenant '...' — User interaction is required` | The subscription lives in a different tenant from your default sign-in. Pass `-TenantId <guid>` or enter the tenant GUID at the prompt. |

For the full troubleshooting guide, including cross-tenant authentication, see the [script README](https://github.com/microsoft/discovery/blob/main/utilities/rbac-roles-assignment/README.md#troubleshooting).

## Related content

- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Quickstart: Deploy infrastructure using Azure portal](quickstart-infrastructure-portal.md)
- [Quickstart: Deploy infrastructure using Bicep](quickstart-infrastructure-bicep.md)
- [Configure network security](how-to-configure-network-security.md)
- [Set-DiscoveryRoleAssignments.ps1 on GitHub](https://github.com/microsoft/discovery/tree/main/utilities/rbac-roles-assignment)
