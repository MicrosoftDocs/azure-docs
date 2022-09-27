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

Platform admins and application developers need a way to deploy the same workload across all member clusters or just a subset of member clusters of the fleet. Kubernetes Fleet Manager (Fleet) provides `ClusterResourcePlacement` as a mechanism to control how cluster-scoped Kubernetes resources are propagated to member clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

* You have a Fleet resource with one or more member clusters. If not, follow the [quickstart](quickstart-create-fleet-and-members.md) to create a Fleet resource and join Azure Kubernetes Service (AKS) clusters as members.

## Resource selection

The `ClusterResourcePlacement` custom resource, which is used to select which Kubernetes configurations need to be propagated, supports the following forms of resource selection:

* Select resources by specifying just the *<group, version, kind>*. This selection propagates all resources with matching *<group, version, kind>*.
* Select resources by specifying the *<group, version, kind>* and name. This selection propagates only one resource that matches the *<group, version, kind>* and name.
* Select resources by specifying the *<group, version, kind>* and specify a set of labels using `ClusterResourcePlacement` -> `LabelSelector`. This selection propagates all resources that match the *<group, version, kind>* and label specified. If multiple labels are specified, then they're evaluated in `OR` format.
* Select resources by specifying the *<group, version, kind>*, name, and a list of label selectors. This selection propagates only one resource with matching *<group, version, kind>*, name, and labels.

An example of selecting a resource by label is given below.

1. Create a sample namespace by running the following command:

    ```bash
    kubectl create ns hello-world
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

1. Apply the `ClusterResourcePlacement`:

    ```bash
    kubectl apply -f crp.yaml
    ```

1. On each member cluster in the `westcetralus` region, you can verify that the namespace has been propagated:

    ```
    kubectl get namespace hello-world
    ```

    > [!TIP]
    > The above steps describe an example using one way of selecting the resources to be propagated (*<group, version, kind>* and labels). More methods and their examples can be found in this [sample repository](https://github.com/Azure/AKS/tree/2022-09-11/examples/fleet/helloworld).

## Target cluster selection

The `ClusterResourcePlacement` custom resource can also be used to limit propagation of selected resources to a specific subset of member clusters. The following forms of target cluster selection are supported:

* Specify a list of cluster names, where the cluster names must match `MemberCluster` custom resource names
* Specify label(s) via `PlacementPolicy` -> `Affinity` -> `ClusterAffinity` -> `ClusterSelectorTerm` -> `LabelSelector` to choose clusters. If multiple labels are present, then the labels are evaluated via the `OR` method to select clusters.
* Specify a list of cluster names and a list of labels to select clusters.

An example of targeting a specific cluster by name is given below:

1. Create a sample namespace by running the following command:

    ```bash
    kubectl create ns hello-world
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
            - aks-member-1
            - aks-member-3
    ```

    Apply this `ClusterResourcePlacement` to the cluster:

    ```bash
    kubectl apply -f crp.yaml
    ```

1. On each of the member clusters, run the following command to see if the namespace has been propagated:

      ```bash
      kubectl get ns hello-world
      ```

  You'll observe that the namespace has been propagated only to `cluster-a`, but not the other clusters.


> [!TIP]
> The above steps gave an example of one method of identifying the target clusters specifically by name. More methods and their examples can be found in this [sample repository](https://github.com/Azure/AKS/tree/2022-09-11/examples/fleet/helloworld).

## Next steps

* [Set up multi-cluster Layer 4 load balancing](./l4-load-balancing.md)