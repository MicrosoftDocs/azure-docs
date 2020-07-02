---
title: Azure Resource Manager vCPU quota increase requests
description: Azure Resource Manager vCPU quota increase requests
author: sowmyavenkat86
ms.author: svenkat
ms.date: 01/27/2020
ms.topic: how-to
ms.service: azure-supportability
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Quota increase requests

Resource Manager vCPU quotas for virtual machines and virtual machine scale sets are enforced at two tiers for each subscription, in each region.

The first tier is the Total Regional vCPUs limit across all VM series. The second tier is the per VM series vCPUs limit, such as the D-series vCPUs. Anytime a new virtual machine is to be deployed, the sum of new and existing vCPUs usage for that VM series must not exceed the vCPU quota approved for that particular VM series. Further, the total new and existing vCPU count deployed across all VM series shouldn't exceed the Total Regional vCPUs quota approved for the subscription. If either of those quotas are exceeded, the VM deployment won't be allowed.
You can request an increase of the vCPUs quota limit for the VM series from Azure portal. An increase in the VM series quota automatically increases the Total Regional vCPUs limit by the same amount.

When a new subscription is created, the default Total Regional vCPUs may not be equal to the sum of default vCPU quotas for all individual VM series. This fact can result in a subscription with enough quota for each individual VM series that you want to deploy. It could lack enough quota for Total Regional vCPUs for all deployments. In this case, you'll need to submit a request to increase the Total Regional vCPUs limit explicitly. Total Regional vCPUs limit can't exceed the sum of approved quota across all VM series for the region.

For more information about quotas, see [Virtual machine vCPU quotas](../../virtual-machines/windows/quotas.md) and [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).

