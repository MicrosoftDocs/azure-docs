---
title: Assess large numbers of VMware VMs for migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to assess large numbers of VMware VMs for migration to Azure using the Azure Migrate service.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/12/2019
ms.author: hamusa
---

# Assess large numbers of VMware VMs for migration to Azure


This article describes how to assess large numbers (1000-35,000) of on-premises VMware VMs for migration to Azure, using the Azure Migrate Server Assessment tool

[Azure Migrate](migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings. 

In this article, you learn how to:
> [!div class="checklist"]
> * Plan for assessment at scale.
> * Configure Azure permissions, and prepare VMware for assessment.
> * Create an Azure Migrate project, and create an assessment.
> * Review the assessment as you plan for migration.


> [!NOTE]
> If you want to try out a proof-of-concept to assess a couple of VMs before assessing at scale, follow our [tutorial series](tutorial-prepare-vmware.md)

## Plan for assessment

When planning for assessment of large number of VMware VMs, there are a couple of things to think about:

- **Plan Azure Migrate projects**: Figure out how to deploy Azure Migrate projects. For example, if your data centers are in different geographies, or you need to store discovery, assessment or migration-related metadata in a different geography, you might need multiple projects. 
- **Plan appliances**: Azure Migrate uses an on-premises Azure Migrate appliance, deployed as a VMware VM, to continually discover VMs. The appliance monitors environment changes such as adding VMs, disks, or network adapters. It also sends metadata and performance data about them to Azure. You need to figure out how many appliances you need to deploy.
- **Plan accounts for discovery**: The Azure Migrate appliance uses an account with access to vCenter Server in order to discover VMs for assessment and migration. If you're discovering more than 10,000 VMs, set up multiple accounts.


## Planning limits
 
Use the limits summarized in this table for planning.

**Planning** | **Limits**
--- | --- 
**Azure Migrate projects** | Assess up to 35,000 VMs in a project.
**Azure Migrate appliance** | An appliance can only connect to a single vCenter Server.<br/><br/> An appliance can only be associated with a single Azure Migrate project.<br/> An appliance can discover up to 10,000 VMs on a vCenter Server.
**Azure Migrate assessment** | You can assess up to 35,000 VMs in a single assessment.

With these limits in mind, here are some example deployments:


**vCenter server** | **VMs on server** | **Recommendation** | **Action**
---|---|---
One | < 10,000 | One Azure Migrate project.<br/> One appliance.<br/> One vCenter account for discovery. | Set up appliance, connect to vCenter Server with an account.
One | > 10,000 | One Azure Migrate project.<br/> Multiple appliances.<br/> Multiple vCenter accounts. | Set up appliance for every 10,000 VMs.<br/><br/> Set up vCenter accounts, and divide inventory to limit access for an account to less than 10,000 VMs.<br/> Connect each appliance to vCenter server with an account.<br/> You can analyze dependencies across machines that are discovered with different appliances.
Multiple | < 10,000 |  One Azure Migrate project.<br/> Multiple appliances.<br/> One vCenter account for discovery. | Set up appliances, connect to vCenter Server with an account.<br/> You can analyze dependencies across machines that are discovered with different appliances.
Multiple | > 10,000 | One Azure Migrate project.<br/> Multiple appliances.<br/> Multiple vCenter accounts. | If vCenter Server discovery < 10,000 VMs, set up an appliance for each vCenter Server.<br/><br/> If vCenter Server discovery > 10,000 VMs, set up an appliance for every 10,000 VMs.<br/> Set up vCenter accounts, and divide inventory to limit access for an account to less than 10,000 VMs.<br/> Connect each appliance to vCenter server with an account.<br/> You can analyze dependencies across machines that are discovered with different appliances.


## Plan discovery in a multi-tenant environment

If you're planning for a multi-tenant environment, you can scope the discovery on the vCenter Server.

- You can set the appliance discovery scope to a vCenter Server datacenters, clusters or folder of clusters, hosts or folder of hosts, or individual VMs.
- If your environment is shared across tenants and you want to discover each tenant separately, you can scope access to the vCenter account that the appliance uses for discovery. 
    - You may want to scope by VM folders if the tenants share hosts. Azure Migrate can't discover VMs if the vCenter account has access granted at the vCenter VM folder level. If you are looking to scope your discovery by VM folders, you can do so by ensuring the vCenter account has read-only access assigned at a VM level. Learn more about scoping discovery [here](tutorial-assess-vmware.md#scoping-discovery).

## Prepare for assessment

Prepare Azure and VMware for server assessment. 

1. Verify [VMware support requirements and limitations](migrate-support-matrix-vmware.md).
2. Set up permissions for your Azure account to interact with Azure Migrate.
3. Prepare VMware for assessment.

Follow the instructions in [this tutorial](tutorial-prepare-vmware.md) to configure these settings.


## Create a project

In accordance with your planning requirements, do the following:

1. Create an Azure Migrate projects.
2. Add the Azure Migrate Server Assessment tool to the projects.

[Learn more](how-to-add-tool-first-time.md)

## Create and review an assessment

1. Create assessments for VMware VMs.
1. Review the assessments in preparation for migration planning.


Follow the instructions in [this tutorial](tutorial-assess-vmware.md) to configure these settings.
    

## Next steps

In this article, you:
 
> [!div class="checklist"] 
> * Planned to scale Azure Migrate assessments for VMware VMs
> * Prepared Azure and VMware for assessment
> * Created an Azure Migrate project and ran assessments
> * Reviewed assessments in preparation for migration.

Now, [learn how](concepts-assessment-calculation.md) assessments are calculated, and how to [modify assessments](how-to-modify-assessment.md).
