---
title: Microsoft Discovery Resource Provider Registration
description: Learn how to register the Microsoft Discovery resource provider and its dependencies in your Azure subscription to enable Discovery services.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 03/10/2026
---

# Microsoft Discovery resource provider registration

Registering the Microsoft Discovery resource provider is a prerequisite for creating and using Microsoft Discovery resources in your Azure subscription. This article explains what resource provider registration means, what permissions you need, and how to complete registration using the Azure portal, Azure CLI, Azure PowerShell, or the REST API.

## What is a resource provider?

An Azure resource provider is a set of REST operations that enable functionality for a specific Azure service. The Microsoft Discovery service uses a resource provider named `Microsoft.Discovery`, which defines REST operations for managing Discovery resources.

Resource types in Microsoft Discovery follow the format `Microsoft.Discovery/{resource-type}`, for example:

- `Microsoft.Discovery/workspaces`
- `Microsoft.Discovery/storages`
- `Microsoft.Discovery/supercomputers`
- `Microsoft.Discovery/bookshelves`

Registering a resource provider configures your Azure subscription to work with that service. You need to register `Microsoft.Discovery` and its dependent providers before you can deploy any Discovery resources.

## Prerequisites

Before registering the Microsoft Discovery resource provider, ensure you have:

- An active [Azure subscription](https://portal.azure.com/) **enabled by the Microsoft Discovery team** to use the `Microsoft.Discovery` resource provider.
- One of the following roles assigned to your account at the subscription scope:
  - **Contributor** role (or higher)
  - **Owner** role
  - A custom role with the `/register/action` operation for resource providers

> [!IMPORTANT]
> Only register resource providers when you're ready to use them, to maintain least-privilege access within your subscription.

## Registration methods

You can register the `Microsoft.Discovery` resource provider using the Azure portal, Azure CLI, Azure PowerShell, or the REST API.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Subscriptions**.
1. Select the subscription enabled for Microsoft Discovery.
1. In the left menu under **Settings**, select **Resource providers**.
1. In the search box, type `Microsoft.Discovery`.
1. Select the `Microsoft.Discovery` provider from the list.
1. Select **Register**.

The registration status changes from **Not Registered** to **Registering**, and then to **Registered**. Registration can take a few minutes. It runs in parallel across supported regions, so you don't need to wait for all regions to finish before you create resources.

After registering `Microsoft.Discovery`, register the following dependent resource providers using the same steps:

- `Microsoft.Network`
- `Microsoft.Compute`
- `Microsoft.Storage`
- `Microsoft.ManagedIdentity`
- `Microsoft.AlertsManagement`
- `Microsoft.Authorization`
- `Microsoft.CognitiveServices`
- `Microsoft.ContainerInstance`
- `Microsoft.ContainerRegistry`
- `Microsoft.ContainerService`
- `Microsoft.DocumentDB`
- `Microsoft.Features`
- `Microsoft.KeyVault`
- `Microsoft.MachineLearningServices`
- `Microsoft.NetApp`
- `Microsoft.OperationalInsights`
- `Microsoft.ResourceGraph`
- `Microsoft.Search`
- `Microsoft.Web`
- `Microsoft.Insights`
- `Microsoft.Resources`

#### Verify registration in the portal

Refresh the **Resource providers** page and confirm that all the Resource Providers shows a **Registered** status.

### Azure CLI

#### Prerequisites

- [Azure CLI installed](/cli/azure/install-azure-cli)
- Authenticated to your Azure account (`az login`)

#### Register the resource provider

```azurecli
az provider register --namespace Microsoft.Discovery
```

#### Verify registration

```azurecli
az provider show --namespace Microsoft.Discovery --query "registrationState"
```

The command returns `"Registered"` when registration is complete.

#### List all resource providers and their status

```azurecli
az provider list --query "[].{Provider:namespace, Status:registrationState}" --out table
```

### Azure PowerShell

#### Prerequisites

- [Azure PowerShell module installed](/powershell/azure/install-azure-powershell)
- Authenticated to your Azure account (`Connect-AzAccount`)

#### Register the resource provider

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.Discovery
```

#### Verify registration

```azurepowershell
Get-AzResourceProvider -ProviderNamespace Microsoft.Discovery
```

### REST API

For programmatic registration, use the Azure Resource Manager REST API.

#### Request

```http
POST https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Discovery/register?api-version=2021-04-01
```

#### Required headers

| Header          | Value                   |
|-----------------|-------------------------|
| `Authorization` | `Bearer {access-token}` |
| `Content-Type`  | `application/json`      |

## Post-registration steps

After registration is complete:

1. **Verify the registration status.** Confirm that `Microsoft.Discovery` shows **Registered** in the portal, or run the CLI or PowerShell verification commands.

1. **Check available resource types.** In the Azure portal search bar, type **Microsoft Discovery** to see all available Microsoft Discovery resource types in your subscription.

1. **Proceed with resource creation.** You can now create the following Microsoft Discovery resources:
   - Workspaces
   - Projects
   - Investigations
   - Supercomputers
   - Nodepools
   - Bookshelves
   - Storage Containers
   - Tools
   - Agents

## Related content

- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md)
