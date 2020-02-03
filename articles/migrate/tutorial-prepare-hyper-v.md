---
title: Prepare Hyper-V VMs for assessment/migration with Azure Migrate 
description: Learn how to prepare for assessment/migration of Hyper-V VMs with Azure Migrate.
ms.topic: tutorial
ms.date: 01/01/2020
ms.custom: mvc
---

# Prepare for assessment and migration of Hyper-V VMs to Azure

This article describes how to prepare for assessment and migration of on-premises Hyper-V VMs to Azure with [Azure Migrate](migrate-services-overview.md).

[Azure Migrate](migrate-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings.

This tutorial is the first in a series that shows you how to assess and migrate Hyper-V VMs to Azure. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare Azure. Set up permissions for your Azure account and resources to work with Azure Migrate.
> * Prepare on-premises Hyper-V hosts and VMs for server assessment. You can prepare using a configuration script, or manually.
> * Prepare for deployment of the Azure Migrate appliance. The appliance is used to discover and assess on-premises VMs.
> * Prepare on-premises Hyper-V hosts and VMs for server migration.


> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How-tos for Hyper-V assessment and migration.


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prepare Azure

### Azure permissions

You need set up permissions for Azure Migrate deployment.

- Permissions for your Azure account to create an Azure Migrate project.
- Permissions for your account to register the Azure Migrate appliance. The appliance is used for discovery and assessment of Hyper-V VMs you migrate. During appliance registration, Azure Migrate creates two Azure Active Directory (Azure AD) apps that uniquely identify the appliance:
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

You can assign permissions for Azure Migrate to create the Azure AD apps created during appliance registration, using one of the following methods:

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


## Prepare Hyper-V for assessment

You can prepare Hyper-V for VM assessment manually, or using a configuration script. Here's what needs to be prepared, either with the script or [manually](#prepare-hyper-v-manually).

- [Verify](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements) Hyper-V host settings, and make sure that the [required ports](migrate-support-matrix-hyper-v.md#port-access) are open on Hyper-V hosts.
- Set up PowerShell remoting on each host, so that the Azure Migrate appliance can run PowerShell commands on the host, over a WinRM connection.
- Delegate credentials if VM disks are located on remote SMB shares.
- Set up an account that the appliance will use to discover VMs on Hyper-V hosts.
- Set up Hyper-V Integration Services on each VM you want to discover and assess.



## Prepare with a script

The script does the following:

- Checks that you're running the script on a supported PowerShell version.
- Verifies that you (the user running the script) have administrative privileges on the Hyper-V host.
- Allows you to create a local user account (not administrator) that the Azure Migrate service uses to communicate with the Hyper-V host. This user account is added to these groups on the host:
    - Remote Management Users
    - Hyper-V Administrators
    - Performance Monitor Users
- Checks that the host is running a supported version of Hyper-V, and the Hyper-V role.
- Enables the WinRM service, and opens ports 5985 (HTTP) and 5986 (HTTPS) on the host (needed for metadata collection).
- Enables PowerShell remoting on the host.
- Checks that the Hyper-V integration service is enabled on all VMs managed by the host.
- Enables CredSSP on the host if needed.

Run the script as follows:

1. Make sure you have PowerShell version 4.0 or later installed on the Hyper-V host.
2. Download the script from the [Microsoft Download Center](https://aka.ms/migrate/script/hyperv). The script is cryptographically signed by Microsoft.
3. Validate the script integrity using either MD5, or SHA256 hash files. Hashtag values are below. Run this command to generate the hash for the script:
    ```
    C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]
    ```
    Example usage:
    ```
    C:\>CertUtil -HashFile C:\Users\Administrators\Desktop\ MicrosoftAzureMigrate-Hyper-V.ps1
    SHA256
    ```

4.	After validating the script integrity, run the script on each Hyper-V host with this PowerShell command:
    ```
    PS C:\Users\Administrators\Desktop> MicrosoftAzureMigrate-Hyper-V.ps1
    ```

### Hashtag values

Hash values are:

| **Hash** | **Value** |
| --- | --- |
| **MD5** | 0ef418f31915d01f896ac42a80dc414e |
| **SHA256** | 0ad60e7299925eff4d1ae9f1c7db485dc9316ef45b0964148a3c07c80761ade2 |


## Prepare Hyper-V manually

Follow the procedures in this section to prepare Hyper-V manually, instead of using the script.

### Verify PowerShell version

Make sure you have PowerShell version 4.0 or later installed on the Hyper-V host.



### Set up an account for VM discovery

Azure Migrate needs permissions to discover on-premises VMs.

- Set up a domain or local user account with administrator permissions on the Hyper-V hosts/cluster.

    - You need a single account for all hosts and clusters that you want to include in the discovery.
    - The account can be  a local or domain account. We recommend it has Administrator permissions on the Hyper-V hosts or clusters.
    - Alternatively, if you don't want to assign Administrator permissions, the following permissions are needed:
        - Remote Management Users
        - Hyper-V Administrators
        - Performance Monitor Users

### Verify Hyper-V host settings

1. Verify [Hyper-V host requirements](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements) for server assessment.
2. Make sure the [required ports](migrate-support-matrix-hyper-v.md#port-access) are open on Hyper-V hosts.

### Enable PowerShell remoting on hosts

Set up PowerShell remoting on each host, as follows:

1. On each host, open a PowerShell console as admin.
2. Run this command:

    ```
    Enable-PSRemoting -force
    ```
### Enable Integration Services on VMs

Integration Services should be enabled on each VM so that Azure Migrate can capture operating system information on the VM.

On VMs that you want to discover and assess, enable [Hyper-V Integration Services](https://docs.microsoft.com/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services) on each VM.


### Enable CredSSP on hosts

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
2. [Review](migrate-appliance.md#url-access) the Azure URLs that the appliance will need to access.
3. Review the data that the appliance will collect during discovery and assessment.
4. [Note](migrate-appliance.md#collected-data---hyper-v) port access requirements for the appliance.


## Prepare for Hyper-V migration

1. [Review](migrate-support-matrix-hyper-v-migration.md#hyper-v-hosts) Hyper-V host requirements for migration, and the Azure URLs to which Hyper-V hosts and clusters need access for VM migration.
2. [Review](migrate-support-matrix-hyper-v-migration.md#hyper-v-vms) the requirements for Hyper-V VMs that you want to migrate to Azure.


## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Set up Azure account permissions.
> * Prepared Hyper-V hosts and VMs for assessment and migration.
> * Prepared for deployment of the Azure Migrate appliance.

Continue to the next tutorial to create an Azure Migrate project, deploy the appliance, and discover and assess Hyper-V VMs for migration to Azure.

> [!div class="nextstepaction"]
> [Assess Hyper-V VMs](./tutorial-assess-hyper-v.md)
