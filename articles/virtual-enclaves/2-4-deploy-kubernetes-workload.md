---
title: Deploy Azure Kubernetes Service (AKS) workload in Azure Virtual Enclaves
description: Deploy a private AKS cluster with encryption, monitoring, and network integration in Azure Virtual Enclaves using the service catalog.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 12/18/2024
ms.custom: references_region
---

# Tutorial 2-4: Deploy Azure Kubernetes Service (AKS) workload in Azure Virtual Enclaves

This tutorial guides you through deploying a private Azure Kubernetes Service (AKS) cluster in Azure Virtual Enclaves. You create a fully private AKS cluster with customer-managed encryption, network integration, and secure access patterns.

In this tutorial, you learn how to:
  - Enable required Azure features for private AKS
  - Deploy private AKS cluster with network infrastructure
  - Configure customer-managed key encryption
  - Create community endpoints for AKS connectivity
  - Associate multiple resource groups to AKS workload
  - Access the AKS cluster and validate

## Prerequisites

- Completion of [Tutorial 2-3: Deploy Azure Virtual Desktop Workload](./2-3-deploy-virtual-desktop-workload.md)
- AKS enclave with node, API server, and private endpoint subnets
- Common dependencies (Key Vault, managed identity, disk encryption set) from Tutorial 11
- Private DNS zones for AKS deployed
- **Contributor** role on the AKS workload resource group
- **Azure Kubernetes Service Contributor** role on the subscription
- Azure CLI or Azure PowerShell installed for advanced operations

## Before you begin

### Understanding AKS in Azure Virtual Enclaves

AKS in AVE provides:
- **Fully private cluster**: API server accessible only through private endpoint
- **Network isolation**: All traffic stays within enclave boundaries
- **Customer-managed encryption**: Both control plane and data plane encrypted with CMK
- **Secure workload boundaries**: Kubernetes resources contained within enclave security policies

### Resource naming conventions

This tutorial uses example names. Use your organization's naming convention:
- Enclave: `aks-enclave`
- Workload: `aks-workload`
- Resource group: `rg-aks-cluster`
- AKS cluster: `aks-prod-01`

## Enable required Azure features

AKS in AVE requires specific Azure features to be enabled on your subscription.

### Enable EncryptionAtHost feature

This feature enables encryption at the VM host level for AKS nodes.

```azurecli
# Register the feature
az feature register --namespace Microsoft.Compute --name EncryptionAtHost

# Check registration status (may take 10-15 minutes)
az feature show --namespace Microsoft.Compute --name EncryptionAtHost

# Once registered, refresh the provider
az provider register --namespace Microsoft.Compute
```

### Enable API Server virtual network Integration (Preview)

This feature allows the AKS API server to be integrated directly into your virtual network.

```azurecli
# Register the feature
az feature register --namespace Microsoft.ContainerService --name EnableAPIServerVnetIntegrationPreview

# Check registration status
az feature show --namespace Microsoft.ContainerService --name EnableAPIServerVnetIntegrationPreview

# Once registered, refresh the provider
az provider register --namespace Microsoft.ContainerService
```

> [!IMPORTANT]
> Wait for both features to show `"state": "Registered"` before proceeding. Registration typically takes 10-15 minutes.

## Prepare SSH key (Optional)

> [!NOTE]
> SSH key authentication for AKS node access is being deprecated. This step is currently required but will be optional in future template versions. If you don't need direct node access, you can skip this section when the template is updated.

### Generate SSH key pair

```powershell
# Create .ssh directory if it doesn't exist
$sshDir = "$env:USERPROFILE\.ssh"
if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir
}

# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -f "$sshDir\aks-nodes" -N '""'

# Display the public key
Get-Content "$sshDir\aks-nodes.pub"
```

### Store SSH key in Key Vault

```azurecli
# Read the SSH public key
$sshPublicKey = Get-Content "$env:USERPROFILE\.ssh\aks-nodes.pub" -Raw

# Store in Key Vault as a secret
az keyvault secret set `
    --vault-name "kv-ave-shared-<uniqueid>" `
    --name "aks-ssh-public-key" `
    --value $sshPublicKey
```

## Deploy AKS network infrastructure

First, deploy the network infrastructure that prepares your enclave for AKS.

### Use service catalog template

1. In the Azure portal, navigate to your **AKS workload** in the AKS enclave.
2. Select **+ Add an Azure Service**.
3. Search for and select **Private AKS Cluster - Network Infrastructure**.
4. Configure the deployment:

   **Basic settings:**
   - **Resource group**: `rg-aks-infrastructure`
   - **Location**: Same as enclave region
   - **Workload Name**: `aks-prod`
   
   **Network configuration:**
   - **Virtual Network Name**: Select AKS enclave virtual network
   - **Node Subnet Name**: `aksSubnet`
   - **Node Subnet Address Prefix**: `10.3.1.0/25`
   - **API Server Subnet Name**: `agentSubnet`
   - **API Server Subnet Address Prefix**: `10.3.1.128/28`
   - **Private Endpoint Subnet Name**: `AzureVirtualEnclaveSubnet`
   - **Private Endpoint Subnet Address Prefix**: `10.3.2.0/26`
   
   **Subnet delegation:**
   - **Enable Node Subnet Delegation**: **No**
   - **Enable API Subnet Delegation**: **No**
   - **Enable PE Subnet Delegation**: **No**
   
   > [!IMPORTANT]
   > Don't delegate subnets for private AKS clusters in AVE.
   
   **Network security:**
   - **Create Network Security Groups**: **Yes** (if not already created)
   - **NSG Name**: `nsg-aks-nodes`

5. Select **Review + Add** and then **Create**.
6. Wait for deployment to complete (~5-10 minutes).

## Deploy private AKS cluster

Now deploy the AKS cluster with full encryption and monitoring.

### Use service catalog template

1. In your **AKS workload**, select **+ Add an Azure Service**.
2. Search for and select **Private AKS Cluster**.
3. Configure the deployment:

#### Basics tab

- **Resource group**: `rg-aks-cluster`
- **Location**: Same as enclave region
- **Workload Name**: `aks-prod`

#### Cluster Configuration

- **Cluster Name**: `aks-prod-01`
- **Kubernetes Version**: Select latest stable version (for example, `1.29.5`)
- **DNS Prefix**: `aks-prod-01`
- **Enable Private Cluster**: **Yes** (required)
- **Enable API Server VNet Integration**: **Yes**

#### Node Pool Configuration

- **Node Pool Name**: `systempool`
- **Node Count**: `3`
- **Enable Auto-Scaling**: **Yes**
- **Min Count**: `2`
- **Max Count**: `5`
- **VM Size**: `Standard_D4s_v5` (4 vCPU, 16 GB of RAM)
- **OS Disk Size (GB)**: `128`
- **OS Disk Type**: `Managed` (uses encryption set)
- **Max Pods per Node**: `30`

#### Network Configuration

- **Network Plugin**: `azure` (Azure CNI)
- **Network Policy**: `azure` (Azure Network Policy)
- **Load Balancer SKU**: `standard`
- **Outbound Type**: `userDefinedRouting`
- **Service CIDR**: `172.16.0.0/16`
- **DNS Service IP**: `172.16.0.10`
- **Docker Bridge CIDR**: `172.17.0.1/16`

**Subnet Configuration:**
- **Node Subnet**: Select `aksSubnet` from your enclave
- **API Server Subnet**: Select `agentSubnet` from your enclave
- **Private Endpoint Subnet**: Select `AzureVirtualEnclaveSubnet` from your enclave

#### Identity Configuration

- **Identity Type**: **UserAssigned** (recommended)
- **User Assigned Identity**: Select identity from Tutorial 2-2 (for example, `id-ave-encryption`)
- **Create New Identity**: **No** (using existing)

> [!NOTE]
> System Assigned Identity is also supported but User Assigned is recommended for better lifecycle management.

#### Encryption Configuration

- **Enable Disk Encryption Set**: **Yes**
- **Disk Encryption Set**: Select DES from Tutorial 2-2 (for example, `des-ave-encryption`)
- **Enable Encryption at Host**: **Yes** (requires feature flag)
- **Key Vault Name**: `kv-ave-shared-<uniqueid>`
- **Encryption Key Name**: `cmk-ave-encryption`

#### SSH Configuration (if required by template)

- **SSH Public Key**: Paste the SSH public key or select from Key Vault secret
- **Linux Admin Username**: `aksadmin`

#### Add-ons Configuration

- **Enable Azure Monitor**: **Yes**
- **Log Analytics Workspace**: Select workspace from shared services
- **Enable Microsoft Defender for Containers**: **Yes** (recommended)
- **Enable Azure Policy**: **Yes** (enforces compliance)
- **Enable Secret Store CSI Driver**: **Yes** (for Key Vault integration)

#### Tags

- **Environment**: `Production`
- **Workload**: `AKS`
- **ManagedBy**: `AVE`

4. Select **Review + Add**.
5. Review all settings carefully.
6. Select **Create**.

> [!NOTE]
> Deployment takes 15-30 minutes. The AKS cluster creates a managed resource group automatically.

## Create community endpoints for AKS connectivity

AKS requires outbound connectivity to several Azure services. Create community endpoints for these requirements.

> [!NOTE]
> If you created AKS community endpoints in Tutorial 2-1, verify they include all required FQDNs.

### Configure community endpoint

1. Navigate to your community (for example, `fabrikam`).
2. Select **Community endpoints** > **+ Create** or edit existing `ce-aks-services`.
3. Ensure these rules exist:

   **Rule 1: Microsoft Container Registry**
   - **Name**: `mcr`
   - **Destination**: `mcr.microsoft.com,*.data.mcr.microsoft.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`
   
   **Rule 2: AKS Management**
   - **Name**: `aks-management`
   - **Destination**: `*.hcp.<region>.azmk8s.io,<region>.dp.kubernetesconfiguration.azure.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`
   
   **Rule 3: Azure Management**
   - **Name**: `azure-management`
   - **Destination**: `management.azure.com,login.microsoftonline.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`
   
   **Rule 4: Package Repository**
   - **Name**: `packages`
   - **Destination**: `packages.microsoft.com,acs-mirror.azureedge.net,azure.archive.ubuntu.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`
   
   **Rule 5: Azure Monitor (if enabled)**
   - **Name**: `monitoring`
   - **Destination**: `*.ods.opinsights.azure.com,*.oms.opinsights.azure.com,dc.services.visualstudio.com`
   - **Protocol**: `HTTPS`
   - **Port**: `443`

4. Select **Review + create** and then **Create** or **Save**.

### Configure NSG outbound rules

Add outbound security rules to your NSG to allow AKS traffic.

1. Navigate to **Network security groups** > `nsg-aks-nodes`.
2. Select **Outbound security rules** > **+ Add**.
3. Add rule for HTTPS outbound:
   - **Source**: `VirtualNetwork`
   - **Destination**: `Internet`
   - **Destination port**: `443`
   - **Protocol**: `TCP`
   - **Action**: `Allow`
   - **Priority**: `1000`
   - **Name**: `Allow_HTTPS_Outbound`

> [!NOTE]
> Service tags aren't currently available in AVE. You must use specific FQDNs and IP ranges.

## Associate AKS resource groups to workload

AKS creates a managed resource group (MRG) for cluster infrastructure. Associate both the user resource group and MRG to your workload.

### Using Azure portal

1. Navigate to your **Azure Virtual Enclaves** service in the Azure portal.
2. Select your **Community** (for example, `fabrikam`).
3. Select **Enclaves** and open your **AKS enclave** (for example, `aks-enclave`).
4. Select **Workloads** and open your **AKS workload** (for example, `aks-workload`).
5. In the workload overview, select **Properties** or **Linked Resource Groups**.
6. Select **+ Add resource group**.
7. Add the user resource group:
   - Select **Subscription**: Your subscription
   - Select **Resource group**: `rg-aks-cluster`
   - Select **Add**
8. Select **+ Add resource group** again.
9. Add the AKS managed resource group:
   - The managed RG name follows pattern: `MC_rg-aks-cluster_aks-prod-01_<region>`
   - Select **Subscription**: Your subscription
   - Select **Resource group**: The AKS managed resource group
   - Select **Add**
10. Verify both resource groups appear in the workload's linked resource groups list.

> [!TIP]
> To find the AKS managed resource group name, navigate to your AKS cluster in the portal and check the **Node resource group** property on the Overview page.

## Access AKS cluster

Access the private AKS cluster through an admin VM or Azure Bastion within the enclave.

### Connect to admin VM

1. Connect to your admin VM via Azure Bastion or RDP.
2. Ensure the admin VM has Azure CLI installed.
3. Sign in to Azure:

```azurecli
az login
```

### Get AKS credentials

```azurecli
# Get cluster credentials
az aks get-credentials `
    --resource-group rg-aks-cluster `
    --name aks-prod-01 `
    --admin

# Verify connection
kubectl get nodes
```

Expected output shows nodes in `Ready` status:
```
NAME                                STATUS   ROLES   AGE   VERSION
aks-systempool-12345678-vmss000000  Ready    agent   5m    v1.29.5
aks-systempool-12345678-vmss000001  Ready    agent   5m    v1.29.5
aks-systempool-12345678-vmss000002  Ready    agent   5m    v1.29.5
```

## Deploy test workload

Deploy a sample application to validate the cluster.

### Create namespace

```bash
kubectl create namespace test-app
```

### Deploy sample application

```yaml
# Save as test-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: test-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: mcr.microsoft.com/oss/nginx/nginx:1.25.3
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: test-app
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
```

```bash
# Apply the deployment
kubectl apply -f test-deployment.yaml

# Check deployment status
kubectl get deployments -n test-app
kubectl get pods -n test-app
kubectl get services -n test-app
```

## Validate the deployment

Perform comprehensive validation of your AKS cluster.

### Check cluster health

```bash
# Check node status
kubectl get nodes -o wide

# Check system pods
kubectl get pods -n kube-system

# Check node conditions
kubectl describe nodes | grep -A 5 Conditions
```

### Verify encryption

```bash
# Check if encryption at host is enabled
az aks show --resource-group rg-aks-cluster --name aks-prod-01 --query "securityProfile.enableEncryptionAtHost"

# Check disk encryption set
az aks show --resource-group rg-aks-cluster --name aks-prod-01 --query "diskEncryptionSetId"
```

### Validate network connectivity

```bash
# Test DNS resolution
kubectl run -it --rm debug --image=mcr.microsoft.com/dotnet/runtime-deps:6.0 --restart=Never -- nslookup kubernetes.default

# Test internet connectivity through community endpoints
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- curl -I https://mcr.microsoft.com

# Check service connectivity
kubectl get services -A
```

### Check monitoring and logs

```azurecli
# Check if Container Insights is enabled
az aks show --resource-group rg-aks-cluster --name aks-prod-01 --query "addonProfiles.omsagent.enabled"

# Query logs in Log Analytics
az monitor log-analytics query `
    --workspace <workspace-id> `
    --analytics-query "ContainerLog | where TimeGenerated > ago(1h) | limit 10"
```

### Verify Azure Policy compliance

```bash
# Check Azure Policy add-on status
kubectl get pods -n kube-system | grep azure-policy

# View policy violations (if any)
kubectl get constrainttemplates
kubectl get constraints
```

## Configure kubectl access for other users

Grant other users access to the AKS cluster.

### Using Azure RBAC

```azurecli
# Assign Azure Kubernetes Service Cluster User Role
az role assignment create `
    --assignee user@contoso.com `
    --role "Azure Kubernetes Service Cluster User Role" `
    --scope "/subscriptions/<subscription-id>/resourceGroups/rg-aks-cluster/providers/Microsoft.ContainerService/managedClusters/aks-prod-01"

# For admin access
az role assignment create `
    --assignee user@contoso.com `
    --role "Azure Kubernetes Service Cluster Admin Role" `
    --scope "/subscriptions/<subscription-id>/resourceGroups/rg-aks-cluster/providers/Microsoft.ContainerService/managedClusters/aks-prod-01"
```

### Using Kubernetes RBAC

```bash
# Create role binding for namespace access
kubectl create rolebinding user-viewer `
    --clusterrole=view `
    --user=user@contoso.com `
    --namespace=test-app
```

## Troubleshooting common issues

### Cluster creation fails

**Symptom**: AKS cluster deployment fails

**Solutions**:
- Verify feature flags are registered: `EncryptionAtHost`, `EnableAPIServerVnetIntegrationPreview`
- Check subnet sizes are adequate for node count and pod density
- Verify disk encryption set and managed identity have proper permissions
- Review activity log for specific error messages

### Nodes not ready

**Symptom**: Nodes show `NotReady` status

**Solutions**:
- Check node subnet has outbound connectivity to required endpoints
- Verify community endpoints include all required AKS FQDNs
- Check NSG rules allow outbound traffic on port 443
- Review node logs: `kubectl describe node <node-name>`

### Pods can't pull images

**Symptom**: Pods stuck in `ImagePullBackOff`

**Solutions**:
- Verify community endpoint includes `mcr.microsoft.com` and `*.data.mcr.microsoft.com`
- Check NSG allows outbound HTTPS (port 443)
- Ensure DNS resolution works: `nslookup mcr.microsoft.com` from pod
- Review secrets for image pull if using private registries

### Can't connect to API server

**Symptom**: `kubectl` commands fail with connection timeout

**Solutions**:
- Verify you're on admin VM or resource with enclave connectivity
- Check private DNS zone is linked to the virtual network
- Verify API server subnet configuration
- Test DNS resolution: `nslookup <cluster-fqdn>`

### Monitoring not working

**Symptom**: No logs or metrics in Azure Monitor

**Solutions**:
- Verify Container Insights add-on is enabled
- Check community endpoints include monitoring FQDNs
- Verify Log Analytics workspace is accessible from cluster
- Check `omsagent` pods are running: `kubectl get pods -n kube-system | grep omsagent`

## Clean up resources

To avoid ongoing charges, delete resources when no longer needed.

### Delete AKS cluster

```azurecli
# Delete AKS cluster (also deletes managed resource group)
az aks delete --resource-group rg-aks-cluster --name aks-prod-01 --yes --no-wait

# Delete user resource group
az group delete --name rg-aks-cluster --yes --no-wait

# Delete infrastructure resource group
az group delete --name rg-aks-infrastructure --yes --no-wait
```

> [!WARNING]
> Deleting the AKS cluster permanently removes all workloads and data. Ensure you have backups if needed.

## Next steps

You completed the tutorial series for deploying AVD and AKS workloads in Azure Virtual Enclaves!

### Recommended next steps

- [Configure autoscaling for AKS](/azure/aks/cluster-autoscaler)
- [Deploy applications with Helm](/azure/aks/kubernetes-helm)
- [Implement GitOps with Flux](/azure/azure-arc/kubernetes/tutorial-use-gitops-flux2)
- [Configure ingress controller](/azure/aks/ingress-basic)
- [Enable workload identity](/azure/aks/workload-identity-overview)

## Related content

- [AKS documentation](/azure/aks/)
- [AKS security best practices](/azure/aks/concepts-security)
- [AKS networking concepts](/azure/aks/concepts-network)
- [Private AKS cluster](/azure/aks/private-clusters)
- [Customer-managed keys in AKS](/azure/aks/azure-disk-customer-managed-keys)
- [Azure CNI networking](/azure/aks/configure-azure-cni)
- [Container Insights](/azure/azure-monitor/containers/container-insights-overview)
