---
title: Prepare VMware VMs for assessment and migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to prepare for assessment and migration of on-premises VMware VMs to Azure using Azure Migrate.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 05/26/2019
ms.author: raynew
ms.custom: mvc
---

# Prepare VMware VMs for assessment and migration to Azure

This article describes how to prepare your on-premises environment and Azure resources for migration of on-premises VMware VMs to Azure, using [Azure Migrate](migrate-services-overview.md) server assessment and migration

This tutorial is the first in a series that shows you how to assess and migrate VMware VMs. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up permissions for your Azure account and resources to work with Azure Migrate.
> * Verify vCenter Server and ESXi host settings.
> * Create an account on the vCenter Server. The account is used by the Azure Migrate service to discover VMware VMs for assessment and migration.
> * Verify you have vCenter Server permissions to create a VMware VM with an OVA file. Azure Migrate uses a lightweight appliance set up as a VMware VM using an OVA file, for discovery and assessment.
> * Verify required ports, and appliance internet access to Azure URLs.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How Tos for VMware assessment and migration.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Before you begin

1. Sign in to the [Azure portal](https://portal.azure.com).
2. [Review VMware](migrate-support-matrix-vmware.md) requirements for assessment and migration.


## Set up Azure permissions

Your Azure account needs a number of permissions.

**Permission** | **Details**
--- | --- 
**Create Azure Migrate project**  | To create an Azure Migrate project, the Azure account needs Contributor or Owner permissions for the subscription.
**Register subscription**  | You create an appliance as you deploy Azure Migrate Server Assessment and Server Migration. During appliance registration, it creates two Azure Active Directory (Azure AD) apps that uniquely identify the appliance<br/> - The first app communicates with Azure Migrate service endpoints. <br/> - The second app accesses an Azure Key Vault created during registration to store Azure AD app info and appliance configuration settings.<br/> The Azure Migrate account needs permission to create these Azure AD apps.
**Migrate permissions** | To migrate VMware VMs using Azure Migrate Server Migration, Azure Migrate creates a Key Vault in the resource group, to manage access keys to the replication storage account in your subscription. To do this, you need role assignment permissions on the resource group in which the Azure Migrate project resides. 


## Assign permissions to create project

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** or **Owner** permissions. If you don't, request them from the subscription owner. 

- If you just created your free Azure account, you're the owner of your subscription.
- If you're not the subscription owner, work with the owner to assign the role.

## Assign permissions to register the appliance

You can assign permissions using one of the following methods:

- A tenant/global admin can grant permissions to create Azure AD apps to the account.
- You can assign the Application Developer role (that has the permissions) to the account.

It's worth noting that:

- The apps don't have any other access permissions on the subscription other than those described above.
- You only need these permissions when you register a new appliance. You can remove the permissions after the appliance is set up. 

### Grant account permissions

The tenant/global admin can grant permissions as follows

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-prepare-vmware/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).



### Assign Application Developer role 

The tenant/global admin has permissions to assign the role to the account. [Learn more](https://docs.microsoft.comazure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).

## Assign role assignment permissions

Assign role assignment permissions on the resource group in which the Azure Migrate project resides, as follows:

1. In the resource group in the Azure portal, select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.

    - To run server assessment, **Contributor** permissions are enough.
    - To run server migration, you should have **Owner** (or **Contributor** and **User Access Administrator**) permissions.

3. If you don't have the required permissions, request them from the resource group owner. 



## Verify VMware settings

1. Verify [VMware requirements](migrate-support-matrix-vmware.md#vmware-requirements) for VM assessment and migration.
2. Verify [requirements](migrate-support-matrix-vmware.md#azure-migrate-appliance-support) for setting up the Azure Migrate appliance in VMware.
3. You set up the Azure Migrate appliance using an OVA file. On vCenter Server, make sure that your account has permissions to create a VM using an OVA file.

## Set up an account for discovery

Azure Migrate needs to access the vCenter Server to discover VMs for assessment and migration. Prepare an account with the [required permissions](migrate-support-matrix-vmware.md#vcenter-account-permissions) for assessment and migration.


## Verify port and URL access

There are a number of ports required for Azure Migrate Server Assessment and Server Migration. In addition, the Azure Migrate appliance needs internet connectivity to Azure.

1. [Review](migrate-support-matrix-vmware.md#required-ports) port requirements.
2. If you're using a URL-based firewall.proxy, allow access to the required [Azure URLs](migrate-support-matrix-vmware.md#url-access-requirements).
3. Make sure that the proxy resolves any CNAME records received while looking up the URLs.

When you deploy the appliance, Azure Migrate does a connectivity check to the URLs summarized in the table below.


## Next steps

In this tutorial, you:
 
> [!div class="checklist"] 
> * Set up Azure permissions.
> * Prepared VMware for Azure Migrate.
> * Verified port requirements, and URL access for the Azure Migrate appliance. 


Continue to the second tutorial to set up an Azure Migrate project, and assess VMware VMs for migration to Azure.

> [!div class="nextstepaction"] 
> [Assess VMware VMs](./tutorial-migrate-vmware.md) 

