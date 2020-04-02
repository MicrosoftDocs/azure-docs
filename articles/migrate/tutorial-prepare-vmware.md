---
title: Prepare VMware VMs for assessment/migration with Azure Migrate
description: Learn how to prepare for assessment/migration of VMware VMs with Azure Migrate.
ms.topic: tutorial
ms.date: 11/19/2019
ms.custom: mvc
---

# Prepare VMware VMs for assessment and migration to Azure

This article helps you to prepare for assessment and/or migration of on-premises VMware VMs to Azure using [Azure Migrate](migrate-services-overview.md).



This tutorial is the first in a series that shows you how to assess and migrate VMware VMs. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare Azure to work with Azure Migrate.
> * Prepare VMware for VM assessment with the Azure Migrate:Server Assessment tool.
> * Prepare VMware for VM migration with the Azure Migrate:Server Migration tool. 

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They're useful when you learn how to set up a deployment, and as a quick proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prepare Azure

You need these permissions for these tasks in Azure, before you can assess or migrate VMware VMs.

**Task** | **Details** 
--- | --- 
**Create an Azure Migrate project** | Your Azure account needs Contributor or Owner permissions to create a project. 
**Register resource providers** | Azure Migrate uses a lightweight Azure Migrate appliance to discover and assess VMware VMs, and to migrate them to Azure with Azure Migrate:Server Assessment.<br/><br/> During appliance registration, resource providers are registered with the subscription chosen in the appliance. [Learn more](migrate-appliance-architecture.md#appliance-registration).<br/><br/> To register the resource providers, you need a Contributor or Owner role on the subscription.
**Create Azure AD apps** | When registering the appliance, Azure Migrate creates Azure Active Directory (Azure AD) apps. <br/><br/> - The first app is used for communication between the agents running on the appliance, and their respective services running on Azure.<br/><br/> - The second app is used exclusively to access KeyVault created in the user's subscription for agentless VMware VM migration. [Learn more](migrate-appliance-architecture.md#appliance-registration).<br/><br/> You need permissions to create Azure AD apps (available in the Application Developer) role.
**Create a Key Vault** | To migrate VMware VMs using agentless migration, Azure Migrate creates a Key Vault to manage access keys to the replication storage account in your subscription.<br/><br/> To create the vault, you need role assignment permissions on the resource group in which the Azure Migrate project resides.




### Assign permissions to create project

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** or **Owner** permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.

### Assign permissions to register the appliance

To register the appliance, you assign permissions for Azure Migrate to create the Azure AD apps during appliance registration. The permissions can be assigned using one of the following methods:

- **Grant permissions**: A tenant/global admin can grant permissions to users in the tenant, to create and register Azure AD apps.
- **Assign application developer role**: A tenant/global admin can assign the Application Developer role (that has the permissions) to the account.

> [!NOTE]
> - The apps don't have any other access permissions on the subscription other than those described above.
> - You only need these permissions when you register a new appliance. You can remove the permissions after the appliance is set up.


#### Grant account permissions

If you want tenant/global admin to grant permissions, do this as follows:

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**. This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).

    ![Azure AD permissions](./media/tutorial-prepare-vmware/aad.png)



#### Assign Application Developer role

Alternatively, the tenant/global admin can assign the Application Developer role to an account. [Learn more](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal) about assigning a role.

### Assign permissions to create a Key Vault

To enable Azure Migrate to create a Key Vault, assign permissions as follows:

1. In the resource group in the Azure portal, select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.

    - To run server assessment, **Contributor** permissions are enough.
    - To run agentless server migration, you should have **Owner** (or **Contributor** and **User Access Administrator**) permissions.

3. If you don't have the required permissions, request them from the resource group owner.



## Prepare for VMware VM assessment

To prepare for VMware VM assessment, you need to:

- **Verify VMware settings**. Make sure that the vCenter Server and VMs you want to migrate meet requirements.
- **Set up an account for assessment**. Azure Migrate uses this account to access the vCenter Server, to discover VMs for assessment.
- **Verify appliance requirements**. Verify deployment requirements for the Azure Migrate appliance, before you deploy it.

### Verify VMware settings

1. [Check](migrate-support-matrix-vmware.md#vmware-requirements) VMware server requirements for assessment.
2. [Make sure](migrate-support-matrix-vmware.md#port-access) that the  ports you need are open on vCenter Server.
3. On vCenter Server, make sure that your account has permissions to create a VM using an OVA file. You deploy the Azure Migrate appliance as a VMware VM, using an OVA file.


### Set up an account for assessment

Azure Migrate needs to access the vCenter Server to discover VMs for assessment and agentless migration.

- If you plan to discover applications or visualize dependency in an agentless manner, create a vCenter Server account with read-only access along with privileges enabled for **Virtual machines** > **Guest Operations**.

  ![vCenter Server account privileges](./media/tutorial-prepare-vmware/vcenter-server-permissions.png)

- If you are not planning to do application discovery and agentless dependency visualization, set up a read-only account for the vCenter Server.

### Verify appliance settings for assessment

Before setting up the Azure Migrate appliance and beginning assessment in the next tutorial, prepare for appliance deployment.

1. [Verify](migrate-appliance.md#appliance---vmware) Azure Migrate appliance requirements.
2. [Review](migrate-appliance.md#url-access) the Azure URLs that the appliance will need to access. If you're using a URL-based firewall or proxy, ensure it allows access to the required URLs.
3. [Review data](migrate-appliance.md#collected-data---vmware) that the appliance collects during discovery and assessment.
4. [Note](migrate-support-matrix-vmware.md#port-access) port access requirements for the appliance.




## Prepare for agentless VMware migration

Review the requirements for [agentless migration](server-migrate-overview.md) of VMware VMs.

1. [Review](migrate-support-matrix-vmware-migration.md#agentless-vmware-servers) VMware server requirements.
2. [Review the permissions](migrate-support-matrix-vmware-migration.md#agentless-vmware-servers) that Azure Migrate needs to access the vCenter Server.
3. [Review](migrate-support-matrix-vmware-migration.md#agentless-vmware-vms) VMware VMs requirements.
4. [Review](migrate-support-matrix-vmware-migration.md#agentless-azure-migrate-appliance) the Azure Migrate appliance requirements.
5. Note the [URL access](migrate-appliance.md#url-access) and [port access](migrate-support-matrix-vmware-migration.md#agentless-ports) requirements.

## Prepare for agent-based VMware migration

Review the requirements for [agent-based migration](server-migrate-overview.md) of VMware VMs.

1. [Review](migrate-support-matrix-vmware-migration.md#agent-based-vmware-servers) VMware server requirements.
2. [Review the permissions](migrate-support-matrix-vmware-migration.md#agent-based-vmware-servers) Azure Migrate needs to access the vCenter Server.
2. [Review](migrate-support-matrix-vmware-migration.md#agent-based-vmware-vms) VMware VMs requirements, including installation of the Mobility service on each VM you want to migrate.
3. Agent-based migration uses a replication appliance:
    - [Review](migrate-replication-appliance.md#appliance-requirements) the deployment requirements for the replication appliance.
    - [Review the options](migrate-replication-appliance.md#mysql-installation) for installing MySQL on the appliance.
    - Review the [URL](migrate-replication-appliance.md#url-access) and [port](migrate-replication-appliance.md#port-access) access requirements for the replication appliance.
    
## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Set up Azure permissions.
> * Prepared VMware for assessment and migration.


Continue to the second tutorial to set up an Azure Migrate project, and assess VMware VMs for migration to Azure.

> [!div class="nextstepaction"]
> [Assess VMware VMs](./tutorial-assess-vmware.md)
