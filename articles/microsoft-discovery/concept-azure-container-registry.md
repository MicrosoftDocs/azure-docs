---
title: Azure Container Registry in Microsoft Discovery
description: Learn how Azure Container Registry integrates with Microsoft Discovery to store and manage containerized tools images.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 03/10/2026
---

# Azure Container Registry in Microsoft Discovery

Azure Container Registry (ACR) is a private container registry service that serves as the image repository for containerized components in Microsoft Discovery. This article explains the role ACR plays in the platform, the SKU and networking options available, and how to create and configure a registry using the Azure portal or Azure CLI.

> [!NOTE]
> You'll require an ACR if you're planning to publish a tool for agentic workflow.

## Role of ACR in Microsoft Discovery

Microsoft Discovery uses ACR to:

- Store containerized scientific tools and computational packages
- Manage model containers for AI and machine learning workloads
- Provide versioning for containerized components across research workflows

Every tool that runs on a Discovery supercomputer is pulled from a container registry. ACR provides a private, governed, and regionally colocated image store that integrates naturally with the rest of the Discovery infrastructure on Azure.

## Prerequisites

Before creating an Azure Container Registry for use with Microsoft Discovery, ensure the following:

- An active Azure subscription with the **Contributor** or **Owner** role on the target resource group.
- The `Microsoft.ContainerRegistry` resource provider is registered on your subscription.
- A resource group in the same region as your planned Microsoft Discovery workspace.
- (For private networking) A virtual network with appropriate subnets already provisioned.

The following Azure built-in roles are needed at various points in the registry lifecycle:

| Role | Purpose |
|------|---------|
| Contributor | Create and configure the registry |
| AcrPush | Push images to the registry (tool publishers and CI pipelines) |
| AcrPull | Pull images from the registry (supercomputer managed identity) |

## Choosing an ACR SKU

ACR is available in three SKUs. Choose the one that fits your environment:

| SKU | Recommended use | Private endpoint support |
|-----|----------------|--------------------------|
| Basic | Development and evaluation | No |
| Standard | Production workloads | No |
| Premium | Production with private networking requirements | Yes |

> [!TIP]
> Use **Premium** for any Discovery deployment where the supercomputer or workspace must access ACR through a private endpoint or where public network access is disabled.

## Networking considerations

How the registry is accessed from within your Discovery deployment depends on your network topology.

### Public network access

By default, ACR is publicly accessible with authentication. It's acceptable for development environments or when advanced networking isn't yet required. Authentication is still enforced—no anonymous pulls are allowed.

### Virtual network rules (Standard and Premium)

You can restrict registry access to specific subnets by adding virtual network rules. It's appropriate when your supercomputer node pools and AKS clusters are in known subnets and you want to reduce the registry's exposure without the overhead of a private endpoint.

### Private endpoints (Premium only)

Private endpoints assign a private IP address to the registry within your virtual network. All traffic between Discovery resources and ACR stays on the Azure backbone, and public access can be disabled entirely. It's the most secure option and is recommended for production environments with strict compliance requirements.

A private DNS zone (`privatelink.azurecr.io`) linked to your virtual network is required alongside the private endpoint so that the registry hostname resolves to the private IP address.

## Create a registry

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Container registries** and select it.
1. Select **+ Create**.
1. Fill in the **Basics** tab:
   - **Subscription**: select your subscription.
   - **Resource group**: select the resource group for your Discovery resources.
   - **Registry name**: enter a globally unique name (5–50 alphanumeric characters).
   - **Location**: select the same region as your Discovery workspace.
   - **SKU**: select **Standard** (or **Premium** if you need private endpoints).
1. On the **Networking** tab, configure public access:
   - Select **All networks** to keep public access enabled.
   - Select **Disabled** (Premium only) to set up private-only access after creation.
1. Select **Review + create**, then **Create**.

After the registry is created, you can configure advanced networking from the registry's **Networking** settings blade:

- **Firewall and virtual networks**: add IP ranges or virtual network rules.
- **Private endpoint connections**: create private endpoints for virtual network integration.
- **Public network access**: modify the public access setting at any time.

### Azure CLI

The following steps show how to create a registry and optionally configure network access.

#### Set variables

```azurecli
SUBSCRIPTION_ID="<your-subscription-id>"
RESOURCE_GROUP="<your-resource-group>"
ACR_NAME="<globally-unique-registry-name>"
LOCATION="eastus"   # Use the same region as your Discovery workspace
SKU="Standard"      # Basic | Standard | Premium
```

#### Create the registry

```azurecli
# Standard registry with public access enabled
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku $SKU \
  --location $LOCATION

# Premium registry with public access disabled (for private endpoint setup)
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Premium \
  --location $LOCATION \
  --public-network-enabled false
```

#### Add virtual network rules (optional)

Use this option to allow access from specific Discovery subnets without a private endpoint. Requires Standard or Premium SKU.

```azurecli
VNET_NAME="<your-vnet-name>"
VNET_RESOURCE_GROUP="<vnet-resource-group>"

# Allow access from the supercomputer subnet
az acr network-rule add \
  --name $ACR_NAME \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --subnet "<supercomputer-subnet-name>" \
  --resource-group $VNET_RESOURCE_GROUP

# Allow access from the AKS subnet
az acr network-rule add \
  --name $ACR_NAME \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --subnet "<aks-subnet-name>" \
  --resource-group $VNET_RESOURCE_GROUP
```

#### Create a private endpoint (Premium SKU only)

```azurecli
SUBNET_NAME="<private-endpoint-subnet-name>"

# Create the private endpoint
az network private-endpoint create \
  --name "pe-acr-$ACR_NAME" \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --subnet $SUBNET_NAME \
  --private-connection-resource-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerRegistry/registries/$ACR_NAME" \
  --group-id registry \
  --connection-name "conn-acr-$ACR_NAME" \
  --location $LOCATION

# Create the private DNS zone
az network private-dns zone create \
  --resource-group $RESOURCE_GROUP \
  --name "privatelink.azurecr.io"

# Link the DNS zone to the virtual network
az network private-dns link vnet create \
  --resource-group $RESOURCE_GROUP \
  --zone-name "privatelink.azurecr.io" \
  --name "link-acr-$ACR_NAME" \
  --virtual-network $VNET_NAME \
  --registration-enabled false
```

#### Verify creation

```azurecli
# Show registry details
az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP

# Get the login server URL
az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP \
  --query loginServer --output tsv
```

## Integration with Microsoft Discovery

### Supercomputer access

The Discovery supercomputer uses a "Kubelet User Assigned Managed Identity (UAMI)" to pull images from ACR autonomously on your behalf. Assign the **AcrPull** role on the registry to the supercomputer's UAMI:

```azurecli
UAMI_PRINCIPAL_ID="<supercomputer-kubelet-uami-principal-id>"
ACR_RESOURCE_ID=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)

az role assignment create \
  --assignee $UAMI_PRINCIPAL_ID \
  --role AcrPull \
  --scope $ACR_RESOURCE_ID
```

### Tool publishing

When you develop and publish tools for Microsoft Discovery, the containerized tool images are pushed to this registry. The registry login server URL is referenced when registering a tool, specified as part of tool definition.

## Related content

- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Virtual networks and subnets in Microsoft Discovery](concept-virtual-networks.md)
- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Azure Container Registry documentation](/azure/container-registry/)
- [Azure Private Endpoint overview](../private-link/private-endpoint-overview.md)
