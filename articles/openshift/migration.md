---
title: Migrate from an Azure Red Hat OpenShift 3.11 to Azure Red Hat OpenShift 4
description: Migrate from an Azure Red Hat OpenShift 3.11 to Azure Red Hat OpenShift 4
author: konghot
ms.author: pkonghot
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.date: 08/13/2020
keywords: migration, aro, openshift, red hat
#Customer intent: As a customer, I want to migrate from an existing Azure Red Hat OpenShift 3.11 cluster to an Azure Red Hat OpenShift 4 cluster.
---

# Migrate from Azure Red Hat OpenShift 3.11 to Azure Red Hat OpenShift 4

Azure Red Hat OpenShift on OpenShift 4 brings Kubernetes 1.16 on Red Hat Core OS, private clusters, bring your own virtual network support, and full cluster admin role. In addition, many new features are now available such as support for the operator framework, the Operator Hub, and OpenShift Service Mesh.

To successfully transition from Azure Red Hat OpenShift 3.11 to Azure Red Hat OpenShift 4, make sure to review the [differences in storage, networking, logging, security, and monitoring](https://docs.openshift.com/container-platform/4.4/migration/migrating_3_4/planning-migration-3-to-4.html).

In this article, we'll demonstrate how to migrate from an Azure Red Hat OpenShift 3.11 cluster to an Azure Red Hat 4 cluster.

> [!NOTE]
> Red Hat OpenShift migration tools such as the Control Plane Migration Assistance Tool and the Cluster Application Migration Tool (CAM) cannot be used with Azure Red Hat OpenShift 3.11 clusters.

## Before you begin

This article assumes you have an existing Azure Red Hat OpenShift 3.11 cluster.

## Create a target Azure Red Hat OpenShift 4 cluster

First, [create the Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md) you would like to use as the target cluster. Here, we'll use the basic configuration. If you're interested in different settings, see the [Create an Azure Red Hat OpenShift 4 Cluster tutorial](tutorial-create-cluster.md).

Create a virtual network with two empty subnets for the master and worker nodes.

```azurecli-interactive
    az network vnet create \
    --resource-group $RESOURCEGROUP \
    --name aro-vnet \
    --address-prefixes 10.0.0.0/22

    az network vnet subnet create \
    --resource-group $RESOURCEGROUP \
    --vnet-name aro-vnet \
    --name master-subnet \
    --address-prefixes 10.0.0.0/23 \
    --service-endpoints Microsoft.ContainerRegistry

    az network vnet subnet create \
    --resource-group $RESOURCEGROUP \
    --vnet-name aro-vnet \
    --name worker-subnet \
    --address-prefixes 10.0.2.0/23 \
    --service-endpoints Microsoft.ContainerRegistry
```

Then, use the following command to create the cluster.

```azurecli-interactive
az aro create \
  --resource-group $RESOURCEGROUP \
  --name $CLUSTER \
  --vnet aro-vnet \
  --master-subnet master-subnet \
  --worker-subnet worker-subnet \
  # --domain foo.example.com # [OPTIONAL] custom domain
  # --pull-secret @pull-secret.txt # [OPTIONAL]
```

## Configure the target OpenShift 4 cluster

### Authentication

For users to interact with Azure Red Hat OpenShift, they must first authenticate to the cluster. The authentication layer identifies the user associated with requests to the Azure Red Hat OpenShift API. The authorization layer then uses information about the requesting user to determine if the request is allowed.

When an Azure Red Hat OpenShift 4 cluster is created, a temporary administrative user is created. [Connect to your cluster](tutorial-connect-cluster.md), add users and groups and [configure the appropriate permissions](https://docs.openshift.com/container-platform/4.6/authentication/understanding-authentication.html) for both.

### Networking

Azure Red Hat OpenShift 4 uses a few different operators to set up the network in your cluster: [Cluster Network Operator](https://docs.openshift.com/container-platform/4.6/networking/cluster-network-operator.html#nw-cluster-network-operator_cluster-network-operator), [DNS Operator](https://docs.openshift.com/container-platform/4.6/networking/dns-operator.html), and the [Ingress Operator](https://docs.openshift.com/container-platform/4.6/networking/ingress-operator.html). For more information on setting up networking in an Azure Red Hat OpenShift 4 cluster, see the [Networking Diagram](concepts-networking.md) and [Understanding Networking](https://docs.openshift.com/container-platform/4.6/networking/understanding-networking.html).

### Storage
Azure Red Hat OpenShift 4 supports the following PersistentVolume plug-ins:

- AWS Elastic Block Store (EBS)
- Azure Disk
- Azure File
- GCE Persistent Disk
- HostPath
- iSCSI
- Local volume
- NFS
- Red Hat OpenShift Container Storage

For information on configuring these storage types, see [Configuring persistent storage](https://access.redhat.com/documentation/en-us/openshift_container_platform/4.7/html/storage/configuring-persistent-storage).

### Registry

Azure Red Hat OpenShift 4 can build images from your source code, deploy them, and manage their lifecycle. To enable this, Azure Red Hat OpenShift provides 4 an [internal, integrated container image registry](https://docs.openshift.com/container-platform/4.5/registry/registry-options.html) that can be deployed in your Azure Red Hat OpenShift environment to locally manage images.

If you're using external registries such as [Azure Container Registry](../container-registry/index.yml), [Red Hat Quay registries](https://docs.openshift.com/container-platform/4.5/registry/registry-options.html#registry-quay-overview_registry-options), or an [authentication enabled Red Hat registry](https://docs.openshift.com/container-platform/4.5/registry/registry-options.html#registry-authentication-enabled-registry-overview_registry-options), follow steps to supply credentials to the cluster to allow the cluster to access the repositories.

### Monitoring

Azure Red Hat OpenShift includes a pre-configured, pre-installed, and self-updating monitoring stack that is based on the Prometheus open source project and its wider eco-system. It provides monitoring of cluster components and includes a set of alerts to immediately notify the cluster administrator about any occurring problems and a set of Grafana dashboards. The cluster monitoring stack is only supported for monitoring Azure Red Hat OpenShift clusters. For more information, see [Cluster monitoring for Azure Red Hat OpenShift](https://docs.openshift.com/container-platform/4.5/monitoring/cluster_monitoring/about-cluster-monitoring.html).

If you have been using [Azure Monitor for Containers for Azure Red Hat OpenShift 3.11](../azure-monitor/containers/container-insights-azure-redhat-setup.md), you can also enable Azure Monitor for Containers for [Azure Red Hat OpenShift 4 clusters](../azure-monitor/containers/container-insights-azure-redhat4-setup.md) and continue using the same Log Analytics workspace.

## Move your DNS or load-balancer configuration to the new cluster

If you're using Azure Traffic Manager, add endpoints to refer to your target cluster and prioritize these endpoints.

## Deploy application to your target cluster

Once you have your target cluster properly configured for your workload, [connect to your cluster](tutorial-connect-cluster.md) and create the necessary applications, components, or services for your projects. Azure Red Hat OpenShift enables you to create these from Git, container images, the Red Hat Developer Catalog, a Dockerfile, a YAML/JSON definition, or by selecting a database service from the Catalog.

## Delete your source cluster
Once you've confirmed that your Azure Red Hat OpenShift 4 cluster is properly set up, delete your Azure Red Hat OpenShift 3.11 cluster.

```azurecli
az aro delete --name $CLUSTER_NAME
              --resource-group $RESOURCE_GROUP
              [--no-wait]
              [--yes]
```

## Next steps
Check out Red Hat OpenShift documentation [here](https://docs.openshift.com/container-platform/4.6/welcome/index.html).
