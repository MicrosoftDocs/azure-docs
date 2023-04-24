---
title: Planning for migration from classic to Azure Resource Manager
description: In this article, learn how to plan for migration of IaaS resources from classic to Azure Resource Manager.
services: virtual-machines
author: oriwolman
manager: vashan
ms.service: virtual-machines
ms.subservice: classic-to-arm-migration
ms.workload: infrastructure-services
ms.topic: conceptual
ms.date: 01/25/2023
ms.author: oriwolman
ms.custom: compute-evergreen, devx-track-arm-template
---


# Planning for migration of IaaS resources from classic to Azure Resource Manager

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

> [!IMPORTANT]
> Today, about 90% of IaaS VMs are using [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/). As of February 28, 2020, classic VMs have been deprecated and will be fully retired on September 1, 2023. [Learn more]( https://aka.ms/classicvmretirement) about this deprecation and [how it affects you](classic-vm-deprecation.md#how-does-this-affect-me).

While Azure Resource Manager offers numerous amazing features, it's critical to plan out your migration journey to make sure things go smoothly. Spending time on planning will ensure that you don't encounter issues while executing migration activities.

> [!NOTE]
> The following guidance was heavily contributed to by the Azure Customer Advisory team and Cloud Solution architects working with customers on migrating large environments. As such this document will continue to get updated as new patterns of success emerge, so check back from time to time to see if there are any new recommendations.

There are four general phases of the migration journey:

![Migration phases](./media/virtual-machines-windows-migration-classic-resource-manager/plan-labtest-migrate-beyond.png)

## Plan

### Technical considerations and tradeoffs

Depending on your technical requirements size, geographies and operational practices, you might want to consider:

1. Why is Azure Resource Manager desired for your organization?  What are the business reasons for a migration?
2. What are the technical reasons for Azure Resource Manager?  What (if any) additional Azure services would you like to leverage?
3. Which application (or sets of virtual machines) is included in the migration?
4. Which scenarios are supported with the migration API?  Review the [unsupported features and configurations](migration-classic-resource-manager-overview.md).
5. Will your operational teams now support applications/VMs in both Classic and Azure Resource Manager?
6. How (if at all) does Azure Resource Manager change your VM deployment, management, monitoring, and reporting processes?  Do your deployment scripts need to be updated?
7. What are the communications plan to alert stakeholders (end users, application owners, and infrastructure owners)?
8. Depending on the complexity of the environment, should there be a maintenance period where the application is unavailable to end users and to application owners?  If so, for how long?
9. What is the training plan to ensure stakeholders are knowledgeable and proficient in Azure Resource Manager?
10. What is the program management or project management plan for the migration?
11. What are the timelines for the Azure Resource Manager migration and other related technology road maps?  Are they optimally aligned?

### Patterns of success

Successful customers have detailed plans where the preceding questions are discussed, documented and governed.  Ensure the migration plans are broadly communicated to sponsors and stakeholders.  Equip yourself with knowledge about your migration options; reading through this migration document set below is highly recommended.

* [Overview of platform-supported migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-overview.md)
* [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](migration-classic-resource-manager-deep-dive.md)
* [Planning for migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-plan.md)
* [Use PowerShell to migrate IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-ps.md)
* [Use CLI to migrate IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-cli.md)
* [Community tools for assisting with migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-community-tools.md)
* [Review most common migration errors](migration-classic-resource-manager-errors.md)
* [Review the most frequently asked questions about migrating IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-faq.yml)

### Pitfalls to avoid

- Failure to plan.  The technology steps of this migration are proven and the outcome is predictable.
- Assumption that the platform supported migration API will account for all scenarios. Read the [unsupported features and configurations](migration-classic-resource-manager-overview.md) to understand what scenarios are supported.
- Not planning potential application outage for end users.  Plan enough buffer to adequately warn end users of potentially unavailable application time.


## Lab Test

**Replicate your environment and do a test migration**
  > [!NOTE]
  > Exact replication of your existing environment is executed by using a community-contributed tool which is not officially supported by Microsoft Support. Therefore, it is an **optional** step but it is the best way to find out issues without touching your production environments. If using a community-contributed tool is not an option, then read about the Validate/Prepare/Abort Dry Run recommendation below.
  >

  Conducting a lab test of your exact scenario (compute, networking, and storage) is the best way to ensure a smooth migration. This will help ensure:

- A wholly separate lab or an existing non-production environment to test. We recommend a wholly separate lab that can be migrated repeatedly and can be destructively modified.  Scripts to collect/hydrate metadata from the real subscriptions are listed below.
- It's a good idea to create the lab in a separate subscription. The reason is that the lab will be torn down repeatedly, and having a separate, isolated subscription will reduce the chance that something real will get accidentally deleted.

  This can be accomplished by using the AsmMetadataParser tool. [Read more about this tool here](https://github.com/Azure/classic-iaas-resourcemanager-migration/tree/master/AsmToArmMigrationApiToolset)

### Patterns of success

The following were issues discovered in many of the larger migrations. This isn't an exhaustive list and you should refer to the [unsupported features and configurations](migration-classic-resource-manager-overview.md) for more detail. You may or may not encounter these technical issues but if you do solving these before attempting migration will ensure a smoother experience.

- **Do a Validate/Prepare/Abort Dry Run** -  This is perhaps the most important step to ensure Classic to Azure Resource Manager migration success. The migration API has three main steps: Validate, Prepare and Commit. Validate will read the state of your classic environment and return a result of all issues. However, because some issues might exist in the Azure Resource Manager stack, Validate won't catch everything. The next step in migration process, Prepare will help expose those issues. Prepare will move the metadata from Classic to Azure Resource Manager, but won't commit the move, and won't remove or change anything on the Classic side. The dry run involves preparing the migration, then aborting (**not committing**) the migrations prepare. The goal of validate/prepare/abort dry run is to see all of the metadata in the Azure Resource Manager stack, examine it (*programmatically or in Portal*), and verify that everything migrates correctly, and work through technical issues.  It will also give you a sense of migration duration so you can plan for downtime accordingly.  A validate/prepare/abort does not cause any user downtime; therefore, it is non-disruptive to application usage.
  - The items below will need to be solved before the dry run, but a dry run test will also safely flush out these preparation steps if they are missed. During enterprise migration, we've found the dry run to be a safe and invaluable way to ensure migration readiness.
  - When prepare is running, the control plane (Azure management operations) will be locked for the whole virtual network, so no changes can be made to VM metadata during validate/prepare/abort.  But otherwise any application function (RD, VM usage, etc.) will be unaffected.  Users of the VMs won't know that the dry run is being executed.

- **Express Route Circuits and VPN**. Currently Express Route Gateways with authorization links cannot be migrated without downtime. For the workaround, see [Migrate ExpressRoute circuits and associated virtual networks from the classic to the Resource Manager deployment model](../expressroute/expressroute-migration-classic-resource-manager.md).

- **VM Extensions** - Virtual Machine extensions are potentially one of the biggest roadblocks to migrating running VMs. Remediation of VM Extensions could take upwards of 1-2 days, so plan accordingly.  A working Azure agent is needed to report back VM Extension status of running VMs. If the status comes back as bad for a running VM, this will halt migration. The agent itself does not need to be in working order to enable migration, but if extensions exist on the VM, then both a working agent AND outbound internet connectivity (with DNS) will be needed for migration to move forward.
  - If connectivity to a DNS server is lost during migration, all VM Extensions except BGInfo v1.\* need to first be removed from every VM before migration prepare, and subsequently re-added back to the VM after Azure Resource Manager migration.  **This is only for VMs that are running.**  If the VMs are stopped deallocated, VM Extensions do not need to be removed. **Note:** Many extensions like Azure diagnostics and Defender for Cloud monitoring will reinstall themselves after migration, so removing them is not a problem.
  - In addition, make sure Network Security Groups are not restricting outbound internet access. This can happen with some Network Security Groups configurations. Outbound internet access (and DNS) is needed for VM Extensions to be migrated to Azure Resource Manager.
  - There are two versions of the BGInfo extension: v1 and v2.  If the VM was created using the Azure portal or PowerShell, the VM will likely have the v1 extension on it. This extension does not need to be removed and will be skipped (not migrated) by the migration API. However, if the Classic VM was created with the new Azure portal, it will likely have the JSON-based v2 version of BGInfo, which can be migrated to Azure Resource Manager provided the agent is working and has outbound internet access (and DNS).
  - **Remediation Option 1**. If you know your VMs won't have outbound internet access, a working DNS service, and working Azure agents on the VMs, then uninstall all VM extensions as part of the migration before Prepare, then reinstall the VM Extensions after migration.
  - **Remediation Option 2**. If VM extensions are too big of a hurdle, another option is to shutdown/deallocate all VMs before migration. Migrate the deallocated VMs, then restart them on the Azure Resource Manager side. The benefit here is that VM extensions will migrate. The downside is that all public facing Virtual IPs will be lost (this may be a non-starter), and obviously the VMs will shut down causing a much greater impact on working applications.

    > [!NOTE]
    > If a Microsoft Defender for Cloud policy is configured against the running VMs being migrated, the security policy needs to be stopped before removing extensions, otherwise the security monitoring extension will be reinstalled automatically on the VM after removing it.

- **Availability Sets** - For a virtual network (vNet) to be migrated to Azure Resource Manager, the Classic deployment (i.e. cloud service) contained VMs must all be in one availability set, or the VMs must all not be in any availability set. Having more than one availability set in the cloud service is not compatible with Azure Resource Manager and will halt migration.  Additionally, there cannot be some VMs in an availability set, and some VMs not in an availability set. To resolve this, you will need to remediate or reshuffle your cloud service.  Plan accordingly as this might be time consuming.

- **Web/Worker Role Deployments** -  Cloud Services containing web and worker roles cannot migrate to Azure Resource Manager. The web/worker roles must first be removed from the virtual network before migration can start.  A typical solution is to just move web/worker role instances to a separate Classic virtual network that is also linked to an ExpressRoute circuit, or to migrate the code to newer PaaS App Services (this discussion is beyond the scope of this document). In the former redeploy case, create a new Classic virtual network, move/redeploy the web/worker roles to that new virtual network, then delete the deployments from the virtual network being moved. No code changes required. The new [Virtual Network Peering](../virtual-network/virtual-network-peering-overview.md) capability can be used to peer together the classic virtual network containing the web/worker roles and other virtual networks in the same Azure region such as the virtual network being migrated (**after virtual network migration is completed as peered virtual networks cannot be migrated**), hence providing the same capabilities with no performance loss and no latency/bandwidth penalties. Given the addition of [Virtual Network Peering](../virtual-network/virtual-network-peering-overview.md), web/worker role deployments can now easily be mitigated and not block the migration to Azure Resource Manager.

- **Azure Resource Manager Quotas** - Azure regions have separate quotas/limits for both Classic and Azure Resource Manager. Even though in a migration scenario new hardware isn't being consumed *(we're swapping existing VMs from Classic to Azure Resource Manager)*, Azure Resource Manager quotas still need to be in place with enough capacity before migration can start. Listed below are the major limits we've seen cause problems.  Open a quota support ticket to raise the limits.

    > [!NOTE]
    > These limits need to be raised in the same region as your current environment to be migrated.
    >

  - Network Interfaces
  - Load Balancers
  - Public IPs
  - Static Public IPs
  - Cores
  - Network Security Groups
  - Route Tables

    You can check your current Azure Resource Manager quotas using the following commands with the latest version of Azure CLI.

    **Compute** *(Cores, Availability Sets)*

    ```azurecli
    az vm list-usage -l <azure-region> -o jsonc
    ```

    **Network** *(Virtual Networks, Static Public IPs, Public IPs, Network Security Groups, Network Interfaces, Load Balancers, Route Tables)*

    ```azurecli
    az network list-usages -l <azure-region> -o jsonc
    ```

    **Storage** *(Storage Account)*

    ```azurecli
    az storage account show-usage
    ```

- **Azure Resource Manager API throttling limits** - If you have a large enough environment (eg. > 400 VMs in a VNET), you might hit the default API throttling limits for writes (currently **1200 writes/hour**) in Azure Resource Manager. Before starting migration, you should raise a support ticket to increase this limit for your subscription.

- **Provisioning Timed Out VM Status** - If any VM has the status of **provisioning timed out**, this needs to be resolved pre-migration. The only way to do this is with downtime by deprovisioning/reprovisioning the VM (delete it, keep the disk, and recreate the VM).

- **RoleStateUnknown VM Status** - If migration halts due to a **role state unknown** error message, inspect the VM using the portal and ensure it is running. This error will typically go away on its own (no remediation required) after a few minutes and is often a transient type often seen during a Virtual Machine **start**, **stop**, **restart** operations. **Recommended practice:** re-try migration again after a few minutes.

- **Fabric Cluster does not exist** -  In some cases, certain VMs cannot be migrated for various odd reasons. One of these known cases is if the VM was recently created (within the last week or so) and happened to land an Azure cluster that is not yet equipped for Azure Resource Manager workloads.  You will get an error that says **fabric cluster does not exist** and the VM cannot be migrated. Waiting a couple of days will usually resolve this particular problem as the cluster will soon get Azure Resource Manager enabled. However, one immediate workaround is to `stop-deallocate` the VM, then continue forward with migration, and start the VM back up in Azure Resource Manager after migrating.

### Pitfalls to avoid

- Do not take shortcuts and omit the validate/prepare/abort dry run migrations.
- Most, if not all, of your potential issues will surface during the validate/prepare/abort steps.

## Migration

### Technical considerations and tradeoffs

Now you are ready because you have worked through the known issues with your environment.

For the real migrations, you might want to consider:

1. Plan and schedule the virtual network (smallest unit of migration) with increasing priority.  Do the simple virtual networks first, and progress with the more complicated virtual networks.
2. Most customers will have non-production and production environments.  Schedule production last.
3. **(OPTIONAL)** Schedule a maintenance downtime with plenty of buffer in case unexpected issues arise.
4. Communicate with and align with your support teams in case issues arise.

### Patterns of success

The technical guidance from the Lab Test section above should be considered and mitigated prior to a real migration.  With adequate testing, the migration is actually a non-event.  For production environments, it might be helpful to have additional support, such as a trusted Microsoft partner or Microsoft Premier services.

### Pitfalls to avoid

Not fully testing may cause issues and delay in the migration.  

## Beyond Migration

### Technical considerations and tradeoffs

Now that you are in Azure Resource Manager, maximize the platform.  Read the [overview of Azure Resource Manager](../azure-resource-manager/management/overview.md) to find out about additional benefits.

Things to consider:

- Bundling the migration with other activities.  Most customers opt for an application maintenance window.  If so, you might want to use this downtime to enable other Azure Resource Manager capabilities like encryption and migration to Managed Disks.
- Revisit the technical and business reasons for Azure Resource Manager; enable the additional services available only on Azure Resource Manager that applies to your environment.
- Modernize your environment with PaaS services.

### Patterns of success

Be purposeful on what services you now want to enable in Azure Resource Manager.  Many customers find the below compelling for their Azure environments:

- [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).
- [Azure Resource Manager templates for easier and more controlled deployment](../azure-resource-manager/templates/overview.md).
- [Tags](../azure-resource-manager/management/tag-resources.md).
- [Activity Control](../azure-monitor/essentials/activity-log.md)
- [Azure Policies](../governance/policy/overview.md)

### Pitfalls to avoid

Remember why you started this Classic to Azure Resource Manager migration journey.  What were the original business reasons? Did you achieve the business reason?


## Next steps

* [Overview of platform-supported migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-overview.md)
* [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](migration-classic-resource-manager-deep-dive.md)
* [Planning for migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-plan.md)
* [Use PowerShell to migrate IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-ps.md)
* [Community tools for assisting with migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-community-tools.md)
* [Review most common migration errors](migration-classic-resource-manager-errors.md)
* [Review the most frequently asked questions about migrating IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-faq.yml)
