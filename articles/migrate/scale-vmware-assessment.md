---
title: Assess large numbers of VMware VMs for migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to assess large numbers of VMware VMs for migration to Azure using the Azure Migrate service.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 05/26/2019
ms.author: raynew
---

# Assess large numbers of VMware VMs for migration to Azure

This article describes how to assess large numbers (1000-35,000) of on-premises VMware VMs for migration to Azure, using the [Azure Migrate](migrate-services-overview.md) service.

In this article, you learn how to:
> [!div class="checklist"]
> * Create an Azure subscription if you don't have one.
> * Set up permissions for your Azure account to create Azure Active Directory (Azure AD) apps.
> * Verify Hyper-V requirements for migration.
> * Set up an account that Azure Migrate will use to discover VMs on Hyper-V hosts and clusters.
> * Create an Azure Migrate project.


> [!NOTE]
> If you want to try out a proof-of-concept to assess a couple of VMs before assessing at scale, follow our [tutorial series](tutorial-prepare-vmware.md)

## Plan for assessment

When planning for assessment of large number of VMware VMs, there are a couple of things to think about:

- **Plan Azure Migrate projects**: You need to figure out how many Azure Migrate projects you need. You create Azure Migrate projects in the Azure portal. Within projects you interact with assessment and migration tools. Metadata and performance data collected during server assessment is sent to the project. 
- **Plan appliances**: Azure Migrate uses an on-premises Azure Migrate appliance to discover VMs, and send metadata and performance data about them to Azure. You need to figure out how to deploy one or more appliances.
- **Plan accounts for discovery**: If you're discovering more than 10,000 VMs, plan to set up multiple accounts for discovery.
 
Use the limits summarized in this table for planning.

**Planning** | **Limits**
--- | --- 
**Azure Migrate projects** | Assess up to 35,000 VMs in a project.
**Azure Migrate appliance** | Discover/assess VMs on a single vCenter Server only.<br/><br/> Assess VMs within a single Azure Migrate project only.<br/><br/> Discover up to 10,000 VMs on a vCenter Server.

With these limits in mind, here are some example deployments:


**vCenter server** | **VMs on server** | **Recommendation** | **Action**
---|---|---
One | < 10,000 | One Azure Migrate project.<br/> One appliance.<br/> One vCenter account for discovery. | Set up appliance, connect to vCenter Server with an account.
One | > 10,000 | One Azure Migrate project.<br/> Multiple appliances.<br/> Multiple vCenter accounts. | Set up appliance for every 10,000 VMs.<br/><br/> Set up vCenter accounts, and divide inventory to limit access for an account to less than 10,000 VMs.<br/> Connect each appliance to vCenter server with an account.<br/> You can analyze dependencies across machines that are discovered with different appliances.
Multiple | < 10,000 |  One Azure Migrate project.<br/> Multiple appliances.<br/> One vCenter account for discovery. | Set up appliances, connect to vCenter Server with an account.<br/> You can analyze dependencies across machines that are discovered with different appliances.
Multiple | > 10,000 | One Azure Migrate project.<br/> Multiple appliances.<br/> Multiple vCenter accounts. | If vCenter Server discovery < 10,000 VMs, set up an appliance for each vCenter Server.<br/><br/> If vCenter Server discovery > 10,000 VMs, set up an appliance for every 10,000 VMs.<br/> Set up vCenter accounts, and divide inventory to limit access for an account to less than 10,000 VMs.<br/> Connect each appliance to vCenter server with an account.<br/> You can analyze dependencies across machines that are discovered with different appliances.

### Plan discovery scope

Keep these points in mind when planning for discovery scope:

- You can set the appliance discovery scope to a vCenter Server datacenter, cluster or folder of clusters, host or folder of hosts, or individual VMs.
- If your environment is shared across tenants and you don't  want to discover each tenant separately, you can scope access to the vCenter account that the appliance uses for discovery. 
    - If the tenants share hosts, create credentials with read-only access for the VMs that belong to the specific tenant. 
    - Use these credentials for Azure Migrate appliance discovery.
    - Azure Migrate assessment can't discover VMs if the vCenter account has access granted at the vCenter VM folder level. Folders of hosts and clusters are supported. 

## Prepare for assessment

Set up permissions for your Azure account to create Azure Active Directory (Azure AD) apps, verify on-premises VMware settings, and set up an account that Azure Migrate will use to discover VMware VMs.

## Set up Azure account permissions

When you log into Azure to set up discovery and assessment, your Azure account needs permission to create Azure Active Directory (Azure AD) apps. Either a tenant/global admin can assign permissions to create Azure AD apps to the account, or you can assign the Application Developer role (that has the permissions) to the account.

### Grant account permissions

The tenant/global admin can grant permissions as follows

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-prepare-hyper-v/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).


### Assign Application Developer role 

The tenant/global admin has permissions to assign the role to the account. [Learn more](https://docs.microsoft.comazure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).


## Verify VMware settings for VM migration
1. Make sure that VMs that you want to discover and assess are managed by vCenter Server version 5.5, 6.0, or 6.5.
2. Make sure you have an ESXi host with version 5.0 or higher to deploy the Azure Migrate appliance.


## Set up a vCenter Server account

Azure Migrate needs access the vCenter Server to discover VMs for assessment. Prepare accounts as follows:

1. Set up one or more accounts in accordance with [planning recommendations](#plan-for-assessment)
2. Ensure that accounts have the following properties.
    - User type: At least a read-only user.
    - Permissions: Data Center object –> Propagate to Child Object, role=Read-only
    - Details: User assigned at datacenter level, and has access to all the objects in the datacenter.
    - To restrict access, assign the No access role with the Propagate to child object, to the child objects (vSphere hosts, datastores, VMs, and networks).
3. If required, set up account scope in accordance with [recommendations](#plan-discovery-scope).




## Set up an Azure Migrate project

Sign in to the [Azure portal](https://portal.azure.com), and set up an Azure Migrate project as follows.



1. In the Azure portal, search for **Azure Migrate**.
2. In the search results, under **Services**, select **Migration projects**.
3. In **Migration projects**, click **Add**.
4. In **Azure Migrate**, click **Assess and migrate servers**
5. In **Migration project**, specify a project name.
6. Select the subscription and create a new resource group.
7. Specify the geography/region in which you want to create the project. You can create an Azure Migrate project in the regions summarized in the table.
    - The region specified for the project is only used to store the metadata gathered from on-premises VMs.
    - You can select any target region for the actual migration.
    
    **Geography** | **Region**
    --- | ---
    Asia | Southeast Asia
    Europe | North Europe or West Europe
    Unites States | East US or West Central US

    ![Create an Azure Migrate project](./media/tutorial-prepare-hyper-v/migrate-project.png)

6. Click **Create**.

    



## Next steps

In this tutorial, you:
 
> [!div class="checklist"] 
> * Prepared for Hyper-V VM assessment and migration
> * Set up an Azure Migrate project

Continue to the next tutorial to assess Hyper-V VMs for migration to Azure

> [!div class="nextstepaction"] 
> [Assess Hyper-V VMs](./tutorial-assess-hyper-v.md) 
