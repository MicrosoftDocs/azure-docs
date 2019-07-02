---
title: Assess large numbers of Hyper-V VMs for migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to assess large numbers of Hyper-V VMs for migration to Azure using the Azure Migrate service.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 05/28/2019
ms.author: raynew
---

# Assess large numbers of Hyper-V VMs for migration to Azure

This article describes how to assess large numbers (> 1000) of on-premises Hyper-V VMs for migration to Azure, using the [Azure Migrate](migrate-services-overview.md) service.

In this article, you learn how to:
> [!div class="checklist"]
> * Set up permissions for your Azure account to create Azure Active Directory (Azure AD) apps.
> * Verify Hyper-V requirements for migration.
> * Set up an account that Azure Migrate will use to discover VMs on Hyper-V hosts and clusters.
> * Create an Azure Migrate project.


> [!NOTE]
> If you want to try out a proof-of-concept to assess a couple of VMs before assessing at scale, follow our [tutorial series](tutorial-prepare-hyper-v.md)

## Plan for assessment

When planning for assessment of large number of Hyper-V VMs, there are a couple of things to think about:

- **Plan Azure Migrate projects**: You can create a single Azure Migrate project in the Azure portal.
- **Plan appliances**: Azure Migrate uses an on-premises Azure Migrate appliance, deployed as a Hyper-V VM, to continually discover VMs. The appliance monitors environment changes such as adding VMs, disks, or network adapters. It also sends metadata and performance data about them to Azure. You need to figure out how many appliances you need to deploy.


## Planning limits
 
Use the limits summarized in this table for planning.

**Planning** | **Limits**
--- | --- 
**Azure Migrate projects** | Assess up to 10,000 VMs in a project.
**Azure Migrate appliance** | An appliance can discover up to 5000 VMs on a Hyper-V host.<br/> An appliance can connect to up to 300 Hyper-V hosts.<br/> An appliance can only be associated with a single Azure Migrate project.<br/><br/> 
**Azure Migrate assessment** | You can assess up to 10,000 VMs in a single assessment.



## Other planning considerations

- Bear in mind that to start discovery from the appliance you have to select each Hyper-V host. 
- If you're running a multi-tenant environment, you can't currently discover only VMs that belong to a specific tenant. 

## Prepare for assessment

Prepare Azure and Hyper-V for server assessment. 

1. Verify [Hyper-V support requirements and limitations](migrate-support-matrix-hyper-v.md).
2. Set up permissions for your Azure account to create Azure Active Directory (Azure AD) apps and verify on-premises Hyper-V settings. 
3. Set up an account on Hyper-V hosts or clusters. Azure Migrate uses this account for VM discovery. 
4. Enable Integration Services on each VM you want to discover.
5. Verify internet access so that the appliance VM can reach Azure URLs.

Follow the instructions in [this tutorial](tutorial-prepare-hyper-v.md) to configure these settings, and then come back to this article.

## Create a project and assessments

In accordance with your planning requirements, set up the following:

1. Create an Azure Migrate project.
2. Set up one or more Azure Migrate appliances, and create assessments.
3. Review the assessments in preparation for migration planning.

Follow the instructions in [this tutorial](tutorial-assess-hyper-v.md) to configure these settings, and then come back to this article.
    

## Next steps

In this article, you:
 
> [!div class="checklist"] 
> * Planned to scale Azure Migrate assessments for Hyper-V VMs
> * Prepared Azure and Hyper-V for assessment
> * Created an Azure Migrate project and ran assessments
> * Reviewed assessments in preparation for migration.

Now, [learn how](concepts-assessment-calculation.md) assessments are calculated, and how to [modify assessments](how-to-modify-assessment.md)
