---
title: Troubleshoot FabricInternalServerError or ServiceAllocationFailure when deploying a Cloud service (classic) to Azure | Microsoft Docs
description: This article shows how to resolve a FabricInternalServerError or ServiceAllocationFailure exception when deploying a Cloud service (classic) to Azure.
services: cloud-services
author: hirenshah1
ms.author: hirshah
ms.service: cloud-services
ms.topic: troubleshooting
ms.date: 02/21/2023
ms.custom: compute-evergreen
---

# Troubleshoot FabricInternalServerError or ServiceAllocationFailure when deploying a Cloud service (classic) to Azure

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

In this article, you'll troubleshoot allocation failures where the fabric controller cannot allocate when deploying an Azure Cloud service (classic).

When you deploy instances to a Cloud Service or add new web or worker role instances, Microsoft Azure allocates compute resources.

You may occasionally receive errors during these operations even before you reach the Azure subscription limit.

> [!TIP]
> The information may also be useful when you plan the deployment of your services.

## Symptom

In Azure portal, navigate to your Cloud service (classic) and in the sidebar select *Operation log (classic)* to view the logs.

![Image shows the Operation log (classic) blade.](./media/cloud-services-troubleshoot-fabric-internal-server-error/cloud-services-troubleshoot-allocation-logs.png)

When you're inspecting the logs of your Cloud service (classic), you'll see the following exception:

|Exception  |Error Message  |
|---------|---------|
FabricInternalServerError     |Operation failed with error code 'InternalError' and errorMessage 'The server encountered an internal error. Please retry the request.'.|
|ServiceAllocationFailure     |Operation failed with error code 'InternalError' and errorMessage 'The server encountered an internal error. Please retry the request.'.|

## Cause

*FabricInternalServerError* and *ServiceAllocationFailure* are exceptions that can occur when the fabric controller fails to allocate instances in the cluster. The root cause varies if the cloud service is **pinned** or **not pinned**.

- [**Not Pinned:** Failures from a first deployment of a new cloud service](#not-pinned-to-a-cluster)
- [**Pinned:** Failures from existing cloud services](#pinned-to-a-cluster)

> [!NOTE]
> When the first instance is deployed to a cloud service (in either staging or production), that cloud service gets pinned to a cluster.
>
> Over time, the resources in this resource pool may become fully utilized. If a cloud service makes an allocation request for additional resources when insufficient resources are available in the pinned resource pool, the request will result in an [allocation failure](cloud-services-allocation-failures.md).

## Solution

Follow the guidance for allocation failures in the following scenarios.

### Not pinned to a cluster

The first time you deploy a Cloud service (classic), the cluster hasn't been selected yet, so the cloud service isn't *pinned*. Azure may have a deployment failure because:

- You've selected a particular size that isn't available in the region.
- The combination of sizes that are needed across different roles isn't available in the region.

When you experience an allocation error in this scenario, the recommended course of action is to check the available sizes in the region and change the size you previously specified.

1. You can check the sizes available in a region on the [Cloud service (classic) products](https://azure.microsoft.com/global-infrastructure/services/?products=cloud-services) page.

    > [!NOTE]
    > The *Products* page won't show the available capacity. For any new allocation, Azure should be able to pick the optimal cluster in your region at that point in time.

1. Update the service definition file for your Cloud service (classic) to specify a different [product size](cloud-services-sizes-specs.md#configure-sizes-for-cloud-services) from your region.

### Pinned to a cluster

Existing cloud services are *pinned* to a cluster. Any further deployments for the Cloud service (classic) will happen in the same cluster.

When you experience an allocation error in this scenario, the recommended course of action is to redeploy to a new Cloud service (classic) (and update the *CNAME*).

> [!TIP]
> This solution is likely to be most successful as it allows the platform to choose from all clusters in that region.

> [!NOTE]
> This solution should incur zero downtime.

1. Deploy the workload to a new Cloud service (classic).
    - See the [How to create and deploy a Cloud service (classic)](cloud-services-how-to-create-deploy-portal.md) guide for further instructions.

    > [!WARNING]
    > If you do not want to lose the IP address associated with this deployment slot, you can use [Solution 3 - Keep the IP address](cloud-services-allocation-failures.md#solutions).

1. Update the *CNAME* or *A* record to point traffic to the new Cloud service (classic).
    - See the [Configuring a custom domain name for an Azure Cloud service (classic)](cloud-services-custom-domain-name-portal.md#understand-cname-and-a-records) guide for further instructions.

1. Once zero traffic is going to the old site, you can delete the old Cloud service (classic).
    - See the [Delete deployments and a Cloud service (classic)](cloud-services-how-to-manage-portal.md#delete-deployments-and-a-cloud-service) guide for further instructions.
    - To see the network traffic in your Cloud service (classic), see the [Introduction to Cloud service (classic) monitoring](cloud-services-how-to-monitor.md).

See [Troubleshooting Cloud service (classic) allocation failures | Microsoft Docs](cloud-services-allocation-failures.md#common-issues) for further remediation steps.

## Next steps

For more allocation failure solutions and background information:

> [!div class="nextstepaction"]
> [Allocation failures - Cloud service (classic)](cloud-services-allocation-failures.md)

If your Azure issue isn't addressed in this article, visit the Azure forums on [MSDN and Stack Overflow](https://azure.microsoft.com/support/forums/). You can post your issue in these forums, or post to [@AzureSupport on Twitter](https://twitter.com/AzureSupport). You also can submit an Azure support request. To submit a support request, on the [Azure support](https://azure.microsoft.com/support/options/) page, select *Get support*.
