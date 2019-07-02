---
title: Assess large numbers of VMware VMs for migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to assess large numbers of VMware VMs for migration to Azure using the Azure Migrate service.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 05/28/2019
ms.author: raynew
---

# Assess large numbers of VMware VMs for migration to Azure


This article describes how to assess large numbers (1000-35,000) of on-premises VMware VMs for migration to Azure, using the [Azure Migrate](migrate-services-overview.md) service.

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

- **Plan Azure Migrate projects**: You can create a single Azure Migrate project in the Azure portal. 
- **Plan appliances**: Azure Migrate uses an on-premises Azure Migrate appliance, deployed as a VMware VM, to continually discover VMs. The appliance monitors environment changes such as adding VMs, disks, or network adapters. It also sends metadata and performance data about them to Azure. You need to figure out how many appliances you need to deploy.
- **Plan accounts for discovery**: The Azure Migrate appliance uses an account with access to vCenter Server in order to discover VMs for assessment and migration. If you're discovering more than 10,000 VMs, plan to set up multiple accounts.


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

If you're planning for a multi-tenant environment, you can scope discovery on vCenter Server.

- You can set the appliance discovery scope to a vCenter Server datacenter, cluster or folder of clusters, host or folder of hosts, or individual VMs.
- If your environment is shared across tenants and you don't  want to discover each tenant separately, you can scope access to the vCenter account that the appliance uses for discovery. 
    - If the tenants share hosts, create credentials with read-only access for the VMs that belong to the specific tenant. 
    - Use these credentials for Azure Migrate appliance discovery.
    - Azure Migrate assessment can't discover VMs if the vCenter account has access granted at the vCenter VM folder level. Folders of hosts and clusters are supported. 

## Prepare for assessment

Prepare Azure and VMware for server assessment. 

1. Verify [VMware support requirements and limitations](migrate-support-matrix-vmware.md).
2. Set up permissions for your Azure account to create Azure Active Directory (Azure AD) apps and verify on-premises VMware settings.
3. Set up vCenter Server accounts, in line with your planning requirements.
4. Verify internet access, so that the Azure Migrate appliance can reach Azure URLs.

Follow the instructions in [this tutorial](tutorial-prepare-vmware.md) to configure these settings, and then come back to this article.

## Create a project and assessment

In accordance with your planning requirements, do the following:

1. Create an Azure Migrate project.
2. Set up one or more Azure Migrate appliances, and create assessments.
3. Review the assessments in preparation for migration planning.

Follow the instructions in [this tutorial](tutorial-assess-vmware.md) to configure these settings, and then come back to this article.
    

## Next steps

In this article, you:
 
> [!div class="checklist"] 
> * Planned to scale Azure Migrate assessments for VMware VMs
> * Prepared Azure and VMware for assessment
> * Created an Azure Migrate project and ran assessments
> * Reviewed assessments in preparation for migration.

Now, [learn how](concepts-assessment-calculation.md) assessments are calculated, and how to [modify assessments](how-to-modify-assessment.md).
