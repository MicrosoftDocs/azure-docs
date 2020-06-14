---
title: Prepare Hyper-V VMs for assessment/migration with Azure Migrate 
description: Learn how to prepare for assessment/migration of Hyper-V VMs with Azure Migrate.
ms.topic: tutorial
ms.date: 04/15/2020
ms.custom: mvc
---

# Prepare for assessment and migration of Hyper-V VMs to Azure

This article helps you to prepare for assessment and migration of on-premises Hyper-V VMs to Azure, using [Azure Migrate:Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool), and [Azure Migrate:Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool).


This tutorial is the first in a series that shows you how to assess and migrate Hyper-V VMs to Azure. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare Azure to work with Azure Migrate.
> * Prepare to assess Hyper-V VMs.
> * Prepare to migrate Hyper-V VMs 

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prepare Azure

The table summarizes the tasks you need to complete in Azure. Instructions follow the table.

**Task** | **Details** | **Permissions**
--- | --- | ---
**Create an Azure Migrate project** | An Azure Migrate project provides a central location for orchestrating and managing assessments and migrations with Azure Migrate tools, Microsoft tools, and third-party offerings. | Your Azure account needs Contributor or Owner permissions in the resource group in which the project resides.
**Register appliance** | Azure Migrate uses a lightweight Azure Migrate appliance to discover and assess Hyper-V VMs. [Learn more](migrate-appliance-architecture.md#appliance-registration). | To register the appliance, your Azure account needs Contributor or Owner permissions on the Azure subscription.
**Create Azure AD app** | When registering the appliance, Azure Migrate creates an Azure Active Directory (Azure AD) app that's used for communication between the agents running on the appliance and Azure Migrate. | Your Azure account needs permissions to create Azure AD apps.
**Create a VM** | You need permissions to create a VM in the resource group and virtual network, and to write to an Azure managed disk. | You Azure account needs the Virtual Machine Contributor role.


### Assign permissions to create project

Check you have permissions to create an Azure Migrate project.

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** or **Owner** permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.


### Assign permissions to create Azure AD apps

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

### Assign Azure account permissions

Assign the Virtual Machine Contributor role to the account, so that you have permissions to:

- Create a VM in the selected resource group.
- Create a VM in the selected virtual network.
- Write to an Azure managed disk. 


### Set up an Azure network

[Set up an Azure network](../virtual-network/manage-virtual-network.md#create-a-virtual-network). On-premises machines are replicated to Azure managed disks. When you fail over to Azure for migration, Azure VMs are created from these managed disks, and joined to the Azure network you set up.


## Prepare for assessment

You can prepare Hyper-V for VM assessment manually, or using a configuration script. These are the preparation steps. If you prepare with a script, these are configured automatically.

**Step** | **Script** | **Manual**
--- | --- | ---
**Verify Hyper-V host requirements** | Script checks that the host is running a supported version of Hyper-V, and the Hyper-V role.<br/><br/> Enables the WinRM service, and opens ports 5985 (HTTP) and 5986 (HTTPS) on the host (needed for metadata collection). | Verify [Hyper-V host requirements](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements) for server assessment.<br/><br/> Make sure the [required ports](migrate-support-matrix-hyper-v.md#port-access) are open on Hyper-V hosts.
**Verify PowerShell version** | Checks that you're running the script on a supported PowerShell version. | Check you're running PowerShell version 4.0 or later on the Hyper-V host.
**Create an account** | Verifies that you (the user running the script) have administrative privileges on the Hyper-V host.<br/><br/>  Allows you to create a local user account (not administrator) that the Azure Migrate service uses to communicate with the Hyper-V host. This user account is added to these groups on the host:<br/><br/> - Remote Management Users<br/><br/> - Hyper-V Administrators<br/><br/>- Performance Monitor Users | Set up a domain or local user account with administrator permissions on the Hyper-V hosts/cluster.<br/><br/> - You need a single account for all hosts and clusters that you want to include in the discovery.<br/><br/> - The account can be  a local or domain account. We recommend it has Administrator permissions on the Hyper-V hosts or clusters.<br/><br/> Alternatively, if you don't want to assign Administrator permissions, the following permissions are needed: Remote Management Users; Hyper-V Administrators; Performance Monitor Users.
**Enable PowerShell remoting** | Enables PowerShell remoting on the host , so that the Azure Migrate appliance can run PowerShell commands on the host, over a WinRM connection.| To set up, on each host, open a PowerShell console as admin, and run this command:<br/><br/>``` Enable-PSRemoting -force ```
**Set up Hyper-V Integration Services** | Checks that the Hyper-V Integration Services is enabled on all VMs managed by the host. |  [Enable Hyper-V Integration Services](https://docs.microsoft.com/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services) on each VM.<br/><br/> If you're running Windows Server 2003, [follow these instructions](prepare-windows-server-2003-migration.md).
**Delegate credentials if VM disks are located on remote SMB shares** | Script delegates credentials. | [Enable CredSSP](#enable-credssp-to-delegate-credentials) to delegate credentials.

### Run the script

Run the script as follows:

1. Make sure you have PowerShell version 4.0 or later installed on the Hyper-V host.
2. Download the script from the [Microsoft Download Center](https://aka.ms/migrate/script/hyperv). The script is cryptographically signed by Microsoft.
3. Validate the script integrity using either MD5, or SHA256 hash files. Hashtag values are below. Run this command to generate the hash for the script:
    ```
    C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]
    ```
    Example usage:
    ```
    C:\>CertUtil -HashFile C:\Users\Administrators\Desktop\ MicrosoftAzureMigrate-Hyper-V.ps1 SHA256
    ```

4. After validating the script integrity, run the script on each Hyper-V host with this PowerShell command:
    ```
    PS C:\Users\Administrators\Desktop> MicrosoftAzureMigrate-Hyper-V.ps1
    ```

#### Hashtag values

Hash values are:

| **Hash** | **Value** |
| --- | --- |
| **MD5** | 0ef418f31915d01f896ac42a80dc414e |
| **SHA256** | 0ad60e7299925eff4d1ae9f1c7db485dc9316ef45b0964148a3c07c80761ade2 |



### Enable CredSSP to delegate credentials

If the host has VMs with disks are located on SMB shares, complete this step on the host.

- You can run this command remotely on all Hyper-V hosts.
- If you add new host nodes on a cluster they are automatically added for discovery, but you need to manually enable CredSSP on the new nodes if needed.

Enable as follows:

1. Identify Hyper-V hosts running Hyper-V VMs with disks on SMB shares.
2. Run the following command on each identified Hyper-V host:

    ```
    Enable-WSManCredSSP -Role Server -Force
    ```

When you set up the appliance, you finish setting up CredSSP by [enabling it on the appliance](tutorial-assess-hyper-v.md#delegate-credentials-for-smb-vhds). This is described in the next tutorial in this series.


## Prepare for appliance deployment

Before setting up the Azure Migrate appliance and beginning assessment in the next tutorial, prepare for appliance deployment.

1. [Verify](migrate-appliance.md#appliance---hyper-v) appliance requirements.
2. Review the Azure URLs that the appliance will need to access in the [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds. If you're using a URL-based firewall or proxy, ensure it allows access to the required URLs.
3. Review the data that the appliance will collect during discovery and assessment.
4. [Review](migrate-appliance.md#collected-data---hyper-v) port access requirements for the appliance.


## Prepare for Hyper-V migration

1. [Review](migrate-support-matrix-hyper-v-migration.md#hyper-v-host-requirements) Hyper-V host requirements for migration, and the Azure URLs to which Hyper-V hosts and clusters need access for VM migration.
2. [Review](migrate-support-matrix-hyper-v-migration.md#hyper-v-vms) the requirements for Hyper-V VMs that you want to migrate to Azure.
3. There are some changes needed on VMs before you migrate them to Azure.
    - It's important to make these changes before you begin migration. If you migrate the VM before you make the change, the VM might not boot up in Azure.
    - Review [Windows](prepare-for-migration.md#windows-machines) and [Linux](prepare-for-migration.md#linux-machines) changes you need to make.



## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Set up Azure account permissions.
> * Prepared Hyper-V hosts and VMs for assessment and migration.
> * Prepared for deployment of the Azure Migrate appliance.

Continue to the next tutorial to create an Azure Migrate project, deploy the appliance, and discover and assess Hyper-V VMs for migration to Azure.

> [!div class="nextstepaction"]
> [Assess Hyper-V VMs](./tutorial-assess-hyper-v.md)
