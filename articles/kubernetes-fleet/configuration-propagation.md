---
title: "Propagate Kubernetes resource objects from an Azure Kubernetes Fleet Manager resource to member clusters (preview)"
description: Learn how to control how Kubernetes resource objects get propagated to all or a subset of member clusters of an Azure Kubernetes Fleet Manager resource.
ms.topic: how-to
ms.date: 09/09/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: ignite-2022
---

# Propagate Kubernetes resource objects from an Azure Kubernetes Fleet Manager resource to member clusters (preview)

Platform admins and application developers need a way to deploy the same Kubernetes resource objects across all member clusters or just a subset of member clusters of the fleet. Kubernetes Fleet Manager (Fleet) provides `ClusterResourcePlacement` as a mechanism to control how cluster-scoped Kubernetes resources are propagated to member clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

* You have a Fleet resource with one or more member clusters. If not, follow the [quickstart](quickstart-create-fleet-and-members.md) to create a Fleet resource and join Azure Kubernetes Service (AKS) clusters as members.

* Set the following environment variables and obtain the kubeconfigs for the fleet and all member clusters:

    ```bash
    export GROUP=<resource-group>
    export FLEET=<fleet-name>
    export MEMBER_CLUSTER_1=aks-member-1
    export MEMBER_CLUSTER_2=aks-member-2
    export MEMBER_CLUSTER_3=aks-member-3

    az fleet get-credentials --resource-group ${GROUP} --name ${FLEET} --file fleet

    az aks get-credentials --resource-group ${GROUP} --name ${MEMBER_CLUSTER_1} --file aks-member-1

    az aks get-credentials --resource-group ${GROUP} --name ${MEMBER_CLUSTER_2} --file aks-member-2

    az aks get-credentials --resource-group ${GROUP} --name ${MEMBER_CLUSTER_3} --file aks-member-3
    ```

* Follow the [conceptual overview of this feature](./architectural-overview.md#kubernetes-resource-propagation), which provides an explanation of resource selection, target cluster selection, and the allowed inputs.

## Resource selection

1. Create a sample namespace by running the following command on the fleet cluster:

    ```bash
    KUBECONFIG=fleet kubectl create namespace hello-world
    ```

1. Create the following `ClusterResourcePlacement` in a file called `crp.yaml`. Notice we're selecting clusters in the `eastus` region:

    ```yaml
    apiVersion: fleet.azure.com/v1alpha1
    kind: ClusterResourcePlacement
    metadata:
      name: hello-world
    spec:
      resourceSelectors:
        - group: ""
          version: v1
          kind: Namespace
          name: hello-world
      policy:
        affinity:
          clusterAffinity:
            clusterSelectorTerms:
              - labelSelector:
                  matchLabels:
                    fleet.azure.com/location: eastus
    ```

    > [!TIP]
    > The above example propagates `hello-world` namespace to only those member clusters that are from the `eastus` region. If your desired target clusters are from a different region, you can substitute `eastus` for that region instead.


1. Apply the `ClusterResourcePlacement`:

    ```bash
    KUBECONFIG=fleet kubectl apply -f crp.yaml
    ```

    If successful, the output will look similar to the following example:

    ```console
    clusterresourceplacement.fleet.azure.com/hello-world created
    ```

1. Check the status of the `ClusterResourcePlacement`:

    ```bash
    KUBECONFIG=fleet kubectl get clusterresourceplacements
    ```

    If successful, the output will look similar to the following example:

    ```console
    NAME          GEN   SCHEDULED   SCHEDULEDGEN   APPLIED   APPLIEDGEN   AGE
    hello-world   1     True        1              True      1            16s
    ```

1. On each member cluster, check if the namespace has been propagated:

    ```bash
    KUBECONFIG=aks-member-1 kubectl get namespace hello-world
    ```

    The output will look similar to the following example:

    ```console
    NAME          STATUS   AGE
    hello-world   Active   96s
    ```

    ```bash
    KUBECONFIG=aks-member-2 kubectl get namespace hello-world
    ```

    The output will look similar to the following example:

    ```console
    NAME          STATUS   AGE
    hello-world   Active   1m16s
    ```

    ```bash
    KUBECONFIG=aks-member-3 kubectl get namespace hello-world
    ```

    The output will look similar to the following example:

    ```console
    Error from server (NotFound): namespaces "hello-world" not found
    ```

    We observe that the `ClusterResourcePlacement` has resulted in the namespace being propagated only to clusters of `eastus` region and not to `aks-member-3` cluster from `westcentralus` region.

    > [!TIP]
    > The above steps describe an example using one way of selecting the resources to be propagated using labels and cluster selectors. More methods and their examples can be found in this [sample repository](https://github.com/Azure/AKS/tree/master/examples/fleet/helloworld).

## Target cluster selection

1. Create a sample namespace by running the following command:

    ```bash
    KUBECONFIG=fleet kubectl create namespace hello-world-1
    ```

1. Create the following `ClusterResourcePlacement` in a file named `crp-1.yaml`:


    ```yaml
    apiVersion: fleet.azure.com/v1alpha1
    kind: ClusterResourcePlacement
    metadata:
      name: hello-world-1
    spec:
      resourceSelectors:
        - group: ""
          version: v1
          kind: Namespace
          name: hello-world-1
      policy:
        clusterNames:
          - aks-member-1
    ```

    Apply this `ClusterResourcePlacement` to the cluster:

    ```bash
    KUBECONFIG=fleet kubectl apply -f crp-1.yaml
    ```

1. Check the status of the `ClusterResourcePlacement`:


    ```bash
    KUBECONFIG=fleet kubectl get clusterresourceplacements
    ```

    If successful, the output will look similar to the following example:

    ```console
    NAME            GEN   SCHEDULED   SCHEDULEDGEN   APPLIED   APPLIEDGEN   AGE
    hello-world-1   1     True        1              True      1            18s
    ```

1. On each AKS cluster, run the following command to see if the namespace has been propagated:

    ```bash
    KUBECONFIG=aks-member-1 kubectl get namespace hello-world-1
    ```

    The output will look similar to the following example:

    ```console
    NAME            STATUS   AGE
    hello-world-1   Active   70s
    ```

    ```bash
    KUBECONFIG=aks-member-2 kubectl get namespace hello-world-1
    ```

    The output will look similar to the following example:

    ```console
    Error from server (NotFound): namespaces "hello-world-1" not found
    ```

    ```bash
    KUBECONFIG=aks-member-3 kubectl get namespace hello-world-1
    ```

    The output will look similar to the following example:

    ```console
    Error from server (NotFound): namespaces "hello-world-1" not found
    ```

  We're able to verify that the namespace has been propagated only to `aks-member-1` cluster, but not the other clusters.


> [!TIP]
> The above steps gave an example of one method of identifying the target clusters specifically by name. More methods and their examples can be found in this [sample repository](https://github.com/Azure/AKS/tree/master/examples/fleet/helloworld).

## Next steps

* [Set up multi-cluster Layer 4 load balancing](./l4-load-balancing.md)
