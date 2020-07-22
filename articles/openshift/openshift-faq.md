---
title: Frequently asked questions for Azure Red Hat OpenShift
description: Here are answers to common questions about Microsoft Azure Red Hat OpenShift
author: jimzim
ms.author: jzim
ms.service: container-service
ms.topic: conceptual
ms.date: 05/29/2020
---

# Azure Red Hat OpenShift FAQ

This article answers frequently asked questions (FAQs) about Microsoft Azure Red Hat OpenShift.

## Installation and upgrade

### Which Azure regions are supported?

For a list of supported regions for Azure Red Hat OpenShift 4.x, see [Available regions](https://docs.openshift.com/aro/4/welcome/index.html#available-regions).

For a list of supported regions for Azure Red Hat OpenShift 3.11, see [Products available by region](supported-resources.md#azure-regions).

### What virtual machine sizes can I use?

For a list of supported virtual machine sizes for Azure Red Hat OpenShift 4, see [Supported resources for Azure Red Hat OpenShift 4](support-policies-v4.md).

For a list of supported virtual machine sizes for Azure Red Hat OpenShift 3.11, see [Supported resources for Azure Red Hat OpenShift 3.11](supported-resources.md).

### What is the maximum number of pods in an Azure Red Hat OpenShift cluster?  What is the maximum number of pods per node in Azure Red Hat OpenShift?

The actual number of supported pods depends on an application’s memory, CPU, and storage requirements.

Azure Red Hat OpenShift 4.x has a 250 pod-per-node limit and a 100 compute node limit. This caps the maximum number of pods supported in a cluster to 250&times;100 = 25,000.

Azure Red Hat OpenShift 3.11 has a 50 pod-per-node limit and a 20 compute node limit. This caps the maximum number of pods supported in a cluster to 50&times;20 = 1,000.

### Can a cluster have compute nodes across multiple Azure regions?

No. All nodes in an Azure Red Hat OpenShift cluster must originate in the same Azure region.

### Can a cluster be deployed across multiple availability zones?

Yes. This happens automatically if your cluster is deployed to an Azure region that supports availability zones. For more information, see [Availability zones](../availability-zones/az-overview.md#availability-zones).

### Are control plane nodes abstracted away as they are with Azure Kubernetes Service (AKS)?

No. All resources, including the cluster master nodes, run in your customer subscription. These types of resources are put in a read-only resource group.

### Does the cluster reside in a customer subscription? 

The Azure Managed Application lives in a locked Resource Group with the customer subscription. Customers can view objects in that resource group but not modify them.

### Is there any element in Azure Red Hat OpenShift shared with other customers? Or is everything independent?

Each Azure Red Hat OpenShift cluster is dedicated to a given customer and lives within the customer's subscription. 

### Are infrastructure nodes available?

On Azure Red Hat OpenShift 4.x clusters, infrastructure nodes are not currently available.

On Azure Red Hat OpenShift 3.11 clusters, infrastructure nodes are included by default.

## Upgrades

###  What is the general upgrade process?

Patches are applied automatically to your cluster. You do not need to take any action to receive patch upgrades on your cluster.

Running an upgrade is a safe process to run and should not disrupt cluster services. The joint Microsoft-Red Hat team can trigger the upgrade process when new versions are available or Common Vulnerabilities and Exposures are outstanding. Available updates are tested in a staging environment and then applied to production clusters. Following best practices helps ensure minimal to no downtime.

Planned maintenance is not prescheduled with the customer. Notifications related to maintenance may be sent via email.

### What is the Azure Red Hat OpenShift maintenance process?

There are two types of maintenance for Azure Red Hat OpenShift: upgrades and cloud provider-initiated maintenance.
- Upgrades include software upgrades and Common Vulnerabilities and Exposures.
- Cloud provider-initiated maintenance includes network, storage, and regional outages. The maintenance is dependent on the cloud provider and relies on provider-supplied updates.

### What about emergency vs. planned maintenance windows?

We do not distinguish between the two types of maintenance. Our teams are available 24/7/365 and do not use traditional scheduled “out-of-hours” maintenance windows.

### How will the host operating system and OpenShift software be updated?

The host operating systems and OpenShift software are updated as Azure Red Hat OpenShift consumes minor release versions and patches from upstream OpenShift Container Platform.

### What’s the process to reboot the updated node?

Nodes are rebooted as a part of an upgrade.

## Cluster operations

### Can I use Prometheus to monitor my applications?

Prometheus comes pre-installed and configured for Azure Red Hat OpenShift 4.x clusters. Read more about [cluster monitoring](https://docs.openshift.com/container-platform/3.11/install_config/prometheus_cluster_monitoring.html).

For Azure Red Hat OpenShift 3.11 clusters, you can deploy Prometheus in your namespace and monitor applications in your namespace. For more information, see [Deploy Prometheus instance in Azure Red Hat OpenShift cluster](howto-deploy-prometheus.md).

### Can I use Prometheus to monitor metrics related to cluster health and capacity?

In Azure Red Hat OpenShift 4.x: Yes.

In Azure Red Hat OpenShift 3.11: No.

### Can logs of underlying VMs be streamed out to a customer log analysis system?

Logs from underlying VMs are handled by the managed service and aren't exposed to customers.

### How can a customer get access to metrics like CPU/memory at the node level to take action to scale, debug issues, etc.? I cannot seem to run kubectl top on an Azure Red Hat OpenShift cluster.

For Azure Red Hat OpenShift 4.x clusters, the OpenShift web console contains all metrics at the node level. For more information, see the Red Hat documentation on [viewing cluster information](https://docs.openshift.com/aro/4/web_console/using-dashboard-to-get-cluster-information.html).

For Azure Red Hat OpenShift 3.11 clusters, customers can access the CPU/Memory metrics at the node level by using the command `oc adm top nodes` or `kubectl top nodes` with the customer-admin cluster role. Customers can also access the CPU/Memory metrics of `pods` with the command `oc adm top pods` or `kubectl top pods`.

### If we scale up the deployment, how do Azure fault domains map into pod placement to ensure all pods for a service do not get knocked out by a failure in a single fault domain?

There are by default five fault domains when using virtual machine scale sets in Azure. Each virtual machine instance in a scale set will get placed into one of these fault domains. This ensures that applications deployed to the compute nodes in a cluster will get placed in separate fault domains.

For more information, see [Choosing the right number of fault domains for virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-manage-fault-domains.md).

### Is there a way to manage pod placement?

Customers have the ability to get nodes and view labels as the customer-admin. This will provide a way to target any VM in the scale set.

Caution must be used when using specific labels:

- Hostname must not be used. Hostname gets rotated often with upgrades and updates and is guaranteed to change.
- If the customer has a request for specific labels or a deployment strategy, this could be accomplished but would require engineering efforts and is not supported today.

For more information, see [Controlling pod placement](https://docs.openshift.com/aro/4/nodes/scheduling/nodes-scheduler-about.html).

### Is the image registry available externally so I can use tools such as Jenkins?

For 4.x clusters, you need to expose a secure registry and configure authentication. For more information, see the following Red Hat documentation:

- [Exposing a registry](https://docs.openshift.com/aro/4/registry/securing-exposing-registry.html)
- [Accessing the registry](https://docs.openshift.com/aro/4/registry/accessing-the-registry.html)

For 3.11 clusters, the Docker image registry is available. The Docker registry is available from `https://docker-registry.apps.<clustername>.<region>.azmosa.io/`. You can also use Azure Container Registry.

## Networking

### Can I deploy a cluster into an existing virtual network?

In 4.x clusters, you can deploy a cluster into an existing VNet.

In 3.11 clusters, you cannot deploy a cluster into an existing VNet. You can connect an Azure Red Hat OpenShift 3.11 cluster to an existing VNet via peering.

### Is cross-namespace networking supported?

Customer and individual project admins can customize cross-namespace networking (including denying it) on a per-project basis using `NetworkPolicy` objects.

### I am trying to peer into a virtual network in a different subscription but getting Failed to get VNet CIDR error.

In the subscription that has the virtual network, make sure to register `Microsoft.ContainerService` provider with the following command: `az provider register -n Microsoft.ContainerService --wait`

### Can we specify IP ranges for deployment on the private VNet, avoiding clashes with other corporate VNets once peered?

In 4.x clusters, you can specify your own IP ranges.

In 3.11 clusters, Azure Red Hat OpenShift supports VNet peering and allows the customer to provide a VNet to peer with and a VNet CIDR in which the OpenShift network will operate.

The VNet created by Azure Red Hat OpenShift will be protected and will not accept configuration changes. The VNet that is peered is controlled by the customer and resides in their subscription.

### Is the Software Defined Network module configurable?

The Software Defined Network is `openshift-ovs-networkpolicy` and is not configurable.

### What Azure Load balancer is used by Azure Red Hat OpenShift?  Is it Standard or Basic and is it configurable?

Azure Red Hat OpenShift uses Standard Azure Load Balancer, and it is not configurable.

## Permissions

### Can an admin manage users and quotas?

Yes. An Azure Red Hat OpenShift administrator can manage users and quotas in addition to accessing all user created projects.

### Can I restrict a cluster to only certain Azure AD users?

Yes. You can restrict which Azure AD users can sign in to a cluster by configuring the Azure AD Application. For details, see [How to: Restrict your app to a set of users](../active-directory/develop/howto-restrict-your-app-to-a-set-of-users.md).

### Can I restrict users from creating projects?

Yes. Log in to your cluster as an administrator and execute this command:

```
oc adm policy \
    remove-cluster-role-from-group self-provisioner \
    system:authenticated:oauth
```

For more information, see the OpenShift documentation on disabling self-provisioning for your cluster version:

- [Disabling self-provisioning in 4.3 clusters](https://docs.openshift.com/aro/4/applications/projects/configuring-project-creation.html#disabling-project-self-provisioning_configuring-project-creation)
- [Disabling self-provisioning in 3.11 clusters](https://docs.openshift.com/container-platform/3.11/admin_guide/managing_projects.html#disabling-self-provisioning)

### Which UNIX rights (in IaaS) are available for Masters/Infra/App Nodes?

For 4.x clusters, node access is available through the cluster-admin role. For more information, see [RBAC overview](https://docs.openshift.com/container-platform/4.3/authentication/using-rbac.html).

For 3.11 clusters, node access is forbidden.

### Which OCP rights do we have? Cluster-admin? Project-admin?

For 4.x clusters, the cluster-admin role is available. For more information, see [RBAC overview](https://docs.openshift.com/container-platform/4.3/authentication/using-rbac.html).

For 3.11 clusters, see the [cluster administration overview](https://docs.openshift.com/aro/admin_guide/index.html) for more details.

### Which identity providers are available?

For 4.x clusters, you configure your own identity provider. For more information, see the Red Hat documentation on [configuring identity prodivers](https://docs.openshift.com/aro/4/authentication/identity_providers/configuring-ldap-identity-provider.html).

For 3.11 clusters, you can use the Azure AD integration. 

## Storage

### Is data on my cluster encrypted?

By default, data is encrypted at rest. The Azure Storage platform automatically encrypts your data before persisting it, and decrypts the data before retrieval. For more information, see [Azure Storage Service Encryption for data at rest](../storage/common/storage-service-encryption.md).

### Is data stored in etcd encrypted on Azure Red Hat OpenShift?

For Azure Red Hat OpenShift 4 clusters, data is not encrypted by default but you do have the option to enable encryption. For more information, see the guide on [encrypting etcd](https://docs.openshift.com/container-platform/4.3/authentication/encrypting-etcd.html).

For 3.11 clusters, data is not encrypted on the etcd level. The option to turn encryption on is currently unsupported. OpenShift supports this feature, but engineering efforts are required to make it on the road map. The data is encrypted at the disk level. Refer to [Encrypting Data at Datastore Layer](https://docs.openshift.com/container-platform/3.11/admin_guide/encrypting_data.html) for more information.

### Can we choose any persistent storage solution, like OCS? 

For 4.x clusters, Azure Disk (Premium_LRS) is configured as the default storage class. For additional storage providers, and for configuration details (including Azure File), see the Red Hat documentation on [persistent storage](https://docs.openshift.com/aro/4/storage/understanding-persistent-storage.html).

For 3.11 clusters, two storage classes are provided by default: one for Azure Disk (Premium_LRS) and one for Azure File.
