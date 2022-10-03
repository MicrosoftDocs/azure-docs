---
title: "Propagate Kubernetes configurations from an Azure Kubernetes Fleet Manager resource to member clusters (preview)"
description: Learn how to control how Kubernetes configurations get propagated to all or a subset of member clusters of an Azure Kubernetes Fleet Manager resource.
ms.topic: how-to
ms.date: 09/09/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
---

# Propagate Kubernetes configurations from an Azure Kubernetes Fleet Manager resource to member clusters (preview)

Platform admins and application developers need a way to deploy the same to deploy the same Kubernetes resource objects (like ClusterRoles, ClusterRoleBindings, Namespaces, Deployments) across all member clusters or just a subset of member clusters of the fleet. Kubernetes Fleet Manager (Fleet) provides `ClusterResourcePlacement` as a mechanism to control how cluster-scoped Kubernetes resources are propagated to member clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

* You have a Fleet resource with one or more member clusters. If not, follow the [quickstart](quickstart-create-fleet-and-members.md) to create a Fleet resource and join Azure Kubernetes Service (AKS) clusters as members.

## Resource selection

The `ClusterResourcePlacement` custom resource is used to select which cluster-scoped Kubernetes resource objects need to be propagated from the fleet cluster and to select which member clusters to propagate these objects to. It supports the following forms of resource selection:

* Select all the clusters by specifying empty policy under `ClusterResourcePlacement`
* Select clusters by listing names of `MemberCluster` custom resources
* Select clusters using cluster selectors to match labels present on `MemberCluster` custom resources

> [!NOTE]
> `ClusterResourcePlacement` can be used to select and propagate namespaces, which are cluster-scoped resources. All namespace-scoped objects created on the fleet cluster within these namespaces are also propagated from the fleet cluster to member clusters where this namespace was propagated by the `ClusterResourcePlacement`. 


An example of selecting a resource by label is given below.

1. Create a sample namespace by running the following command:

    ```bash
    kubectl create namespace hello-world
    ```

1. Create the following `ClusterResourcePlacement` in a file called `crp.yaml`. Notice we're selecting clusters in the `westcentralus` region:

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
                    fleet.azure.com/location: westcentralus
    ```

> [!TIP]
> The above example propagates `hello-world` namespace to only those member clusters that are from the `westcentralus` region. If your desired target clusters are from a different region, you can substitute `westcentralus` for that region instead.


1. Apply the `ClusterResourcePlacement`:

    ```bash
    kubectl apply -f crp.yaml
    ```

1. Check the status of the `ClusterResourcePlacement`:

    If successful, the output will look similar to the following example:

    ```console
    NAME          GEN   SCHEDULED   SCHEDULEDGEN   APPLIED   APPLIEDGEN   AGE
    hello-world   1     True        1              True      1            23m
    ```

1. On each member cluster in the `westcetralus` region, you can verify that the namespace has been propagated:

    ```console
    kubectl get namespace hello-world
    ```

    > [!TIP]
    > The above steps describe an example using one way of selecting the resources to be propagated using labels and cluster selectors. More methods and their examples can be found in this [sample repository](https://github.com/Azure/AKS/tree/master/examples/fleet/helloworld).

## Target cluster selection

The `ClusterResourcePlacement` custom resource can also be used to limit propagation of selected resources to a specific subset of member clusters. The following forms of target cluster selection are supported:

* Specify a list of cluster names, where the cluster names must match `MemberCluster` custom resource names
* Specify label(s) via `PlacementPolicy` -> `Affinity` -> `ClusterAffinity` -> `ClusterSelectorTerm` -> `LabelSelector` to choose clusters. If multiple labels are present, then the labels are evaluated via the `OR` method to select clusters.

An example of targeting a specific cluster by name is given below:

1. Create a sample namespace by running the following command:

    ```bash
    kubectl create namespace hello-world
    ```

1. Create the following `ClusterResourcePlacement` in a file named `crp.yaml`:


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
          clusterNames:
            - member-1
    ```

    Apply this `ClusterResourcePlacement` to the cluster:

    ```bash
    kubectl apply -f crp.yaml
    ```

1. Check the status of the `ClusterResourcePlacement`:

    If successful, the output will look similar to the following example:

    ```console
    NAME          GEN   SCHEDULED   SCHEDULEDGEN   APPLIED   APPLIEDGEN   AGE
    hello-world   1     True        1              True      1            23m
    ```

1. On `member-1` AKS cluster, run the following command to see if the namespace has been propagated:

      ```bash
      kubectl get namespace hello-world
      ```

  You'll observe that the namespace has been propagated only to `member-1` cluster, but not the other clusters.


> [!TIP]
> The above steps gave an example of one method of identifying the target clusters specifically by name. More methods and their examples can be found in this [sample repository](https://github.com/Azure/AKS/tree/master/examples/fleet/helloworld).

## Next steps

* [Set up multi-cluster Layer 4 load balancing](./l4-load-balancing.md)