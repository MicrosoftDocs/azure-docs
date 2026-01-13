---
title: Create Azure Virtual Enclave environment for AVD and AKS workloads
description: Set up the Azure Virtual Enclaves environment with enclaves, subnets, DNS zones, and endpoints for AVD and AKS workloads.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 12/18/2024
ms.custom: references_region
---

# Tutorial 2-2: Create Azure Virtual Enclave environment for workloads

This tutorial guides you through creating the Azure Virtual Enclaves environment for AVD and AKS workloads. You set up common dependencies, create separate enclaves with properly sized subnets, deploy private DNS zones, and configure community and enclave endpoints for network connectivity.

In this tutorial, you learn how to:
- ✅ Set up common dependencies (managed identity, Key Vault, encryption)
- ✅ Create AVD enclave with management and session host subnets
- ✅ Create AKS enclave with node, API server, and private endpoint subnets
- ✅ Deploy and link private DNS zones
- ✅ Create community endpoints for external connectivity
- ✅ Create enclave endpoints and connections for inter-enclave communication

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

Both AVD and AKS workloads require common dependencies for encryption and security. This section provides detailed steps to create these shared resources. These steps can be referenced from other tutorials when setting up encryption and security.

### Create a shared services workload

First, create a workload in your existing enclave (or create a new enclave) to host shared services.

1. In the Azure portal, navigate to your **Azure Virtual Enclaves** service.
2. Select **Communities** and open your community (for example, `fabrikam`).
3. Select an existing enclave or create a new **Shared Services Enclave**:
   - **Enclave name**: `shared-services`
   - **Address space**: `10.1.0.0/16` (adjust based on your community CIDR)
   - Configure a subnet for shared resources: `SharedServicesSubnet` with `/24` CIDR
4. In the enclave, select **Workloads** > **+ Create**.
5. Configure the workload:
   - **Workload name**: `shared-workload`
   - **Create resource group**: Select **Create new**
   - **Resource group name**: `rg-shared-services`
6. Select **Review + create** and then **Create**.

### Create User Assigned Managed Identity

A managed identity provides an identity for Azure resources to authenticate without storing credentials.

1. In the Azure portal, search for **Managed Identities** and select **+ Create**.
2. Configure the identity:
   - **Subscription**: Your subscription
   - **Resource group**: `rg-shared-services`
   - **Region**: Same region as your enclave
   - **Name**: `id-ave-encryption`
3. Select **Review + create** and then **Create**.
4. After deployment completes, navigate to the managed identity.
5. Note the **Object (principal) ID** - you need this for role assignments.

### Create Key Vault

Azure Key Vault stores encryption keys, secrets, and certificates securely.

1. In the Azure portal, search for **Key Vaults** and select **+ Create**.
2. Configure the Key Vault:
   - **Subscription**: Your subscription
   - **Resource group**: `rg-shared-services`
   - **Key vault name**: `kv-ave-shared-<uniqueid>` (must be globally unique)
   - **Region**: Same region as your enclave
   - **Pricing tier**: **Standard** or **Premium** (Premium required for HSM-backed keys)
3. Select the **Access configuration** tab:
   - **Permission model**: Select **Azure role-based access control**
4. Select **Review + create** and then **Create**.

### Create Customer Managed Key (CMK)

The customer-managed key encrypts data at rest in your workloads.

1. Navigate to your Key Vault (for example, `kv-ave-shared-<uniqueid>`).
2. Select **Keys** > **+ Generate/Import**.
3. Configure the key:
   - **Options**: **Generate**
   - **Name**: `cmk-ave-encryption`
   - **Key type**: **RSA** or **RSA-HSM** (if using Premium tier)
   - **RSA key size**: **4096**
   - **Enabled**: **Yes**
   - Leave other settings as default
4. Select **Create**.
5. Select the created key, then select the current version.
6. Copy the **Key Identifier** URL - you need this later.

### Grant managed identity access to Key Vault key

The managed identity needs permission to use the encryption key.

1. In your Key Vault, select **Access control (IAM)**.
2. Select **+ Add** > **Add role assignment**.
3. On the **Role** tab:
   - Search for and select **Key Vault Crypto Service Encryption User**
   - Select **Next**
4. On the **Members** tab:
   - Select **Managed identity**
   - Select **+ Select members**
   - **Managed identity**: Select **User-assigned managed identity**
   - Select your managed identity: `id-ave-encryption`
   - Select **Select**
   - Select **Next**
5. On the **Review + assign** tab, select **Review + assign**.

### Create Disk Encryption Set

The disk encryption set applies the customer-managed key to VM disks.

1. In the Azure portal, search for **Disk Encryption Sets** and select **+ Create**.
2. Configure the disk encryption set:
   - **Subscription**: Your subscription
   - **Resource group**: `rg-shared-services`
   - **Disk encryption set name**: `des-ave-encryption`
   - **Region**: Same region as your enclave
   - **Encryption type**: **Encryption at-rest with a customer-managed key**
   - **Key vault**: Select your Key Vault `kv-ave-shared-<uniqueid>`
   - **Key**: Select your key `cmk-ave-encryption`
   - **Identity type**: **User assigned**
   - **User assigned identity**: Select `id-ave-encryption`
3. Select **Review + create** and then **Create**.

### Grant managed identity access to enclave resources

For AVE-managed resources, the identity needs contributor access.

1. Navigate to your **Shared Services Enclave** resource group (the managed resource group, for example, `shared-services-HostedResources-<guid>`).
2. Select **Access control (IAM)**.
3. Select **+ Add** > **Add role assignment**.
4. Assign the **Contributor** role:
   - **Role**: **Contributor**
   - **Assign access to**: **Managed identity**
   - **Members**: Select your managed identity `id-ave-encryption`
5. Select **Review + assign**.

### Validate common dependencies

Verify all resources are created and configured correctly:

- [ ] User Assigned Managed Identity `id-ave-encryption` created
- [ ] Key Vault `kv-ave-shared-<uniqueid>` created with RBAC enabled
- [ ] Customer Managed Key `cmk-ave-encryption` created in Key Vault
- [ ] Managed identity has **Key Vault Crypto Service Encryption User** role on the key
- [ ] Disk Encryption Set `des-ave-encryption` created and linked to key and identity
- [ ] Managed identity has **Contributor** role on enclave managed resource group

## Create AVD enclave

Now create a dedicated enclave for Azure Virtual Desktop workloads.

1. In your community (for example, `fabrikam`), select **Enclaves** > **+ Create**.
2. Configure the AVD enclave:
   - **Enclave name**: `avd-enclave`
   - **Region**: Same region as your community
   - **Address space**: `10.2.0.0/16`
3. Select **Next: Subnets**.
4. Add the management subnet:
   - Select **+ Add subnet**
   - **Subnet name**: `AzureVirtualDesktopManagementSubnet`
   - **Subnet address range**: `10.2.1.0/24`
   - **Add Network Security Group**: Select **Add new**
   - **Network Security Group name**: `nsg-avd-management`
   - Select **OK**
5. Add the session hosts subnet:
   - Select **+ Add subnet**
   - **Subnet name**: `AzureVirtualDesktopSessionHostsSubnet`
   - **Subnet address range**: `10.2.2.0/24`
   - **Add Network Security Group**: Select **Add new**
   - **Network Security Group name**: `nsg-avd-sessionhosts`
   - Select **OK**
6. Select **Review + create** and then **Create**.

> [!NOTE]
> Enclave deployment takes 30-45 minutes. You can continue to plan the AKS enclave while this deploys.

## Create AKS enclave

Create a dedicated enclave for Azure Kubernetes Service workloads.

1. In your community, select **Enclaves** > **+ Create**.
2. Configure the AKS enclave:
   - **Enclave name**: `aks-enclave`
   - **Region**: Same region as your community
   - **Address space**: `10.3.0.0/16`
3. Select **Next: Subnets**.
4. Add the node subnet:
   - Select **+ Add subnet**
   - **Subnet name**: `aksSubnet`
   - **Subnet address range**: `10.3.1.0/25` (128 IPs)
   - **Add Network Security Group**: Select **Add new**
   - **Network Security Group name**: `nsg-aks-nodes`
   - **Subnet delegation**: **None** (no delegation for AKS node subnet)
   - Select **OK**
5. Add the API server subnet:
   - Select **+ Add subnet**
   - **Subnet name**: `agentSubnet`
   - **Subnet address range**: `10.3.1.128/28` (16 IPs)
   - **Add Network Security Group**: Use existing `nsg-aks-nodes`
   - **Subnet delegation**: **None**
   - Select **OK**
6. Add the private endpoint subnet:
   - Select **+ Add subnet**
   - **Subnet name**: `AzureVirtualEnclaveSubnet`
   - **Subnet address range**: `10.3.2.0/26` (64 IPs)
   - **Add Network Security Group**: Use existing `nsg-aks-nodes`
   - **Subnet delegation**: **None** (important: no delegation for private endpoints)
   - Select **OK**
7. Select **Review + create** and then **Create**.

> [!IMPORTANT]
> Wait for both enclave deployments to complete before proceeding to the next steps.

## Deploy private DNS zones

Private DNS zones enable private endpoint DNS resolution for Azure services.

### Create private DNS zones for AVD

1. Navigate to your **AVD enclave** (`avd-enclave`).
2. Select **Workloads** > **+ Create**.
3. Create a workload:
   - **Workload name**: `avd-workload`
   - **Create resource group**: **Create new**
   - **Resource group name**: `rg-avd-workload`
4. In the workload, select **+ Add an Azure Service**.
5. Select **Private DNS Zones** from the service catalog.
6. Configure the Private DNS Zones deployment:
   - **Resource group**: `rg-avd-workload`
   - **AVD Private DNS Zones**: Check all AVD zones:
     - `privatelink.wvd.microsoft.com`
     - `privatelink-global.wvd.microsoft.com`
   - **Additional zones**: Add zones for storage and key vault:
     - `privatelink.file.core.windows.net`
     - `privatelink.blob.core.windows.net`
     - `privatelink.vaultcore.azure.net`
7. Select **Review + Add** and then **Create**.
8. Wait for the deployment to complete.

### Create private DNS zones for AKS

1. Navigate to your **AKS enclave** (`aks-enclave`).
2. Select **Workloads** > **+ Create**.
3. Create a workload:
   - **Workload name**: `aks-workload`
   - **Create resource group**: **Create new**
   - **Resource group name**: `rg-aks-workload`
4. In the workload, select **+ Add an Azure Service**.
5. Select **Private DNS Zones** from the service catalog.
6. Configure the Private DNS Zones deployment:
   - **Resource group**: `rg-aks-workload`
   - **Additional Private DNS Zone names**: Enter the AKS private DNS zone:
     - `privatelink.<region>.azmk8s.io` (replace `<region>` with your region, for example, `eastus`)
   - Also add shared service zones:
     - `privatelink.vaultcore.azure.net`
     - `privatelink.blob.core.windows.net`
7. Select **Review + Add** and then **Create**.
8. Wait for the deployment to complete.

## Create community endpoints for external connectivity

Community endpoints allow traffic from your enclaves to external Azure services and the internet.

### Create AVD community endpoint

1. Navigate to your community (for example, `fabrikam`).
2. Select **Community endpoints** > **+ Create**.
3. Configure the endpoint:
   - **Name**: `ce-avd-services`
   - **Description**: `AVD required service endpoints`
4. Select **Add rule** and configure each required endpoint:

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

5. Select **Review + create** and then **Create**.

### Create AKS community endpoint

1. In your community, select **Community endpoints** > **+ Create**.
2. Configure the endpoint:
   - **Name**: `ce-aks-services`
   - **Description**: `AKS required service endpoints`
3. Select **Add rule** and configure each required endpoint:

   **Rule 1: Container Registry**
   - **Name**: `mcr`
   - **Destination**: `mcr.microsoft.com,*.data.mcr.microsoft.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

   **Rule 2: Cluster Management**
   - **Name**: `aks-management`
   - **Destination**: `*.hcp.<region>.azmk8s.io` (replace `<region>`)
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

4. Select **Review + create** and then **Create**.

> [!NOTE]
> Service tags aren't currently available in AVE. You must use specific FQDNs for AKS endpoints.

## Create enclave endpoints and connections

Enclave endpoints and connections enable communication between enclaves for accessing shared services.

### Create enclave endpoint for shared services

1. Navigate to your **Shared Services Enclave** (`shared-services`).
2. Select **Enclave endpoints** > **+ Create**.
3. Configure the endpoint:
   - **Name**: `ee-shared-services`
   - **Description**: `Allow access to shared Key Vault and monitoring`
4. Add rules for shared services:

   **Rule 1: Key Vault**
   - **Name**: `key-vault`
   - **Protocol**: `HTTPS`
   - **Port**: `443`
   - **Source IP/CIDR**: `10.2.0.0/16,10.3.0.0/16` (AVD and AKS enclave CIDRs)

   **Rule 2: DNS**
   - **Name**: `dns`
   - **Protocol**: `TCP`
   - **Port**: `53`
   - **Source IP/CIDR**: `10.2.0.0/16,10.3.0.0/16`

5. Select **Review + create** and then **Create**.

### Create enclave connections

Create enclave connections to link the enclaves together.

1. Navigate to your **AVD enclave** (`avd-enclave`).
2. Select **Enclave connections** > **+ Create**.
3. Configure the connection:
   - **Name**: `conn-avd-to-shared`
   - **Source enclave**: `avd-enclave` (current)
   - **Destination enclave endpoint**: Select `ee-shared-services` from shared services enclave
4. Select **Review + create** and then **Create**.

5. Repeat for AKS enclave:
   - Navigate to **AKS enclave** (`aks-enclave`)
   - Create connection `conn-aks-to-shared` to `ee-shared-services`

## Validate the environment

Verify that your environment is correctly configured:

- [ ] Common dependencies deployed in shared services workload
- [ ] AVD enclave created with management and session hosts subnets
- [ ] AKS enclave created with node, API server, and private endpoint subnets
- [ ] Private DNS zones deployed and linked to enclaves
- [ ] Community endpoints created for AVD and AKS external connectivity
- [ ] Enclave endpoints created for shared services
- [ ] Enclave connections created from AVD and AKS to shared services

## Next steps

With your AVE environment configured, you're ready to deploy workloads. The next tutorial guides you through deploying Azure Virtual Desktop.

> [Tutorial 2-3: Deploy Azure Virtual Desktop (AVD) workload](./2-3-deploy-virtual-desktop-workload.md)

## Related content

- [Create a user-assigned managed identity](./create-user-managed-identity.md)
- [Configure customer-managed key encryption](./configure-customer-managed-key-encryption-within-enclave.md)
- [Deploy private DNS zones from service catalog](./deploy-private-dns-zones-service-catalog.md)
- [Create enclave endpoints](./create-enclave-endpoint-portal.md)
- [Create enclave connections](./create-enclave-connection-portal.md)
