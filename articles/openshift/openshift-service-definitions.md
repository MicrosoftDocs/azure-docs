---
title: Azure Red Hat OpenShift service definition 
description: Azure Red Hat OpenShift service definition
ms.service: azure-redhat-openshift
ms.topic: article
author: johnmarco
ms.author: johnmarc
ms.date: 08/24/2023
keywords: azure, openshift, aro, red hat, service, definition
#Customer intent: I need to understand Azure Red Hat OpenShift service definitions to manage my subscription.
---

# Azure Red Hat OpenShift service definition

The following sections provide service definitions to help you manage your Azure Red Hat OpenShift account.

## Billing

Azure Red Hat OpenShift clusters are deployed into a customer’s Azure subscription. A customer pays Azure directly for costs incurred by an Azure Red Hat OpenShift cluster.

Azure Red Hat OpenShift nodes run on Azure Virtual Machines. They're billed according to Azure Linux virtual machine pricing. Compute, networking, and storage resources consumed by an Azure Red Hat OpenShift cluster are billed according to usage.

In addition to the compute and infrastructure costs, application nodes have an additional cost for the Azure Red Hat OpenShift license component. This cost is based on the number of application nodes and the instance type.

All standard Azure purchasing options, including reservations and Azure prepayment apply. Standard Azure purchasing options can be used for Azure Red Hat OpenShift. Also, standard Azure purchasing options can be used for virtual machines, networking, and storage resources consumed by the Azure Red Hat OpenShift cluster.

For more information about pricing, see [Azure Red Hat OpenShift pricing](https://azure.microsoft.com/pricing/details/openshift/).

## Cluster self-service

Customers can create and delete their clusters using the Azure command-line utility (CLI). Azure Red Hat OpenShift clusters deploy with a kubeadmin user whose credentials are available from the Azure CLI after a cluster is successfully deployed. 

You can perform all other Azure Red Hat OpenShift cluster actions, such as scaling nodes, by interacting with the OpenShift API using tools such as the OpenShift web console or the OpenShift CLI (oc).

## Azure resource architecture

An Azure Red Hat OpenShift deployment requires two resource groups within an Azure subscription. The first resource group is created by the customer and contains the virtual networking components for the cluster. Keeping the networking elements separate allows the customer to configure Azure Red Hat OpenShift to meet requirements and to add any peering options.

The second resource group is created by the Azure Red Hat OpenShift resource provider. It contains Azure Red Hat OpenShift cluster components, including virtual machines, network security groups, and load balancers. Azure Red Hat OpenShift cluster components located within this resource group aren't modifiable by the customer. Cluster configuration must be performed via interactions with the OpenShift API using the OpenShift web console or OpenShift CLI or similar tools.

## Red Hat operators

It's recommended that a customer provides a Red Hat pull secret to the Azure Red Hat OpenShift cluster during cluster creation. The Red Hat pull secret enables your cluster to access Red Hat container registries, along with other content from the OpenShift Operator Hub. 

Azure Red Hat OpenShift clusters can still serve applications without providing the Red Hat pull secret, but they'll be unable to install operators from the Operator Hub. 

The Red Hat pull secret can also be provided to the cluster post deployment.

## Compute

Azure Red Hat OpenShift clusters are provisioned with three or more worker nodes.

- In regions consisting of multiple availability zones, a worker node machine set is created in each zone. Also, a worker node is provisioned from each machine set.

- When an Azure region doesn't support availability zones, the Azure Red Hat OpenShift cluster provisions the worker nodes from a single machine set.
Customers have the ability to increase the node count and the permission in each region.

Azure Red Hat OpenShift clusters are provisioned with three control plane nodes. These nodes are responsible for etcd key-value store and API-related workloads. The control plane node can't be used for customer workloads. Control plane node deployment follows the same rules as worker nodes.

- In regions that consist of multiple availability zones, a control plane node machine set is created in each zone.  A control plane node is provisioned from each machine set.
- Where an Azure region doesn't support availability zones, the Azure Red Hat OpenShift cluster provisions the control plane nodes from a single machine set.

## Azure compute types

For a list of supported control plane and worker node types and sizes, see [Supported virtual machine sizes](./support-policies-v4.md#supported-virtual-machine-sizes).

## Azure regions

For regions supported by Azure Red Hat OpenShift, see [Products available by region](https://azure.microsoft.com//global-infrastructure/services/?products=openshift&regions=all).

From the Azure CLI, view a list of available regions by running the following command:

```azurecli-interactive
az provider show -n Microsoft.RedHatOpenShift --query "resourceTypes[?resourceType == 'OpenShiftClusters']".locations -o yaml
```    

Once deployed, an Azure Red Hat OpenShift cluster can't be moved to a different region. Similarly, you can't transfer Azure Red Hat OpenShift clusters between subscriptions.

## Service level agreement

For SLA details, see [SLA for Azure Red Hat OpenShift](https://azure.microsoft.com/support/legal/sla/openshift/v1_0/).

## Support

Support requests for Azure Red Hat OpenShift can be submitted by;

* Requesting support in the Azure portal
* Requesting support via Red Hat Customer Portal

Requests will be triaged and addressed by Microsoft and Red Hat support engineers. Azure Red Hat OpenShift includes Red Hat Premium Support. Support can be accessed via the Microsoft Azure portal.

To open support tickets directly with Red Hat, your cluster will need to have a pull secret. You can add it during cluster creation, or add it or update it on an existing cluster.

## Logging

The following sections provide information about Azure Red Hat OpenShift security.

### Cluster operations and audit logging

Azure Red Hat OpenShift deploys with services for maintaining the health and performance of the cluster and its components. These services include cluster operations and audit logs. Cluster operations and audit logs are forwarded automatically to an Azure aggregation system for support and troubleshooting. This data is only accessible to authorized support staff via approved mechanisms.

Customer cluster administrators can deploy an optional logging stack to aggregate all logs from their Azure Red Hat OpenShift cluster. For example, node system audit logs and infrastructure logs can be aggregated. However, these logs consume another cluster resources.

### Application logging

With access to [OperatorHub.io](https://operatorhub.io/) enabled, Azure Red Hat OpenShift includes an optional logging stack based on Elasticsearch, Fluentd, and Kibana (EFK).

The logging stack, [Logging Operator](https://operatorhub.io/operator/logging-operator), can be configured to meet customer requirements. However, it's designed for short-term retention to aid cluster and application troubleshooting, not for long-term log archiving.

If the cluster logging stack is installed, application logs sent to STDOUT are collected by Fluentd. The application logs are made available through the cluster logging stack. Retention is set to seven days, but won't exceed 200 GiB of logs per shard. For longer term retention, customers should follow the sidecar container design in their deployments. Customers should forward logs to the log aggregation or analytics service of their choice.

## Monitoring

The following section provides information about Azure Red Hat OpenShift monitoring.
### Cluster metrics

Azure Red Hat OpenShift deploys with services for maintaining the health and performance of the cluster and its components. These services include the streaming of important metrics to an Azure aggregation system for support and troubleshooting purposes. This data is only accessible to authorized support staff via approved mechanisms.

Azure Red Hat OpenShift clusters come with an integrated Prometheus/Grafana stack to enable customers to view cluster monitoring. The stack includes CPU, memory, and network-based metrics.

These metrics, which are accessible via the web console, can also be used to view cluster-level status and capacity/usage through a Grafana dashboard. These metrics also allow for horizontal pod autoscaling that is based on CPU or memory metrics provided by an Azure Red Hat OpenShift customer.

## Network
The following sections provide information about the Azure Red Hat OpenShift network.

### Domain-validated certificates

By default, Azure Red Hat OpenShift includes TLS security certificates needed for both internal and external services on the cluster. For external routes, a Transport Layer Security (TLS) wildcard certificate is provided and installed in the cluster. A TLS certificate is also used for the OpenShift API endpoint. DigiCert is the certificate authority (CA) used for these certificates.

### Custom domains

During deployment, Azure Red Hat OpenShift allows you to specify a custom domain for your cluster. The custom domain is used for both cluster services and for applications. You must create two DNS A records in your DNS server for the specified domain:

* api, which points to the api server IP address
* *.apps, which points to the ingress IP address

By default, Azure Red Hat OpenShift uses self-signed certificates for all of the routes created on custom domains. If you choose to use custom domains, connect to the cluster. Next, follow the OpenShift documentation to configure a custom certificate authority CA for your ingress controller and a custom CA for your API server. 

### Custom CAs for builds

Azure Red Hat OpenShift supports the use of CAs to be trusted by builds when pulling images from an image registry.

### Load balancers

 Azure Red Hat OpenShift deploys with two Azure load balancers. The first is used for ingress traffic to applications and for the OpenShift and Kubernetes APIs. The second is used for internal communications between cluster components.

### Cluster ingress

Project administrators can add route annotations for many different purposes, including ingress control via an IP allowlist.

Ingress policies can be changed by using NetworkPolicy objects, which use the ovs-networkpolicy plugin. Using NetworkPolicy objects allows for full control over ingress network policy down to the pod level, including between pods on the same cluster and even in the same namespace.

All cluster ingress traffic traverses the defined load balancer.

### Cluster egress

Pod egress traffic control via EgressNetworkPolicy objects can be used to prevent or limit outbound traffic in Azure Red Hat OpenShift.
Currently all virtual machines must have outbound internet access.

### Cloud network configuration

Azure Red Hat OpenShift enables configuration of private network connections through several cloud provider-managed technologies:

* VNet connections 
* Azure VNet peering 
* Azure VNet Gateway 
* Azure Express route

No monitoring of these private network connections is provided by Red Hat SRE. Monitoring these connections is the responsibility of the customer.

### Customer-specified DNS

Azure Red Hat OpenShift customers can specify their own DNS servers. For more information, see [Configure custom DNS for your Azure Red Hat OpenShift cluster](./howto-custom-dns.md).

### Container Network Interface

Azure Red Hat OpenShift comes with OVN (Open Virtual Network) as the Container Network Interface (CNI). Replacing the CNI is not a supported operation. For more information, see [OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters](concepts-ovn-kubernetes.md).

## Storage

The following sections provide information about Azure Red Hat OpenShift storage.

### Encryption-at-rest

Azure Storage uses server-side encryption (SSE) to automatically encrypt your data when it's persisted to the cloud. By default, data is encrypted with Microsoft platform-managed keys.

### Block storage (RWO)

Persistent volumes are backed by Azure-Disk block storage, which is Read-Write-Once (RWO).
1024-GiB disks are dynamically created and attached to each Azure Red Hat OpenShift controller plane node. These disks are Premium SSD LRS Azure-managed disks. Disk sizes for the default worker node machine sets can be configured during cluster creation.

Customers have permissions for creating more machine sets to better suit their requirements.

Persistent volumes (PVs), which can only be attached to a single node at a time, are specific to the availability zone in which they were provisioned. They can be attached to any node in the availability zone.

Azure limits how many PVs of type block store can be attached to a single node. Azure limits depend on the type and size of the virtual machine the customer selects for worker nodes. For example, to see the max data disks for the Dasv4-series, see [Dasv4](../virtual-machines/dav4-dasv4-series.md#dasv4-series).

### Shared storage (RWX)

Shared storage for Azure Red Hat OpenShift clusters must be configured by the customer. For an example of how to configure a storage class for Azure files, see [Create an Azure Files StorageClass on Azure Red Hat OpenShift 4](./howto-create-a-storageclass.md)

## Platform

The following sections provide information about the  Azure Red Hat OpenShift platform.

### Cluster backup policy

> [!IMPORTANT]
> It's **critical** that you have a backup plan for your applications and application data.

Application and application data backups aren't an automated part of the Azure Red Hat OpenShift service. For a tutorial on how to perform manual application backup, see [Create an Azure Red Hat OpenShift 4 cluster Application Backup](./howto-create-a-backup.md).

### DaemonSets
Customers can create and run DaemonSets on Azure Red Hat OpenShift. To restrict DaemonSets to only running on worker nodes, use the following nodeSelector:

```
spec:
  nodeSelector:
    node-role.kubernetes.io/worker: ""
```

### Azure Red Hat OpenShift version

Azure Red Hat OpenShift is run as a service. It permits customers to keep up to date with the latest stable OpenShift Container Platform version. For the support and upgrade policy, see [Support lifecycle for Azure Red Hat OpenShift 4](./support-lifecycle.md).

### Support lifecycle

For information about the Azure Red Hat OpenShift support lifecycle, see [Support lifecycle for Azure Red Hat OpenShift 4](./support-lifecycle.md).

### Container engine

Azure Red Hat OpenShift runs on OpenShift 4 and uses the CRI-O implementation of the Kubernetes container runtime interface as the only available container engine.

### Operating system

Azure Red Hat OpenShift runs on OpenShift 4 using Red Hat Enterprise Linux CoreOS (RHCOS) as the operating system for all control plane and worker nodes.
Windows workloads are not supported on Azure OpenShift as the platform does not currently support Windows worker nodes.

### Kubernetes operator support

Azure Red Hat OpenShift supports operators created by Red Hat and certified independent software vendors (ISVs). Operators provided by Red Hat are supported by Red Hat. ISV operators are supported by the ISV.

To use OperatorHub, your cluster must be configured with a Red Hat pull secret. For more information about using OperatorHub, see [Understanding OperatorHub](https://docs.openshift.com/container-platform/latest/operators/understanding/olm-understanding-operatorhub.html)

## Security

The following sections provide information about Azure OpenShift security.

### Authentication provider

Azure Red Hat OpenShift clusters aren't configured with any authentication providers.

Customers need to configure their own providers, such as Microsoft Entra ID. For information about configuring providers, see the following articles:

* [Microsoft Entra authentication](./configure-azure-ad-cli.md)
* [OpenShift identity providers](https://docs.openshift.com/container-platform/4.7/authentication/understanding-identity-provider.html)

### Regulatory compliance

For details about Azure Red Hat OpenShift’s regulatory compliance certifications, see [Microsoft Azure Compliance Offerings](https://azure.microsoft.com/resources/microsoft-azure-compliance-offerings/).

## Next Steps

For more information, see the [support policies](support-policies-v4.md) documentation.
