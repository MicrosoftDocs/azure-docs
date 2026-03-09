---
title: Use Azure Files for Azure Kubernetes Workloads
description: Learn how to use Azure file shares for Azure Kubernetes Service (AKS) workloads, including how to use the Azure Files CSI driver.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 01/20/2026
ms.author: kendownie
ai-usage: ai-generated
# Customer intent: "As a Kubernetes administrator, I want to implement Azure Files for my Azure Kubernetes Service (AKS) workloads requiring persistent, shared storage, so that I can better support my organization's containerized applications."
---

# Azure Files guidance for Azure Kubernetes Service (AKS) workloads

Azure Files provides file shares (Azure Files SMB/NFS endpoints) accessible via SMB 3.x or NFS 4.1 protocols. When integrated with Azure Kubernetes Service (AKS), Azure Files enables persistent, shared storage for containerized applications with `ReadWriteMany` access mode, allowing multiple pods (Kubernetes container groups) to mount the same share concurrently.

## AKS overview: managed Kubernetes on Azure

Azure Kubernetes Service is a managed Kubernetes service for deploying and scaling containerized applications on Azure. AKS manages control plane components (API server, etcd, scheduler); you manage worker node pools. AKS 1.21+ includes the Azure Files CSI driver by default.

## Azure Files benefits for AKS storage

Azure Files supports `ReadWriteMany` (RWX) access mode required for multi-pod shared storage. Use the following SKU guidance:

| Workload type | Recommended SKU | Expected latency | Max IOPS (per share) |
|---------------|-----------------|------------------|----------------------|
| Config files, low I/O | Standard_LRS | 10–15 ms | 1,000 |
| Logging, moderate I/O | Premium_LRS | 1–2 ms | Up to 100,000 |
| Media/content, high throughput | Premium_ZRS | 1–2 ms | Up to 100,000 |

Deploy the storage account in the same Azure region as your AKS cluster to minimize network latency.

### Persistent shared storage

Unlike local storage that's tied to individual nodes (Kubernetes worker VMs), Azure Files provides persistent storage that survives pod restarts, node failures, and cluster (AKS) scaling events. Multiple pods across different nodes can simultaneously access the same file share, enabling shared data scenarios and stateful applications.

### Kubernetes native integration

Azure Files integrates with Kubernetes through the Container Storage Interface (CSI) driver. You provision and manage file shares using persistent volumes (PV) and persistent volume claims (PVC). The CSI driver handles Azure API calls, authentication via managed identity or storage account key, and mount operations.

### SSD file shares for optimal performance

Azure Files storage tiers:

- **Standard (HDD)**: Up to 1,000 IOPS, 60 MiB/s throughput per share. Use for config files, infrequent access.
- **Premium (SSD)**: Baseline 400 IOPS + 1 IOPS per GiB provisioned, up to 100,000 IOPS. Use for logging, media serving, databases.

Deploy file shares in the same region as your AKS cluster. Cross-region mounts add 50–100+ ms latency.

### Protocol support

- **SMB 3.x**: Linux and Windows nodes. Requires port 445 outbound. Supports storage account key or Microsoft Entra ID authentication.
- **NFS 4.1**: Linux nodes only. Requires Premium SKU and virtual network-enabled storage account. No authentication; relies on network security.

### Security and compliance

Azure Files security features: AES-256 encryption at rest, TLS 1.2+ encryption in transit, Microsoft Entra ID and RBAC integration for SMB, and private endpoint support to restrict traffic to your virtual network.

## Azure Files CSI driver: Kubernetes integration

The Azure Files Container Storage Interface (CSI) driver connects Azure Files to Kubernetes clusters. The CSI specification defines a standard interface for storage systems to expose capabilities to containerized workloads. For configuration details, see [Use Azure Files CSI driver in AKS](/azure/aks/azure-files-csi).

### How the CSI driver works

In AKS clusters, the Azure Files CSI driver is installed and managed automatically. The driver operates through several key components:

- **CSI driver pod**: Runs as a DaemonSet on each node in the AKS cluster, responsible for mounting and unmounting Azure file shares
- **CSI controller**: Manages the lifecycle of Azure file shares, including creation, deletion, and volume expansion
- **Storage classes**: Define the parameters and policies for dynamic provisioning of Azure file shares
- **Persistent volumes**: Represent the actual Azure file shares in Kubernetes
- **Persistent volume claims**: User requests for storage that are bound to persistent volumes

When a pod requests storage through a persistent volume claim, the CSI driver coordinates with Azure APIs to either create a new Azure file share ([dynamic provisioning](#dynamic-provisioning-auto-create-azure-file-shares)) or connect to an existing share ([static provisioning](#static-provisioning-use-existing-azure-file-shares)). The driver then mounts the share into the pod's filesystem namespace, making it accessible to applications.

### CSI driver capabilities

The Azure Files CSI driver provides several advanced capabilities:

- **Dynamic volume provisioning**: Automatically creates Azure file shares based on storage class definitions
- **Volume expansion**: Supports online expansion of existing Azure file shares
- **Snapshot support**: Enables point-in-time snapshots for backup and recovery scenarios
- **Cross-platform compatibility**: Works with both Linux and Windows node pools (AKS compute groups) in AKS

## Azure Files use cases: AKS workload scenarios

Some common use cases for Azure Files with AKS include:

- **Shared configuration and secrets management**: Azure Files enables centralized storage of configuration files, certificates, and other shared resources that multiple pods need to access. 
- **Log aggregation and centralized logging**: Azure Files can serve as a central repository for application logs, enabling log aggregation from multiple pods and providing persistent storage for log analysis tools.
- **Content management systems and media storage**: For applications that handle user-generated content, media files, or document management, Azure Files provides scalable shared storage accessible by multiple application instances.
- **Batch processing and ETL workloads**: Azure Files enables efficient data sharing between batch processing jobs, ETL pipelines, and data processing workflows where multiple pods need access to input data and output results.
- **Development and testing environments**: Shared storage for development teams to collaborate on code, share test data, and maintain consistent development environments across different pods and nodes.

## Azure Files for shared configuration and secrets

Before deploying shared configuration storage, verify your environment meets these requirements:

| Requirement | Details |
|-------------|----------|
| **AKS version** | 1.21 or later |
| **CSI driver version** | v1.0.0 or later (preinstalled on AKS 1.21+) |
| **Supported node pools** | Linux and Windows |
| **Role assignments** | Storage Account Contributor or Storage File Data SMB Share Contributor on the storage account |
| **SKU options** | Standard_LRS, Standard_ZRS, Premium_LRS, Premium_ZRS |
| **Region constraints** | ZRS SKUs require regions with availability zone support |

Azure Files is particularly useful for:

- **Configuration management**: Store application configuration files that need to be shared across multiple instances.
- **Certificate distribution**: Centrally manage and distribute SSL/TLS certificates.
- **Shared libraries**: Store common libraries or binaries accessed by multiple applications.

This YAML example creates a persistent volume claim for shared configuration storage and a deployment that mounts this storage across multiple pod replicas. This example uses the SMB protocol and works on both Linux and Windows node pools:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: config-storage
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: azurefile-csi-premium
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
      volumes:
      - name: config-volume
        persistentVolumeClaim:
          claimName: config-storage
```

**Verify deployment:**

```bash
# Check PVC is bound
kubectl get pvc config-storage -o jsonpath="{.status.phase}"
# Expected: Bound

# Confirm mount in pod
kubectl exec deploy/app-deployment -- ls -la /app/config
# Expected: directory listing (empty or with config files)
```

## Azure Files for log aggregation and centralized logging

Before deploying centralized logging storage, verify your environment meets these requirements:

| Requirement | Details |
|-------------|----------|
| **AKS version** | 1.21 or later |
| **CSI driver version** | v1.0.0 or later (preinstalled on AKS 1.21+) |
| **Supported node pools** | Linux (recommended for DaemonSet log collectors); Windows supported with SMB protocol |
| **Role assignments** | Storage Account Contributor or Storage File Data SMB Share Contributor on the storage account |
| **SKU options** | Premium_LRS or Premium_ZRS recommended for high-throughput logging |
| **Region constraints** | Deploy storage account in the same region as AKS cluster for optimal latency |

Azure Files can serve as a central repository for application logs, enabling log aggregation from multiple pods and providing persistent storage for log analysis tools.

This YAML example demonstrates a DaemonSet (pod on every node) for log collection with a shared Azure Files storage for centralized log aggregation. This example targets Linux node pools and uses the SMB protocol:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: logs-storage
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: azurefile-csi-premium
  resources:
    requests:
      storage: 100Gi
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
      - name: log-collector
        image: fluent/fluent-bit:latest
        volumeMounts:
        - name: logs-volume
          mountPath: /logs
        - name: varlog
          mountPath: /var/log
          readOnly: true
      volumes:
      - name: logs-volume
        persistentVolumeClaim:
          claimName: logs-storage
      - name: varlog
        hostPath:
          path: /var/log
```

**Verify deployment:**

```bash
# Check PVC is bound
kubectl get pvc logs-storage -o jsonpath="{.status.phase}"
# Expected: Bound

# Confirm DaemonSet pods running (one per node)
kubectl get pods -l app=log-collector -o wide
# Expected: Running pod on each node

# Verify mount and log collection
kubectl exec ds/log-collector -- ls -la /logs
# Expected: directory listing with log files
```

## Dynamic provisioning: auto-create Azure file shares

Dynamic provisioning automatically creates Azure file shares when you create a persistent volume claim. Verify your environment meets these requirements:

| Requirement | Details |
|-------------|----------|
| **AKS version** | 1.21 or later |
| **CSI driver version** | v1.0.0 or later (preinstalled on AKS 1.21+) |
| **Supported node pools** | Linux: SMB and NFS protocols; Windows: SMB protocol only |
| **Role assignments** | AKS cluster identity requires Storage Account Contributor role; for private endpoints, also requires Private DNS Zone Contributor |
| **SKU options** | Standard: Standard_LRS (locally redundant), Standard_GRS (geo-redundant, includes read access as RA-GRS), Standard_ZRS (zone-redundant), Standard_GZRS (geo-zone-redundant, includes read access as RA-GZRS); Premium: Premium_LRS, Premium_ZRS |
| **Region constraints** | NFS protocol requires premium file shares and a virtual network-enabled storage account; ZRS requires availability zone support |

With dynamic provisioning, storage is automatically created when a persistent volume claim is created. The Azure Files CSI driver supports dynamic provisioning through Kubernetes storage classes.

### Prerequisites for dynamic provisioning

Ensure the following are in place before creating a StorageClass for dynamic provisioning:

- AKS cluster version 1.21 or later
- Linux node pool (for NFS) or Linux/Windows node pool (for SMB)
- AKS cluster identity with **Storage Account Contributor** role on the resource group
- For NFS: Premium SKU storage account with virtual network service endpoint enabled
- For private endpoints: **Private DNS Zone Contributor** role on the private DNS zone

### Steps to configure dynamic provisioning

1. **Create the StorageClass** – Define the provisioning parameters (SKU, protocol, mount options).
2. **Create a PersistentVolumeClaim (PVC)** – Reference the StorageClass; the CSI driver auto-creates the Azure file share.
3. **Deploy your workload** – Mount the PVC in your pod spec.
4. **Verify** – Confirm PVC is `Bound` and the mount path is accessible.

### StorageClass parameters for dynamic provisioning

Use these parameters when defining a StorageClass for Azure Files dynamic provisioning:

| Parameter | Value | Description |
|-----------|-------|-------------|
| `provisioner` | `file.csi.azure.com` | Azure Files CSI driver identifier |
| `parameters.skuName` | `Premium_LRS`, `Premium_ZRS`, `Standard_LRS`, `Standard_ZRS`, `Standard_GRS`, `Standard_GZRS` | Storage redundancy and tier |
| `parameters.protocol` | `smb` or `nfs` | NFS requires Premium SKU and Linux nodes |
| `allowVolumeExpansion` | `true` / `false` | Enable online volume resize |
| `reclaimPolicy` | `Delete` / `Retain` | Action when PVC is deleted |
| `volumeBindingMode` | `Immediate` / `WaitForFirstConsumer` | When to provision storage |

This YAML defines a storage class (Kubernetes provisioning template) for dynamic provisioning of SSD (premium) Azure file shares with SMB protocol. For Linux mount options, see [SMB mount options reference](#smb-mount-options-reference-linux).

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azurefile-csi-premium
provisioner: file.csi.azure.com
parameters:
  skuName: Premium_LRS
  protocol: smb
allowVolumeExpansion: true
mountOptions:
  # Canonical permissions: 0755/uid=1000/gid=1000 for least privilege.
  # Use 0777/uid=0/gid=0 only if app requires root or broad write access.
  - dir_mode=0755
  - file_mode=0755
  - uid=1000
  - gid=1000
  - mfsymlinks
  - cache=strict
  - actimeo=30
```

**Verify StorageClass:**

```bash
# Check StorageClass exists
kubectl get sc azurefile-csi-premium -o jsonpath="{.provisioner}"
# Expected: file.csi.azure.com

# Test dynamic provisioning with a PVC (replace with your PVC name)
kubectl get pvc <YOUR_PVC_NAME, e.g., my-azurefile-pvc> -o jsonpath="{.status.phase}"
# Expected: Bound (after creating a PVC referencing this StorageClass)
```

## Static provisioning: use existing Azure file shares

Static provisioning connects to preexisting Azure file shares. Verify your environment meets these requirements:

| Requirement | Details |
|-------------|----------|
| **AKS version** | 1.21 or later |
| **CSI driver version** | v1.0.0 or later (preinstalled on AKS 1.21+) |
| **Supported node pools** | Linux: SMB and NFS protocols; Windows: SMB protocol only |
| **Role assignments** | AKS nodes require network access to the storage account; for SMB, a Kubernetes secret with storage account name and key is required |
| **Prerequisites** | Preexisting Azure storage account and file share; Kubernetes secret containing storage credentials (for SMB) |
| **Region constraints** | Storage account must be accessible from the AKS cluster virtual network; for private endpoints, configure DNS resolution |

For existing Azure file shares, you can create persistent volumes that reference precreated storage.

### Prerequisites for static provisioning

Ensure the following are in place before creating a PersistentVolume for static provisioning:

- AKS cluster version 1.21 or later
- Linux node pool (for NFS) or Linux/Windows node pool (for SMB)
- Preexisting Azure storage account and file share
- For SMB: Kubernetes Secret containing `azurestorageaccountname` and `azurestorageaccountkey`
- For NFS: Storage account with Premium SKU and virtual network service endpoint; no secret required
- Network connectivity from AKS nodes to the storage account (public endpoint, service endpoint, or private endpoint)

### Steps to configure static provisioning

1. **Create the Azure file share** – Provision the storage account and file share in Azure portal, CLI, or Bicep/Terraform.
2. **(SMB only) Create a Kubernetes Secret** – Store the storage account name and key:
   ```bash
   kubectl create secret generic azure-secret \
     --from-literal=azurestorageaccountname=<STORAGE_ACCOUNT_NAME, e.g., myteaborgstorage> \
     --from-literal=azurestorageaccountkey=<STORAGE_ACCOUNT_KEY, e.g., abc123...base64key>
   ```
3. **Create the PersistentVolume (PV)** – Reference the existing share using CSI volume attributes.
4. **Create a PersistentVolumeClaim (PVC)** – Bind to the PV using matching `storageClassName` and access modes.
5. **Deploy your workload** – Mount the PVC in your pod spec.
6. **Verify** – Confirm PV is `Bound` and the existing share contents are visible.

### PersistentVolume parameters for static provisioning

Use these parameters when defining a PersistentVolume to reference an existing Azure file share:

| Parameter | Value | Description |
|-----------|-------|-------------|
| `spec.capacity.storage` | e.g., `100Gi` | Must match or be less than the existing share quota |
| `spec.accessModes` | `ReadWriteMany`, `ReadWriteOnce`, `ReadOnlyMany` | RWX typical for shared access |
| `spec.persistentVolumeReclaimPolicy` | `Retain` / `Delete` | Use `Retain` to preserve existing shares |
| `csi.driver` | `file.csi.azure.com` | Azure Files CSI driver identifier |
| `csi.volumeHandle` | Unique string | Identifier for this PV (must be unique per cluster) |
| `csi.volumeAttributes.resourceGroup` | Resource group name | Where storage account resides |
| `csi.volumeAttributes.storageAccount` | Storage account name | Account containing the file share |
| `csi.volumeAttributes.shareName` | File share name | Existing Azure file share name |
| `csi.volumeAttributes.protocol` | `smb` or `nfs` | Must match share configuration |

This YAML example shows how to create a persistent volume that references an existing Azure file share using static provisioning. This example uses the SMB protocol and works on both Linux and Windows node pools:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: existing-azurefile-pv
spec:
  capacity:
    storage: 100Gi                     # Must match existing share quota
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: azurefile-csi
  csi:
    driver: file.csi.azure.com
    readOnly: false
    volumeHandle: unique-volume-id-001  # <UNIQUE_ID, e.g., existing-file-share-id> – must be unique per cluster
    volumeAttributes:
      resourceGroup: rg-aks-storage     # <RESOURCE_GROUP, e.g., rg-aks-storage>
      storageAccount: staborgstorage01  # <STORAGE_ACCOUNT, e.g., staborgstorage01>
      shareName: aksfileshare           # <SHARE_NAME, e.g., aksfileshare>
      protocol: smb
```

**Verify deployment:**

```bash
# Check PV is available
kubectl get pv existing-azurefile-pv -o jsonpath="{.status.phase}"
# Expected: Available (or Bound if PVC exists)

# After creating a matching PVC and pod, confirm mount
kubectl exec <POD_NAME, e.g., my-app-pod-abc123> -- ls -la <MOUNT_PATH, e.g., /mnt/azure>
# Expected: contents of existing Azure file share
```

## Azure Files mount options: optimize performance

These mount options apply to Linux nodes using the SMB protocol (CIFS). Windows nodes use native SMB and ignore these options.

### SMB mount options reference (Linux)

**Canonical permission set:** `dir_mode=0755`, `file_mode=0755`, `uid=1000`, `gid=1000`. Use `0777`/`uid=0`/`gid=0` only when your application requires root ownership or world-writable access (for example, legacy apps or containers running as root).

| Option | Recommended value | Description |
|--------|-------------------|-------------|
| `dir_mode` | `0755` or `0777` | Directory permissions; use `0755` for tighter security |
| `file_mode` | `0755` or `0777` | File permissions; use `0755` for tighter security |
| `uid` | `1000` (or app user) | User ID for file ownership |
| `gid` | `1000` (or app group) | Group ID for file ownership |
| `mfsymlinks` | (no value) | Enable symbolic link support |
| `cache` | `strict` | Caching mode; `strict` ensures consistency |
| `actimeo` | `30` | Attribute cache timeout in seconds; lower = fresher metadata, higher = fewer round trips |
| `nobrl` | (no value) | Disable byte-range locks; improves performance for apps not using POSIX locks |
| `nosharesock` | (no value) | Use separate TCP connection per mount; reduces reconnect race conditions |

**Example YAML:**

```yaml
mountOptions:
  - dir_mode=0755
  - file_mode=0755
  - uid=1000
  - gid=1000
  - mfsymlinks
  - cache=strict
  - actimeo=30
  - nobrl
```

## Azure Files private endpoints: secure AKS storage

Private endpoints restrict Azure Files traffic to your virtual network, eliminating exposure to the public internet.

### Prerequisites for private endpoint configuration

Ensure the following are in place before configuring private endpoints for Azure Files:

- AKS cluster version 1.21 or later with virtual network integration
- Azure storage account in the same region as the AKS cluster
- **Private DNS Zone Contributor** role on the `privatelink.file.core.windows.net` zone
- **Network Contributor** role on the virtual network/subnet for private endpoint creation
- Private DNS zone linked to the AKS virtual network (for automatic DNS resolution)

### Steps to configure private endpoints with Azure Files

1. **Create a private endpoint** – In the Azure portal or via CLI/Bicep, create a private endpoint for the storage account targeting the `file` sub-resource.
2. **Configure private DNS** – Link the `privatelink.file.core.windows.net` private DNS zone to your AKS virtual network.
3. **Create the StorageClass** – Set `networkEndpointType: privateEndpoint` in the parameters.
4. **Create a PVC** – Reference the StorageClass; the CSI driver provisions storage via the private endpoint.
5. **Deploy your workload** – Mount the PVC in your pod spec.
6. **Verify** – Confirm the PVC binds and that DNS resolves to a private IP (`nslookup <storageaccount>.file.core.windows.net`).

This YAML example demonstrates how to create Azure file storage with private endpoint configuration for enhanced security. For Linux mount options, see [SMB mount options reference](#smb-mount-options-reference-linux).

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azurefile-csi-private
provisioner: file.csi.azure.com
allowVolumeExpansion: true
parameters:
  skuName: Premium_LRS
  networkEndpointType: privateEndpoint
reclaimPolicy: Delete
volumeBindingMode: Immediate
mountOptions:
  # Canonical permissions: 0755/uid=1000/gid=1000 for least privilege.
  # Use 0777/uid=0/gid=0 only if app requires root or broad write access.
  - dir_mode=0755
  - file_mode=0755
  - uid=1000
  - gid=1000
  - mfsymlinks
  - cache=strict
  - nosharesock
  - actimeo=30
  - nobrl
```

**Verify deployment:**

```bash
# Check StorageClass exists with private endpoint
kubectl get sc azurefile-csi-private -o jsonpath="{.parameters.networkEndpointType}"
# Expected: privateEndpoint

# After creating a PVC, verify private endpoint connectivity
kubectl get pvc <YOUR_PVC_NAME, e.g., secure-pvc> -o jsonpath="{.status.phase}"
# Expected: Bound (requires virtual network integration and private DNS configured)
```

## See also

- [Use Azure Files CSI driver in AKS](/azure/aks/azure-files-csi)
- [Create and use a volume with Azure Files in AKS](/azure/aks/azure-csi-files-storage-provision)
