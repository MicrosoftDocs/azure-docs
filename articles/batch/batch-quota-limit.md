<properties
	pageTitle="Batch service quotas and limits | Microsoft Azure"
	description="Learn about quotas, limits, and constraints for using the Azure Batch service"
	services="batch"
	documentationCenter=""
	authors="mmacy"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.workload="big-compute"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/10/2016"
	ms.author="marsma"/>

# Quotas and limits for the Azure Batch service

As with other Azure services, there are limits on certain resources associated with the Batch service. Many of these limits are default quotas applied by Azure at the subscription or account level. This article discusses those defaults, and how you can request quota increases.

If you plan to run production workloads in Batch, you may need to increase one or more of the quotas above the default. If you want to raise a quota, you can open an online [customer support request](#increase-a-quota) at no charge.

>[AZURE.NOTE] A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, please contact Azure support.

## Subscription quotas
**Resource**|**Default Limit**|**Maximum Limit**
---|---|---
Batch accounts per region per subscription | 1 | 50

## Batch account quotas
[AZURE.INCLUDE [azure-batch-limits](../../includes/azure-batch-limits.md)]

## Other limits
**Resource**|**Maximum Limit**
---|---
[Concurrent tasks](batch-parallel-node-tasks.md) per compute node | 4 x number of node cores
[Applications](batch-application-packages.md) per Batch account        | 20
Application packages per application  | 40
Application package size (each)       | Approx. 195GB<sup>1</sup>

<sup>1</sup> Azure Storage limit for maximum block blob size

## View Batch quotas

View your Batch account quotas in the [Azure portal][portal].

1. In the portal, click **Batch accounts** and then the name of your Batch account.

2. On the account blade, click **All settings** > **Properties**.

	![Batch account quotas][account_quotas]

3. The **Properties** blade displays the quotas currently applied to the Batch account.

## Increase a quota

Follow the steps below to request a quota increase using the [Azure portal][portal].

1. Select the **Help + support** tile on your portal dashboard, or the question mark (**?**) in the upper-right corner of the portal.

2. Select **New support request** > **Basics**.

3. On the **Basics** blade:

	a. **Issue Type** > **Quota**

	b. Select your subscription.

	c. **Quota type** > **Batch**

	d. **Support plan** > **Quota support - Included**

	Click **Next**.

4. On the **Problem** blade:

	a. Select a **Severity** according to your [business impact][support_sev].

	b. In **Details**, specify each quota you want to change, the Batch account name, and the new limit.

	Click **Next**.

5. On the **Contact information** blade:

	a. Select a **Preferred contact method**.

	b. Verify and enter the required contact details.

	Click **Create** to submit the support request.

Once you've submitted your support request, Azure support will contact you. Note that completing the request can take up to 2 business days.

## Related topics

* [Create and manage an Azure Batch account](batch-account-create-portal.md)

* [Azure Batch feature overview](batch-api-basics.md)

* [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md)

[portal]: https://portal.azure.com
[portal_classic_increase]: https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/
[support_sev]: http://aka.ms/supportseverity

[account_quotas]: ./media/batch-quota-limit/accountquota_portal.PNG
