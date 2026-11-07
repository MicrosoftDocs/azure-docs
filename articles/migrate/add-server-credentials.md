---
title: Provide Infrastructure Credentials to Discover Storage and Network, and Guest OS Credentials to Discover Software, Dependencies, and Databases
description: Learn how to provide infrastructure credentials to discover storage and network, and guest OS credentials to discover software, dependencies, web apps, and databases on the appliance configuration manager.
author: Molishv
ms.author: molir
ms.manager: shsaluja
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/12/2026
ms.reviewer: ankitsurkar06
ms.custom: engagement-fy25
ms.update-cycle: 1095-days
# Customer intent: As a cloud migration consultant, I want to provide server credentials in the configuration manager, so that I can accurately discover software inventory, web apps, and SQL Server instances to facilitate a smooth migration process.
---

# Provide infrastructure credentials to discover storage and network, and guest OS credentials to discover software, dependencies, and databases

Follow this article to learn how to add multiple server credentials on the appliance configuration manager to perform software inventory (discover installed applications), agentless dependency analysis, and discover web apps, SQL Server instances, and databases.

The [Azure Migrate appliance](migrate-appliance.md) is a lightweight appliance used by Azure Migrate: Discovery and assessment to discover on-premises servers and send server configuration and performance metadata to Azure. The appliance can also be used to perform software inventory, agentless dependency analysis and discover of web app, and SQL Server instances and databases.

The appliance isn't limited to servers. You can configure it to pull infrastructure-specific information across all your infrastructure components, including compute (servers), storage (network-attached storage), and network, and send the metadata to Azure Migrate. For storage, you can configure the appliance to discover network-attached storage (NAS) systems, such as Dell PowerScale (OneFS) and NetApp ONTAP, and the SMB, NFS, and S3 file shares that they host. Discovered NAS clusters and their shares appear in your Azure Migrate project alongside the Windows and Linux file servers that the appliance already discovers. To discover NAS file shares, add NAS credentials and a NAS discovery source as described in [Provide credentials and a discovery source for NAS file shares](#provide-credentials-and-a-discovery-source-for-nas-file-shares). For network, you can discover networking resources from VMware environments by pulling information from VMware vCenter Server and from VMware NSX, as required. To discover these resources, provide the corresponding environment-level credentials as described in [Credentials for VMware networking discovery](#credentials-for-vmware-networking-discovery).

::: moniker range="migrate"
> [!Note]
> Currently, the discovery of ASP.NET web apps is only available in the appliance used for discovery and assessment of servers running in a VMware environment.
::: moniker-end

If you want to use these features, you can provide server credentials by performing the following steps. For servers running on vCenter Server(s) and Hyper-V host(s)/cluster(s), the appliance will attempt to automatically map the credentials to the servers to perform the discovery features.

## Add credentials

### Types of supported credentials

You can add multiple server credentials on the appliance configuration manager, which can be domain, nondomain (Windows or Linux) or SQL Server authentication credentials.

The types of server credentials supported are listed in the table below:

Type of credentials | Description
--- | ---
**Domain credentials** | You can add **Domain credentials** by selecting the option from the drop-down in the **Add credentials** modal. <br/><br/> To provide domain credentials, you need to specify the **Domain name** which must be provided in the Fully Qualified Domain Name (FQDN) format (for example, prod.corp.contoso.com). <br/><br/> To provide domain credentials, specify the domain name in Fully Qualified Domain Name (FQDN) format (for example, prod.corp.contoso.com). <br/> <br/> You also need to provide a friendly name, username, and password for the credentials. In the guest discovery section of all three appliance stacks (VMware, Hyper‑V, and physical), domain credentials must be provided in UPN format (username@domain.com). <br/> <br/> In the physical appliance, to discover server metadata and enable SI and dependency analysis, provide domain credentials in down‑level format (domain\username). The UPN format (username@domain.com) isn’t supported for this scenario. <br/><br/> The domain credentials added will be automatically validated for authenticity against the Active Directory of the domain. This validation is to prevent any account lockouts when the appliance attempts to map the domain credentials against discovered servers. <br/><br/> To validate the domain credentials with the domain controller, the appliance should be able to resolve the domain name. Ensure that you've provided the correct domain name while adding the credentials else the validation will fail.<br/><br/> The appliance won't attempt to map the domain credentials that have failed validation. You need to have at least one successfully validated domain credential or at least one nondomain credential to start the discovery.<br/><br/>The domain credentials mapped automatically against the Windows servers will be used to perform software inventory and can also be used to discover web apps, and SQL Server instances and databases _(if you've configured Windows authentication mode on your SQL Servers)_.<br/> [Learn more](/dotnet/framework/data/adonet/sql/authentication-in-sql-server) about the types of authentication modes supported on SQL Servers.
**Non-domain credentials (Windows/Linux)** | You can add **Windows (Non-domain)** or **Linux (Non-domain)** by selecting the required option from the drop-down in the **Add credentials** modal. <br/><br/> You need to specify a friendly name for credentials, username, and password.
**SQL Server Authentication credentials** | You can add **SQL Server Authentication** credentials by selecting the option from the drop-down in the **Add credentials** modal. <br/><br/> You need to specify a friendly name for credentials, username, and password. <br/><br/> You can add this type of credentials to discover SQL Server instances and databases running in your VMware environment, if you've configured SQL Server authentication mode on your SQL Servers.<br/> [Learn more](/dotnet/framework/data/adonet/sql/authentication-in-sql-server) about the types of authentication modes supported on SQL Servers.<br/><br/> You need to provide at least one successfully validated domain credential or at least one Windows (Nondomain) credential so that the appliance can complete the software inventory to discover SQL installed on the servers before it uses the SQL Server authentication credentials to discover the SQL Server instances and databases.
**PostgreSQL Authentication credentials** | You can add PostgreSQL authentication by selecting the appropriate option from the drop-down in the **Add credentials** dialog. <br/><br/> You need to specify a friendly name, username, and password. These credentials are used to discover PostgreSQL instances and databases in your environment, provided your PostgreSQL servers are configured for password-based authentication (such as md5, scram-sha-256, or password). <br/><br/> You must provide at least one successfully validated domain credential or at least one Windows/Linux (non-domain) credential so the appliance can complete the software inventory and discover PostgreSQL installations. After this step, the appliance uses the PostgreSQL authentication credentials to identify PostgreSQL instances and databases.
**NAS Server credentials** | Add **NAS Server** credentials by selecting the option from the drop-down in the **Add credentials** dialog. <br/><br/> Specify a friendly name, username, and password. Use a NAS cluster account that has at least read-only cluster-level permission. The appliance uses these credentials to connect to the NAS controller and collect share and system metadata; it never writes to the NAS system. <br/><br/> Use these credentials to discover network-attached storage (NAS) systems, such as Dell PowerScale (OneFS) and NetApp ONTAP, and the SMB, NFS, and S3 file shares they host. After you add NAS credentials, add a NAS discovery source for each cluster. [Learn more](#provide-credentials-and-a-discovery-source-for-nas-file-shares).
**NSX credentials** | Add **NSX** credentials by selecting the option from the drop-down in the **Add credentials** dialog. <br/><br/> Specify a friendly name, username, and password. Provide NSX credentials at the environment level. <br/><br/> The appliance uses these credentials to discover networking inventory and configuration metadata from the VMware NSX environment. For networking resources, you can also provide vCenter Server credentials. [Learn more](#credentials-for-vmware-networking-discovery).

Check the permissions required on the Windows/Linux credentials to perform the software inventory, agentless dependency analysis and discover web apps, and SQL Server instances and databases.

### Required permissions

The table below lists the permissions required on the server credentials provided on the appliance to perform the respective features:

Feature | Windows credentials | Linux credentials
---| ---| ---
**Software inventory** | Guest user account | Regular/normal user account (nonsudo access permissions)
**Discovery of SQL Server instances and databases** | To discover SQL Server instances and databases, the Windows/ Domain account, or SQL Server account [requires these low privilege read permissions](migrate-support-matrix-vmware.md) for each SQL Server instance. You can use the [low-privilege account provisioning utility](least-privilege-credentials.md) to create custom accounts or use any existing account that is a member of the sysadmin server role for simplicity.| _Not supported currently_
**Discovery of ASP.NET web apps** | Domain or nondomain (local) account with administrative permissions | _Not supported currently_
**Agentless dependency analysis (quick discovery)** | Guest user account | Regular/normal user account (nonsudo access permissions)
**Agentless dependency analysis (in-depth discovery)** | Domain or nondomain (local) account with administrative permissions | The following Sudo permissions are required to identify server dependencies: `/usr/bin/netstat` and `/usr/bin/ls`. <br /><br /> If `netstat` is not available, Sudo permissions on `ss` are required. <br /><br /> When providing a sudo user account, ensure that you have enabled **NOPASSWD** for the account to run the required commands without prompting for a password every time the sudo command is invoked.
**Discovery of PostgreSQL instances and databases** |Use a PostgreSQL user account with either superuser privileges or the following [minimum user privilege](postgresql-least-privilege-configuration.md) on each PostgreSQL instance: CONNECT on the database, `pg_read_all_settings`, and USAGE on relevant schemas.| Use a PostgreSQL user account with either superuser privileges or the following [minimum user privileges](postgresql-least-privilege-configuration.md) on each PostgreSQL instance: CONNECT on the database, `pg_read_all_settings`, USAGE on relevant schemas.
**Discovery of NAS file shares** | Not applicable. NAS discovery uses NAS Server credentials rather than Windows or Linux guest credentials. Provide a NAS cluster account that has at least read-only cluster-level permission. Grant the permission at the cluster level rather than per share or volume so that you can enumerate all share metadata, including quotas. | Not applicable. NAS discovery uses NAS Server credentials rather than Windows or Linux guest credentials.

> [!NOTE]
> You can use a Windows guest or a Linux non-Sudo user account to get dependency data. But with least privileged accounts, you might not collect process information (like process name or app name) for some processes that run with higher privileges. These processes appear as **Unknown** under the machine in the single-server view.

### Recommended practices to provide credentials

- We recommend you to create a dedicated domain user account with the [required permissions](add-server-credentials.md#required-permissions), which is scoped to perform software inventory, agentless dependency analysis and discovery of web app, and SQL Server instances and databases on the desired servers.
- We recommend you provide at least one successfully validated domain credential or at least one nondomain credential to initiate software inventory.
- To discover SQL Server instances and databases, you can provide domain credentials, if you've configured Windows authentication mode on your SQL Servers.
- You can also provide SQL Server authentication credentials if you've configured SQL Server authentication mode on your SQL Servers, but it's recommended to provide at least one successfully validated domain credential or at least one Windows (Nondomain) credential so that the appliance can first complete the software inventory.

## Credentials handling on appliance

- All the credentials provided on the appliance configuration manager are stored locally on the appliance server and not sent to Azure.
- The credentials stored on the appliance server are encrypted using Data Protection API (DPAPI).
- After you've added credentials, appliance attempts to automatically map the credentials to perform discovery on the respective servers.
- The appliance uses the credentials automatically mapped on a server for all the subsequent discovery cycles until the credentials are able to fetch the required discovery data. If the credentials stop working, appliance again attempts to map from the list of added credentials and continues the ongoing discovery on the server.
- The domain credentials added will be automatically validated for authenticity against the Active Directory of the domain. This is to prevent any account lockouts when the appliance attempts to map the domain credentials against discovered servers. The appliance won't attempt to map the domain credentials that have failed validation.
- If the appliance can't map any domain or nondomain credentials against a server, you'll see "Credentials not available" status against the server in your project.

## Credentials for VMware networking discovery

To discover networking resources from VMware environments, pull network information from VMware vCenter Server and from VMware NSX, as required. Provide the corresponding environment-level credentials in the appliance configuration manager.

Provide vCenter Server credentials to discover networking resources and relationships from the vCenter Server environment. If your environment uses VMware NSX, also provide NSX credentials, which the appliance uses to discover networking inventory and configuration metadata from the VMware NSX environment. Provide both credential types at the environment level. These credentials are different from guest OS credentials, which you use to access individual Windows or Linux servers for features such as software inventory and agentless dependency analysis.


## Provide credentials and a discovery source for NAS file shares

Azure Migrate discovers network-attached storage (NAS) systems and the SMB, NFS, and S3 shares that they host. After discovery runs, NAS clusters and their shares appear as inventory objects in your Azure Migrate project, alongside the Windows and Linux file servers that the appliance already discovers. You configure NAS discovery on the same appliance that you use to discover servers, and you can mix NAS sources with vCenter Server and NSX manager sources on one appliance.

### Supported NAS platforms

Azure Migrate discovers the following NAS platforms:

| Vendor | Platform | Protocols discovered |
| --- | --- | --- |
| Dell Technologies | PowerScale (OneFS); Dell EMC Isilon (OneFS) (legacy) | SMB, NFS, S3, and multi-protocol shares |
| NetApp | ONTAP AFF; FAS (legacy) | SMB, NFS, S3, and multi-protocol shares |

A share that you expose through more than one protocol, such as SMB and S3, or NFS and S3, is identified as a multi-protocol share in the inventory.

> [!NOTE]
> Storage area network (SAN) and logical unit number (LUN) discovery aren't supported. Non-file protocols, such as iSCSI and SAN mapping, are out of scope. Azure Migrate collects share and system metadata only. It doesn't crawl file contents, and it doesn't analyze access control lists (ACLs) or scan for personally identifiable information.

### Add NAS credentials

1. In the Appliance Configuration Manager, go to **Manage credentials and discovery sources**.
1. Under **Provide infrastructure credentials**, select **Add credentials**.
1. For **Source type**, select **NAS Server**.
1. Enter a **friendly name** (such as the cluster name), a **username** for a NAS cluster account that has at least read-only cluster-level permission, and the **password** for the account.
1. Select **Save**. Repeat for each NAS cluster that uses a different account. Clusters that share an account can reuse a single credential entry.

> [!IMPORTANT]
> If you don't supply valid credentials for a NAS source, no inventory is generated for that source. Credential readiness is the most common cause of an empty NAS inventory. Verify it before you investigate anything else.

> [!NOTE]
> Permission models differ between NAS vendors, and the permission required to list shares can differ from the permission required to enumerate quotas. There's no single standard read-only role across vendors. If some share metadata is missing after discovery, confirm that the account has read-only permission at the cluster level rather than at an individual share or volume.

### Add a NAS discovery source

Add each NAS cluster that you want to discover to the appliance as a discovery source.

1. Under **Provide infrastructure server details**, select **Add discovery source**.
1. For **Discovery source**, select **NAS Server**.
1. Enter the **IP address or FQDN** of the NAS cluster management endpoint.
1. Enter the **Port** used to reach the cluster management endpoint. The appliance uses 443 by default. Change it only if your cluster publishes its management endpoint on a different port.
1. For **Map credentials**, select the NAS credential friendly name that you created.
1. Select **Save**. Repeat for every NAS cluster in scope.

After you add all NAS credentials and discovery sources, select **Start discovery** at the end of the Appliance Configuration Manager page to begin discovery for all configured sources, including your NAS servers.

> [!NOTE]
> If you change a password on a NAS cluster after discovery is running, update the credential in the appliance, and then select **Revalidate credentials** so that the next discovery cycle can connect.

## Next steps

- [Steps to add credentials in VMware appliance](./tutorial-discover-vmware.md#provide-server-credentials).
- [Steps to add credentials in Hyper-V appliance](tutorial-discover-hyper-v.md#provide-server-credentials).
- [Steps to add credentials in physical appliance](tutorial-discover-physical.md#start-discovery).
- [Assess file shares for migration to Azure Files](create-file-share-assessment.md).
