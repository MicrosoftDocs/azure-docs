---
title: Register Microsoft Discovery resource providers
description: Learn how to register the Microsoft Discovery resource provider and its dependencies in your Azure subscription to enable Discovery services.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026
---

# Register Microsoft Discovery resource providers

<a id="microsoft-discovery-resource-provider-registration"></a>

Register `Microsoft.Discovery` and its dependencies before creating Discovery resources. This article covers manual registration through the Azure portal, Azure CLI, Azure PowerShell, or REST. If you use the onboarding tool, [Stage 2](how-to-prepare-landing-zone.md) performs registration for its deployment scope.

## Prerequisites

- An active [Azure subscription](https://portal.azure.com/) **enabled by the Microsoft Discovery team** for `Microsoft.Discovery`. Registration doesn't replace service enablement.
- **Contributor** or **Owner** at subscription scope, or a custom role permitting provider registration (`Microsoft.Resources/subscriptions/providers/register/action`) and the reads needed to verify it.
- For command-line methods, the relevant Azure CLI or Azure PowerShell installation and a signed-in context for the intended subscription.

## What is a resource provider?

An Azure resource provider is a set of REST operations that enable functionality for a specific Azure service. The Microsoft Discovery service uses a resource provider named `Microsoft.Discovery`, which defines REST operations for managing Discovery resources.

Resource types in Microsoft Discovery follow the format `Microsoft.Discovery/{resource-type}`, for example:

- `Microsoft.Discovery/workspaces`
- `Microsoft.Discovery/storageContainers`
- `Microsoft.Discovery/supercomputers`
- `Microsoft.Discovery/bookshelves`

Registering a resource provider configures your Azure subscription to work with that service. You need to register `Microsoft.Discovery` and its dependent providers before you can deploy any Discovery resources.

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

After registering `Microsoft.Discovery`, review and register the dependent providers for your planned services by using the same steps. This list covers the broader Discovery deployment guidance. The onboarding tool's Stage 2 registers its own implementation-defined subset and doesn't deploy every optional capability.

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
- `Microsoft.Sql`
- `Microsoft.App`
- `Microsoft.Bing`

#### Verify registration in the portal

Refresh the **Resource providers** page and confirm that the providers needed for your deployment show **Registered**.

### Azure CLI

#### Prerequisites

- [Azure CLI installed](/cli/azure/install-azure-cli)
- Authenticated to your Azure account (`az login`)

#### Register the resource provider

```azurecli
az provider register --namespace Microsoft.Discovery
```

Select the subscription you want to use with `az account set --subscription "<subscription-id>"` before registration. Repeat registration for each required dependent provider.

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

Use `Set-AzContext -SubscriptionId "<subscription-id>"` to select the subscription you want. Repeat for the required dependent providers.

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

For REST verification, use a GET request to the subscription's provider endpoint and confirm that `registrationState` is `Registered`:

```http
GET https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Discovery?api-version=2021-04-01
```

Use an Azure Resource Manager access token in the Authorization header as `Bearer <access-token>`; don't put real tokens in source files or reports.

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
- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)
