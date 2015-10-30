<properties
	pageTitle="Troubleshooting VM allocation failure | Microsoft Azure"
	description="Troubleshooting allocation failure when you create, restart or resize a VM, or when you add new web or worker role instances in Azure"
	services="virtual-machines, azure-resource-manager, cloud-services"
	documentationCenter=""
	authors="jiangchen79"
	manager="felixwu"
	editor=""/>

<tags
	ms.service="virtual-machines"
	ms.workload="na"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/29/2015"
	ms.author="kenazk"/>



# Troubleshooting allocation failure when you create, restart or resize a VM in Azure

## Summary
When you create a VM, restart stopped (de-allocated) VMs, resize a VM, or when you add new web or worker role instances, Microsoft Azure allocates compute resources to your subscription. You may occasionally receive errors when performing these operations even before you reach the Azure subscription limits. This article explains the causes of some of the common allocation failures and suggests possible remediation. The information may also be useful when you plan the deployment of your services.

### Background – How allocation works
The servers in Azure datacenters are partitioned into clusters. Normally, an allocation request is attempted in multiple clusters, but it's possible certain constraints from the allocation request force the Azure platform to attempt the request in only one cluster. In this article, we'll refer to this as "pinned to a cluster". Diagram 1 below illustrates the case of a normal allocation which is attempted in multiple clusters; Diagram 2 illustrates the case of an allocation that's pinned to Cluster 2 because that's where the existing Cloud Service CS_1 or Availability Set is hosted.
![Allocation Diagram](./media/virtual-machines-allocation-failure/Allocation1.png)

### Why allocation failure happens
When an allocation request is pinned to a cluster, there's a higher chance of failing to find free resources since the available resource pool is smaller. Furthermore, if your allocation request is pinned to a cluster but the type of resource you requested is not supported by that cluster, your request will fail even if the cluster has free resource. Diagram 3 below illustrates the case where a pinned allocation fails because the only candidate cluster does not have free resources. Diagram 4 illustrates the case where a pinned allocation fails because the only candidate cluster does not support the requested VM size, even though the cluster has free resources.
![Pinned Allocation Failure](./media/virtual-machines-allocation-failure/Allocation2.png)

## Troubleshooting Azure Resource Management
Here are the common allocation scenarios that cause an allocation request to be pinned. We'll dive into each scenario later in this article.
- Resizing a VM, or adding additional VMs or role instances to an existing cloud service
- Restarting stopped (de-allocated) VMs - **partial** de-allocation
- Restarting stopped (de-allocated) VMs - **full** de-allocation

When you receive an allocation error, see if any of the scenario described applies to you. Use the allocation error returned by Azure platform to identify the corresponding scenario. If your request is pinned to an existing cluster, try removing some of the pinning constraints to open up your request to more clusters, thereby increasing the chance of allocation success.

In general, as long as the error does not indicate "the requested VM size is not supported", you can always retry at a later time, as enough resource may have been freed up in the cluster to accommodate your request. If the problem is the requested VM size is not supported, see below for workarounds.

### Allocation scenario: resizing a VM, or adding additional VMs to an existing Availability Set
**Error**

Upgrade_VMSizeNotSupported* or GeneralError*

**Cause of Cluster Pinning**

The request of resizing a VM, or adding a VM to an existing Availability Set has to be attempted at the original cluster that hosts the existing Availability Set. Creating a new Availability Set allows the Azure platform to find another cluster that has free resource or one that supports the VM size you requested.

**Workaround**

If the error is Upgrade_VMSizeNotSupported*, try a different VM size. If using a different VM size is not an option, stop all VMs in the Availability Set. This will allow you to change the size of the Virtual Machine which will allocate the VM to a cluster that supports the desired VM size.

If the error is GeneralError*, it's likely that the type of resource (such as a particular VM size) is supported by the cluster but the cluster does not have free resources at the moment. If the VM can be part of a different Availability Set, create a new VM in a different Availability Set (in the same region). This new VM can then be added to the same Virtual Network.  

### Allocation scenario: restarting stopped (de-allocated) VMs - partial de-allocation
**Error**

GeneralError*

**Cause of Cluster Pinning**

**Partial** de-allocation means you stopped (de-allocated) one or more, but **not all** VMs in an Availability Set. When you stop (de-allocate) a VM, the associated resources are released. Restarting that stopped (de-allocated) VM is therefore a new allocation request. Restarting VMs in a partially de-allocated Availability Set is equivalent to adding VMs to an existing Availability Set and the allocation request has to be attempted at the original cluster that hosts the existing Availability Set.

**Workaround**

Try stopping all VMs in the Availability Set before restarting the first one. This will ensure that a new allocation attempt is run and a new cluster can be selected which has available capacity.

### Allocation scenario: restarting stopped (de-allocated) VMs - full de-allocation
**Error**

GeneralError*

**Cause of Cluster Pinning**

**Full** de-allocation means you stopped (de-allocated) **all** VM in an Availability Set. The allocation request for restarting these VMs will target all clusters that support the desired size.

**Workaround**

Try selecting a new VM size to allocate. If not, please try again later.

## Troubleshooting Azure Service Management
Here are the common allocation scenarios that cause an allocation request to be pinned. We'll dive into each scenario later in this article.
- Resizing a VM, or adding additional VMs or role instances to an existing cloud service
- Restarting stopped (de-allocated) VMs - partial de-allocation
- Restarting stopped (de-allocated) VMs - full de-allocation
- Staging/production deployments (platform-as-a-service only)
- Affinity group - VM/service proximity
- Affinity-group-based virtual network

When you receive an allocation error, see if any of the scenario described applies to you. Use the allocation error returned by Azure platform to identify the corresponding scenario. If your request is pinned, try removing some of the pinning constraints to open up your request to more clusters, thereby increasing the chance of allocation success.

In general, as long as the error does not indicate "the requested VM size is not supported", you can always retry at a later time, as enough resource may have been freed up in the cluster to accommodate your request. If the problem is the requested VM size is not supported, try a different VM size; otherwise, the only option is to remove the pinning constraint.

Two common failure scenarios are related to Affinity Group. In the past, Affinity Group was used to provide close proximity to VMs/service instances, or it was used to enable the creation of Virtual Network (VNet). With the introduction of Regional Virtual Network, Affinity Group is no longer required to create a Virtual Network. With the reduction of network latency in Azure infrastructure, the recommendation of using Affinity Group for VM/service proximity has changed.

Diagram 5 below presents the taxonomy of the (pinned) allocation scenarios.
![Pinned Allocation Taxonomy](./media/virtual-machines-allocation-failure/Allocation3.png)

> [AZURE.NOTE] The error listed in each allocation scenario is a short form. Refer to the [Appendix](#appendix) for detailed error strings.

### Allocation scenario: resizing a VM, or adding additional VMs or role instances to an existing cloud service
**Error**

Upgrade_VMSizeNotSupported* or GeneralError*

**Cause of Cluster Pinning**

The request of resizing a VM, or adding a VM or a role instance to an existing Cloud Service has to be attempted at the original cluster that hosts the existing Cloud Service. Creating a new Cloud Service allows the Azure platform to find another cluster that has free resource or one that supports the VM size you requested.

**Workaround**

If the error is Upgrade_VMSizeNotSupported*, try a different VM size. If using a different VM size is not an option, but if it's acceptable to use a different virtual IP address (VIP), create a new Cloud Service to host the new VM, and add the new Cloud Service to the Regional Virtual Network where the existing VMs are running. If your existing Cloud Service does not use Regional Virtual Network, you can still create a new Virtual Network for the new Cloud Service, and then connect your [existing VNet to the new VNet](https://azure.microsoft.com/en-us/blog/vnet-to-vnet-connecting-virtual-networks-in-azure-across-different-regions/). See more about [Regional Virtual Network](http://azure.microsoft.com/blog/2014/05/14/regional-virtual-networks/).

If the error is GeneralError*, it's likely that the type of resource (such as a particular VM size) is supported by the cluster but the cluster does not have free resource at the moment. Similar to above, try adding the desired compute resource through creating a new Cloud Service (note the new Cloud Service has to use a different VIP) and use Regional Virtual Network to connect your Cloud Services.

### Allocation scenario: restarting stopped (de-allocated) VMs - partial de-allocation

**Error**

GeneralError*

**Cause of Cluster Pinning**

**Partial** de-allocation means you stopped (de-allocated) one or more, but **not all** VMs in a Cloud Service. When you stop (de-allocate) a VM, the associated resources are released. Restarting that stopped (de-allocated) VM is therefore a new allocation request. Restarting VMs in a partially de-allocated Cloud Service is equivalent to adding VMs to an existing Cloud Service and the allocation request has to be attempted at the original cluster that hosts the existing Cloud Service. Creating a different Cloud Service allows the Azure platform to find another cluster that has free resource or one that supports the VM size you requested.

**Workaround**

If it's acceptable to use a different VIP, delete the stopped (de-allocated) VMs (but keep the associated disks) and add the VMs back through a different Cloud Service. Use Regional Virtual Network to connect your Cloud Services:
1.	If your existing Cloud Service uses Regional Virtual Network, simply add the new Cloud Service to the same Virtual Network.
2.	If your existing Cloud Service does not use Regional Virtual Network, create a new Virtual Network for the new Cloud Service, and then [connect your existing VNet to the new VNet](https://azure.microsoft.com/en-us/blog/vnet-to-vnet-connecting-virtual-networks-in-azure-across-different-regions/). See more about [Regional Virtual Network](http://azure.microsoft.com/blog/2014/05/14/regional-virtual-networks/).

### Allocation scenario: restarting stopped (de-allocated) VMs - full de-allocation
**Error**

GeneralError*

**Cause of Cluster Pinning**

**Full** de-allocation means you stopped (de-allocated) **all** VMs from a Cloud Service. As of now, the allocation requests for restarting these VMs have to be attempted at the original cluster that hosts the Cloud Service. Creating a new Cloud Service allows the Azure platform to find another cluster that has free resource or one that supports the VM size you requested.

**Workaround**

If it's acceptable to use a different VIP, delete the original stopped (de-allocated) VMs (but keep the associated disks) and delete the corresponding Cloud Service (the associated compute resources were already released when you stopped (de-allocated) the VMs). Create a new Cloud Service to add the VMs back.

### Allocation scenario: Staging/production deployments (platform-as-a-service only)
**Error**

New_General* or New_VMSizeNotSupported*

**Cause of Cluster Pinning**

The Staging deployment and the Production deployment of a Cloud Service are hosted in the same cluster. When you add the second deployment, the corresponding allocation request will be attempted in the same cluster that hosts the first deployment.

**Workaround**

If it's acceptable, delete the first deployment and the original Cloud Service, and redeploy the Cloud Service. This action may land the first deployment in a cluster that has enough free resource to fit both deployments or in a cluster that support the VM sizes you requested.

### Allocation scenario: affinity group - VM/service proximity
**Error**

New_General* or New_VMSizeNotSupported*

**Cause of Cluster Pinning**

Any compute resource assigned to an Affinity Group is tied to one cluster. New compute resource requests in that Affinity Group are attempted in the same cluster where the existing resources are hosted. This is true regardless the new resources are created through a new Cloud Service or an existing Cloud Service.

**Workaround**

If it's not necessary, do not use Affinity Group, or try grouping your compute resources in multiple Affinity Groups.

### Allocation scenario: affinity-group-based virtual network
**Error**

New_General* or New_VMSizeNotSupported*

**Cause of Cluster Pinning**

Before Regional Virtual Network is announced, you were required to associate a Virtual Network with an Affinity Group. As a result, compute resources placed into the Affinity Group are bound by the same constraints as described in the "Allocation scenario: affinity Group - VM/Service Proximity" section above - the compute resources are tied to one cluster.

**Workaround**

If you do not need the Affinity Group, create a new Regional Virtual Network for the new resources you're adding, and then [connect your existing VNet to the new VNet](https://azure.microsoft.com/en-us/blog/vnet-to-vnet-connecting-virtual-networks-in-azure-across-different-regions/). See more about [Regional Virtual Network](http://azure.microsoft.com/blog/2014/05/14/regional-virtual-networks/).

Alternatively, you can [migrate your Affinity-Group-based Virtual Network to Regional Virtual Network](http://azure.microsoft.com/blog/2014/11/26/migrating-existing-services-to-regional-scope/), and then try adding the desired resources again.

## Appendix
### Error String Lookup
**New_VMSizeNotSupported***

The VM size (or combination of VM sizes) required by this deployment cannot be provisioned due to deployment request constraints. If possible, try relaxing constraints such as virtual network bindings, deploying to a hosted service with no other deployment in it and to a different affinity group or with no affinity group, or try deploying to a different region.

**New_General***

Allocation failed; unable to satisfy constraints in request. The requested new service deployment is bound to an Affinity Group, or it targets a Virtual Network, or there is an existing deployment under this hosted service. Any of these conditions constrains the new deployment to specific Azure resources. Please retry later or try reducing the VM size or number of role instances. Alternatively, if possible, remove the aforementioned constraints or try deploying to a different region.

**Upgrade_VMSizeNotSupported***

Unable to upgrade the deployment. The requested VM size XXX may not be available in the resources supporting the existing deployment. Please try again later, try with a different VM size or smaller number of role instances, or create a deployment under an empty hosted service with a new affinity group or no affinity group binding.

**GeneralError***

The server encountered an internal error. Please retry the request." or "Failed to produce an allocation for the service.

## Additional resources
### Contact Azure Customer Support

If this article didn’t help to solve your Azure issue, browse the Azure forums on [MSDN and Stack Overflow](http://azure.microsoft.com/support/forums/).
You can also file an Azure support incident about your issue. Go to the [Azure Support](http://azure.microsoft.com/support/options/) site and click Get Support. For information about using Azure Support, read the[ Microsoft Azure Support FAQ](http://azure.microsoft.com/support/faq/).
