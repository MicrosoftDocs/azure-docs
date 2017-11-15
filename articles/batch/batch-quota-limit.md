---
title: Service quotas and limits for Azure Batch | Microsoft Docs
description: Learn about default Azure Batch quotas, limits, and constraints, and how to request quota increases
services: batch
documentationcenter: ''
author: v-dotren
manager: timlt
editor: ''

ms.assetid: 28998df4-8693-431d-b6ad-974c2f8db5fb
ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/28/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017

---
# Batch service quotas and limits

As with other Azure services, there are limits on certain resources associated with the Batch service. Many of these limits are default quotas applied by Azure at the subscription or account level. This article discusses those defaults, and how you can request quota increases.

Keep these quotas in mind as you design and scale up your Batch workloads. For example, if your pool doesn't reach the target number of compute nodes you specified, you might have reached the core quota limit for your Batch account.

You can run multiple Batch workloads in a single Batch account, or distribute your workloads among Batch accounts that are in the same subscription, but in different Azure regions.

If you plan to run production workloads in Batch, you may need to increase one or more of the quotas above the default. If you want to raise a quota, you can open an online [customer support request](#increase-a-quota) at no charge.

> [!NOTE]
> A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, please contact Azure support.
> 
> 

## Resource quotas
[!INCLUDE [azure-batch-limits](../../includes/azure-batch-limits.md)]

### Quotas in user subscription mode

If you used an earlier version of the Batch API to create a Batch account with pool allocation mode set to **user subscription**, quotas are applied differently. In this mode, which is no longer recommended, Batch VMs and other resources are created directly in your subscription when a pool is created. The Azure Batch cores quota does not apply to an account created in this mode. Instead, the quotas in your subscription for regional compute cores and other resources are applied. Learn more about these quotas in [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).

## Other limits
| **Resource** | **Maximum Limit** |
| --- | --- |
| [Concurrent tasks](batch-parallel-node-tasks.md) per compute node |4 x number of node cores |
| [Applications](batch-application-packages.md) per Batch account |20 |
| Application packages per application |40 |
| Application package size (each) |Approx. 195GB<sup>1</sup> |
| Maximum start task size | 32768 characters<sup>2</sup> |

<sup>1</sup> Azure Storage limit for maximum block blob size<br />
<sup>2</sup> Includes resource files and environment variables



## View Batch quotas
View your Batch account quotas in the [Azure portal][portal].

1. Select **Batch accounts** in the portal, then select the Batch account you're interested in.
2. Select **Quotas** on the Batch account's menu.
3. View the quotas currently applied to the Batch account
   
    ![Batch account quotas][account_quotas]



## Increase a quota
Follow these steps to request a quota increase for your Batch account or your subscription using the [Azure portal][portal]. The type of quota increase depends on the pool allocation mode of your Batch account.

### Increase a Batch cores quota 

1. Select the **Help + support** tile on your portal dashboard, or the question mark (**?**) in the upper-right corner of the portal.
2. Select **New support request** > **Basics**.
3. In **Basics**:
   
    a. **Issue Type** > **Quota**
   
    b. Select your subscription.
   
    c. **Quota type** > **Batch**
   
    d. **Support plan** > **Quota support - Included**
   
    Click **Next**.
4. In **Problem**:
   
    a. Select a **Severity** according to your [business impact][support_sev].
   
    b. In **Details**, specify each quota you want to change, the Batch account name, and the new limit.
   
    Click **Next**.
5. In **Contact information**:
   
    a. Select a **Preferred contact method**.
   
    b. Verify and enter the required contact details.
   
    Click **Create** to submit the support request.

Once you've submitted your support request, Azure support will contact you. Note that completing the request can take up to 2 business days.


## Related topics
* [Create an Azure Batch account using the Azure portal](batch-account-create-portal.md)
* [Azure Batch feature overview](batch-api-basics.md)
* [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md)

[portal]: https://portal.azure.com
[portal_classic_increase]: https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/
[support_sev]: http://aka.ms/supportseverity

[account_quotas]: ./media/batch-quota-limit/accountquota_portal.png
