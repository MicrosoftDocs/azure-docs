---
title: SQL Server HADR and centrally managed Azure Hybrid Benefit coexistence
description: This article explains how the SQL Server HADR Software Assurance benefit and centrally managed Azure Hybrid Benefit coexist.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: ahb
ms.reviewer: chrisrin
---

# SQL Server HADR and centrally managed Azure Hybrid Benefit coexistence

One of the benefits of Software Assurance (SA) is that it allows Azure customers to install and run passive SQL Server instances for disaster recovery in anticipation of a failover event. Scope-level management of Azure Hybrid Benefit supports the SQL Server HADR benefit by ensuring that the qualified disaster recovery replicas don't consume assigned SQL Server licenses. As a result, you don't have to manage the replicas separately. 

## HADR benefit selection

To use the HADR benefit, select **HADR** using the **Configure** pane of the **SQL Virtual Machine** resource, as shown in the following image.

:::image type="content" source="./media/sql-server-hadr-licenses/select-hadr-benefit.png" alt-text="Screenshot showing the HADR option in the SQL virtual machine configuration." lightbox="./media/sql-server-hadr-licenses/select-hadr-benefit.png" :::

If the HADR property is selected, then licenses centrally assigned to a scope aren't used to discount the SQL software cost of that resource. Instead, the pay-as-you-go meter automatically switches to a $0 HADR meter. This method ensures that the assigned SQL licenses are only used for the resources that require licensing. You don't need to inflate the SQL license assignments to account for the HADR benefits. The following diagram illustrates this concept.

Prices shown in the following image are for example purposes only.

:::image type="content" source="./media/sql-server-hadr-licenses/fully-discounted-consumption-hadr.svg" alt-text="Diagram showing fully discounted vCore consumption with HADR selected." border="false" lightbox="./media/sql-server-hadr-licenses/fully-discounted-consumption-hadr.svg":::

> [!NOTE]
> HADR option reflects the specific role of this SQL Server instance in the Always On availability group. Selecting it is the responsibility of the service owner or DBA and requires at least a [SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) role. This task is unrelated to scope-level license assignments.

## Next steps

- Review the [Centrally managed Azure Hybrid Benefit FAQ](faq-azure-hybrid-benefit-scope.yml).
- Learn about how discounts are applied at [What is centrally managed Azure Hybrid Benefit?](sql-server-hadr-licenses.md)
- Learn about how to [transition from existing Azure Hybrid Benefit experience](transition-existing.md).