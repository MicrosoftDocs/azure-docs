---
title: Use availability zones in Azure Kubernetes Service (AKS)
description: Learn how to create a cluster that distributes nodes across availability zones in Azure Kubernetes Service (AKS)
ms.custom: fasttrack-edit, references_regions, devx-track-azurecli
ms.topic: article
ms.date: 12/06/2023
author: schaffererin
ms.author: schaffererin
---

# Create an Azure Kubernetes Service (AKS) cluster that uses availability zones

This article shows you how to create an AKS cluster and distribute the node components across availability zones.

## Before you begin

* You need the Azure CLI version 2.0.76 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Read the [overview of availability zones in AKS](./availability-zones-overview.md) to understand the benefits and limitations of using availability zones in AKS.

## Azure Resource Manager templates and availability zones

Keep the following details in mind when creating an AKS cluster with availability zones using an Azure Resource Manager template:

* If you explicitly define a [null value in a template][arm-template-null], for example, `"availabilityZones": null`, the template treats the property as if it doesn't exist. This means your cluster doesn't deploy in an availability zone.
* If you don't include the `"availabilityZones":` property in the template, your cluster doesn't deploy in an availability zone.
* You can't update settings for availability zones on an existing cluster, as the behavior is different when you update an AKS cluster with Azure Resource Manager templates. If you explicitly set a null value in your template for availability zones and *update* your cluster, it doesn't update your cluster for availability zones. However, if you omit the availability zones property with syntax such as `"availabilityZones": []`, the deployment attempts to disable availability zones on your existing AKS cluster and **fails**.

## Create an AKS cluster across availability zones

When you create a cluster using the [`az aks create`][az-aks-create] command, the `--zones` parameter specifies the availability zones to deploy agent nodes into. The availability zones that the managed control plane components are deployed into are **not** controlled by this parameter. They are automatically spread across all availability zones (if present) in the region during cluster deployment.

The following example commands show how to create a resource group and an AKS cluster with a total of three nodes. One agent node in zone *1*, one in *2*, and then one in *3*.

1. Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

2. Create an AKS cluster using the [`az aks create`][az-aks-create] command with the `--zones` parameter.

    ```azurecli-interactive
    az aks create \
        --resource-group $RESOURCE_GROUP \
        --name $CLUSTER_NAME \
        --generate-ssh-keys \
        --vm-set-type VirtualMachineScaleSets \
        --load-balancer-sku standard \
        --node-count 3 \
        --zones 1 2 3
    ```

    It takes a few minutes to create the AKS cluster.
    
    When deciding what zone a new node should belong to, a specified AKS node pool uses a [best effort zone balancing offered by underlying Azure Virtual Machine Scale Sets][vmss-zone-balancing]. The AKS node pool is "balanced" when each zone has the same number of VMs or +\- one VM in all other zones for the scale set.

## Verify node distribution across zones

When the cluster is ready, list what availability zone the agent nodes in the scale set are in.

1. Get the AKS cluster credentials using the [`az aks get-credentials`][az-aks-get-credentials] command:

    ```azurecli-interactive
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME
    ```

2. List the nodes in the cluster using the [`kubectl describe`][kubectl-describe] command and filter on the `topology.kubernetes.io/zone` value.

    ```bash
    kubectl describe nodes | grep -e "Name:" -e "topology.kubernetes.io/zone"
    ```

    The following example output shows the three nodes distributed across the specified region and availability zones, such as *eastus2-1* for the first availability zone and *eastus2-2* for the second availability zone:
    
    ```output
    Name:       aks-nodepool1-28993262-vmss000000
                topology.kubernetes.io/zone=eastus2-1
    Name:       aks-nodepool1-28993262-vmss000001
                topology.kubernetes.io/zone=eastus2-2
    Name:       aks-nodepool1-28993262-vmss000002
                topology.kubernetes.io/zone=eastus2-3
    ```

As you add more nodes to an agent pool, the Azure platform automatically distributes the underlying VMs across the specified availability zones.

With Kubernetes versions 1.17.0 and later, AKS uses the `topology.kubernetes.io/zone` label and the deprecated `failure-domain.beta.kubernetes.io/zone`. You can get the same result from running the `kubectl describe nodes` command in the previous example using the following command:

```bash
kubectl get nodes -o custom-columns=NAME:'{.metadata.name}',REGION:'{.metadata.labels.topology\.kubernetes\.io/region}',ZONE:'{metadata.labels.topology\.kubernetes\.io/zone}'
```

The following example resembles the output with more verbose details:

```output
NAME                                REGION   ZONE
aks-nodepool1-34917322-vmss000000   eastus   eastus-1
aks-nodepool1-34917322-vmss000001   eastus   eastus-2
aks-nodepool1-34917322-vmss000002   eastus   eastus-3
```

## Verify pod distribution across zones

As documented in [Well-Known Labels, Annotations and Taints][kubectl-well_known_labels], Kubernetes uses the `topology.kubernetes.io/zone` label to automatically distribute pods in a replication controller or service across the different zones available. In this example, you test the label and scale your cluster from *3* to *5* nodes to verify the pod correctly spreads.

1. Scale your AKS cluster from *3* to *5* nodes using the [`az aks scale`][az-aks-scale] command with the `--node-count` set to `5`.

    ```azurecli-interactive
    az aks scale \
        --resource-group $RESOURCE_GROUP \
        --name $CLUSTER_NAME \
        --node-count 5
    ```

2. When the scale operation completes, verify the pod distribution across the zones using the following [`kubectl describe`][kubectl-describe] command: 

    ```bash
    kubectl describe nodes | grep -e "Name:" -e "topology.kubernetes.io/zone"
    ```

    The following example output shows the five nodes distributed across the specified region and availability zones, such as *eastus2-1* for the first availability zone and *eastus2-2* for the second availability zone:

    ```output
    Name:       aks-nodepool1-28993262-vmss000000
                topology.kubernetes.io/zone=eastus2-1
    Name:       aks-nodepool1-28993262-vmss000001
                topology.kubernetes.io/zone=eastus2-2
    Name:       aks-nodepool1-28993262-vmss000002
                topology.kubernetes.io/zone=eastus2-3
    Name:       aks-nodepool1-28993262-vmss000003
                topology.kubernetes.io/zone=eastus2-1
    Name:       aks-nodepool1-28993262-vmss000004
                topology.kubernetes.io/zone=eastus2-2
    ```

3. Deploy an NGINX application with three replicas using the following `kubectl create deployment` and `kubectl scale` commands:

    ```bash
    kubectl create deployment nginx --image=mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
    kubectl scale deployment nginx --replicas=3
    ```

4. Verify the pod distribution across the zones using the following [`kubectl describe`][kubectl-describe] command:

    ```bash
    kubectl describe pod | grep -e "^Name:" -e "^Node:"
    ```

    The following example output shows the three pods distributed across the specified region and availability zones, such as *eastus2-1* for the first availability zone and *eastus2-2* for the second availability zone:

    ```output
    Name:         nginx-6db489d4b7-ktdwg
    Node:         aks-nodepool1-28993262-vmss000000/10.240.0.4
    Name:         nginx-6db489d4b7-v7zvj
    Node:         aks-nodepool1-28993262-vmss000002/10.240.0.6
    Name:         nginx-6db489d4b7-xz6wj
    Node:         aks-nodepool1-28993262-vmss000004/10.240.0.8
    ```

    As you can see from the previous output, the first pod is running on node 0 located in the availability zone `eastus2-1`. The second pod is running on node 2, corresponding to `eastus2-3`, and the third one in node 4, in `eastus2-2`. Without any extra configuration, Kubernetes spreads the pods correctly across all three availability zones.
    
## Next steps

This article described how to create an AKS cluster using availability zones. For more considerations on highly available clusters, see [Best practices for business continuity and disaster recovery in AKS][best-practices-bc-dr].

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[best-practices-bc-dr]: operator-best-practices-multi-region.md
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[vmss-zone-balancing]: ../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-balancing
[arm-template-null]: ../azure-resource-manager/templates/template-expressions.md#null-values
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-scale]: /cli/azure/aks#az-aks-scale

<!-- LINKS - external -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-well_known_labels]: https://kubernetes.io/docs/reference/labels-annotations-taints/

