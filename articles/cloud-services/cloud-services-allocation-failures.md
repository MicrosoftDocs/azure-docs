<properties
	pageTitle="Troubleshooting Cloud Service allocation failure | Microsoft Azure"
	description="Troubleshooting allocation failure when you deploy Cloud Services in Azure"
	services="azure-service-management, cloud-services"
	documentationCenter=""
	authors="simonxjx"
	manager="felixwu"
	editor=""
	tags="top-support-issue"/>

<tags
	ms.service="cloud-services"
	ms.workload="na"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/14/2016"
	ms.author="v-six"/>



# Troubleshooting allocation failure when you deploy Cloud Services in Azure

## Summary
When you deploy instances to a Cloud Service or add new web or worker role instances, Microsoft Azure allocates compute resources. You may occasionally receive errors when performing these operations even before you reach the Azure subscription limits. This article explains the causes of some of the common allocation failures and suggests possible remediation. The information may also be useful when you plan the deployment of your services.

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

### Background – How allocation works
The servers in Azure datacenters are partitioned into clusters. A new cloud service allocation request is attempted in multiple clusters. When the first instance is deployed to a cloud service(in either staging or production), that cloud service gets pinned to a cluster. Any further deployments for the cloud service will happen in the same cluster. In this article, we'll refer to this as "pinned to a cluster". Diagram 1 below illustrates the case of a normal allocation which is attempted in multiple clusters; Diagram 2 illustrates the case of an allocation that's pinned to Cluster 2 because that's where the existing Cloud Service CS_1 is hosted.

![Allocation Diagram](./media/cloud-services-allocation-failure/Allocation1.png)

### Why allocation failure happens
When an allocation request is pinned to a cluster, there's a higher chance of failing to find free resources since the available resource pool is limited to a cluster. Furthermore, if your allocation request is pinned to a cluster but the type of resource you requested is not supported by that cluster, your request will fail even if the cluster has free resource. Diagram 3 below illustrates the case where a pinned allocation fails because the only candidate cluster does not have free resources. Diagram 4 illustrates the case where a pinned allocation fails because the only candidate cluster does not support the requested VM size, even though the cluster has free resources.

![Pinned Allocation Failure](./media/cloud-services-allocation-failure/Allocation2.png)

## Troubleshooting allocation failure for cloud services
### Error Message
You may see the following error message:

	"Azure operation '{operation id}' failed with code Compute.ConstrainedAllocationFailed. Details: Allocation failed; unable to satisfy constraints in request. The requested new service deployment is bound to an Affinity Group, or it targets a Virtual Network, or there is an existing deployment under this hosted service. Any of these conditions constrains the new deployment to specific Azure resources. Please retry later or try reducing the VM size or number of role instances. Alternatively, if possible, remove the aforementioned constraints or try deploying to a different region."

### Common Issues
Here are the common allocation scenarios that cause an allocation request to be pinned to a single cluster.

- Deploying to Staging Slot - If a cloud service has a deployment in either slot, then the entire cloud service is pinned to a specific cluster.  This means that if a deployment already exists in the production slot, then a new staging deployment can only be allocated in the same cluster as the production slot. If the cluster is nearing capacity, the request may fail.

- Scaling - Adding new instances to an existing cloud service must allocate in the same cluster.  Small scaling requests can usually be allocated, but not always. If the cluster is nearing capacity, the request may fail.

- Affinity Group - A new deployment to an empty cloud service can be allocated by the fabric in any cluster in that region, unless the cloud service is pinned to an affinity group. Deployments to the same affinity group will be attempted on the same cluster. If the cluster is nearing capacity, the request may fail.

- Affinity Group vNet - Older Virtual Networks were tied to affinity groups instead of regions, and cloud services in these Virtual Networks would be pinned to the affinity group cluster. Deployments to this type of virtual network will be attempted on the pinned cluster. If the cluster is nearing capacity, the request may fail.

## Solutions

1. Redeploy to a new cloud service - This solution is likely to be most successful as it allows the platform to choose from all clusters in that region.

	- Deploy the workload to a new cloud service  

	- Update the CNAME or A record to point traffic to the new cloud service

	- Once zero traffic is going to the old site, you can delete the old cloud service. This solution should incur zero downtime.

2. Delete both production and staging slots - This solution will preserve your existing DNS name, but will cause downtime to your application.

	- Delete the production and staging slots of an existing cloud service so that the cloud service is empty, and then

	- Create a new deployment in the existing cloud service. This will re-attempt to allocation on all clusters in the region. Ensure the cloud service is not tied to an affinity group.

3. Reserved IP -  This solution will preserve your existing IP address, but will cause downtime to your application.  

	- Create a ReservedIP for your existing deployment using Powershell

	```
	New-AzureReservedIP -ReservedIPName {new reserved IP name} -Location {location} -ServiceName {existing service name}
	```

	- Follow #2 from above, making sure to specify the new ReservedIP in the service's CSCFG.

4. Remove affinity group for new deployments - Affinity Groups are no longer recommended. Follow steps for #1 above to deploy a new cloud service. Ensure cloud service is not in an affinity group.

5. Convert to a Regional Virtual Network - See [How to migrate from Affinity Groups to a Regional Virtual Network (VNet)](../virtual-network/virtual-networks-migrate-to-regional-vnet.md).
