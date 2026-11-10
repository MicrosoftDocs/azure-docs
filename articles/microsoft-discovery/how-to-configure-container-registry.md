---
title: Configure a container registry for Microsoft Discovery
description: Create a container registry for Discovery tools, select supported networking, and grant publishing and supercomputer image-pull access.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 10/24/2026
---

# Configure a container registry for Microsoft Discovery

<a id="azure-container-registry-in-microsoft-discovery"></a>

Create and configure Azure Container Registry (ACR) for customer-owned containerized tools used by Discovery. This task is optional and not a prerequisite for the onboarding tool's Q&A smoke test. The onboarding tool doesn't create a customer registry.

## Prerequisites

- An Azure subscription with `Microsoft.ContainerRegistry` registered and permission to create/configure a registry in the target resource group.
- Assignment authority when granting identity roles: Owner, User Access Administrator, or Role Based Access Control Administrator at the assignment scope.
- An approved network plan and existing virtual network and subnet for private access.
- The supercomputer kubelet UAMI and identities that publish images.

> [!NOTE]
> You'll require an ACR if you're planning to publish a tool for agentic workflow.

## Role of ACR in Microsoft Discovery

Microsoft Discovery uses ACR to:

- Store containerized scientific tools and computational packages
- Manage model containers for AI and machine learning workloads
- Provide versioning for containerized components across research workflows

Every tool that runs on a Discovery supercomputer is pulled from a container registry. ACR provides a private, governed, and regionally colocated image store that integrates naturally with the rest of the Discovery infrastructure on Azure.

## Plan registry access

Choose an approved registry location and network access path for publishers and supercomputer nodes. Keep the registry near its consumers where practical. Private access requires the virtual network and subnet plan from the prerequisites.

The following Azure built-in roles are needed at various points in the registry lifecycle:

| Role | Purpose |
|------|---------|
| Contributor | Create and configure the registry |
| AcrPush | Push images to the registry (tool publishers and CI pipelines) |
| AcrPull | Pull images from the registry (supercomputer managed identity) |

## Choosing an ACR SKU

ACR is available in three SKUs. Choose the one that fits your environment:

| SKU | Capabilities | Private endpoint support |
|-----|----------------|--------------------------|
| Basic | Baseline registry storage and throughput | No |
| Standard | Increased storage and throughput compared with Basic | No |
| Premium | Advanced networking and geo-replication | Yes |

Premium is required when the supercomputer or workspace must access ACR through a private endpoint or when public network access is disabled. Select the tier according to required capabilities and organizational policy.

## Networking considerations

How the registry is accessed from within your Discovery deployment depends on your network topology.

### Public network access

By default, ACR is publicly accessible with authentication. Select public access only when it fits the approved network policy. Public network access doesn't itself enable anonymous pulls.

<a id="virtual-network-rules-standard-and-premium"></a>

### Virtual network rules (Premium)

Registry service endpoints are a Premium-tier preview feature, not a Standard-tier feature. They have host and configuration limitations and can't be combined with Private Link on the same registry. Review the authoritative [service endpoint guidance](/azure/container-registry/container-registry-vnet) before selecting this path. Private Link is the alternative for a private IP endpoint.

### Private endpoints (Premium only)

Private endpoints assign a private IP address to the registry within your virtual network. Communication through the endpoint stays on the Azure backbone, and public access can be disabled entirely. Publishers and supercomputer nodes must have a working network and DNS path to the private endpoint.

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
   - **SKU**: select the approved tier; **Premium** is required for private endpoints.
1. On the **Networking** tab, configure public access:
   - Select **All networks** to keep public access enabled.
   - Select **Disabled** (Premium only) to set up private-only access after creation.
1. Select **Review + create**, then **Create**.

After the registry is created, you can configure advanced networking from the registry's **Networking** settings blade:

- **Firewall**: configure supported IP rules for the selected tier. Registry service endpoints aren't configured through the portal.
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
SKU="<approved-sku>" # Basic | Standard | Premium
```

#### Create the registry

Choose one creation command according to the approved access path. For public access with authentication:

```azurecli
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku $SKU \
  --location $LOCATION
```

For private-only access, create a Premium registry and then complete its private endpoint and DNS configuration:

```azurecli
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Premium \
  --location $LOCATION \
  --public-network-enabled false
```

#### Add virtual network rules (optional)

For the Premium service-endpoint path, follow [Restrict access using service endpoints](/azure/container-registry/container-registry-vnet). Enable the registry service endpoint on the actual subnets and use their full resource IDs, especially when the VNet is in a different resource group. Don't combine these rules with the private-endpoint path below.

#### Create a private endpoint (Premium SKU only)

```azurecli
SUBNET_NAME="<private-endpoint-subnet-name>"
VNET_ID="<full-resource-id-of-your-vnet>"
SUBNET_ID="$VNET_ID/subnets/$SUBNET_NAME"

# Create the private endpoint
az network private-endpoint create \
  --name "pe-acr-$ACR_NAME" \
  --resource-group $RESOURCE_GROUP \
  --subnet $SUBNET_ID \
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
  --virtual-network $VNET_ID \
  --registration-enabled false

# Associate endpoint records with the zone
ZONE_ID=$(az network private-dns zone show \
  --resource-group $RESOURCE_GROUP \
  --name "privatelink.azurecr.io" --query id --output tsv)

az network private-endpoint dns-zone-group create \
  --resource-group $RESOURCE_GROUP \
  --endpoint-name "pe-acr-$ACR_NAME" \
  --name "acr-zone-group" \
  --private-dns-zone $ZONE_ID \
  --zone-name "registry"
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

These examples assume **RBAC Registry Permissions** mode. For an ABAC-enabled registry, use supported repository roles instead; **AcrPull** and **AcrPush** aren't substitutes for repository-scoped permissions. See [ACR role assignment modes](/azure/container-registry/container-registry-rbac-built-in-roles-overview).

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

Before registering a tool, verify name resolution and an authenticated pull from the supercomputer's actual network path. From the publishing identity's approved runner, verify push access separately. Successful registry creation doesn't prove either path. Continue with [Publish a tool to ACR](how-to-publish-tool-to-acr.md).

## Related content

- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Virtual networks and subnets in Microsoft Discovery](concept-virtual-networks.md)
- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Azure Container Registry documentation](/azure/container-registry/)
- [Azure Private Endpoint overview](/azure/private-link/private-endpoint-overview)
