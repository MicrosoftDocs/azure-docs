---
title: Recover your Oracle database on Azure BareMetal Infrastructure
description: Learn how you can recover your Oracle database on the Azure BareMetal Infrastructure.
ms.topic: reference
ms.subservice: workloads
ms.date: 04/15/2021
---

# Recover your Oracle database on Azure BareMetal Infrastructure

While no single technology protects from all failure scenarios, combining features offers database administrators the ability to recover their database in nearly any situation.

## Causes of database failure

Database failures can occur for many reasons but typically fall under several categories:

- Data manipulation errors.
- Loss of online redo logs.
- Loss of database control files.
- Loss of database datafiles.
- Physical data corruption.

## Choose your method of recovery

The type of recovery depends on the type of failure. Let's say an object is dropped or data is incorrectly modified. Then the quickest solution is usually to do a flashback database operation. In other cases, recovering through an Azure NetApp Files snapshot may provide the recovery you want. The following figure's decision tree represents common failure and recovery scenarios if all data protection options described above are implemented.

:::image type="content" source="media/oracle-high-availability/db-recovery-decision-tree.png" alt-text="Diagram of the database recovery decision tree." lightbox="media/oracle-high-availability/db-recovery-decision-tree.png":::

Keep in mind this example decision tree is only viewed from the lens of a database administrator. Each deployment may have different requirements that could change the order of choices. For example, performing a database role switch to a different region via Data Guard may have an adverse effect on application performance. It could give the snapshot recovery method a lower RTO. To ensure RTO/RPO requirements are met, we recommend you do these operations and create documented procedures to execute them when needed.

## Next steps

Learn more about BareMetal Infrastructure:

- [What is BareMetal Infrastructure on Azure?](../../concepts-baremetal-infrastructure-overview.md)
- [Connect BareMetal Infrastructure instances in Azure](../../connect-baremetal-infrastructure.md)
