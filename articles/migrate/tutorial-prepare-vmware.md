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
> * Set up permissions for your Azure account to work with Azure Migrate.
> * Verify vCenter Server and ESXi host settings.
> * Create an account on the vCenter Server. The account is used by the Azure Migrate service to discover VMware VMs for assessment and migration.
> * Verify you have vCenter Server permissions to create a VMware VM with an OVA file. Azure Migrate uses a lightweight appliance set up as a VMware VM using an OVA file, for discovery and assessment.
> * Verify firewall access to Azure URLs. When you set up the Azure Migrate appliance, it needs internet access to these URLs.


> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How Tos for VMware assessment and migration.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Set up Azure permissions

Your Azure account needs a number of permissions.

**Permission** | **Details**
--- | --- 
**Register subscription**  | To create Azure Migrate resources and to register the subscription with Azure Migrate providers, the Azure account needs at least Contributor permissions for the subscription.
**Create Azure AD apps** | The account needs permission to create Azure AD apps. Azure Migrate creates two apps:<br/> - App to communicate between the appliance and Azure Migrate services, for identity purposes.<br/> - App used by the appliance to create an Azure Key Vault. The key vault holds Azure AD app information, and appliance settings.
**Use Azure Migrate server assessment** | To run assessments, the account needs Contributor permissions on the resource group in which the Azure Migrate project is created.
**Use Azure Migrate server migration** | To run a migration, the account needs Owner permissions (or Contributor and User Access Administrator permissions) on the resource group in which the Azure Migrate project is created.

### Assign permissions to register subscription

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** permissions. If you don't, request them from the subscription owner. 

### Assign permissions to create Azure AD apps

Neither of the Azure AD apps created by Azure Migrate has Azure RBAC configured. You can assign the permission to create the apps with a couple of methods:

- Either a tenant/global admin can grant permissions to create Azure AD apps to the account.
- Alternatively, you can assign the Application Developer role (that has the permissions) to the account.

> [!NOTE]
> This permission is only needed when you set up discovery for the Azure Migrate appliance for the first time. After the appliance is set up, the permission can be removed.

#### Grant account permissions

The tenant/global admin can grant permissions as follows

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-prepare-vmware/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).



#### Assign Application Developer role 

The tenant/global admin has permissions to assign the role to the account. [Learn more](https://docs.microsoft.comazure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).

### Assign key vault permissions

Server migration creates a key vault to manage access keys to the replication storage account in your subscription. For the key vault to manage the storage account you need resource group permissions as follows:

1. In the resource group in the Azure portal, select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.

    - To run server assessment, **Contributor** permissions are enough.
    - To run server migration, you should have **Owner** (or **Contributor** and **User Access Administrator**) permissions.

3. If you don't have the required permissions, request them from the resource group owner. 


## Verify VMware settings
1. Make sure that VMs that you want to discover and assess are managed by vCenter Server version 5.5, 6.0, 6.5, 6.7.
2. Make sure you have an ESXi host with version 5.5 or higher to deploy the Azure Migrate appliance.

## Set up a vCenter Server account

Azure Migrate needs to access the vCenter Server to discover VMs for assessment and migration. Prepare an account with the permissions summarized in the table.

### Discover VMs

**Permission** | **Details**
--- | --- 
 Read-only role | 

### Migrate VMs
**Permission** | **Details**
--- | --- 
Datastore.Browse | Locate the log files from the VM folder.
Datastore.LowLevelFileOperations | Download log files for troubleshooting.
VirtualMachine.Configuration.DiskChangeTracking | Set disk change tracking on VM disks.
VirtualMachine.Configuration.DiskLease | Access VM disk data.
VirtualMachine.Provisioning.AllowReadOnlyDiskAccess | Read data to be replicated.
 | VirtualMachine.SnapshotManagement.* | Create and manage VM snapshots.
 | VirtualMachine.Provisioning.AllowVirtualMachineDownload  | Allow read operations on VM disks.

## Assign permissions to create a VM

You set up the Azure Migrate appliance using an OVA file. 

On vCenter Server, make sure that your account has permissions to create a VM using an OVA file.

## Verify URL access

The Azure Migrate appliance needs internet connectivity to Azure.

- When you deploy the appliance, Azure Migrate does a connectivity check to the URLs summarized in the table below.
- If you're using a URL-based firewall.proxy, allow access to these URLs, making sure that the proxy resolves any CNAME records received while looking up the URLs.

**URL** | **Details**  
--- | --- 
*.portal.azure.com | Navigate to the Azure Migrate in the Azure portal.
*.windows.net<br/> *.microsoftonline.com | Sign in to Azure.<br/> Create Active Directory app and Service Principal objects for agent to service communication.
management.azure.com | Communicate with Azure Resource Manager to set up Azure Migrate server assessment objects.
dc.services.visualstudio.com | Upload app logs used for internal monitoring.
*.vault.azure.net | Persist secrets when communicating between agent and service.
*.servicebus.windows.net | Communication between the appliance and the Azure Migrate service.
*.discoverysrv.windowsazure.com<br/> *.migration.windowsazure.com/<br/> *.hypervrecoverymanager.windowsazure.com | Azure Migrate service URLs
*.blob.core.windows.net | Upload data to storage accounts


## Next steps

In this tutorial, you:
 
> [!div class="checklist"] 
> * Set up Azure permissions.
> * Prepared VMware for Azure Migrate.
> * Verified URL access for the Azure Migrate appliance. 


Continue to the second tutorial to set up an Azure Migrate project, and assess VMware VMs for migration to Azure.

> [!div class="nextstepaction"] 
> [Assess VMware VMs](./tutorial-migrate-vmware.md) 

