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



# Quotas, limits, and constraints for the Azure Batch service

This article lists the default and maximum limits of certain resources you can use with the Azure Batch service. If you plan to run large-scale Batch workloads, you might need to increase one or more of the limits above the default value. If you want to raise a limit, [open an online customer support request at no charge](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/).

## Subscription limits
Resource|Default Limit|Maximum Limit
---|---|---
Batch accounts per region per subscription|1|20

## Service limits
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

## Next steps

* See [API basics for Azure Batch](batch-api-basics.md) toarn more about the Batch concepts.

* Get started developing your first application with the [Batch client library for .NET](batch-dotnet-get-started.md).

[account_quotas]: ./media/batch-quota-limit/accountquota_portal.PNG
