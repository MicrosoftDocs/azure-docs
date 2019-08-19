---
title: Azure Resource Manager vCPU quota increase requests | Microsoft Docs
description: Azure Resource Manager vCPU quota increase requests
author: sowmyavenkat86
ms.author: svenkat
ms.date: 06/07/2019
ms.topic: article
ms.service: azure
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Quota increase requests

Resource Manager vCPU quotas for virtual machines and virtual machine scale sets are enforced at two tiers for each subscription, in each region. 

The first tier is the Total Regional vCPUs limit (across all VM Series), and the second tier is the per VM Series vCPUs limit (such as the D-series vCPUs). Any time a new VM is to be deployed, the sum of new and existing vCPUs usage for that VM Series must not exceed the vCPU quota approved for that particular VM Series. Further, the total new and existing vCPU count deployed across all VM Series should not exceed the Total Regional vCPUs quota approved for the subscription. If either of those quotas are exceeded, the VM deployment will not be allowed.
You can request an increase of the vCPUs quota limit for the VM series from Azure portal. An increase in the VM Series quota automatically increases the Total Regional vCPUs limit by the same amount. 

When a new subscription is created, the default Total Regional vCPUs may not be equal to the sum of default vCPU quotas for all individual VM Series. This can result in a subscription with enough quota for each individual VM Series that you want to deploy, but not enough quota for Total Regional vCPUs for all deployments. In this case, you will need to submit a request to increase the Total Regional vCPUs limit explicitly. Total Regional vCPUs limit cannot exceed the sum of approved quota across all VM series for the region.

Learn more about quotas on the [Virtual machine vCPU quotas page](https://docs.microsoft.com/azure/virtual-machines/windows/quotas) and [Azure subscription and service limits](https://aka.ms/quotalimits) page. 

