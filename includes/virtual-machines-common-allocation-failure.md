
If your Azure issue is not addressed in this article, visit the [Azure forums on MSDN and Stack Overflow](https://azure.microsoft.com/support/forums/). You can post your issue on these forums or to @AzureSupport on Twitter. Also, you can file an Azure support request by selecting **Get support** on the [Azure support](https://azure.microsoft.com/support/options/) site.

## General troubleshooting steps
### Troubleshoot common allocation failures in the classic deployment model

These steps can help resolve many allocation failures in virtual machines:

- Resize the VM to a different VM size.<br>
	Click **Browse all** > **Virtual machines (classic)** > your virtual machine > **Settings** > **Size**. For detailed steps, see [Resize the virtual machine](https://msdn.microsoft.com/library/dn168976.aspx).

- Delete all VMs from the cloud service and re-create VMs.<br>
	Click **Browse all** > **Virtual machines (classic)** > your virtual machine > **Delete**. Then, click **New** > **Compute** > [virtual machine image].

### Troubleshoot common allocation failures in the Azure Resource Manager deployment model

These steps can help resolve many allocation failures in virtual machines:

- Stop (deallocate) all VMs in the same availability set, then restart each one.<br>
	To stop: Click **Resource groups** > your resource group > **Resources** > your availability set > **Virtual Machines** > your virtual machine > **Stop**.

	After all VMs stop, select the first VM and click **Start**.

## Background information
### How allocation works
The servers in Azure datacenters are partitioned into clusters. Normally, an allocation request is attempted in multiple clusters, but it's possible that certain constraints from the allocation request force the Azure platform to attempt the request in only one cluster. In this article, we'll refer to this as "pinned to a cluster." Diagram 1 below illustrates the case of a normal allocation that is attempted in multiple clusters. Diagram 2 illustrates the case of an allocation that's pinned to Cluster 2 because that's where the existing Cloud Service CS_1 or availability set is hosted.
![Allocation Diagram](./media/virtual-machines-common-allocation-failure/Allocation1.png)

### Why allocation failures happen
When an allocation request is pinned to a cluster, there's a higher chance of failing to find free resources since the available resource pool is smaller. Furthermore, if your allocation request is pinned to a cluster but the type of resource you requested is not supported by that cluster, your request will fail even if the cluster has free resources. Diagram 3 below illustrates the case where a pinned allocation fails because the only candidate cluster does not have free resources. Diagram 4 illustrates the case where a pinned allocation fails because the only candidate cluster does not support the requested VM size, even though the cluster has free resources.

![Pinned Allocation Failure](./media/virtual-machines-common-allocation-failure/Allocation2.png)

## Detailed troubleshoot steps specific allocation failure scenarios in the classic deployment model
Here are common allocation scenarios that cause an allocation request to be pinned. We'll dive into each scenario later in this article.

- Resize a VM or add VMs or role instances to an existing cloud service
- Restart partially stopped (deallocated) VMs
- Restart fully stopped (deallocated) VMs
- Staging/production deployments (platform as a service only)
- Affinity group (VM/service proximity)
- Affinity-group-based virtual network

When you receive an allocation error, see if any of the scenarios described apply to your error. Use the allocation error returned by the Azure platform to identify the corresponding scenario. If your request is pinned, remove some of the pinning constraints to open your request to more clusters, thereby increasing the chance of allocation success.

In general, as long as the error does not indicate "the requested VM size is not supported," you can always retry at a later time, as enough resources may have been freed in the cluster to accommodate your request. If the problem is that the requested VM size is not supported, try a different VM size. Otherwise, the only option is to remove the pinning constraint.

Two common failure scenarios are related to affinity groups. In the past, an affinity group was used to provide close proximity to VMs/service instances, or it was used to enable the creation of a virtual network. With the introduction of regional virtual networks, affinity groups are no longer required to create a virtual network. With the reduction of network latency in Azure infrastructure, the recommendation to use affinity groups for VM/service proximity has changed.

Diagram 5 below presents the taxonomy of the (pinned) allocation scenarios.
![Pinned Allocation Taxonomy](./media/virtual-machines-common-allocation-failure/Allocation3.png)

> [AZURE.NOTE] The error listed in each allocation scenario is a short form. Refer to the [Error string lookup](#Error string lookup) for detailed error strings.

## Allocation scenario: Resize a VM or add VMs or role instances to an existing cloud service
**Error**

Upgrade_VMSizeNotSupported or GeneralError

**Cause of cluster pinning**

A request to resize a VM or add a VM or a role instance to an existing cloud service has to be attempted at the original cluster that hosts the existing cloud service. Creating a new cloud service allows the Azure platform to find another cluster that has free resources or supports the VM size that you requested.

**Workaround**

If the error is Upgrade_VMSizeNotSupported*, try a different VM size. If using a different VM size is not an option, but if it's acceptable to use a different virtual IP address (VIP), create a new cloud service to host the new VM and add the new cloud service to the regional virtual network where the existing VMs are running. If your existing cloud service does not use a regional virtual network, you can still create a new virtual network for the new cloud service, and then connect your [existing virtual network to the new virtual network](https://azure.microsoft.com/blog/vnet-to-vnet-connecting-virtual-networks-in-azure-across-different-regions/). See more about [regional virtual networks](https://azure.microsoft.com/blog/2014/05/14/regional-virtual-networks/).

If the error is GeneralError*, it's likely that the type of resource (such as a particular VM size) is supported by the cluster, but the cluster does not have free resources at the moment. Similar to the above scenario, add the desired compute resource through creating a new cloud service (note that the new cloud service has to use a different VIP) and use a regional virtual network to connect your cloud services.

## Allocation scenario: Restart partially stopped (deallocated) VMs

**Error**

GeneralError*

**Cause of cluster pinning**

Partial deallocation means that you stopped (deallocated) one or more, but not all, VMs in a cloud service. When you stop (deallocate) a VM, the associated resources are released. Restarting that stopped (deallocated) VM is therefore a new allocation request. Restarting VMs in a partially deallocated cloud service is equivalent to adding VMs to an existing cloud service. The allocation request has to be attempted at the original cluster that hosts the existing cloud service. Creating a different cloud service allows the Azure platform to find another cluster that has free resource or supports the VM size that you requested.

**Workaround**

If it's acceptable to use a different VIP, delete the stopped (deallocated) VMs (but keep the associated disks) and add the VMs back through a different cloud service. Use a regional virtual network to connect your cloud services:
- If your existing cloud service uses a regional virtual network, simply add the new cloud service to the same virtual network.
- If your existing cloud service does not use a regional virtual network, create a new virtual network for the new cloud service, and then [connect your existing virtual network to the new virtual network](https://azure.microsoft.com/blog/vnet-to-vnet-connecting-virtual-networks-in-azure-across-different-regions/). See more about [regional virtual networks](https://azure.microsoft.com/blog/2014/05/14/regional-virtual-networks/).

## Allocation scenario: Restart fully stopped (deallocated) VMs
**Error**

GeneralError*

**Cause of cluster pinning**

Full deallocation means that you stopped (deallocated) all VMs from a cloud service. The allocation requests to restart these VMs have to be attempted at the original cluster that hosts the cloud service. Creating a new cloud service allows the Azure platform to find another cluster that has free resources or supports the VM size that you requested.

**Workaround**

If it's acceptable to use a different VIP, delete the original stopped (deallocated) VMs (but keep the associated disks) and delete the corresponding cloud service (the associated compute resources were already released when you stopped (deallocated) the VMs). Create a new cloud service to add the VMs back.

## Allocation scenario: Staging/production deployments (platform as a service only)
**Error**

New_General* or New_VMSizeNotSupported*

**Cause of cluster pinning**

The staging deployment and the production deployment of a cloud service are hosted in the same cluster. When you add the second deployment, the corresponding allocation request will be attempted in the same cluster that hosts the first deployment.

**Workaround**

Delete the first deployment and the original cloud service and redeploy the cloud service. This action may land the first deployment in a cluster that has enough free resources to fit both deployments or in a cluster that supports the VM sizes that you requested.

## Allocation scenario: Affinity group (VM/service proximity)
**Error**

New_General* or New_VMSizeNotSupported*

**Cause of cluster pinning**

Any compute resource assigned to an affinity group is tied to one cluster. New compute resource requests in that affinity group are attempted in the same cluster where the existing resources are hosted. This is true whether the new resources are created through a new cloud service or through an existing cloud service.

**Workaround**

If an affinity group is not necessary, do not use an affinity group, or group your compute resources into multiple affinity groups.

## Allocation scenario: Affinity-group-based virtual network
**Error**

New_General* or New_VMSizeNotSupported*

**Cause of cluster pinning**

Before regional virtual networks were introduced, you were required to associate a virtual network with an affinity group. As a result, compute resources placed into an affinity group are bound by the same constraints as described in the "Allocation scenario: Affinity group (VM/service proximity)" section above. The compute resources are tied to one cluster.

**Workaround**

If you do not need an affinity group, create a new regional virtual network for the new resources you're adding, and then [connect your existing virtual network to the new virtual network](https://azure.microsoft.com/blog/vnet-to-vnet-connecting-virtual-networks-in-azure-across-different-regions/). See more about [regional virtual networks](https://azure.microsoft.com/blog/2014/05/14/regional-virtual-networks/).

Alternatively, you can [migrate your affinity-group-based virtual network to a regional virtual network](https://azure.microsoft.com/blog/2014/11/26/migrating-existing-services-to-regional-scope/), and then add the desired resources again.

## Detailed troubleshooting steps specific allocation failure scenarios in the Azure Resource Manager deployment model
Here are common allocation scenarios that cause an allocation request to be pinned. We'll dive into each scenario later in this article.

- Resize a VM or add VMs or role instances to an existing cloud service
- Restart partially stopped (deallocated) VMs
- Restart fully stopped (deallocated) VMs

When you receive an allocation error, see if any of the scenarios described apply to your error. Use the allocation error returned by the Azure platform to identify the corresponding scenario. If your request is pinned to an existing cluster, remove some of the pinning constraints to open your request to more clusters, thereby increasing the chance of allocation success.

In general, as long as the error does not indicate "the requested VM size is not supported," you can always retry at a later time, as enough resources may have been freed in the cluster to accommodate your request. If the problem is that the requested VM size is not supported, see below for workarounds.

## Allocation scenario: Resize a VM or add VMs to an existing availability set
**Error**

Upgrade_VMSizeNotSupported* or GeneralError*

**Cause of cluster pinning**

A request to resize a VM or add a VM to an existing availability set has to be attempted at the original cluster that hosts the existing availability set. Creating a new availability set allows the Azure platform to find another cluster that has free resources or supports the VM size that you requested.

**Workaround**

If the error is Upgrade_VMSizeNotSupported*, try a different VM size. If using a different VM size is not an option, stop all VMs in the availability set. You can then change the size of the virtual machine that will allocate the VM to a cluster that supports the desired VM size.

If the error is GeneralError*, it's likely that the type of resource (such as a particular VM size) is supported by the cluster, but the cluster does not have free resources at the moment. If the VM can be part of a different availability set, create a new VM in a different availability set (in the same region). This new VM can then be added to the same virtual network.  

## Allocation scenario: Restart partially stopped (deallocated) VMs
**Error**

GeneralError*

**Cause of cluster pinning**

Partial deallocation means that you stopped (deallocated) one or more, but not all, VMs in an availability set. When you stop (deallocate) a VM, the associated resources are released. Restarting that stopped (deallocated) VM is therefore a new allocation request. Restarting VMs in a partially deallocated availability set is equivalent to adding VMs to an existing availability set. The allocation request has to be attempted at the original cluster that hosts the existing availability set.

**Workaround**

Stop all VMs in the availability set before restarting the first one. This will ensure that a new allocation attempt is run and that a new cluster can be selected that has available capacity.

## Allocation scenario: Restart fully stopped (deallocated)
**Error**

GeneralError*

**Cause of cluster pinning**

Full deallocation means that you stopped (deallocated) all VMs in an availability set. The allocation request to restart these VMs will target all clusters that support the desired size.

**Workaround**

Select a new VM size to allocate. If this does not work, please try again later.

## Error string lookup
**New_VMSizeNotSupported***

"The VM size (or combination of VM sizes) required by this deployment cannot be provisioned due to deployment request constraints. If possible, try relaxing constraints such as virtual network bindings, deploying to a hosted service with no other deployment in it and to a different affinity group or with no affinity group, or try deploying to a different region."

**New_General***

"Allocation failed; unable to satisfy constraints in request. The requested new service deployment is bound to an affinity group, or it targets a virtual network, or there is an existing deployment under this hosted service. Any of these conditions constrains the new deployment to specific Azure resources. Please retry later or try reducing the VM size or number of role instances. Alternatively, if possible, remove the aforementioned constraints or try deploying to a different region."

**Upgrade_VMSizeNotSupported***

"Unable to upgrade the deployment. The requested VM size XXX may not be available in the resources supporting the existing deployment. Please try again later, try with a different VM size or smaller number of role instances, or create a deployment under an empty hosted service with a new affinity group or no affinity group binding."

**GeneralError***

"The server encountered an internal error. Please retry the request." Or "Failed to produce an allocation for the service."
