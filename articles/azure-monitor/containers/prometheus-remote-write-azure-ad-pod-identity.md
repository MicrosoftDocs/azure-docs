---
title: Configure remote write for Azure Monitor managed service for Prometheus using Microsoft Entra pod identity (preview) 
description: Configure remote write for Azure Monitor managed service for Prometheus using Microsoft Entra pod identity (preview) 
author: EdB-MSFT
ms.author: edbaynash
ms.topic: conceptual
ms.date: 05/11/2023
ms.reviewer: rapadman
---

# Configure remote write for Azure Monitor managed service for Prometheus using Microsoft Entra pod identity (preview) 


> [!NOTE] 
> The remote write sidecar should only be configured via the following steps only if the AKS cluster already has the Microsoft Entra pod enabled. This approach is not recommended as Microsoft Entra pod identity has been deprecated to be replace by [Azure Workload Identity](/azure/active-directory/workload-identities/workload-identities-overview)


To configure remote write for Azure Monitor managed service for Prometheus using Microsoft Entra pod identity, follow the steps below.

1. Create user assigned identity or use an existing user assigned managed identity. For information on creating the managed identity, see [Configure remote write for Azure Monitor managed service for Prometheus using managed identity authentication](./prometheus-remote-write-managed-identity.md#get-the-client-id-of-the-user-assigned-identity).
1. Assign the `Managed Identity Operator` and `Virtual Machine Contributor` roles to the managed identity created/used in the previous step.

    ```azurecli
    az role assignment create --role "Managed Identity Operator" --assignee <managed identity clientID> --scope <NodeResourceGroupResourceId> 
          
    az role assignment create --role "Virtual Machine Contributor" --assignee <managed identity clientID> --scope <Node ResourceGroup Id> 
    ```	 

    The node resource group of the AKS cluster contains resources that you will require for other steps in this process. This resource group has the name MC_\<AKS-RESOURCE-GROUP\>_\<AKS-CLUSTER-NAME\>_\<REGION\>. You can locate it from the Resource groups menu in the Azure portal.

1. Grant user-assigned managed identity `Monitoring Metrics Publisher` roles.

    ```azurecli
    az role assignment create --role "Monitoring Metrics Publisher" --assignee <managed identity clientID> --scope <NodeResourceGroupResourceId> 
    ```

1. Create AzureIdentityBinding 

    The user assigned managed identity requires identity binding in order to be used as a pod identity. Run the following commands: 
 
    Copy the following YAML to the `aadpodidentitybinding.yaml` file.

    ```yml

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
 
1. Add a `aadpodidbinding` label to the Prometheus pod.  
    The `aadpodidbinding` label must be added to the Prometheus pod for the pod identity to take effect. This can be achieved by updating the `deployment.yaml` or injecting labels while deploying the sidecar as mentioned in the next step.

1. Deploy side car and configure remote write on the Prometheus server.

      1. Copy the YAML below and save to a file.  

      [!INCLUDE[pod-identity-yaml](../includes/prometheus-sidecar-remote-write-pod-identity-yaml.md)]

      b. Use helm to apply the YAML file to update your Prometheus configuration with the following CLI commands.  
      
    ```azurecli
    # set context to your cluster 
    az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
    # use helm to update your remote write config 
    helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack --namespace <namespace where Prometheus pod resides>
    ```
## Next steps

- [Collect Prometheus metrics from an AKS cluster](../containers/prometheus-metrics-enable.md)
- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md)
- [Remote-write in Azure Monitor Managed Service for Prometheus](prometheus-remote-write.md)
- [Remote-write in Azure Monitor Managed Service for Prometheus using Microsoft Entra ID](./prometheus-remote-write-active-directory.md)
- [Configure remote write for Azure Monitor managed service for Prometheus using managed identity authentication](./prometheus-remote-write-managed-identity.md)
- [Configure remote write for Azure Monitor managed service for Prometheus using Azure Workload Identity (preview)](./prometheus-remote-write-azure-workload-identity.md)
