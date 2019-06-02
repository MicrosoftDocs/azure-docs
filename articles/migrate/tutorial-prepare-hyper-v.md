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

> [!div class="checklist"]
> * Set up permissions for your Azure account and resources to work with Azure Migrate.
> * Verify Hyper-V host settings.
> * If VM disks are located on SMB shares, enable CredSSP authentication on Hyper-V hosts.
> * Verify settings for Azure Migrate Appliance deployment.
> * Set up an account that Azure Migrate will use to discover VMs on Hyper-V hosts and clusters.
> * Enable Hyper-V Integration Services on VMs.
> * Verify required ports, and appliance internet access to Azure URLs.



> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutoorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How Tos for Hyper-V assessment and migration.


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Before you start

1. Sign in to the [Azure portal](https://portal.azure.com).
2. [Review Hyper-V](migrate-support-matrix-hyper-v.md) requirements for assessment and migration.

## Set up Azure permissions

Your Azure account needs a number of permissions.

**Permission** | **Details**
--- | --- 
**Create Azure Migrate project**  | To create an Azure Migrate project, the Azure account needs Contributor or Owner permissions for the subscription.
**Register Azure Migrate appliance** | You create an appliance as you deploy Azure Migrate Server Assessment and Server Migration. During appliance registration, it creates two Azure Active Directory (Azure AD) apps that uniquely identify the appliance<br/> - The first app communicates with Azure Migrate service endpoints. <br/> - The second app accesses an Azure Key Vault created during registration to store Azure AD app info and appliance configuration settings.<br/> The Azure Migrate account needs permission to create these Azure AD apps.
**Migrate permissions** | To migrate VMware VMs using Azure Migrate Server Migration, Azure Migrate creates a Key Vault in the resource group, to manage access keys to the replication storage account in your subscription. To do this, you need role assignment permissions on the resource group in which the Azure Migrate project resides. 


## Assign permissions to create project

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** or **Owner** permissions.

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

The tenant/global admin can grant permissions as follows:

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-prepare-hyper-v/aad.png)

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


## Verify Hyper-V host settings

1. Verify [Hyper-V host requirements](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements).
2. Set up PowerShell remoting on each host. To do this, run this command as an admin in the PowerShell console on the host machine: **Enable-PSRemoting -force**.


## Enable CredSSP authentication
If VM disks are located on SMB shares, complete this step, if they aren't you can skip the step.

On every Hyper-V host running VMs you want to discover, run the following command.
    ```
    Enable-WSManCredSSP -Role Server -Force
    ```

- You can run the command remotely on all Hyper-V hosts.
- If you add new host nodes on a cluster, they are automatically added for discovery, but make sure that you enable CredSSP authentication on added nodes if needed.

## Verify settings for the Azure Migrate appliance

In the next tutorial you set up an appliance as a Hyper-V VM using a compressed downloadable VHD. The appliance helps with discovery and assessment, and migration of VMs.

Before you continue, verify appliance requirements:

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
- The account can be  a local or domain account, and needs admin privileges on Hyper-V hosts/cluster.

## Enable Integration Services on VMs

On VMs that you want to discover and assess, make sure that [Hyper-V Integration Services](https://docs.microsoft.com/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services) is enabled on each VM. This is needed so that Azure Migrate can capture operating system information on the VM.

## Verify port and URL access

There are a number of ports required for Azure Migrate Server Assessment and Server Migration. In addition, the Azure Migrate appliance needs internet connectivity to Azure.

1. [Review](migrate-support-matrix-hyper-v.md#required-ports) port requirements.
2. If you're using a URL-based firewall.proxy, allow access to the required [Azure URLs](migrate-support-matrix-hyper-v.md#url-access-requirements).
3. Make sure that the proxy resolves any CNAME records received while looking up the URLs.

When you deploy the appliance, Azure Migrate does a connectivity check to the URLs summarized in the table below.


## Next steps

In this tutorial, you:
 
> [!div class="checklist"] 
> * Set up Azure account permissions.
> * Prepared Hyper-V hosts and VMs.
> * Verified port requirements, and URL access for the Azure Migrate appliance. 

Continue to the next tutorial to create an Azure Migrate project, and assess Hyper-V VMs for migration to Azure

> [!div class="nextstepaction"] 
> [Assess Hyper-V VMs](./tutorial-assess-hyper-v.md) 
