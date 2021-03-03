---
title: Provide server credentials to discover applications, dependencies and SQL Server instances and databases
description: Learn how to provide server credentials on appliance configuration manager
author: vikram1988 
ms.author: vibansa
ms.manager: abhemraj
ms.topic: how-to
ms.date: 01/26/2021
---

# Provide server credentials to discover applications, dependencies and SQL Server instances and databases

Follow this article to learn how to add multiple server credentials on the appliance configuration manager to perform software inventory(discover installed applications), agentless dependency analysis and discover SQL Server instances and databases.

> [!Note]
> Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. To try out this feature, use [**this link**](https://aka.ms/AzureMigrate/SQL) to create a project in **Australia East** region. If you already have a project in Australia East and want to try out this feature, please ensure that you have completed these [**prerequisites**](how-to-discover-sql-existing-project.md) on the portal.

The [Azure Migrate appliance](migrate-appliance.md) is a lightweight appliance used by Azure Migrate:Server Assessment to discover on-premises servers running in VMware environment and send server configuration and performance metadata to Azure. The appliance can also be used to perform software inventory, agentless dependency analysis and discover of SQL Server instances and databases.

If you want to leverage these features, you can provide server credentials by following the steps below. The appliance will attempt to automatically map the credentials to the servers to perform the discovery features.

## Add credentials for servers running in VMware environment

### Types of server credentials supported

You can add multiple server credentials on the appliance configuration manager which can be domain, non-domain (Windows or Linux) or SQL Server authentication credentials.

The types of server credentials supported are listed in the table below:

Type of credentials | Description
--- | ---
**Domain credentials** | You can add **Domain credentials** by selecting the option from the drop-down in the **Add credentials** modal. <br/><br/> To provide domain credentials, you need to specify the **Domain name** which must be provided in the FQDN format (e.g. prod.corp.contoso.com). <br/><br/> You also need to specify a friendly name for credentials, username and password. <br/><br/> The domain credentials added will be automatically validated for authenticity against the Active Directory of the domain. This is to prevent any account lockouts when the appliance attempts to map the domain credentials against discovered servers. <br/><br/> The appliance will not attempt to map the domain credentials that have failed validation. You need to have at least one successfully validated domain credential or at least one non-domain credential to proceed with software inventory.<br/><br/>The domain credentials mapped automatically against the Windows servers will be used to perform software inventory and can also be used to discover SQL Server instances and databases _(if you have configured Windows authentication mode on your SQL Servers)_.<br/> [Learn more](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/authentication-in-sql-server) about the types of authentication modes supported on SQL Servers.
**Non-domain credentials (Windows/Linux)** | You can add **Windows (Non-domain)** or **Linux (Non-domain)** by selecting the required option from the drop-down in the **Add credentials** modal. <br/><br/> You need to specify a friendly name for credentials, username and password.
**SQL Server Authentication credentials** | You can add **SQL Server Authentication** credentials by selecting the option from the drop-down in the **Add credentials** modal. <br/><br/> You need to specify a friendly name for credentials, username and password. <br/><br/> You can add this type of credentials to discover SQL Server instances and databases running in your VMware environment, if you have configured SQL Server authentication mode on your SQL Servers.<br/> [Learn more](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/authentication-in-sql-server) about the types of authentication modes supported on SQL Servers.<br/><br/> You need to provide at least one successfully validated domain credential or at least one Windows (Non-domain) credential so that the appliance can complete the software inventory to discover SQL installed on the servers before it uses the SQL Server authentication credentials to discover the SQL Server instances and databases.

Check the permissions required on the Windows/Linux credentials to perform the software inventory, agentless dependency analysis and discover SQL Server instances and databases.

### Required permissions

The table below lists the permissions required on the server credentials provided on the appliance to perform the respective features:

Feature | Windows credentials | Linux credentials
---| ---| ---
**Software inventory** | Guest user account | Regular/normal user account (non-sudo access permissions)
**Discovery of SQL Server instances and databases** | User account that is member of the sysadmin server role. | _Not supported currently_
**Agentless dependency analysis** | Domain or non-domain (local) account with administrative permissions | Root user account, or <br/> an account with these permissions on /bin/netstat and /bin/ls files: CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE.<br/><br/> Set these capabilities using the following commands: <br/><br/> sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/ls<br/><br/> sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/netstat

### Recommended practices to provide credentials

- It is recommended to create a dedicated domain user account with the [required permissions](add-server-credentials.md#required-permissions), which is scoped to perform software inventory, agentless dependency analysis and discovery of SQL Server instances and databases on the desired servers.
- It is recommended to provide at least one successfully validated domain credential or at least one non-domain credential to initiate software inventory.
- To discover SQL Server instances and databases, you can provide domain credentials, if you have configured Windows authentication mode on your SQL Servers.
-  You can also provide SQL Server authentication credentials if you have configured SQL Server authentication mode on your SQL Servers but it is recommended to provide at least one successfully validated domain credential or at least one Windows (Non-domain) credential so that the appliance can first complete the software inventory.

## Credentials handling on appliance

- All the credentials provided on the appliance configuration manager are stored locally on the appliance server and not sent to Azure.
- The credentials stored on the appliance server are encrypted using Data Protection API (DPAPI).
- After you have added credentials, appliance attempts to automatically map the credentials to perform discovery on the respective servers.
- The appliance uses the credentials automatically mapped on a server for all the subsequent discovery cycles till the credentials are able to fetch the required discovery data. If the credentials stop working, appliance again attempts to map from the list of added credentials and continue the ongoing discovery on the server.
- The domain credentials added will be automatically validated for authenticity against the Active Directory of the domain. This is to prevent any account lockouts when the appliance attempts to map the domain credentials against discovered servers. The appliance will not attempt to map the domain credentials that have failed validation.
- If the appliance cannot map any domain or non-domain credentials against a server, you will see "Credentials not available" status against the server in your project.

## Next steps

Review the tutorials for [discovery of servers running in your VMware environment](tutorial-discover-vmware.md)