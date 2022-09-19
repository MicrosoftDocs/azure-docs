---
title: "Propagate Kubernetes configurations from fleet to member clusters (preview)"
description: You can use to fleet to control how Kubernetes configurations get propagated to all or a subset of member clusters of the fleet.
ms.topic: how-to
ms.date: 09/09/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
---

# Propagate Kubernetes configurations from fleet to the member clusters (preview)

Platform admins and application developers need a way to deploy the same workload across all member clusters or just a subset of member clusters of the fleet. Fleet provides ClusterResourcePlacement as a mechanism to control how cluster scoped Kubernetes resources are propagated to member clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

* You have a fleet resource with one or more member clusters. If not,  out the [quickstart](quickstart-create-fleet-and-members.md) on creating a fleet resource and joining existing AKS clusters as member clusters to the fleet resource.


## Resource selection

`ClusterResourcePlacement` custom resource, which is used to select which Kubernetes configurations need to be propagated, supports the following forms of resource selection:

1. Select resource by specifying just the <group, version, kind>. This propagates all resources with matching <group, version, kind>.
1. Select resource by specifying the <group, version, kind> and name. This propagates only one resource that matches the <group, version, kind> and name)
1. Select resource by specifying the <group, version, kind> and specify and set of labels using ClusterResourceSelector -> LabelSelector. This propagates all resources that match the <group, version, kind> and label specified. If multiple labels are specified, then they are evaluated in `OR` format.
Select resource by specifying the <group, version, kind>, name and list of label selectors. This propagates only one resource with matching <group, version, kind>, name & labels.

An example of selecting resource by label is given below. :

1. Create a sample namespace by running the following command:

  ```bash
  kubectl create ns hello-world
  ```

1. Apply the following `ClusterResourcePlacement` by running this command:

  ```bash
  kubectl apply -f crp.yaml
  ```

  Contents of `crp.yaml`:

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

1. On each member cluster in `westcetralus` region, you can verify that the namespace has been propagated:

    ```
    kubectl get namespace hello-world
    ```

    > [!INFO]
    > While the above steps gave an example of one way of selecting the resources to be propagated (<group, version, kind> and labels), more ways and their examples can be found [here](https://github.com/Azure/AKS/tree/2022-09-11/examples/fleet/helloworld).

## Target cluster selection

`ClusterResourcePlacement` custom resource can be used to limit propagation of the selected resources to a specific subset of member clusters as the target. The following forms of target cluster selection are supported:

1. Specify a list of cluster names, where the cluster names must match `MemberCluster` custom resource names
1. Specify label(s) PlacementPolicy -> Affinity -> ClusterAffinity -> ClusterSelectorTerm -> LabelSelector to choose clusters. If multiple labels are present, then the labels are evaluated in `OR` method to select clusters.
1. Specify a list of cluster names and also specify list of labels to select clusters


An example of targeting a specific cluster by name is given below :

1. Create a sample namespace by running the following command:

  ```bash
  kubectl create ns hello-world
  ```

1. Apply the following `ClusterResourcePlacement` by running this command:

  ```bash
  kubectl apply -f crp.yaml
  ```

  where contents of `crp.yaml`:

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

1. On each of the member cluster, run the following command to see if the ClusterRole has been propagated:

    ```
    kubectl get ns hello-world
    ```

  You'll observe that the namespace has been propagated only to `cluster-a`, but not the other clusters.


While the above steps gave an example of one way of identifying the target clusters specifically by name, more ways and their examples can be found [here](https://github.com/Azure/AKS/tree/2022-09-11/examples/fleet/helloworld).

## Next steps

* [Set up multi-cluster Layer 4 load balancing](./l4-load-balancing.md)