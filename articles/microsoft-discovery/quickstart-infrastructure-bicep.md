---
title: 'Quickstart: Deploy Microsoft Discovery infrastructure using Bicep'
description: This quickstart shows you how to deploy the prerequisite infrastructure for Microsoft Discovery using Bicep.
author: mukesh-dua
ms.author: mukeshdua
ms.date: 03/19/2026
ms.topic: quickstart
ms.service: azure
ms.custom: subject-armqs, mode-arm, devx-track-bicep
# Customer intent: "As a platform administrator, I want to deploy Microsoft Discovery infrastructure using Bicep, so that I can set up the prerequisite resources for a Discovery workspace."
---

# Quickstart: Deploy Microsoft Discovery infrastructure using Bicep

This quickstart describes how to use Bicep to deploy the prerequisite infrastructure for Microsoft Discovery. The deployment creates the foundational Azure resources required before you can create a Discovery workspace, supercomputer, and projects.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

- An Azure subscription that has been allow-listed by the Microsoft Discovery team. If your subscription isn't yet enabled, contact your Microsoft account representative to request access.

- Register the required resource providers in your subscription. For more information, see [Resource provider registration](concept-resource-provider-registration.md).

- Ensure you have the **Platform / IT administrator** persona roles assigned at the subscription or resource group scope. For the full list of required roles, see [Roles required by persona](concept-role-assignments.md#roles-required-by-persona).

> [!IMPORTANT]
> Microsoft Discovery workspaces are network-hardened by default. Before you deploy this template, you must also create the **Discovery NSP Perimeter Joiner** custom role and assign it to the Discovery first-party service principal so the control plane can configure Network Security Perimeters in your subscription. For the role definition, see [Discovery NSP Perimeter Joiner (custom role)](concept-role-assignments.md#discovery-nsp-perimeter-joiner-custom-role). For step-by-step setup, see [Assign the NSP Perimeter Joiner role](how-to-configure-network-security.md?tabs=azure-cli#assign-the-nsp-perimeter-joiner-role).

- Verify you have sufficient [quota reservations](concept-quota-reservation.md) for your target region.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.discovery/discovery-infra-deployment).

In this quickstart, you deploy the full Microsoft Discovery stack into *Sweden Central*. The deployment creates a virtual network with a *10.0.0.0/16* address space and five subnets for supercomputer node pools, AKS, workspace, private endpoints, and agents. A *Standard_LRS* storage account is provisioned with CORS rules enabled for Discovery Studio and VS Code. A user-assigned managed identity is created with *Storage Blob Data Contributor*, *Discovery Platform Contributor*, and *AcrPull* role assignments. The core Discovery resources include a supercomputer with a *Standard_D4s_v6* node pool (scaling from *0* to *3* nodes), a workspace with a *GPT-5.1* chat model deployment, a storage container, and a project.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.discovery/discovery-infra-deployment/main.bicep":::

Multiple Azure resources have been defined in the Bicep file:

- **Microsoft.Network/virtualNetworks** - Virtual network with five subnets for supercomputer node pool, AKS, workspace, private endpoint, and agent workloads.
- **Microsoft.ManagedIdentity/userAssignedIdentities** - User-assigned managed identity for supercomputer and workspace authentication.
- **Microsoft.Storage/storageAccounts** - Azure Blob Storage account with CORS rules for Discovery Studio and VS Code integrations.
- **Microsoft.Authorization/roleAssignments** - Storage Blob Data Contributor, Discovery Platform Contributor, and AcrPull role assignments for the managed identity.
- **Microsoft.Discovery/supercomputers** - Supercomputer resource with cluster, kubelet, and workload identities.
- **Microsoft.Discovery/supercomputers/nodePools** - Configurable node pool with VM size, min/max node count, and scale set priority.
- **Microsoft.Discovery/workspaces** - Workspace linked to the supercomputer with agent, private endpoint, and workspace subnets.
- **Microsoft.Discovery/workspaces/chatModelDeployments** - Chat model deployment under the workspace.
- **Microsoft.Discovery/storageContainers** - Storage container backed by the Azure Blob Storage account.
- **Microsoft.Discovery/workspaces/projects** - Project linked to the storage container.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

# [CLI](#tab/CLI)

```azurecli
az group create --name exampleRG --location swedencentral
az deployment group create --resource-group exampleRG --template-file main.bicep
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name exampleRG -Location swedencentral
New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
```

---

When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete all the resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you deployed the full Microsoft Discovery stack, including:

- Virtual network with five subnets
- User-assigned managed identity with role assignments
- Azure Blob Storage account with CORS rules
- Supercomputer with a node pool
- Workspace with a chat model deployment
- Storage container and project

After you create your project, continue with the following next step:

- [Get started with agents and investigations in Microsoft Discovery Studio](quickstart-agents-studio.md)
