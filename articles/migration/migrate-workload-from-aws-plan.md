---
title: Plan Your Workload Migration from Amazon Web Services (AWS) to Azure
description: Plan your AWS to Azure migration. Assess the workload, design the architecture, and use detailed runbooks to minimize risk and ensure success.
ms.author: rhackenberg
author: reginahack
ai-usage: ai-assisted
ms.date: 02/13/2026
ms.topic: concept-article
ms.custom: migration-hub
ms.service: azure
ms.collection:
  - migration
  - aws-to-azure
---
# Plan your workload migration from Amazon Web Services (AWS) to Azure

This article is part of a series about how to [migrate a workload from Amazon Web Services (AWS) to Azure](/azure/migration/migrate-workload-from-aws-introduction). 

The planning phase consists of these steps: 

> [!div class="checklist"]
> * Assess your workload.
> * Design a like-for-like architecture.
> * Develop and document a migration plan.

:::image type="icon" source="images/goal.svg" alt-text="Goal icon"::: The goal of the planning phase is to understand your existing AWS workload from a technical and business standpoint so that you can confidently build a plan to replicate it in Azure.

> [!IMPORTANT]
> Take your time in the planning phase and follow the steps in order. Incomplete discovery or unclear migration objectives risk misaligned expectations and missed dependencies.

## Assess your AWS workload

To build a comparable system in Azure, you first need to fully understand your current system. Evaluate it from multiple perspectives to ensure that you eventually design an Azure implementation that equally fulfills the needs of users, operators, developers, compliance, and business stakeholders.

1. **Document the existing workload architecture:** Fully document and verify your workload architecture. Include all workload dependencies, like network configurations, data flows, and external integrations.
1. **Document authentication and authorization:** Include identity and access management (IAM) configurations in your assessment. Comprehensive documentation about how AWS handles authentication and authorization is critical to designing a secure and functional Azure equivalent.
1. **Use discovery tooling:** Use AWS-specific tooling, like [Workload Discovery on AWS](https://aws.amazon.com/solutions/implementations/workload-discovery-on-aws/), to visualize your AWS workload. This tool uses AWS Config and AWS Systems Manager data to help identify your workload's components, dependencies, and relationships. Use Azure tooling, like [Azure Migrate](/azure/migrate/tutorial-assess-aws), to help you discover more AWS workload components and make Azure-specific recommendations.
1. **Identify critical flows:** Map out essential user and system interactions and [workflows](/azure/well-architected/reliability/identify-flows). When you design the target architecture in the next section, this information helps you prioritize reliability efforts and protect the most important and impactful components against failure.
1. **Create a detailed inventory:** Make a list of what your current AWS environment needs to run the workload, including all servers, storage components, databases, and services. Also include usage patterns, performance metrics, and licensing requirements.
1. **Involve subject matter experts (SMEs):** In addition to automated discovery tools, engage experts throughout the workload team to uncover hidden dependencies, complex component relationships, and sensitive state. Tooling often misses critical components, like scheduled scripts, undocumented integrations, or legacy configurations. A conversation with SMEs can reveal these nuances and prevent unexpected behavior during migration. Include their input in the migration plan and runbook.
1. **Assess your team's skills:** Focus on like-for-like capability mapping. Identify the skills that your team already uses in AWS and align them with equivalent Azure services and tools. Include Azure training in your project timeline to prepare your workload and operations teams. This approach reduces friction and builds confidence with Azure because existing experience in AWS translates directly to the new environment.
1. **Document existing commitments:** Document the defined performance baseline of your workload, including throughput, latency, error rates, and resource utilization. If these key performance indicators (KPIs) aren't available, collect these metrics from your AWS environment to establish this baseline. You use these KPIs in the evaluation phase after migration to validate that the workload in Azure performs like it did in AWS.
   
   Find out if there are any service-level agreements (SLAs) or service-level objectives (SLOs) associated with the workload. These commitments to users or stakeholders don't change based on your cloud platform. For example, if your recovery time objective (RTO) in AWS is 45 minutes, you need to design the workload in Azure to also have an RTO of 45 minutes.
1. **Document current monitoring and alerting:** Document how you currently monitor the workload in AWS. For example, you might use CloudWatch metrics, alarms, or dashboards. Plan equivalent Azure monitoring for the target environment. You can use Azure Monitor logs, metrics, or Application Insights dashboards. Engage your operations team in this assessment so that they're ready to implement and manage Azure-based monitoring and alerts.

## Design a like-for-like architecture in Azure

Many cloud-based modern workloads use managed or serverless services instead of virtual machines (VMs) for many of their functions. If your AWS workload uses managed services, like Amazon Elastic Kubernetes Service (EKS) or Amazon Elastic Container Service (ECS), you need to find the best match in Azure for your use case. In some cases, Azure might have multiple services that you can choose from, like containerized apps. Choose the most similar service. For example, don't switch container orchestration platforms during migration.

The following diagram shows an example like-for-like architecture for a Kubernetes workload on AWS and Azure.

:::image type="complex" source="./images/like-for-like-architecture-aws-azure.svg" alt-text="Diagram that shows a like-for-like architecture for a Kubernetes-based workload." lightbox="./images/like-for-like-architecture-aws-azure.svg" border="false":::
   The diagram shows a like-for-like architecture between AWS and Azure clouds for Kubernetes workloads. On the left, the AWS cloud contains Amazon ECR, AWS IAM, AWS KMS, and Amazon CloudWatch. An Amazon EKS cluster inside of a virtual private cloud (VPC) connects to compute nodes and a network load balancer. On the right, the Azure cloud contains Azure Container Registry, Microsoft Entra ID, Azure Key Vault, and Azure Monitor. An Azure Kubernetes Service (AKS) cluster inside a virtual network contains private endpoints, an application gateway, and node pools. In the center, admins and engineers use Terraform for infrastructure automation. Connectivity between AWS and Azure is established via site-to-site VPN, AWS Direct Connect, and Azure ExpressRoute. Users interact from the top of the diagram.
:::image-end:::

To begin mapping your like-for-like architecture, first establish a solid foundation.

**Start with networking.** Discuss your workload's networking requirements with the platform team. This discussion should cover the target architecture and the migration connectivity. AWS Transit Gateway serves as the network hub with Amazon Virtual Private Cloud (VPC) as the spoke network. In the Azure application landing zone design, the platform team provisions spoke virtual networks to workload teams. These spoke networks communicate with other internal and external networks through the hub or the Azure Virtual WAN network.

To exchange data during migration, you can use a site-to-site virtual private network (VPN) or Azure ExpressRoute with AWS Direct Connect. You can rely on a site-to-site VPN for smaller or proof-of-concept (POC) migrations. We recommend ExpressRoute with AWS Direct Connect for production-scale migrations or large data transfers. If you use both options for higher reliability, use the site-to-site VPN for failover.

:::image type="complex" source="./images/migrate-from-aws-connectivity.svg" alt-text="Diagram that shows network connectivity between AWS and Azure clouds." lightbox="./images/migrate-from-aws-connectivity.svg" border="false":::
    The diagram shows network connectivity between AWS and Azure clouds. A Domain Name System (DNS) icon connects to the AWS cloud with a VPC on the left and to the Azure cloud with a virtual network on the right. A bidirectional arrow between the clouds indicates secure connectivity options, like site-to-site VPN or AWS Direct Connect and ExpressRoute.
:::image-end:::
 
For more information, see [Migrate networking from AWS to Azure](/azure/migration/migrate-networking-from-aws).

After you plan your networking, follow these steps:

1. **Identify Azure services.** Use the [AWS to Azure resource comparison guide](/azure/architecture/aws-professional) to help you choose your workload's Azure components. Build POCs to gain confidence or help you choose components and their configuration. Use the [Azure Well-Architected Framework service guides](/azure/well-architected/service-guides/) to help ensure that your like-for-like architecture is functionally equivalent and optimized for the platform characteristics and best practices on Azure.

1. **Plan identity management.** Plan how to handle identity and access in Azure for users and for workload operations. If your workload uses AWS IAM roles or federated identity providers, determine how these roles translate to Microsoft Entra ID roles, managed identities, or service principals. Review any hardcoded Amazon Resource Names (ARNs), IAM policies, or identity integrations in the application. If you overlook identity mapping, you might face post-migration access problems or broken integrations. Integration with partner identity providers is a challenge during migrations. If possible, consolidate identity management by transitioning to Microsoft Entra ID.

1. **Document your migration decisions.** Document the resources that you don't migrate and the architecture decisions that you make.

1. **Reduce risks.** Identify high-risk components or flows and build POCs as needed to test and mitigate those risks. Do [failure mode analysis (FMA)](/azure/well-architected/reliability/failure-mode-analysis) on components to proactively find potential points of failure and assess how they affect workload reliability. Your Azure components might have new failure modes or fail differently than their counterparts in AWS.

1. **Check availability.** Check Azure service availability and capacity in your preferred region, especially if you plan to use specialized resource types. When you select your target region, align it closely with your current AWS region. Migrating to a geographically similar Azure region helps maintain consistent latency.

1. **Validate requirements.** If you decide to use Azure Migrate, review the [Azure Migrate support matrix](/azure/migrate/migrate-support-matrix-physical) to ensure that your AWS instances meet operating system (OS) and configuration requirements. If you don't use Azure Migrate, manually check your workload's compatibility with Azure services. This check includes verifying supported OS versions, VM sizes, disk configurations, and network dependencies.

1. **Meet compliance and security requirements.** Maintain an identical security posture in your workload. Ensure that your Azure implementation matches security expectations like OS security patching, network isolation, ingress and egress inspection, least-privileged access, static code analysis, and penetration testing schedules.

   Ensure that any temporary infrastructure, network connections, and processes that you create to facilitate migration also meet security expectations. Migrations can be chaotic, and an oversight or shortcut in security during migration might lead to an incident.

   The security model that AWS uses is significantly different from the Azure security model. For more information, see [Migrate security services from AWS](/azure/migration/migrate-security-from-aws).

## Develop and document a migration plan and create a runbook

Develop a migration plan and create a runbook for your AWS to Azure migration. Choose a cutover strategy, select data migration approaches based on your recovery point objective (RPO) requirements, and document procedures in a detailed runbook. Create a comprehensive, stakeholder-approved plan that minimizes risk and ensures a controlled transition.

### Your cutover strategy

Plan how to cut over production traffic from the AWS environment to the Azure environment. The following approaches are the most common:

- **Big Bang migration:** You migrate and switch everything at the same time during a maintenance window.
- **Phased migration:** You migrate workload components incrementally.
- **Blue-green migration (recommended):** Two environments run in parallel and you switch over traffic after validation.

#### Key differences at a glance

| Strategy   | Downtime | Risk level | Cost impact | Rollback ease |
| ---------- | -------- | ---------- | ----------- | ------------- |
| Big Bang   | High     | High       | Low         | Hard          |
| Phased     | Low      | Medium     | Medium      | Moderate      |
| Blue-green | Low      | Low        | High        | Easy          |

To keep the risk low and rollback easy, choose a blue-green approach. In this scenario, you maintain two environments. Blue is the current environment (AWS), and green is the new environment (Azure).

In the blue-green scenario, you plan a migration window, run your workload in AWS throughout migration, and move traffic to Azure after a successful dry run. Both environments run in parallel throughout migration, so you can shift traffic back to AWS if problems arise in the Azure environment. In this scenario, you also need a rollback strategy for state that might change. Consider databases and less obvious state, like unprocessed items in message queues.

If your workload is more complex and you want to minimize risk, you can combine the blue-green strategy with a canary approach to switch over traffic. The canary approach routes a small percentage of traffic to the new environment and then increases it incrementally. The canary approach increases migration complexity because live state needs to exist in both AWS and Azure during the transition.
 
If any components on AWS coexist with components that run on Azure, consider applying patterns like the [Strangler Fig façade](/azure/architecture/patterns/strangler-fig) as part of a controlled cutover strategy. You implement these extra layers of indirection in the next phase of migration.

The blue-green approach introduces a cost trade-off. You incur costs for both cloud providers during the transition. For most teams, the extra costs are worthwhile because the blue-green strategy reduces risk and operational burden.

#### Plan a maintenance window

We recommend that you negotiate a generous maintenance window during the planning phase for whichever cutover strategy you use. A sufficient window respects the sensitive nature of migration activities and accounts for functionality loss during migration. Use this planned downtime to develop plans that reduce the risk of data loss, data corruption, or inconsistent user experiences. For example, use this time to drain Amazon Simple Queue Service (SQS) messages.

If your workload has an outage budget, consider excluding the migration window from that budget and reserving it for post-migration problems. Consider how this decision affects contractual SLAs.

### Choose your data migration strategy

Your data migration strategy depends on the amount of data, type of data storage, and usage requirements. Decide between offline migration (backup and restore) and live replication.

**Align the strategy with your workload's RPO.** Refer to your workload's RPO to guide decisions during the [decommission phase](/azure/migration/migrate-workload-from-aws-decommission) and when you choose a database migration strategy. The RPO is the maximum amount of data loss that you can accept as part of the cutover. For example, an RPO might allow no more than five minutes of data loss during the cutover. Minimize the risk of data loss by shutting down state change operations within the workload before you cut over.

The lower the RPO, the more you need to consider continuous replication or recent backups and maintenance windows. Lower RPOs can also increase cost and effort to migrate your data.

**Migrate your database.** Evaluate AWS and Azure tooling for your [database migration](/azure/migration/migrate-databases-from-aws). For example, you can use Azure Data Studio to [replicate Amazon Relational Database Service (Amazon RDS) for SQL Server to Azure SQL Database](/azure/data-factory/connector-amazon-rds-for-sql-server?tabs=data-factory). This feature supports continuous replication from Amazon RDS to SQL Database. Or you can use [AWS Database Migration Service (AWS DMS)](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html), which provides continuous replication and change data capture until you cut over.

In most scenarios, data migration occurs in multiple phases. For example, you might do an initial migration for testing and validation, followed by a final cutover migration or continuous synchronization to ensure data freshness. This approach lets teams validate application behavior in Azure before the final cutover. It also reduces risk of data loss and supports rollback planning.

**Transfer storage data.** Consider the following options to transfer storage data from [Amazon Simple Storage Service (Amazon S3) to Azure](/azure/migration/migrate-storage-from-aws).

| Tool | Purpose |
|---|---|
| [AzCopy](/azure/storage/common/storage-use-azcopy-s3) | Quickly transfers data in bulk by using the CLI. |
| [Azure Data Factory](/azure/data-factory/data-migration-guidance-s3-azure-storage) | Provides enterprise-grade orchestration and transform-heavy data transfer. |
| [AWS DataSync](https://aws.amazon.com/datasync/) | Automates the transfer of files and replication of unstructured data from AWS to Azure. |

> [!TIP]
> If you choose AWS DataSync, you need to deploy the DataSync agent in Azure during the [prepare phase](./migrate-workload-from-aws-prepare.md).

**Plan a maintenance window.** Schedule a dedicated window for your final cutover and decommissioning steps. Document and communicate it with your stakeholders before you start migration. Include time for a possible rollback and Domain Name System (DNS) switch.

### Document in a runbook

Document the following information in a runbook to share with all teams and stakeholders involved in the migration.

**Sequence of steps:** Document the sequence of steps at a high level. Define the exact steps, their sequence, and the migration timing. Include the planned maintenance window in your documentation. Consider including a dry run, especially for complex cutovers. Document your rollback strategy, DNS time to live (TTL), and how to test success metrics.

**Security and networking configuration:** Include all firewall rule changes, required port openings, and updates to network security groups (NSGs) or application security groups (ASGs) needed to support Azure connectivity. Document any temporary exceptions or overrides required during cutover and ensure that rollback procedures account for these changes.

**Sign-off acceptance criteria:** Define what a *stable operation* means and make it measurable. For example, agree that after cutover, Azure must run for a specific number of minutes or hours without errors and that the workload passes all tests.

**Rollback trigger criteria and steps:** Document the exact conditions that trigger a rollback to the AWS environment. For example, initiate a rollback if any critical functionality is down or the system is in a degraded state, like a specific percentage below baseline, for more than a specified number of minutes. Document the rollback steps.

Depending on state changes, rollbacks can be more complex than mitigating the problem in Azure. Failed mitigation attempts might also complicate a rollback. Understand when you should fix a problem and when you should roll back changes to help reduce risk during migration.

**Client configuration changes:** Identify and document all client-facing configuration items that the workload migration affects. These items include DNS endpoints, authentication flows, and connection strings. Involve the client teams early and communicate the upcoming changes, timelines, and responsibilities.

**Traffic and routing changes:** Plan and document your traffic routing changes in detail. Define exactly how to update DNS records, load balancer configuration, and routing rules to direct traffic to Azure. Consider any TTL value that you configure because it determines how long DNS changes take to propagate. 

Many applications and scripts reference fully qualified domain names (FQDNs) for endpoints, APIs, and services. If FQDNs change unexpectedly during migration, integrations can break. As part of your routing and cutover planning, inventory all FQDNs that your workload uses. Decide whether to retain existing names via DNS forwarding or update application configurations to use new Azure FQDNs. For public-facing services, plan DNS cutover carefully to minimize downtime and ensure a smooth transition.

> [!CAUTION]
> Neglecting to explicitly plan traffic routing is a common pitfall that can lead to unexpected downtime.

Review the plan with stakeholders and reconcile differing expectations. Include IT security and risk management teams from the start and ensure that they approve the plan. A joint workshop at this stage can help minimize delays in later stages.

After stakeholders and decision-makers review and agree on the plan and runbook, move to the prepare phase.

## Outputs and artifacts

At the end of the planning phase, you should have the following items in place:

- Target architecture diagram
- Architecture decision records (ADRs)
- Budget and cost estimates
- Migration runbook and timeline
- Stakeholder approval of the migration plan

## Checklist

| &nbsp;  | Deliverable tasks                                     |
| ------- | ----------------------------------------------------- |
| &#9744; | Document existing workload architecture               |
| &#9744; | Document authentication and authorization             |
| &#9744; | Use discovery tooling                                 |
| &#9744; | Identify critical flows                               |
| &#9744; | Create detailed inventory                             |
| &#9744; | Involve application team                              |
| &#9744; | Assess skills                                         |
| &#9744; | Document KPIs                                         |
| &#9744; | Plan monitoring and operations handoff                |
| &#9744; | Address networking                                    |
| &#9744; | Identify matching Azure services                      |
| &#9744; | Plan identity management                              |
| &#9744; | Document migration decisions                          |
| &#9744; | Reduce risks                                          |
| &#9744; | Check resource availability                           |
| &#9744; | Validate requirements if you use Azure Migrate     |
| &#9744; | Address compliance and security requirements          |
| &#9744; | Choose cutover strategy                               |
| &#9744; | Choose database migration strategy                    |
| &#9744; | Choose storage migration strategy                     |
| &#9744; | Plan maintenance window                               |
| &#9744; | Document sequence of steps                            |
| &#9744; | Document security and networking configuration        |
| &#9744; | Document sign-off acceptance criteria                 |
| &#9744; | Document rollback trigger criteria and steps          |
| &#9744; | Document and communicate client configuration changes |
| &#9744; | Document traffic and routing changes                  |

## Next step

> [!div class="nextstepaction"]
> [Prepare for workload migration](./migrate-workload-from-aws-prepare.md)