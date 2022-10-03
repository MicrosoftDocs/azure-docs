---
title: "How to set up multi-cluster Layer 4 load balancing across Azure Kubernetes Fleet Manager member clusters (preview)"
description: Learn how to use Azure Kubernetes Fleet Manager to set up multi-cluster Layer 4 load balancing across workloads deployed on multiple member clusters.
ms.topic: how-to
ms.date: 09/09/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
---

# Set up multi-cluster layer 4 load balancing across Azure Kubernetes Fleet Manager member clusters (preview)

After an application has been deployed across multiple clusters using the [Kubernetes configuration propagation](./configuration-propagation.md) feature of Fleet, admins often want to set up load balancing for incoming traffic across these application endpoints on member clusters.

In this how-to guide, you'll set up layer 4 load balancing across workloads deployed across a fleet's member clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

[!INCLUDE [free trial note](../../includes/quickstarts-free-trial-note.md)]

* You must have a Fleet resource with member clusters to which a workload has been deployed. If you don't have this resource, follow [Quickstart: Create a Fleet resource and join member clusters](quickstart-create-fleet-and-members.md) and [Propagate Kubernetes configurations from a Fleet resource to member clusters](configuration-propagation.md)

* These target clusters should be using [Azure CNI networking](../aks/configure-azure-cni.md).

* The target AKS clusters on which the workloads are deployed need to be present on either the same [virtual network](../virtual-network/virtual-networks-overview.md) or on [peered virtual networks](../virtual-network/virtual-network-peering-overview.md).

* These target clusters have to be [added as member clusters to the Fleet resource](./quickstart-create-fleet-and-members.md#join-member-clusters).

[!INCLUDE [preview features note](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Deploy a sample workload to demo clusters

> [!NOTE]
>
> * The steps in this how-to guide refer to a sample application for demonstration purposes only. You can substitute this workload for any of your own existing Deployment and Service objects.
>
> * These steps deploy the sample workload from the Fleet cluster to member clusters using Kubernetes configuration propagation. Alternatively, you can choose to deploy these Kubernetes configurations to each member cluster separately, one at a time.

1. Obtain `kubeconfig` for the fleet cluster:

    ```console
    export GROUP=<your_resource_group_name>
    export FLEET=<your_fleet_name>
    az fleet get-credentials --name ${FLEET}  --resource-group ${GROUP}
    ```

1. Create a namespace on the fleet cluster:

    ```console
    kubectl create namespace kuard-demo
    ```

    Output will look similar to the following example:

    ```console
    namespace/kuard-demo created
    ```

1. Apply the Deployment, Service, ServiceExport objects:

    ```console
    kubectl apply -f https://raw.githubusercontent.com/Azure/AKS/master/examples/fleet/kuard/kuard-export-service.yaml
    ```

    The `ServiceExport` specification in the above file allows you to export a service from member clusters to the Fleet resource. Once successfully exported, the service and all its endpoints will be synced to the fleet cluster and can then be used to set up multi-cluster load balancing across these endpoints. The output will look similar to the following example:

    ```console
    deployment.apps/kuard created
    service/kuard created
    serviceexport.networking.fleet.azure.com/kuard created
    ```

1. Apply a `ClusterResourcePlacement` to propagate this namespace from the fleet cluster to all member clusters:

    ```console
    kubectl apply -f https://raw.githubusercontent.com/Azure/AKS/master/examples/fleet/kuard/kuard-crp.yaml
    ```

    Output will look similar to the following example:

    ```console
    clusterresourceplacement.fleet.azure.com/kuard created
    ```



## Create MultiClusterService to load balance across the service endpoints in multiple member clusters

1. Change kubeconfig context to one of the member clusters:

    ```console
    export GROUP=<your_resource_group_name>
    export MEMBER_CLUSTER=<your_member_aks_cluster_name>
    az aks get-credentials --resource-group ${GROUP} --name ${MEMBER_CLUSTER}
    ```

1. Verify that the service is successfully exported by running the following command:

    ```console
    kubectl get serviceexport kuard --namespace kuard-demo
    ```

    Output will look similar to the following example:

    ```console
    NAME    IS-VALID   IS-CONFLICTED   AGE
    kuard   True       False           81s
    ```

    You should see that the service is valid for export (`IS-VALID` field is `true`) and has no conflicts with other exports (`IS-CONFLICT` is `false`).

    > [!NOTE]
    > It may take a minute or two for the ServiceExport to be propagated.

1. Apply the MultiClusterService to load balance across the service endpoints in multiple member clusters:

    ```console
    kubectl apply -f https://raw.githubusercontent.com/Azure/AKS/master/examples/fleet/kuard/kuard-mcs.yaml
    ```

    Output will look similar to the following example:

    ```console
    multiclusterservice.networking.fleet.azure.com/kuard created
    ```

1. Verify the MultiClusterService is valid by running the following command:

    ```console
    kubectl get multiclusterservice  kuard --namespace kuard-demo
    ```

    The output should look similar to the following example:

    ```console
    NAME    SERVICE-IMPORT   EXTERNAL-IP     IS-VALID   AGE
    kuard   kuard            <a.b.c.d>         True       40s
    ```

    The `IS-VALID` field should be `true` in the output. Check out the external load balancer IP address (`EXTERNAL-IP`) in the output. It may take a while before the import is fully processed and the IP address becomes available.

1. Run the following command multiple times using the External IP address from above:

    ```console
    curl <a.b.c.d>:8080 | grep addrs 
    ```

    Notice that the IPs of the pods serving the request is changing across and that these pods are from different member clusters of the Fleet resource.
