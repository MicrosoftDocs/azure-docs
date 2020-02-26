---
title: Frequently asked questions for Azure Red Hat OpenShift
description: Here are answers to common questions about Microsoft Azure Red Hat OpenShift
author: jimzim
ms.author: jzim
ms.service: container-service
ms.topic: conceptual
ms.date: 11/04/2019
---

# Azure Red Hat OpenShift FAQ

This article addresses frequently asked questions (FAQs) about Microsoft Azure Red Hat OpenShift.

## Which Azure regions are supported?

See [Supported resources](supported-resources.md#azure-regions) for a list of global regions where Azure Red Hat OpenShift is supported.

## Can I deploy a cluster into an existing virtual network?

No. But you can connect an Azure Red Hat OpenShift cluster to an existing VNET via peering. See [Connect a cluster's virtual network to an existing virtual network
](tutorial-create-cluster.md#optional-connect-the-clusters-virtual-network-to-an-existing-virtual-network) for details.

## What cluster operations are available?

You can only scale up or down the number of compute nodes. No other modifications are permitted to the `Microsoft.ContainerService/openShiftManagedClusters` resource after creation. The maximum number of compute nodes is limited to 20.

## What virtual machine sizes can I use?

See [Azure Red Hat OpenShift virtual machine sizes](supported-resources.md#virtual-machine-sizes) for a list of virtual machine sizes you can use with an Azure Red Hat OpenShift cluster.

## Is data on my cluster encrypted?

By default, there is encryption at rest. The Azure Storage platform automatically encrypts your data before persisting it, and decrypts the data before retrieval. See [Azure Storage Service Encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) for details.

## Can I use Prometheus/Grafana to monitor my applications?

Yes, you can deploy Prometheus in your namespace and monitor applications in your namespace.

## Can I use Prometheus/Grafana to monitor metrics related to cluster health and capacity?

No, not at current time.

## Is the Docker registry available externally so I can use tools such as Jenkins?

The Docker registry is available from `https://docker-registry.apps.<clustername>.<region>.azmosa.io/` 
However, a strong storage durability guarantee is not provided. You can also use [Azure Container Registry](https://azure.microsoft.com/services/container-registry/).

## Is cross-namespace networking supported?

Customer and individual project admins can customize cross-namespace networking (including denying it) on a per project basis using `NetworkPolicy` objects.

## Can an admin manage users and quotas?

Yes. An Azure Red Hat OpenShift administrator can manage users and quotas in addition to accessing all user created projects.

## Can I restrict a cluster to only certain Azure AD users?

Yes. You can restrict which Azure AD users can sign in to a cluster by configuring the Azure AD Application. For details, see [How to: Restrict your app to a set of users](https://docs.microsoft.com/azure/active-directory/develop/howto-restrict-your-app-to-a-set-of-users)

## Can a cluster have compute nodes across multiple Azure regions?

No. All nodes in an Azure Red Hat OpenShift cluster must originate from the same Azure region.

## Are master and infrastructure nodes abstracted away as they are with Azure Kubernetes Service (AKS)?

No. All resources, including the cluster master, run in your customer subscription. These types of resources are put in a read-only resource group.

## Is Open Service Broker for Azure (OSBA) supported?

Yes. You can use OSBA with Azure Red Hat OpenShift. See [Open Service Broker for Azure](https://github.com/Azure/open-service-broker-azure#openshift-project-template) for more information.

## I am trying to peer into a virtual network in a different subscription but getting `Failed to get vnet CIDR` error.

In the subscription that has the virtual network, make sure to register `Microsoft.ContainerService` provider with `az provider register -n Microsoft.ContainerService --wait` 

## What is the Azure Red Hat OpenShift (ARO) maintenance process?

There are three types of maintenance for ARO: upgrades, backup and restoration of etcd data, and cloud provider-initiated maintenance.

+ Upgrades include software upgrades and CVEs. CVE remediation occurs on startup by running `yum update` and provides for immediate mitigation.  In parallel a new image build will be created for future cluster creates.

+ Backup and management of etcd data is an automated process that may require cluster downtime depending on the action. If the etcd database is being restored from a backup there will be downtime. We back up etcd hourly and retain the last 6 hours of backups.

+ Cloud provider-initiated maintenance includes network, storage, and regional outages. The maintenance is dependent on the cloud provider and relies on provider-supplied updates.

## What is the general upgrade process?

Running an upgrade should be a safe process to run and should not disrupt cluster services. The SRE can trigger the upgrade process when new versions are available or CVEs are outstanding.

Available updates are tested in a stage environment and then applied to production clusters. When applied, a new node is temporarily added and nodes are updated in a rotating fashion so that pods maintain replica counts. Following best practices helps ensure minimal to no downtime.

Depending on the severity of the pending upgrade or update, the process might differ in that the updates might be applied quickly to mitigate the service’s exposure to a CVE. A new image will be built asynchronously, tested, and rolled out as a cluster upgrade. Other than that, there is no difference between emergency and planned maintenance. Planned maintenance is not prescheduled with the customer.

Notifications may be sent via ICM and email if communication to the customer is required.

## What about emergency vs. planned maintenance windows?

We do not distinguish between the two types of maintenance. Our teams are available 24/7/365 and do not use traditional scheduled “out-of-hours” maintenance windows.

## How will host operating system and OpenShift software be updated?

The host operating system and OpenShift software are updated through our general upgrade and image build process.

## What’s the process to reboot the updated node?

This should be handled as a part of an upgrade.

## Is data stored in etcd encrypted on ARO?

It is not encrypted on the etcd level. The option to turn it on is currently unsupported. OpenShift supports this feature, but engineering efforts are required to make it on the road map. The data is encrypted at the disk level. Refer to [Encrypting Data at Datastore Layer](https://docs.openshift.com/container-platform/3.11/admin_guide/encrypting_data.html) for more information.

## Can logs of underlying VMs be streamed out to a customer log analysis system?

Syslog, docker logs, journal, and dmesg are handled by the managed service and are not exposed to customers.

## How can a customer get access to metrics like CPU/memory at the node level to take action to scale, debug issues, etc. I cannot seem to run `kubectl top` on an ARO cluster.

Customers can access the CPU/Memory metrics at the node level by using the command `oc adm top nodes` or `kubectl top nodes` with the customer-admin clusterrole.  Customers can also access the CPU/Memory metrics of `pods` with the command `oc adm top pods` or `kubectl top pods`

## What is the default pod scheduler configuration for ARO?

ARO uses the default scheduler that ships in OpenShift. There are a couple of additional mechanisms that are not supported in ARO. Refer to [default scheduler documentation](https://docs.openshift.com/container-platform/3.11/admin_guide/scheduling/scheduler.html#generic-scheduler) and [master scheduler documentation](https://github.com/openshift/openshift-azure/blob/master/pkg/startup/v6/data/master/etc/origin/master/scheduler.json) for more details.

Advanced/Custom scheduling is currently unsupported. Refer to the [Scheduling documentation](https://docs.openshift.com/container-platform/3.11/admin_guide/scheduling/index.html) for more details.

## If we scale up the deployment, how do Azure fault domains map into pod placement to ensure all pods for a service do not get knocked out by a failure in a single fault domain?

There are by default five fault domains when using virtual machine scale sets in Azure. Each virtual machine instance in a scale set will get placed into one of these fault domains. This ensures that applications deployed to the compute nodes in a cluster will get placed in separate fault domains.

Refer to [Choosing the right number of fault domains for virtual machine scale set](https://docs.microsoft.com//azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-fault-domains) for more details.

## Is there a way to manage pod placement?

Customers have the ability to get nodes and view labels as the customer-admin.  This will provide a way to target any VM in the scale set.

Caution must be used when using specific labels:

- Hostname must not be used. Hostname gets rotated often with upgrades and updates and is guaranteed to change.

- If the customer has a request for specific labels or a deployment strategy, this could be accomplished but would require engineering efforts and is not supported today.

## What is the maximum number of pods in an ARO cluster?  What is the maximum number of pods per node in ARO?

 Azure Red Hat OpenShift 3.11 has a 50-pod per node limit with [ARO having a 20-compute node limit](https://docs.microsoft.com/azure/openshift/openshift-faq#what-cluster-operations-are-available), so that caps the maximum number of pods supported in an ARO cluster to 50*20 = 1000.

## Can we specify IP ranges for deployment on the private VNET, avoiding clashes with other corporate VNETs once peered?

Azure Red Hat OpenShift supports VNET peering and allows the customer to provide a VNET to peer with and a VNET CIDR in which the OpenShift network will operate.

The VNET created by ARO will be protected and will not accept configuration changes. The VNET that is peered is controlled by the customer and resides in their subscription.

## Does the cluster reside in a customer subscription? 

The Azure Managed Application lives in a locked Resource Group with the customer subscription. Customer can view objects in that RG but not modify.

## Is the SDN module configurable?

SDN is openshift-ovs-networkpolicy and is not configurable.

## Which UNIX rights (in IaaS) are available for Masters/Infra/App Nodes?

Not applicable to this offering. Node access is forbidden.

## Which OCP rights do we have? Cluster-admin? Project-admin?

For details, see the Azure Red Hat OpenShift [cluster administration overview](https://docs.openshift.com/aro/admin_guide/index.html).

## Which kind of federation with LDAP?

This would be achieved via Azure AD integration. 

## Is there any element in ARO shared with other customers? Or is everything independent?

Each Azure Red Hat OpenShift cluster is dedicated to a given customer and lives within the customer's subscription. 

## Can we choose any persistent storage solution, like OCS? 

Two storage classes are available to select from: Azure Disk and Azure File.

## How is a cluster updated (including majors and minors due to vulnerabilities)?

See [What is the general upgrade process?](https://docs.microsoft.com/azure/openshift/openshift-faq#what-is-the-general-upgrade-process)

## What Azure Load balancer is used by ARO?  Is it Standard or Basic and is it configurable?

ARO uses Standard Azure Load Balancer, and it is not configurable.

## Can ARO use NetApp-based storage?

At the moment the only supported storage options are Azure Disk and Azure File storage classes. 


