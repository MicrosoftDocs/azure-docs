---
title: Bring your own Network Security Group to Azure Red Hat OpenShift
description: In this article, learn how to bring your own Network Security Group (NSG) to an Azure Red Hat OpenShift cluster.
author: johnmarco
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.author: johnmarc
ms.date: 02/12/2024
topic: how-to
recommendations: true
keywords: azure, openshift, aro, NSG
#Customer intent: I need to attach my own Network Security Group to an ARO cluster before beginning cluster installation.
---

# Bring your own Network Security Group (NSG) to an ARO cluster

In this article you'll learn how to use the "bring your own" Network Security Group (NSG) feature to attach your own NSG residing in the Base/VNET RG (as shown in the diagram below) to the ARO cluster subnets. Since you own this NSG, you'll be able to add/remove rules during the lifetime of the ARO cluster.

:::image type="content" source="media/howto-bring-nsg/network-security-group-new.png" alt-text="Diagram showing an overview of how the bring your own network security group works in Azure Red Hat OpenShift.":::

<!--

To create an ARO cluster, you need to specify a resource group (RG) where the ARO cluster object will be deployed (Base Resource Group in diagram below). You can use the same RG for the VNET that will be used by the cluster, or you can use a dedicated VNET RG for the VNET. Neither of those RGs has a 1:1 mapping to an ARO cluster, and you have full control over these RGs (i.e., you can create/modify/delete resources inside those RGs).

During the cluster creation process, the ARO Resource Provider (RP) creates a cluster-specific RG used to hold various cluster-specific resources such as node VMs, load balancers, and NSG (see Managed Resource Group in the diagram below). The Managed Resource Group is locked down; you cannot modify any resource inside it, including the NSG that the ARO RP attaches to the VNET subnets specified during cluster creation. The ARO RP created NSG may not comply with the security policies in some organizations, and up until now there was no way to modify it to achieve compliance.

:::image type="content" source="media/howto-bring-nsg/network-security-group-overview.png" alt-text="Diagram showing an overview of how network security groups are normally used in Azure Red Hat OpenShift.":::

-->


## Capabilities and limitations

1. You need to attach your pre-configured NSGs to both master and worker subnets before you create the cluster. Failure to attached your pre-configured NSGs to both subnets will result in an error. 

1. You can choose to use the same or different pre-configured NSGs for master and worker subnets.

1. When using your own NSG, the ARO RP still creates an NSG in the Managed RG (default NSG), but that NSG won't be attached to the worker or master subnets.

1. Pre-configured NSGs aren't automatically updated with rules when you create Kubernetes LoadBalancer type services or OpenShift routes within the ARO cluster. You'll have to do such rule updates. This behavior is different from the original ARO behavior wherein the default NSG is programmatically updated in such situations.

1. The default ARO cluster NSG (not attached to any subnet while using this feature) will still be updated with rules when you create Kubernetes LoadBalancer type services or OpenShift routes within the ARO cluster.

1. You can detach pre-configured NSGs from the subnets of the cluster created using this feature. It will result in a cluster with subnets that have no NSGs. You can then attach a different set of pre-configured NSGs to the cluster. Alternatively, you can attach the ARO default NSG to the cluster subnets (at which point your cluster becomes like any other cluster that's not using this feature).

1. Your pre-configured NSGs should not have INBOUND/OUTBOUND DENY rules of the following types, as these can interfere with the operation of the cluster and/or hinder the ARO support/SRE teams from providing support/management. (Here, subnet indicates any or all IP addresses in the subnet and all ports corresponding to that subnet):

    1. Master Subnet ←→ Master Subnet
    1. Worker Subnet ←→ Worker Subnet
    1. Master Subnet ←→ Worker Subnet
    
    Misconfigured rules will result in a signal used by Azure Monitor to help troubleshoot pre-configured NSGs.
       
1. To allow incoming traffic to your ARO public cluster, you'll need the following INBOUND ALLOW rules (or equivalent) in your NSG. Refer to the default NSG of the cluster for specific details and to the example NSG shown in [Deployment](#deployment). You can create a cluster even without such rules in the NSG.

    1. For API server access → From Internet (or your preferred source IPs) to port 6443 on the master subnet.
    1. For access to OpenShift router (and hence to OpenShift console and OpenShift routes) → From Internet (or your preferred source IPs) to ports 80 and 443 on the default-v4 public IP on the public Load-balancer of the cluster.
    1. For access to any Load-balancer type Kubernetes service → From Internet (or your preferred source IPs) to service ports on public IP corresponding to the service on the public Load-balancer of the cluster.

1. You cannot enable the pre-configured NSG feature on an existing ARO cluster. Currently, this feature can only be enabled at the time of cluster creation.

1. The pre-configured NSG option is not configurable from the Azure portal.

1. If you used this feature during its preview, your existing pre-configured clusters are now fully supported. 

## Deployment

### Create VNET and create and configure pre-configured NSG

1. Create a VNET, and then create master and worker subnets within it.

1. Create pre-configured NSG(s) with default rules (or no rules at all) and attach them to the master and worker subnets.

### Create an ARO Cluster and Update pre-configured NSG(s)

1. Create the cluster:

    ```
    az aro create \
    --resource-group BASE_RESOURCE_GROUP_NAME \
    --name CLSUTER_NAME \
    --vnet VNET_NAME \
    --master-subnet MASTER_SUBNET_NAME \
    --worker-subnet WORKER_SUBNET_NAME \
    --client-id CLUSTER_SERVICE_PRINCIPAL_ID \
    --client-secret CLUSTER_SERVICE_PRINCIPAL_SECRET \
    --enable-preconfigured-nsg
    ```
    
1. Update the pre-configured NSG(s) with rules as per your requirements while also considering the points mentioned in [Capabilities and limitations](#capabilities-and-limitations).

    The following example has the Cluster Public Load-balancer as shown in screenshot/CLI output below:
    
    :::image type="content" source="media/howto-bring-nsg/ip-configuration-load-balancer.png" alt-text="Screenshot of the cluster's public load balancer as shown with the output from the command.":::
   
    ```Output
    $ oc get svc | grep tools
    tools LoadBalancer 172.30.182.7 20.141.176.3 80:30520/TCP 143m
    $ $ oc get svc -n openshift-ingress | grep Load
    router-default LoadBalancer 172.30.105.218 20.159.139.208 80:31157/TCP,443:31177/TCP 
    5d20
    ```
    
    :::image type="content" source="media/howto-bring-nsg/load-balancer-output.png" alt-text="Screenshot showing inbound and outbound security rules.":::


