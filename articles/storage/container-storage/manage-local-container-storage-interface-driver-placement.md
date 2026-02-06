---
title: Manage Local CSI driver placement in Azure Container Storage
description: Manage local CSI driver placement through node affinity configuration in the local NVMe storage class.
author: fhryo-msft
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 2/5/2026
ms.author: fryu
## Customer Intent: As a Kubernetes administrator, I want to manage local CSI driver placement through node affinity configuration in the local NVMe storage class.
---

# Manage local CSI driver placement with node affinity

In Kubernetes clusters, CSI drivers are typically deployed as DaemonSets, running on all nodes by default. However, in production environments, certain nodes may be equipped with specialized hardware (such as local NVMe disks), specific instance types, or designated roles that make them more suitable for particular storage workloads.

Azure Container Storage uses the local CSI driver to manage local NVMe volumes. By configuring node affinity in the local NVMe storage class, you can control the placement of local CSI drivers to ensure they run only on nodes that meet the designed conditions. This approach helps optimize resource utilization and minimizes the impact on other nodes in the cluster.

## When to consider managing local CSI driver placement

Managing the placement of local CSI drivers is essential in the following scenarios:

- Scenario 1: Mixed node pools with different capabilities. Clusters often contain multiple node pools with different instance types. Without node affinity, local CSI driver pods might be scheduled onto nodes that don't have local NVMe disks and can't successfully service storage requests.

- Scenario 2: Mixed node pools for distinct workloads. In large clusters, it's common to have multiple node pools, each tailored for specific types of workloads. Without node affinity, local CSI driver pods might be scheduled on node pools that aren’t meant to use local NVMe disks, even if those disks are configured.

## Node affinity via StorageClass annotations

The Local CSI driver placement mechanism uses:

- [Kubernetes nodeAffinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity). The `preferredDuringSchedulingIgnoredDuringExecution` option isn't supported.
- Storage class annotations to express placement requirements
- Only creation or modification of storage classes triggers nodeAffinity recomputation

You can define a nodeAffinity rule for a local NVMe StorageClass using the `storageoperator.acstor.io/nodeAffinity` annotation. These rules ensure that local CSI driver pods are scheduled only on nodes that meet the specified criteria. If no nodeAffinity rule is defined, local CSI driver pods are deployed across all nodes in the cluster by default.

## Ensure local CSI drivers are placed on nodes with local NVMe disks

To ensure that local CSI drivers are deployed only on nodes equipped with local NVMe disks, you can configure node affinity based on instance type. The following example shows a StorageClass configuration:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-nvme
  annotations:
    storageoperator.acstor.io/nodeAffinity: |
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: node.kubernetes.io/instance-type
            operator: In
            values: [standard_l8s_v3, Standard_L16s_v3]
provisioner: localdisk.csi.acstor.io
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
EOF
```

Match expressions are case-sensitive. We recommend verifying the actual instance type values on your nodes before configuring node affinity. Use the following command to validate:

```bash
$ kubectl get nodes -o custom-columns="NAME:.metadata.name,INSTANCE-TYPE:.metadata.labels.node\.kubernetes\.io/instance-type"
NAME                            INSTANCE-TYPE
aks-mycpu-32605643-vmss000000   Standard_D4ds_v5
aks-mygpu-23116656-vmss000000   standard_l8s_v3
aks-mygpu2-37383660-vmss000000  Standard_L16s_v3
```

## Ensure local CSI drivers are placed in specific node pools

You can ensure that local CSI drivers are deployed only in selected node pools by configuring node affinity based on the `agentpool` label. The following example shows a StorageClass configuration:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-nvme
  annotations:
    storageoperator.acstor.io/nodeAffinity: |
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.azure.com/agentpool
            operator: In
            values: [mygpu,mygpu2]
provisioner: localdisk.csi.acstor.io
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
EOF
```

Match expressions are case-sensitive. We recommend verifying the actual node pool names on your nodes before configuring node affinity. Use the following command to validate:

```bash
$ kubectl get nodes -o custom-columns="NAME:.metadata.name,AGENTPOOL:.metadata.labels.kubernetes\.azure\.com/agentpool"
NAME                            AGENTPOOL
aks-mycpu-32605643-vmss000000   mycpu
aks-mygpu-23116656-vmss000000   mygpu
aks-mygpu2-37383660-vmss000000  mygpu2
```

## Best practices

- Always label nodes explicitly before using node affinity.
- Keep StorageClasses consistent and avoid mixing annotated and nonannotated classes unless intentional.
- Use multiple nodeSelectorTerms to express OR‑style placement.
- Validate node labels before deploying StorageClasses.
- Learn more capabilities in [Kubernetes nodeAffinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/).

## See also

- [What is Azure Container Storage?](./container-storage-introduction.md)
- [Install Azure Container Storage with AKS](./install-container-storage-aks.md)
- [Use Azure Container Storage with local NVMe](./use-container-storage-with-local-disk.md)
- [Best practices for ephemeral NVMe data disks in Azure Kubernetes Service (AKS)](/azure/aks/best-practices-storage-nvme)
