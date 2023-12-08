---
title: Azure region relocation workload architectures
description:  Learn about Azure region relocation workload architectures and how to choose one over the other.
author: anaharris-ms
ms.topic: overview
ms.date: 12/08/2023
ms.author: anaharris
ms.service: reliability
ms.subservice: availability-zones
ms.custom: subject-reliability
---

# Azure region relocation workload architectures

This article covers the three Azure region relocation workload architectures, as well as SLO and SLA expectations for each. It also contains guidance on how to choose one architecture over the other when planning a region move.


## Workload relocation architectures

The following workload architectures are applicable to production and live solutions typically composed of several modules or components. A relocation is similar to a Business Continuity and Disaster Recovery (BCDR) scenario, as both attempt to run a workload in another region. The only difference between BCDR and relocation is the trigger event.

In a BCDR scenario, the trigger event is unexpected, such as a natural disaster or outage. Relocation is a planned and voluntary action that's typically performed only once.

The are three fundamental workload architectures used to enable a BCDR scenarios

### Cold standby

In a cold standby scenario, the workload data is backed up regularly based on the requirements of the workload. In case of a disaster, the workload is redeployed in a new Azure region and the data is restored. The duration of the overall process to make the workload available, defines the RTO for the workload. It can be hours or days depending on the solution.

:::image type="content" source="media/relocation/cold-standby.png" alt-text="Diagram of cold standby architecture.":::

### Warm standby

In a warm standby scenario, the application is available in the BCDR region and the data is replicated asynchronously or synchronously. In the event of BCDR, the environment is scaled up and out to cope with the expected load. The switch to the BCDR site is manual. The duration of the overall process to make the workload available defines the RTO for the workload. It can be minutes or hours depending on the solution. With asynchronous replication, data loss is possible.

:::image type="content" source="media/relocation/warm-standby.png" alt-text="Diagram of warm standby architecture.":::

### Multi-site active/active

In the active/active scenario, the application is available in both regions and the data is replicated synchronous. Both regions have a writable copy of the data. In case one region goes done, the other is still active and can service consumers. Depending on the load, it might need to be scaled up or out. There is little to no downtime for your users.

:::image type="content" source="media/relocation/multisite.png" alt-text="Diagram of multisite  architecture.":::

## Choose a workload relocation architecture

The criteria for choosing one workload relocation architecture over another are based on:

- Current workload architecture and implementation.
- Identifying the accepted end-user impact in terms of planned downtime or outages.
- The level of data synchronization required between the two regions (pre and post relocation).

The diagram below is a decision tree that can help determine which architecture to consider. Service downtime is a key determinant used to identify the appropriate architecture.

:::image type="content" source="media/relocation/decision-tree.png" alt-text="Diagram of a decision tree to help determine which architecture to use.":::

>[!NOTE]
>Based on the architecture of the workloads, it is possible that you need to apply different relocation strategies to different Azure services. The selection of the appropriate strategy is based on the acceptance of downtime, as well as the existing context.

### Cold standby

Cold standby is considered the most straightforward relocation approach. The main idea is to consider the relocation as a migration that incurs downtime during a cut-over period. For example, a workload is shut down, then migrated to a new region, and brought online.

The Cold Standby approach applies to production and non-production systems. In either case, the relocation should be accompanied by the necessary planning and testing.

#### Benefits of cold standby

- Relocation cost
- Operational effort
- Easy to adopt independently based on the maturity or context of the customer
  and workload
- Based on solid and stable tools and patterns like backup and restore

#### Limitations of cold standby

- Business outages
- User satisfaction

#### Tools and resources for cold standby

- Azure Resource Mover
- [Automation Foundation Framework](/technical-delivery-playbook/automation/automation-foundation-framework/)
- [Relocation Factory](/technical-delivery-playbook/automation/relocation-fabric/)
- Backup and Restore
- Github CI Pipelines

### Warm standby

The warm standby pattern aims to reduce the cut-over period, therefore reducing the planned downtime. It is based on the blue/green deployment pattern observable in many services. This pattern is achieved by duplicating (and replicating) the deployment to the secondary region, and using a management solution to switch the endpoints.

Although beneficial to different architecture types, warm standby accelerates the relocation of event-driven applications, because data sync between regions can be easily achieved.

#### Benefits of warm standby

- Minimize outages
- Based on
  [Blue/green pattern](https://azure.microsoft.com/de-de/blog/blue-green-deployments-using-azure-traffic-manager/)
- Based on standard patterns and tools like IaC and data migration tools

#### Limitations of warm standby

Relocation cost can be high if a refactoring the current architecture is
  required

#### Tools and resources for warm standby

- Azure DevOps or Github CI Pipelines
- Blue/green deployment
- ARM or Terraform
- [Automation Foundation Framework](/technical-delivery-playbook/automation/automation-foundation-framework/)
- [Relocation Factory](/technical-delivery-playbook/automation/relocation-fabric/)

### Multi-Site active-active

The multi-site active-active pattern is designed for workloads that need near-zero downtime when relocating. This pattern is based on:

- The [Blue/green pattern](https://azure.microsoft.com/de-de/blog/blue-green-deployments-using-azure-traffic-manager/)
- Native multi-region data replication

#### Benefits of multi-Site active-active

- Minimize outages
- Based on standard patterns and tools like blue/green, IaC, and data migration
  tools

#### Limitations of multi-Site active-active

- Relocation cost can be high if a refactoring the current architecture is
  required
- Potential for data loss
- Requires implementation of complex architectural pattern like event-driven
  architecture and multi-region data replication

#### Tools and resources for multi-Site active-active

- Azure DevOps or Github CI Pipelines
- Blue/green deployment
- ARM or Terraform
- [Automation Foundation Framework](/technical-delivery-playbook/automation/automation-foundation-framework/)
- [Relocation Factory](/technical-delivery-playbook/automation/relocation-fabric/)
- Global data services like CosmosDB, PostgreSQL Replication