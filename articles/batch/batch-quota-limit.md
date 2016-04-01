<properties
	pageTitle="Batch service quotas and limits | Microsoft Azure"
	description="Learn about quotas, limits, and constraints for using the Azure Batch service"
	services="batch"
	documentationCenter=""
	authors="dlepow"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.workload="big-compute"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/11/2016"
	ms.author="danlep"/>

# Quotas and limits for the Azure Batch service

This article lists the default and maximum limits of certain resources you can use with the Azure Batch service. Most of these limits are quotas that Azure applies to your subscription or Batch accounts.

If you plan to run production Batch workloads, you might need to increase one or more of the quotas above the default value. If you want to raise a quota, open an online customer support request at no charge.

>[AZURE.NOTE] A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, please contact Azure support.

## Subscription quotas
Resource|Default Limit|Maximum Limit
---|---|---
Batch accounts per region per subscription|1|50

## Batch account quotas
[AZURE.INCLUDE [azure-batch-limits](../../includes/azure-batch-limits.md)]

## Other limits
Resource|Maximum Limit
---|---
Tasks per compute node                | 4 x number of node cores
Applications per Batch account        | 20
Application packages per application | 40
Application package size (each)       | Approx. 195GB<sup>1</sup>

<sup>1</sup> Azure Storage limit for maximum block blob size

## View Batch quotas

View your Batch account quotas in the [Azure portal](https://portal.azure.com).

1. In the portal, click **Batch accounts** and then the name of your Batch account.

2. On the account blade, click **Settings** > **Properties**.

	![Batch account quotas][account_quotas]

3. On the **Properties** blade, review quotas that currently apply to the Batch account.

## Increase a quota

Use the following steps to request a quota increase in the Azure portal (you can also request an increase in the [Azure classic portal](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/)).

1. On the dashboard of the portal, click **Help + support**.

2. Click **New support request > Basics**.

3. On the **Basics** blade, do the following:

	a. In **Issue Type**, select **Quota**.

	b. Select your subscription.

	c. In **Quota type**, select **Batch**.

	d. In **Support plan**, select **Azure Support Plan - Developer**.

	Click **Next**.

4. On the **Problem** blade, do the following:

	a. Select a **Severity** according to your business impact.

	b. In **Details**, list the quota or quotas you want to change in a particular account and the new limits you want.

	Click **Next**.

5. On the **Contact information** blade, enter your contact details and click **Next**.

6. Click **Create** to submit the new support request.

Azure support will contact you. Completing the request can take up to 2 business days.

## Related topics

* [Create and manage an Azure Batch account](batch-account-create-portal.md)

* [Azure Batch feature overview](batch-api-basics.md)

* [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md)

[account_quotas]: ./media/batch-quota-limit/accountquota_portal.PNG
