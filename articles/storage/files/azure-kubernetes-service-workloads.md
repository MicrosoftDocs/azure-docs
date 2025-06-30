---
title: Use Azure Files for Azure Kubernetes Workloads
description: Learn how to use Azure file shares for Azure Kubernetes Service (AKS) workloads, including how to use the Azure Files CSI driver.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 06/30/2025
ms.author: kendownie
# Customer intent: "As a Kubernetes administrator, I want to implement Azure Files for my Azure Kubernetes Service (AKS) workloads requiring persistent, shared storage, so that I can better support my organization's containerized applications."
---

# Azure Files guidance for Azure Kubernetes Service (AKS) workloads

Azure Files provides fully managed file shares in the cloud that are accessible via the industry standard Server Message Block (SMB) protocol and Network File System (NFS) protocol. When integrated with Azure Kubernetes Service (AKS), Azure Files enables persistent, shared storage for containerized applications, supporting both stateful workloads and scenarios requiring shared data access across multiple pods.

## What is Azure Kubernetes Service?

Azure Kubernetes Service (AKS) is a managed Kubernetes service that simplifies deploying, managing, and scaling containerized applications using Kubernetes on Azure. AKS reduces the complexity and operational overhead of managing Kubernetes by offloading much of that responsibility to Azure. As a hosted Kubernetes service, Azure handles critical tasks like health monitoring and maintenance, while you focus on your application workloads.

## Why Azure Files for Azure Kubernetes Service?

Azure Files is an ideal storage solution for AKS workloads due to several advantages:

### Persistent shared storage

Unlike local storage that's tied to individual nodes, Azure Files provides persistent storage that survives pod restarts, node failures, and cluster scaling events. Multiple pods across different nodes can simultaneously access the same file share, enabling shared data scenarios and stateful applications.

### Kubernetes native integration

Azure Files integrates seamlessly with Kubernetes through the Container Storage Interface (CSI) driver, allowing you to provision and manage file shares using standard Kubernetes constructs like PersistentVolumes (PV) and PersistentVolumeClaims (PVC). The CSI driver handles all the complexity of Azure API interactions, authentication, and mount operations, providing a native Kubernetes experience for storage management.

### Multiple performance tiers

Azure Files offers multiple performance tiers to match your workload requirements:

- **HDD (Standard)**: Cost-effective for general-purpose workloads
- **SSD (Premium)**: High-performance SSD-backed storage for I/O intensive applications
- **Transaction optimized**: Optimized for workloads with high transaction rates

### Protocol support

Support for both NFS and SMB protocols ensures compatibility with a wide range of applications and operating systems, including Linux and Windows containers.

### Security and compliance

Azure Files provides enterprise-grade security features including encryption at rest, encryption in transit, Microsoft Entra ID integration, and compliance with industry standards.

## Understanding the Azure Files CSI driver

The Azure Files Container Storage Interface (CSI) driver is a critical component that enables seamless integration between Azure Files and Kubernetes clusters, including AKS. The CSI specification provides a standardized interface for storage systems to expose their capabilities to containerized workloads, and the Azure Files CSI driver implements this specification specifically for Azure Files.

### How the CSI driver works

The Azure Files CSI driver operates through several key components:

- **CSI driver pod**: Runs as a DaemonSet on each node in the AKS cluster, responsible for mounting and unmounting Azure file shares
- **CSI controller**: Manages the lifecycle of Azure Files shares, including creation, deletion, and volume expansion
- **Storage classes**: Define the parameters and policies for dynamic provisioning of Azure file shares
- **Persistent volumes (PV)**: Represent the actual Azure Files shares in Kubernetes
- **Persistent volume claims (PVC)**: User requests for storage that are bound to persistent volumes

When a pod requests storage through a PVC, the CSI driver coordinates with Azure APIs to either create a new Azure file share (dynamic provisioning) or connect to an existing share (static provisioning). The driver then mounts the share into the pod's filesystem namespace, making it accessible to applications.

### CSI driver capabilities

The Azure Files CSI driver provides several advanced capabilities:

- **Dynamic volume provisioning**: Automatically creates Azure file shares based on storage class definitions
- **Volume expansion**: Supports online expansion of existing Azure file shares
- **Snapshot support**: Enables point-in-time snapshots for backup and recovery scenarios
- **Cross-platform compatibility**: Works with both Linux and Windows node pools in AKS

### Driver installation and management

In AKS clusters, the Azure Files CSI driver is installed and managed automatically.

This YAML demonstrates the DaemonSet configuration for the Azure Files CSI driver node components, which run on every node in the AKS cluster to handle volume mounting operations:

```yaml
# Example of CSI driver components (managed automatically in AKS)
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: csi-azurefile-node
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: csi-azurefile-node
  template:
    spec:
      containers:
      - name: node-driver-registrar
        image: mcr.microsoft.com/oss/kubernetes-csi/node-driver-registrar:v2.5.0
      - name: azurefile
        image: mcr.microsoft.com/oss/kubernetes-csi/azurefile-csi:v1.18.0
        securityContext:
          privileged: true
```

## Common use cases for Azure Files with AKS

Some common use cases for Azure Files with AKS include:

- **Shared configuration and secrets management**: Azure Files enables centralized storage of configuration files, certificates, and other shared resources that multiple pods need to access. 
- **Log aggregation and centralized logging**: Azure Files can serve as a central repository for application logs, enabling log aggregation from multiple pods and providing persistent storage for log analysis tools.
- **Content management systems and media storage**: For applications that handle user-generated content, media files, or document management, Azure Files provides scalable shared storage accessible by multiple application instances.
- **Batch processing and ETL workloads**: Azure Files enables efficient data sharing between batch processing jobs, ETL pipelines, and data processing workflows where multiple pods need access to input data and output results.
- **Development and testing environments**: Shared storage for development teams to collaborate on code, share test data, and maintain consistent development environments across different pods and nodes.

### Shared configuration and secrets management

Azure Files is particularly useful for:

- **Configuration management**: Store application configuration files that need to be shared across multiple instances.
- **Certificate distribution**: Centrally manage and distribute SSL/TLS certificates.
- **Shared libraries**: Store common libraries or binaries accessed by multiple applications.

This YAML example creates a PVC for shared configuration storage and a deployment that mounts this storage across multiple pod replicas:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: config-storage
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: azurefile
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

### Log aggregation and centralized logging

Azure Files can serve as a central repository for application logs, enabling log aggregation from multiple pods and providing persistent storage for log analysis tools.

This YAML example demonstrates a DaemonSet for log collection with a shared Azure Files storage for centralized log aggregation:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: logs-storage
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: azurefile
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


## Storage classes and provisioning options

Azure Files CSI driver supports both static and dynamic provisioning through Kubernetes storage classes:

### Dynamic provisioning

With dynamic provisioning, storage is automatically created when a persistent volume claim is created.

This YAML defines a StorageClass for dynamic provisioning of premium Azure Files shares with SMB protocol and specific mount options:

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
  - dir_mode=0777
  - file_mode=0777
  - uid=0
  - gid=0
  - mfsymlinks
  - cache=strict
  - actimeo=30
```

### Static provisioning

For existing Azure Files shares, you can create persistent volumes that reference pre-created storage.

This YAML example shows how to create a Persistent Volume that references an existing Azure file share using static provisioning:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: existing-azurefile-pv
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: azurefile-csi
  csi:
    driver: file.csi.azure.com
    readOnly: false
    volumeHandle: existing-file-share-id
    volumeAttributes:
      resourceGroup: myResourceGroup
      storageAccount: mystorageaccount
      shareName: myfileshare
      protocol: smb
```


## Optimize mount options

This YAML example shows optimized mount options for Azure Files to improve performance and compatibility. However, you should configure mount options to optimize performance for your specific use case.

```yaml
mountOptions:
  - dir_mode=0755
  - file_mode=0755
  - uid=1000
  - gid=1000
  - mfsymlinks
  - cache=strict      # Use strict caching for better performance
  - actimeo=30        # Attribute cache timeout
  - nobrl             # Disable byte range locking for better performance
```

## Security best practice: use private endpoints

This YAML example demonstrates how to create Azure file storage with private endpoint configuration for enhanced security:

```yaml
# Example of using private endpoints with Azure Files
apiVersion: v1
kind: Secret
metadata:
  name: azure-secret
type: Opaque
data:
  azurestorageaccountname: <base64-encoded-account-name>
  azurestorageaccountkey: <base64-encoded-account-key>
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azurefile-csi-private
provisioner: file.csi.azure.com
parameters:
  skuName: Premium_LRS
  protocol: smb
  networkEndpointType: privateEndpoint
```

