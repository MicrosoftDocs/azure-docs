---
title: Provide server credentials to discover software inventory, dependencies, web apps, and SQL Server instances and databases
description: Learn how to provide server credentials on appliance configuration manager
author: vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 04/13/2023
ms.custom: engagement-fy23
---

# Provide server credentials to discover software inventory, dependencies, web apps, and SQL Server instances and databases

Follow this article to learn how to add multiple server credentials on the appliance configuration manager to perform software inventory (discover installed applications), agentless dependency analysis, and discover web apps, SQL Server instances and databases.

The [Azure Migrate appliance](migrate-appliance.md) is a lightweight appliance used by Azure Migrate: Discovery and assessment to discover on-premises servers and send server configuration and performance metadata to Azure. The appliance can also be used to perform software inventory, agentless dependency analysis and discover of web app, and SQL Server instances and databases.

> [!Note]
> Currently, the discovery of ASP.NET web apps is only available in the appliance used for discovery and assessment of servers running in a VMware environment.

If you want to use these features, you can provide server credentials by following the steps below. For servers running on vCenter Server(s) and Hyper-V host(s)/cluster(s), the appliance will attempt to automatically map the credentials to the servers to perform the discovery features.

## Add server credentials

### Types of server credentials supported

You can add multiple server credentials on the appliance configuration manager, which can be domain, non-domain (Windows or Linux) or SQL Server authentication credentials.

The types of server credentials supported are listed in the table below:

Type of credentials | Description
--- | ---
**Domain credentials** | You can add **Domain credentials** by selecting the option from the drop-down in the **Add credentials** modal. <br/><br/> To provide domain credentials, you need to specify the **Domain name** which must be provided in the FQDN format (for example, prod.corp.contoso.com). <br/><br/> You also need to specify a friendly name for credentials, username, and password. It's recommended to provide the credentials in the UPN format, for example, user1@contoso.com. <br/><br/> The domain credentials added will be automatically validated for authenticity against the Active Directory of the domain. This is to prevent any account lockouts when the appliance attempts to map the domain credentials against discovered servers. <br/><br/> To validate the domain credentials with the domain controller, the appliance should be able to resolve the domain name. Ensure that you've provided the correct domain name while adding the credentials else the validation will fail.<br/><br/> The appliance won't attempt to map the domain credentials that have failed validation. You need to have at least one successfully validated domain credential or at least one non-domain credential to start the discovery.<br/><br/>The domain credentials mapped automatically against the Windows servers will be used to perform software inventory and can also be used to discover web apps, and SQL Server instances and databases _(if you've configured Windows authentication mode on your SQL Servers)_.<br/> [Learn more](/dotnet/framework/data/adonet/sql/authentication-in-sql-server) about the types of authentication modes supported on SQL Servers.
**Non-domain credentials (Windows/Linux)** | You can add **Windows (Non-domain)** or **Linux (Non-domain)** by selecting the required option from the drop-down in the **Add credentials** modal. <br/><br/> You need to specify a friendly name for credentials, username, and password.
**SQL Server Authentication credentials** | You can add **SQL Server Authentication** credentials by selecting the option from the drop-down in the **Add credentials** modal. <br/><br/> You need to specify a friendly name for credentials, username, and password. <br/><br/> You can add this type of credentials to discover SQL Server instances and databases running in your VMware environment, if you've configured SQL Server authentication mode on your SQL Servers.<br/> [Learn more](/dotnet/framework/data/adonet/sql/authentication-in-sql-server) about the types of authentication modes supported on SQL Servers.<br/><br/> You need to provide at least one successfully validated domain credential or at least one Windows (Non-domain) credential so that the appliance can complete the software inventory to discover SQL installed on the servers before it uses the SQL Server authentication credentials to discover the SQL Server instances and databases.

Check the permissions required on the Windows/Linux credentials to perform the software inventory, agentless dependency analysis and discover web apps, and SQL Server instances and databases.

### Required permissions

The table below lists the permissions required on the server credentials provided on the appliance to perform the respective features:

Feature | Windows credentials | Linux credentials
---| ---| ---
**Software inventory** | Guest user account | Regular/normal user account (non-sudo access permissions)
**Discovery of SQL Server instances and databases** | User account that is a member of the sysadmin server role or has [these permissions](migrate-support-matrix-vmware.md#configure-the-custom-login-for-sql-server-discovery) for each SQL Server instance.| _Not supported currently_
**Discovery of ASP.NET web apps** | Domain or non-domain (local) account with administrative permissions | _Not supported currently_
**Agentless dependency analysis** | Domain or non-domain (local) account with administrative permissions | Sudo user account with permissions to execute ls and netstat commands. If you are providing a sudo user account, ensure that you have enabled **NOPASSWD** for the account to run the required commands without prompting for a password every time the sudo command is invoked. <br /><br /> Alternatively, you can create a user account that has the CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE permissions on /bin/netstat and /bin/ls files, set using the following commands:<br /><code>sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/ls<br /> sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/netstat</code>

### Recommended practices to provide credentials

- It's recommended to create a dedicated domain user account with the [required permissions](add-server-credentials.md#required-permissions), which is scoped to perform software inventory, agentless dependency analysis and discovery of web app, and SQL Server instances and databases on the desired servers.
- It's recommended to provide at least one successfully validated domain credential or at least one non-domain credential to initiate software inventory.
- To discover SQL Server instances and databases, you can provide domain credentials, if you've configured Windows authentication mode on your SQL Servers.
- You can also provide SQL Server authentication credentials if you've configured SQL Server authentication mode on your SQL Servers but it's recommended to provide at least one successfully validated domain credential or at least one Windows (Non-domain) credential so that the appliance can first complete the software inventory.

## Credentials handling on appliance

- All the credentials provided on the appliance configuration manager are stored locally on the appliance server and not sent to Azure.
- The credentials stored on the appliance server are encrypted using Data Protection API (DPAPI).
- After you've added credentials, appliance attempts to automatically map the credentials to perform discovery on the respective servers.
- The appliance uses the credentials automatically mapped on a server for all the subsequent discovery cycles until the credentials are able to fetch the required discovery data. If the credentials stop working, appliance again attempts to map from the list of added credentials and continue the ongoing discovery on the server.
- The domain credentials added will be automatically validated for authenticity against the Active Directory of the domain. This is to prevent any account lockouts when the appliance attempts to map the domain credentials against discovered servers. The appliance won't attempt to map the domain credentials that have failed validation.
- If the appliance can't map any domain or non-domain credentials against a server, you'll see "Credentials not available" status against the server in your project.

## Next steps

Review the tutorials for discovery of servers running in your [VMware environment](tutorial-discover-vmware.md) or [Hyper-V environment](tutorial-discover-hyper-v.md) or for [discovery of physical servers](tutorial-discover-physical.md).