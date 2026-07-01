---
title: Create Azure Enclave environment for workloads
description: Set up the Azure Enclave environment for complex workloads.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 06/30/2026
---

# Tutorial 2-2: Create Azure Enclave environment for workloads

This tutorial guides you through creating the Azure Enclave environment for Azure Virtual Desktop and Azure Kubernetes Service (AKS) workloads. You set up common dependencies, create separate enclaves with properly sized subnets, deploy private DNS zones, and configure community and enclave endpoints for network connectivity.

In this tutorial, you learn how to:
  - Set up common dependencies (managed identity, Key Vault, encryption)
  - Create Azure Virtual Desktop enclave with management and session host subnets
  - Create AKS enclave with node, API server, and private endpoint subnets
  - Deploy and link private DNS zones
  - Create community endpoints for external connectivity
  - Create enclave endpoints and connections for inter-enclave communication

## Prerequisites

- Understanding of [Tutorial 2-1: Plan your architecture](./2-1-plan-architecture-workloads.md)
- **Contributor** access to the resource group containing the community
- **Contributor** access to the subscription for creating resources

## Before you begin

This tutorial assumes you have:
- An existing community deployed from Tutorial 1
- Planned your architecture including subnet sizes (see Tutorial 2-1)
- Identified the Azure region for your enclaves

> [!IMPORTANT]
> This tutorial uses placeholder names. Replace `myResourceGroup`, `fabrikam`, `avd-enclave`, `aks-enclave`, etc. with your own naming convention.

## Set up common dependencies

Both Azure Virtual Desktop and AKS workloads require common dependencies for encryption and security. This section provides detailed steps to create these shared resources. These steps can be referenced from other tutorials when setting up encryption and security.

### Create a shared services workload

First, create a workload in your existing enclave (or create a new enclave) to host shared services.

1. In the Azure portal, navigate to your **Azure Enclave** service.
1. Select **Communities** and open your community (for example, `fabrikam`).
1. Select an existing enclave or create a new shared services enclave:
   - **Enclave name**: `shared-services`
   - **Address space**: `10.1.0.0/16` (adjust based on your community IP address range)
   - Configure a subnet for shared resources: `SharedServicesSubnet` with `/24` IP address range
1. In the enclave, select `Workloads` > `+ Create`.
1. Configure the workload:
   - **Workload name**: `shared-workload`
   - **Create resource group**: Select `Create new`
   - **Resource group name**: `rg-shared-services`
1. Select `Review + create` and then `Create`.

### Create common dependency resources

Add required dependency resources to your workload:
- A managed identity provides an identity for Azure resources to authenticate without storing credentials.
- Azure Key Vault stores encryption keys, secrets, and certificates securely.
- The customer-managed key encrypts data at rest in your workloads.
- The disk encryption set applies the customer-managed key (CMK) based encryption to Virtual Machine (VM) disks.

1. In the Azure portal, search for your shared services workload name
1. Select `+Add An Azure Service`.
1. Select `Common Dependency` from the dropdown list, verify the selected resource group, and select `Next`.
1. Configure the resources:
   - **Key Vault Name**: Provide a unique Key Vault name `kv-ave-shared-<uniqueid>`
   - **CMK Key Name**: Provide a CMK name like `cmk-ave-encryption`
   - **User Assigned Managed Identity Name**: Provide a managed identity resource name like `id-ave-encryption`
   - **Identity Type**: Select `UserAssigned` in the drop-down.
   - **Disk Encryption Set Name**: `des-ave-encryption`
1. Select `Review + create` and then `Create`.
1. After deployment completes, navigate to the managed identity.

### Grant managed identity access to Key Vault key

The managed identity needs permission to use the encryption key.

1. In your Key Vault, select `Access control (IAM)`.
1. Select `+ Add` then select `Add role assignment`.
1. On the `Role` tab:
   - Search for and select `Key Vault Crypto Service Encryption User`
   - Select `Next`
1. On the `Members` tab:
   - Select `Managed identity`
   - Select `+ Select members`
   - Select `User-assigned managed identity` for the Managed identity
   - Select your managed identity: `id-ave-encryption`
   - Select `Select`
   - Select `Next`
1. On the `Review + assign` tab, select `Review + assign`.

### Grant managed identity access to enclave resources

For Azure Enclave-managed resources, the identity needs contributor access.

1. Navigate to your shared services enclave managed resource group (for example, `shared-services-HostedResources-<guid>`).
1. Select `Access control (IAM)`.
1. Select `+ Add` then select `Add role assignment`.
1. Assign the `Contributor` role:
   - **Role**: `Contributor`
   - **Assign access to**: `Managed identity`
   - **Members**: Select your managed identity `id-ave-encryption`
1. Select `Review + assign`.

### Validate common dependencies

Verify all resources are created and configured correctly:

  - User Assigned Managed Identity `id-ave-encryption` created
  - Key Vault `kv-ave-shared-<uniqueid>` created
  - Customer Managed Key `cmk-ave-encryption` created in Key Vault
  - Managed identity has `Key Vault Crypto Service Encryption User` role on the key
  - Disk Encryption Set `des-ave-encryption` created and linked to key and identity
  - Managed identity has `Contributor` role on enclave managed resource group

## Create Azure Virtual Desktop enclave

Now create a dedicated enclave for Azure Virtual Desktop workloads.

1. In your community (for example, `fabrikam`), select `Enclaves` > `+ Create`.
1. Configure the Azure Virtual Desktop enclave:
   - **Enclave name**: `avd-enclave`
   - **Region**: Same region as your community
   - **Address space**: `10.2.0.0/16`
1. Select `Next: Subnets`.
1. Add the management subnet:
   - Select `+ Add subnet`
   - **Subnet name**: `AzureVirtualDesktopManagementSubnet`
   - **Subnet address range**: `10.2.1.0/24`
   - **Add Network Security Group**: Select `Add new`
   - **Network Security Group name**: `nsg-avd-management`
   - Select `OK`
1. Add the session hosts subnet:
   - Select `+ Add subnet`
   - **Subnet name**: `AzureVirtualDesktopSessionHostsSubnet`
   - **Subnet address range**: `10.2.2.0/24`
   - **Add Network Security Group**: Select `Add new`
   - **Network Security Group name**: `nsg-avd-sessionhosts`
   - Select `OK`
1. Select `Review + create` and then `Create`.

> [!NOTE]
> Enclave deployment takes 30-45 minutes. You can continue to plan the AKS enclave during deployment.

## Create AKS enclave

Create a dedicated enclave for Azure Kubernetes Service workloads.

1. In your community, select `Enclaves` > `+ Create`.
1. Configure the AKS enclave:
   - **Enclave name**: `aks-enclave`
   - **Region**: Same region as your community
   - **Address space**: `10.3.0.0/16`
1. Select `Next: Subnets`.
1. Add the node subnet:
   - Select `+ Add subnet`
   - **Subnet name**: `aksSubnet`
   - **Subnet address range**: `10.3.1.0/25` (128 IPs)
   - **Add Network Security Group**: Select `Add new`
   - **Network Security Group name**: `nsg-aks-nodes`
   - **Subnet delegation**: `None` (no delegation for AKS node subnet)
   - Select `OK`
1. Add the API server subnet:
   - Select `+ Add subnet`
   - **Subnet name**: `agentSubnet`
   - **Subnet address range**: `10.3.1.128/28` (16 IPs)
   - **Add Network Security Group**: Use existing `nsg-aks-nodes`
   - **Subnet delegation**: `None`
   - Select `OK`
1. Add the private endpoint subnet:
   - Select `+ Add subnet`
   - **Subnet name**: `AzureVirtualEnclaveSubnet`
   - **Subnet address range**: `10.3.2.0/26` (64 IPs)
   - **Add Network Security Group**: Use existing `nsg-aks-nodes`
   - **Subnet delegation**: `None` (important: no delegation for private endpoints)
   - Select `OK`
1. Select `Review + create` and then `Create`.

> [!IMPORTANT]
> Wait for both enclave deployments to complete before proceeding to the next steps.

## Deploy private DNS zones

Private DNS zones enable private endpoint DNS resolution for Azure services.

### Create private DNS zones for Azure Virtual Desktop

1. Navigate to your **Azure Virtual Desktop enclave** (`avd-enclave`).
1. Select `Workloads` then select `+ Create`.
1. Create a workload:
   - **Workload name**: `avd-workload`
   - **Create resource group**: `Create new`
   - **Resource group name**: `rg-avd-workload`
1. In the workload, select `+ Add an Azure Service`.
1. Select `Private DNS Zones` from the dropdown list, verify the selected resource group, and select `Next`.
1. Configure the Private DNS Zones deployment:
   - **Create storage file Private DNS Zone**: `true`
   - **Create storage queue Private DNS Zone**: `true`
   - **Create storage table Private DNS Zone**: `true`
   - **Create storage blob Private DNS Zone**: `true`
   - **Create Key Vault Private DNS Zone**: `true`
   - **Additional Private DNS Zone Names**: `["privatelink.wvd.microsoft.com","privatelink-global.wvd.microsoft.com"]`
1. Select `Review + Create` and then `Create`.
1. Wait for the deployment to complete.

### Create private DNS zones for AKS

1. Navigate to your **AKS enclave** (`aks-enclave`).
1. Select `Workloads` then select `+ Create`.
1. Create a workload:
   - **Workload name**: `aks-workload`
   - **Create resource group**: `Create new`
   - **Resource group name**: `rg-aks-workload`
1. In the workload, select `+ Add an Azure Service`.
1. Select `Private DNS Zones` from the dropdown list, verify the selected resource group, and select `Next`.
1. Configure the Private DNS Zones deployment:
   - **Create storage file Private DNS Zone**: `true`
   - **Create storage queue Private DNS Zone**: `true`
   - **Create storage table Private DNS Zone**: `true`
   - **Create storage blob Private DNS Zone**: `true`
   - **Create Key Vault Private DNS Zone**: `true`
   - **Additional Private DNS Zone Names**: `["privatelink.<region>.azmk8s.io"]` and replace `<region>` with your region, for example, `eastus`
1. Select `Review + Create` and then `Create`.
1. Wait for the deployment to complete.

## Create community endpoints for external connectivity

Community endpoints allow traffic from your enclaves to external Azure services and the internet.

### Create Azure Virtual Desktop community endpoint

1. Navigate to your community (for example, `fabrikam`).
1. Select `Community endpoints` then select `+ Create`.
1. Configure the endpoint:
   - **Name**: `ce-avd-services`
   - **Description**: `Azure Virtual Desktop required service endpoints`
1. Select `Add rule` and configure each required endpoint:

   **Rule 1: AVD Control Plane**
   - **Name**: `avd-control-plane`
   - **Destination**: `*.wvd.microsoft.com,*.prod.warm.ingest.monitor.core.windows.net`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

   **Rule 2: Authentication**
   - **Name**: `authentication`
   - **Destination**: `login.microsoftonline.com,login.windows.net`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

   **Rule 3: Azure Resource Manager**
   - **Name**: `arm`
   - **Destination**: `management.azure.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

   **Rule 4: Agent Updates**
   - **Name**: `agent-updates`
   - **Destination**: `mrsglobalstb2prod.blob.core.windows.net,gcs.prod.monitoring.core.windows.net`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

   **Rule 5: Guest Configuration**
   - **Name**: `guest-config`
   - **Destination**: `*.guestconfiguration.azure.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

1. Select `Review + create` and then `Create`.

### Create AKS community endpoint

1. In your community, select `Community endpoints` then select `+ Create`.
1. Configure the endpoint:
   - **Name**: `ce-aks-services`
   - **Description**: `AKS required service endpoints`
1. Select **Add rule** and configure each required endpoint:

   **Rule 1: Container Registry**
   - **Name**: `mcr`
   - **Destination**: `mcr.microsoft.com,*.data.mcr.microsoft.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

   **Rule 2: Cluster Management**
   - **Name**: `aks-management`
   - **Destination**: `*.hcp.<region>.azmk8s.io` (replace `<region>` with your region, for example, `eastus`)
   - **Protocol**: `HTTPS`
   - **Port**: `443`

   **Rule 3: Azure Resource Manager**
   - **Name**: `arm`
   - **Destination**: `management.azure.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

   **Rule 4: Authentication**
   - **Name**: `authentication`
   - **Destination**: `login.microsoftonline.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

   **Rule 5: Package Repository**
   - **Name**: `packages`
   - **Destination**: `packages.microsoft.com,acs-mirror.azureedge.net`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

1. Select `Review + create` and then `Create`.

## Create enclave endpoints and connections

Enclave endpoints and connections enable communication between enclaves for accessing shared services.

### Create enclave endpoint for shared services

1. Navigate to your **Shared Services Enclave** (`shared-services`).
1. Select `Enclave endpoints` then select `+ Create`.
1. Configure the endpoint:
   - **Name**: `ee-shared-services`
   - **Description**: `Allow access to shared Key Vault and monitoring`
1. Add rules for shared services:

   **Rule 1: Key Vault**
   - **Name**: `key-vault`
   - **Protocol**: `HTTPS`
   - **Port**: `443`
   - **Source IP/CIDR**: `10.2.0.0/16,10.3.0.0/16` (Azure Virtual Desktop and AKS enclave IP address ranges)

   **Rule 2: DNS**
   - **Name**: `dns`
   - **Protocol**: `TCP`
   - **Port**: `53`
   - **Source IP/CIDR**: `10.2.0.0/16,10.3.0.0/16`

1. Select `Review + create` and then `Create`.

### Create enclave connections

Create enclave connections to link the enclaves together.

1. Navigate to your **Azure Virtual Desktop enclave** (`avd-enclave`).
1. Select `Enclave connections` then select `+ Create`.
1. Configure the connection:
   - **Name**: `conn-avd-to-shared`
   - **Source enclave**: `avd-enclave` (current)
   - **Destination enclave endpoint**: Select `ee-shared-services` from shared services enclave
1. Select `Review + create` and then `Create`.

1. Repeat for AKS enclave:
   - Navigate to the **AKS enclave** (`aks-enclave`)
   - Create connection `conn-aks-to-shared` to `ee-shared-services`

## Validate the environment

Verify that your environment configuration:

  - Common dependencies deployed in shared services workload
  - Azure Virtual Desktop enclave created with management and session hosts subnets
  - AKS enclave created with node, API server, and private endpoint subnets
  - Private DNS zones deployed and linked to enclaves
  - Community endpoints created for Azure Virtual Desktop and AKS external connectivity
  - Enclave endpoints created for shared services
  - Enclave connections created from Azure Virtual Desktop and AKS to shared services

## Next steps

With your Azure Enclave environment configured correctly, you're ready to deploy workloads. The next tutorial guides you through deploying Azure Virtual Desktop.

> [Tutorial 2-3: Deploy Azure Virtual Desktop workload](./2-3-deploy-virtual-desktop-workload.md)

## Related content

- [Create a user-assigned managed identity](./create-user-managed-identity.md)
- [Configure customer-managed key encryption](./configure-customer-managed-key-encryption-within-enclave.md)
- [Deploy private DNS zones from service catalog](./deploy-private-dns-zones-service-catalog.md)
- [Create enclave endpoints](./create-enclave-endpoint-portal.md)
- [Create enclave connections](./create-enclave-connection-portal.md)
