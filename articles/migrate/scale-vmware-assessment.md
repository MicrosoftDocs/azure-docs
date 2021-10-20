---
title: Assess large numbers of servers in VMware environment for migration to Azure with Azure Migrate 
description: Describes how to assess large numbers of servers in VMware environment for migration to Azure using the Azure Migrate service.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: how-to
ms.date: 03/23/2020
---

# Assess large numbers of servers in VMware environment for migration to Azure


This article describes how to assess large numbers (1000-35,000) of on-premises servers in VMware environment for migration to Azure, using the Azure Migrate Discovery and assessment tool.

[Azure Migrate](migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings. 

In this article, you learn how to:
> [!div class="checklist"]
> * Plan for assessment at scale.
> * Configure Azure permissions, and prepare VMware for assessment.
> * Create an Azure Migrate project, and create an assessment.
> * Review the assessment as you plan for migration.


> [!NOTE]
> If you want to try out a proof-of-concept to assess a couple of servers before assessing at scale, follow our [tutorial series](./tutorial-discover-vmware.md)

## Plan for assessment

When planning for assessment of large number of servers in VMware environment, there are a couple of things to think about:

- **Plan Azure Migrate projects**: Figure out how to deploy Azure Migrate projects. For example, if your data centers are in different geographies, or you need to store discovery, assessment or migration-related metadata in a different geography, you might need multiple projects. 
- **Plan appliances**: Azure Migrate uses an on-premises Azure Migrate appliance, deployed as a VMware VM, to continually discover servers. The appliance monitors environment changes such as adding servers, disks, or network adapters. It also sends metadata and performance data about them to Azure. You need to figure out how many appliances you need to deploy.
- **Plan accounts for discovery**: The Azure Migrate appliance uses an account with access to vCenter Server in order to discover servers for assessment and migration. If you're discovering more than 10,000 servers, set up multiple accounts as it is required there is no overlap among servers discovered from any two appliances in a project. 

> [!NOTE]
> If you are setting up multiple appliances, ensure there is no overlap among the servers on the vCenter accounts provided. A discovery with such an overlap is an unsupported scenario. If a server is discovered by more than one appliance, this results in duplicates in discovery and in issues while enabling replication for the server using the Azure portal in Server Migration.

## Planning limits
 
Use the limits summarized in this table for planning.

**Planning** | **Limits**
--- | --- 
**Azure Migrate projects** | Assess up to 35,000 servers in a project.
**Azure Migrate appliance** | An appliance can discover up to 10,000 servers on a vCenter Server.<br/> An appliance can only connect to a single vCenter Server.<br/> An appliance can only be associated with a single Azure Migrate project.<br/>  Any number of appliances can be associated with a single Azure Migrate project. <br/><br/> 
**Group** | You can add up to 35,000 servers in a single group.
**Azure Migrate assessment** | You can assess up to 35,000 servers in a single assessment.

With these limits in mind, here are some example deployments:


**vCenter server** | **Servers on server** | **Recommendation** | **Action**
---|---|---|---
One | < 10,000 | One Azure Migrate project.<br/> One appliance.<br/> One vCenter account for discovery. | Set up appliance, connect to vCenter Server with an account.
One | > 10,000 | One Azure Migrate project.<br/> Multiple appliances.<br/> Multiple vCenter accounts. | Set up appliance for every 10,000 servers.<br/><br/> Set up vCenter accounts, and divide inventory to limit access for an account to less than 10,000 servers.<br/> Connect each appliance to vCenter server with an account.<br/> You can analyze dependencies across servers that are discovered with different appliances. <br/> <br/> Ensure there is no overlap among the servers on the vCenter accounts provided. A discovery with such an overlap is an unsupported scenario. If a server is discovered by more than one appliance, this results in a duplicates in discovery and in issues while enabling replication for the server using the Azure portal in Server Migration.
Multiple | < 10,000 |  One Azure Migrate project.<br/> Multiple appliances.<br/> One vCenter account for discovery. | Set up appliances, connect to vCenter Server with an account.<br/> You can analyze dependencies across servers that are discovered with different appliances.
Multiple | > 10,000 | One Azure Migrate project.<br/> Multiple appliances.<br/> Multiple vCenter accounts. | If vCenter Server discovery < 10,000 servers, set up an appliance for each vCenter Server.<br/><br/> If vCenter Server discovery > 10,000 servers, set up an appliance for every 10,000 servers.<br/> Set up vCenter accounts, and divide inventory to limit access for an account to less than 10,000 servers.<br/> Connect each appliance to vCenter server with an account.<br/> You can analyze dependencies across servers that are discovered with different appliances. <br/><br/> Ensure there is no overlap among the servers on the vCenter accounts provided. A discovery with such an overlap is an unsupported scenario. If a server is discovered by more than one appliance, this results in a duplicates in discovery and in issues while enabling replication for the server using the Azure portal in Server Migration.



## Plan discovery in a multi-tenant environment

If you're planning for a multi-tenant environment, you can scope the discovery on the vCenter Server.

- You can set the appliance discovery scope to a vCenter Server datacenters, clusters or folder of clusters, hosts or folder of hosts, or individual servers.
- If your environment is shared across tenants and you want to discover each tenant separately, you can scope access to the vCenter account that the appliance uses for discovery. 
    - You may want to scope by VM folders if the tenants share hosts. Azure Migrate can't discover servers if the vCenter account has access granted at the vCenter VM folder level. If you are looking to scope your discovery by VM folders, you can do so by ensuring the vCenter account has read-only access assigned at a server level. [Learn more](set-discovery-scope.md).

## Prepare for assessment

Prepare Azure and VMware for Discovery and assessment tool:

1. Verify [VMware support requirements and limitations](migrate-support-matrix-vmware.md).
2. Set up permissions for your Azure account to interact with Azure Migrate.
3. Prepare VMware for assessment.

Follow the instructions in [this tutorial](./tutorial-discover-vmware.md) to configure these settings.


## Create a project

In accordance with your planning requirements, do the following:

1. Create an Azure Migrate projects.
2. Add the Azure Migrate Discovery and assessment tool to the projects.

[Learn more](./create-manage-projects.md)

## Create and review an assessment

1. Create assessments for servers in VMware environment.
1. Review the assessments in preparation for migration planning.


Follow the instructions in [this tutorial](./tutorial-assess-vmware-azure-vm.md) to configure these settings.
    

## Next steps

In this article, you:
 
> [!div class="checklist"] 
> * Planned to scale Azure Migrate assessments for servers in VMware environment
> * Prepared Azure and VMware for assessment
> * Created an Azure Migrate project and ran assessments
> * Reviewed assessments in preparation for migration.

Now, [learn how](concepts-assessment-calculation.md) assessments are calculated, and how to [modify assessments](how-to-modify-assessment.md).