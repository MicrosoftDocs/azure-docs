---
title: "Decommission your n-tier workload migration from on-premises to Azure"
description: Learn how to decommission on-premises infrastructure after migrating an n-tier workload to Azure, including license closeout and hardware disposition.
ms.author: rhackenberg
author: reginahack
ms.date: 11/03/2026
ms.topic: concept-article
ms.custom: migration-hub
ms.service: azure
ms.collection:
  - migration
  - on-prem-to-azure
---
# Decommission your n-tier workload migration from on-premises to Azure

This article is part of a series about how to [migrate an n-tier workload from on-premises to Azure](/azure/migration/migrate-n-tier-from-on-premises-introduction). 

**Migration phases:** [Plan](./migrate-n-tier-from-on-premises-1-plan.md) > [Prepare](./migrate-n-tier-from-on-premises-2-prepare.md) > [Execute](./migrate-n-tier-from-on-premises-3-execute.md) > [Evaluate](./migrate-n-tier-from-on-premises-4-evaluate.md) > **Decommission**

This phase is the final part of the workload migration. Proceed after you complete the evaluation phase and confirm that your workload operates as expected in Azure.

:::image type="icon" source="images/goal.svg" alt-text="Goal icon"::: The goal of this phase is to retire the source workload, physical dependencies, migration access, licenses, and contracts without losing data, recovery material, or required records.

> [!CAUTION]
> Prematurely deleting on-premises resources, overlooking hidden dependencies, or skipping final data and access checks can cause data loss, unexpected downtime, or compliance violations. Wiping, returning, or destroying source hardware removes the physical rollback path. Don't begin these irreversible actions until the hardware decommissioning approval names the assets, methods, required records, and responsible owners.

Delaying retirement can create ongoing costs for unused assets, licenses, and contracts.

## Retire the source environment

After the evaluation window closes and you complete rollback obligations, retention requirements, and legal holds, take the following actions to retire the source environment:

- **Confirm retirement readiness:** Secure required backups, catalogs, encryption keys, certificates, and restoration records separately from source hardware, and test that recovery uses them successfully. Complete dependency checks, monitoring handoff, and source-resource reconciliation. Validate that Azure can run, monitor, and recover the workload without using source services. Don't retire a source service until you confirm this sequence, clear all rollback criteria, and ensure that no other workload depends on the service.

- **Retire workload-owned source services and data:** Remove the workload's source database, application, file, monitoring, backup, replication, and scheduling components in an approved sequence. Validate that Azure is the identity authority before retiring workload-owned source identity. Keep source session state until existing sessions expire. Preserve shared infrastructure and any items that another workload still uses.

- **Remove migration access and automation:** Retire source-targeted credentials, service connections, deployment agents, migration appliances, replication software, certificates, firewall rules, role assignments, and other temporary migration paths.

- **Approve and complete physical decommissioning:** Treat hardware removal as a separate decision from stopping application traffic. Assign an item-level disposition to every equipment asset and piece of data-bearing media before removal. The workload owner and required security, operations, asset or procurement, and compliance owners must approve the assets, methods, evidence, and responsibilities. Follow change control, sanitization, and chain-of-custody requirements.

- **Update retirement records:** Record the retirement date and final resource state in the Configuration Management Database (CMDB), asset inventory, billing records, and documentation.

For more information, see [Decommission source workloads after migration to cloud](/azure/cloud-adoption-framework/migrate/decommission-source-workload).

### Close licenses and contracts

Licensing and contract treatment varies by agreement. Use the following table as a starting point to make sure cost cleanup doesn't create compliance problems.

| Area | Closeout action |
| --- | --- |
| Windows Server | Confirm Azure Hybrid Benefit treatment and retire or reassign source licenses under the applicable agreement. |
| SQL Server | Confirm the chosen Azure SQL or virtual machine (VM) licensing model and the source license disposition. |
| VMware | Reduce, cancel, or retain licensing for other workloads and record any Azure VMware Solution treatment. |
| Third-party applications and devices | Confirm Azure deployment rights, end temporary dual use, return dongles or appliances, and close vendor access. |
| User and access licenses | Record any Microsoft 365, client access license, or application entitlement change. |
| Facility and carrier services | Terminate, reduce, or transfer leases, circuits, cross-connects, remote-hands agreements, support, and maintenance. |

## Outputs and artifacts

Keep the following closure records together with the final Azure design.

| Output | Confirmed by | Ongoing use |
| --- | --- | --- |
| Hardware approval and asset dispositions | Workload, security, operations, asset, and compliance owners as required | Records irreversible work |
| Sanitization, custody, archive, key, and legal-hold evidence | Security, records, backup, legal, and compliance owners as required | Supports recovery and retention duties |
| Retired access, services, network paths, and monitoring | Platform, network, identity, security, and operations owners | Prevents stale access and duplicate work |
| License, contract, CMDB, cost, and architecture records | Asset, procurement, finance, workload, and operations owners | Defines steady-state ownership and cost |

### Archive evidence and records

Archive the following records that future operators, auditors, and migration teams might need:

- The final Azure and source architecture, network, Domain Name System (DNS) settings, firewall, load balancer, database, file, and backup diagrams or exports

- Database schemas, backup manifests, restore evidence, certificates, key records, retention decisions, and legal holds

- The final runbook with actual timing, state boundary, decisions, incidents, and resolution

- Infrastructure as code, deployment scripts, configuration changes, test results, and architecture decisions

- Asset dispositions, sanitization certificates, chain-of-custody records, contract changes, and license treatment

- The final cost comparison and the steady-state Azure operating baseline

Use an approved archive with the required access and retention. Mark source documentation as retired so responders don't follow an old procedure during an incident.

## Decision and handoff

The workload owners give final approval for decommissioning only after they record the completed irreversible actions, hardware approval, chain of custody, license and contract closeout, final cost, and any retained obligations.

Final approval requires the following conditions:

- The workload runs in Azure.

- A recorded recovery test confirms that the team can restore the workload through Azure recovery paths within the accepted RTO and RPO, or a designated approver accepts a documented exception.

- Every retained on-premises component has a documented purpose, owner, and retirement or retention decision.

- The physical recovery path is removed only after confirmation that the workload no longer needs it.

## Next step

> [!div class="nextstepaction"]
> [Workload migration conclusion](./migrate-n-tier-from-on-premises-conclusion.md)