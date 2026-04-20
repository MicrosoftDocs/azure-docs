---
title: Configure network security for Microsoft Discovery workspaces
description: Learn how to assign NSP roles, configure subnets, create private endpoints, and configure DNS for Microsoft Discovery workspaces.
ms.service: azure
ms.topic: how-to
ms.date: 03/30/2026
ms.author: umamm
author: umamm
ms.custom: networking, private-link, nsp
---

# Configure network security for Microsoft Discovery workspaces

This article walks you through the prerequisites for network hardening and how to create private endpoints for Microsoft Discovery workspaces and bookshelves. Network hardening is enabled by default — the Discovery control plane automatically deploys Network Security Perimeters, private endpoints, and virtual network injection for managed resources. For an overview of what these features are and why they matter, see [Network security for Microsoft Discovery](concept-network-security.md).

## Prerequisites

- An Azure subscription with the **Microsoft.Discovery** resource provider registered.
- Azure CLI 2.50+ or Azure PowerShell 10.0+.
- **Owner** or **Contributor** role on the subscription (required for custom role and role assignment creation).
- A virtual network with dedicated subnets for:
  - Agent workloads
  - Private endpoints
  - Workspace services

> [!IMPORTANT]
> Each Discovery resource (workspace, bookshelf, supercomputer) requires its own unique, non-overlapping subnets. Subnets can't be shared across different Discovery resource instances. Plan your virtual network address space accordingly when deploying multiple resources.

## Assign the NSP Perimeter Joiner role

The Discovery control plane needs permission on your subscription to create NSP inbound access rules. Create a custom role and assign it to the **AIFSPInfrastructure** service principal.

### Verify the service principal

The Discovery first-party app (**AIFSPInfrastructure**) has the following identity:

| Property | Value |
|----------|-------|
| **Application (client) ID** | `92c174ac-8e41-4815-a1b7-d81b19ab03ce` |
| **Display name** | AIFSPInfrastructure |

Verify the service principal exists in your tenant:

```azurecli
az ad sp show --id 92c174ac-8e41-4815-a1b7-d81b19ab03ce \
  --query "{displayName:displayName, objectId:id, appId:appId}"
```

> [!TIP]
> If the service principal doesn't exist in your tenant, create it:
> ```azurecli
> az ad sp create --id 92c174ac-8e41-4815-a1b7-d81b19ab03ce
> ```

### Create the custom role definition

Create a file named `nsp-perimeter-joiner-role.json`:

```json
{
  "Name": "Discovery NSP Perimeter Joiner",
  "Description": "Allows the Microsoft Discovery control plane to create NSP inbound access rules for network-hardened workspaces.",
  "Actions": [
    "Microsoft.Network/networkSecurityPerimeters/joinPerimeterRule/action",
    "Microsoft.Network/locations/networkSecurityPerimeterOperationStatuses/read"
  ],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/<your-subscription-id>"
  ]
}
```

Replace `<your-subscription-id>` with your Azure subscription ID.

> [!TIP]
> Azure subscriptions have a limit on the number of custom roles. If you've reached the limit, delete any unused custom roles before creating the Discovery NSP Perimeter Joiner role. Check existing custom roles with `az role definition list --custom-role-only`.

# [Azure CLI](#tab/azure-cli)

```azurecli
az role definition create --role-definition nsp-perimeter-joiner-role.json
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzRoleDefinition -InputFile "nsp-perimeter-joiner-role.json"
```

# [Azure portal](#tab/portal)

1. Navigate to **Subscriptions** > select your subscription.
2. Select **Access control (IAM)** > **Roles** > **+ Add** > **Add custom role**.
3. Set the role name: `Discovery NSP Perimeter Joiner`.
4. Under **Permissions**, select **Add permissions**.
5. Search for `Microsoft.Network` > expand **networkSecurityPerimeters**.
6. Select **joinPerimeterRule** under **Other**.
7. Set **Assignable scopes** to your subscription.
8. Select **Review + create** > **Create**.

---

### Assign the role to the Discovery Control Plane

# [Azure CLI](#tab/azure-cli)

```azurecli
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

az role assignment create \
  --assignee "92c174ac-8e41-4815-a1b7-d81b19ab03ce" \
  --role "Discovery NSP Perimeter Joiner" \
  --scope "/subscriptions/$SUBSCRIPTION_ID"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$subscriptionId = (Get-AzContext).Subscription.Id

New-AzRoleAssignment `
  -ApplicationId "92c174ac-8e41-4815-a1b7-d81b19ab03ce" `
  -RoleDefinitionName "Discovery NSP Perimeter Joiner" `
  -Scope "/subscriptions/$subscriptionId"
```

# [Azure portal](#tab/portal)

1. Navigate to **Subscriptions** > select your subscription.
2. Select **Access control (IAM)** > **+ Add** > **Add role assignment**.
3. Search for **Discovery NSP Perimeter Joiner** and select it > **Next**.
4. Select **User, group, or service principal** > **+ Select members**.
5. Search for `AIFSPInfrastructure` or `92c174ac-8e41-4815-a1b7-d81b19ab03ce`.
6. Select the service principal > **Select** > **Review + assign**.

---

### Verify the role assignment

```azurecli
az role assignment list \
  --assignee "92c174ac-8e41-4815-a1b7-d81b19ab03ce" \
  --scope "/subscriptions/$SUBSCRIPTION_ID" \
  --query "[].{role:roleDefinitionName, scope:scope}" \
  -o table
```

Expected output:

```
Role                               Scope
---------------------------------  ------------------------------------------
Discovery NSP Perimeter Joiner     /subscriptions/<your-subscription-id>
```

### Assign Reader to the Discovery service principal

The Discovery data-plane service app also requires **Reader** access at subscription level to enumerate resources and validate network configurations:

# [Azure CLI](#tab/azure-cli)

```azurecli
az role assignment create \
  --assignee "92c174ac-8e41-4815-a1b7-d81b19ab03ce" \
  --role "Reader" \
  --scope "/subscriptions/$SUBSCRIPTION_ID"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$subscriptionId = (Get-AzContext).Subscription.Id

New-AzRoleAssignment `
  -ApplicationId "92c174ac-8e41-4815-a1b7-d81b19ab03ce" `
  -RoleDefinitionName "Reader" `
  -Scope "/subscriptions/$subscriptionId"
```

# [Azure portal](#tab/portal)

1. Navigate to your **Subscription** > **Access control (IAM)**.
2. Select **+ Add** > **Add role assignment**.
3. Search for **Reader** and select it > **Next**.
4. Select **User, group, or service principal** > **+ Select members**.
5. Search for `AIFSPInfrastructure` or `92c174ac-8e41-4815-a1b7-d81b19ab03ce`.
6. Select the service principal > **Select** > **Review + assign**.

---

## Subnet requirements for workspaces and bookshelves

Workspaces and bookshelves require dedicated subnets for their managed resources. For a complete end-to-end deployment including all resources, see [End-to-end network-hardened deployment](how-to-deploy-network-hardened-stack.md).

| Resource | Required subnets | Subnet delegation |
|----------|-----------------|-------------------|
| **Workspace** | `workspaceSubnet`, `agentSubnet`, `privateEndpointSubnet` | `Microsoft.App/environments` on workspace and agent subnets |
| **Bookshelf** | `searchSubnet`, `privateEndpointSubnet` | `Microsoft.App/environments` on search subnet |

> [!IMPORTANT]
> **Subnets can't be reused across workspaces or bookshelves.** Each workspace and each bookshelf requires its own unique, non-overlapping subnets. This is an Azure Container Apps (ACA) restriction — each delegated subnet can only be associated with a single Container Apps Environment. Plan your virtual network address space accordingly when deploying multiple resources.

## Create private endpoints for data-plane access

Private endpoints route data-plane API traffic through the Azure backbone instead of the public internet. For supported resource types and how private endpoints work, see [Network security for Microsoft Discovery](concept-network-security.md#how-private-endpoints-route-data-plane-traffic).

### Prerequisites

- A provisioned Microsoft Discovery workspace or bookshelf resource.
- A virtual network with a dedicated subnet for private endpoints.
- The **Contributor** or **Microsoft Discovery Platform Administrator (Preview)** role on the resource.

### Create the private endpoint

#### Workspace private endpoint

# [Azure CLI](#tab/azure-cli)

```azurecli
az network private-endpoint create \
  --name pe-my-workspace \
  --resource-group myResourceGroup \
  --vnet-name myVNet \
  --subnet pe-subnet \
  --private-connection-resource-id "/subscriptions/{subId}/resourceGroups/{rg}/providers/Microsoft.Discovery/workspaces/{workspaceName}" \
  --group-id workspace \
  --connection-name my-workspace-connection
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `--name` | Yes | Name of the private endpoint resource. |
| `--resource-group` | Yes | Name of the resource group where the private endpoint is created. |
| `--vnet-name` | Yes | The virtual network associated with the subnet. Omit if supplying a subnet ID. |
| `--subnet` | Yes | Name or ID of the subnet. If the subnet is in a different resource group or subscription, provide the full subnet resource ID instead of the name. |
| `--private-connection-resource-id` | Yes | The full Azure Resource Manager resource ID of the Discovery resource to connect to (workspace or bookshelf). |
| `--group-id` | Yes | The sub-resource group ID. Use `workspace` for workspaces or `bookshelf` for bookshelves. You can use `az network private-link-resource list` to get supported group IDs. |
| `--connection-name` | Yes | A descriptive name for the private link service connection. |
| `--location` | No | Azure region. Defaults to the resource group location. |

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$workspace = Get-AzResource `
  -ResourceGroupName myResourceGroup `
  -ResourceName myWorkspace `
  -ResourceType "Microsoft.Discovery/workspaces"

$pec = New-AzPrivateLinkServiceConnection `
  -Name "my-workspace-connection" `
  -PrivateLinkServiceId $workspace.ResourceId `
  -GroupId "workspace"

New-AzPrivateEndpoint `
  -Name "pe-my-workspace" `
  -ResourceGroupName "myResourceGroup" `
  -Location "uksouth" `
  -Subnet (Get-AzVirtualNetworkSubnetConfig -Name "pe-subnet" -VirtualNetwork (Get-AzVirtualNetwork -Name "myVNet" -ResourceGroupName "myResourceGroup")) `
  -PrivateLinkServiceConnection $pec
```

# [Azure portal](#tab/portal)

1. In the Azure portal, search for **Private Link** and select **Private Link Center**.
2. Select **Private endpoints** > **+ Create**.
3. On the **Basics** tab, select your subscription and resource group.
4. Enter a name (for example, `pe-my-workspace`) and select the region.
5. On the **Resource** tab:
   - **Resource type**: `Microsoft.Discovery/workspaces`
   - **Resource**: Select your workspace
   - **Target sub-resource**: `workspace`
6. On the **Virtual Network** tab, select your virtual network and subnet.
7. On the **DNS** tab, select **Yes** for **Integrate with private DNS zone**.
8. Select **Review + create** > **Create**.

---

### Configure private DNS

Create a private DNS zone and link it to your virtual network so that DNS queries resolve to the private endpoint IP address:

```azurecli
# Create the private DNS zone
az network private-dns zone create \
  --resource-group myResourceGroup \
  --name "privatelink.workspace.discovery.azure.com"

# Link the DNS zone to your virtual network
az network private-dns link vnet create \
  --resource-group myResourceGroup \
  --zone-name "privatelink.workspace.discovery.azure.com" \
  --name link-my-vnet \
  --virtual-network myVNet \
  --registration-enabled false

# Create DNS zone group on the private endpoint (auto-creates A records)
az network private-endpoint dns-zone-group create \
  --resource-group myResourceGroup \
  --endpoint-name pe-my-workspace \
  --name default \
  --private-dns-zone "privatelink.workspace.discovery.azure.com" \
  --zone-name workspace
```

> [!IMPORTANT]
> If you don't create the private DNS zone and link it to your virtual network, clients continue to use the public path even when a private endpoint exists. DNS resolution determines the traffic path.

#### Bookshelf private endpoint

To create a private endpoint for a bookshelf, use the same steps with the bookshelf resource ID, group ID `bookshelf`, and DNS zone `privatelink.bookshelf.discovery.azure.com`:

```azurecli
# Create the private endpoint
az network private-endpoint create \
  --name pe-my-bookshelf \
  --resource-group myResourceGroup \
  --vnet-name myVNet \
  --subnet pe-subnet \
  --private-connection-resource-id "/subscriptions/{subId}/resourceGroups/{rg}/providers/Microsoft.Discovery/bookshelves/{bookshelfName}" \
  --group-id bookshelf \
  --connection-name my-bookshelf-connection

# Create private DNS zone
az network private-dns zone create \
  --resource-group myResourceGroup \
  --name "privatelink.bookshelf.discovery.azure.com"

# Link DNS zone to virtual network
az network private-dns link vnet create \
  --resource-group myResourceGroup \
  --zone-name "privatelink.bookshelf.discovery.azure.com" \
  --name link-my-vnet \
  --virtual-network myVNet \
  --registration-enabled false

# Create DNS zone group on the private endpoint
az network private-endpoint dns-zone-group create \
  --resource-group myResourceGroup \
  --endpoint-name pe-my-bookshelf \
  --name default \
  --private-dns-zone "privatelink.bookshelf.discovery.azure.com" \
  --zone-name bookshelf
```

#### Supported resource types summary

| Resource type | Group ID | Private DNS zone |
|---------------|----------|-----------------|
| `Microsoft.Discovery/workspaces` | `workspace` | `privatelink.workspace.discovery.azure.com` |
| `Microsoft.Discovery/bookshelves` | `bookshelf` | `privatelink.bookshelf.discovery.azure.com` |

### Verify connectivity

Check the private endpoint connection status:

```azurecli
az rest --method GET \
  --url "https://management.azure.com/subscriptions/{subId}/resourceGroups/{rg}/providers/Microsoft.Discovery/workspaces/{workspaceName}/privateEndpointConnections?api-version=2026-02-01-preview"
```

The connection should show `status: Approved`.

From a VM or compute resource within the same virtual network, verify DNS resolution and API connectivity:

```bash
# Verify DNS resolves to a private IP (10.x.x.x)
nslookup {workspaceName}.workspace.discovery.azure.com

# Test API connectivity
TOKEN=$(az account get-access-token --resource "https://discovery.azure.com/" --query accessToken -o tsv)

curl -sS -H "Authorization: Bearer $TOKEN" \
  "https://{workspaceName}.workspace.discovery.azure.com/projects/{projectName}/investigations?api-version=2026-02-01-preview"
```

## Disable public network access (optional)

To enforce private-endpoint-only access and block all public traffic to your workspace data-plane:

```azurecli
az rest --method PATCH \
  --url "https://management.azure.com/subscriptions/{subId}/resourceGroups/{rg}/providers/Microsoft.Discovery/workspaces/{workspaceName}?api-version=2026-02-01-preview" \
  --body '{"properties":{"publicNetworkAccess":"Disabled"}}'
```

> [!NOTE]
> When `publicNetworkAccess` is set to `Disabled`, only traffic through private endpoints is allowed. Public internet requests receive a 403 Forbidden response. See [Network security concepts](concept-network-security.md#how-private-endpoints-route-data-plane-traffic) for the full access matrix.

## Approve or reject private endpoint connections

Discovery resources support autoapproval for private endpoints created within the same tenant. For cross-tenant connections, resource owners must manually approve:

```azurecli
# Approve a connection
az rest --method PATCH \
  --url "https://management.azure.com/{privateEndpointConnectionId}?api-version=2026-02-01-preview" \
  --body '{"properties":{"privateLinkServiceConnectionState":{"status":"Approved","description":"Approved by admin"}}}'

# Reject a connection
az rest --method PATCH \
  --url "https://management.azure.com/{privateEndpointConnectionId}?api-version=2026-02-01-preview" \
  --body '{"properties":{"privateLinkServiceConnectionState":{"status":"Rejected","description":"Not authorized"}}}'
```

## Troubleshooting

### "doesn't have permission to perform action 'joinPerimeterRule/action'"

The custom role assignment is missing or hasn't propagated.

1. Verify the role assignment exists using the command in [Assign the NSP Perimeter Joiner role](#assign-the-nsp-perimeter-joiner-role).
2. Wait up to 5 minutes for Azure RBAC propagation.
3. Ensure the role is assigned at **subscription** scope, not resource group scope.
4. Retry workspace creation - the operation is idempotent and safe to retry.

### "Service principal not found"

The Discovery Control Plane service principal doesn't exist in your tenant yet:

```azurecli
az ad sp create --id 92c174ac-8e41-4815-a1b7-d81b19ab03ce
```

Then retry the role assignment.

### Private endpoint approved but API returns errors

| Error | Likely cause | Resolution |
|-------|-------------|-----------|
| 504 Gateway Timeout | Backend temporarily unavailable | Check if the public path also fails. If both fail, the service may be temporarily unavailable. |
| 401 Unauthorized | Token audience mismatch or missing RBAC | Verify the token is for `https://discovery.azure.com/` and you have the required role on the resource. |
| DNS resolves to public IP | Private DNS zone not linked to virtual network | Create the DNS zone and virtual network link as described in [Configure private DNS](#configure-private-dns). |

### Verify network hardening

After workspace provisioning completes, verify that network hardening is active:

```azurecli
# List NSP resources in the managed resource group
az rest --method GET \
  --url "https://management.azure.com/subscriptions/{subId}/resourceGroups/{mrg}/providers/Microsoft.Network/networkSecurityPerimeters?api-version=2023-08-01-preview" \
  | jq '.value[] | {name, location, properties}'

# List private endpoints in the managed resource group
az network private-endpoint list \
  --resource-group {mrg} \
  --query "[].{name:name, status:privateLinkServiceConnections[0].privateLinkServiceConnectionState.status}" \
  -o table
```

You should see NSP resources in **Enforced** mode and private endpoints with **Approved** status.

### DNS resolves to public IP despite private endpoint

If DNS queries return a public IP instead of your private endpoint IP:

1. Verify the private DNS zone exists: `privatelink.workspace.discovery.azure.com`
2. Verify the DNS zone is linked to your virtual network.
3. Verify the DNS zone group is configured on the private endpoint.
4. If using custom DNS servers, ensure they forward to Azure DNS (`168.63.129.16`).

## Next steps

- [Network security for Microsoft Discovery](concept-network-security.md) — Understand the architecture, supported resource types, and limitations.
- [End-to-end network-hardened deployment](how-to-deploy-network-hardened-stack.md)
- [What is Azure Private Link?](/azure/private-link/private-link-overview)

