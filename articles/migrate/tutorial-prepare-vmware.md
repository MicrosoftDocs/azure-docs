---
title: Prepare VMware VMs for assessment and migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to prepare for assessment and migration of on-premises VMware VMs to Azure using Azure Migrate.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 07/11/2019
ms.author: raynew
ms.custom: mvc
---

# Prepare VMware VMs for assessment and migration to Azure

This article describes how to prepare for assessment and migration of on-premises VMware VMs to Azure, using [Azure Migrate](migrate-services-overview.md).

[Azure Migrate](migrate-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings. 


This tutorial is the first in a series that shows you how to assess and migrate VMware VMs. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare Azure. Set up permissions for your Azure account and resources to work with Azure Migrate.
> * Prepare on-premises VMware servers and VMs for VM assessment.
> * Prepare on-premises VMware servers and VMs for VM migration.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How Tos for VMware assessment and migration.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prepare Azure

You need these Azure permissions:

- Your Azure account needs permissions to create an Azure Migrate project for assessment and migration. 
- For assessment and agentless migration of VMware VMs, Azure Migrate runs a lightweight appliance that discovers VMs, and sends VM metadata and performance data to Azure Migrate. In Azure, you need permissions to register the Azure Migrate appliance.
- To migrate VMware VMs using Azure Migrate Server Migration, Azure Migrate creates a Key Vault in the resource group, to manage access keys to the replication storage account in your subscription. To create the vault, you need role assignment permissions on the resource group in which the Azure Migrate project resides. 


### Assign permissions to create project

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** or **Owner** permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.

### Assign permissions to register the appliance

If you're deploying the Azure Migrate appliance to assess or run an agentless migration of VMs, you need to register it.

- During appliance registration, Azure Migrate creates two Azure Active Directory (Azure AD) apps that uniquely identify the appliance
    - The first app communicates with Azure Migrate service endpoints.
    - The second app accesses an Azure Key Vault created during registration to store Azure AD app info and appliance configuration settings.
- You can assign permissions for Azure Migrate to create these Azure AD apps using one of the following methods:
    - A tenant/global admin can grant permissions to users in the tenant, to create and register Azure AD apps.
    - A tenant/global admin can assign the Application Developer role (that has the permissions) to the account.

It's worth noting that:

- The apps don't have any other access permissions on the subscription other than those described above.
- You only need these permissions when you register a new appliance. You can remove the permissions after the appliance is set up. 


#### Grant account permissions

The tenant/global admin can grant permissions as follows

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-prepare-vmware/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).



#### Assign Application Developer role 

The tenant/global admin can assign the Application Developer role to an account. [Learn more](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).

## Assign role assignment permissions

Assign role assignment permissions on the resource group in which the Azure Migrate project resides, as follows:

1. In the resource group in the Azure portal, select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.

    - To run server assessment, **Contributor** permissions are enough.
    - To run agentless server migration, you should have **Owner** (or **Contributor** and **User Access Administrator**) permissions.

3. If you don't have the required permissions, request them from the resource group owner. 



## Prepare for VMware VM assessment

To prepare for VMware VM assessment, you need to verify Hyper-V host and VM settings, and verify settings for appliance deployment.

### Verify VMware settings

1. [Verify](migrate-support-matrix-vmware.md#assessment-vmware-server-requirements) VMware server requirements for VM assessment.
2. [Make sure](migrate-support-matrix-vmware.md#assessment-port-requirements) that the required ports are open on vCenter servers.


### Set up an account for assessment

Azure Migrate needs to access the vCenter Server to discover VMs for assessment and agentless migration. For assessment only, you need a read-only account for the vCenter Server.

If you're using a URL-based firewall.proxy, allow access to the required [Azure URLs](migrate-support-matrix-vmware.md#assessment-url-access-requirements).

Make sure that the proxy resolves any CNAME records received while looking up the URLs.


### Verify appliance settings for assessment

Before setting up the Azure Migrate appliance and beginning assessment in the next tutorial, prepare for appliance deployment.

1. Verify [Verify](migrate-support-matrix-vmware.md#assessment-appliance-requirements) requirements for setting up the Azure Migrate appliance in VMware.
2. [Review](migrate-support-matrix-vmware.md#assessment-url-access-requirements) the Azure URLs that the appliance will need to access.
3. Review the data that the appliance will collect during discovery and assessment.
4. [Note](migrate-support-matrix-vmware.md#assessment-port-requirements) port access requirements for the appliance.
5. You deploy the Azure Migrate appliance as a VMware VM using an OVA file. On vCenter Server, make sure that your account has permissions to create a VM using an OVA file.


## Prepare for agentless VMware migration

Review the requirements for agentless migration of VMware VMs.

1. [Review](migrate-support-matrix-vmware.md#agentless-migration-vmware-server-requirements) VMware server requirements for agentless migration.
2. Set up an account to access the vCenter Server with the [required permissions](migrate-support-matrix-vmware.md#agentless-migration-vcenter-server-permissions) for agentless migration.
3. [Note](migrate-support-matrix-vmware.md#agentless-migration-vmware-vm-requirements) the requirements for VMware VMs that you want to migrate to Azure using agentless migration.
4. [Review](migrate-support-matrix-vmware.md#agentless-migration-appliance-requirements) appliance requirements for agentless migration.]
5. Note appliance [URL access](migrate-support-matrix-vmware.md#agentless-migration-url-access-requirements) and [port access](migrate-support-matrix-vmware.md#agentless-migration-port-requirements) requirements for agentless migration.


## Prepare for agent-based VMware migration

Review the requirements for agent-based migration of VMware VMs.

1. [Review](migrate-support-matrix-vmware.md#agent-based-migration-vmware-server-requirements) VMware server requirements for agentless migration. 
2. Set up an account to access the vCenter Server with the [required permissions](migrate-support-matrix-vmware.md#agent-based-migration-vcenter-server-permissions) for agentless migration.
3. [Note](migrate-support-matrix-vmware.md#agent-based-migration-vmware-vm-requirements) the requirements for VMware VMs that you want to migrate to Azure using agent-based migration, including installation of the Mobility service on each VM you want to migrate.
4. Note [URL access](migrate-support-matrix-vmware.md#agent-based-migration-url-access-requirements).
5. Review [port access](migrate-support-matrix-vmware.md#agent-based-migration-port-requirements) requirements for the Mobility service running on each VM, and for the Azure Migrate configuration server.

## Next steps

In this tutorial, you:
 
> [!div class="checklist"] 
> * Set up Azure permissions.
> * Prepared VMware for assessment and migration.


Continue to the second tutorial to set up an Azure Migrate project, and assess VMware VMs for migration to Azure.

> [!div class="nextstepaction"] 
> [Assess VMware VMs](./tutorial-migrate-vmware.md) 

