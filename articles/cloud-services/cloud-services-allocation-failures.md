---
title: Troubleshooting Cloud Service (classic) allocation failures | Microsoft Docs
description: Troubleshoot an allocation failure when you deploy Azure Cloud Services. Learn how allocation works and why allocation can fail.
ms.topic: troubleshooting
ms.service: azure-cloud-services-classic
ms.date: 07/23/2024
author: hirenshah1
ms.author: hirshah
ms.custom: compute-evergreen
---

# Troubleshooting allocation failure when you deploy Cloud Services (classic) in Azure

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]


## Summary

When you deploy instances to a Cloud Service or add new web or worker role instances, Microsoft Azure allocates compute resources. You may occasionally receive errors when performing these operations even before you reach the Azure subscription limits. This article explains the causes of some of the common allocation failures and suggests possible remediation. The information can also be useful when you plan the deployment of your services.

### Background – How allocation works

The servers in Azure datacenters are partitioned into clusters. A new cloud service allocation request is attempted in multiple clusters. When the first instance is deployed to a cloud service(in either staging or production), that cloud service gets pinned to a cluster. Any further deployments for the cloud service happen in the same cluster. In this article, we refer to this state as "pinned to a cluster." The following diagram illustrates the case of a normal allocation, which is attempted in multiple clusters. The second diagram illustrates the case of an allocation pinned to Cluster 2 because that's where the existing Cloud Service CS_1 is hosted.

![Allocation Diagram](./media/cloud-services-allocation-failure/Allocation1.png)

### Why allocation failure happens

When an allocation request is pinned to a cluster, there's a higher chance of failing to find free resources since the available resource pool is limited to a cluster. Furthermore, if your allocation request is pinned to a cluster but the cluster doesn't support the resource type you requested, your request fails even if the cluster has free resource. The next diagram illustrates the case where a pinned allocation fails because the only candidate cluster doesn't have free resources. Diagram 4 illustrates the case where a pinned allocation fails because the only candidate cluster doesn't support the requested virtual machine (VM) size, even though the cluster has free resources.

![Pinned Allocation Failure](./media/cloud-services-allocation-failure/Allocation2.png)

## Troubleshooting allocation failure for cloud services

### Error Message

In Azure portal, navigate to your cloud service and in the sidebar select *Operation logs (classic)* to view the logs.

See these further solutions for the exceptions:

|Exception Type  |Error Message  |Solution  |
|---------|---------|---------|
|FabricInternalServerError     |Operation failed with error code 'InternalError' and errorMessage 'The server encountered an internal error. Please retry the request.'|[Troubleshoot FabricInternalServerError](cloud-services-troubleshoot-fabric-internal-server-error.md)|
|ServiceAllocationFailure     |Operation failed with error code 'InternalError' and errorMessage 'The server encountered an internal error. Please retry the request.'|[Troubleshoot ServiceAllocationFailure](cloud-services-troubleshoot-fabric-internal-server-error.md)|
|LocationNotFoundForRoleSize     |The operation '`{Operation ID}`' failed: 'The requested VM tier is currently not available in Region (`{Region ID}`) for this subscription. Please try another tier or deploy to a different location.'|[Troubleshoot LocationNotFoundForRoleSize](cloud-services-troubleshoot-location-not-found-for-role-size.md)|
|ConstrainedAllocationFailed     |Azure operation '`{Operation ID}`' failed with code Compute.ConstrainedAllocationFailed. Details: Allocation failed; unable to satisfy constraints in request. The requested new service deployment is bound to an Affinity Group, or it targets a Virtual Network, or there's an existing deployment under this hosted service. Any of these conditions constrains the new deployment to specific Azure resources. Please retry later or try reducing the VM size or number of role instances. Alternatively, if possible, remove the constraints or try deploying to a different region.|[Troubleshoot ConstrainedAllocationFailed](cloud-services-troubleshoot-constrained-allocation-failed.md)|
|OverconstrainedAllocationRequest     |The VM size (or combination of VM sizes) required by this deployment can't be provisioned due to deployment request constraints. If possible, try relaxing constraints such as virtual network bindings, deploying to a hosted service with no other deployment in it and to a different affinity group or with no affinity group, or try deploying to a different region.|[Troubleshoot OverconstrainedAllocationRequest](cloud-services-troubleshoot-overconstrained-allocation-request.md)|

Example error message:

> "Azure operation '{operation id}' failed with code Compute.ConstrainedAllocationFailed. Details: Allocation failed; unable to satisfy constraints in request. The requested new service deployment is bound to an Affinity Group, or it targets a Virtual Network, or there is an existing deployment under this hosted service. Any of these conditions constrains the new deployment to specific Azure resources. Please retry later or try reducing the VM size or number of role instances. Alternatively, if possible, remove the aforementioned constraints or try deploying to a different region."

### Common Issues

Here are the common allocation scenarios that cause an allocation request to be pinned to a single cluster.

* Deploying to Staging Slot - If a cloud service has a deployment in either slot, then the entire cloud service is pinned to a specific cluster. This means that if a deployment already exists in the production slot, then a new staging deployment can only be allocated in the same cluster as the production slot. If the cluster is nearing capacity, the request may fail.
* Scaling - Adding new instances to an existing cloud service must allocate in the same cluster. Small scaling requests can usually be allocated, but not always. If the cluster is nearing capacity, the request may fail.
* Affinity Group - The fabric in any cluster in that region can allocate a new deployment to an empty cloud service, unless the cloud service is pinned to an affinity group. Deployments attempt to use the same affinity group on the same cluster. If the cluster is nearing capacity, the request may fail.
* Affinity Group virtual network - Older Virtual Networks were tied to affinity groups instead of regions, and cloud services in these Virtual Networks would be pinned to the affinity group cluster. Attempted deployments to this type of virtual network occur on the pinned cluster. If the cluster is nearing capacity, the request may fail.

## Solutions

1. Redeploy to a new cloud service - This solution is likely to be most successful as it allows the platform to choose from all clusters in that region.

   * Deploy the workload to a new cloud service  
   * Update the CNAME or A record to point traffic to the new cloud service
   * Once zero traffic is going to the old site, you can delete the old cloud service. This solution should incur zero downtime.
2. Delete both production and staging slots - This solution preserves your existing Domain Name System (DNS) name but causes downtime to your application.

   * Delete the production and staging slots of an existing cloud service so that the cloud service is empty, and then
   * Create a new deployment in the existing cloud service. This solution reattempts allocation on all clusters in the region. Ensure the cloud service isn't tied to an affinity group.
3. Reserved IP -  This solution preserves your existing IP address but causes downtime to your application.  

   * Create a ReservedIP for your existing deployment using PowerShell

     ```azurepowershell
     New-AzureReservedIP -ReservedIPName {new reserved IP name} -Location {location} -ServiceName {existing service name}
     ```

   * Follow #2, making sure to specify the new ReservedIP in the service's CSCFG.
4. Remove affinity group for new deployments - Affinity Groups are no longer recommended. Follow steps for #1 to deploy a new cloud service. Ensure cloud service isn't in an affinity group.
5. Convert to a Regional Virtual Network - See [How to migrate from Affinity Groups to a Regional Virtual Network (virtual network)](/previous-versions/azure/virtual-network/virtual-networks-migrate-to-regional-vnet).
