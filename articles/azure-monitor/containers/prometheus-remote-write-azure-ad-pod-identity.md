---
title: Set up remote write for Prometheus by using Microsoft Entra pod-managed identity 
description: Learn how to set up remote write for Azure Monitor managed service for Prometheus by using a Microsoft Entra pod-managed identity (preview) 
author: EdB-MSFT
ms.author: edbaynash
ms.topic: conceptual
ms.date: 05/11/2023
ms.reviewer: rapadman
---

# Set up remote write for Azure Monitor managed service for Prometheus by using Microsoft Entra pod-managed identity (preview) authentication

> [!NOTE]
> The remote write sidecar container should be set up only by using the following steps, and only if the Azure Kubernetes Service (AKS) cluster already has the Microsoft Entra pod turned on. This approach is not recommended because Microsoft Entra pod-managed identities have been deprecated to be replaced by [Microsoft Entra Workload ID](/azure/active-directory/workload-identities/workload-identities-overview).

## Prerequisites

See the prerequisites that are listed at [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#prerequisites).

## Set up an application to use Microsoft Entra pod-managed identity authentication for Prometheus remote write

The process to set up Prometheus remote write for an application by using Microsoft Entra pod-managed identity authentication involves completing the following tasks:

1. Register a user-assigned managed identity with Microsoft Entra ID.
1. Assign the Managed Identity Operator and Virtual Machine Contributor roles to the managed identity.
1. Assign the Monitoring Metrics Publisher role to the user-assigned managed identity.
1. Create an Azure identity binding.
1. Add the aadpodidbinding label to the Prometheus pod.
1. Deploy a sidecar container to set up remote write on the Prometheus cluster.

The tasks are described in the following sections.

### Register a user-assigned managed identity with Microsoft Entra ID

Create a user-assigned managed identity or register an existing user-assigned managed identity.

For information about creating a managed identity, see [Set up remote write for Azure Monitor managed service for Prometheus by using managed identity authentication](./prometheus-remote-write-managed-identity.md#get-the-client-id-of-the-user-assigned-managed-identity).

### Assign the Managed Identity Operator and Virtual Machine Contributor roles to the managed identity

```azurecli
az role assignment create --role "Managed Identity Operator" --assignee <managed identity clientID> --scope <NodeResourceGroupResourceId> 
          
az role assignment create --role "Virtual Machine Contributor" --assignee <managed identity clientID> --scope <Node ResourceGroup Id> 
```  

The node resource group of the AKS cluster contains resources that you use in other steps in this process. This resource group has the name `MC_<AKS-RESOURCE-GROUP>_<AKS-CLUSTER-NAME>_<REGION>`. You can find the resource group name by using the **Resource groups** menu in the Azure portal.

### Assign the Monitoring Metrics Publisher role to the user-assigned managed identity

```azurecli
az role assignment create --role "Monitoring Metrics Publisher" --assignee <managed identity clientID> --scope <NodeResourceGroupResourceId> 
```

### Create an Azure identity binding

The user-assigned managed identity requires an identity binding for the identity to be used as a pod-managed identity.

Copy the following YAML to the *aadpodidentitybinding.yaml* file:

```yaml

apiVersion: "aadpodidentity.k8s.io/v1" 

kind: AzureIdentityBinding 
metadata: 
name: demo1-azure-identity-binding 
spec: 
AzureIdentity: “<AzureIdentityName>” 
Selector: “<AzureIdentityBindingSelector>” 
```

Run the following command:

```azurecli
kubectl create -f aadpodidentitybinding.yaml 
```

### Add the aadpodidbinding label to the Prometheus pod

The `aadpodidbinding` label must be added to the Prometheus pod for the pod-managed identity to take effect. You can add the label by updating the *deployment.yaml* file or by injecting labels when you deploy the sidecar container as described in the next section.

### Deploy a sidecar container to set up remote write on the Prometheus cluster

1. Copy the following YAML and save it to a file. The YAML uses port 8081 as the listening port. If you use a different port, modify that value in the YAML.

   [!INCLUDE[pod-identity-yaml](../includes/prometheus-sidecar-remote-write-pod-identity-yaml.md)]

1. Use Helm to apply the YAML file and update your Prometheus configuration:  

   ```azurecli
   # set the context to your cluster 
   az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
   # use Helm to update your remote write config 
   helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack --namespace <namespace where Prometheus pod resides>
   ```

## Verification and troubleshooting

For verification and troubleshooting information, see [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#verify-remote-write-is-working-correctly).

## Related content

- [Collect Prometheus metrics from an AKS cluster](../containers/kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)
- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md)
- [Remote write in Azure Monitor managed service for Prometheus](prometheus-remote-write.md)
- [Set up remote write in Azure Monitor managed service for Prometheus by using Microsoft Entra authentication](./prometheus-remote-write-active-directory.md)
- [Set up remote write for Azure Monitor managed service for Prometheus by using managed identity authentication](./prometheus-remote-write-managed-identity.md)
- [Set up remote write for Azure Monitor managed service for Prometheus by using Microsoft Entra Workload ID (preview) authentication](./prometheus-remote-write-azure-workload-identity.md)
