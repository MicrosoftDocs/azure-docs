---
title: Deployment issues for Microsoft Azure Cloud Services FAQ| Microsoft Docs
description: This article lists the frequently asked questions about deployment for Microsoft Azure Cloud Services.
services: cloud-services
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 84985660-2cfd-483a-8378-50eef6a0151d
ms.service: cloud-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/31/2018
ms.author: genli

---
# Deployment issues for Azure Cloud Services: Frequently asked questions (FAQs)

This article includes frequently asked questions about deployment issues for [Microsoft Azure Cloud Services](https://azure.microsoft.com/services/cloud-services). You can also consult the [Cloud Services VM Size page](cloud-services-sizes-specs.md) for size information.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Why does deploying a cloud service to the staging slot sometimes fail with a resource allocation error if there is already an existing deployment in the production slot?
If a cloud service has a deployment in either slot, the entire cloud service is pinned to a specific cluster. This means that if a deployment already exists in the production slot, a new staging deployment can only be allocated in the same cluster as the production slot.

Allocation failures occur when the cluster where your cloud service is located does not have enough physical compute resources to satisfy your deployment request.

For help mitigating such allocation failures, see [Cloud Service allocation failure: Solutions](cloud-services-allocation-failures.md#solutions).

## Why does scaling up or scaling out a cloud service deployment sometimes result in allocation failure?
When a cloud service is deployed, it usually gets pinned to a specific cluster. This means scaling up/out an existing cloud service must allocate new instances in the same cluster. If the cluster is nearing capacity or the desired VM size/type is not available, the request may fail.

For help mitigating such allocation failures, see [Cloud Service allocation failure: Solutions](cloud-services-allocation-failures.md#solutions).

## Why does deploying a cloud service into an affinity group sometimes result in allocation failure?
A new deployment to an empty cloud service can be allocated by the fabric in any cluster in that region, unless the cloud service is pinned to an affinity group. Deployments to the same affinity group will be attempted on the same cluster. If the cluster is nearing capacity, the request may fail.

For help mitigating such allocation failures, see [Cloud Service allocation failure: Solutions](cloud-services-allocation-failures.md#solutions).

## Why does changing VM size or adding a new VM to an existing cloud service sometimes result in allocation failure?
The clusters in a datacenter may have different configurations of machine types (e.g., A series, Av2 series, D series, Dv2 series, G series, H series, etc.). But not all the clusters would necessarily have all the kinds of VMs. For example, if you try to add a D series VM to a cloud service that is already deployed in an A series-only cluster, you will experience an allocation failure. This will also happen if you try to change VM SKU sizes (for example, switching from an A series to a D series).

For help mitigating such allocation failures, see [Cloud Service allocation failure: Solutions](cloud-services-allocation-failures.md#solutions).

To check the sizes available in your region, see [Microsoft Azure: Products available by region](https://azure.microsoft.com/regions/services).

## Why does deploying a cloud service sometime fail due to limits/quotas/constraints on my subscription or service?
Deployment of a cloud service may fail if the resources that are required to be allocated exceed the default or maximum quota allowed for your service at the region/datacenter level. For more information, see [Cloud Services limits](../azure-subscription-service-limits.md#azure-cloud-services-limits).

You could also track the current usage/quota for your subscription at the portal: Azure portal => Subscriptions => \<appropriate subscription> => “Usage + quota”.

Resource usage/consumption-related information can also be retrieved via the Azure Billing APIs. See [Azure Resource Usage API (Preview)](../billing/billing-usage-rate-card-overview.md#azure-resource-usage-api-preview).

## How can I change the size of a deployed cloud service VM without redeploying it?
You cannot change the VM size of a deployed cloud service without redeploying it. The VM size is built into the CSDEF, which can only be updated with a redeploy.

For more information, see [How to update a cloud service](cloud-services-update-azure-service.md).

## Why am I not able to deploy Cloud Services through Service Management APIs or PowerShell when using Azure Resource Manager Storage account? 

Since the Cloud Service is a Classic resource which is not directly compatible with the Azure Resource Manager model, you can't associate it with the Azure Resource Manager Storage accounts. Here are few options: 
 
- Deploying through REST API.

    When you deploy through Service Management REST API, you could get around the limitation by specifying a SAS URL to the blob storage, which will work with both Classic and Azure Resource Manager Storage account. Read more about the 'PackageUrl' property [here](/previous-versions/azure/reference/ee460813(v=azure.100)).
  
- Deploying through [Azure portal](https://portal.azure.com).

    This will work from the [Azure portal](https://portal.azure.com) as the call goes through a proxy/shim which allows communication between Azure Resource Manager and Classic resources. 
 
## Why does Azure portal require me to provide a storage account for deployment? 

In the classic portal, the package was uploaded to the management API layer directly, and then the API layer would temporarily put the package into an internal storage account.  This process causes performance and scalability problems because the API layer was not designed to be a file upload service.  In the Azure portal (Resource Manager deployment model), we have bypassed the interim step of first uploading to the API layer, resulting in faster and more reliable deployments. 

As for the cost, it is very small and you can reuse the same storage account across all deployments. You can use the [storage cost calculator](https://azure.microsoft.com/pricing/calculator/#storage1) to determine the cost to upload the service package (CSPKG), download the CSPKG, then delete the CSPKG. 
