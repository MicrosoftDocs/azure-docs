---
title: Troubleshoot OverconstrainedAllocationRequest when deploying a cloud service to Azure | Microsoft Docs
description: This article shows how to resolve an OverconstrainedAllocationRequest exception when deploying a cloud service to Azure.
services: cloud-services
documentationcenter: ''
author: mibufo
ms.author: v-mibufo
ms.service: cloud-services
ms.topic: troubleshooting
ms.date: 02/04/2020
---

# Troubleshoot OverconstrainedAllocationRequest when deploying a cloud service to Azure

In this article, you will troubleshoot over constrained allocation failures prevent deployment an Azure Cloud Service.

When you're upgrading, adding new web or worker role instances, or deploying instances to a cloud service, Microsoft Azure allocates compute resources. You may occasionally receive errors when performing these operations even before you reach the Azure subscription limit.

> [!TIP]
> The information may also be useful when you plan the deployment of your services.

## Symptom

In Azure Portal, navigate to your cloud service and in the sidebar select *Operation logs (classic)* to view the logs.

When inspecting the logs of your cloud service, you will see the the following exception:

|Exception Type  |Error Message  |
|---------|---------|
|OverconstrainedAllocationRequest |The VM size (or combination of VM sizes) required by this deployment cannot be provisioned due to deployment request constraints. If possible, try relaxing constraints such as virtual network bindings, deploying to a hosted service with no other deployment in it and to a different affinity group or with no affinity group, or try deploying to a different region.|

## Cause

The cloud service is pinned to a resource pool that lacks the capacity to allocate further resources. The cause varies depending upon if the cloud service is **pinned** or **not pinned**.

- **Not pinned**: When deploying a cloud service for the first time, the cloud service has specified an improper SKU or subscription. The SKU size may not be available in the region specified, or the subscription that's selected isn't enabled.
- **Pinned:** When scaling or deploying a staging/production slot of an existing cloud service, Azure cannot locate any available resources to deploy to.

> [!NOTE]
> When the first node of a cloud service is deployed, it is *pinned* to a resource pool. A resource pool may be a single cluster, or a group of clusters.
>
> Over time, the resources in this resource pool may become fully utilized. If a cloud service makes an allocation request for additional resources when insufficient resources are available in the pinned resource pool, the request will result in an [allocation failure](cloud-services-allocation-failure.md).

## Solution

Follow the guidance for allocation failures in the following scenarios:

- [Failures from a first deployment of a new cloud service *(Not_Pinned)*](#not-pinned-to-a-cluster)
- [Failures from existing cloud services *(Pinned)*](#pinned-to-a-cluster)

### Not pinned to a cluster

If you are performing a first deployment of a cloud service, the cluster hasn't been selected yet, so the cloud service isn't *pinned*. Azure may encounter a deployment failure because you have selected a particular size that isn't available in the region, or if the combination of sizes that are needed across different roles isn't available in the region.

When you encounter an allocation error in this scenario, the recommended course of action is to check the available sizes in the region and change the size you previously specified.

1. You can check the sizes available in a region on the [Cloud Services Products](https://azure.microsoft.com/global-infrastructure/services/?products=cloud-services) page.

    > [!NOTE]
    > The *Products* page won't show the available capacity. For any new allocation, Azure should be able to pick the optimal cluster in your region at that point in time.

1. Update the service definition file for your cloud service to specify a different [product size](cloud-services-sizes-specs#configure-sizes-for-cloud-services) from your region.

### Pinned to a cluster

Existing cloud services are *pinned* to a cluster, so if you deploy a staging or productions slot, or if you are scaling the cloud service, Azure may encounter an allocation failure.

When you encounter an allocation error in this scenario, the recommended course of action is to redeploy to a new cloud service (and update the *CNAME*).

> [!TIP]
> This solution is likely to be most successful as it allows the platform to choose from all clusters in that region.

> [!NOTE]
> This solution should incur zero downtime.

1. Deploy the workload to a new cloud service.
    - See the [How to create and deploy a cloud service](cloud-services-how-to-create-deploy-portal.md) guide for further instructions.
    
    > [!WARNING]
    > If you do not want to lose the IP address associated with this deployment slot, you can follow the steps to [keep the IP address](#keep-the-ip-address-(optional)).

1. Update the *CNAME* or *A* record to point traffic to the new cloud service.
    - See the [Configuring a custom domain name for an Azure cloud service (classic)](cloud-services-custom-domain-name-portal.md#understand-cname-and-a-records) guide for further instructions.

1. Once zero traffic is going to the old site, you can delete the old cloud service.
    - See the [Delete deployments and a cloud service](cloud-services-how-to-manage-portal.md#delete-deployments-and-a-cloud-service) guide for further instructions.
    - To see the network traffic in your cloud service, see the [Introduction to Cloud Service (classic) Monitoring](cloud-services-how-to-monitor.md).

See [Troubleshooting Cloud Service allocation failures | Microsoft Docs](cloud-services-allocation-failures.md#common-issues) for further remediation steps.

#### Keep the IP address (optional)

1. [Reserve the IP address](https://docs.microsoft.com/azure/virtual-network/virtual-networks-reserved-public-ip) of the existing deployment slot.
1. Release the associated reserved IP address.
1. Delete the deployment slot.
1. Perform a new deployment to that slot.
    - See the [How to create and deploy a cloud service](cloud-services-how-to-create-deploy-portal.md) guide for further instructions.
1. You can now associate the required reserved IP to this cloud service deployment.
 
For further information on reserved IP addresses, see the [reserved IP addresses for cloud services](https://azure.microsoft.com/blog/reserved-ip-addresses/) guide.

## Next steps

For additional allocation failure solutions and to better understand how they are generated:

> [!div class="nextstepaction"]
> [Allocation failures (cloud services)](cloud-services-allocation-failures.md)

If your Azure issue is not addressed in this article, visit the Azure forums on [MSDN and Stack Overflow](https://azure.microsoft.com/support/forums/). You can post your issue in these forums, or post to [@AzureSupport on Twitter](https://twitter.com/AzureSupport). You also can submit an Azure support request. To submit a support request, on the [Azure support](https://azure.microsoft.com/support/options/) page, select *Get support*.