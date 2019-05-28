---
title: Prepare Hyper-V VMs for assessment and migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to prepare for assessment and migration of on-premises Hyper-V VMs to Azure using Azure Migrate.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 05/26/2019
ms.author: raynew
ms.custom: mvc
---

# Prepare Hyper-V VMs for assessment and migration to Azure

This article describes how to prepare your on-premises environment and Azure resources  for migration of on-premises Hyper-V VMs to Azure with [Azure Migrate](migrate-services-overview.md) services.

This tutorial is the first in a series that shows you how to assess and migrate Hyper-V VMs to Azure. In this tutorial, you learn how to:

> * Create an Azure Migrate project.
> [!div class="checklist"]
> * Set up permissions for your Azure account to work with Azure Migrate.
> * Verify Hyper-V requirements for migration.
> * Set up an account that Azure Migrate will use to discover VMs on Hyper-V hosts and clusters.
> * Verify firewall access to Azure URLs. When you set up the Azure Migrate appliance, it needs internet access to these URLs.



> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutoorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How Tos for Hyper-V assessment and migration.


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
**Use Azure Migrate server migration** | To run a migration, the account needs Owner permissions, or Contributor and User Access Administrator permissions, on the resource group in which the Azure Migrate project is created.

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

    ![Azure AD permissions](./media/tutorial-prepare-hyper-v/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).



#### Assign Application Developer role 

The tenant/global admin has permissions to assign the role to the account. [Learn more](https://docs.microsoft.comazure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).

### Assign permissions for assessment and migration

Server migration creates a key vault to manage access keys to the replication storage account in your subscription. For the key vault to manage the storage account you need resource group permissions as follows:

1. In the resource group in the Azure portal, select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.

    - To run server assessment, **Contributor** permissions are enough.
    - To run server migration, you should have **Owner** (or **Contributor** and **User Access Administrator**) permissions.

3. If you don't have the required permissions, request them from the resource group owner. 

## Verify Hyper-V host settings

Verify Hyper-V hosts are supported, and enable PowerShell remoting on each host.

1. Make sure that Hyper-V hosts that run VMs you want to migrate are running Windows Server 2012 R2 or 2016, with the latest updates. In a cluster, all hosts should run one of these operating systems.
2. Set up PowerShell remoting on each host. To do this, run this command as an admin in the PowerShell console on the host machine: **Enable-PSRemoting -force**.

## Verify settings for the Azure Migrate appliance

In the next tutorial you set up an appliance as a Hyper-V VM using a compressed downloadable VHD. The appliance helps with discovery and assessment of VMs, and needs the following on the Hyper-V host

- It must run on a Hyper-V host running Windows Server 2012 R2 or later.
- The appliance VHD you download runs Hyper-V VM version 5.0.
- To use the downloaded VHD, you need permissions to import a VM on the Hyper-V host.
- Make sure that the Hyper-V host has enough capacity to allocate these resources for the appliance VM:
- 16 GB RAM
- Four virtual processors.
- An external virtual switch.
- The appliance VM needs a static or a dynamic IP address, and internet access.

## Set up an account for VM discovery

Set up a domain or local user account with administrator permissions on the Hyper-V hosts/cluster that Azure Migrate can use to discover the on-premises VMs.

- A single account is required for all hosts and clusters that you want to include in the discovery.
- The account can be  a local or domain account, and needs admin privileges on Hyper-V host/cluster servers.

## Enable Integration Services on VMs

On VMs that you want to discover and assess, make sure that [Hyper-V Integration Services](https://docs.microsoft.com/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services) is enabled on each VM. This is needed so that Azure Migrate can capture operating system information on the VM.

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
> * Set up Azure account permissions
> * Prepared Hyper-V hosts and VMs
> * Verified URL access for the Azure Migrate appliance. 

Continue to the next tutorial to create an Azure Migrate project, and assess Hyper-V VMs for migration to Azure

> [!div class="nextstepaction"] 
> [Assess Hyper-V VMs](./tutorial-assess-hyper-v.md) 
