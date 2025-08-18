---
title: How to cut over a cloud workload
description: How to cut over a cloud workload and application.
author: SomilGanguly
ms.author: ssumner
ms.date: 12/19/2023
ms.reviewer: ssumner
ms.topic: conceptual
ms.custom: internal
keywords: cloud adoption, cloud framework, cloud adoption framework
---
# Cut over a cloud workload

Cutover is when you direct traffic away from the source region and to the workload in the target region. After cutover, you can decommission the workload in the source region. To reduce costs and data deltas, you want the period between migration and cutover to be short. Here's the high-level process to cut over a cloud workload.

:::image type="content" source="./media/relocate/relocate-cutover.svg" alt-text="Diagram showing the relocation process and highlights the Cutover step in the Move phase. In the relocation process, there are two phases and five steps. The first phase is the Initiate phase, and it has one step called Initiate. The second phase is the Move phase, and it has four steps that you repeat for each workload. The steps are Evaluate, Select, Migrate, and Cutover." lightbox="./media/relocate/relocate-cutover.svg" border="false":::

**Test and validate migrated services and data.** Test and validate the workload and dependencies to ensure the relocation was successful. Investigate and remediate bugs or issues related to scripts built by the relocation delivery team. You should run user acceptance tests (UATs). It's a best practice to assign different users to various parts of the application for UAT. You want to receive confirmation from users that the workload functions before switching the endpoints.

**Switch endpoints.** You should execute the cutover plan from the Select step of the relocation process. Have a failover strategy in place for urgent fixes.

**Validate traffic.** Validate the traffic is routed to the target region, for example, by running smoke tests. You should communicate the relocation progress to users so they're informed. Also, check the workload metrics and logs to confirmation the workload is working properly.

**Fix if necessary.** If something goes wrong, you should implement the failover plan or apply an urgent fix to stabilize the deployment.

**Review operational configurations.** Make sure you turn on or configure the new workload environments, including the updated artifacts (config files, wikis, readme), infrastructure as code (IaC), pipelines for your new environment. You should follow all Azure Advisor recommendations and configuring items such as backups, security controls, logging, and cost reporting.

**Repeat the Move phase for each workload.** If you have more workloads to relocate, return to the [Evaluate step](./relocate-evaluate.md) and repeat the four steps of the Move phase until you complete the relocation project. Otherwise, you need to formally close the relocation project.

**Close project.** After you're done relocating, you should officially close the relocation project. Closure should take place two weeks after the final cutover. You need time to assess the success of the relocation and create a report for stakeholders to review. Business and technical stakeholders should review the report and approve.

**Modernize workloads.** Depending on the state of your workload, you might want to continue with our adopt guidance for modernizing workloads with Azure platform-as-a-service solutions (PaaS) or conduct a well-architected review to determine areas of improvement.
