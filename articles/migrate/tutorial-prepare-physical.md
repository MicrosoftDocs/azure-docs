---
title: Prepare physical servers for assessment/migration with Azure Migrate
description: Learn how to prepare for assessment/migration of physical servers with Azure Migrate.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 11/19/2019
ms.author: raynew
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


## Prepare Azure

### Azure permissions

You need set up permissions for Azure Migrate deployment.

- Permissions for your Azure account to create an Azure Migrate project.
- Permissions for your account to register the Azure Migrate appliance. The appliance is used for Hyper-V discovery and migration. During appliance registration, Azure Migrate creates two Azure Active Directory (Azure AD) apps that uniquely identify the appliance:
    - The first app communicates with Azure Migrate service endpoints.
    - The second app accesses an Azure Key Vault that's created during registration, to store Azure AD app info and appliance configuration settings.



### Assign permissions to create project

Check you have permissions to create an Azure Migrate project.

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** or **Owner** permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.


### Assign permissions to register the appliance

You can assign permissions for Azure Migrate to create the Azure AD apps creating during appliance registration, using one of the following methods:

- A tenant/global admin can grant permissions to users in the tenant, to create and register Azure AD apps.
- A tenant/global admin can assign the Application Developer role (that has the permissions) to the account.

It's worth noting that:

- The apps don't have any other access permissions on the subscription other than those described above.
- You only need these permissions when you register a new appliance. You can remove the permissions after the appliance is set up.


#### Grant account permissions

The tenant/global admin can grant permissions as follows:

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-prepare-hyper-v/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).

#### Assign Application Developer role

The tenant/global admin can assign the Application Developer role to an account. [Learn more](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).


## Prepare for physical server assessment

To prepare for physical server assessment, you need to verify the physical server settings and verify settings for appliance deployment:

### Verify physical server settings

1. Verify [physical server requirements](migrate-support-matrix-physical.md#physical-server-requirements) for server assessment.
2. Make sure the [required ports](migrate-support-matrix-physical.md#port-access) are open on physical servers.


### Verify appliance settings

Before setting up the Azure Migrate appliance and beginning assessment in the next tutorial, prepare for appliance deployment.

1. [Verify](migrate-appliance.md#appliance---physical) appliance requirements for physical servers.
2. [Review](migrate-appliance.md#url-access) the Azure URLs that the appliance will need to access.
3. [Review](migrate-appliance.md#collected-data---vmware) that that the appliance will collect during discovery and assessment.
4. [Note](migrate-support-matrix-physical.md#port-access) port access requirements physical server assessment.


### Set up an account for physical server discovery

Azure Migrate needs permissions to discover on-premises servers.

- **Windows:** Set up a local user account on all the Windows servers that you want to include in the discovery.The user account needs to be added to the following groups:
        - Remote Management Users
        - Performance Monitor Users
        - Performance Log users
- **Linux:** You need a root account on the Linux servers that you want to discover.

## Prepare for physical server migration

Review the requirements for migration of physical servers.

- [Review](migrate-support-matrix-physical-migration.md#physical-server-requirements) physical server requirements for migration.
- Azure Migrate: Server Migration uses a replication server for physical server migration:
    - [Review](migrate-replication-appliance.md#appliance-requirements) the deployment requirements for the replication appliance, and the [options](migrate-replication-appliance.md#mysql-installation) for installing MySQL on the appliance.
    - Review the [URL](migrate-replication-appliance.md#url-access) and [port] (migrate-replication-appliance.md#port-access) access requirements for the replication appliance.


## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Set up Azure account permissions.
> * Prepared physical servers for assessment.

Continue to the next tutorial to create an Azure Migrate project, and assess physical servers for migration to Azure

> [!div class="nextstepaction"]
> [Assess physical servers](./tutorial-assess-physical.md)
