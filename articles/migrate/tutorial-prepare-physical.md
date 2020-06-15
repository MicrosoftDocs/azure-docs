---
title: Prepare physical servers for assessment/migration with Azure Migrate
description: Learn how to prepare for assessment/migration of physical servers with Azure Migrate.
ms.topic: tutorial
ms.date: 04/15/2020
ms.custom: mvc
---

# Prepare for assessment and migration of physical servers to Azure

This article describes how to prepare for assessment of on-premises physical servers with [Azure Migrate](migrate-services-overview.md).

[Azure Migrate](migrate-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings. 

This tutorial is the first in a series that shows you how to assess physical servers with Azure Migrate. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare Azure. Set up permissions for your Azure account and resources to work with Azure Migrate.
> * Prepare on-premises physical servers for server assessment.


> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How-tos for physical servers assessment.


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prepare Azure for server assessment

Set up Azure to work with Azure Migrate. 

**Task** | **Details** 
--- | --- 
**Create an Azure Migrate project** | Your Azure account needs Contributor or Owner permissions to create a project. 
**Register resource providers (assessment only)** | Azure Migrate uses a lightweight Azure Migrate appliance to discover and assess machines with Azure Migrate:Server Assessment.<br/><br/> During appliance registration, resource providers are registered with the subscription chosen in the appliance. [Learn more](migrate-appliance-architecture.md#appliance-registration).<br/><br/> To register the resource providers, you need a Contributor or Owner role on the subscription.
**Create Azure AD app (assessment only)** | When registering the appliance, Azure Migrate creates an Azure Active Directory (Azure AD) app that's used for communication between the agents running on the appliance with their respective services running on Azure. [Learn more](migrate-appliance-architecture.md#appliance-registration).<br/><br/> You need permissions to create Azure AD apps (available in the Application Developer) role.


### Assign permissions to create project 

Check you have permissions to create an Azure Migrate project.

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** or **Owner** permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.


### Assign permissions to register the appliance 

You can assign permissions for Azure Migrate to create the Azure AD app during appliance registration, using one of the following methods:

- A tenant/global admin can grant permissions to users in the tenant, to create and register Azure AD apps.
- A tenant/global admin can assign the Application Developer role (that has the permissions) to the account.

> [!NOTE]
> - The app does not have any other access permissions on the subscription other than those described above.
> - You only need these permissions when you register a new appliance. You can remove the permissions after the appliance is set up.


#### Grant account permissions

The tenant/global admin can grant permissions as follows:

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-prepare-hyper-v/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).

#### Assign Application Developer role

The tenant/global admin can assign the Application Developer role to an account. [Learn more](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).


## Prepare Azure for physical server migration

Prepare Azure to migrate physical servers, using Server Migration.

**Task** | **Details**
--- | ---
**Create an Azure Migrate project** | Your Azure account needs Contributer or Owner permissions to create a project.
**Verify permissions for your Azure account** | Your Azure account needs permissions to create a VM, and write to an Azure managed disk.
**Create an Azure network** | Set up a network in Azure.


### Assign permissions to create project

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** or **Owner** permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.


### Assign Azure account permissions

Assign the Virtual Machine Contributor role to the Azure account. This provides permissions to:
  - Create a VM in the selected resource group.
  - Create a VM in the selected virtual network.
  - Write to an Azure managed disk. 

### Create an Azure network

[Set up](../virtual-network/manage-virtual-network.md#create-a-virtual-network) an Azure virtual network (VNet). When you replicate to Azure, Azure VMs are created and joined to the Azure VNet that you specify when you set up migration.


## Prepare for physical server assessment

To prepare for physical server assessment, you need to verify the physical server settings and verify settings for appliance deployment:

### Verify physical server settings

1. Verify [physical server requirements](migrate-support-matrix-physical.md#physical-server-requirements) for server assessment.
2. Make sure the [required ports](migrate-support-matrix-physical.md#port-access) are open on physical servers.


### Verify appliance settings

Before setting up the Azure Migrate appliance and beginning assessment in the next tutorial, prepare for appliance deployment.

1. [Verify](migrate-appliance.md#appliance---physical) appliance requirements for physical servers.
2. Review the Azure URLs that the appliance needs to access in the [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.
3. [Review](migrate-appliance.md#collected-data---vmware) that the appliance will collect during discovery and assessment.
4. [Note](migrate-support-matrix-physical.md#port-access) port access requirements physical server assessment.


### Set up an account for physical server discovery

Azure Migrate needs permissions to discover on-premises servers.

- **Windows:** You need to be a domain admin, or local admin on all the Windows servers you want to discover. The user account should be added to these groups: Remote Management Users, Performance Monitor Users, and Performance Log Users.
- **Linux:** You need a root account on the Linux servers that you want to discover.

## Prepare for physical server migration

Review the requirements for migration of physical servers.

> [!NOTE]
> When migrating physical machines, Azure Migrate:Server Migration uses the same replication architecture as agent-based disaster recovery in the Azure Site Recovery service, and some components share the same code base. Some content might link to Site Recovery documentation.

1. [Review](migrate-support-matrix-physical-migration.md#physical-server-requirements) physical server requirements for migration.
2. Azure Migrate:Server Migration uses a replication server for physical server migration:
    - [Review](migrate-replication-appliance.md#appliance-requirements) the deployment requirements for the replication appliance, and the [options](migrate-replication-appliance.md#mysql-installation) for installing MySQL on the appliance.
    - Review the [Azure URLs](migrate-appliance.md#url-access) required for the replication appliance to access public and government clouds.
    - Review [port] (migrate-replication-appliance.md#port-access) access requirements for the replication appliance.
3. There are some changes needed on VMs before you migrate them to Azure.
    - It's important to make these changes before you begin migration. If you migrate the VM before you make the change, the VM might not boot up in Azure.
    - Review [Windows](prepare-for-migration.md#windows-machines) and [Linux](prepare-for-migration.md#linux-machines) changes you need to make.



## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Set up Azure account permissions.
> * Prepared physical servers for assessment.

Continue to the next tutorial to create an Azure Migrate project, and assess physical servers for migration to Azure

> [!div class="nextstepaction"]
> [Assess physical servers](./tutorial-assess-physical.md)
