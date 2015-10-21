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
	ms.date="10/20/2015"
	ms.author="danlep"/>



# Quotas and limits for the Azure Batch service

This article lists the default and maximum limits of certain resources you can use with the Azure Batch service. Most of these limits are quotas that Azure applies to your subscription or Batch accounts.

If you plan to run production Batch workloads, you might need to increase one or more of the quotas above the default value. If you want to raise a quota, [open an online customer support request at no charge](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/).

>[AZURE.NOTE] A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, please contact Azure support.

## Subscription quotas
Resource|Default Limit|Maximum Limit
---|---|---
Batch accounts per region per subscription|1|20

## Batch account quotas
[AZURE.INCLUDE [azure-batch-limits](../../includes/azure-batch-limits.md)]

## Other limits
Resource|Maximum Limit
---|---
Tasks per compute node|4 x number of node cores

## Quota monitoring
Monitor your Batch account quota usage in the [Azure preview portal](https://portal.azure.com).

1. In the preview portal, click **Batch accounts** and then the name of your Batch account.

2. On the account blade, click **Settings** > **Properties**.

	![Batch account quotas][account_quotas]

3. On the **Properties** blade, review quotas that currently apply to the Batch account.

## Related topics

* [Create and manage an Azure Batch account](batch-account-create-portal.md)

* [API basics for Azure Batch](batch-api-basics.md)

[account_quotas]: ./media/batch-quota-limit/accountquota_portal.PNG
